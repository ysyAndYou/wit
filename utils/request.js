//const baseUrl="https://120.79.64.159";
const baseUrl="https://mqtt.iot.itranscloud.com:8443";
const http = ({url='',param={},msg='加载中...',method='post'}={}) =>{
  if(msg!='-1'){uni.showLoading();}
  return new Promise((resolve,reject)=>{
    const tokenId = uni.getStorageSync('token') || '';
	param.token = tokenId;
    uni.request({
      url:getUrl(url),
      data:param,
      // header:{
      //  'Content-Type': 'application/x-www-form-urlencoded'
      // },
      method: method,
      complete:(res)=>{
		if(msg!='-1'){uni.hideLoading();}
	    const result = res.data;
        if(result.code == 0){
          resolve(res.data);
        }else{
			//console.log('result', res);
			if(result.message.indexOf('token 无效') >-1){
				uni.showToast({
				  title: result.message,
				  icon: 'none',
				  duration: 2000
				})
				uni.navigateTo({
					url:'../login/login'
				})
			}else{
				let remMsg = '';
				if(result){
					remMsg = result.message;
				}else{
					remMsg = `${res.statusCode}异常，请稍后再试！`;  
				}
				uni.showToast({
				  title: remMsg,
				  icon: 'none',
				  duration: 2000
				})
			}
          reject(result);
        }
      }
    })
  })
}
const getUrl = (url) =>{
  if(url.indexOf('://') == -1){
    url = baseUrl + url;
  }
  return url;
}

const _get = (url,param = {},msg) => {
  return http({
    url,
    param,
    msg,
    method:'get'
  })
}
const _post = (url,param = {},msg) => {
  const key = '';
  const token = '';
  // let token = '27045';
  if(key && token){
    param.token_id = token;
    param.key = key;
  }
  return http({
    url,
    param,
    msg,
    method:'post'
  })
}
module.exports = {
  baseUrl,
  _get,
  _post
}