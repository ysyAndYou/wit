<template>
	<view class="container flex-center bg-base">
		<form class="flex-center">
			<view class="uni-form-item flex-center">
				<view class="title">设备序列号：</view>
				<input class="uni-input" v-model="device.sn" name="input" placeholder="请输入序列号" />
			</view>
			<view class="uni-form-item flex-center">
				<view class="title">设备名称：</view>
				<input class="uni-input" v-model="device.terminalName" name="input" placeholder="请输入设备名称" />
			</view>
			<view class="uni-form-item flex-center">
				<view class="title">设备描述：</view>
				<input class="uni-input" v-model="device.info" name="input" placeholder="请输入设备描述" />
			</view>
			<button class="form-btn login-btn" @click="handleBinding()">绑定</button>
		</form>
	</view>
</template>

<script>
	const {bindDevice} = require('@/utils/api')
	const {durationToast} = require('@/utils/util');
	export default {
		data(){
			return {
				device:{
					sn:'',
					terminalName:'',
					info:''
				}
			}
		},
		mounted() {
		},
		methods:{
			//绑定设备
			async handleBinding(){
				if(!this.device.sn){
					durationToast('请输入设备序列号！',2000)
				}else{
					const res = await bindDevice(this.device);
					if(res.code == 0){
						durationToast('设备绑定成功！',2000)
						uni.switchTab({
							url:'./list'
						 })
					}
				}
			}
		}
	}
</script>

<style>
	.uni-form-item .title{
	    width: 220upx;
	}
	.form-btn{
		margin-top:50upx;
		background-color:#18BC37;
		width: 80%;
		color:#fff;
		border-radius: 50upx;
	}
</style>
