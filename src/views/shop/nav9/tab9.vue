<template lang="html">
  <div class="">
    <div class="bill1-top">
      <h3>交易账单</h3>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账户类型" prop="accountType">
        <el-radio-group v-model="ruleForm.accountType">
          <el-radio :label="2">私户</el-radio>
          <el-radio :label="1">公户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="消费类型" prop="reasonId">
        <el-radio-group v-model="ruleForm.reasonId">
          <el-radio :label="1">充值</el-radio>
          <el-radio :label="2">消费</el-radio>
          <el-radio :label="10">退款</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="对账单时间" prop="resource">
        <el-date-picker
          v-model="ruleForm.startTime"
          :editable="false"
          :clearable="false"
          type="date"
          :picker-options="pickerOptions1"
          placeholder="选择日期">
        </el-date-picker> 至
        <el-date-picker
          v-model="ruleForm.endTime"
          :editable="false"
          :clearable="false"
          type="date"
          :picker-options="pickerOptions2"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item  label="注：">
        <span style="color:#999;">如果下载出现乱码，请选择office2003打开</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即下载</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as util from '../../../util/util.js'
	import { downTransExcel } from '../../../api/shop';
  export default {
    data() {
      return {
        //时间控制
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90;
          }
        },
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90;
          }
        },
        ruleForm: {
          accountType:2,
          reasonId:1,
          startTime:Date(),
          endTime:Date(),
          order_type:0
        },
        rules: {

        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          let para={
            accountType:String(this.ruleForm.accountType),
            reasonId:String(this.ruleForm.reasonId),
            startTime:this.ruleForm.startTime,
            endTime:this.ruleForm.endTime
          }
          para.startTime = (!para.startTime || para.startTime == '') ? '' : util.formatDate.format(new Date(para.startTime), 'yyyy-MM-dd');
          para.endTime = (!para.endTime || para.endTime == '') ? '' : util.formatDate.format(new Date(para.endTime), 'yyyy-MM-dd');
          window.location.href=process.env.API_ROOT+ downTransExcel +"?"+"accountType="+para.accountType+"&"+"reasonId="+para.reasonId+"&"+"startTime="+para.startTime+"&"+"endTime="+para.endTime;
        });
      },
    }
  }
</script>
<style media="screen">
  .bill1-top{
    padding: 0 25px;
    border-bottom: 1px solid #eee;
  }
  .demo-ruleForm{
    padding: 0 25px;
    width: 600px;
    margin: auto;
  }
</style>
