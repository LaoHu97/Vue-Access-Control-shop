<style scoped>
.box-card{
	margin-bottom: 20px;
}
</style>
<template>
	<section>
		<div>
			<el-row :gutter="20">
				<el-col :span="6">
					<el-card class="box-card">
						<div slot="header">
							<span>充值金额</span>
						</div>
						<div>
							￥{{userInfo.sum_deposite}}元
						</div>
					</el-card>
				</el-col>
				<el-col :span="6">
					<el-card class="box-card">
						<div slot="header">
							<span>充值笔数</span>
						</div>
						<div>
							{{userInfo.stroke_number}}笔
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
		<!--工具条-->
		<el-row>
			<el-form :inline="true" :model="filters" ref="filters">
				<el-form-item label="订单号">
					<el-input v-model="filters.order_id" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item label="支付方式">
					<el-select v-model="filters.pay_way" placeholder="请选择">
						<el-option
							v-for="item in payWayOptions"
							:key="item.valueScene"
							:label="item.labelScene"
							:value="item.valueScene">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="日期时间">
          <el-date-picker
            v-model="filters.queryDate"
            type="daterange"
            range-separator="至"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
				</el-form-item>
				<!-- <el-form-item label="充值通道">
					<el-select v-model="filters.scence" placeholder="请选择">
						<el-option value="POS" label="POS机"></el-option>
						<el-option value="MEMCARD" label="会员卡"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input v-model="filters.order_id" placeholder="手机号"></el-input>
				</el-form-item> -->
				<el-form-item label="交易状态">
					<el-select v-model="filters.status" placeholder="请选择">
						<el-option value="1" label="支付成功"></el-option>
						<el-option value="2" label="支付失败"></el-option>
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
			<el-table :data="users" highlight-current-row style="width: 100%;" border>
				<el-table-column prop="order_id" label="订单号">
				</el-table-column>
				<el-table-column prop="card_barcode" label="会员卡号">
				</el-table-column>
				<el-table-column prop="name" label="会员名称">
				</el-table-column>
				<el-table-column prop="phone" label="电话号码">
				</el-table-column>
				<el-table-column prop="amount" label="充值金额">
				</el-table-column>
				<el-table-column prop="pay_way" label="支付方式" :formatter="formatterPayWay">
				</el-table-column>
				<el-table-column prop="pay_time" label="支付时间" :formatter="formatterDate">
				</el-table-column>
				<el-table-column prop="status" label="交易状态" :formatter="formatterStatus">
				</el-table-column>
				<el-table-column prop="scence" label="充值通道" :formatter="formatterScence">
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
	import qs from 'qs'
	import * as util from '../../../util/util.js'
	import { optionsPayment } from '../../../util/data'
	import { queryDepositOrderList, exportDepositeToExcel } from '../../../api/shop';
	export default {
		data() {
			return {
				filters: {
          order_id: '',
          queryDate: null,
          pay_way: '',
					scence: '',
					phone: '',
					status: ''
				},
        users: [],
				userInfo: {},
				total: 0,
				page: 1,
				listLoading: false,

				payWayOptions: optionsPayment
			}
		},
		methods: {
			formatterScence(row, column){
				return row.scence === 'POS' ? 'POS机' : row.scence === 'MEMCARD' ? '会员卡' : '未知'
			},
			formatterStatus(row, column){
				return row.status === '0' ? '初始添加' : row.status === '1' ? '支付成功' : row.status === '2' ? '支付失败' : '未知'
			},
			formatterPayWay(row, column){
				return util.formatPayment(row.pay_way)
			},
			formatterDate(row, column){
				return util.dateFormat(row.pay_time)
			},
			clickEx(){
				let para = util.deepcopy(this.filters)
        para.startTime = para.queryDate ? para.queryDate[0].toString() : ''
        para.endTime = para.queryDate ? para.queryDate[1].toString() : ''
        delete para.queryDate
				exportDepositeToExcel(para).then(res => {
					console.log(res);
					
					window.open(res.data.data, "_blank")
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
				let para = util.deepcopy(this.filters)
        para.pageNum = this.page
				para.pageFlag = 'Y'
        para.startTime = para.queryDate ? para.queryDate[0].toString() : ''
        para.endTime = para.queryDate ? para.queryDate[1].toString() : ''
        delete para.queryDate
				queryDepositOrderList(para).then((res) => {
					this.total = res.data.totalMap.stroke_number;
					this.users = res.data.resultList;
					this.userInfo = res.data.totalMap
					this.listLoading = false;
				});
			},
		},
		mounted() {
			this.getUsers()
		}
	}

</script>
