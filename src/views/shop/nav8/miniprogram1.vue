<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="APPID（小程序ID）">
          <el-input v-model="filters.appid" class="fixed_search_input" placeholder="APPID（小程序ID）"></el-input>
        </el-form-item>
        <el-form-item label="导航标题">
          <el-input v-model="filters.title" class="fixed_search_input" placeholder="导航标题"></el-input>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
          <el-button type="primary" @click="addCarousel" round>新增导航</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" row-key="id" border  @sort-change="sortableChange" style="width: 100%">
        <el-table-column prop="appid" label="APPID（小程序ID）" min-width="180">
        </el-table-column>
        <el-table-column prop="appname" label="小程序名称" min-width="180">
        </el-table-column>
        <el-table-column prop="gmt_create" label="创建时间" min-width="180" :formatter="formatter_time">
        </el-table-column>
        <el-table-column prop="menu_url" label="导航标题" min-width="150">
        </el-table-column>
        <el-table-column prop="forward_url" label="导航地址" min-width="180">
        </el-table-column>
        <el-table-column align="center" prop="sort" sortable="custom" label="导航排序" min-width="90">
        </el-table-column>
        <!-- <el-table-column align="center"  label="拖拽" width="80">
          <template slot-scope="scope">
            <i class="icon_rank el-icon-rank"></i>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class='show-d'>{{oldList}}</div>
      <div class='show-d'>{{newList}}</div> -->
    </div>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total"
        background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="carouselDialogVisible" width="650px">
      <el-form :model="carouseForm" ref="carouseForm" label-width="80px" label-position="left">
        <el-form-item label="导航图标" prop="imageCarouselUrl" :rules="[
          { required: true, message: '导航图标不能为空'}
        ]">
          <el-upload class="avatar-uploader" :action="uploadimg" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="carouseForm.imageCarouselUrl" :src="carouseForm.imageCarouselUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> 
        <el-form-item label="导航链接" prop="url" :rules="[
          { required: true, message: '导航链接不能为空', trigger: 'blur'},
          { type: 'url', message: '请填写正确的URL地址', trigger: 'blur'}
        ]">
          <el-input placeholder="请输入导航链接" v-model="carouseForm.url"></el-input>
        </el-form-item>
        <el-form-item label="导航标题" prop="title" :rules="[
          { required: true, message: '导航标题不能为空', trigger: 'blur'},
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]">
          <el-input placeholder="请输入导航标题" v-model="carouseForm.title"></el-input>
        </el-form-item>
        <el-form-item label="导航类型" prop="navType" :rules="[
          { required: true, message: '导航类型不能为空', trigger: 'change'}
        ]">
          <el-select v-model="carouseForm.navType" placeholder="请选择导航类型">
            <el-option
              v-for="item in navOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小程序" prop="navType" :rules="[
          { required: true, message: '请选择小程序', trigger: 'change'}
        ]">
          <el-select v-model="carouseForm.miniinfo" placeholder="请选择小程序">
            <el-option
              v-for="item in miniinfoOptions"
              :key="item.appid"
              :label="item.appname"
              :value="item.appid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导航排序" prop="sort" :rules="[
          { required: true, message: '导航排序不能为空', trigger: 'blur'},
          { type: 'number', message: '导航排序必须为数字值', trigger: 'blur'}
        ]">
          <el-input placeholder="请输入导航排序" v-model.number="carouseForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="carouselDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="submitType" @click="carouselSubmit('carouseForm')">确 定</el-button>
        <el-button type="primary" v-else @click="editSubmit('carouseForm')">修 改</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'
  import Sortable from 'sortablejs'
  import { uploadImage, addWdMiniInfo, selectInfoByMid, queryWdMiniMenu, addMiniMenu, deleteWdMiniMenu, updateMiniMenu  } from '../../../api/shop';
  export default {
    data() {
      return {
        uploadimg: uploadImage,
        filters: {
          appid: '',
          title: ''
        },
        addLoading: false,
        listLoading: false,
        users: [],
        page: 1,
        total: 0,
        carouselDialogVisible: false,
        oldList: [],
        newList: [],
        carouseForm: {
          imageCarouselUrl: '',
          url: '',
          title: '',
          navType: '',
          miniinfo: '',
          sort: ''
        },
        navOptions: [{
          value: '0',
          label: '小程序'
        }, {
          value: '1',
          label: 'WEB（1）'
        }, {
          value: '2',
          label: 'WEB（2）'
        }, {
          value: '3',
          label: 'WEB（3）'
        }, {
          value: '4',
          label: 'WEB（4）'
        }, {
          value: '5',
          label: 'WEB（5）'
        }, {
          value: '6',
          label: 'WEB（6）'
        }, {
          value: '7',
          label: 'WEB（7）'
        }, {
          value: '8',
          label: 'WEB（8）'
        }, {
          value: '9',
          label: 'WEB（9）'
        }, {
          value: '10',
          label: 'WEB（10）'
        }],
        miniinfoOptions: [],
        dialogTitle: '新增小程序导航',
        submitType: true,
        order: ''
      }
    },
    methods: {
      sortableChange(sort){
        this.order = sort.order
        this.getUsers()
      },
      formatter_time(row, column){
        return util.formatDate.format(new Date(row.gmt_create), 'yyyy-MM-dd hh:mm:ss')
      },
      handleEdit(index, row){
        this.carouselDialogVisible = true
        this.dialogTitle = '修改小程序导航'
        this.getMiniInfo()
        this.submitType = false
        this.carouseForm.id = row.id
        this.carouseForm.sort = row.sort
        this.carouseForm.imageCarouselUrl = row.menu_ico
        this.carouseForm.url = row.forward_url
        this.carouseForm.title = row.menu_url
        this.carouseForm.navType = String(row.menu_type)
        this.carouseForm.miniinfo = row.appid
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
          deleteWdMiniMenu(para).then(res => {
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
      editSubmit(carouseForm) {
        this.$refs[carouseForm].validate((valid) => {
          if (valid) {
            let para = {
              id: this.carouseForm.id,
              sort: this.carouseForm.sort,
              appid: this.carouseForm.miniinfo,
              menu_ico: this.carouseForm.imageCarouselUrl,
              menu_type: this.carouseForm.navType,
              forward_url: this.carouseForm.url,
              menu_url: this.carouseForm.title
            }
            updateMiniMenu(para).then(res=>{
              if (res.status === 200) {
                this.carouselDialogVisible = false
                this.$refs[carouseForm].resetFields();
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
      carouselSubmit(carouseForm) {
        this.$refs[carouseForm].validate((valid) => {
          if (valid) {
            let para = {
              appid: this.carouseForm.miniinfo,
              sort: this.carouseForm.sort,
              menu_ico: this.carouseForm.imageCarouselUrl,
              menu_type: this.carouseForm.navType,
              forward_url: this.carouseForm.url,
              menu_url: this.carouseForm.title
            }
            addMiniMenu(para).then(res=>{
              if (res.status === 200) {
                this.carouselDialogVisible = false
                this.$refs[carouseForm].resetFields();
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
        this.gerList()
      },
      getUsers() {
        this.page = 1
        this.gerList()
        // this.oldList = this.users.map(function (v) {
        //   return {id:v.id,address:v.address}
        // })
        // this.newList = this.oldList.slice()
        // this.$nextTick(() => {
        //   this.setSort()
        // })
      },
      getMiniInfo(){
        selectInfoByMid().then(res=>{
          if (res.status === 200) {
            this.miniinfoOptions = res.data.miniMenu
          }
        })
      },
      gerList() {
        let para = {
          page: this.page,
          appid: this.filters.appid,
          menu_url: this.filters.title,
          order: this.order
        }
        this.listLoading = true
        queryWdMiniMenu(para).then(res=>{
          this.listLoading = false
          if (res.status ===200) {
            this.users = res.data.miniMenuList
            this.total = res.data.totalCount
          }
        })
      },
      addCarousel() {
        this.carouselDialogVisible = true
        this.dialogTitle = '新增小程序导航'
        this.getMiniInfo()
        this.submitType = true        
        this.carouseForm = {
          imageCarouselUrl: '',
          url: '',
          title: '',
          navType: '',
          miniinfo: ''
        }
      },
      handleAvatarSuccess(res, file) {
        this.carouseForm.imageCarouselUrl = res.data.locationPath;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt1M = file.size / 1024 / 1024 < 1;
        
        if (!isJPG) {
          this.$message.error('上传头像只能是 JPG 或 PNG 格式!');
        }
        if (!isLt1M) {
          this.$message.error('上传头像大小不能超过 1MB!');
        }
        return isJPG && isLt1M;
      },
      // setSort() {
      //   const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      //   this.sortable = Sortable.create(el, {
      //     ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
      //     setData: function (dataTransfer) {
      //       dataTransfer.setData('Text', '')
      //       // to avoid Firefox bug
      //       // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      //     },
      //     onEnd: evt => {
      //       console.log(this.newList);
      //       const targetRow = this.users.splice(evt.oldIndex, 1)[0]
      //       this.users.splice(evt.newIndex, 0, targetRow)
      //       // for show the changes, you can delete in you code
      //       const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
      //       this.newList.splice(evt.newIndex, 0, tempIndex)
      //     }
      //   })
      // }
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
    width: 55px;
    height: 55px;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 55px;
    line-height: 55px;
    text-align: center;
  }

  .avatar {
    width: 55px;
    height: 55px;
  }


  .icon-star {
    margin-right: 2px;
  }

  .drag-handler {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .show-d {
    margin-top: 15px;
  }
  .icon_rank{
    /* font-size: 20px; */
    font-weight: bold;
  }
</style>
<style>
  .sortable-ghost {
    opacity: .8;
    color: #fff !important;
    background: #409EFF !important;
  }

</style>
