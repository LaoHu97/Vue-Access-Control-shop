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
        <el-table-column prop="status" label="状态更改">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="Y"
              inactive-value="N"
              @change="switchChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">修改活动</el-button>
            <el-button size="mini" type="warning" @click="handleEdits(scope.$index, scope.row)">活动规则</el-button>
          </template>
        </el-table-column>
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
  checkVerCode,
  updateDepositStatusNew
} from "../../../api/shop";
export default {
  data() {
    var myDate = new Date();
    return {
      filters: {
        startTime: '',
        endTime: ''
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
      let begin_time = util.formatDate.format(
        new Date(row.begin_time),
        "yyyy/MM/dd"
      )
      let end_time = util.formatDate.format(
        new Date(row.end_time),
        "yyyy/MM/dd"
      )
      return `${begin_time} 至 ${end_time}`
    },
    formatterStatus: function(row) {
      return row.status === "Y" ? "启用" : row.status === "N" ? "未启用" : "未知";
    },
    switchChange(row) {
      let para = {
        id: row.id,
        status: row.status
      }
      updateDepositStatusNew(para).then(res => {
        this.getUsers()
      })
    },
    handleEdits(index,row){
      this.$router.push({
        path: "/index3/tab22-v",
        query: {id: row.id, sid: row.apply_sid}
      });
    },
    handleEdit(index,row){
      this.$router.push({
        path: "/index3/tab19-v",
        query: {id: row.id}
      });
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
        this.users = res.data.depositActivitys;
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
