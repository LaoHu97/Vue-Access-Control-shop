<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-col>
        <el-form :inline="true" :model="whole">
          <el-tag type="primary" style="margin:10px 10px 20px 0;">总交易金额（元）：{{whole.sumTrans}}元</el-tag>
          <el-tag type="primary" style="margin:10px 10px 20px 0;">总退款金额（元）：{{whole.sumRefund}}元</el-tag>
          <el-tag type="primary" style="margin:10px 10px 20px 0;">总实收金额（元）：{{whole.sumAmt}}元</el-tag>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="日期时间">
          <el-date-picker v-model="filters.startTime" class="fixed_search_input_date" :editable="false" :clearable="false" type="date" placeholder="请选择开始时间" :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.endTime" class="fixed_search_input_date" :editable="false" :clearable="false" type="date" placeholder="请选择结束时间" :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="门店名称">
          <el-select v-model="filters.state1" class="fixed_search_input" placeholder="门店名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="storeLoading" clearable @visible-change="clickShop">
            <el-option v-for="item in optionsMers" :key="item.id" :value="item.id" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="filters.payType" class="fixed_search_input" clearable placeholder="支付方式">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="getUsers(true)" round>查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-alert title="可查询最近90天的交易" type="warning" center close-text="知道了" show-icon>
      </el-alert>
    </el-row>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="settled_date" label="统计日期" min-width="120" :formatter="format_settled_date">
        </el-table-column>
        <el-table-column prop="sname" label="门店名称" min-width="120">
        </el-table-column>
        <el-table-column prop="pay_type" label="付款方式" :formatter="format_pay_type">
        </el-table-column>
        <el-table-column prop="trans_amt" label="交易金额" :formatter="format_amount">
        </el-table-column>
        <el-table-column prop="discount" label="优惠金额" :formatter="format_discount">
        </el-table-column>
        <el-table-column prop="refund_amt" label="退款金额" :formatter="format_refund_amt">
        </el-table-column>
        <el-table-column prop="factorage" label="交易手续费" min-width="120" :formatter="format_factorage">
        </el-table-column>
        <el-table-column prop="amount" label="实收金额" min-width="180" align="center" :render-header="renderHeaderMoney" :formatter="format_surplus">
        </el-table-column>
      </el-table>
    </div>

    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'
  import * as data from '../../../util/data.js'
  import {
    queryStrStatement,
    selectStoreList,
    downStrSumExcel
  } from '../../../api/shop';

  export default {
    data() {
      return {
        //时间控制
        pickerOptions1: {
          disabledDate: (time) => {
            let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.filters.endTime),
              'yyyy-MM-dd')));
            if (time.getTime() > startTimeOne || time.getTime() < startTimeOne - 3600 * 1000 * 24 * 90) {
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
        options: data.optionsPaymentCopy,
        //商户查询
        optionsMers: [],
        //商户名
        filters: {
          state1: '',
          payType: '',
          startTime: new Date() - 24 * 60 * 60 * 1000,
          endTime: new Date() - 24 * 60 * 60 * 1000
        },
        storeLoading: false,
        users: [],
        page: 1,
        total: null,
        listLoading: false,
        whole: {
          sumTrans: '',
          sumRefund: '',
          sumAmt: ''
        }
      }
    },
    methods: {
      renderHeaderMoney(h, {
        column,
        $index
      }) {
        return h('span', {}, [
          h('span', {}, column.label),
          h('br'),
          h('span', {style: 'color: #F56C6C;font-weight: normal'}, '（*交易金额-退款金额）')
        ])
      },
      format_pay_type(row, column) {
        return util.formatPayment(row.pay_type)
      },
      format_settled_date(row, column) {
        return util.formatDate.format(new Date(row.settled_date), 'yyyy-MM-dd')
      },
      //格式化金额
      format_amount(row, column) {
        return util.number_format(row.trans_amt, 2, ".", ",")
      },
      format_discount(row, column) {
        return util.number_format(row.discount, 2, ".", ",")
      },
      format_refund_amt(row, column) {
        return util.number_format(row.refund_amt, 2, ".", ",")
      },
      format_factorage(row, column) {
        return util.number_format(row.factorage, 2, ".", ",")
      },
      format_surplus(row, column) {
        return util.number_format(row.amount, 2, ".", ",")
      },
      //门店远程搜索
      clickShop: function () {
        selectStoreList().then((res) => {
          let {
            status,
            data
          } = res
          this.optionsMers = data.storeList
        })
      },
      remoteShop(query) {
        if (query !== '') {
          this.storeLoading = true;
          setTimeout(() => {
            this.storeLoading = false;
            selectStoreList({
              sname: query
            }).then((res) => {
              let {
                status,
                data
              } = res
              this.optionsMers = data.storeList
            })
          }, 200);
        } else {
          this.optionsMers = [];
        }
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList()
      },
      getList() {
        let para = {
          pageNum: this.page,
          sid: String(this.filters.state1),
          payType: this.filters.payType,
          startTime: this.filters.startTime,
          endTime: this.filters.endTime,
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : util.formatDate.format(new Date(para.startTime),
          'yyyy-MM-dd');
        para.endTime = (!para.endTime || para.endTime == '') ? '' : util.formatDate.format(new Date(para.endTime),
          'yyyy-MM-dd');
        this.listLoading = true;
        queryStrStatement(para).then((res) => {
          this.listLoading = false;
          if (res.status == 200) {
            this.total = res.data.totalCount;
            this.users = res.data.strStatementList;
            this.whole = res.data;
          }
        });
      },
      //获取用户列表
      getUsers() {
        this.page = 1
        this.getList()
      }
    },
    mounted() {
      this.getUsers();
    }
  }

</script>
