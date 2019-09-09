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
          <el-button type="text" @click="clickEx" round>下载报表</el-button>
				</el-form-item>
			</el-form>
		</el-row>
		<!--列表-->
		<div v-loading="listLoading">
			<el-table :data="users" highlight-current-row style="width: 100%;" border>
				<el-table-column prop="title" label="卡券名称">
				</el-table-column>
				<el-table-column prop="code" label="卡券号">
				</el-table-column>
				<el-table-column prop="card_type" label="卡券类型" :formatter="card_type">
				</el-table-column>
				<el-table-column prop="store_name" label="适用门店" :formatter="formatterStore">
				</el-table-column>
				<el-table-column prop="use_time" label="领取时间" :formatter="update_time">
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
	import { queryReceiveCouponCouList, selectStoreListNew, exportConsumeCountList  } from '../../../api/shop';
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

				optionsTopStore: [],
				searchTopLoading: false
			}
		},
		methods: {
      //卡券类型转换
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
          : "未知";
      },
			formatterStore(row,column) {
        return row.store_name ? row.store_name : '全部门店'
      },
      formatterReceiveType(row,column) {
        return row.receiveType === 'TB' ? '团购' : row.receiveType === 'CZ' ? '充值' : row.receiveType === 'DH' ? '积分兑换' : row.receiveType === 'CZLK' ? '充值领卡' : row.receiveType === 'CONSUME' ? '消费送劵': row.receiveType === 'PB' ? '拼购' : '未知'
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
					return util.formatDate.format(new Date(row.create_time), 'yyyy-MM-dd hh:mm:ss')
			},
			clickEx(){
				let para = util.deepcopy(this.filters)
				para.excelType = '4'
				exportConsumeCountList(para).then(res => {
					window.open(res.data, "_blank")
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
				queryReceiveCouponCouList(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.receiveCouponList;
					this.listLoading = false;
				});
			}
		},
		mounted() {
			this.getUsers()
		}
	}

</script>

