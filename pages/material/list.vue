<template>
	<view class="container bg-base">
		<view style="padding-bottom: 120upx;">
			<uni-table border emptyText="暂无更多数据" class="base-table" >
			    <!-- 表头行 stripe-->
			    <uni-tr>
			        <uni-th align="center" width="20rpx">序号</uni-th>
			        <uni-th align="center" width="90rpx">原料类别</uni-th>
			        <uni-th align="center" width="90rpx">预烘时间(分钟)</uni-th>
					<uni-th align="center" width="90rpx">温度设定（度）</uni-th>
					<uni-th align="center" width="60rpx">状态</uni-th>
			    </uni-tr>
			    <!-- 表格数据行 -->
			    <uni-tr :bgColor="item.num == selectedNum ? '#009ad6':''" v-for="item in dataList" v-key="item.cmd" @row-click="getCurrentRow(item)" >
			        <uni-td>{{item.num}}</uni-td>
			        <uni-td>{{item.type}}</uni-td>
			        <uni-td>{{item.planTime}}</uni-td>
					<uni-td>{{item.temp}}</uni-td>
					<uni-td>{{item.status}}</uni-td>
			    </uni-tr>
			</uni-table>
		</view>
		<view class="btns-box flex-btw">
			<button type="default" size="mini" @click="callMaterial()">调用</button>
			<!-- <button type="default" size="mini" @click="goto('/pages/about/about')">确定</button> -->
		</view>
	</view>	
</template>

<script>
	const {getMaterialList,updateUserSet,setConfigure} = require('@/utils/api');
	const {durationToast} = require('@/utils/util');
	export default {
		data(){
			return {
				dataList:[],
				sn:'',
				cmd:5,
				selectedNum:'',
				materialList:{
					"type":0,//原料类别
					"planTime":'',//预烘时间
					"temp":'',//温度
					"state":'',//状态
				},
				id:''
		    }
		},
		async mounted() {
			const terminalKey = uni.getStorageSync('terminalKey');
			this.sn = terminalKey;
			const data = {
				sn: terminalKey,
				page:1,
				pageSize:1000
			}
			let info = await getMaterialList(data);
		    this.handleRes(info.data);
		},
		methods: {
			async callMaterial() {
				//console.log('trans_num = num',this.curMatrial);
				if(this.id){
					const configer = uni.getStorageSync('configer');
					let params = configer ? JSON.parse(configer) : {};
					params.trans_num = this.id;
					params.cmd = '11';
					const res = await setConfigure(params);
					if(res && res.code == 0){
						durationToast('调用成功！',2000);
						uni.switchTab({
							url:'../index/index'
							// success: (res) => {
							// 	let page = getCurrentPages().pop();
							// 	if (page == undefined || page == null) return;
							// 	page.$vm.getConfigureData();
							// },
						})
					}else{
						durationToast('调用失败！',2000);
					}
				}else{
				  durationToast('请先选择某一行数据！',2000);	
				}
			},
			getCurrentRow(rowObj){
				// this.curMatrial = rowObj;
				// console.log('rowObj===', rowObj);
				this.selectedNum = rowObj.num;
				// console.log('rowObj===', rowObj, this.selectedNum);
				this.id = rowObj.ID;
			},
			cancleBtn(){
				this.close();
			},
			sureBtn(){
				const data = {
					"cmd":this.cmd,
					'sn':this.sn,
					...this.materialList
				}
				const param = {
					sn: this.sn,
					cmd: this.cmd,
					data: JSON.stringify(data)
				}
				this.addUserSet(param);
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
			handleRes(result){
				let list = [];
				if(result && Array.isArray(result)){
					result.forEach((item,index)=>{
						let itemObj = item;
						itemObj.num=index+1;
						itemObj.status = item.state == 1 ? '调用':'未调用';
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
	.itemNum{
		background-color: #007AFF;
	}
</style>
