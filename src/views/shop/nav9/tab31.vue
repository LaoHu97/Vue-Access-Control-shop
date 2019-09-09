<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-form :inline="true" :model="filters" ref="filters">
				<el-form-item label="卡券名称">
					<el-input v-model="filters.card_name" placeholder="卡券名称"></el-input>
				</el-form-item>
				<el-form-item label="卡券类型号码">
					<el-input v-model="filters.card_id" placeholder="卡券类型号码"></el-input>
				</el-form-item>
				<el-form-item label="卡券号码">
          <el-date-picker
            v-model="filters.queryDate"
            type="daterange"
            range-separator="至"
            value-format="timestamp"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
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
				<el-table-column prop="card_name" label="卡券名称">
				</el-table-column>
				<el-table-column prop="card_id" label="卡券类型号码">
				</el-table-column>
				<el-table-column prop="sum_count" label="总数">
				</el-table-column>
				<el-table-column prop="use_total" label="可用总次数">
				</el-table-column>
				<el-table-column prop="surplus_total" label="剩余总次数">
				</el-table-column>
				<el-table-column prop="create_time" label="统计日期">
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
	import { queryFrequencyCountList, exportConsumeCountList } from '../../../api/shop';
	export default {
		data() {
			return {
				filters: {
          card_id: '',
          queryDate: [new Date().getTime(), new Date().getTime()],
          card_name: ''
				},
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近30天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        users: [],
				total: 0,
				page: 1,
				listLoading: false,
			}
		},
		methods: {
			clickEx(){
				let para = util.deepcopy(this.filters)
				para.excelType = '2'
        para.startTime = para.queryDate[0].toString()
        para.endTime = para.queryDate[1].toString()
        delete para.queryDate
				exportConsumeCountList(para).then(res => {
					window.open(res.data, "_blank")
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
        para.pagNum = this.page
        para.startTime = para.queryDate[0].toString()
        para.endTime = para.queryDate[1].toString()
        delete para.queryDate
				queryFrequencyCountList(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.receiveFreList;
					this.listLoading = false;
				});
			},
		},
		mounted() {
			this.getUsers()
		}
	}

</script>
