<template>
	<view class="container p-bottom" v-if="order.goodsList.length">

		<!-- 快递配送：配送地址 -->
		<view v-if="curDelivery == DeliveryTypeEnum.EXPRESS.value" @click="onSelectAddress" class="flow-delivery">
			<view class="flow-delivery__detail dis-flex flex-y-center">
				<view class="detail-location dis-flex">
					<text class="iconfont icon-dingwei"></text>
				</view>
				<view class="detail-content flex-box">
					<block v-if="order.address">
						<view class="detail-content__title dis-flex">
							<text class="f-30">{{ order.address.name }}</text>
							<text class="detail-content__title-phone f-28">{{ order.address.phone }}</text>
						</view>
						<view class="address detail-content__describe">
							<text class="region" v-for="(region, idx) in order.address.region"
								:key="idx">{{ region }}</text>
							<text class="detail">{{ order.address.detail }}</text>
						</view>
					</block>
					<block v-else>
						<view class="detail-content__describe dis-flex">
							<text class="col-6">请选择配送地址</text>
						</view>
					</block>
				</view>
				<view class="detail-arrow dis-flex">
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="m-top20">
			<view class="checkout_list" v-for="(item, index) in order.goodsList" :key="index">
				<view class="flow-shopList dis-flex" data-index="index" @click="onTargetGoods(item.goods_id)">
					<!-- 商品图片 -->
					<view class="flow-list-left">
						<image mode="scaleToFill"
							:src="options.mode=='integral'?item.images[0].file.preview_url:item.goods_image"></image>
					</view>
					<view class="flow-list-right flex-box">
						<!-- 商品名称 -->
						<text
							class="goods-name twolist-hidden">{{ options.mode=='integral'?item.name:item.goods_name }}</text>
						<!-- 商品规格 -->
						<view class="goods-props clearfix">
							<view class="goods-props-item" v-for="(props, idx) in item.skuInfo.goods_props" :key="idx"
								v-if="options.mode!='integral'&&options.mode!='gift'">
								<text class="group-name">{{ props.group.name }}: </text>
								<text>{{ props.value.name }}；</text>
							</view>
							<view class="goods-props-item" v-if="options.mode=='integral'">
								<text class="group-name">{{item.specs}}</text>
							</view>
						</view>
						<!-- 商品数量和单价 -->
						<view class="flow-list-cont dis-flex flex-x-between flex-y-center" v-if="options.mode!='gift'">
							<text class="small">×{{ options.mode=='integral'?1:item.total_num }}</text>
							<text class="flow-cont" v-if="options.mode!='integral'">￥{{ item.goods_price }}</text>
							<text class="flow-cont" v-else>{{ item.integral }}积分</text>
						</view>
						<view class="flow-list-cont dis-flex flex-x-between flex-y-center" v-else>
							<text class="small">×1</text>
						</view>
					</view>
				</view>
			</view>
			<view class="flow-num-box b-f" v-if="options.mode!='gift'">
				<text>共{{ options.mode=='integral'?1:order.orderTotalNum }}件商品，合计：</text>
				<text class="flow-money col-m" v-if="options.mode!='integral'">￥{{ order.orderTotalPrice }}</text>
				<text class="flow-money col-m" v-else>{{ order.goodsList[0].integral }}积分</text>
			</view>
		</view>

		<!-- 商品金额 -->
		<view class="flow-all-money b-f m-top20" v-if="options.mode!='integral'&&options.mode!='gift'">
			<view class="flow-all-list dis-flex">
				<text class="flex-five">订单总金额：</text>
				<view class="flex-five t-r">
					<text class="col-m">￥{{ order.orderTotalPrice }}</text>
				</view>
			</view>
			<!-- 优惠券 -->
			<view class="flow-all-list dis-flex">
				<text class="flex-five">优惠券：</text>
				<view class="flex-five t-r">
					<view v-if="order.couponList.length > 0" @click="handleShowPopup()">
						<text class="col-m" v-if="order.couponId > 0">-￥{{ order.couponMoney }}</text>
						<text class="col-m" v-else>有{{ order.couponList.length }}张优惠券</text>
						<text class="right-arrow iconfont icon-arrow-right"></text>
					</view>
					<text v-else class="">无优惠券可用</text>
				</view>
			</view>
			<!-- 卡券 -->
			<view class="flow-all-list dis-flex">
				<text class="flex-five">卡券：</text>
				<view class="flex-five t-r">
					<view v-if="order.couponList.length > 0" @click="handleShowPopup1()">
						<text class="col-m" v-if="order.cardVoucherName">{{ order.cardVoucherName }}</text>
						<text class="col-m" v-else>有{{ order.UserCardVoucherList.data.length }}张卡券</text>
						<text class="right-arrow iconfont icon-arrow-right"></text>
					</view>
					<text v-else class="">无卡券可用</text>
				</view>
			</view>
			<!-- 积分抵扣 -->
			<view v-if="order.isAllowPoints" class="points flow-all-list dis-flex flex-y-center">
				<view class="block-left flex-five" @click="handleShowPoints()">
					<text class="title">可用{{ order.setting.points_name }}抵扣：</text>
					<text class="iconfont icon-help"></text>
				</view>
				<view class="flex-five dis-flex flex-x-end flex-y-center">
					<text class="points-money col-m">-￥{{ order.pointsMoney }}</text>
					<u-switch v-model="isUsePoints" size="48" active-color="#07c160" @change="getOrderData()">
					</u-switch>
				</view>
			</view>
			<!-- 配送费用 -->
			<view v-if="curDelivery == DeliveryTypeEnum.EXPRESS.value" class="dis-flex flow-all-list">
				<text class="flex-five">配送费用：</text>
				<view class="flex-five t-r">
					<view v-if="order.address">
						<text class="col-m" v-if="order.isIntraRegion">+￥{{ order.expressPrice }}</text>
						<text v-else>不在配送范围</text>
					</view>
					<view v-else>
						<text class="col-7">请先选择配送地址</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 配送方式 -->
		<view class="pay-method flow-all-money b-f m-top20" v-if="options.mode!='integral'&&options.mode!='gift'">
			<view class="flow-all-list dis-flex">
				<text class="flex-five">配送方式</text>
			</view>
			<!-- 快递配送 -->

			<view class="pay-item dis-flex flex-x-between"
				@click="handleSelectDelivery(DeliveryTypeEnum.EXPRESS.value)">
				<view class="item-left dis-flex flex-y-center">
					<view class="item-left_icon wechat">
					</view>
					<view class="item-left_text">
						{{DeliveryTypeEnum.EXPRESS.name}}
					</view>
				</view>
				<view class="item-right col-m" v-if="curDelivery == DeliveryTypeEnum.EXPRESS.value">
					<text class="iconfont icon-check"></text>
				</view>
			</view>
			<!-- 送货上门 -->
			<view class="pay-item dis-flex flex-x-between" v-if="isSHSM"
				@click="handleSelectDelivery(DeliveryTypeEnum.SELFMENTION.value)">
				<view class="item-left dis-flex flex-y-center">
					<view class="item-left_icon balance">
					</view>
					<view class="item-left_text">
						<text>{{ DeliveryTypeEnum.SELFMENTION.name }}</text>
					</view>
				</view>
				<view class="item-right col-m" v-if="curDelivery == DeliveryTypeEnum.SELFMENTION.value">
					<text class="iconfont icon-check"></text>
				</view>
			</view>
		</view>
		<!-- v-if="bigId!=''" -->
		<!-- 高奢 -->
		<view class="pay-method flow-all-money b-f m-top20" v-if="bigId==2">
			<view class="flow-all-list dis-flex">
				<text class="flex-five">权益选择</text>
			</view>
			<!-- 权益选择 -->
			
			<view class="pay-item dis-flex flex-x-between" @click="freeChoice(3)">
				<view class="item-left dis-flex flex-y-center">
					<view class="item-left_icon wechat">
					</view>
					<view class="item-left_text">
						权益额度兑换
					</view>
				</view>
				<view class="item-right col-m" v-if="is_free == 3">
					<text class="iconfont icon-check"></text>
				</view>
			</view>
			

			<view class="pay-item dis-flex flex-x-between" @click="freeChoice(0)">
				<view class="item-left dis-flex flex-y-center">
					<view class="item-left_icon wechat">
					</view>
					<view class="item-left_text">
						获得高比例通证
					</view>
				</view>
				<view class="item-right col-m" v-if="is_free == 0">
					<text class="iconfont icon-check"></text>
				</view>
			</view>


			<!-- 邀请好友获得免单 -->
			<view class="pay-item dis-flex flex-x-between" @click="freeChoice(1)">
				<view class="item-left dis-flex flex-y-center">
					<view class="item-left_icon balance">
					</view>
					<view class="item-left_text">
						<text>邀请好友获得免单</text>
					</view>
				</view>
				<view class="item-right col-m" v-if="is_free == 1">
					<text class="iconfont icon-check"></text>
				</view>
			</view>

			<view class="pay-method flow-all-money b-f m-top20" style="padding: 40rpx;" v-if="is_free==0">
				<view style="margin: 0 auto; color: #999999; font-size: 26rpx; border-radius: 20upx;">
					活动期间内，购买专区商品将获得更高比例通证。消费
					者在该专区累计兑换3000元通证后，即可获赠商城会员
					一份。
				</view>
			</view>
		</view>

		<!-- 大会员 -->
		<view class="pay-method flow-all-money b-f m-top20" v-if="source">
			<view class="flow-all-list dis-flex">
				<text class="flex-five">权益选择</text>
			</view>
			<!-- 权益选择 -->
			<view class="pay-item dis-flex flex-x-between" @click="freeChoice(0)">
				<view class="item-left dis-flex flex-y-center">
					<view class="item-left_icon wechat">
					</view>
					<view class="item-left_text">
						正常购买
					</view>
				</view>
				<view class="item-right col-m" v-if="is_free == 0">
					<text class="iconfont icon-check"></text>
				</view>
			</view>


			<!-- 邀请好友获得免单 -->
			<view class="pay-item dis-flex flex-x-between" @click="freeChoice(1)">
				<view class="item-left dis-flex flex-y-center">
					<view class="item-left_icon balance">
					</view>
					<view class="item-left_text">
						<text>成团购买</text>
					</view>
				</view>
				<view class="item-right col-m" v-if="is_free == 1">
					<text class="iconfont icon-check"></text>
				</view>
			</view>

			<view class="pay-method flow-all-money b-f m-top20" style="padding: 40rpx;" v-if="is_free==0 &&!source">
				<view style="margin: 0 auto; color: #999999; font-size: 26rpx; border-radius: 20upx;">
					活动期间内，购买专区商品将获得更高比例通证。消费
					者在该专区累计兑换3000元通证后，即可获赠商城会员
					一份。
				</view>
			</view>
		</view>
		<view class="pay-method flow-all-money b-f m-top20" style="padding: 40rpx;" v-if="is_free==1">
			<view style="display: flex;justify-content: center;">
				<image style="width: 80rpx;height: 80rpx;" src="../../static/home/ask.png" mode=""></image>
				<image style="width: 80rpx;height: 80rpx;margin-left: 96rpx;" src="../../static/home/ask.png" mode="">
				</image>
				<image style="width: 80rpx;height: 80rpx;margin-left: 96rpx;" src="../../static/home/ask.png" mode="">
				</image>
				<image style="width: 80rpx;height: 80rpx;margin-left: 96rpx;" src="../../static/home/ask.png" mode="">
				</image>
			</view>
			<view style="margin: 24upx auto 0;">
				<view style="font-size: 26upx;color: #999999;">
					邀请4位新用户{{source?'':'在此专区'}}达成交易
				</view>
				<view style="font-size: 26upx;color: #999999;margin-top: 8upx;">
					成功邀请与被邀请的均可在最后一名成员确认支付之后获得免单奖励
				</view>
				<view style="font-size: 26upx;color: #999999;margin-top: 8upx;">
					(免单说明：该订单实付金额的100%返回我的钱包)
				</view>
			</view>
		</view>

		<!-- 高比例通证 -->
		<!-- <view class="pay-method flow-all-money b-f m-top20" style="padding: 40rpx;" v-if="is_free==0">
	  <view style="margin: 0 auto; color: #999999; font-size: 26rpx; border-radius: 20upx;">
		活动期间内，购买专区商品将获得更高比例通证。消费
		者在该专区累计兑换3000元通证后，即可获赠商城会员
		一份。
	  </view>
	</view> -->

		<!-- 买家留言 -->
		<view class="flow-all-money b-f m-top20" v-if="options.mode!='integral'&&options.mode!='gift'">
			<view class="ipt-wrapper dis-flex flow-all-list">
				<input v-model="remark" placeholder="选填：买家留言（50字以内）"></input>
			</view>
		</view>

		<!-- 提交订单 -->
		<view class="flow-fixed-footer b-f m-top10" v-if="options.mode!='integral'&&options.mode!='gift'">
			<view class="dis-flex chackout-box">
				<view class="chackout-left pl-12">实付款：
					<text class="col-m">￥{{ order.orderPayPrice }}</text>
				</view>
				<view @click="onSubmitOrder()" class="chackout-right">
					<view class="flow-btn f-32" :class="{ disabled }">提交订单</view>
				</view>
			</view>
		</view>
		<view class="submitOrder" v-else @click="nowExchange">立即兑换</view>

		<!-- 积分说明弹窗 -->
		<u-modal v-model="showPoints" :title="`${setting.points_name}说明`"
			v-if="options.mode!='integral'&&options.mode!='gift'">
			<scroll-view class="points-content" :scroll-y="true">
				<text>{{ order.setting.points_describe }}</text>
			</scroll-view>
		</u-modal>

		<!-- 优惠券弹出框 -->
		<u-popup v-model="showPopup" mode="bottom" v-if="options.mode!='integral'&&options.mode!='gift'">
			<view class="popup__coupon">
				<view class="coupon__title f-30">选择优惠券</view>
				<!-- 优惠券列表 -->
				<view class="coupon-list">
					<scroll-view :scroll-y="true" style="height: 565rpx;">
						<view class="coupon-item1" v-for="(item, index) in order.couponList" :key="index"
							style="margin-bottom: 20upx;">
							<view class="item-wrapper"
								:class="[item.is_apply ? 'color-' + CouponColors[index % CouponColors.length] : 'color-gray']"
								@click="handleSelectCoupon(index)">
								<view class="coupon-type">{{ CouponTypeEnum[item.coupon_type].name }}</view>
								<view class="tip dis-flex flex-dir-column flex-x-center">
									<view v-if="item.coupon_type == CouponTypeEnum.FULL_DISCOUNT.value">
										<text class="f-30">￥</text>
										<text class="money">{{ item.reduce_price }}</text>
									</view>
									<text class="money"
										v-if="item.coupon_type == CouponTypeEnum.DISCOUNT.value">{{ item.discount }}折</text>
									<text class="pay-line">满{{ item.min_price }}元可用</text>
								</view>
								<view class="split-line"></view>
								<view class="content dis-flex flex-dir-column flex-x-between">
									<view class="title">{{ item.name }}</view>
									<view class="bottom dis-flex flex-y-center">
										<view class="time flex-box">
											<text>有效期：{{ item.start_time }}~{{ item.end_time }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- 不使用优惠券 -->
				<view class="coupon__do_not dis-flex flex-y-center flex-x-center" style="margin-top: 20upx;">
					<view class="control dis-flex flex-y-center flex-x-center" @click="handleNotUseCoupon()">
						<text class="f-26">不使用优惠券</text>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 卡券出框 -->
		<u-popup v-model="showPopup1" mode="bottom" v-if="options.mode!='integral'&&options.mode!='gift'">
			<view class="popup__coupon">
				<view class="coupon__title f-30">选择卡券</view>
				<!-- 优惠券列表 -->
				<view class="coupon-list">
					<scroll-view :scroll-y="true" style="height: 565rpx;">
						<view :class="['coupon-item']" v-for="(item, index) in order.UserCardVoucherList.data"
							:key="index" @click="handleSelectCoupon1(index)">
							<view class="couponWrap">
								<image :src="item.goods[0].images[0].file.preview_url"></image>
								<view class="couponWrapR">
									<view class="couponWrapRL">
										<view>{{item.goods[0].goods_name}}</view>
										<view>有效期至{{item.effective_time | dateFormat}}</view>
									</view>
									<view class="couponWrapRR">
										<view>
											点击使用
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- 不使用优惠券 -->
				<view class="coupon__do_not dis-flex flex-y-center flex-x-center" style="margin-top: 20upx;">
					<view class="control dis-flex flex-y-center flex-x-center" @click="handleNotUseCoupon1()">
						<text class="f-26">不使用卡券</text>
					</view>
				</view>
			</view>
		</u-popup>

		<view v-if="showModalStatus3">
			<view class="home-popup2" catchtouchmove="true">
				<view class="home-box2">
					<image src="../../static/notvip_model.png" mode="widthFix"></image>
					<view class="memberT">
						1、“我的”-成为大会员-<text @click="buyNow">点击购买</text>。
					</view>
					<view class="memberB">
						2、“高奢名品”专区累计消费3000元即可。
					</view>
					<view style="position: absolute; top: 544upx; left: 112upx; width: 306upx; height: 88upx;"
						@click="toIndex"></view>
				</view>
				<view class="home-popup2-close" @click="box_close3">
					<!-- <image src="../../static/home/icon_close.png" mode=""></image> -->
				</view>
			</view>
			<view
				style="background: #000000 ; width: 100vw; height: 100vh; z-index: 100; opacity: 0.6; position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
			</view>
		</view>
	</view>
</template>

<script>
	import * as Verify from '@/utils/verify'
	import * as CheckoutApi from '@/api/checkout'
	import {
		CouponTypeEnum
	} from '@/common/enum/coupon'
	import DeliveryTypeEnum from '@/common/enum/order/DeliveryType'
	import PayTypeEnum from '@/common/enum/order/PayType'
	import {
		wxPayment
	} from '@/utils/app'
	import * as addressApi from "@/api/address.js"
	import {
		orderAdd
	} from "@/api/integral/index.js"
	import {
		giftAdd
	} from "@/api/gift/index.js"
	import * as giveApi from "@/api/give/index.js"
	const CouponColors = ['red', 'blue', 'violet', 'yellow']
	import * as memberApi from "@/api/member/index.js";

	export default {
		data() {
			return {
				// 枚举类
				DeliveryTypeEnum,
				PayTypeEnum,
				CouponTypeEnum,
				// 当前页面参数
				options: {},
				// 优惠券颜色组
				CouponColors,
				// 系统设置
				setting: {},
				// 当前选中的配送方式
				curDelivery: null,
				// 当前选中的支付方式
				// curPayType: PayTypeEnum.BALANCE.value,
				// 选择的优惠券
				selectCouponId: 0,
				// 是否使用积分抵扣
				isUsePoints: false,
				// 买家留言
				remark: '',
				// 禁用submit按钮
				disabled: false,
				// 是否显示积分说明
				showPoints: false,
				// 是否显示优惠券弹窗
				showPopup: false,
				showPopup1: false,
				// 订单信息 (从后端api中获取)
				order: {
					// 商品列表
					goodsList: [],
					// 优惠券列表
					couponList: [],
					// 是否存在收货地址
					existAddress: false,
					// 默认收货地址
					address: null,
					// 是否存在收货地址
					existAddress: false,
					// 当前用户收货城市是否存在配送规则中
					isIntraRegion: true,
					// 是否存在错误
					hasError: false,
					// 错误信息
					errorMsg: '',
					poolId: '',
					deliveryList: [],

				},
				isSHSM: false,
				bigId: '',
				is_free: 0,
				group_order_id: 0,
				showModalStatus3: false,
				message: '',
				showMember: '', //0不是大会员 1是大会员
				info_by_key: 0,
				source: ''
			}
		},
		filters: {
			dateFormat: function(value) {
				var date = new Date(value * 1000);
				let year = date.getFullYear();
				let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
				let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
				let hour = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
				let min = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
				let sec = date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
				var result = year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
				return result;
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.options = options;
			if (this.options.poolId) {
				this.poolId = this.options.poolId
			}
			if (this.options.bigId) {
				this.bigId = this.options.bigId;
			}
			if (this.options.group_order_id) {
				this.group_order_id = this.options.group_order_id
			}
			if (this.options.info_by_key) {
				this.info_by_key = this.options.info_by_key
			}
			if (this.options.source) {
				this.source = this.options.source
			}

		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			// 获取当前订单信息
			this.getOrderData()
			this.getDeliveryType()
			// this.getbigvip()
			// this.getOrder()
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
			getDeliveryType() {
				let _that = this
				CheckoutApi.getDeliveryType().then(res => {
					this.deliveryList = res.data.delivery_type;
					if (this.deliveryList.length > 1) {
						_that.isSHSM = true;
					}
				})
			},
			getbigvip() {
				memberApi.index().then(res => {
					let data = res.data
					if (data.big_vip_user.is_vip == 0) {
						this.showMember = false;
					} else if (data.big_vip_user.is_vip == 1) {
						this.showMember = true;
					}
				})
			},
			nowExchange() {
				let obj = {};
				obj.id = this.order.goodsList[0].id;
				if (this.options.mode == "integral") {
					obj.data = {};
					obj.data.receiving_name = this.order.address.name;
					obj.data.receiving_area = this.order.address.region.province + this.order.address.region.city + this
						.order.address.region.region + " " + this.order.address.detail;
					obj.data.receiving_mobile = this.order.address.phone;
					orderAdd(obj)
						.then(res => {
							//console.log(res)
							// uni.showToast({
							// 	icon:"none",
							// 	title:res.message,
							// 	duration:2000
							// })
							setTimeout(() => {
								this.$navTo("pageHome/my-exchange/index")
							}, 1500)
						})
						.catch(err => {
							// uni.showToast({
							// 	icon:"none",
							// 	title:err.message,
							// 	duration:2000
							// })
						})
				} else if (this.options.mode == "gift") {
					obj.form = {};
					obj.form.name = this.order.address.name;
					obj.form.area = this.order.address.region.province + this.order.address.region.city + this.order
						.address.region.region + " " + this.order.address.detail;
					obj.form.mobile = this.order.address.phone;
					giftAdd(obj)
						.then(res => {
							//console.log(res)
							// uni.showToast({
							// 	icon:"none",
							// 	title:res.message,
							// 	duration:2000
							// })
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 1500)
						})
						.catch(err => {
							// uni.showToast({
							// 	icon:"none",
							// 	title:err.message,
							// 	duration:2000
							// })
						})
				}
			},
			// 获取订单数据
			getOrderData() {
				let app = this

				if (app.options.mode == "integral") {
					app.curDelivery = 10;
					//console.log(app.curDelivery)
					//console.log(app.curDelivery == DeliveryTypeEnum.EXPRESS.value)
					app.order.goodsList = uni.getStorageSync("integralGoods");
					addressApi.defaults()
						.then(res => {
							//console.log(res)
							if (res.data.detail) {
								app.order.address = res.data.detail;
							}

						}).catch(err => {
							setTimeout(function() {
								uni.navigateBack()
							}, 1000)

						})
				} else if (app.options.mode == "gift") {
					app.curDelivery = 10;
					//console.log(app.curDelivery)
					//console.log(app.curDelivery == DeliveryTypeEnum.EXPRESS.value)
					app.order.goodsList = uni.getStorageSync("giftGoods").map(cur => {
						cur.goods_image = cur.image.preview_url;
						cur.goods_name = cur.gift;
						return cur;
					});
					addressApi.defaults()
						.then(res => {
							//console.log(res)
							if (res.data.detail) {
								app.order.address = res.data.detail;
							}
						}).catch(err => {
							setTimeout(function() {
								uni.navigateBack()
							}, 1000)
						})
				} else {
					// 请求的参数
					const params = {
						delivery: app.curDelivery || 0,
						couponId: app.selectCouponId || 0,
						isUsePoints: app.isUsePoints ? 1 : 0,
					}
					// 请求api
					CheckoutApi.order(app.options.mode, app.getRequestParam())
						.then(result => {
							if (result.message == '该商品仅限大会员购买') {
								this.showModalStatus3 = true
							}
							app.initData(result.data)

						})
						// .catch(err => err)
						.catch(err => {
							setTimeout(function() {
								uni.navigateBack()
							}, 1000)
							console.log(err)
							//   if(err.result.message=='该商品仅限大会员购买'){
							// 	  uni.showModal({
							// 	  	title:'提示',
							// 		content:err.result.message,
							// 		success:function(res){
							// 			if(res.confirm){
							// 				uni.redirectTo({
							// 					url:'../../pageMember/pages/index/index'
							// 				})
							// 			}else if(res.cancel){
							// 				console.log('用户点击了取消')
							// 		uni.navigateBack({
							// 			delta:-1
							// 		})
							// 			}
							// 		}
							// 	  })


							//   }
							// this.showModalStatus3 = true
						})
						.finally(res => {

							// this.showModalStatus3 = true
						})

				}

			},

			// 初始化数据
			initData({
				order
			}) {
				const app = this
				app.order = order
				// 显示错误信息
				// if (order.hasError) {
				//   app.$toast(order.errorMsg)
				// }
				// 当前选择的配送方式
				app.curDelivery = order.delivery
				// 当前选择支付方式 (如果是微信小程序默认使用微信支付)
				// if (app.$platform === 'MP-WEIXIN') {
				//   app.curPayType = PayTypeEnum.WECHAT.value
				// }
			},

			// 获取api请求的参数
			getRequestParam() {
				const app = this
				const {
					options
				} = app
				// 结算模式的固定参数
				const modeParam = {}
				// 结算模式: 立即购买
				if (options.mode === 'buyNow') {
					modeParam.goodsId = options.goodsId
					modeParam.goodsNum = options.goodsNum
					modeParam.goodsSkuId = options.goodsSkuId
					modeParam.regionId = options.regionId
					if (app.poolId) {
						modeParam.PoolId = options.poolId
						modeParam.LuckyFreeId = options.LuckyFreeId
					}
					if (app.bigId != '' || app.bigId != 1) {
						modeParam.is_free = options.is_free;
						modeParam.group_order_id = options.group_order_id
					}

				}
				// 结算模式: 购物车
				if (options.mode === 'cart') {
					modeParam.cartIds = options.cartIds
				}
				// 订单结算参数(用户选择)
				const orderParam = {
					delivery: app.curDelivery || 0,
					couponId: app.selectCouponId || 0,
					isUsePoints: app.isUsePoints ? 1 : 0,
				}
				return {
					...orderParam,
					...modeParam
				}
			},

			// 显示积分说明
			handleShowPoints() {
				this.showPoints = true
			},

			// 显示优惠券弹窗
			handleShowPopup() {
				this.showPopup = true
			},
			// 显示优惠券弹窗
			handleShowPopup1() {
				this.showPopup1 = true
			},

			// 选择优惠券
			handleSelectCoupon(index) {
				const app = this
				const {
					couponList
				} = app.order
				// 当前选择的优惠券
				const couponItem = couponList[index]
				// 判断是否在适用范围
				if (!couponItem.is_apply) {
					app.$toast(couponItem.not_apply_info)
					return
				}
				// 记录选中的优惠券id
				app.selectCouponId = couponItem.user_coupon_id
				// 重新获取订单信息
				app.getOrderData()
				// 隐藏优惠券弹层
				app.showPopup = false
			},
			handleSelectCoupon1(index) {
				let app = this
				app.order.cardVoucherName = app.order.UserCardVoucherList.data[index].name;
				app.voucherId = app.order.UserCardVoucherList.data[index].id;
				// 隐藏优惠券弹层
				app.showPopup1 = false
			},

			// 不使用优惠券
			handleNotUseCoupon() {
				const app = this
				app.selectCouponId = 0
				// 重新获取订单信息
				app.getOrderData()
				// 隐藏优惠券弹层
				app.showPopup = false
			},
			handleNotUseCoupon1() {
				let app = this
				app.order.cardVoucherName = "";
				app.voucherId = "";
				// 隐藏优惠券弹层
				app.showPopup1 = false
			},

			// 选择支付方式
			// handleSelectPayType(value) {
			//   this.curPayType = value
			// },
			handleSelectDelivery(value) {
				this.curDelivery = value
			},
			// 权益选择
			freeChoice(value) {
				this.is_free = value
			},
			// 快递配送：选择收货地址
			onSelectAddress() {
				this.$navTo('pages/address/index', {
					from: 'checkout'
				})
			},

			// 跳转到商品详情页
			onTargetGoods(goodsId) {
				let bigId = this.bigId;
				let parameter = {
					goodsId
				}
				if (this.info_by_key == 1) {
					parameter.info_by_key = this.info_by_key;
					parameter.bigId = 3
				}
				if (this.info_by_key == 1) {
					this.$navTo('pages/goods/detail', {
						goodsId,
						info_by_key: this.info_by_key,
						bigId: 3
					})
				} else {
					this.$navTo('pages/goods/detail', {
						goodsId,
						bigId
					})
				}

			},

			// 订单提交
			onSubmitOrder() {
				const app = this
				if (app.disabled) {
					return false
				}
				// 表单验证
				if (!app.onVerifyFrom()) {
					return false
				}
				// 按钮禁用
				app.disabled = true
				// 请求api
				if (this.poolId) {
					giveApi.create(app.options.mode, app.getFormData())
						.then(result => app.onSubmitCallback(result))
						.catch(err => {
							if (err.result) {
								const errData = err.result.data
								if (errData.is_created) {
									app.navToMyOrder(errData.order_on)
									return false
								}
							}
							// if (uni.getStorageSync('vip_group_order_id')) {
							// 	uni.setStorageSync('vip_group_order_id', 0);
							// }
							app.disabled = false
						})
				} else {
					CheckoutApi.submit(app.options.mode, app.getFormData())
						.then(result => app.onSubmitCallback(result))
						.catch(err => {
							console.log(err.result, 321)
							if (err.result.message == '该商品仅限大会员购买' || err.result.message == '该类型仅限大会员可以发起') {
								this.showModalStatus3 = true
							}
							if (err.result) {
								const errData = err.result.data
								if (errData.is_created) {
									app.navToMyOrder(errData.order_on)
									return false
								} else {
									if (err.result.message == '您已没有首单资格哦') {
										uni.showModal({
											title: '提示',
											content: err.result.message,
											success: function(res) {
												if (res.confirm) {
													console.log(errData.is_jump, 11)
													uni.redirectTo({
														url: errData.is_jump
													})
													// uni.redirectTo({
													// 	url:'/pageLuxury/pages/index/index?group_order_id=0'
													// })
												} else if (res.cancel) {
													console.log('用户点击取消');
												}
											}
										})
									}

								}

							}

							app.disabled = false
						})
				}


			},

			// getOrder(){
			//  const app = this
			//  CheckoutApi.order(app.options.mode, app.getFormData())
			//  .then(res=>{
			//   console.log(res)
			//  })
			//  .catch(err=>{
			//   console.log(err)
			//   if(err.result.message=='该商品仅限大会员购买'){
			// 	  uni.showModal({
			// 	  	title:'提示',
			// 		content:err.result.message,
			// 		success:function(res){
			// 			if(res.confirm){
			// 				uni.redirectTo({
			// 					url:'../../pageMember/pages/index/index'
			// 				})
			// 			}else if(res.cancel){
			// 				console.log('用户点击了取消')
			// 			}
			// 		}
			// 	  })
			//   }
			//  })
			// },

			// 订单提交成功后回调
			onSubmitCallback(result) {
				console.log(result, 'result');
				const app = this;
				app.disabled = false
				//清除大会员推广id
				if (uni.getStorageSync('vip_group_order_id')) {
					uni.setStorageSync('vip_group_order_id', 0);
				}
				app.navToMyOrder(result.data.order_on)
				// 发起微信支付
				// if (result.data.payType == PayTypeEnum.WECHAT.value) {
				//   wxPayment(result.data.payment)
				//     .then(() => app.$success('支付成功'))
				//     .catch(err => app.$error('订单未支付'))
				//     .finally(() => {
				//       app.disabled = false
				//       app.navToMyOrder()
				//     })
				// }
				// // 余额支付
				// if (result.data.payType == PayTypeEnum.BALANCE.value) {
				//   app.$success('支付成功')
				//   app.disabled = false
				//   app.navToMyOrder()
				// }
			},

			// 跳转到我的订单(等待1秒)
			navToMyOrder(order_on) {
				setTimeout(() => {
					this.$navTo('pages/cashier/index', {
						order_on
					})
				}, 1000)
			},

			// 表单提交的数据
			getFormData() {
				const app = this
				const {
					options
				} = app;
				let vip_group_order_id = uni.getStorageSync('vip_group_order_id') || 0;
				// 表单数据
				const form = {
					delivery: app.curDelivery,
					payType: 0,
					couponId: app.selectCouponId || 0,
					isUsePoints: app.isUsePoints ? 1 : 0,
					remark: app.remark || '',
					vip_group_order_id
				}

				// 创建订单-立即购买
				if (options.mode === 'buyNow') {
					form.goodsId = options.goodsId
					form.goodsNum = options.goodsNum
					form.goodsSkuId = options.goodsSkuId
					form.regionId = options.regionId || 0
					if (app.poolId) {
						form.PoolId = options.poolId
						form.LuckyFreeId = options.LuckyFreeId
					}
					// 大会员
					if (app.source) {
						form.is_vip_free = app.is_free;
					}
					if (app.bigId != '' || app.bigId != 1) {
						form.is_free = this.is_free
						form.group_order_id = this.group_order_id
					}
				}
				// 创建订单-购物车结算
				if (options.mode === 'cart') {
					form.cartIds = options.cartIds || null
				}
				// 权益额度兑换
				if(app.is_free ==3){
					form.isEquities = 1
				}
				//console.log(form);
				form.goods_card_voucher_ids = app.voucherId ? [app.voucherId] : [];
				// return false;
				return form
			},

			// 表单验证
			onVerifyFrom() {
				const app = this
				if (app.hasError) {
					app.$toast(app.errorMsg)
					return false
				}
				return true
			},
			buyNow() {
				uni.redirectTo({
					url: '../../pageMember/pages/index/report'
				})
			},
			toIndex() {
				uni.navigateBack()
				// uni.redirectTo({
				// 	url: '../../pageMember/pages/index/index'
				// })
			},
			box_close3() {
				// this.showModalStatus3 = false
				uni.redirectTo({
					url: '../../pageMember/pages/index/index'
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./style.scss";

	.submitOrder {
		position: fixed;
		bottom: var(--window-bottom);
		width: 100%;
		background: #fff;
		border-top: 1px solid #eee;
		z-index: 11;
		line-height: 92upx;
		background: #ff5060;
		text-align: center;
		line-height: 92upx;
		font-size: 28upx;
		color: white;
	}
</style>
