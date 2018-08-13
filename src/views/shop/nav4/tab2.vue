<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers" round><i class="fa fa-refresh fa-fw"></i>同步</el-button>
				</el-form-item>
			</el-form>
		</el-row>

		<!--列表-->
		<div>
			<el-table :data="users" border highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column prop="mname" label="门店名称" min-width="100">
				</el-table-column>
				<el-table-column prop="address" label="门店地址" min-width="100">
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
	import { synStoreList, queryStoreList} from '../../../api/shop';

	export default {
		data() {
			return {
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				let para = {
					pageNum: this.page,
				};
				this.listLoading = true;
				queryStoreList(para).then((res) => {
					this.total = res.data.map.totalCount;
					this.users = res.data.map.storeList
					this.listLoading = false;
				});
			},
			//获取用户列表
			getUsers() {
				synStoreList().then((res)=>{
					let {status,message}=res;
					if (status==200) {
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
				this.page = 1
				let para = {
					pageNum: this.page,
				};
				this.listLoading = true;
				queryStoreList(para).then((res) => {
					this.total = res.data.map.totalCount;
					this.users = res.data.map.storeList
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
