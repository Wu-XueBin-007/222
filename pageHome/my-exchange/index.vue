<template>
	<view class="exchange">
		<view class="exchange-content">
			<view class="exchange-content-t">
				<view>兑换记录</view>
				<!-- <view>兑换订单</view> -->
			</view>
			<view class="exchange-content-c">
				<mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" :height="100"
				  :up="upOption" @up="upCallback">
				  <view class="exchange-content-item" v-for="(item,index) in list.data" :key="index">
				  	<view class="exchange-content-left">
				  		<image :src="item.image[0].file.preview_url"></image>
				  		<view class="exchange-content-text2">
				  			{{item.name}} {{item.specs}}
				  		</view>
				  	</view>
				  	<view class="exchange-content-right">
				  		<view>
				  			{{item.create_time}}
				  		</view>
						<view class="exchange-content-right-status" v-if="item.type == 1">待发货</view>
				  		<view class="exchange-content-right-sure" v-if="item.type == 2" @click="receipt" :data-index="index">确认收货</view>
						<view class="exchange-content-right-status" v-if="item.type == 3">已完成</view>
				  	</view>
				  </view>
				</mescroll-body>
				
				
			</view>
		</view>
		<view style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: linear-gradient(270deg, #6FA3FF 0%, #76D0FF 100%);z-index: -1;"></view>
	</view>
</template>

<script>
	import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	import { getEmptyPaginateObj, getMoreListData } from '@/utils/app'
	import * as integralApi from "@/api/integral/index.js"
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
				    tip: '暂无兑换记录'
				  }
				}
			}
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
			receipt(e){
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				let obj = {};
				obj.id = this.list.data[index].id;
				integralApi.receipt(obj)
					.then(res=>{
						//console.log(res)
						uni.showToast({
							icon:'none',
							title:res.message,
							duration:2000
						})
						let objs = this.list.data[index];
						objs.type = 3;
						this.list.data.splice(index,1,objs);
					})
					.catch(err=>{
						uni.showToast({
							icon:'none',
							title:err.message,
							duration:2000
						})
					})
			},
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
			    integralApi.orderList({ page: pageNo }, { load: false })
			      .then(result => {
					  //console.log(result)
			        // 合并新数据
			        const newList = result.data.list
			        app.list.data = getMoreListData(newList, app.list, pageNo)
			        resolve(newList)
			      })
			  })
			}
		}
	}
</script>

<style>
	.exchange{
		
	}
	.exchange-content{
		width: 702upx;
		padding-top: 20upx;
		margin: 30upx auto 0;
		background-color: #FFFFFF;
		border-radius: 8upx;
		
	}
	.exchange-content-t{
		height: 52upx;
		/* line-height: 52upx; */
		padding-left: 32upx;
		padding-right: 32upx;
		background-image: url(../../static/background/exc.png);
		background-size: 702upx 52upx;
		display: flex;
		justify-content: space-between;
		font-size: 24upx;
		line-height: 24upx;
		box-sizing: border-box;
		padding-top: 4upx;
	}
	.exchange-content-left{
		width: calc(100% - 200upx);
		display: flex;
	}
	.exchange-content-left>image{
		width: 96upx;
		height: 96upx;
		margin-right: 16upx;
	}
	.exchange-content-c{
		max-height: 800upx;
		overflow: auto;
		padding: 32upx 0;
	}
	.exchange-content-item{
		display: flex;
		justify-content: space-between;
		padding: 0 32upx;
		margin-bottom: 48upx;
		align-items: center;
	}
	.exchange-content-item:last-child{
		margin-bottom: 0;
	}
	.exchange-content-text1{
		font-size: 24upx;
		color: #333333;
	}
	.exchange-content-text2{
		font-size: 24upx;
		color: #333333;
		line-height: 36upx;
		width: calc(100% - 112upx);
	}
	.exchange-content-right{
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
	}
	.exchange-content-right>view:nth-child(1){
		font-size: 20upx;
		line-height: 20upx;
		color: #D0D0D0;
		margin-bottom: 24upx;
	}
	.exchange-content-right>.exchange-content-right-sure{
		width: 104upx;
		height: 36upx;
		line-height: 36upx;
		border-radius: 18upx;
		text-align: center;
		font-size: 20upx;
		color: white;
		background: #ff5060;
	}
	.exchange-content-right-status{
		font-size: 20upx;
		color: #ff5060;
		line-height: 20upx;
	}
</style>
