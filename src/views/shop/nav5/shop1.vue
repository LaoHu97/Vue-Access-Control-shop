<template>
	<section>
		<!--工具条-->
		<el-row>
			<el-form :inline="true" :model="filters">
				<el-form-item label="商品名称">
					<el-input v-model="filters.name" class="fixed_search_input" placeholder="商品名称"></el-input>
				</el-form-item>
        <el-form-item label="商品状态">
          <template>
            <el-select v-model="filters.status" class="fixed_search_input" clearable placeholder="商品状态">
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
          <el-button type="primary" @click="getUsers" round>查询</el-button>
					<el-button type="primary" @click="handleAdd" round>新增商品</el-button>
				</el-form-item>
			</el-form>
		</el-row>

		<!--列表-->
    <div v-loading="listLoading">
      <el-table border :data="users" highlight-current-row style="width: 100%;">
        <el-table-column prop="name" label="商品名称" min-width="180">
        </el-table-column>
        <el-table-column prop="oprice" label="商品原价" min-width="120" :formatter="format_oprice">
        </el-table-column>
        <el-table-column prop="nprice" label="商品现价" min-width="120" :formatter="format_nprice">
        </el-table-column>
        <el-table-column prop="stock" label="库存" min-width="120">
        </el-table-column>
        <el-table-column prop="stock" label="状态" width="85">
          <template slot-scope="scope">
              <el-switch
                name="value"
                @change="test(scope.$index, scope.row)"
                v-model="scope.row.status">
              </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="85">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


		<!--工具条-->
		<el-row>
			<el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
			</el-pagination>
		</el-row>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="600px">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="商户名称：" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="商品缩略图：" prop="small_url">
          <el-upload class="avatar-uploader" :action="uploadImage" :data="uploaddata" :show-file-list="false" :on-success="small_urlSuccess" :before-upload="beforeAvatarUpload">
            <img :src="editForm.small_url" style="width:50px;height:50px;float:left">
            <el-button size="small" type="primary" style="float:right;margin-left:15px;">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品详情图：" prop="pic_url">
          <el-upload class="avatar-uploader" :action="uploadImage" :data="uploaddata" :show-file-list="false" :on-success="pic_urlSuccess" :before-upload="beforeAvatarUpload">
            <img :src="editForm.pic_url" style="width:50px;height:50px;float:left">
            <el-button size="small" type="primary" style="float:right;margin-left:15px;">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品原价：" prop="oprice">
          <el-input v-model="editForm.oprice" auto-complete="off" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="商品现价：" prop="nprice">
          <el-input v-model="editForm.nprice" auto-complete="off" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="商品库存：" prop="stock">
          <el-input v-model="editForm.stock" auto-complete="off" style="width:50%;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="开始时间：" prop="start_time">
          <el-date-picker
            v-model="editForm.start_time"
            type="date"
            :editable="false"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="end_time">
          <el-date-picker
            v-model="editForm.end_time"
            type="date"
            :editable="false"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="描述：" prop="desc">
          <el-input type="textarea" :rows="2" v-model="editForm.depict" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规则：" prop="rule">
          <el-input type="textarea" :rows="2" v-model="editForm.rule" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增商品" :visible.sync="addFormVisible" :close-on-click-modal="false" width="600px">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="商品缩略图：" prop="small_url">
          <el-upload class="avatar-uploader" :action="uploadImage" :data="uploaddata" :show-file-list="false" :on-success="small_urlSuccess" :before-upload="beforeAvatarUpload">
            <img :src="addForm.small_url" style="width:50px;height:50px;float:left">
            <el-button size="small" type="primary" style="float:right;margin-left:15px;">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品详情图：" prop="pic_url">
          <el-upload class="avatar-uploader" :action="uploadImage" :data="uploaddata" :show-file-list="false" :on-success="pic_urlSuccess" :before-upload="beforeAvatarUpload">
            <img :src="addForm.pic_url" style="width:50px;height:50px;float:left">
            <el-button size="small" type="primary" style="float:right;margin-left:15px;">点击上传</el-button>
          </el-upload>
        </el-form-item>
				<el-form-item label="选择优惠券：">
					<el-select v-model="addForm.card_id" placeholder="请选择优惠券" :multiple="false" filterable remote :remote-method="remoteCard" :loading="loading" clearable @visible-change="clickCard">
						<el-option v-for="item in optionsCard" :key="item.wxcard_id" :value="item.wxcard_id" :label="item.title">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品名称：" prop="name">
					<el-input v-model="addForm.name" auto-complete="off" style="width:50%;"></el-input>
				</el-form-item>
        <el-form-item label="商品原价：" prop="oprice">
          <el-input v-model="addForm.oprice" auto-complete="off" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="商品现价：" prop="nprice">
          <el-input v-model="addForm.nprice" auto-complete="off" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="商品库存：" prop="stock">
          <el-input v-model="addForm.stock" auto-complete="off" style="width:50%;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="开始时间：" prop="start_time">
          <el-date-picker
            v-model="addForm.start_time"
            type="date"
            :editable="false"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="end_time">
          <el-date-picker
            v-model="addForm.end_time"
            type="date"
            :editable="false"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="描述：" prop="desc">
          <el-input type="textarea" :rows="2" v-model="addForm.desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规则：" prop="rule">
          <el-input type="textarea" :rows="2" v-model="addForm.rule" auto-complete="off"></el-input>
        </el-form-item>
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
	import { insertProduct, queryProductList, updateStatus, updateProduct, getCouponByInPro, uploadimg} from '../../../api/shop';
	export default {
		data() {
			return {
        uploadImage:uploadimg,//上传图片变量
        uploaddata:{
          mid:''
        },
				filters: {
					name: '',
          status:''
				},
        options: [{
          value: 'Y',
          label: '上架商品'
        }, {
          value: 'N',
          label: '下架商品'
        }],
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				loading: false,
				optionsCard:[],
				editForm: {
          name: '',
          small_url: '',
          pic_url: '',
					card:'',
          oprice: '',
          nprice: '',
					vprice:'0.00',
          stock:'',
          start_time:'',
          end_time:'',
          depict:'',
          rule:''
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					}, ],
					oprice: [{
						required: true,
						message: '请输入商品原价',
						trigger: 'blur'
					}, ],
					nprice: [{
						required: true,
						message: '请输入商品现价',
						trigger: 'blur'
					}, ],
					vprice: [{
						required: true,
						message: '请输入商品会员价',
						trigger: 'blur'
					}, ],
					stock: [{
						required: true,
						message: '请输入商品库存',
						trigger: 'blur'
					}, ],
					desc: [{
						required: true,
						message: '请输入商品描述',
						trigger: 'blur'
					}, ],
					rule: [{
						required: true,
						message: '请输入兑换规则',
						trigger: 'blur'
					}, ],
				},
				//新增界面数据
				addForm: {
					name: '',
          small_url: '',
					pic_url: '',
					card_id:'',
					oprice: '',
					nprice: '',
					vprice:'0.00',
          stock:'',
          start_time:'',
          end_time:'',
          desc:'',
          rule:''
				}
			}
		},
		methods: {
      //格式化金额
      format_oprice(row, column) {
        return util.number_format(row.oprice, 2, ".", ",")
      },
      format_nprice(row, column) {
        return util.number_format(row.nprice, 2, ".", ",")
      },
			//商户远程搜索
			clickCard:function () {
				getCouponByInPro({title:''}).then((res) => {
					let {
						status,
						data
					} = res
					this.optionsCard = data.CouponList
				})
			},
			remoteCard(query) {
				if (query !== '') {
					this.loading = true;
					setTimeout(() => {
						this.loading = false;
						getCouponByInPro({
							title: query
						}).then((res) => {
							let {
								status,
								data
							} = res
							this.optionsCard = data.CouponList
						})
					}, 200);
				} else {
					this.optionsMers = [];
				}
			},
      //上传缩略图
      small_urlSuccess(res, file) {
        this.addForm.small_url = res.data.locationUrl;
        this.editForm.small_url = res.data.locationUrl;
      },
      //上传详情图
      pic_urlSuccess(res, file) {
        this.addForm.pic_url = res.data.locationUrl;
        this.editForm.pic_url = res.data.locationUrl;
      },
      //图片限制
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
			handleCurrentChange(val) {
				this.page = val;
				this.getList();
			},
      //修改商品状态
      test: function(index, row) {
        this.$confirm('此操作将修改商品状态, 确定修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          let para = {
            id: row.id,
            status: row.status == true ? "Y" : row.status == false ? "N" : "未知"
          }
          updateStatus(para).then((res) => {
            let {
              status
            } = res
            if (status == 200) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            } else {
              this.$message({
                type: 'success',
                message: '修改失败!'
              });
            }
          })
        }).catch(() => {
          this.getUsers();
          this.$message({
            type: 'info',
            message: '取消修改'
          });
        });

      },
      getUsers(){
        this.page = 1
        this.getList()
      },
			//获取用户列表
			getList() {
				let para = {
					pagNum: this.page,
					name: this.filters.name,
          status:this.filters.status
				};
				this.listLoading = true;
				//
				queryProductList(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.productList;
					this.listLoading = false;
          var sta;
          for (var i = 0; i < this.users.length; i++) {
            sta = this.users[i];
            if (sta.status == "Y") {
              sta.status = true
            } else {
              sta.status = false
            }
          }
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//编辑
			editSubmit: function (index,row) {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = {
                id: String(this.editForm.id),
                name: String(this.editForm.name),
                small_url: String(this.editForm.small_url),
                pic_url: String(this.editForm.pic_url),
                oprice: String(this.editForm.oprice),
                nprice: String(this.editForm.nprice),
                stock:String(this.editForm.stock),
                start_time:'',
                end_time:'',
                desc:String(this.editForm.depict),
                rule:String(this.editForm.rule)
              }
							updateProduct(para).then((res) => {
                let {status,message}=res;
                if (status==200) {
                  this.$notify({
                    title: '成功',
                    message: message,
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.getUsers();
                }else {
                  this.$notify.error({
                    title: '错误',
                    message: message
                  });
                }
								this.editLoading = false;
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							insertProduct(para).then((res) => {
                let {status,message}=res;
                if (status==200) {
                  this.$notify({
                    title: '成功',
                    message: message,
                    type: 'success'
                  });
                  this.$refs['addForm'].resetFields();
                  this.addFormVisible = false;
                  this.getUsers();
                }else {
                  this.$notify.error({
                    title: '错误',
                    message: message
                  });
                }
                this.addLoading = false;
							});
						});
					}
				});
			},
		},
		mounted() {
      this.getUsers();
      this.uploaddata.mid = sessionStorage.getItem('mid')
		}
	}
</script>

<style scoped>

</style>
