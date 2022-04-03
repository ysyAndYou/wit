<template>
	<view class="container">
		<uni-table border emptyText="暂无更多数据" class="base-table">
		    <!-- 表头行 stripe-->
		    <uni-tr>
		        <uni-th align="center" width="20rpx">序号</uni-th>
		        <uni-th align="center" width="90rpx">日期</uni-th>
		        <uni-th align="center" width="90rpx">时间</uni-th>
				<uni-th align="center" width="90rpx">当前故障代码</uni-th>
				<uni-th align="center" width="60rpx">重新启动设备</uni-th>
		    </uni-tr>
		    <!-- 表格数据行 -->
		    <uni-tr v-for="item in dataList" v-key="item.cmd" @row-click="getCurrentRow(item)" >
		        <uni-td>{{item.id}}</uni-td>
		        <uni-td>{{item.name}}</uni-td>
		        <uni-td>{{item.time}}</uni-td>
				<uni-td>{{item.temp}}</uni-td>
				<uni-td>{{item.status}}</uni-td>
		    </uni-tr>
		</uni-table>
		<!-- <view class="btns-box flex-btw">
			<button type="default" size="mini" @click="callMaterial()">调用</button>
			<button type="default" size="mini" @click="goto('/pages/about/about')">确定</button>
		</view> -->
	</view>	
</template>

<script>
	//const {,putCmd} = require('@/utils/api');
	const {durationToast} = require('@/utils/util');
	export default {
		data(){
			return {
				dataList:[],
				sn:'',
				cmd:5,
				materialList:{
					"name":"",//原料类别
					"time":'',//预烘时间
					"temp":'',//温度
					"dry":'',//干燥比
				},
				id:''
		    }
		},
		async mounted() {
			// const terminalKey = uni.getStorageSync('terminalKey');
			// this.sn = terminalKey;
			// const data = {
			// 	sn: terminalKey,
			// 	cmd:this.cmd
			// }
			// let info = await getCmd(data);
		 //    this.handleRes(info);
		},
		methods: {
			//async 
			callMaterial() {
				if(this.id){
					// const res = await putCmd({id:this.id});
					// if(res && res.code == 0){
					// 	durationToast('调用成功！',2000);
					// }else{
					// 	durationToast('调用失败！',2000);
					// }
				}else{
				  durationToast('请先选择某一行数据！',2000);	
				}
			},
			getCurrentRow(rowObj){
				this.id = rowObj.num;
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
				let list = [{
					'num':1,
					"name":'',//原料类别
					"time":'',//预烘时间
					"temp":'',//温度
					"dry":'',//干燥比
				}];
				if(result && Array.isArray(result)){
					result.forEach((item,index)=>{
						let itemObj = item;
						itemObj.num=index+1;
						list.push(itemObj);
					})
				}
				this.dataList = list;
				console.log('this.dataList===', this.dataList);
			}
		}
	}
</script>

<style>
</style>
