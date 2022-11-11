<template>
	<view style="padding-bottom: 118upx;">
		<!-- <nav-head title="确认订单"></nav-head> -->
		<seckill-nav title="订单结算" backGround="rage(0,0,0,1)" :fontSize="30" backL="transparent" color="#000000"></seckill-nav>
		<view class="addressWrap" @click="onSelectAddress">
			<image src="../../static/home/address_icon.png" class="addressWrapL"></image>
			<view class="addressWrapC" v-if="addressObj.address_id">
				
				<view class="addressWrapCB">{{addressObj.region.province+addressObj.region.city+addressObj.region.region+addressObj.detail}}</view>
				<view class="addressWrapCT">
					<view class="addressWrapCTL">{{addressObj.name}}</view>
					<view class="addressWrapCTR">{{addressObj.phone}}</view>
				</view>
			</view>
			<view class="addressWrapC" v-else>请选择收货地址</view>
			<image src="../../static/icon/more_gray.png" class="addressWrapR"></image>
		</view>
		<view class="orderMsg">
			<!-- <view class="orderMsgHead">
				<image src="../../static/home/order_icon.png"></image>
				<text>订单信息</text>
			</view> -->
			<view class="orderMsgCon" v-if="info.order_info">
				<image :src="info.order_info.goods.goods_image" class="orderMsgConL"></image>
				<view class="orderMsgConR">
					<view class="orderMsgConRM">
						<view class="orderMsgConRT">{{info.order_info.goods.goods_name}}</view>
						<view class="orderMsgConRBB"><text>￥{{info.order_info.goods.goods_price}}</text></view>
					</view>
					
					<view class="orderMsgConRB">
						<view class="orderMsgConRBT">x1</view>
						
					</view>
				</view>
			</view>
			
			<view class="priceBox">
				共1件商品,合计<text>：￥{{info.order_info?info.order_info.goods.goods_price:0}}</text>
			</view>
		</view>
		<view class="distribution">
			<view class="sendWay">
				<view class="sendWayL">配送方式：</view>
				<view class="sendWayR">免运费</view>
			</view>
			<view class="sendWay" style="margin-top: 0;">
				<view class="sendWayL">配送时间：</view>
				<view class="sendWayR">{{info.deliver_text?info.deliver_text:""}}</view>
			</view>
			<view class="sendWay" style="margin-top: 0;">
				<view class="sendWayL">
					拼团订单暂不支持取消
				</view>
				
			</view>
		</view>
		<view class="payWay">
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
		</view>
		<!-- <view class="tips">不支持取消拼团</view> -->
		<view class="sureFooter">
			<view class="surePrice">
				<view class="surePriceL">
					实付款:
				</view>
				
				<view class="surePriceR">
					￥<text>{{info.order_info?info.order_info.goods.goods_price:0}}</text>
				</view>
			</view>
			<view class="submit" @click="submit">确认支付</view>
		</view>
		
	</view>
</template>

<script>
	import navHead from "@/components/navHead.vue";
	import seckillNav from "@/components/seckillNav.vue";
	import * as addressApi from "@/api/address.js";
	import * as collageApi from "@/api/collage/collage.js";
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
				userInfo:{}
			}
		},
		components:{seckillNav,navHead},
		onLoad(options) {
			if(options.orderid){
				this.orderid = options.orderid;
				this.getDetail();
			}else{
				this.info = App.$vm.globalData.goodsData;
			}
			this.getUserInfo();
		},
		onShow() {
			this.getAddress();
		},
		methods: {
			// 获取会员信息
			getUserInfo() {
			  UserApi.info()
			    .then(result => {
			      this.userInfo = result.data.userInfo;
			    })
			},
			getDetail(){
				collageApi.info({order_no:this.orderid}).then(res=>{
					console.log(res)
					this.info = res.data;
				})
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
				if(!this.addressObj.address_id){
					this.$toast("请先选择收货地址")
					return false;
				}
				if(this.payIndex==1){
					uni.showModal({
						content:"确认支付",
						success:res=>{
							if(res.confirm){
								let obj = {};
								obj.order_no = this.orderid;
								obj.address_id = this.addressObj.address_id;
								if(this.payIndex==0){
									obj.pay_type = 20;
								}else if(this.payIndex==1){
									obj.pay_type = 10;
								}
								this.reqFlag = false;
								collageApi.pay(obj).then(res=>{
									console.log(res)
									if(res.data.pay_type == 10){
										this.$success("支付成功");
										setTimeout(() => {
											this.navToMyOrder()
										}, 2500)
									}else if(res.data.pay_type == 20){
										res.data.payment.timeStamp = res.data.payment.timeStamp.toString();
										wxPayment(res.data.payment)
											.then(() => {
												this.$success('支付成功')
												setTimeout(() => {
													this.navToMyOrder()
												}, 2500)
											})
											.catch(err => {
												console.log(err)
												this.reqFlag = true
												this.$error('订单未支付')
											})
											.finally(() => {
												
											})
									}
								})
							}
						}
					})
				}else{
					let obj = {};
					obj.order_no = this.orderid;
					obj.address_id = this.addressObj.address_id;
					if(this.payIndex==0){
						obj.pay_type = 20;
					}else if(this.payIndex==1){
						obj.pay_type = 10;
					}
					this.reqFlag = false;
					collageApi.pay(obj).then(res=>{
						console.log(res)
						if(res.data.pay_type == 10){
							this.$success("支付成功");
							setTimeout(() => {
								this.navToMyOrder()
							}, 1500)
						}else if(res.data.pay_type == 20){
							res.data.payment.timeStamp = res.data.payment.timeStamp.toString();
							wxPayment(res.data.payment)
								.then(() => {
									this.$success('支付成功')
									setTimeout(() => {
										this.navToMyOrder()
									}, 1500)
								})
								.catch(err => {
									console.log(err)
									this.reqFlag = true
									this.$error('订单未支付')
								})
								.finally(() => {
									
								})
						}
					})
				}
			},
			
			navToMyOrder(){
				// this.$navTo('pages/myCollage/myCollage');
				uni.redirectTo({
					url:"/pageHome/myCollage/myCollage"
				})
			}
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
	
	.sureFooter{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 98upx;
		padding: 10upx 24upx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: flex-end;
	}
	.surePrice{
		display: flex;
		align-items: center;
		margin-right: 24upx;
	}
	.surePriceL{
		font-size: 30upx;
		color: #333333;
		font-weight: bold;
		
	}
	.surePriceR{
		font-size: 30upx;
		font-weight: bold;
		color: #EF343D  ;
	}
	.surePriceR text{
		font-size: 44upx;
		color: #EF343D  ;
	}
	.submit{
		width: 244upx;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		background: #EF343D  ;
		border-radius: 40upx;
		color: white;
		font-size: 34upx;
		font-weight: bold;
	}
	.distribution{
		width: 702upx;
		margin: 30upx auto 0;
		padding: 24upx 24upx;
		background: white;
		box-sizing: border-box;
		/* box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5); */
		border-radius: 20upx;
	}
	.payWay{
		width: 702upx;
		margin: 30upx auto 0;
		padding: 24upx 28upx;
		background: white;
		box-sizing: border-box;
		/* box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5); */
		border-radius: 20upx;
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
		width: 60upx;
		margin-right: 12upx;
	}
	.payWayItemL>view{
		font-size: 30upx;
		line-height: 30upx;
		color: #000000;
		font-weight: bold;
	}
	.payWayItemL>view>text{
		color: #666666;
		font-size: 28upx;
		line-height: 28upx;
		font-weight: 500;
	}
	.payWayItemR{
		width: 36upx;
		height: 36upx;
	}
	
	
	
	.sendWay{
		padding: 24upx 0;
		margin-top: 20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* border-top: 2upx solid #e5e5e5; */
	}
	.sendWayL,.sendWayR{
		font-size: 28upx;
		line-height: 28upx;
		color: #333333;
		font-weight: bold;
	}
	.priceBox{
		text-align: right;
		font-size: 28upx;
		line-height: 28upx;
		color: #333333;
		font-weight: bold;
		/* border-top: 2upx solid #e5e5e5; */
		padding: 40upx 0 0;
	}
	.priceBox>text{
		font-size: 28upx;
		line-height: 28upx;
		color: #E60012;
	}
	
	
	.orderMsg{
		width: 702upx;
		margin: 30upx auto 0;
		padding: 24upx 24upx;
		background: white;
		box-sizing: border-box;
		/* box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5); */
		border-radius: 20upx;
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
		/* margin-top: 20upx; */
		display: flex;
		align-items: center;
	}
	.orderMsgConL{
		width: 180upx;
		height: 180upx;
		margin-right: 24upx;
		border-radius: 20upx;
	}
	.orderMsgConR{
		display: flex;
		flex-direction: column;
		/* justify-content: space-between; */
		height: 140upx;
		width: 68%;
	}
	.orderMsgConRM{
		display: flex;
		justify-content: space-between;
		height: 82upx;
	}
	.orderMsgConRT{
		font-size: 28upx;
		font-weight: bold;
		line-height: 36upx;
		color: #333333;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2; //行数需设置
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.orderMsgConRB{
		display: flex;
		justify-content: flex-end;
		color: #666666;
		font-size: 28upx;
		margin-top: 20upx;
	}
	.orderMsgConRBT{
		font-size: 26upx;
		line-height: 26upx;
		color: #333333;
	}
	.orderMsgConRBB{
		 /* margin-top: 8upx; */
	}
	.orderMsgConRBB>text{
		color: #333333;
		font-size: 28upx;
		line-height: 26upx;
		font-weight: bold;
	}
	
	
	.addressWrap{
		width: 702upx;
		margin: 30upx auto 0;
		padding: 24upx 24upx;
		background: white;
		box-sizing: border-box;
		/* box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5); */
		border-radius: 20upx;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
	}
	.addressWrapL{
		width: 40upx;
		height: 40upx;
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
		margin-top: 16upx;
	}
	.addressWrapCTL{
		font-size: 26upx;
		line-height: 24upx;
		font-family: PingFang;
		font-weight: 400;
		color: #666666;
		margin-right: 30upx;
	}
	.addressWrapCTR{
		font-size: 26upx;
		line-height: 24upx;
		font-family: PingFang;
		font-weight: 400;
		color: #666666;
	}
	.addressWrapCB{
		font-size: 30upx;
		/* line-height: 24upx; */
		font-family: PingFang;
		font-weight: bold;
		color: #000000;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		
	}
	.addressWrapR{
		width: 10upx;
		height: 18upx;
	}
</style>
