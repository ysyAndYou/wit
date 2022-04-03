<template>
	<view class="container bg-base">
		<uni-table border emptyText="暂无更多数据" class="base-table">
		    <!-- 表头行 stripe-->
		    <uni-tr>
		        <uni-th align="center" width="100rpx">序号</uni-th>
		        <uni-th align="center">原料类别</uni-th>
		        <uni-th align="center" width="260rpx">干燥比（%）</uni-th>
		    </uni-tr>
		    <!-- 表格数据行 -->
		    <uni-tr :bgColor="item.num == selectedNum ? '#009ad6':''" v-for="item in dataList" v-key="item.cmd"  @row-click="getCurrentRow(item)">
		        <uni-td>{{item.num}}</uni-td>
		        <uni-td>{{item.type}}</uni-td>
		        <uni-td>{{item.dry}}</uni-td>
		    </uni-tr>
		</uni-table>
		<view class="btns-box flex-btw">
			<button type="default" size="mini" @click="openUserSet()">修改</button>
			<!-- <button type="default" size="mini" @click="goto('/pages/about/about')">确定</button> -->
		</view>
		<uni-popup ref="popup" type="dialog" :animation="true" >
			<form class="dialog-form flex-center">
				<!-- <view class="uni-form-item flex-center">
					<view class="title">原料类别：</view>
					<input class="uni-input" v-model="manageSet.type" type="text"  placeholder="请输入原料类别" />
				</view> -->
				<view class="uni-form-item flex-center">
					<view class="title">干燥比：</view>
					<input class="uni-input" v-model="manageSet.dry" type="text"  placeholder="请输入干燥比(°C)" />
				</view>
				<view class="form-btns-box">
					<view class="pass-btn btn-canle" @click="cancleBtn(1)">取消</view>
					<view class="pass-btn btn-sure" @click="sureBtn(2)">确定</view>
				</view>
			</form>
		</uni-popup>
	</view>	
</template>
<script>
	const {getMaterialList,updateMaterial} = require('@/utils/api');
	const {durationToast} = require('@/utils/util');
	export default {
		data(){
			return {
				dataList:[],
				sn:'',
				cmd:5,
				selectedNum:'',
				manageSet:{
					"type":"",//原料类别
					"dry":'',//干燥比
				},
				id:'',
				refreshTimer:'',
				refreshTime:0
		    }
		},
		mounted() {
			const terminalKey = uni.getStorageSync('terminalKey');
			this.sn = terminalKey;
			this.getMaterialListData();
		},
		methods: {
			//刷新数据
			refreshData(){
				let _this = this;
				this.refreshTimer = setInterval(()=>{_this.handleRefresh()},2000);
			},
			handleRefresh(){
				this.refreshTime++;
				if(this.refreshTime > 5){
					this.refreshTime = 0;
					this.refreshTimer && clearInterval(this.refreshTimer);
				}else{
					this.getMaterialListData('-1');
				}
			},
			async getMaterialListData(msg=""){
				const data = {
					sn: this.sn,
					page:0,
					pageSize:1000
				}
				let info = await getMaterialList(data,msg);
				this.handleRes(info.data);
			},
			openUserSet() {
				if(this.id){
					this.manageSet.id = this.id;
					this.$refs.popup.open();
				}else{
				  durationToast('请先选择某一行数据！',2000);	
				}	
			},
			close() {
				this.$refs.popup.close()
			},
			getCurrentRow(rowObj){
				console.log('id===', rowObj.num);
				this.id = rowObj.num;
				this.selectedNum = rowObj.num;
				this.manageSet = rowObj;
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
			   	// const res = await putCmd(param);
			   	// if(res && res.code == 0){
			   	// 	durationToast('删除成功！',2000);
			   	// }else{
			   	// 	durationToast('删除失败！',2000);
			   	// }
			},
			cancleBtn(){
				this.close();
			},
			sureBtn(){
				// const data = {
				// 	"cmd":this.cmd,
				// 	'sn':this.sn,
				// 	...this.userSet
				// }
				// const param = {
				// 	sn: this.sn,
				// 	cmd: this.cmd,
				// 	data: JSON.stringify(data)
				// }
				if(this.manageSet.dry != ""){
					let param = {
						'sn': this.sn,
						"type": this.manageSet.type || '',//原料类别
						"planTime": this.manageSet.planTime,//预烘时间
						"temp": this.manageSet.temp,
						"dry": this.manageSet.dry ? Number(this.manageSet.dry) : 0,
						'ID':this.manageSet.ID
					}
					this.updateManageSet(param);
				}else{
					durationToast('干燥比不能为空！',2000);
				}	
			},
			//添加管理设置
			async updateManageSet(param){
				let res = await updateMaterial(param);
				if(res && res.code == 0){
					this.close();
					//this.getMaterialListData();
					durationToast('修改成功',2000);
					this.refreshData();
				}else{
					durationToast('修改失败',2000);
				}
			},
			handleRes(result){
				let list = [];
				if(result && Array.isArray(result)){
					result.forEach((item,index)=>{
						let itemObj = item;
						itemObj.num=index+1;
						//  itemObj.status = item.state == 1? '调用':'未调用';
						list.push(itemObj);
					})
				}
				this.dataList = list;
			}
		}
	}
</script>

<style>
</style>

