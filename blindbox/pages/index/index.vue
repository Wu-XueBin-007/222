<template>
	<view class="warp">
		<image src="../../static/back.jpg" class="warpBack"></image>
		<view class="btnWrap">
			<view class="btnWrapL" @click="freeTrial">
				<image src="../../static/btn1.png" class="btnWrapLImg"></image>
				免费试玩
			</view>
			<view class="btnWrapR" @click="getInto" v-if="boxDetail.box_info">
				<image src="../../static/btn2.png" class="btnWrapRImg"></image>
				{{boxDetail.box_info.price}}一发入魂
			</view>
		</view>
		<view class="activityRules" @click="checkCollage">活动规则</view>
		<view class="myBlindBox" @click="getNow">我的盲盒</view>
		<view class="proWraps">
			<view
				:class="['proWrapsItem',dIndex<(showIndex+1)*3&&dIndex%3==0?'active-left':'',dIndex<(showIndex+1)*3&&dIndex%3==1?'active-center':'',dIndex<(showIndex+1)*3&&dIndex%3==2?'active-right':'']"
				v-for="(item,dIndex) in boxDetail.goods_list" :key="dIndex">
				<image :src="item.preview_url!=null?item.preview_url:item.images.file.preview_url"></image>
			</view>
		</view>
		<view class="priceWrap">
			<text>￥</text>
			<text v-if="boxDetail.box_info">{{boxDetail.box_info.price}}/次</text>
		</view>
		<view class="allBox">
			<image src="../../static/allBoxBack.png" class="allBoxBack"></image>
			<view class="allBoxL" @click="wholeBox">全部盒子</view>
			<image src="../../static/more.png" class="allBoxR"></image>
		</view>
		<swiper :indicator-dots="false" :circular="true" :autoplay="false" :duration="1000" :current="navIndex"
			@change="changeNavFun" class="boxSwiper" style="height: 384rpx;">
			<swiper-item v-for="(item,index) in boxList" :key="index" style="width: 100%;height: 100%;">
				<view class="boxWrap">
					<!-- <image src="../../static/tape.png" class="boxWrapImg" mode="widthFix"></image> -->
					<view class="boxWrapC" @click="getEnter">
						<image :src="item.preview_url" class="boxWrapCImg"></image>
						<view class="boxWrapCPoint">
							<view class="boxWrapCPointImgWrap">
								<image src="../../static/clickimg.png" class="boxWrapCPointImg"></image>
							</view>

							<text>查看奖品</text>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="boxListWrap">
			<view class="boxListWrapBox">
				<view @click="changeNav(index)" :data-index="index"
					:class="['boxListWrapItem',index==navIndex?'active':'',(item.left>190||item.left<-315)?'boxListWrapItemTrans':'']"
					v-for="(item,index) in boxList" :key="index"
					:style="{'transform': index==navIndex?'scale(1) translate(-50%,-50%)':'scale(.8) translate('+item.left+'%,-60%)'}">
					<image @click.stop="changeNav(index)" :data-index="index" :src="item.preview_url"
						class="boxListWrapItemT"></image>
					<text @click.stop="changeNav(index)" :data-index="index"
						class="boxListWrapItemB">{{item.name}}</text>
				</view>
			</view>

		</view>
		<!--弹出框 免费试玩-->
		<view class="free-popup" v-if="showOne">
			<view class="free-box" v-if="prizeList.length>0">
				<view class="free-box-t">
					恭喜开出【{{prizeList[drawIndex].prize_name}}款】
				</view>
				<view class="free-box-c">
					<view class="free-box-item">
						<view class="free-box-img">
							<image :src="prizeList[drawIndex].goods_sku.images[0].file.preview_url" mode=""></image>
						</view>
						<view class="free-box-text2">
							￥{{prizeList[drawIndex].goods_sku.goods_price}}
						</view>
						<view class="free-box-text3">
							{{prizeList[drawIndex].goods_sku.goods_name}}
						</view>
					</view>

				</view>
				<view class="free-box-b" @click="box_close">
					<image src="../../static/icon_clone.png" mode=""></image>
				</view>
				<view class="free-box-b2">
					<image src="../../static/tape2.png" mode=""></image>
				</view>
				<view class="free-popup-close">
					<view class="free-popup-closeL" @click="onTargetGoodsList" :data-id="prizeList[drawIndex].goods_id">
						查看商品
					</view>
					<view class="free-popup-closeR2" v-if="drawIndex<prizeList.length-1">
						<view class="closeText1" @click="seeNext">
							下一个
						</view>
					</view>
					<view class="free-popup-closeR2" v-else @click="seeClose">
						<view class="closeText1">
							全部收下
						</view>
					</view>
					<!-- <view class="free-popup-closeR">
						<view class="closeText1">
							￥39.00
						</view>
						<view class="closeText2">
							来次真的
						</view>
					</view> -->
				</view>
			</view>

		</view>
		<view class="free-popup" v-if="showTwo">
			<view class="free-box">
				<view class="free-box-t">
					恭喜开出【{{free_trial.goods_info.prize_name}}款】
				</view>
				<view class="free-box-c">
					<view class="free-box-item">
						<view class="free-box-img">
							<image
								:src="free_trial.goods_info.preview_url!=null?free_trial.goods_info.preview_url:free_trial.goods_info.images.file.preview_url"
								mode=""></image>
						</view>
						<view class="free-box-text2">
							￥{{free_trial.goods_info.goods_price}}
						</view>
						<view class="free-box-text3">
							{{free_trial.goods_info.goods_name}}
						</view>
					</view>

				</view>
				<view class="free-box-b" @click="box_closeTwo">
					<image src="../../static/icon_clone.png" mode=""></image>
				</view>
				<view class="free-box-b2">
					<image src="../../static/tape2.png" mode=""></image>
				</view>
				<view class="free-popup-close">
					<view class="free-popup-closeL" @click="onTargetGoodsList"
						:data-id="free_trial.goods_info.goods_id">
						查看商品
					</view>
					<view class="free-popup-closeR" @click="Submit">
						<view class="closeText1">
							￥{{free_trial.box_info.price}}
						</view>
						<view class="closeText2">
							来次真的
						</view>
					</view>
				</view>
			</view>

		</view>
		<!-- 免费试玩 end-->
		<!-- 查看奖品 -->
		<view class="prize" v-if="showPrize">
			<view class=""
				style="width: 100%;height: 20rpx;position: fixed;top: 26%;left: 0; background-color: #FFFFFF;"></view>
			<view class="prize-title">
				开盒必出以下宝贝之一
			</view>
			<view class="prize-head">
				<view class="prize-head-left">
					<image src="../../static/bj.png" mode=""></image>
					<view class="">产出</view>
					<view class="">概率</view>
				</view>
				<view class="prize-head-right">
					<view class="prize-head-block" v-if="boxDetail.box_info.category.length<4"
						v-for="(item,cIndex) in boxDetail.box_info.category" :key="cIndex">
						<view :class="[cIndex%3==0?'color1':'',cIndex%3==1?'color2':'',cIndex%3==2?'color3':'']">
							{{item.prize_name}}
						</view>
						<view :class="[cIndex%3==0?'color1':'',cIndex%3==1?'color2':'',cIndex%3==2?'color3':'']">
							{{item.prize_ratio}}%
						</view>
					</view>
				</view>

			</view>
			<view class="prize-main">
				<view class="prize-item" v-for="(item,gIndex) in goods_list" :key="gIndex">
					<view class="prize-item-left">
						<image :src="item.preview_url!=null?item.preview_url:item.images.file.preview_url" mode="">
						</image>
						<view
							:class="['prize-item-label',item.color%3==0?'back1':'',item.color%3==1?'back2':'',item.color%3==2?'back3':'']">
							{{item.prize_name}}
						</view>
					</view>
					<view class="prize-item-right">
						<view class="prize-item-title">
							{{item.goods_name}}
						</view>
						<view class="prize-item-text">
							￥{{item.goods_price}}
						</view>
					</view>
				</view>
			</view>
			<view class="prizeClone" @click="boxEnter">
				<image src="../../static/icon_clone2.png" mode=""></image>
			</view>
		</view>
		<!-- 查看奖品 end-->

		<!-- 盲盒抽奖 -->
		<view class="luckDraw-popup" v-if="showLuck">
			<view class="luckDraw-box">
				<view class="luckDraw-box-t">
					<image :src="boxDetail.box_info.preview_url" mode=""></image>
				</view>
				<view class="luckDraw-box-c">
					<view class="luckDraw-box-item">
						<view class="luckDraw-box-text2">
							{{boxDetail.box_info.name}}
						</view>
						<view class="luckDraw-box-text3">
							打开一个未知,还你一个惊喜
						</view>
						<view class="luckStepper">
							<view class="luckReduce" @click="getReduce">
								-
							</view>
							<view class="luckInput">
								<input type="number" v-model="Num" @blur="bntInput">
							</view>
							<view class="luckAdd" @click="getAdd">
								+
							</view>
						</view>
						<view class="luckDraw-box-text3">
							{{boxDetail.box_info.price}}/个 共{{boxDetail.box_info.stock_total}}
						</view>
						<view class="luckBtn" @click="getPurchase(1)">
							购买
						</view>
						<view class="agreement">
							<label class="all-radio">
								<radio class="radio" :checked="agreementState" @click="radiochange" color="#ff5060" />
								<text>已阅读并同意</text>
							</label>
							<view class="agreementText" @click="goRichtext">
								《授权协议》
							</view>
						</view>
						<view class="luckFooter" @click="getFoter">
							优先使用 <text>微信</text> 支付，更换支付方式 <image src="../../static/icon_right.png" mode=""></image>
						</view>
					</view>

				</view>
				<view class="luckDraw-box-b" @click="boxClose">
					<image src="../../static/icon_clone.png" mode=""></image>
				</view>
			</view>
			<view class="luckDraw-popup-close">
				<view class="luckDraw-popup-closeL" @click="getPurchase(2)">
					<image src="../../static/box1.png" mode=""></image>
					豪气五连抽
				</view>
				<view class="luckDraw-popup-closeR" @click="getPurchase(3)">
					<image src="../../static/box2.png" mode=""></image>
					十连绝世
				</view>
			</view>
		</view>
		<!-- 支付方式 -->
		<view class="paymentMethod" v-if="showPay">
			<view class="paymentMethod-title">
				选择支付方式
			</view>
			<view class="bShier-item">
				<!-- #ifdef APP-PLUS -->
				<!-- <view class="bShier-item-list bShier-color" @click="btn_payTa(PayTypeEnum.ZHIFUBAO.value)">
					<view class="bShier-item-icon">
						<image src="../../../static/icon/icon_zfbzf.png" mode=""></image>
						<text>{{PayTypeEnum.ZHIFUBAO.name}}</text>
					</view>
					<view class="coupons-item-chbox">
						<checkbox class="checks1-h5" :checked="paymentType==PayTypeEnum.ZHIFUBAO.value"></checkbox>
					</view>

				</view> -->
				<!-- #endif -->
				<view class="bShier-item-list bShier-color" @click="btn_payTa(PayTypeEnum.WECHAT.value)">
					<view class="bShier-item-icon">
						<image src="../../../static/icon/icon_wxzf.png" mode=""></image>
						<text>{{PayTypeEnum.WECHAT.name}}</text>
					</view>
					<view class="coupons-item-chbox">
						<checkbox class="checks1-h5" :checked="paymentType==PayTypeEnum.WECHAT.value"></checkbox>
					</view>
				</view>
				<view class="bShier-item-list" @click="btn_payTa(PayTypeEnum.BALANCE.value)">
					<view class="bShier-item-icon" style="display: flex;align-items: center;">
						<image src="../../../static/icon/icon_ye.png" mode="widthFix"></image>
						<text>{{PayTypeEnum.BALANCE.name}}（可用余额：{{userInfo.balance ? userInfo.balance : 0}}）</text>
					</view>
					<view class="coupons-item-chbox">
						<checkbox class="checks1-h5" :checked="paymentType==PayTypeEnum.BALANCE.value"></checkbox>
					</view>
				</view>
			</view>
			<view class="paymentMethodClone" @click="foterClose">
				<image src="../../static/icon_clone2.png" mode=""></image>
			</view>
		</view>
		<!-- 支付方式 end-->
		<!-- 盲盒抽奖 end-->
		<!-- 开盒子动效 -->
		<view class="dynamicEffect" v-if="showEffect">
			<view class="dynamicImg">
				<image :src="boxDetail.box_info.preview_url" mode=""></image>
			</view>
		</view>
		<!-- 开盒子动效 end-->
		<u-popup v-model="showAgree" mode="bottom" @close="close" @open="open">
			<view class="paymentMethod-title">
				活动规则
			</view>
			<view style="max-height: 700upx;">
				<view v-html="blindbox_activity_rules" style="padding: 30upx;box-sizing: border-box;">

				</view>
			</view>
		</u-popup>
		<view v-if="showEffect"
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: rgba(0,0,0,.8);z-index: 999;"
			catchtouchmove="true"></view>
		<view v-if="showOne||showTwo||showPrize||showLuck||showPay"
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: rgba(0,0,0,.6);z-index: 999;"
			catchtouchmove="true" @click="getCloe"></view>
	</view>
</template>

<script>
	import {
		DeliveryStatusEnum,
		DeliveryTypeEnum,
		OrderStatusEnum,
		PayStatusEnum,
		PayTypeEnum,
		ReceiptStatusEnum
	} from '@/common/enum/order'
	import * as OrderApi from '@/api/order'
	import * as UserApi from "@/api/user.js";
	import {
		detail
	} from '@/api/order/comment.js'
	import {
		wxPayment,
		zfbPayment
	} from '@/utils/app'
	import * as boxApi from "@/api/blindbox/index.js";
	import * as settingApi from '@/api/ticket/setting'
	const App = getApp();
	let timer = null;
	let drawTimer = null;
	export default {
		data() {
			return {
				navIndex: 0,
				list: [{
						left: -50,
						ind: 0
					},
					{
						left: -50,
						ind: 1
					},
					{
						left: -50,
						ind: 2
					},
					{
						left: -50,
						ind: 3
					},
					{
						left: -50,
						ind: 4
					},
					{
						left: -50,
						ind: 5
					},
					{
						left: -50,
						ind: 6
					},
					{
						left: -50,
						ind: 7
					},
					{
						left: -50,
						ind: 8
					},
					{
						left: -50,
						ind: 9
					},
				],
				showOne: false, //显示中奖商品
				showTwo: false, //显示免费试玩
				showPrize: false, //显示奖品
				showLuck: false, //显示抽奖
				showPay: false, //显示支付方式
				showEffect: false, //显示动效
				showAgree: false,
				Num: 1, //购买数量
				boxList: [], //盒子列表
				boxDetail: {}, //盒子详情
				showIndex: 0,
				goods_list: [],
				reqFlag: true,
				paymentType: 20,
				userInfo: {},
				PayTypeEnum,
				boxId: -1,
				prizeList: [], //中奖商品列表
				agreementState: false,
				timerNum: 0,
				drawIndex: 0,
				free_trial: {},
				blindbox_activity_rules: '',
				kineticIndex: 0,
			}
		},
		onLoad() {
			this.init();
			this.getCommon();
			clearInterval(timer)
			timer = setInterval(() => {
				if (this.timerNum > 2) {
					this.timerNum = 1
				} else {
					this.timerNum++;
				}
				this.showIndex = this.timerNum;
				// console.log(this.showIndex,55)
			}, 4000)

		},
		onUnload() {
			clearInterval(timer)
			clearInterval(drawTimer)
		},
		onShow() {
			this.agreementState = uni.getStorageInfoSync('agreementState')
			this.getUserInfo()
		},
		methods: {
			changeNavFun(e) {
				// console.log(e)
				clearInterval(timer)
				this.timerNum = 0;
				this.showIndex = -1;
				timer = setInterval(() => {
					if (this.timerNum > 2) {
						this.timerNum = 1
					} else {
						this.timerNum++;
					}
					this.showIndex = this.timerNum;
					// console.log(this.showIndex,55)
				}, 4000)
				if (e.detail.current != this.navIndex) {
					this.changeNav(e.detail.current);
				}

			},
			changeNav(index) {
				// console.log(this.navIndex,index)
				this.kineticIndex = index;
				this.getDetail(this.boxList[index].id)
				this.getDemo(this.boxList[index].id)
				let arr = JSON.parse(JSON.stringify(this.boxList));
				let disFlag = arr[index].left > -50 ? true : false;
				let middleNum = Math.floor(arr.length / 2);
				// console.log(disFlag)
				if (disFlag) {
					let disIndex = -(arr[index].left + 50) / 120;
					// console.log(disIndex)
					for (let i = 0; i < arr.length; i++) {
						let obj = arr[i];
						if (obj.left >= -50 && (obj.left + 120 * disIndex) < -50) {
							obj.left = obj.left + 120 * disIndex - 25;
						} else {
							obj.left = obj.left + 120 * disIndex;
						}
						arr.splice(i, 1, obj);
						// arr.push(obj)
					}
				} else {
					let disIndex = Math.abs((arr[index].left + 50 + 25) / 120);
					for (let i = 0; i < arr.length; i++) {
						let obj = arr[i];
						console.log(obj)
						if (obj.left < -50 && (obj.left + 120 * disIndex) > -50) {
							obj.left = obj.left + 120 * disIndex + 25;
						} else {
							obj.left = obj.left + 120 * disIndex;
						}
						arr.splice(i, 1, obj);
						// arr.push(obj)
					}
				}
				let add = [];
				let reduce = [];
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].left >= 70) {
						add.push(arr[i]);
					} else if (arr[i].left <= -195) {
						reduce.push(arr[i]);
					}
				}
				add.sort((a, b) => {
					return +a.left - +b.left;
				});
				reduce.sort((a, b) => {
					return +a.left - +b.left;
				});
				if (add.length < 3) {
					let dis = 3 - add.length;
					for (let i = 0; i < dis; i++) {
						let obj = arr[reduce[i].ind];
						obj.left = add[add.length - 1].left + 120 * (i + 1);
						arr.splice(reduce[i].ind, 1, obj);
						let objs = JSON.parse(JSON.stringify(obj));
						objs.left = 99999;
						this.boxList.splice(reduce[i].ind, 1, objs)
					}
				}
				if (reduce.length < 3) {
					let dis = 3 - reduce.length;
					for (let i = 0; i < dis; i++) {
						let obj = arr[add[add.length - 1 - i].ind];
						obj.left = reduce[0].left - 120 * (i + 1);
						arr.splice(add[add.length - 1 - i].ind, 1, obj);
						let objs = JSON.parse(JSON.stringify(obj));
						objs.left = 99999;
						this.boxList.splice(add[add.length - 1 - i].ind, 1, objs)
					}
				}
				// console.log(arr)
				this.$nextTick(() => {
					this.boxList = arr;
					this.navIndex = index;
				})

			},
			init() {
				boxApi.list().then(res => {
					// console.log(res)
					if (res.status == 200) {
						let middleNum = Math.floor(res.data.list.length / 2);
						// console.log(res.data.list)
						res.data.list = res.data.list.map((cur, index) => {
							cur.ind = index;
							cur.left = -50;
							return cur;
						})
						for (let i = 0; i < res.data.list.length; i++) {
							if (i <= middleNum) {
								let obj = res.data.list[i];
								obj.left = obj.left + 120 * i;
								res.data.list.splice(i, 1, obj);
							} else if (i > middleNum) {
								let obj = res.data.list[i];
								obj.left = obj.left - 120 * (res.data.list.length - i) - 25;
								res.data.list.splice(i, 1, obj);
							}
						}
						this.boxList = res.data.list
						this.getDetail(this.boxList[0].id);
						this.getDemo(this.boxList[0].id)
					}

				})
			},
			getDetail(id) {
				var obj = {};
				obj.id = id
				boxApi.detail(obj).then(res => {
					if (res.status == 200) {
						this.boxDetail = res.data;
						this.goods_list = res.data.goods_list.map((cur, index) => {
							for (var i = 0; i < this.boxDetail.box_info.category.length; i++) {
								if (cur.category_id == this.boxDetail.box_info.category[i].id) {
									cur.color = i;
								}
							}
							return cur;
						})
					}
				})
			},
			getDemo(id) {
				var obj = {};
				obj.id = id;
				boxApi.free_trial(obj).then(res => {
					if (res.status == 200) {
						this.free_trial = res.data;
					}
				})
			},
			getCommon() {
				settingApi.detail().then(res => {
					this.blindbox_activity_rules = res.data.detail.blindbox_activity_rules.replace(/<img/g,
						"<img style='width: 100%;'");
				})
			},
			wholeBox() {
				uni.navigateTo({
					url: "/blindbox/pages/index/boxList?navIndex=" + this.navIndex
				})
				// let navIndex=this.navIndex
				// this.$navTo('blindbox/pages/index/boxList', {
				// 	navIndex
				// })
			},
			getNow() {
				uni.navigateTo({
					url: "/blindbox/pages/nowGoods/nowGoods"
				})
			},
			goRichtext() {
				uni.navigateTo({
					url: "/blindbox/pages/index/rich"
				})
			},
			getCloe() {
				this.showPrize = false;
			},
			getAdd() {
				if (this.Num < this.boxDetail.box_info.stock_total) {
					this.Num = Number(this.Num) + 1
				} else {
					uni.showToast({
						title: '已超过库存数量',
						icon: "none",
						duration: 2000
					});
				}
			},
			getReduce() {
				if (this.Num <= 1) {
					uni.showToast({
						title: '购买不能小于1数量',
						icon: "none",
						duration: 2000
					});
				} else {
					this.Num = Number(this.Num) - 1
				}
			},
			bntInput() {
				if (this.Num > this.boxDetail.box_info.stock_total) {
					uni.showToast({
						title: '已超过库存数量',
						icon: "none",
						duration: 2000
					});
					setTimeout(() => {

						this.Num = this.boxDetail.box_info.stock_total;
						// console.log(this.showIndex,55)
					}, 1000)
				} else if (this.Num < 1) {
					uni.showToast({
						title: '购买不能小于1数量',
						icon: "none",
						duration: 2000
					});
					setTimeout(() => {

						this.Num = 1;
						// console.log(this.showIndex,55)
					}, 1000)
				}
			},
			radiochange(e) {
				this.agreementState = !this.agreementState;
				uni.setStorageSync('agreementState', this.agreementState)
			},
			freeTrial() {
				// this.showOne=true;
				this.getDemo(this.boxList[this.kineticIndex].id)
				this.showEffect = true;
				setTimeout(() => {
					this.showTwo = true;
					this.showEffect = false;
				}, 1500)
			},
			box_close() {
				this.showOne = false;
				this.drawIndex = 0;
				this.prizeList = [];
			},
			box_closeTwo() {
				this.showTwo = false;
				this.drawIndex = 0;
				this.prizeList = [];
			},
			getEnter() {
				this.showPrize = true;
			},
			boxEnter() {
				this.showPrize = false;
			},
			getInto() {
				this.showLuck = true;
			},
			boxClose() {
				this.showLuck = false;
			},
			btn_payTa(type) {
				this.paymentType = type;
				this.showPay = false;
			},
			getFoter() {
				this.showPay = true;
			},
			foterClose() {
				this.showPay = false;
			},
			checkCollage() {
				// console.log(11)
				this.showAgree = true;
				console.log(this.showAgree, 22)
			},
			close() {

			},
			open() {

			},
			seeNext() {
				this.drawIndex = Number(this.drawIndex) + 1
				// console.log(this.drawIndex,88)
			},
			seeClose() {
				this.showOne = false;
				this.drawIndex = 0;
				this.prizeList = [];
				uni.navigateTo({
					url: "/blindbox/pages/nowGoods/nowGoods"
				})
				// setTimeout(()=>{

				// },1500)
			},
			// 跳转至商品详情
			onTargetGoodsList(e) {
				let goodsId = e.currentTarget.dataset.id || e.target.dataset.id;
				this.$navTo('pages/goods/detail', {
					goodsId
				})
			},
			// 获取会员信息
			getUserInfo() {
				UserApi.info()
					.then(result => {
						this.userInfo = result.data.userInfo;
					})
			},
			getPurchase(type) {
				const app = this
				if (app.agreementState == false) {
					uni.showToast({
						icon: 'none',
						title: '请先阅读并同意《授权协议》'
					});
					return;
				}
				if (app.paymentType == null) {
					uni.showToast({
						icon: 'none',
						title: '请选择支付方式'
					});
					return;
				}
				let paymentType = app.paymentType;
				// #ifdef APP-PLUS
				// if(paymentType == 20){
				// 	paymentType = 40;
				// }
				// #endif
				uni.showModal({
					content: "确认支付",
					success: res => {
						if (res.confirm) {
							let obj = {};
							obj.blindbox_id = app.boxDetail.box_info.id;
							if (type == 1) {
								obj.buy_num = app.Num;
							} else if (type == 2) {
								obj.buy_num = 5;
							} else if (type == 3) {
								obj.buy_num = 10;
							}

							obj.pay_type = paymentType;
							// if(this.payIndex==0){
							// 	obj.pay_type = 20;
							// }else if(this.payIndex==1){
							// 	obj.pay_type = 10;
							// }
							this.reqFlag = false;
							boxApi.pay(obj).then(res => {
								// console.log(res)

								if (res.data.pay_type == 10) {
									this.$success("支付成功");
									this.showLuck = false;
									this.showEffect = true;

									// setTimeout(() => {
									// 	this.selectPrize(res.data.order_id)
									// }, 1500)
									drawTimer = setInterval(() => {
										this.selectPrize(res.data.order_id)
									}, 1500)
								} else if (res.data.pay_type == 20) {
									res.data.payment.timeStamp = res.data.payment.timeStamp.toString();
									wxPayment(res.data.payment)
										.then(() => {
											this.$success('支付成功')
											this.showLuck = false;
											this.showEffect = true;
											drawTimer = setInterval(() => {
												this.selectPrize(res.data.order_id)
											}, 1500)
											// setTimeout(() => {
											// 	this.selectPrize(res.data.order_id)
											// }, 1500)
										})
										.catch(err => {
											console.log(err)
											this.reqFlag = true
											this.$error('未支付')
										})
										.finally(() => {

										})
								}
							})
						}
					}
				})
			},
			Submit() {
				const app = this;
				let paymentType = app.paymentType;
				let obj = {};
				obj.blindbox_id = app.boxDetail.box_info.id;
				obj.buy_num = 1;

				obj.pay_type = paymentType;
				// if(this.payIndex==0){
				// 	obj.pay_type = 20;
				// }else if(this.payIndex==1){
				// 	obj.pay_type = 10;
				// }
				this.reqFlag = false;
				boxApi.pay(obj).then(res => {
					// console.log(res)

					if (res.data.pay_type == 10) {
						this.$success("支付成功");
						this.showTwo = false;
						this.showEffect = true;

						// setTimeout(() => {
						// 	this.selectPrize(res.data.order_id)
						// }, 1500)
						drawTimer = setInterval(() => {
							this.selectPrize(res.data.order_id)
						}, 1500)
					} else if (res.data.pay_type == 20) {
						res.data.payment.timeStamp = res.data.payment.timeStamp.toString();
						wxPayment(res.data.payment)
							.then(() => {
								this.$success('支付成功')
								this.showTwo = false;
								this.showEffect = true;
								drawTimer = setInterval(() => {
									this.selectPrize(res.data.order_id)
								}, 1500)
								// setTimeout(() => {
								// 	this.selectPrize(res.data.order_id)
								// }, 1500)
							})
							.catch(err => {
								console.log(err)
								this.reqFlag = true
								this.$error('未支付')
							})
							.finally(() => {

							})
					}
				})
			},
			//查看中奖商品
			selectPrize(order_id) {
				var obj = {};
				obj.order_id = Number(order_id);
				boxApi.select_prize_goods(obj).then(res => {
					// console.log(res)
					if (res.status == 200) {
						// console.log(typeof(res.data))
						if (!res.data["list"]) {
							// console.log(1)
							clearInterval(drawTimer)
						} else {
							// console.log(2)
							this.prizeList = res.data.list;
							this.showEffect = false;
							this.showOne = true;
							clearInterval(drawTimer)
						}

					}
				})
			}

		}
	}
</script>

<style>
	/* checkbox样式修改 */
	checkbox .wx-checkbox-input {
		border-radius: 50%;
		/* 		background-color: #ff5060;
		color: #FFFFFF !important; */
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		border: 2upx solid #ff5060;
		background: #ff5060;
		color: #FFFFFF !important;
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
		font-size: 28upx;
	}

	.checks1-h5>>>.uni-checkbox-input {
		width: 28upx;
		height: 28upx;
		border-radius: 50%;
	}

	/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
	.checks1-h5>>>.uni-checkbox-input.uni-checkbox-input-checked {
		border: 2upx solid #ff5060;
		/* border: none; */
		background: #ff5060;
		color: #FFFFFF !important;
	}

	/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
	.checks1-h5>>>.uni-checkbox-input.uni-checkbox-input-checked::before {
		border-radius: 50%;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	.checks1-wx>>>.uni-checkbox-input {
		width: 28upx;
		height: 28upx;
		border-radius: 50%;
	}

	/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
	.checks1-wx>>>.uni-checkbox-input.uni-checkbox-input-checked {
		border: 2upx solid #ff5060;
		/* border: none; */
		background: #ff5060;
		color: #FFFFFF !important;
	}

	/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
	.checks1-wx>>>.uni-checkbox-input.uni-checkbox-input-checked::before {
		border-radius: 50%;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	.checks>>>.uni-checkbox-input {
		width: 28upx;
		height: 28upx;
		border-radius: 50%;
	}

	/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
	.checks>>>.uni-checkbox-input.uni-checkbox-input-checked {
		border: 2upx solid #ff5060;
		/* border: none; */
		background: #ff5060;
		color: #FFFFFF !important;
	}

	/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
	.checks>>>.uni-checkbox-input.uni-checkbox-input-checked::before {
		border-radius: 50%;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	.activityRules {
		width: 152rpx;
		height: 58rpx;
		background: rgba(255, 255, 255, .25);
		border-radius: 30rpx 0px 0px 30rpx;
		text-align: right;
		padding-right: 8rpx;
		box-sizing: border-box;
		position: fixed;
		top: 36rpx;
		right: 0;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 58rpx;
		z-index: 999;
	}

	.myBlindBox {
		width: 152rpx;
		height: 58rpx;
		background: rgba(255, 255, 255, .25);
		border-radius: 30rpx 0px 0px 30rpx;
		text-align: right;
		padding-right: 8rpx;
		box-sizing: border-box;
		position: fixed;
		top: 112rpx;
		right: 0;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		z-index: 999;
		line-height: 58rpx;
	}


	.allBox {
		width: 130rpx;
		height: 98rpx;
		/* background: #FF8399; */
		border-radius: 30rpx;
		position: fixed;
		right: 0;
		bottom: 450rpx;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		box-sizing: border-box;
		padding: 0 10rpx 0 20rpx;
	}

	.allBoxL {
		width: 80rpx;
		font-size: 40rpx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 34rpx;
		white-space: pre-wrap;
	}

	.allBoxR {
		margin-left: 10rpx;
		width: 16rpx;
		height: 26rpx;
	}

	.allBoxBack {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		border-radius: 30rpx;
		z-index: -1;
	}

	.priceWrap {
		font-size: 46rpx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 46rpx;
		bottom: 466rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		left: 0;
		width: 100%;
		justify-content: center;
	}

	.priceWrap>text {
		font-size: 46rpx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 46rpx;
	}

	.priceWrap>text:nth-child(1) {
		margin-right: 4rpx;
	}


	.proWraps {
		bottom: 790rpx;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		overflow: hidden;
		/* background: red; */
		z-index: 99;
	}

	.proWrapsItem {
		position: absolute;
		width: 104rpx;
		height: 104rpx;
		background: white;
		border: 2px solid #FFD800;
		opacity: 0;
		top: 100%;
		left: 0;
		overflow: hidden;
		border-radius: 50%;
	}

	.proWrapsItem>image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.proWrapsItem.active-left {
		animation: bubble-left 10s ease-out infinite;
		z-index: 1;
	}

	.proWrapsItem.active-center {
		animation: bubble-center 10s ease-out infinite;
		z-index: 1;
	}

	.proWrapsItem.active-right {
		animation: bubble-right 10s ease-out infinite;
		z-index: 1;
	}


	.boxListWrap {
		width: 100%;
		height: 230rpx;
		position: fixed;
		bottom: 216rpx;
		left: 0;
	}

	.boxListWrapBox {
		transition: transform 0.3s ease 0s;
	}

	.boxListWrapItem.active {
		transform: scale(1) translate(-50%, -50%);
		background-image: url(../../static/bjt.png);
		background-size: 184upx 230upx;
		background-repeat: no-repeat;
		opacity: 1;
		/* position: relative; */
	}

	.boxListWrapItemImg {
		position: absolute;
		top: 0;
		left: 0;
	}

	.boxListWrapItemImg img {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}

	.boxListWrapItemTrans {
		opacity: 0;
	}

	.boxListWrapItem {
		/* transform: scale(.8) translate(-50%,-50%); */
		background: #FFFFFF;
		width: 184rpx;
		height: 230rpx;
		position: absolute;
		left: 50%;
		top: 50%;
		transition: all .3s;
		box-sizing: border-box;
		border: 2rpx solid #FFD800;
		padding: 24rpx 18rpx 22rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-radius: 20rpx;
		opacity: 0.7;
	}

	.boxListWrapItemT {
		width: 144rpx;
		height: 132rpx;
	}

	.boxListWrapItemB {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 32rpx;
		white-space: nowrap;
		overflow: hidden;
		/* text-overflow: ellipsis; */
	}


	.boxSwiper {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 520rpx;
	}

	.boxWrap {

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.boxWrapImg {
		position: absolute;
		z-index: -1;
		left: 0;
		top: 14rpx;
		width: 100%;
	}

	.boxWrapC {
		width: 414rpx;
		height: 384rpx;
		position: relative;
	}

	.boxWrapCImg {
		width: 100%;
		height: 100%;
		animation: blindbox 4s linear infinite;
	}

	.boxWrapCPoint {
		position: absolute;
		right: -46rpx;
		bottom: 72rpx;
		display: flex;
		flex-direction: column;
		animation: hand 1s linear infinite;
	}

	.boxWrapCPointImgWrap {
		padding-left: 14rpx;
	}

	.boxWrapCPointImg {
		width: 72rpx;
		height: 72rpx;
		margin-bottom: 12rpx;
	}

	.boxWrapCPoint>text {
		font-size: 32rpx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 32rpx;
	}


	.btnWrap {
		position: fixed;
		bottom: 20rpx;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btnWrapL {
		width: 168rpx;
		height: 148rpx;
		padding: 22rpx 46rpx 0;
		position: relative;
		font-size: 40rpx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 40rpx;
		margin-right: 12rpx;
	}

	.btnWrapLImg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}

	.btnWrapR {
		width: 510rpx;
		height: 148rpx;
		position: relative;
		font-size: 60rpx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 60rpx;
		text-align: center;
		padding-top: 32rpx;
		/* line-height: 148rpx; */
	}

	.btnWrapRImg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}


	.warp {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		/* background-image: url(../../static/back.jpg);
		background-size: 100% 100%;
		background-position: 0 0; */
	}

	.warpBack {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	/* 免费试玩 */
	.free-popup {
		width: 526upx;
		position: fixed;
		top: 16%;
		left: 14%;
		z-index: 2000;
	}

	.free-box {
		width: 100%;
		/* height: 568upx; */
		position: relative;
	}

	.free-box-t {
		margin: -48upx auto 0;
		width: 412upx;
		height: 84upx;
		border: 6upx solid #FFC936;
		background-color: #FF981E;
		border-radius: 48upx;
		padding: 0 20upx;
		font-size: 40upx;
		font-weight: bold;
		text-align: center;
		color: #FFFFFF;
		line-height: 74upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

	}

	.free-box-b {
		width: 30upx;
		height: 30upx;
		position: absolute;
		top: 13upx;
		right: -12upx;
	}

	.free-box-b image {
		width: 100%;
		height: 100%;
	}

	.free-box-b2 {
		width: 138upx;
		height: 318upx;
		position: absolute;
		top: 86upx;
		right: -118upx;
	}

	.free-box-b2 image {
		width: 100%;
		height: 100%;
	}

	.free-box-c {
		width: 92%;
		position: relative;
		background-color: #FFFFFF;
		margin: -40upx auto 0;
		z-index: -1;
		border: 2upx solid #FFD800;
		border-radius: 20upx;
		padding-bottom: 46upx;
	}

	.free-box-item {
		padding: 0 38upx;
		/* margin: 56upx auto 0; */
	}

	.free-box-img {
		width: 282upx;
		height: 282upx;
		border: 2upx solid #FFD800;
		border-radius: 20upx;
		margin: 48upx auto 36upx;
	}

	.free-box-img image {
		display: block;
		width: 202upx;
		height: 202upx;
		margin: 28upx auto 0;
	}

	.free-box-text2 {
		font-size: 40upx;
		color: #FF4747;
		font-weight: bold;
		text-align: center;
	}

	.free-box-text3 {
		font-size: 28upx;
		color: #2A2A2A;
		margin-top: 34upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.free-popup-close {
		display: flex;
		justify-content: space-between;
		margin-top: 42upx;
	}

	.free-popup-closeL {
		width: 228upx;
		height: 86upx;
		border: 2upx solid #FFFFFF;
		border-radius: 45upx;
		color: #FFFFFF;
		font-size: 30upx;
		text-align: center;
		font-weight: 600;
		line-height: 86upx;
	}

	.free-popup-closeR {
		width: 228upx;
		height: 86upx;
		border: 2upx solid #FFFFFF;
		background-color: #FF981E;
		border-radius: 45upx;
		color: #FFFFFF;
		text-align: center;
	}

	.free-popup-closeR .closeText1 {
		font-size: 40upx;
		font-weight: 500;
		line-height: 34upx;
		margin-top: 10upx;
	}

	.free-popup-closeR .closeText2 {
		font-size: 24upx;
		margin-top: 4upx;
		font-weight: 400;
	}

	.free-popup-closeR2 {
		width: 228upx;
		height: 86upx;
		border: 2upx solid #FFFFFF;
		background-color: #FF981E;
		border-radius: 45upx;
		color: #FFFFFF;
		text-align: center;
	}

	.free-popup-closeR2 .closeText1 {
		font-size: 40upx;
		font-weight: 500;
		line-height: 86upx;
	}

	/* .free-popup-close>image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	} */

	/* 免费试玩 end*/

	/* 盲盒抽奖 */
	.luckDraw-popup {
		width: 694upx;
		position: fixed;
		top: 11%;
		left: 4%;
		z-index: 2000;
	}

	.luckDraw-box {
		width: 80%;
		/* height: 568upx; */
		position: relative;
		margin: 0 auto 0;
	}

	.luckDraw-box-t {

		width: 220upx;
		height: 202upx;
		margin: -36upx auto 0;
		position: relative;
		z-index: 99;
	}

	.luckDraw-box-t image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}

	.luckDraw-box-b {
		width: 30upx;
		height: 30upx;
		position: absolute;
		top: 40upx;
		right: 0upx;
		/* z-index: 99999; */
	}

	.luckDraw-box-b image {
		width: 100%;
		height: 100%;
	}

	.luckDraw-box-c {
		width: 468upx;
		/* height: 620upx; */
		position: relative;
		background-color: #FFFFFF;
		margin: -140upx auto 0;
		/* z-index: -1; */
		border: 2upx solid #FFD800;
		border-radius: 20upx;
		padding-bottom: 25upx;
	}

	.luckDraw-box-item {
		padding: 0 38upx;
		/* margin: 56upx auto 0; */
	}

	.luckStepper {
		display: flex;
		width: 260upx;
		height: 60upx;
		margin: 30upx auto 30upx;
	}

	.luckAdd {

		width: 60upx;
		height: 60upx;
		line-height: 52upx;
		background-color: #FF981E;
		border-radius: 4upx;
		color: #FFFFFF;
		font-size: 60upx;
		font-weight: 40upx;
		text-align: center;
	}

	.luckInput {
		width: 140upx;
		height: 60upx;
		font-size: 30upx;
		text-align: center;
		color: #000000;
		line-height: 60upx;
	}

	.luckInput input {
		width: 140upx;
		height: 60upx;
		font-size: 30upx;
		text-align: center;
		color: #000000;
		line-height: 60upx;
	}

	.luckReduce {
		width: 60upx;
		height: 60upx;
		line-height: 52upx;
		border-radius: 4upx;
		font-size: 60upx;
		font-weight: 400upx;
		background-color: #D5D5D5;
		text-align: center;
		color: #FFFFFF;
	}

	.luckBtn {
		width: 232upx;
		height: 90upx;
		background-color: #FF981E;
		color: #FFFFFF;
		border-radius: 45upx;
		line-height: 90upx;
		font-size: 30upx;
		text-align: center;
		margin: 52upx auto 25upx;

	}

	.agreement {
		display: flex;
		/* justify-content: space-between; */
		margin: 0 auto 0;
	}

	.all-radio {
		/* width: 232upx; */
		display: flex;
		align-items: center;
		margin-left: 38upx;
	}

	.all-radio text:nth-child(1) {
		font-size: 22upx;
		color: #5B5B5B;
	}

	.radio {
		margin-bottom: -4upx;
		transform: scale(0.76)
	}

	.all-radio text {
		font-size: 22upx;
	}

	.agreementText {
		font-size: 22upx;
		color: #FF5E1E;
		line-height: 54upx;

	}

	.luckDraw-box-img {
		width: 282upx;
		height: 282upx;
		border: 2upx solid #FFD800;
		border-radius: 20upx;
		margin: 48upx auto 36upx;
	}

	.luckDraw-box-img image {
		display: block;
		width: 202upx;
		height: 202upx;
		margin: 28upx auto 0;
	}

	.luckDraw-box-text2 {
		font-size: 40upx;
		color: #373737;
		margin-top: 138upx;
		font-weight: bold;
		text-align: center;
	}

	.luckDraw-box-text3 {
		font-size: 30upx;
		color: #7F7F7F;
		margin-top: 24upx;
		text-align: center;
		/* overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical; */
	}

	.luckDraw-popup-close {
		display: flex;
		justify-content: space-between;
		margin-top: 42upx;
	}

	.luckDraw-popup-closeL {
		width: 332upx;
		height: 138upx;
		border-radius: 45upx;
		color: #FFFFFF;
		font-size: 50upx;
		font-family: YouSheBiaoTiHei;
		text-align: center;
		font-weight: 400;
		line-height: 120upx;
		position: relative;
		z-index: 99;
	}

	.luckDraw-popup-closeL image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		vertical-align: top;
		z-index: -1;
	}

	.luckDraw-popup-closeR {
		width: 332upx;
		height: 138upx;
		border-radius: 45upx;
		color: #FFFFFF;
		font-size: 50upx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
		text-align: center;
		line-height: 120upx;
		position: relative;
		z-index: 99;
	}

	.luckDraw-popup-closeR image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		vertical-align: top;
		z-index: -1;
	}

	.luckFooter {
		font-size: 22upx;
		color: #5B5B5B;
		text-align: center;
		margin-top: 42upx;
	}

	.luckFooter text {
		font-weight: Regular;
		color: #FF5E1E;
	}

	.luckFooter image {
		width: 24upx;
		height: 40upx;
		margin-left: 10upx;
		margin-top: -4upx;
		vertical-align: top;
	}

	/* .luckDraw-popup-close>image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	} */

	/* 盲盒抽奖 end*/

	/* 查看奖品 */
	.prize {
		width: 100%;
		height: 74%;
		position: fixed;
		position: relative;
		top: 26%;
		left: 0;
		z-index: 2000;
		background-color: #FFFFFF;
		overflow-y: auto;
	}

	.prize-title {
		font-size: 32upx;
		color: #000000;
		text-align: center;
		padding-top: 30upx;
	}

	.prize-head {
		width: 690upx;
		height: 148upx;
		display: flex;
		border-radius: 20upx;
		margin: 34upx auto 0;
		box-shadow: 0px 1px 14px 4px rgba(0, 0, 0, 0.1);
	}

	.prize-head-left {
		width: 170upx;
		height: 150upx;
		position: relative;
	}

	.prize-head-left image {
		width: 100%;
		height: 100%;
		vertical-align: top;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.prize-head-left view:nth-child(2) {
		font-size: 28upx;
		color: #D3B171;
		font-weight: 700;
		padding: 38upx 0 4upx 34upx;
		/* width: 66upx; */
	}

	.prize-head-left view:nth-child(3) {
		/* width: 66upx; */
		font-size: 28upx;
		color: #D3B171;
		font-weight: 700;
		padding: 0 0 0 34upx;
	}

	.prize-head-right {
		width: 520upx;
		display: flex;
		justify-content: space-around;
	}

	.prize-head-block {
		width: 30%;
	}

	.prize-head-block view:nth-child(1) {
		font-size: 40upx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
		line-height: 40upx;
		margin-top: 36upx;
	}

	.prize-head-block view:nth-child(2) {
		font-size: 32upx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
		line-height: 40upx;
		margin-top: 12upx;
	}

	.color1 {
		color: #FF3464;
	}

	.color2 {
		color: #5581FF;
	}

	.color3 {
		color: #C660EC;
	}

	.prize-main {
		margin-top: 40upx;
	}

	.prize-item {
		width: 690upx;
		height: 180upx;
		background-color: #F6F6F6;
		border-radius: 20upx;
		display: flex;
		padding: 10upx;
		margin: 0 auto 30upx;
		justify-content: space-between;
	}

	.prize-item-left {
		width: 160upx;
		height: 160upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
		position: relative;
	}

	.prize-item-left image {
		width: 100%;
		height: 100%;
		border-radius: 20upx;

	}

	.prize-item-label {
		position: absolute;
		top: 0;
		right: 0;
		font-size: 20upx;
		color: #FFFFFF;
		padding: 6upx 10upx;
		border-radius: 20upx;
		font-family: PingFang SC;
		font-weight: 500;
	}

	.back1 {
		background-color: #FF3464;
	}

	.back2 {
		background-color: #5581FF;
	}

	.back3 {
		background-color: #C660EC;
	}

	.prize-item-right {
		width: 480upx;
	}

	.prize-item-title {
		font-size: 30upx;
		color: #2A2A2A;
		line-height: 45upx;
		height: 80upx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.prize-item-text {
		font-size: 34upx;
		color: #FF3464;
		margin-top: 26upx;
		font-weight: bold;
	}

	.prizeClone {
		position: absolute;
		top: 30upx;
		right: 30upx;
		width: 30upx;
		height: 30upx;
	}

	.prizeClone image {
		width: 100%;
		height: 100%;
	}

	/* 查看奖品 end*/
	/* 支付方式 */
	.paymentMethod {
		width: 100%;
		height: 74%;
		position: fixed;
		position: relative;
		top: 26%;
		left: 0;
		z-index: 2000;
		background-color: #FFFFFF;

	}

	.paymentMethod-title {
		font-size: 30upx;
		color: #404040;
		text-align: center;
		padding-top: 30upx;
	}

	.paymentMethodClone {
		position: absolute;
		top: 34upx;
		right: 34upx;
		width: 30upx;
		height: 30upx;
	}

	.paymentMethodClone image {
		width: 100%;
		height: 100%;
	}

	.bShier-item {
		width: 690upx;
		margin: 52upx auto 30upx;
		background-color: #F6F6F6;
		border-radius: 20upx;
		/* padding: 16upx; */
		overflow: hidden;
	}

	.bShier-item-list {
		display: flex;
		justify-content: space-between;
		padding: 30upx 20upx;
		/* margin: 20upx 0 0 0; */

	}

	.bShier-color {
		border-bottom: 2upx solid #F5F5F5;
	}

	.bShier-item-icon {}

	.bShier-item-icon>image {
		width: 48upx;
		height: 40upx;
	}

	.bShier-item-icon>text {
		display: inline-block;
		font-size: 32upx;
		color: #333333;
		font-weight: Normal;
		vertical-align: top;
		line-height: 40upx;
		margin-left: 16upx;
	}

	.bShier-careful {
		font-size: 20upx;
		color: #DB0B0B;
	}

	/* 支付方式 end*/
	/* 盒子动效 */
	.dynamicEffect {
		width: 100%;
		/* height: 74%; */
		position: fixed;
		/* position: relative; */
		/* top: 24%; */
		left: 0;
		bottom: 520upx;
		z-index: 2000;
		/* background-color: #FFFFFF; */
	}

	.dynamicImg {
		width: 414rpx;
		height: 384rpx;
		position: relative;
		margin: 0 auto 0;
		/* padding-top: 30upx; */
	}

	.dynamicImg image {
		width: 100%;
		height: 100%;
		animation: blindbox 4s linear infinite;
	}

	/* 盒子动效 end*/
	@keyframes hand {
		0% {
			transform: scale(1) translate(0);
		}

		50% {
			transform: scale(.9) translate(-10%, -10%);
		}

		100% {
			transform: scale(1) translate(0);
		}
	}

	@keyframes blindbox {
		0% {
			transform: translate(0) rotate(5deg);
		}

		3% {
			transform: translate(0) rotate(-5deg);
		}

		6% {
			transform: translate(0) rotate(5deg);
		}

		9% {
			transform: translate(0) rotate(-5deg);
		}

		12% {
			transform: translate(0) rotate(5deg);
		}

		15% {
			transform: translate(0) rotate(0);
		}

		100% {
			transform: translate(0) rotate(0);
		}
	}

	@keyframes bubble-left {
		0% {
			transform: translate(calc(50vw - 50%)) scale(1);
			opacity: 1;
		}

		5%,
		6% {
			transform: translate(calc(35vw - 50%), -130rpx) scale(1.3);
			opacity: 1;
		}

		100% {
			transform: translate(calc(20vw - 50%), calc(380rpx - 66vh)) scale(1.8);
			opacity: 0;
		}
	}

	@keyframes bubble-center {
		0% {
			transform: translate(calc(50vw - 50%)) scale(1);
			opacity: 1;
		}

		5%,
		6% {
			transform: translate(calc(50vw - 50%), -150rpx) scale(1.3);
			opacity: 1;
		}

		100% {
			transform: translate(calc(50vw - 50%), calc(380rpx - 70vh)) scale(1.8);
			opacity: 0;
		}
	}

	@keyframes bubble-right {
		0% {
			transform: translate(calc(50vw - 50%)) scale(1);
			opacity: 1;
		}

		5%,
		6% {
			transform: translate(calc(65vw - 50%), -130rpx) scale(1.3);
			opacity: 1;
		}

		100% {
			transform: translate(calc(80vw - 50%), calc(380rpx - 66vh)) scale(1.8);
			opacity: 0;
		}
	}
</style>
