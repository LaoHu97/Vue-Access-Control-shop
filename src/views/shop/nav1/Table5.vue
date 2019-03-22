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
          <use xlink:href="#icon-dingdan"></use>
        </svg>
        <span>交易订单</span>
      </div>
      <div class="box-card-text">
        <el-row>
          <el-col :span="12" style="font-size:20px;color:#F56C6C">
            <span>商户名：</span>{{ boxCardText.mname }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>商户号：</span>{{ boxCardText.merchant_no }}
          </el-col>
          <el-col :span="8">
            <span>门店名称：</span>{{ boxCardText.storeName }}
          </el-col>
          <el-col :span="8">
            <span>款台名称：</span>{{ boxCardText.username }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>交易订单号：</span>{{ boxCardText.orderId }}
          </el-col>
          <el-col :span="8">
            <span>第三方订单号：</span>{{ boxCardText.transactionId }}
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-saomazhifu"></use>
        </svg>
        <span>支付信息</span>
      </div>
      <div class="box-card-text">
        <el-row>
          <el-col :span="8">
            <span>支付方式：</span>{{ formatPay1(boxCardText.payWay) }}
          </el-col>
          <el-col :span="8">
            <span>支付类型：</span>{{ boxCardText.payType === 'MICRO' ? '刷卡支付' : boxCardText.payType === 'NATIVE' ? '扫码支付' : boxCardText.payType === 'JSAPI' ? '公众号支付' : '其他' }}
          </el-col>
          <el-col :span="8">
            <span>支付状态：</span>{{ formatPay2(boxCardText) }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>交易金额：</span>{{ boxCardText.goodsPrice }}元
          </el-col>
          <el-col :span="8">
            <span>手续费：</span>{{ boxCardText.factorage }}元
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shijian"></use>
        </svg>
        <span>时间信息</span>
      </div>
      <div class="box-card-text">
        <el-row>
          <el-col :span="8">
            <span>订单创建时间：</span>{{ format_payTime(boxCardText.createTime) }}
          </el-col>
          <el-col :span="8">
            <span>订单支付时间：</span>{{ format_payTime(boxCardText.payTime) }}
          </el-col>
          <el-col :span="8">
            <span>最后更新时间：</span>{{ format_payTime(boxCardText.update_time) }}
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card" v-for="(item, index) in boxCardTextList" :key="index">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-tuikuan"></use>
        </svg>
        <span>退款信息</span>
      </div>
      <div class="box-card-text">
        <el-row>
          <el-col :span="8">
            <span>退款处理单号：</span>{{ item.orderId }}
          </el-col>
          <el-col :span="8">
            <span>退款金额：</span>{{ item.goodsPrice }}元
          </el-col>
          <el-col :span="8">
            <span>退款状态：</span>{{ item.status === '0' ? '发起退款' : item.status === '1' ? '退款成功' : item.status === '2' ? '退款失败' : '未知'}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>退款完成时间：</span>{{ format_payTime(item.payTime) }}
          </el-col>
          <el-col :span="8">
            <span>退还手续费：</span>{{ item.factorage }}元
          </el-col>
          <el-col :span="8">
            <span>备注：</span>{{ item.goodsDesc }}
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
import * as util from "@/util/util.js";
export default {
  data() {
    return {
      boxCardText: {},
      boxCardTextList: []
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
    format_payTime(props) {
      return props ? util.formatDate.format(new Date(props), 'yyyy-MM-dd hh:mm:ss') : ''
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
        this.boxCardTextList = res.data.refundOrderList
        loading.close();
      });
    }
  }
};
</script>
