webpackJsonp([22],{MSSO:function(n,e,t){e=n.exports=t("FZ+f")(!1),e.push([n.i,"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",""])},ZzPB:function(n,e,t){"use strict";function o(n){t("mneS")}Object.defineProperty(e,"__esModule",{value:!0});var i=t("mvHQ"),a=t.n(i),l=(t("yt7g"),t("S49b")),r={data:function(){return{filters:{name:"",card_type:""},options:[{value:"GIFT",label:"兑换券"},{value:"GENERAL_COUPON",label:"优惠券"}],users:[],total:0,page:1,listLoading:!1,addFormVisible:!1,addLoading:!1,codeMode:!1,addFormRules:{},optionsCode:[],optionsScene:[{value:"pqc",label:"二维码投放"},{value:"ppa",label:"支付广告投放"},{value:"ppn",label:"公众号投放"}],codeFormVisible:!1,editFormVipCode:!1,codeLoading:!1,codeFormRules:{},loading:!1,codeForm:{wxcard_id:"",store:"",scene:""},editVipCode:{vipCode:""},addForm:{card_type:4}}},methods:{closeDialog:function(){this.codeMode=!1,this.codeForm.scene="",this.codeForm.store=""},clickCode:function(){window.location.href=this.editVipCode.vipCode},codeSubmit:function(){this.codeLoading=!0;var n={cardid:this.codeForm.wxcard_id,storeId:String(this.codeForm.store),scene:this.codeForm.scene};this.codeLoading=!1,this.editVipCode.vipCode=l.R+"?cardid="+n.cardid+"&storeId="+n.storeId+"&scene="+n.scene,this.codeMode=!0},clickStore:function(){var n=this;Object(l._55)().then(function(e){var t=(e.status,e.data);n.optionsCode=t.storeList})},remoteStore:function(n){var e=this;""!==n?(this.loading=!0,setTimeout(function(){e.loading=!1,Object(l._55)({sname:n}).then(function(n){var t=(n.status,n.data);e.optionsCode=t.storeList})},200)):this.options=[]},deliveryCode:function(n,e){this.codeFormVisible=!0,this.codeForm.wxcard_id=e.wxcard_id},editCard:function(n,e){var t=e.id;sessionStorage.setItem("id",a()(t)),this.$router.push({path:"/index3/tab7-modify"})},status:function(n,e){return 2==n.status?"上传成功":1==n.status?"未上传":3==n.status?"上传失败":"未知"},uploadWinxin:function(n,e){var t=this,o={id:e.id};Object(l._85)(o).then(function(n){var e=n.status,o=n.message;200==e?(t.$notify({title:"成功",message:o,type:"success"}),t.getUsers()):t.$notify.error({title:"错误",message:o})})},card_type:function(n,e){return"GIFT"==n.card_type?"兑换券":"GENERAL_COUPON"==n.card_type?"优惠券":"GROUPON"==n.card_type?"团购券":"CASH"==n.card_type?"代金券":"DISCOUNT"==n.card_type?"折扣券":"未知"},handleCurrentChange:function(n){this.page=n,this.getList()},getUsers:function(){this.page=1,this.getList()},getList:function(){var n=this,e={pagNum:this.page,name:this.filters.name,card_type:this.filters.card_type};this.listLoading=!0,Object(l._22)(e).then(function(e){n.total=e.data.total,n.users=e.data.CouponList,n.listLoading=!1})},handleAdd:function(){this.addFormVisible=!0},addSubmit:function(){var n=this.addForm.card_type;sessionStorage.setItem("card_type",a()(n)),this.$router.push({path:"/index3/tab7s"})}},mounted:function(){this.getUsers()}},s=function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("section",[t("el-row",[t("el-form",{attrs:{inline:!0,model:n.filters}},[t("el-form-item",{attrs:{label:"卡券名称"}},[t("el-input",{staticClass:"fixed_search_input",attrs:{placeholder:"卡券名称"},model:{value:n.filters.name,callback:function(e){n.$set(n.filters,"name",e)},expression:"filters.name"}})],1),n._v(" "),t("el-form-item",{attrs:{label:"卡券类型"}},[[t("el-select",{staticClass:"fixed_search_input",attrs:{clearable:"",placeholder:"卡券类型"},model:{value:n.filters.card_type,callback:function(e){n.$set(n.filters,"card_type",e)},expression:"filters.card_type"}},n._l(n.options,function(n){return t("el-option",{key:n.value,attrs:{label:n.label,value:n.value}})}))]],2),n._v(" "),t("el-form-item",{staticStyle:{float:"right"}},[t("el-button",{attrs:{type:"primary",round:""},on:{click:n.handleAdd}},[n._v("新增卡券")]),n._v(" "),t("el-button",{attrs:{type:"primary",round:""},on:{click:n.getUsers}},[n._v("查询")])],1)],1)],1),n._v(" "),t("div",{directives:[{name:"loading",rawName:"v-loading",value:n.listLoading,expression:"listLoading"}]},[t("el-table",{staticStyle:{width:"100%"},attrs:{border:"",data:n.users,"highlight-current-row":""}},[t("el-table-column",{attrs:{prop:"card_type",label:"卡券类型",formatter:n.card_type}}),n._v(" "),t("el-table-column",{attrs:{prop:"title",label:"卡券名称","min-width":"120"}}),n._v(" "),t("el-table-column",{attrs:{prop:"quantity",label:"库存"}}),n._v(" "),t("el-table-column",{attrs:{prop:"get_limit",label:"限领次数"}}),n._v(" "),t("el-table-column",{attrs:{prop:"status",label:"状态","min-width":"90",formatter:n.status}}),n._v(" "),t("el-table-column",{attrs:{label:"操作",width:"290"},scopedSlots:n._u([{key:"default",fn:function(e){return[t("el-button",{attrs:{type:"warning",size:"mini"},on:{click:function(t){n.editCard(e.$index,e.row)}}},[n._v("修改")]),n._v(" "),2!=e.row.status?t("el-button",{attrs:{type:"success",size:"mini"},on:{click:function(t){n.uploadWinxin(e.$index,e.row)}}},[n._v("上传"),t("i",{staticClass:"el-icon-upload el-icon--right"})]):t("el-button",{attrs:{type:"info",size:"mini",disabled:!0}},[n._v("已上传")]),n._v(" "),t("el-button",{attrs:{type:"success",size:"mini"},on:{click:function(t){n.deliveryCode(e.$index,e.row)}}},[n._v("投放二维码")])]}}])})],1)],1),n._v(" "),t("el-row",[t("el-pagination",{staticStyle:{"text-align":"center",background:"#fff",padding:"15px"},attrs:{layout:"prev, pager, next","current-page":n.page,"page-size":20,total:n.total,background:""},on:{"current-change":n.handleCurrentChange}})],1),n._v(" "),t("el-dialog",{attrs:{title:"投放设置",visible:n.codeFormVisible,"close-on-click-modal":!1,width:"600px"},on:{"update:visible":function(e){n.codeFormVisible=e},close:n.closeDialog}},[t("el-form",{ref:"codeForm",attrs:{model:n.codeForm,"label-width":"80px",rules:n.codeFormRules}},[t("el-form-item",{attrs:{label:"选择场景",prop:"parag"}},[t("el-select",{attrs:{clearable:"",placeholder:"请选择场景"},model:{value:n.codeForm.scene,callback:function(e){n.$set(n.codeForm,"scene",e)},expression:"codeForm.scene"}},n._l(n.optionsScene,function(n){return t("el-option",{key:n.value,attrs:{label:n.label,value:n.value}})}))],1),n._v(" "),t("el-form-item",{attrs:{label:"选择门店",prop:"parag"}},[t("el-select",{attrs:{placeholder:"请选择门店名称",multiple:!1,filterable:"",remote:"",clearable:"","remote-method":n.remoteStore,loading:n.loading},on:{"visible-change":n.clickStore},model:{value:n.codeForm.store,callback:function(e){n.$set(n.codeForm,"store",e)},expression:"codeForm.store"}},n._l(n.optionsCode,function(n){return t("el-option",{key:n.id,attrs:{value:n.id,label:n.value}})}))],1),n._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary",loading:n.codeLoading},nativeOn:{click:function(e){return n.codeSubmit(e)}}},[n._v("生成二维码")])],1)],1),n._v(" "),n.codeMode?t("el-form",{ref:"editVipCode",staticStyle:{width:"auto"},attrs:{model:n.editVipCode,"label-width":""}},[t("el-form-item",{staticStyle:{"text-align":"center","margin-bottom":"0"}},[t("img",{attrs:{src:n.editVipCode.vipCode,alt:"二维码",width:"260px"}})]),n._v(" "),t("el-form-item",{staticStyle:{"text-align":"center","margin-bottom":"0"}},[t("el-button",{attrs:{type:"success"},on:{click:n.clickCode}},[n._v("点击下载")])],1)],1):n._e()],1),n._v(" "),t("el-dialog",{attrs:{title:"请选择新增卡券类型",visible:n.addFormVisible,"close-on-click-modal":!1,width:"600px"},on:{"update:visible":function(e){n.addFormVisible=e}}},[t("el-form",{ref:"addForm",attrs:{model:n.addForm,"label-width":"120px",rules:n.addFormRules}},[[t("el-radio-group",{model:{value:n.addForm.card_type,callback:function(e){n.$set(n.addForm,"card_type",e)},expression:"addForm.card_type"}},[t("el-radio",{attrs:{label:1}},[n._v("团购券")]),n._v(" "),t("el-radio",{attrs:{label:2}},[n._v("代金券")]),n._v(" "),t("el-radio",{attrs:{label:3}},[n._v("折扣券")]),n._v(" "),t("el-radio",{attrs:{label:4}},[n._v("兑换券")]),n._v(" "),t("el-radio",{attrs:{label:5}},[n._v("优惠券")])],1)]],2),n._v(" "),t("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{nativeOn:{click:function(e){n.addFormVisible=!1}}},[n._v("取消")]),n._v(" "),t("el-button",{attrs:{type:"primary",loading:n.addLoading},nativeOn:{click:function(e){return n.addSubmit(e)}}},[n._v("提交")])],1)],1)],1)},d=[],c={render:s,staticRenderFns:d},u=c,p=t("VU/8"),m=o,f=p(r,u,!1,m,"data-v-6feac83d",null);e.default=f.exports},mneS:function(n,e,t){var o=t("MSSO");"string"==typeof o&&(o=[[n.i,o,""]]),o.locals&&(n.exports=o.locals);t("rjj0")("57eacde2",o,!0,{})}});