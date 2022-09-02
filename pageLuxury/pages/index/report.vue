<template>
	<view class="report">
		<view class="reportMain">
			<view class="reportItem" v-for="(item,index) in balanceLog" :key="index">
				<view class="reportItemL">
					<view class="reportItemLT">
						{{item.describe}}
					</view>
					<view class="reportItemLB">
						{{item.create_time}}
					</view>
				</view>
				<view class="reportItemR">
					+{{item.money}}
				</view>
			</view>
		</view>
		<view class="" style="position: fixed;top: 0;right: 0;bottom: 0;left: 0;background-color: #FFFFFF;z-index: -1;"></view>
	</view>
</template>

<script>
	import store from '@/store'
	import * as memberApi from "@/api/member/index.js";
	const App = getApp()
	export default {
		data(){
			return{
				balanceLog:[],
				page:1,
				limit:6,
				bottomFlag:true,
				topFlag:true,
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			this.getbalanceLog()
		},
		onPullDownRefresh() {
			// 下拉
			if(!this.topFlag){
				return false;
			}
			// this.getgivemap();
			this.bottomFlag = true;
			this.page = 1;
			this.topFlag = false;
			this.getbalanceLog(true);
		},
		onReachBottom() {
			// 触底
			if(!this.bottomFlag){
				return false;
			}
			this.page = this.page + 1;
			this.bottomFlag = false;
			this.status = "loading";
			// clearInterval(this.timeOut)
			this.getbalanceLog();
			
		
		},
		methods:{
			getbalanceLog(flag){
				var obj={};
				obj.page=this.page;
				obj.limit=this.limit;
				obj.user_id=this.$store.getters.userId;
				memberApi.balanceLog(obj).then(res=>{
					console.log(res)
					this.balanceLog=res.data.balance_log.data;
					if(res.status==200){
						// this.JgoodsList=res.data.list.data;
						if(flag){
							this.topFlag = true;
							this.bottomFlag = true;
							uni.stopPullDownRefresh()
						}
						if(Math.ceil(res.data.balance_log.total/this.limit)!=this.page&&res.data.balance_log.last_page>0){
							this.bottomFlag = true;
							this.status = "loadmore";
						}else{
							this.status = "normal";
						}
						if(this.page != 1){
							this.balanceLog = this.balanceLog.concat(res.data.balance_log.data)
							
							
						}else{
							this.balanceLog = res.data.balance_log.data
							
						}
						
					}
				})
			}
			
		}
		
	}
</script>

<style scoped>
	.report{
		
	}
	.reportMain{
		margin: 20upx auto 0;
	}
	.reportItem{
		width: 690upx;
		padding: 20upx 0;
		border-bottom: 1upx solid #E8E8E8;
		display: flex;
		justify-content: space-between;
		margin: 0 auto 0;
	}
	.reportItemL{
		
	}
	.reportItemR{
		font-size: 30upx;
		color: #EF343D;
		font-weight: bold;
		line-height: 84upx;
	}
	.reportItemLT{
		font-size: 28upx;
		font-weight: bold;
		color: #404040;
	}
	.reportItemLB{
		font-size: 24upx;
		color: #989898;
		margin-top: 12upx;
	}
</style>