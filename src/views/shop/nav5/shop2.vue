<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-form :inline="true" :model="filters">
				<el-form-item label="订单状态">
					<template>
					  <el-select v-model="filters.status" class="fixed_search_input" clearable placeholder="订单状态">
					    <el-option
					      v-for="item in statusOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					</template>
				</el-form-item>
				<el-form-item style="float:right">
					<el-button type="primary" @click="getUsers" round>查询</el-button>
				</el-form-item>
			</el-form>
		</el-row>

		<!--列表-->
		<div v-loading="listLoading">
			<el-table :data="users" border highlight-current-row style="width: 100%;">
				<el-table-column prop="name" label="姓名" min-width="120">
				</el-table-column>
				<el-table-column prop="phone" label="联系电话" min-width="140">
				</el-table-column>
				<el-table-column prop="product_name" label="商品名称" min-width="180">
				</el-table-column>
				<el-table-column prop="order_id" label="订单号" min-width="280">
				</el-table-column>
				<el-table-column prop="status" label="状态" min-width="100" :formatter="status">
				</el-table-column>
				<el-table-column prop="creat_time" label="创建时间" min-width="160"  :formatter="creat_time">
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
	import { queryShopOrderList } from '../../../api/shop';
	export default {
		data() {
			return {
				filters: {
					status: ''
				},
				statusOptions: [ {
					value: '1',
					label: '已兑换'
				}, {
					value: '2',
					label: '已核销'
				}],
				users: [],
				total: 0,
				page: 1,
				listLoading:false
			}
		},
		methods: {
			//状态转化
			status:function (row,column) {
				return row.status == 0 ? '创建' : row.status == 1 ? '已兑换' : row.status == 2 ? '已核销' : '未知';
			},
			//时间转化
			creat_time:function (row, column) {
				return row.creat_time=util.formatDate.format(new Date(row.creat_time), 'yyyy-MM-dd hh:mm:ss');
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
					status: this.filters.status
				};
				this.listLoading = true;
				queryShopOrderList(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.shopOrderList;
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
