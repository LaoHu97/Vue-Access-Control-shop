<template>
  <section>
    <!--工具条-->
    <el-row class="toolbar">
      <el-form :inline="true" :model="whole">
        <el-tag type="primary" style="margin:10px 10px 20px 0;">总交易金额（元）：{{whole.sumTransAmt}}</el-tag>
        <el-tag type="primary" style="margin:10px 10px 20px 0;">总退款金额（元）：{{whole.sumRefundAmt}}</el-tag>
        <el-tag type="primary" style="margin:10px 10px 20px 0;">总实收金额（元）：{{whole.sumAmt}}</el-tag>
        <el-tag type="primary" style="margin:10px 10px 20px 0;">总手续费（元）：{{whole.sumFac}}</el-tag>
        <el-tag type="primary" style="margin:10px 10px 20px 0;">总结算金额（元）：{{whole.sumSur}}</el-tag>
      </el-form>
    </el-row>
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="日期时间">
          <el-date-picker v-model="filters.startTime" class="fixed_search_input_date" :editable="false" :clearable="false" type="date"
            placeholder="请选择开始时间" :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          至
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.endTime" class="fixed_search_input_date" :editable="false" :clearable="false" type="date"
            placeholder="请选择结束时间" :picker-options="pickerOptions2">
          </el-date-picker>
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
        <el-table-column prop="mname" label="商户名称" min-width="100">
        </el-table-column>
        <el-table-column prop="settled_date" label="统计日期" min-width="130" :formatter="settled_date">
        </el-table-column>
        <el-table-column prop="trans_amt" label="交易金额" min-width="100" :formatter="format_trans_amt">
        </el-table-column>
        <el-table-column prop="amount" label="实收金额" align="center" :render-header="renderHeaderMoney" min-width="180" :formatter="format_amount">
        </el-table-column>
        <el-table-column prop="sum_total" label="交易笔数">
        </el-table-column>
        <el-table-column prop="refund_amt" label="退款金额" :formatter="format_refund_amt">
        </el-table-column>
        <el-table-column prop="factorage" label="手续费" align="center" :render-header="renderHeaderFactorage" :formatter="format_factorage" min-width="180">
        </el-table-column>
        <el-table-column prop="surplus" label="结算金额" align="center" :render-header="renderHeaderAmount" min-width="210">
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleDetails(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="交易详情" :visible.sync="dialogDetailsVisible" width="45%">
      <div v-loading="listDialogLoading">
        <el-table :data="dialogUsers" border highlight-current-row style="width: 100%;">
          <el-table-column prop="mname" label="商户名称" min-width="100">
          </el-table-column>
          <el-table-column prop="settled_Time" label="统计日期" min-width="130">
          </el-table-column>
          <el-table-column prop="pay_type" label="支付方式" min-width="130" :formatter="format_pay_type">
          </el-table-column>
          <el-table-column prop="trans_amt" label="交易金额" min-width="100" :formatter="format_trans_amt">
          </el-table-column>
          <el-table-column prop="amount" label="实收金额" align="center" min-width="180" :render-header="renderHeaderMoney" :formatter="format_amount">
          </el-table-column>
          <el-table-column prop="sum_total" label="交易笔数">
          </el-table-column>
          <el-table-column prop="refund_amt" label="退款金额" :formatter="format_refund_amt">
          </el-table-column>
          <el-table-column prop="factorage" label="手续费" align="center" :render-header="renderHeaderFactorage" :formatter="format_factorage" min-width="160">
          </el-table-column>
          <el-table-column prop="surplus" label="结算金额" align="center" :render-header="renderHeaderAmount" min-width="210">
          </el-table-column>
        </el-table>
      </div>
      <!-- <el-row>
        <el-pagination layout="prev, pager, next" :current-page="dialogPage" @current-change="dialogHandleCurrentChange" :page-size="20" :total="dialogTotal"
          background style="text-align:center;background:#fff;padding:15px;">
        </el-pagination>
      </el-row> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetailsVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total"
        background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'

  import {
    queryMerDaySum,
    queryMerDaySumDetail
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
        //商户名
        filters: {
          startTime: new Date() - 24 * 60 * 60 * 1000,
          endTime: new Date() - 24 * 60 * 60 * 1000
        },
        users: [],
        dialogUsers: [],
        page: 1,
        total: null,
        listLoading: false,
        listDialogLoading: false,
        whole: {},
        dialogDetailsVisible: false,
        dialogPage: 1,
        dialogTotal: null
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
          h('span', { style: 'color: #F56C6C;font-weight: normal' }, '（*交易金额-退款金额）'),
        ])
      },
      renderHeaderFactorage(h, {
        column,
        $index
      }) {
        return h('span', {}, [
          h('span', {}, column.label),
          h('br'),
          h('span', { style: 'color: #F56C6C;font-weight: normal' }, '（*此数据仅供参考）')
        ])
      },
      renderHeaderAmount(h, {
        column,
        $index
      }) {
        return h('span', {}, [
          h('span', {}, column.label),
          h('br'),
          h('span', { style: 'color: #F56C6C;font-weight: normal' }, '（*到账金额以银行打款为准）')
        ])
      },
      // dialogHandleCurrentChange(val) {

      // },
      handleDetails(index, row) {
        this.dialogDetailsVisible = true
        queryMerDaySumDetail({
          settledDate: new Date(row.settled_date).getTime()
        }).then(res => {
          this.dialogUsers = res.data.merStatementList
        })
      },
      //格式化金额
      format_trans_amt(row, column) {
        return util.number_format(row.trans_amt, 2, ".", ",")
      },
      format_amount(row, column) {
        return util.number_format(row.amount, 2, ".", ",")
      },
      format_refund_amt(row, column) {
        return util.number_format(row.refund_amt, 2, ".", ",")
      },
      format_factorage(row, column) {
        return util.number_format(row.factorage, 2, ".", ",")
      },
      format_avg_amt(row, column) {
        return util.number_format(row.avg_amt, 2, ".", ",")
      },
      settled_date: function (row, column) {
        return row.settled_date = util.formatDate.format(new Date(row.settled_date), 'yyyy/MM/dd');
      },
      format_pay_type(row,column) {
        return util.formatPayment(row.pay_type)
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList()
      },
      getList() {
        let para = {
          pageNum: this.page,
          startTime: this.filters.startTime,
          endTime: this.filters.endTime,
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : util.formatDate.format(new Date(para.startTime),
          'yyyy/MM/dd');
        para.endTime = (!para.endTime || para.endTime == '') ? '' : util.formatDate.format(new Date(para.endTime),
          'yyyy/MM/dd');
        this.listLoading = true;
        queryMerDaySum(para).then((res) => {
          this.listLoading = false;
          let {
            status,
            message
          } = res;
          if (status == 200) {
            this.total = res.data.totalCount;
            this.users = res.data.merDaySumList;
            this.whole = res.data;
          }
        });
      },
      //获取用户列表
      getUsers() {
        this.page = 1
        this.getList()
      },
    },
    mounted() {
      this.getUsers();
    }
  }

</script>
