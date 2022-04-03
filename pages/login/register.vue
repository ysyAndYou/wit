<template>
	<view class="container flex-center bg-base">
		<form class="register-form">
			<view class="uni-form-item">
				<view class="title">用户名：</view>
				<input class="uni-input" v-model="register.username" name="input" placeholder="手机号或邮箱" />
			</view>
			<view class="uni-form-item">
				<view class="title">密码：</view>
				<input class="uni-input" v-model="register.password" password="true" name="input" placeholder="请输入密码" />
			</view>
			<view class="uni-form-item">
				<view class="title">确认密码：</view>
				<input class="uni-input" v-model="rePassWord" password="true" name="input" placeholder="请输入密码" />
			</view>
			<view class="uni-form-item">
				<view class="title">验证码：</view>
				<input style="width: 220upx;" class="uni-input" v-model="register.code" name="input" placeholder="请输入验证码" />
				<button @click="getCodeFn()" style="margin-left: 12upx; width: 200upx;" size="mini">{{codebtnstr}}</button>
			</view>
			<view class="uni-form-item">
				<view class="title">单位名称：</view>
				<input class="uni-input" v-model="register.companyName" name="input" placeholder="请输入单位名称" />
			</view>
			<!-- <view class="form-btns-box"> -->
				<button class="form-btn login-btn" @click="handleRegister()">注册</button>
			<!-- </view> -->
		</form>
	</view>
</template>

<script>
	const {userRegister,getCode} = require('@/utils/api')
	const {durationToast} = require('@/utils/util');
	export default {
		data() {
			return {
				rePassWord:"",
				codebtnstr: '获取验证码',
				timer:'',
				second:60,
				register:{
					'username':'',
					'password': '',
					'code':'',
					'companyName':'',
					'uuid':''
				}
			}
		},
		mounted() {

		},
		beforeDestroy(){
			clearInterval(this.timer);
		},
		methods: {		
		    async handleRegister(){
				if(this.verifyUserName() && this.valifyUserInfo()){
					let res = await userRegister(this.register);
					if(res && res.code == 0){
						durationToast('注册成功！',2000);
						uni.navigateBack({
							url:"./login"
						});
					}
				}
			},
			async getCodeFn(){
				if(this.verifyUserName()){
					let type = 0;
					const username = this.register.username;
					if(this.validatePhone(username)){
						type = 1;
					}
					const res = await getCode({type,username});
					console.log('获取验证码返回===', res)
					let _this = this;
					//if(res && (res.code==-1 || res.code == 0)){
						durationToast('验证码已发送！',2000);
						this.second = 60;
						this.timer = setInterval(()=>{_this.timerFn()},1000);
						this.register.uuid = res.data;
					//}
				}
			},
			timerFn(){
				this.second --;
				if(this.second > 0){
					this.codebtnstr = `${this.second}s`;
				}else{
					this.codebtnstr = `重新获取`;
					this.timer && clearInterval(this.timer);
				}
			},
			verifyUserName(){
				if(this.register.username == ''){
					durationToast('请输入用户名！',2000);
					return false;
				}
				if(!this.validatePhone(this.register.username) && !this.validateEmail(this.register.username)){
					durationToast('用户名为手机号或邮箱！',2000);
					return false;
				}
				return true;
			},
			valifyUserInfo(){
				if(!this.register.password){
					durationToast('请输入密码！',2000);
					return false;
				}else if(this.register.password !== this.rePassWord){
					durationToast('两次输入的密码不一致！',2000);
					return false;
				}else if(!this.register.code){
					durationToast('请输入验证码！',2000);
					return false;
				}
				return true;
			},
			validatePhone(phone){
			  const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
			  return reg.test(phone);
			},
			validateEmail(email){
			  const reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
			  return reg.test(email)
			}
		}
	}
</script>


<style>
	.uni-form-item .title{
	    width: 172upx;
	}
	.form-btn{
		margin-top:50upx;
		width: 90%;
		border-radius: 50upx;
	}
	.login-btn{
		background-color:#18BC37;
		color:#fff;
	}
	.uni-form-item {
	    padding: 20rpx 20rpx;
		display: flex;
		align-items: center;
	}
	.register-form{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
</style>
