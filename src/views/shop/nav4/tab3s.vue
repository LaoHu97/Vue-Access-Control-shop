<template>
<el-form ref="form" :model="form" :rules="rules" label-width="120px" style="width:400px;margin-left:25%;">
  <h3>创建公司账户</h3>
  <p style="text-align:right;color:#ff4949">带 * 为必填项</p>
  <el-form-item label="公司名称" prop="name">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="公司地址" prop="address">
    <el-input v-model="form.address"></el-input>
  </el-form-item>
  <el-form-item label="负责人名称" prop="person">
    <el-input v-model="form.person"></el-input>
  </el-form-item>
  <el-form-item label="负责人电话" prop="phone">
    <el-input v-model.number="form.phone"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
    <el-button @click="returnClick">返回</el-button>
  </el-form-item>
</el-form>
</template>
<script>
  import {
    insertCompany
  } from '../../../api/shop';
  export default {
    data() {
      var validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入负责人电话'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入正确的电话号码'));
          } else {
            if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))) {
              callback(new Error('请输入正确的电话号码'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      return {
        form: {
          name: '',
          address:'',
          person:'',
          phone:''
        },
        rules:{
           name: [
             { required: true, message: '请输入公司名称', trigger: 'blur' },
             { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
           ],
           address: [
             { required: true, message: '请输入公司地址', trigger: 'blur' },
             { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
           ],
           person: [
             { required: true, message: '请输入负责人名称', trigger: 'blur' },
             { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
           ],
           phone: [
             { required: true, validator: validatePhone, trigger: 'blur' }
           ],
         }
      }
    },
    methods: {
      returnClick(){
        this.$router.push({path: '/index3/tab3'})
      },
      onSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              let para={
                name:this.form.name,
                address:this.form.address,
                person:this.form.person,
                phone:String(this.form.phone)
              }
              insertCompany(para).then((res)=>{
                let _this=this;
                let {status,message}=res;
                if (status==200) {
                  this.$notify({
                    title: '成功',
                    message: message,
                    type: 'success'
                  });
                  _this.$router.push({path: '/index3/tab3'})
                }
              })
            });
          }
        });
      }
    }
  }
</script>
