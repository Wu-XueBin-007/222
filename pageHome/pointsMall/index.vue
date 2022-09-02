<template>
	<view class="pointsMall">
		<view class="pointsMall-header">
			<!-- <image src="" mode=""></image> -->
			<view class="pointsMall-header-c">
				<view class="pointsMall-header-text1">
					我的积分
				</view>
				<view class="pointsMall-header-text2">
					{{userInfo.points}}
				</view>
			</view>
			<view class="pointsMall-header-btn" @click="btn_rules">
				积分明细>>
			</view>
		</view>
		<view class="pointsMall-screen">
			<view :class="['pointsMall-lists',isTab==1?'turr':'']" @click="btn_nav(1)">
				综合
			</view>
			<view :class="['pointsMall-lists price',isTab==2?'turr':'']" @click="btn_nav(2)">
				积分
				<view class="fs_up">
					<view class="icon_top" v-if="priceTerms==-1">
						<image src="../../static/icon/top.png" mode=""></image>
					</view>
					<view class="icon_top" v-if="priceTerms==2">
						<image src="../../static/icon/top.png" mode=""></image>
					</view>
					<view class="icon_top" v-if="priceTerms==1">
						<image src="../../static/icon/bottom_act.png" mode=""></image>
					</view>
					<view class="icon_bottom" v-if="priceTerms==-1">
						<image src="../../static/icon/bottom.png" mode=""></image>
					</view>
					<view class="icon_bottom" v-if="priceTerms==1">
						<image src="../../static/icon/bottom.png" mode=""></image>
					</view>
					<view class="icon_bottom" v-if="priceTerms==2">
						<image src="../../static/icon/top_act.png" mode=""></image>
					</view>
				</view>
			</view>
			<view :class="['pointsMall-lists',isTab==3?'turr':'']" @click="btn_nav(3)">
				100-1000
			</view>
			<view :class="['pointsMall-lists',isTab==4?'turr':'']" @click="btn_nav(4)">
				1000-2000
			</view>
			<view :class="['pointsMall-lists',isTab==5?'turr':'']" @click="btn_nav(5)">
				2000以上
			</view>
		</view>
		<view class="pointsMall-content">
			<view class="pointsMall-list" v-for="(item,index) in IntegralGoodsList" :key="index" :data-id="item.id" @click="btn_mallDetails">
				<view class="pointsMall-list-img">
					<image :src="item.goods_image" mode=""></image>
				</view>
				<view class="pointsMall-list-title">
					<view class="pointsMall-list-text1">
						{{item.name}}
					</view>
					<view class="pointsMall-list-text2">
						{{item.integral}}积分
					</view>
				</view>
			</view>
			
		</view>
		<view style="font-size: 28upx;color: #808080;text-align: center;margin-bottom: 30upx;margin-top: 30upx;" v-if="status=='loadmore'">-- 加载更多 --</view>
		<view style="font-size: 28upx;color: #808080;text-align: center;margin-bottom: 30upx;margin-top: 30upx;" v-if="status=='loading'">加载中...</view>
		<view style="font-size: 28upx;color: #808080;text-align: center;margin-bottom: 30upx;margin-top: 30upx;" v-if="status=='normal'">-- 没有更多啦 --</view>
		<view style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F5F5F5;z-index: -1;"></view>
	</view>
</template>

<script>
	import { list } from "@/api/integral/index.js";
	import * as UserApi from '@/api/user'
	export default {
		data() {
			return {
				isTab:1,
				IntegralGoodsList:[],
				priceTerms:-1,
				CommonLst:'',
				limit:10,
				page:1,
				status:"loadmore",
				bottomFlag:true,
				topFlag:true,
				userInfo:{}
			}
		},
		onLoad(option) {
			// this.Imgurl=app.globalData.Imgurl;
			this.init();
			this.getPageData()
		},
		onPullDownRefresh() {
			// 下拉
			if(!this.topFlag){
				return false;
			}
			this.page = 1;
			this.topFlag = true;
			this.btn_nav(true);
			
		},
		onReachBottom() {
			// 触底
			if(!this.bottomFlag){
				return false;
			}
			this.page = this.page + 1;
			// this.page=1;
			this.bottomFlag = false;
			this.status = "loading";
			this.btn_nav();
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
			init(){
				
				this.getList({page:this.page,limit:this.limit});
			},
			getList(data){
				list(data).then(res=>{
					//console.log(res)
					if(res.data.list.data.length < this.limit){
						this.status = "normal";
					}else{
						this.bottomFlag = true;
						this.status = "loading";
					}
					if(this.page == 1){
						this.IntegralGoodsList = res.data.list.data;
					}else{
						this.IntegralGoodsList = this.IntegralGoodsList.concat(res.data.list.data);
					}
				})
			},
			btn_nav(type,flag){
				this.isTab=type;
				var _that=this;
				var obj={};
				if(type==1){
					obj={}
					this.priceTerms = -1;
				}else if(type==2){
					if(this.priceTerms==-1){
						this.priceTerms=1;
					}else if(this.priceTerms==1){
						this.priceTerms=2;
					}else if(this.priceTerms==2){
						this.priceTerms=1;
					}
					if(this.priceTerms==1){
						obj.sort=1;
					}else if(this.priceTerms==2){
						obj.sort=2;
					}
				}else if(type==3){
					// obj.integral=100;
					// obj.integral1=1000;
					obj.section = "100,1000"
				}else if(type==4){
					// obj.integral=1000;
					// obj.integral1=2000;
					obj.section = "1000,2000"
				}else if(type==5){
					// obj.integral=2000;
					// obj.integral1=1000;
					obj.section = "2000,"
				}
				obj.page=_that.page;
				obj.limit=_that.limit;
				this.getList(obj)
			},
			btn_mallDetails(e){
				let id = e.currentTarget.dataset.id || e.target.dataset.id;
				this.$navTo('pageHome/pointsMall/mallDetails', { id })
			},
			btn_rules(e){
				this.$navTo('pageHome/pointsMall/pointsDetailed')
			}
		}
	}
</script>

<style scoped>
.pointsMall{
	background-color: #F3F3F3;
}
	.pointsMall-header{
		overflow: hidden;
		position: relative;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		height: 348upx;
		background-image: url(../../static/background/pointsMall.png);
		background-size: 750upx 348upx;
	}
	.pointsMall-screen{
		width: 702upx;
		height: 96upx;
		background-color: #FFFFFF;
		display: flex;
		margin: 2upx auto 0;
		position: fixed;
		top: 318upx;
		left: 3%;
		z-index: 999;
		border-radius: 40upx 40upx 8upx 8upx;
		align-items: center;
	}
	.pointsMall-content{
		margin-top: 414upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}


	.pointsMall-header>image{
		width: 750upx;
		height: 348upx;
	}
	.pointsMall-header-c{
		margin: 170upx auto 0;
	}
	.pointsMall-header-text1{
		font-size: 24upx;
		color: #FFFFFF;
		text-align: center;
		font-weight: normal;
	}
	.pointsMall-header-text2{
		font-size: 48upx;
		color: #FFFFFF;
		text-align: center;
		font-weight: bold;
		margin-top: 24upx;
	}
	.pointsMall-header-btn{
		position: absolute;
		right: 0;
		top: 36%;
		width: 180upx;
		height: 50upx;
		padding-left: 30upx;
		line-height: 50upx;
		color: #FAFF5D;
		font-size: 24upx;
		z-index: 999;
	}

	/* 筛选列表 */
	
	.pointsMall-lists{
		height: 80upx;
		padding: 0 20upx;
		line-height: 80upx;
		text-align: center;
		font-size: 24upx;
		color: #000000;
	}
	.pointsMall .turr{
		color: #ff5060;
	}
	.pointsMall .price{
		position: relative;
	}
	.fs_up{
		display: inline-block;
		position: absolute;
		top: 24upx;
		right: 0;
	}
	.fs_up .icon_top{
		width: 20upx;
		height: 14upx;
	}
	.fs_up .icon_top>image{
		width: 100%;
		height: 100%;
		vertical-align: top;
	}
	.fs_up .icon_bottom{
		width: 20upx;
		height: 14upx;
		margin-top: 6upx;
	}
	.fs_up .icon_bottom>image{
		width: 100%;
		height: 100%;
		vertical-align: top;
	}
	.pointsMall-screen .screen{
		position: relative;
	}
	.pointsMall-screen-icon{
		display: inline-block;
		width: 16upx;
		height: 16upx;
		position: absolute;
		top: 34upx;
		left: 104upx;
	}
	.pointsMall-screen-icon>image{
		width: 100%;
		height: 100%;
		vertical-align: top;
	}
	/* 筛选列表 end*/

	.pointsMall-list{
		width: 370upx;
		height: 540upx;
		margin-top: 10upx;
		border-radius: 10upx;
		background-color: #FFFFFF;
	}
	.pointsMall-list-img{
		width: 370upx;
		height: 370upx;
		
	}
	.pointsMall-list-img>image{
		width: 100%;
		height: 100%;
		vertical-align: top;
	}
	.pointsMall-list-title{
		padding: 30upx 20upx;
	}
	.pointsMall-list-text1{
		font-size: 24upx;
		color: #000000;
		width: 330upx;
		height: 60upx;
		line-height: 30upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.pointsMall-list-text2{
		font-size: 24upx;
		color: #DB0B0B;
		margin-top: 30upx;
	}
</style>
