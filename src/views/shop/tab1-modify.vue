<template>
<el-row>
  <el-col :span="8">
    <el-form class="wei-form">
      <div class="wei-form-01">
        <img src="../../assets/images/img_card_control.png" alt="">
      </div>
      <div class="wei-form-02" @click="Form1" v-bind:class="form_01.color" v-bind:style="{'background-image':'url('+bgimageUrl+')','background-size':'318px 160px'}">
        <div class="wei-logo">
          <img :src="imageUrl" style="width:40px;height:40px;display:block;float:left;margin-right:10px;border-radius:100%">
          <p>{{form_01.brand_name}}</p>
        </div>
        <div class="wei-tick">
          <h2>{{form_01.title}}</h2>
          <p>{{form_01.subtitle}}</p>
          <p></p>
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
          <li class="shop_detail_05" style="border: none" @click="Form5">
            <span v-if="this.form_05.promotion_url_name==''">自定义入口三（选填）</span>
            <span>{{form_05.promotion_url_name}}</span>
            <i class="el-icon-arrow-right"></i>
            <span style="float:right">{{form_05.promotion_url_sub_title}}</span>
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
    <el-form :model="form_01" :rules="form_01Rules" ref="form_01" label-width="100px" @submit.prevent="onSubmit" label-position="left" style="padding:0 0 0 55px;width:700px;background-color:#F9FAFC;border: 1px solid #e7e7eb" v-show="formDate1">
      <h3>修改券面信息</h3>
      <p style="color:#999;text-align:right;padding-right:15px;">注：带*号为必填项</p>
      <el-form-item label="商户logo" prop="logo">
        <el-upload class="avatar-uploader" :action="uploadimg" :data="uploaddata" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" style="width:50px;height:50px;float:left">
          <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 50px;height: 50px;border: 1px dashed #d9d9d9;line-height: 50px;"></i>
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
      <el-form-item label="会员卡背景图">
        <el-upload class="avatar-uploader" :action="uploadimg" :data="uploaddata" :show-file-list="false" :on-success="handleAvatarBackgr" :before-upload="beforeAvatarUpload">
          <img v-if="bgimageUrl" :src="bgimageUrl" style="width:50px;height:50px;float:left">
          <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 50px;height: 50px;border: 1px dashed #d9d9d9;line-height: 50px;"></i>
          <el-button size="small" type="primary" style="float:right;margin-left:15px;">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="会员卡标题" prop="title" style="width:300px;">
          <el-input v-model="form_01.title" placeholder="请输入会员卡标题" :maxlength="9"></el-input>
      </el-form-item>
      <el-form-item label="折扣率" prop="discount" style="width:300px;">
        <el-input v-model="form_01.discount" placeholder="0~100之间的整数" :maxlength="3"></el-input>
      </el-form-item>
      <!-- <el-form-item label="是否开通老会员绑定" label-width="150px">
        <template>
          <el-checkbox v-model="form_01.supply_old_bind"></el-checkbox>
        </template>
      </el-form-item> -->
      <el-form-item label="是否支持支付即会员" label-width="150px">
        <template>
          <el-checkbox v-model="form_01.payment_is_mem"></el-checkbox>
        </template>
      </el-form-item>
      <el-form-item label="支付即会员生效时间" style="width:600px;" v-if="this.form_01.payment_is_mem">
        <el-date-picker v-model="begin_time" type="date" :editable="false" placeholder="开始时间">
        </el-date-picker> -
        <el-date-picker v-model="end_time" type="date" :editable="false" placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="单次消费送会员卡的消费下限" label-width="200px" style="width:400px;" v-if="this.form_01.payment_is_mem">
        <el-input v-model="form_01.least_cost" placeholder="以分为单位"></el-input>
      </el-form-item>
      <el-form-item label="单次消费送会员卡的消费上限" label-width="200px" style="width:400px;" v-if="this.form_01.payment_is_mem">
        <el-input v-model="form_01.max_cost" placeholder="以分为单位"></el-input>
      </el-form-item>
      <el-form-item label="是否支持储值">
        <template>
				  <el-checkbox v-model="form_01.supply_balance"></el-checkbox>
				</template>
      </el-form-item>
      <el-form-item label="储值牌照" v-if="this.form_01.supply_balance">
        <template>
          <el-radio class="radio" v-model="license" label="Y">有牌照</el-radio>
          <el-radio class="radio" v-model="license" label="N">无牌照</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="余额类目" v-if="this.license=='N'">
        <template>
          <el-select v-model="form_01.name_type" placeholder="请选择">
            <el-option
              v-for="item in name_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="余额类目URL" style="width:500px;"  v-if="this.license=='N'">
        <template>
          <el-input placeholder="请输入内容" v-model="form_01.name_url">
            <template slot="prepend">Http://</template>
          </el-input>
        </template>
      </el-form-item>
      <el-form-item label="其它类目"  v-if="this.license=='N'">
        <template>
          <el-select v-model="form_01.name_type2" placeholder="请选择">
            <el-option
              v-for="item in name_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="其它类目URL" style="width:500px;"  v-if="this.license=='N'">
        <template>
          <el-input placeholder="请输入内容" v-model="form_01.name_url2">
            <template slot="prepend">Http://</template>
          </el-input>
        </template>
      </el-form-item>
      <el-form-item label="是否显示积分">
        <template>
					<el-checkbox v-model="form_01.supply_bonus"></el-checkbox>
				</template>
      </el-form-item>
      <el-form-item label="积分规则" v-if="this.form_01.supply_bonus">
        <div class="">
          <span class="title_xiaofei">每消费</span>
          <el-input class="title_inpu" v-model="form_01.cost_money_unit" placeholder="如：100" style=""></el-input>
          <span class="title_xiaofei" style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;width:105px;">(单位：分),增加</span>
          <input class="title_inpu" v-model="form_01.increase_bonus" placeholder="如：10" style="">
          <span class="title_xiaofei" style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;border-top-right-radius: 4px;border-bottom-right-radius: 4px;">积分</span>
        </div>
      </el-form-item>
      <el-form-item label="激活送积分" v-if="this.form_01.supply_bonus" style="width:300px;">
        <el-input v-model="form_01.init_increase_bonus" placeholder="如：10"></el-input>
      </el-form-item>
      <el-form-item label="单次赠送上限" v-if="this.form_01.supply_bonus" style="width:300px;">
        <el-input v-model="form_01.max_increase_bonus" placeholder="如：10000"></el-input>
      </el-form-item>
      <el-form-item label="积分抵扣" v-if="this.form_01.supply_bonus">
        <div class="">
          <span class="title_xiaofei">每使用</span>
          <input class="title_inpu" v-model="form_01.cost_bonus_unit" placeholder="如：100" style="">
          <span class="title_xiaofei" style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;width:105px;">积分，抵扣</span>
          <input class="title_inpu" v-model="form_01.reduce_money" placeholder="如：1" style="">
          <span class="title_xiaofei" style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;border-top-right-radius: 4px;border-bottom-right-radius: 4px;">元</span>
        </div>
      </el-form-item>
      <el-form-item label="抵扣条件" v-if="this.form_01.supply_bonus">
        <div class="">
          <span class="title_xiaofei">订单满</span>
          <input class="title_inpu" v-model="form_01.least_money_to_use_bonus" placeholder="如：100" style="">
          <span class="title_xiaofei" style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;width:105px;">元可用，单笔上限</span>
          <input class="title_inpu" v-model="form_01.max_reduce_bonus" placeholder="如：10" style="">
          <span class="title_xiaofei" style="border-top-left-radius: 0px;border-bottom-left-radius: 0px;border-top-right-radius: 4px;border-bottom-right-radius: 4px;">积分</span>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Form2">下一步</el-button>
      </el-form-item>
    </el-form>
    <!-- 表单02 -->
    <el-form ref="form_02" :model="form_02" :rules="form_02Rules" label-width="100px" @submit.prevent="onSubmit" label-position="left" style="padding:0 0 0 55px;width:700px;float:left;background-color:#F9FAFC;border: 1px solid #e7e7eb" v-show="formDate2">
      <h3>销劵设置</h3>
      <h4>二维码 ： 包含卡券信息的二维码，扫描后可进行销券</h4>
      <el-form-item label="操作提示" prop="notice" style="width:300px;">
        <el-input v-model="form_02.notice" placeholder="建议引导用户到店出示卡券" :maxlength="16"></el-input>
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
        <el-button type="primary" @click="Form5">下一步</el-button>
      </el-form-item>
    </el-form>
    <!-- 表单05 -->
    <el-form ref="form_05" :model="form_05" label-width="100px" @submit.prevent="onSubmit" label-position="left" style="padding:0 0 0 55px;width:700px;float:left;background-color:#F9FAFC;border: 1px solid #e7e7eb" v-show="formDate5">
      <h3>快速买单入口</h3>
      <el-form-item label="入口名称" style="width:300px;">
        <el-input v-model="form_05.center_title" placeholder="请输入" :maxlength="6">
        </el-input>
      </el-form-item>
      <el-form-item label="引导语" style="width:300px;">
        <el-input v-model="form_05.center_sub_title" placeholder="请输入" :maxlength="6">
        </el-input>
      </el-form-item>
      <el-form-item label="网页链接" style="width:400px">
        <el-input v-model="form_05.center_url" placeholder="">
          <template slot="prepend">Http://</template>
        </el-input>
      </el-form-item>
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
      <h3>入口三</h3>
      <el-form-item label="入口名称" style="width:300px;">
        <el-input v-model="form_05.promotion_url_name" placeholder="请输入" :maxlength="6">
        </el-input>
      </el-form-item>
      <el-form-item label="引导语" style="width:300px;">
        <el-input v-model="form_05.promotion_url_sub_title" placeholder="请输入" :maxlength="6">
        </el-input>
      </el-form-item>
      <el-form-item label="网页链接" style="width:400px">
        <el-input v-model="form_05.promotion_url" placeholder="">
          <template slot="prepend">Http://</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()" :loading="submitLoading">确认修改</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</el-row>
</template>
<script>
import * as util from '../../util/util.js'
import {
  updateMenCard,
  queryCardByKey,
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
    var validate_service_discount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入折扣率'));
      }else if (!(/^([1]?\d{1,2})$/.test(value))) {
        return callback(new Error('请输入正确的折扣率'));
      }else {
        callback();
      }
    };
    return {
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
      week_memberdayOptions: [{
        value: '1',
        label: '周一'
      }, {
        value: '2',
        label: '周二'
      }, {
        value: '3',
        label: '周三'
      }, {
        value: '4',
        label: '周四'
      }, {
        value: '5',
        label: '周五'
      }, {
        value: '6',
        label: '周六'
      }, {
        value: '7',
        label: '周日'
      }],
      month_memberdayOptions: [{
        value: '1',
        label: '二号'
      }, {
        value: '2',
        label: '三号'
      }, {
        value: '3',
        label: '四号'
      }, {
        value: '4',
        label: '五号'
      }, {
        value: '5',
        label: '六号'
      }, {
        value: '6',
        label: '七号'
      }, {
        value: '7',
        label: '八号'
      }, {
        value: '8',
        label: '九号'
      }, {
        value: '9',
        label: '十号'
      }, {
        value: '10',
        label: '十号'
      }, {
        value: '11',
        label: '十一号'
      }, {
        value: '12',
        label: '十二号'
      }, {
        value: '13',
        label: '十三号'
      }, {
        value: '14',
        label: '十四号'
      }, {
        value: '15',
        label: '十五号'
      }, {
        value: '16',
        label: '十六号'
      }, {
        value: '17',
        label: '十七号'
      }, {
        value: '18',
        label: '十八号'
      }, {
        value: '19',
        label: '十九号'
      }, {
        value: '20',
        label: '二十号'
      }, {
        value: '21',
        label: '二十一号'
      }, {
        value: '22',
        label: '二十二号'
      }, {
        value: '23',
        label: '二十三号'
      }, {
        value: '24',
        label: '二十四号'
      }, {
        value: '25',
        label: '二十五号'
      }, {
        value: '26',
        label: '二十六号'
      }, {
        value: '27',
        label: '二十七号'
      }, {
        value: '28',
        label: '二十八号'
      }, {
        value: '29',
        label: '二十九号'
      }, {
        value: '30',
        label: '三十号'
      }],
      form_01: {
        color: 'Color010',
        title: '',
        discount: '',
        // supply_old_bind: false,
        payment_is_mem: false,
        least_cost: '',
        max_cost: '',
        supply_balance: false,
        name_type:'',
        name_url:'',
        name_type2:'',
        name_url2:'',
        unit_memberday:'',
        week_memberday:'',
        month_memberday:'',
        supply_bonus: true,
        cost_money_unit: '',
        increase_bonus: '',
        init_increase_bonus: '',
        max_increase_bonus: '',
        cost_bonus_unit: '',
        reduce_money: '',
        least_money_to_use_bonus: '',
        max_reduce_bonus: '',
      },
      name_type_options:[{
        label: "等级",
        value: "FIELD_NAME_TYPE_LEVEL",
        key: 'FIELD_NAME_TYPE_LEVEL',
      }, {
        label: "优惠券",
        value: 'FIELD_NAME_TYPE_COUPON',
        key: 'FIELD_NAME_TYPE_COUPON',
      }, {
        label: "印花",
        value: 'FIELD_NAME_TYPE_STAMP',
        key: 'FIELD_NAME_TYPE_STAMP',
      }, {
        label: "折扣",
        value: 'FIELD_NAME_TYPE_DISCOUNT',
        key: 'FIELD_NAME_TYPE_DISCOUNT',
      }, {
        label: "成就",
        value: 'FIELD_NAME_TYPE_ACHIEVEMENT',
        key: 'FIELD_NAME_TYPE_ACHIEVEMENT',
      }, {
        label: "里程",
        value: 'FIELD_NAME_TYPE_MILEAGE',
        key: 'FIELD_NAME_TYPE_MILEAGE',
      }, {
        label: "集点",
        value: 'FIELD_NAME_TYPE_SET_POINTS',
        key: 'FIELD_NAME_TYPE_SET_POINTS',
      }, {
        label: "次数",
        value: 'FIELD_NAME_TYPE_TIMS',
        key: 'FIELD_NAME_TYPE_TIMS',
      }],
      license:'Y',//储值牌照
      begin_time: '2017-02-03',
      end_time: '',
      form_02: {
        notice: ''
      },
      form_03: {
        prerogative: '',
        description: '',
        service_phone: ''
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
        promotion_url: '',
        center_title: '',
        center_sub_title: '',
        center_url: ''
      },
      //表单1
      imageUrl: '',
      imageUrls: '',
      bgimageUrl: '',
      bgimageUrls: '',
      page: 1,
      total: 0,
      multipleSelection: [],
      submitLoading: false,
      form_01Rules: {
        title: [{
          required: true,
          message: '请输入会员卡标题',
          trigger: 'blur'
        }, ],
        discount: [{
          required: true,
          validator: validate_service_discount,
          trigger: 'blur'
        },
        ]
      },
      form_02Rules: {
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
    begin_time(curVal, oldVal) {　
      this.begin_time = (!this.begin_time || this.begin_time == '') ? '' : util.formatDate.format(new Date(this.begin_time), 'yyyy-MM-dd');
    },
    end_time(curVal, oldVal) {　
      this.end_time = (!this.end_time || this.end_time == '') ? '' : util.formatDate.format(new Date(this.end_time), 'yyyy-MM-dd');
    },
    date_info() {
      if (this.date_info == 0) {
        this.beginTime = "";
        this.endTime = "";
      } else {
        this.beginTime = new Date();
        this.endTime = new Date();
      }
    }
  },
  methods: {
    returnDisplay(){
      let para={
        id:String(JSON.parse(sessionStorage.getItem('id')))
      }
      queryCardByKey(para).then((res)=>{
        let {status,message,data}=res;
        if (status==200) {
          this.imageUrl=data.memCard.loc_logo_url;
          this.imageUrls=data.memCard.logo_url;
          this.form_01.color=data.memCard.color;
          this.bgimageUrl=data.memCard.loc_bac_url;
          this.bgimageUrls=data.memCard.background_pic_url;
          this.form_01.title=data.memCard.title;
          this.form_01.discount=data.memCard.discount;
          // this.form_01.supply_old_bind=data.memCard.supply_old_bind == "0" ? false : data.memCard.supply_old_bind == "1" ? true : false;
          this.form_01.payment_is_mem=data.memCard.payment_is_mem == 1 ? true : false;
          if (this.form_01.payment_is_mem) {
            this.begin_time=util.formatDate.format(new Date(parseInt(data.memCard.base_info.begin_time)*1000), 'yyyy-MM-dd');
            this.end_time=util.formatDate.format(new Date(parseInt(data.memCard.base_info.end_time)*1000), 'yyyy-MM-dd');

            this.form_01.least_cost=data.memCard.member_rule.least_cost;
            this.form_01.max_cost=data.memCard.member_rule.max_cost;
          }

          this.form_01.supply_balance=data.memCard.supply_balance == 2 ? true : data.memCard.supply_balance == 1 ? true : false;
          this.license=data.memCard.supply_balance == 2 ? 'N' : data.memCard.supply_balance == 1 ? 'Y' : 'N';
          this.form_01.name_type=data.memCard.name_type1;
          this.form_01.name_url=data.memCard.url1;
          this.form_01.name_type2=data.memCard.name_type2;
          this.form_01.name_url2=data.memCard.url2;
          this.form_01.supply_bonus=data.memCard.supply_bonus == 0 ? false : data.memCard.supply_bonus == 1 ? true : false;
          this.form_01.cost_money_unit=data.memCard.cost_money_unit;
          this.form_01.increase_bonus=data.memCard.increase_bonus;
          this.form_01.init_increase_bonus=data.memCard.init_increase_bonus;
          this.form_01.max_increase_bonus=data.memCard.max_increase_bonus;
          this.form_01.cost_bonus_unit=data.memCard.cost_bonus_unit;
          this.form_01.reduce_money=data.memCard.reduce_money;
          this.form_01.least_money_to_use_bonus=data.memCard.least_money_to_use_bonus;
          this.form_01.max_reduce_bonus=data.memCard.max_reduce_bonus;
          this.form_02.notice=data.memCard.notice;
          this.form_03.prerogative=data.memCard.prerogative;
          this.form_03.description=data.memCard.description;
          this.form_03.service_phone=data.memCard.service_phone;

          this.form_05.center_title=data.memCard.center_title;
          this.form_05.center_sub_title=data.memCard.center_sub_title;
          this.form_05.center_url=data.memCard.center_url;

          this.form_05.customCell_name=data.memCard.name;
          this.form_05.customCell_tips=data.memCard.tips;
          this.form_05.customCell_url=data.memCard.url;

          this.form_05.custom_url_name=data.memCard.custom_url_name;
          this.form_05.custom_url_sub_title=data.memCard.custom_url_sub_title;
          this.form_05.custom_url=data.memCard.custom_url;

          this.form_05.promotion_url_name=data.memCard.promotion_url_name;
          this.form_05.promotion_url_sub_title=data.memCard.promotion_url_sub_title;
          this.form_05.promotion_url=data.memCard.promotion_url;
        }

      })
    },
    //动态显示
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
    //上传背景图
    handleAvatarBackgr(res, file) {
      let {
        status,
        message
      } = res;
      if (status == 200) {
        this.bgimageUrl = res.data.locationUrl;
        this.bgimageUrls = res.data.url;
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
    submitForm: function() {
      this.$refs.form_01.validate((valid) => {
        this.$refs.form_02.validate((valid) => {
          this.$refs.form_03.validate((valid) => {
            if (valid && this.imageUrl!='') {
              let para = {
                id:String(JSON.parse(sessionStorage.getItem('id'))),
                card_type: "MEMBER_CARD",
                //表单01
                loc_logo_Url: this.imageUrl,
                logo_url: this.imageUrls, //logo
                loc_bac_url: this.bgimageUrl,
                background_pic_url: this.bgimageUrls, //背景图
                color: this.form_01.color, //卡卷颜色
                title: this.form_01.title, //会员卡标题
                discount: String(this.form_01.discount), //折扣率
                // supply_old_bind: this.form_01.supply_old_bind, //是否开通老会员绑定
                payment_is_mem: this.form_01.payment_is_mem, //是否支持支付及会员
                begin_time: this.begin_time, //规则开始时间
                end_time: this.end_time, //规则结束时间
                least_cost: this.form_01.least_cost, //单次消费送会员卡的金额下限
                max_cost: this.form_01.max_cost, //单次消费送会员卡的金额上限
                supply_balance: this.form_01.supply_balance, //是否支持储存

                get_limit:'',
                date_info:'',
                beginTime:'',
                endTime:'',
                license: this.license,//有无储值牌照
                name_type: this.form_01.name_type, //余额类目
                name_url: this.form_01.name_url, //余额类目URL
                name_type2: this.form_01.name_type2, //余额类目
                name_url2: this.form_01.name_url2, //余额类目URL

                week_memberday: this.form_01.week_memberday,//周会员日
                month_memberday: this.form_01.month_memberday,//月会员日

                supply_bonus: this.form_01.supply_bonus, //是否显示积分
                cost_money_unit: String(this.form_01.cost_money_unit), //每消费
                increase_bonus: String(this.form_01.increase_bonus), //增加
                init_increase_bonus: String(this.form_01.init_increase_bonus), //激活送积分
                max_increase_bonus: String(this.form_01.max_increase_bonus), //单次上限
                cost_bonus_unit: String(this.form_01.cost_bonus_unit), //每使用
                reduce_money: String(this.form_01.reduce_money), //抵扣
                least_money_to_use_bonus: String(this.form_01.least_money_to_use_bonus), //订单满
                max_reduce_bonus: String(this.form_01.max_reduce_bonus), //单笔上限
                //表单02
                notice: this.form_02.notice, //建议引导用户到店出示卡券
                //表单03
                prerogative: this.form_03.prerogative, //特权说明
                description: this.form_03.description, //使用须知
                service_phone: this.form_03.service_phone, //客服电话
                //表单05
                center_title: this.form_05.center_title, //入口名称
                center_sub_title: this.form_05.center_sub_title, //引导语
                center_url: this.form_05.center_url, //链接
                customCell_name: this.form_05.customCell_name, //入口名称
                customCell_tips: this.form_05.customCell_tips, //引导语
                customCell_url: this.form_05.customCell_url, //链接
                custom_url_name: this.form_05.custom_url_name, //入口名称
                custom_url_sub_title: this.form_05.custom_url_sub_title, //引导语
                custom_url: this.form_05.custom_url, //链接
                promotion_url_name: this.form_05.promotion_url_name, //入口名称
                promotion_url_sub_title: this.form_05.promotion_url_sub_title, //引导语
                promotion_url: this.form_05.promotion_url //链接
              }
              var begin_time = (!this.begin_time || this.begin_time == '') ? '' : Date.parse(para.begin_time); //规则开始时间
              para.begin_time = String(begin_time / 1000);
              var end_time = (!this.end_time || this.end_time == '') ? '' : Date.parse(para.end_time); //规则开始时间
              para.end_time = String(end_time / 1000);
              // para.supply_old_bind = para.supply_old_bind === true ? "1" : "0"; //是否支持储存转换
              para.payment_is_mem = para.payment_is_mem === true ? "1" : "2"; //是否支持储存转换
              para.supply_balance = para.supply_balance === true ? "1" : "0"; //是否支持储存转换
              para.supply_bonus = para.supply_bonus === true ? "1" : "0"; //是否支持积分转换
              this.submitLoading = true;
              updateMenCard(para).then((res) => {
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
                    path: '/index3/tab1'
                  })
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: message
                  });
                }
                this.submitLoading = false;
              })
            }else {
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
    }

  },
  mounted() {
    this.returnDisplay();
    this.uploaddata.mid = sessionStorage.getItem('mid')
  }
}
</script>
<style scoped lang="scss">
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
    // border: 1px solid #bfcbd9;
    text-align: center;
    float: left;
    // border-top-right-radius: 4px;
    // border-bottom-right-radius: 4px;
}
.title_inpu .el-input__inner{
  border-radius: 0px;
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
//表单5
.shop_detail_03 .mask {
    width: 319px;
    height: 45px;
    position: absolute;
    overflow: hidden;
    top: 377px;
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
    top: 421px;
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
    top: 468px;
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
