<template>
  <section>
    <el-row>
      <el-form :inline="true" :model="whole">
        <el-tag type="primary" style="margin:10px 10px 20px 0;">会员余额总计（元）：{{whole.countAmt}}元</el-tag>
        <el-tag type="primary" style="margin:10px 10px 20px 0;">会员数量：{{whole.countRow}}</el-tag>
      </el-form>
    </el-row>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="选择日期">
          <el-date-picker v-model="filters.startTime" class="fixed_search_input_date" :editable="false" :clearable="false" popper-class="startTime" :picker-options="pickerOptions"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-tag type="gray">注：不能统计当天数据</el-tag>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
		<div v-loading="listLoading">
			<el-table border :data="users" highlight-current-row style="width: 100%;">
				<el-table-column prop="account_name" label="付款人" min-width="120">
				</el-table-column>
				<el-table-column prop="account_num" label="会员卡号" min-width="120">
				</el-table-column>
				<el-table-column prop="account_balance" label="账户余额" min-width="120" :formatter="format_account_balance">
				</el-table-column>
				<el-table-column prop="creat_time" label="统计时间" min-width="120" :formatter="creat_stamp">
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
    queryBalance
  } from '../../../api/shop';
  export default {
    data() {
      var myDate = new Date();
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        filters: {
          startTime: myDate - 8.64e7,
        },
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        //选择款台
        options: [],
        whole: {
          countAmt: "",
          countRow: ""
        },
      }
    },
    methods: {
      //金额格式化
      format_account_balance(row, column){
        return util.number_format(row.account_balance, 2, ".", ",")
      },
      //时间显示转换
      creat_stamp: function (row, column) {
        return row.creat_time = util.formatDate.format(new Date(row.creat_time), 'yyyy-MM-dd');
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
          pageNum: String(this.page),
          startTime: this.filters.startTime,
          endTime: this.filters.startTime,
        };
        para.startTime = (!para.startTime || para.startTime == '') ? '' : String(util.formatDate.format(new Date(para.startTime),
          'yyyy-MM-dd')); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : String(util.formatDate.format(new Date(para.endTime),
          'yyyy-MM-dd')); //开始时间
        this.listLoading = true;
        queryBalance(para).then((res) => {
          this.total = res.data.totalCount;
          this.users = res.data.balanceList;
          this.whole.countRow = res.data.countRow;
          this.whole.countAmt = res.data.countAmt;
          this.listLoading = false;
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
    },
    mounted() {
      this.getUsers();
    }
  }

</script>

<style scoped>


</style>
