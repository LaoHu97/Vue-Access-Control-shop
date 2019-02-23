<style scoped>
.search_top {
  background: #f2f2f2;
  margin: 20px 0;
  padding: 20px 10px 0 10px;
}
.top_alert {
  margin-top: 20px;
}
</style>
<style>
.fixed_search_input {
  max-width: 160px;
}
.fixed_search_date {
  max-width: 220px;
}
</style>

<template>
  <section>
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="80px">
      <div class="search_top">
        <el-row>
          <el-col :span="7">
            <el-form-item label="结算日期" prop="startTime">
              <el-date-picker
                v-model="filters.startTime"
                type="date"
                placeholder="选择日期"
                :clearable ="false"
                :picker-options="pickerOptions"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              至
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="filters.endTime"
                type="date"
                placeholder="选择日期"
                :clearable ="false"
                :picker-options="pickerOptions"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column :formatter="formatCreate_time2" label="交易日期"/>
        <el-table-column :formatter="formatCreate_time" label="结算日期"/>
        <el-table-column prop="settlement_amount" label="结算金额"/>
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
      />
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  queryStatementList
} from "@/api/shop";

export default {
  data() {
    return {
      filters: {
        startTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime(),
        endTime: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),23,59,59).getTime()
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() >
            new Date(
              new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            )
          );
        }
      }
    };
  },
  methods: {
    formatCreate_time(row, column) {
      return util.formatDate.format(
        new Date(row.settlement_date),
        "yyyy/MM/dd"
      );
    },
    formatCreate_time2(row, column) {
      return util.formatDate.format(
        new Date(row.trade_date),
        "yyyy/MM/dd"
      );
    },
    handleCurrentChange (val) {
      this.page = val
      this.getList()
    },
    getUsers () {
      this.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      let para = this.filters;
      para.pageNum = this.page.toString();
      queryStatementList(para).then(res => {
        this.listLoading = false
        this.users = res.data.queryStatementList;
        this.total = res.data.totalCount;
      });
    }
  },
  mounted () {
    this.getUsers()
  }
};
</script>
