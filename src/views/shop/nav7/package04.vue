<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="套餐名称">
          <el-input v-model="filters.name" class="fixed_search_input" placeholder="套餐名称"></el-input>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="getUsers" round>查询</el-button>
          <el-button type="primary" @click="establishClick" round>创建套餐</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="pkg_name" label="套餐名称" min-width="160">
        </el-table-column>
        <el-table-column prop="price" label="套餐现价" min-width="120" :formatter="format_price">
        </el-table-column>
        <el-table-column prop="oprice" label="套餐原价" min-width="120" :formatter="format_oprice">
        </el-table-column>
        <el-table-column prop="level" label="等级标识" min-width="120">
        </el-table-column>
        <el-table-column prop="gmt_create" label="创建时间" min-width="120" :formatter="gmt_create">
        </el-table-column>
        <el-table-column prop="stock" label="库存">
        </el-table-column>
        <el-table-column label="套餐状态" width="100">
          <template slot-scope="scope">
            <el-switch name="value" @change="pkgStatus(scope.$index, scope.row)" v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="modifyClick(scope.$index, scope.row)">修改</el-button>
            <el-button type="success" size="mini" @click="repairClick(scope.$index, scope.row)">人工补录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 人工补录 -->
    <el-dialog title="人工补录" :visible.sync="repairDialogVisible" :close-on-click-modal="false" width="800px">
      <el-form ref="repairForm" :model="repairForm" :rules="repairRulesForm" label-width="100px" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="会员卡号" prop="card_no">
              <el-input v-model="repairForm.card_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="success" round @click="repairQuery('repairForm')">立即查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content">会员姓名：<span>{{vipMember.name}}</span></div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">会员卡号：<span>{{vipMember.card_no}}</span></div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">手机号：<span>{{vipMember.phone}}</span></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="选择邀请人">
              <template>
                  <el-select v-model="repairForm.value" placeholder="请选择邀请人" :multiple="false" filterable remote :remote-method="remoteRepair" :loading="repairLoading" clearable @visible-change="clickrepair">
                    <el-option v-for="item in repairOptions" :key="item.id" :value="item.id" :label="item.inviter_name">
                    </el-option>
                  </el-select>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="repairDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="repairsumbil">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改套餐 -->
    <el-dialog title="修改套餐" :visible.sync="modifyVisible" :close-on-click-modal="false" width="600px">
      <el-form :model="modifyForm" :rules="modify" ref="modifyForm" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="套餐名称" prop="name">
              <el-input v-model="modifyForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐等级" prop="Grade">
              <el-select v-model="modifyForm.Grade" placeholder="请选择" :clearable='true'>
                <el-option v-for="item in gradeOptions" :key="item.id" :label="item.level_name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分红率" prop="abonus">
              <el-tooltip class="item" effect="dark" content="填(0.1)表示分红率百分之十" placement="top">
                <el-input v-model.number="modifyForm.abonus"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐库存" prop="stock">
              <el-input v-model.number="modifyForm.stock"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="套餐现价" prop="presentPrice">
              <el-input v-model.number="modifyForm.presentPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐原价" prop="originalPrice">
              <el-input v-model.number="modifyForm.originalPrice"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input v-model.number="modifyForm.sort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="生效日期">
          <template>
            <el-radio class="radio" v-model="modifyForm.date_info" label="2">有效日期</el-radio>
            <el-radio class="radio" v-model="modifyForm.date_info" label="1">固定日期</el-radio>
            <el-row v-if="modifyForm.date_info == '1' ? true : false">
              <el-col :span="11">
                <el-form-item prop="beginTime">
                  <el-date-picker :editable="false" :clearable="false" v-model="modifyForm.beginTime" type="date" placeholder="开始时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker :editable="false" :clearable="false" v-model="modifyForm.endTime" type="date" placeholder="结束时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col :span="11">
                <el-form-item prop="fixed_term">
                  <el-input v-model="modifyForm.fixed_term" placeholder="自激活后多少天内有效"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-form-item>
        <el-form-item label="套餐描述" prop="desc">
          <el-input type="textarea" v-model="modifyForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="套餐图片" prop="imageUrl">
          <el-upload class="avatar-uploader" :action="uploadUrl" :data="uploaddata" :show-file-list="false" :on-success="handleAvatarSuccess01" :before-upload="beforeAvatarUpload">
            <img v-if="modifyForm.imageUrl" :src="modifyForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情图">
          <el-upload class="upload-demo" :action="uploadUrl" :data="uploaddata" :show-file-list="false" :on-success="handleChange03">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            <img v-if="modifyForm.fileList01" :src="modifyForm.fileList01" class="avatar">
          </el-upload>
        </el-form-item>
        <el-form-item label="套餐顶图">
          <el-upload class="upload-demo" :action="uploadUrl" :data="uploaddata" :show-file-list="false" :on-success="handleChange04">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            <img v-if="modifyForm.fileList02" :src="modifyForm.fileList02" class="avatar">
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyOnSubmit(establishForm)">立即修改</el-button>
          <el-button @click="modifyVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 创建套餐 -->
    <el-dialog title="创建套餐" :visible.sync="establishVisible" :close-on-click-modal="false" width="600px">
      <el-form :model="establishForm" :rules="establish" ref="establishForm" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="套餐名称" prop="name">
              <el-input v-model="establishForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐等级" prop="Grade">
              <el-select v-model="establishForm.Grade" placeholder="请选择套餐等级" :clearable='true'>
                <el-option v-for="item in gradeOptions" :key="item.id" :label="item.level_name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分红率" prop="abonus">
              <el-tooltip class="item" effect="dark" content="填(0.1)表示分红率百分之十" placement="top">
                <el-input v-model.number="establishForm.abonus"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐库存" prop="stock">
              <el-input v-model.number="establishForm.stock"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="套餐现价" prop="presentPrice">
              <el-input v-model.number="establishForm.presentPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐原价" prop="originalPrice">
              <el-input v-model.number="establishForm.originalPrice"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input v-model.number="establishForm.sort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="有效时间">
          <template>
            <el-radio class="radio" v-model="establishForm.date_info" label="2">有效天数</el-radio>
            <el-radio class="radio" v-model="establishForm.date_info" label="1">固定日期</el-radio>
            <el-row v-if="establishForm.date_info == '1' ? true : false">
              <el-col :span="11">
                <el-form-item prop="beginTime">
                  <el-date-picker :editable="false" :clearable="false" v-model="establishForm.beginTime" type="date" placeholder="开始时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker :editable="false" :clearable="false" v-model="establishForm.endTime" type="date" placeholder="结束时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col :span="11">
                <el-form-item prop="fixed_term">
                  <el-input v-model="establishForm.fixed_term" placeholder="自激活后多少天内有效"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-form-item>
        <el-form-item label="套餐描述" prop="desc">
          <el-input type="textarea" v-model="establishForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="套餐图片" prop="imageUrl">
          <el-upload class="avatar-uploader" :action="uploadUrl" :data="uploaddata" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="establishForm.imageUrl" :src="establishForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情图">
          <el-upload class="upload-demo" :action="uploadUrl" :data="uploaddata" :show-file-list="false" :on-success="handleChange01">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            <img v-if="establishForm.fileList03" :src="establishForm.fileList03" class="avatar">
          </el-upload>
        </el-form-item>
        <el-form-item label="套餐顶图">
          <el-upload class="upload-demo" :action="uploadUrl" :data="uploaddata" :show-file-list="false" :on-success="handleChange02">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            <img v-if="establishForm.fileList04" :src="establishForm.fileList04" class="avatar">
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(establishForm)">立即创建</el-button>
          <el-button @click="establishVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background
        style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'
  // 
  import {
    getPkgProductListPc,
    getCardLevelListPc,
    insertPkgProduct,
    getPkgProductById,
    updatePkgProduct,
    updateProdStauts,
    queryInviter,
    queryMember,
    makeUpPurchase,
    insertPkgProductPic
  } from '../../../api/shop';
  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        vipMember:{

        },
        repairDialogVisible: false, //人工补录
        repairForm: {
          id:'',
          card_no:'',
          value:''
        },
        uploadUrl: insertPkgProductPic,
        uploaddata:{
          mid:''
        },
        gradeOptions: [],
        modifyForm: {
          id: '',
          name: '',
          Grade: '',
          abonus: '',
          stock: '',
          sort: '',
          presentPrice: '',
          originalPrice: '',
          date_info: '2',
          beginTime: '',
          endTime: '',
          fixed_term: '',
          desc: '',
          imageUrl: '',
          fileList01: '',
          fileList02: '',
        },
        fileList01: [],
        fileList02: [],
        establishForm: {
          name: '',
          Grade: '',
          abonus: '',
          stock: '',
          sort: '',
          presentPrice: '',
          originalPrice: '',
          date_info: '2',
          beginTime: '',
          endTime: '',
          fixed_term: '',
          desc: '',
          imageUrl: '',
          fileList03: '',
          fileList04: '',
        },
        repairRulesForm: {
          card_no: [
            { required: true, message: '请输入会员卡号', trigger: 'blur' }
          ]
        },
        establish: {
          name: [{
              required: true,
              message: '请输入套餐名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur'
            }
          ],
          Grade: [{
            type: 'number',
            required: true,
            message: '请选择套餐区域',
            trigger: 'change'
          }],
          abonus: [{
            type: 'number',
            required: true,
            message: '请输入正确的套餐折扣率',
            trigger: 'blur'
          }],
          stock: [{
            type: 'number',
            required: true,
            message: '请输入正确的套餐库存',
            trigger: 'blur'
          }],
          presentPrice: [{
            type: 'number',
            required: true,
            message: '请输入正确的套餐现价',
            trigger: 'blur'
          }],
          originalPrice: [{
            type: 'number',
            required: true,
            message: '请输入正确的套餐原价',
            trigger: 'blur'
          }],
          sort: [{
            type: 'number',
            required: true,
            message: '请输入正确的套餐排序',
            trigger: 'blur'
          }],
          beginTime: [{
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }],
          endTime: [{
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }],
          fixed_term: [{
            required: true,
            message: '请填写有效时间',
            trigger: 'blur'
          }],
          desc: [{
            required: true,
            message: '请填写套餐描述',
            trigger: 'blur'
          }],
          imageUrl: [{
            required: true,
            message: '请上传套餐图片',
            trigger: 'blur'
          }]
        },
        modify: {
          name: [{
              required: true,
              message: '请输入套餐名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur'
            }
          ],
          Grade: [{
            type: 'number',
            required: true,
            message: '请选择套餐区域',
            trigger: 'change'
          }],
          abonus: [{
            type: 'number',
            required: true,
            message: '请输入正确的套餐折扣率',
            trigger: 'blur'
          }],
          stock: [{
            type: 'number',
            required: true,
            message: '请输入正确的套餐库存',
            trigger: 'blur'
          }],
          presentPrice: [{
            type: 'number',
            required: true,
            message: '请输入正确的套餐现价',
            trigger: 'blur'
          }],
          originalPrice: [{
            type: 'number',
            required: true,
            message: '请输入正确的套餐原价',
            trigger: 'blur'
          }],
          sort: [{
            type: 'number',
            required: true,
            message: '请输入正确的套餐排序',
            trigger: 'blur'
          }],
          beginTime: [{
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }],
          endTime: [{
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }],
          fixed_term: [{
            required: true,
            message: '请填写有效时间',
            trigger: 'blur'
          }],
          desc: [{
            required: true,
            message: '请填写套餐描述',
            trigger: 'blur'
          }],
          imageUrl: [{
            required: true,
            message: '请上传套餐图片',
            trigger: 'blur'
          }]
        },
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        establishVisible: false,
        modifyVisible: false,
        repairLoading:false,
        repairOptions:[]
      }
    },
    methods: {
      //格式化金额
      format_price(row, column) {
        return util.number_format(row.price, 2, ".", ",")
      },
      format_oprice(row, column) {
        return util.number_format(row.oprice, 2, ".", ",")
      },
      repairsumbil(){
        if(!this.vipMember.id){
          return this.$message({message: "请先输入卡号查询会员信息",type: 'warning'});
        }
        let para = {
          productId:String(this.repairForm.id),
          memId:String(this.vipMember.id),
          inviterId:String(this.repairForm.value)
        }
        makeUpPurchase(para).then(res=>{
          if(res.status===200){
            this.vipMember = {}
            this.repairForm.card_no = ''
            this.repairDialogVisible = false
            this.$message({
              message: res.message,
              type: 'success'
            });
          }
        })
      },
      //门店远程搜索
      clickrepair: function() {
        queryInviter().then((res) => {
          let {
            status,
            data
          } = res
          this.repairOptions = data.pkgInviterList
        })
      },
      remoteRepair(query) {
        if (query !== '') {
          this.repairLoading = true;
          setTimeout(() => {
            this.repairLoading = false;
            queryInviter({
              name: query
            }).then((res) => {
              let {
                status,
                data
              } = res
              this.repairOptions = data.pkgInviterList
            })
          }, 200);
        } else {
          this.repairOptions = [];
        }
      },
      repairQuery(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = {
              phone:this.repairForm.phone,
              card_no:this.repairForm.card_no
            }
            queryMember(para).then(res=>{
              if(res.data.member){
                this.vipMember = res.data.member
              }else{
                this.vipMember = {}
              }
            })
          } else {
            return false;
          }
        });
      },
      repairClick(index, row) {
        this.repairDialogVisible = true;
        this.repairForm.id = row.id;
      },
      //订单状态
      receive_card_status: function (row, column) {
        return row.receive_card_status == 'Y' ? '领卡成功' : row.receive_card_status == 'N' ? '领卡失败' : '未知';
      },
      //时间转化
      gmt_create: function (row, column) {
        return row.gmt_create = util.formatDate.format(new Date(row.gmt_create), 'yyyy/MM/dd');
      },
      pkgStatus(index, row) {
        this.$confirm(row.status == true ? '此操作将修改套餐为开启状态，确认修改？' : '此操作将修改套餐为关闭状态，确认修改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          let para = {
            id: row.id.toString(),
            status: row.status == true ? '1' : row.status == false ? '2' : "未知"
          }
          updateProdStauts(para).then((res) => {
            let {
              status
            } = res
            if (status == 200) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            } else {
              this.$notify.error({
                title: '错误',
                message: message
              });
            }
          })
        }).catch(() => {
          this.getUsers();
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      modifyClick(index, row) {
        this.modifyVisible = true
        this.modifyForm.id = row.id
        getCardLevelListPc().then((res) => {
          this.gradeOptions = res.data
        }).then((res) => {
          getPkgProductById({
            id: row.id.toString()
          }).then((res) => {
            this.modifyForm.name = res.data.product.pkg_name,
              this.modifyForm.Grade = res.data.product.level_id,
              this.modifyForm.abonus = res.data.product.bonus_rate,
              this.modifyForm.stock = res.data.product.stock,
              this.modifyForm.sort = res.data.product.sort,
              this.modifyForm.presentPrice = res.data.product.price,
              this.modifyForm.originalPrice = res.data.product.oprice,
              this.modifyForm.date_info = res.data.product.date_type == 'TERM' ? '2' : '1',
              this.modifyForm.beginTime = res.data.product.start_time,
              this.modifyForm.endTime = res.data.product.end_time,
              this.modifyForm.fixed_term = res.data.product.fixed_term
            this.modifyForm.desc = res.data.product.pkg_desc,
              this.modifyForm.imageUrl = res.data.product.small_url

            this.modifyForm.fileList01 = res.data.imgList[0].url
            this.modifyForm.fileList02 = res.data.pic_url[0].url
          })
        })
      },
      modifyOnSubmit() {
        let para = {
          id: this.modifyForm.id.toString(),
          bonus_rate: this.modifyForm.abonus.toString(),
          level_id: this.modifyForm.Grade.toString(),
          pkg_name: this.modifyForm.name,
          pkg_desc: this.modifyForm.desc,
          stock: this.modifyForm.stock.toString(),
          oprice: this.modifyForm.originalPrice.toString(),
          price: this.modifyForm.presentPrice.toString(),
          small_url: this.modifyForm.imageUrl,
          pic_url: [this.modifyForm.fileList02],
          image_url: [this.modifyForm.fileList01],
          start_time: this.modifyForm.beginTime,
          end_time: this.modifyForm.endTime,
          fixed_term: this.modifyForm.fixed_term.toString(),
          date_type: this.modifyForm.date_info,
          sort: this.modifyForm.sort.toString(),
        }
        para.start_time = (!para.start_time || para.start_time == '') ? '' : String(Date.parse(util.formatDate.format(
          new Date(para.start_time), 'yyyy/MM/dd'))); //开始时间
        para.end_time = (!para.end_time || para.end_time == '') ? '' : String(Date.parse(util.formatDate.format(new Date(
          para.end_time), 'yyyy/MM/dd'))); //开始时间
        para.date_type = para.date_type == '2' ? 'TERM' : para.date_type == '1' ? 'RANGE' : '未知'
        updatePkgProduct(para).then((res) => {
          if (res.status == 200) {
            this.modifyVisible = false
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.getUsers()
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            });
          }
        })
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      // handleRemove03(file, fileList) {
      //   let list = []
      //   for (var i = 0; i < fileList.length; i++) {
      //     if (fileList[i]) {
      //       list.push(fileList[i].response.data.url)
      //       this.modifyForm.fileList01 = list;
      //     }
      //   }
      // },
      // handleRemove04(file, fileList) {
      //   let list = []
      //   for (var i = 0; i < fileList.length; i++) {
      //     if (fileList[i]) {
      //       list.push(fileList[i].response.data.url)
      //       this.modifyForm.fileList02 = list;
      //     }
      //   }
      // },
      handleChange04(res, file) {
        this.modifyForm.fileList02 = res.data.url;
        // let list = []
        // for (var i = 0; i < fileList.length; i++) {
        //   if (fileList[i]) {
        //     list.push(fileList[i].response.data.url)
        //     this.modifyForm.fileList02 = list;
        //   }
        // }
      },
      handleChange03(res, file) {
        this.modifyForm.fileList01 = res.data.url;
        // let list = []
        // let url
        // for (url in fileList){
        //   list.push(fileList[url].response.data.url)
        // }
        // this.modifyForm.fileList01 = list;
        // console.log(lists);
        // console.log(this.modifyForm.fileList01);
      },
      // handleRemove01(file, fileList) {
      //   let list = []
      //   for (var i = 0; i < fileList.length; i++) {
      //     if (fileList[i].response) {
      //       list.push(fileList[i].response.data.url)
      //       this.establishForm.fileList03 = list;
      //     }
      //   }
      // },
      // handleRemove02(file, fileList) {
      //   let list = []
      //   for (var i = 0; i < fileList.length; i++) {
      //     if (fileList[i].response) {
      //       list.push(fileList[i].response.data.url)
      //       this.establishForm.fileList04 = list;
      //     }
      //   }
      // },
      handleChange02(res, file) {
        this.establishForm.fileList04 = res.data.url;
        // let list = []
        // for (var i = 0; i < fileList.length; i++) {
        //   if (fileList[i].response) {
        //     list.push(fileList[i].response.data.url)
        //     this.establishForm.fileList04 = list;
        //   }
        // }
      },
      handleChange01(res, file) {
        this.establishForm.fileList03 = res.data.url;
        // let list = []
        // for (var i = 0; i < fileList.length; i++) {
        //   if (fileList[i].response) {
        //     list.push(fileList[i].response.data.url)
        //     this.establishForm.fileList03 = list;
        //   }
        // }
      },
      handleAvatarSuccess01(res, file) {
        this.modifyForm.imageUrl = res.data.url;
      },
      handleAvatarSuccess(res, file) {
        this.establishForm.imageUrl = res.data.url;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      onSubmit(formName) {
        this.$refs.establishForm.validate((valid) => {
          if (valid) {
            let para = {
              bonus_rate: this.establishForm.abonus.toString(),
              level_id: this.establishForm.Grade.toString(),
              pkg_name: this.establishForm.name,
              pkg_desc: this.establishForm.desc,
              stock: this.establishForm.stock.toString(),
              oprice: this.establishForm.originalPrice.toString(),
              price: this.establishForm.presentPrice.toString(),
              small_url: this.establishForm.imageUrl,
              pic_url: [this.establishForm.fileList04],
              image_url: [this.establishForm.fileList03],
              start_time: this.establishForm.beginTime,
              end_time: this.establishForm.endTime,
              fixed_term: this.establishForm.fixed_term,
              date_type: this.establishForm.date_info,
              sort: this.establishForm.sort.toString()
            }
            para.start_time = (!para.start_time || para.start_time == '') ? '' : String(Date.parse(util.formatDate.format(
              new Date(para.start_time), 'yyyy/MM/dd'))); //开始时间
            para.end_time = (!para.end_time || para.end_time == '') ? '' : String(Date.parse(util.formatDate.format(
              new Date(para.end_time), 'yyyy/MM/dd'))); //开始时间
            para.date_type = para.date_type == '2' ? 'TERM' : para.date_type == '1' ? 'RANGE' : '未知'
            insertPkgProduct(para).then((res) => {
              if (res.status == 200) {
                this.establishVisible = false
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                this.getUsers()
              } else {
                this.$message({
                  message: res.message,
                  type: 'warning'
                });
              }
            })
          }
        })
      },
      establishClick() {
        this.establishVisible = true
        getCardLevelListPc().then((res) => {
          this.gradeOptions = res.data
        })
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
          name: this.filters.name,
          pagNum: String(this.page),
          numPerPage: '20'
        };
        this.listLoading = true;
        getPkgProductListPc(para).then((res) => {
          this.total = res.data.totalCount;
          this.users = res.data.purchaseList;
          var sta;
          for (var i = 0; i < this.users.length; i++) {
            sta = this.users[i];
            if (sta.status == '1') {
              sta.status = true
            } else {
              sta.status = false
            }
          }
          this.listLoading = false;
        });
      }
    },
    mounted() {
      this.getUsers();
      this.uploaddata.mid = sessionStorage.getItem('mid')
    }
  }

</script>

<style scoped>
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 100%;
    height: 178px;
    display: block;
  }
  .grid-content{
    font-size: 18px;
    border-top: 1px solid #DCDFE6;
    margin-top: 15px;
    margin-bottom: 15px;
    line-height: 2.5;
    color: #909399;
  }
  .grid-content span{
    color: #303133;
  }
</style>
