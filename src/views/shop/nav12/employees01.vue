<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item label="爆款名称">
          <el-input v-model="filters.title" placeholder="爆款名称"></el-input>
        </el-form-item>-->
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
          <el-button type="success" v-on:click="addGoods">新增店员</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="sex" label="性别" :formatter="formatterSex"></el-table-column>
        <el-table-column prop="staffWork" label="职位"></el-table-column>
        <el-table-column prop="tel" label="联系方式"></el-table-column>
        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleEditor(scope.$index, scope.row)">修改店员</el-button>
            <el-button size="mini" type="danger" @click="handleRemove(scope.$index, scope.row)">删除店员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="goodsForm.id ? '修改店员' : '新增店员'"
      :visible.sync="dialogAddGoodsFormVisible"
      width="450px"
    >
      <el-form
        :model="goodsForm"
        :rules="goodsFormRules"
        ref="goodsForm"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="goodsForm.name" placeholder="员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="staffWork">
          <el-input v-model="goodsForm.staffWork" placeholder="职位"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input v-model="goodsForm.tel" placeholder="联系方式"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="goodsForm.sex" label="1">男</el-radio>
          <el-radio v-model="goodsForm.sex" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="goodsForm.idCard" placeholder="身份证号"></el-input>
        </el-form-item>
        <el-form-item label="门店" prop="sid">
          <el-select v-model="goodsForm.sid" placeholder="请选择">
            <el-option
              v-for="item in allStoreOptions"
              :key="item.id"
              :label="item.storeName"
              :value="item.id"
            ></el-option>
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
  selectEmployeeList,
  selectEmployeeadd,
  getAllStoreByMid,
  selectEmployeeupdate,
  selectEmployeedelete
} from "../../../api/shop";
export default {
  data() {
    return {
      filters: {
        title: ""
      },
      listLoading: false,
      users: [],
      pageNum: 1,
      total: 0,

      dialogAddGoodsFormVisible: false,
      goodsForm: {
        name: "",
        staffWork: "",
        tel: "",
        sex: "",
        idCard: "",
        sid: ""
      },
      goodsFormRules: {},
      allStoreOptions: []
    };
  },
  methods: {
    formatterSex(row, column){
      return row.sex === '1' ? '男' : row.sex === '2' ? '女' : '未知'
    },
    handleRemove(index, row) {
      this.$confirm("此操作将删除店员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          selectEmployeedelete({id: row.id}).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getUsers();
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleEditor(index, row) {
      this.dialogAddGoodsFormVisible = true;
      this.$nextTick(() => {
        this.goodsForm.id = row.id;
        this.goodsForm.name = row.name;
        this.goodsForm.staffWork = row.staffWork;
        this.goodsForm.tel = row.tel;
        this.goodsForm.sex = row.sex;
        this.goodsForm.idCard = row.idCard;
        this.goodsForm.sid = row.sid;
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
            selectEmployeeupdate(para).then(res => {
              this.dialogAddGoodsFormVisible = false;
              this.getUsers();
            });
          } else {
            selectEmployeeadd(para).then(res => {
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
    getAllStore() {
      getAllStoreByMid().then(res => {
        this.allStoreOptions = res.data.storeList;
      });
    },
    addGoods() {
      this.dialogAddGoodsFormVisible = true;
      if (this.goodsForm.id) {
        delete this.goodsForm.id;
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
        pageSize: 20
      };
      this.listLoading = true;
      selectEmployeeList(para).then(res => {
        this.listLoading = false;
        this.users = res.data.queryEmployeeList;
        this.total = res.data.total;
      });
    }
  },
  mounted() {
    this.getUsers();
    this.getAllStore();
  }
};
</script>
