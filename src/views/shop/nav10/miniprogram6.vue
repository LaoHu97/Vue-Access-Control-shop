<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="星级">
          <el-select v-model="filters.serviceGrade" placeholder="请选择">
            <el-option :value="1"></el-option>
            <el-option :value="2"></el-option>
            <el-option :value="3"></el-option>
            <el-option :value="4"></el-option>
            <el-option :value="5"></el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="日期时间">
          <el-date-picker
            v-model="filters.dateTime"
            type="daterange"
            range-separator="至"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
				</el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="reserve1" label="微信昵称" width="160"></el-table-column>
        <el-table-column prop="content" label="评价内容" min-width="180"></el-table-column>
        <el-table-column label="星级" width="160">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.serviceGrade"
              disabled
              text-color="#ff9900">
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否显示" width="160">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShow"
              :active-value="1"
              :inactive-value="0"
              @change="switchOnchange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="评价时间" width="160" :formatter="formatterreplyTime"></el-table-column>
        <el-table-column prop="gmt_create" label="创建时间" width="160" :formatter="formatter_time"></el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="zhidingClick(scope.$index, scope.row)">置顶</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row>
      <el-pagination
        layout="prev, pager, next"
        :current-page="pageNum"
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
import { showOrderAppraise, updateOrderAppraise } from "../../../api/shop";
export default {
  data() {
    return {
      filters: {
        dateTime: null,
        serviceGrade: ""
      },
      listLoading: false,
      users: [],
      pageNum: 1,
      total: 0
    };
  },
  methods: {
    formatter_time(row, column) {
      return util.formatDate.format(
        new Date(row.creatTime),
        "yyyy-MM-dd hh:mm:ss"
      );
    },
    formatterreplyTime(row, column) {
      return util.formatDate.format(
        new Date(row.replyTime),
        "yyyy-MM-dd hh:mm:ss"
      );
    },
    switchOnchange(row) {
      let para = {
        id: row.id,
        isShow: row.isShow
      };
      updateOrderAppraise(para).then(res => {
        if (res.status === 200) {
          this.getUsers();
          this.$message({
            message: res.message,
            type: "success"
          });
        }
      });
    },
    zhidingClick(index, row) {
      this.$confirm("置顶该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = {
            id: row.id,
            proGrade: 1
          };
          updateOrderAppraise(para).then(res => {
            if (res.status === 200) {
              this.getUsers();
              this.$message({
                message: res.message,
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = {
            id: row.id,
            status: 0
          };
          updateOrderAppraise(para).then(res => {
            if (res.status === 200) {
              this.getUsers();
              this.$message({
                message: res.message,
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    handleCurrentChange(val) {
      this.pageNum = val;
      this.gerList();
    },
    getUsers() {
      this.pageNum = 1;
      this.gerList();
    },
    gerList() {
      let para = {
        pageNum: this.pageNum,
        dateTime: this.filters.dateTime,
        serviceGrade: this.filters.serviceGrade
      };
      this.listLoading = true;
      showOrderAppraise(para).then(res => {
        this.listLoading = false;
        this.users = res.data.appraiseList;
        this.total = res.data.total;
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
