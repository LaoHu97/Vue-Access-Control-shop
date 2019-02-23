<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="whole">
        <el-tag type="primary" style="margin:10px 10px 20px 0;">交易总金额（元）：{{whole.sumAmt}}</el-tag>
        <el-tag type="primary" style="margin:10px 10px 20px 0;">交易总笔数（笔）：{{whole.countRow}}</el-tag>
      </el-form>
    </el-row>
    <el-form :inline="true" :model="filters" ref="filters" label-position="left" label-width="100px">
      <el-row>
        <el-col :span="6">
          <el-form-item prop="storeName" label="门店名称">
            <el-select v-model="filters.storeName" class="fixed_search_input" placeholder="门店名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="searchLoading" clearable @focus="clickShop" @change="selectStoreChange">
              <el-option v-for="item in optionsStore" :key="item.id" :value="item.id" :label="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="empName" label="款台名称">
            <el-select v-model="filters.empName" class="fixed_search_input" placeholder="款台名称" :multiple="false" filterable remote :remote-method="remoteEmp" :loading="empSearchLoading" clearable @focus="clickEmp">
              <el-option v-for="item in optionsEmp" :key="item.eid" :value="item.eid" :label="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="play" label="支付方式">
            <el-select v-model="filters.play" class="fixed_search_seach" clearable placeholder="支付方式">
              <el-option v-for="item in optionsScene" :label="item.label" :value="item.value" :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="state" label="支付状态">
            <el-select v-model="filters.state" class="fixed_search_input" clearable placeholder="支付状态">
              <el-option v-for="item in optionsPayState" :label="item.label" :value="item.value" :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="goodsprice" label="交易金额">
            <el-input v-model.trim="filters.goodsprice" class="fixed_search_input" placeholder="交易金额">
              <i slot="prefix" class="iconfont icon-50"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="orderId" label="订单号">
            <el-input v-model.trim="filters.orderId" class="fixed_search_input" placeholder="订单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="transaction_id" label="第三方订单号">
            <el-input v-model.trim="filters.transaction_id" class="fixed_search_input" placeholder="第三方订单号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item prop="startTime" label="交易时间">
            <el-date-picker v-model="filters.startTime" class="fixed_search_input_datetime" type="datetime" @change="changTime" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
            </el-date-picker>
          </el-form-item>
          <el-form-item>至</el-form-item>
          <el-form-item prop="endTime">
            <el-date-picker v-model="filters.endTime" class="fixed_search_input_datetime" type="datetime" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item style="float: right;">
            <el-button type="primary" @click="getUsers" round>查询</el-button>
            <el-button @click="resetForm('filters')" round>重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-alert title="可查询最近30天的交易" type="warning" center close-text="知道了" show-icon>
        </el-alert>
      </el-row>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row>
        <el-table-column prop="orderId" label="订单号" min-width="285">
        </el-table-column>
        <el-table-column prop="payTime" label="交易时间" min-width="165">
        </el-table-column>
        <el-table-column prop="goodsPrice" label="交易金额" width="120">
        </el-table-column>
        <el-table-column prop="payWay" label="支付方式" width="120" :formatter="format_payWay">
        </el-table-column>
        <el-table-column prop="status" label="支付状态" width="150" :formatter="formatPay2">
        </el-table-column>
        <el-table-column prop="storeName" label="收款门店" width="120">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleDetail(scope.$index, scope.row)">交易详情</el-button>
            <el-button type="danger" size="mini" @click="handleRefund(scope.$index, scope.row)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
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
        <el-form-item label="交易时间：">
          <span>{{format_payTime(editForm.payTime)}}</span>
        </el-form-item>
        <el-form-item label="支付状态：">
          <span>{{formatPay2(editForm)}}</span>
        </el-form-item>
        <el-form-item label="退款金额（元）：">
          <span>{{editForm.refundAmount}}</span>
        </el-form-item>
        <el-form-item label="收款门店：">
          <span>{{editForm.storeName}}</span>
        </el-form-item>
        <el-form-item label="收款款台：">
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
        <el-form-item label="交易时间：">
          <span>{{format_payTime(refundForm.payTime)}}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>{{formatPay1(refundForm.payWay)}}</span>
        </el-form-item>
        <el-form-item label="交易金额(元)：">
          <span>{{refundForm.goodsPrice}}</span>
        </el-form-item>
        <el-form-item label="退款金额(元)：" prop="amount">
          <el-input v-model="refundForm.amount" placeholder="请输入退款金额"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="refundForm.desc"></el-input>
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
  import getUsersList from '../../../mixins/getUsersList'

  import {
    getUserListPage,
    lookupUser,
    downOrderExcel,
    merRefund,
    supplyPrint,
    selectStoreList,
    checkdownOrderExcelNew,
    queryOrderDetail,
    sendVerCodeT,
    selectEmpsBySid
  } from '../../../api/shop';

  export default {
    mixins: [getUsersList],
    data() {
      var myDate = new Date();
      return {
        //支付方式
        optionsScene: data.optionsPaymentCopy,
        //银行卡类型
        optionsBank: data.optionsBank,
        //支付状态
        optionsPayState: data.optionsPayState,
        //选择款台
        optionsStore: [],
        //时间控制
        pickerOptions1: {
          disabledDate: (time) => {
            if (time.getTime() > Date.now()) {
              return true;
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.filters.startTime),
              'yyyy-MM-dd')));
            if (time.getTime() > startTimeOne + 3600 * 1000 * 24 * 30 || time.getTime() < startTimeOne - 3600 * 1000 *
              24 * 1) {
              return true;
            }
          }
        },
        searchLoading: false,
        empSearchLoading: false,
        //商户名
        filters: {
          startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()),
          endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 23, 59, 59),
          play: '',
          state: 'SUCCESS',
          storeName: '',
          empName: '',
          goodsprice: '',
          transaction_id: '',
          goodsprice: '',
          cardType: ''
        },
        whole: {
          sumAmt: "",
          countRow: ""
        },
        optionsEmp: [],
        advancedOptions: true,

        editFormVisible: false, //编辑界面是否显示
        editLoading: false,
        //编辑界面数据
        editForm: {},
        refundFormVisible: false, //退款界面是否显示
        refundLoading: false,
        refundForm: {

        },
        refundFormRules: {
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
        }
      }
    },
    methods: {
      formatPay2: function (row, column) {
        return util.formatPayStatus(row.status, row.orderType)
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
      changTime(date) {
        let end_time = Date.parse(new Date(util.formatDate.format(new Date(this.filters.endTime), 'yyyy-MM-dd')))
        let date_time = Date.parse(new Date(util.formatDate.format(new Date(date), 'yyyy-MM-dd')))
        if (date_time < end_time - 3600 * 1000 * 24 * 30) {
          this.filters.endTime = new Date(this.filters.startTime.getFullYear(), this.filters.startTime.getMonth(), this.filters.startTime.getDate(), 23, 59, 59)
        }
      },
      //款台远程搜索
      clickEmp: function () {
        this.empSearchLoading = true;
        let para = {
          mid: sessionStorage.getItem('mid'),
          storeId: String(this.filters.storeName),
          ename: ''
        }
        selectEmpsBySid(para).then((res) => {
          this.empSearchLoading = false;
          let {
            status,
            data
          } = res
          this.optionsEmp = data.emplyeeList
        })
      },
      remoteEmp(query) {
        if (query !== '') {
          this.empSearchLoading = true;
          setTimeout(() => {
            this.empSearchLoading = false;
            let para = {
              mid: sessionStorage.getItem('mid'),
              storeId: String(this.filters.storeName),
              ename: query
            }
            selectEmpsBySid(para).then((res) => {
              let {
                status,
                data
              } = res
              this.optionsEmp = data.emplyeeList
            })
          }, 200);
        } else {
          this.optionsEmp = [];
        }
      },
      //门店远程搜索
      selectStoreChange() {
        this.filters.empName = ''
      },
      clickShop: function () {
        this.searchLoading = true;
        selectStoreList().then((res) => {
          this.searchLoading = false;
          let {
            status,
            data
          } = res
          this.optionsStore = data.storeList
        })
      },
      remoteShop(query) {
        if (query !== '') {
          this.searchLoading = true;
          setTimeout(() => {
            this.searchLoading = false;
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
      //获取用户列表
      getList() {
        this.listLoading = true;
        let para = {
          pageNum: this.page,
          payWay: this.filters.play,
          status: this.filters.state,
          storeId: String(this.filters.storeName),
          startTime: this.filters.startTime,
          endTime: this.filters.endTime,
          orderId: this.filters.orderId,
          transactionId: this.filters.transaction_id,
          goodsPrice: this.filters.goodsprice,
          cardType: this.filters.cardType,
          eid: String(this.filters.empName)
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(
          para.startTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(
          para.endTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
        getUserListPage(para).then((res) => {
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
      //显示退款
      handleRefund: function (index, row) {
        this.refundFormVisible = true
        queryOrderDetail({
          id: row.id
        }).then(res => {
          this.refundForm = res.data.order
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
                desc: this.refundForm.desc
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
        this.$router.push({
          path: "/index1/table5",
          query: { id: row.id }
        });
        // this.editFormVisible = true;
        // queryOrderDetail({
        //   id: row.id
        // }).then(res => {
        //   if (res.status === 200) {
        //     this.editForm = res.data.order
        //   }
        // })
      },
      //查询重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }

</script>
