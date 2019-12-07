<template>
  <section>
    <el-row>
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item label="日期时间">
          <el-date-picker v-model="filters.startTime" class="fixed_search_input_date" :editable="false" :clearable="false" type="date" placeholder="请选择开始时间" :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.endTime" class="fixed_search_input_date" :editable="false" :clearable="false" type="date" placeholder="请选择结束时间" :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item> -->
        <!-- <el-form-item label="门店名称">
          <el-select v-model="filters.state1" placeholder="门店名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="storeLoading" clearable @visible-change="clickShop">
            <el-option v-for="item in optionsMers" :key="item.id" :value="item.id" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="支付方式">
          <el-select v-model="filters.payType" class="fixed_search_input" clearable placeholder="支付方式">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item style="float:right">
          <el-button type="primary" @click="getUsers(true)" round>查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="fileName" label="文件名">
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="orderType" label="订单类型">
        </el-table-column>
        <el-table-column prop="payWay" label="支付方式">
        </el-table-column>
        <el-table-column prop="statusMsg" label="状态">
        </el-table-column>
        <el-table-column label="操作" width="85">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" :disabled="scope.row.status !== 1" @click="downLoadClick(scope.$index, scope.row)">下载</el-button>
          </template>
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
  import * as data from '../../../util/data.js'
  import {
    queryDownloadFileUrl,
    downloadExcelFile,
    selectStoreList
  } from '../../../api/shop';

  export default {
    data() {
      return {
        //时间控制
        pickerOptions1: {
          disabledDate: (time) => {
            let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.filters.endTime),
              'yyyy-MM-dd')));
            if (time.getTime() > startTimeOne || time.getTime() < startTimeOne - 3600 * 1000 * 24 * 90) {
              return true;
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.filters.startTime),
              'yyyy-MM-dd')));
            if (time.getTime() > startTimeOne + 3600 * 1000 * 24 * 90 || time.getTime() < startTimeOne - 3600 * 1000 *
              24 * 1) {
              return true;
            }
          }
        },
        options: data.optionsPaymentCopy,
        //商户查询
        optionsMers: [],
        //商户名
        filters: {
          state1: '',
          payType: '',
          startTime: new Date() - 24 * 60 * 60 * 1000,
          endTime: new Date() - 24 * 60 * 60 * 1000
        },
        storeLoading: false,
        users: [],
        page: 1,
        total: null,
        listLoading: false
      }
    },
    methods: {
        downLoadClick(index, row){
          window.open(`${row.fileUrl}`)
        },
      //门店远程搜索
      clickShop: function () {
        selectStoreList().then((res) => {
          let {
            status,
            data
          } = res
          this.optionsMers = data.storeList
        })
      },
      remoteShop(query) {
        if (query !== '') {
          this.storeLoading = true;
          setTimeout(() => {
            this.storeLoading = false;
            selectStoreList({
              sname: query
            }).then((res) => {
              let {
                status,
                data
              } = res
              this.optionsMers = data.storeList
            })
          }, 200);
        } else {
          this.optionsMers = [];
        }
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList()
      },
      getList() {
        let para = {
          pageNum: this.page,
          mid: parseInt(sessionStorage.getItem('mid'))
        //   payType: this.filters.payType,
        //   startTime: this.filters.startTime,
        //   endTime: this.filters.endTime,
        };
        // para.startTime = (!para.startTime || para.startTime == '') ? '' : util.formatDate.format(new Date(para.startTime),
        //   'yyyy-MM-dd');
        // para.endTime = (!para.endTime || para.endTime == '') ? '' : util.formatDate.format(new Date(para.endTime),
        //   'yyyy-MM-dd');
        this.listLoading = true;
        queryDownloadFileUrl(para).then((res) => {
          this.listLoading = false;
          if (res.status == 200) {
            this.total = res.data.totalCount;
            this.users = res.data.downloadFileUrlList;
          }
        });
      },
      //获取用户列表
      getUsers() {
        this.page = 1
        this.getList()
      }
    },
    mounted() {
      this.getUsers();
    }
  }

</script>
