<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-col>
        <el-form :inline="true" :model="whole">
          <el-tag type="primary" style="margin:10px 10px 20px 0;">交易总金额（元）：{{whole.sumAmt}}元</el-tag>
          <el-tag type="primary" style="margin:10px 10px 20px 0;">交易总笔数（笔）：{{whole.countRow}}笔</el-tag>
          <el-form-item style="float: right;">
            <el-button type="primary" @click="getUsers('filters')" size="medium" round>查询</el-button>
            <el-button @click="resetForm('filters')" size="medium" round>重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-form :inline="true" :model="filters" ref="filters" :rules="filtersRules" class="top_input">
      <el-row>
        <el-form-item prop="startTime">
          <el-date-picker class="fixed_search_input_datetime" v-model="filters.startTime" @change="changTime" type="datetime" placeholder="选择开始日期"
            :picker-options="pickerOptions1" :clearable="false" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          至
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker class="fixed_search_input_datetime" v-model="filters.endTime" type="datetime" placeholder="选择结束日期" :picker-options="pickerOptions2"
            :clearable="false" :editable='false' default-time="23:59:59">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="storeName" class="fixed_search_input">
          <el-select v-model="filters.storeName" placeholder="门店名称" :multiple="false" filterable remote :remote-method="remoteShop"
            :loading="searchLoading" clearable @focus="clickShop" @change="selectStoreChange">
            <el-option v-for="item in optionsStore" :key="item.id" :value="item.id" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="empName" class="fixed_search_input">
          <el-select v-model="filters.empName" placeholder="款台名称" :multiple="false" filterable remote :remote-method="remoteEmp" :loading="empSearchLoading"
            clearable @focus="clickEmp">
            <el-option v-for="item in optionsEmp" :key="item.eid" :value="item.eid" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="state" class="fixed_search_input">
          <el-select v-model="filters.state" clearable placeholder="支付状态">
            <el-option v-for="item in optionsPayState" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="text" @click="advancedOptions = !advancedOptions">{{advancedOptions ? '隐藏' : '显示'}}高级选项</el-button>
        </el-form-item> -->
      </el-row>
      <el-collapse-transition>
        <div v-show="advancedOptions">
          <el-row>
            <el-form-item prop="play" class="fixed_search_seach">
              <el-select v-model="filters.play" clearable placeholder="支付方式">
                <el-option v-for="item in optionsScene" :label="item.label" :value="item.value" :key="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="cardType" class="fixed_search_seach">
              <el-select v-model="filters.cardType" clearable placeholder="银行卡类型">
                <el-option v-for="item in optionsBank" :label="item.label" :value="item.value" :key="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="goodsprice" class="fixed_search_input">
              <el-input v-model.trim="filters.goodsprice" placeholder="交易金额">
                <i slot="prefix" class="iconfont icon-50"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="orderId" class="fixed_search_input">
              <el-input v-model.trim="filters.orderId" placeholder="订单号"></el-input>
            </el-form-item>
            <el-form-item prop="transaction_id" class="fixed_search_input">
              <el-input v-model.trim="filters.transaction_id" placeholder="第三方订单号"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="isOnly">
              <el-checkbox v-model="filters.isOnly">仅通过订单号查询</el-checkbox>
            </el-form-item> -->
          </el-row>
        </div>
      </el-collapse-transition>
      <el-row>
        <el-alert title="可查询30天之前的交易，每次查询区间最多为3个月" type="warning" center close-text="知道了" show-icon>
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
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">交易详情</el-button>
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
      <el-form :model="editForm" label-width="160px" ref="editForm" label-position="left">
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
          <span>{{formatPay2(editForm)}}</span>
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
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'
  import * as data from '../../../util/data.js'
  import {
    downloadQueryOrderShop,
    lookupUser,
    downOrderExcel,
    merRefund,
    supplyPrint,
    selectStoreList,
    checkdownOrderExcelNew,
    checkdownOrderExcel,
    downloadQueryOrderDetail,
    selectEmpsBySid
  } from '../../../api/shop';

  export default {
    data() {
      var myDate = new Date();
      return {
        //支付方式
        optionsScene: data.optionsPaymentCopy,
        //银行卡类型
        optionsBank: data.optionsBank,
        //支付状态
        optionsPayState: data.optionsPayState,
        optionsStore: [],
        optionsEmp: [],
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
            if (time.getTime() > startTimeOne + 3600 * 1000 * 24 * 90 || time.getTime() < startTimeOne - 3600 * 1000 *
              24 * 1) {
              return true;
            }
          }
        },
        searchLoading: false,
        empSearchLoading: false,
        //商户名
        filters: {
          startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate() - 1),
          endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate() - 1, 23, 59, 59),
          play: '',
          state: 'SUCCESS',
          storeName: '',
          empName: '',
          goodsprice: '',
          transaction_id: '',
          goodsprice: '',
          cardType: '',
          isOnly: false
        },
        whole: {
          sumAmt: "",
          countRow: ""
        },
        total: 0,
        page: 1,
        users: [],
        listLoading: false,
        advancedOptions: true,

        editFormVisible: false, //编辑界面是否显示
        editLoading: false,
        //编辑界面数据
        editForm: {
          orderId: '',
          transactionId: '',
          goodsPrice: '',
          payTime: '',
          status: '',
          storeName: '',
          refundAmount: '',
          payWay: ''
        },
        filtersRules: {
          endTime: [{
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }]
        }
      }
    },
    methods: {
      changTime(date) {
        let end_time = Date.parse(new Date(util.formatDate.format(new Date(this.filters.endTime), 'yyyy-MM-dd')))
        let date_time = Date.parse(new Date(util.formatDate.format(new Date(date), 'yyyy-MM-dd')))
        if (date_time < end_time - 3600 * 1000 * 24 * 90) {
          this.filters.endTime = ''
        }
      },
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
      //格式化金额
      format_amount(row, column) {
        return util.number_format(row.goodsPrice, 2, ".", ",")
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
      handleCurrentChange(val) {
        this.page = val;
        this.getList()
      },
      //获取用户列表
      getList() {
        this.listLoading = true;
        let para = {
          mid: sessionStorage.getItem('mid'),
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
          eid: String(this.filters.empName),
          isOnly: this.filters.isOnly
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(
          para.startTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(
          para.endTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
        para.isOnly = para.isOnly === true ? 'Y' : 'N'
        downloadQueryOrderShop(para).then((res) => {
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
            this.users = res.data.summaryCopyList;
          }
          this.listLoading = false;
        });
      },
      getUsers(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.page = 1
            this.getList()
          }
        })
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        downloadQueryOrderDetail({
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
      this.getUsers('filters');
      lookupUser().then((res) => {
        var _this = this;
        let {
          status,
          message
        } = res;
        if (status == 200) {
          this.options = res.data.storeList;
        }
      });
    }
  }

</script>
