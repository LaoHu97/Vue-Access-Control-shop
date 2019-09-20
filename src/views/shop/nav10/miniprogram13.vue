<style scoped>
.grid-content{
  font-size: 18px;
  text-align: center;
}
</style>
<template>
  <section>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in roomCount" :key="index">
        <div class="grid-content">
          <div><el-tag>{{item.name}}</el-tag></div>
          <div>已用{{item.total - item.unUse}}</div>
          <div>总数{{item.total}}</div>
        </div>
      </el-col>
    </el-row>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="roomType.roomType" label="房间类型"></el-table-column>
        <el-table-column prop="roomNumber" label="房间号"></el-table-column>
        <el-table-column prop="status" label="房间状态"></el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="bindRoomManage(scope.$index, scope.row)"
            >绑定管理员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="绑定管理员" :visible.sync="dialogAddGoodsFormVisible" width="450px">
      <el-form
        :model="goodsForm"
        :rules="goodsFormRules"
        ref="goodsForm"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="管理员" prop="roomId">
          <el-select v-model="goodsForm.roomId" placeholder="请选择">
            <el-option
              v-for="item in roomManageOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间号" prop="roomNumber">
          <el-input v-model="goodsForm.roomNumber" placeholder="房间号"></el-input>
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
import { getRoomManage, saveRoomManage } from "../../../api/shop";
export default {
  data() {
    return {
      filters: {
        title: ""
      },
      listLoading: false,
      users: [],
      roomCount: [],
      pageNum: 1,
      total: 0,

      dialogAddGoodsFormVisible: false,
      goodsForm: {
        id: "",
        roomId: "",
        roomNumber: ""
      },
      goodsFormRules: {
        roomId: [
          {
            required: false,
            message: "请选择管理员",
            trigger: "change"
          }
        ]
      },
      roomManageOptions: []
    };
  },
  methods: {
    bindRoomManage(index, row) {
      this.dialogAddGoodsFormVisible = true;
      this.$nextTick(() => {
        this.goodsForm.id = row.id;
      });
    },
    submiltGoods(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = util.deepcopy(this.goodsForm);
          saveRoomManage(para).then(res => {
            this.dialogAddGoodsFormVisible = false;
            this.getUsers()
          })
        } else {
          console.log("error submit!!");
          return false;
        }
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
        pageSize: 20
      };
      this.listLoading = true;
      getRoomManage(para).then(res => {
        this.listLoading = false;
        this.users = res.data.roomList;
        this.roomCount = res.data.roomCount
        this.total = res.data.total;
        this.roomManageOptions = res.data.employeeList;
      });
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>
