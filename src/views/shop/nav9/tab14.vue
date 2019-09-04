<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="filters">
      <el-form-item label="日期时间">
        <el-date-picker v-model="filters.startTime" value-format="timestamp" class="fixed_search_input_datetime" type="datetime" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
        </el-date-picker>
      </el-form-item>
      <el-form-item>至</el-form-item>
      <el-form-item>
        <el-date-picker v-model="filters.endTime" value-format="timestamp" class="fixed_search_input_datetime" type="datetime" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计次卡号">
        <el-input v-model="filters.card_no" class="fixed_search_input" placeholder="计次卡号"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="filters.openidType" placeholder="请选择">
          <el-option label="公众号" value="MP"></el-option>
          <el-option label="小程序" value="MINI"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="getUsers" round>查询</el-button>
        <el-button type="text" @click="clickEx" round>下载报表</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <div v-loading="listLoading">
  <el-table :data="users" border highlight-current-row style="width: 100%;">
    <el-table-column prop="card_name" label="计次卡名称">
    </el-table-column>
    <!-- <el-table-column prop="name" label="所属人" min-width="120">
    </el-table-column> -->
    <el-table-column prop="code" label="计次卡号" min-width="120">
    </el-table-column>
    <el-table-column prop="creat_time" label="领取时间" :formatter="creat_stamp" min-width="160">
    </el-table-column>
    <el-table-column prop="openid_type" label="领取方式" :formatter="openid_type">
    </el-table-column>
    <el-table-column prop="can_use_total" label="初始次数">
    </el-table-column>
    <el-table-column prop="surplus_total" label="剩余次数">
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
  queryFrequencyList,
  sendVerCode,
  checkVerCode,
  exportConsumeCountList
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
        startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()).getTime() ,
        endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 23, 59, 59).getTime(),
        openidType: ''
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
      return util.formatDate.format(new Date(row.creat_time), 'yyyy/MM/dd hh:mm:ss');
    },
    openid_type: function (row, column) {
      return row.openid_type === 'MINI' ? '小程序' : row.openid_type === 'MP' ? '公众号' : '未知'
    },
			clickEx(){
				let para = util.deepcopy(this.filters)
        para.startTime = para.startTime.toString()
        para.endTime = para.endTime.toString()
				para.excelType = '6'
				exportConsumeCountList(para).then(res => {
					window.open(res.data, "_blank")
				})
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
        startTime: this.filters.startTime.toString(),
        endTime: this.filters.endTime.toString(),
        openidType: this.filters.openidType
      };
      this.listLoading = true;
      queryFrequencyList(para).then((res) => {
        this.total = res.data.total;
        this.users = res.data.receiveFreList;
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
