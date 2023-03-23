<template>
	<view v-if="!isLoading" class="container" :style="{'box-sizing': 'border-box'}">
		<!-- <head-nav title="个人中心" :backFlag="false" color="white" backGround="linear-gradient(270deg, #FF5A5E, #DF6BAE)" backType="user" fontSize="36"></head-nav> -->
		<view class="head"
			:style="{'padding-top':navInfo.paddingTop+'px','height':Number(info_by_key.area_good_id)&&Number(info_by_key.city_good_id)?'650rpx':'538rpx'}">
			<image src="../../static/mine/backImage.png" class="headBack"></image>
			<view class="headT">
				<view class="imgWrap" @click="handleLogin">
					<view class="headView"
						:style="{'background-image':'url('+(userInfo.avatar_url ? userInfo.avatar_url : '/static/default-avatar.png')+')'}">
					</view>
					<!-- <view class="userIdentity">
					<image class="userIdentityLImg" :src="userInfo.teamLevel.preview_url"></image>
					<view class="userIdentityR">{{userInfo.level_name?userInfo.level_name:"---"}}</view>
				</view> -->
					<!-- <image class="userIdentityImg" :src="userInfo.teamLevel.preview_url" mode="heightFix"></image> -->
				</view>
				<view class="userInfo" @click="handleLogin">
					<view class="userInfoT">{{userInfo.nick_name?userInfo.nick_name:(!isLogin?'去登录':'---')}}</view>
					<view class="" v-if="!isLogin">
						登录查看更多精彩~
					</view>
					<view class="" v-if="isLogin" style="display: flex;">
						<view class="" style="margin-right: 24upx;">
							<!-- #ifdef MP-QQ -->
							<image class="userIdentityImg" mode="widthFix" style="width: 84rpx;"
								:src="userInfo.teamLevel.preview_url">
							</image>
							<!-- #endif -->
							<!-- #ifndef MP-QQ -->
							<image class="userIdentityImg" :src="userInfo.teamLevel.preview_url" mode="heightFix">
							</image>
							<!-- #endif -->
						</view>
						<view class="">
							<view class="userInfoB">
								<view class="userInfoBL">ID：{{userInfo.user_id?userInfo.user_id:'---'}}</view>
								<view class="userInfoBR" v-if="isLogin" :data-id="userInfo.user_id" @click="copy">复制
								</view>
							</view>
						</view>
					</view>

				</view>
				<image src="../../static/mine/setting.png" @click="onTargetSetup"
					style="width: 40rpx;height: 40rpx;position: absolute;right: 30rpx;bottom: 12rpx;"></image>
				<!-- <view class="codeWrap" @click="toLink">
				<image src="../../static/mine/code.png"></image>
				<view>邀请好友</view>
			</view> -->
				<image src="../../static/mine/code.png" @click="toLink"
					style="width: 40rpx;height: 40rpx;position: absolute;right: 100rpx;bottom: 12rpx;"></image>
			</view>
			<view class="headB">
				<view class="headItem" @click="Tongzheng">
					<!-- <view class="headItemT">{{token_price?token_price:(isLogin?0:'---')}}</view> -->
					<view class="headItemT">{{userInfo.cert_total_price?userInfo.cert_total_price:(isLogin?0:'---')}}
					</view>
					<view class="headItemB">权益积分</view>
				</view>
				<view class="headItem" @click="toProfit">
					<view class="headItemT">
						<text>￥</text>{{userInfo.count_profit?userInfo.count_profit:(isLogin?0:'---')}}
					</view>
					<view class="headItemB">累计收益</view>
				</view>
				<view class="headItem" @click="onTargetWallet">
					<view class="headItemT">{{userInfo.balance?userInfo.balance:'---'}}</view>
					<view class="headItemB">我的钱包<image src="../../static/icon/more_gray.png"></image>
					</view>
				</view>
			</view>
			<!-- 创业合伙人 团长 -->
			<view v-if="Number(info_by_key.area_good_id)&&Number(info_by_key.city_good_id)" class="operation">
				<view @click="onTargetDetail(info_by_key.area_good_id,1)" class="operationitem">
					<image class="partner operationitemimg" src="../../static/partner.png" mode=""></image>
					<text class="tx_title">成为{{info_by_key.area_name}} </text>
				</view>
				<view @click="onTargetDetail(info_by_key.city_good_id,2)" class="operationitem">
					<image class="regimental operationitemimg" src="../../static/regimental.png" mode=""></image>
					<text class="tx_title">成为{{info_by_key.city_name}}</text>
				</view>
			</view>
		</view>

		<view class="orderWrapBox" :style="{'position': 'relative','z-index': '999'}">
			<!-- <view class="" v-if="bigVip.big_vip_switch==1">
				<view class="majorMember" v-if="!showMember">
					<view class="majorMemberT">
						<view class="majorMemberTL">
							<image src="../../static/user/member.png" mode=""></image>
						</view>
						<view class="majorMemberTR">
							<view class="majorMemberTRT">
								成为大会员
							</view>
							<view class="majorMemberTRB">
								<text>{{phone_discount}}折生活优惠</text>
								<text style="margin-left: 14upx;">超万元提现资格</text>
							</view>
						</view>
					</view>
					<view class="majorMemberB" @click="Myrights">
						了解更多
					</view>
				</view>
				<view class="majorMember2" v-else>
					<view class="majorMember2T">
						<view class="majorMember2TL">
							<image src="../../static/user/member.png" mode=""></image>
						</view>
						<view class="majorMember2TR">
							<view class="majorMember2TRT">
								我的大会员
							</view>
							<view class="majorMember2TRB">
								<text>{{phone_discount}}折生活优惠</text>
								<text style="margin-left: 14upx;">超万元提现资格</text>
							</view>
						</view>
					</view>
					<view class="majorMember2B" @click="Myrights">
						我的权益
					</view>
				</view>
			</view> -->
			<view class="orderWrap" style="margin: -20rpx auto 0;">
				<view class="orderWrapHead">
					<view class="orderWrapHeadL">订单</view>
					<!-- 	<image src="../../static/icon/more_gray.png" class="orderWrapHeadR"></image>-->
				</view>
				<view class="orderWrapCon">
					<view class="orderItem" v-for="(item,index) in orderNavbar" :key="index"
						@click="onTargetOrder(item)">
						<view style="position: relative;">
							<image :src="item.icon"></image>
							<!-- 							<view v-if="index==0&&orderCoun.payment&&orderCoun.payment!=0" style="position: absolute;top: -20rpx;left: 34rpx;color: #FFFFFF;background-color: #ee0a24;border-radius: 999px;
    z-index: 99;padding: 0 10rpx;font-size: 24rpx;text-align: center;">
								{{orderCoun.payment?orderCoun.payment:'0'}}
							</view>
							<view v-if="index==1&&orderCoun.received&&orderCoun.received!=0" style="position: absolute;top: -20rpx;left: 34rpx;color: #FFFFFF;background-color: #ee0a24;border-radius: 999px;
	z-index: 99;padding: 0 10rpx;font-size: 24rpx;text-align: center;">
								{{orderCoun.received?orderCoun.received:'0'}}
							</view>
							<view v-if="index==2&&orderCoun.delivery&&orderCoun.delivery!=0" style="position: absolute;top: -20rpx;left: 36rpx;color: #FFFFFF;background-color: #ee0a24;border-radius: 999px;
	z-index: 99;padding: 0 10rpx;font-size: 24rpx;text-align: center;">
								{{orderCoun.delivery?orderCoun.delivery:'0'}}
							</view> -->
						</view>
						<text style="color: #999999;">{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- 			<view class="orderWrap" style="margin-top: 30rpx;">
				<view class="orderWrapHead">
					<view
						style="font-size: 30rpx;line-height: 28rpx;color: #000000;font-weight: 700;font-family: PingFang;">
						购票订单</view>
				</view>
				<view class="orderWrapCon2">
					<view class="orderItem" v-for="(item,index) in orderTicket" :key="index"
						@click="onTargetOrders(item)">
						<view>
							<image :src="item.icon"></image>
						</view>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view> -->

			<view class="orderWrap" style="margin-top: 30rpx;">
				<view class="orderWrapHead">
					<view class="orderWrapHeadL">活动专区</view>
					<!-- <image src="../../static/icon/more_gray.png" class="orderWrapHeadR"></image> -->
				</view>
				<view class="orderWrapCon1">
					<view class="orderItem" v-for="(item,index) in activityNavbar" :key="index" @click="toUrl(item)">
						<view>
							<image :src="item.icon"></image>
						</view>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>

			<view class="orderWrap" style="margin-top: 30rpx;">
				<view class="orderWrapHead">
					<view
						style="font-size: 30rpx;line-height: 28rpx;color: #000000;font-weight: 700;font-family: PingFang;">
						我的工具</view>
					<!-- <image src="../../static/icon/more_gray.png" class="orderWrapHeadR"></image> -->
				</view>
				<view class="orderWrapCon2">
					<view class="orderItem" @click="toUrls" data-path="/pages/address/index">
						<view>
							<image src="../../static/mine/dizhi.png" style="width: 72rpx;height: 72rpx;"></image>
						</view>
						<text>收货地址</text>
					</view>
					<!-- #ifdef MP -->
					<button open-type="contact" class="btn-normal orderItem">
						<view style="width: 100%;margin-bottom: 0;" class="orderItem">
							<view>
								<image src="../../static/mine/kefu.png" style="width: 72rpx;height: 72rpx;"></image>
							</view>
							<text>客服</text>
						</view>
					</button>
					<!-- #endif -->
					<view class="orderItem" @click="toUrls" data-path="/pages/address/index">
						<view>
							<image src="https://oss.gzrhhj.com/10001/20230313/427072ad293e32d1bbb00df0f944a1cf.png"
								style="width: 72rpx;height: 72rpx;"></image>
						</view>
						<text>银行卡</text>
					</view>


					<!-- 					<view class="orderItem" @click="toUrls" data-path="">
						<view>
							<image src="../../static/mine/wenti.png" style="width: 72rpx;height: 72rpx;"></image>
						</view>
						<text>常见问题</text>
					</view>
					<view class="orderItem" @click="toUrls" data-path="">
						<view>
							<image src="../../static/mine/shoucang.png" style="width: 72rpx;height: 72rpx;"></image>
						</view>
						<text>我的收藏</text>
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import {
		setCartTabBadge
	} from '@/utils/app'
	import SettingKeyEnum from '@/common/enum/setting/Key'
	import SettingModel from '@/common/model/Setting'
	import * as Rapi from '@/api/home/rotation'
	import * as UserApi from '@/api/user'
	import * as OrderApi from '@/api/order'
	import * as settingApi from '@/api/ticket/setting'
	import * as memberApi from "@/api/member/index.js";
	import {
		checkLogin
	} from '@/utils/app'
	import headNav from '@/components/seckillNav.vue'
	const App = getApp()

	// 商品订单操作
	const orderNavbar = [

		{
			id: 'payment',
			name: '我的订单',
			icon: '../../static/mine/waitPay.png',
			count: 0
		},
		// {
		// 	id: 'received',
		// 	name: '待发货',
		// 	icon: '../../static/mine/daifahuo.png',
		// 	count: 0
		// },
		// {
		// 	id: 'delivery',
		// 	name: '待收货',
		// 	icon: '../../static/mine/daishouhuo.png',
		// 	count: 0
		// },
		// {
		// 	id: 'comment',
		// 	name: '待评价',
		// 	icon: '../../static/mine/daipinjia.png',
		// 	count: 0
		// },
		// {
		// 	id: 'all',
		// 	name: '售后',
		// 	icon: '../../static/mine/shouhou.png',
		// 	count: 0
		// },

	]
	// 购票订单操作
	const orderTicket = [{
			id: '1',
			name: '待支付',
			icon: '../../static/mine/icon_ticket_wait.png',
			count: 0
		},
		{
			id: '2',
			name: '待出票',
			icon: '../../static/mine/icon_ticket_out.png',
			count: 0
		},
		{
			id: '3',
			name: '已出票',
			icon: '../../static/mine/icon_ticket_finish.png',
			count: 0
		},
		{
			id: 'all',
			name: '全部订单',
			icon: '../../static/mine/icon_ticket_pay.png'
		},
	]
	// 活动专区
	const activityNavbar = [{
			path: "/pageHome/myCollage/myCollage",
			name: "我的拼团",
			icon: "../../static/mine/pintuan.png"
		},
		{
			path: "/pageHome/distribution/index",
			name: "我的团队",
			icon: "../../static/mine/tuandui.png"
		},
		{
			path: "/pageHome/coupon/index",
			name: "领券中心",
			icon: "../../static/mine/lingquan.png"
		},
		{
			path: "/pageHome/code/index",
			name: "邀请好友",
			icon: "../../static/mine/yaoqing.png"
		}
	]
	/**
	 更多服务
	 * id: 标识; name: 标题名称; icon: 图标; type 类型(link和button); url: 跳转的链接
	 */
	const service = [{
			id: 'distribution',
			name: '分销中心',
			icon: '../../static/user/fenxiao.png',
			type: 'link',
			url: 'pageHome/distribution/index'
		},
		{
			id: 'myCoupon',
			name: '积分商城',
			icon: '../../static/user/jifen.png',
			type: 'link',
			url: 'pageHome/pointsMall/index'
		},
		{
			id: 'coupon',
			name: '领券中心',
			icon: '../../static/user/lingquan.png',
			type: 'link',
			url: 'pageHome/coupon/index'
		},
		{
			id: 'integralCoupon',
			name: '优惠券兑换',
			icon: '../../static/user/lingquan.png',
			type: 'link',
			url: 'pageHome/coupon/integral'
		},
		{
			id: 'help',
			name: '我的卡券',
			icon: '../../static/user/kaquan.png',
			type: 'link',
			url: 'pageHome/cardVoucher/index'
		},
		{
			id: 'address',
			name: '收货地址',
			icon: '../../static/user/dizhi.png',
			type: 'link',
			url: 'pages/address/index'
		},
		{
			id: 'contact',
			name: '我的兑换',
			icon: '../../static/user/duihuan.png',
			type: 'link',
			url: 'pageHome/my-exchange/index'
		},
		// { id: 'code', name: '推广码', icon: '../../static/user/code.png', type: 'link', url: 'pages/code/index' },
		{
			id: 'gift',
			name: '我的礼品',
			icon: '../../static/user/gift.png',
			type: 'link',
			url: 'pageHome/my-exchange/gift'
		},
		{
			id: 'scanCode',
			name: '核销',
			icon: '../../static/user/scanCode.png',
			type: 'link',
			url: 'code'
		},
		// { id: 'contact', name: '在线客服', icon: 'kefu', type: 'button', openType: 'contact' },
		{
			id: 'refund',
			name: '我的充值卡',
			icon: '../../static/user/card.png',
			type: 'link',
			url: 'pageHome/teledcard/index'
		},
		{
			id: 'refund',
			name: 'VIP卡券',
			icon: '../../static/user/vipCard.png',
			type: 'link',
			url: 'pageHome/vipCard/index'
		},
		{
			id: 'refund',
			name: '个人仓库',
			icon: '../../static/user/duihuan.png',
			type: 'link',
			url: 'pageHome/vipCard/privilegeCard/index'
		},
	]
	import {
		encryptDes
	} from "@/utils/crypto.js"

	export default {
		data() {
			return {
				// 枚举类
				SettingKeyEnum,
				// 当前运行的终端 (此处并不冗余,因为微信小程序端view层无法直接读取$platform)
				$platform: this.$platform,
				// 正在加载
				isLoading: true,
				// 是否已登录
				isLogin: false,
				// 系统设置
				setting: {},
				// 当前用户信息
				userInfo: {},
				// 账户资产
				assets: {
					balance: '--',
					points: '--',
					coupon: '--'
				},
				// 更多服务
				service,
				// 商品订单操作
				orderNavbar,
				//购票订单操作
				orderTicket,
				// 活动专区
				activityNavbar,
				// 当前用户待处理的订单数量
				todoCounts: {
					payment: 0,
					deliver: 0,
					received: 0
				},
				navInfo: {
					leftDistance: 0,
					lineHeight: 0,
					navH: 0,
					paddingTop: 0
				},
				commonL: {},
				token_price: 0,
				showMember: false,
				bigUser: {},
				phone_discount: 9,
				orderCoun: {},
				bigVip: {},
				info_by_key: {}
			}
		},
		components: {
			headNav
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow(options) {
			// let token = encryptDes(this.$store.getters.userId.toString(), "gzrh2022");
			// uni.request({
			// 	url:"https://walletc-api.rhchainos.com/api/v1/token/list",
			// 	method:"POST",
			// 	header:{
			// 		'Authorization':'Bearer ' + token
			// 	},
			// 	success:res=>{
			// 		this.token_price=res.data.data.data[0].token_price;
			// 	}
			// })
			let obj = {};
			obj.leftDistance = App.globalData.leftDistance;
			obj.lineHeight = App.globalData.lineHeight;
			obj.navH = App.globalData.navH;
			obj.paddingTop = App.globalData.paddingTop;
			this.navInfo = obj;
			this.onRefreshPage();
			// this.isLogin = checkLogin()
			// console.log(this.isLoading,222)
			this.getCommon();
			this.getSett();
			this.get_info_by_key();
			if (this.$store.getters.token) {
				this.getbigvip();
				this.getTodoCoun();
			}

		},
		/**
		 * 设置分享内容
		 */
		onShareAppMessage() {
			const app = this;
			return {
				// title: app.templet.shareTitle,
				path: '/pages/user/index?' + app.$getShareUrlParams()
			}
		},

		/**
		 * 分享到朋友圈
		 * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
		 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
		 */
		onShareTimeline() {
			const app = this
			return {
				// title: app.templet.shareTitle,
				path: '/pages/user/index?' + app.$getShareUrlParams()
			}
		},
		methods: {
			getbigvip() {
				memberApi.index().then(res => {
					console.log(res.data, 'memberApi');
					this.bigUser = res.data;
					if (this.bigUser.big_vip_user.is_vip == 0) {
						this.showMember = false;
					} else if (this.bigUser.big_vip_user.is_vip == 1) {
						this.showMember = true;
					}
					this.phone_discount = this.bigUser.setting.phone_discount;
				})
			},
			getTodoCoun() {
				memberApi.todoCounts().then(res => {
					console.log(res)
					this.orderCoun = res.data.counts;
					console.log(this.orderCoun, 123)
				})
			},
			// 获取商城设置
			getSett() {
				Rapi.big_vip().then(res => {
					console.log(res)
					this.bigVip = res.data.values
				})
			},
			Myrights() {
				// uni.navigateTo({
				// 	url:'/pageMember/pages/index/Myrights'
				// })
				let vip_price = this.bigVip.vip_price || 188
				uni.navigateTo({
					url: '/pageMember/pages/index/report?vip_price=' + vip_price
				})
			},
			copy(e) {
				let id = e.target.dataset.id || e.currentTarget.dataset.id;
				uni.setClipboardData({
					data: id.toString()
				})
			},
			toProfit() {
				uni.navigateTo({
					url: "/pageHome/profit/profit"
				})
			},
			toUrls(e) {
				let url = e.target.dataset.path || e.currentTarget.dataset.path;
				if (url !== true) {
					uni.navigateTo({
						url: url
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '此功能暂未开放,敬请期待！'
					})
				}
			},
			toUrl(item) {
				// console.log(item)
				// this.$navTo(item.path)
				uni.navigateTo({
					url: item.path
				})
			},
			toLink() {
				this.$navTo("pageHome/code/index")
			},
			// 跳转商品详情页
			onTargetDetail(goodsId, info_by_key) {
				// let bigId=2;
				// let group_order_id=this.group_order_id
				//       this.$navTo('pages/goods/detail', { goodsId,bigId,group_order_id })
				// let goodsId = e.currentTarget.dataset.id || e.target.dataset.id;
				if (!goodsId) {
					uni.showToast({
						icon: 'none',
						title: 'ID错误'
					})
					return
				};
				let bigId = 3;
				this.$navTo('pages/goods/detail', {
					goodsId,
					bigId,
					info_by_key,
				})
			},
			getCommon() {
				const app = this
				return new Promise((resolve, reject) => {
					settingApi.detail().then(res => {
						app.commonL = res.data.detail
						resolve(res)
					}).catch(reject)
				})
			},
			get_info_by_key() {
				const app = this
				return new Promise((resolve, reject) => {
					settingApi.get_info_by_key({
						key: 'agent'
					}).then(res => {
						app.info_by_key = res.data.setting
						resolve(res)
					}).catch(reject)
				})
			},
			Tongzheng() {
				if (this.commonL.pass_cert_switch == 1) {
					if (this.$store.getters.token) {
						let url = this.commonL.blc_url;
						uni.navigateTo({
							url: '/pages/showhfive/showhfive?url=' + url
						})
					} else {
						uni.showModal({
							title: '温馨提示',
							content: '此时此刻需要您登录喔~',
							confirmText: "去登录",
							cancelText: "再逛会",
							success: res => {
								if (res.confirm) {
									uni.navigateTo({
										url: "/pages/login/index"
									})
								}
							}
						})
					}
				} else {
					uni.showToast({
						title: '此功能暂未开放，敬请期待',
						icon: "none",
						duration: 2000
					});
				}

			},
			// 刷新页面
			onRefreshPage() {
				// 更新购物车角标
				setCartTabBadge()
				// 判断是否已登录
				this.isLogin = checkLogin()
				console.log(this.isLogin, 11)
				if (this.isLogin == false) {
					this.userInfo = {}
				}
				// 获取页面数据
				this.getPageData()
			},

			// 获取页面数据
			getPageData(callback) {
				const app = this
				app.isLoading = true
				Promise.all([app.getSetting(), app.getUserInfo(), app.getUserAssets(), app.getTodoCounts()])
					.then(result => {
						app.isLoading = false
						// 初始化更多服务数据
						app.initService()
						// 初始化订单操作数据
						app.initOrderTabbar()
						// 执行回调函数
						callback && callback()
					})
					.catch(err => {
						//console.log('catch', err)
					})
			},

			// 初始化我的服务数据
			initService() {
				const app = this
				const newService = []
				service.forEach(item => {
					if (item.id === 'points') {
						item.name = '我的' + app.setting[SettingKeyEnum.POINTS.value].points_name
					}
					newService.push(item)
				})
				app.service = newService
			},

			// 初始化订单操作数据
			initOrderTabbar() {
				const app = this
				const newOrderNavbar = []
				orderNavbar.forEach(item => {
					if (item.hasOwnProperty('count')) {
						item.count = app.todoCounts[item.id]
					}
					newOrderNavbar.push(item)
				})
				app.orderNavbar = newOrderNavbar
			},

			// 获取商城设置
			getSetting() {
				const app = this
				return new Promise((resolve, reject) => {
					SettingModel.data().then(setting => {
						app.setting = setting
						resolve(setting)
					}).catch(reject)
				})
			},

			// 获取当前用户信息
			getUserInfo() {
				const app = this
				return new Promise((resolve, reject) => {
					!app.isLogin ? resolve(null) : UserApi.info()
						.then(result => {
							app.userInfo = result.data.userInfo
							resolve(app.userInfo)
						})
						.catch(err => {
							if (err.result && err.result.status == 401) {
								app.isLogin = false
								resolve(null)
							} else {
								reject(err)
							}
						})
				})
			},

			// 获取账户资产
			getUserAssets() {
				const app = this
				return new Promise((resolve, reject) => {
					!app.isLogin ? resolve(null) : UserApi.assets()
						.then(result => {
							app.assets = result.data.assets
							resolve(app.assets)
						})
						.catch(err => {
							if (err.result && err.result.status == 401) {
								app.isLogin = false
								resolve(null)
							} else {
								reject(err)
							}
						})
				})
			},

			// 获取当前用户待处理的订单数量
			getTodoCounts() {
				const app = this
				return new Promise((resolve, reject) => {
					!app.isLogin ? resolve(null) : OrderApi.todoCounts()
						.then(result => {
							app.todoCounts = result.data.counts
							resolve(app.todoCounts)
						})
						.catch(err => {
							if (err.result && err.result.status == 401) {
								app.isLogin = false
								resolve(null)
							} else {
								reject(err)
							}
						})
				})
			},

			// 跳转到登录页
			handleLogin() {
				!this.isLogin && this.$navTo('pages/login/index')
			},

			// 退出登录
			handleLogout() {
				const app = this
				uni.showModal({
					title: '友情提示',
					content: '您确定要退出登录吗?',
					success(res) {
						if (res.confirm) {
							store.dispatch('Logout', {})
								.then(result => app.onRefreshPage())
						}
					}
				})
			},

			// 跳转到钱包页面
			onTargetWallet() {
				this.$navTo('pageHome/wallet/index')
			},

			// 跳转到订单列表页
			onTargetOrder(item) {
				this.$navTo('pageHome/orderCenter/orderCenter')
			},
			// 跳转到订单页
			onTargetOrders(item) {
				this.$navTo('pageHome/orderTicket/index', {
					dataType: item.id
				})
			},
			// 跳转到我的积分页面
			onTargetPoints() {
				this.$navTo('pageHome/pointsMall/pointsDetailed')
			},

			// 跳转到我的优惠券页
			onTargetMyCoupon() {
				this.$navTo('pages/my-coupon/index')
			},
			// 跳转我的拼团
			onTargetMyCollage() {
				this.$navTo('pageHome/myCollage/myCollage')
			},

			// 跳转到服务页面
			handleService({
				url,
				type
			}) {
				//console.log(url,type)
				if (url == "code") {
					uni.scanCode({
						success(res) {
							//console.log(res)
							OrderApi.ScanCodeReceipt({
									order_id: res.result
								})
								.then(res => {
									//console.log(res)
									uni.showToast({
										icon: 'none',
										title: res.message,
										duration: 2000
									})
								})
								.catch(err => {
									//console.log(err)
									uni.showToast({
										icon: 'none',
										title: err.message,
										duration: 2000
									})
								})
						},
						fail(err) {
							//console.log(err)
						}
					})
				} else {
					this.$navTo(url)
				}

			},
			onTargetSignin() {
				this.$navTo('pageHome/signIn/index')
			},
			// 跳转到积分商城
			onTargetSetup() {
				this.$navTo('pageHome/setup/index')
			},

		},

		/**
		 * 下拉刷新
		 */
		onPullDownRefresh() {
			// 获取首页数据
			this.getPageData(() => {
				uni.stopPullDownRefresh()
			})
		},


	}
</script>

<style scoped>
	.orderWrapBox {
		margin-top: -88rpx;

	}

	.operation {
		display: flex;
		justify-content: space-between;
		padding: 0 24rpx;
		margin-top: 40rpx;
	}

	.operation .operationitem {
		width: 340rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		background: #FFFFFF;
		border-radius: 10rpx;
	}

	.operationitem .tx_title {
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}

	.operationitem .operationitemimg {
		width: 76rpx;
		height: 76rpx;
		margin-left: 24rpx;
		margin-right: 20rpx;
	}

	.orderWrap {
		width: 702rpx;
		box-sizing: border-box;
		background: white;
		border-radius: 20rpx;
		/* margin-top: 56rpx; */
		padding: 30rpx;
		margin: 0 auto 0;
	}

	.orderWrapHead {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.orderWrapHeadL {
		font-size: 30rpx;
		font-family: PingFang;
		font-weight: 700;
		color: #000000;
		/* color: #DF6BAD; */
		line-height: 28rpx;
		/* background: linear-gradient(45deg, #FF5A5E 0%, #DF6BAD 100%); */
		/* -webkit-background-clip: text; */
		/* -webkit-text-fill-color: transparent; */
	}

	.orderWrapHeadR {
		width: 12rpx;
		height: 22rpx;
	}

	.orderWrapCon {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.orderWrapCon1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.orderWrapCon2 {
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		margin-top: 30rpx;
		flex-wrap: wrap
	}

	.orderItem {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 20%;
		/* margin-right: 20rpx; */
		/* flex: 0.25; */

	}

	.orderWrapCon>.orderItem:nth-child(1)>view>image {
		width: 54rpx;
		height: 50rpx;
	}

	.orderWrapCon>.orderItem:nth-child(2)>view>image {
		width: 56rpx;
		height: 50rpx;
	}

	.orderWrapCon>.orderItem:nth-child(3)>view>image {
		width: 52rpx;
		height: 52rpx;
	}

	.orderWrapCon>.orderItem:nth-child(4)>view>image {
		width: 46rpx;
		height: 54rpx;
	}

	.orderWrapCon>.orderItem:nth-child(5)>view>image {
		width: 52rpx;
		height: 52rpx;
	}

	.orderWrapCon1>.orderItem:nth-child(1)>view>image {
		width: 92rpx;
		height: 76rpx;
	}

	.orderWrapCon1>.orderItem:nth-child(2)>view>image {
		width: 92rpx;
		height: 76rpx;
	}

	.orderWrapCon1>.orderItem:nth-child(3)>view>image {
		width: 92rpx;
		height: 76rpx;
	}

	.orderWrapCon1>.orderItem:nth-child(4)>view>image {
		width: 92rpx;
		height: 76rpx;
	}

	.orderWrapCon2>.orderItem:nth-child(1)>view>image {
		width: 80rpx;
		height: 80rpx;
	}

	.orderWrapCon2>.orderItem:nth-child(2)>view>image {
		width: 80rpx;
		height: 80rpx;
	}

	.orderWrapCon2>.orderItem:nth-child(3)>view>image {
		width: 80rpx;
		height: 80rpx;
	}

	.orderWrapCon2>.orderItem:nth-child(4)>view>image {
		width: 80rpx;
		height: 80rpx;
	}

	.orderItem>view {
		/* height: 54rpx; */
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 12rpx;
	}

	.orderItem>text {
		font-size: 28rpx;
		/* font-family: PingFang; */
		/* font-weight: 500; */
		color: #333333;
		line-height: 28rpx;
	}





	.headB {
		width: 702rpx;
		height: 98rpx;
		display: flex;
		align-items: center;
		/* background: white; */
		border-radius: 20rpx;
		box-sizing: border-box;
		/* padding: 28rpx 0 22rpx; */
		margin: 40rpx auto 0;
		position: relative;
		z-index: 99;
	}

	.headItem {
		width: 230rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	.headItemT {
		font-size: 48rpx;
		color: #333333;
		text-align: center;
		display: flex;
		align-items: baseline;
		justify-content: center;
		font-weight: bold;
	}

	.headItemT>text {
		font-size: 24rpx;
		color: #333333;
	}

	.headItemB {
		font-size: 24rpx;
		line-height: 28rpx;
		color: #999999;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 4upx;
	}

	.headItemB>image {
		width: 12rpx;
		height: 22rpx;
		margin-left: 12rpx;
	}

	/* .headItem:nth-child(1)::after,
	.headItem:nth-child(2)::after{
		position: absolute;
		content: "";
		width: 2rpx;
		height: 62rpx;
		background: rgba(104,104,104,.3);
		right: 0;
		top: 50%;
		transform: translateY(-50%);
	} */


	.userInfo {
		margin-left: 20rpx;
		/* height: 152rpx; */
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.userInfoT {
		font-size: 32rpx;
		line-height: 46rpx;
		/* color: white; */
		color: #000000;
		font-weight: bold;
		margin-bottom: 16rpx;
	}

	.userInfoB {
		display: flex;
		align-items: center;
	}

	.userInfoBL {
		font-size: 24rpx;
		line-height: 34rpx;
		margin-right: 16rpx;
		color: #333333;
	}

	.userInfoBR {
		/* height: 24rpx; */
		box-sizing: border-box;
		/* padding: 0 12rpx; */
		/* border: 2rpx solid #333333; */

		font-size: 24rpx;
		line-height: 34rpx;
		/* border-radius: 14rpx; */
		color: #333333;
	}

	.codeWrap {
		width: 150rpx;
		height: 82rpx;
		background: rgba(255, 255, 255, .2);
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 0 22rpx 0 36rpx;
		position: absolute;
		right: 0;
		top: 56rpx;
		/* transform: translateY(-50%); */
		border-radius: 42rpx 0 0 42rpx;
	}

	.codeWrap>image {
		width: 42rpx;
		height: 42rpx;
		margin-right: 10rpx;
	}

	.codeWrap>view {
		width: 40rpx;
		font-size: 20rpx;
		line-height: 24rpx;
		color: white;
	}


	.head {
		width: 100%;
		height: 650rpx;
		box-sizing: content-box;
		/* background: linear-gradient(270deg, #FF5A5E, #DF6BAE); */
		position: relative;

	}

	.headBack {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		/* height: 140rpx; */
		z-index: -1;
		height: 100%;
	}

	.headT {
		width: 100%;
		padding: 0 0 0 28rpx;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		/* height: 152rpx; */
		position: relative;
		padding-top: 156rpx;
	}

	.imgWrap {
		width: 112rpx;
		height: 112rpx;
		/* background: #FE8488; */
		border-radius: 50%;
		box-sizing: border-box;
		padding: 6rpx;
		position: relative;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.headView {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background-position: center;
		background-size: cover;
	}

	.userIdentity {
		/* width: 120rpx; */
		height: 34rpx;
		border-radius: 18rpx;
		box-sizing: border-box;
		padding: 2rpx 16rpx 2rpx 2rpx;
		display: flex;
		align-items: center;
		background: white;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: -10rpx;
	}

	.userIdentityImg {
		/* width: 120rpx; */
		height: 34rpx;
		border-radius: 18rpx;
		box-sizing: border-box;
		/* position: absolute; */
		/* left: 50%; */
		/* transform: translateX(-50%); */
		/* bottom: -10rpx; */
	}

	.userIdentityL {
		width: 30rpx;
		height: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #FE8488;
		border-radius: 50%;
	}

	.userIdentityLImg {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
	}

	.userIdentityL>image {
		width: 20rpx;
		height: 22rpx;
	}

	.userIdentityR {
		font-size: 22rpx;
		line-height: 22rpx;
		margin-left: 6rpx;
		color: #FE8488;
		white-space: nowrap;
	}

	.majorMember {
		width: 702upx;
		height: 140upx;
		background: linear-gradient(270deg, #0D0D0D 0%, #3E3E3E 48%, #191919 100%);
		border-radius: 20upx 20upx 0 0;
		display: flex;
		justify-content: space-between;
		margin: 0 auto 0;
		padding: 0 16upx 0 24upx;
	}

	.majorMemberT {
		display: flex;
	}

	.majorMemberB {
		width: 166upx;
		height: 64upx;
		background: linear-gradient(270deg, #FFE4AF 0%, #FFF3D4 100%);
		border-radius: 34upx 34upx 34upx 34upx;
		color: #3B3B3B;
		text-align: center;
		line-height: 64upx;
		font-weight: bold;
		margin-top: 28upx;
	}

	.majorMemberTL {
		width: 60upx;
		height: 60upx;
		margin-top: 30upx;
	}

	.majorMemberTL image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}

	.majorMemberTR {
		margin-left: 16upx;
	}

	.majorMemberTRT {
		font-size: 32upx;
		color: #FFE6BE;
		font-weight: bold;
		margin-top: 16upx;
	}

	.majorMemberTRB {
		margin-top: 4upx;
	}

	.majorMemberTRB text {
		font-size: 24upx;
		color: #FFE6BE;
	}

	.majorMember2 {
		width: 702upx;
		height: 140upx;
		background: linear-gradient(229deg, #E5C285 0%, #B58347 100%);
		border-radius: 20upx 20upx 0 0;
		display: flex;
		justify-content: space-between;
		margin: 0 auto 0;
		padding: 0 16upx 0 24upx;
	}

	.majorMember2T {
		display: flex;
	}

	.majorMember2B {
		width: 166upx;
		height: 64upx;
		background: #BF8C49;
		border-radius: 34upx 34upx 34upx 34upx;
		color: #FFFFFF;
		text-align: center;
		line-height: 64upx;
		font-weight: bold;
		margin-top: 28upx;
	}

	.majorMember2TL {
		width: 60upx;
		height: 60upx;
		margin-top: 30upx;
	}

	.majorMember2TL image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}

	.majorMember2TR {
		margin-left: 16upx;
	}

	.majorMember2TRT {
		font-size: 32upx;
		color: #FFFFFF;
		font-weight: bold;
		margin-top: 16upx;
	}

	.majorMember2TRB {
		margin-top: 4upx;
	}

	.majorMember2TRB text {
		font-size: 24upx;
		color: #FFFFFF;
	}
</style>
