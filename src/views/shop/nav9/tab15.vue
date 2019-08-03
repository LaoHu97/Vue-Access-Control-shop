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
      <el-form-item label="计次卡号">
        <el-input v-model="filters.card_no" class="fixed_search_input" placeholder="计次卡号"></el-input>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="getUsers" round>查询</el-button>
        <el-button type="primary" @click="dialogClick" round>核销计次卡</el-button>
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
    <el-table-column prop="code" label="计次卡号" min-width="120">
    </el-table-column>
    <el-table-column prop="reserve" label="核销码" min-width="120">
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
    <el-dialog title="核销计次卡" :visible.sync="dialogVisible" :close-on-click-modal="false">
			<el-form label-position="left">
        <el-form-item label="所属门店">
          <el-select
            v-model="sid"
            placeholder="门店名称"
            :multiple="false"
            filterable
            remote
            :remote-method="remoteStore"
            :loading="searchLoading"
            clearable
            @focus="clickStore"
          >
            <el-option
              v-for="item in optionsStore"
              :key="item.id"
              :value="item.id"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
				<el-input v-model="cardinput" placeholder="请输入核销码" class="nav4_tab5_input"><el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button></el-input>
			</el-form>
			<el-row class="cardinput" :gutter="50" v-if="displayCard">
        <el-col :span="8"><img src="http://s.404.cn/tpl/static/card/images/new/demo_card.png" alt="示例" width="100%"></el-col>
        <el-col :span="16">
          <el-steps :space="120" direction="vertical" :active="1">
            <el-step title="搜索卡券" description="请顾客出示卡券，输入卡券号"></el-step>
            <el-step title="校检" description="微信提供有效期验证，其他信息请自行核对"></el-step>
            <el-step title="销券完成" description="查看销券结果，顾客将同时收到销券成功通知"></el-step>
          </el-steps>
        </el-col>
			</el-row>
			<div class="cardResult" v-else>
				<div class="cardResult-top">
					<img :src="logoUrl" alt="" width="118px">
					<div class="card_contract">
						<span>{{status === '1' ? '可核销': status === '2' ? '已失效' : '未知'}}</span>
						<el-button type="text" @click="moreClick01" v-if="moreClick" style="float:right;padding-right:15px;">展开更多<i class="el-icon-caret-bottom"></i></el-button>
						<el-button type="text" @click="moreClick02" v-else style="float:right;padding-right:15px;">收起更多<i class="el-icon-caret-top"></i></el-button>
						<p style="font-weight:bold">{{title}}</p>
						<p><span>有效期：</span>{{startTime}}至{{endTime}}</p>
						<p><span>计次卡号：</span>{{code}}</p>
					</div>
				</div>
				<i style="width:100%;height:1px;display:block;background-color:#bfcbd9"></i>
				<div class="cardResult-center" v-if="displaycardResult">
					<p>使用须知：<span style="font-weight:normal">{{description}}</span></p>
				</div>
				<span slot="footer" style="margin-left:45%">
			    <el-button type="primary" @click="submitClick">确定销券</el-button>
					<p style="text-align:center">卡券核销后不可撤回</p>
			  </span>
			</div>
    </el-dialog>
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
  checkVerCode,
  selectStoreListNew,
  queryCodeNew,
  consumeCodeNew
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
      listLoading: false,

        dialogVisible: false,
        cardinput:'',
				displayCard:true,
				displaycardResult:false,
				moreClick:true,
				//数据
				id:'',
				logoUrl:'',
				status:'',
				title:'',
				startTime:'',
				endTime:'',
				code:'',
				description:'',

				optionsStore: [],
				sid: '',
				searchLoading: false
    }
  },
  methods: {
			statusformatter:function (row,column) {
				return row.status === '1' ? '已领取' : row.status === '2' ? '已核销' : '未知';
			},
			//核销方式
			consume_source:function (row,column) {
				return row.consume_source == 'FROM_API' ? 'API核销' : row.consume_source == 'FROM_MP' ? '公众平台核销' : row.consume_source == 'FROM_MOBILE_HELPER' ? '卡券商户助手核销' : '未核销';
			},
			//卡劵核销时间
			update_time:function (row,column) {
					return row.update_time=util.formatDate.format(new Date(row.update_time), 'yyyy-MM-dd hh:mm:ss')
			},
			dialogClick:function () {
				this.dialogVisible=true;
				this.cardinput='';
				this.displayCard=true;
			},
			//核销卡券
			moreClick01(){
				this.displaycardResult=true;
				this.moreClick=false;
			},
			moreClick02(){
				this.displaycardResult=false;
				this.moreClick=true;
			},
			searchClick(){
				if (!this.sid) {
					return this.$message({
						message: '请先选择门店',
						type: 'warning'
					});
				}
				let para={
					code:this.cardinput,
					sid: this.sid,
          sign: 'WD_FREQ'
				}
				queryCodeNew(para).then((res)=>{
					let {status,message}=res;
					if (status==200) {
						this.displayCard=false;
						this.id=res.data.resultMap.id;
						this.logoUrl=res.data.resultMap.logoUrl;
						this.status=res.data.resultMap.status;
						this.title=res.data.resultMap.title;
						if (res.data.resultMap.code.length === 12) {
							this.startTime=util.formatDate.format(new Date(res.data.resultMap.startTime*1000), 'yyyy-MM-dd');
							this.endTime=util.formatDate.format(new Date(res.data.resultMap.endTime*1000), 'yyyy-MM-dd');;
						}else{
							this.startTime=util.formatDate.format(new Date(res.data.resultMap.startTime), 'yyyy-MM-dd');
							this.endTime=util.formatDate.format(new Date(res.data.resultMap.endTime), 'yyyy-MM-dd');;
						}
						this.code=res.data.resultMap.code;
						this.description=res.data.resultMap.description;
					}else {
						this.$message.error(message);
					}
				})
			},
			clickStore: function() {
				this.searchLoading = true;
				selectStoreListNew({
					title: "",
					use_all_locations: 'N'
				}).then(res => {
					this.searchLoading = false;
					let { status, data } = res;
					this.optionsStore = data.storeList;
				});
			},
			remoteStore(query) {
				if (query !== "") {
					this.searchLoading = true;
					setTimeout(() => {
						this.searchLoading = false;
						selectStoreListNew({
							title: query,
							use_all_locations: 'N'
						}).then(res => {
							let { status, data } = res;
							this.optionsStore = data.storeList;
						});
					}, 200);
				} else {
					this.optionsStore = [];
				}
			},
			submitClick(){
				let para={
					id:this.id,
					code:this.cardinput,
					sid: this.sid,
          sign: 'WD_FREQ'
				}
				consumeCodeNew(para).then((res)=>{
					let {status,message}=res;
					if (status==200) {
						this.dialogVisible=false;
						this.getUsers();
						this.$notify({
						title: '成功',
						message: message,
						type: 'success'
					});
				}else {
					this.$notify.error({
					title: '错误',
					message: message
					});
				}
				})
			},
    //时间转化
    creat_stamp: function(row, column) {
      return util.formatDate.format(new Date(row.use_time), 'yyyy/MM/dd hh:mm:ss');
    },
    formatterStatus: function(row) {
      return row.status === '2' ? '成功' : row.status === '1' ? '失败' : '未知'
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
.cardinput{
  padding-top: 50px;
}
.cardResult{
	margin-top: 50px;
	border: 1px solid #bfcbd9;
	display: inline-table;
	width: 100%;
	border-radius: 4px;
}
.cardResult-top{
	width: 100%;
}
.cardResult-top img{
	padding: 15px;
	float: left;
}
.card_contract{
	text-align: center;
	padding-top: 15px;
}
.card_contract span{
	font-weight: bold;
}
.card_contract p{
	text-align: left;
}
.cardResult-center{
	padding: 15px;
}
.cardResult-center p{
	font-weight: bold;
}
</style>
