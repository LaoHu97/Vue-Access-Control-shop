<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item style="float:right">
          <el-button type="primary" @click="getUsers" round>查询</el-button>
          <el-button type="primary" @click="addLevel" round>新增等级</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="level_name" label="等级名称"></el-table-column>
        <el-table-column prop="discount" label="折扣"></el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="editLevel(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="removeLevel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新增等级"
      :visible.sync="levelDialogFormVisible"
      width="620px"
      @close="dialogClose('levelForm')"
    >
      <el-form
        :model="levelForm"
        :rules="levelFormRules"
        ref="levelForm"
        label-position="left"
        label-width="120px"
        size="medium"
      >
        <el-form-item label="等级名称" prop="level_name">
          <el-input v-model="levelForm.level_name" placeholder="请输入等级名称"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-select v-model="levelForm.level" placeholder="请选择等级">
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣" prop="discount">
          <el-input-number
            v-model="levelForm.discount"
            :min="1"
            :max="10"
            :precision="1"
            :controls="false"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="描述" prop="comments">
          <el-input v-model="levelForm.comments" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="levelDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submlitLevel('levelForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination
        layout="prev, pager, next"
        :current-page="page"
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
//
import {
  queryWdCardLevel,
  insertWdCardLevel,
  updateWdCardLevel,
  deleteWdCardLevelByPK
} from "../../../api/shop";
export default {
  data() {
    return {
      filters: {},

      levelOptions: [
        {
          value: "lv1",
          label: "最低等级"
        },
        {
          value: "lv2",
          label: "二级"
        },
        {
          value: "lv3",
          label: "三级"
        },
        {
          value: "lv4",
          label: "四级"
        },
        {
          value: "lv5",
          label: "五级"
        },
        {
          value: "lv6",
          label: "六级"
        },
        {
          value: "lv7",
          label: "七级"
        },
        {
          value: "lv8",
          label: "八级"
        },
        {
          value: "lv9",
          label: "九级"
        },
        {
          value: "lv10",
          label: "最高等级"
        }
      ],
      levelDialogFormVisible: false,
      levelForm: {
        level: "",
        level_name: "",
        comments: "",
        discount: ""
      },
      levelFormRules: {
        level_name: [
          { required: true, message: "请输入等级名称", trigger: "blur" }
        ],
        discount: [{ required: true, message: "请输入折扣", trigger: "blur" }],
        level: [{ required: true, message: "请选择等级", trigger: "change" }]
      },

      users: [],
      total: 0,
      page: 1,
      listLoading: false
    };
  },
  methods: {
    dialogClose(formName) {
      this.levelForm = {
        level: "",
        level_name: "",
        comments: "",
        discount: ""
      };
    },
    removeLevel(index, row) {
      this.$confirm("此操作将删除该等级, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteWdCardLevelByPK({id: row.id}).then(res => {
            this.getUsers();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submlitLevel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = util.deepcopy(this.levelForm);
          para.card_id = this.$route.query.id;
          if (para.id) {
            updateWdCardLevel(para).then(res => {
              this.levelDialogFormVisible = false;
              this.getUsers();
              this.$message({
                message: "修改成功",
                type: "success"
              });
            });
          } else {
            insertWdCardLevel(para).then(res => {
              this.levelDialogFormVisible = false;
              this.getUsers();
              this.$message({
                message: "添加成功",
                type: "success"
              });
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editLevel(index, row) {
      this.levelDialogFormVisible = true;
      this.$nextTick(() => {
        this.levelForm.id = row.id;
        this.levelForm.level = row.level;
        this.levelForm.level_name = row.level_name;
        this.levelForm.comments = row.comments;
        this.levelForm.discount = row.discount;
      });
    },
    addLevel() {
      this.levelDialogFormVisible = true;
    },

    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    getUsers() {
      this.page = 1;
      this.getList();
    },
    //获取用户列表
    getList() {
      let para = {
        pagNum: this.page,
        card_id: this.$route.query.id
      };
      this.listLoading = true;
      queryWdCardLevel(para).then(res => {
        this.total = res.data.total;
        this.users = res.data.wdCardLevelList;
        this.listLoading = false;
      });
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style scoped>
</style>
