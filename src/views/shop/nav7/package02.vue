<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="filters">
      <el-form-item label="会员姓名">
        <el-input v-model="filters.name" class="fixed_search_input" placeholder="会员姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="filters.phone" class="fixed_search_input" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item label="会员卡号">
        <el-input v-model="filters.cardnum" class="fixed_search_input" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="getUsers" round>查询</el-button>
        <el-button type="text" @click="downExcel()"><i class="el-icon-date"></i>导出Excel</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <div v-loading="listLoading">
    <el-table :data="users" border highlight-current-row style="width: 100%;">
      <el-table-column prop="inviter_name" label="邀请人" min-width="120">
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" min-width="120">
      </el-table-column>
      <el-table-column prop="inviter_code" label="邀请码" min-width="95">
      </el-table-column>
      <el-table-column prop="card_num" label="会员卡号" min-width="120">
      </el-table-column>
      <el-table-column prop="commission" label="提成金额" min-width="95" :formatter="commission">
      </el-table-column>
      <el-table-column prop="dividend" label="分红金额" min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.dividend}}</span>
          <el-button type="warning" size="mini" @click="dividendClick(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="sum_invitee" label="邀请成功" min-width="100">
      </el-table-column>
      <el-table-column prop="intentSum" label="意向客户" min-width="100">
      </el-table-column>
      <el-table-column prop="store_name" label="操作" width="100">
        <template slot-scope="scope">
            <el-button type="info" size="mini" @click="seeClick(scope.$index, scope.row)">邀请详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!--工具条-->
  <el-row>
    <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
    </el-pagination>
  </el-row>
<el-dialog title="已邀请人" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
  <el-form :inline="true" :model="dialog">
    <el-form-item prop="status">
      <template>
      <el-select v-model="dialog.status" placeholder="请选择" @change="getDialogChange">
        <el-option
          v-for="item in dialogOptions"
          :key="item.id"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </template>
    </el-form-item>
    <el-form-item style="float:right">
      <el-button type="primary" v-on:click="getDialogUsers">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table border :data="gridData">
    <el-table-column property="gmt_create" label="日期" :formatter="gmt_create"></el-table-column>
    <el-table-column property="name" label="姓名"></el-table-column>
    <el-table-column property="pkg_name" label="套餐" v-if="dialog.status=='2'"></el-table-column>
  </el-table>
  <el-row>
    <el-pagination layout="prev, pager, next" @current-change="dialogHandleCurrentChange" :page-size="20" :total="dialogTotal" style="float:right;">
    </el-pagination>
  </el-row>
</el-dialog>
</section>
</template>

<script>
import * as util from '../../../util/util.js'
// import currency from 'currency'
//
import {
  queryPkgInviterByCondition,
  getPkgProductList,
  queryIntention,
  updatePkgInviterById,
  downPkgInviterExcel
} from '../../../api/shop';
export default {
  data() {
    return {
      filters: {
        name:'',
        phone:'',
        cardnum:''
      },
      dialog: {
        status:'2'
      },
      dialogOptions:[{
          value: '2',
          label: '邀请成功'
        }, {
          value: '1',
          label: '意向客户'
        }],
      users: [],
      total: 0,
      page: 1,
      dialogpage:1,
      listLoading: false,
      dialogTableVisible:false,
      gridData: [],
      dialogTotal:0,
      id:''
    }
  },
  methods: {
    commission:function (row,column) {
      return String(row.commission)
    },
    //订单状态
    status: function(row, column) {
      return row.status == 3 ? '退款成功' : row.status == 1 ? '支付成功' : row.status == 2 ? '支付失败' : '未知';
    },
    //时间转化
    gmt_create: function(row, column) {
      return row.gmt_create = util.formatDate.format(new Date(row.gmt_create), 'yyyy/MM/dd hh:mm:ss');
    },
    dividendClick(index, row){
      console.log(row)
      this.$prompt('请输入分红（单位元）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
        inputErrorMessage: '金额格式不正确'
      }).then(({ value }) => {
        let para = {
          inviter_id:String(row.id),
          dividend:value
        }
        updatePkgInviterById(para).then((res)=>{
          if (res.status==200) {
            this.$message({
              type: 'success',
              message: '修改分红金额为: ' + value
            });
            this.getUsers()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    getDialogChange(row){
      let para = {
        pagNum: String(this.dialogpage),
        inviterid:String(this.id),
        status:this.dialog.status
      }
      queryIntention(para).then((res)=>{
        this.dialogTotal = res.data.totalCount;
        this.gridData=res.data.inviteeList
      })
    },
    getDialogUsers(){
      let para = {
        pagNum: String(this.dialogpage),
        inviterid:String(this.id),
        status:this.dialog.status
      }
      queryIntention(para).then((res)=>{
        this.dialogTotal = res.data.totalCount;
        this.gridData=res.data.inviteeList
      })
    },
    seeClick(index, row){
      this.dialogTableVisible=true
      this.id = row.id
      let para = {
        pagNum: String(this.dialogpage),
        inviterid:String(this.id),
        status:this.dialog.status
      }
      queryIntention(para).then((res)=>{
        this.dialogTotal = res.data.totalCount;
        this.gridData=res.data.inviteeList
      })
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    dialogHandleCurrentChange(val){
      this.dialogpage=val
    },
    //导出Excel
    downExcel(){
      let para={
        name:this.filters.name,
        phone:this.filters.phone,
        card_num:this.filters.cardnum
      }
      console.log(downPkgInviterExcel);
      
      window.location.href= process.env.API_ROOT + downPkgInviterExcel + "?name=" +para.name+'&phone='+para.phone+'&card_num='+para.card_num;
    },
    getUsers(){
      this.page = 1
      this.getList()
    },
    //获取用户列表
    getList() {
      let para = {
        pagNum: String(this.page),
        name:this.filters.name,
        phone:this.filters.phone,
        card_num:this.filters.cardnum
      };
      this.listLoading = true;
      queryPkgInviterByCondition(para).then((res) => {
        this.total = res.data.totalCount;
        this.users = res.data.pkgInviterList;
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
