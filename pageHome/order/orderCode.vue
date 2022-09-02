<template>
	<view style="padding: 30upx;display: flex;align-items: center;justify-content: center;height: 100vh;">
		<view style="width: 500upx;height: 500upx;padding: 10upx;background: white;border-radius: 12upx;box-sizing: border-box;">
			<image :src="image" style="width: 100%;" mode="widthFix"></image>
		</view>
		
	</view>
</template>

<script>
	import {SinceCarry} from "@/api/order.js";
	export default {
		data(){
			return {
				orderId:"",
				image:""
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
						this.image = 'data:image/png;base64,' + res.data.images.replace(/[\r\n]/g, '');
					})
			}
		}
	}
</script>

<style scoped>
</style>
