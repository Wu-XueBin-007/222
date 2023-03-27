<template>
	<view @click="closeModule" v-if="display" class="upgradeBox">
		<view class="imgModule">
			<image src="https://oss.gzrhhj.com/10001/20230323/fb52800c1934da649b890a7b68800189.png" mode="widthFix">
			</image>
			<text class="txt">
				升级,有数据需要更新，请点击升级
				1、修了
				登录输入框数
				据问题;
				2、优化了模块管理添加和制除卡顿问题
			</text>
			<button @click="upBtn()" class="upgradeBtn">立即升级</button>
			<view class="close">
				<image @click="closeModule" class="closeImg" style="width: 40rpx;height: 40rpx;"
					src="../../static/home/close_icon.png" mode="widthFix">
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	import * as OrderCommentApi from '@/api/order/comment'
	export default {
		name: "upgrade",
		data() {
			return {
				display: false
			};
		},

		onShow() {
			plus.runtime.getProperty(plus.runtime.appid, function(inf) {
				OrderCommentApi.getapp({
					key: 'app'
				}).then(res => {
					if (data.edition_number != inf.versionCode) {
						this.display = true;
						this.url = url
						// 	var type = '';
						// 	if (data.package_type == 1) {
						// 		type = "wgt"
						// 	} else {
						// 		type = "pkg";
						// 	}
						// 	let platform = '';
						// 	let url = ''
						// 	if (uni.getSystemInfoSync().platform == "android") {
						// 		platform = 'android';
						// 		url = data.andorid_url
						// 	}

						// 	if (uni.getSystemInfoSync().platform == "ios") {
						// 		platform = 'ios';
						// 		url = data.ios_url;
						// 	}
						// 	updateUseModal({
						// 		title: data.title || "发现新版本",
						// 		contents: data.describe || '',
						// 		is_mandatory: data.edition_force == 1 ? true : false,
						// 		url: url,
						// 		platform: platform,
						// 		type: type // 安装包类型  
						// 	})
					}
				})
			})
		},
		methods: {
			closeModule() {
				this.display = false
			},
			upBtn(url) {
				const downloadTask = uni.downloadFile({
					url,
					success: res => {
						if (res.statusCode !== 200) {
							console.error('下载安装包失败', err);
							return;
						}
						// 下载好直接安装，下次启动生效
						plus.runtime.install(res.tempFilePath, {
							force: false
						}, () => {
							uni.hideLoading()
							uni.showModal({
								title: '安装成功是否重启？',
								success: res => {
									if (res.confirm) {
										//更新完重启app
										plus.runtime.restart();
									}
								}
							});

						}, err => {
							uni.hideLoading()
							uni.showModal({
								title: '更新失败',
								content: err.message,
								showCancel: false
							});
						});
					},
					//接口调用结束
					complete: () => {
						uni.hideLoading();
						downloadTask.offProgressUpdate(); //取消监听加载进度
					}
				});
				//监听下载进度
				downloadTask.onProgressUpdate(res => {
					// state.percent = res.progress;
					waiting.setTitle("正在下载" + res.progress + "%");
					// console.log('下载进度百分比:' + res.progress); // 下载进度百分比
					// console.log('已经下载的数据长度:' + res.totalBytesWritten); // 已经下载的数据长度，单位 Bytes
					// console.log('预期需要下载的数据总长度:' + res.totalBytesExpectedToWrite); // 预期需要下载的数据总长度，单位 Bytes
				});
			}
		}
	}
</script>

<style lang="less">
	@keyframes flash {

		0%,
		50%,
		to {
			opacity: 1
		}

		25%,
		75% {
			opacity: 0
		}
	}

	.upgradeBox {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		background: rgba(0, 0, 0, 0.2);

		.imgModule {
			background: white;
			border-radius: 12rpx;
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 72%;
			display: flex;
			// align-items: center;
			// justify-content: center;
			flex-direction: column;

			.txt {
				margin: 0 23rpx;
			}

			image {
				width: 100%;
				margin-top: -144rpx;
			}



			.close {
				position: absolute;
				bottom: -60rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 4rpx;
				height: 60rpx;
				background: #f3f3f3;
				border-radius: 4rpx;
				animation: flash 1s;

				.closeImg {
					position: absolute;
					bottom: -40rpx;
					left: 50%;
					transform: translateX(-50%);
				}
			}

			.upgradeBtn {
				background: #feaa00;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				font-size: 24rpx;
				width: 80%;
				// margin:  0;
				margin: 40rpx auto;
				// margin-top: 400rpx;
			}

		}
	}
</style>
