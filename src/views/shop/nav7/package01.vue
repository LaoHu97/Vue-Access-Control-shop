<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="日期时间">
          <el-date-picker v-model="filters.startTime" type="datetime" class="fixed_search_input_datetime" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.endTime" type="datetime" class="fixed_search_input_datetime" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择套餐">
          <el-select v-model="filters.pkg_id" class="fixed_search_input" placeholder="选择套餐" clearable>
            <el-option v-for="item in pkg_idOptions" :key="item.id" :label="item.pkg_name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="红包状态">
          <el-select v-model="filters.redpackets" class="fixed_search_input" placeholder="红包状态" clearable>
            <el-option v-for="item in redpacketsOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领卡状态">
          <el-select v-model="filters.cardstatus" class="fixed_search_input" placeholder="领卡状态" clearable>
            <el-option v-for="item in cardstatusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
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
        <el-table-column prop="nick_name" label="购买人" min-width="140">
        </el-table-column>
        <el-table-column prop="pkg_name" label="套餐名称" min-width="140">
        </el-table-column>
        <el-table-column prop="commission" label="提成金额" min-width="120" :formatter="commission">
        </el-table-column>
        <el-table-column prop="gmt_create" label="交易时间" min-width="170" :formatter="gmt_create">
        </el-table-column>
        <el-table-column prop="pkgStatus" label="套餐激活状态" min-width="120" :formatter="pkgStatus">
        </el-table-column>
        <el-table-column prop="receive_card_status" label="领卡状态" width="110">
          <template slot-scope="scope">
            <el-button :type="scope.row.receive_card_status == 'Y' ? 'info' : 'success'" size="mini" @click="cardClick(scope.$index, scope.row)" :disabled="scope.row.receive_card_status == 'Y'">
              {{ scope.row.receive_card_status == 'Y' ? '领卡成功' : '现在领卡' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="红包状态" width="110">
          <template slot-scope="scope">
            <el-button :type="scope.row.send_red_status !=='N' ? 'info' : 'success'" size="mini" @click="sendRedClick(scope.$index, scope.row)" :disabled="scope.row.send_red_status!=='N'">
              {{ scope.row.send_red_status == 'Y' ? '发送成功' : scope.row.send_red_status == 'N' ? '发送失败' : '不发红包' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
    <!-- 二维码 -->
    <el-dialog :visible.sync="receiveCard" :close-on-click-modal="true" width="600px">
      <el-form :model="receive" label-width="" ref="editCode" style="width:auto">
        <img :src="receive.code" alt="二维码" width="100%">
        <el-button type="primary" @click="clickCode" style="position:absolute;left:50%;margin-left:-44px;margin-top:-20px;">点击下载</el-button>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
import * as util from '../../../util/util.js'
// import currency from 'currency'
//
import {
  queryPkgPurchaseByCondition,
  getPkgProductList,
  qRCode,
  updateRedStatus,
  downPkgPurchaseExcel
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
        pkg_id: '',
        startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()),
        endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 23, 59, 59),
        redpackets:'',
        cardstatus:''
      },
      receive: {
        code:''
      },
      receiveCard:false,
      users: [],
      pkg_idOptions: [],
      redpacketsOptions:[{
        value: 'Y',
        label: '发送成功'
      }, {
        value: 'N',
        label: '发送失败'
      }, {
        value: 'B',
        label: '不发红包'
      }],
      cardstatusOptions:[{
        value: 'Y',
        label: '领卡成功'
      }, {
        value: 'N',
        label: '领卡失败'
      }],
      total: 0,
      page: 1,
      listLoading: false
    }
  },
  methods: {
    sendRedClick(index, row){
      this.$confirm('此操作将更改红包状态为发送成功, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateRedStatus({purchaseId:String(row.id)}).then((res)=>{
          if (res.status==200) {
            this.$message({
              type: 'success',
              message: res.message
            });
            this.getUsers()
          }else {
            this.$message({
              type: 'info',
              message: res.message
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    },
    cardClick(index, row){
      this.receiveCard=true
      let para = {
        outer_str: 'purchase',
        purchaseId: row.id
      }
      this.receive.code = process.env.API_ROOT + "/pay/wxcard/qRCode" + "?" + "outer_str=" + para.outer_str + '&purchaseId='+ para.purchaseId
    },
    clickCode(){
      window.location.href = this.receive.code
    },
    commission:function (row,column) {
      return util.number_format(row.commission, 2, ".", ",")
    },
    //激活状态
    pkgStatus:function (row, column) {
      return row.pkgStatus == 1 ? '未激活' : row.pkgStatus == 2 ? '已激活' : row.pkgStatus == 3 ? '已到期' : '未知'
    },
    //时间转化
    gmt_create: function(row, column) {
      return row.gmt_create = util.formatDate.format(new Date(row.gmt_create), 'yyyy/MM/dd hh:mm:ss');
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    //导出Excel
    downExcel(){
      let para={
        pkg_id: String(this.filters.pkg_id),
        start_time: this.filters.startTime,
        end_time: this.filters.endTime,
        send_red_status:this.filters.redpackets,
        receive_card_status:this.filters.cardstatus,
      }
      para.start_time = (!para.start_time || para.start_time == '') ? '' : String(Date.parse(util.formatDate.format(new Date(para.start_time), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
      para.end_time = (!para.end_time || para.end_time == '') ? '' : String(Date.parse(util.formatDate.format(new Date(para.end_time), 'yyyy/MM/dd hh:mm:ss'))); //开始时间

      window.location.href=process.env.API_ROOT + downPkgPurchaseExcel +'?pkg_id=' + para.pkg_id+'&start_time='+para.start_time+'&end_time='+para.end_time+'&send_red_status='+para.send_red_status+'&receive_card_status='+para.receive_card_status;

    },
    //获取套餐列表
    getProductList(){
      getPkgProductList().then((res)=>{
        this.pkg_idOptions=res.data
      })
    },
    getUsers(){
      this.page = 1 
      this.getList()
    },
    //获取用户列表
    getList() {
      let para = {
        pagNum: String(this.page),
        pkg_id: String(this.filters.pkg_id),
        start_time: this.filters.startTime,
        end_time: this.filters.endTime,
        send_red_status:this.filters.redpackets,
        receive_card_status:this.filters.cardstatus,
        numPerPage:'20'
      };
      para.start_time = (!para.start_time || para.start_time == '') ? '' : String(Date.parse(util.formatDate.format(new Date(para.start_time), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
      para.end_time = (!para.end_time || para.end_time == '') ? '' : String(Date.parse(util.formatDate.format(new Date(para.end_time), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
      this.listLoading = true;
      queryPkgPurchaseByCondition(para).then((res) => {
        this.total = res.data.totalCount;
        this.users = res.data.purchaseList;
        this.listLoading = false;
      });
    },
  },
  mounted() {
    this.getUsers();
    this.getProductList();
  }
}
</script>

<style scoped>
</style>
