<template>
	<view class="mallDetails">
		<view class="mallDetails-lunb">
			<swiper class="mallDetails-swiper" indicator-dots="false" indicator-active-color="#d7b262" indicator-color="#FFFFFF" autoplay="true"
			 interval="3000" duration="500">
				<swiper-item v-for="(item,index) in IntegralGoodsList.images" :key="index">
					<image :src="item.file.preview_url"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="mallDetails-content">
			
			<view class="mallDetails-text2">
				{{IntegralGoodsList.name}}
			</view>
			<!-- <view class="mallDetails-text3">
				{{IntegralGoodsList.synopsis}}
			</view> -->
			<view class="mallDetails-text1">
				<text>{{IntegralGoodsList.integral}}积分</text><text></text>
			</view>
		</view>
		<view class="mallDetails-goodscontent">
			<text class="goodscontent-text">商品详情</text>
			
			<rich-text class="goodscontent-item" :nodes="IntegralGoodsList.content"></rich-text>
		</view>
		<view class="mallDetails-btn" @click="btn_determine">
			立即兑换
		</view>
		<view v-if="showModalStatus" style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: rgba(0,0,0,.5);z-index: 7;"
		 catchtouchmove="true"></view>
	</view>
</template>

<script>
	import { detail } from "@/api/integral/index.js";
	export default {
		data() {
			return {
				IntegralGoodsList: {},
				showModalStatus: false, //是否显示
				animationData: {}, //动画
				num: 0, //初始数量
				minusStatus: 'disabled',
				goods_id: '', //商品id
				specName: '', //规格名
				findResellerUserId: 0,
				isGuige:0,
				goods_specs:'',
				goods_specsAll:'',
				isCart:-1,
				Imgurl:''
			}
		},
		onLoad(options) {
			// this.Imgurl=app.globalData.Imgurl;
			this.goods_id = parseInt(options.id)
			// this.shexi();
			this.shanxi();
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
			shexi(){
				//#ifdef MP-WEIXIN
					app.$vm.$options.api.AreaLst({
					}).then(res=>{
						//console.log(res)
						if(res.data.code=='success'){
							this.addressList=res.data.data.data.map(cur=>{
								if(cur.default==1){
									cur.flag = true;
								}else{
									cur.flag = false;
								}
								return cur;
							});;
							
							for(var i=0;i<this.addressList.length;i++){
								this.region=JSON.parse(this.addressList[i].region);
								let obj = this.addressList[i];
								obj.region = this.region;
								this.addressList.splice(i,1,obj);
								if(this.addressList[i].default==1){
									uni.setStorageSync('user_address',this.addressList[i]);
								}
								
							}
						}else{
							uni.showToast({
								icon:"none",
								title:res.data.msg
							})
						}
						
						
					})
				//#endif
				//#ifdef H5
					app.$options.api.AreaLst({
					}).then(res=>{
						//console.log(res)
						if(res.data.code=='success'){
							this.addressList=res.data.data.data;
							for(var i=0;i<this.addressList.length;i++){
								this.region=JSON.parse(this.addressList[i].region);
								let obj = this.addressList[i];
								obj.region = this.region;
								this.addressList.splice(i,1,obj);
								if(this.addressList[i].default==1){
									uni.setStorageSync('user_address',this.addressList[i]);
								}
								
							}
						}else{
							uni.showToast({
								icon:"none",
								title:res.data.msg
							})
						}
						
					})
				//#endif
			},
			shanxi(){
				detail({id:this.goods_id}).then(res=>{
					//console.log(res)
					this.IntegralGoodsList = res.data.detail;
					this.IntegralGoodsList.content = this.IntegralGoodsList.content.replace(/\<img/gi, '<img style="max-width:100%"');
					// //console.log()
					// this.IntegralGoodsList.synopsis = this.IntegralGoodsList.synopsis.indexOf(";")!=-1?this.IntegralGoodsList.synopsis.split(";"):[this.IntegralGoodsList.synopsis];
				})
				
			},

			//确定
			btn_determine(){
				uni.setStorageSync("integralGoods",[this.IntegralGoodsList])
				uni.navigateTo({
					url:"/pages/checkout/index?mode=integral"
				})
			}
		}
	}
</script>

<style scoped>
.mallDetails-swiper {
	height: 750upx;
}

.mallDetails-swiper swiper-item image {
	width: 100%;
	height: 750upx;
}
	
.mallDetails{
	background-color: #F5F5F5;
}
.mallDetails-lunb{
	position: relative;
}
.mallDetails-share{
	width: 80upx;
	height: 80upx;
	border-radius: 50%;
	position: absolute;
	top: 30upx;
	right: 30upx;
	background-color: #000000;
	opacity: 0.51;
}
.mallDetails-share>image{
	width: 41upx;
	height: 39upx;
	margin: 20upx 0 0 20upx;
}
.mallDetails-content{
	/* width: 690upx; */
	height: 176upx;
	padding: 20upx 30upx;
	background-color: #FFFFFF;
	overflow: hidden;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.mallDetails-text1{
	font-size: 32upx;
	color: #000000;
	line-height: 38upx;
}
.mallDetails-text1 text:nth-child(1){
	color: #DB0B0B;
}
.mallDetails-text2{
	width: 670upx;
	height: 72upx;
	font-size: 32upx;
	line-height: 36upx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	/* margin: 20upx 0; */
}
.mallDetails-text3{
	font-size: 24upx;
	color: #808080;
}
.mallDetails-buttom{
	position: absolute;
	top: 20upx;
	right: 30upx;
	display: flex;
}


.mallDetails-item{
	margin-top: 20upx;
	background-color: #FFFFFF;
}
.mallDetails-item-list{
	width: 690upx;
	height: 60upx;
	padding: 20upx 30upx;
	display: flex;
	justify-content: space-between;
}
.mallDetails-item .bordbm{
	border-bottom: 2upx solid #F5F5F5;
}
.item-list-left{
	display: flex;
}

.item-list-text{
	font-size: 24upx;
	color: #000000;
	margin-left: 32upx;
	line-height: 60upx;
}
.item-list-text>image{
	width: 18upx;
	height: 24upx;
	vertical-align: top;
	margin-top: 20upx;
	margin-right: 11upx;
}
.item-list-right{
	font-size: 24upx;
	color: #000000;
	line-height: 60upx;
}
.item-list-right>image{
	width: 10upx;
	height: 20upx;
	vertical-align: top;
	display: inline-block;
	margin-top: 20upx;
	margin-left: 10upx;
}

/* goodscontent */
.mallDetails-goodscontent {
	margin-top: 20upx;
	margin-bottom: 100upx;
	background-color: #FFFFFF;
	padding: 30upx 30upx 0 30upx;
}

.goodscontent-item {
	/* margin-left: 30upx; */
}

.goodscontent-text {
	font-size: 28upx;
	color: #333333;
	display: inline-block;
	width: 100%;
	padding: 20upx 0 20upx 0;
	text-align: center;
}
.goodscontent-item >>> img {
	width: 100%;
}
/* mallDetails-footer */
.mallDetails-footer{
	position: fixed;
	width: 100%;
	height: 100upx;
	bottom: 0;
	left: 0;
	display: flex;
	background-color: #FFFFFF;
}
.mallDetails-footer-list{
	width: 126upx;
	height: 100upx;
}
.mallDetails-footer-list>image{
	width: 40upx;
	height: 40upx;
	display: block;
	margin: 10upx auto;
}
.mallDetails-footer-list>text{
	font-size: 24upx;
	color: #515151;
	line-height: 28upx;
	text-align: center;
	display: inline-block;
	width: 123upx;
}
.mallDetails-footer-btn1{
	width: 187upx;
	height: 100upx;
	line-height: 100upx;
	text-align: center;
	font-size: 24upx;
	background-color: #F20A0A;
	color: #FFFFFF;
}
.mallDetails-footer-btn2{
	width: 187upx;
	height: 100upx;
	line-height: 100upx;
	text-align: center;
	font-size: 24upx;
	background-color: #0089CF;
	color: #FFFFFF;
}
.mallDetails-btn{
	width: 750upx;
	height: 100upx;
	line-height: 100upx;
	background-color: #ff5060;
	color: #FFFFFF;
	font-size: 32upx;
	position: fixed;
	left: 0;
	bottom: 0;
	text-align: center;
	bottom: var(--window-bottom);
}
</style>
