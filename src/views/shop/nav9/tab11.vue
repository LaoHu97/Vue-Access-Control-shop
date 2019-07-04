<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="handleAdd">添加设置</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <div v-loading="listLoading">
    <el-table border :data="users" highlight-current-row style="width: 100%;">
      <el-table-column prop="min_price" label="充值下限(元)">
      </el-table-column>
      <el-table-column prop="max_price" label="充值上限(元)">
      </el-table-column>
      <el-table-column prop="donate_price" label="赠送金额(元)">
      </el-table-column>
      <el-table-column prop="is_open" label="是否启用">
        <template slot-scope="scope">
              <el-switch
                name="value"
                @change="test(scope.$index, scope.row)"
                v-model="scope.row.is_open">
              </el-switch>
            </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
      </el-table-column>
    </el-table>
  </div>

  <!--编辑界面-->
  <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="600px">
    <div class="dialog_title">
      <span>注意：设置充值区间请不要重叠，以免出现赠送金额不准确。赠送公式为：<br />最小充值---(大于)--->赠送金额---(小于或者等于)---最大充值金额</span>
    </div>
    <el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
      <el-form-item label="充值金额" required>
        <el-col :span="11">
          <el-form-item prop="minPrice">
            <el-input v-model.number="editForm.minPrice" placeholder="最小充值"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="maxPrice">
            <el-input v-model.number="editForm.maxPrice" placeholder="最大充值"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="赠送金额" prop="donatePrice">
        <el-col :span="12">
          <el-input v-model.number="editForm.donatePrice" placeholder="赠送金额"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="赠送说明">
        <el-input type="textarea" v-model="editForm.des" placeholder="赠送说明"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog>

  <!--新增界面-->
  <el-dialog title="充值赠送" :visible.sync="addFormVisible" :close-on-click-modal="false" width="600px">
    <div class="dialog_title">
      <span>注意：设置充值区间请不要重叠，以免出现赠送金额不准确。赠送公式为：<br />最小充值---(大于)--->赠送金额---(小于或者等于)---最大充值金额</span>
    </div>
    <el-form :model="addForm" label-width="90px" :rules="addFormRules" ref="addForm">
      <el-form-item label="充值金额" required>
        <el-col :span="11">
          <el-form-item prop="minPrice">
            <el-input v-model.number="addForm.minPrice" placeholder="最小充值"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="maxPrice">
            <el-input v-model.number="addForm.maxPrice" placeholder="最大充值"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="赠送金额" prop="donatePrice">
        <el-col :span="12">
          <el-input v-model.number="addForm.donatePrice" placeholder="赠送金额"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="赠送说明">
        <el-input type="textarea" v-model="addForm.des" placeholder="赠送说明"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
    </div>
  </el-dialog>
</section>
</template>

<script>
import * as util from '../../../util/util.js'
//
import {
  insertDepositRule,
  getDepositRule,
  updateDepositStatus,
  updateDepositRule
} from '../../../api/shop';
export default {
  data() {
    return {
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        minPrice: [{
            required: true,
            message: '请输入充值金额'
          },
          {
            type: 'number',
            message: '金额必须为数字'
          }
        ],
        maxPrice: [{
            required: true,
            message: '请输入充值金额'
          },
          {
            type: 'number',
            message: '金额必须为数字'
          }
        ],
        donatePrice: [{
            required: true,
            message: '请输入赠送金额'
          },
          {
            type: 'number',
            message: '金额必须为数字'
          }
        ]
      },
      //编辑界面数据
      editForm: {
        id: '',
        minPrice: '',
        maxPrice: '',
        donatePrice: '',
        des: ''
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        minPrice: [{
            required: true,
            message: '请输入金额'
          },
          {
            type: 'number',
            message: '金额必须为数字'
          }
        ],
        maxPrice: [{
            required: true,
            message: '请输入充值金额'
          },
          {
            type: 'number',
            message: '金额必须为数字'
          }
        ],
        donatePrice: [{
            required: true,
            message: '请输入赠送金额'
          },
          {
            type: 'number',
            message: '金额必须为数字'
          }
        ]
      },
      //新增界面数据
      addForm: {
        minPrice: '',
        maxPrice: '',
        donatePrice: '',
        des: ''
      }
    }
  },
  methods: {
    test: function(index, row) {
      this.$confirm('此操作将修改门店状态, 确定修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        let para = {
          id: String(row.id),
          status: row.is_open == true ? "Y" : row.is_open == false ? "N" : "未知"
        }
        updateDepositStatus(para).then((res) => {
          let {
            status
          } = res
          if (status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          } else {
            this.$message.error('修改失败');
            this.getUsers();
          }
        })
      }).catch(() => {
        this.getUsers();
        this.$message({
          type: 'info',
          message: '取消修改'
        });
      });
    },
    //获取用户列表
    getUsers() {
      this.listLoading = true;
      //
      let para = {
        status: ''
      }
      getDepositRule(para).then((res) => {
        this.users = res.data.deposiyList;
        this.listLoading = false;
        //
        var sta;
        for (var i = 0; i < this.users.length; i++) {
          sta = this.users[i];
          if (sta.is_open == "Y") {
            sta.is_open = true
          } else {
            sta.is_open = false
          }
        }
      });
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm.id = row.id;
      this.editForm.minPrice = row.min_price;
      this.editForm.maxPrice = row.max_price;
      this.editForm.donatePrice = row.donate_price;
      this.editForm.des = row.des;
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        cardId: JSON.parse(sessionStorage.getItem('wxcard_id')),
        minPrice: '',
        maxPrice: '',
        donatePrice: '',
        des: ''
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            //
            let para = {
              id: String(this.editForm.id),
              minPrice: String(this.editForm.minPrice),
              maxPrice: String(this.editForm.maxPrice),
              donatePrice: String(this.editForm.donatePrice),
              des: this.editForm.des
            };
            updateDepositRule(para).then((res) => {
              this.editLoading = false;
              //
              let {
                status,
                message
              } = res;
              if (status == 200) {
                this.$message({
                  message: message,
                  type: 'success'
                });
                this.editFormVisible = false;
                this.getUsers();
              } else {
                this.$notify.error({
                  message: message
                });
              }
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            //
            let para = {
              cardId: this.addForm.cardId,
              minPrice: String(this.addForm.minPrice),
              maxPrice: String(this.addForm.maxPrice),
              donatePrice: String(this.addForm.donatePrice),
              des: this.addForm.des
            }
            insertDepositRule(para).then((res) => {
              this.addLoading = false;
              //
              let {
                status,
                message
              } = res;
              if (status == 200) {
                this.$message({
                  message: message,
                  type: 'success'
                });
                this.addFormVisible = false;
                this.getUsers();
              } else {
                this.$notify.error({
                  message: message
                });
              }
            });
          });
        }
      });
    }
  },
  mounted() {
    this.getUsers();
  }
}
</script>

<style scoped>
.dialog_title {
  background: #FF4949;
  line-height: 25px;
  font-size: 12px;
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
}
</style>
