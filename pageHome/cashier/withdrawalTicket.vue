<template>
	<view class="withdrawal">
		<view class="withdrawal-head">
			<text class="withdrawal-head-text1">提现金额</text>
			<view class="withdrawal-head-item">
				<label style="font-size: 28upx;color: #333333;padding-top: 42upx;font-weight: bold;">￥</label>
				<input type="digit" @input="btn_input" name="money" v-model="money" placeholder="请输入提现金额" />
			</view>
			<view class="withdrawal-head-bottom">
				<text class="withdrawal-head-text2">可提现余额：￥{{type==1?userInfo.money:userInfo.commission}}</text>
				<view class="withdrawal-head-btn" @click="btn_dc">全部提现</view>
			</view>
		</view>
		<view class="withdrawalInfo">
			<view class="withdrawalPayType">
				<view class="withdrawalPayTypeL">收款方式</view>
				<radio-group v-model="payType" class="withdrawalPayTypeR">
					<label>
						<radio :value="1" class="withdrawalPayWay" color="#ff5060" v-if="payType==1" checked /><radio v-else :value="1" class="withdrawalPayWay" color="#ff5060" /><text>微信</text>
					</label>
					<!-- <label style="margin-left: 50upx;">
						<radio :value="2" class="withdrawalPayWay" color="#ff5060" v-if="payType==2" checked /><radio v-else :value="2" class="withdrawalPayWay" color="#ff5060" /><text>支付宝</text>
					</label> -->
				</radio-group>
			</view>
			<!-- <view class="withdrawalInfoT">
				<view class="withdrawalInfoTL">收款账号：</view>
				<input type="text" placeholder="请输入您的收款账号" v-model="account_number" />
			</view> -->
			<!-- <view class="withdrawalInfoB">
				<view class="withdrawalInfoBL">收款二维码：</view>
				<view class="withdrawalInfoBR" @click="uplaodImg" :style="{'border':imgInfo.preview_url?'none':'2upx solid #CCCCCC'}">
					<image :src="imgInfo.preview_url?imgInfo.preview_url:'../../static/user/uploadImg.png'" :style="{'width':imgInfo.preview_url?'100%':'38upx','height':imgInfo.preview_url?'100%':'38upx'}"></image>
				</view>
			</view> -->
		</view>
		<!-- <view style="box-sizing: border-box;padding: 0 30upx;margin-top: 30upx;color: #999999;">*收款二维码必须上传</view> -->
		<view style="box-sizing: border-box;padding: 0 30upx;margin-top: 10upx;color: #999999;">*最低提现{{msg.least_withdraw_money}}元</view>
		<view style="box-sizing: border-box;padding: 0 30upx;margin-top: 10upx;color: #999999;">*{{msg.withdraw_date}}天内只能提现一次</view>
		<view style="box-sizing: border-box;padding: 0 30upx;margin-top: 30upx;color: #999999;">*提现金额将在1-3个工作日内到账</view>
		<view style="box-sizing: border-box;padding: 0 30upx;margin-top: 10upx;color: #999999;">*提现手续费为千分之{{msg.service_charge}}</view>
		<view class="withdrawal-footer" @click="btn_drawal">确定提现</view>
		<view
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F1F1F1;z-index: -1;"
			catchtouchmove="true"></view>
	</view>
</template>

<script>
	import * as UserApi from '@/api/user';
	import {detail} from "@/api/common.js";
	const App = getApp();
	export default {
		data() {
			return {
				money: 0,
				auser_list: '',
				withdrawal_img: '',
				test_money: 0,
				ausermomey: 0,
				userInfo: {},
				type:1,//1为退款余额提现，2位佣金提现
				imgInfo:{},
				account_number:"",
				payType:1,
				msg:{}
			}
		},
		onLoad(options) {
			this.type = options.type;
			this.getPageData();
			this.getDetail()
		},
		onShow() {

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
						this.msg = res.data.detail;
					})
			},
			uplaodImg(){
				let _this = this;
				uni.chooseImage({
					count:1,
					success:res=>{
						uni.uploadFile({
							url:App.globalData.uploadBaseUrl + "api/upload/image",
							filePath:res.tempFilePaths[0],
							header:{
								'Access-Token':_this.$store.getters.token
							},
							name:"file",
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
				let money = this.type == 1 ? this.userInfo.money : this.userInfo.commission;
				if (Number(num) > Number(money)) {
					setTimeout(() => {
						this.money = money;
					}, 100)
				}
			},
			btn_dc() {
				let money = this.type == 1 ? this.userInfo.money : this.userInfo.commission;
				this.money = money;
			},
			btn_drawal() {
				if (this.money < 1) {
					uni.showToast({
						icon: 'none',
						title: "提现金额不能为1"
					})
					return false;
				}
				if(Number(this.money) < Number(this.msg.least_withdraw_money)){
					uni.showToast({
						icon: 'none',
						title: "提现金额最低为"+this.msg.least_withdraw_money+"元"
					})
					return false;
				}
				
				let money = this.money;
				let ssfMoney = (Number(this.money)*Number(this.msg.service_charge)/1000).toFixed(2);
				let _this = this;
				uni.showModal({
					content:"本次提现" + money + "元，需支付手续费" + ssfMoney + "元，实际到账" + (Number(money) - Number(ssfMoney)) + "元",
					title:"提现说明",
					success(res) {
						//console.log(res)
						if(res.confirm){
							let flag = false;
							// if(_this.account_number || _this.imgInfo.file_id){
							// 	flag = true;
							// }
							// if(!flag){
							// 	uni.showToast({
							// 		icon: 'none',
							// 		title: "收款二维码必须上传"
							// 	})
							// 	return false;
							// }
							let obj = {};
							obj.form = {};
							obj.form.data = {};
							obj.form.data.price = _this.money;
							obj.form.data.if_commission = _this.type == 1 ? 2 : 1;
							// obj.form.image = {};
							// obj.form.image.account_number = _this.account_number;
							// obj.form.image.image = _this.imgInfo.file_id;
							// obj.form.image.type = _this.payType;
							UserApi.withdrawalAdd(obj)
								.then(res=>{
									//console.log(res)
									uni.showToast({
										icon: 'none',
										title: res.message
									})
									setTimeout(()=>{
										let url = "/pageHome/distribution/withdrawal/index?type=";
										let query = _this.type == 1 ? 2 : 1
										url = url + query;
										uni.redirectTo({
											url
										})
									},1500)
								})
								.catch(err=>{
									uni.showToast({
										icon: 'none',
										title: res.message
									})
								})
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.withdrawalPayType{
		display: flex;
		align-items: center;
		margin-bottom: 30upx;
	}
	.withdrawalPayType>view:nth-child(1){
		width: 180upx;
		font-size: 28upx;
		line-height: 28upx;
		color: #333333;
	}
	.withdrawalPayWay{
		transform: scale(.7);
	}
	.withdrawalInfo{
		width: 690upx;
		margin: 30upx auto 0;
		box-sizing: border-box;
		border-radius: 12upx;
		background: white;
		padding: 30upx;
	}
	.withdrawalInfoT{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.withdrawalInfoT>view:nth-child(1),.withdrawalInfoB>view:nth-child(1){
		width: 180upx;
		font-size: 28upx;
		line-height: 28upx;
		color: #333333;
	}
	.withdrawalInfoT>input{
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
	.withdrawalInfoB{
		width: 100%;
		display: flex;
		margin-top: 30upx;
	}
	.withdrawalInfoBR{
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
	.withdrawalInfoBR>image{
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
