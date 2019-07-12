<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="商品名称">
          <el-input v-model="filters.keyWords" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
          <el-button type="success" v-on:click="addGoods">新增活动</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="productName" label="活动名称"></el-table-column>
        <el-table-column prop="share_title" label="活动标题"></el-table-column>
        <el-table-column prop="limitNum" label="限制人数"></el-table-column>
        <el-table-column label="活动时间" :formatter="dateTimeFormatter"></el-table-column>
        <el-table-column label="活动状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="Y"
              inactive-value="N"
              active-text="上架"
              inactive-text="下架"
              @change="switchChange(scope.row)"
            ></el-switch>
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
    <el-dialog
      :title="goodsForm.id ? '修改活动' : '新增活动'"
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
        <el-form-item label="选择商品" prop="sid">
          <el-select
            v-model="goodsForm.productId"
            placeholder="选择商品"
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
              :label="item.product_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="share_info">
          <el-input v-model="goodsForm.share_info" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="限制人数" prop="limitNum">
          <el-input-number
            :controls="false"
            :min="2"
            :precision="0"
            v-model="goodsForm.limitNum"
            label="限制人数"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="活动标题" prop="share_title">
          <el-input v-model="goodsForm.share_title" placeholder="活动标题"></el-input>
        </el-form-item>
        <el-form-item label="拼团价格" prop="wssemblePrice">
          <el-input-number
            :controls="false"
            :min="0"
            :precision="2"
            v-model="goodsForm.wssemblePrice"
            label="拼团价格"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="日期时间" prop="dateTimes">
          <el-date-picker
            v-model="goodsForm.dateTimes"
            type="datetimerange"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
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
  queryMiniProductNameList
} from "../../../api/shop";
export default {
  data() {
    return {
      uploadAgentImage: uploadAgentImage,
      filters: {
        keyWords: ""
      },
      listLoading: false,
      users: [],
      pageNum: 1,
      total: 0,

      dialogAddGoodsFormVisible: false,
      goodsForm: {
        productId: "",
        share_info: "",
        limitNum: "",
        share_title: "",
        wssemblePrice: "",
        dateTimes: ""
      },
      searchLoading: false,
      optionsStore: [],
      goodsFormRules: {
        productId: [
          { required: true, message: "请选择门店", trigger: "change" }
        ],
        dateTimes: [
          {
            type: "array",
            required: true,
            message: "请选择日期时间",
            trigger: "change"
          }
        ]
      },
      pickerOptions: {
        disabledDate: time =>  {
          if (!this.goodsForm.productId) {
            return 
          }
          let arr = this.optionsStore.find(res => {
            return res.id == this.goodsForm.productId
          })
          return time.getTime() <= arr.start_time || time.getTime() >= arr.end_time
        }
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
    dateTimeFormatter(row, column) {
      let begin_time = util.formatDate.format(
        new Date(row.startTime),
        "yyyy/MM/dd"
      );
      let end_time = util.formatDate.format(
        new Date(row.endTime),
        "yyyy/MM/dd"
      );
      return `${begin_time} 至 ${end_time}`;
    },
    handleEditor(index, row) {
      this.dialogAddGoodsFormVisible = true;
      this.$nextTick(() => {
        this.goodsForm.id = row.id;
        this.goodsForm.productId = row.productId;
        this.goodsForm.share_info = row.share_info
        this.goodsForm.limitNum = row.limitNum
        this.goodsForm.share_title = row.share_title
        this.goodsForm.wssemblePrice = row.wssemblePrice
        this.optionsStore = [{ id: row.productId, product_name: row.productName }];
        this.goodsForm.dateTimes = new Array(row.startTime, row.endTime);
      });
    },
    switchChange(e) {
      let para = {
        id: e.id,
        status: e.status
      };
      modifyActivityStatus(para).then(res => {
        this.getUsers();
      });
    },
    submiltGoods(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = util.deepcopy(this.goodsForm);
          if (!para.id) {
            delete para.id;
          }
          insertOrSave(para).then(res => {
            this.dialogAddGoodsFormVisible = false;
            this.getUsers();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clickStore: function() {
      this.searchLoading = true;
      queryMiniProductNameList({
        productName: ""
      }).then(res => {
        this.searchLoading = false;
        this.optionsStore = res.data.queryMiniProductList;
      });
    },
    remoteStore(query) {
      if (query !== "") {
        this.searchLoading = true;
        setTimeout(() => {
          this.searchLoading = false;
          queryMiniProductNameList({
            productName: query
          }).then(res => {
            this.optionsStore = res.data.queryMiniProductList;
          });
        }, 200);
      } else {
        this.optionsStore = [];
      }
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
        pageNum: this.pageNum,
        pageSize: 10
      };
      this.listLoading = true;
      queryActivityProduct(para).then(res => {
        this.listLoading = false;
        this.users = res.data.queryActivityProductList;
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
