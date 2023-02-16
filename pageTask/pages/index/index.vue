<template>
	<view class="task">
		<view class="task-heard">
			<view class="task-heardL">
				<view class="task-heardLT">
					任务余额
				</view>
				<view class="task-heardLB">
					<text>{{balance}}</text>元
				</view>
			</view>
			<view class="task-heardR" >
				<view class="task-heardRT" @click="checkTask">
					规则说明
				</view>
				<u-popup v-model="showAgree" mode="bottom"  @close="close" @open="open">
				<view class="" style="font-size: 30upx;color: #404040;text-align: center;padding-top: 30upx;">
					规则说明
				</view>
				<view style="max-height: 700upx;">
						<view v-html="advert_rules" style="padding: 30upx;box-sizing: border-box;">
							
						</view>
					</view>
				</u-popup>
					
				<view class="task-heardRB" @click="getWithdrawal">
					去提现
				</view>
			</view>
			<image src="../../static/back.jpg" mode=""></image>
		</view>
		<view class="taskMain">
			<view class="taskMainH">
				<view class="taskMainL">
					<view :class="['possess',isActive==1?'possessMore':'']" @click="getActive(1)">
						视频任务
					</view>
					<view :class="['possess',isActive==2?'possessMore':'']" @click="getActive(2)">
						图文任务
					</view>
				</view>
				<view class="taskMainR" @click="getTaskmap">
					广告投放入口
					<image src="../../static/icon_right2.png" mode=""></image>
				</view>
			</view>
			<view class="taskMainC" v-if="isActive==1">
				<view class="taskMainItem" v-for="(item,index) in taskList" :key="index" :data-id="item.id" @click="getVideo">
					<view class="taskMainItemT">
						<image :src="item.video_info.cover" mode=""></image>
						<view class="tackLabel">
							广告
						</view>
					</view>
					<view class="taskMainItemC" v-if="item.view_status==1">
						浏览可赚{{item.price}}
					</view>
					<view class="taskMainItemC2" v-else-if="item.view_status==2">
						已完成
					</view>
					<view class="taskMainItemB">
						{{item.idea_name}}
					</view>
				</view>
				<view style="padding-top: 100upx;margin: 0 auto;" v-if="taskList.length==0">
					<u-empty text="暂无记录"></u-empty>
				</view>
			</view>
			<view class="taskMainC" v-if="isActive==2">
				<view class="taskMainItems" v-for="(item,index) in taskList" :key="index" :data-id="item.id" @click="getImageText">
					<view class="taskMainItemsL">
						<image :src="item.logo" mode=""></image>
					</view>
					<view class="taskMainItemsR">
						<view class="taskMainItemsRT">
							{{item.idea_name}}
						</view>
						<view class="taskMainItemsRC">
							{{item.idea_intro}}
						</view>
						<view class="taskMainItemsRB" v-if="item.view_status==1">
							浏览可赚{{item.price}}
						</view>
						<view class="taskMainItemsRB2" v-if="item.view_status==2">
							已完成
						</view>
					</view>
				</view>
				<view style="padding-top: 100upx;margin: 0 auto;" v-if="taskList.length==0">
					<u-empty text="暂无记录"></u-empty>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import * as OrderApi from '@/api/order'
	import * as UserApi from "@/api/user.js";
	import {
		detail
	} from '@/api/order/comment.js'
	import * as taskApi from "@/api/task/index.js";
	import * as settingApi from '@/api/ticket/setting'
	const App = getApp();
	let timer = null;
	let drawTimer=null;
	export default {
		data() {
			return {
				isActive:1,
				balance:0.00,
				taskList:[],
				page:1,
				limit:6,
				bottomFlag:true,
				topFlag:true,
				showAgree:false,
				advert_rules: '',
			}
		},
		onLoad() {
			
			
		},
		onUnload() {
		},
		onShow(){
			this.init();
			this.getBalance();
			this.getCommon();
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
			getActive(type){
				this.isActive=type;
				this.page=1;
				this.init()
			},
			checkTask(){
				this.showAgree = true;
			},
			getCommon(){
				settingApi.detail().then(res=>{
					this.advert_rules = res.data.detail.advert_rules.replace(/<img/g,"<img style='width: 100%;'")
				})
			},
			close(){
				
			},
			open(){
				
			},
			getTaskmap(){
				uni.navigateTo({
					url:"/pageTask/pages/index/taskMap"
				})
			},
			getWithdrawal(){
				uni.navigateTo({
					url:"/pageTask/pages/index/withdrawal"
				})
			},
			getVideo(e){
				let id = e.currentTarget.dataset.id || e.target.dataset.id;
				uni.navigateTo({
					url:"/pageTask/pages/index/taskVideo?id="+id
				})
			},
			getImageText(e){
				let id = e.currentTarget.dataset.id || e.target.dataset.id;
				uni.navigateTo({
					url:"/pageTask/pages/index/ImageText?id="+id
				})
			},
			init(flag){
				var obj={}
				obj.page=this.page;
				obj.limit=this.limit;
				obj.type=this.isActive;
				taskApi.list(obj).then(res=>{
					// this.taskList=res.data.list.data;
					if(res.status==200){
						// this.JgoodsList=res.data.list.data;
						if(flag){
							this.topFlag = true;
							this.bottomFlag = true;
							uni.stopPullDownRefresh()
						}
						if(Math.ceil(res.data.list.total/this.limit)!=this.page&&res.data.list.last_page>0){
							this.bottomFlag = true;
							this.status = "loadmore";
						}else{
							this.status = "normal";
						}
						if(this.page != 1){
							this.taskList = this.taskList.concat(res.data.list.data);
							
						}else{
							this.taskList = res.data.list.data;
						}
						
					}
				})
			},
			//获取用户余额
			getBalance(){
				var obj={}
				taskApi.get_balance(obj).then(res=>{
					console.log(res)
					this.balance=res.data.money_info.balance;
				})
			},
		}
	}
</script>

<style scoped>
	.task{
		width: 750upx;
	}
	.task-heard{
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 0 34upx 26upx 60upx;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
	}
	.task-heard image{
		position: absolute;
		top: 0;
		left: 0;
		width: 750upx;
		height: 162upx;
		z-index: -1;
	}
	.task-heardL{
		
	}
	.task-heardLT{
		font-size: 26upx;
		color: #FFFFFF;
		margin-top: 16upx;
		font-family: PingFang SC-Medium, PingFang SC;
	}
	.task-heardLB{
		font-size: 26upx;
		color: #FFFFFF;
		margin-top: 10upx;
	}
	.task-heardLB text{
		font-size: 64upx;
		font-weight: bold;
	}
	.task-heardR{
		
	}
	.task-heardRT{
		font-size: 26upx;
		color: #FFFFFF;
		text-align: center;
		margin-top: 22upx;
	}
	.task-heardRB{
		width: 124upx;
		height: 54upx;
		border: 2upx solid #FFFFFF;
		border-radius: 26upx;
		text-align: center;
		line-height: 50upx;
		font-size: 28upx;
		color: #FFFFFF;
		margin-top: 24upx;
	}
	.taskMain{
		margin: 160upx auto 30upx;
	}
	.taskMainH{
		display: flex;
		position: fixed;
		width: 100%;
		padding: 30upx 30upx 0 30upx;
		justify-content: space-between;
		background-color: #FFFFFF;
		z-index: 9;
	}
	.taskMainL{
		display: flex;
	}
	.possess{
		font-size: 28upx;
		color: #404040;
		margin-right: 24upx;
		height: 50upx;
		font-weight: Bold;
	}
	.possessMore{
		font-size: 30upx;
		color: #EF343D  ;
		position: relative;
	}
	.possessMore::after{
		content: "";
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 40upx;
		height: 6upx;
		/* transform: translateX(-50%); */
		transform: translateX(-50%);
		border-radius: 10upx;
		background-color: #EF343D  ;
	}
	.taskMainR{
		font-size: 24upx;
		color: #929292;
	}
	.taskMainR image{
		width: 18upx;
		height: 18upx;
		vertical-align: top;
		margin-top: 8upx;
	}
	.taskMainC{
		padding: 80upx 30upx 0 30upx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.taskMainItem{
		width:334upx;
		border-radius: 20upx;
		background-color: #F6F6F6;
		padding-bottom: 24upx;
		margin-top: 20upx;
	}
	.taskMainItemT{
		width: 314upx;
		height: 410upx;
		border-radius: 20upx;
		margin: 10upx;
		position: relative;
	}
	.tackLabel{
		position: absolute;
		top: 0;
		left: 0;
		width: 92upx;
		height: 46upx;
		border-radius: 20upx 0 30upx 0;
		background-color: rgba(0, 0, 0, 0.31);
		text-align: center;
		line-height: 46upx;
		color: #FFFFFF;
	}
	.taskMainItemT image{
		width: 100%;
		height: 100%;
		vertical-align: top;
		border-radius: 20upx;
	}
	.taskMainItemC{
		height: 54upx;
		border-radius: 0 34upx 34upx 0;
		background-color: #EF343D  ;
		display: inline-block;
		font-size: 28upx;
		color: #FFFFFF;
		line-height: 54upx;
		padding:0 20upx;
	}
	.taskMainItemC2{
		height: 54upx;
		border-radius: 0 34upx 34upx 0;
		display: inline-block;
		font-size: 28upx;
		line-height: 54upx;
		padding:0 20upx;
		background-color: #D4D4D4;
		color: #FFFFFF;
	}
	.taskMainItemB{
		margin: 14upx 0 0 20upx;
		font-size: 26upx;
		color: #333333;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.taskMainItems{
		width: 690upx;
		margin: 20upx auto 0;
		border-radius: 20upx;
		background-color: #F6F6F6;
		display: flex;
	}
	.taskMainItemsL{
		margin: 10upx;
		width: 184upx;
		height: 184upx;
		border-radius: 20upx;
	}
	.taskMainItemsL image{
		width: 100%;
		height: 100%;
		vertical-align: top;
		border-radius: 20upx;
	}
	.taskMainItemsR{
		width: calc(100% - 224upx);
		margin: 10upx 20upx;
	}
	.taskMainItemsRT{
		font-size: 26upx;
		color: #333333;
		font-weight: bold;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.taskMainItemsRC{
		height: 70upx;
		font-size: 24upx;
		color: #666666;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		margin-top: 8upx;
	}
	.taskMainItemsRB{
		margin-top: 26upx;
		font-size: 28upx;
		color: #FFFFFF;
		background-color: #EF343D  ;
		padding: 8upx 20upx;
		border-radius: 28upx;
		display: inline-block;
		text-align: center;
	}
	.taskMainItemsRB2{
		margin-top: 26upx;
		font-size: 28upx;
		color: #D4D4D4;
		background-color: #FFFFFF;
		padding: 8upx 20upx;
		border-radius: 28upx;
		display: inline-block;
		text-align: center;
	}
</style>
