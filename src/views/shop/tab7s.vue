<template>
<el-row>
  <el-col :span="8">
    <el-form class="wei-form">
      <div class="wei-form-01">
        <img src="../../assets/images/img_card_control.png" alt="">
      </div>
      <div class="wei-form-02" @click="Form1" v-bind:class="form_01.color">
        <div class="wei-logo">
          <img :src="imageUrl" style="width:40px;height:40px;display:block;float:left;margin-right:10px;border-radius:100%">
          <p>{{form_01.brand_name}}</p>
        </div>
        <div class="wei-tick">
          <h2>{{form_01.title}}</h2>
          <p>{{form_01.subtitle}}</p>
          <p>{{date_info=='2' ? '自领取后'+this.form_01.fixed_term + '天有效，' + '自领取后' + this.form_01.fixed_begin_term + '天生效' : '有效期：'+this.beginTime+"至"+this.endTime}}</p>
        </div>
        <div class="mask">
          <a class="info">Read More</a>
        </div>
        <div class="deco"></div>
      </div>
      <div class="shop_details" @click="Form2">
        <ul class="list" style="margin-top:0;border-top:none">
          <li style="border: none;height:55px;line-height:55px;">
            <span>销劵设置</span>
          </li>
          <div class="mask">
            <a class="info">Read More</a>
          </div>
        </ul>
      </div>
      <div class="shop_detail">
        <ul class="list">
          <li class="shop_detail_01" style="border: none" @click="Form3">
            <span>会员卡详情</span>
            <i class="el-icon-arrow-right"></i>
            <div class="mask">
              <a class="info">Read More</a>
            </div>
          </li>
          <li class="shop_detail_02" @click="Form4">
            <span>适用门店</span>
            <i class="el-icon-arrow-right"></i>
            <div class="mask">
              <a class="info">Read More</a>
            </div>
          </li>
        </ul>
      </div>
      <div class="shop_detail">
        <ul class="list">
          <li class="shop_detail_03" style="border: none" @click="Form5">
            <span v-if="this.form_05.customCell_name==''">自定义入口一（选填）</span>
            <span>{{form_05.customCell_name}}</span>
            <i class="el-icon-arrow-right"></i>
            <span style="float:right">{{form_05.customCell_tips}}</span>
            <div class="mask">
              <a class="info">Read More</a>
            </div>
          </li>
          <li class="shop_detail_04" style="border: none" @click="Form5">
            <span v-if="this.form_05.custom_url_name==''">自定义入口二（选填）</span>
            <span>{{form_05.custom_url_name}}</span>
            <i class="el-icon-arrow-right"></i>
            <span style="float:right">{{form_05.custom_url_sub_title}}</span>
            <div class="mask">
              <a class="info">Read More</a>
            </div>
          </li>
        </ul>
      </div>
    </el-form>
  </el-col>
  <el-col :span="16">
    <!-- 表单01 -->
    <el-form ref="form_01" :model="form_01" :rules="form_01Rules" label-width="100px" @submit.prevent="onSubmit" label-position="left" style="padding:0 0 0 55px;width:700px;float:left;background-color:#F9FAFC;border: 1px solid #e7e7eb" v-show="formDate1">
      <h3>券面信息</h3>
      <p style="color:#999;text-align:right;padding-right:15px;">注：带*号为必填项</p>
      <el-form-item label="商户logo" prop="logo">
        <el-upload class="avatar-uploader" :action="uploadimg" :data="uploaddata" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img :src="imageUrl" style="width:50px;height:50px;float:left">
          <el-button size="small" type="primary" style="float:right;margin-left:15px;">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="卡券颜色">
        <template>
          <el-select v-model="form_01.color" placeholder="请选择" style="width:60px;" popper-class="sele_color">
            <el-option
              v-for="item in optionscolor"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <i :class="item.iconCls"></i>
            </el-option>
          </el-select>
          <span class="xuzon" v-bind:class="this.form_01.color"></span>
        </template>
      </el-form-item>
      <el-form-item label="商户名称" prop="brand_name" style="width:300px;">
        <el-input v-model="form_01.brand_name" placeholder="请输入商户名称" :maxlength="12"></el-input>
      </el-form-item>
      <el-form-item label="卡券名称" prop="title" style="width:300px;">
        <el-input v-model="form_01.title" placeholder="请输入会员卡标题" :maxlength="9"></el-input>
      </el-form-item>
      <el-form-item label="有效期">
        <template>
          <el-radio class="radio" v-model="date_info" label="2">有效日期</el-radio>&nbsp;&nbsp;
          <el-tooltip class="item" effect="dark" content="注：有效日期填“0”代表当天" placement="top">
            <i class="fa fa-question-circle"></i>
          </el-tooltip>
          &nbsp;&nbsp;
          <el-radio class="radio" v-model="date_info" label="1">固定日期</el-radio>
          <div v-if="this.date_info === '1' ? true : false">
            <el-date-picker
              :editable="false"
              :clearable="false"
              v-model="beginTime"
              type="date"
              placeholder="开始时间">
            </el-date-picker>
            <el-date-picker
              :editable="false"
              :clearable="false"
              v-model="endTime"
              type="date"
              placeholder="结束时间"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div  v-else>
            <el-input v-model="form_01.fixed_begin_term" placeholder="自领取后多少天内开始生效" style="width:200px;"></el-input>
            <el-input v-model="form_01.fixed_term" placeholder="自领取后多少天内有效" style="width:200px;"></el-input>
          </div>
        </template>
      </el-form-item>
      <el-form-item :label="card_type_label01" prop="least_cost" style="width:300px;" v-if='least_cost_show'>
        <el-input v-model="form_01.least_cost" placeholder="代金券专用，表示起用金额"></el-input>
      </el-form-item>
      <el-form-item :label="card_type_label" prop="gift" style="width:300px;">
        <el-input v-model="form_01.gift" :placeholder="card_type_placeholder"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Form2">下一步</el-button>
      </el-form-item>
    </el-form>
    <!-- 表单02 -->
    <el-form ref="form_02" :model="form_02" :rules="form_02Rules" label-width="100px" @submit.prevent="onSubmit" label-position="left" style="padding:0 0 0 55px;width:700px;float:left;background-color:#F9FAFC;border: 1px solid #e7e7eb" v-show="formDate2">
      <h3>领劵设置</h3>
      <el-form-item label="库存" prop="quantity" style="width:300px;">
        <el-input v-model.number="form_02.quantity" placeholder="如：1000" :maxlength="9"></el-input>
      </el-form-item>
      <el-form-item label="领券限制" prop="get_limit" style="width:300px;">
        <el-input v-model="form_02.get_limit" placeholder="每个用户领券上限，默认为1"></el-input>
      </el-form-item>
      <el-form-item label="卡券领取页面是否可分享" label-width="180px">
        <template>
          <!-- `checked` 为 true 或 false -->
          <el-checkbox v-model="form_02.can_share"></el-checkbox>
        </template>
      </el-form-item>
      <el-form-item label="用户领券后可转赠其他好友" label-width="180px">
        <template>
          <!-- `checked` 为 true 或 false -->
          <el-checkbox v-model="form_02.can_give_friend"></el-checkbox>
        </template>
      </el-form-item>
      <h3>销劵设置</h3>
      <h4>二维码 ： 包含卡券信息的二维码，扫描后可进行销券</h4>
      <el-form-item label="操作提示" prop="notice" style="width:300px;">
        <el-input v-model="form_02.notice" placeholder="建议引导用户到店出示卡券"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Form3">下一步</el-button>
      </el-form-item>
    </el-form>
    <!-- 表单03 -->
    <el-form ref="form_03" :model="form_03" :rules="form_03Rules" label-width="100px" @submit.prevent="onSubmit" label-position="left" style="padding:0 0 0 55px;width:700px;float:left;background-color:#F9FAFC;border: 1px solid #e7e7eb" v-show="formDate3">
      <el-form-item label="特权说明" prop="prerogative" style="width:500px;margin-top:35px;">
        <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 10}" placeholder="请输入内容" v-model="form_03.prerogative">
        </el-input>
      </el-form-item>
      <el-form-item label="使用须知" prop="description" style="width:500px;">
        <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 10}" placeholder="请输入内容" v-model="form_03.description">
        </el-input>
      </el-form-item>
      <el-form-item label="客服电话" prop="service_phone" style="width:300px">
        <el-input placeholder="请输入手机或固话" v-model="form_03.service_phone">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Form4">下一步</el-button>
      </el-form-item>
    </el-form>
    <!-- 表单04 -->
    <el-form ref="form_04" :model="form_04" label-width="100px" @submit.prevent="onSubmit" label-position="left" style="padding:0 0 0 55px;width:700px;float:left;background-color:#F9FAFC;border: 1px solid #e7e7eb" v-show="formDate4">
      <h3>适用门店</h3>
      <p style="color:#ff6d6d">注：不选门店默认所有门店</p>
      <template>
        <el-table
          ref="multipleTable"
          :data="form_04.tableData"
          border
          tooltip-effect="dark"
          style="width: 90%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
      <el-table-column prop="storeName" label="门店名称" width="180">
      </el-table-column>
      <el-table-column prop="address" label="门店地址" show-overflow-tooltip>
      </el-table-column>
      </el-table>
      </template>
      <el-button type="primary" @click="Form5" style="margin-top:3px;">下一步</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;padding-right:70px;">
      </el-pagination>
    </el-form>
    <!-- 表单05 -->
    <el-form ref="form_05" :model="form_05" label-width="100px" @submit.prevent="onSubmit" label-position="left" style="padding:0 0 0 55px;width:700px;float:left;background-color:#F9FAFC;border: 1px solid #e7e7eb" v-show="formDate5">
      <h3>入口一</h3>
      <el-form-item label="入口名称" style="width:300px;">
        <el-input v-model="form_05.customCell_name" placeholder="请输入" :maxlength="6">
        </el-input>
      </el-form-item>
      <el-form-item label="引导语" style="width:300px;">
        <el-input v-model="form_05.customCell_tips" placeholder="请输入" :maxlength="6">
        </el-input>
      </el-form-item>
      <el-form-item label="网页链接" style="width:400px">
        <el-input v-model="form_05.customCell_url" placeholder="">
          <template slot="prepend">Http://</template>
        </el-input>
      </el-form-item>
      <h3>入口二</h3>
      <el-form-item label="入口名称" style="width:300px;">
        <el-input v-model="form_05.custom_url_name" placeholder="请输入" :maxlength="6">
        </el-input>
      </el-form-item>
      <el-form-item label="引导语" style="width:300px;">
        <el-input v-model="form_05.custom_url_sub_title" placeholder="请输入" :maxlength="6">
        </el-input>
      </el-form-item>
      <el-form-item label="网页链接" style="width:400px">
        <el-input v-model="form_05.custom_url" placeholder="">
          <template slot="prepend">Http://</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">立即创建</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</el-row>
</template>
<script>
import * as util from '../../util/util.js'
import {
  insertMenCard,
  queryStoreList,
  uploadimg
} from '../../api/shop';
export default {
  data() {
    var validate_service_phone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入负责人电话'));
      }else if (!(/(^(\d{3,4}-)?\d{7,8})$|(1[3|5|7|8]\d{9})/.test(value))) {
        return callback(new Error('请输入正确的电话号码'));
      }else {
        callback();
      }
    };
    return {
      card_type_placeholder: '',
      card_type_label: '',
      card_type_label01: '起用金额',
      least_cost_show: false,
      formDate1: true,
      formDate2: false,
      formDate3: false,
      formDate4: false,
      formDate5: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      uploadimg: uploadimg,
      uploaddata:{
        mid:''
      },
      optionscolor: [{
        label: "#63b359",
        value: "Color010",
        iconCls: 'Color010',
      }, {
        label: "#63b359",
        value: 'Color020',
        iconCls: 'Color020',
      }, {
        label: "#509fc9",
        value: 'Color030',
        iconCls: 'Color030',
      }, {
        label: "#5885cf",
        value: 'Color040',
        iconCls: 'Color040',
      }, {
        label: "#9062c0",
        value: 'Color050',
        iconCls: 'Color050',
      }, {
        label: "#d09a45",
        value: 'Color060',
        iconCls: 'Color060',
      }, {
        label: "#e4b138",
        value: 'Color070',
        iconCls: 'Color070',
      }, {
        label: "#ee903c",
        value: 'Color080',
        iconCls: 'Color080',
      }, {
        label: "#f08500",
        value: 'Color081',
        iconCls: 'Color081',
      }, {
        label: "#a9d92d",
        value: 'Color082',
        iconCls: 'Color082',
      }, {
        label: "#dd6549",
        value: 'Color090',
        iconCls: 'Color090',
      }, {
        label: "#cc463d",
        value: 'Color100',
        iconCls: 'Color100',
      }, {
        label: "#cf3e36",
        value: 'Color101',
        iconCls: 'Color101',
      }, {
        label: "#5E6671",
        value: 'Color102',
        iconCls: 'Color102',
      }],
      form_01: {
        brand_name: '',
        color: 'Color010',
        title: '',
        fixed_term: '',
        fixed_begin_term: '',
        gift: '',
        least_cost: ''
      },
      date_info: '2', //会员卡有效期
      beginTime: '', //会员卡有效期开始时间
      endTime: '', //会员卡有效期结束时间
      form_02: {
        quantity: '',
        get_limit: '1',
        can_share: true,
        can_give_friend: true,
        notice: ''
      },
      form_03: {
        prerogative: '',
        description: '',
        service_phone: ''
      },
      form_04: {
        tableData: [],
      },
      form_05: {
        customCell_name: '',
        customCell_tips: '',
        customCell_url: '',
        custom_url_name: '',
        custom_url_sub_title: '',
        custom_url: '',
        promotion_url_name: '',
        promotion_url_sub_title: '',
        promotion_url: ''
      },
      //表单1
      imageUrl: '',
      imageUrls: '',
      page: 1,
      total: 0,
      multipleSelection: [],
      submitLoading: false,
      form_01Rules: {
        brand_name: [{
          required: true,
          message: '请输入商户名称',
          trigger: 'blur'
        }, ],
        title: [{
          required: true,
          message: '请输入会员卡标题',
          trigger: 'blur'
        }, ],
        gift: [{
          required: true,
          message: '请输入兑换内容',
          trigger: 'blur'
        }, ],
      },
      form_02Rules: {
        quantity: [{
          required: true,
          message: '请输入会员卡库存',
        },
        {
          type: 'number',
          max: 999999999,
          message: '请设置库存为0-999999999之间的值'
        }],
        get_limit: [{
          required: true,
          message: '请输入领劵限制',
          trigger: 'blur'
        }, ],
        notice: [{
          required: true,
          message: '请输入操作提示',
          trigger: 'blur'
        }, ],
      },
      form_03Rules: {
        prerogative: [{
          required: true,
          message: '请输入特权说明',
          trigger: 'blur'
        }, ],
        description: [{
          required: true,
          message: '请输入使用须知',
          trigger: 'blur'
        }, ],
        service_phone: [{
          required: true,
          validator: validate_service_phone,
          trigger: 'blur'
        },]
      }
    }
  },
  watch: {　
    beginTime(curVal, oldVal) {　　
      this.beginTime = (!this.beginTime || this.beginTime == '') ? '' : util.formatDate.format(new Date(this.beginTime), 'yyyy-MM-dd');　
    },
    endTime(curVal, oldVal) {　
      this.endTime = (!this.endTime || this.endTime == '') ? '' : util.formatDate.format(new Date(this.endTime), 'yyyy-MM-dd');
    },
    date_info() {
      if (this.date_info == 2) {
        this.beginTime = "";
        this.endTime = "";
      } else {
        this.beginTime = new Date();
        this.endTime = new Date();
      }
    }
  },
  methods: {
    Form1: function() {
      this.formDate5 = false;
      this.formDate4 = false;
      this.formDate2 = false;
      this.formDate3 = false;
      this.formDate1 = true;
    },
    Form2: function() {
      this.formDate5 = false;
      this.formDate4 = false;
      this.formDate3 = false;
      this.formDate1 = false;
      this.formDate2 = true;
    },
    Form3: function() {
      this.formDate5 = false;
      this.formDate4 = false;
      this.formDate2 = false;
      this.formDate1 = false;
      this.formDate3 = true;
    },
    Form4: function() {
      this.formDate5 = false;
      this.formDate2 = false;
      this.formDate1 = false;
      this.formDate3 = false;
      this.formDate4 = true;
      let para = {
        pageNum: this.page,
      }
      queryStoreList(para).then((res) => {
        this.total = res.data.map.totalCount;
        this.form_04.tableData = res.data.map.storeList;
      })
    },
    Form5: function() {
      this.formDate2 = false;
      this.formDate1 = false;
      this.formDate3 = false;
      this.formDate4 = false;
      this.formDate5 = true;
    },
    //上传logo
    handleAvatarSuccess(res, file) {
      let {
        status,
        message
      } = res;
      if (status == 200) {
        this.imageUrl = res.data.locationUrl;
        this.imageUrls = res.data.url;
      } else {
        this.$notify.error({
          title: '错误',
          message: message
        });
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.Form4();
    },
    submitForm: function() {
      this.$refs.form_01.validate((valid) => {
        this.$refs.form_02.validate((valid) => {
          this.$refs.form_03.validate((valid) => {
            if (valid && this.imageUrl != '') {
              let para = {
                card_type: sessionStorage.getItem('card_type'),
                //表单01
                loc_logo_Url: this.imageUrl,
                logo_url: this.imageUrls, //logo
                brand_name: this.form_01.brand_name, //商户名称
                color: this.form_01.color, //卡卷颜色
                title: this.form_01.title, //会员卡标题
                fixed_term: this.form_01.fixed_term,
                fixed_begin_term: this.form_01.fixed_begin_term,

                deal_detail: this.form_01.gift,
                reduce_cost: this.form_01.gift,
                discount: this.form_01.gift,
                gift: this.form_01.gift,
                default_detail: this.form_01.gift,

                least_cost: this.form_01.least_cost,

                date_info: this.date_info, //有效期
                beginTime: this.beginTime, //会员卡有效期开始时间
                endTime: this.endTime, //会员卡有效期结束时间
                //表单02
                quantity: String(this.form_02.quantity), //库存
                get_limit: this.form_02.get_limit, //用户领卷上限
                can_share: this.form_02.can_share, //卡券领取页面是否可分享
                can_give_friend: this.form_02.can_give_friend, //用户领券后可转赠其他好友
                notice: this.form_02.notice, //建议引导用户到店出示卡券
                //表单03
                prerogative: this.form_03.prerogative, //特权说明
                description: this.form_03.description, //使用须知
                service_phone: this.form_03.service_phone, //客服电话
                //表单04
                location_id_list: this.multipleSelection,
                //表单05
                customCell_name: this.form_05.customCell_name, //入口名称
                customCell_tips: this.form_05.customCell_tips, //引导语
                customCell_url: this.form_05.customCell_url, //链接
                custom_url_name: this.form_05.custom_url_name, //入口名称
                custom_url_sub_title: this.form_05.custom_url_sub_title, //引导语
                custom_url: this.form_05.custom_url, //链接
              }
              para.card_type = para.card_type == '1' ? 'GROUPON' : para.card_type == '2' ? 'CASH' : para.card_type == '3' ? 'DISCOUNT' : para.card_type == '4' ? 'GIFT' : para.card_type == '5' ? 'GENERAL_COUPON' : 'weizhi';
              para.can_share = para.can_share === true ? "1" : "0"; //卡券领取页面是否可分享转换
              para.can_give_friend = para.can_give_friend === true ? "1" : "0"; //用户领券后可转赠其他好友转换
              this.submitLoading = true;
              // delete para['gift'];
              let card_type = sessionStorage.getItem('card_type');
              switch (card_type) {
                case '1':
                  delete para['reduce_cost'];
                  delete para['discount'];
                  delete para['gift'];
                  delete para['default_detail'];
                  delete para['least_cost'];
                  break;
                case '2':
                  delete para['deal_detail'];
                  delete para['discount'];
                  delete para['gift'];
                  delete para['default_detail'];
                  break;
                case '3':
                  delete para['deal_detail'];
                  delete para['reduce_cost'];
                  delete para['gift'];
                  delete para['default_detail'];
                  delete para['least_cost'];
                  break;
                case '4':
                  delete para['deal_detail'];
                  delete para['reduce_cost'];
                  delete para['discount'];
                  delete para['default_detail'];
                  delete para['least_cost'];
                  break;
                case '5':
                  delete para['deal_detail'];
                  delete para['reduce_cost'];
                  delete para['discount'];
                  delete para['gift'];
                  delete para['least_cost'];
                  break;
                default:
                  console.log('未知');
              }
              insertMenCard(para).then((res) => {
                var _this = this;
                let {
                  status,
                  message
                } = res;
                if (status == 200) {
                  this.$notify({
                    title: '成功',
                    message: message,
                    type: 'success'
                  });
                  _this.$router.push({
                    path: '/index3/tab7'
                  })
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: message
                  });
                }
                this.submitLoading = false;
              })
            } else {
              this.$message({
                message: '信息填写不完整，请检查！！！',
                type: 'warning'
              });
            }
          });
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  mounted() {
    this.uploaddata.mid = sessionStorage.getItem('mid')
    let card_type = sessionStorage.getItem('card_type');
    switch (card_type) {
      case '1':
        this.card_type_placeholder = '团购券专用，团购详情';
        this.card_type_label = '兑换内容';
        break;
      case '2':
        this.card_type_placeholder = '代金券专用，表示减免金额';
        this.card_type_label = '减免金额';
        this.least_cost_show = true;
        break;
      case '3':
        this.card_type_placeholder = '折扣券专用，表示打折额度';
        this.card_type_label = '兑换内容';
        break;
      case '4':
        this.card_type_placeholder = '兑换券专用，填写兑换内容的名称';
        this.card_type_label = '兑换内容';
        break;
      case '5':
        this.card_type_placeholder = '优惠券专用，填写优惠详情';
        this.card_type_label = '兑换内容';
        break;
      default:
        console.log('未知');
    }
  }
}
</script>
<style scoped lang="scss">
.fa-question-circle{
  font-size: 18px;
  color: #324057;
}
.Color010 {
    width: 20px;
    height: 20px;
    background-color: #63b359;
    display: block;
}
.Color020 {
    width: 20px;
    height: 20px;
    background-color: #2c9f67;
    display: block;
}
.Color030 {
    width: 20px;
    height: 20px;
    background-color: #509fc9;
    display: block;
}
.Color040 {
    width: 20px;
    height: 20px;
    background-color: #5885cf;
    display: block;
}
.Color050 {
    width: 20px;
    height: 20px;
    background-color: #9062c0;
    display: block;
}
.Color060 {
    width: 20px;
    height: 20px;
    background-color: #d09a45;
    display: block;
}
.Color070 {
    width: 20px;
    height: 20px;
    background-color: #e4b138;
    display: block;
}
.Color080 {
    width: 20px;
    height: 20px;
    background-color: #ee903c;
    display: block;
}
.Color081 {
    width: 20px;
    height: 20px;
    background-color: #f08500;
    display: block;
}
.Color082 {
    width: 20px;
    height: 20px;
    background-color: #a9d92d;
    display: block;
}
.Color090 {
    width: 20px;
    height: 20px;
    background-color: #dd6549;
    display: block;
}
.Color100 {
    width: 20px;
    height: 20px;
    background-color: #cc463d;
    display: block;
}
.Color101 {
    width: 20px;
    height: 20px;
    background-color: #cf3e36;
    display: block;
}
.Color102 {
    width: 20px;
    height: 20px;
    background-color: #5E6671;
    display: block;
}
.xuzon {
    width: 20px;
    height: 20px;
    display: block;
    border: 1px solid #999;
    position: absolute;
    top: 7px;
    left: 5px;
}
.title_inpu {
    width: 150px;
    height: 30px;
    border: 1px solid #bfcbd9;
    text-align: center;
    float: left;
    // border-top-right-radius: 4px;
    // border-bottom-right-radius: 4px;
}
.title_xiaofei {
    width: 60px;
    height: 34px;
    display: block;
    float: left;
    text-align: center;
    background-color: #666;
    color: #fff;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}
//表单1
.wei-form-02 .mask {
    width: 319px;
    height: 160px;
    position: absolute;
    overflow: hidden;
    top: 63px;
    left: 0;
}
.wei-form-02 a.info {
    background: url("../../assets/images/link.png") center no-repeat;
    display: inline-block;
    text-decoration: none;
    padding: 0;
    text-indent: -9999px;
    width: 40px;
    height: 40px;
}
.wei-form-02:hover .mask {
    opacity: 1;
    background-color: rgba(210,210,210,0.9);
}
.wei-form-02 a.info {
    opacity: 0;
    position: relative;
    top: 40%;
    left: 43%;
}
.wei-form-02:hover a.info {
    opacity: 1;
}
//表单2
.shop_details .mask {
    width: 319px;
    height: 55px;
    position: absolute;
    overflow: hidden;
    top: 223px;
    left: 0;
}
.shop_details a.info {
    background: url("../../assets/images/link.png") center no-repeat;
    display: inline-block;
    text-decoration: none;
    padding: 0;
    text-indent: -9999px;
    width: 40px;
    height: 40px;
}
.shop_details:hover .mask {
    opacity: 1;
    background-color: rgba(210,210,210,0.9);
}
.shop_details a.info {
    opacity: 0;
    position: relative;
    top: 12%;
    left: 43%;

}
.shop_details:hover a.info {
    opacity: 1;
}
//表单3
.shop_detail_01 .mask {
    width: 319px;
    height: 45px;
    position: absolute;
    overflow: hidden;
    top: 305px;
    left: 0;
}
.shop_detail_01 a.info {
    background: url("../../assets/images/link.png") center no-repeat;
    display: inline-block;
    text-decoration: none;
    padding: 0;
    text-indent: -9999px;
    width: 40px;
    height: 40px;
}
.shop_detail_01:hover .mask {
    opacity: 1;
    background-color: rgba(210,210,210,0.9);
}
.shop_detail_01 a.info {
    opacity: 0;
    position: relative;
    top: 10%;
    left: 43%;

}
.shop_detail_01:hover a.info {
    opacity: 1;
}
//表单4
.shop_detail_02 .mask {
    width: 319px;
    height: 45px;
    position: absolute;
    overflow: hidden;
    top: 351px;
    left: 0;
}
.shop_detail_02 a.info {
    background: url("../../assets/images/link.png") center no-repeat;
    display: inline-block;
    text-decoration: none;
    padding: 0;
    text-indent: -9999px;
    width: 40px;
    height: 40px;
}
.shop_detail_02:hover .mask {
    opacity: 1;
    background-color: rgba(210,210,210,0.9);
}
.shop_detail_02 a.info {
    opacity: 0;
    position: relative;
    top: 10%;
    left: 43%;

}
.shop_detail_02:hover a.info {
    opacity: 1;
}
//表单5
.shop_detail_03 .mask {
    width: 319px;
    height: 45px;
    position: absolute;
    overflow: hidden;
    top: 423px;
    left: 0;
}
.shop_detail_03 a.info {
    background: url("../../assets/images/link.png") center no-repeat;
    display: inline-block;
    text-decoration: none;
    padding: 0;
    text-indent: -9999px;
    width: 40px;
    height: 40px;
}
.shop_detail_03:hover .mask {
    opacity: 1;
    background-color: rgba(210,210,210,0.9);
}
.shop_detail_03 a.info {
    opacity: 0;
    position: relative;
    top: 10%;
    left: 43%;

}
.shop_detail_03:hover a.info {
    opacity: 1;
}
//表单6
.shop_detail_04 .mask {
    width: 319px;
    height: 45px;
    position: absolute;
    overflow: hidden;
    top: 466px;
    left: 0;
}
.shop_detail_04 a.info {
    background: url("../../assets/images/link.png") center no-repeat;
    display: inline-block;
    text-decoration: none;
    padding: 0;
    text-indent: -9999px;
    width: 40px;
    height: 40px;
}
.shop_detail_04:hover .mask {
    opacity: 1;
    background-color: rgba(210,210,210,0.9);
}
.shop_detail_04 a.info {
    opacity: 0;
    position: relative;
    top: 10%;
    left: 43%;

}
.shop_detail_04:hover a.info {
    opacity: 1;
}
//表单7
.shop_detail_05 .mask {
    width: 319px;
    height: 45px;
    position: absolute;
    overflow: hidden;
    top: 513px;
    left: 0;
}
.shop_detail_05 a.info {
    background: url("../../assets/images/link.png") center no-repeat;
    display: inline-block;
    text-decoration: none;
    padding: 0;
    text-indent: -9999px;
    width: 40px;
    height: 40px;
}
.shop_detail_05:hover .mask {
    opacity: 1;
    background-color: rgba(210,210,210,0.9);
}
.shop_detail_05 a.info {
    opacity: 0;
    position: relative;
    top: 10%;
    left: 43%;

}
.shop_detail_05:hover a.info {
    opacity: 1;
}

.wei-form {
    border: 1px solid #e7e7eb;
    width: 318px;
    height: 680px;
    background-color: #F9FAFC;
    .wei-form-01 {
        height: 62px;
    }
    .wei-form-02:hover {
        cursor: pointer;
    }
    .shop_detail:hover {
        cursor: pointer;
    }
    .wei-form-02 {
        width: 318px;
        height: 160px;
        .wei-logo {
            padding: 12px;
            span {
                display: block;
                width: 42px;
                height: 42px;
                float: left;
                margin-right: 10px;
            }
            p {
                display: inherit;
                line-height: 22px;
                color: #fff;
                height: 22px;
            }
        }
        .wei-tick {
            text-align: center;
            margin-top: -25px;
            color: #fff;
            h2 {
                height: 27px;
            }
            p {
                margin-top: -10px;
                color: rgba(255,255,255,0.6);
                height: 19px;
            }
        }
        .deco {
            width: 100%;
            height: 5px;
            background: url("../../assets/images/img_card_control.png") repeat-x;
        }
    }
    .list {
        border-bottom: 1px solid #e7e7eb;
        border-top: 1px solid #e7e7eb;
        list-style-type: none;
        margin-left: 0;
        padding-left: 0;
        margin-top: 25px;
        li {
            color: #666;
            border-top: 1px solid #e7e7eb;
            height: 45px;
            line-height: 45px;
            background-color: #fff;
            i {
                float: right;
                line-height: 45px;
            }
            span {
                padding-left: 10px;
            }
        }
    }
}
</style>
