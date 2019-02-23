<style scoped>
.box-card {
  margin-top: 20px;
}
.box-card-text span {
  color: #909399;
  line-height: 2;
}
.box-card-pay span {
  line-height: 2;
  width: 150px;
  display: inline-block;
}
.box-card-switch {
  border-top: 1px #ebeef5 solid;
}
.icon {
  margin: 0 5px;
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.3em;
  fill: currentColor;
  overflow: hidden;
}
.box-card-pay-icon {
  margin: 0 5px;
  width: 3.5em;
  height: 3.5em;
  vertical-align: -1.4em;
  fill: currentColor;
  overflow: hidden;
}
.box_card_img {
  width: 100px;
  height: 120px;
  border: 1px solid #999;
  padding: 4px;
  border-radius: 4px;
}
.element_icon{
  font-size: 20px;
  padding: 10px;
}
</style>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xinxi"></use>
        </svg>
        <span>商户信息</span>
      </div>
      <div class="box-card-text">
        <el-row>
          <el-col :span="8" style="font-size:20px;color:#F56C6C">
            <span>商户号：</span>
            {{ boxCardText.merchant_no }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>商户名称：</span>
            {{ boxCardText.merchant_name }}
          </el-col>
          <el-col :span="8">
            <span>商户联系人：</span>
            {{ boxCardText.merchant_person }}
          </el-col>
          <el-col :span="8">
            <span>开户名：</span>
            {{ boxCardText.account_name }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>注册名称：</span>
            {{ boxCardText.merchant_company }}
          </el-col>
          <el-col :span="8">
            <span>联系人电话：</span>
            {{ boxCardText.merchant_phone }}
          </el-col>
          <el-col :span="8">
            <span>账户性质：</span>
            {{ boxCardText.account_type === '1' ? '对公' : boxCardText.account_type === '2' ? '对私' : '' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>行业类别：</span>
            {{ boxCardText.business_name }}
          </el-col>
          <el-col :span="8">
            <span>联系人邮箱：</span>
            {{ boxCardText.merchant_email }}
          </el-col>
          <el-col :span="8">
            <span>开户账号：</span>
            {{ boxCardText.account_no }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>商户地址：</span>
            {{ boxCardText.merchant_address }}
          </el-col>
          <el-col :span="8">
            <span>客服电话：</span>
            {{ boxCardText.merchant_service_phone }}
          </el-col>
          <el-col :span="8">
            <span>银行预留号码：</span>
            {{ boxCardText.account_phone }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>准入日期：</span>
            {{ formatCreate_time(boxCardText.gmt_create) }}
          </el-col>
          <el-col :span="8">
            <span>业务员：</span>
            {{ boxCardText.salesman_name }}
          </el-col>
          <el-col :span="8">
            <span>开户支行：</span>
            {{ boxCardText.bank_name }}
          </el-col>
        </el-row>
        <el-row  v-show="boxCardText.id">
          <el-col :span="8">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="8">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="8">
            <el-button type="text" @click="dialogPhoneVisible = true">资质证照预览</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xinxi"></use>
        </svg>
        <span>费率信息</span>
      </div>
      <div class="box-card-text">
        <el-row>
          <el-col :span="8">
            <span>微信费率：</span>
            {{ boxCardText.wx_rate || '未配置' }}‰
          </el-col>
          <el-col :span="8">
            <span>支付宝费率：</span>
            {{ boxCardText.wx_rate || '未配置'  }}‰
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 资质证照预览 -->
    <el-dialog
      :title="`资质证照（${boxCardText.merchant_name}）`"
      :visible.sync="dialogPhoneVisible"
      width="45%"
    >
      <el-form :model="boxCardText" :inline="true" label-width="150px" label-position="left">
        <el-form-item label="营业执照照片" v-if="boxCardText.img_business_license">
          <a :href="boxCardText.img_business_license" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_business_license" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="法人身份证正面" v-if="boxCardText.img_idcard_a">
          <a :href="boxCardText.img_idcard_a" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_idcard_a" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="法人身份证反面" v-if="boxCardText.img_idcard_b">
          <a :href="boxCardText.img_idcard_b" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_idcard_b" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="银行卡正面照片" v-if="boxCardText.img_bankcard_a">
          <a :href="boxCardText.img_bankcard_a" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_bankcard_a" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="银行卡反面照片" v-if="boxCardText.img_bankcard_b">
          <a :href="boxCardText.img_bankcard_b" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_bankcard_b" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="商户门头照片" v-if="boxCardText.img_logo">
          <a :href="boxCardText.img_logo" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_logo" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="内部前台照片" v-if="boxCardText.img_indoor">
          <a :href="boxCardText.img_indoor" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_indoor" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="开户许可证照片" v-if="boxCardText.img_open_permits">
          <a :href="boxCardText.img_open_permits" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_open_permits" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="商户关系证明" v-if="boxCardText.img_relation">
          <a :href="boxCardText.img_relation" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_relation" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="结算人身份证正面" v-if="boxCardText.img_private_idcard_a">
          <a :href="boxCardText.img_private_idcard_a" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_private_idcard_a" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="结算人身份证反面" v-if="boxCardText.img_private_idcard_b">
          <a :href="boxCardText.img_private_idcard_b" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_private_idcard_b" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="商户总分店关系证明" v-if="boxCardText.img_mer_relation">
          <a :href="boxCardText.img_mer_relation" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_mer_relation" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="商户增值协议" v-if="boxCardText.img_mer_increment">
          <a :href="boxCardText.img_mer_increment" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_mer_increment" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="组织机构代码证照片" v-if="boxCardText.img_org_code">
          <a :href="boxCardText.img_org_code" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_org_code" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="税务登记证照片" v-if="boxCardText.img_tax_reg">
          <a :href="boxCardText.img_tax_reg" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_tax_reg" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="联系人身份证正面" v-if="boxCardText.img_person_a">
          <a :href="boxCardText.img_person_a" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_person_a" alt="证件照片">
          </a>
        </el-form-item>
        <el-form-item label="联系人身份证反面" v-if="boxCardText.img_person_b">
          <a :href="boxCardText.img_person_b" target="_blank">
            <img class="box_card_img" :src="boxCardText.thum_img_person_b" alt="证件照片">
          </a>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPhoneVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryAgentShopMer
} from "@/api/shop";
import CryptoJS from "crypto-js";
import * as util from "../../../util/util.js";
export default {
  data() {
    return {
      boxCardText: {},
      switchValue: false,
      editFormBoxCard: {},
      editFormVisible: false,
      saleLoading: false,
      editLoading: false,
      saleOptions: [],
      editSaleForm: {
        sale: ""
      },
      dialogPhoneVisible: false,

      wx_open: 'N',
      ali_open: 'N',

      dialogVisibleLimit: false,
      formLimit: {
        dayLimit: '',
        transLimit: '',
        isAdd: true
      }
    };
  },
  mounted() {
    this.getMerDetails()
  },
  methods: {
    formatCreate_time(row) {
      return row ? util.formatDate.format(new Date(row), "yyyy/MM/dd hh:MM:ss") : '';
    },
    //云打印
    clickPrint() {
      this.$router.push({
        path: "/index2/page13",
        query: { mid: this.$route.query.mid }
      });
    },
    getMerDetails() {
      const loading = this.$loading({
        lock: true,
        text: "正在请求数据",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)"
      });
      queryAgentShopMer({ mid: this.$route.query.mid }).then(res => {
        this.boxCardText = res.data.returnMap;
        loading.close();
      });
    }
  }
};
</script>
