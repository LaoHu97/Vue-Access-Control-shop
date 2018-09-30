<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true">
        <el-form-item style="float:right">
          <el-button type="primary" @click="handleAdd" round>新增会员卡</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="id" label="编号">
        </el-table-column>
        <el-table-column prop="title" label="会员卡名称" min-width="120">
        </el-table-column>
        <el-table-column prop="wxcard_id" label="会员卡ID" min-width="280">
        </el-table-column>
        <el-table-column prop="date_info" label="会员卡有效期" :formatter="date_info" min-width="120">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" :formatter="status">
        </el-table-column>
        <el-table-column label="剩余库存" min-width="250">
          <template slot-scope="scope">
            <el-tag type="gray" style="width:80px;text-align: center;">{{scope.row.quantity}}</el-tag>
            <el-input style="width:80px;" v-model="scope.row.addQuantity" :maxlength="6"></el-input>
            <el-button plain type="success" @click="stockClick(scope.$index, scope.row)">增加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <el-button size="mini" type="warning">
                更多菜单
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="vipDataClick(scope.$index, scope.row)">会员日</el-dropdown-item>
                <el-dropdown-item @click.native="modifyClick(scope.$index, scope.row)">修改</el-dropdown-item>
                <el-dropdown-item @click.native="rechargeClick(scope.$index, scope.row)">充值设置</el-dropdown-item>
                <el-dropdown-item @click.native="deliveryCode(scope.$index, scope.row)">投放二维码</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status!=2" @click.native="uploadWinxin(scope.$index, scope.row)">上传微信</el-dropdown-item>
                <el-dropdown-item v-else :disabled="true">已上传</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total"
        background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>

    <el-dialog title="投放设置" :visible.sync="codeFormVisible" :close-on-click-modal="false" @close="closeDialog" width="600px">
      <el-form :model="codeForm" label-width="80px" :rules="codeFormRules" ref="codeForm">
        <el-form-item label="选择门店" prop="store">
          <el-select v-model="codeForm.store" placeholder="请选择门店名称" :multiple="false" filterable remote clearable :remote-method="remoteStore"
            :loading="loading" @visible-change="clickStore">
            <el-option v-for="item in optionsCode" :key="item.id" :value="item.id" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择等级" prop="parag">
          <el-select v-model="codeForm.level" placeholder="请选择等级" clearable>
            <el-option v-for="item in levelOptions" :key="item.id" :label="item.level_name" :value="item.level">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="codeSubmit" :loading="codeLoading">生成二维码</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="editVipCode" label-width="" ref="editVipCode" style="width:auto" v-if="codeMode">
        <el-form-item style="text-align: center;margin-bottom:0">
          <img :src="editVipCode.vipCode" alt="二维码" width="260px">
        </el-form-item>
        <el-form-item style="text-align: center;margin-bottom:0">
          <el-button type="success" @click="clickCode">点击下载</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="绑定会员" :visible.sync="dialogvipDataVisible" width="600px">
      <el-form :model="vipDataForm" ref="vipDataForm" :rules="vipDataFormRules">
        <el-form-item label="折扣率（“1”到“10”）" prop="discount">
          <el-input v-model="vipDataForm.discount"></el-input>
        </el-form-item>
        <el-form-item label="设置会员日" style="width:500px;">
          <template>
            <el-radio class="radio" v-model="vipDataForm.unit_memberday" label="1">月单位</el-radio>
            <el-radio class="radio" v-model="vipDataForm.unit_memberday" label="2">周单位</el-radio>
          </template>
          <template v-if="this.vipDataForm.unit_memberday==2">
            <el-select v-model="vipDataForm.week_memberday" multiple placeholder="请选择周会员日">
              <el-option v-for="item in week_memberdayOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template v-if="this.vipDataForm.unit_memberday==1">
            <el-select v-model="vipDataForm.month_memberday" multiple placeholder="请选择月会员日">
              <el-option v-for="item in month_memberdayOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogvipDataVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitvipData('vipDataForm')">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'
  //
  import {
    queryMemCardList,
    uploadCreatCard,
    modifyStock,
    addMemDay,
    queryMemDay,
    selectStoreList,
		qRCode,
		queryLevel
  } from '../../../api/shop';
  export default {
    data() {
      var validate_service_discount = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入折扣率'));
        } else if (!(/^[1-9](\.\d+)?$/.test(value))) {
          return callback(new Error('请输入正确的折扣率'));
        } else {
          callback();
        }
      };
      return {
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        dialogvipDataVisible: false,
        vipDataForm: {
          id: '',
          discount: '',
          unit_memberday: '',
          week_memberday: [],
          month_memberday: [],
        },
        week_memberdayOptions: [{
          value: '2',
          label: '周一'
        }, {
          value: '3',
          label: '周二'
        }, {
          value: '4',
          label: '周三'
        }, {
          value: '5',
          label: '周四'
        }, {
          value: '6',
          label: '周五'
        }, {
          value: '7',
          label: '周六'
        }, {
          value: '1',
          label: '周日'
        }],
        month_memberdayOptions: [{
          value: '1',
          label: '一号'
        }, {
          value: '2',
          label: '二号'
        }, {
          value: '3',
          label: '三号'
        }, {
          value: '4',
          label: '四号'
        }, {
          value: '5',
          label: '五号'
        }, {
          value: '6',
          label: '六号'
        }, {
          value: '7',
          label: '七号'
        }, {
          value: '8',
          label: '八号'
        }, {
          value: '9',
          label: '九号'
        }, {
          value: '10',
          label: '十号'
        }, {
          value: '11',
          label: '十一号'
        }, {
          value: '12',
          label: '十二号'
        }, {
          value: '13',
          label: '十三号'
        }, {
          value: '14',
          label: '十四号'
        }, {
          value: '15',
          label: '十五号'
        }, {
          value: '16',
          label: '十六号'
        }, {
          value: '17',
          label: '十七号'
        }, {
          value: '18',
          label: '十八号'
        }, {
          value: '19',
          label: '十九号'
        }, {
          value: '20',
          label: '二十号'
        }, {
          value: '21',
          label: '二十一号'
        }, {
          value: '22',
          label: '二十二号'
        }, {
          value: '23',
          label: '二十三号'
        }, {
          value: '24',
          label: '二十四号'
        }, {
          value: '25',
          label: '二十五号'
        }, {
          value: '26',
          label: '二十六号'
        }, {
          value: '27',
          label: '二十七号'
        }, {
          value: '28',
          label: '二十八号'
        }, {
          value: '29',
          label: '二十九号'
        }, {
          value: '30',
          label: '三十号'
        }],
        vipDataFormRules: {
          discount: [{
            required: true,
            validator: validate_service_discount,
            trigger: 'blur'
          }],
        },
				optionsCode: [],
				levelOptions:[],
        codeFormVisible: false,
        editFormVipCode: false,
        codeLoading: false,
        codeMode: false,
        codeFormRules: {

        },
        loading: false,
        codeForm: {
          wxcard_id: '',
          store: '',
          level: ''
        },
        editVipCode: {
          vipCode: ''
        },
      }
    },
    methods: {
      clickCode: function () {
        window.location.href = this.editVipCode.vipCode
      },
      codeSubmit() {
        this.codeLoading = true;
        let para = {
          cardid: this.codeForm.wxcard_id,
					storeId: this.codeForm.store,
					level:this.codeForm.level
        }
        this.codeLoading = false;
				this.editVipCode.vipCode = `${qRCode}?sid=${para.storeId}&level=${para.level}`;
        this.codeMode = true;
      },
      //门店远程搜索
      clickStore: function () {
        selectStoreList().then((res) => {
          let {
            status,
            data
          } = res
          this.optionsCode = data.storeList
        })
      },
      remoteStore(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            selectStoreList({
              sname: query
            }).then((res) => {
              let {
                status,
                data
              } = res
              this.optionsCode = data.storeList
            })
          }, 200);
        } else {
          this.options = [];
        }
      },
      closeDialog() {
        this.codeMode = false;
				this.codeForm.store = '';
				this.codeForm.level = ''
      },
      deliveryCode(index, row) {
        this.codeFormVisible = true;
				this.codeForm.wxcard_id = row.wxcard_id;
				queryLevel().then(res=>{
					if (res.status === 200) {
						this.levelOptions = res.data.levelList
					}
				})
      },
      vipDataClick(index, row) {
        this.dialogvipDataVisible = true;
        this.vipDataForm.id = row.id;
        queryMemDay({
          id: String(row.id)
        }).then((res) => {
          let {
            status,
            message
          } = res;
          if (status == 200) {
            let discount = String(res.data.discount);
            this.vipDataForm.discount = discount == 'undefined' ? this.vipDataForm.discount = '' : this.vipDataForm
              .discount = discount;
            this.vipDataForm.unit_memberday = res.data.unit == 'DAY_OF_WEEK' ? this.vipDataForm.unit_memberday =
              '2' : res.data.unit == 'DAY_OF_MONTH' ? this.vipDataForm.unit_memberday = '1' : this.vipDataForm.unit_memberday =
              '2';
            if (this.vipDataForm.unit_memberday == "2") {
              this.vipDataForm.week_memberday = res.data.dayList;
            } else {
              this.vipDataForm.month_memberday = res.data.dayList;
            }
          } else {
            this.$message({
              message: message,
              type: 'warning'
            });
          }
        })
      },
      submitvipData() {
        let dayList = '';
        if (this.vipDataForm.unit_memberday == "2") {
          dayList = this.vipDataForm.week_memberday;
        } else {
          dayList = this.vipDataForm.month_memberday;
        }
        let para = {
          id: String(this.vipDataForm.id),
          unit: this.vipDataForm.unit_memberday,
          dayList: dayList,
          discount: this.vipDataForm.discount
        }
        para.unit = this.vipDataForm.unit_memberday == 2 ? para.unit = 'DAY_OF_WEEK' : para.unit = 'DAY_OF_MONTH';
        addMemDay(para).then((res) => {
          let {
            status,
            message
          } = res;
          if (status == 200) {
            this.$message({
              message: message,
              type: 'success'
            });
            this.dialogvipDataVisible = false;
            this.getUsers();
          } else {
            this.$message({
              message: message,
              type: 'warning'
            });
          }
        })
      },
      //会员卡修改
      modifyClick(index, row) {
        var id = row.id;
        sessionStorage.setItem('id', JSON.stringify(id));
        this.$router.push({
          path: '/index3/tab1-modify',
        });
      },
      //充值设置
      rechargeClick(index, row) {
        var wxcard_id = row.wxcard_id;
        sessionStorage.setItem('wxcard_id', JSON.stringify(wxcard_id));
        this.$router.push({
          path: '/index3/tab11',
        });
      },
      //修改库存
      stockClick(index, row) {
        console.log(row.addQuantity);
        var reg = /^\+?[1-9][0-9]*$/;
        if (reg.test(row.addQuantity)) {
          let para = {
            id: String(row.id),
            addQuantity: row.addQuantity
          }
          modifyStock(para).then((res) => {
            let {
              status,
              message
            } = res;
            if (status == 200) {
              this.$message({
                message: message,
                type: 'success'
              });
              window.location.reload();
            } else {
              this.$message({
                message: message,
                type: 'warning'
              });
            }
          })
        } else {
          this.$message.error('请输入正确库存数量');
        }
      },
      //会员卡有效期
      date_info: function (row, column) {
        if (row.date_info == 'DATE_TYPE_PERMANENT') {
          return '永久有效';
        } else {
          return row.date_info = util.formatDate.format(new Date(row.begin_time)) + '至' + util.formatDate.format(new Date(
            row.end_time))
        }
      },
      //状态
      status: function (row, column) {
        return row.status == 2 ? '上传成功' : row.status == 1 ? '未上传' : row.status == 3 ? '上传失败' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList()
      },
      getUsers() {
        this.page = 1
        this.getList()
      },
      //查询会员卡列表
      getList() {
        this.listLoading = true;
        let para = {
          pagNum: this.page
        };
        queryMemCardList(para).then((res) => {
          this.total = res.data.total;
          this.users = res.data.memCardList;
          this.listLoading = false;
        });
      },
      //新增
      handleAdd: function () {
        var _this = this;
        _this.$router.push('/index3/tab1s');
      },
      //上传微信
      uploadWinxin: function (index, row) {
        let para = {
          id: row.id
        }
        uploadCreatCard(para).then((res) => {
          let {
            status,
            message
          } = res;
          if (status == 200) {
            this.$notify({
              title: '成功',
              message: message,
              type: 'success'
            });
            this.getUsers()
          } else {
            this.$notify.error({
              title: '错误',
              message: message
            });
          }
        })
      }
    },
    mounted() {
      this.getUsers()
    }
  }

</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>
