<template>
	<view class="container bg-base">
		<uni-table border emptyText="暂无更多数据" class="base-table">
		    <!-- 表头行 stripe-->
		    <uni-tr>
		        <uni-th align="center" width="20rpx">序号</uni-th>
		        <uni-th align="center" width="90rpx">原料类别</uni-th>
		        <uni-th align="center" width="90rpx">预烘时间（分钟）</uni-th>
				<uni-th align="center" width="90rpx">温度设定（°C）</uni-th>
		    </uni-tr>
		    <!-- 表格数据行 -->
		    <uni-tr :bgColor="item.num == selectedNum ? '#009ad6':''" v-for="item in dataList" v-key="item.ID"  @row-click="getCurrentRow(item)">
				<uni-td>{{item.num}}</uni-td>
				<uni-td>{{item.type}}</uni-td>
				<uni-td>{{item.planTime}}</uni-td>
				<uni-td>{{item.temp}}</uni-td>
		    </uni-tr>
		</uni-table>
		<view class="btns-box flex-btw">
			<button type="default" size="mini" @click="openUserSet(1)">增加</button>
			<button v-if="dataList.length" type="default" size="mini" @click="openUserSet(2)">修改</button>
			<button v-if="dataList.length" type="default" size="mini" @click="delUserSet()">删除</button>
		</view>
		<uni-popup ref="popup" type="dialog" :animation="true" >
			<form class="dialog-form flex-center">
				<view class="uni-form-item flex-center">
					<view class="title">原料类别：</view>
					<input class="uni-input" v-model="userSet.type" type="text"  placeholder="请输入原料类别" />
				</view>
				<view class="uni-form-item flex-center">
					<view class="title">预烘时间：</view>
					<input class="uni-input" v-model="userSet.planTime" type="text"  placeholder="请输入预烘时间(分钟)" />
				</view>
				<view class="uni-form-item flex-center">
					<view class="title">温度设定：</view>
					<input class="uni-input" v-model="userSet.temp" type="text"  placeholder="请输入温度设定(°C)" />
				</view>
				<view class="form-btns-box">
					<view class="pass-btn btn-canle" @click="cancleBtn(1)">取消</view>
					<view class="pass-btn btn-sure" @click="sureBtn()">确定</view>
				</view>
			</form>
		</uni-popup>
		<!-- 删除提示框 -->
		<uni-popup ref="delPopup" type="dialog" :animation="true" >
			<view class="dialog-form flex-center del-dialog">
				<view class="text">是否确定删除？</view>
				<view class="form-btns-box">
					<view class="pass-btn btn-canle" @click="cancleDel()">取消</view>
					<view class="pass-btn btn-sure" @click="handleDel()">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>	
</template>

<script>
	const {getMaterialList,addMaterial,updateMaterial, delMaterial} = require('@/utils/api');
	const {durationToast} = require('@/utils/util');
	export default {
		data(){
			return {
				passWord:'',
				currentUrl:'',
				pwds:[],
				dataList:[],
				sn:'',
				cmd:5,
				selectedNum:'',
				curType:'',
				
				userSet:{
					"type":"",//原料类别
					"planTime":'',//预烘时间
					"temp":''	
				},
				params:{
					page:0,
					pageSize:100,
				},
				id:'',
				refreshTimer:'',
				refreshTime:0
		    }
		},
	    mounted() {
			const terminalKey = uni.getStorageSync('terminalKey');
			this.sn = terminalKey;
			this.params.sn = terminalKey;
			this.handleGetMaterialList();
		},
		onUnload(){
			this.refreshTimer && clearInterval(this.refreshTimer);
		},
		methods: {
           //刷新数据
			refreshData(){
				let _this = this;
				this.refreshTimer = setInterval(()=>{_this.handleRefresh()},2000);
			},
			handleRefresh(){
				this.refreshTime++;
				console.log('this.refreshTime===', this.refreshTime);
				if(this.refreshTime > 5){
					this.refreshTime = 0;
					this.refreshTimer && clearInterval(this.refreshTimer);
				}else{
					this.handleGetMaterialList('-1');
				}
			},
			//加载材料列表
			async handleGetMaterialList(msg=''){
				let info = await getMaterialList(this.params,msg);
				this.handleRes(info);
			},
			openUserSet(type) {
				this.curType = type;
				if(type == 1){
					let userSetObj = {
						"type":"",//原料类别
						"planTime":'',//预烘时间
						"temp":'',//温度
						"sn": this.sn
					}
					this.userSet = userSetObj;
					this.$refs.popup.open();
				}else{
					if(this.id){
						//this.userSet = userSetObj;
						//this.userSet.id = this.id;
						this.$refs.popup.open();
					}else{
					  durationToast('请先选择某一行数据！',2000);	
					}
				}	
			},
			close() {
				this.$refs.popup.close()
			},
			getCurrentRow(rowObj){
				//console.log('id===', rowObj.num);
				this.selectedNum = rowObj.num;
				this.id = rowObj.ID;
				this.userSet=rowObj;
			},
			//删除用户设置
			delUserSet(){
				if(this.id){
					this.userSet.ID = this.id;
					this.$refs.delPopup.open();
					//this.handleDel();
				}else{
				  durationToast('请先选择某一行数据！',2000);	
				}
			},
			//执行删除操作
			async handleDel(){
				const param = {
					sn:this.sn,
					ID:this.id
				}
			   	const res = await delMaterial(param);
			   	if(res && res.code == 0){
			   		durationToast('删除成功！',2000);
					this.$refs.delPopup.close();
					this.refreshData();
					//this.handleGetMaterialList();
			   	}else{
			   		durationToast('删除失败！',2000);
			   	}
			},
			cancleBtn(){
				this.close();
			},
			sureBtn(){
				let param = {
					'sn': this.sn,
					"type": this.userSet.type || '',//原料类别
					"planTime": this.userSet.planTime ? Number(this.userSet.planTime):0,//预烘时间
					"temp": this.userSet.temp ? Number(this.userSet.temp) : 0,
					"dry": 0,
				}
				if(this.curType==1){
					this.addUserSet(param);
				}else{
					param.ID = this.userSet.ID || 0;
					this.updateUserSet(param)
				}
				
			},
			//添加用户设置
			async addUserSet(param){
				let res = await addMaterial(param);
				if(res && res.code == 0){
					durationToast('添加成功',2000);
					this.close();
					this.refreshData();
					//this.handleGetMaterialList();
				}else{
					durationToast('添加失败',2000);
				}
			},
			//修改用户设置
			async updateUserSet(param){
				const res = await updateMaterial(param);
				if(res.code == 0){
					durationToast('修改成功',2000);
					this.close();
					this.refreshData();
					//this.handleGetMaterialList();
				}else{
					durationToast('修改失败',2000);
				}
				console.log("更新用户信息..",res);
			},
			handleRes(info){
				let list = [];
				if(info.code == 0){
					const result = info.data;
					if(result && Array.isArray(result)){
						result.forEach((item,index)=>{
							let itemObj = item;
							itemObj.num=index+1;
							itemObj.status = item.state == 1 ? '调用':'未调用';
							list.push(itemObj);
						})
					}
				}else{
					durationToast('服务器异常，请稍后重试！',2000);
				}
				this.dataList = list;
				//console.log('this.dataList===', this.dataList);
			},
			cancleDel(){
				this.$refs.delPopup.close()
			}
		}
	}
</script>

<style lang="scss">
	.del-dialog{
		/* padding: 60upx; */
	   flex-direction: column;
	   .form-btns-box{
		   width: 100%;
	   }
	   .text{
		   padding:38upx 80upx;
	   }
	}
</style>
