<template>
	<view class="container bg-ff">
		<view class="w-cells">
			<view class="w-cell">
				<view class="item-hd">总运行时间（H）：</view>
				<view class="item-bd">{{power.run_time}}</view>
			</view>
			<view class="w-cell">
				<view class="item-hd">累计省电（KWH）：</view>
				<view class="item-bd">{{power.seave_all}}</view>
			</view>
			<view class="w-cell">
				<view class="item-hd">本月省电（KWH）：</view>
				<view class="item-bd">{{power.seave_month}}</view>
			</view>
			<view class="w-cell">
				<view class="item-hd">本季度省电（KWH）：</view>
				<view class="item-bd">{{power.seave_qua}}</view>
			</view>
		</view>
		<uni-table border emptyText="暂无更多数据" class="base-table">
		    <!-- 表头行 stripe-->
		    <uni-tr>
		        <uni-th align="center" width="100rpx">日期</uni-th>
		        <uni-th align="center">运行时间</uni-th>
		        <uni-th align="center" width="260rpx">省电度数（KWH）</uni-th>
		    </uni-tr>
		    <!-- 表格数据行 -->
		    <uni-tr v-for="item in dataList" v-key="item.cmd"  @row-click="getCurrentRow(item)">
		        <uni-td>{{item.date}}</uni-td>
		        <uni-td>{{item.run_time}}</uni-td>
		        <uni-td>{{item.powers}}</uni-td>
		    </uni-tr>
		</uni-table>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				power:{},
				dataList:[
					{'date':'','run_time':'','powers':''}
				]
			}
		},
		mounted(){
			const powerStr = uni.getStorageSync('powerInfo');
			const power = JSON.parse(powerStr);
			this.power = power;
			console.log('time===', power);
			this.dataList[0] = {
				'date': `${power.year}/${power.month}/${power.day}`,
				'run_time': power.time,
				'powers':power.powers
			}
			console.log('this.power===',this.power)
		},
	}
</script>
<style lang="scss">
	@import url("/static/style/w-cells.scss");
</style>
