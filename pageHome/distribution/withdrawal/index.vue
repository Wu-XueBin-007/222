<template>
	<view class="withrawal">
		<head-nav title="提现记录" :backFlag="true" color="white" backGround="linear-gradient(90deg, #FF5F60, #DE6BAD)"
			backType="other" :fontSize="36"></head-nav>
		<view class="con" v-if="hisList.length>0">
			<view class="conItem" v-for="(item,index) in hisList" :key="index">
				<view class="conItemL">
					<view class="conItemLT">提现至微信钱包</view>
					<view class="conItemLB">{{item.create_time}}</view>
				</view>
				<!-- <view class="conItemR">{{item.price}}</view> -->
				<view class="conItemL" style="flex: 1;">
					<view class="conItemLT conItemRBorder"
						style="text-align: right;width: 100%;font-size: 28rpx;font-family: PingFang;font-weight: 500;color: #FF5F60;line-height: 28rpx;">
						{{item.price}}</view>
					<view class="conItemLB" style="text-align: right;" v-if="item.type==1">审核中</view>
					<view class="conItemLB" style="text-align: right;" v-if="item.type==2">已拒绝</view>
					<view class="conItemLB" style="text-align: right;" v-if="item.type==3">已通过</view>
					<view class="conItemLB" style="text-align: right;" v-if="item.type==4">已到账</view>
				</view>
			</view>
		</view>
		<view v-else style="padding-top: 200rpx;">
			<u-empty></u-empty>
		</view>
		<!-- <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback"
		  :up="upOption" @up="upCallback">
		  <view class="withrawal-content" v-for="(item,index) in list.data" :key="index">
		  	<view class="withrawal-content-left">
		  		<view class="withrawal-content-text1">
		  			提现至{{item.image[0].type == 1 ? '微信' : '支付宝'}}零钱
		  		</view>
		  		<view class="withrawal-content-text2">
		  			{{item.create_time}}
		  		</view>
		  	</view>
		  	<view class="withrawal-content-right">
		  		<view class="withrawal-content-text3">
		  			{{item.price}}
		  		</view>
		  	</view>
		  </view>
		</mescroll-body> -->
		<view
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background:#f3f3f3;z-index: -1;">
		</view>
	</view>
</template>

<script>
	import * as API from "@/api/distribution/index.js";
	import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	import {
		getEmptyPaginateObj,
		getMoreListData
	} from '@/utils/app'
	const pageSize = 15
	import headNav from '@/components/seckillNav.vue'
	export default {
		components: {
			MescrollBody,
			headNav
		},
		mixins: [MescrollMixin],
		data() {
			return {
				type: 1,
				list: getEmptyPaginateObj(),
				// 上拉加载配置
				upOption: {
					// 首次自动执行
					auto: true,
					// 每页数据的数量; 默认10
					page: {
						size: pageSize
					},
					// 数量要大于4条才显示无更多数据
					noMoreSize: 4,
					// 空布局
					empty: {
						tip: '暂无提现记录'
					}
				},
				page: 1,
				moreFlag: false,
				hisList: []
			}
		},
		onPullDownRefresh() {
			this.page = 1;
			this.getData();
		},
		onReachBottom() {
			if (!this.moreFlag) {
				return false;
			}
			this.moreFlag = false;
			this.page = this.page + 1;
			this.getData();
		},
		onLoad(options) {
			this.type = options.type;
			this.getData()
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
			// getHisList(){

			// },
			upCallback(page) {
				const app = this
				// 设置列表数据
				app.getOrderList(page.num)
					.then(list => {
						const curPageLen = list.data.length
						const totalSize = list.data.total
						app.mescroll.endBySize(curPageLen, totalSize)
					})
					.catch(() => app.mescroll.endErr())
			},
			// 获取订单列表
			getOrderList(pageNo = 1) {
				const app = this
				return new Promise((resolve, reject) => {
					API.withdrawalHis({
							if_commission: app.type,
							page: pageNo
						}, {
							load: false
						})
						.then(result => {
							// 合并新数据
							const newList = result.data.list
							app.list.data = getMoreListData(newList, app.list, pageNo)
							resolve(newList)
			  	})
				})
			},
			getData() {
				let obj = {};
				obj.page = this.page;
				API.withdrawalHis(obj)
					.then(res => {
						//console.log(res)
						if (this.page == 1) {
							this.hisList = res.data.list.data;
						} else {
							this.hisList = this.hisList.concat(res.data.list.data);
						}
						if (this.page < res.data.list.last_page) {
							this.moreFlag = true;
						} else {
							this.moreFlag = false;
						}
						uni.stopPullDownRefresh()
					}).catch(err => {
						uni.stopPullDownRefresh()
					})
			}
		}
	}
</script>

<style scoped>
	.conItemRBorder {
		position: relative;
	}

	.conItemRBorder::before {
		content: "";
		width: 80%;
		height: 2rpx;
		position: absolute;
		bottom: -10rpx;
		right: 0;
		background: rgba(153, 153, 153, .3);
	}


	.con {
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		width: 100%;
	}

	.conItem {
		width: 100%;
		border-radius: 20rpx;
		background: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 36rpx 26rpx;
		height: 140rpx;
		margin-bottom: 20rpx;
	}

	.conItemL {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.conItemLT {
		font-size: 28rpx;
		font-family: PingFang;
		font-weight: 500;
		color: #686868;
		line-height: 28rpx;
	}

	.conItemLB {
		font-size: 22rpx;
		font-family: PingFang;
		font-weight: 500;
		color: #999999;
		line-height: 22rpx;
	}

	.conItemR {
		font-size: 28rpx;
		font-family: PingFang;
		font-weight: 500;
		color: #FF5F60;
		line-height: 28rpx;
	}



	.withrawal-content {
		width: 702upx;
		height: 128upx;
		margin: 16upx auto 0;
		background-color: #FFFFFF;
		border: 2upx solid #2C2C2C;
		display: flex;
		justify-content: space-between;
		padding: 32upx;
	}

	.withrawal-content-left {}

	.withrawal-content-right {
		display: flex;
	}

	.withrawal-content-icon {
		width: 24upx;
		height: 24upx;
		margin: 20upx 0 0 8upx;
	}

	.withrawal-content-icon>image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}

	.withrawal-content-text1 {
		font-size: 24upx;
		color: #333333;
	}

	.withrawal-content-text2 {
		font-size: 20upx;
		color: #D0D0D0;
		margin-top: 10upx;
	}

	.withrawal-content-text3 {
		font-size: 24upx;
		color: #333333;
		font-weight: bold;
		line-height: 60upx;
	}
</style>
