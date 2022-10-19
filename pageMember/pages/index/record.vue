<template>
	<view class="invitat">
		<view class="allInfo" v-for="(item,index) in buyrecord" :key="index" v-if="buyrecord.length>0">
			<view class="record">
				<view class="Vipmember">
					<view class="vipIcon">
						<image src="../../static/notvip_icon.png" v-if="item.act_type=='已过期'"></image>
						<image src="../../static/vip_icon.png" v-else></image>
					</view>
					<view class="vipName">
						{{item.remark}}
					</view>
				</view>
				<view class="statusM" v-if="item.act_type=='已过期'">
					{{item.act_type}}
				</view>
				<view class="status" v-else>
					{{item.act_type}}
				</view>
				<view class="allTime">
					<view class="orderTime">
						下单时间：{{item.create_time}}
					</view>
					<!-- 					<view class="expirationTime">
						到期时间：{{item.expire_time}}
					</view> -->
				</view>
				<view class="payWay">
					<view class="payWayL" v-if="item.pay_type==20">支付方式：微信支付</view>
					<view class="payWayL" v-if="item.pay_type==10">支付方式：余额支付</view>
					<view class="payWayL" v-if="item.pay_type==30">支付方式：支付宝支付</view>
					<view class="payWayR" v-if="item.pay_price!='0.00'">￥{{item.pay_price}}</view>
				</view>
			</view>
		</view>
		<view v-else>
			<view>
				<image src="../../static/defaults.png" style="margin-left: 60upx;"></image>
			</view>
			<view class="recordMessage">暂无消费记录哦~</view>
		</view>

		<!-- <view v-if="isSpringFrame" style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.7);z-index: 9;" catchtouchmove="true"></view> -->
		<view
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F8F8F8;z-index: -1;"
			catchtouchmove="true"></view>
	</view>
</template>

<script>
	const App = getApp();
	import store from '@/store'
	import * as memberApi from "@/api/member/index.js";
	import * as settingApi from '@/api/ticket/setting';
	// import {
	// 	code
	// } from "@/api/distribution/index.js";
	import * as commonApi from "@/api/home/rotation.js";
	import * as UserApi from '@/api/user';
	export default {
		data() {
			return {
				isShow: false,
				isSpringFrame: false,
				infos: {},
				invitLit: [],
				userInfo: {},
				bigUser: {},
				showRules: false,
				imgsrc: "",
				id: '',
				buyrecord: []
			}
		},
		onLoad(option) {
			console.log(option, 101)
			this.getInfo()
			this.id = option.userid
			console.log(this.id, 222)
			this.getRecord()
		},
		onShow() {
			this.getinvitLit()
		},
		onShareAppMessage() {
			const app = this
			const {
				page
			} = app
			return {
				title: '大会员专区',
				path: "/pageMember/pages/index/index?scene=" + this.$store.getters.userId,
				imageUrl: this.bigUser.setting.share_image.preview_url
			}
			// return {
			// 	title: "融汇商城",
			// 	path: "/pageMember/pages/index/index"
			// }
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
				title: "大会员专区",
				path: "/pageMember/pages/index/index?scene=" + this.$store.getters.userId,
				imageUrl: this.bigUser.setting.share_image.preview_url
			}
		},
		methods: {
			InviteNow() {

				// var _that=this;
				// uni.showActionSheet({
				// 	itemList: ['发送给朋友','生成二维码'],
				// 	success(res) {
				// 		console.log(res)
				// 		if(res.tapIndex==0){
				// 			// this.onShareAppMessage()
				// 		}else if(res.tapIndex==1){
				// 			_that.getCode();
				// 			_that.isSpringFrame=true;
				// 			// _this.getImgInfo(_this.infos.shareImage.preview_url)
				// 		}

				// 	}
				// })
				this.showRules = true;
			},
			cancel() {
				this.showRules = false;
			},
			generate() {
				this.getCode();
				this.showRules = false;
				this.isSpringFrame = true;
			},
			close() {

			},
			open() {

			},
			closes() {
				this.isSpringFrame = false
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
				memberApi.index().then(res => {
					this.bigUser = res.data;

				})
			},
			// 获取邀请列表
			getinvitLit() {
				var obj = {};
				obj.user_id = this.$store.getters.userId;
				memberApi.inviteList(obj).then(res => {
					console.log(res)
					this.invitLit = res.data.list.data
				})
			},
			showSave() {
				//console.log(1234)
				let _this = this;
				uni.showActionSheet({
					itemList: ['保存到相册'],
					success(res) {
						console.log(res)
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
					fail: err => {
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
						.then(rep => {
							ctx.drawImage(rep, 0, 0, rects1
								.width, rects1.height)
							ctx.draw();
							wx.hideLoading();
							that.saveImg()
						})
						.catch(err => {
							//console.log(err)
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
				return new Promise((resolve, reject) => {
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
						fail: err => {
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
										"saveImageToPhotosAlbum:fail:auth denied") {
										//console.log("打开设置窗口");
										uni.openSetting({
											success(settingdata) {
												//console.log(settingdata)
												if (settingdata.authSetting[
														"scope.writePhotosAlbum"
													]) {
													//console.log("获取权限成功，再次点击图片保存到相册")
												} else {
													//console.log("获取权限失败")
												}
											}
										})
									}
								}
							})
						},
						fail: err => {
							console.log(err)
						}
					});
				}, 1000);
			},
			getCode() {
				// let obj = {};
				// obj.type = 2;
				// // #ifdef MP-WEIXIN
				// obj.type = 1;
				// // #endif
				memberApi.code()
					.then(res => {
						this.imgsrc = res.message
						this.imgsrc = this.imgsrc.replace(/[\r\n]/g, '')
					})
			},
			getRecord() {

				memberApi.upgradeRecord({
					user_id: this.id
				}).then(res => {
					console.log(this.id, 333)
					this.buyrecord = res.data.upgrade_log.data
					console.log(this.buyrecord, 101)
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.invitat {
		padding-top: 40upx;
	}

	.allInfo {
		width: 702upx;
		// padding-top: 20upx;
		margin: 0 auto;
		position: relative;
	}

	.record {
		width: 702upx;
		height: 228upx;
		margin: 0 auto 24upx;
		// padding-top: 20upx;
		background-color: #FFFFFF;
		border-radius: 12upx;
	}

	.Vipmember {
		height: 72upx;
		width: 500upx;
		display: flex;
		justify-content: flex-start;
		// margin-top: 16upx;
		padding-top: 16upx;
		margin-left: 16upx;
		position: relative;
	}

	.vipIcon {
		width: 56upx;
		height: 56upx;

		// margin: 0 0 0 16upx;
		image {
			width: 100%;
			height: 100%;
		}
	}

	.vipName {
		font-size: 32upx;
		color: #333333;
		font-weight: 400;
		height: 44upx;
		margin: 6upx 0 0 8upx;
	}

	.status {
		width: 134upx;
		height: 48upx;
		background-color: #FBEACD;
		border-radius: 24upx 0 0 24upx;
		text-align: center;
		line-height: 48upx;
		color: #A27748;
		position: absolute;
		right: 0;
		top: 40upx;
	}

	.statusM {
		width: 134upx;
		height: 48upx;
		background-color: #EFEFEF;
		border-radius: 24upx 0 0 24upx;
		text-align: center;
		line-height: 48upx;
		color: #999999;
		position: absolute;
		right: 0;
		top: 40upx;
	}

	.allTime {
		width: 702upx;
		// height: 84upx;
		margin-top: 8upx;
	}

	.orderTime {
		// width: 402upx;
		height: 40upx;
		margin-left: 24upx;
		color: #666666;
		font-weight: 400;
		font-size: 28upx;
	}

	.expirationTime {
		// width: 402upx;
		height: 40upx;
		margin-left: 24upx;
		margin-top: 4upx;
		color: #666666;
		font-weight: 400;
		font-size: 28upx;
	}

	.payWay {
		width: 702upx;
		height: 40upx;
		// margin-left: 24upx;
		margin-top: 4upx;
		color: #666666;
		font-weight: 400;
		font-size: 28upx;
		display: flex;
		justify-content: space-between;
	}

	.payWayL {
		margin-left: 24upx;
	}

	.payWayR {
		margin-right: 24upx;
		text-align: center;
		line-height: 40upx;
		// width: 86upx;
		height: 40upx;
	}

	.recordMessage {
		text-align: center;

	}
</style>
