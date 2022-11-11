<template>
	<view style="padding-bottom: 20rpx;">
		<seckill-nav title="限时秒杀"></seckill-nav>
		<view class="bannerWrap">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" style="height: 280rpx;width: 100%;">
				<swiper-item v-for="(item,index) in bannerList" :key="index" class="bannerItem" @click="toUrl(index)">
					<image :src="item.preview_url"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="seckillWrap" :style="{'position':topFlag?'fixed':'','left':0,'top':0}">
			<scroll-view class="seckillCon" :scroll-x="true" :scroll-left="left">
				<view :class="['seckillItem',cateIndex==index?'active':'','scrollClass'+index]" :data-index="index" @click="changeType" v-for="(item,index) in timeList" :key="index">
					<view class="seckillItemT">{{item.start_hour}}</view>
					<view class="seckillItemB" v-if="item.type==0">未开始</view>
					<view class="seckillItemB" v-if="item.type==1">疯抢中</view>
					<view class="seckillItemB" v-if="item.type==2">已结束</view>
				</view>
			</scroll-view>
		</view>
		<view class="productWrap">
			<view class="productItem" v-for="(item,index) in list" :key="index" :data-id="item.id" @click="toDetail" v-if="item.seckill_price!=null">
				<view class="productItemImg" :style="{'background-image': 'url('+item.images[0].file.preview_url+')'}"></view>
				<view class="productItemName">{{item.goods_name}}</view>
				<view class="productPrice">
					<view class="productPriceL"><text>￥</text>{{item.seckill_price}}</view>
					<view class="productPriceR">￥{{item.goods_price_min}}</view>
				</view>
				<view class="productBtn">
					<view class="productBtnNowBuy" :style="{'background':timeList[cateIndex].type==1?'linear-gradient(120deg, #DC0303, #C00202)':'#999999'}">
						{{timeList[cateIndex].type==0?'未开始':(timeList[cateIndex].type==1?'立即抢购':'已结束')}}
						<image src="../../static/icon/more_white.png"></image>
					</view>
				</view>
			</view>
			
		</view>
		<view style="padding-top: 200rpx;" v-if="list.length==0">
			<u-empty></u-empty>
		</view>
		<view class="toTop" @click="toTop" v-if="list.length>10">
			<image src="../../static/icon/toTop.png"></image>
			<view>回到顶部</view>
		</view>
	</view>
</template>

<script>
	import seckillNav from "@/components/seckillNav.vue";
	import * as seckillApi from "@/api/seckill/seckill.js";
	export default {
		data() {
			return {
				cateIndex:0,
				list:[],
				moreFlag:false,
				page:1,
				timeList:[],
				bannerList:[],
				left:0,
				scrollTop:0,
				topFlag:false
			}
		},
		components:{seckillNav},
		onLoad() {
			this.getTime();
			this.getBanner();
			// const query = uni.createSelectorQuery().in(this);
			// query.select('.bannerWrap').boundingClientRect(data => {
			// 	console.log(data)
			// 	this.scrollTop = data.height;
			// }).exec();
		},
		onReady(){
			let that = this;
			    //获取元素节点的位置信息
			    const query = wx.createSelectorQuery().in(this)
			    //小程序BUG不加延时算出来的高度部分机型不准确，目前官方没有给更好的解决方案
			    setTimeout(() => { 
			 
			      query.select('.bannerWrap').boundingClientRect(data=>{
			        this.scrollTop = data.height;
			      }).exec();
			    }, 0);
		},
		onPageScroll(e) {
			// console.log(e,this.scrollTop)
			if(e.scrollTop>=this.scrollTop && !this.topFlag){
				this.topFlag = true;
			}
			if(e.scrollTop<this.scrollTop && this.topFlag){
				this.topFlag = false;
			}
		},
		onReachBottom() {
			if(!this.moreFlag){
				return false;
			}
			this.moreFlag = false;
			this.page = this.page + 1;
			this.getProduct();
		},
		onPullDownRefresh() {
			this.left = 0;
			this.page = 1;
			this.list = [];
			this.timeList = [];
			this.getTime();
		},
		methods: {
			toUrl(index){
				console.log(index)
				uni.navigateTo({
					url:this.bannerList[index].path
				})
			},
			getBanner(){
				seckillApi.bannerList().then(res=>{
					console.log(res,'resresresres')
					this.bannerList = res.data.list;
				})
			},
			toDetail(e){
				let id = e.target.dataset.id || e.currentTarget.dataset.id;
				uni.navigateTo({
					url:"/pages/goods/detail?type=seckill&goodsId="+id+"&timeid="+this.timeList[this.cateIndex].id
				})
			},
			changeType(e){
				this.page=1;
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				this.cateIndex = index;
				this.getProduct();
			},
			getTime(){
				seckillApi.timeList().then(res=>{
					// uni.hideLoading();
					let nowTimes = new Date();
					this.timeList = res.data.list.map(cur=>{
						let startArr = cur.start_hour.split(":");
						let endArr = cur.end_hour.split(":");
						let startTime = Number(startArr[0])*60*60 + Number(startArr[1])*60;
						let endTime = Number(endArr[0])*60*60 + Number(endArr[1])*60;
						let nowTime = Number(nowTimes.getHours())*60*60 + Number(nowTimes.getMinutes())*60 + Number(nowTimes.getSeconds());
						if(nowTime>=startTime&&nowTime<endTime){
							cur.type = 1;
						}else if(nowTime<startTime&&nowTime<endTime){
							cur.type = 0;
						}else if(nowTime>startTime&&nowTime>endTime){
							cur.type = 2;
						}
						return cur;
					});
					let waitType = -1;
					let startType = -1;
					let endType = -1;
					for(let i=0;i<this.timeList.length;i++){
						if(this.timeList[i].type == 0){
							waitType = i;
							break;
						}
					}
					for(let i=0;i<this.timeList.length;i++){
						if(this.timeList[i].type == 1){
							startType = i;
							break;
						}
					}
					for(let i=0;i<this.timeList.length;i++){
						if(this.timeList[i].type == 2){
							endType = i;
							break;
						}
					}
					this.$nextTick(()=>{
						if(startType!=-1){
							this.cateIndex = startType;
							this.getElementInfo('scrollClass'+startType)
						}else{
							if(waitType!=-1){
								this.cateIndex = waitType;
								this.getElementInfo('scrollClass'+waitType)
							}
						}
						this.getProduct();
					})
					
				})
				.catch(err=>{
					// uni.hideLoading();
				})
			},
			getElementInfo(name){
				console.log(name)
				const query = uni.createSelectorQuery().in(this);
				query.select('.' + name).boundingClientRect(data => {
					console.log(data)
					this.left = data.left;
				}).exec();
			},
			getProduct(){
				let obj = {};
				obj.page = this.page;
				obj.time_id = this.timeList[this.cateIndex].id;
				seckillApi.goodsList(obj).then(res=>{
					uni.stopPullDownRefresh()
					if(this.page == 1){
						this.list = res.data.list.data;
					}else{
						this.list = this.list.concat(res.data.list.data);
					}
					if(res.data.list.last_page > this.page){
						this.moreFlag = true;
					}else{
						this.moreFlag = false;
					}
				})
				.catch(err=>{
					uni.stopPullDownRefresh()
				})
			},
			toTop(){
				uni.pageScrollTo({
					scrollTop:0
				})
			},
		}
	}
</script>

<style scoped>
	.toTop{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 50rpx;
	}
	.toTop>image{
		width: 38rpx;
		height: 38rpx;
		margin-bottom: 12rpx;
	}
	.toTop>view{
		font-size: 28rpx;
		line-height: 28rpx;
		color: #595757;
		text-align: center;
	}
	
	
	.productWrap{
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		display: flex;
		flex-wrap: wrap;
	}
	.productItem{
		width: 320rpx;
		margin-right: 70rpx;
		margin-top: 32rpx;
	}
	.productItem:nth-child(2n+2){
		margin-right: 0;
	}
	.productItem:nth-child(1),
	.productItem:nth-child(2){
		margin-top: 0;
	}
	.productItemImg{
		width: 320rpx;
		height: 320rpx;
		border-radius: 12rpx;
		margin-bottom: 14rpx;
		background-position: center;
		background-size: cover;
	}
	.productItemName{
		width: 320rpx;
		height: 76rpx;
		font-size: 26rpx;
		line-height: 38rpx;
		color: #575759;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.productPrice{
		margin-top: 8rpx;
		width: 100%;
		border-top: 2rpx solid rgba(153, 153, 153, .5);
		display: flex;
		align-items: center;
		padding: 12rpx 0;
	}
	.productPriceL{
		font-size: 32rpx;
		line-height: 32rpx;
		color: #DC0303;
		font-weight: bold;
	}
	.productPriceL>text{
		font-size: 20rpx;
	}
	.productPriceR{
		margin-left: 16rpx;
		font-size: 22rpx;
		line-height: 22rpx;
		color: #999999;
		text-decoration: line-through;
	}
	.productBtn{
		display: flex;
		width: 100%;
		flex-direction: row-reverse;
	}
	.productBtnNowBuy{
		width: 132rpx;
		height: 36rpx;
		line-height: 36rpx;
		/* text-align: center; */
		background: linear-gradient(120deg, #DC0303, #C00202);
		font-size: 24rpx;
		color: white;
		border-radius: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.productBtnNowBuy>image{
		width: 6rpx;
		height: 12rpx;
		margin-left: 6rpx;
	}
	
	
	
	.seckillWrap{
		width: 100%;
		height: 80rpx;
		padding: 0 20rpx 0;
		background: #dc0303;
		margin-top: 20rpx;
		box-sizing: border-box;
	}
	.seckillCon{
		width: 100%;
		height: 100rpx;
		transform: translateY(-20rpx);
		white-space: nowrap;
		box-sizing: border-box;
		/* padding-top: 20rpx; */
	}
	.seckillItem{
		width: 158rpx;
		height: 80rpx;
		margin-right: 26rpx;
		border-radius: 12rpx 12rpx 0 0;
		display: inline-block;
		padding-top: 28rpx;
		/* flex-direction: column;
		justify-content: center;
		align-items: center; */
	}
	.seckillItem.active{
		background: #EF2F2F;
		font-weight: bold;
		height: 100rpx;
	}
	.seckillItem:last-child{
		margin-right: 0;
	}
	.seckillItemT{
		width: 100%;
		font-size: 26rpx;
		color: #EEEEEE;
		white-space: nowrap;
		line-height: 26rpx;
		text-align: center;
		margin-bottom: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.seckillItemB{
		width: 100%;
		font-size: 28rpx;
		color: white;
		white-space: nowrap;
		line-height: 28rpx;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	
	.bannerWrap{
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 20rpx 30rpx;
		background: white;
	}
	.bannerItem,.bannerItem>image{
		width: 100%;
		height: 100%;
		border-radius: 12rpx;
	}
</style>
