<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true">
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" size="medium" round>刷新</el-button>
          <el-button type="primary" @click="addCarousel" size="medium" round>新增轮播图</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border row-key="id" style="width: 100%">
        <el-table-column prop="appid" label="APPID（小程序ID）" width="180">
        </el-table-column>
        <el-table-column prop="appname" label="小程序名称">
        </el-table-column>
        <el-table-column prop="gmt_modified" label="创建时间" :formatter="formatter_time">
        </el-table-column>
        <el-table-column align="center" label="操作" width="165">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total"
        background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="carouselDialogVisible" width="420px">
      <el-form :inline="true" :model="minifrom" ref="minifrom" label-position="top">
        <el-form-item label="APPID（小程序ID）" prop="appid" :rules="[
          { required: true, message: '请输入APPID', trigger: 'blur' },
        ]">
          <el-input v-model.trim="minifrom.appid" placeholder="请输入APPID"></el-input>
        </el-form-item>
        <el-form-item label="小程序名称" prop="appname" :rules="[
          { required: true, message: '请输入小程序名称', trigger: 'blur' },
        ]">
          <el-input v-model.trim="minifrom.appname" placeholder="请输入小程序名称"></el-input>
        </el-form-item>
        <el-form-item label="轮播图" prop="imageCarouselUrl_01" :rules="[
          { required: true, message: '请上传图片', trigger: 'blur' },
        ]">
          <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarSuccess_01" :before-upload="beforeAvatarUpload">
            <img v-if="minifrom.imageCarouselUrl_01" :src="minifrom.imageCarouselUrl_01" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="width:100%" prop="input_01" :rules="[
          { type: 'url', message: '请填写正确的URL', trigger: 'blur' },
        ]">
          <!-- <el-input v-model="minifrom.input_01" placeholder="请输入链接地址" style="width:240px;"></el-input> -->
          <el-button type="text" style="float:right" @click="deleteImg01">删除图片</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarSuccess_02" :before-upload="beforeAvatarUpload">
            <img v-if="minifrom.imageCarouselUrl_02" :src="minifrom.imageCarouselUrl_02" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="width:100%" prop="input_02" :rules="[
          { type: 'url', message: '请填写正确的URL', trigger: 'blur' },
        ]">
          <!-- <el-input v-model="minifrom.input_02" placeholder="请输入链接地址" style="width:240px;"></el-input> -->
          <el-button type="text" style="float:right" @click="deleteImg02">删除图片</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarSuccess_03" :before-upload="beforeAvatarUpload">
            <img v-if="minifrom.imageCarouselUrl_03" :src="minifrom.imageCarouselUrl_03" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="width:100%" prop="input_03" :rules="[
          { type: 'url', message: '请填写正确的URL', trigger: 'blur' },
        ]">
          <!-- <el-input v-model="minifrom.input_03" placeholder="请输入链接地址" style="width:240px;"></el-input> -->
          <el-button type="text" style="float:right" @click="deleteImg03">删除图片</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarSuccess_04" :before-upload="beforeAvatarUpload">
            <img v-if="minifrom.imageCarouselUrl_04" :src="minifrom.imageCarouselUrl_04" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="width:100%" prop="input_04" :rules="[
          { type: 'url', message: '请填写正确的URL', trigger: 'blur' },
        ]">
          <!-- <el-input v-model="minifrom.input_04" placeholder="请输入链接地址" style="width:240px;"></el-input> -->
          <el-button type="text" style="float:right" @click="deleteImg04">删除图片</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload class="avatar-uploader" :action="uploadImage" :show-file-list="false" :on-success="handleAvatarSuccess_05" :before-upload="beforeAvatarUpload">
            <img v-if="minifrom.imageCarouselUrl_05" :src="minifrom.imageCarouselUrl_05" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="width:100%" prop="input_05" :rules="[
          { type: 'url', message: '请填写正确的URL', trigger: 'blur' },
        ]">
          <!-- <el-input v-model="minifrom.input_05" placeholder="请输入链接地址" style="width:240px;"></el-input> -->
          <el-button type="text" style="float:right" @click="deleteImg05">删除图片</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="carouselDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="submitType" @click="miniinfoSubmission('minifrom')">确 定</el-button>
        <el-button type="primary" v-else @click="miniinfoEdit('minifrom')">修 改</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'
  import {
    queryWdMiniInfoNew,
    addWdMiniInfoNew,
    uploadAgentImage,
    deleteWdMiniInfoNew,
    updateMiniInfoNew
  } from '../../../api/shop';
  export default {
    data() {
      return {
        uploadImage: uploadAgentImage, //上传图片变量
        minifrom: {
          appid: '',
          appname: '',
          imageCarouselUrl_01: '',
          imageCarouselUrl_02: '',
          imageCarouselUrl_03: '',
          imageCarouselUrl_04: '',
          imageCarouselUrl_05: '',
          input_01: '',
          input_02: '',
          input_03: '',
          input_04: '',
          input_05: ''
        },
        addLoading: false,
        listLoading: false,
        users: [],
        page: 1,
        total: 0,
        carouselDialogVisible: false,
        submitType: true,
        dialogTitle: '新增小程序轮播图'
        // oldList: [],
        // newList: []
      }
    },
    methods: {
      formatter_time(row, column){
        return util.formatDate.format(new Date(row.gmt_modified), 'yyyy-MM-dd hh:mm:ss')
      },
      handleEdit(inde, row) {
        this.carouselDialogVisible = true
        this.submitType = false
        this.dialogTitle = '修改小程序轮播图'
        this.minifrom.id = row.id
        this.minifrom.appid = row.appid
        this.minifrom.appname = row.appname
        this.minifrom.imageCarouselUrl_01 = row.image1
        this.minifrom.imageCarouselUrl_02 = row.image2
        this.minifrom.imageCarouselUrl_03 = row.image3
        this.minifrom.imageCarouselUrl_04 = row.image4
        this.minifrom.imageCarouselUrl_05 = row.image5
        this.minifrom.input_01 = row.imageUrl1
        this.minifrom.input_02 = row.imageUrl2
        this.minifrom.input_03 = row.imageUrl3
        this.minifrom.input_04 = row.imageUrl4
        this.minifrom.input_05 = row.imageUrl5
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
          deleteWdMiniInfoNew(para).then(res => {
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
      miniinfoEdit(fromName) {
        this.$refs[fromName].validate((valid) => {
          if (valid) {
            let para = {
              id: this.minifrom.id,
              appid: this.minifrom.appid,
              appname: this.minifrom.appname,
              image1: this.minifrom.imageCarouselUrl_01,
              image2: this.minifrom.imageCarouselUrl_02,
              image3: this.minifrom.imageCarouselUrl_03,
              image4: this.minifrom.imageCarouselUrl_04,
              image5: this.minifrom.imageCarouselUrl_05,
              imageUrl1: this.minifrom.input_01,
              imageUrl2: this.minifrom.input_02,
              imageUrl3: this.minifrom.input_03,
              imageUrl4: this.minifrom.input_04,
              imageUrl5: this.minifrom.input_05
            }
            updateMiniInfoNew(para).then(res => {
              if (res.status === 200) {
                this.carouselDialogVisible = false
                this.$refs[fromName].resetFields();
                this.getUsers()
                this.$message({
                  message: res.message,
                  type: 'success'
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      miniinfoSubmission(fromName) {
        this.$refs[fromName].validate((valid) => {
          if (valid) {
            let para = {
              appid: this.minifrom.appid,
              appname: this.minifrom.appname,
              image1: this.minifrom.imageCarouselUrl_01,
              image2: this.minifrom.imageCarouselUrl_02,
              image3: this.minifrom.imageCarouselUrl_03,
              image4: this.minifrom.imageCarouselUrl_04,
              image5: this.minifrom.imageCarouselUrl_05,
              imageUrl1: this.minifrom.input_01,
              imageUrl2: this.minifrom.input_02,
              imageUrl3: this.minifrom.input_03,
              imageUrl4: this.minifrom.input_04,
              imageUrl5: this.minifrom.input_05
            }
            addWdMiniInfoNew(para).then(res => {
              if (res.status === 200) {
                this.carouselDialogVisible = false
                this.$refs[fromName].resetFields();
                this.getUsers()
                this.$message({
                  message: res.message,
                  type: 'success'
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
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
          page: this.page.toString()
        }
        this.listLoading = true
        queryWdMiniInfoNew(para).then(res => {
          this.listLoading = false
          if (res.status === 200) {
            this.users = res.data.miniInfoList
            this.total = res.data.totalCount
          }
        })
      },
      addCarousel() {
        this.carouselDialogVisible = true
        this.submitType = true
        this.dialogTitle = '新增小程序轮播图'
        this.minifrom = {
          appid: '',
          appname: '',
          imageCarouselUrl_01: '',
          imageCarouselUrl_02: '',
          imageCarouselUrl_03: '',
          imageCarouselUrl_04: '',
          imageCarouselUrl_05: '',
          input_01: '',
          input_02: '',
          input_03: '',
          input_04: '',
          input_05: ''
        }
      },
      handleAvatarSuccess_01(res, file) {
        this.minifrom.imageCarouselUrl_01 = res.data.locationPath;
      },
      handleAvatarSuccess_02(res, file) {
        this.minifrom.imageCarouselUrl_02 = res.data.locationPath;
      },
      handleAvatarSuccess_03(res, file) {
        this.minifrom.imageCarouselUrl_03 = res.data.locationPath;
      },
      handleAvatarSuccess_04(res, file) {
        this.minifrom.imageCarouselUrl_04 = res.data.locationPath;
      },
      handleAvatarSuccess_05(res, file) {
        this.minifrom.imageCarouselUrl_05 = res.data.locationPath;
      },
      deleteImg01(){
        this.minifrom.imageCarouselUrl_01 = ''
      },
      deleteImg02(){
        this.minifrom.imageCarouselUrl_02 = ''
      },
      deleteImg03(){
        this.minifrom.imageCarouselUrl_03 = ''
      },
      deleteImg04(){
        this.minifrom.imageCarouselUrl_04 = ''
      },
      deleteImg05(){
        this.minifrom.imageCarouselUrl_05 = ''
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
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
