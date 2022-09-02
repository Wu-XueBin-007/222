<template>
	<view class="back">
		<view class="con">
			<view class="conHead">
				<view>入账佣金</view>
				<view>+10.15</view>
			</view>
			<view class="conInfo">
				<view class="conInfoItem">
					<view>交易时间</view>
					<view>2021-01-01</view>
				</view>
				<view class="conInfoItem">
					<view>流水单号</view>
					<view>11111111111111</view>
				</view>
				<view class="conInfoItem">
					<view>用户</view>
					<view>盐汽水</view>
				</view>
				<view class="conInfoItems">
					<view class="conInfoItemsL">订单详情</view>
					<view class="conInfoItemsR">
						<view v-for="index of 6" :key="index">李施德林冰蓝劲爽漱口水 x1</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		}
	}
</script>

<style scoped>
	.back{
		width: 100%;
		height: 100vh;
		background: #D1FFF6;
		box-sizing: border-box;
		padding: 16upx 24upx;
	}
	.con{
		width: 100%;
		box-sizing: border-box;
		padding: 0 32upx 48upx;
		background: white;
		border: 4upx solid #2C2C2C;
	}
	.conHead{
		width: 100%;
		height: 116upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2upx solid #EFEFEF;
	}
	.conHead>view:nth-child(1){
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
	}
	.conHead>view:nth-child(2){
		font-size: 36upx;
		line-height: 36upx;
		color: #333333;
		font-weight: bold;
	}
	.conInfo{
		margin-top: 40upx;
		width: 100%;
	}
	.conInfoItem{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 40upx;
	}
	.conInfoItems{
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.conInfoItem>view:nth-child(1){
		width: 120upx;
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
	}
	.conInfoItemsL{
		width: 120upx;
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
	}
	.conInfoItem>view:nth-child(2){
		width: calc(100% - 120upx);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
		text-align: right;
	}
	.conInfoItemsR{
		width: calc(100% - 120upx);
	}
	.conInfoItemsR>view{
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
		margin-bottom: 24upx;
		text-align: right;
	}
	.conInfoItemsR>view:last-child{
		margin-bottom: 0;
	}
</style>
