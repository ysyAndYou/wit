<template>
	<view>
		<uni-popup ref="delPopup" type="dialog" :animation="true" >
			<view class="dialog-form flex-center del-dialog">
				<view class="text">是否确定删除？</view>
				<view class="form-btns-box">
					<view class="pass-btn btn-canle" @click="cancleDel()">取消</view>
					<view class="pass-btn btn-sure" @click="sureDel()">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
</script>

<style>
</style>
