<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="爆款名称">
          <el-input v-model="filters.title" placeholder="爆款名称"></el-input>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
          <el-button type="success" v-on:click="addGoods">新增爆款活动</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="title" label="爆款名称"></el-table-column>
        <el-table-column prop="pro_desc" label="爆款描述"></el-table-column>
        <el-table-column prop="url" label="链接地址"></el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleEditor(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="goodsForm.id ? '修改爆款活动' : '新增爆款活动'"
      :visible.sync="dialogAddGoodsFormVisible"
      width="600px"
    >
      <el-form
        :model="goodsForm"
        :rules="goodsFormRules"
        ref="goodsForm"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="爆款活动名称" prop="title">
          <el-input v-model="goodsForm.title" placeholder="爆款活动名称"></el-input>
        </el-form-item>
        <el-form-item label="爆款活动描述" prop="pro_desc">
          <el-input v-model="goodsForm.pro_desc" placeholder="爆款活动描述"></el-input>
        </el-form-item>
        <el-form-item label="爆款活动图片" prop="small_img">
          <el-upload
            class="avatar-uploader"
            :action="uploadAgentImage"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="goodsForm.small_img" :src="goodsForm.small_img" class="avatar" />
            <i v-else class="el-icon-plus mini-avatar-uploader"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接类型" prop="url_type">
          <!-- <el-radio v-model="goodsForm.url_type" label="IN">webView链接</el-radio> -->
          <el-radio v-model="goodsForm.url_type" label="OUT">内链</el-radio>
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="goodsForm.url" placeholder="链接地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddGoodsFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submiltGoods('goodsForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination
        layout="prev, pager, next"
        :current-page="pageNum"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        background
        style="text-align:center;background:#fff;padding:15px;"
      ></el-pagination>
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  queryMiniProductList,
  selectStoreListNew,
  insertOrSave,
  uploadAgentImage,
  queryCouponListNew,
  updateMallProductStatus,
  queryActivityProduct,
  modifyActivityStatus,
  queryMiniProductNameList,
  queryWellProduce,
  insertWellProduce,
  updateWellProduce,
  deleteWellProduce
} from "../../../api/shop";
export default {
  data() {
    return {
      uploadAgentImage: uploadAgentImage,
      filters: {
        title: ""
      },
      listLoading: false,
      users: [],
      pageNum: 1,
      total: 0,

      dialogAddGoodsFormVisible: false,
      goodsForm: {
        title: '',
        pro_desc: '',
        small_img: '',
        url_type: '',
        url: ''
      },
      goodsFormRules: {

      },
    };
  },
  methods: {
    handleEditor(index, row) {
      this.dialogAddGoodsFormVisible = true;
      this.$nextTick(() => {
        this.goodsForm.id = row.id;
        this.goodsForm.title = row.title;
        this.goodsForm.pro_desc = row.pro_desc;
        this.goodsForm.small_img = row.small_img;
        this.goodsForm.url_type = row.url_type;
        this.goodsForm.url = row.url;
      });
    },
    submiltGoods(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = util.deepcopy(this.goodsForm);
          if (!para.id) {
            delete para.id;
          }
          if (para.id) {
            updateWellProduce(para).then(res => {
              this.dialogAddGoodsFormVisible = false;
              this.getUsers();
            });
          }else{
            insertWellProduce(para).then(res => {
              this.dialogAddGoodsFormVisible = false;
              this.getUsers();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addGoods() {
      this.dialogAddGoodsFormVisible = true;
      if (this.goodsForm.id) {
        delete this.goodsForm.id;
      }
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = {
            id: row.id
          };
          deleteWellProduce(para).then(res => {
            if (res.status === 200) {
              this.getUsers();
              this.$message({
                message: res.message,
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      if (res.status === 200) {
        this.goodsForm.small_img = res.data.locationPath;
      }
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.gerList();
    },
    getUsers() {
      this.pageNum = 1;
      this.gerList();
    },
    gerList() {
      let para = {
        pageNum: this.pageNum,
        pageSize: 20,
        title: this.filters.title
      };
      this.listLoading = true;
      queryWellProduce(para).then(res => {
        this.listLoading = false;
        this.users = res.data.sellWellProductList;
        this.total = res.data.total;
      });
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.mini-avatar-uploader {
  font-size: 28px;
  color: #8c939d;
  width: 146px;
  height: 146px;
  line-height: 146px;
  text-align: center;
}
.avatar {
  width: 146px;
  height: 146px;
  display: block;
}
</style>
