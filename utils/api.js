const request = require('./request');
//发送控制指令
// const putCmd = (param)=>{
//   return request._post('/inteliot/web2service/put/cmd', param);
// };
// //获取特定指令的当前状态
// const getCmd = (param)=>{
//   return request._post('/inteliot/web2service/get/cmd', param);
// };
//用户密码登录
const userPassLogin = (param) =>{
	return request._post('/inteliot/web2service/login', param);
}
//获取sn
const reqSn = (param) =>{
	return request._post('/inteliot/web2service/device/list', param);
}
//获取报警记录
const getAlarmList = (param) =>{
	return request._post('/inteliot/web2service/get/alarm/list', param);
}
//报警记录删除接口
const delAlarm = (param) =>{
	return request._post('/inteliot/web2service/get/alarm/delete', param);
}
//获取原料列表
const getMaterialList = (param,msg) =>{
	return request._post('/inteliot/web2service/get/material/list', param,msg);
}
//修改原料
const updateMaterial = (param) =>{
	return request._post('/inteliot/web2service/get/material/modify', param);
}
//删除原料
const delMaterial = (param) =>{
	return request._post('/inteliot/web2service/get/material/delete', param);
}
// 新增列表
const addMaterial = (param) =>{
	return request._post('/inteliot/web2service/get/material/add', param);
}
//获取openId
const getOpenId = (param) =>{
	return request._post('/inteliot/web2service/wx/getopenid', param);
}
//获取设备参数
const getConfigure = (param,msg='加载中...') =>{
	return request._post('/inteliot/web2service/get/configure', param, msg);
}
//配置设备参数
const updateConfigure = (param) =>{
	return request._post('/inteliot/web2service/update/configure', param);
}
//绑定设备
const bindDevice = (param)=>{
	return request._post('/inteliot/web2service/binding/sn', param);
}
//设备解绑
const unBindDevice = (param)=>{
	return request._post('/inteliot/web2service/unbinding/sn', param);
}
	
const setConfigure = (param)=>{
	return request._post('/inteliot/web2service/update/configure', param);
}
const setRecover = (param)=>{
	return request._post('/inteliot/web2service/put/cmd/recover', param);
}
const getCode = (param)=>{
	return request._post('/inteliot/web2service/register/code', param);
}
const userRegister = (param)=>{
	return request._post('/inteliot/web2service/register', param);
}
module.exports={
	// getCmd,
	// putCmd,
	userPassLogin,
	reqSn,
	getAlarmList,
    delAlarm,
	getMaterialList,
	addMaterial,
	updateMaterial,
	delMaterial,
	getOpenId,
	getConfigure,
	setConfigure,
	bindDevice,
	unBindDevice,
	setRecover,
	getCode,
	userRegister
}