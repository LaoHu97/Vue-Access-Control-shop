<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="whole">
      <el-tag type="primary" style="margin:10px 10px 20px 0;">交易总金额（元）：{{whole.sumAmt}}元</el-tag>
      <el-tag type="primary" style="">交易总笔数（笔）：{{whole.countRow}}笔</el-tag>
    </el-form>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-form-item prop="parag">
        <el-select v-model="filters.parag" placeholder="请选择门店名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="loading" clearable @visible-change="clickShop">
          <el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="time1">
        <el-date-picker v-model="filters.time1" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="time2">
        <el-date-picker v-model="filters.time2" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
        </el-date-picker>
      </el-form-item>
      <el-tag type="gray">可查询最近三个月的信息</el-tag>
      <el-form-item style="float: right;">
        <el-button type="primary" v-on:click="getUsers" size="medium" round>查询</el-button>
        <el-button @click="resetForm('filters')" size="medium" round>重置</el-button>
        <el-button type="text" @click="downExcel()"><i class="el-icon-date"></i>导出Excel</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <!--列表-->
  <div v-loading="listLoading">
    <el-table :data="users" border highlight-current-row>
      <el-table-column prop="storeName" label="门店名称" min-width="200">
      </el-table-column>
      <el-table-column prop="countRow" label="交易笔数" min-width="200">
      </el-table-column>
      <el-table-column prop="sumAmt" label="交易金额" min-width="200">
      </el-table-column>
      <el-table-column prop="sumFactorage" label="手续费" min-width="200">
      </el-table-column>
      <el-table-column prop="sumSur" label="结算金额" min-width="200">
      </el-table-column>
    </el-table>
  </div>

  <!--工具条-->
  <el-row>
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
    </el-pagination>
  </el-row>

</section>
</template>

<script>
import * as util from '../../../util/util.js'
import {
  getUserList,
  lookupUser,
  downOrderSumExcel,
  selectStoreList
} from '../../../api/shop';

export default {
  data() {
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
      //商户名
      loading: false,
      filters: {
        parag: '',
        time1: Date(),
        time2: Date(),
      },
      whole: {
        sumAmt: "",
        countRow: ""
      },
      options: [],
      total: 0,
      page: 1,
      users: [],
      listLoading: false,

    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //门店远程搜索
    clickShop:function () {
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
    downExcel: function(folder, fileName) {
      if (this.filters.time1 !== "") {
        var d = new Date(this.filters.time1);
        var a1 = d.getFullYear();
        var a2 = (d.getMonth() + 1);
        var a3 = d.getDate();
        if (a2 < 10 && a3 < 10) {
          a2 = "0" + a2;
          a3 = "0" + a3;
        } else if (a2 < 10) {
          a2 = "0" + a2;
        } else if (a3 < 10) {
          a3 = "0" + a3;
        }
        var starttime = a1 + "-" + a2 + "-" + a3;
      } else {
        this.filters.time1 = "";
      }
      if (this.filters.time2 !== "") {
        var e = new Date(this.filters.time2);
        var b1 = e.getFullYear();
        var b2 = (e.getMonth() + 1);
        var b3 = e.getDate();
        if (b2 < 10 && b3 < 10) {
          b2 = "0" + b2;
          b3 = "0" + b3;
        } else if (b2 < 10) {
          b2 = "0" + b2;
        } else if (b3 < 10) {
          b3 = "0" + b3;
        }
        var endtime = b1 + "-" + b2 + "-" + b3;
      } else {
        this.filters.time2 = ""
      };
      let para = {
        storeId: this.filters.parag,
        endTime: endtime,
        startTime: starttime
      };
      downOrderSumExcel(para).then((res) => {
        var url = res.request.responseURL;
        window.location.href = url;
      })
    },
    //获取用户列表
    getUsers() {
      if (this.filters.time1 !== "") {
        var d = new Date(this.filters.time1);
        var a1 = d.getFullYear();
        var a2 = (d.getMonth() + 1);
        var a3 = d.getDate();
        if (a2 < 10 && a3 < 10) {
          a2 = "0" + a2;
          a3 = "0" + a3;
        } else if (a2 < 10) {
          a2 = "0" + a2;
        } else if (a3 < 10) {
          a3 = "0" + a3;
        }
        var starttime = a1 + "-" + a2 + "-" + a3;
      } else {
        this.filters.time1 = "";
      }
      if (this.filters.time2 !== "") {
        var e = new Date(this.filters.time2);
        var b1 = e.getFullYear();
        var b2 = (e.getMonth() + 1);
        var b3 = e.getDate();
        if (b2 < 10 && b3 < 10) {
          b2 = "0" + b2;
          b3 = "0" + b3;
        } else if (b2 < 10) {
          b2 = "0" + b2;
        } else if (b3 < 10) {
          b3 = "0" + b3;
        }
        var endtime = b1 + "-" + b2 + "-" + b3;
      } else {
        this.filters.time2 = ""
      }
      //this.filters.time2=Date();
      let para = {
        mid: this.mid,
        pageNum: this.page,
        startTime: starttime,
        endTime: endtime,
        storeId: String(this.filters.parag)
      };
      lookupUser().then((res) => {
        var _this = this;
        let {
          status,
          message
        } = res;
        if (status == 200) {
          this.options = res.data.storeList;
        }
      });
      this.listLoading = true;
      getUserList(para).then((res) => {
        var _this = this;
        let {
          data,
          message,
          status
        } = res;
        if (status == 200) {
          this.total = res.data.totalCount;
          this.filters.time1 = res.data.returnST;
          this.whole.countRow = res.data.countRow;
          this.whole.sumAmt = res.data.sumAmt;
          this.users = res.data.summaryList;
          this.listLoading = false;
        }
      });
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //重置按钮
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  mounted() {
    this.getUsers();
  }
}
</script>

<style scoped>

</style>
