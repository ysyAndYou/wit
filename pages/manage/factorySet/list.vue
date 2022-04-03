<template>
	<view class="container bg-ff">
		<form @submit="formSubmit" @reset="formReset">
			<view class="page-one">
				<view class="form-item">
					<view class="title">温度传感器数量：</view>
					<input class="uni-input" name="input" placeholder="请输入" v-model="factorySet.temp_senser_num"  type="number"/>
				</view>
				<view class="form-item">
					<view class="title">外部温度传感器：</view>
					<picker class="uni-picker" @change="bindPickerChange" data-index="senser1" :value="factorySet.senser1_status" :range="changeArr">
						<view class="uni-input">{{changeArr[factorySet.senser1_status]}}</view>
					</picker>
				</view>
				<view class="form-item">
					<view class="title">欠科报警传感器：</view>
					<picker class="uni-picker" @change="bindPickerChange" :value="factorySet.senser2_status" data-index="senser2" :range="changeArr">
						<view class="uni-input">{{changeArr[factorySet.senser2_status]}}</view>
					</picker>
				</view>
			<!-- 	<view class="form-item">
					<view class="title">外部报警传感器：</view>
					<picker class="uni-picker" @change="bindPickerChange" :value="changeIndex3" data-index="changeIndex3" :range="changeArr">
						<view class="uni-input">{{changeArr[changeIndex3]}}</view>
					</picker>
				</view> -->
				<view class="form-item">
					<view class="title">外部故障传感器：</view>
					<picker class="uni-picker" @change="bindPickerChange" :value="factorySet.senser3_status" data-index="senser3" :range="changeArr">
						<view class="uni-input">{{changeArr[factorySet.senser3_status]}}</view>
					</picker>
				</view>
				<view class="form-item">
					<view class="title">加热器功率（kw）：</view>
					<view class="form-item-btn" @click="openSet(1)">设置</view>
					<!-- <input class="uni-input" v-show="factorySet.power_fun" v-model="factorySet.power_fun" name="input" placeholder="请输入"  type="number"/> -->
				</view>
				<view class="form-item">
					<view class="title">风扇最低转速（%）：</view>
					<view class="form-item-btn" @click="openSet(2)">设置</view>
					<!-- <view>
					  <slider value="58" @change="sliderChange" min="42" max="76" show-value />
				    </view> -->
					<!-- <input class="uni-input"  v-show="factorySet.fan_low_speed" v-model="factorySet.fan_low_speed" name="input" placeholder="请输入"  type="number"/> -->
					<!-- <input class="uni-input" name="input" placeholder="请输入" /> -->
				</view>
				<view class="form-item">
					<view class="title">温度偏移：</view>
					<uni-number-box v-model="factorySet.temp_offset" step=0.1 :min="-5.0"></uni-number-box>
				<!-- 	<input class="uni-input" name="input" placeholder="请输入" /> -->
				</view>
			</view>
			<view class="page-two" style="background-color: #fff;">
				<view class="form-item">
					<view class="title">省电模式：</view>
					<!-- <input class="uni-input" name="input" placeholder="请输入" /> -->
					<picker class="uni-picker" @change="powerTypeChange" :value="factorySet.power_fun" :range="powerTypeArr">
						<view class="uni-input">{{powerTypeArr[factorySet.power_fun]}}</view>
					</picker>
				</view>
				<view class="form-item">
					<view class="title">省电信息：</view>
					<button class="form-item-btn" size="mini" @click="checkPowerInfo()">查看</button>
				</view>
				<view class="form-item">
					<view class="title">烘烤省电基数：</view>
					<input class="uni-input" name="input" v-model="factorySet.power_fun_base1" placeholder="请输入" />
				</view>
				<view class="form-item">
					<view class="title">保温省电基数：</view>
					<input class="uni-input" name="input" v-model="factorySet.power_fun_base2" placeholder="请输入" />
				</view>
				<view class="form-item">
					<view class="title">用户密码：</view>
					<!-- <input class="uni-input" type="hiden" v-model="factorySet.pass1" name="input" placeholder="请输入" /> -->
					<view class="form-item-btn" @click="openPwd(1)">设置</view>
				</view>
				<view class="form-item">
					<view class="title">管理员密码：</view>
					<!-- <input class="uni-input" type="hiden" v-model="factorySet.pass2" name="input" placeholder="请输入" /> -->
					<view class="form-item-btn" @click="openPwd(2)">设置</view>
				</view>
				<view class="form-item">
					<view class="title">工厂密码：</view>
					<!-- <input class="uni-input" type="hiden" v-model="factorySet.pass3" name="input" placeholder="请输入" /> -->
					<view class="form-item-btn" @click="openPwd(3)">设置</view>
				</view>
				<view class="form-item">
					<view class="title">恢复出产设置：</view>
					<button class="form-item-btn" @click="recover()" size="mini">恢复</button>
				</view>
			</view>
		</form>
		<uni-popup ref="popup" type="dialog" :animation="true" >
			<form class="dialog-form flex-center">
				<view class="uni-form-item flex-center">
					<view class="title">{{popupTitle}}：</view>
					<input v-if="popupType==1" class="uni-input" v-model="popupValue" name="input" :placeholder="popupPlaceholder" />
					<slider class="slider" v-if="popupType==2" :value="factorySet.fan_low_speed" @change="sliderChange" min="42" max="76" show-value />
				</view>
				<view class="form-btns-box">
					<view class="pass-btn btn-canle" @click="cancleBtn(1)">取消</view>
					<view class="pass-btn btn-sure" @click="sureBtn(2)">确定</view>
				</view>
			</form>
		</uni-popup>
		<!-- 提示框 -->
		<uni-popup ref="tipPopup" type="dialog">
			<uni-popup-dialog content="是否确定恢复出场设置？" mode="base"  :before-close="true" @close="handlecancle()" @confirm="handleSure()"></uni-popup-dialog>
		</uni-popup>
	<!-- 	<view class="btns-box flex-btw">
			<button type="default" size="mini" @click="goto('/pages/about/about')">下一页</button>
			<button type="default" size="mini" @click="goto('/pages/about/about')">确定</button>
		</view> -->
		<uni-popup ref="popupPwd" type="dialog" :animation="true" >
			<form class="dialog-form flex-center">
				<view class="uni-form-item flex-center">
					<view class="title">密码：</view>
					<input class="uni-input" v-model="passWord" password=true name="input" placeholder="请输入密码" />
				</view>
				<view class="form-btns-box">
					<view class="pass-btn btn-canle" @click="pwdBtn(1)">取消</view>
					<view class="pass-btn btn-sure" @click="pwdBtn(2)">确定</view>
				</view>
			</form>
		</uni-popup>
		<view class="btns-box">
			<button class="saveBtn" size="mini" type="default">取消</button>
			<button class="saveBtn" size="mini" @click="saveFactoryset()" type="primary">确定</button>
		</view>
	</view>	
</template>
<script>
	const {getMaterialList, getConfigure, setConfigure, setRecover} = require('@/utils/api');
	const {durationToast} = require('@/utils/util');
	export default {
		data(){
			return {
				passWord:'',
				currentUrl:'',
				changeArr:['常闭','常开'],
				powerTypeArr:['按功率计算','按实际测量基数计算'],
				powerType:0,
				popupTitle:'功率（kw）',
				popupPlaceholder:'',
				popupValue:'',
				popupType:1,
				index: 0,
				dataList:[],
				sn:'',
				cmd:5,
				vModelValue:3.1,
				factorySet:{
					'temp_senser_num':'',
					'power_fun_base1':'',
					'power_fun_base2':'',
					'power_fun':'',
					'fan_low_speed':'',
					"temp_offset":'',
					"senser1_status":0,
					"senser2_status":0,
					"senser3_status":0,
					"temp_offset":'',
					"power-fun":'',
					"pass1":'',
					"pass2":'',
					"pass3":''
				},
				id:'',
				pwdType:''
		    }
		},
		async mounted() {
			const terminalKey = uni.getStorageSync('terminalKey');
			this.sn = terminalKey;
			let info = await getConfigure({sn:terminalKey});
			console.log('infoStr===', JSON.parse(info.data));
			this.handleConfigureData(info.data);
		},
		methods: {
			bindPickerChange: function(e) {
				const index = e.currentTarget.dataset.index;
				const status = `${index}_status`;
				this.factorySet[status] = e.target.value;
			},
			powerTypeChange(e){
				this.factorySet.power_fun = Number(e.target.value);
			},
			// 恢复出厂设置
			recover(){
				this.$refs.tipPopup.open();
			},
			async handleSure(){
				const res=await setRecover({sn:this.sn});
				if(res && res.code == 0){
					durationToast('恢复出场设置失败！',2000);
				}else{
					durationToast('恢复出场设置成功！',2000);
				}
				this.handlecancle();
			},
			handlecancle(){
				this.$refs.tipPopup.close();
			},
			handleConfigureData(result){
				const data = JSON.parse(result);
				//省电信息
				console.log('info.data===', data)
				const powerSave = {
					'run_time':data.run_time,
					'seave_all':data.power_seave_all,
					'seave_month':data.power_seave_month,
					'seave_qua':data.power_seave_qua,
					'time': data.today_seave_run_time,
					'month':data.month,
					'day':data.today_seave_day,
					'poewrs':data.today_seave_save_power,
					'year':data.today_seave_year
				}
				this.factorySet = data;
				console.log('powerSave',powerSave)
				uni.setStorageSync('powerInfo',JSON.stringify(powerSave));
			},
			async saveFactoryset(){
				const params = {
					cmd: 11,
					sn:this.sn,
					...this.factorySet
				}
				const res = await setConfigure(params);
				if(res && res.code == 0){
					durationToast('更新成功！',2000);
				}else{
					durationToast('更新失败！',2000);
				}
				console.log('保存成功！', res);
			},
			openSet(type) {
				this.popupType = type;
				if(type == 1){
					this.popupTitle = '功率（KW)';
					this.popupPlaceholder = '功率（KW)';
					this.popupValue = this.factorySet.power_fun;
				}else{
					this.popupTitle = '转速（%)';
				//	this.popupPlaceholder = '请输入转速（%)';
				}
				this.$refs.popup.open();
			},
			sliderChange(e) {
				console.log('value 发生变化：' + e.detail.value)
				this.factorySet.fan_low_speed = e.detail.value;
			},
			openPwd(type){
				this.pwdType = type;
				this.$refs.popupPwd.open();
			},
			cancleBtn(){
				this.close();
			},
			sureBtn(){
				if(this.popupType == 1){
					this.factorySet.power_fun = this.popupValue;
				}
				// else{
				// 	this.factorySet.popupValue = this.popupValue;
				// }
				this.close();
			},
			close() {
				this.popupValue = '';
				this.$refs.popup.close();
			},
			closePwd(){
			  this.$refs.popupPwd.close();	
			},
			getCurrentRow(rowObj){
				console.log('id===', rowObj.num);
				this.id = rowObj.num;
			},
			pwdBtn(type){
				if(type === 2){
					if(this.passWord.length!==6){
						durationToast('请将密码设置为6位数字！',2000);
						return;
					}
					if(this.pwdType ==1){
						this.factorySet.pass1 = this.passWord;
					}else if(this.pwdType ==2){
						this.factorySet.pass2 = this.passWord;
					}else if(this.pwdType ==3){
						this.factorySet.pass3 = this.passWord;
					}
					this.passWord = '';
					this.closePwd();
				}else{
					this.closePwd();
				}
			},
			//删除用户设置
			delUserSet(){
				if(this.id){
					this.userSet.id = this.id;
					this.handleDel(id);
				}else{
				  durationToast('请先选择某一行数据！',2000);	
				}
			},
			//执行删除操作
			async handleDel(id){
			   	const res = await putCmd(param);
			   	if(res && res.code == 0){
			   		durationToast('删除成功！',2000);
			   	}else{
			   		durationToast('删除失败！',2000);
			   	}
			},
			//添加用户设置
			async addUserSet(param){
				let res = await putCmd(param);
				if(res && res.code == 0){
					this.close();
				}else{
					durationToast('添加失败',2000);
				}
			},
			//查看省电信息
			checkPowerInfo(){
				uni.navigateTo({
					url:'/pages/manage/factorySet/powerSaved'
				})
			},
			handleRes(result){
				let list = [];
				if(result && Array.isArray(result)){
					result.forEach((item,index)=>{
						let itemObj = item;
						itemObj.num=index+1;
						itemObj.status = item.state == 1? '调用':'未调用';
						list.push(itemObj);
					})
				}
				this.dataList = list;
				//console.log('this.dataList===', this.dataList);
			}
		}
	}
</script>

<style>
	.form-item{
		display: flex;
		margin:10upx 16upx;
		border-bottom:1upx solid #E1E1E1;
		padding:10upx 16upx;
	}
	.form-item-btn{
		margin:0;
	}
	.uni-form-item{
		width: 600upx;
		padding: 20rpx 40rpx;
	}
	.slider{
		/* width: 600upx; */
		flex:1;
	}
	.form-item .title{
		color:#303133;
		width: 360upx;;
	}
	.uni-input{
		borer:0;
		padding:0;
		color:#000;
		flex:1;
	}
	.form-item-btn{
		color:#000;
	}
	.uni-picker{
		width: 100%;
	}
	.uni-picker {
		width: auto;
	}
	.dialog-form .uni-input{
		border:1upx solid #fff;
		padding:8upx 10upx;
	}
	.btns-box{
		margin-top:60upx;
		position: fixed;
		bottom: -1;
		width: 100%;
		display: flex;
		padding: 30upx;
		justify-content:space-between;
		background: #009ad6;
	}
	.page-two{
		padding-bottom: 150upx;
	}
</style>
