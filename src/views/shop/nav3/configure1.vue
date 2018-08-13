<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="filters">
      <el-form-item label="终端名称">
        <el-input v-model="filters.printname" class="fixed_search_input" placeholder="终端名称"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" @click="getUsers" round>查询</el-button>
        <el-button type="primary" @click="handleAdd" round>新增</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <div v-loading="listLoading">
    <el-table :data="users" border highlight-current-row style="width: 100%;">
      <el-table-column prop="printname" label="打印机名称" min-width="120">
      </el-table-column>
      <el-table-column prop="machineCode" label="终端号" min-width="120">
      </el-table-column>
      <el-table-column prop="machineKey" label="终端密钥" min-width="120">
      </el-table-column>
      <el-table-column prop="phone" label="电话" min-width="120">
      </el-table-column>
      <el-table-column prop="pnum" label="打印份数">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
              <el-switch
                name="value"
                @change="test(scope.$index, scope.row)"
                v-model="scope.row.isOpen">
              </el-switch>
            </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="info" size="mini" @click="handleDet(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>


  <!--工具条-->
  <el-row>
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
    </el-pagination>
  </el-row>
  <!--详情界面-->
  <el-dialog title="打印详情" :visible.sync="detFormVisible" :close-on-click-modal="false" width="600px">
    <el-form :model="detForm" label-width="" ref="detForm">
      <el-form-item label="打印机名称：">
        <span>{{detForm.printname}}</span>
      </el-form-item>
      <el-form-item label="终端号：">
        <span>{{detForm.machineCode}}</span>
      </el-form-item>
      <el-form-item label="终端密钥：">
        <span>{{detForm.machineKey}}</span>
      </el-form-item>
      <el-form-item label="电话：">
        <span>{{detForm.phone}}</span>
      </el-form-item>
      <el-form-item label="打印份数">
        <span>{{detForm.pnum}}</span>
      </el-form-item>
      <el-form-item label="所属款台：">
        <span>{{detForm.storeName}}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!--修改界面-->
  <el-dialog title="打印配置修改" :visible.sync="editFormVisible" :close-on-click-modal="false" width="600px">
    <el-form :model="editForm" :rules="editFormRules" ref="editForm">
      <el-form-item label="打印机名称" prop="printname">
        <el-input v-model="editForm.printname" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="终端号" prop="machineCode">
        <el-input v-model="editForm.machineCode" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="终端密钥" prop="machineKey">
        <el-input v-model="editForm.machineKey" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="editForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="打印份数" prop="pnum">
        <el-input v-model="editForm.pnum" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="选择款台" prop="value">
        <template>
						<el-select v-model="editForm.value" placeholder="请选择款台">
							<el-option
									v-for="item in querySource"
									:label="item.value"
									:value="item.eid"
                  :key="item.eid">
							</el-option>
						</el-select>
					</template>
      </el-form-item>
      <el-form-item label="打印模板	" prop="pformat">
        <el-input type="textarea" :rows="6" :disabled="true" v-model="editForm.pformat">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog>

  <!--新增界面-->
  <el-dialog title="新增打印机" :visible.sync="addFormVisible" :close-on-click-modal="false" width="600px">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm">
      <el-form-item label="打印机名称" prop="printname">
        <el-input v-model="addForm.printname" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="终端号" prop="machineCode">
        <el-input v-model="addForm.machineCode" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="终端密钥" prop="machineKey">
        <el-input v-model="addForm.machineKey" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="addForm.phone" auto-complete="off" value="number"></el-input>
      </el-form-item>
      <el-form-item label="打印份数" prop="pnum">
        <el-input v-model="addForm.pnum" auto-complete="off" value="number"></el-input>
      </el-form-item>
      <el-form-item label="选择款台" prop="value">
        <template>
						<el-select v-model="addForm.value" placeholder="请选择款台">
							<el-option
									v-for="item in options"
									:label="item.username"
									:value="item.eid"
                  :key="item.eid">
							</el-option>
						</el-select>
					</template>
      </el-form-item>
      <el-form-item label="打印模板	" prop="pformat">
        <el-input type="textarea" :rows="6" :disabled="true" v-model="addForm.pformat">
        </el-input>
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

import {
  queryPrintShopNew,
  deletePrintNew,
  addPrintNew,
  lookupUser,
  updatePrintNew,
  queryPrintDetailNew,
  updatePStatusNew,
  selectEmpListByMid
} from '../../../api/shop';

export default {
  data() {
    var phone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系人手机号'));
      } else if (!/^1(3|4|5|7|8)\d{9,10}$/.test(value)) {
        callback(new Error('请输入正确的联系人手机号'));
      } else {
        callback();
      }
    };
    var pnum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入打印份数'));
      } else if (!/^\+?[1-9][0-9]*$/.test(value)) {
        callback(new Error('请输入正确的打印份数'));
      } else {
        callback();
      }
    };
    return {
      querySource: [],
      source: [],
      filters: {
        printname: ''
      },
      value: "",
      options: [],
      options: [],
      startTime: '',
      endTime: '',
      users: [],
      total: 1,
      page: 1,
      listLoading: false,

      detFormVisible: false,
      detLoading: false,

      stateFormVisible: false,
      stateLoading: false,

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        printname: [{
            required: true,
            message: '请输入打印机名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 18,
            message: '请输入正确的打印机名称',
            trigger: 'blur'
          }
        ],
        machineCode: [{
          required: true,
          message: '请输入终端号',
          trigger: 'blur'
        }],
        machineKey: [{
          required: true,
          message: '请输入终端密钥',
          trigger: 'blur'
        }],
        phone: [{
          validator: phone,
          trigger: 'blur'
        }],
        pnum: [{
          required: true,
          message: '请输入打印份数',
          trigger: 'blur'
        }, {
          validator: pnum,
          trigger: 'blur'
        }],
        value: [{
          required: true,
          message: '请选择款台'
        }],
      },
      detForm: {},
      stateForm: {},
      //编辑界面数据
      editForm: {
        value: '',
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        printname: [{
            required: true,
            message: '请输入打印机名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 18,
            message: '请输入正确的打印机名称',
            trigger: 'blur'
          }
        ],
        machineCode: [{
          required: true,
          message: '请输入终端号',
          trigger: 'blur'
        }],
        machineKey: [{
          required: true,
          message: '请输入终端密钥',
          trigger: 'blur'
        }],
        phone: [{
          min: 11,
          max: 12,
          message: '请输入正确的手机号码'
        }],
        pnum: [{
          required: true,
          message: '请输入打印份数',
          trigger: 'blur'
        },
        {
          validator: pnum,
          trigger: 'blur'
        }
        ],
        value: [{
          required: true,
          message: '请选择款台'
        }],
      },
      //新增界面数据
      addForm: {
        value: '',
        mname: '',
        username: '',
        storeName: '',
        address: '',
        telephone: '',
        shopHours: '',
        startTime: '',
        endTime: '',
        pformat: ''
      }
    }
  },
  methods: {
    test: function(index, row) {
      this.$confirm('此操作将修改款台状态, 确定修改?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        let para = {
          printId: row.id,
          isOpen: row.isOpen == true ? 1 : row.isOpen == false ? 0 : "未知"
        }
        updatePStatusNew(para).then((res) => {
          let {
            status
          } = res
          if (status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
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
    //状态显示转换

    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    getUsers(){
      this.page = 1
      this.getList()
    },
    //获取用户列表
    getList() {
      let para = {
        pageNum: this.page,
        printname: this.filters.printname
      };
      this.listLoading = true;
      
      queryPrintShopNew(para).then((res) => {
        var _this = this;
        let {
          status,
          message
        } = res;
        if (status == 200) {
          this.total = res.data.totalCount;
          this.users = res.data.printList;
          var sta;
          for (var i = 0; i < this.users.length; i++) {
            sta = this.users[i];
            if (sta.isOpen == 1) {
              sta.isOpen = true
            } else {
              sta.isOpen = false
            }
          }
        }
        this.listLoading = false;
        
      });
    },
    //删除
    // handleDel: function(index, row) {
    //   this.$confirm('确认删除该记录吗?', '提示', {
    //     type: 'warning'
    //   }).then(() => {
    //     this.listLoading = true;
    //     
    //     let para = {
    //       printId: row.id
    //     };
    //     deletePrintNew(para).then((res) => {
    //       var _this = this;
    //       this.listLoading = false;
    //       
    //       let {
    //         status,
    //         message
    //       } = res;
    //       if (status == 200) {
    //         this.$notify({
    //           title: '成功',
    //           message: message,
    //           type: 'success'
    //         });
    //       } else if (status == 301 || status == 302) {
    //         sessionStorage.removeItem('user');
    //         _this.$router.push('/login');
    //       } else {
    //         this.$notify({
    //           title: '失败',
    //           message: message,
    //         });
    //       }
    //       this.getUsers();
    //     });
    //   }).catch(() => {
    //
    //   });
    // },
    //显示详情界面
    handleDet: function(index, row) {
      this.detFormVisible = true;
      let para = {
        printId: row.id
      }
      queryPrintDetailNew(para).then((res) => {
        var _this = this;
        let {
          status,
          message
        } = res;
        if (status == 200) {
          this.detForm = res.data.machine
          this.detForm.storeName = res.data.eName
        }
      })
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm.printname = row.printname;
      this.editForm.machineCode = row.machineCode;
      this.editForm.machineKey = row.machineKey;
      this.editForm.phone = row.phone;
      this.editForm.pnum = row.pnum;
      this.editForm.pformat = row.pformat;
      this.editForm.isOpen = row.isOpen;
      this.editForm.id = row.id
      this.querySource=[{"eid":row.eid,"value":row.ename}];
      this.editForm.value = row.eid;
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      selectEmpListByMid().then((res) => {
        var _this = this;
        let {
          status,
          message
        } = res;
        if (status == 200) {
          this.options = res.data.empList;
        }
      });
      this.addForm = {
        value: '',
        storeId: '',
        username: '',
        aliOperationId: '',
        phone: '',
        email: '',
        terminal_id: '',
        options: '',
        pformat: '店铺名称：${sname}\n款台名称：${ename}\n消费描述：${desc}\n下单时间：${paytime}\n消费金额：${price}\n订单号：${orderid}\n支付方式：${paytype}\n打印时间：${printtime}\n※※※※※※※※※※※※※※※※\n商务热线：029-88445534\n技术支持：西安万鼎网络科技有限公司！'

      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            
            let para = {
              id: this.editForm.id,
              printname: this.editForm.printname,
              mCode: this.editForm.machineCode,
              mKey: this.editForm.machineKey,
              phone: this.editForm.phone,
              pnum: this.editForm.pnum,
              eid: this.editForm.value,
              pformat: this.editForm.pformat
            };
            updatePrintNew(para).then((res) => {
              var _this = this;
              this.editLoading = false;
              
              let {
                status,
                message
              } = res;
              if (status == 200) {
                this.$notify({
                  title: '成功',
                  message: message,
                  type: 'success'
                });
              }
              this.$refs['editForm'].resetFields();
              this.editFormVisible = false;
              this.getUsers();
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
            
            let para = {
              eid: this.addForm.value,
              printname: this.addForm.printname,
              mCode: this.addForm.machineCode,
              mKey: this.addForm.machineKey,
              phone: this.addForm.phone,
              pnum: this.addForm.pnum,
              pformat: this.addForm.pformat
            };
            //para.shopHours = (!para.shopHours || para.shopHours == '') ? '' : util.formatDate.format(new Date(para.shopHours), 'yyyy-MM-dd');
            addPrintNew(para).then((res) => {
              var _this = this;
              let {
                status,
                message
              } = res;
              if (status == 200) {
                this.addLoading = false;
                
                this.$notify({
                  title: '成功',
                  message: message,
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getUsers();
              }
            });
          });
        }
      });
    },
  },
  mounted() {
    this.getUsers();
  }
}
</script>

<style scoped>

</style>
