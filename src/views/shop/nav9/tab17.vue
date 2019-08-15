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
        <el-form-item label="所属门店" prop="apply_sid">
          <el-select
            :disabled="$route.query.id"
            v-model="expenseForm.apply_sid"
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
              :value="item.id"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('expenseForm')">立即创建</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
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
  addConsumeActivity,
  selectStoreListNew,
  selectConsumeByPrimaryKey,
  updateConsumeActivity
} from "../../../api/shop";
export default {
  data() {
    return {
      value1: "",
      expenseForm: {
        name: "",
        dateTimes: "",
        apply_sid: ""
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
        ]
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
          delete para.dateTimes;
          if (this.$route.query.id) {
            para.id = this.$route.query.id;
            updateConsumeActivity(para).then(res => {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.$router.push({
                path: "/index4/tab16-v"
              });
            });
          }else{
            addConsumeActivity(para).then(res => {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.$router.push({
                path: "/index4/tab16-v"
              });
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clickStore: function() {
      this.searchLoading = true;
      selectStoreListNew({
        sname: ""
      }).then(res => {
        this.searchLoading = false;
        let { status, data } = res;
        this.optionsStore = data.storeList;
      });
    },
    remoteStore(query) {
      if (query !== "") {
        this.searchLoading = true;
        setTimeout(() => {
          this.searchLoading = false;
          selectStoreListNew({
            sname: query
          }).then(res => {
            let { status, data } = res;
            this.optionsStore = data.storeList;
          });
        }, 200);
      } else {
        this.optionsStore = [];
      }
    },
    removeDomain(item) {
      var index = this.expenseForm.activityRule.indexOf(item);
      if (index !== 0) {
        this.expenseForm.activityRule.splice(index, 1);
      }
    },
    addDomain() {
      this.expenseForm.activityRule.push({
        amount: "",
        pla_coupon_id: "",
        name: ""
      });
    },
    getEditDele(id){
      selectConsumeByPrimaryKey({id: parseInt(this.$route.query.id)}).then(res => {
        this.expenseForm.name = res.data.consumeActivity.name;
        this.expenseForm.dateTimes = new Array(
          res.data.consumeActivity.begin_time,
          res.data.consumeActivity.end_time
        );
        this.expenseForm.apply_sid = res.data.consumeActivity.apply_sid;
      })
    }
  },
  async mounted() {
    // queryCouponWithOutWDGifi().then(res => {
    //   this.optionsCoupons = res.data.couponList;
    // });
    if (this.$route.query.id) {
      await this.clickStore();
      this.getEditDele();
    }
  }
};
</script>

<style scoped>
.expense_from_view {
  width: 600px;
  margin: 20px auto;
}
</style>
