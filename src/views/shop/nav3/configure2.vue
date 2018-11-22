<template>
<section>
  <!--工具条-->
  <el-row>
    <el-form :inline="true" :model="filters">
      <el-form-item label="喇叭名称">
        <el-input v-model="filters.printname" class="fixed_search_input" placeholder="喇叭名称"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
        <el-button type="primary" @click="handleAdd" round>新增</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!--列表-->
  <div v-loading="listLoading">
    <el-table :data="users" border highlight-current-row style="width: 100%;">
      <el-table-column prop="printname" label="喇叭名称" min-width="120">
      </el-table-column>
      <el-table-column prop="machineCode" label="喇叭ID" min-width="120">
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
      <el-table-column label="音量" min-width="160">
        <template slot-scope="scope">
          <el-slider v-model="scope.row.pnum" @change="clickSlider(scope.$index, scope.row)"></el-slider>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          </template>
      </el-table-column>
    </el-table>
  </div>
  <!--工具条-->
  <el-row>
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
    </el-pagination>
  </el-row>
  <!--修改界面-->
  <el-dialog title="打印配置修改" :visible.sync="editFormVisible" :close-on-click-modal="false" width="600px">
    <el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm" label-position="right">
      <el-form-item label="喇叭名称" prop="audioName">
        <el-input v-model="editForm.audioName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="喇叭ID" prop="audioId">
        <el-input v-model="editForm.audioId" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="选择门店" prop="store">
        <el-select v-model="editForm.store" placeholder="请选择门店" :multiple="false" filterable remote :remote-method="remoteEditShop" :loading="loading" clearable @visible-change="clickEditShop">
          <el-option v-for="item in optionEditStore" :key="item.id" :value="item.id" :label="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择款台">
        <el-select v-model="editForm.emp" placeholder="请选择款台" :multiple="false" filterable remote :remote-method="remoteEditEmp" :loading="loadingEmp" clearable @visible-change="clickEditEmp">
          <el-option v-for="item in optionEditEmp" :key="item.eid" :value="item.eid" :label="item.value">
          </el-option>
        </el-select>
        <el-tag type="warning">注：不选默认该门店下所有款台</el-tag>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog>

  <!--新增界面-->
  <el-dialog title="新增喇叭" :visible.sync="addFormVisible" :close-on-click-modal="false" width="600px">
    <el-form :model="addForm" label-width="90px" :rules="addFormRules" ref="addForm" label-position="right">
      <el-form-item label="喇叭名称" prop="audioName">
        <el-input v-model="addForm.audioName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="喇叭ID" prop="audioId">
        <el-input v-model="addForm.audioId" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="选择门店" prop="store">
        <el-select v-model="addForm.store" placeholder="请选择门店" :multiple="false" filterable remote :remote-method="remoteShop" :loading="loading" clearable @visible-change="clickShop">
          <el-option v-for="item in optionStore" :key="item.id" :value="item.id" :label="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择款台">
        <el-select v-model="addForm.emp" placeholder="请选择款台" :multiple="false" filterable remote :remote-method="remoteEmp" :loading="loadingEmp" clearable @visible-change="clickEmp">
          <el-option v-for="item in optionEmp" :key="item.eid" :value="item.eid" :label="item.value">
          </el-option>
        </el-select>
        <el-tag type="warning">注：不选默认该门店下所有款台</el-tag>
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
  queryAudio,
  deletePrintNew,
  addAudio,
  lookupUser,
  updateAudio,
  queryPrintDetailNew,
  bindAudio,
  selectEmpListByMid,
  volAudio,
  updatePStatusNew,
  selectStoreList,
  selectEmpsBySid,
  queryPrintShopNew
} from '../../../api/shop';

export default {
  data() {
    return {
      filters: {
        printname: ''
      },
      users: [],
      total: 1,
      page: 1,
      listLoading: false,

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        audioName: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],
        audioId: [{
          required: true,
          message: '请输入ID',
          trigger: 'blur'
        }],
        store: [{
          required: true,
          type: 'number',
          message: '请选择款台',
          trigger: 'change'
        }],
      },
      //编辑界面数据
      editForm: {
        id: '',
        audioName: '',
        audioId: '',
        emp: '',
        store: ''
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      loading: false,
      loadingEmp: false,
      addFormRules: {
        audioName: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],
        audioId: [{
          required: true,
          message: '请输入ID',
          trigger: 'blur'
        }],
        store: [{
          required: true,
          type: 'number',
          message: '请选择款台',
          trigger: 'change'
        }],
      },
      //新增界面数据
      addForm: {
        audioName: '',
        audioId: '',
        emp: '',
        store: ''
      },
      optionStore: [],
      optionEmp: [],
      optionEditStore: [],
      optionEditEmp: []
    }
  },
  methods: {
    //修改款台远程搜索
    clickEditEmp: function(val) {
      if (val) {
        let para = {
          storeId: String(this.editForm.store),
          ename: ''
        }
        selectEmpsBySid(para).then((res) => {
          let {
            status,
            data
          } = res
          this.optionEditEmp = data.emplyeeList
        })
      }
    },
    remoteEditEmp(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          selectEmpsBySid({
            ename: String(query),
            storeId: String(this.editForm.store)
          }).then((res) => {
            let {
              status,
              data
            } = res
            this.optionEditEmp = data.emplyeeList
          })
        }, 200);
      } else {
        this.optionEditEmp = [];
      }
    },
    //修改门店远程搜索
    clickEditShop: function(val) {
      if (val) {
        this.editForm.emp = '';
        selectStoreList().then((res) => {
          let {
            status,
            data
          } = res
          this.optionEditStore = data.storeList
        })
      }
    },
    remoteEditShop(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          selectStoreList({
            sname: String(query)
          }).then((res) => {
            let {
              status,
              data
            } = res
            this.optionEditStore = data.storeList
          })
        }, 200);
      } else {
        this.optionEditStore = [];
      }
    },
    //款台远程搜索
    clickEmp: function(val) {
      if (val) {
        let para = {
          storeId: String(this.addForm.store),
          ename: ''
        }
        selectEmpsBySid(para).then((res) => {
          let {
            status,
            data
          } = res
          this.optionEmp = data.emplyeeList
        })
      }
    },
    remoteEmp(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          selectEmpsBySid({
            ename: query,
            storeId: String(this.addForm.store)
          }).then((res) => {
            let {
              status,
              data
            } = res
            this.optionEmp = data.emplyeeList
          })
        }, 200);
      } else {
        this.optionEmp = [];
      }
    },
    //门店远程搜索
    clickShop: function(val) {
      if (val) {
        selectStoreList().then((res) => {
          let {
            status,
            data
          } = res
          this.optionStore = data.storeList
        })
      }
    },
    remoteShop(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          selectStoreList({
            sname: query
          }).then((res) => {
            let {
              status,
              data
            } = res
            this.optionStore = data.storeList
          })
        }, 200);
      } else {
        this.optionStore = [];
      }
    },
    clickSlider(index, row) {
      let para = {
        id: String(row.id),
        vol: String(row.pnum)
      }
      volAudio(para).then((res) => {
        let {
          status,
          message
        } = res;
        if (status != 200) {
          this.$message.error(message);
          this.getUsers();
        }
      })
    },
    test: function(index, row) {
      this.$confirm('此操作将修改款台状态, 确定修改?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        let para = {
          printId: String(row.id),
          isOpen: row.isOpen == true ? '1' : row.isOpen == false ? '0' : "未知"
        }
        updatePStatusNew(para).then((res) => {
          let {
            status,
            message
          } = res
          if (status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          } else {
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
      
      queryAudio(para).then((res) => {
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

    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm.audioName = row.printname;
      this.editForm.audioId = row.machineCode;
      this.editForm.id = row.id
      this.optionEditStore = [{
        "id": row.storeId,
        "value": row.sname
      }];
      this.editForm.store = row.storeId;
      this.optionEditEmp = [{
        "eid": row.eid,
        "value": row.ename
      }];
      this.editForm.emp = row.eid == 0 ? '' : row.eid;
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            
            console.log(this.editForm.emp);
            let para = {
              id: String(this.editForm.id),
              eid: String(this.editForm.emp),
              audioName: this.editForm.audioName,
              audioId: this.editForm.audioId,
              storeId: String(this.editForm.store)
            };
            updateAudio(para).then((res) => {
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
              eid: String(this.addForm.emp),
              audioName: this.addForm.audioName,
              audioId: this.addForm.audioId,
              storeId: String(this.addForm.store),
            };
            //para.shopHours = (!para.shopHours || para.shopHours == '') ? '' : util.formatDate.format(new Date(para.shopHours), 'yyyy-MM-dd');
            addAudio(para).then((res) => {
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
