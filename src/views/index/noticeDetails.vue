<template>
  <el-container style="height:100%">
    <el-header style="background: #fff;">
      <el-row>
        <el-col :span="6">
          <div class="top_logo">
            <img src="../../assets/images/logo4.png" />
            <span>万 鼎 科 技</span>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class="details_main">
        <h1>{{data.title}}</h1>
        <span>尊敬的微信支付商户：</span>
        <div class="details_main_text"><div v-html="data.article"></div></div>
        <h2>西安万鼎科技
          <br>{{format_date(data.gmt_create)}}</h2>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { getNoticeById } from '../../api/shop'
import * as util from '../../util/util'
export default {
  data(){
    return{
      data:{}
    }
  },
  methods: {
    //格式化时间
    format_date(val){
      return util.dateFormat((val), 'yyyy/MM/dd')
    },
    getUsers(){
      getNoticeById({id:this.$route.query.id}).then(res=>{
        this.data = res.data;    
      })
    }
  },
  mounted(){
    this.getUsers()
  }
}
</script>
<style scoped lang="scss">
  .top_logo {
    width: 180px;
    float: left;
  }

  .top_logo img {
    width: 30%;
    margin-top: 17px;
    float: left;
  }

  .top_logo span {
    font-size: 18px;
    font-weight: bolder;
    color: #284890;
    line-height: 60px;
  }

  .details_main {
    border: 1px solid #DCDFE6;
    background: #fff;
    margin: 0 10%;
    h1 {
      text-align: center;
      font-weight: inherit;
      margin-top: 50px;
      margin-bottom: 50px;
    }
    h2 {
      text-align: center;
      font-weight: inherit;
      font-size: 16px;
      text-align: right;
      line-height: 2;
      padding: 15px 35px;
    }
    .details_main_text{
      font-size: 16px;
      padding: 15px 35px;
      line-height: 2;
    }
    span {
      font-size: 16px;
      padding: 15px 35px;
    }
  }

</style>
