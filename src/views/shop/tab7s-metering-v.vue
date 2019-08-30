<template>
  <div style="margin: 0 auto;width: 700px">
    <el-form
      :model="meterForm"
      :rules="meterFormRules"
      ref="meterForm"
      label-position="left"
      label-width="160px"
      style="padding:50px;width:750px;float:left;background-color:#F9FAFC;border: 1px solid #e7e7eb;"
    >
      <el-form-item label="卡券标题" prop="title">
        <el-input v-model="meterForm.title"></el-input>
      </el-form-item>
      <el-form-item label="所属门店" prop="use_all_locations" v-if="$route.query.card_type == 'FREQUENCY'">
        <el-radio v-model="meterForm.use_all_locations" label="Y">全部门店</el-radio>
        <el-radio v-model="meterForm.use_all_locations" label="N">部分门店</el-radio>
      </el-form-item>
      <el-form-item label="选择门店" prop="store_id" v-if="$route.query.card_type == 'FREQUENCY' && meterForm.use_all_locations === 'N'">
          <el-select
            v-model="meterForm.store_id"
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
      <!-- <el-form-item label="是否分享" prop="can_share" v-if="$route.query.card_type == 'FREQUENCY'">
        <el-radio v-model="meterForm.can_share" label="1">分享</el-radio>
        <el-radio v-model="meterForm.can_share" label="2">不分享</el-radio>
      </el-form-item> -->
      <el-form-item label="卡券图片" prop="logo_url">
        <el-upload
          class="avatar-uploader"
          :action="uploadAgentImage"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="meterForm.logo_url" :src="meterForm.logo_url" class="avatar" />
          <i v-else class="el-icon-plus mini-avatar-uploader"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="初始次数" prop="initialTotal" v-if="$route.query.card_type == '6' || $route.query.card_type == 'FREQUENCY'">
        <el-input v-model.number="meterForm.initialTotal"></el-input>
      </el-form-item>
      <el-form-item label="劵数量" prop="quantity">
        <el-input v-model.number="meterForm.quantity"></el-input>
      </el-form-item>
      <el-form-item label="限领数量" prop="get_limit">
        <el-input v-model.number="meterForm.get_limit"></el-input>
      </el-form-item>
      <el-form-item label="有效期" prop="date_info">
        <template>
          <el-radio class="radio" v-model="meterForm.date_info" label="2">有效日期</el-radio>&nbsp;&nbsp;
          <el-tooltip class="item" effect="dark" content="注：有效日期填“0”代表当天" placement="top">
            <i class="fa fa-question-circle"></i>
          </el-tooltip>&nbsp;&nbsp;
          <el-radio class="radio" v-model="meterForm.date_info" label="1">固定日期</el-radio>
          <div v-if="meterForm.date_info === '1' ? true : false">
            <el-date-picker
              :editable="false"
              :clearable="false"
              v-model="meterForm.beginTime"
              type="date"
              value-format="timestamp"
              placeholder="开始时间"
            ></el-date-picker>
            <el-date-picker
              :editable="false"
              :clearable="false"
              v-model="meterForm.endTime"
              type="date"
              value-format="timestamp"
              placeholder="结束时间"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
          <div v-else>
            <el-input
              v-model="meterForm.fixed_begin_term"
              placeholder="自领取后多少天内开始生效"
              style="width:200px;"
            ></el-input>
            <el-input v-model="meterForm.fixed_term" placeholder="自领取后多少天内有效" style="width:200px;"></el-input>
          </div>
        </template>
      </el-form-item>
      <el-form-item label="可用时段" prop="resource">
        <template>
          <el-radio class="radio" v-model="meterForm.time_limit" label="0">全部时段</el-radio>
          <el-radio class="radio" v-model="meterForm.time_limit" label="1">部分时段</el-radio>
          <div v-if="meterForm.time_limit === '1'">
            <p>日期：</p>
            <el-checkbox-group v-model="meterForm.week">
              <el-checkbox label="MONDAY">周一</el-checkbox>
              <el-checkbox label="TUESDAY">周二</el-checkbox>
              <el-checkbox label="WEDNESDAY">周三</el-checkbox>
              <el-checkbox label="THURSDAY">周四</el-checkbox>
              <el-checkbox label="FRIDAY">周五</el-checkbox>
              <el-checkbox label="SATURDAY">周六</el-checkbox>
              <el-checkbox label="SUNDAY">周日</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="meterForm.time_limit === '1'">
            <p>时间：</p>
            <div style="margin-bottom: 5px" v-if="hour_minute">
              <el-time-select
                placeholder="起始时间"
                v-model="meterForm.begin_hour_minute"
                :picker-options="{
                    start: '00:00',
                    step: '00:10',
                    end: '24:59'
                  }"
              ></el-time-select>
              <el-time-select
                placeholder="结束时间"
                v-model="meterForm.end_hour_minute"
                :picker-options="{
                    start: '00:00',
                    step: '00:10',
                    end: '24:59',
                    minTime: meterForm.begin_hour_minute
                  }"
              ></el-time-select>
            </div>
            <!-- <div v-if="two_begin_hour_minute">
              <el-time-select
                placeholder="起始时间"
                v-model="begin_hour_minute_2"
                :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '24:59'
              }"
              ></el-time-select>
              <el-time-select
                placeholder="结束时间"
                v-model="end_hour_minute_2"
                :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '24:59',
                minTime: begin_hour_minute_2
              }"
              ></el-time-select>
            </div>-->
            <el-button type="text" @click="hour_minute=true">添加时间</el-button>
            <el-button type="text" @click="hour_minute=false">删除时间</el-button>
          </div>
        </template>
      </el-form-item>
      <div v-if="$route.query.card_type == '6' || $route.query.card_type == 'FREQUENCY'">
        <el-form-item label="一天核销次数" prop="numDay">
          <el-input v-model="meterForm.numDay"></el-input>
        </el-form-item>
        <el-form-item label="每次核销使用次数" prop="numWriteOff">
          <el-input v-model="meterForm.numWriteOff"></el-input>
        </el-form-item>
      </div>
      <!-- <div v-if="$route.query.card_type == '7' || $route.query.card_type == 'WDGIFT_COUPON'">
        <el-form-item
          v-for="(items, index) in meterForm.coupons"
          :label="'优惠券' + (index + 1)"
          :key="items.key"
          :prop="'coupons.' + index + '.value'"
          :rules="{
            required: true, message: '请选择优惠券', trigger: 'blur'
          }"
        >
          <el-select v-model="items.value" placeholder="请选择优惠券">
            <el-option
              v-for="item in optionsCoupons"
              :key="item.card_id"
              :label="item.title"
              :value="item.card_id"
            ></el-option>
          </el-select>
          <el-button @click.prevent="removeDomain(items)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">新增优惠券</el-button>
        </el-form-item>
      </div> -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('meterForm')">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as util from "../../util/util.js";
import {
  addWdFrequencyCard,
  addWdGiftCoupon,
  queryCouponWithOutWDGifi,
  uploadAgentImage,
  queryCouponDetails,
  updateWdFrequencyCard,
  updateWdGiftCoupon,
  selectStoreListNew
} from "../../api/shop";
export default {
  data() {
    var validate_service_phone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入负责人电话"));
      } else if (!/(^(\d{3,4}-)?\d{7,8})$|(1[3|5|7|8]\d{9})/.test(value)) {
        return callback(new Error("请输入正确的电话号码"));
      } else {
        callback();
      }
    };
    return {
      uploadAgentImage: uploadAgentImage,
      meterForm: {
        use_all_locations: 'Y',
        store_id: '',
        title: "",
        can_share: "1",
        quantity: "",
        get_limit: "",
        fixed_term: "",
        fixed_begin_term: "",
        date_info: "1",
        beginTime: "",
        endTime: "",
        time_limit: "0",
        numDay: "",
        numWriteOff: "",
        week: [],
        begin_hour_minute: "",
        end_hour_minute: "",
        initialTotal: "",
        logo_url: ""
      },
      optionsCoupons: [],
      searchLoading: false,
      optionsStore: [],

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },

      hour_minute: false,

      meterFormRules: {
        use_all_locations: [
          { required: true, message: "请选择所属门店", trigger: "change" }
        ],
        store_id: [
          { required: true, message: "请选择所属门店", trigger: "change" }
        ],
        title: [
          { required: true, message: "请输入卡券标题", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        can_share: [
          { required: true, message: "请选择是否分享", trigger: "change" }
        ],
        initialTotal: [
          { required: true, message: "请输入初始次数", trigger: "blur" }
        ],
        logo_url: [
          { required: true, message: "请上传次卡图片", trigger: "change" }
        ],
        quantity: [
          { required: true, message: "请输入劵数量" },
          { type: "number", message: "劵数量必须为数字值" }
        ],
        get_limit: [
          { required: true, message: "请输入限领数量" },
          { type: "number", message: "限领数量必须为数字值" }
        ],
        date_info: [
          { required: true, message: "请选择有效期", trigger: "change" }
        ],
        time_limit: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        numDay: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        numWriteOff: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    returnDisplay(){
      let para={
        card_id:String(JSON.parse(sessionStorage.getItem('id'))),
        channel_type: String(JSON.parse(sessionStorage.getItem('channel_type')))
      }
      queryCouponDetails(para).then((res)=>{
        this.meterForm.use_all_locations = res.data.memCard.use_all_locations
        this.meterForm.store_id = res.data.memCard.store_id
        this.meterForm.title = res.data.memCard.title
        this.meterForm.can_share = res.data.memCard.can_share
        this.meterForm.quantity = res.data.memCard.quantity
        this.meterForm.get_limit = res.data.memCard.get_limit
        this.meterForm.initialTotal = res.data.memCard.initialTotal
        this.meterForm.logo_url = res.data.memCard.logo_url
        let dataInfo = JSON.parse(res.data.memCard.rolu_info)
        console.log(dataInfo);
        this.meterForm.date_info = dataInfo.dateInfo.date_info
        if (dataInfo.dateInfo.date_info === '2') {
          this.meterForm.fixed_term = dataInfo.dateInfo.fixed_term
          this.meterForm.fixed_begin_term = dataInfo.dateInfo.fixed_begin_term
        }else if(dataInfo.dateInfo.date_info === '1'){
          this.meterForm.beginTime = dataInfo.dateInfo.beginTime
          this.meterForm.endTime = dataInfo.dateInfo.endTime
        }

        

        this.meterForm.time_limit = dataInfo.timeLimit.time_limit
        this.meterForm.numDay = res.data.memCard.numDay
        this.meterForm.numWriteOff = res.data.memCard.numWriteOff
        this.meterForm.week = dataInfo.timeLimit.weekList
        this.meterForm.begin_hour_minute = dataInfo.timeLimit.begin_hour_minute
        this.meterForm.end_hour_minute = dataInfo.timeLimit.end_hour_minute
      })
    },
    addTime() {
      if (this.one_begin_hour_minute) {
        this.two_begin_hour_minute = true;
      } else {
        this.one_begin_hour_minute = true;
      }
    },
    removeTime() {
      if (this.one_begin_hour_minute && this.two_begin_hour_minute) {
        this.two_begin_hour_minute = false;
        this.begin_hour_minute_2 = "";
        this.end_hour_minute_2 = "";
      } else if (this.one_begin_hour_minute && !this.two_begin_hour_minute) {
        this.one_begin_hour_minute = false;
        this.begin_hour_minute_1 = "";
        this.end_hour_minute_1 = "";
      }
    },
    clickStore: function() {
      this.searchLoading = true;
      selectStoreListNew({
        title: "",
        use_all_locations: 'N'
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
            title: query,
            use_all_locations: 'N'
          }).then(res => {
            let { status, data } = res;
            this.optionsStore = data.storeList;
          });
        }, 200);
      } else {
        this.optionsStore = [];
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      if (res.status === 200) {
        this.meterForm.logo_url = res.data.locationPath;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = util.deepcopy(this.meterForm);
          para.card_type = this.$route.query.card_type
          console.log(this.$route.query.card_type);
          if (this.$route.query.card_type == "FREQUENCY") {
            if (this.$route.query.card_id) {
              para.card_id = this.$route.query.card_id
              updateWdFrequencyCard(para).then(res => {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.$router.push({
                  path: "/index4/tab7-v"
                });
              });
            }else{
              addWdFrequencyCard(para).then(res => {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.$router.push({
                  path: "/index4/tab7-v"
                });
              });
            }
          } else {
            if (this.$route.query.card_id) {
              para.card_id = this.$route.query.card_id
              updateWdGiftCoupon(para).then(res => {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.$router.push({
                  path: "/index4/tab7-v"
                });
              });
            }else{
              addWdGiftCoupon(para).then(res => {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.$router.push({
                  path: "/index4/tab7-v"
                });
              });
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    if (this.$route.query.card_id) {
      this.returnDisplay();
    }
    // queryCouponWithOutWDGifi().then(res => {
    //   this.optionsCoupons = res.data.couponList;
    // });
  }
};
</script>
<style scoped lang="scss">
</style>
