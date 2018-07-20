<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="whole">
        <el-tag type="primary" style="margin:10px 10px 20px 0;">交易总金额（元）：{{whole.sumAmt}}元</el-tag>
        <el-tag type="primary" style="margin:10px 10px 20px 0;">交易总笔数（笔）：{{whole.countRow}}笔</el-tag>
        <el-tag type="primary" style="margin:10px 10px 20px 0;">会员卡消费总金额（元）：{{whole.memAmt}}元</el-tag>
        <el-tag type="primary" style="">会员卡消费总笔数（笔）：{{whole.memCount}}笔</el-tag>
      </el-form>
    </el-row>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-row>
        <el-form-item prop="startTime">
          <el-date-picker v-model="filters.startTime" type="datetime" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false"
            :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker v-model="filters.endTime" type="datetime" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false"
            :editable='false'>
          </el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="parag">
          <el-select v-model="filters.parag" placeholder="门店名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="loading"
            clearable @visible-change="clickShop">
            <el-option v-for="item in optionsStore" :key="item.id" :value="item.id" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="play">
          <el-select v-model="filters.play" clearable placeholder="支付方式">
            <el-option v-for="item in optionsScene" :label="item.labelScene" :value="item.valueScene" :key="item.valueScene">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="state">
          <el-select v-model="filters.state" clearable placeholder="支付状态">
            <el-option v-for="item in optionsState" :label="item.labelState" :value="item.valueState" :key="item.valueState">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" v-on:click="getUsers" size="medium" round>查询</el-button>
          <el-button @click="resetForm('filters')" size="medium" round>重置</el-button>
          <!-- <el-button type="text" @click="advancedOptions = !advancedOptions">{{advancedOptions ? '隐藏' : '显示'}}高级选项</el-button> -->
        </el-form-item>
      </el-row>
      <el-row>
        <el-alert title="可查询最近30天的交易" type="warning" center close-text="知道了" show-icon>
        </el-alert>
      </el-row>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row>
        <el-table-column prop="payTime" label="付款时间" min-width="165">
        </el-table-column>
        <el-table-column prop="orderId" label="订单号" min-width="285">
        </el-table-column>
        <el-table-column prop="goodsPrice" label="交易金额" width="120" :formatter="format_amount">
        </el-table-column>
        <el-table-column prop="payWay" label="支付方式" width="120" :formatter="format_payWay">
        </el-table-column>
        <el-table-column prop="status" label="交易状态" width="150" :formatter="formatPay2">
        </el-table-column>
        <el-table-column prop="storeName" label="收款门店" width="120">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleDetail(scope.$index, scope.row)">订单详情</el-button>
           <el-button type="danger" size="mini" @click="handleRefund(scope.$index, scope.row)">退款</el-button>
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

    <!--详情界面-->
    <el-dialog title="交易详情" :visible.sync="editFormVisible" :close-on-click-modal="false" width="600px">
      <el-form :model="editForm" label-width="140px" ref="editForm" label-position="left" class="table-expand">
        <el-form-item label="订单号：">
          <span>{{editForm.orderId}}</span>
        </el-form-item>
        <el-form-item label="第三方订单号：">
          <span>{{editForm.transactionId}}</span>
        </el-form-item>
        <el-form-item label="交易金额（元）：">
          <span>{{editForm.goodsPrice}}</span>
        </el-form-item>
        <el-form-item label="付款时间：">
          <span>{{format_payTime(editForm.payTime)}}</span>
        </el-form-item>
        <el-form-item label="交易状态：">
          <span>{{editForm.status === '1' ? '已支付' : editForm.status === '3' ? '已支付（有退款）' : '未知'}}</span>
        </el-form-item>
        <el-form-item label="退款金额（元）：">
          <span>{{editForm.refundAmount}}</span>
        </el-form-item>
        <el-form-item label="收款门店：">
          <span>{{editForm.storeName}}</span>
        </el-form-item>
        <el-form-item label="款台：">
          <span>{{editForm.username}}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>{{formatPay1(editForm.payWay)}}</span>
        </el-form-item>
        <el-form-item label="备注：">
          <span>{{editForm.goodsDesc}}</span>
        </el-form-item>
        <el-button type="primary" @click="Print" style="margin-left:45%;">补发打印</el-button>
      </el-form>
    </el-dialog>
    <!--退款界面-->
    <el-dialog title="退款" :visible.sync="refundFormVisible" :close-on-click-modal="false" width="600px">
      <el-form :model="refundForm" :rules="refundFormRules" ref="refundForm" label-position="left" label-width="120px">
        <el-form-item label="订单号：">
          <span>{{refundForm.orderId}}</span>
        </el-form-item>
        <el-form-item label="第三方订单号：">
          <span>{{refundForm.transactionId}}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="refundForm.code" style="width:220px"></el-input>
          <el-button plain @click="getCode" :disabled="disabledCode">{{auth_time}}{{codeText}}</el-button>
        </el-form-item>
        <el-form-item label="退款金额" prop="amount">
          <el-input v-model="refundForm.amount" auto-complete="off" placeholder="请输入退款金额"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="refundForm.desc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="refundFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="refundSubmit" :loading="refundLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'
  import * as rules from '../../../util/rules.js'
  import * as data from '../../../util/data.js'

  import {
    getUserListPage,
    lookupUser,
    downOrderExcel,
    merRefund,
    supplyPrint,
    selectStoreList,
    checkdownOrderExcelNew,
    queryOrderDetail,
    sendVerCodeT
  } from '../../../api/shop';

  export default {
    data() {
      var myDate = new Date();
      return {
        //支付方式
        optionsScene: data.optionsPayment,
        //支付状态
        optionsState: [{
          valueState: '1',
          labelState: '已支付'
        }, {
          valueState: '3',
          labelState: '已支付（有退款）'
        }, {
          valueState: '5',
          labelState: '未知'
        }],
        //选择款台
        optionsStore: [],
        //时间控制
        pickerOptions1: {
          disabledDate(time) {
            let date = new Date();
            return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 35;
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.filters.startTime),
              'yyyy-MM-dd hh:mm:ss')));
            if (time.getTime() < startTimeOne || time.getTime() > Date.now()) {
              return true;
            }
          }
        },
        loading: false,
        //商户名
        filters: {
          startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()),
          endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 23, 59, 59),
          play: '',
          state: '',
          parag: ''
        },
        whole: {
          sumAmt: "",
          countRow: ""
        },
        total: 0,
        page: 1,
        users: [],
        listLoading: false,
        advancedOptions: false,

        editFormVisible: false, //编辑界面是否显示
        editLoading: false,
        //编辑界面数据
        editForm: {},
        refundFormVisible: false, //退款界面是否显示
        refundLoading: false,
        refundForm: {

        },
        refundFormRules: {
          code: [{
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }],
          amount: [{
              required: true,
              validator: rules.validatorAmount,
              trigger: 'blur'
            },
            {
              max: 10,
              message: '请输入正确的退款金额',
              trigger: 'blur'
            }
          ]
        },
        codeText: '获取验证码',
        auth_time: null,
        disabledCode: false
      }
    },
    methods: {
      formatPay2: function (row, column) {
        return row.status == 1 ? '已支付' : row.status == 3 ? '已支付（有退款）' : '未知';
      },
      formatPay1: function (row) {
        return util.formatPayment(row)
      },
      format_payWay(row, column) {
        return util.formatPayment(row.payWay)
      },
      format_payTime(props) {
        return util.formatDate.format(new Date(props), 'yyyy-MM-dd hh:mm:ss')
      },
      //格式化金额
      format_amount(row, column) {
        return util.number_format(row.goodsPrice, 2, ".", ",")
      },
      getCode() {
        let para = {
          orderId: this.refundForm.orderId
        }
        sendVerCodeT(para).then((res) => {
          if (res.status === 200) {
            this.disabledCode = true
            this.codeText = 's后重新获取'
            this.auth_time = 60
            let auth_timetimer = setInterval(() => {
              this.auth_time--
                if (this.auth_time <= 0) {
                  this.codeText = '获取验证码'
                  this.auth_time = null
                  this.disabledCode = false
                  clearInterval(auth_timetimer)
                }
            }, 1000)
          }
        })
      },
      //门店远程搜索
      clickShop: function () {
        selectStoreList().then((res) => {
          let {
            status,
            data
          } = res
          this.optionsStore = data.storeList
        })
      },
      remoteShop(query) {
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
              this.optionsStore = data.storeList
            })
          }, 200);
        } else {
          this.optionsStore = [];
        }
      },
      //补发打印
      Print() {
        supplyPrint({
          orderId: this.editForm.orderId
        }).then((res) => {
          let {
            status,
            message
          } = res;
          if (status === 200) {
            this.$message({
              message: message,
              type: 'success'
            });
          }
        })
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList()
      },
      //获取用户列表
      getList() {
        this.listLoading = true;
        let para = {
          pageNum: this.page,
          payWay: this.filters.play,
          status: this.filters.state,
          storeId: String(this.filters.parag),
          startTime: this.filters.startTime,
          endTime: this.filters.endTime
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(
          para.startTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(
          para.endTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
        getUserListPage(para).then((res) => {
          var _this = this;
          let {
            data,
            message,
            status
          } = res;
          if (status == 200) {
            this.total = res.data.totalCount;
            this.whole.countRow = res.data.countRow;
            this.whole.sumAmt = res.data.sumAmt;
            this.whole.memAmt = res.data.memAmt;
            this.whole.memCount = res.data.memCount;
            this.users = res.data.summaryCopyList;
          }
          this.listLoading = false;
        })
      },
      getUsers() {
        this.page = 1
        this.getList()
      },
      //显示退款
      handleRefund: function (index, row) {
        this.refundFormVisible = true
        queryOrderDetail({
          id: row.id
        }).then(res => {
          this.refundForm  = res.data.order
        })
      },
      //确定退款
      refundSubmit() {
        this.$refs.refundForm.validate((valid) => {
          if (valid) {
            this.$confirm('是否确定退款？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let para = {
                authCode: this.refundForm.orderId,
                amount: this.refundForm.amount,
                desc: this.refundForm.desc,
                verCode: this.refundForm.code
              }
              merRefund(para).then((res) => {
                let {
                  status,
                  message
                } = res;
                if (status === 200) {
                  this.getUsers();
                  this.$message({
                    type: 'success',
                    message: message
                  });
                }
              })
              this.refundFormVisible = false;
            }).catch(() => {
              this.refundFormVisible = false;
              this.$message({
                type: 'info',
                message: '已取消退款'
              });
            });
          }
        });
      },
      //显示编辑界面
      handleDetail(index, row) {
        this.editFormVisible = true;
        queryOrderDetail({
          id: row.id
        }).then(res => {
          if (res.status === 200) {
            this.editForm = res.data.order
          }
        })
      },
      //查询重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    mounted() {
      this.getUsers();
      lookupUser().then((res) => {
        var _this = this;
        let {
          status,
          message
        } = res;
        if (status == 200) {
          this.optionsStore = res.data.storeList;
        }
      });
    }
  }

</script>
