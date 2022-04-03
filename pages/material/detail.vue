<template>
	<view class="container bg-ff">
		<view class="w-cells">
			<view class="w-cell">
				<view class="item-hd">当前运行序号：</view>
				<view class="item-bd">{{material.trans_num}}</view>
			</view>
			<view class="w-cell">
				<view class="item-hd">材料类别：</view>
				<view class="item-bd">{{material.trans_num}}</view>
			</view>
			<view class="w-cell">
				<view class="item-hd">实际温度（°C）：</view>
				<view class="item-bd">{{material.temp}}</view>
			</view>
			<view class="w-cell">
				<view class="item-hd">设定温度（°C）：</view>
				<view class="item-bd">{{material.ID}}</view>
			</view>
			<view class="w-cell">
				<view class="item-hd">运行时间（分钟）：</view>
				<view class="item-bd">{{material.run_time}}</view>
			</view>
			<view class="w-cell">
				<view class="item-hd">设定时间（分钟）：</view>
				<view class="item-bd">{{material.ID}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const {getConfigure} = require('@/utils/api');
	export default {
		data(){
			return {
				material:{
					// type:'PC',
					// time:"32",
					// run_time:"30",
					// temp:"88",
					'temp': '',
					'run_time': '',
					'trans_num':'',
					'ID':''
				},
				refreshTimer:''
			}
		},
		// mounted(){
		// 	//console.log('material', uni.getStorageSync('materialStr'));
		// 	//this.material = JSON.parse(uni.getStorageSync('materialStr'));
		// },
		onUnload(){
			this.refreshTimer && clearInterval(this.refreshTimer);
		},
		onShow(){
			this.getConfigureData();
			let _this = this;
			this.refreshTimer = setInterval(()=>{_this.getConfigureData()},5000);
		},
		methods:{
			async getConfigureData(){
				let terminalKey = uni.getStorageSync('terminalKey');
				let infoStr = await getConfigure({sn:terminalKey},'-1');
				uni.setStorageSync('configer',infoStr.data);
				this.handleConfiger(infoStr);
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
				}
				//uni.setStorageSync('materialStr',JSON.stringify(this.material));
			}
		}
	}
</script>
<style lang="scss">
	@import url("/static/style/w-cells.scss");
	.bg-ff{
		background-color: #fff;
	}
</style>
