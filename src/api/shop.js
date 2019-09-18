import instance from './index';

const preUrlPath = '';
const downloadPath = process.env.API_DOWNLOAD || '';

//登录
export const loginShopVerify = {
  p: ['post,/login'],
  r: params => {
    return instance.post(`${preUrlPath}/admin/wp/mer/loginShopVerify`, params).then(res => res.data);
  }
};
//获取验证码
export const getCode = {
  p: ['get,/login'],
  r: process.env.API_ROOT + "/admin/wp/comm/getCode"
};

//验证权限
export const checkPermission = params => {
  return instance.post(`${preUrlPath}/admin/syscore/checkPermission`, params).then(res => res.data);
};
//获取服务端菜单
export const menu = params => {
  return instance.get(`${preUrlPath}/admin/syscore/menu`, {
    params: params
  });
};

//门店汇总
export const getUserList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/querySummary`, params).then(res => res.data);
};
//收款记录
export const getUserListPage = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryOrderShop`, params).then(res => res.data);
};
//修改密码
export const modifyPassword = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateMerMpwd`, params).then(res => res.data);
};
//退出登录
export const batchRemoveUser = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/loginMerOut`, params).then(res => res.data);
};
//模糊查询
export const lookupUser = params => {
  return instance.post(`${preUrlPath}/admin/wp/comm/selectStoreList`, params).then(res => res.data);
};
//门店管理
export const queryStoresShop = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryStoresShop`, params).then(res => res.data);
};
//列表修改
export const updateStore = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateStore`, params).then(res => res.data);
};
//门店删除
export const deleteStore = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/deleteStore`, params).then(res => res.data);
};
//门店新增
export const addStore = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/addStore`, params).then(res => res.data);
};
//门店状态
export const updateStoreState = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateStoreState`, params).then(res => res.data);
};
//重置密码
export const updateStorePwd = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateStorePwd`, params).then(res => res.data);
};
//款台查询
export const queryEmployeeShop = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryEmployeeShop`, params).then(res => res.data);
};
//款台详情
export const queryEmployeeDetail = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryEmployeeDetail`, params).then(res => res.data);
};
//款台密码重置
export const updateEmployeePwd = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateEmployeePwd`, params).then(res => res.data);
};
//款台增加
export const addEmployee = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/addEmployee`, params).then(res => res.data);
};
//款台修改
export const updateEmployee = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateEmployee`, params).then(res => res.data);
};
//款台删除
export const deleteEmployee = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/deleteEmployee`, params).then(res => res.data);
};
//打印列表
export const queryPrintShopNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryPrintShopNew`, params).then(res => res.data);
};
//删除列表
export const deletePrintNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/deletePrintNew`, params).then(res => res.data);
};
//添加打印配置
export const addPrintNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/addPrintNew`, params).then(res => res.data);
};
//添加打印配置
export const addAudio = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/addAudio`, params).then(res => res.data);
};

export const queryAudio = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryAudio`, params).then(res => res.data);
};

export const updateAudio = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateAudio`, params).then(res => res.data);
};

export const bindAudio = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/bindAudio`, params).then(res => res.data);
};

export const volAudio = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/volAudio`, params).then(res => res.data);
};

export const selectEmpsBySid = params => {
  return instance.post(`${preUrlPath}/admin/wp/comm/selectEmpsBySid`, params).then(res => res.data);
};
//款台状态
export const updateEmployeeStatus = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateEmployeeStatus`, params).then(res => res.data);
};
//修改打印配置
export const updatePrintNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updatePrintNew`, params).then(res => res.data);
};
//款台状态修改
export const queryPrintDetailNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryPrintDetailNew`, params).then(res => res.data);
};
//打印状态修改
export const updatePStatusNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updatePStatusNew`, params).then(res => res.data);
};
//导出Excel(收款)
export const downOrderExcel = params => {
  return instance.get(`${preUrlPath}/admin/wp/mer/downOrderExcel`, {
    params: params
  });
};
//导出Excel(汇总)
export const downOrderSumExcel = params => {
  return instance.get(`${preUrlPath}/admin/wp/mer/downOrderSumExcel`, {
    params: params
  });
};
//二维码
export const getEmpTwoCode = `${preUrlPath}/admin/wp/mer/getEmpTwoCode`;
//会员卡支付二维码
export const getEmpMemCode = `${preUrlPath}/admin/wp/mer/getEmpMemCode`;
//打印增加款台
export const selectEmpListByMid = params => {
  return instance.post(`${preUrlPath}/admin/wp/comm/selectEmpListByMid`, params).then(res => res.data);
};
//退款
export const merRefund = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/merRefund`, params).then(res => res.data);
};
//补发打印
export const supplyPrint = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/supplyPrint`, params).then(res => res.data);
};
//门店汇总
export const queryStrStatement = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryStrStatement`, params).then(res => res.data);
};
//门店汇总
export const selectStoreList = params => {
  return instance.post(`${preUrlPath}/admin/wp/comm/selectStoreList`, params).then(res => res.data);
};

export const downStrSumExcel = params => {
  return instance.get(`${preUrlPath}/admin/wp/mer/downStrSumExcel`, {
    params: params
  });
};

//会员日设置
export const addMemDay = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/addMemDay`, params).then(res => res.data);
};
//会员日查询
export const queryMemDay = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryMemDay`, params).then(res => res.data);
};
//同步会员卡
export const sysMemberInsert = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/sysMemberInsert`, params).then(res => res.data);
};
//获取验证码
export const sendVerCode = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/sendVerCode`, params).then(res => res.data);
};
//确认退款
export const checkVerCode = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/checkVerCode`, params).then(res => res.data);
};
//卡劵投放
export const getUrlCode = `${preUrlPath}/admin/wp/mer/getUrlCode`;
//订单详情
export const queryOrderDetail = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryOrderDetail`, params).then(res => res.data);
};




//同步门店接口
export const synStoreList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/synStoreList`, params).then(res => res.data);
};
export const synStoreListNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/synStoreList`, params).then(res => res.data);
};
//查询门店接口
export const queryStoreListNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryStoreList`, params).then(res => res.data);
};
export const queryStoreList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryStoreList`, params).then(res => res.data);
};
//会员卡列表
export const queryMemCardList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryMemCardList`, params).then(res => res.data);
};
//微信会员卡创建
export const insertMenCard = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/insertMenCard`, params).then(res => res.data);
};
export const addCoupon = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/addCoupon`, params).then(res => res.data);
};
//微信上传
export const uploadCreatCard = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/uploadCreatCard`, params).then(res => res.data);
};
//会员信息
export const queryMemberList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryMemberList`, params).then(res => res.data);
};
//消费记录
export const queryAccTransList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryAccTransList`, params).then(res => res.data);
};
//订单管理
export const queryShopOrderList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryShopOrderList`, params).then(res => res.data);
};
//卡卷列表
export const queryCouponListNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryWdPlaformCoupon`, params).then(res => res.data);
};
export const queryCouponList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryCouponList`, params).then(res => res.data);
};
//卡卷上传
export const uploadCoupon = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/uploadCoupon`, params).then(res => res.data);
};
//核销卡卷查询
export const queryCode = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryCode`, params).then(res => res.data);
};
//确认核销
export const consumeCode = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/consumeCode`, params).then(res => res.data);
};
//卡卷核销列表
export const queryConsumeList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryConsumeList`, params).then(res => res.data);
};
//公司账户=>添加母户
export const insertCompany = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/insertCompany`, params).then(res => res.data);
};
//公司账户列表
export const queryCompany = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryCompany`, params).then(res => res.data);
};
//绑定子户
export const insertBindAcc = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/insertBindAcc`, params).then(res => res.data);
};
//绑定页面查询会员卡号
export const checkAccountByNum = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/checkAccountByNum`, params).then(res => res.data);
};
//查看已绑定会员
export const queryBindAcc = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryBindAcc`, params).then(res => res.data);
};
//副卡充值
export const bindDeposit = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/bindDeposit`, params).then(res => res.data);
};
//副卡解绑
export const unBind = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/unBind`, params).then(res => res.data);
};
//公司账户交易明细
export const companyTrans = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/companyTrans`, params).then(res => res.data);
};
//重置密码
export const resetMemPwd = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/resetMemPwd`, params).then(res => res.data);
};
//公司账户充值
export const depositCompany = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/depositCompany`, params).then(res => res.data);
};
//修改库存
export const modifyStock = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/modifyStock`, params).then(res => res.data);
};
//交易账单
export const downTransExcel = `${preUrlPath}/admin/wp/mer/downTransExcel`;
//会员交易查询
export const queryMemTrans = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryMemTrans`, params).then(res => res.data);
};
//添加充值规则
export const insertDepositRule = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/insertDepositRule`, params).then(res => res.data);
};
//查询充值规则
export const getDepositRule = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/getDepositRule`, params).then(res => res.data);
};
//修改充值规则状态
export const updateDepositStatus = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateDepositStatus`, params).then(res => res.data);
};
//编辑充值规则
export const updateDepositRule = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateDepositRule`, params).then(res => res.data);
};
//会员卡修改回显
export const queryCardByKey = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryCardByKey`, params).then(res => res.data);
};
//会员卡修改提交
export const updateMenCard = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateMenCard`, params).then(res => res.data);
};

export const queryLevel = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryLevel`, params).then(res => res.data);
};


export const selectEmpList = params => {
  return instance.post(`${preUrlPath}/admin/wp/comm/selectEmpList`, params).then(res => res.data);
};
//余额统计
export const queryBalance = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryBalance`, params).then(res => res.data);
};
//余额统计
export const downOrderExcelNew = params => {
  return instance.get(`${preUrlPath}/admin/wp/mer/downOrderExcelNew`, {
    params: params
  });
};

//购买记录
export const queryPkgPurchaseByCondition = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryPkgPurchaseByConditionPc`, params).then(res => res.data);
};
//套餐列表
export const getPkgProductList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/getPkgProductListPc`, params).then(res => res.data);
};
//邀请人
export const queryPkgInviterByCondition = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryPkgInviterByCondition`, params).then(res => res.data);
};

export const queryIntention = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryIntentionPc`, params).then(res => res.data);
};

export const queryActivePur = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryActivePur`, params).then(res => res.data);
};

export const updateRedStatus = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateRedStatus`, params).then(res => res.data);
};

export const qRCode = `${preUrlPath}/admin/wp/mer/qRCode`;

export const updatePkgInviterById = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updatePkgInviterById`, params).then(res => res.data);
};

export const getPkgProductListPc = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/getPkgProductListPc`, params).then(res => res.data);
};

export const getCardLevelListPc = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/getCardLevelListPc`, params).then(res => res.data);
};

export const insertPkgProduct = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/insertPkgProduct`, params).then(res => res.data);
};

export const getPkgProductById = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/getPkgProductById`, params).then(res => res.data);
};

export const updatePkgProduct = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updatePkgProduct`, params).then(res => res.data);
};

export const updateProdStauts = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateProdStauts`, params).then(res => res.data);
};

export const downPkgPurchaseExcel = `${preUrlPath}/admin/wp/mer/downPkgPurchaseExcel`;

export const downPkgInviterExcel = `${preUrlPath}/admin/wp/mer/downPkgInviterExcel`;




//积分商城列表
export const queryProductList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryProductList`, params).then(res => res.data);
};
//新增商品
export const insertProduct = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/insertProduct`, params).then(res => res.data);
};
//商品状态
export const updateStatus = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateStatus`, params).then(res => res.data);
};
//修改商品信息
export const updateProduct = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateProduct`, params).then(res => res.data);
};
//添加商品优惠卷查询
export const getCouponByInPro = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/getCouponByInPro`, params).then(res => res.data);
};
//线下消费补录
export const inputMemTrans = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/inputMemTrans`, params).then(res => res.data);
};


//首页
export const merDataSumShow = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/merDataSumShow`, params).then(res => res.data);
};
//公告列表
export const getNotices = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/getNotices`, params).then(res => res.data);
};
//公告详情
export const getNoticeById = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/getNoticeById`, params).then(res => res.data);
};
//人工补录
export const queryInviter = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryInviter`, params).then(res => res.data);
};
//人工补录
export const queryMember = params => {
  return instance.post(`${preUrlPath}/admin/wp/comm/queryMember`, params).then(res => res.data);
};
//人工补录
export const makeUpPurchase = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/makeUpPurchase`, params).then(res => res.data);
};
//商户交易日汇总
export const queryMerDaySum = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryMerDaySum`, params).then(res => res.data);
};
//门店数据查询
export const queryStrStateCp = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryStrStateCp`, params).then(res => res.data);
};




//下载ex
export const checkdownOrderExcelNew = params => {
  return instance.get(`${downloadPath}/download/mer/checkdownOrderExcelNew`, {
    params: params
  });
};

export const checkDataExcel = params => {
  return instance.get(`${downloadPath}/download/mer/checkDataExcel`, {
    params: params
  });
};

export const checkdownOrderExcel = params => {
  return instance.get(`${downloadPath}/download/mer/checkdownOrderExcel`, {
    params: params
  });
};
//收款记录
export const downloadQueryOrderShop = params => {
  return instance.post(`${downloadPath}/download/mer/queryOrderShop`, params).then(res => res.data);
};

export const downloadQueryOrderDetail = params => {
  return instance.post(`${downloadPath}/download/mer/queryOrderDetail`, params).then(res => res.data);
};



export const tinymceUploadimg = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/uploadimg`, params).then(res => res.data);
};

export const uploadimg = `${preUrlPath}/admin/wp/mer/uploadimg`;

export const uploadImgNew = `${preUrlPath}/admin/wp/mer/member/uploadimg`;

export const insertPkgProductPic = `${preUrlPath}/admin/wp/mer/insertPkgProductPic`;

/*
小程序管理
*/
export const addWdMiniInfo = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/addWdMiniInfo`, params).then(res => res.data);
};

export const queryWdMiniInfo = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/queryWdMiniInfo`, params).then(res => res.data);
};

export const deleteWdMiniInfo = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/deleteWdMiniInfo`, params).then(res => res.data);
};

export const selectInfoByMid = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/selectInfoByMid`, params).then(res => res.data);
};

export const queryWdMiniMenu = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/queryWdMiniMenu`, params).then(res => res.data);
};

export const updateMiniInfo = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/updateMiniInfo`, params).then(res => res.data);
};

export const addMiniMenu = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/addMiniMenu`, params).then(res => res.data);
};

export const deleteWdMiniMenu = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/deleteWdMiniMenu`, params).then(res => res.data);
};

export const updateMiniMenu = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/updateMiniMenu`, params).then(res => res.data);
};

export const addMiniNews = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/addMiniNews`, params).then(res => res.data);
};

export const selectByTime = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/selectByTime`, params).then(res => res.data);
};

export const deleteMiniNews = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/deleteMiniNews`, params).then(res => res.data);
};

export const updateMiniNews = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/updateMiniNews`, params).then(res => res.data);
};

export const getNewDetail = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/getNewDetail`, params).then(res => res.data);
};

export const updateNewsStatu = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/mini/1/updateNewsStatu`, params).then(res => res.data);
};

export const uploadImage = `${preUrlPath}/admin/wp/mer/mini/1/uploadImage`;

/*
2018-6-21
*/
export const queryMerDaySumDetail = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryMerDaySumDetail`, params).then(res => res.data);
};


/*
2018-7-11
*/
export const queryYuBaoDevice = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/queryYuBaoDevice`, params).then(res => res.data);
};

/*
2018-7-12
*/
export const eidSendVerCode = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/100/sendVerCode`, params).then(res => res.data);
};

export const eidcheckVerCode = params => {
  return instance.get(`${preUrlPath}/admin/wp/mer/100/checkVerCode`, {
    params: params
  });
};

export const removeManager = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/100/removeManager`, params).then(res => res.data);
};

export const queryStoreDetail = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/100/queryStoreDetail`, params).then(res => res.data);
};

export const sendVerCodeT = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/100/sendVerCodeT`, params).then(res => res.data);
};

export const addYuBaoDevice = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/addYuBaoDevice`, params).then(res => res.data);
};

export const updateYuBaoDevice = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/updateYuBaoDevice`, params).then(res => res.data);
};

export const getDeviceQrCode = `${preUrlPath}/admin/wp/mer/getDeviceQrCode`;

/*
2018-7-18
*/
export const merInfoShow = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/merInfoShow`, params).then(res => res.data);
};

export const memberAccountDeposit = params => {
  return instance.post(`${preUrlPath}/admin/wxmember/memberAccountDeposit`, params).then(res => res.data);
};
/*
2018-11-21
*/
export const checkFuiouDataExcel = params => {
  return instance.get(`${downloadPath}/download/wp/mer/checkFuiouDataExcel`, {
    params: params
  });
};

export const insertMemCard = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/insertMemCard`, params).then(res => res.data);
};

export const queryMemCardListNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryMemCardList`, params).then(res => res.data);
};

export const uploadMemCard = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/uploadCreatCard`, params).then(res => res.data);
};

export const queryMemCardByKey = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryMemCardByKey`, params).then(res => res.data);
};

export const updateMemCard = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateMemCard`, params).then(res => res.data);
};

export const queryCouponDetails = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryCouponDetails`, params).then(res => res.data);
};

export const modifyCardStock = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/modifyCardStock`, params).then(res => res.data);
};

export const updateCoupon = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateCoupon`, params).then(res => res.data);
};

export const uploadCouponNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/uploadCoupon`, params).then(res => res.data);
};

export const addWdFrequencyCard = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/addWdFrequencyCard`, params).then(res => res.data);
};

export const addWdGiftCoupon = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/addWdGiftCoupon`, params).then(res => res.data);
};


export const queryMemberListNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryMemberList`, params).then(res => res.data);
};

export const queryMemBalanceList = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryMemBalanceList`, params).then(res => res.data);
};

export const queryMemBounsList = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryMemBounsList`, params).then(res => res.data);
};

export const queryConsumeListNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryConsumeList`, params).then(res => res.data);
};

export const queryFrequencyList = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryFrequencyList`, params).then(res => res.data);
};

export const queryConsumeFrequencyList = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryConsumeFrequencyList`, params).then(res => res.data);
};

export const queryCouponWithOutWDGifi = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryCouponWithOutWDGifi`, params).then(res => res.data);
};

export const queryConsumeActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryConsumeActivity`, params).then(res => res.data);
};

export const addConsumeActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/addConsumeActivity`, params).then(res => res.data);
};

export const selectStoreListNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/selectStoreList`, params).then(res => res.data);
};

export const showOrderAppraise = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/showOrderAppraise`, params).then(res => res.data);
};

export const queryMiniProductList = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/queryMiniProductList`, params).then(res => res.data);
};

export const updateProductNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/updateProduct`, params).then(res => res.data);
};

export const addDepositActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/addDepositActivity`, params).then(res => res.data);
};

export const queryDepositActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryDepositActivity`, params).then(res => res.data);
};

export const uploadAgentImage = `${preUrlPath}/admin/mer/mall/uploadAgentImage`

export const queryCodeNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryCode`, params).then(res => res.data);
};

export const consumeCodeNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/consumeCode`, params).then(res => res.data);
};

export const updateConsumeStatus = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateConsumeStatus`, params).then(res => res.data);
};


export const queryReceiveCardActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryReceiveCardActivity`, params).then(res => res.data);
};

export const addReceiveCardActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/addReceiveCardActivity`, params).then(res => res.data);
};

export const selectMemberCard = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/selectMemberCard`, params).then(res => res.data);
};

export const selectConsumeByPrimaryKey = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/selectConsumeByPk`, params).then(res => res.data);
};

export const selectReceiveCardAcPk = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/selectReceiveCardAcPk`, params).then(res => res.data);
};

export const updateReceiveCardActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateReceiveCardActivity`, params).then(res => res.data);
};

export const updateReceiveCardAcStatus = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateReceiveCardAcStatus`, params).then(res => res.data);
};

export const updateDepositStatusNew = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateDepositStatus`, params).then(res => res.data);
};

export const selectDepositByPk = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/selectDepositByPk`, params).then(res => res.data);
};

export const updateDepositActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateDepositActivity`, params).then(res => res.data);
};

export const queryDepositDetailList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryDepositDetailList`, params).then(res => res.data);
};

export const updateDepositDetailActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateDepositDetailActivity`, params).then(res => res.data);
};

export const updateConsumeActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateConsumeActivity`, params).then(res => res.data);
};

export const queryConsumeDetailList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryConsumeDetailList`, params).then(res => res.data);
};

export const updateConsumeDetailList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateConsumeDetailActivity`, params).then(res => res.data);
};

export const addConsumeDetailActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/addConsumeDetailActivity`, params).then(res => res.data);
};

export const updateMallProductStatus = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/updateMallProductStatus`, params).then(res => res.data);
};

export const queryProductOrderList = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/queryProductOrderList`, params).then(res => res.data);
};

export const queryActivityProduct = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/queryActivityProduct`, params).then(res => res.data);
};

export const modifyActivityStatus = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/modifyActivityStatus`, params).then(res => res.data);
};

export const queryMiniProductNameList = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/queryMiniProductNameList`, params).then(res => res.data);
};

export const insertOrSave = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/insertOrSave`, params).then(res => res.data);
};

export const queryWssembleOrderList = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/queryWssembleOrderList`, params).then(res => res.data);
};

export const queryOrderDetail2019 = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/queryOrderDetail`, params).then(res => res.data);
};

export const queryInvitationRecord = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryInvitationRecord`, params).then(res => res.data);
};

export const queryWdCardGoodsList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryWdCardGoodsList`, params).then(res => res.data);
};

export const selectReceiveCardAcList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/selectReceiveCardAcList`, params).then(res => res.data);
};

export const addWdCardGoods = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/addWdCardGoods`, params).then(res => res.data);
};

export const updateWdCardGoods = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateWdCardGoods`, params).then(res => res.data);
};

export const queryProductListNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/shopmall/queryProductList`, params).then(res => res.data);
};

export const insertProductNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/shopmall/insertProduct`, params).then(res => res.data);
};

export const shopMallOrderList = params => {
  return instance.post(`${preUrlPath}/admin/mer/shopmall/shopMallOrderList`, params).then(res => res.data);
};

export const addWdMiniInfoNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/addWdMiniInfo`, params).then(res => res.data);
};

export const queryWdMiniInfoNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/queryWdMiniInfo`, params).then(res => res.data);
};

export const updateMiniInfoNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/updateMiniInfo`, params).then(res => res.data);
};

export const deleteWdMiniInfoNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/deleteWdMiniInfo`, params).then(res => res.data);
};

export const queryWellProduce = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/queryWellProduce`, params).then(res => res.data);
};

export const insertWellProduce = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/insertWellProduce`, params).then(res => res.data);
};

export const deleteWellProduce = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/deleteWellProduce`, params).then(res => res.data);
};

export const updateWellProduce = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/updateWellProduce`, params).then(res => res.data);
};

export const updateWdFrequencyCard = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateWdFrequencyCard`, params).then(res => res.data);
};

export const updateWdGiftCoupon = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateWdGiftCoupon`, params).then(res => res.data);
};

export const queryWdGiftCouponDetail = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryWdGiftCouponDetail`, params).then(res => res.data);
};

export const addWdGiftCouponDetail = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/addWdGiftCouponDetail`, params).then(res => res.data);
};

export const updateWdGiftCouponDetail = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateWdGiftCouponDetail`, params).then(res => res.data);
};

export const resetMemPwdNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/resetMemPwd`, params).then(res => res.data);
};

export const queryWdCardLevel = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryWdCardLevel`, params).then(res => res.data);
};

export const insertWdCardLevel = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/insertWdCardLevel`, params).then(res => res.data);
};

export const updateWdCardLevel = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/updateWdCardLevel`, params).then(res => res.data);
};

export const deleteWdCardLevelByPK = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/deleteWdCardLevelByPK`, params).then(res => res.data);
};

export const sysMemberInsertNew = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/sysMemberInsert`, params).then(res => res.data);
};

export const addBalanceByPc = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/addBalanceByPc`, params).then(res => res.data);
};

export const addBonusByPc = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/addBonusByPc`, params).then(res => res.data);
};

export const uploadExcel = `${preUrlPath}/admin/mer/member/uploadExcel`

export const updateOrderAppraise = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/updateOrderAppraise`, params).then(res => res.data);
};

export const getQueryConsumeCountList = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryConsumeCountList`, params).then(res => res.data);
};

export const exportConsumeCountList = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/exportConsumeCountList`, params).then(res => res.data);
};

export const queryDepositOrderList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryDepositOrderList`, params).then(res => res.data);
};

export const exportDepositeToExcel = params => {
  return instance.get(`${preUrlPath}/admin/wp/mer/member/exportDepositeToExcel`, {
    params: params
  })
};

export const exportBuyCardToExcel = params => {
  return instance.get(`${preUrlPath}/admin/wp/mer/member/exportBuyCardToExcel`, {
    params: params
  })
};

export const queryConsumeOrderList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/queryConsumeOrderList`, params).then(res => res.data);
};

export const exportConsumeToExcel = params => {
  return instance.get(`${preUrlPath}/admin/wp/mer/member/exportConsumeToExcel`, {
    params: params
  })
};

export const queryReceiveCouponCouList = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryReceiveCouponCouList`, params).then(res => res.data);
};


export const queryFrequencyCountList = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryFrequencyCountList`, params).then(res => res.data);
};


export const queryConsumeFrequencyCountList = params => {
  return instance.post(`${preUrlPath}/admin/mer/member/queryConsumeFrequencyCountList`, params).then(res => res.data);
};


export const getRoomType = params => {
  return instance.post(`${preUrlPath}/admin/mer/mall/getRoomType`, params).then(res => res.data);
};

export const getRoomList = params => {
  return instance.post(`${preUrlPath}/admin/mer/room/query`, params).then(res => res.data);
};

export const getRoomManage = params => {
  return instance.post(`${preUrlPath}/admin/mer/room/manage`, params).then(res => res.data);
};

export const saveRoomManage = params => {
  return instance.post(`${preUrlPath}/admin/mer/room/save`, params).then(res => res.data);
};

export const generator = params => {
  return instance.post(`${preUrlPath}/admin/mer/room/generator`, params).then(res => res.data);
};

export const selectEmployeeList = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/selectEmployeeList`, params).then(res => res.data);
};

export const selectEmployeeadd = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/add`, params).then(res => res.data);
};

export const selectEmployeeupdate = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/update`, params).then(res => res.data);
};
export const selectEmployeedelete = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/delete`, params).then(res => res.data);
};

export const getAllStoreByMid = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/getAllStoreByMid`, params).then(res => res.data);
};

export const deleteActivity = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/deleteActivity`, params).then(res => res.data);
};

export const deleteByActivity_idAndId = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/deleteByActivity_idAndId`, params).then(res => res.data);
};

export const deleteCoupon = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/deleteCoupon`, params).then(res => res.data);
};

export const deleteByCard_idAndId = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/deleteByCard_idAndId`, params).then(res => res.data);
};

export const modifyCouponStock = params => {
  return instance.post(`${preUrlPath}/admin/wp/mer/member/modifyCouponStock`, params).then(res => res.data);
};