<template>
	<view class="container bg-base">
		<uni-table border emptyText="暂无更多数据" class="base-table">
		    <uni-tr>
		        <uni-th align="center">序号</uni-th>
		        <uni-th align="center">设备ID</uni-th>
		        <uni-th align="center">设备名称</uni-th>
				 <uni-th align="center">在线状态</uni-th>
				<uni-th align="center">操作</uni-th>
		    </uni-tr>
		    <!-- 表格数据行 -->
		    <uni-tr v-for="item in dataList" v-key="item.ID">
				<uni-td>{{item.num}}</uni-td>
				<uni-td>{{item.sn}}</uni-td>
				<uni-td>{{item.terminalName}}</uni-td>
				<uni-td>{{item.isOnLine ? '在线':'不在线'}}</uni-td>
				<uni-td>
					<view class="uni-group">
						<button style="border:none;color:#009ad6" v-if="item.sn == currentSn" type="default" size="mini" disabled="true" plain="true">已调用</button>
						<button v-else size="mini" type="primary" @click="callDevice(item)">调用</button>
						<button size="mini" type="warn" @click="unbindDevice(item)" style="margin-left:20upx">解绑</button>
					</view>
				</uni-td>
		    </uni-tr>
		</uni-table>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog content="是否确定解绑？" mode="base"  :before-close="true" @close="closeBind" @confirm="unhandleBind"></uni-popup-dialog>
		</uni-popup>
		<view>
			<uni-fab
			    class="uniFab"
			    popMenu = false
				horizontal="right"
				vertical="bottom"
				direction="horizontal"
				@fabClick="trigger()"
			></uni-fab>
		</view>
	</view>	
</template>

<script>
	const {reqSn,unBindDevice} = require('@/utils/api');
	const {durationToast} = require('@/utils/util');
	export default {
		data(){
			return {
			  dataList:[],
			  selectedDevice:{},
			  currentSn: '',
			}
		},
		mounted() {
			this.getDevices();
			this.currentSn = uni.getStorageSync('terminalKey') || '';
		},
		methods:{
			async getDevices(){
				let res = await reqSn({type:0,page:0,pageSize:1000});
				this.handleDevices(res);
			},
			trigger(){
				uni.navigateTo({
					url:'./binding'
				})
			},
			//调用当前设备
			callDevice(item){
				this.currentSn = item.sn;
				uni.setStorageSync('terminalKey',item.sn);
				uni.switchTab({
					url:'../index/index'
					// success: (res) => {
					// 	let page = getCurrentPages().pop();
					// 	console.log('pop===page====',page);
					// 	if (page == undefined || page == null) return;
					// 	page.$vm.getConfigureData();
					// },
				})
			},
			//解绑当前设备
			unbindDevice(item){
				this.currentSn = item.sn;
				this.$refs.popup.open();
			},
			closeBind(){
				this.$refs.popup.close();
			},
			//执行设备解绑
			async unhandleBind(){
				const res = await unBindDevice({sn: this.currentSn});
				if(res.code == 0){
					durationToast('设备解绑成功！',2000)
					this.getDevices();
				}else{
					durationToast('设备解绑失败！',2000)
				}
				this.closeBind();
			},
			handleDevices(result){
				let list = [];
				if(result && result.code == 0){
					const data = result.data;
					data.forEach((item,index)=>{
						let itemObj = item;
						itemObj.num=index+1;
						itemObj.sn = item.terminalKey;
						list.push(itemObj);
					})
					console.log("list===", list, data);
				}
				this.dataList = list;
			}
		}
	}
</script>

<style>
	.uniFab{
		box-shadow: 0 1px 5px 2px rgb(0 0 0 / 30%);
	}
</style>
