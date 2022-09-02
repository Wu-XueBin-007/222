<template>
	<view style="width: 100%;height: 100vh;box-sizing: border-box;background: #F3F3F3;padding: 30upx 24upx 130upx;overflow-y: auto;">
		<view class="quota">
			<view class="quotaL">
				剩余话费额度：
			</view>
			<view class="quotaR">
				<view class="quotaRL" v-if="bigVip.setting">
					{{bigVip.setting?bigVip.setting.surplus_recharge_limit:0}}
				</view>
				<view class="quotaRR" v-if="bigVip.setting">
					：{{bigVip.setting?bigVip.setting.recharge_limit:0}}
				</view>
			</view>
		</view>
		<view class="rechargeMsg">
			<view class="title">
				<text>话费充值</text>
				<text @click="recharHis">充值记录>></text>
			</view>
			<view class="phoneWrap">
				<input type="number" v-model="mobile" @blur="getValue" maxlength="13" disabled/>
				<!-- <image src="../../static/prepaidRefill/icon_addressbook.png" mode="" @click="choicePhone"></image> -->
			</view>
			<view class="priceWrap">
				<view :class="['priceItem',packageIndex==index?'active':'']" v-for="(item,index) in list" :key="index" :data-index="index" @click="choicePackage">
					<view class="oPrice">
						<text>{{item.price}}</text>元
					</view>
					<view class="pPrice">售价:{{item.actual_price}}元</view>
				</view>
			</view>
			<view class="rules">
				<rich-text :nodes="info.mobile_agreement" v-if="info.mobile_agreement"></rich-text>
				<!-- <view class="ruleItem">1. 全国三网快充，正常情况下均可1小时内到账；</view>
				<view class="ruleItem">2. 停机欠费可以正常到账；</view>
				<view class="ruleItem">3. 空号、携号转网和虚拟号段不支持充值；</view>
				<view class="ruleItem">4. 如充值号码为副卡，为保证充值效率，请给对应主卡充值；</view>
				<view class="ruleItem">5. 如有疑问，可以联系客服进行咨询，客服在线时间（8:30-18:30）。</view> -->
			</view>
		</view>
		<view class="payTitle">支付方式</view>
		<view class="payCon">
			<view class="payConItem" data-index="0" @click="selectPayType">
				<view class="payConItemL">
					<image src="../../static/icon/icon_wxzf.png" mode="widthFix"></image>
					<text>微信支付</text>
				</view>
				<view :class="['payConItemR',payIndex==0?'active':'']">
					<image src="../../static/icon/right.png"></image>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<!-- <view class="payConItem" data-index="1" @click="selectPayType">
				<view class="payConItemL">
					<image src="../../static/icon/icon_zfbzf.png" mode="widthFix"></image>
					<text>支付宝支付</text>
				</view>
				<view :class="['payConItemR',payIndex==1?'active':'']">
					<image src="../../static/icon/right.png"></image>
				</view>
			</view> -->
			<!-- #endif -->
			<!-- <view class="payConItem" data-index="2" @click="selectPayType">
				<view class="payConItemL">
					<image src="../../static/icon/icon_ye.png" mode="widthFix"></image>
					<text>余额支付</text>
				</view>
				<view :class="['payConItemR',payIndex==2?'active':'']">
					<image src="../../static/icon/right.png"></image>
				</view>
			</view> -->
		</view>
		<checkbox-group @change="changeFlag">
			<view style="margin-top: 30upx;display: flex;align-items: center;">
				<label>
					<checkbox value="1" color="#ff5060" style="transform: scale(.7);" />
				</label>
				<view>充值前请先阅读并同意<text style="color: red;" @click="toProto">《充值协议》</text></view>
			</view>
		</checkbox-group>
		<view class="submitBtn" @click="submit">立即充值</view>
		
		<view v-if="showModalStatus3&&bigVip.big_vip_user.is_vip==0">
			<view class="home-popup2" catchtouchmove="true" >
			 	<view class="home-box2">
			 		<image src="../../static/notvip_model.png" mode="widthFix"></image>
			 		<view class="memberT">
			 			1、"我的"-成为大会员-<text @click="buyNow">点击购买</text>。
			 		</view>
			 		<view class="memberB">
			 			2、“高奢名品”专区累计消费3000元即可。
			 		</view>
			 		<view style="position: absolute; top: 544upx; left: 112upx; width: 306upx; height: 88upx;" @click="toIndex"></view>
			 	</view>
			 	<view class="home-popup2-close" @click="box_close3">
			 		<!-- <image src="../../static/home/icon_close.png" mode=""></image> -->
			 	</view>
			 </view>
			 <view style="background: #000000 ; width: 750upx; height: 1500upx; z-index: 1; opacity: 0.6; position: absolute; top: 0; left: 0; right: 0; bottom: 0;"></view>
		</view>
	</view>
</template>

<script>
	import * as rechargeApi from "@/api/prepaidRefill.js";
	import * as memberApi from "@/api/member/index.js";
	import {detail} from "@/api/common.js";
	var timer = null;
	import {
		wxPayment,zfbPayment
	} from '@/utils/app'
	export default {
		data() {
			return {
				name: "",
				mobile: "",
				packageIndex: 0,
				payIndex: 0,
				list: [],
				agreeFlag:false,
				info:{},
				bigVip:{},
				showModalStatus3:false
			}
		},
		onLoad() {
			console.log(rechargeApi)
			detail()
				.then(res=>{
					this.info = res.data.detail;
				})
			this.getList();
		},
		onShow() {
			this.getPhone();
			this.getbigVip();
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
			toProto(){
				this.$navTo("pageHome/prepaidRefill/detail/detail")
			},
			changeFlag(e){
				//console.log(e)
				if(e.detail.value.length>0){
					this.agreeFlag = true;
				}else{
					this.agreeFlag = false;
				}
			},
			getbigVip(){
				memberApi.index().then(res=>{
					console.log(res)
					this.bigVip=res.data;
				})
			},
			recharHis(){
				this.$navTo("pageHome/prepaidRefill/history/history")
			},
			submit(){
				if(!this.agreeFlag){
					uni.showToast({
						icon:'none',
						title:'请先阅读充值协议',
						duration:2000
					})
					return false;
				}
				let app = this;
				let obj = {};
				if(app.payIndex == 2){
					obj.type = 10
				}else if(app.payIndex == 1){
					obj.type = 30;
				}else if(app.payIndex == 0){
					obj.type = 20;
					// #ifdef APP-PLUS
					obj.type = 40;
					// #endif
				}
				obj.id = app.list[app.packageIndex].id;
				if(!app.mobile.trim()){
					uni.showToast({
						icon:'none',
						title:'请输入充值手机号',
						duration:2000
					})
					return false;
				}
				console.log(app.mobile.split(" ").join(''))
				obj.mobile = app.mobile.split(" ").join('');
				
				rechargeApi.add(obj)
					.then(res=>{
						console.log(res)
						// if(res.message == '请先成为大会员才能使用话费充值'){
						// 	this.showModalStatus3 == true
						// }
						app.onSubmitCallback(res)
					})
					.catch(err=>{
						console.log(err)
						console.log(11111111)
						if(err.errMsg == '请先成为大会员才能使用话费充值'){
							this.showModalStatus3 = true
						}
						// this.showModalStatus3 = true
					})
					this.showModalStatus3 = true
			},
			// 订单提交成功后回调
			onSubmitCallback(result) {
				const app = this
				if (app.payIndex == 0) {
					wxPayment(result.data.data)
						.then(() => {
							app.$success('支付成功')
							setTimeout(() => {
								app.navToMyOrder()
							}, 1500)
						})
						.catch(err => {
							//console.log(err)
							app.$error('订单未支付')
						})
						.finally(() => {
							app.disabled = false
						})
				}
				if (app.payIndex == 2) {
					app.$success('支付成功')
					app.disabled = false
					setTimeout(() => {
						app.navToMyOrder()
					}, 1500)
				}
				if(app.payIndex == 1){
					zfbPayment(result.data.data)
						.then((res) => {
							app.$success('支付成功')
							setTimeout(() => {
								app.navToMyOrder()
							}, 1500)
						})
						.catch(err => {
							app.$error('订单未支付')
						})
						.finally(() => {
							app.disabled = false
						})
				}
			},
			navToMyOrder(){
				this.$navTo("pageHome/prepaidRefill/history/history")
			},
			getPhone(){
				rechargeApi.get()
					.then(res=>{
						console.log(res)
						this.mobile = this.formatPhone(res.data.mobile);
					})
					.catch(err=>{
						console.log(err)
					})
			},
			getList(){
				rechargeApi.list()
					.then(res=>{
						console.log(res)
						this.list = res.data.list;
					})
					.catch(err=>{
						console.log(err)
					})
			},
			selectPayType(e){
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				this.payIndex = index;
			},
			choicePackage(e){
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				this.packageIndex = index;
			},
			getValue(e){
				this.mobile = this.formatPhone(e.detail.value)
			},
			choicePhone() {
				let that = this
				// #ifdef APP-PLUS
				nativeCommon.contacts.getContact(function callBack(name, phoneNumber) {
					console.log(name, phoneNumber, phoneNumber.replace(/\s|-+/g, ""))
					that.name = name;
					that.mobile = that.formatPhone(phoneNumber.replace(/\s|-+/g, ""));
				});
				// #endif
				// #ifdef MP-WEIXIN
				wx.chooseContact({
					success(res) {
						console.log(res)
						that.name = res.displayName;
						that.mobile = that.formatPhone(res.phoneNumber.replace(/\s|-+/g, ""));
					},
					fail(err) {
						console.log(err)
					}
				})
				// #endif
			},
			formatPhone(value) {
				value = value.replace(/[^0-9]/ig, "");
				var arr = value.split('');
				if (arr.length >= 4) {
					arr.splice(3, 0, ' ');
				}
				if (arr.length >= 9) {
					arr.splice(8, 0, ' ');
				}
				value = arr.join('');
				return value;
			},
			buyNow(){
					
					uni.navigateTo({
						url:'../../pageMember/pages/index/report'
					})
			},
			toIndex(){
					 // uni.redirectTo({
					 // 	url:'../../pageMember/pages/index/index'
					 // })
					 this.showModalStatus3 = false
			}
		}
	}
</script>

<style scoped>
	.quota{
		width: 702upx;
		height: 90upx;
		border-radius: 20upx;
		background-color: #FFFFFF;
		margin: 0 auto 20upx;
		display: flex;
		justify-content: space-between;
	}
	.quotaL{
		font-size: 30upx;
		color: #333333;
		font-weight: bold;
		margin-left: 24upx;
		line-height: 90upx;
	}
	.quotaR{
		display: flex;
		margin-right: 24upx;
		line-height: 90upx;
	}
	.quotaRL{
		font-size:30upx;
		font-weight: bold;
		color: #EC586D;
		margin-right: 12upx;
	}
	.quotaRR{
		font-size: 30upx;
		font-weight: bold;
		color: #333333;
		/* margin-left: 12upx; */
	}
	.submitBtn{
		width: 100%;
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		background: #ff5060;
		color: white;
		font-size: 24upx;
		position: fixed;
		left: 0;
		bottom: 0;
	}
	.payTitle{
		font-size: 28upx;
		line-height: 28upx;
		margin-top: 60upx;
		margin-bottom: 30upx;
		color: #333333;
	}
	.payCon{
		width: 100%;
		background: white;
		border-radius: 20upx;
		box-sizing: border-box;
		padding: 0 16upx;
	}
	.payConItem{
		width: 100%;
		height: 88upx;
		border-bottom: 2upx solid #EFEFEF;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.payConItem:last-child{
		border-bottom: none;
	}
	.payConItemL{
		display: flex;
		align-items: center;
	}
	.payConItemL>image{
		width: 40upx;
		margin-right: 16upx;
	}
	.payConItemL>text{
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
	}
	.payConItemR{
		width: 32upx;
		height: 32upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2upx solid #E5E5E5;
		border-radius: 50%;
	}
	.payConItemR>image{
		width: 16upx;
		height: 16upx;
	}
	.payConItemR.active{
		border-color: #ff5060;
		background: #ff5060;
	}
	
	
	.rules{
		width: 100%;
		margin-top: 30upx;
	}
	.ruleItem{
		font-size: 20upx;
		line-height: 20upx;
		color: #999999;
		margin-bottom: 16upx;
	}
	.rechargeMsg {
		width: 100%;
		box-sizing: border-box;
		padding: 30upx;
		border-radius: 20upx;
		background: white;
	}

	.title {
		font-size: 24upx;
		line-height: 24upx;
		color: #999999;
		display: flex;
		justify-content: space-between;
	}

	.phoneWrap {
		width: 100%;
		padding-bottom: 10upx;
		margin-top: 30upx;
		border-bottom: 2upx solid #F5F5F5;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30upx;
	}

	.phoneWrap>input {
		width: calc(100% - 70upx);
		box-sizing: border-box;
		border: none;
		padding: 0;
		margin: 0;
		font-size: 48upx;
		color: #333333;
		font-weight: bold;
		height: 60upx;
	}

	.phoneWrap>image {
		width: 40upx;
		height: 40upx;
	}

	.priceWrap {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.priceItem {
		width: 310upx;
		height: 128upx;
		border-radius: 8upx;
		border: 2upx solid #D0D0D0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 22upx;
		margin-top: 20upx;
	}
	
	.priceItem.active{
		border-color: #ff5060;
		background: #E7F9FF;
	}
	.priceItem.active>.oPrice>text{
		color: #ff5060;
	}
	.priceItem.active>.oPrice{
		color: #ff5060;
	}
	.priceItem.active>.pPrice{
		color: #ff5060;
	}

	.priceItem:nth-child(2n+2) {
		margin-right: 0;
	}

	.priceItem:nth-child(1),
	.priceItem:nth-child(2) {
		margin-top: 0;
	}

	.oPrice {
		font-size: 24upx;
		color: #333333;
		margin-bottom: 10upx;
	}

	.oPrice>text {
		font-size: 36upx;
		color: #333333;
		font-weight: bold;
	}

	.pPrice {
		font-size: 24upx;
		line-height: 24upx;
		color: #999999;
	}
	.home-popup2 {
			width: 528upx;
			height: 728upx;
			position: fixed;
			top: 20%;
			left: 14%;
			// transform: translate(-50%,-50%);
			z-index: 2000;
		}
		
		.home-box2 {
			width: 100%;
			height: 636upx;
			position: relative;
			top: 0;
			left: 0;
		}
		.home-box2>image{
			width: 100%;
			height: 100%;
		}
		.home-popup2-close {
			width: 48upx;
			height: 48upx;
			margin: 20upx auto 0;
		}
		
		.home-popup2-close>image {
			width: 100%;
			height: 100%;
			vertical-align: top;
		}
		.memberT{
			width: 396upx;
			position: absolute;
			top: 310upx;
			left: 76upx;
			font-size: 24upx;
			color: #4F2A03;
			/* text-align: center; */
			margin: 0 auto;
		}
		.memberT>text{
			color: #F86F07;
		}
		.memberB{
			width: 396upx;
			position: absolute;
			top: 354upx;
			left: 76upx;
			font-size: 24upx;
			color: #4F2A03;
			// text-align: center;
			margin: 0 auto;
		}
</style>
