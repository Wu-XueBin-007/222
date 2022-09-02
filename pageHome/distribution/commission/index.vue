<template>
	<view class="commission">
		
		<mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback"
		  :up="upOption" @up="upCallback">
		  <view class="commission-content" v-for="(item,index) in list.data">
		  	<view class="commission-content-left">
		  		<view class="commission-content-text1">
		  			{{item.type==1?'购物':(item.type==3?'购票':(item.type==4?'话费':'其他'))}}
		  		</view>
		  		<view class="commission-content-text2">
		  			{{item.create_time}}
		  		</view>
		  	</view>
		  	<view class="commission-content-right">
		  		<view class="commission-content-text3">
		  			{{item.price}}
		  		</view>
		  		<!-- <view class="commission-content-icon">
		  			<image src="../../../static/icon/left.png" mode=""></image>
		  		</view> -->
		  	</view>
		  </view>
		</mescroll-body>
		<view style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background:#D1FFF6;z-index: -1;"></view>
	</view>
</template>

<script>
	import * as distribution from "@/api/distribution/index.js";
	import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	import { getEmptyPaginateObj, getMoreListData } from '@/utils/app'
	const pageSize = 15
	export default {
		components: {
		  MescrollBody
		},
		mixins: [MescrollMixin],
		data() {
			return {
				list:getEmptyPaginateObj(),
				// 上拉加载配置
				upOption: {
				  // 首次自动执行
				  auto: true,
				  // 每页数据的数量; 默认10
				  page: { size: pageSize },
				  // 数量要大于4条才显示无更多数据
				  noMoreSize: 4,
				  // 空布局
				  empty: {
				    tip: '暂无分销明细'
				  }
				}
			}
		},
		onLoad() {
			// this.getList();
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
			    distribution.user_price_log({page: pageNo }, { load: false })
			      .then(result => {
			        // 合并新数据
			        const newList = result.data.list
			        app.list.data = getMoreListData(newList, app.list, pageNo)
			        resolve(newList)
			      })
			  })
			},
			getList(){
				distribution.list()
					.then(res=>{
						//console.log(res)
						this.list = res.data.list.data;
					})
			},
			toDetail(){
				// this.$navTo("pageHome/distribution/commission/details")
			}
		}
	}
</script>

<style scoped>
	.commission-content{
		width: 702upx;
		height: 128upx;
		margin: 16upx auto 0;
		background-color: #FFFFFF;
		border: 2upx solid #2C2C2C;
		display: flex;
		justify-content: space-between;
		padding: 32upx;
	}
	.commission-content-left{
		
	}
	.commission-content-right{
		display: flex;
	}
	.commission-content-icon{
		width: 24upx;
		height: 24upx;
		margin: 20upx 0 0 8upx;
	}
	.commission-content-icon>image{
		width: 100%;
		height: 100%;
		vertical-align: top;
	}
	.commission-content-text1{
		font-size: 24upx;
		color: #333333;
	}
	.commission-content-text2{
		font-size: 20upx;
		color: #D0D0D0;
		margin-top: 10upx;
	}
	.commission-content-text3{
		font-size: 24upx;
		color: #333333;
		font-weight: bold;
		line-height: 60upx;
	}
</style>
