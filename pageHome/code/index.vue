<template>
	<view class="back" id="back" :style="{'background-image': 'url('+infos.shareImage.preview_url+')'}"
		@longpress="showSave">
		<!-- <image :src="userInfo.avatar_url ? userInfo.avatar_url : '/static/default-avatar.png'" class="userAvator"
			id="userAvator">
		</image> -->
		<!-- <view class="userName">{{ userInfo.nick_name }}</view> -->
		<!-- <view class="userMsg">邀请您加入</view> -->
		<image :src="imgsrc" style="width: 200upx;height: 200upx;position: absolute;bottom: 168upx;right: 68upx;" id="qrCode"></image>
		<!-- <view class="desc">长按扫码 参加活动</view> -->
		<canvas canvas-id="myCanvas" style="width: 200upx;height: 200upx;position: absolute;top: -9999999999999px;" />
	</view>
</template>

<script>
	import {
		code
	} from "@/api/distribution/index.js";
	import * as commonApi from "@/api/home/rotation.js"
	import * as UserApi from '@/api/user'
	export default {
		data() {
			return {
				imgsrc: "",
				infos: {},
				userInfo: {},
				widthH:0,
				heightH:0
			}
		},
		onLoad() {
			this.getInfo()
			this.getCode()

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
			showSave() {
				//console.log(1234)
				let _this = this;
				uni.showActionSheet({
					itemList: ['保存到相册'],
					success(res) {
						//console.log(res)
						_this.getImgInfo(_this.infos.shareImage.preview_url)
					}
				})
			},
			getImgInfo(urls) {
				wx.showLoading({
					title: '生成中...',
					mask: true,
				});
				var that = this;
				wx.downloadFile({
					url: urls,
					success: function(res) {
						wx.hideLoading();
						if (res.statusCode === 200) {
							//download下载成功返回结果res.tempFilePath
							var cardbg = res.tempFilePath;
							that.save(cardbg);
						} else {
							wx.showToast({
								title: '亲,海报下载失败！',
								icon: 'none',
								duration: 2000,
								success: function() {
									var cardbg = "";
									that.save(cardbg);
								}
							})
						}
					},
					fail:err=>{
						console.log(err)
					}
				})
			},
			getQrCode: function(cardbg, urls) {
				wx.showLoading({
					title: '生成中...',
					mask: true,
				});
				var that = this;
				wx.downloadFile({
					url: urls,
					success: function(res) {
						wx.hideLoading();
						if (res.statusCode === 200) {
							var codeImg = res.tempFilePath;
							that.save(cardbg, codeImg);
						} else {
							wx.showToast({
								title: '二维码下载失败！',
								icon: 'none',
								duration: 2000,
								success: function() {
									var codeImg = "";
									that.save(cardbg, codeImg);
								}
							})
						}
					}
				})
			},
			save(cardbg, codeImg) {
				wx.showLoading({
					title: '正在生成中...',
					mask: true,
				})
				var that = this;
				// var cardBase = that.data.cardBase; //需要绘制的数据集合
				const ctx = wx.createCanvasContext('myCanvas'); //创建画布
				var width = "";
				wx.createSelectorQuery().select('#qrCode').boundingClientRect(function(
				rects1) {
					ctx.width = rects1.width + 'px';
					ctx.height = rects1.height + 'px';
					
					// that.widthH = rects1.width;
					// that.heightH = rects1.height;
					ctx.setFillStyle('#fff');
					ctx.fillRect(0, 0, rects1.width, rects1.height);
					that.send_code(that.imgsrc)
						.then(rep=>{
							ctx.drawImage(rep, 0, 0, rects1
								.width, rects1.height)
							ctx.draw();
							wx.hideLoading();
							that.saveImg()
						})
						.catch(err=>{
							console.log(err,1111)
						})
				}).exec()
				// wx.createSelectorQuery().select('#back').boundingClientRect(function(rect) {
				// 	//console.log(rect)
				// 	var height = rect.height;
				// 	var right = rect.right;
				// 	width = rect.width;
				// 	var left = rect.left + 5;
				// 	ctx.setFillStyle('#fff');
				// 	ctx.fillRect(0, 0, rect.width, height);
				// 	// 这里处理自适应
				// 	let rpx = 1;
				// 	wx.getSystemInfo({
				// 		success(res) {
				// 			rpx = res.windowWidth / 375;
				// 		},
				// 	})
				// 	if (cardbg) {
				// 		ctx.drawImage(cardbg, 0, 0, width, height);
				// 	}

				// 	//  绘制二维码
				// 	// if (codeImg) {
				// 	// 	wx.createSelectorQuery().select('#userAvator').boundingClientRect(function(rects) {
				// 	// 		//console.log(rects)
				// 	// 		let a = rects.left+rects.width/2;
				// 	// 		let b = rects.top+rects.width/2;
				// 	// 		let c = rects.width/2;
				// 	// 		//console.log(a,b,c,rects.top,rects.top+rects.width/2)
							
				// 	// 		wx.createSelectorQuery().select('#qrCode').boundingClientRect(function(
				// 	// 		rects1) {
				// 	// 			//console.log(rects1)
				// 	// 			// var img = new Image();
				// 	// 			// img.src = that.imgsrc;
				// 	// 			ctx.drawImage(that.imgsrc, rects1.left, rects1.top, rects1
				// 	// 				.width, rects1.height)
				// 	// 			ctx.beginPath();
				// 	// 			ctx.arc(a, b, c, 0, 2 * Math.PI);
				// 	// 			ctx.clip();
				// 	// 			ctx.stroke();
				// 	// 			ctx.drawImage(codeImg, rects.left, rects.top, rects.width,
				// 	// 				rects.height)
				// 	// 			ctx.draw();
				// 	// 			wx.hideLoading();
				// 	// 			that.saveImg()
				// 	// 		}).exec()
				// 	// 	}).exec()
				// 	// }
				// 	wx.createSelectorQuery().select('#qrCode').boundingClientRect(function(
				// 	rects1) {
				// 		that.send_code(that.imgsrc)
				// 			.then(rep=>{
				// 				ctx.drawImage(rep, rects1.left, rects1.top, rects1
				// 					.width, rects1.height)
				// 				ctx.draw();
				// 				wx.hideLoading();
				// 				that.saveImg()
				// 			})
				// 			.catch(err=>{
				// 				//console.log(err)
				// 			})
				// 	}).exec()

				// }).exec()
			},
			send_code(code) {
			  /*code是指图片base64格式数据*/
			  //声明文件系统
			  return new Promise((resolve,reject)=>{
				  const fs = uni.getFileSystemManager();
				  //随机定义路径名称
				  var times = new Date().getTime();
				  //console.log(wx.env.USER_DATA_PATH)
				  var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png';
				  				//console.log(code)
				  //将base64图片写入
				  fs.writeFile({
				    filePath: codeimg,
				    data: code.slice(22),
				    encoding: 'base64',
				    success: () => {
				      //写入成功了的话，新的图片路径就能用了
				      resolve(codeimg);
				    },
					fail:err=>{
						reject(err)
					}
				  });
			  })
			  
			},
			saveImg() {
				var that = this;
				uni.showLoading({
					title: '正在保存',
					mask: true,
				})
				setTimeout(function() {
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas',
						success: function(res) {
							console.info("res", res);
							uni.hideLoading();
							var tempFilePath = res.tempFilePath;
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success(res) {
									console.info(res);
									uni.showModal({
										content: '图片已保存到相册，赶紧晒一下吧',
										showCancel: false,
										confirmText: '好的',
										confirmColor: '#333',
										success: function(res) {
											if (res.confirm) {}
										},
										fail: function(res) {}
									})
								},
								fail: function(res) {
									console.log(res)
									if (res.errMsg ===
										"saveImageToPhotosAlbum:fail:auth denied"||res.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
										//console.log("打开设置窗口");
										uni.showModal({
											title:'提示',
											content:'需要您授权保存相册',
											showCancel: false,
											success:()=>{
												//打开设置窗口
												uni.openSetting({
													success(settingdata) {
														//console.log(settingdata)
														if (settingdata.authSetting[
																'scope.writePhotosAlbum'
															]) {
																uni.showModal({
																	title:'提示',
																	content:'获取权限成功,再次点击图片保存到相册',
																	showCancel: false,
																})
															console.log("获取权限成功，再次点击图片保存到相册")
														} else {
															uni.showModal({
																title:'提示',
																content:'获取权限失败,再次点击图片保存到相册',
																showCancel: false,
															})
															//console.log("获取权限失败")
														}
													}
												})
											}
											
										})
										// uni.openSetting({
										// 	success(settingdata) {
										// 		//console.log(settingdata)
										// 		if (settingdata.authSetting[
										// 				'scope.writePhotosAlbum'
										// 			]) {
										// 			console.log("获取权限成功，再次点击图片保存到相册")
										// 		} else {
										// 			//console.log("获取权限失败")
										// 		}
										// 	}
										// })
									}
								}
							})
						},
						fail:err=>{
							console.log(err)
						}
					});
				}, 1000);
			},
			getInfo() {
				commonApi.info()
					.then(res => {
						////console.log(res)
						this.infos = res.data.storeInfo;
					})
				UserApi.info()
					.then(result => {
						this.userInfo = result.data.userInfo
					})
			},
			getCode() {
				let obj = {};
				obj.type = 2;
				// #ifdef MP-WEIXIN
				obj.type = 1;
				// #endif
				code(obj)
					.then(res => {
						this.imgsrc = res.message
						this.imgsrc = this.imgsrc.replace(/[\r\n]/g, '')
					})
			}
		}
	}
</script>

<style scoped>
	.back {
		height: 100vh;
		width: 100%;
		background-position: 0 0;
		background-size: 100% 100%;
		/* display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center; */
	}

	.userAvator {
		width: 96upx;
		height: 96upx;
		border-radius: 50%;
		margin-bottom: 24upx;
	}

	.userName {
		font-size: 28upx;
		line-height: 28upx;
		font-weight: bold;
		margin-bottom: 24upx;
		color: #333333;
	}

	.userMsg {
		font-size: 28upx;
		line-height: 28upx;
		margin-bottom: 70upx;
		color: #333333;
	}

	.codeWrap {
		/* padding: 18upx; */
		border: 2upx solid #ff5060;
		border-radius: 8upx;
		background: white;
	}

	.codeWrap>image {
		width: 220upx;
		height: 220upx;
	}

	.desc {
		font-size: 28upx;
		line-height: 28upx;
		color: #333333;
		font-weight: bold;
		margin-top: 32upx;
	}
</style>
