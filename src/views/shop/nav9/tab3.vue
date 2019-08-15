<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-form-item label="账户名称">
        <el-input v-model="filters.name" class="fixed_search_input" placeholder="账户名称"></el-input>
      </el-form-item>
      <el-form-item label="账户卡号">
        <el-input v-model="filters.cardNum" class="fixed_search_input" placeholder="账户卡号"></el-input>
      </el-form-item>
      <el-form-item  style="float:right">
        <el-button type="primary" @click="getUsers" round>查询</el-button>
        <el-button type="primary" @click="handleAdd" round><i class="el-icon-plus"></i> 新增公司账户</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <div v-loading="listLoading">
    <el-table :data="users" highlight-current-row style="width: 100%;" border>
      <el-table-column prop="card_num" label="公司卡号" min-width="120">
      </el-table-column>
      <el-table-column prop="name" label="公司名称" min-width="200">
      </el-table-column>
      <el-table-column prop="address" label="公司地址" min-width="260">
      </el-table-column>
      <el-table-column prop="person" label="负责人姓名" min-width="100">
      </el-table-column>
      <el-table-column prop="phone" label="负责人电话" min-width="120">
      </el-table-column>
      <el-table-column prop="balance" label="余额￥" min-width="120" :formatter="format_balance">
      </el-table-column>
      <el-table-column label="操作" width="390">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="clickBind(scope.$index, scope.row)">绑定<i class="el-icon-edit el-icon--right"></i></el-button>
            <el-button type="success" size="mini" @click="clickSee(scope.$index, scope.row)">已绑定会员</el-button>
            <el-button type="success" size="mini" @click="clickRecharge(scope.$index, scope.row)">充值</el-button>
            <el-button type="info" size="mini" @click="clickDetailed(scope.$index, scope.row)">操作记录</el-button>
          </template>
      </el-table-column>
    </el-table>
  </div>

  <!--绑定会员-->
  <el-dialog title="绑定会员" :visible.sync="dialogBindingVisible" width="600px">
    <el-form :model="addForm" ref="addForm" :rules="addFormRules">
      <el-form-item label="姓名" prop="name">
        <el-input auto-complete="off" v-model="addForm.name"></el-input>
      </el-form-item>
			<el-form-item label="手机号" prop="phone">
				<el-input auto-complete="off" v-model="addForm.phone"></el-input>
			</el-form-item>
			<el-form-item label="会员卡号" prop="card_no">
				<el-input auto-complete="off" v-model="addForm.card_no"></el-input>
			</el-form-item>
      <el-form-item label="车牌号" prop="carNum">
        <el-input auto-complete="off" v-model="addForm.carNum"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogBindingVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitBinding('addForm')">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 交易明细 -->
  <el-dialog title="交易明细" :visible.sync="dialogDetailedVisible">
    <el-form  :inline="true" :model="detailed" ref="detailed">
       <el-form-item>
          <el-input v-model="detailed.cardNum" placeholder="请输入卡号"></el-input>
       </el-form-item>
       <el-form-item>
         <template>
           <el-select v-model="detailed.trans_type" clearable placeholder="请选择交易类型">
             <el-option
               v-for="item in detailedoOptions"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
          </template>
       </el-form-item>
       <el-form-item>
         <el-date-picker v-model="detailed.startTime" placeholder="选择开始日期" :editable='false'>
         </el-date-picker>
       </el-form-item>
       <el-form-item>
         <el-date-picker v-model="detailed.endTime" placeholder="选择开始日期" :editable='false'>
         </el-date-picker>
       </el-form-item>
       <el-form-item  style="float:right">
         <el-button type="primary" @click="clickScreen">筛选</el-button>
       </el-form-item>
     </el-form>
    <el-table border :data="detailedData">
      <el-table-column property="name" label="绑定人姓名"></el-table-column>
      <el-table-column property="phone" label="绑定人手机号"></el-table-column>
      <el-table-column property="amount" label="交易金额￥"></el-table-column>
      <el-table-column property="creat_time" label="交易时间" :formatter="creat_time"></el-table-column>
      <el-table-column property="comments" label="交易描述"></el-table-column>
    </el-table>
    <el-row class="toolbar">
      <el-pagination layout="prev, pager, next" :current-page="detailedPage" @current-change="detailedCurrentChange" :page-size="20" :total="detailedTotal" background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </el-dialog>
  <!--工具条-->
  <el-row class="toolbar">
    <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
    </el-pagination>
  </el-row>
</section>
</template>

<script>
import * as util from '../../../util/util.js'
//
import {
  queryCompany,
  insertBindAcc,
  checkAccountByNum,
  companyTrans,
  depositCompany
} from '../../../api/shop';

export default {
  data() {
    var validateCard_no = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入会员卡号'));
      }
      setTimeout(() => {
        let para={
          card_no:String(value),
          phone:this.addForm.phone
        }
        checkAccountByNum(para).then((res)=>{
          let {status,message}=res;
          if (status==200) {
            this.addForm.accountId=res.data.accountId;
            this.addForm.cardNum=res.data.cardNum;
            callback();
          }else {
            callback(new Error(message));
          }
        })
      }, 1000);
    };
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入负责人电话'));
      }
      if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))) {
        callback(new Error('请输入正确的电话号码'));
      } else {
        callback();
      }
    };
    var validateCarNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入车牌号'));
      }
      if (!(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(value))) {
        callback(new Error('请输入正确的车牌号如：陕A12345'));
      } else {
        callback();
      }
    };
    return {
      filters:{
        name:'',
        cardNum:'',
      },
      detailed:{
        cid:'',
        cardNum:'',
        trans_type:'',
        startTime:Date(),
        endTime:Date()
      },
      detailedoOptions: [{
         value: 'IN',
         label: '存入'
       }, {
         value: 'OUT',
         label: '支出'
       }],
      dialogBindingVisible: false,
      dialogDetailedVisible:false,
      users: [],
      detailedData:[],
      total: 0,
      detailedTotal:0,
      page: 1,
      detailedPage:1,
      listLoading: false,
      addForm: {
        cid:'',
        name:'',
        phone:'',
        carNum:'',
        card_no:'',
        accountId:'',
        cardNum:''
      },
      addFormRules:{
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        card_no: [
          { required: true, validator: validateCard_no, trigger: 'blur' }
        ],
        carNum: [
          { required: true, validator: validateCarNum, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    //金额格式化
    format_balance(row, column){
      return util.number_format(row.balance, 2, ".", ",")
    },
    //列表时间格式化
    creat_time(row, column){
      return row.creat_time=util.formatDate.format(new Date(row.creat_time), 'yyyy-MM-dd');
    },
		//绑定会员
		clickBind(index,row){
			this.dialogBindingVisible=true;
      this.addForm.cid=row.id;
		},
    //充值
    clickRecharge(index,row) {
      this.$prompt('请输入充值金额（元）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(([1-9][0-9]*)|([0]\.[1-9]{1})|([0]\.[1-9][0-9]{1})|([0]\.[0-9][1-9]{1})|([1-9][0-9]*\.\d{0,2}))$/,
        inputErrorMessage: '充值金额不正确'
      }).then(({ value }) => {
        let para={
          cid:String(row.id),
          amount:value
        }
        depositCompany(para).then((res)=>{
          let {status,message}=res;
          if (status==200) {
            this.$message({
              message: message,
              type: 'success'
            });
            //查询会员卡列表
            this.getUsers();
          }else {
            this.$message.error(message);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消充值'
        });
      });
    },
    //绑定会员提交
    submitBinding(formName){
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            let para={
              name:this.addForm.name,
              phone:this.addForm.phone,
              carNum:this.addForm.carNum,
              cid:String(this.addForm.cid),
              accountId:String(this.addForm.accountId),
              cardNum:this.addForm.cardNum
            }
            insertBindAcc(para).then((res)=>{
              let {status,message}=res;
              if (status==200) {
                this.dialogBindingVisible=false;
                this.$refs[formName].resetFields();
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
          });
        }
      });
    },
    //查看以绑定会员列表
    clickSee(index,row){
      var cid=String(row.id);
      sessionStorage.setItem('cid', JSON.stringify(cid));
      var _this = this;
      _this.$router.push('/index4/tab8');
    },
    //查看交易明细
    clickDetailed(index,row){
      this.dialogDetailedVisible=true;
      this.detailed.cid=row.id;
      this.clickScreen()
      // let para={
      //   pagNum:String(this.detailedPage),
      //   cid:String(row.id),
      //   cardNum:this.detailed.cardNum,
      //   trans_type:this.detailed.trans_type,
      //   startTime:this.detailed.startTime,
      //   endTime:this.detailed.endTime
      // }
      // para.startTime = (!para.startTime || para.startTime == '') ? '' : util.formatDate.format(new Date(para.startTime), 'yyyy-MM-dd');//开始时间
      // para.endTime = (!para.endTime || para.endTime == '') ? '' : util.formatDate.format(new Date(para.endTime), 'yyyy-MM-dd');//结束时间
      // companyTrans(para).then((res)=>{
      //   let {status,message}=res;
      //   if (status==200) {
      //     this.detailedData=res.data.bindTransList;
      //     this.detailedTotal=res.data.total;
      //   }
      // })
    },
    clickScreen(){
      this.detailedPage = 1
      this.clickScreenList()
    },
    clickScreenList(){
      let para={
        pagNum:String(this.detailedPage),
        cid:String(this.detailed.cid),
        cardNum:this.detailed.cardNum,
        trans_type:this.detailed.trans_type,
        startTime:this.detailed.startTime,
        endTime:this.detailed.endTime
      }
      para.startTime = (!para.startTime || para.startTime == '') ? '' : util.formatDate.format(new Date(para.startTime), 'yyyy-MM-dd');//开始时间
      para.endTime = (!para.endTime || para.endTime == '') ? '' : util.formatDate.format(new Date(para.endTime), 'yyyy-MM-dd');//结束时间
      companyTrans(para).then((res)=>{
        this.detailedData=res.data.bindTransList;
        this.detailedTotal=res.data.total;
      })
    },
		//分页
    handleCurrentChange(val) {
      this.page = val;
      this.getList()
    },
    //交易明细分页
    detailedCurrentChange(val){
      this.detailedPage=val;
      this.clickScreenList()
    },
    getUsers(){
      this.page = 1
      this.getList()
    },
		//查询会员卡列表
		getList(){
      this.listLoading=true;
      let para={
        pagNum: String(this.page),
        name:this.filters.name,
        cardNum:this.filters.cardNum
      }
      queryCompany(para).then((res)=>{
        let {status,message}=res;
        if (status==200) {
          this.users=res.data.companyList;
          this.total=res.data.total;
        }
        this.listLoading = false;
      })
		},
    //新增公司账户
    handleAdd: function() {
      var _this = this;
      _this.$router.push('/index4/tab3s');
    }
  },
  mounted() {
    //查询会员卡列表
		this.getUsers();
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
</style>
