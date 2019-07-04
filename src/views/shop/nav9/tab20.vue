<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="日期时间">
          <el-date-picker
            v-model="filters.startTime"
            class="fixed_search_input_datetime"
            type="datetime"
            placeholder="选择开始日期"
            :picker-options="pickerOptions1"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.endTime"
            class="fixed_search_input_datetime"
            type="datetime"
            placeholder="选择结束日期"
            :picker-options="pickerOptions2"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="getUsers" round>查询</el-button>
          <el-button type="success" @click="addExpense" plain>添加充值有礼</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="活动名称"></el-table-column>
        <el-table-column label="活动时间" :formatter="create_time"></el-table-column>
        <el-table-column prop="status" label="活动状态" :formatter="formatterStatus"></el-table-column>
      </el-table>
    </div>

    <!--工具条-->
    <el-row>
      <el-pagination
        layout="prev, pager, next"
        :current-page="page"
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
//
import {
  queryDepositActivity,
  sendVerCode,
  checkVerCode
} from "../../../api/shop";
export default {
  data() {
    var myDate = new Date();
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
        startTime: new Date(
          myDate.getFullYear(),
          myDate.getMonth(),
          myDate.getDate()
        ),
        endTime: new Date(
          myDate.getFullYear(),
          myDate.getMonth(),
          myDate.getDate(),
          23,
          59,
          59
        )
      },

      users: [],
      total: 0,
      page: 1,
      listLoading: false
    };
  },
  methods: {
    //时间转化
    create_time: function(row, column) {
      return util.formatDate.format(
        new Date(row.create_time),
        "yyyy/MM/dd hh:mm:ss"
      );
    },
    formatterStatus: function(row) {
      return row.status === "Y" ? "启用" : row.status === "N" ? "未启用" : "未知";
    },
    addExpense() {
      this.$router.push({
        path: "/index3/tab19-v"
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    getUsers() {
      this.page = 1;
      this.getList();
    },
    //获取用户列表
    getList() {
      let para = {
        pagNum: this.page,
        startTime: this.filters.startTime,
        endTime: this.filters.endTime
      };
      para.startTime =
        !para.startTime || para.startTime == ""
          ? ""
          : String(
              Date.parse(
                util.formatDate.format(
                  new Date(para.startTime),
                  "yyyy/MM/dd hh:mm:ss"
                )
              )
            ); //开始时间
      para.endTime =
        !para.endTime || para.endTime == ""
          ? ""
          : String(
              Date.parse(
                util.formatDate.format(
                  new Date(para.endTime),
                  "yyyy/MM/dd hh:mm:ss"
                )
              )
            ); //开始时间
      this.listLoading = true;
      queryDepositActivity(para).then(res => {
        this.total = res.data.total;
        this.users = res.data.memCardList;
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
