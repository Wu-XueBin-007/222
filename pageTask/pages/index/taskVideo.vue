<template>
	<view class="taskVideo" :style="{'box-sizing': 'border-box'}">
		<view class="taskVideoMain">
			<view class="taskVideoHead" :style="{'top': navInfo.navH+'px'}">
				<view class="taskVideoHeadL">
					<view class="taskVideoHeadImage" @click="btnSound">
						<image src="../../static/sound_open.png" mode="" v-if="isSound"></image>
						<image src="../../static/sound_close.png" mode="" v-else></image>
					</view>
					<view class="taskVideoHeadLR" v-if="view_time!=0&&this.advertPlanInfo.view_status==1">
						{{view_time}}秒后可获得奖励
					</view>
					<view class="taskVideoHeadLR" v-else>
						领取成功
					</view>
				</view>
				<view class="taskVideoHeadR">
					<view class="taskVideoHeadRL">
						<view class="" @click="btnSwitch">
							反馈
						</view>
						<view class="taskPopup" v-if="isSwitch">
							<view class="taskPopupT" @click="getUninterested">
								<image src="../../static/uninterested.png" mode=""></image>不感兴趣
							</view>
							<view class="taskPopupB" @click="getReport">
								<image src="../../static/report.png" mode=""></image>举报广告
							</view>
						</view>
					</view>
					<view class="taskVideoHeadRR" @click="btnColse">
						关闭
					</view>
				</view>
			</view>
			<view class="taskVideoC" style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;z-index: 9;">
				<video :src="advertPlanInfo.video_info.video_url" style="width: 100%;height: 100%;" autoplay="true" :controls="false" show-fullscreen-btn="false" show-play-btn="false" show-center-play-btn="false" object-fit="fill"
				auto-pause-if-open-native muted="isSound"></video>
			</view>
			<view class="taskVideoSmall" v-if="isSize">
				<view class="taskVideoSmallT">
					<view class="taskVideoSmallTL">
						<image :src="advertPlanInfo.logo" mode=""></image>
					</view>
					<view class="taskVideoSmallTR">
						<view class="taskVideoSmallText1">
							{{advertPlanInfo.idea_name}}
						</view>
						<view class="taskVideoSmallText2">
							{{advertPlanInfo.idea_intro}}
						</view>
					</view>
				</view>
				<view class="taskVideoSmallB" @click="getDetails">
					查看详情
				</view>
			</view>
			<view class="taskVideoLarge" v-else>
				<view class="taskVideoLargeT">
					<view class="taskVideoLargeTL">
						<image :src="advertPlanInfo.logo" mode=""></image>
					</view>
					<view class="taskVideoLargeTR">
						<view class="taskVideoLargeText1">
							{{advertPlanInfo.idea_name}}
						</view>
						<view class="taskVideoLargeText2">
							{{advertPlanInfo.idea_intro}}
						</view>
					</view>
				</view>
				<view class="taskVideoLargeB" @click="getDetails">
					查看详情
				</view>
			</view>
		</view>
		<view class="" style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;z-index: 99;">
			
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import * as taskApi from "@/api/task/index.js";
	const App = getApp()
	let timer = null;
	export default {
		data(){
			return {
				navInfo: {
					leftDistance: 0,
					lineHeight: 0,
					navH: 0,
					paddingTop: 0,
					windowWidth:0,
					windowHeight:0,
					statusBarHeight:0
				},
				id:-1,
				advertPlanInfo:{},
				view_time:0,
				isSwitch:false,
				isSound:false,
				isSize:true,
			}
		},
		onLoad(options) {
			let obj = {};
			obj.leftDistance = App.globalData.leftDistance;
			obj.lineHeight = App.globalData.lineHeight;
			obj.navH = App.globalData.navH;
			obj.paddingTop = App.globalData.paddingTop;
			obj.windowWidth=App.globalData.windowWidth;
			obj.windowHeight=App.globalData.windowHeight;
			this.navInfo = obj;
			this.id=options.id;
			// this.getDetail();
			// this.getBeforeProfit();
		},
		onUnload() {
			clearInterval(timer)
		},
		onShow() {
			this.getDetail();
			
		},
		methods:{
			getDetail(){
				var obj={}
				obj.plan_id=this.id;
				taskApi.video_mid(obj).then(res=>{
					console.log(res)
					this.advertPlanInfo=res.data.advertPlanInfo;
					this.view_time=this.advertPlanInfo.view_time;
					if(this.advertPlanInfo.view_status==1){
						this.getBeforeProfit();
						if(this.view_time>0){
							timer=setInterval(()=>{
								this.view_time=this.view_time-1;
								if(this.view_time<=0){
									clearInterval(timer)
									this.view_time=0;
									this.isSize=false;
									this.sutProfit()
								}
							},1000)
							
						}
					}else{
						
					}
					
					
				})
			},
			btnSwitch(){
				this.isSwitch=!this.isSwitch;
			},
			btnSound(){
				this.isSound=!this.isSound;
			},
			eliminateTimer(){
				clearInterval(timer)
			},
			establishTimer(){
				timer=setInterval(()=>{
					this.view_time=this.view_time-1;
					if(this.view_time<=0){
						clearInterval(timer)
						this.view_time=0;
						this.isSize=false;
						this.sutProfit()
					}
				},1000)
			},
			sutProfit(){
				var obj={}
				obj.plan_id=this.id;
				taskApi.profit(obj).then(res=>{
					console.log(res)
				})
			},
			getBeforeProfit(){
				var obj={}
				obj.plan_id=this.id;
				taskApi.beforeProfit(obj).then(res=>{
					console.log(res)
				})
			},
			getUninterested(){
				var obj={}
				obj.plan_id=this.id;
				taskApi.no_interest(obj).then(res=>{
					uni.showToast({
						icon:'none',
						title:"感谢您的建议与反馈"
					})
					this.isSwitch=false;
				})
				
			},
			getReport(){
				uni.navigateTo({
					url:"/pageTask/pages/index/report?id="+this.id
				})
			},
			getDetails(){
				uni.navigateTo({
					url:"/pageTask/pages/index/videoDetails?id="+this.id
				})
			},
			btnColse(){
				if(this.advertPlanInfo.view_status==1){
					clearInterval(timer)
					if(this.view_time==0){
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.showModal({
							content:"暂未获得奖励是否继续观看视频",
							cancelText:'放弃',
							confirmText:'继续',
							success:res=> {
								if(res.confirm){
									if(this.advertPlanInfo.view_status==1){
										timer=setInterval(()=>{
											this.view_time=this.view_time-1;
											if(this.view_time<=0){
												clearInterval(timer)
												this.view_time=0;
												this.isSize=false;
												this.sutProfit()
											}
										},1000)
									}
									
									
								}else if(res.cancel){
									uni.navigateBack({
										delta:1
									})
								}
							}
						})
					}
				}else if(this.advertPlanInfo.view_status==2){
					uni.navigateBack({
						delta:1
					})
				}
				
				
				
			}
		}
	}
</script>

<style scoped>
	.taskVideo{
		
	}
	.taskVideoMain{
		position: relative;
	}
	.taskVideoHead{
		display: flex;
		justify-content: space-between;
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.taskVideoHeadL{
		padding: 12upx 30upx;
		border-radius: 32upx;
		background-color: rgba(0, 0, 0, 0.2);
		display: flex;
		margin-left: 22upx;
	}
	.taskVideoHeadImage{
		width: 30upx;
		height: 30upx;
		margin:  4upx 14upx 0 0;
	}
	.taskVideoHeadImage image{
		width: 100%;
		height: 100%;
		vertical-align: top;
	}
	.taskVideoHeadLR{
		height: 38upx;
		line-height: 38upx;
		border-left: 2upx solid #D2D2D2;
		padding-left: 16upx;
		font-size: 28upx;
		color: #FFFFFF;
		font-weight: 400;
	}
	.taskVideoHeadR{
		padding: 12upx 30upx;
		border-radius: 32upx;
		background-color: rgba(0, 0, 0, 0.2);
		display: flex;
		margin-right: 30upx;
	}
	.taskVideoHeadRL{
		font-size: 28upx;
		color: #FFFFFF;
		font-weight: 400;
		margin-right: 20upx;
		position: relative;
	}
	.taskPopup{
		position: absolute;
		top: 64upx;
		right: -22upx;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 20upx;
		width: 214upx;
		padding: 12upx 30upx;
	}
	.taskPopup::after{
		position: absolute;
		right: 36upx;
		top: -24upx;
		content: "";
		width: 0;
		height: 0;
		border:12upx solid transparent;
		border-bottom-color: rgba(0, 0, 0, 0.5);
	}
	.taskPopupT{
		font-size: 28upx;
		color: #FFFFFF;
	}
	.taskPopupB{
		font-size: 28upx;
		color: #FFFFFF;
		margin-top: 24upx;
		line-height: 28upx;
	}
	.taskPopup image{
		width: 30upx;
		height: 30upx;
		vertical-align: top;
		margin-right: 12upx;
	}
	.taskVideoHeadRR{
		font-size: 28upx;
		border-left: 2upx solid #A7A7A7;
		padding-left: 20upx;
		color: #FFFFFF;
		font-weight: 400;
	}
	/* 小 */
	.taskVideoSmall{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 20upx 20upx 0 0;
		z-index: 999;
	}
	.taskVideoSmallT{
		display: flex;
		padding: 20upx 30upx 0 30upx;
	}
	.taskVideoSmallTL{
		width: 108upx;
		height: 108upx;
		border-radius: 40upx;
	}
	.taskVideoSmallTL image{
		width: 100%;
		height: 100%;
		border-radius: 20upx;
		
	}
	.taskVideoSmallTR{
		margin-left: 20upx;
		width: calc(100% - 156upx);
	}
	.taskVideoSmallText1{
		font-size: 32upx;
		color: #000000;
		font-weight: bold;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.taskVideoSmallText2{
		margin-top: 12upx;
		font-size: 24upx;
		color: #666666;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.taskVideoSmallB{
		font-size: 30upx;
		color: #FFFFFF;
		background-color: #EF343D;
		border-radius: 40upx;
		text-align: center;
		width: 348upx;
		height: 78upx;
		line-height: 78upx;
		margin: 42upx auto 16upx;
	}
	/* 小 end*/
	
	/* 大 */
	.taskVideoLarge{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 20upx 20upx 0 0;
		z-index: 999;
	}
	.taskVideoLargeT{
		padding: 0 32upx;
	}
	.taskVideoLargeTL{
		width: 248upx;
		height: 248upx;
		border-radius: 20upx;
		margin: 40upx auto 20upx;
	}
	.taskVideoLargeTL image{
		width: 100%;
		height: 100%;
		border-radius: 20upx;
		
	}
	.taskVideoLargeTR{
		
	}
	.taskVideoLargeText1{
		font-size: 32upx;
		color: #000000;
		font-weight: bold;
		text-align: center;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.taskVideoLargeText2{
		margin-top: 20upx;
		font-size: 24upx;
		color: #666666;
		text-align: center;
	}
	.taskVideoLargeB{
		font-size: 30upx;
		color: #FFFFFF;
		background-color: #EF343D;
		border-radius: 40upx;
		text-align: center;
		width: 348upx;
		height: 78upx;
		line-height: 78upx;
		margin: 42upx auto 16upx;
	}
	/* 大 end*/
</style>