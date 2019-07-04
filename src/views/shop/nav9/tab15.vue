<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="filters">
      <el-form-item label="日期时间">
        <el-date-picker v-model="filters.startTime" class="fixed_search_input_datetime" type="datetime" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
        </el-date-picker>
      </el-form-item>
      <el-form-item>至</el-form-item>
      <el-form-item>
        <el-date-picker v-model="filters.endTime" class="fixed_search_input_datetime" type="datetime" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="会员卡号">
        <el-input v-model="filters.card_no" class="fixed_search_input" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="getUsers" round>查询</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <div v-loading="listLoading">
  <el-table :data="users" border highlight-current-row style="width: 100%;">
    <el-table-column prop="card_name" label="计次卡名称">
    </el-table-column>
    <el-table-column prop="name" label="所属人" min-width="120">
    </el-table-column>
    <el-table-column prop="code" label="卡号" min-width="120">
    </el-table-column>
    <el-table-column prop="use_time" label="领取时间" :formatter="creat_stamp" min-width="160">
    </el-table-column>
    <el-table-column prop="use_total" label="核销次数">
    </el-table-column>
    <el-table-column prop="surplus_total" label="剩余次数">
    </el-table-column>
    <el-table-column prop="status" label="状态" :formatter="formatterStatus">
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
//
import {
  queryConsumeFrequencyList,
  sendVerCode,
  checkVerCode
} from '../../../api/shop';
export default {
  data() {
    var myDate = new Date();
    return {
      //时间控制
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90;
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90;
        }
      },
      filters: {
        card_no: '',
        status: '',
        startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()),
        endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 23, 59, 59),
        reason_id: ''
      },

      users: [],
      total: 0,
      page: 1,
      listLoading: false
    }
  },
  methods: {
    //时间转化
    creat_stamp: function(row, column) {
      return util.formatDate.format(new Date(row.use_time), 'yyyy/MM/dd hh:mm:ss');
    },
    formatterStatus: function(row) {
      return row.status === '1' ? '成功' : row.status === '2' ? '失败' : '未知'
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    getUsers(){
      this.page = 1
      this.getList()
    },
    //获取用户列表
    getList() {
      let para = {
        pagNum: this.page,
        card_no: this.filters.card_no,
        status: this.filters.status,
        startTime: this.filters.startTime,
        endTime: this.filters.endTime,
        reason_id: this.filters.reason_id
      };
      para.startTime = (!para.startTime || para.startTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(para.startTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
      para.endTime = (!para.endTime || para.endTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(para.endTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
      this.listLoading = true;
      queryConsumeFrequencyList(para).then((res) => {
        this.total = res.data.total;
        this.users = res.data.consumeList;
        this.listLoading = false;
      });
    },
  },
  mounted() {
    this.getUsers();
  }
}
</script>

<style scoped>
</style>
