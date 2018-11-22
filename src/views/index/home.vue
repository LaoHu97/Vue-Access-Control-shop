<style scoped lang="scss">
  .grid-content {
    min-height: 36px;
    background: #fff;
    border: 1px solid #DCDFE6;
    padding: 15px;
    height: 613px;
    ;
    .grid_content_left_top {
      margin-bottom: 10px;
      border-bottom: 1px solid #DCDFE6;
      height: 100px;
      div {
        height: 80px;
        line-height: 80px;
      }
      i {
        font-size: 36px;
        color: #C0C4CC
      }
      img {
        width: 80px;
      }
    }
    .grid_content_left_main {
      margin: 35px 0;
      div {
        height: 60px;
        text-align: center;
        span {
          color: #909399;
        }
      }
      .grid_line {
        border-left: solid 1px #DCDFE6; // border-right: solid 1px #DCDFE6;
      }
    }
    .grid_content_right_top {
      p {
        color: #909399;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .grid_content_right_bottom {
      a {
        color: #333;
      } // margin-top: 55px;
      h3 {
        border-bottom: 1px solid #DCDFE6;
        padding-bottom: 15px;
        i {
          width: 10px;
          height: 20px;
          display: block;
          background-color: #409EFF;
          float: left;
          margin: 2px 10px 0 0;
        }
      }
      div {
        line-height: 2.8;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 1px #DCDFE6 dashed;
      }
      .grid_content_right_bottom_gengduo {
        border: none;
        text-align: right;
      }
    }

  }

  .element_footer {
    font-size: 14px;
    text-align: center;
    line-height: 60px;
  }

</style>
<template>
  <div>
    <el-container style="height:100%">
      <el-header style="background: #fff;height:auto">
        <EleHeader @login="login" @logout="logout"></EleHeader>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="grid-content">
              <div class="grid_content_left_top">
                <el-row>
                  <el-col :span="20">
                    <div>
                      <i class="iconfont icon-tianjia"></i>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <el-popover ref="popover" placement="bottom" width="200" trigger="hover">
                      <div>
                        <img src="../../assets/images/weixiner.jpg" alt="二维码" width="100%">
                        <p style="text-align: center;">扫描二维码加入微信群
                          <br>及时关注微信支付通知</p>
                      </div>
                    </el-popover>
                    <div v-popover:popover>
                      <img src="../../assets/images/weixiner.jpg" alt="二维码">
                    </div>
                  </el-col>
                </el-row>
              </div>
              <el-alert title="本页面数据仅供经营状况参考，不代表账单信息，请勿用作对账" type="warning" :closable="false" show-icon>
              </el-alert>
              <div class="grid_content_left_main">
                <el-row>
                  <el-col :span="12">
                    <div>
                      <span>最近一周销售金额(元)</span>
                      <h2>{{format_amount(lineChartSummaryData.sumAmt)}}</h2>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid_line">
                      <span>最近一周销售笔数(笔)</span>
                      <h2>{{format_amount(lineChartSummaryData.sumTotal)}}</h2>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="grid_content_left_bottom">
                <LineChart :chart-data="lineChartData"></LineChart>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <div class="grid_content_right_bottom">
                <h3>
                  <i></i>平台公告</h3>
                <div v-for="item in noticeList" :key="item.id">
                  <router-link :to="{ path: '/noticeDetails', query: { id: item.id }}" target="_blank">
                    <span>{{ item.title }}</span>
                  </router-link>
                </div>
                <div class="grid_content_right_bottom_gengduo">
                  <router-link :to="{ path: '/noticeList' }" target="_blank">
                    更多
                  </router-link>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer class="element_footer">版权所有：西安万鼎网络科技有限公司 | ICP备 陕17002918号</el-footer>
    </el-container>
  </div>
</template>
<script>
  import instance from "../../api";
  import CryptoJS from "crypto-js";
  import * as util from '../../util/util'
  import {
    modifyPassword,
    batchRemoveUser,
    merDataSumShow,
    getNotices
  } from '../../api/shop';
  import {
    LineChart,
    EleHeader
  } from '../../components'

  export default {
    components: {
      LineChart,
      EleHeader
    },
    data() {
      return {
        noticeList: [],
        lineChartData: {},
        lineChartSummaryData: {}
      };
    },
    computed: {
      activeIndex() {
        return this.$store.state.perMission.activeIndex
      }
    },
    methods: {
      getUsers() {
        let para = {
          pageNum: '1',
          numPerPage: '7'
        }
        getNotices(para).then(res => {
          this.noticeList = res.data.noticeList;
        })
      },
      //格式化金额
      format_amount(val) {
        return util.number_format(val, 2, ".", ",")
      },
      //获取首页折线图数据
      lineCharIndex() {
        let myDate = Date.now();
        let para = {
          startTime: util.dateFormat((myDate - 3600 * 1000 * 24 * 7), 'yyyy/MM/dd'),
          endTime: util.dateFormat((myDate - 3600 * 1000 * 24 * 1), 'yyyy/MM/dd')
        }
        merDataSumShow(para).then(res => {
          this.lineChartSummaryData = res.data
          let expectedData = res.data.amtList
          this.lineChartData = {
            expectedData
          }
        })
      },
      //退出登录
      logout: function () {
        this.$emit("logout");
      },
      //重新获取路由
      login: function (newPath) {
        this.$emit("login", newPath);
      }
    },
    mounted() {
      this.lineCharIndex()
      this.getUsers()
    }
  };

</script>
