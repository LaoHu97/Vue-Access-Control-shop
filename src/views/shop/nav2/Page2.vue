<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="款台名称">
          <el-input v-model="filters.username" class="fixed_search_input" placeholder="款台名称"></el-input>
        </el-form-item>
        <el-form-item label="款台编号">
          <el-input v-model="filters.account" class="fixed_search_input" placeholder="款台编号"></el-input>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="account" label="款台编号" min-width="120">
        </el-table-column>
        <el-table-column prop="reverse1" label="所属门店" min-width="120">
        </el-table-column>
        <el-table-column prop="username" label="款台名称" min-width="120">
        </el-table-column>
        <el-table-column label="聚合支付码" width="120">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleCode(scope.$index, scope.row)">聚合支付码</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
            <el-button type="info" size="mini" @click="handleMoney(scope.$index, scope.row)">刷卡收款</el-button>
            <el-button type="info" size="mini" @click="handleAdvance(scope.$index, scope.row)">动态付款码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total"
        background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
    <!-- 二维码 -->
    <el-dialog :visible.sync="editFormCode" :close-on-click-modal="true" width="600px">
      <el-form :model="editCode" label-width="" ref="editCode" style="width:auto">
        <img :src="editCode.code" alt="二维码" width="100%">
        <el-button type="primary" @click="code" style="position:absolute;left:50%;margin-left:-44px;margin-top:-20px;">点击下载</el-button>
      </el-form>
    </el-dialog>
    <!-- 动态付款码 -->
    <el-dialog title="动态付款码" :visible.sync="dialogFormMoneyAdvanceVisible" width="380px">
      <el-form :model="formMoneyAdvance" :rules="formMoneyAdvanceRules" ref="formMoneyAdvance" label-position="left" label-width="110px">
        <el-form-item label="收款金额(元)" prop="total_fee">
          <el-input v-model="formMoneyAdvance.total_fee" placeholder="请输入收款金额"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="pay_type">
          <el-select v-model="formMoneyAdvance.pay_type" placeholder="请选择支付方式">
            <el-option
              v-for="item in optionsPayType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单信息">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formMoneyAdvance.order_body">
          </el-input>
        </el-form-item>
        <el-form-item label-width="0" v-show="qrCodeHeidder" style="margin-top:45px;text-align: center;">
          <canvas ref="canvas"></canvas>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormMoneyAdvanceVisible = false">取 消</el-button>
        <el-button type="primary" @click="submiltMoneyAdvance('formMoneyAdvance')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 刷卡收款 -->
    <el-dialog title="刷卡收款" :visible.sync="dialogFormMoneyVisible" width="380px">
      <el-form :model="formMoney" :rules="formMoneyRules" ref="formMoney" label-position="left" label-width="110px">
        <el-form-item label="收款金额(元)" prop="total_fee">
          <el-input v-model="formMoney.total_fee" placeholder="请输入收款金额"></el-input>
        </el-form-item>
        <el-form-item label="付款码" prop="auth_no">
          <el-input v-model="formMoney.auth_no" placeholder="请输入付款码" @change ="inputChange"></el-input>
        </el-form-item>
        <el-form-item label="订单信息">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formMoney.order_body">
          </el-input>
        </el-form-item>
        <el-form-item label="支付方式" v-show="formMoney.pay_type">
          <el-tag>
            <span>{{formMoney.pay_type === '010' ? '微信支付' : '支付宝支付'}}</span>
          </el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormMoneyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submiltMoney('formMoney')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 款台详情 -->
    <el-dialog title="款台详情" :visible.sync="editFormVisible" :close-on-click-modal="false" width="600px">
      <el-form :model="editForm" label-width="140px" ref="editForm" label-position="left">
        <el-form-item label="款台名称：">
          <span>{{editForm.username}}</span>
        </el-form-item>
        <el-form-item label="款台编号：">
          <span>{{editForm.account}}</span>
        </el-form-item>
        <el-form-item label="联系电话：">
          <span>{{editForm.phone}}</span>
        </el-form-item>
        <el-form-item label="邮箱：">
          <span>{{editForm.email}}</span>
        </el-form-item>
        <el-form-item label="所属门店：">
          <span>{{editForm.storeName}}</span>
        </el-form-item>
        <el-form-item label="对接终端号：">
          <span>{{editForm.reverse1}}</span>
        </el-form-item>
        <el-form-item label="对接token：">
          <span>{{editForm.etoken}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
  import QRCode from 'qrcode' 
  import * as util from '@/util/util.js'
  import * as data from '@/util/data.js'
  import CryptoJS from "crypto-js";
  import {
    queryEmployeeShop,
    queryEmployeeDetail,
    getEmpTwoCode,
    barcodepay,
    prepay
  } from '../../../api/shop';

  export default {
    data() {
      var phone = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if (!/^1(3|4|5|7|8)\d{9,10}$/.test(value)) {
          callback(new Error('请输入正确的联系人联系电话'));
        } else {
          callback();
        }
      };
      var money = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
          callback(new Error('请输入正确的金额'));
        } else {
          callback();
        }
      };
      return {
        filters: {
          username: '',
          account: ''
        },
        editForm: {},
        users: [],
        total: 1,
        page: 1,
        listLoading: false,

        editFormVisible: false, //编辑界面是否显示
        editFormCode: false,
        editCode: {
          code: ''
        },

        dialogFormMoneyVisible: false,
        optionsPayType: [{
          value: '010',
          label: '微信'
        }, {
          value: '020',
          label: '支付宝'
        }],
        formMoneyRules: {
          total_fee: [
            { required: true, message: '请输入收款金额', trigger: 'blur' },
            { validator: money, trigger: 'blur' }
          ],
          auth_no: [
            { required: true, message: '请输入付款码', trigger: 'blur' }
          ]
        },
        formMoney: {
          merchant_no: '',
          terminal_id: '',
          total_fee: '',
          auth_no: '',
          pay_type: '',
          order_body: ''
        },

        dialogFormMoneyAdvanceVisible: false,
        formMoneyAdvanceRules: {
          total_fee: [
            { required: true, message: '请输入收款金额', trigger: 'blur' },
            { validator: money, trigger: 'blur' }
          ],
          pay_type: [
            { required: true, message: '请选择支付方式', trigger: 'change' }
          ]
        },
        formMoneyAdvance: {
          merchant_no: '',
          terminal_id: '',
          total_fee: '',
          pay_type: '010',
          order_body: '',
          QueryDetail: ''
        },
        qrCodeHeidder: false
      }
    },
    methods: {
      submiltMoneyAdvance(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = this.formMoneyAdvance
            prepay(para).then(res => {
              if (res.data.return_code !== '01') {
                return this.$message({
                    message: res.data.return_msg,
                    type: 'warning'
                  });
              }
              this.formMoneyAdvance.QueryDetail= res.data.qr_code;
              this.qrCodeHeidder = true
              let canvas = this.$refs.canvas
                QRCode.toCanvas(canvas, this.formMoneyAdvance.QueryDetail, function (error) {
                  if (error) {
                    console.log(error);
                  }else{
                    this.$message({
                      message: res.data.return_msg,
                      type: 'success'
                    });
                  }
                })
            })
          } else {
            return false;
          }
        });
      },
      handleAdvance(index, row) {
        this.dialogFormMoneyAdvanceVisible = true
        this.$nextTick(() => {
          this.$refs.formMoneyAdvance.resetFields()
          this.formMoneyAdvance.QueryDetail = ''
          this.qrCodeHeidder = false
          queryEmployeeDetail({eid:row.eid}).then(res => {
            this.formMoneyAdvance.merchant_no = res.data.merPayNum
            this.formMoneyAdvance.terminal_id = res.data.employee.reverse1
          })
        })
      },
      submiltMoney(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = this.formMoney
            barcodepay(para).then(res => {
              if (res.data.return_code !== '01') {
                this.$message({
                  message: res.data.return_msg,
                  type: 'warning'
                });
              }else{
                this.dialogFormMoneyVisible = false
                this.$message({
                  message: res.data.return_msg,
                  type: 'success'
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      handleMoney(index, row) {
        this.dialogFormMoneyVisible = true
        this.$nextTick(() => {
          this.$refs.formMoney.resetFields()
          queryEmployeeDetail({eid:row.eid}).then(res => {
            this.formMoney.merchant_no = res.data.merPayNum
            this.formMoney.terminal_id = res.data.employee.reverse1
          })
        })
      },
      inputChange(val){
        let leftTwo = val.slice(0,2)
        if (leftTwo === '28') {
          this.formMoney.pay_type = '020'
        }else{
          this.formMoney.pay_type = '010'
        }
      },
      //显示二维码
      handleCode: function (inde, row) {
        this.editFormCode = true;
        let para = {
          mid: row.mid,
          eid: row.eid,
          storeId: row.storeId
        }
        this.editCode.code = getEmpTwoCode + "?" + "mid=" + para.mid + "&" +
          "eid=" + para.eid + "&" + "storeId=" + para.storeId
      },
      code: function () {
        window.location.href = this.editCode.code
      },
      //状态显示转换
      handleCurrentChange(val) {
        this.page = val;
        this.getList();
      },
      getUsers() {
        this.page = 1
        this.getList()
      },
      //获取用户列表
      getList() {
        let para = {
          pageNum: this.page,
          username: this.filters.username,
          account: this.filters.account
        };
        this.listLoading = true;
        queryEmployeeShop(para).then((res) => {
          var _this = this;
          let {
            status,
            message
          } = res;
          if (status == 200) {
            this.total = res.data.totalCount;
            this.users = res.data.employeeList;
            var sta;
            for (var i = 0; i < this.users.length; i++) {
              sta = this.users[i];
              if (sta.status == 1) {
                sta.status = true
              } else {
                sta.status = false
              }
            }
          }
          this.listLoading = false;
        });
      },
      //显示详情界面
      handleDetail: function (index, row) {
        this.editFormVisible = true;
        let para = {
          eid: row.eid
        };
        queryEmployeeDetail(para).then((res) => {
          var _this = this;
          let {
            status,
            message
          } = res;
          if (status == 200) {
            this.editForm = res.data.employee;
            this.editForm.storeName = res.data.storeName
          }
        })
      }
    },
    mounted() {
      this.getUsers();
    }
  }
</script>
