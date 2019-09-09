<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="爆款名称">
          <el-input v-model="filters.title" placeholder="爆款名称"></el-input>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="roomType.roomType" label="房间类型"></el-table-column>
        <el-table-column prop="employee.name" label="房间所有者"></el-table-column>
        <el-table-column prop="status" label="房间状态"></el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="showQrcode(scope.$index, scope.row)"
            >二维码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="二维码" center  :visible.sync="qrDialogVisible" width="350px">
      <img style="width: 180px; height: 180px; margin-left: 60px;" :src="qrUrl">
    </el-dialog>
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
import { getRoomList, generator } from "../../../api/shop";
export default {
  data() {
    return {
      filters: {
        title: ""
      },
      listLoading: false,
      users: [],
      pageNum: 1,
      total: 0,

      qrUrl: '',
      qrDialogVisible: false
    };
  },
  methods: {
    showQrcode(index, row){
      this.qrDialogVisible = true
      this.$nextTick(() => {
        generator({roomId: row.id}).then(res => {
          this.qrUrl = `data:image/png;base64,${res.data.qrcode}`
        })
      })
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
        pageSize: 20
      };
      this.listLoading = true;
      getRoomList(para).then(res => {
        this.listLoading = false;
        this.users = res.data.roomList;
        this.total = res.data.total;
      });
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>
