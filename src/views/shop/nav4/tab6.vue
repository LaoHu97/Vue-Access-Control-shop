<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="filters">
      <el-form-item label="日期时间">
        <el-date-picker v-model="filters.startTime" class="fixed_search_input_datetime" type="datetime" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
        </el-date-picker>
      </el-form-item>
      <el-form-item>至</el-form-item>
      <el-form-item>
        <el-date-picker v-model="filters.endTime" class="fixed_search_input_datetime" type="datetime" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="会员卡号">
        <el-input v-model="filters.card_no" class="fixed_search_input" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item label="支付状态">
        <template>
					  <el-select v-model="filters.status" class="fixed_search_input" clearable placeholder="支付状态">
					    <el-option
					      v-for="item in statusOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					</template>
      </el-form-item>
      <el-form-item label="交易类型">
        <template>
						<el-select v-model="filters.reason_id" class="fixed_search_input" clearable placeholder="交易类型">
							<el-option
								v-for="item in typeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</template>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="getUsers" round>查询</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <div v-loading="listLoading">
  <el-table :data="users" border highlight-current-row style="width: 100%;">
    <el-table-column prop="account_name" label="会员姓名">
    </el-table-column>
    <el-table-column prop="account_num" label="会员卡号" min-width="120">
    </el-table-column>
    <el-table-column prop="amount" label="交易金额（元）" min-width="120" :formatter="format_amount">
    </el-table-column>
    <el-table-column prop="bouns" label="获得积分" min-width="120">
      <template slot-scope="scope">
					<span style="margin-left: 10px;color:blue">{{ scope.row.trans_type == 'OUT' ? '+' : '' }}</span>
					<span style="color:red">{{ scope.row.trans_type == 'IN' ? '-' : '' }}</span>
					<span style="margin-left: 10px">{{ scope.row.bouns }}</span>
				</template>
    </el-table-column>
    <el-table-column prop="account_balance" label="余额（元）" min-width="120" :formatter="format_account_balance">
    </el-table-column>
    <el-table-column prop="creat_stamp" label="交易时间" :formatter="creat_stamp" min-width="160">
    </el-table-column>
    <el-table-column prop="status" label="订单状态" :formatter="status">
    </el-table-column>
    <el-table-column prop="comments" label="交易类型">
    </el-table-column>
    <el-table-column prop="store_name" label="所属门店">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
					<el-button type="danger" size="mini" :disabled="scope.row.status==3" @click="refundClick(scope.$index, scope.row)" v-if="String(scope.row.reason_id)==='2'">{{scope.row.status==3?'已退款':'退款'}}</el-button>
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
  <el-dialog title="退款" :visible.sync="editFormVisible" :close-on-click-modal="false" width="600px">
    <el-form :model="editForm" label-position="right" label-width="90px" :rules="editFormRules" ref="editForm">
      <el-form-item label="验证码：" prop="code">
        <el-input v-model="editForm.code" placeholder="请输入验证码" style="width:60%;"></el-input>
        <el-button type="info" @click.native="codeClick" :disabled="refundDisabled">{{countdown}}{{text}}</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog>

</section>
</template>

<script>
import * as util from '../../../util/util.js'
//
import {
  queryAccTransList,
  sendVerCode,
  checkVerCode
} from '../../../api/shop';
export default {
  data() {
    var myDate = new Date();
    return {
      //时间控制
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90;
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90;
        }
      },
      filters: {
        card_no: '',
        status: '',
        startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()),
        endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 23, 59, 59),
        reason_id: ''
      },
      statusOptions: [{
        value: '3',
        label: '退款成功'
      }, {
        value: '1',
        label: '支付成功'
      }],
      typeOptions: [{
        value: '1',
        label: '充值'
      }, {
        value: '2',
        label: '消费'
      }, {
        value: '3',
        label: '积分兑换'
      }, {
        value: '11',
        label: '积分抵现'
      }, {
        value: '4',
        label: '领卡赠送'
      }, {
        value: '6',
        label: '绑定支出'
      }, {
        value: '7',
        label: '解绑存入'
      }, {
        value: '8',
        label: '绑定存入'
      }, {
        value: '9',
        label: '解绑支出'
      }, {
        value: '5',
        label: '其它'
      }],
      editFormRules: {
        code: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }, ],
      },
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      editFormVisible: false,
      countdown: '获取验证码',
      text: '',
      refundDisabled: false,
      editForm: {
        code: ''
      },
      editLoading: false,
      orderId: ''
    }
  },
  methods: {
    //金额格式化
    format_amount(row, column){
      return util.number_format(row.amount, 2, ".", ",")
    },
    format_account_balance(row, column){
      return util.number_format(row.account_balance, 2, ".", ",")
    },
    codeClick() {
      sendVerCode({
        orderId: this.orderId
      }).then((res) => {
        let {
          status,
          message
        } = res;
        if (status == 200) {
          let _this = this;
          _this.countdown = 60;
          _this.refundDisabled = true;
          _this.text = "秒后重试";
          let interval = window.setInterval(function() {
            if ((_this.countdown--) <= 0) {
              _this.countdown = '获取验证码';
              _this.text = "";
              _this.refundDisabled = false;
              window.clearInterval(interval);
            } else {
              _this.refundDisabled = true;
              _this.text = "秒后重试";
            }

          }, 1000);
        }
      })
    },
    refundClick(index, row) {
      this.editFormVisible = true;
      this.orderId = row.order_id;
    },
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            let para = {
              orderId: this.orderId,
              verCode: this.editForm.code
            }
            checkVerCode(para).then((res) => {
              let {
                status,
                message
              } = res;
              if (status == 200) {
                this.$message({
                  message: message,
                  type: 'success'
                });
              } else {
                this.$message({
                  message: message,
                  type: 'warning'
                });
              }
              this.getUsers();
              this.editFormVisible = false;
              this.editLoading = false;
              this.editForm.code = '';
            })
          });
        }
      });
    },
    //订单状态
    status: function(row, column) {
      return row.status == 3 ? '退款成功' : row.status == 1 ? '支付成功' : row.status == 2 ? '支付失败' : '未知';
    },
    //时间转化
    creat_stamp: function(row, column) {
      return row.creat_stamp = util.formatDate.format(new Date(row.creat_stamp), 'yyyy/MM/dd hh:mm:ss');
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
        card_no: this.filters.card_no,
        status: this.filters.status,
        startTime: this.filters.startTime,
        endTime: this.filters.endTime,
        reason_id: this.filters.reason_id
      };
      para.startTime = (!para.startTime || para.startTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(para.startTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
      para.endTime = (!para.endTime || para.endTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(para.endTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
      this.listLoading = true;
      queryAccTransList(para).then((res) => {
        this.total = res.data.total;
        this.users = res.data.accTransList;
        this.listLoading = false;
      });
    },
  },
  mounted() {
    var card_no = JSON.parse(sessionStorage.getItem("card_no"));
    if (card_no == null) {
      this.filters.card_no = "";
      this.getUsers();
    } else {
      this.filters.card_no = card_no;
      this.getUsers();
    }
  }
}
</script>

<style scoped>
</style>
