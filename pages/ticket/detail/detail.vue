<template>
	<view style="padding: 30upx;background: white;">
		<rich-text :nodes="info.ticket_content"></rich-text>
		<view @click="back" style="width: 380upx;height: 60upx;border-radius: 12upx;margin: 30upx auto 0;font-size: 28upx;color: white;background: #ff5060;text-align: center;line-height: 60upx;">确定</view>
	</view>
</template>

<script>
	import {detail} from "@/api/common.js"
	export default {
		data() {
			return {
				info:{}
			}
		},
		onLoad() {
			this.getDetail()
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
			getDetail(){
				detail()
					.then(res=>{
						//console.log(res)
						this.info = res.data.detail;
					})
			},
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style>

</style>
