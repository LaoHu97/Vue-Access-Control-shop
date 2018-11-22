<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="日期时间">
          <el-date-picker v-model="filters.startTime" class="fixed_search_input_date" type="date" placeholder="开始日期" :picker-options="pickerOptions1" :clearable="false"
            :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.endTime" class="fixed_search_input_date" type="date" placeholder="结束日期" :picker-options="pickerOptions2" :clearable="false"
            :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="门店名称">
          <template>
            <el-select v-model="filters.value" class="fixed_search_input" placeholder="门店名称" :multiple="false" filterable remote :remote-method="remoteShop"
              :loading="loading" clearable @visible-change="clickShop">
              <el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="getUsers" round>查询</el-button>
          <el-button type="text" @click="downExcel()">
            <i class="el-icon-date"></i>导出Excel</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="sname" label="门店名称" min-width="160">
        </el-table-column>
        <el-table-column prop="pkg_name" label="套餐名称" min-width="160">
        </el-table-column>
        <el-table-column prop="total_amt" label="激活套餐金额" min-width="120" :formatter="format_total_amt">
        </el-table-column>
        <el-table-column prop="total_num" label="购买套餐累计个数" min-width="120">
        </el-table-column>
      </el-table>
    </div>

    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total"
        background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'
  //
  import {
    queryActivePur,
    selectStoreList
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
          startTime: [new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate())],
          endTime: [new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate())],
          value: ''
        },
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        loading: false,
        options: []
      }
    },
    methods: {
      //金额格式化
      format_total_amt(row, column) {
        return util.number_format(row.total_amt, 2, ".", ",")
      },
      //门店远程搜索
      clickShop: function () {
        selectStoreList().then((res) => {
          let {
            status,
            data
          } = res
          this.options = data.storeList
        })
      },
      remoteShop(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            selectStoreList({
              sname: query
            }).then((res) => {
              let {
                status,
                data
              } = res
              this.options = data.storeList
            })
          }, 200);
        } else {
          this.options = [];
        }
      },
      //导出Excel
      downExcel() {
        let para = {
          startTime: this.filters.startTime,
          endTime: this.filters.endTime
        }
        para.startTime = (!para.startTime || para.startTime == '') ? '' : String(util.formatDate.format(new Date(para.startTime),
          'yyyy/MM/dd')); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : String(util.formatDate.format(new Date(para.endTime),
          'yyyy/MM/dd')); //开始时间

        window.location.href = process.env.API_ROOT + "/admin/activity/downSumDetailExcelByMid" + "?" +
          "start_time=" + para.startTime + "&" + "end_time=" + para.endTime;
      },
      //订单状态
      receive_card_status: function (row, column) {
        return row.receive_card_status == 'Y' ? '领卡成功' : row.receive_card_status == 'N' ? '领卡失败' : '未知';
      },
      //时间转化
      gmt_create: function (row, column) {
        return row.gmt_create = util.formatDate.format(new Date(row.gmt_create), 'yyyy/MM/dd');
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList();
      },
      getUsers() {
        this.page = 1
        this.getList()
      },
      //获取用户列表
      getList() {
        let para = {
          pagNum: String(this.page),
          start_time: this.filters.startTime,
          end_time: this.filters.endTime,
          sid: this.filters.value.toString(),
          numPerPage: '20'
        };
        para.start_time = (!para.start_time || para.start_time == '') ? '' : String(util.formatDate.format(new Date(
          para.start_time), 'yyyy/MM/dd')); //开始时间
        para.end_time = (!para.end_time || para.end_time == '') ? '' : String(util.formatDate.format(new Date(para.end_time),
          'yyyy/MM/dd')); //开始时间
        this.listLoading = true;
        queryActivePur(para).then((res) => {
          this.total = res.data.totalCount;
          this.users = res.data.activeProductList;
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
