<template>
  <section>
    <div class="expense_from_view">
      <el-form
        ref="expenseForm"
        size="medium"
        :model="expenseForm"
        :rules="expenseFormRules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="选择会员卡" prop="wx_card_id">
          <el-select
            v-model="expenseForm.wx_card_id"
            placeholder="门店名称"
            :multiple="false"
            filterable
            remote
            :remote-method="remoteStore"
            :loading="searchLoading"
            clearable
            @focus="clickStore"
          >
            <el-option
              v-for="item in optionsStore"
              :key="item.id"
              :value="item.wxcard_id"
              :label="item.title"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="expenseForm.name" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" prop="dateTimes">
          <el-date-picker
            v-model="expenseForm.dateTimes"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            :default-time="['00:00:00', '00:00:00']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="优惠券" prop="wd_coupon_card_id">
          <el-select v-model="expenseForm.wd_coupon_card_id" placeholder="请选择">
            <el-option
              v-for="item in optionsCoupons"
              :key="item.id"
              :label="item.title"
              :value="item.card_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('expenseForm')">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
//
import {
  queryConsumeActivity,
  queryCouponWithOutWDGifi,
  addReceiveCardActivity,
  selectMemberCard
} from "../../../api/shop";
export default {
  data() {
    return {
      value1: "",
      expenseForm: {
        name: "",
        dateTimes: "",
        wx_card_id: "",
        wd_coupon_card_id: ''
      },

      expenseFormRules: {
        amount: [
          { required: true, message: "请输入消费金额", trigger: "blur" }
        ],
        name: [{ required: true, message: "请选择活动名称", trigger: "blur" }],
        dateTimes: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        wx_card_id: [
          { required: true, message: "请选择门店", trigger: "change" }
        ],
        // wd_coupon_card_id: [
        //   { required: true, message: "请选择门店", trigger: "change" }
        // ]
      },
      optionsCoupons: [],
      searchLoading: false,
      optionsStore: []
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = util.deepcopy(this.expenseForm);
          para.begin_time = para.dateTimes[0];
          para.end_time = para.dateTimes[1];
          para.type = '1'
          delete para.dateTimes;
          addReceiveCardActivity(para).then(res => {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.$router.push({
              path: "/index3/tab20-v"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clickStore: function() {
      this.searchLoading = true;
      selectMemberCard({
        title: ""
      }).then(res => {
        this.searchLoading = false;
        let { status, data } = res;
        this.optionsStore = data.memCardList;
      });
    },
    remoteStore(query) {
      if (query !== "") {
        this.searchLoading = true;
        setTimeout(() => {
          this.searchLoading = false;
          selectMemberCard({
            title: query
          }).then(res => {
            let { status, data } = res;
            this.optionsStore = data.memCardList;
          });
        }, 200);
      } else {
        this.optionsStore = [];
      }
    },
  },
  mounted() {
    queryCouponWithOutWDGifi().then(res => {
      this.optionsCoupons = res.data.couponList;
    });
  }
};
</script>

<style scoped>
.expense_from_view {
  width: 600px;
  margin: 20px auto;
}
</style>
