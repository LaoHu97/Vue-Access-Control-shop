webpackJsonp([11],{"Lt++":function(t,e,a){var i=a("X+2u");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a("rjj0")("45cdd770",i,!0,{})},"X+2u":function(t,e,a){e=t.exports=a("FZ+f")(!1),e.push([t.i,"\n.avatar-uploader[data-v-d3a9e8f4] {\n  border: 1px dashed #d9d9d9;\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n  width: 375px;\n  height: 150px;\n  margin: 0 auto;\n}\n.avatar-uploader[data-v-d3a9e8f4]:hover {\n  border-color: #409EFF;\n}\n.avatar-uploader-icon[data-v-d3a9e8f4] {\n  font-size: 28px;\n  color: #8c939d;\n  width: 375px;\n  line-height: 150px;\n  text-align: center;\n}\n.avatar[data-v-d3a9e8f4] {\n  width: 375px;\n  height: 150px;\n}\n\n",""])},rU0z:function(t,e,a){"use strict";function i(t){a("Lt++")}Object.defineProperty(e,"__esModule",{value:!0});var n=a("yt7g"),r=a("S49b"),s={data:function(){var t=this,e=new Date;return{pickerOptions1:{disabledDate:function(t){return t.getTime()>Date.now()}},pickerOptions2:{disabledDate:function(e){var a=Date.parse(new Date(n.f.format(new Date(t.filters.startTime),"yyyy-MM-dd hh:mm:ss")));if(e.getTime()<a||e.getTime()>Date.now())return!0}},newsOptions:[{value:"1",label:"新闻"},{value:"2",label:"公告"}],addLoading:!1,listLoading:!1,users:[],page:1,total:0,filters:{startTime:new Date(e.getFullYear(),e.getMonth(),e.getDate()),endTime:new Date(e.getFullYear(),e.getMonth(),e.getDate(),23,59,59),newsType:"",name:""},centerTextDialogVisible:!1,dialogTitle:"标题",dialogText:""}},methods:{formatter_main:function(t,e){return t.title_url?"公众号链接":"自定义内容"},formatter_statu:function(t,e){return 1===t.statu?"已发布":2===t.statu?"未发布":"未知"},formatter_title_type:function(t,e){return 1===t.title_type?"新闻":2===t.title_type?"公告":"未知"},formatter_time:function(t,e){return n.f.format(new Date(t.gmt_create),"yyyy-MM-dd hh:mm:ss")},addCarousel:function(){this.$router.push({path:"/index4/miniprogram3"})},handlePreview:function(t,e){if(this.centerTextDialogVisible=!0,this.dialogTitle=e.title,e.title_url)return this.dialogText='<p style="text-align: center;">此资讯为公众号链接，暂不支持预览</p>';this.dialogText=e.title_contents},handleEdit:function(t,e){this.$router.push({path:"/index4/miniprogram5",query:{id:e.id}})},switchChange:function(t,e){var a=this;this.$confirm("此操作将更改资讯状态, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var t={id:e.id,statu:2===e.statu?1:1==e.statu?2:"未知"};Object(r._72)(t).then(function(t){200===t.status&&(a.$message({type:"success",message:t.message}),a.getUsers())})}).catch(function(){a.$message({type:"info",message:"已取消状态修改"}),a.getUsers()})},handleDelete:function(t,e){var a=this;this.$confirm("此操作将永久删除该文件, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var t={id:e.id};Object(r.s)(t).then(function(t){200===t.status&&(a.getUsers(),a.$message({message:t.message,type:"success"}))})}).catch(function(){a.$message({type:"info",message:"已取消删除"})})},handleCurrentChange:function(t){this.page=t,this.getList()},getUsers:function(){this.page=1,this.getList()},getList:function(){var t=this,e={page:this.page,title:this.filters.name,title_type:this.filters.newsType,startTime:this.filters.startTime,endTime:this.filters.endTime};this.listLoading=!0,e.startTime=e.startTime&&""!=e.startTime?String(Date.parse(n.f.format(new Date(e.startTime),"yyyy/MM/dd hh:mm:ss"))):"",e.endTime=e.endTime&&""!=e.endTime?String(Date.parse(n.f.format(new Date(e.endTime),"yyyy/MM/dd hh:mm:ss"))):"",Object(r._51)(e).then(function(e){t.listLoading=!1,200===e.status&&(t.users=e.data.newsList,t.total=e.data.totalCount)})}},mounted:function(){this.getUsers()}},l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",[a("el-row",[a("el-form",{attrs:{inline:!0,model:t.filters}},[a("el-form-item",{attrs:{label:"资讯名称"}},[a("el-input",{staticClass:"fixed_search_input",attrs:{clearable:"",placeholder:"资讯名称"},model:{value:t.filters.name,callback:function(e){t.$set(t.filters,"name",e)},expression:"filters.name"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"资讯类型"}},[a("el-select",{staticClass:"fixed_search_input",attrs:{clearable:"",placeholder:"资讯类型"},model:{value:t.filters.newsType,callback:function(e){t.$set(t.filters,"newsType",e)},expression:"filters.newsType"}},t._l(t.newsOptions,function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}))],1),t._v(" "),a("el-form-item",{attrs:{label:"日期时间"}},[a("el-date-picker",{staticClass:"fixed_search_input_datetime",attrs:{type:"datetime",placeholder:"开始日期","picker-options":t.pickerOptions1,clearable:!1,editable:!1},model:{value:t.filters.startTime,callback:function(e){t.$set(t.filters,"startTime",e)},expression:"filters.startTime"}})],1),t._v(" "),a("el-form-item",[t._v("至")]),t._v(" "),a("el-form-item",{attrs:{prop:"endTime"}},[a("el-date-picker",{staticClass:"fixed_search_input_datetime",attrs:{type:"datetime",placeholder:"结束日期","picker-options":t.pickerOptions2,clearable:!1,editable:!1},model:{value:t.filters.endTime,callback:function(e){t.$set(t.filters,"endTime",e)},expression:"filters.endTime"}})],1),t._v(" "),a("el-form-item",{staticStyle:{float:"right"}},[a("el-button",{attrs:{type:"primary",round:""},on:{click:t.getUsers}},[t._v("查询")]),t._v(" "),a("el-button",{attrs:{type:"primary",round:""},on:{click:t.addCarousel}},[t._v("新增资讯")])],1)],1)],1),t._v(" "),a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}]},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.users,border:"","row-key":"id"}},[a("el-table-column",{attrs:{prop:"appid",label:"APPID（小程序ID）",width:"180"}}),t._v(" "),a("el-table-column",{attrs:{prop:"appname",label:"小程序名称",width:"180"}}),t._v(" "),a("el-table-column",{attrs:{prop:"title",label:"资讯名称"}}),t._v(" "),a("el-table-column",{attrs:{prop:"gmt_create",label:"创建时间",formatter:t.formatter_time}}),t._v(" "),a("el-table-column",{attrs:{prop:"title_type",label:"资讯类型",formatter:t.formatter_title_type}}),t._v(" "),a("el-table-column",{attrs:{label:"内容类型",formatter:t.formatter_main}}),t._v(" "),a("el-table-column",{attrs:{prop:"statu",label:"状态",formatter:t.formatter_statu}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作",width:"290"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{size:"mini"},on:{click:function(a){t.handlePreview(e.$index,e.row)}}},[t._v("预览")]),t._v(" "),a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){t.switchChange(e.$index,e.row)}}},[t._v(t._s(1===e.row.statu?"撤销":2===e.row.statu?"发布":"未知"))]),t._v(" "),a("el-button",{attrs:{size:"mini",type:"warning",disabled:1===e.row.statu},on:{click:function(a){t.handleEdit(e.$index,e.row)}}},[t._v("修改")]),t._v(" "),a("el-button",{attrs:{size:"mini",type:"danger",disabled:1===e.row.statu},on:{click:function(a){t.handleDelete(e.$index,e.row)}}},[t._v("删除")])]}}])})],1)],1),t._v(" "),a("el-dialog",{attrs:{title:t.dialogTitle,visible:t.centerTextDialogVisible,width:"30%",center:""},on:{"update:visible":function(e){t.centerTextDialogVisible=e}}},[a("span",{domProps:{innerHTML:t._s(t.dialogText)}}),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.centerTextDialogVisible=!1}}},[t._v("确 定")])],1)]),t._v(" "),a("el-row",[a("el-pagination",{staticStyle:{"text-align":"center",background:"#fff",padding:"15px"},attrs:{layout:"prev, pager, next","current-page":t.page,"page-size":20,total:t.total,background:""},on:{"current-change":t.handleCurrentChange}})],1)],1)},o=[],c={render:l,staticRenderFns:o},d=c,u=a("VU/8"),p=i,m=u(s,d,!1,p,"data-v-d3a9e8f4",null);e.default=m.exports}});