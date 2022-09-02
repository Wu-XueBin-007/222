<template>
	<view class="Myrights">
		<!-- <view class="MyrightsT" v-if="!showMyright">
			<view class="MyrightsTL">
				<image src="../../static/vip.png" mode=""></image>
			</view>
			<view class="MyrightsTR">
				您还不是大会员，暂未获得权益！
			</view>
		</view>
		<view class="MyrightsCard" v-else>
			<view class="MyrightsCardT">
				<view class="MyrightsCardTL">
					<image src="../../static/vip.png" mode=""></image>
				</view>
				<view class="MyrightsCardTR">
					{{bigUser.expire_time}}到期
				</view>
			</view>
			<view class="MyrightsCardC">
				<view class="MyrightsCardCL">
					<view class="MyrightsCardCLT">
						￥ <text>{{bigUser.expend_money}}</text>
					</view>
					<view class="MyrightsCardCLB">
						专区累计消费
					</view>
				</view>
				<view class="MyrightsCardCR" @click="getReport">
					<view class="MyrightsCardCRT">
						￥<text>{{bigUser.reward_withdraw}}</text>
					</view>
					<view class="MyrightsCardCRB">
						累计返现金额
					</view>
				</view>
			</view>
			<view class="MyrightsCardB">
				<view class="MyrightsCardBL">
					<view class="MyrightsCardBLT">
						距离下次返现
					</view>
					<view class="MyrightsCardBLB">
						<progress :percent="pgList" border-radius="8" activeColor="#602900" stroke-width="6" />
					</view>
				</view>
				<view class="MyrightsCardBC">
					<view class="MyrightsCardBCT">
						{{bigUser.now_reward}}<text>/{{setting.threshold_money}}</text>
					</view>
					<view class="MyrightsCardBCB">
						消费金额
					</view>
				</view>
				<view class="MyrightsCardBR">
					<view class="MyrightsCardBRT">
						{{bigUser.cur_invite_num}}/{{setting.threshold_people}}
					</view>
					<view class="MyrightsCardBRB">
						大会员好友
					</view>
				</view>
			</view>
		</view> -->
		<!-- <view class="Equity">
			<image :src="setImg"></image>
		</view>
		<view class="explain">
			权益规则说明
		</view> -->
		<view class="content" v-html="setRule">
			
		</view>
		<view  style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #333333;z-index: -1;" catchtouchmove="true"></view>
		</view>
	</view>
</template>

<script>
	
	import * as UserApi from "@/api/user.js";
	import {
		detail
	} from '@/api/order/comment.js'
	import * as memberApi from "@/api/member/index.js";
	import * as settingApi from '@/api/ticket/setting'
	
	const App = getApp();
	
	export default {
		data() {
			return {
				bigUser:{},
				setImg:{},
				setRule:''
			}
		},
		onLoad() {
			this.getUserinfo()
			
		},
		
		onShow(){
			// this.getbigvip()
		},
		
		methods: {
			// setProgress() {
			// 	this.pgList = [20, 40, 100, 80]
			// },
			// clearProgress() {
			// 	this.pgList = [0, 0, 0, 0]
			// },
			getReport(){
				uni.navigateTo({
					url:'/pageMember/pages/index/report'
				})
			},
			// getbigvip(){
			// 	memberApi.index().then(res=>{
					
			// 		this.bigUser=res.data.big_vip_user;
			// 		this.setting=res.data.setting;
			// 		let now_reward=Number(this.bigUser.now_reward);
			// 		let threshold_money=Number(this.setting.threshold_money);
			// 		let cur_invite_num=Number(this.bigUser.cur_invite_num);
			// 		let threshold_people=Number(this.setting.threshold_people);
			// 		let prog=0;
			// 		// var aa=now_reward/threshold_money/2
			// 		// console.log(now_reward,threshold_money,cur_invite_num,threshold_people)
			// 		// var ww=Math.ceil(now_reward/threshold_money/2);
			// 		// var rr=Math.ceil(cur_invite_num/threshold_people/2)
			// 		// console.log(aa,ww,rr,123)
			// 		// prog=Math.ceil((Math.ceil((now_reward/threshold_money)/2)+Math.ceil((cur_invite_num/threshold_people)/2))*100);
			// 		prog=Math.ceil((now_reward/threshold_money/2+cur_invite_num/threshold_people/2)*100);
			// 		this.pgList=prog;
			// 		console.log(prog,236)
			// 		if(this.bigUser.is_vip==0){
			// 			this.showMyright=false;
			// 		}else if(this.bigUser.is_vip==1){
			// 			this.showMyright=true;
			// 		}
			// 	})
			// },
			getUserinfo(){
				memberApi.userInfo().then(res=>{
					console.log(res)
					// this.setImg = res.data.setting.poster_image.preview_url
					this.setRule = res.data.setting.rules.replace(/<img/g,"< img style='width: 100%;'")
					// console.log(res.data.setting.poster_image.preview_url,11)
					console.log(this.setRule,11)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// .Myrights{
	// 	.MyrightsCard{
	// 		width: 702upx;
	// 		height: 380upx;
	// 		background: linear-gradient(134deg, #FFFFFF 0%, #F6E3C8 47%, #E8BE8A 100%);
	// 		border-radius: 20upx;
	// 		margin: 40upx auto 0;
			
	// 	.progress-box {
	// 			display: flex;
	// 			height: 50rpx;
	// 			margin-bottom: 60rpx;
	// 		}
		
	// 		.uni-icon {
	// 			line-height: 1.5;
	// 		}
		
	// 		.progress-cancel {
	// 			margin-left: 40rpx;
	// 		}
		
	// 		.progress-control button {
	// 			margin-top: 20rpx;
	// 		}
	// }
	.Myrights{
		width: 750upx;
		height: 847upx;
	}
	.Equity{
		width: 750upx;
		height: 466upx;
		// z-index: -1;
		position: relative;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.explain{
		color: #EBDCC8;
		font-size: 40upx;
		font-weight: bold;
		width: 240upx;
		height: 56upx;
		margin-left: 256upx;
		position: absolute;
		top: 346upx;
	}
	.content{
		width: 750upx;
		// height: 920upx;
		margin: 0 auto;
		color: #FFFFFF;
		position: relative;
		// top: -40upx;
	}
</style>
