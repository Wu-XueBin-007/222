<template>
	<view class="distribution">
		<head-nav title="我的团队" :backFlag="true" color="white" backGround="linear-gradient(90deg, #FF5F60, #DE6BAD)" backType="other" fontSize="36"></head-nav>
		<view class="headNav">
			<view class="headNavT">{{teamInfo.team_count?teamInfo.team_count:0}}</view>
			<view class="headNavB">会员升级请联系专属客服</view>
			<view class="headNavPos" v-if="teamInfo.superior_user_info&&teamInfo.superior_user_info.user_id" @click="showMark">我的推荐人</view>
		</view>
		<view class="infoWrap">
			<view class="infoItem">
				<view class="infoItemT">{{teamInfo.today_invite_count?teamInfo.today_invite_count:0}}</view>
				<view class="infoItemB">今日新增</view>
			</view>
			<view class="infoItem">
				<view class="infoItemT">{{teamInfo.one_user_count?teamInfo.one_user_count:0}}</view>
				<view class="infoItemB">直属粉丝</view>
			</view>
			<view class="infoItem">
				<view class="infoItemT">{{teamInfo.two_user_count?teamInfo.two_user_count:0}}</view>
				<view class="infoItemB">间属粉丝</view>
			</view>
		</view>
		<view class="searchWrap">
			<input type="text" placeholder="ID查找" placeholder-style="color:white" v-model="keyword" @confirm="searchList" />
			<image src="../../static/home/icon_search_white.png" @click="searchList"></image>
		</view>
		<!-- <view class="screenWrap">
			<view class="screenL">
				<view class="screenLT">筛选伙伴</view>
				<image src="../../static/home/more_pink.png"></image>
			</view>
			<view class="screenItem">
				<view class="screenItemT">1000</view>
				<view class="screenItemB">直接伙伴</view>
			</view>
			<view class="screenItem">
				<view class="screenItemT">1000</view>
				<view class="screenItemB">间接伙伴</view>
			</view>
		</view> -->
		<view class="conWrap">
			<view class="conItem" v-for="(item,index) in teamList" :key="index">
				<view class="conItemT">
					<view class="conItemTL">
						<view class="conItemTLL">
							<view class="conItemTLLT" :style="{'background-image': 'url('+item.avatar_url+')'}"></view>
							<view class="conItemTLLB">{{item.level_name}}</view>
						</view>
						<view class="conItemTLR">
							<view class="conItemTLRT">{{item.nick_name}}</view>
							<view class="conItemTLRB">ID:{{item.user_id}}</view>
						</view>
					</view>
					<view class="conItemTR">团队：{{item.subordinate_count}}人</view>
				</view>
				<view class="conItemB">
					<view class="conItemBL"></view>
					<view class="conItemBR">{{item.create_time}}</view>
				</view>
			</view>
		</view>
		<!-- <view class="distribution-header">
			<view class="distribution-header-left" @click="btn_box">
				提成明细
			</view>
			<view class="distribution-header-right" @click="btn_record">
				提现记录
			</view>
		</view>
		<view class="distribution-content">
			<view class="distribution-content-left">
				<text>用户提成:<text style="font-size: 36upx;color: #FFFFFF;font-weight: bold;margin-left: 16upx;">{{userInfo.commission}}</text>元</text>
			</view>
			<view class="distribution-content-right" @click="btn_withdrawal">
				提现
			</view>
		</view>
		<view class="distribution-main">
			<view class="distribution-main-t" style="display: flex;align-items: center;justify-content: space-between;">
				<text>推荐人：{{topUser}}</text>
				<text>下级人数：{{totalUser}}人</text>
			</view>
			<view class="distribution-main-c">
				推荐好友
			</view>
			<scroll-view class="distribution-main-b" :scroll-y="true" @scrolltolower="bottomCallBack">
				<view class="distribution-main-item" v-for="(item,index) in bottomUser" :key="index">
					<view class="distribution-item-left">
						<view class="distribution-main-img">
							<image :src="item.avatar_url" mode=""></image>
						</view>
						<view class="distribution-main-text1">
							{{item.nick_name}}
						</view>
					</view>
					<view class="distribution-item-right">
						下级人数：{{item.count}}人
					</view>
				</view>
			</scroll-view>
		</view> -->
		<view class="mark" v-if="markFlag" @click="hideMark"></view>
		<view class="topUserWrap" v-if="markFlag">
			<view class="topUserWrapT">
				<view class="topUserWrapTT">推荐人</view>
				<view class="topUserWrapTB">
					<view class="topUserWrapTBL" :style="{'background-image':'url('+teamInfo.superior_user_info.avatar_url+')'}"></view>
					<view class="topUserWrapTBR">
						<view class="topUserWrapTBRT">{{teamInfo.superior_user_info.nick_name}}</view>
						<view class="topUserWrapTBRB">
							<view class="topUserWrapTBRBL">ID：{{teamInfo.superior_user_info.user_id}}</view>
							<view class="topUserWrapTBRBR" :data-id="teamInfo.superior_user_info.user_id" @click="copy">复制</view>
						</view>
					</view>
				</view>
			</view>
			<image src="../../static/home/close_icon.png" class="topUserWrapB" @click="hideMark"></image>
		</view>
		<view style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background:#f3f3f3;z-index: -1;"></view>
	</view>
</template>

<script>
	import * as API from "@/api/distribution/index.js";
	import * as UserApi from '@/api/user'
	import headNav from '@/components/seckillNav.vue'
	export default {
		data() {
			return {
				userInfo:{},
				topUser:"",
				bottomUser:[],
				page:1,
				limit:10,
				reqFlag:true,
				totalUser:0,
				teamInfo:{},
				total:0,
				teamList:[],
				moreFlag:false,
				keyword:"",
				markFlag:false
			}
		},
		components:{headNav},
		onLoad() {
			this.getPageData()
			this.getList()
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
		onReachBottom() {
			if(!this.moreFlag){
				return false;
			}
			this.moreFlag = false;
			this.page = this.page + 1;
			this.getUserList();
		},
		methods: {
			copy(e){
				let id = e.target.dataset.id || e.currentTarget.dataset.id;
				uni.setClipboardData({
					data:id.toString()
				})
			},
			showMark(){
				this.markFlag = true;
			},
			hideMark(){
				this.markFlag = false;
			},
			searchList(){
				this.page = 1;
				this.getUserList();
			},
			getCommon(){
				API.my().then(res=>{
					console.log(res)
					this.teamInfo = res.data;
				})
			},
			bottomCallBack(e){
				console.log(e)
				if(!this.reqFlag){
					return false;
				}
				this.reqFlag = false;
				this.page = this.page + 1;
				this.getbottomList();
			},
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
			getbottomList(){
				let obj = {};
				obj.page = this.page;
				obj.limit = this.limit;
				obj.type = 0;
				API.relationship(obj)
					.then(res=>{
						if(this.page<res.data.userInfo.last_page){
							this.reqFlag = true;
						}
						if(this.page == 1){
							this.bottomUser = res.data.userInfo.data ? res.data.userInfo.data : [];
						}else{
							this.bottomUser = this.bottomUser.concat(res.data.userInfo.data);
						}
						this.totalUser = res.data.userInfo.total;
					})
			},
			getList(){
				// this.getbottomList();
				// API.relationship({type:1})
				// 	.then(res=>{
				// 		this.topUser = (res.message == 'success') ? res.data.userInfo.data[0].nick_name : res.message;
				// 	})
				this.getCommon();
				this.getUserList();
			},
			getUserList(){
				let obj = {};
				obj.page = this.page;
				if(this.keyword){
					obj.user_id = this.keyword;
				}
				API.team_list(obj).then(res=>{
					console.log(res)
					if(this.page == 1){
						this.teamList = res.data.user_list.data;
					}else{
						this.teamList = this.teamList.concat(res.data.user_list.data);
					}
					if(this.page < res.data.user_list.last_page){
						this.moreFlag = true;
					}else{
						this.moreFlag = false;
					}
				})
			},
			btn_box(){
				this.$navTo('pageHome/distribution/commission/index')
			},
			btn_record(){
				this.$navTo('pageHome/distribution/withdrawal/index',{type:1})
			},
			btn_withdrawal(){
				this.$navTo('pageHome/cashier/withdrawal?type=2')
			},
			btn_withdrawalTicket(){
				this.$navTo('pageHome/cashier/withdrawalTicket?type=2')
			}
		}
	}
</script>

<style scoped>
	.mark{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		background: rgba(0,0,0,.5);
	}
	.topUserWrap{
		position: fixed;
		width: 550rpx;
		left: 50%;
		top: 50%;
		z-index: 100;
		transform: translate(-50%,-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.topUserWrapT{
		width: 100%;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 50rpx 0 90rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #fde0e4;
	}
	.topUserWrapTT{
		font-size: 40rpx;
		font-family: PingFang;
		font-weight: 400;
		color: #595757;
		line-height: 40rpx;
		margin-bottom: 50rpx;
	}
	.topUserWrapTB{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.topUserWrapTBL{
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
		background-position: center;
		background-size: cover;
		margin-right: 22rpx;
	}
	.topUserWrapTBR{
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.topUserWrapTBRT{
		font-size: 28rpx;
		font-family: PingFang;
		font-weight: 400;
		color: #595757;
		line-height: 28rpx;
		margin-bottom: 16rpx;
	}
	.topUserWrapTBRB{
		display: flex;
		align-items: center;
	}
	.topUserWrapTBRBL{
		font-size: 28rpx;
		font-family: PingFang;
		font-weight: 500;
		color: #595757;
		line-height: 28rpx;
		margin-right: 20rpx;
	}
	.topUserWrapTBRBR{
		height: 32rpx;
		box-sizing: border-box;
		border: 2rpx solid #595757;
		padding: 0 12rpx;
		line-height: 28rpx;
		font-size: 20rpx;
		color: #595757;
		border-radius: 16rpx;
	}
	.topUserWrapB{
		width: 50rpx;
		height: 50rpx;
		margin-top: 50rpx;
	}
	
	
	
	.conWrap{
		width: 690rpx;
		margin: 20rpx auto 0;
	}
	.conItem{
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		border-radius: 20rpx;
		background: white;
		margin-bottom: 20rpx;
	}
	.conItemT{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.conItemTL{
		display: flex;
		align-items: center;
	}
	.conItemTLL{
		/* height: 68rpx; */
		margin-right: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.conItemTLLT{
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background-size: cover;
		background-position: center;
	}
	.conItemTLLB{
		padding: 0 8rpx;
		height: 20rpx;
		line-height: 20rpx;
		border-radius: 10rpx;
		font-size: 16rpx;
		color: white;
		margin-top: -14rpx;
		position: relative;
		z-index: 9;
		background: #FD6066;
	}
	.conItemTLR{
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.conItemTLRT{
		font-size: 28rpx;
		line-height: 28rpx;
		color: #686868;
		margin-bottom: 12rpx;
	}
	.conItemTLRB{
		font-size: 28rpx;
		line-height: 28rpx;
		color: #686868;
	}
	.conItemTR{
		font-size: 28rpx;
		line-height: 28rpx;
		color: #686868;
	}
	.conItemB{
		padding-top: 16rpx;
		border-top: 2rpx solid rgba(104, 104, 104, .3);
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 16rpx;
	}
	.conItemBR{
		font-size: 22rpx;
		line-height: 22rpx;
		color: #999999;
	}
	
	
	
	.screenWrap{
		width: 690rpx;
		box-sizing: border-box;
		padding: 20rpx 0;
		margin: 20rpx auto 0;
		background: white;
		border-radius: 20rpx;
		display: flex;
	}
	.screenL{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 230rpx;
	}
	.screenLT{
		font-size: 36rpx;
		line-height: 36rpx;
		color: #FE5A60;
		margin-bottom: 20rpx;
		text-align: center;
	}
	.screenL>image{
		width: 12rpx;
		height: 22rpx;
		transform: rotate(90deg);
	}
	.screenItem{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 230rpx;
		position: relative;
	}
	.screenItem::before{
		content: "";
		width: 2rpx;
		height: 74rpx;
		background: rgba(104, 104, 104, .3);
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}
	.screenItemT{
		font-size: 36rpx;
		line-height: 36rpx;
		margin-bottom: 20rpx;
		color: #FE5A60;
		text-align: center;
	}
	.screenItemB{
		font-size: 28rpx;
		line-height: 28rpx;
		color: #999999;
		text-align: center;
	}
	
	
	
	.searchWrap{
		width: 690rpx;
		margin: 30rpx auto 0;
		height: 50rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
		border-radius: 22rpx;
		background: linear-gradient(45deg, #FD6066 0%, #DF6BAE 99%);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.searchWrap>input{
		width: calc(100% - 44rpx);
		height: 50rpx;
		line-height: 50rpx;
		font-size: 26rpx;
		color: white;
	}
	.searchWrap>image{
		width: 24rpx;
		height: 24rpx;
	}
	
	
	.infoWrap{
		width: 690rpx;
		border-radius: 20rpx;
		background: white;
		display: flex;
		box-sizing: border-box;
		padding: 30rpx 0;
		margin: -50rpx auto 0;
		position: relative;
		z-index: 9;
	}
	.infoItem{
		width: 230rpx;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.infoItemT{
		font-size: 36rpx;
		line-height: 36rpx;
		color: #FE5A60;
		margin-bottom: 20rpx;
		text-align: center;
	}
	.infoItemB{
		font-size: 28rpx;
		line-height: 28rpx;
		color: #999999;
		text-align: center;
	}
	.infoItem:nth-child(1)::after,
	.infoItem:nth-child(2)::after{
		width: 2rpx;
		height: 74rpx;
		background: #686868;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
	}
	
	
	.headNav{
		width: 100%;
		height: 344rpx;
		background: linear-gradient(90deg, #FF5F60, #DE6BAD);
		box-sizing: border-box;
		padding-top: 100rpx;
		position: relative;
	}
	.headNavT{
		font-size: 100rpx;
		line-height: 100rpx;
		color: white;
		margin-bottom: 30rpx;
		text-align: center;
	}
	.headNavB{
		font-size: 32rpx;
		line-height: 32rpx;
		color: white;
		text-align: center;
	}
	.headNavPos{
		height: 40rpx;
		padding: 0 20rpx;
		border: 2rpx solid white;
		box-sizing: border-box;
		border-radius: 20rpx;
		line-height: 36rpx;
		font-size: 24rpx;
		color: white;
		position: absolute;
		right: 30rpx;
		top: 100rpx;
	}
	
	
	
	.distribution-header{
		display: flex;
		margin-top: 20upx;
		padding: 0 24upx;
		justify-content: space-between;
	}
	.distribution-header-left{
		width: 136upx;
		height: 52upx;
		background-image: url(../../static/distion/icon_left.png);
		background-size: 136upx 52upx;
		font-size: 20upx;
		color: #FFFFFF;
		line-height: 52upx;
		text-align: center;
	}
	.distribution-header-right{
		width: 136upx;
		height: 52upx;
		background-image: url(../../static/distion/icon_right.png);
		background-size: 136upx 52upx;
		font-size: 20upx;
		color: #FFFFFF;
		line-height: 52upx;
		text-align: center;
	}
	.distribution-content{
		width: 702upx;
		height: 136upx;
		background-image: url(../../static/distion/fxzxbjt2.png);
		background-size: 702upx 136upx;
		margin: 24upx auto 0;
		display: flex;
		justify-content: space-between;
		padding: 32upx;
	}
	.distribution-content-left{
		line-height: 72upx;
	}
	.distribution-content-left>text{
		font-size: 24upx;
		color: #FFFFFF;
	}
	.distribution-content-right{
		width: 168upx;
		height: 72upx;
		line-height: 72upx;
		border-radius: 36upx;
		background-color: #FFFFFF;
		text-align: center;
		color: #FFC300;
	}
	.distribution-main{
		width: 702upx;
		padding: 24upx;
		background-image: url(../../static/distion/fxzxbjt1.png);
		background-size: 702upx 874upx;
		margin: 32upx auto 40upx;
	}
	.distribution-main-t{
		font-size: 24upx;
		color: #FFFFFF;
	}
	.distribution-main-c{
		width: 100%;
		height: 28upx;
		background-image: url(../../static/distion/icon_bjt1.png);
		background-size: 100% 28upx;
		text-align: center;
		margin: 32upx auto 0;
		font-size: 24upx;
		color: #FFFFFF;
	}
	.distribution-main-b{
		width: 100%;
		height: 702upx;
		background-color: #FFFFFF;
		margin: 24upx auto 0;
		overflow: auto;
	}
	.distribution-main-item{
		display: flex;
		justify-content: space-between;
		margin: 0 auto;
		padding: 24upx 32upx 0 32upx;
		line-height: 72upx;
		z-index: -1;
	}
	.distribution-item-left{
		display: flex;
	}
	.distribution-item-right{
		font-size: 24upx;
		color: #999999;
	}
	.distribution-main-img{
		width: 72upx;
		height: 72upx;
		border-radius: 50%;
	}
	.distribution-main-text1{
		font-size: 24upx;
		color: #333333;
		margin-left: 16upx;
	}
	.distribution-main-img>image{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		vertical-align: top;
	}
</style>
