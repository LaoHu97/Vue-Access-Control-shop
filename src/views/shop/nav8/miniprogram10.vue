<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters" ref="filters">
        <el-form-item label="日期时间">
          <el-date-picker
            v-model="filters.startTime"
            placeholder="选择开始日期"
            :picker-options="pickerOptions1"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.endTime"
            placeholder="选择结束日期"
            :picker-options="pickerOptions2"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="filters.keyWords" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="filters.wssembleOrderid" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="filters.status" placeholder="请选择订单状态">
            <el-option label="未支付" value="0"></el-option>
            <el-option label="支付成功" value="1"></el-option>
            <el-option label="支付失败" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" v-on:click="getUsers" size="medium" round>查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row>
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="wssembleOrderid" label="订单号"></el-table-column>
        <el-table-column prop="pay_way" label="支付方式" :formatter="pay_wayFormatter"></el-table-column>
        <el-table-column prop="amount" label="交易金额"></el-table-column>
        <el-table-column prop="creatTime" label="创建时间" :formatter="creatTimeFormatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEditor(scope.$index, scope.row)"
            >拼团详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="拼团详情" :visible.sync="dialogTableVisible" width="60%">
      <el-table :data="gridData">
        <el-table-column property="detailOrderid" label="订单号"></el-table-column>
        <el-table-column property="amount" label="金额" width="200"></el-table-column>
        <el-table-column property="status" label="支付状态"  :formatter="statusFormatter"></el-table-column>
        <el-table-column property="reserve1" label="拼团状态" :formatter="reserve1Formatter"></el-table-column>
        <el-table-column property="payWay" label="支付方式" :formatter="payWayFormatter"></el-table-column>
        <el-table-column property="payTime" label="支付时间"  :formatter="payTimeFormatter"></el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        @current-change="dialogCurrentChange"
        :page-size="20"
        :total="totalDialog"
        background
        style="text-align:center;background:#fff;padding:15px;"
      ></el-pagination>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        background
        style="text-align:center;background:#fff;padding:15px;"
      ></el-pagination>
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  queryWssembleOrderList,
  queryOrderDetail2019
} from "../../../api/shop";

export default {
  data() {
    return {
      //时间控制
      pickerOptions1: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < Date.now() - 3600 * 1000 * 24 * 90
          );
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < Date.now() - 3600 * 1000 * 24 * 90
          );
        }
      },
      filters: {
        startTime: "",
        endTime: "",
        status: "",
        keyWords: "",
        wssembleOrderid: ""
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false,

      gridData: [],
      totalDialog: 0,
      pageDialog: 1,
      dialogTableVisible: false
    };
  },
  methods: {
    statusFormatter: function(row, column) {
      return row.status === 0 ? '未支付' : row.status === 1 ? '支付成功' : row.status === 2 ? '已退款' : '未知'
    },
    reserve1Formatter: function(row, column) {
      return row.reserve1 === '0' ? '拼团中' : row.status === '1' ? '拼团成功' : '未知'
    },
    creatTimeFormatter: function(row, column) {
      return util.formatDate.format(
        new Date(row.creatTime),
        "yyyy/MM/dd hh:mm:ss"
      );
    },
    payTimeFormatter: function(row, column) {
      return util.formatDate.format(
        new Date(row.payTime),
        "yyyy/MM/dd hh:mm:ss"
      );
    },
    payWayFormatter: function(row, column) {
      return row.payWay === "WX"
        ? "微信"
        : row.payWay === "vip"
        ? "会员"
        : "未知";
    },
    pay_wayFormatter: function(row, column) {
      return row.payWay === "WX"
        ? "微信"
        : row.payWay === "vip"
        ? "会员"
        : "未知";
    },
    handleEditor(index, row) {
      this.dialogTableVisible = true;
      this.$nextTick(() => {
        this.getDialogList(row.wssembleOrderid)
      });
    },

    getDialogList(val) {
      let para = {
        pageNum: this.pageDialog,
        pageSize: 20,
        wssembleOrderid: val
      };
      queryOrderDetail2019(para).then(res => {
        this.gridData = res.data.queryActivityList
        this.totalDialog = res.data.total
      });
    },
    dialogCurrentChange(val) {
      this.pageDialog = val;
      this.getDialogList();
    },

    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },

    //获取用户列表
    getUsers() {
      this.pageNum = 1;
      this.gerList();
    },
    gerList() {
      let para = util.deepcopy(this.filters);
      para.pageNum = this.page;
      para.pageSize = 20;
      this.listLoading = true;
      queryWssembleOrderList(para).then(res => {
        this.total = res.data.total;
        this.users = res.data.queryActivityList;
        this.listLoading = false;
      });
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style scoped>
</style>
