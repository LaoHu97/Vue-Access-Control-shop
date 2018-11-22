<template>
  <div>
    <el-card class="box_card">
      <div slot="header" class="clearfix">
        <span>商户简介</span>
      </div>
      <div class="main_form">
        <el-row :gutter="20">
          <el-col :span="8">
            <p>
              <span>商户名称：</span>{{profilesForm.mname}}</p>
          </el-col>
          <el-col :span="8">
            <p>
              <span>商户账号：</span>{{profilesForm.maccount}}</p>
          </el-col>
          <el-col :span="8">
            <p>
              <span>入驻时间：</span>{{format_payTime(profilesForm.creatTime)}}</p>
          </el-col>
        </el-row>
        <div class="main_title"><span>商户费率（‰）</span></div>
        <el-row :gutter="20">
          <el-col :span="8">
            <p>
              <i class="iconfont icon-weixin"></i>
              <span>微信：</span>
              {{format_rate(profilesForm.returnMap.WX)}}
            </p>
          </el-col>
          <el-col :span="8">
            <p>
              <i class="iconfont icon-zhifubao"></i>
              <span>支付宝：</span>
              {{format_rate(profilesForm.returnMap.ALI)}}
            </p>
          </el-col>
          <el-col :span="8">
            <p>
              <i class="iconfont icon-paybest"></i>
              <span>翼支付：</span>
              {{format_rate(profilesForm.returnMap.BEST)}}
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <p>
              <i class="iconfont icon-card"></i>
              <span>借记卡：</span>
              {{format_rate(profilesForm.returnMap.DEBIT)}}
            </p>
          </el-col>
          <el-col :span="8">
            <p>
              <i class="iconfont icon-cardb"></i>
              <span>贷记卡：</span>
              {{format_rate(profilesForm.returnMap.CREDIT)}}
            </p>
          </el-col>
          <el-col :span="8">
            <p>
              <i class="iconfont icon-yinlian1193427easyiconnet"></i>
              <span>银联二维码：</span>
              {{format_rate(profilesForm.returnMap.UNIONPAY)}}
            </p>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
  import * as util from '../../../util/util.js'
  import {
    merInfoShow
  } from '../../../api/shop';
  export default {
    data() {
      return {
        profilesForm: {
          creatTime: '',
          maccount: '',
          malias: '',
          mname: '',
          returnMap: {

          }
        }
      }
    },
    methods: {
      format_payTime(props) {
        return util.formatDate.format(new Date(props), 'yyyy-MM-dd hh:mm:ss')
      },
      format_rate(props) {
        return props !== undefined ? props : '暂无'
      },
      getUsers(){
        merInfoShow().then((res)=>{
          this.profilesForm = res.data
        })
      }
    },
    created() {
      this.getUsers();
    }
  }

</script>
<style scoped>
  .clearfix {
    font-size: 20px;
  }
  .main_form p span {
    color: #99a9bf;
  }
  .main_title{
    border-top: 1px solid #ebeef5;
    line-height: 2.5;
    font-size: 18px;
  }
  .iconfont{
    font-size: 32px;
    vertical-align:middle;
    margin:  0 10px;
  }
  .icon-weixin{
    color: #65da4e;
  }
  .icon-zhifubao{
    color: #1296db;
  }
  .icon-card{
    color: #2F559B;
  }
  .icon-paybest{
    color: #F1900E;
  }
  .icon-cardb{
    color: tomato;
  }
  .icon-yinlian1193427easyiconnet{
    color: coral;
  }
</style>
