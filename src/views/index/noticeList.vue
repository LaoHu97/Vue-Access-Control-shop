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
      <div class="detailsList_main">
        <div class="detailsList_main_top">平台公告</div>
        <div v-for="item in noticeList" :key="item.id" class="detailsList_main_list">
          <router-link :to="{ path: '/noticeDetails', query: { id: item.id }}" target="_blank">
            <el-row>
              <el-col :span="20">
                <p>{{item.title}}</p>
              </el-col>
              <el-col :span="4">
                <p class="detailsList_main_list_date">{{format_date(item.gmt_create)}}</p>
              </el-col>
            </el-row>
          </router-link>
        </div>
        <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" class="detailsList_pager" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { getNotices } from '../../api/shop'
import * as util from '../../util/util'
export default {
  data(){
    return{
      page: 1,
      total:0,
      pageSize:10,
      noticeList:[]
    }
  },
  methods: {
    //格式化时间
    format_date(val){
      return util.dateFormat((val), 'yyyy/MM/dd')
    },
    //分页
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    getUsers(){
      let para = {
        pageNum:this.page.toString(),
        numPerPage: this.pageSize.toString()
      }
      getNotices(para).then(res=>{
        this.noticeList = res.data.noticeList;
        this.total = res.data.totalCount
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

  .detailsList_main {
    border: 1px solid #DCDFE6;
    background: #fff;
    margin: 0 10%;
    .detailsList_main_top{
      height: 60px;
      background: #EBEEF5;
      line-height: 60px;
      padding-left: 15px;
      margin-bottom: 25px;
      font-size: 16px;
    }
    .detailsList_main_list{
      font-size: 16px;
      padding: 0 15px;
      border-bottom: 1px solid #DCDFE6;
      margin: 0 15px;
      a {
        color: #333;
      }
      .detailsList_main_list_date{
        color: #C0C4CC;
      }
    }
    .detailsList_pager{
      margin: 25px 0;
      text-align: center;
    }
  }

</style>
