<style scoped lang="scss">
  .el_menu_horizontal {
    border: none;
    float: right;
  }

  .top_logo {
    width: 150px;
    float: left;
  }

  .top_logo img {
    width: 30%;
    height: auto;
    margin-top: 19px;
    float: left;
  }

  .top_logo span {
    font-size: 18px;
    font-weight: bolder;
    color: #284890;
    line-height: 60px;
  }

  .menu_icon {
    margin-top: 10px;
  }

  .menu_icon span i {
    font-size: 18px;
  }
</style>
<template>
  <div>
    <el-row>
      <el-col :span="5">
        <div class="top_logo">
          <img src="../assets/images/logo4.png" />
          <span>万鼎科技</span>
        </div>
        <slot></slot>
      </el-col>
      <el-col :span="12">
        <div class="navmenu_horizontal">
          <el-menu :default-active="activeIndex" class="el_menu_horizontal" mode="horizontal" @select="handleSelect" background-color="#fff">
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">交易中心</el-menu-item>
            <el-menu-item index="3">商户中心</el-menu-item>
            <el-menu-item index="4">产品中心</el-menu-item>
            <el-menu-item index="5">营销中心</el-menu-item>
            <el-menu-item index="6">帮助中心</el-menu-item>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="7" style="text-align: right;">
        <span style="line-height: 60px;">{{sysUserName}} ，欢迎登录商户平台 </span>
        <el-dropdown split-button size="mini" type="danger" @click="logout" trigger="click">
          退出登录
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleEdit">修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <!--修改密码-->
    <el-dialog :visible.sync="editFormVisible" :close-on-click-modal="false" width="400px">
      <el-alert title="提示：密码修改成功后需重新登录" type="warning" center show-icon :closable="false"></el-alert>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="旧密码" prop="usedPass">
          <el-input type="password" v-model="ruleForm.usedPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="editFormVisible=false">取消</el-button>
          <el-button type="primary" :loading="submitFormLogining" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import instance from "../api";
  import CryptoJS from "crypto-js";
  import {
    modifyPassword,
    batchRemoveUser
  } from '../api/shop';
  export default {
    data() {
        //  修改密码
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error('旧密码不能为空'));
        } else {
          callback()
        }
      };
      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!/^[a-zA-Z0-9]{6,18}$/.test(value)) {
          callback(new Error('请输入不含汉字和空格的6到18位密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        user: {},
        sysUserName: '',
        editFormVisible: false, //修改密码弹窗是否显示
        editLoading: false,
        submitFormLogining: false,
        //修改密码弹窗数据
        ruleForm: {
          pass: '',
          checkPass: '',
          usedPass: ''
        },
        rules: {
          usedPass: [{
              required: true,
              validator: validatePass,
              trigger: 'blur'
            },
            {
              min: 6,
              max: 18,
              message: '密码为6到18位数字或字母',
              trigger: 'blur'
            }
          ],
          pass: [{
              required: true,
              validator: validatePass1,
              trigger: 'blur'
            },
            {
              min: 6,
              max: 18,
              message: '密码为6到18位数字或字母',
              trigger: 'blur'
            }
          ],
          checkPass: [{
              required: true,
              validator: validatePass2,
              trigger: 'blur'
            },
            {
              min: 6,
              max: 18,
              message: '密码为6到18位数字或字母',
              trigger: 'blur'
            }
          ]
        }
      };
    },
    computed: {
      activeIndex() {
        return this.$store.state.perMission.activeIndex
      }
    },
    methods: {
      //修改密码弹框是否弹出
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //修改密码提交按钮
      submitForm() {
        let maccount = JSON.parse(sessionStorage.getItem('name'));
        if (!maccount) {
          return this.$message('找不到帐号，请重新登录或联系技术人员');
        }
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let para = {
              oldPwd: CryptoJS.MD5(this.ruleForm.usedPass + maccount).toString(CryptoJS.enc.Hex),
              mpwd: CryptoJS.MD5(this.ruleForm.pass + maccount).toString(CryptoJS.enc.Hex),
              mpwd2: CryptoJS.MD5(this.ruleForm.checkPass + maccount).toString(CryptoJS.enc.Hex),
            }
            this.submitFormLogining = true;
            modifyPassword(para).then(res => {
              this.submitFormLogining = false;
              let {
                status,
                message
              } = res;
              if (status === 200) {
                this.$message({
                  message: message,
                  type: 'success'
                });
                //清除菜单权限
                this.$root.hashMenus = {};
                //回到登录页
                this.$router.replace({
                  path: '/login'
                });
                //清除动态标签
                this.$store.dispatch('delAllViews')
              }
            });
          }
        });
      },
      //退出登录
      logout: function () {
        this.$confirm("确定退出?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(() => {
          //清除动态标签
          this.$store.dispatch('delAllViews')
          this.$emit("logout");
        }).catch(() => {
          this.$message('取消退出');
        });
      },
      //切换顶部导航
      handleSelect(change) {
        if (this.activeIndex===change) {
          return
        }
        //清空当前路由
        this.$store.dispatch('del_menu')

        sessionStorage.setItem('activeIndex', JSON.stringify(change));
        //切换头部导航
        this.$store.dispatch('top_nav', change)
        //清除动态标签
        this.$store.dispatch('delAllViews')

        switch (parseInt(change)) {
          case 1 : this.$router.push({ path: "/home" });
            break;
          case 2 : this.$emit('login', {path: '/index1/table', menu: '1'});
            break;
          case 3 : this.$emit('login', {path: '/index2/page1', menu: '2'});
            break;
          case 4 : this.$emit('login', {path: '/index3/tab4', menu: '3'});
            break;
          default: this.$router.push({ path: "/notonline" });
            break;
        }
      },
    },
    mounted() {
      let activeIndex = JSON.parse(sessionStorage.getItem('activeIndex'));
      if (activeIndex) {
        //切换头部导航
        this.$store.dispatch('top_nav', activeIndex)
      }
      //用户名
      let user = sessionStorage.getItem('user');
      if (user) {
        user = JSON.parse(user);
        this.sysUserName = user || '';
      }
    }
  };

</script>
