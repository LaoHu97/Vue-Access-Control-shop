<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="资讯名称">
          <el-input v-model="filters.name" class="fixed_search_input" clearable placeholder="资讯名称"></el-input>
        </el-form-item>
        <el-form-item label="资讯类型">
          <el-select v-model="filters.newsType" class="fixed_search_input" clearable placeholder="资讯类型">
            <el-option v-for="item in newsOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期时间">
          <el-date-picker v-model="filters.startTime" class="fixed_search_input_datetime" type="datetime" placeholder="开始日期" :picker-options="pickerOptions1" :clearable="false"
            :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker v-model="filters.endTime" class="fixed_search_input_datetime" type="datetime" placeholder="结束日期" :picker-options="pickerOptions2" :clearable="false"
            :editable='false'>
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
          <el-button type="primary" @click="addCarousel" round>新增资讯</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border row-key="id" style="width: 100%">
        <el-table-column prop="appid" label="APPID（小程序ID）" width="180">
        </el-table-column>
        <el-table-column prop="appname" label="小程序名称" width="180">
        </el-table-column>
        <el-table-column prop="title" label="资讯名称">
        </el-table-column>
        <el-table-column prop="gmt_create" label="创建时间" :formatter="formatter_time">
        </el-table-column>
        <el-table-column prop="title_type" label="资讯类型" :formatter="formatter_title_type">
        </el-table-column>
        <el-table-column label="内容类型" :formatter="formatter_main">
        </el-table-column>
        <el-table-column prop="statu" label="状态" :formatter="formatter_statu">
        </el-table-column>
        <!-- <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-switch name="value" @change="switchChange(scope.$index, scope.row)" v-model="scope.row.statu" active-text="已发布" inactive-text="未发布">
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="操作" width="290">
          <template slot-scope="scope">
            <el-button size="mini" @click="handlePreview(scope.$index, scope.row)">预览</el-button>
            <el-button size="mini" type="primary" @click="switchChange(scope.$index, scope.row)">{{scope.row.statu === 1 ? '撤销' : scope.row.statu === 2 ? '发布' : '未知'}}</el-button>
            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)" :disabled="scope.row.statu === 1">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" :disabled="scope.row.statu === 1">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="centerTextDialogVisible" width="30%" center>
      <span v-html="dialogText"></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerTextDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total"
        background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>
<script>
  import * as util from '../../../util/util.js'
  import {
    selectByTime,
    deleteMiniNews,
    updateNewsStatu
  } from '../../../api/shop';
  export default {
    data() {
      var myDate = new Date();
      return {
        //时间控制
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pickerOptions2: {
          disabledDate: (time)=>{
            let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.filters.startTime),'yyyy-MM-dd hh:mm:ss')));
            if (time.getTime() < startTimeOne || time.getTime() > Date.now()) {
              return true;
            }
          }
        },
        newsOptions: [{
          value: '1',
          label: '新闻'
        }, {
          value: '2',
          label: '公告'
        }],
        addLoading: false,
        listLoading: false,
        users: [],
        page: 1,
        total: 0,
        filters: {
          startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()),
          endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 23, 59, 59),
          newsType: '',
          name: ''
        },
        centerTextDialogVisible: false,
        dialogTitle: '标题',
        dialogText: ''
      }
    },
    methods: {
      formatter_main(row, column) {
        return row.title_url ? '公众号链接' : '自定义内容'
      },
      formatter_statu(row, column) {
        return row.statu === 1 ? '已发布' : row.statu === 2 ? '未发布' : '未知'
      },
      formatter_title_type(row, column) {
        return row.title_type === 1 ? '新闻' : row.title_type === 2 ? '公告' : '未知'
      },
      formatter_time(row, column) {
        return util.formatDate.format(new Date(row.gmt_create), 'yyyy-MM-dd hh:mm:ss')
      },
      addCarousel() {
        this.$router.push({
          path: '/index4/miniprogram3'
        });
      },
      handlePreview(index, row) {
        this.centerTextDialogVisible = true
        this.dialogTitle = row.title
        if (row.title_url) {
          return this.dialogText = '<p style="text-align: center;">此资讯为公众号链接，暂不支持预览</p>'
        }
        this.dialogText = row.title_contents
      },
      handleEdit(index, row) {
        this.$router.push({
          path: '/index4/miniprogram5',
          query: {
            id: row.id
          }
        });
      },
      switchChange(index, row) {
        this.$confirm('此操作将更改资讯状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {
            id: row.id,
            statu: row.statu === 2 ? 1 : row.statu == 1 ? 2 : "未知"
          }
          updateNewsStatu(para).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: res.message
              });
              this.getUsers()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消状态修改'
          });
          this.getUsers()
        });
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {
            id: row.id
          }
          deleteMiniNews(para).then(res => {
            if (res.status === 200) {
              this.getUsers()
              this.$message({
                message: res.message,
                type: 'success'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleCurrentChange(val) {
        this.page = val
        this.getList()
      },
      getUsers() {
        this.page = 1
        this.getList()
      },
      getList() {
        let para = {
          page: this.page,
          title: this.filters.name,
          title_type: this.filters.newsType,
          startTime: this.filters.startTime,
          endTime: this.filters.endTime
        }
        this.listLoading = true
        para.startTime = (!para.startTime || para.startTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(
          para.startTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
        para.endTime = (!para.endTime || para.endTime == '') ? '' : String(Date.parse(util.formatDate.format(new Date(
          para.endTime), 'yyyy/MM/dd hh:mm:ss'))); //开始时间
        selectByTime(para).then(res => {
          this.listLoading = false
          if (res.status === 200) {
            this.users = res.data.newsList
            this.total = res.data.totalCount
            // var sta;
            // for (var i = 0; i < this.users.length; i++) {
            //   sta = this.users[i];
            //   if (sta.statu === 1) {
            //     sta.statu = true
            //   } else {
            //     sta.statu = false
            //   }
            // }
          }
        })
      },
    },
    mounted() {
      this.getUsers()
    }
  }

</script>

<style scoped>
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 375px;
    height: 150px;
    margin: 0 auto;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 375px;
    line-height: 150px;
    text-align: center;
  }

  .avatar {
    width: 375px;
    height: 150px;
  }

</style>
