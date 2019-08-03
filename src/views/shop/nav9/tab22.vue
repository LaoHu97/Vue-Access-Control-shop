<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="日期时间">
          <el-date-picker
            v-model="filters.startTime"
            class="fixed_search_input_datetime"
            type="datetime"
            placeholder="选择开始日期"
            :picker-options="pickerOptions1"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.endTime"
            class="fixed_search_input_datetime"
            type="datetime"
            placeholder="选择结束日期"
            :picker-options="pickerOptions2"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="getUsers" round>查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="name" label="规则名称"></el-table-column>
        <el-table-column prop="amount" label="充值面额"></el-table-column>
        <el-table-column prop="balance" label="赠送金额"></el-table-column>
        <el-table-column prop="bonus" label="赠送积分"></el-table-column>
        <el-table-column prop="coupon_name" label="赠送券"></el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">修改规则</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--工具条-->
    <el-row>
      <el-pagination
        layout="prev, pager, next"
        :current-page="page"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        background
        style="text-align:center;background:#fff;padding:15px;"
      ></el-pagination>
    </el-row>
    <el-dialog title="编辑规则" :visible.sync="activityDialogFormVisible" width="420px">
      <el-form :model="activityForm" label-position="left" label-width="120px">
        <el-form-item label="充值面额">
          <el-input-number
            v-model="activityForm.amount"
            :precision="2"
            :step="0.00"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="优惠券">
          <el-select v-model="activityForm.coupon_card_id" placeholder="请选择">
            <el-option
              v-for="item in optionsCoupons"
              :key="item.id"
              :label="item.title"
              :value="item.card_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="赠送金额">
          <el-input-number
            v-model="activityForm.balance"
            :precision="2"
            :step="0.00"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="赠送积分">
          <el-input-number
            v-model="activityForm.bonus"
            :precision="0"
            :step="0"
            :controls="false"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="activityDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submiltForm">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
//
import {
  queryDepositDetailList,
  sendVerCode,
  checkVerCode,
  updateReceiveCardAcStatus,
  queryCouponWithOutWDGifi,
  updateDepositDetailActivity
} from "../../../api/shop";
export default {
  data() {
    var myDate = new Date();
    return {
      //时间控制
      pickerOptions1: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < Date.now() - 3600 * 1000 * 24 * 90
          );
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < Date.now() - 3600 * 1000 * 24 * 90
          );
        }
      },
      filters: {
        startTime: new Date(
          myDate.getFullYear(),
          myDate.getMonth(),
          myDate.getDate()
        ),
        endTime: new Date(
          myDate.getFullYear(),
          myDate.getMonth(),
          myDate.getDate(),
          23,
          59,
          59
        )
      },

      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      optionsCoupons: "",
      activityDialogFormVisible: false,
      activityForm: {
        id: 0,
        amount: 0,
        coupon_card_id: "",
        bonus: 0,
        balance: 0
      }
    };
  },
  methods: {
    //时间转化
    create_time: function(row, column) {
      let begin_time = util.formatDate.format(
        new Date(row.begin_time),
        "yyyy/MM/dd"
      );
      let end_time = util.formatDate.format(
        new Date(row.end_time),
        "yyyy/MM/dd"
      );
      return `${begin_time} 至 ${end_time}`;
    },
    formatterStatus: function(row) {
      return row.status === "Y"
        ? "启用"
        : row.status === "N"
        ? "未启用"
        : "未知";
    },
    switchChange(row) {
      let para = {
        id: row.id,
        status: row.status
      };
      updateReceiveCardAcStatus(para).then(res => {
        this.getUsers();
      });
    },
    submiltForm() {
      let para = util.deepcopy(this.activityForm)
      updateDepositDetailActivity(para).then(res => {
        this.activityDialogFormVisible = false
        this.getUsers()
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      })
    },
    handleEdit(index, row) {
      this.activityDialogFormVisible = true;
      this.$nextTick(() => {
        this.activityForm.id = row.id
        this.activityForm.amount = row.amount
        this.activityForm.coupon_card_id = row.coupon_card_id
        this.activityForm.bonus = row.bonus
        this.activityForm.balance = row.balance
      })
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
        pagNum: this.page,
        startTime: this.filters.startTime,
        endTime: this.filters.endTime
      };
      para.id = this.$route.query.id;
      para.startTime =
        !para.startTime || para.startTime == ""
          ? ""
          : String(
              Date.parse(
                util.formatDate.format(
                  new Date(para.startTime),
                  "yyyy/MM/dd hh:mm:ss"
                )
              )
            ); //开始时间
      para.endTime =
        !para.endTime || para.endTime == ""
          ? ""
          : String(
              Date.parse(
                util.formatDate.format(
                  new Date(para.endTime),
                  "yyyy/MM/dd hh:mm:ss"
                )
              )
            ); //开始时间
      this.listLoading = true;
      queryDepositDetailList(para).then(res => {
        this.total = res.data.total;
        this.users = res.data.depositDetailList;
        this.listLoading = false;
      });
    }
  },
  mounted() {
    this.getUsers();
    queryCouponWithOutWDGifi({sid: this.$route.query.sid}).then(res => {
      this.optionsCoupons = res.data.couponList;
    });
  }
};
</script>

<style scoped>
</style>
