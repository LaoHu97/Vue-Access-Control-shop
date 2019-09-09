<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-form :inline="true" :model="filters" ref="filters">
				<el-form-item label="卡券名称">
					<el-input v-model="filters.title" placeholder="卡券名称"></el-input>
				</el-form-item>
				<el-form-item label="卡券号码">
					<el-input v-model="filters.code" placeholder="卡券号码"></el-input>
				</el-form-item>
				<el-form-item label="日期时间">
					<el-date-picker
						v-model="filters.dateTime"
						type="datetimerange"
						value-format="timestamp"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:default-time="['00:00:00', '23:59:59']">
					</el-date-picker>
				</el-form-item>
        <el-form-item label="所属门店">
          <el-select
            v-model="filters.sid"
            placeholder="门店名称"
            :multiple="false"
            filterable
            remote
            :remote-method="remoteTopStore"
            :loading="searchTopLoading"
            clearable
            @focus="clickTopStore"
          >
            <el-option
              v-for="item in optionsTopStore"
              :key="item.id"
              :value="item.id"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
				<el-form-item style="float:right">
					<el-button type="primary" @click="getUsers" round>查询</el-button>
					<el-button type="primary" @click="dialogClick" round>核销卡券</el-button>
					<el-button type="text" @click="clickEx" round>下载报表</el-button>
				</el-form-item>
			</el-form>
		</el-row>
    <el-dialog title="卡券核销" :visible.sync="dialogVisible" :close-on-click-modal="false">
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
				<el-input v-model="cardinput" placeholder="请输入卡券号" class="nav4_tab5_input"><el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button></el-input>
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
						<p><span>序列号：</span>{{code}}</p>
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
		<!--列表-->
		<div v-loading="listLoading">
			<el-table :data="users" highlight-current-row style="width: 100%;" border>
				<el-table-column prop="title" label="卡券名称">
				</el-table-column>
				<el-table-column prop="code" label="卡券号">
				</el-table-column>
				<el-table-column prop="card_type" label="卡券类型" :formatter="card_type">
				</el-table-column>
				<el-table-column prop="stoName" label="核销门店">
				</el-table-column>
				<el-table-column prop="use_time" label="核销时间" :formatter="update_time">
				</el-table-column>
				<el-table-column prop="receiveType" label="领取渠道" :formatter="formatterReceiveType">
				</el-table-column>
				<el-table-column prop="receiveOrder" label="订单号">
				</el-table-column>
				<el-table-column prop="memName" label="会员名称">
				</el-table-column>
				<el-table-column prop="memPhone" label="会员手机号">
				</el-table-column>
				<el-table-column prop="consume_source" label="核销方式" :formatter="consume_source">
				</el-table-column>
				<el-table-column prop="status" label="核销状态" :formatter="statusformatter">
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
	import { queryCodeNew, consumeCodeNew, queryConsumeListNew, selectStoreListNew, exportConsumeCountList } from '../../../api/shop';
	export default {
		data() {
			return {
				users: [],
				filters: {
					title: '',
					code:'',
					dateTime: null,
					sid: ''
				},
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
				searchLoading: false,

				optionsTopStore: [],
				searchTopLoading: false
			}
		},
		methods: {
      formatterReceiveType(row,column) {
        return row.receiveType === 'TB' ? '团购' : row.receiveType === 'CZ' ? '充值' : row.receiveType === 'DH' ? '积分兑换' : row.receiveType === 'CZLK' ? '充值领卡' : row.receiveType === 'CONSUME' ? '消费送劵': row.receiveType === 'PB' ? '拼购' : '未知'
      },
      card_type: function(row, column) {
        return row.card_type == "GIFT"
          ? "兑换券"
          : row.card_type == "GENERAL_COUPON"
          ? "优惠券"
          : row.card_type == "GROUPON"
          ? "团购券"
          : row.card_type == "CASH"
          ? "代金券"
          : row.card_type == "DISCOUNT"
          ? "折扣券"
          : row.card_type == "FREQUENCY"
          ? "计次卡"
          : row.card_type == "WDGIFT_COUPON"
          ? "礼包券"
          : row.card_type == "CZSJ"
          ? "充值送劵"
          : "未知";
      },
			statusformatter:function (row,column) {
				return row.status === '1' ? '已领取' : row.status === '2' ? '已核销' : '未知';
			},
			//核销方式
			consume_source:function (row,column) {
				return row.consume_source == 'FROM_API' ? 'API核销' : row.consume_source == 'FROM_MP' ? '公众平台核销' : row.consume_source == 'FROM_MOBILE_HELPER' ? '卡券商户助手核销' : '未核销';
			},
			//卡劵核销时间
			update_time:function (row,column) {
				return util.formatDate.format(new Date(row.use_time), 'yyyy-MM-dd hh:mm:ss')
			},
			clickEx(){
				let para = util.deepcopy(this.filters)
				para.excelType = '5'
				exportConsumeCountList(para).then(res => {
					window.open(res.data, "_blank")
				})
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
					sign: 'WX'
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
			clickTopStore: function() {
				this.searchTopLoading = true;
				selectStoreListNew({
					title: "",
					use_all_locations: 'Y'
				}).then(res => {
					this.searchTopLoading = false;
					let { status, data } = res;
					this.optionsTopStore = data.storeList;
				});
			},
			remoteTopStore(query) {
				if (query !== "") {
					this.searchTopLoading = true;
					setTimeout(() => {
						this.searchTopLoading = false;
						selectStoreListNew({
							title: query,
							use_all_locations: 'Y'
						}).then(res => {
							let { status, data } = res;
							this.optionsTopStore = data.storeList;
						});
					}, 200);
				} else {
					this.optionsTopStore = [];
				}
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
					sign: 'WX'
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
			//分页
			handleCurrentChange(val) {
				this.page = val;
				this.getList();
			},
			getUsers(){
				this.page = 1
				this.getList()
			},
			//查询会员卡列表
			getList() {
				this.listLoading = true;
				let para={
					pagNum: this.page,
					title:this.filters.title,
					code:this.filters.code,
					dateTime: this.filters.dateTime,
					sid: this.filters.sid
				};
				queryConsumeListNew(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.receiveCouponList;
					this.listLoading = false;
				});
			},
			//上传微信
			uploadWinxin:function (index,row) {
				let para={
					id:row.id
				}
				uploadCreatCard(para).then((res)=>{
					let {status,message}=res;
					if (status==200) {
						this.$notify({
							title: '成功',
							message: message,
							type: 'success'
						});
						this.getUsers()
					}else {
						this.$notify.error({
							title: '错误',
							message: message
						});
					}
				})
			}
		},
		mounted() {
			this.getUsers()
		}
	}

</script>

<style scoped>
.demo-table-expand {
	font-size: 0;
}
.demo-table-expand label {
	width: 90px;
	color: #99a9bf;
}
.demo-table-expand .el-form-item {
	margin-right: 0;
	margin-bottom: 0;
	width: 50%;
}
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
