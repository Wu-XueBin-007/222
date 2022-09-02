<template>
	<view class="invitat">
		<view class="invitatT">
			<view class="invitatTT">
				邀请列表
			</view>
			<view class="invitatMain" v-if="invitLit.length>0">
				<view class="invitatItem" v-for="(item,index) in invitLit" :key="index">
					<view class="invitatItemL">
						<view class="invitatItemLT" v-if="item.user">
							<image :src="item.user.avatar_url" mode=""></image>
						</view>
						<view class="invitatItemLB">
							<view class="invitatItemLBT" v-if="item.user">
								{{item.user.nick_name}}
							</view>
							<view class="invitatItemLBB">
								消费金额 <text>{{item.expend_money}}</text>
							</view>
						</view>
					</view>
					
					<view class="invitatItemR">
						<view class="invitatItemRT" v-if="item.is_vip==1">
							<image src="../../static/vip.png" mode=""></image>
						</view>
						<view class="invitatItemRB">
							邀请时间 <text>{{item.create_time}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="invitatMain" v-else>
				<view class="invitatMImage">
					<image src="../../static/defaults.png" mode=""></image>
				</view>
				<view class="invitatMText">
					暂无邀请好友
				</view>
			</view>
		</view>
		<view class="invitatB" @click="InviteNow">
			立即邀请
		</view>
		<view class="springFrame" v-if="isSpringFrame">
			<view class="springFrameT" :style="{'background-image': 'url('+bigUser.setting.poster_image.preview_url+')'}">
			<!-- <view class="springFrameT" style="background: url(../../static/back3.png);"> -->
				<!-- <image src="../../static/refund.png" mode=""></image> -->
				<view class="springUser">
					<view class="springUserImage" v-if="bigUser.big_vip_user.user">
						<image :src="bigUser.big_vip_user.user.avatar_url" mode=""></image>
					</view>
					<view class="springUserText" v-if="bigUser.big_vip_user.user">
						{{bigUser.big_vip_user.user.nick_name}}
					</view>
				</view>
				<image :src="imgsrc" style="width: 200upx;height: 200upx;position: absolute;bottom: 80upx;right: 98upx;" id="qrCode"></image>
				<canvas canvas-id="myCanvas" style="width: 200upx;height: 200upx;position: absolute;top: -9999999999999px;" />
			</view>
			<view class="springFrameB" @click="showSave">
				保存到本地
			</view>
			<view class="springFrameImage" @click="closes">
				<image src="../../static/icon_gb.png" mode=""></image>
			</view>
		</view>
		<u-popup v-model="showRules" mode="bottom"  @close="close" @open="open">
			<view style="max-height: 740upx;background-color: rgba(0, 0, 0, 0.6);padding: 10upx;">
				<view class="friendsT">
					<view class="friendsTT">
						
						<button open-type="share">
							发送给朋友
						</button>
					</view>
					<view class="friendsTB" @click="generate">
						生成二维码
					</view>
				</view>
				<view class="friendsB" @click="cancel">
					取消
				</view>
			</view>
		</u-popup>
		<view v-if="isSpringFrame" style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.7);z-index: 9;" catchtouchmove="true"></view>
		<view style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #000000;z-index: -1;" catchtouchmove="true"></view>
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
		data(){
			return {
				isShow:false,
				isSpringFrame:false,
				infos: {},
				
				invitLit:[],
				userInfo:{},
				bigUser:{},
				showRules:false,
				imgsrc: "",
			}
		},
		onLoad() {
			this.getInfo()
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
				title:'大会员专区',
				path:"/pageMember/pages/index/index?userId="+this.$store.getters.userId,
				imageUrl:this.bigUser.setting.share_image.preview_url
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
				path: "/pageMember/pages/index/index?userId="+this.$store.getters.userId,
				imageUrl:this.bigUser.setting.share_image.preview_url
			}
		},
		methods: {
			InviteNow(){
				
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
				this.showRules=true;
			},
			cancel(){
				this.showRules=false;
			},
			generate(){
				this.getCode();
				this.showRules=false;
				this.isSpringFrame=true;
			},
			close(){
				
			},
			open(){
				
			},
			closes(){
				this.isSpringFrame=false
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
					memberApi.index().then(res=>{
						this.bigUser=res.data;
						
					})
			},
			// 获取邀请列表
			getinvitLit(){
				var obj={};
				obj.user_id=this.$store.getters.userId;
				memberApi.inviteList(obj).then(res=>{
					console.log(res)
					this.invitLit=res.data.list.data
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
						fail:err=>{
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.invitat{
		.invitatT{
			width: 702upx;
			margin: 24upx auto 0;
			border-radius: 20upx;
			// height: calc(100% - 100px);
			height: 1028upx;
			overflow: hidden;
			background-color: #FFFFFF;
			.invitatTT{
				width: 702upx;
				height: 98upx;
				background: linear-gradient(87deg, #FFFFFF 0%, #F6E3C8 47%, #E8BE8A 100%);
				border-radius: 20upx 20upx 0px 0px;
				line-height: 98upx;
				font-size: 32upx;
				color: #542400;
				font-weight: bold;
				text-align: center;
			}
			.invitatMain{
				width: 702upx;
				background-color: #FFFFFF;
				// max-height: 740upx;
				overflow-y: auto;
				height: calc(100% - 98upx);
				border-radius: 0 0 20upx 20upx;
				.invitatMImage{
					width: 350upx;
					height: 272upx;
					margin: 244upx auto 0;
					image{
						width: 100%;
						height: 100%;
						vertical-align: top;
					}
				}
				.invitatMText{
					font-size: 28upx;
					color: #848484;
					font-weight: bold;
					margin: 32upx auto 0;
					text-align: center;
				}
				.invitatItem{
					display: flex;
					justify-content: space-between;
					padding: 26upx 24upx;
					
					border-bottom: 1upx solid #E8E8E8;
					.invitatItemL{
						display: flex;
						.invitatItemLT{
							width: 70upx;
							height: 70upx;
							border-radius: 50%;
							image{
								width: 100%;
								height: 100%;
								border-radius: 50%;
							}
						}
						.invitatItemLB{
							margin-left: 12upx;
							.invitatItemLBT{
								font-size: 30upx;
								color: #333333;
								font-weight: bold;
								overflow:hidden;
								text-overflow:ellipsis;
								white-space:nowrap;
							}
							.invitatItemLBB{
								margin-top: 10upx;
								font-size: 26upx;
								color: #333333;
								text{
									font-size: 26upx;
									color: #EF343D;
									margin-left: 12upx;
									font-weight: bold;
								}
							}
						}
					}
					.invitatItemR{
						position: relative;
						margin-left: 50upx;
						.invitatItemRT{
							width: 52upx;
							height: 52upx;
							position: absolute;
							top: -4rpx;
							right: 0;
							image{
								width: 100%;
								height: 100%;
							}
						}
						.invitatItemRB{
							margin-top: 48upx;
							font-size: 26upx;
							color: #333333;
							text{
								font-size: 26upx;
								color: #333333;
								margin-left: 12upx;
							}
						}
					}
				}
			}
			
		}
		.invitatB{
			width: 530upx;
			height: 80upx;
			background-color: #EF343D;
			color: #FFFFFF;
			text-align: center;
			line-height: 80upx;
			border-radius: 40upx;
			font-size: 26upx;
			font-weight: bold;
			margin:  56upx auto 14upx;
		}
		.springFrame{
			position: fixed;
			top: 164upx;
			left: 130upx;
			width: 500upx;
			
			z-index: 99;
			.springFrameT{
				width: 414upx;
				height: 732upx;
				background-color: #FFFFFF;
				position: relative;
				margin: 0 auto;
				background-position: 0 0;
				background-size: 100% 100%;
			}
			.springFrameB{
				width: 450upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				background-color: #EF343D;
				border-radius: 40upx;
				font-size: 26upx;
				font-weight: bold;
				color: #FFFFFF;
				margin: 50upx auto 0;
			}
			.springFrameImage{
				position: absolute;
				top: -64upx;
				right: -10upx;
				width: 48upx;
				height: 48upx;
				image{
					width: 100%;
					height: 100%;
				}
			}
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
		
		.springUser{
			display: flex;
			position: absolute;
			left: 0;
			bottom: 300rpx;
		}
		.springUserImage{
			width: 40upx;
			height: 40upx;
			border-radius: 50%;
			margin-left: 40upx;
			image{
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.springUserText{
			font-size: 24upx;
			color: #EECDA3;
			font-weight: bold;
			margin-left: 14upx;
			line-height: 40upx;
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
		}
		.friendsT{
			// width: 690upx;
			margin: 0 auto 0;
			border-radius: 20upx;
			background-color: #FFFFFF;
			.friendsTT{
				font-size: 28upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				border-bottom: 1upx solid #B2B2B2;
				button{
					width: 100%;
					font-size: 28upx;
					background-color: rgba(0, 0, 0, 0.01);
				}
			}
			.friendsTB{
				font-size: 28upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
			}
		}
		
		.friendsB{
			// width: 690upx;
			margin: 40upx auto 40upx;
			border-radius: 20upx;
			background-color: #FFFFFF;
			font-size: 28upx;
			height: 80upx;
			line-height: 80upx;
			text-align: center;
		}
	}
</style>