<template>
	<view class="withdrawal">
		<head-nav title="提现" :backFlag="true" color="white" backGround="linear-gradient(90deg, #FF5F60, #DE6BAD)"
			backType="other" :fontSize="36"></head-nav>
		<view class="headNav">
			<view class="headNavT">
				<view class="headNavTL">可提现余额</view>
				<view class="headNavTR" @click="btn_record">提现记录</view>
			</view>
			<view class="headNavB">
				<text>￥</text>
				{{userInfo.balance||0}}
			</view>
		</view>
		<view class="withdrawalCon">
			<view class="withdrawalConT">提现金额</view>
			<view class="withdrawalConC">
				<input type="digit" @input="btn_input" v-model="money" placeholder="输入提现金额"
					placeholder-style="color:#cccccc" />
				<text @click="btn_dc">全部提现</text>
			</view>
			<view class="withdrawalConB">
				<view class="withdrawalConBL">提现至</view>
				<view class="withdrawalConBR">
					<image src="../../static/home/wx_icon.png" class="withdrawalConBRL"></image>
					<text class="withdrawalConBRC">微信</text>
					<image src="../../static/icon/more_gray.png" class="withdrawalConBRR"></image>
				</view>

			</view>
			<view class="withdrawalInfoB">
				<view class="withdrawalInfoBL">收款人信息：</view>
				<view class="withdrawalInfoBR" @click="uplaodImg"
					:style="{'border':imgInfo.preview_url?'none':'2upx solid #CCCCCC'}">
					<image :src="imgInfo.preview_url?imgInfo.preview_url:'../../static/user/uploadImg.png'"
						:style="{'width':imgInfo.preview_url?'100%':'38upx','height':imgInfo.preview_url?'100%':'38upx'}">
					</image>
				</view>
			</view>
			<view class="withdrawalInfoB">
				<view style="width: 250rpx;" class="withdrawalInfoBL">收款人信息示例：</view>
				<view class="withdrawalInfoBR" @click="previewImg" style="border:none">
					<image src="https://oss.gzrhhj.com/10001/20230313/c547dae400bc6eb28987312ac4a94ada.png"
						style="width: 100%;height: 100%;">
					</image>
				</view>
			</view>
		</view>

		<view class="submit" @click="btn_drawal">立即提现</view>
		<!-- <view style="box-sizing: border-box;padding: 0 30upx;margin-top: 30upx;color: #999999;">1、单次提现金额最高为200元；</view>
		<view style="box-sizing: border-box;padding: 0 30upx;margin-top: 10upx;color: #999999;">2、提现平台将收取千分之{{msg.service_charge}}手续费；</view>
		<view style="box-sizing: border-box;padding: 0 30upx;margin-top: 10upx;color: #999999;">3、提现周期：每月提现周期为1号至31号；</view>
		<view style="box-sizing: border-box;padding: 0 30upx;margin-top: 10upx;color: #999999;">4、提现到账时间：提现审核通过后，T+1个工作日到账（如遇法定节假日顺延）；</view>
		<view style="box-sizing: border-box;padding: 0 30upx;margin-top: 10upx;color: #999999;">5、确认收货后，佣金实时到账，若佣金到账后，则不可退换货；</view>
		<view style="box-sizing: border-box;padding: 0 30upx;margin-top: 10upx;color: #999999;">6、如果疑问请联系客服咨询；</view> -->
		<view class="conWraps" style="padding: 30rpx;" v-html="commonL.withdrawal_rules">
		</view>
		<view class="successMark" v-if="successFlag" @click="hideSuccess"></view>
		<view class="successCon" v-if="successFlag">
			<view class="successConBox">
				<image src="../../static/mine/success.png" class="successConT" v-if="successTxt=='成功'"></image>
				<image src="../../static/mine/fail.png" class="successConT" v-if="successTxt=='失败'"></image>
				<view class="successConC">
					{{successTxt=='成功'?'提现申请提交成功':'提现申请提交失败'}}
				</view>
				<view class="successConB">
					<view class="successConBT">{{successTxt=='成功'?'预计T+1工作日内到账':'失败原因：提现申请提交失败'}}</view>
					<view class="successConBB">{{successTxt=='成功'?'实际到账时间以{微信}为准':'请稍后再试'}}</view>
				</view>
			</view>
			<image src="../../static/home/close_icon.png" class="successConClose" @click="hideSuccess"></image>
		</view>
		<view
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F1F1F1;z-index: -1;"
			catchtouchmove="true"></view>
		<!-- <rc-upload-img ref="rcUploadImg" :money="money"></rc-upload-img> -->

	</view>
</template>

<script>
	import * as UserApi from '@/api/user';
	import {
		detail
	} from "@/api/common.js";
	import headNav from '@/components/seckillNav.vue'
	import * as settingApi from '@/api/ticket/setting'
	const App = getApp();
	export default {
		data() {
			return {
				successFlag: false,
				successTxt: "",
				money: '',
				auser_list: '',
				withdrawal_img: '',
				test_money: 0,
				ausermomey: 0,
				userInfo: {},
				type: 1, //1为退款余额提现，2位佣金提现
				imgInfo: {},
				account_number: "",
				payType: 1,
				msg: {},
				commonL: {},
				photoList: []
			}
		},
		components: {
			headNav,
		},
		onLoad(options) {
			this.type = options.type;
			this.getPageData();
			this.getDetail();
			// this.getCommon();
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
			getCommon() {
				settingApi.detail().then(res => {
					// res.data.detail.withdrawal_rules = res.data.detail.withdrawal_rules.replace(/<img/g,
					// 							"<img style='width:100%'");
					// 						this.commonL = res.data.detail
				}).catch(err => {})
			},
			getImgList(e) {
				this.photoList = e
			},
			hideSuccess() {
				this.successFlag = false;
				this.successTxt = "";
			},
			btn_record() {
				this.$navTo('pageHome/distribution/withdrawal/index', {
					type: 1
				})
			},
			getDetail() {
				detail()
					.then(res => {
						//console.log(res)
						this.msg = res.data.detail;
						res.data.detail.withdrawal_rules = res.data.detail.withdrawal_rules.replace(/<img/g,
							"<img style='width:100%'");
						this.commonL = res.data.detail
					})
			},
			previewImg() {
				uni.previewImage({
					urls: 'https://oss.gzrhhj.com/10001/20230313/c547dae400bc6eb28987312ac4a94ada.png',
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			uplaodImg() {
				let _this = this;
				uni.chooseImage({
					count: 1,
					success: res => {
						uni.uploadFile({
							url: App.globalData.uploadBaseUrl + "api/upload/image",
							filePath: res.tempFilePaths[0],
							header: {
								'Access-Token': _this.$store.getters.token
							},
							name: "file",
							success: (rep) => {
								//console.log(rep);
								let data = JSON.parse(rep.data);
								_this.imgInfo = data.data.fileInfo;
							}
						})
					}
				})
			},
			// 获取页面数据
			getPageData() {
				const app = this
				app.isLoading = true
				Promise.all([app.getUserInfo()])
					.then(() => app.isLoading = false)
			},

			// 获取会员信息
			getUserInfo() {
				const app = this
				return new Promise((resolve, reject) => {
					UserApi.info()
						.then(result => {
							app.userInfo = result.data.userInfo
							resolve(app.userInfo)
						})
				})
			},
			btn_input(e) {
				//console.log(e)
				let num = e.detail.value || e.target.value;
				let money = this.userInfo.balance;
				// if(this.type == 10){
				// 	money = this.userInfo.refund;
				// }
				if (Number(num) > Number(money)) {
					setTimeout(() => {
						this.money = money;
					}, 100)
				}
			},
			btn_dc() {
				let money = this.userInfo.balance;
				// if(this.type == 10){
				// 	money = this.userInfo.refund;
				// }
				this.money = money;
			},
			btn_drawal() {

				// this.$refs.rcUploadImg.showAgree = true;
				// return;
				if (Number(this.money) > Number(this.msg.most_withdraw_money)) {
					uni.showToast({
						icon: 'none',
						title: "提现金额最高为" + this.msg.most_withdraw_money + "元"
					})
					return false;
				}
				if (Number(this.money) < Number(this.msg.least_withdraw_money)) {
					uni.showToast({
						icon: 'none',
						title: "提现金额最低为" + this.msg.least_withdraw_money + "元"
					})
					return false;
				}

				let money = this.money;
				let ssfMoney = (Number(this.money) * Number(this.msg.service_charge) / 1000).toFixed(2);
				let str = "";
				if (this.msg.service_charge > 0) {
					str = "本次提现" + money + "元，需支付手续费" + ssfMoney + "元，实际到账" + (Number(money) - Number(ssfMoney)) + "元"
				} else {
					str = "本次提现" + money + "元，实际到账" + money + "元"
				}
				let _this = this;
				uni.showModal({
					content: str,
					title: "提现说明",
					success(res) {
						//console.log(res)
						if (res.confirm) {
							let flag = false;
							if (_this.account_number || _this.imgInfo.file_id) {
								flag = true;
							}
							if (!flag) {
								uni.showToast({
									icon: 'none',
									title: "收款二维码必须上传"
								})
								return false;
							}
							let obj = {};
							obj.form = {};
							obj.form.data = {};
							obj.form.data.price = _this.money;
							obj.form.data.if_commission = _this.type == 1 ? 2 : 1;
							if (_this.type == 10) {
								obj.form.data.if_commission = 3;
							}
							obj.form.image = {};
							obj.form.image.account_number = _this.account_number;
							obj.form.image.image = _this.imgInfo.file_id;
							obj.form.image.type = _this.payType;
							UserApi.withdrawalAdd(obj)
								.then(res => {
									//console.log(res)
									// uni.showToast({
									// 	icon: 'none',
									// 	title: res.message
									// })
									_this.successFlag = true;
									_this.successTxt = "成功";
									_this.getPageData();
									// setTimeout(()=>{
									// 	let url = "/pageHome/distribution/withdrawal/index";
									// 	// let query = _this.type == 1 ? 2 : 1
									// 	// if(_this.type == 10){
									// 	// 	query = 3;
									// 	// }
									// 	// url = url + query;
									// 	uni.redirectTo({
									// 		url
									// 	})
									// },1500)
								})
								.catch(err => {
									_this.successFlag = true;
									_this.successTxt = "失败";
									// uni.showToast({
									// 	icon: 'none',
									// 	title: res.message
									// })
								})
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.successMark {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9;
		background: rgba(0, 0, 0, .5);
	}

	.successCon {
		width: 550rpx;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		flex-direction: column;
		z-index: 10;
	}

	.successConBox {
		width: 550rpx;
		height: 550rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 112rpx 0 116rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		background: #fde8eb;
	}

	.successConT {
		width: 122rpx;
		height: 122rpx;
	}

	.successConC {
		font-size: 36rpx;
		font-family: PingFang;
		font-weight: bold;
		color: #595757;
		line-height: 36rpx;
	}

	.successConB {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.successConBT,
	.successConBB {
		font-size: 24rpx;
		line-height: 24rpx;
		color: #595757;
	}

	.successConBT {
		margin-bottom: 10rpx;
	}

	.successConClose {
		width: 50rpx;
		height: 50rpx;
		margin-top: 68rpx;
	}




	.withdrawalCon {
		width: 690rpx;
		background: white;
		margin: 0 auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 30rpx;
		transform: translateY(-32rpx);
	}

	.withdrawalConT {
		font-size: 28rpx;
		line-height: 28rpx;
		color: #686868;
		margin-bottom: 30rpx;
	}

	.withdrawalConC {
		width: 100%;
		padding: 10rpx 0;
		border-bottom: 2rpx solid rgba(153, 153, 153, .3);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.withdrawalConC>input {
		width: calc(100% - 142rpx);
		height: 50rpx;
		font-size: 50rpx;
		line-height: 50rpx;
	}

	.withdrawalConC>text {
		font-size: 28rpx;
		line-height: 28rpx;
		color: #FD6064;
	}

	.withdrawalConB {
		margin-top: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.withdrawalConBL {
		font-size: 28rpx;
		line-height: 28rpx;
		color: #686868;
	}

	.withdrawalConBR {
		display: flex;
		align-items: center;
	}

	.withdrawalConBRL {
		width: 38rpx;
		height: 32rpx;
		margin-right: 6rpx;
	}

	.withdrawalConBRC {
		font-size: 28rpx;
		line-height: 28rpx;
		color: #686868;
		margin-right: 20rpx;
	}

	.withdrawalConBRR {
		width: 12rpx;
		height: 22rpx;
	}

	.submit {
		width: 690rpx;
		height: 70rpx;
		margin: 60rpx auto 0;
		line-height: 70rpx;
		text-align: center;
		border-radius: 36rpx;
		background: linear-gradient(47deg, #FD6066 0%, #DF6BAE 100%);
		font-size: 36rpx;
		color: white;
	}



	.headNav {
		width: 100%;
		height: 288rpx;
		background: linear-gradient(90deg, #FF5F60, #DE6BAD);
		box-sizing: border-box;
		padding-top: 70rpx;
	}

	.headNavT {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
	}

	.headNavTL {
		font-size: 32rpx;
		line-height: 32rpx;
		color: white;
	}

	.headNavTR {
		height: 40rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
		border-radius: 20rpx;
		border: 2rpx solid white;
		font-size: 24rpx;
		line-height: 36rpx;
		color: white;
	}

	.headNavB {
		display: flex;
		align-items: baseline;
		box-sizing: border-box;
		padding: 0 30rpx;
		font-size: 100rpx;
		line-height: 100rpx;
		color: white;
		height: 100rpx;
	}

	.headNavB>text {
		font-size: 60rpx;
		line-height: 60rpx;
		color: white;
	}

	/* .headNavB>input{
		font-size: 100rpx;
		line-height: 100rpx;
		color: white;
		height: 100rpx;
	} */



	.withdrawalPayType {
		display: flex;
		align-items: center;
		margin-bottom: 30upx;
	}

	.withdrawalPayType>view:nth-child(1) {
		width: 180upx;
		font-size: 28upx;
		line-height: 28upx;
		color: #333333;
	}

	.withdrawalPayWay {
		transform: scale(.7);
	}

	.withdrawalInfo {
		width: 690upx;
		margin: 30upx auto 0;
		box-sizing: border-box;
		border-radius: 12upx;
		background: white;
		padding: 30upx;
	}

	.withdrawalInfoT {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.withdrawalInfoT>view:nth-child(1),
	.withdrawalInfoB>view:nth-child(1) {
		width: 180upx;
		font-size: 28upx;
		line-height: 28upx;
		color: #333333;
	}

	.withdrawalInfoT>input {
		width: calc(100% - 180upx);
		height: 60upx;
		box-sizing: border-box;
		border: 2upx solid #C0C0C0;
		background: white;
		border-radius: 12upx;
		font-size: 28upx;
		padding: 0 16upx;
		outline: none;
	}

	.withdrawalInfoB {
		width: 100%;
		display: flex;
		margin-top: 30upx;
		align-items: center
	}

	.withdrawalInfoBR {
		width: 120upx;
		height: 120upx;
		box-sizing: border-box;
		border: 2upx solid #CCCCCC;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6upx;
		background: white;
	}

	.withdrawalInfoBR>image {
		width: 38upx;
		height: 38upx;
	}

	.withdrawalInfoB {
		width: 100%;
		display: flex;
		margin-top: 30upx;
	}

	.withdrawalInfoBR {
		width: 120upx;
		height: 120upx;
		box-sizing: border-box;
		border: 2upx solid #CCCCCC;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6upx;
		background: white;
	}

	.withdrawalInfoBR>image {
		width: 38upx;
		height: 38upx;
	}

	.withdrawal {
		width: 100%;
		background-color: #F1F1F1;
		position: relative;
	}

	/* head */
	.withdrawal-head {
		width: 610upx;
		background-color: #FFFFFF;
		border-radius: 10upx;
		margin: 0 auto;
		margin-top: 60upx;
		padding: 40upx 42upx 42upx 40upx;
		border-radius: 20upx;
	}

	.withdrawal-head-text1 {
		font-size: 28upx;
		color: #7C838D;
	}

	.withdrawal-head-text2 {
		font-size: 28upx;
		color: #7C838D;

	}

	.withdrawal-head-item {
		font-size: 72upx;
		color: #121922;
		border-bottom: 2upx solid #E4E4EE;
		padding-bottom: 38upx;
		padding-top: 38upx;
		display: flex;
		flex-direction: row;
	}

	.withdrawal-head-item>input {
		height: 96upx;
		margin-left: 10upx;
	}

	.withdrawal-head-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-top: 60upx;
	}

	.withdrawal-head-btn {
		font-size: 28upx;
		color: #ff5060;
	}

	/* main */
	.withdrawal-main {
		padding: 50upx 30upx 0 30upx;
	}

	.withdrawal-main-text1 {
		font-size: 28upx;
		color: #333333;
	}

	.withdrawal-main-text2 {
		font-size: 22upx;
		color: #FF4444;
	}

	.withdrawal-main-item {
		display: flex;
		flex-direction: row;
		margin-top: 26upx;
		margin-bottom: 26upx;
	}

	.withdrawal-main-icon1 {
		width: 100upx;
		height: 100upx;
	}

	.withdrawal-main-icon1>image {
		width: 100%;
		height: 100%;
	}

	.withdrawal-main-icon2 {
		width: 100upx;
		height: 100upx;
		margin-left: 20upx;
	}

	.withdrawal-main-icon2>image {
		width: 100%;
		height: 100%;
	}

	/* footer */
	.withdrawal-footer {
		width: 690upx;
		height: 96upx;
		line-height: 96upx;
		border-radius: 48upx;
		color: #FFFFFF;
		text-align: center;
		background-color: #ff5060;
		margin: 50upx auto 0;
	}
</style>
