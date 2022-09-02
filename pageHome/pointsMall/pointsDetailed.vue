<template>
	<view class="pointsDetailed">
		<view class="pointsDetailed-header">
			<view class="pointsDetailed-header-text1">
				当前可用积分：<text>{{integralNum}}</text>
			</view>
			<view class="pointsDetailed-header-text2" v-if="integralNum==0">
				对不起，您暂无可用积分~
			</view>
		</view>
		<view class="integralHead" v-if="IntegralLogList.length>0">积分账单</view>
		<view class="pointsDetailed-content">
			<view class="pointsDetailed-item" v-if="IntegralLogList.length>0" v-for="(item,index) in IntegralLogList"
			:key="index">
				<view class="pointsDetailed-item-left">
					<view class="pointsDetailed-item-text1">
						积分动向:{{item.describe}}
					</view>
					<view class="pointsDetailed-item-text2">
						{{item.create_time}}
					</view>
				</view>
				<view class="pointsDetailed-item-right" v-if="item.type==1">
					{{item.value>0?'+'+item.value:item.value}}
				</view>
				<view class="pointsDetailed-item-right" v-if="item.type==2">
					{{item.value>0?'+'+item.value:item.value}}
				</view>
			</view>
		</view>
		<view
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: white;z-index: -1;">
		</view>
	</view>
</template>

<script>
	// const app = getApp();
	import * as UserApi from '@/api/user'
	export default {
		data() {
			return {
				userL: {},
				integralNum: 0,
				IntegralLogList: [],
				isShow: 0,
				page: 1,
				limit: 6,
				bottomFlag: true,
				topFlag: true
			}
		},
		onLoad() {
			this.init();
			this.shuaxin();
		},
		onPullDownRefresh() {
			// 下拉
			if (!this.topFlag) {
				return false;
			}
			this.bottomFlag = true;
			this.page = 1;
			this.topFlag = false;
			this.shuaxin(true);
		},
		onReachBottom() {
			// 触底
			if (!this.bottomFlag) {
				return false;
			}
			this.page = this.page + 1;
			this.bottomFlag = false;
			this.status = "loading";
			this.shuaxin();
		},
		onShareAppMessage() {
			const app = this
			const {
				page
			} = app
			return {
				title: "融汇商城",
				path: "/pages/index/index"
			}
		},
		
		/**
		 * 分享到朋友圈
		 * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
		 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
		 */
		onShareTimeline() {
			const app = this
			const {
				page
			} = app
			return {
				title: "融汇商城",
				path: "/pages/index/index"
			}
		},
		methods: {
			init() {
				let app = this;

				UserApi.assets()
					.then(result => {
						app.userL = result.data.assets
						app.integralNum = result.data.assets.points
						// resolve(app.assets)
					})
					.catch(err => {
						if (err.result && err.result.status == 401) {
							app.isLogin = false
							// resolve(null)
						} else {
							// reject(err)
						}
					})
				
			},
			shuaxin(flag) {
				var _that = this;
				UserApi.integralList({page: _that.page})
					.then(res => {
						//console.log(res)
						if (flag) {
							_that.topFlag = true;
							_that.bottomFlag = true;
							uni.stopPullDownRefresh()
						}
						if (res.data.list.length >= 15 && _that.page > 0) {
							_that.bottomFlag = true;
							_that.status = "loadmore";
						} else {
							_that.status = "normal";
						}
						if (_that.page == 1) {
							_that.IntegralLogList = res.data.list.data;
						} else {
							_that.IntegralLogList = _that.IntegralLogList.concat(res.data.list.data);
						}
					})
			}
		}
	}
</script>

<style scoped>
	.integralHead{
		width: 100%;
		height: 92upx;
		line-height: 92upx;
		box-sizing: border-box;
		padding: 0 30upx;
		font-size: 28upx;
		color: #333333;
		background: #F0FDFF;
	}
	.pointsDetailed-header {
		width: 100%;
		height: 300upx;
		/* padding-top: 100upx; */
		background: linear-gradient(90deg, #76D0FF 0%, #6FA3FF 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pointsDetailed-header-text1 {
		/* width: 370upx; */
		height: 30upx;
		font-size: 32upx;
		color: #FFFFFF;
		text-align: center;
		margin: 0 auto 30upx;
	}

	.pointsDetailed-header-text1>text {
		font-size: 34upx;
	}

	.pointsDetailed-header-text2 {
		/* width: 370upx; */
		height: 30upx;
		font-size: 32upx;
		color: #FFFFFF;
		text-align: center;
		margin: 0 auto;
	}

	.pointsDetailed-content {
		margin-top: 10upx;
		width: 100%;
		padding: 0 30upx;
		box-sizing: border-box;
	}

	.pointsDetailed-item {
		width: 690upx;
		height: 126upx;
		background-color: #FFFFFF;
		display: flex;
		padding-left: 8upx;
		justify-content: space-between;
		/* margin-top: 4upx; */
		box-sizing: border-box;
		border-bottom: 2upx solid #EFEFEF;
		align-items: center;
	}

	.pointsDetailed-item-left {
		width: 400upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.pointsDetailed-item-text1 {
		font-size: 24upx;
		color: #333333;
		line-height: 24upx;
		margin-bottom: 16upx;
	}

	.pointsDetailed-item-text2 {
		font-size: 20upx;
		color: #D0D0D0;
		/* margin-top: 20upx; */
	}

	.pointsDetailed-item-right {
		/* width: 120upx; */
		color: #ff5060;
		font-weight: bold;
		font-size: 28upx;
		line-height: 28upx;
	}
</style>
