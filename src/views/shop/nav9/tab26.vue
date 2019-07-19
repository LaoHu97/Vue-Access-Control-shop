<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item style="float:right">
          <el-button type="primary" @click="getUsers" round>查询</el-button>
          <el-button type="primary" @click="addguize" round>新增规则</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="coupon_name" label="赠送券"></el-table-column>
        <el-table-column align="center" label="操作" width="140">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">修改规则</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--工具条-->
    <!-- <el-row>
      <el-pagination
        layout="prev, pager, next"
        :current-page="page"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        background
        style="text-align:center;background:#fff;padding:15px;"
      ></el-pagination>
    </el-row> -->
    <el-dialog title="编辑规则" :visible.sync="activityDialogFormVisible" width="420px">
      <el-form :model="activityForm" label-position="left" label-width="120px">
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
  queryConsumeDetailList,
  sendVerCode,
  checkVerCode,
  updateReceiveCardAcStatus,
  queryCouponWithOutWDGifi,
  updateConsumeDetailList,
  addConsumeDetailActivity,
  queryWdGiftCouponDetail,
  addWdGiftCouponDetail,
  updateWdGiftCouponDetail
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
        coupon_card_id: ""
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
      let para = util.deepcopy(this.activityForm);
      if (!para.id) {
        para.card_id = this.$route.query.card_id;
        addWdGiftCouponDetail(para).then(res => {
          this.activityDialogFormVisible = false;
          this.getUsers();
        });
      } else {
        updateWdGiftCouponDetail(para).then(res => {
          this.activityDialogFormVisible = false;
          this.getUsers();
        });
      }
    },
    addguize() {
      this.activityDialogFormVisible = true;
      this.activityForm = {
        coupon_card_id: ""
      };
    },
    handleEdit(index, row) {
      this.activityDialogFormVisible = true;
      this.$nextTick(() => {
        this.activityForm.id = row.id;
        this.activityForm.coupon_card_id = row.relation_coupon_id;
      });
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
        card_id: this.$route.query.card_id,
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
      queryWdGiftCouponDetail(para).then(res => {
        this.total = res.data.total;
        this.users = res.data;
        this.listLoading = false;
      });
    }
  },
  mounted() {
    this.getUsers();
    queryCouponWithOutWDGifi().then(res => {
      this.optionsCoupons = res.data.couponList;
    });
  }
};
</script>

<style scoped>
</style>
