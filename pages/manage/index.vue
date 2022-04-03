<template>
	<view class="container bg-base flex-d-center">
		<view class="info-box" @click="open('/pages/manage/userSet/list',0)">
			<text>用户设定</text>
		</view>
		<view class="info-box" @click="open('/pages/manage/manageSet/list',1)">
			<text>管理设定</text>
		</view>
		<view class="info-box" @click="open('/pages/manage/factorySet/list',2)">
			<text>厂家设定</text>
		</view>
		<uni-popup ref="popup" type="dialog" :animation="true" >
			<form class="dialog-form flex-center">
				<view class="uni-form-item flex-center">
					<view class="title">密码：</view>
					<input class="uni-input" v-model="passWord" type="number" password=true name="input" placeholder="请输入密码" />
				</view>
				<view class="form-btns-box">
					<view class="pass-btn btn-canle" @click="pwdBtn(1)">取消</view>
					<view class="pass-btn btn-sure" @click="pwdBtn(2)">确定</view>
				</view>
			</form>
		</uni-popup>
		<!-- <uni-popup ref="popup" type="bottom">底部弹出 Popup</uni-popup> -->
	</view>
</template>
<script>
	const {getConfigure} = require('@/utils/api');
    const {durationToast} = require('@/utils/util');
  	export default {
		data(){
			return {
				passWord:'',
				currentUrl:'',
				pwds:[],
				curType:0
			}
		},
		async mounted() {
			const terminalKey = uni.getStorageSync('terminalKey');
			const data = {
				sn: terminalKey,
				cmd:'12'
			}
			let info = await getConfigure(data);
		    info && this.handlePwdRes(info.data);
		},
		methods: {
			open(url,type) {
				    this.currentUrl = url;
					this.passWord = '';
					this.curType = type;
					this.$refs.popup.open()
				},
			close() {
				this.$refs.popup.close()
			},
			pwdBtn(type){
				if(type === 2){
					if(this.pwds[this.curType] == this.passWord){
						uni.navigateTo({
						    url: this.currentUrl,
						});
						this.close();
					}else{
						durationToast('您输入的密码错误！',2000);
					}
				}else{
					this.close();
				}
				//后面删除
				// uni.navigateTo({
				//     url: this.currentUrl,
				// });
				// this.close();
			},
			//请求的密码处理
			handlePwdRes(result){
				const res = JSON.parse(result);
				this.pwds = [res.pass1,res.pass2,res.pass3];
			}
		}
	}
</script>
<style>
	.flex-d-center{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.info-box{
		margin-top:60upx;
		width: 220upx;
		height: 80upx;
		border:1upx solid #fff;
		color:#fff;
		border-radius: 20upx;
		text-align: center;
		line-height: 80upx;
	}
	.dialog-form{
		background-color: #009ad6;
		/* height: 300upx; */
		padding-top:30upx;
		border-radius: 20upx;
	}
	.uni-form-item{
		padding:50upx 50upx;
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
	.form-btns-box{
		display: flex;
		height: 80upx;
		line-height: 80upx;
		border-top: 1rpx solid #fff;
	}
	.btn-sure{
		color:#07c160;
		border-left:1upx solid #fff;
	}
	.pass-btn{
		width: 50%;
		text-align: center;
	}
</style>
