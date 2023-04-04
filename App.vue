<script>
	import * as Rapi from "@/api/home/rotation";
	import {
		fCheckVersion
	} from '@/utils/update.js'
	let uploadBaseUrl = ''
	let version = ''
	try {
		version = __wxConfig.envVersion;
		switch (version) {
			// 开发版
			case 'develop':
				uploadBaseUrl = 'https://dev.gzrhhj.com/'
				break
				// 体验版
			case 'trial':
				uploadBaseUrl = 'https://dev.gzrhhj.com/'
				break
				// 正式版
			case 'release':
				uploadBaseUrl = 'https://shop.gzrhhj.com/'
				break
			default:
				uploadBaseUrl = 'https://shop.gzrhhj.com/'
		}
	} catch (e) {
		uploadBaseUrl = 'https://shop.gzrhhj.com/'
	}
	// let version = __wxConfig.envVersion
	export default {
		/**
		 * 全局变量
		 */
		globalData: {
			// uploadBaseUrl: "https://3013.zhouyangjun.com/"
			uploadBaseUrl: uploadBaseUrl,
			goodsData: {},
			setting: {},
			version: version
		},

		/**
		 * 初始化完成时触发
		 */
		onLaunch(options) {
			//console.log(options, 'options');
			// #ifdef MP
			if (options.query.scene) {
				//console.log('scene', options.query.scene);
				this.globalData.shareId = options.query.scene;
			}
			// options.query && options.query.refereeId
			if (options.query && options.query.scene) {
				//console.log(options.query.scene, 'options.query.refereeId');
				this.$store.commit('SET_SUPERIOR_USER_ID', options.query.scene)
			}
			// #endif
			this.getInfo();
			this.getSystemInfo();
			// 小程序主动更新
			// #ifdef APP-PLUS
			fCheckVersion()
			// #endif
			// #ifdef MP
			this.updateManager()
			// #endif
		},
		onShow() {

			// #ifdef APP-PLUS
			var args = plus.runtime.arguments;
			if (args) {
				// 处理args参数，如直达到某新页面等  
				var arr = args.split('shareId=');
				this.globalData.shareId = arr[1];
			}


			//#endif   
		},
		methods: {
			getInfo() {
				if (JSON.stringify(this.globalData.setting) === '{}') {
					Rapi.info().then(setting => {
						this.globalData.setting = setting.data.storeInfo
					})
				}
			},
			getTime(time, desc, type) {
				let dates = new Date(time);
				let year = dates.getFullYear();
				let month = (dates.getMonth() + 1) > 9 ? (dates.getMonth() + 1) : '0' + (dates.getMonth() + 1);
				let day = dates.getDate() > 9 ? dates.getDate() : '0' + dates.getDate();
				let hour = dates.getHours() > 9 ? dates.getHours() : '0' + dates.getHours();
				let min = dates.getMinutes() > 9 ? dates.getMinutes() : '0' + dates.getMinutes();
				let sec = dates.getSeconds() > 9 ? dates.getSeconds() : '0' + dates.getSeconds();
				if (type == 'day') {
					return year + desc + month + desc + day;
				} else {
					return year + desc + month + desc + day + ' ' + hour + ":" + min + ":" + sec;
				}
			},
			getSystemInfo: function() {
				let t = this;
				let rect = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : null;
				uni.getSystemInfo({
					success: function(res) {
						t.globalData.systemInfo = res;
						let windowWidth = res.windowWidth;
						t.globalData.windowWidth = windowWidth;
						let windowHeight = res.windowHeight;
						t.globalData.windowHeight = windowHeight;
						// 获取状态栏的高度
						let statusBarHeight = res.statusBarHeight;
						//#ifdef MP
						// 根据胶囊的位置计算导航栏的高度
						let realHeight = (rect.top - statusBarHeight) * 2 + rect.height + statusBarHeight;
						t.globalData.navH = realHeight;
						// 根据胶囊的位置计算文字的行高以及距离状态栏的位置
						let lineHeight = (rect.top - statusBarHeight) * 2 + rect.height;
						//#endif
						//#ifdef APP
						// 根据胶囊的位置计算导航栏的高度
						let realHeight = 40 + statusBarHeight;
						t.globalData.navH = realHeight;
						// 根据胶囊的位置计算文字的行高以及距离状态栏的位置
						let lineHeight = 40;
						//#endif
						t.globalData.lineHeight = lineHeight || 0;
						t.globalData.paddingTop = statusBarHeight || 0;
						// 根据胶囊的位置计算距离右侧的宽度，用于设置返回按钮至左侧的距离
						let leftDistance = windowWidth - rect.right;
						t.globalData.leftDistance = leftDistance;
						//console.log(t.globalData)
					}
				});
			},
			/**
			 * 小程序主动更新
			 */
			updateManager() {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(res => {
					// 请求完新版本信息的回调
					// //console.log(res.hasUpdate)
				})
				updateManager.onUpdateReady(() => {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，即将重启应用',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate()
							}
						}
					})
				})
				updateManager.onUpdateFailed(() => {
					// 新的版本下载失败
					uni.showModal({
						title: '更新提示',
						content: '新版本下载失败',
						showCancel: false
					})
				})
			}

		}

	}
</script>

<style lang="scss">
	/* 引入uView库样式 */
	@import "uview-ui/index.scss";
</style>

<style>
	/* ::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
	color: transparent;
	} */
	/* 项目基础样式 */
	@import "./app.scss";
</style>
