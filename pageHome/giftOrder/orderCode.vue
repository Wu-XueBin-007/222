<template>
	<view style="padding: 30upx;display: flex;align-items: center;justify-content: center;height: 100vh;">
		<view style="width: 100%;padding: 30upx;background: white;border-radius: 12upx;box-sizing: border-box;">
			<!-- <image src="../../static/World%20Map%20_Two%20Color@2x.png" style="width: 100%;" mode="widthFix"></image> -->
		</view>
		
	</view>
</template>

<script>
	import {SinceCarry} from "@/api/order.js";
	export default {
		data(){
			return {
				orderId:""
			}
		},
		onLoad(options) {
			this.orderId = options.orderId;
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
		methods:{
			getData(){
				SinceCarry({order_id:this.orderId})
					.then(res=>{
						//console.log(res)
					})
			}
		}
	}
</script>

<style scoped>
</style>
