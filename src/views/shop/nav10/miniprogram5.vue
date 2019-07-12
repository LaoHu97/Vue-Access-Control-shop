<template>
  <div>
    <el-form ref="postForm" :inline="true" label-position="left" :model="postForm" label-width="95px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="文章标题" prop="title" :rules="[
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { max: 40, message: '长度最多40个字符', trigger: 'blur' }
        ]">
            <el-input v-model="postForm.title" maxlength="40"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文章类型" prop="newsType"  :rules="[
          { required: true, message: '请选择文章类型', trigger: 'change' }
        ]">
            <el-select v-model="postForm.newsType" placeholder="请选择文章类型">
              <el-option v-for="item in newsOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="小程序" prop="miniinfoType"  :rules="[
            { required: true, message: '请选择小程序', trigger: 'change' }
          ]">
            <el-select v-model="postForm.miniinfoType" placeholder="请选择小程序">
              <el-option v-for="item in miniinfoOptions" :key="item.appid" :label="item.appname" :value="item.appid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="公众号链接">
            <el-input v-model="postForm.url"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预览图" prop="imageUrl" :rules="[
            { required: true, message: '请上传预览图', trigger: 'change' }
          ]">
            <el-upload class="avatar-uploader" :action="uploadimg" :show-file-list="false" :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="postForm.imageUrl" :src="postForm.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="success" @click="submitForm('postForm')">保存</el-button>
            <el-button type="warning" @click="clickReturn('postForm')">返回</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <Tinymce ref="editor" v-model="postForm.content"></Tinymce>
    </el-form>
  </div>
</template>

<script>
  import * as util from '../../../util/util.js'
  import {
    selectInfoByMid,
    addMiniNews,
    updateMiniNews,
    getNewDetail,
    uploadImage
  } from '../../../api/shop';
  import {
    Tinymce
  } from '../../../components'
  export default {
    components: {
      Tinymce
    },
    data() {
      return {
        uploadimg: uploadImage,
        postForm: {
          title: '',
          newsType: '',
          miniinfoType: '',
          url: '',
          imageUrl: '',
          content: 'Hello,word'
        },
        newsOptions: [{
          value: '1',
          label: '新闻'
        }, {
          value: '2',
          label: '公告'
        }],
        miniinfoOptions: []
      }
    },
    methods: {
      clickReturn() {
        this.$router.go(-1)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = {
              id: this.$route.query.id,
              appid: this.postForm.miniinfoType,
              title: this.postForm.title,
              title_url: this.postForm.url,
              title_contents: this.postForm.content,
              title_type: this.postForm.newsType,
              image: this.postForm.imageUrl
            }
            updateMiniNews(para).then(res => {
              if (res.status === 200) {
                this.$refs[formName].resetFields();
                this.$router.push({path: '/index4/miniprogram4'});
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
      getNewsDetail() {
        let para = {
          id: this.$route.query.id
        }
        getNewDetail(para).then(res => {
          if (res.status === 200) {
            this.postForm.title = res.data.title
            this.postForm.newsType = String(res.data.title_type)
            this.postForm.miniinfoType = res.data.appid
            this.postForm.imageUrl = res.data.image
            if (res.data.title_url) {
              this.postForm.url = res.data.title_url
            }else{
              this.postForm.content = res.data.title_contents
            }
          }
        })
      },
      getMiniinfo() {
        selectInfoByMid().then(res => {
          if (res.status === 200) {
            this.miniinfoOptions = res.data.miniMenu
          }
        })
      },
      handleAvatarSuccess(res, file) {
        this.postForm.imageUrl = res.data.locationPath;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 1;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    },
    mounted() {
      this.getMiniinfo()
      this.getNewsDetail()
    }
  }

</script>
<style scoped>
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 75px;
    height: 55px;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 75px;
    line-height: 55px;
    text-align: center;
    background: #fff;
  }

  .avatar {
    width: 75px;
    height: 55px;
  }

</style>