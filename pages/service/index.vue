<template>
	<view class="container service-contianer bg-base">
		<view class="info-main">
			<image class="info-image" src="../../static/logo.png"></image>
			<view  class="name name-china">
				广东电神智能科技有限公司
			</view>
			<view class="name-en">
				GUANGDONG DIANSHEN INTELLIGENT TECHNOLOGY CO..LTD
			</view>
		</view>
		<view class="phone-info">全国售后电话：<text @click="callPhone()">400 8825303</text></view>
	</view>	
</template>
<script>
	export default {
		data(){
			
		},
		methods:{
			callPhone(){
				uni.makePhoneCall({
					phoneNumber: '4008825303'
				});
			}
		}
	}
</script>
<style>
	.service-contianer{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.info-main{
		width: 100%;
		margin-bottom: 30upx;
		text-align: center;
	}
	.info-image{
		/* width: 100%; */
		height: 140upx;
	}
	.phone-info{
		text-align: center;
	}
	.name{
		margin-top:40upx;
		font-size: 48upx;
		letter-spacing: 6upx;
	}
	.name-en{
		font-size: 32upx;
	}
</style>

