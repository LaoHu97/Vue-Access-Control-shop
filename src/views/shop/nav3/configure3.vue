<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-form :inline="true" :model="filters">
        <el-form-item label="设备编号">
          <el-input v-model.trim="filters.otpCode" class="fixed_search_input" placeholder="设备编号"></el-input>
        </el-form-item>
        <el-form-item label="款台名称">
          <el-select v-model="filters.eid" placeholder="款台名称" class="fixed_search_input" :multiple="false" filterable remote :remote-method="remoteEmp" :loading="empSearchLoading"
            clearable @focus="clickEmp">
            <el-option v-for="item in optionsEmp" :key="item.eid" :value="item.eid" :label="item.value">
            </el-option>
          </el-select>
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
        <el-table-column prop="printname" label="设备名称" min-width="120">
        </el-table-column>
        <el-table-column prop="ename" label="款台名称" min-width="120">
        </el-table-column>
        <el-table-column prop="machineCode" label="设备编号" min-width="120">
        </el-table-column>
        <el-table-column prop="pnum" label="设备支付成功次数" min-width="160">
        </el-table-column>
        <el-table-column align="center" label="操作" width="230">
          <template slot-scope="scope">
            <el-button size="mini" @click="equipmentQr(scope.$index, scope.row)">设备二维码</el-button>
            <el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="设备二维码" :visible.sync="qrDialogVisible" width="500px"  :close-on-click-modal="false">
      <div class="qr_div">
        <div>
          <img :src="qrImg" alt="二维码" class="qr_img">
        </div>
        <el-button type="text" @click="downloadQr">下载二维码</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="qrDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="equipmentBool ? '修改设备' : '添加设备'" :visible.sync="equipmentDialogVisible" width="500px" :close-on-click-modal="false" @close="equipmentDialogClosed">
      <el-form ref="equipmentForm" :model="equipmentForm" label-width="80px">
        <el-form-item label="设备名称" prop="yubaoName" :rules="[
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ]">
          <el-input v-model.trim="equipmentForm.yubaoName"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="yubaoCode" :rules="[
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ]">
          <el-input v-model.trim="equipmentForm.yubaoCode"></el-input>
        </el-form-item>
        <el-form-item label="支付次数" v-if="equipmentBool" prop="punm" :rules="[
          { required: true, message: '请输入设备支付成功次数', trigger: 'blur' }
        ]">
          <el-input v-model.trim="equipmentForm.punm"></el-input>
        </el-form-item>
        <el-form-item label="选择款台" prop="eid" :rules="[
          { required: true, message: '请选择款台', trigger: 'change' }
        ]">
          <el-select v-model="equipmentForm.eid" placeholder="款台名称" :multiple="false" filterable remote :remote-method="equipmentRemoteEmp"
            :loading="equipmentEmpSearchLoading" clearable @focus="equipmentClickEmp">
            <el-option v-for="item in equipmentOptionsEmp" :key="item.eid" :value="item.eid" :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="equipmentDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="equipmentBool" @click="equipmentEdit('equipmentForm')">修 改</el-button>
        <el-button type="primary" v-else @click="equipmentSubmile('equipmentForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" background
        style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
  import * as util from '../../../util/util.js'

  import {
    queryYuBaoDevice,
    selectEmpsBySid,
    getDeviceQrCode,
    updateYuBaoDevice,
    addYuBaoDevice
  } from '../../../api/shop';

  export default {
    data() {
      return {
        filters: {
          eid: '',
          otpCode: ''
        },
        optionsEmp: [],
        equipmentOptionsEmp: [],
        users: [],
        total: 1,
        page: 1,
        listLoading: false,
        empSearchLoading: false,
        equipmentEmpSearchLoading: false,
        equipmentDialogVisible: false,
        equipmentBool: false,
        equipmentForm: {
          yubaoName: '',
          yubaoCode: '',
          eid: ''
        },
        qrDialogVisible: false,
        qrImg: ''
      }
    },
    methods: {
      equipmentDialogClosed(formName) {
        this.$refs['equipmentForm'].resetFields()
      },
      downloadQr() {
        window.location.href = this.qrImg
      },
      equipmentQr(index, row) {
        let para = {
          mid: row.mid,
          sid: row.storeId,
          eid: row.eid
        }
        this.qrDialogVisible = true
        this.qrImg = `${getDeviceQrCode}?mid=${row.mid}&sid=${row.storeId}&eid=${row.eid}`
      },
      equipmentEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = {
              id: this.equipmentForm.id,
              printname: this.equipmentForm.yubaoName,
              machineCode: this.equipmentForm.yubaoCode,
              punm: this.equipmentForm.punm,
              eid: this.equipmentForm.eid
            }
            updateYuBaoDevice(para).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.equipmentDialogVisible = false
                this.$refs[formName].resetFields()
                this.getList()
              }
            })
          }
        })
      },
      handleEdit(index, row) {
        this.equipmentDialogVisible = true
        this.equipmentBool = true
        this.equipmentClickEmp()
        let assign = Object.assign({}, row)
        this.equipmentForm.yubaoName = assign.printname
        this.equipmentForm.yubaoCode = assign.machineCode
        this.equipmentForm.punm = assign.pnum
        this.equipmentForm.eid = assign.eid
        this.equipmentForm.id = assign.id
      },
      equipmentSubmile(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = this.equipmentForm
            addYuBaoDevice(para).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.equipmentDialogVisible = false
                this.$refs[formName].resetFields()
                this.getList()
              }
            })
          }
        })
      },
      handleAdd() {
        this.equipmentDialogVisible = true
        this.equipmentBool = false
        this.equipmentForm = {}
      },
      //款台远程搜索
      equipmentClickEmp: function () {
        this.equipmentEmpSearchLoading = true;
        let para = {
          mid: sessionStorage.getItem('mid'),
          ename: ''
        }
        selectEmpsBySid(para).then((res) => {
          this.equipmentEmpSearchLoading = false;
          let {
            status,
            data
          } = res
          this.equipmentOptionsEmp = data.emplyeeList
        })
      },
      equipmentRemoteEmp(query) {
        if (query !== '') {
          this.equipmentEmpSearchLoading = true;
          setTimeout(() => {
            this.equipmentEmpSearchLoading = false;
            let para = {
              mid: sessionStorage.getItem('mid'),
              ename: query
            }
            selectEmpsBySid(para).then((res) => {
              let {
                status,
                data
              } = res
              this.equipmentOptionsEmp = data.emplyeeList
            })
          }, 200);
        } else {
          this.equipmentOptionsEmp = [];
        }
      },
      //款台远程搜索
      clickEmp: function () {
        this.empSearchLoading = true;
        let para = {
          mid: sessionStorage.getItem('mid'),
          ename: ''
        }
        selectEmpsBySid(para).then((res) => {
          this.empSearchLoading = false;
          let {
            status,
            data
          } = res
          this.optionsEmp = data.emplyeeList
        })
      },
      remoteEmp(query) {
        if (query !== '') {
          this.empSearchLoading = true;
          setTimeout(() => {
            this.empSearchLoading = false;
            let para = {
              mid: sessionStorage.getItem('mid'),
              ename: query
            }
            selectEmpsBySid(para).then((res) => {
              let {
                status,
                data
              } = res
              this.optionsEmp = data.emplyeeList
            })
          }, 200);
        } else {
          this.optionsEmp = [];
        }
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList();
      },
      getUsers() {
        this.page = 1
        this.getList()
      },
      //获取用户列表
      getList() {
        let para = {
          pageNum: this.page.toString(),
          eid: this.filters.eid.toString(),
          otpCode: this.filters.otpCode
        };
        this.listLoading = true
        queryYuBaoDevice(para).then((res) => {
          let {
            status,
            message
          } = res;
          if (status == 200) {
            this.total = res.data.totalCount;
            this.users = res.data.printList;
          }
          this.listLoading = false;
        });
      },
    },
    mounted() {
      this.getUsers();
    }
  }

</script>

<style scoped>
.qr_div{
  text-align: center
}
.qr_img{
  width: 200px;
}

</style>
