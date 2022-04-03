<template>
	<view class="container bg-base">
		<view class="info-hd">
		  <view>{{time}}</view>
		  <view>总运行时间：{{material.run_time}}H</view>
		</view>
		<view class="info-bd">
			<view class="info-box" @click="jumpPageFn('/pages/material/list')">
				<view class="info-con1">{{material.trans_num}}</view>
				<view class="info-con2">原料选择</view>
			</view>
			<view class="info-box">
				<view class="info-con1 color-gold">{{material.ID}}°C</view>
				<view class="info-con2">设置温度</view>
			</view>
			<view class="info-box" @click="jumpPageFn('/pages/material/detail')">
				<view class="info-con1 color-gold">{{material.temp}}°C</view>
				<view class="info-con2">实际温度</view>
			</view>
		</view>
		<view class="oper-tns-box">
			<view class="oper-item" @click="jumpPageFn('/pages/manage/index')">
				<image class="oper-item_icon" src="../../static/manage.png"></image>
				<view class="oper-item_text">管理设定</view>
			</view>
			<view class="oper-item" @click="jumpPageFn('/pages/warning/list')">
				<image class="oper-item_icon" src="../../static/warn.png"></image>
				<view class="oper-item_text">报警记录</view>
			</view>
			<view class="oper-item" @click="jumpPageFn('/pages/hitch/index')">
				<image class="oper-item_icon" src="../../static/hitch.png"></image>
				<view class="oper-item_text">故障复位</view>
			</view>
			<view class="oper-item" @click="jumpPageFn('/pages/service/index')">
				<image class="oper-item_icon" src="../../static/service.png"></image>
				<view class="oper-item_text">售后服务</view>
			</view>
		</view>
	<!-- 	<uni-grid :column="4" >
			<uni-grid-item @click="jumpPageFn('/pages/manage/index')">
				<text class="text">管理设定</text>
			</uni-grid-item>
			<uni-grid-item @click="jumpPageFn('/pages/warning/list')">
				<text class="text">报警记录</text>
			</uni-grid-item>
			<uni-grid-item @click="jumpPageFn('/pages/hitch/index')">
				<text class="text">故障复位</text>
			</uni-grid-item>
			<uni-grid-item @click="jumpPageFn('/pages/service/index')">
				<text class="text">售后服务</text>
			</uni-grid-item>
		</uni-grid> -->
		<!-- <view class="btns-box flex-btw">
			<button type="default" size="mini" @click="jumpPageFn('/pages/manage/index')">管理设定</button>
			<button type="default" size="mini" @click="jumpPageFn('/pages/warning/list')">报警记录</button>
			<button type="default" size="mini" @click="jumpPageFn('/pages/hitch/index')">故障复位</button>
		    <button type="default" size="mini" @click="jumpPageFn('/pages/service/index')">售后服务</button>
		</view> -->
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog content="您还有绑定设备,去绑定设备？" mode="base"  :before-close="true" @close="closeBind" @confirm="goBind"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	const {reqSn,getOpenId,getConfigure} = require('@/utils/api');
	const {durationToast} = require('@/utils/util');
	export default {
		data() {
			return {
				refreshTimer:'',
				timer:'',
				time:'',
				runTime:'',
				material:{
					temp:'',
					run_time:'',
					ID:""
				},
				href: 'https://uniapp.dcloud.io/component/README?id=uniui'
			}
		},
		 mounted() {
		},
		beforeDestroy(){
			this.timer && clearInterval(this.timer);
			this.refreshTimer && clearInterval(this.refreshTimer);
		},
		onHide(){
			console.log('离开了...');
			this.timer && clearInterval(this.timer);
			this.refreshTimer && clearInterval(this.refreshTimer);
		},
		async onShow(){
		  console.log('进来了...');	
		  //获取sn
		  const terminalKey = uni.getStorageSync('terminalKey');
		  if(terminalKey){
		  	this.getConfigureData();
		  }else{
		  	this.getDevices();
		  }
		  console.log('这是首页mounted...');
		  const _this = this;
		  this.timer = setInterval(()=>{_this.timeFn()},1000);
		  this.refreshTimer = setInterval(()=>{_this.getConfigureData()},5000);
		},
		methods: {
			async getDevices(){
				let res = await reqSn({type:0,page:0,pageSize:1000});
				if(res && res.code == 0){ //默认获取第一个sn
					const data = res.data;
					uni.setStorageSync('terminalKey', data[0].terminalKey);
					
				}else{ //清除历史，先绑定设备
					uni.removeStorageSync('terminalKey');
					this.$refs.popup.open();
				}
			},
			//还没有设备，去绑定设备
			goBind(){
				this.closeBind();
				uni.navigateTo({
					url:'../device/binding'
				})
			},
			closeBind(){
				this.$refs.popup.close();
			},
			async getConfigureData(){
				let terminalKey = uni.getStorageSync('terminalKey');
				let infoStr = await getConfigure({sn:terminalKey},'-1');
				uni.setStorageSync('configer',infoStr.data);
				this.handleConfiger(infoStr);
			},
			//页面跳转
		    jumpPageFn(url){
				//debugger
				console.log('url====', url);
				uni.navigateTo({
					url: url
				});
			},
			//处理配置信息
			handleConfiger(data){
				console.log('infoStr===', JSON.parse(data.data));
				let info = JSON.parse(data.data);
				this.material = {
					'temp': info.temp,
					'run_time': info.run_time,
					'trans_num':info.trans_num,
					'ID':info.ID
				},
				uni.setStorageSync('materialStr',JSON.stringify(this.material));
			},
          timeFn(){
			//this.getConfigureData(); // 轮询查数据
			console.log('111');
			let vDay;
			let date =  new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			let hours = date.getHours();
			let minutes = date.getMinutes();
			let seconds = date.getSeconds();
			month = month<10 ? `0${month}`: month;
			day = day<10 ? `0${day}`: day;
			hours = hours<10 ? `0${hours}`: hours;
			minutes = minutes<10 ? `0${minutes}`: minutes;
			seconds = seconds<10 ? `0${seconds}`: seconds;
			this.time = year + "-" + month + "-" + day + "\t" + hours + ":" + minutes +":" + seconds;
		  }
		}
	}
</script>

<style>
	.container {
		padding: 20upx;
	}
	.info-bd{
		margin:0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.info-box{
		border:1upx solid #fff;
		border-radius: 70upx;
		text-align: center;
		margin-top:60upx;
		padding:16upx 60upx;
	}
	.color-gold{
		color:#FFD700;
	}
	.oper-tns-box{
		margin-top:120upx;
		display: flex;
		width: 100%;
	}
	.oper-item{
		flex:1;
		text-align: center;
	}
	.oper-item_icon{
		width: 60upx;
		height: 60upx;
	}
	.oper-item_text{
		font-size: 28upx;
	}
</style>
