<template>
	<view style="padding-top: 30rpx;">
		<head-nav title="团队收益明细" :backFlag="true" color="white" backGround="linear-gradient(90deg, #FF5F60, #DE6BAD)" backType="other" fontSize="36"></head-nav>
		<view class="msgItem" v-for="(item,index) in list" :key="index">
			<view class="msgItemL">
				<view class="msgItemLL msgItemLPT" v-if="item.order_source==50">拼</view>
				<view class="msgItemLL msgItemLMS" v-if="item.order_source==30">盲</view>
				<view class="msgItemLL msgItemLMS" v-if="item.order_source==20">秒</view>
				<view class="msgItemLL msgItemLSC" v-if="item.order_source==10">商</view>
				<view class="msgItemLR">
					<!-- <view class="msgItemLRT" v-if="item.scene==90||item.scene==100||item.scene==110||item.scene==120||item.scene==130">拼团</view>
					<view class="msgItemLRT" v-if="item.scene==150||item.scene==160">秒杀</view>
					<view class="msgItemLRT" v-if="item.scene==65||item.scene==50||item.scene==60">车票</view>
					<view class="msgItemLRT" v-if="item.scene==20||item.scene==40||item.scene==200">商城</view>
					<view class="msgItemLRT" v-if="item.scene==500">团队收益</view>
					<view class="msgItemLRT" v-if="item.scene==70||item.scene==80||item.scene==75">话费</view> -->
					<view class="msgItemLRT" v-if="item.order_source==50">幸运拼团</view>
					<view class="msgItemLRT" v-if="item.order_source==30">盲盒</view>
					<view class="msgItemLRT" v-if="item.order_source==20">秒杀</view>
					<view class="msgItemLRT" v-if="item.order_source==10">商城</view>
					<view class="msgItemLRB">{{item.pay_time}}</view>
				</view>
			</view>
			<view class="msgItemR">
				<image src="/static/icon/add.png" class="msgItemRL"></image>
				<view class="msgItemRR">{{item.profit}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import headNav from '@/components/seckillNav.vue'
	import * as userApi from '@/api/user.js'
	const app = getApp();
	export default {
		data() {
			return {
				page:1,
				date:'',
				moreFlag:false,
				list:[]
			}
		},
		components:{headNav},
		onLoad(options) {
			this.date = options.date;
			this.getList();
		},
		onReachBottom() {
			if(!this.moreFlag){
				return false;
			}
			this.moreFlag = false;
			this.page = this.page + 1;
			this.getList();
		},
		onPullDownRefresh() {
			this.moreFlag = false;
			this.page = 1;
			this.list = [];
			this.getList();
		},
		methods: {
			getList(){
				let obj = {};
				obj.date = this.date;
				obj.page = this.page;
				userApi.profit_record(obj).then(res=>{
					console.log(res)
					uni.stopPullDownRefresh();
					if(this.page == 1){
						this.list = res.data.list.data.map(cur=>{
							cur.pay_time = app.$vm.getTime(cur.pay_time*1000,"-","time");
							return cur;
						})
					}else{
						this.list = this.list.concat(res.data.list.data.map(cur=>{
							cur.pay_time = app.$vm.getTime(cur.pay_time*1000,"-","time");
							return cur;
						}));
					}
					if(this.page < res.data.list.last_page){
						this.moreFlag = true;
					}else{
						this.moreFlag = false;
					}
				}).catch(err=>{uni.stopPullDownRefresh();})
			}
		}
	}
</script>

<style scoped>
	.msgItem{
		width: 690rpx;
		height: 80rpx;
		box-sizing: border-box;
		/* border-radius: 20rpx; */
		background: white;
		margin: 0 auto 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
	}
	.msgItem:nth-child(1){
		margin-top: 0;
	}
	.msgItem:nth-child(2n+1){
		background: #f5f5f5;
	}
	.msgItemL{
		display: flex;
		align-items: center;
	}
	.msgItemLL{
		width: 52rpx;
		height: 52rpx;
		
		line-height: 52rpx;
		text-align: center;
		color: white;
		font-size: 28rpx;
		font-weight: bold;
		border-radius: 50%;
		margin-right: 30rpx;
	}
	.msgItemLPT{
		background: linear-gradient(45deg, #FF5F60 0%, #DF6BAE 100%);
	}
	.msgItemLMS{
		background: linear-gradient(45deg, #DC0303 0%, #FC6060 100%);
	}
	.msgItemLCP{
		background: linear-gradient(45deg, #015EEA 0%, #00C0FA 100%);
	}
	.msgItemLSC{
		background: linear-gradient(45deg, #7148B5 0%, #8769E9 50%, #715DD3 100%);
	}
	.msgItemLSY{
		background: linear-gradient(45deg, #12D6DF 0%, #F70FFF 100%);
	}
	.msgItemLHF{
		background: linear-gradient(45deg, #F28E26 0%, #FD644F 100%);
	}
	.msgItemLR{
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.msgItemLRT{
		font-size: 28rpx;
		line-height: 28rpx;
		color: #686868;
		margin-bottom: 8rpx;
	}
	.msgItemLRB{
		font-size: 22rpx;
		line-height: 22rpx;
		color: #999999;
	}
	.msgItemR{
		display: flex;
		align-items: center;
	}
	.msgItemRL{
		width: 24rpx;
		height: 24rpx;
		margin-right: 20rpx;
	}
	.msgItemRR{
		font-size: 28rpx;
		line-height: 28rpx;
		color: #686868;
		min-width: 130rpx;
		text-align: right;
	}
</style>
