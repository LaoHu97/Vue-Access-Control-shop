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
        <el-form-item label="邀请人名称">
          <el-input v-model="filters.memName" placeholder="邀请人名称"></el-input>
        </el-form-item>
        <el-form-item label="被邀请人名称">
          <el-input v-model="filters.invitee_name" placeholder="被邀请人名称"></el-input>
        </el-form-item>
        <el-form-item label="是否激活">
          <el-select v-model="filters.status" placeholder="请选择是否激活">
            <el-option label="未激活" value="0"></el-option>
            <el-option label="已激活" value="1"></el-option>
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
        <el-table-column prop="reserve2" label="邀请人名称"></el-table-column>
        <el-table-column prop="inviteeName" label="被邀请人名称"></el-table-column>
        <el-table-column prop="status" label="是否激活" :formatter="statusFormatter"></el-table-column>
        <el-table-column prop="invitee" label="被邀请人卡号"></el-table-column>
        <el-table-column prop="wxCardId" label="会员卡序列号"></el-table-column>
        <el-table-column prop="creatTime" label="创建时间" :formatter="creatTimeFormatter"></el-table-column>
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
import { queryInvitationRecord } from "../../../api/shop";

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
        startTime: '',
        endTime: '',
        status: '',
        memName: '',
        invitee_name: ''
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false
    };
  },
  methods: {
    statusFormatter: function(row, column) {
      return row.status === '0' ? '未激活' : row.status === '1' ? '已激活' : '未知'
    },
    creatTimeFormatter: function(row, column) {
      return util.formatDate.format(
        new Date(row.createTime),
        "yyyy/MM/dd hh:mm:ss"
      );
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
      this.listLoading = true;
      queryInvitationRecord(para).then(res => {
        this.total = res.data.total;
        this.users = res.data.invitationList;
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
