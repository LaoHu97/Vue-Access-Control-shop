<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="商品名称">
          <el-input v-model="filters.name" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
          <el-button type="success" v-on:click="addGoods">新增商品</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="product_name" label="商品名称"></el-table-column>
        <el-table-column prop="depict" label="商品描述"></el-table-column>
        <el-table-column prop="n_price" label="现价(￥)"></el-table-column>
        <el-table-column prop="o_price" label="原价(￥)"></el-table-column>
        <el-table-column prop="v_price" label="会员价(￥)"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="Y"
                inactive-value="N"
                active-text="上架"
                inactive-text="下架"
                @change="switchChange(scope.row)">
              </el-switch>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="140">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleEditor(scope.$index, scope.row)">修改</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="goodsForm.id ? '修改商品' : '新增商品'" :visible.sync="dialogAddGoodsFormVisible" @close="onChangeClose('goodsForm')" width="600px">
      <el-form
        :model="goodsForm"
        :rules="goodsFormRules"
        ref="goodsForm"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="所属门店" prop="sid">
          <el-select
            v-model="goodsForm.sid"
            placeholder="门店名称"
            :multiple="false"
            filterable
            remote
            :remote-method="remoteStore"
            :loading="searchLoading"
            clearable
            @focus="clickStore"
          >
            <el-option
              v-for="item in optionsStore"
              :key="item.id"
              :value="item.id"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="card_id">
          <el-select
            v-model="goodsForm.card_id"
            :multiple="false"
            filterable
            remote
            :remote-method="remoteCoupon"
            :loading="couponSearchLoading"
            clearable
            @focus="clickCoupon"
          >
            <el-option
              v-for="item in optionsCoupon"
              :key="item.card_id"
              :value="item.card_id"
              :label="item.title"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缩略图" prop="small_url">
          <el-upload
            class="avatar-uploader"
            :action="uploadAgentImage"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="goodsForm.small_url" :src="goodsForm.small_url" class="avatar" />
            <i v-else class="el-icon-plus mini-avatar-uploader"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="原图" prop="pic_url">
          <el-upload
            class="upload_view"
            :action="uploadAgentImage"
            list-type="picture-card"
            :file-list="goodsForm.pic_url"
            :on-success="uploadTopImgSuccess"
            :before-upload="beforeAvatarUpload"
            :on-remove="imgTopRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="原价" prop="o_price">
          <el-input-number
            :controls="false"
            :min="0"
            :precision="2"
            v-model="goodsForm.o_price"
            label="原价"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="现价" prop="n_price">
          <el-input-number
            :controls="false"
            :min="0"
            :precision="2"
            v-model="goodsForm.n_price"
            label="现价"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="会员价" prop="v_price">
          <el-input-number
            :controls="false"
            :min="0"
            :precision="2"
            v-model="goodsForm.v_price"
            label="会员价"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="goodsForm.stock" placeholder="库存"></el-input>
        </el-form-item>
        <el-form-item label="显示销售量" prop="base_count">
          <el-input v-model="goodsForm.base_count" placeholder="显示销售量"></el-input>
        </el-form-item>
        <el-form-item label="日期时间" prop="dateTimes">
          <el-date-picker
            v-model="goodsForm.dateTimes"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            :default-time="['00:00:00', '00:00:00']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="商品描述" prop="depict">
          <el-input v-model="goodsForm.depict" placeholder="商品描述"></el-input>
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
  updateProductNew,
  uploadAgentImage,
  queryCouponListNew,
  updateMallProductStatus
} from "../../../api/shop";
export default {
  data() {
    return {
      uploadAgentImage: uploadAgentImage,
      filters: {
        appid: "",
        title: ""
      },
      listLoading: false,
      users: [],
      pageNum: 1,
      total: 0,

      dialogAddGoodsFormVisible: false,
      goodsForm: {
        sid: "",
        card_id: "",
        small_url: "",
        pic_url: [],
        o_price: "",
        n_price: "",
        v_price: "",
        stock: "",
        base_count: "",
        dateTimes: "",
        depict: ""
      },
      searchLoading: false,
      optionsStore: [],
      optionsCoupon: [],
      couponSearchLoading: false,
      goodsFormRules: {
        sid: [{ required: true, message: "请选择门店", trigger: "change" }],
        card_id: [{ required: true, message: "请选择卡券", trigger: "change" }],
        small_url: [
          { required: true, message: "请上传图片", trigger: "change" }
        ],
        pic_url: [
          {
            type: "array",
            required: true,
            message: "请上传图片",
            trigger: "change"
          }
        ],
        o_price: [{ required: true, message: "请输入原价", trigger: "blur" }],
        n_price: [{ required: true, message: "请输入现价", trigger: "blur" }],
        v_price: [{ required: true, message: "请输入会员价", trigger: "blur" }],
        stock: [{ required: true, message: "请输入库存", trigger: "blur" }],
        base_count: [
          { required: true, message: "请输入显示销量", trigger: "blur" }
        ],
        dateTimes: [
          {
            type: "array",
            required: true,
            message: "请选择日期时间",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    formatter_time(row, column) {
      return util.formatDate.format(
        new Date(row.creatTime),
        "yyyy-MM-dd hh:mm:ss"
      );
    },
    onChangeClose(formName) {
      this.$refs[formName].resetFields()
    },
    handleEditor(index, row) {
      this.dialogAddGoodsFormVisible = true
      this.$nextTick(() => {
        this.goodsForm.id = row.id
        this.goodsForm.sid = row.sid
        this.optionsStore = [{id: row.sid, value: row.store_name}]
        this.goodsForm.card_id = row.card_id
        this.optionsCoupon = [{card_id: row.card_id, title: row.product_name}]
        this.goodsForm.small_url = row.small_url
        let pic_url = []
        JSON.parse(row.pic_url).map(data => {
          pic_url.push({name: data, url: data, response:{data: {locationPath: data}}})
        })
        this.goodsForm.pic_url = pic_url
        this.goodsForm.o_price = row.o_price
        this.goodsForm.n_price = row.n_price
        this.goodsForm.v_price = row.v_price
        this.goodsForm.stock = row.stock
        this.goodsForm.base_count = row.base_count
        this.goodsForm.dateTimes = new Array(row.start_time, row.end_time)
        this.goodsForm.depict = row.depict
      })
    },
    switchChange(e){
      let para = {
        id: e.id,
        status: e.status
      }
      updateMallProductStatus(para).then(res => {
        this.getUsers()
      })
    },
    imgTopRemove(file, fileList) {
      let removeImg = file.response.data.locationPath;
      let previewImg = this.goodsForm.pic_url;
      let newArray = [];
      previewImg.map((data, index) => {
        if (data !== removeImg && data.name !== removeImg) {
          newArray.push(data);
        }
        return;
      });
      this.goodsForm.pic_url = newArray;
    },
    uploadTopImgSuccess(res, file) {
      if (res.status === 200) {
        this.goodsForm.pic_url.push(res.data.locationPath);
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.status === 200) {
        this.goodsForm.small_url = res.data.locationPath;
      }
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
    submiltGoods(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = util.deepcopy(this.goodsForm);
          if (!para.id) {
            delete para.id
          }
          updateProductNew(para).then(res => {
            this.dialogAddGoodsFormVisible = false;
            this.getUsers()
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //款台远程搜索
    clickCoupon: function() {
      this.couponSearchLoading = true;
      let para = {
        title: "",
        pagNum: 1
      };
      queryCouponListNew(para).then(res => {
        this.couponSearchLoading = false;
        this.optionsCoupon = res.data.couponList;
      });
    },
    remoteCoupon(query) {
      if (query !== "") {
        this.couponSearchLoading = true;
        setTimeout(() => {
          this.couponSearchLoading = false;
          let para = {
            title: query,
            pagNum: 1
          };
          queryCouponListNew(para).then(res => {
            this.optionsCoupon = res.data.couponList;
          });
        }, 200);
      } else {
        this.optionsCoupon = [];
      }
    },
    clickStore: function() {
      this.searchLoading = true;
      selectStoreListNew({
        sname: ""
      }).then(res => {
        this.searchLoading = false;
        let { status, data } = res;
        this.optionsStore = data.storeList;
      });
    },
    remoteStore(query) {
      if (query !== "") {
        this.searchLoading = true;
        setTimeout(() => {
          this.searchLoading = false;
          selectStoreListNew({
            sname: query
          }).then(res => {
            let { status, data } = res;
            this.optionsStore = data.storeList;
          });
        }, 200);
      } else {
        this.optionsStore = [];
      }
    },
    addGoods() {
      this.dialogAddGoodsFormVisible = true;
      if (this.goodsForm.id) {
        delete this.goodsForm.id
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
          deleteWdMiniMenu(para).then(res => {
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
        pageNum: this.pageNum
      };
      this.listLoading = true;
      queryMiniProductList(para).then(res => {
        this.listLoading = false;
        this.users = res.data.queryMiniProductList;
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
