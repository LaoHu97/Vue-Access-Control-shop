<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="持卡人姓名">
          <el-input v-model="filters.name" class="fixed_search_input" placeholder="持卡人姓名"></el-input>
        </el-form-item>
        <el-form-item label="会员卡号">
          <el-input v-model="filters.card_no" class="fixed_search_input" placeholder="会员卡号"></el-input>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="getUsers" round>查询</el-button>
          <el-button type="primary" v-on:click="cogradientCard" round>同步会员卡</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!--列表-->
    <template v-loading="listLoading">
      <el-table :data="users" border highlight-current-row @sort-change="sortChange">
        <el-table-column prop="card_no" label="会员卡号" min-width="120">
        </el-table-column>
        <el-table-column prop="wx_name" label="微信昵称" min-width="120">
        </el-table-column>
        <el-table-column prop="name" label="持卡人" min-width="120">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120">
        </el-table-column>
        <el-table-column prop="creat_time" label="领卡时间" :formatter="creat_time" min-width="95">
        </el-table-column>
        <el-table-column prop="account_bouns" label="积分" sortable="custom" min-width="120" v-if="supplyBouns">
        </el-table-column>
        <el-table-column prop="actual_balance" label="余额（元）" sortable="custom" min-width="130" :formatter="format_actual_balance" v-if="supplyBalance">
        </el-table-column>
        <el-table-column align="center" label="操作" width="480">
          <template slot-scope="scope">
            <el-button size="mini" type="info" @click="makeupEdit(scope.$index, scope.row)">线下消费补录</el-button>
            <el-button size="mini" type="warning" @click="resetPassword(scope.$index, scope.row)" v-if="supplyBalance">会员卡支付密码重置</el-button>
            <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">消费记录</el-button>
            <el-button size="mini" type="primary" @click="handleRecharge(scope.$index, scope.row)" v-if="ifRecharge">充值</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog title="会员充值" :visible.sync="dialogRechargeVisible" width="30%">
      <el-form ref="formRecharge" status-icon :rules="rulesFormRecharge" :model="formRecharge" label-width="100px">
        <el-form-item label="微信昵称：" class="table_recharge">
          <span>{{formRecharge.wx_name}}</span>
        </el-form-item>
        <el-form-item label="会员卡号：" class="table_recharge">
          <span>{{formRecharge.card_barcode}}</span>
        </el-form-item>
        <el-form-item label="充值金额：" prop="amount" class="table_recharge">
          <el-input v-model="formRecharge.amount" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRechargeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRecharge('formRecharge')" :loading="rechargeLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
    <!--新增界面-->
    <el-dialog title="线下消费补录" :visible.sync="addFormVisible" :close-on-click-modal="false" width="600px">
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
        <el-form-item label="选择门店" prop="store">
          <el-select v-model="addForm.store" placeholder="请选择门店名称" :multiple="false" filterable remote :remote-method="remoteShop"
            :loading="loading" clearable @visible-change="clickShop">
            <el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择款台" prop="emp">
          <el-select v-model="addForm.emp" placeholder="请选择款台" :multiple="false" filterable remote :remote-method="remoteEditEmp" :loading="loadingEmp"
            clearable @visible-change="clickEditEmp">
            <el-option v-for="item in optionEditEmp" :key="item.eid" :value="item.eid" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消费金额" prop="amount">
          <el-input v-model="addForm.amount" auto-complete="off" style="max-width:217px;"></el-input>
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
import * as util from "../../../util/util.js";
import CryptoJS from "crypto-js";
import {
  queryMemberList,
  resetMemPwd,
  sysMemberInsert,
  selectStoreList,
  selectEmpsBySid,
  lookupUser,
  inputMemTrans,
  memberAccountDeposit
} from "../../../api/shop";
export default {
  data() {
    var validateAmount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入充值金额"));
      }
      let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的充值金额"));
      } else {
        callback();
      }
    };
    return {
      filters: {
        name: "",
        card_no: ""
      },
      prop: "",
      order: "",
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      supplyBalance: true,
      supplyBouns: true,
      addFormVisible: false, //新增界面是否显示
      addForm: {
        id: "",
        store: "",
        emp: "",
        amount: ""
      },
      addLoading: false,
      addFormRules: {
        store: [
          {
            required: true,
            type: "number",
            message: "请选择门店",
            trigger: "change"
          }
        ],
        emp: [
          {
            required: true,
            type: "number",
            message: "请选择款台",
            trigger: "change"
          }
        ],
        amount: [
          {
            required: true,
            message: "请输入金额",
            trigger: "blur"
          }
        ]
      },
      //选择门店
      options: [],
      //选择款台
      optionEditEmp: [],
      loading: false,
      loadingEmp: false,
      dialogRechargeVisible: false,
      formRecharge: {},
      rulesFormRecharge: {
        amount: [{ validator: validateAmount, trigger: "blur" }]
      },
      rechargeLoading: false,
      ifRecharge: true
    };
  },
  created () {
    let mid = JSON.parse(sessionStorage.getItem('mid'))
    if (mid !== 870) {
      this.ifRecharge = false
    }
  },
  methods: {
    //格式化金额
    format_actual_balance(row, column) {
      return util.number_format(row.actual_balance, 2, ".", ",");
    },
    handleRecharge(index, row) {
      this.dialogRechargeVisible = true;
      this.formRecharge.wx_name = row.wx_name;
      this.formRecharge.card_barcode = row.card_barcode;
      this.formRecharge.memberId = row.id;
    },
    submitRecharge(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = {
            amount: this.formRecharge.amount,
            memberId: this.formRecharge.memberId.toString()
          };
          this.rechargeLoading = true;
          memberAccountDeposit(para).then(res => {
            this.rechargeLoading = false;
            if (res.status === 200) {
              this.dialogRechargeVisible = false
              this.$message({
                message: '恭喜你，充值成功',
                type: 'success'
              });
              this.getUsers()
              this.$refs[formName].resetFields();
            }
          });
        } else {
          return false;
        }
      });
    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = {
              eid: this.addForm.emp.toString(),
              sid: this.addForm.store.toString(),
              amount: this.addForm.amount.toString(),
              memId: this.addForm.id.toString()
            };
            inputMemTrans(para).then(res => {
              this.addLoading = false;
              if (res.status == 200) {
                //
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getUsers();
              } else {
                this.$message({
                  message: res.message,
                  type: "warning"
                });
              }
            });
          });
        }
      });
    },
    //款台远程搜索
    clickEditEmp: function(val) {
      if (val) {
        let para = {
          storeId: String(this.addForm.store),
          ename: ""
        };
        selectEmpsBySid(para).then(res => {
          let { status, data } = res;
          this.optionEditEmp = data.emplyeeList;
        });
      }
    },
    remoteEditEmp(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          selectEmpsBySid({
            ename: String(query),
            storeId: String(this.addForm.store)
          }).then(res => {
            let { status, data } = res;
            this.optionEditEmp = data.emplyeeList;
          });
        }, 200);
      } else {
        this.optionEditEmp = [];
      }
    },
    //门店远程搜索
    clickShop: function(val) {
      if (val) {
        selectStoreList().then(res => {
          let { status, data } = res;
          this.options = data.storeList;
        });
      }
    },
    remoteShop(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          selectStoreList({
            sname: query
          }).then(res => {
            let { status, data } = res;
            this.options = data.storeList;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    //显示新增界面
    makeupEdit: function(index, row) {
      this.addForm.id = row.id;
      this.addFormVisible = true;
    },
    //同步会员卡
    cogradientCard() {
      this.$prompt("请输入会员卡号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          sysMemberInsert({
            code: value
          }).then(res => {
            let { status, message } = res;
            if (status == 200) {
              this.$message({
                type: "success",
                message: message
              });
            } else {
              this.$message({
                message: message,
                type: "warning"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //排序
    sortChange(sort) {
      this.prop = sort.prop;
      this.order = sort.order;
      this.getUsers();
    },
    //重置密码
    resetPassword(index, row) {
      this.$prompt("请输入重置密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "密码格式不正确"
      })
        .then(({ value }) => {
          let para = {
            password: CryptoJS.MD5(
              value + row.phone + row.card_barcode
            ).toString(CryptoJS.enc.Hex),
            id: row.id
          };
          resetMemPwd(para).then(res => {
            let { status, message } = res;
            if (status == 200) {
              this.$message({
                message: message,
                type: "success"
              });
            } else {
              this.$message.error(message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //时间转化
    creat_time: function(row, column) {
      return (row.creat_time = util.formatDate.format(
        new Date(row.creat_time),
        "yyyy-MM-dd"
      ));
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    getUsers() {
      this.page = 1;
      this.getList();
    },
    //获取用户列表
    getList() {
      let para = {
        prop: this.prop,
        order: this.order,
        pageNum: this.page,
        name: this.filters.name,
        card_no: this.filters.card_no
      };
      this.listLoading = true;
      queryMemberList(para).then(res => {
        this.listLoading = false;
        this.supplyBalance = res.data.supplyBalance;
        this.supplyBouns = res.data.supplyBouns;
        this.total = res.data.total || 0;
        this.users = res.data.memberList;
      });
    },
    //会员详情
    handleEdit: function(index, row) {
      var card_no = row.card_no;
      sessionStorage.setItem("card_no", JSON.stringify(card_no));
      this.$router.push("/index3/tab6");
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style>
.table_recharge {
  font-size: 0;
}
.table_recharge label {
  width: 90px;
  color: #99a9bf;
}
.table_recharge .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
