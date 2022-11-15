export default {
	/**
	 * 分享当前页面
	 */
	onShareAppMessage() {
		const app = this
		const {
			page
		} = app;
		//console.log(111);
		return {
			// title: page.params.share_title,
			path: "/pages/index/index?" + app.$getShareUrlParams()
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
			// title: page.params.share_title,
			path: "/pages/index/index?" + app.$getShareUrlParams()
		}
	}
}
