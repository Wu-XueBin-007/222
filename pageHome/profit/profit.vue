<template>
	<view>
		<head-nav title="团队收益" :backFlag="true" color="white" backGround="linear-gradient(90deg, #FF5F60, #DE6BAD)"
			backType="other" :fontSize="36"></head-nav>
		<view class="headNav">
			<view class="headNavT">
				<view class="headNavTL">累计团队收益金额</view>
				<view class="headNavTR" @click="showRule">收益规则</view>
			</view>
			<view class="headNavB">
				<text>￥</text>
				{{info.count_profit}}
			</view>
		</view>
		<view class="conWrap">
			<view class="conItem" v-for="(item,index) in info.month_profit" :key="index" :data-date="item.date"
				@click="toDetail">
				<view class="conItemT">
					<view class="conItemTL">团队收益记录</view>
					<image class="conItemTR" src="../../static/icon/more_gray.png"></image>
				</view>
				<view class="conItemB">
					<view class="conItemBL">{{item.date}}团队收益金额</view>
					<view class="conItemBR">
						<text>￥</text>{{item.profit}}
					</view>
				</view>
			</view>
		</view>
		<u-popup v-model="showAgree" mode="bottom" @close="close" @open="open">
			<view style="max-height: 700upx;">
				<view v-html="commonL.profit_rules" style="padding: 30upx;box-sizing: border-box;">

				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import headNav from '@/components/seckillNav.vue'
	import * as userApi from '@/api/user.js'
	import * as settingApi from '@/api/ticket/setting'
	export default {
		data() {
			return {
				info: {
					count_profit: 0,
					month_profit: []
				},
				showAgree: false,
				commonL: {}
			}
		},
		components: {
			headNav
		},
		onLoad() {
			this.getList();
			this.getCommon();
		},
		methods: {
			toDetail(e) {
				let date = e.target.dataset.date || e.currentTarget.dataset.date;
				uni.navigateTo({
					url: "/pageHome/profit/profitDetail/profitDetail?date=" + date
				})
			},
			showRule() {
				console.log(123)
				this.showAgree = true;
			},
			getCommon() {
				settingApi.detail().then(res => {
					res.data.detail.profit_rules = res.data.detail.profit_rules.replace(/<img/g,
						"<img style='width:100%'");
					this.commonL = res.data.detail
				}).catch(err => {})
			},
			close() {},
			open() {},
			getList() {
				userApi.profit().then(res => {
					console.log(res)
					this.info = res.data;
				})
			},
		}
	}
</script>

<style scoped>
	.conWrap {
		width: 690rpx;
		margin: 0 auto;
		transform: translateY(-32rpx);
	}

	.conItem {
		width: 100%;
		background: white;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}

	.conItemT {

		margin-bottom: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.conItemTL {
		font-size: 28rpx;
		line-height: 28rpx;
		color: #686868;
	}

	.conItemTR {
		width: 12rpx;
		height: 22rpx;
	}

	.conItemB {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.conItemBL {
		font-size: 28rpx;
		line-height: 28rpx;
		color: #999999;
	}

	.conItemBR {
		font-size: 40rpx;
		line-height: 40rpx;
		display: flex;
		align-items: baseline;
		color: #FD6066;
	}

	.conItemBR>text {
		font-size: 24rpx;
		line-height: 24rpx;
		color: #FD6066;
	}


	.headNav {
		width: 100%;
		height: 288rpx;
		background: linear-gradient(90deg, #FF5F60, #DE6BAD);
		box-sizing: border-box;
		padding-top: 70rpx;
	}

	.headNavT {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
	}

	.headNavTL {
		font-size: 32rpx;
		line-height: 32rpx;
		color: white;
	}

	.headNavTR {
		height: 40rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
		border-radius: 20rpx;
		border: 2rpx solid white;
		font-size: 24rpx;
		line-height: 36rpx;
		color: white;
	}

	.headNavB {
		display: flex;
		align-items: baseline;
		box-sizing: border-box;
		padding: 0 30rpx;
		font-size: 100rpx;
		line-height: 100rpx;
		color: white;
		height: 100rpx;
	}

	.headNavB>text {
		font-size: 60rpx;
		line-height: 60rpx;
		color: white;
	}
</style>
