<template>
	<view class="container flex-center bg-base">
		<form class="flex-center">
			<view class="uni-form-item flex-center">
				<view class="title">用户名：</view>
				<input class="uni-input" v-model="userName" name="input" placeholder="请输入用户名" />
			</view>
			<view class="uni-form-item flex-center">
				<view class="title">密码：</view>
				<input class="uni-input" v-model="passWord" password="true" name="input" placeholder="请输入密码" />
			</view>
			<!-- <view class="form-btns-box"> -->
				<button class="form-btn login-btn" @click="login()">登录</button>
				<button class="form-btn register-btn" @click="register()">注册</button>
			<!-- </view> -->
		</form>
	</view>
</template>

<script>
	const {userPassLogin} = require('@/utils/api')
	const {durationToast} = require('@/utils/util');
	export default {
		data() {
			return {
				userName:'',
				passWord: ''
			}
		},
		mounted() {

		},
		methods: {	
			register(){
				uni.navigateTo({
					url:'./register'
				})
			},
		    async login(){
				if(!this.userName){
					durationToast('请输入用户名！',2000)
					return;
				}
				if(!this.passWord){
					durationToast('请输入密码！',2000)
					return;
				}
				let userData = {
					username:this.userName,
					password: this.passWord,
				}
				let userInfo = await userPassLogin(userData);
				//debugger
				if(userInfo){
					uni.setStorageSync('token',userInfo.data);
					uni.switchTab({
						url:'/pages/index/index'
					})
				}
			}
		}
	}
</script>


<style>
	.uni-form-item .title{
	    width: 140upx;
	}
	.form-btn{
		margin-top:50upx;
		width: 80%;
		border-radius: 50upx;
	}
	.login-btn{
		background-color:#18BC37;
		color:#fff;
	}
	.register-btn{
		/* background-color: #009ad6; */
		color:#18BC37;
		/* border:1upx solid #fff; */
	}
</style>
