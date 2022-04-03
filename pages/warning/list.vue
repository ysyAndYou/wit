 <template>
	<view class="container bg-base">
		<uni-table border emptyText="暂无更多数据" class="base-table">
		    <!-- 表头行 stripe-->
		    <uni-tr class="thead-gd">
		        <uni-th align="center" width="20rpx">序号</uni-th>
		        <uni-th align="center" width="90rpx">日期</uni-th>
		        <uni-th align="center" width="90rpx">时间</uni-th>
				<uni-th align="center" width="90rpx">报警内容</uni-th>
		    </uni-tr>
		    <!-- 表格数据行 -->
			<!-- <view style="height: 800upx;"> -->
				<uni-tr :bgColor="item.num == selectedNum ? '#009ad6':''" v-for="(item,index) in warnList" :key="item.num" @row-click="getCurrentRow(item)">
					<uni-td>{{item.num}}</uni-td>
					<uni-td>{{item.date}}</uni-td>
					<uni-td>{{item.time}}</uni-td>
					<uni-td>{{item.message}}</uni-td>
				</uni-tr>
			<!-- </view> -->
		</uni-table>
		<view class="btns-box flex-btw" style="margin-top:120upx;">
			<button type="default" size="mini" @click="delMaterial()">删除</button>
			<button type="default" size="mini" @click="goBack()">返回</button>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog content="是否确定删除？" mode="base"  :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>	
</template>

<script>
	const {getCmd,getAlarmList,delAlarm} = require('@/utils/api')
	const {} = require('@/utils/util')
	export default {
		data() {
			return {
				warnList:[],
				sn:'',
				cmd:'7',
				selectedNum:'',
				param: {
					sn:'',
					page: 0,
					pageSize: 100,
				}
			}
		},
		async mounted() {
			const terminalKey = uni.getStorageSync('terminalKey');
			this.sn = terminalKey;
			this.param.sn = this.sn;
			const info = await getAlarmList(this.param);
			this.handleListData(info.data);
		},
		methods: {
			//点击当前行
			getCurrentRow(rowObj){
				this.selectedNum = rowObj.num;
				this.id = rowObj.ID;
			},
			delMaterial(){
				this.$refs.popup.open();
			},
			confirm(){
				this.handleDelMaterial();
			},
			close(){
				this.$refs.popup.close();
			},
			async handleDelMaterial(){
				console.log('this.id====', this.id)
				const res = await delAlarm({ID: this.id});
				if(res){
					durationToast('删除成功!', 2000);
					const info = await getAlarmList(this.param);
					this.handleListData(info);
				}else{
					durationToast('删除失败！', 2000);
				}
				this.close();
			},
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			//处理列表数据
			handleListData(data){
				console.log('data===', data)
				let list = [];
				if(data && Array.isArray(data)){
					data.forEach((item,index)=>{
						let itemObj = {
							num:index+1,
							...item
						}
						list.push(itemObj);
					})
				}
				//这是mock的数据
				// for(let i=1;i<90;i++){
				// 	list.push({
				// 		num:i,
				// 		date:3003,
				// 		time:29,
				// 		message:'这是一条信息学'
				// 	})
				// }
				this.warnList = list;
			}
		}
	}
</script>
<style>
</style>