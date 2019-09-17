<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters" ref="filters">
        <el-form-item label="日期时间">
          <el-date-picker
            v-model="filters.startTime"
            placeholder="选择开始日期"
            :clearable="false"
            value-format="timestamp"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.endTime"
            placeholder="选择结束日期"
            :clearable="false"
            value-format="timestamp"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="filters.product_name" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="filters.order_id" placeholder="订单号"></el-input>
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
        <el-table-column prop="orderId" label="订单号"></el-table-column>
        <el-table-column prop="pay_way" label="支付方式" :formatter="pay_wayFormatter"></el-table-column>
        <el-table-column prop="total_price" label="交易金额"></el-table-column>
        <el-table-column prop="creatTime" label="创建时间" :formatter="creatTimeFormatter"></el-table-column>
        <el-table-column prop="username" label="适用场次"></el-table-column>
        <el-table-column prop="phone" label="适用房型"></el-table-column>
      </el-table>
    </div>

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
import { queryProductOrderList } from "../../../api/shop";

export default {
  data() {
    return {
      filters: {
        startTime: '',
        endTime: '',
        status: '',
        product_name: '',
        order_id: ''
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false
    };
  },
  methods: {
    creatTimeFormatter: function(row, column) {
      return util.formatDate.format(
        new Date(row.creatTime),
        "yyyy/MM/dd hh:mm:ss"
      );
    },
    pay_wayFormatter: function(row, column) {
      return row.pay_way === 'WX' ? '微信' : row.pay_way === 'vip' ? '会员支付' : '未知'
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
      let para = util.deepcopy(this.filters)
      para.pageNum = this.page
      para.startTime = para.startTime.toString()
      para.endTime = para.endTime.toString()
      this.listLoading = true;
      queryProductOrderList(para).then(res => {
        this.total = res.data.total;
        this.users = res.data.productOrderList;
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
