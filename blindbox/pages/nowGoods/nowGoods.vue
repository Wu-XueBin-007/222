<template>
	<view>
		<view class="All-goods">
            <view v-for="(item,index) in category" :key="index" :class="['possess',item.id==isActive?'possessMore':'']" @click="getActive(item.id)">{{item.name}}</view>			
		</view>
		<view class="goods-infos">
			<view class="goods-infos1" v-for="(item,index) in myrecordList" :key="index">
				<view class="goods-left" v-if="item.goods_sku.images">
					<image :src="item.goods_sku.images[0].file.preview_url"></image>
				</view>
				<view class="goods-right">
					<view class="goods-right-1">【盲盒】{{item.blindbox.name}}</view>
					<view class="goods-right-2">{{item.goods_sku.goods_name}}</view>
					<view class="goods-right-3">
						<view class="goods-right-01">{{item.create_time}}</view>
						<view class="goods-right-02" v-if="isActive==1" @click="goodsNow" :data-index="index" :data-id="item.id">立即提货</view>
						<view class="goods-right-wait" v-if="isActive==2&&item.order.delivery_status==10">待发货</view>
						<view class="goods-right-wait" v-if="isActive==2&&item.order.delivery_status==20">已发货</view>
					</view>
				</view>
			</view>
			<view style="padding-top: 100upx;" v-if="myrecordList.length==0">
				<u-empty text="暂无记录"></u-empty>
			</view>
			
		<u-popup v-model="showAgree" v-if="pickupGoods.goods" mode="bottom"  @close="nClose" @open="open">
			<view style="max-height: 1000upx;">
				<view style="box-sizing: border-box;padding-bottom: 10rpx;">
					<view class="top">
						<view class="top-comfire">
							确认订单
						</view>
						<view class="top-img" @click="nClose">
							<image src="../../static/icon_clone3.png" class="top-img-left"></image>
						</view>
					</view>
					<view class="goods-infos-1">
						<view class="goods-left-1">
							<image :src="pickupGoods.goods[0].goods_image"></image>
						</view>
						<view class="goods-right-all">
							<view class="goods-right-title">{{pickupGoods.goods[0].goods_name}}</view>
							<view class="goods-right-price">
								<text>￥{{pickupGoods.goods[0].goods_price}}</text>/个
							</view>
						</view>
					</view>
					<view class="detail">
						<view class="detail-top" @click="addRrea">
							<view class="addressWrapC" v-if="addressObj.address_id">
								<view class="addressWrapCT">
									<view class="addressWrapCTL">{{addressObj.name}}</view>
									<view class="addressWrapCTR">{{addressObj.phone}}</view>
								</view>
								<view class="addressWrapCB">{{addressObj.region.province+addressObj.region.city+addressObj.region.region+addressObj.detail}}</view>
							</view>
							<view class="changeAdress" v-else>请添加收货地址</view>
							<view class="more"><image src="../../static/icon_right.png" class="moreImg"></image></view>
						</view>
						<!-- <view class="detail-bottom" v-if="active">
							<view class="detail-all">
								{{name}}
							</view>
							<view class="detail-area">
								{{area}}
							</view>
						</view> -->
					</view>
					<view class="freight">
						<view class="freight-left">运费</view>
						<view class="freight-right">{{pickupGoods.express_price}}</view>
					</view>
					<view class="nShier-item">
						<!-- #ifdef APP-PLUS -->
						<!-- <view class="nShier-item-list nShier-color" @click="btn_payTa(PayTypeEnum.ZHIFUBAO.value)">
							<view class="nShier-item-icon">
								<image src="../../../static/icon/icon_zfbzf.png" mode=""></image>
								<text>{{PayTypeEnum.ZHIFUBAO.name}}</text>
							</view>
							<view class="coupons-item-chbox">
								<checkbox class="checks1-h5" :checked="paymentType==PayTypeEnum.ZHIFUBAO.value"></checkbox>
							</view>
					
						</view> -->
						<!-- #endif -->
						<view class="nShier-item-list nShier-color" @click="btn_payTa(PayTypeEnum.WECHAT.value)">
							<view class="nShier-item-icon">
								<image src="../../../static/icon/icon_wxzf.png" mode=""></image>
								<text>{{PayTypeEnum.WECHAT.name}}</text>
							</view>
							<view class="coupons-item-chbox">
								<checkbox class="checks1-h5" :checked="paymentType==PayTypeEnum.WECHAT.value"></checkbox>
							</view>
						</view>
						<view class="nShier-item-list" @click="btn_payTa(PayTypeEnum.BALANCE.value)">
							<view class="nShier-item-icon" style="display: flex;align-items: center;">
								<image src="../../../static/icon/icon_ye.png" mode="widthFix"></image>
								<text>{{PayTypeEnum.BALANCE.name}}（可用余额：{{userInfo.balance ? userInfo.balance : 0}}）</text>
							</view>
							<view class="coupons-item-chbox">
								<checkbox class="checks1-h5" :checked="paymentType==PayTypeEnum.BALANCE.value"></checkbox>
							</view>
						</view>
					</view>
					<view class="comfirm">
						<view class="comfirm-1" @click="submit()">
							确认提货
						</view>
					</view>
				</view>
			</view>
			
		</u-popup>
	</view>
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
		wxPayment,zfbPayment
	} from '@/utils/app'
	import * as boxApi from "@/api/blindbox/index.js";
	import * as addressApi from "@/api/address.js";
	const App = getApp();
	export default {
		data() {
			return {
				 possess:0,
                 showAgree:false,
				 isActive:1,
				 category:[
					 {
						 id:1,
						 name:"现有商品",
					 },
					 {
						 id:2,
						 name:"已提货",
					 }
				 ],
				 active:false,
				 name:'',
				 area:'',
				 reqFlag:true,
				 paymentType: 20,
				 userInfo:{},
				 PayTypeEnum,
				 myrecordList:[],
				 bIndex:0,
				 addressObj:{},
				 pickupGoods:{},
				 record_id:-1,
				 page:1,
				 limit:15,
				 bottomFlag:true,
				 topFlag:true,
			}
		},
		onLoad(){
			// this.init();
			
		},
		onShow() {
			this.getAddress();
			this.getUserInfo();
			this.init();
			if(this.record_id!=-1){
				this.pickup();
			}
		},
		onPullDownRefresh() {
			// 下拉
			if(!this.topFlag){
				return false;
			}
			this.bottomFlag = true;
			this.page = 1;
			this.topFlag = false;
			this.init(true);
		},
		onReachBottom() {
			// 触底
			if(!this.bottomFlag){
				return false;
			}
			this.page = this.page + 1;
			this.bottomFlag = false;
			this.status = "loading";
			this.init();
		},
		methods: {
          init(flag){
			  var _that = this;
			  var obj={};
			  obj.type=this.isActive;
			  obj.page=this.page;
			  obj.limit=this.limit;
			  boxApi.recordList(obj).then(res=>{
			  	console.log(res)
			  	if(res.status==200){
					// this.myrecordList=res.data.record_list.data;
					if(flag){
						this.topFlag = true;
						this.bottomFlag = true;
						uni.stopPullDownRefresh()
					}
					if(Math.ceil(res.data.record_list.total/_that.limit)!=this.page&&res.data.record_list.last_page>0){
						this.bottomFlag = true;
						this.status = "loadmore";
					}else{
						this.status = "normal";
					}
					if(this.page != 1){
						this.myrecordList = this.myrecordList.concat(res.data.record_list.data);
						console.log(this.myrecordList,11)
					}else{
						this.myrecordList = res.data.record_list.data;
						console.log(this.myrecordList,11)
					}
			  		
			  	}
			  })
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
		  // 获取会员信息
		  getUserInfo() {
		    UserApi.info()
		      .then(result => {
		        this.userInfo = result.data.userInfo;
		      })
		  },
		  btn_payTa(type){
			
			this.paymentType=type;
		  },
		  pickup(){
			  var obj={};
			  obj.record_id=this.record_id;
			  boxApi.getpick_up_goods(obj).then(res=>{
			  	console.log(res)
			  	if(res.status==200){
					this.pickupGoods=res.data.order
			  		// if(!res.data["list"]){
			  		// }else{
			  		// 	this.prizeList=res.data.list;
			  		// }
			  		
			  	}
			  })
		  },
		  submit(){
			  console.log(111)
			if(!this.addressObj.address_id){
				this.$toast("请先选择收货地址")
				return false;
			}
			uni.showModal({
				content:"确认支付",
				success:res=>{
					if(res.confirm){
						var obj={};
						obj.record_id=this.record_id;
						obj.pay_type=this.paymentType;
						boxApi.pick_up_goods(obj).then(res=>{
							console.log(res)
							if(res.status==200){
								if(res.data.pay_type == 10){
									this.$success("支付成功");
									
									setTimeout(() => {
										this.showAgree = false;
										this.init();
										// this.selectPrize(res.data.order_id)
									}, 1500)
								}else if(res.data.pay_type == 20){
									res.data.payment.timeStamp = res.data.payment.timeStamp.toString();
									wxPayment(res.data.payment)
										.then(() => {
											this.$success('支付成功')
											setTimeout(() => {
												this.showAgree = false;
												this.init();
												// this.selectPrize(res.data.order_id)
											}, 1500)
										})
										.catch(err => {
											console.log(err)
											this.reqFlag = true
											this.$error('未支付')
										})
										.finally(() => {
											
										})
								}
								
							}
						})
					}
				}
			})
			
		  },
		   //立即提货
		   goodsNow(e){
			   this.showAgree = true;
			   let index = e.target.dataset.index || e.currentTarget.dataset.index;
			   let id = e.target.dataset.id || e.currentTarget.dataset.id;
			   this.bIndex=index;
			   this.record_id=id
			   this.pickup()
		   },
		   //添加收获地址
		   addRrea(){
			    this.$navTo('pages/address/index', { from: 'checkout' })
		   },
		   nClose(e){
			   this.showAgree = false;
			   return this.showAgree;
		   },
		   getActive(type){
			   console.log(type,11)
			   this.isActive=type;
			   this.page = 1;
			   this.init()
		   },
		   open(){
			  
		   },
		   change(index){
			   console.log(index)
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
	.comfirm{
		  background-color: #1B1B1B;
		  width: 474rpx;
		  height: 90rpx;
		  line-height: 90rpx;
		  text-align: center;
		  margin: 25px auto 0 auto;
		  border-radius: 45rpx;
	 }
	 .comfirm-1{
		  color: #FFFFFF;
		  font-size: 30rpx;
		  font-weight: bold;
		  
	 }
	 .freight{
		  width: 690rpx;
		  height: 87rpx;
		  margin: 30rpx auto 0 auto;
		  display: flex;
		  flex-direction: row;
		  justify-content: flex-start;
		  line-height: 87rpx;
		  background-color: #F6F6F6;
		  border-radius: 10upx;
	 }
	 .freight-left{
		  margin: 0 0 0 20rpx;
		  font-size: 30rpx;
		  font-weight: 500;
	 }
	 .freight-right{
		  margin: 0 20rpx 0 508rpx;
		  font-size: 30rpx;
		  color: #5F5F5F;
	 }
	 .detail{
		  width: 690rpx;
		  /* height: 246rpx; */
		  margin: 29rpx auto 0 auto;
		  background-color: #F6F6F6;
		  border-radius: 10rpx;
	 }
	 .detail-top{
		  width: 690rpx;
		  height: 87rpx;
		  margin: 0 auto 0 auto;
		  /* padding: 25rpx 0 0 0; */
		  display: flex;
		  justify-content: space-between;
		  font-size: 30rpx;
		  line-height: 87rpx;
	 }
	 .changeAdress{
		  width: 218rpx;
		  font-size: 30rpx;
		  font-weight: 500;
		  color: #313131;
		  margin: 0 0 0 20rpx;
	 }
	 .more{
		 /* width: 472rpx; */
		  /* margin: 0 0 0 410rpx; */
	 }
	
	 .detail-bottom{
		  width: 690rpx;
		  height: 161rpx;
		  margin: 0 auto 0 auto;
		  /* display: none; */
	 }
	 .detail-all{
		  font-size: 30rpx;
		  margin: 0 0 0 20rpx;
		  /* padding: 40rpx 0 0 0; */
	 }
	 .detail-area{
		  margin: 20rpx 0 0 20rpx;
		  width: 649rpx;
		  height: 64rpx;
		  /* line-height: 39rpx; */
		  font-size: 26rpx;
		  color: #5F5F5F;
	 }
	 .goods-infos1 {
	 	width: 690rpx;
	 	height: 180rpx;
	 	background-color: #F6F6F6;
	 	border-radius: 20rpx;
	 	margin: 20rpx auto 0 auto;
	 	display: flex;
	 	flex-direction: row;
	 	justify-content: flex-start;
	 }
	 
	 .goods-left {
	 	width: 160rpx;
	 	height: 160rpx;
	 	background-color: #FFFFFF;
	 	border-radius: 20rpx;
	 	margin: 10rpx 0 10rpx 10rpx;
	 	/* padding: 10rpx 0 10rpx 10rpx; */
	 }
	 .goods-left image{
		 width: 100%;
		 height: 100%;
		 
	 }
	 .goods-right-title{
		  margin: 17rpx 26rpx 0 24rpx;
		  font-size: 30rpx;
		  width: 470rpx;
		  height: 73rpx;
		  line-height: 40rpx;
		  color: #2A2A2A;
		  overflow: hidden;
		  text-overflow: ellipsis;
		  display: -webkit-box;
		  -webkit-line-clamp: 2;
		  line-clamp: 2;
		  -webkit-box-orient: vertical;
	 }
	.goods-right-price{
		 margin: 42rpx 0 0 31rpx;
		 font-size: 34rpx;
		 /* width: 224rpx; */
		 height: 32rpx;
		 line-height: 32rpx;
	}
	.goods-right-price text{
		 color: #FF3464;
		 font-weight: bold;
	}
	.top{
		 width: 690rpx;
		 height: 100rpx;
		 display: flex;
		 justify-content: flex-end;
		 margin: 0 auto 0 auto;
		 line-height: 80rpx;
		 /* padding: 30rpx 0 0 0; */
		 /* background-color: #FFFFFF; */
	}
	.top-comfire{
		 font-size: 32rpx;
		 font-weight: bold;
		 color: #2A2A2A;
		 width: 131rpx;
		 height: 31rpx;
		 line-height: 31rpx;
		 margin: 35rpx 0 0 0;
	}
	.top-img{
		 width: 30rpx;
		 height: 30rpx;
		 margin: 15rpx 0 0 251rpx;
	}
	.top-img-left{
		 width: 30rpx;
		 height: 30rpx;
		 
	}
	.moreImg{
		 width: 40rpx;
		 height: 64rpx;
		 margin: 12rpx 0 0 0;
	}
	.goods-infos-1{
		width: 690rpx;
		height: 180rpx;
		background-color: #F6F6F6;
		border-radius: 20rpx;
		margin: 20rpx auto 0 auto;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	.goods-left-1{
		width: 160rpx;
		height: 160rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin: 10rpx 0 10rpx 10rpx;
	}
	.goods-left-1 image{
		width: 100%;
		height: 100%;
	}
	.goods-right-all{
		width: 520rpx;
		height: 180rpx;
		color: #2A2A2A;
		font-size: 20rpx;
		font-weight: 500rpx;
		line-height: 16rpx;
		/* text-align: center; */
		/* margin: 21rpx 0 0 0; */
	}
	
	
	/*
	主页面样式
	*/
    page{
		background-color: #FFFFFF;
	}
	.All-goods {
		width: 100%;
		height: 60rpx;
        display: flex;
		flex-direction: row;
		justify-content: flex-start;
		border-top: #DFDFDF 1rpx solid;
		border-radius: 1rpx;
	}

	.possess {
		width: 375rpx;
		height: 60rpx;
        text-align: center;
		line-height: 60rpx;
		font-family: PingFang SC;
		font-weight: bold;
		font-size: 30rpx;
	}
    .possessMore{
		color: #D3B171;
		position: relative;
		/* border-bottom: #D3B171 1rpx solid; */
	}
	.possessMore::after{
		content: "";
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 64upx;
		height: 4upx;
		/* transform: translateX(-50%); */
		transform: translateX(-50%);
		border-radius: 2upx;
		background-color: #D3B171;
	}
	.goods-take {
		width: 375rpx;
		height: 60rpx;
        text-align: center;
        line-height: 60rpx;
		font-weight: 500;
		font-size: 30rpx;
	}

	.goods-infos {
		width: 100%;
        margin: 43rpx 0 30rpx 0;
	}

	.goods-infos1 {
		width: 690rpx;
		height: 223rpx;
		background-color: #F6F6F6;
		border-radius: 20rpx;
		margin: 20rpx auto 0 auto;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}

	.goods-left {
		width: 203rpx;
		height: 203rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin: 10rpx 0 10rpx 10rpx;
		/* padding: 10rpx 0 10rpx 10rpx; */
	}
    .goods-right{
		width: 477rpx;
		height: 223rpx;
	}
	.goods-right-1 {
		/* width: 260rpx; */
		height: 42rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #2A2A2A;
		/* line-height: 15rpx; */
		margin: 20rpx 0 0 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.goods-right-2{
		width: 434rpx;
		height: 64rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #606060;
		line-height: 34rpx;
		margin: 20rpx 0 0 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.goods-right-3{
		width: 434rpx;
		height: 50rpx;
		display: flex;
		justify-content: space-between;
		margin: 19rpx 0 0 20rpx;
	}
	.goods-right-01{
		/* width: 128rpx; */
		height: 16rpx;
		color: #2A2A2A;
		font-size: 20rpx;
		font-weight: 500rpx;
		line-height: 16rpx;
		/* text-align: center; */
		margin: 21rpx 0 0 0;
	}
	.goods-right-02{
		width: 162rpx;
		height: 50rpx;
		background-color: #1B1B1B;
		border-radius: 25rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		text-align: center;
		line-height: 50rpx;
		/* margin: 0 0 0 140rpx; */
	}
	.goods-right-wait{
		/* width: 84rpx;
		height: 50rpx; */
		color: #FF3464;
		font-size: 28rpx;
		/* line-height: 50rpx; */
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
		margin-left: 30upx;
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
	.nShier-item {
		width: 690upx;
		margin: 30upx auto 30upx;
		background-color: #F6F6F6;
		border-radius: 10upx;
		/* padding: 16upx; */
		overflow: hidden;
	}
	
	.nShier-item-list {
		display: flex;
		justify-content: space-between;
		padding: 20upx 20upx;
		/* margin: 20upx 0 0 0; */
	
	}
	
	.nShier-color {
		border-bottom: 2upx solid #F5F5F5;
	}
	
	.nShier-item-icon {}
	
	.nShier-item-icon>image {
		width: 48upx;
		height: 40upx;
	}
	
	.nShier-item-icon>text {
		display: inline-block;
		font-size: 32upx;
		color: #333333;
		font-weight: Normal;
		vertical-align: top;
		line-height: 40upx;
		margin-left: 16upx;
	}
	
	.nShier-careful {
		font-size: 20upx;
		color: #DB0B0B;
	}
</style>
