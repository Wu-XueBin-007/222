<template>
	<view style="padding: 30upx;background: white;">
		<rich-text v-if="!info_by_key" :nodes="info.mobile_recharge_count">
		</rich-text>
		<rich-text v-if="info_by_key" :nodes="info_by_key==1?settingdetail.cooperation_agreement_of_area:settingdetail.cooperation_agreement_of_head">
		</rich-text>
		<view @click="back"
			style="width: 380upx;height: 60upx;border-radius: 12upx;margin: 30upx auto 0;font-size: 28upx;color: white;background: #ff5060;text-align: center;line-height: 60upx;">
			确定</view>
	</view>
</template>

<script>
	import {
		detail,
		settingdetail
	} from "@/api/common.js"

	export default {
		data() {
			return {
				info: {},
				info_by_key: '',
				settingdetail:{}
			}
		},
		onLoad(options) {
			if (options.info_by_key) {
				this.info_by_key = options.info_by_key
				this.getSettingDetail()
			}else{
				this.getDetail()
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
			getDetail() {
				detail()
					.then(res => {
						//console.log(res)
						this.info = res.data.detail;
					})
			},
			getSettingDetail(){
				settingdetail({'key':'agent'}).then(res=>{
					console.log(res,'resres');
					this.settingdetail = res.data.values
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>

</style>
