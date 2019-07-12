<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-form :inline="true" :model="filters">
				<el-form-item label="卡券名称">
					<el-input v-model="filters.title" class="fixed_search_input" placeholder="卡券名称"></el-input>
				</el-form-item>
        <el-form-item label="卡券类型">
          <template>
            <el-select v-model="filters.card_type" class="fixed_search_input" clearable placeholder="卡券类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
				<el-form-item style="float:right">
					<el-button type="primary" @click="handleAdd" round>新增卡券</el-button>
					<el-button type="primary" v-on:click="getUsers" round>查询</el-button>
				</el-form-item>
			</el-form>
		</el-row>

		<!--列表-->
		<div v-loading="listLoading">
			<el-table border :data="users" highlight-current-row style="width: 100%;">
				<el-table-column prop="card_type" label="卡券类型" :formatter="card_type">
				</el-table-column>
				<el-table-column prop="title" label="卡券名称" min-width="120">
				</el-table-column>
				<el-table-column prop="quantity" label="库存">
				</el-table-column>
				<el-table-column prop="get_limit" label="限领次数">
				</el-table-column>
				<el-table-column prop="status" label="状态" min-width="90" :formatter="status">
				</el-table-column>
				<el-table-column label="操作" width="290">
					<template slot-scope="scope">
							<el-button type="warning" size="mini" @click="editCard(scope.$index, scope.row)">修改</el-button>
							<el-button type="success" size="mini" v-if="scope.row.status!=2" @click="uploadWinxin(scope.$index, scope.row)">上传<i class="el-icon-upload el-icon--right"></i></el-button>
							<el-button type="info" size="mini" v-else :disabled="true">已上传</el-button>
							<el-button type="success" size="mini" @click="deliveryCode(scope.$index, scope.row)">投放二维码</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!--工具条-->
		<el-row>
			<el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
			</el-pagination>
		</el-row>

		<!--新增界面-->
		<el-dialog title="投放设置" :visible.sync="codeFormVisible" :close-on-click-modal="false" @close="closeDialog" width="600px">
			<el-form :model="codeForm" label-width="80px" :rules="codeFormRules" ref="codeForm">
				<el-form-item label="选择场景" prop="parag">
					<el-select v-model="codeForm.scene" clearable placeholder="请选择场景">
						<el-option
							v-for="item in optionsScene"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择门店" prop="parag">
					<el-select v-model="codeForm.store" placeholder="请选择门店名称" :multiple="false" filterable remote clearable :remote-method="remoteStore" :loading="loading" @visible-change="clickStore">
						<el-option v-for="item in optionsCode" :key="item.id" :value="item.id" :label="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click.native="codeSubmit" :loading="codeLoading">生成二维码</el-button>
				</el-form-item>
			</el-form>
			<el-form :model="editVipCode" label-width="" ref="editVipCode" style="width:auto" v-if="codeMode">
				<el-form-item style="text-align: center;margin-bottom:0">
					<img :src="editVipCode.vipCode" alt="二维码" width="260px">
				</el-form-item>
				<el-form-item style="text-align: center;margin-bottom:0">
					<el-button type="success" @click="clickCode">点击下载</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--二维码 -->
		<!--新增界面-->
		<el-dialog title="请选择新增卡券类型" :visible.sync="addFormVisible" :close-on-click-modal="false" width="750px">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
          <template>
            <el-radio-group v-model="addForm.card_type">
              <el-radio :label="1">团购券</el-radio>
              <el-radio :label="2">代金券</el-radio>
              <el-radio :label="3">折扣券</el-radio>
              <el-radio :label="4">兑换券</el-radio>
              <el-radio :label="5">优惠券</el-radio>
							<el-radio :label="6">计次卡</el-radio>
							<el-radio :label="7">礼包券</el-radio>
            </el-radio-group>
          </template>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import * as util from '../../../util/util.js'
	//
	import { queryCouponListNew, uploadCouponNew, selectStoreList, getUrlCode } from '../../../api/shop';
	export default {
		data() {
			return {
				filters: {
					title: '',
          card_type:''
				},
        options: [{
          value: 'GIFT',
          label: '兑换券'
        }, {
          value: 'GENERAL_COUPON',
          label: '优惠券'
        }],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				codeMode:false,
				addFormRules: {

				},

				optionsCode:[],
				optionsScene: [{
					value: 'pqc',
					label: '二维码投放'
				}, {
					value: 'ppa',
					label: '支付广告投放'
				}, {
					value: 'ppn',
					label: '公众号投放'
				}],
				codeFormVisible:false,
				editFormVipCode:false,
				codeLoading:false,
				codeFormRules: {

				},
				loading:false,
				codeForm:{
					wxcard_id:'',
					store:'',
					scene:''
				},
				editVipCode:{
					vipCode:''
				},

				//新增界面数据
				addForm: {
          card_type:4,
				}
			}
		},
		methods: {
			closeDialog(){
				this.codeMode=false;
				this.codeForm.scene='';
				this.codeForm.store='';
			},
			clickCode: function() {
				window.location.href = this.editVipCode.vipCode
			},
			codeSubmit(){
				this.codeLoading=true;
				let para={
					cardid:this.codeForm.wxcard_id,
					storeId:String(this.codeForm.store),
					scene:this.codeForm.scene
				}
					this.codeLoading=false;
					this.editVipCode.vipCode = getUrlCode +"?"+"cardid="+para.cardid+"&"+"storeId="+para.storeId+"&"+"scene="+para.scene;
					this.codeMode=true;
			},
			//门店远程搜索
			clickStore:function () {
				selectStoreList().then((res) => {
					let {
						status,
						data
					} = res
					this.optionsCode = data.storeList
				})
			},
			remoteStore(query) {
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
							this.optionsCode = data.storeList
						})
					}, 200);
				} else {
					this.options = [];
				}
			},
			deliveryCode(index,row){
				this.codeFormVisible=true;
				this.codeForm.wxcard_id=row.wxcard_id;
			},
			editCard(index,row){
				var id=row.card_id;
				var channel_type=row.channel_type;
				sessionStorage.setItem('id', JSON.stringify(id));
				sessionStorage.setItem('channel_type', JSON.stringify(channel_type));
				if (row.card_type === 'WDGIFT_COUPON' || row.card_type === 'FREQUENCY') {
					this.$router.push({
						path: '/index3/tab12-v',
						query: {card_type: row.card_type}
					});
				}else{
					this.$router.push({
						path: '/index3/tab7-modify-v',
					});
				}
			},
			//卡券状态转换
			status:function (row,column) {
				return row.status == 2 ? '上传成功' : row.status == 1 ? '未上传' : row.status == 3 ? '上传失败' : '未知';
			},
			//上传微信
			uploadWinxin:function (index,row) {
				let para={
					id:row.id
				}
				uploadCouponNew(para).then((res)=>{
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
			},
			//卡券类型转换
			card_type:function (row,column) {
				return row.card_type == 'GIFT' ? '兑换券' : row.card_type=='GENERAL_COUPON' ? '优惠券' : row.card_type=='GROUPON' ? '团购券' : row.card_type=='CASH' ? '代金券' : row.card_type=='DISCOUNT' ? '折扣券' : row.card_type== 'FREQUENCY' ? '计次卡': row.card_type== 'WDGIFT_COUPON' ? '礼包券':'未知';
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
					title: this.filters.title,
          card_type:this.filters.card_type
				};
				this.listLoading = true;
				queryCouponListNew(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.couponList;
					this.listLoading = false;
				});
			},
			// //显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//新增
			addSubmit: function () {
				let card_type=this.addForm.card_type;
				sessionStorage.setItem('card_type', JSON.stringify(card_type));
				if (card_type === 6 || card_type === 7) {
					this.$router.push({
						path: '/index3/tab12-v',
						query: {card_type: card_type}
					});
				}else{
					this.$router.push({
						path: '/index3/tab7s-v'
					});
				}
			},
		},
		mounted() {
			this.getUsers();
		}
	}
</script>

<style scoped>

</style>
