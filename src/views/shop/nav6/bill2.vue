<template lang="html">
  <div class="">
    <div class="bill1-top">
      <h3>更多交易账单</h3>
    </div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择时间" prop="resource">
            <el-date-picker v-model="ruleForm.startTime" :editable="false" :clearable="false" :type="dateType" @change="changTime" :picker-options="pickerOptions1"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item label-width="0">
            至
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="" prop="endTime" label-width="0px">
            <el-date-picker v-model="ruleForm.endTime" :editable="false" :clearable="false" :type="dateType" :picker-options="pickerOptions2"
              placeholder="选择日期" default-time="23:59:59">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="注：">
          <span style="color:#999;">每次下载区间最多为3个月。如果下载出现乱码，请选择office2003打开</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即下载</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import * as util from '../../../util/util.js'
  import * as data from '../../../util/data.js'
  import {
    downOrderExcelNew,
    checkdownOrderExcelNew,
    selectStoreList,
    checkFuiouDataExcel,
    selectEmpsBySid
  } from '../../../api/shop';
  export default {
    data() {
      var myDate = new Date();
      return {
        //时间控制
        pickerOptions1: {
          disabledDate: (time) => {
            if (time.getTime() > Date.now() - 3600 * 1000 * 24) {
              return true;
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.ruleForm.startTime),
              'yyyy-MM-dd')));
            if (time.getTime() > startTimeOne + 3600 * 1000 * 24 * 90 || time.getTime() < startTimeOne - 3600 * 1000 *
              24 * 1 || time.getTime() > Date.now() - 3600 * 1000 * 24) {
              return true;
            }
          }
        },
        dateType: 'datetime',
        ruleForm: {
          startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate() - 1),
          endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate() - 1, 23, 59, 59),
        }
      };
    },
    methods: {
      changTime(date) {
        let end_time = Date.parse(new Date(util.formatDate.format(new Date(this.ruleForm.endTime), 'yyyy-MM-dd')))
        let date_time = Date.parse(new Date(util.formatDate.format(new Date(date), 'yyyy-MM-dd')))
        if (date_time < end_time - 3600 * 1000 * 24 * 90) {
          this.ruleForm.endTime = new Date(this.ruleForm.startTime.getFullYear(), this.ruleForm.startTime.getMonth(),
            this.ruleForm.startTime.getDate(), 23, 59, 59)
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = {
              mid: sessionStorage.getItem('mid'),
              startTime: this.ruleForm.startTime,
              endTime: this.ruleForm.endTime
            }
            para.startTime = (!para.startTime || para.startTime == '') ? '' : String(Date.parse(util.formatDate.format(
              new Date(para.startTime), 'yyyy/MM/dd hh:mm:ss')));
            para.endTime = (!para.endTime || para.endTime == '') ? '' : String(Date.parse(util.formatDate.format(
              new Date(para.endTime), 'yyyy/MM/dd hh:mm:ss')));
            checkFuiouDataExcel(para).then(res => {
              if (res.data.status === 200) {
                window.open(res.data.data)
              }
            })
          }
        });
      },
    }
  }

</script>
<style media="screen">
  .bill1-top {
    padding: 0 25px;
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
  }

  .demo-ruleForm {
    padding: 0 25px;
    width: 750px;
    margin: auto;
  }

</style>
