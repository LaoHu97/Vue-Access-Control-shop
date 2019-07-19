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
          <el-button type="success" v-on:click="addGoods">新增会员卡</el-button>
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
        <el-table-column prop="status" label="商品状态" :formatter="formatterStatus"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="Y"
                inactive-value="N"
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
    <el-dialog :title="goodsForm.id ? '修改会员卡' : '新增会员卡'" :visible.sync="dialogAddGoodsFormVisible" @close="handleClose('goodsForm')" width="600px">
      <el-form
        :model="goodsForm"
        :rules="goodsFormRules"
        ref="goodsForm"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="选择会员卡" prop="card_id">
          <el-select
            v-model="goodsForm.card_id"
            :multiple="false"
            filterable
            remote
            :remote-method="remoteCoupon"
            :loading="couponSearchLoading"
            clearable
            @focus="clickCoupon"
            @change="selectChange"
          >
            <el-option
              v-for="item in optionsCoupon"
              :key="item.id"
              :value="item.wxcard_id"
              :label="item.title"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="product_name">
          <el-input v-model="goodsForm.product_name" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="会员卡缩略图" prop="small_url">
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
        <el-form-item label="会员卡类型" prop="is_buy">
          <el-radio v-model="goodsForm.is_buy" label="N">免费卡</el-radio>
          <el-radio v-model="goodsForm.is_buy" label="Y">付费卡</el-radio>
        </el-form-item>
        <el-form-item label="购买说明" prop="depict">
          <el-input v-model="goodsForm.depict" placeholder="购买说明"></el-input>
        </el-form-item>
        <el-form-item label="原价" prop="o_price" v-if="goodsForm.is_buy === 'Y'">
          <el-input-number
            :controls="false"
            :min="0"
            :precision="2"
            v-model="goodsForm.o_price"
            label="原价"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="现价" prop="n_price" v-if="goodsForm.is_buy === 'Y'">
          <el-input-number
            :controls="false"
            :min="0"
            :precision="2"
            v-model="goodsForm.n_price"
            label="现价"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="会员价" prop="v_price" v-if="goodsForm.is_buy === 'Y'">
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
        <el-form-item label="开卡有礼规则" prop="pay_rule_id" v-if="goodsForm.is_buy === 'Y'">
          <el-select v-model="goodsForm.pay_rule_id" placeholder="请选择">
            <el-option
              v-for="item in optionsPayRule"
              :key="item.id"
              :label="item.rule_name"
              :value="item.id">
            </el-option>
          </el-select>
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
  queryWdCardGoodsList,
  uploadAgentImage,
  selectReceiveCardAcList,
  selectMemberCard,
  addWdCardGoods,
  updateWdCardGoods,
  updateReceiveCardAcStatus
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
        card_id: "",
        product_name: "",
        small_url: "",
        o_price: "",
        n_price: "",
        v_price: "",
        stock: "",
        is_buy: "Y",
        depict: "",
        pay_rule_id: ""
      },
      optionsCoupon: [],
      optionsPayRule: [],
      couponSearchLoading: false,
      goodsFormRules: {
        card_id: [{ required: true, message: "请选择卡券", trigger: "change" }],
        product_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        small_url: [
          { required: true, message: "请上传图片", trigger: "change" }
        ],
        is_buy: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        depict: [{ required: true, message: "请输入", trigger: "blur" }],
        o_price: [{ required: true, message: "请输入原价", trigger: "blur" }],
        n_price: [{ required: true, message: "请输入现价", trigger: "blur" }],
        v_price: [{ required: true, message: "请输入会员价", trigger: "blur" }],
        stock: [{ required: true, message: "请输入库存", trigger: "blur" }]
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
    formatterStatus: function(row) {
      return row.status === "Y" ? "启用" : row.status === "N" ? "未启用" : "未知";
    },
    handleEditor(index, row) {
      this.dialogAddGoodsFormVisible = true
      this.$nextTick(() => {
        this.goodsForm.id = row.id
        this.goodsForm.card_id = row.card_id
        this.clickCoupon()
        this.goodsForm.product_name = row.product_name
        this.goodsForm.small_url = row.small_url
        this.goodsForm.o_price = row.o_price
        this.goodsForm.n_price = row.n_price
        this.goodsForm.v_price = row.v_price
        this.goodsForm.stock = row.stock
        this.goodsForm.depict = row.depict
        this.goodsForm.pay_rule_id = row.payRuleId
        this.selectChange(row.card_id)
        this.goodsForm.is_buy = row.isBuy
      })
    },
    selectChange(e){
      let para = {
        wx_card_id: e
      }
      selectReceiveCardAcList(para).then(res => {
        this.optionsPayRule = res.data.receiveActivity
      })
    },
    handleClose(formName){
      this.$refs[formName].resetFields();
    },
    switchChange(e){
      let para = {
        id: e.id,
        status: e.status
      }
      updateWdCardGoods(para).then(res => {
        this.getUsers()
      })
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
          if (para.id) {
            updateWdCardGoods(para).then(res => {
              this.dialogAddGoodsFormVisible = false;
              this.getUsers()
            });
          }else{
            addWdCardGoods(para).then(res => {
              this.dialogAddGoodsFormVisible = false;
              this.getUsers()
            });
          }
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
        title: ""
      };
      selectMemberCard(para).then(res => {
        this.couponSearchLoading = false;
        this.optionsCoupon = res.data.memCardList;
      });
    },
    remoteCoupon(query) {
      if (query !== "") {
        this.couponSearchLoading = true;
        setTimeout(() => {
          this.couponSearchLoading = false;
          let para = {
            title: query
          };
          selectMemberCard(para).then(res => {
            this.optionsCoupon = res.data.memCardList;
          });
        }, 200);
      } else {
        this.optionsCoupon = [];
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
      queryWdCardGoodsList(para).then(res => {
        this.listLoading = false;
        this.users = res.data.wCardGoodsList;
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
