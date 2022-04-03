<template>
	<view class="container">
		<form @submit="formSubmit" @reset="formReset" class="pass-form flex-center">
			<view class="uni-form-item flex-center">
				<view class="title">密码：</view>
				<input class="uni-input" type="number" password=true name="input" placeholder="请输入密码" />
			</view>
			<button style="margin-top:90upx" @click="handlePass('/pages/manage/factorySet/list')">确定</button>
		</form>
	</view>
</template>

<script>
	export default {
		data(){
			
		},
		mounted() {
			
		},
		methods: {
			handlePass(url){
				uni.navigateTo({
				    url: url
				});
			},
		}
	}
</script>

<style>
	.pass-form{
       height: 90vh;
	}
	.flex-center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.uni-input{
		border:1upx solid #fff;
		padding:8upx 10upx;
	}
</style>
