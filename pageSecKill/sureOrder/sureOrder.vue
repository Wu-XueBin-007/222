<template>
	<view style="padding-bottom: 118upx;">
		<seckill-nav title="确认订单"></seckill-nav>
		<view class="addressWrap" @click="onSelectAddress">
			<image src="../../static/icon/seckill_address.png" class="addressWrapL"></image>
			<view class="addressWrapC" v-if="info.address">
				<view class="addressWrapCT">
					<view class="addressWrapCTL">{{info.address.name}}</view>
					<view class="addressWrapCTR">{{info.address.phone}}</view>
				</view>
				<view class="addressWrapCB">{{info.address.region.province+info.address.region.city+info.address.region.region+info.address.detail}}</view>
			</view>
			<view class="addressWrapC" v-else>请选择收货地址</view>
			<image src="../../static/icon/more_gray.png" class="addressWrapR"></image>
		</view>
		<view class="orderMsg">
			<view class="orderMsgHead">
				<!-- <image src="../../static/home/order_icon.png"></image> -->
				<text>订单信息</text>
			</view>
			<view class="orderMsgCon" v-if="info.goodsList.length>0" v-for="(item,index) in info.goodsList" :key="index">
				<image :src="item.goods_image" class="orderMsgConL"></image>
				<view class="orderMsgConR">
					<view class="orderMsgConRT">{{item.goods_name}}</view>
					<view class="orderMsgConRB">
						<view class="orderMsgConRBT">数量：{{item.total_num}}</view>
						<view class="orderMsgConRBB">秒价：<text>￥{{item.skuInfo.seckill_price}}</text></view>
					</view>
				</view>
			</view>
			<view class="sendWay">
				<view class="sendWayL">配送费：</view>
				<view class="sendWayR">+{{info.expressPrice?info.expressPrice:0}}</view>
			</view>
			<view class="sendWay" style="margin-top: 0;">
				<view class="sendWayL">发货时间：</view>
				<view class="sendWayR">{{delivery_text?delivery_text:"48小时内安排发货"}}</view>
			</view>
			<view class="priceBox">
				实付款：<text>￥{{info.orderPayPrice?info.orderPayPrice:0}}</text>
			</view>
		</view>
		<!-- <view class="payWay">
			<view class="payWayItem" @click="changeNav" data-index="0">
				<view class="payWayItemL">
					<image src="../../static/home/wx_icon.png" mode="widthFix"></image>
					<view>微信支付</view>
				</view>
				<image src="../../static/home/select_act.png" class="payWayItemR" v-if="payIndex==0"></image>
				<image src="../../static/home/select.png" class="payWayItemR" v-else></image>
			</view>
			<view class="payWayItem" @click="changeNav" data-index="1">
				<view class="payWayItemL">
					<image src="../../static/home/wallet_icon.png" mode="widthFix"></image>
					<view>我的钱包支付<text>（可用余额：{{userInfo.balance ? userInfo.balance : 0}}）</text></view>
				</view>
				<image src="../../static/home/select_act.png" class="payWayItemR" v-if="payIndex==1"></image>
				<image src="../../static/home/select.png" class="payWayItemR" v-else></image>
			</view>
		</view> -->
		<!-- <view class="tips">不支持取消拼团</view> -->
		<view class="submit" @click="submit">确认支付</view>
	</view>
</template>

<script>
	import seckillNav from "@/components/seckillNav.vue";
	import * as addressApi from "@/api/address.js";
	import * as seckillApi from "@/api/seckill/seckill.js";
	import * as UserApi from "@/api/user.js";
	import {
		wxPayment,zfbPayment
	} from '@/utils/app'
	const App = getApp();
	export default {
		data() {
			return {
				info:{},
				payIndex:0,
				addressObj:{},
				groupid:0,
				orderid:0,
				reqFlag:true,
				userInfo:{},
				options:{},
				delivery_text:""
			}
		},
		components:{seckillNav},
		onLoad(options) {
			this.options = options
			// if(options.orderid){
			// 	this.orderid = options.orderid;
			// 	this.getDetail();
			// }else{
			// 	this.info = App.$vm.globalData.goodsData;
			// }
			
		},
		onShow() {
			this.getUserInfo();
			this.getDetail();
		},
		methods: {
			// 初始化数据
			initData({ deliver_text,order }) {
			  this.info = order;
			  this.delivery_text = deliver_text;
			  // 显示错误信息
			  if (order.hasError) {
			    this.$toast(order.errorMsg)
			  }
			},
			getRequestParam() {
			  const { options } = this
			  // 结算模式的固定参数
			  const modeParam = {}
			  // 结算模式: 立即购买
			  if (options.mode === 'buyNow') {
			    modeParam.seckillId = options.secid
			    modeParam.goodsNum = options.goodsNum
			    modeParam.seckillSkuId = options.goodsSkuId
				modeParam.timeId = options.timeid;
			  }
			  return { ...modeParam }
			},
			// 获取会员信息
			getUserInfo() {
			  UserApi.info()
			    .then(result => {
			      this.userInfo = result.data.userInfo;
			    })
			},
			getDetail(){
				seckillApi.info(this.options.mode, this.getRequestParam())
				  .then(result => {
				    this.initData(result.data)
				  })
				  .catch(err => err)
			},
			onSelectAddress() {
			  this.$navTo('pages/address/index', { from: 'checkout' })
			},
			changeNav(e){
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				this.payIndex = index;
			},
			getAddress(){
				addressApi.defaults()
					.then(res=>{
						//console.log(res)
						if(res.data.detail){
							this.addressObj = res.data.detail;
						}
						
					})
			},
			submit(){
				if(!this.info.address){
					this.$toast("请先选择收货地址")
					return false;
				}
				seckillApi.add(this.options.mode, this.getRequestParam())
				  .then(result => this.onSubmitCallback(result))
				  .catch(err => {
				    if (err.result) {
				      const errData = err.result.data
				      if (errData.is_created) {
				        this.navToMyOrder(errData.order_id)
				        return false
				      }
				    }
				  })
			},
			onSubmitCallback(result) {
			//console.log(result)
			this.navToMyOrder(result.data.order_id)
			},
			navToMyOrder(order_id) {
			  setTimeout(() => {
			    this.$navTo('pages/cashier/index',{order_id})
			  }, 1000)
			},
		}
	}
</script>

<style scoped>
	.tips{
		font-size: 28upx;
		line-height: 28upx;
		color: #E60012;
		margin-top: 36upx;
		text-align: center;
	}
	.submit{
		width: 100%;
		height: 98upx;
		line-height: 98upx;
		text-align: center;
		background: #DD1010;
		position: fixed;
		left: 0;
		bottom: 0;
		color: white;
		font-size: 34upx;
		font-weight: bold;
	}
	
	
	.payWay{
		width: 682upx;
		margin: 30upx auto 0;
		padding: 24upx 28upx;
		background: white;
		box-sizing: border-box;
		box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5);
		border-radius: 12upx;
	}
	.payWayItem{
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* margin-top: 28upx; */
		padding: 20upx 0;
	}
	.payWayItem:nth-child(1){
		margin-top: 0;
	}
	.payWayItemL{
		display: flex;
		align-items: center;
	}
	.payWayItemL>image{
		width: 38upx;
		margin-right: 24upx;
	}
	.payWayItemL>view{
		font-size: 28upx;
		line-height: 28upx;
		color: #595656;
	}
	.payWayItemL>view>text{
		color: #999999;
		font-size: 28upx;
		line-height: 28upx;
	}
	.payWayItemR{
		width: 32upx;
		height: 32upx;
	}
	
	
	
	.sendWay{
		padding: 20upx 0;
		margin-top: 20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 2upx solid rgba(207, 207, 207, .2);
	}
	.sendWayL,.sendWayR{
		font-size: 24upx;
		line-height: 24upx;
		color: #999999;
	}
	.priceBox{
		text-align: right;
		font-size: 28upx;
		line-height: 28upx;
		color: #999999;
		border-top: 2upx solid rgba(207, 207, 207, .2);
		padding: 20upx 0 0;
	}
	.priceBox>text{
		font-size: 32upx;
		line-height: 32upx;
		color: #E60012;
		font-weight: bold;
	}
	
	
	.orderMsg{
		width: 682upx;
		margin: 30upx auto 0;
		padding: 24upx 28upx;
		background: white;
		box-sizing: border-box;
		box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5);
		border-radius: 12upx;
	}
	.orderMsgHead{
		display: flex;
		align-items: center;
	}
	.orderMsgHead>image{
		width: 28upx;
		height: 28upx;
		margin-right: 22upx;
	}
	.orderMsgHead>text{
		font-size: 28upx;
		line-height: 28upx;
		color: 24upx;
	}
	.orderMsgCon{
		margin-top: 20upx;
		display: flex;
		align-items: center;
	}
	.orderMsgConL{
		width: 140upx;
		height: 140upx;
		margin-right: 28upx;
	}
	.orderMsgConR{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 140upx;
		width: calc(100% - 168rpx);
	}
	.orderMsgConRT{
		font-size: 28upx;
		line-height: 36upx;
		color: #595656;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.orderMsgConRB{
		display: flex;
		flex-direction: column;
	}
	.orderMsgConRBT,.orderMsgConRBB{
		font-size: 26upx;
		line-height: 26upx;
		color: #595656;
	}
	.orderMsgConRBB{
		margin-top: 16upx;
	}
	.orderMsgConRBB>text{
		color: #FF5F60;
		font-size: 26upx;
		line-height: 26upx;
	}
	
	
	.addressWrap{
		width: 682upx;
		margin: 30upx auto 0;
		padding: 24upx 28upx;
		background: white;
		box-sizing: border-box;
		box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5);
		border-radius: 12upx;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
	}
	.addressWrapL{
		width: 36upx;
		height: 44upx;
		margin-right: 26upx;
	}
	.addressWrapC{
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: calc(100% - 102upx);
		margin-right: 30upx;
	}
	.addressWrapCT{
		display: flex;
		align-items: center;
	}
	.addressWrapCTL{
		font-size: 24upx;
		line-height: 24upx;
		font-family: PingFang;
		font-weight: 400;
		color: #595656;
		margin-right: 30upx;
	}
	.addressWrapCTR{
		font-size: 24upx;
		line-height: 24upx;
		font-family: PingFang;
		font-weight: 400;
		color: #595656;
	}
	.addressWrapCB{
		font-size: 24upx;
		line-height: 24upx;
		font-family: PingFang;
		font-weight: 400;
		color: #595656;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-top: 16upx;
	}
	.addressWrapR{
		width: 10upx;
		height: 18upx;
	}
</style>
