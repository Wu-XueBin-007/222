<template>
	<view class="withdrawal">
		<view class="withdrawalHead" >
			<view class="withdrawalHeadM">
				<view class="withdrawalHeadT">
					<view class="withdrawalHeadTT">
						￥{{balance}}
					</view>
					<view class="withdrawalHeadTB">
						任务余额
					</view>
				</view>
				<view class="withdrawalHeadC" v-if="isActive==1">
					<view class="withdrawalHeadCT">
						提现金额
					</view>
					<view class="withdrawalHeadCC">
						￥<input type="number" v-model="money">
					</view>
					<view class="withdrawalHeadCB">
						<view class="withdrawalHeadCBT">
							我的钱包
						</view>
						<view :class="['withdrawalHeadCBB',isShow?'show':'']" @click="getShow">
							
						</view>
					</view>
				</view>
				<view class="withdrawalHeadB" v-if="isActive==1" @click="getPay">
					提现
				</view>
			</view><strong></strong>
		</view>
		<view :class="[isActive==1?'withdrawalMain':'withdrawalMain2']">
			<view :class="[isActive==1?'withdrawalMainT':'withdrawalMainT2']">
				<view :class="['withdrawalMainTL',isActive==1?'active':'']" @click="getActive(1)">
					收益记录
				</view>
				<view :class="['withdrawalMainTR',isActive==2?'active':'']" @click="getActive(2)">
					提现记录
				</view>
			</view>
			<view :class="[isActive==1?'withdrawalMainB':'withdrawalMainB2']">
				<view class="withdrawalMainItem" v-for="(item,index) in flow_list" :key="index">
					<view class="withdrawalMainItemL">
						<view class="withdrawalMainItemLT">
							{{isActive==1?item.idea_name:'提现'}}
						</view>
						<view class="withdrawalMainItemLB">
							
							{{item.create_time}}
						</view>
					</view>
					<view :class="[isActive==1?'withdrawalMainItemR':'withdrawalMainItemR2']">
						{{isActive==1?'+':'-'}}
						{{item.money}}
					</view>
				</view>
			</view>
		</view>
		<view style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background:#FFFFFF ;z-index: -1;"></view>
	</view>
	
</template>

<script>
	import * as taskApi from "@/api/task/index.js";
	const App = getApp();
	export default {
		data() {
			return {
				flow_list:[],
				money:0.00,
				isShow:true,
				isActive:1,
				balance:0.00,
				page:1,
				limit:15,
				bottomFlag:true,
				topFlag:true,
			}
		},
		onLoad(){
		},
		onShow() {
			this.getBalance();
			this.getFlow_list();
			this.getBalance();
		},
		onPullDownRefresh() {
			// 下拉
			if(!this.topFlag){
				return false;
			}
			this.bottomFlag = true;
			this.page = 1;
			this.topFlag = false;
			this.getFlow_list(true);
		},
		onReachBottom() {
			// if (this.dataList.length >= this.JgoodsList.length) {
			// 	this.loadingStatus = 'noMore'
			// } else {
			// 	this.loadStatus = 'more';
			// 	setTimeout(() => {
			// 		// this.loadMore();
			// 		this.loadStatus = 'loadmore';
			// 	}, 1000)
			// }
			// 触底
			if(!this.bottomFlag){
				return false;
			}
			this.page = this.page + 1;
			this.bottomFlag = false;
			this.status = "loading";
			this.getFlow_list();
		
		},
		methods: {
			getFlow_list(flag){
				var obj={};
				obj.page=this.page;
				obj.limit=this.limit;
				obj.scene=this.isActive;
				taskApi.flow_list(obj).then(res=>{
					console.log(res,11)
					// this.flow_list=res.data.list.data
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
							this.flow_list = this.flow_list.concat(res.data.list.data);
							
						}else{
							this.flow_list = res.data.list.data;
						}
						
					}
				})
			},
			getShow(){
				this.isShow=!this.isShow;
			},
			getActive(type){
				this.isActive=type;
				this.page=1;
				this.getFlow_list();
			},
			//获取用户余额
			getBalance(){
				var obj={}
				taskApi.get_balance(obj).then(res=>{
					console.log(res)
					this.balance=res.data.money_info.balance;
				})
			},
			getPay(){
				if(this.isShow==false){
					uni.showToast({
						icon: 'none',
						title: "请选择提现方式"
					})
					return false;
				}
				if (this.money < 0.01) {
					uni.showToast({
						icon: 'none',
						title: "提现金额单次最低0.01"
					})
					return false;
				}
				var obj={};
				obj.money=this.money;
				taskApi.withdraw(obj).then(res=>{
					console.log(res)
					uni.showToast({
						icon: 'none',
						title: res.message
					})
					if(res.status==200){
						this.getBalance();
						this.getFlow_list();
					}
				})
			},
			// close(e){
			// 	let id = e.target.dataset.id || e.currentTarget.dataset.id;
			// 	let index = e.target.dataset.index || e.currentTarget.dataset.index;
			// 	let pages=getCurrentPages();
			// 	let prevPage=pages[pages.length-2]
			// 	prevPage.$vm.boxId=id
			// 	prevPage.$vm.navIndex=index
			// 	uni.navigateBack({
			// 		delta:1
			// 	})
			// }
		}
	}
</script>

<style scoped>
	.withdrawal{
		
	}
	.withdrawalHead{
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #FFFFFF;
	}
	.withdrawalHeadM{
		width: 690upx;
		/* height: 564upx; */
		border-radius: 20upx;
		background-color: #F6F6F6;
		padding-bottom: 24upx;
		margin: 0 auto;
	}
	.withdrawalHeadT{
		margin: 24upx auto 0;
		
	}
	.withdrawalHeadTT{
		font-size: 60upx;
		color: #333333;
		font-weight: bold;
		text-align: center;
		line-height: 84upx;
	}
	.withdrawalHeadTB{
		font-size: 28upx;
		color: #989898;
		text-align: center;
		
	}
	.withdrawalHeadC{
		margin: 38upx auto 0;
		padding: 0 24upx;
		
	}
	.withdrawalHeadCT{
		font-size: 28upx;
		color: #333333;
	}
	.withdrawalHeadCC{
		font-size: 40upx;
		color: #333333;
		margin-top: 28upx;
		display: flex;
		padding-bottom: 8upx;
		border-bottom: 1upx solid #E8E8E8;
	}
	.withdrawalHeadCC input{
		width: 80%;
		font-size: 24upx;
		color: #8D8D8D;
		height: 56upx;
		line-height: 56upx;
		padding-left: 10upx;
	}
	.withdrawalHeadCB{
		width: 642upx;
		height: 88upx;
		background-color: #FFFFFF;
		margin-top: 28upx;
		display: flex;
		justify-content: space-between;
		border-radius: 10upx;
	}
	.withdrawalHeadCBT{
		font-size: 28upx;
		color: #333333;
		line-height: 88upx;
		margin-left: 40upx;
		
	}
	.withdrawalHeadCBB{
		width: 36upx;
		height: 36upx;
		margin: 26upx 24upx 26upx 0;
		border: 1upx solid #9d9d9d;
		border-radius: 50%;
	}
	.show{
		background: url(../../static/selet_cat.png);
		background-size: 36upx 36upx;
		border: none;
	}
	.withdrawalHeadB{
		margin: 28upx auto 0;
		width: 284upx;
		height: 78upx;
		line-height: 78upx;
		background-color: #EF343D  ;
		text-align: center;
		color: #FFFFFF;
		border-radius: 40upx;
		font-weight: bold;
	}
	.withdrawalMain{
		/* position: fixed;
		top: 648upx;
		left: 30upx;
		width: 690upx; */
		/* padding-top: 96upx;
		background-color: #FFFFFF; */
	}
	.withdrawalMain2{
		/* position: fixed;
		top: 260upx;
		left: 30upx;
		width: 690upx; */
		
	}
	.withdrawalMainT{
		position: fixed;
		top: 546upx;
		left: 30upx;
		width: 690upx;
		padding-top: 96upx;
		background-color: #FFFFFF;
		display: flex;
		
	}
	.withdrawalMainT2{
		position: fixed;
		top: 164upx;
		left: 30upx;
		width: 712upx;
		padding-top: 96upx;
		background-color: #FFFFFF;
		display: flex;
	}
	.withdrawalMainTL{
		font-size: 28upx;
		color: #404040;
		line-height: 42upx;
	}
	.withdrawalMainTR{
		font-size: 28upx;
		color: #404040;
		margin-left: 24upx;
		line-height: 42upx;
	}
	.active{
		font-size: 30upx;
		color: #EF343D  ;
		font-weight: bold;
		position: relative;
	}
	.active::after{
		content: "";
		position: absolute;
		bottom: -4upx;
		left: 50%;
		width: 40upx;
		height: 6upx;
		/* transform: translateX(-50%); */
		transform: translateX(-50%);
		border-radius: 10upx;
		background-color: #EF343D  ;
	}
	.withdrawalMainB{
		width: 690upx;
		margin: 724upx auto 60upx;
	}
	.withdrawalMainB2{
		width: 690upx;
		margin: 322upx auto 60upx;
	}
	.withdrawalMainItem{
		margin-top: 22upx;
		padding-bottom: 20upx;
		border-bottom: 1upx solid #E8E8E8;
		display: flex;
		justify-content: space-between;
	}
	.withdrawalMainItemL{
		
	}
	.withdrawalMainItemLT{
		font-size: 28upx;
		color: #404040;
		font-weight: bold;
	}
	.withdrawalMainItemLB{
		font-size: 24upx;
		color: #989898;
		margin-top: 12upx;
	}
	.withdrawalMainItemR{
		font-size: 30upx;
		color: #EF343D  ;
		margin: 22upx 24upx 22upx 0;
	}
	.withdrawalMainItemR2{
		font-size: 30upx;
		color: #404040;
		margin: 22upx 24upx 22upx 0;
	}
</style>
