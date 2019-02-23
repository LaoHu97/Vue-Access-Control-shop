<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="filters" ref="filters">
      <el-form-item label="联系电话">
        <el-input v-model="filters.phone" class="fixed_search_input" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="卡号">
        <el-input v-model="filters.cardNum" class="fixed_search_input" placeholder="请输入卡号"></el-input>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input v-model="filters.carNum" class="fixed_search_input" placeholder="请输入车牌号"></el-input>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="getUsers" round>查询</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;" border>
    <el-table-column prop="name" label="姓名">
    </el-table-column>
    <el-table-column prop="phone" label="联系电话" min-width="120">
    </el-table-column>
    <el-table-column prop="card_num" label="会员卡号" min-width="120">
    </el-table-column>
    <el-table-column prop="car_num" label="车牌号" min-width="120">
    </el-table-column>
    <el-table-column prop="actual_balance" label="账户余额￥" min-width="120">
    </el-table-column>
    <el-table-column label="操作" width="190">
      <template slot-scope="scope">
        	<el-button type="success" size="mini" @click="clickRecharge(scope.$index, scope.row)">充值</el-button>
					<el-button type="danger" size="mini" @click="clickRelieve(scope.$index, scope.row)">解除绑定<i class="el-icon-edit el-icon--right"></i></el-button>
				</template>
    </el-table-column>
  </el-table>
  <!--工具条-->
  <el-row>
    <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
    </el-pagination>
  </el-row>
  <!--绑定会员-->
  <el-dialog title="会员卡充值" :visible.sync="dialogBindingVisible" width="600px">
    <el-form :model="form" ref="form" :rules="formRules" label-position="right" label-width="100px">
      <el-form-item label="姓名：" prop="name">
        <el-tag type="gray">{{form.name}}</el-tag>
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-tag type="gray">{{form.phone}}</el-tag>
      </el-form-item>
      <el-form-item label="充值金额：" prop="amount">
        <el-input auto-complete="off" v-model="form.amount"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogBindingVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitRecharge">确 定</el-button>
    </div>
  </el-dialog>
</section>
</template>

<script>
import * as util from '../../../util/util.js'
//
import {
  queryBindAcc,
  bindDeposit,
  unBind
} from '../../../api/shop';

export default {
  data() {
    return {
      filters:{
        phone:'',
        cardNum:'',
        carNum:''
      },
      dialogBindingVisible: false,
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      form: {
        name:'',
        phone:'',
        amount:'',
        id:''
      },
      formRules:{
        amount: [
          { required: true, message: '请输入充值金额', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
		//绑定会员
		clickRelieve(index,row){
      this.$confirm('此操作会将会员卡余额归还发卡账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let para={
          id:String(row.id)
        }
        unBind(para).then((res)=>{
          let {status,message}=res;
          if (status==200) {
            this.$notify({
               title: '成功',
               message: message,
               type: 'success'
             });
             //查询会员卡列表
            this.getUsers();
          }else {
            this.$notify.error({
               title: '错误',
               message: message
             });
          }
        })
      }).catch(() => {
        this.$notify({
          title: '警告',
          message: '已取消操作',
          type: 'warning'
        });
      });
		},
    //显示充值
    clickRecharge(index,row){
      this.dialogBindingVisible=true;
      this.form = Object.assign({}, row);
    },
    submitRecharge(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认为'+this.form.name+'充值金额：'+this.form.amount+'￥', '提示', {type: 'warning'}).then(() => {
            let para={
              id:String(this.form.id),
              amount:this.form.amount
            }
            bindDeposit(para).then((res)=>{
              let {status,message}=res;
              if (status==200) {
                this.dialogBindingVisible=false;
                //查询会员卡列表
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
          });
        }
      });
    },
		//分页
    handleCurrentChange(val) {
      this.page = val;
      this.getList()
    },
    getUsers(){
      this.page = 1
      this.getList()
    },
		//查询会员卡列表
		getList(){
      this.listLoading=true;
      let para={
        cid:JSON.parse(sessionStorage.getItem('cid')),
        pagNum: String(this.page),
        phone:this.filters.phone,
        carNum:this.filters.carNum,
        cardNum:this.filters.cardNum
      }
      queryBindAcc(para).then((res)=>{
        let {status,message}=res;
        if (status==200) {
          this.users=res.data.bindAccList;
          this.total=res.data.total;
        }
        this.listLoading = false;
      })
		},
    //新增公司账户
    handleAdd: function() {
      var _this = this;
      _this.$router.push('/index3/tab3s');
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
