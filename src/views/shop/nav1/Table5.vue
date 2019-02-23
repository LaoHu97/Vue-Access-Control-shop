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
        <span>交易详情</span>
      </div>
      <div class="box-card-text">
        <el-row>
          <el-col :span="12" style="font-size:20px;color:#F56C6C">
            <span>订单号：</span>
            {{ boxCardText.orderId }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>第三方订单号：</span>
            {{ boxCardText.transactionId }}
          </el-col>
          <el-col :span="8">
            <span>支付方式：</span>
            {{ formatPay1(boxCardText.payWay) }}
          </el-col>
          <el-col :span="8">
            <span>商户名称：</span>
            {{ boxCardText.mname }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>交易金额（元）：</span>
            {{ boxCardText.goodsPrice }}
          </el-col>
          <el-col :span="8">
            <span>支付状态：</span>
            {{ formatPay2(boxCardText) }}
          </el-col>
          <el-col :span="8">
            <span>门店名称：</span>
            {{ boxCardText.storeName }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>退款金额（元）：</span>
            {{ boxCardText.refundAmount }}
          </el-col>
          <el-col :span="8">
            <span>支付类型：</span>
            {{ boxCardText.payType === 'MICRO' ? '刷卡' : boxCardText.payType === 'NATIVE' ? '扫码' : boxCardText.payType === 'JSAPI' ? '公众号' : '其他' }}
          </el-col>
          <el-col :span="8">
            <span>款台名称：</span>
            {{ boxCardText.username }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>手续费（元）：</span>
            {{ boxCardText.factorage }}
          </el-col>
          <el-col :span="8">
            <span>交易时间：</span>
            {{ format_payTime(boxCardText.payTime) }}
          </el-col>
          <el-col :span="8">
            <span>商户号：</span>
            {{ boxCardText.merchant_no }}
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  queryOrderDetail
} from "@/api/shop";
import CryptoJS from "crypto-js";
import * as util from "../../../util/util.js";
export default {
  data() {
    return {
      boxCardText: {}
    };
  },
  mounted() {
    this.getMerDetails()
  },
  methods: {
      formatPay2: function (row, column) {
        return util.formatPayStatus(row.status, row.orderType)
      },
      formatPay1: function (row) {
        return util.formatPayment(row)
      },
      format_payWay(row, column) {
        return util.formatPayment(row.payWay)
      },
      format_payTime(props) {
        return util.formatDate.format(new Date(props), 'yyyy-MM-dd hh:mm:ss')
      },
    getMerDetails() {
      const loading = this.$loading({
        lock: true,
        text: "正在请求数据",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)"
      });
      queryOrderDetail({ id: this.$route.query.id }).then(res => {
        this.boxCardText = res.data.order;
        loading.close();
      });
    }
  }
};
</script>
