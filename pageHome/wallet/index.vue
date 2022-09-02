<template>
  <view class="container" v-if="!isLoading" style="height: 100vh;">
    <head-nav title="我的钱包" :backFlag="true" color="white" backGround="linear-gradient(90deg, #FF5F60, #DE6BAD)" backType="other" fontSize="36"></head-nav>
	<view class="headCon">
		<view class="money"><text>￥</text>{{userInfo.balance?userInfo.balance:0}}</view>
		<view class="headConB">
			<view class="headConBL">账户余额</view>
			<view class="headConBC" @click="onTargetCashier">提现</view>
			<!-- <view class="headConBR" @click="toProfit">团队收益</view> -->
		</view>
	</view>
	<view class="navHead">
		<view :class="['navHeadItem',navIndex==0?'active':'']" data-index="0" @click="openTime">昨日</view>
		<view :class="['navHeadItem',navIndex==1?'active':'']" data-index="1" @click="openTime">今日</view>
		<view :class="['navHeadItem',navIndex==2?'active':'']" data-index="2" @click="openTime">本月</view>
		<view :class="['navHeadItem',navIndex==3?'active':'']" data-index="3" @click="openTime">年度</view>
		<view :class="['navHeadItem',navIndex==4?'active':'']" data-index="4" @click="openTime">自选</view>
		
	</view>
	<uni-datetime-picker
					v-show="showModel"
	                v-model="range"
	                type="daterange"
	                start="1990-01-01"
	                end="2999-01-01"
	                rangeSeparator="至"
					@change="changeDate"
	            />
	<view class="infoWrap">
		<view class="infoWrapItem">
			<view class="infoWrapLT">{{settleInfo.pay_number}}</view>
			<view class="infoWrapLB">付款笔数</view>
		</view>
		<view class="infoWrapItem">
			<view class="infoWrapLT">{{settleInfo.profit}}</view>
			<view class="infoWrapLB" v-if="navIndex==0">昨日收益</view>
			<view class="infoWrapLB" v-if="navIndex==1">今日收益</view>
			<view class="infoWrapLB" v-if="navIndex==2">本月收益</view>
			<view class="infoWrapLB" v-if="navIndex==3">年度收益</view>
			<view class="infoWrapLB" v-if="navIndex==4">收益</view>
		</view>
	</view>
	<swiper :indicator-dots="false" :autoplay="false" :style="{'height': 'calc(100% - ' + heights + 'px)'}" :current="navIndex" @change="changeDates">
		<swiper-item style="height: 100%;" v-for="index of 5" :key="index">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" style="height: 100%;padding-top: 20rpx;box-sizing: border-box;padding-bottom: 20rpx;" v-if="list.length>0">
				<view class="msgItem" v-for="(item,index) in list" :key="index">
					<view class="msgItemL">
						<view class="msgItemLL msgItemLPT" v-if="item.scene==90||item.scene==100||item.scene==110||item.scene==120||item.scene==130">拼</view>
						<view class="msgItemLL msgItemLMS" v-if="item.scene==150||item.scene==160||item.scene==170">秒</view>
						<view class="msgItemLL msgItemLCP" v-if="item.scene==65||item.scene==50||item.scene==60">车</view>
						<view class="msgItemLL msgItemLSC" v-if="item.scene==20||item.scene==40||item.scene==200">商</view>
						<view class="msgItemLL msgItemLSM" v-if="item.scene==250||item.scene==260||item.scene==270">盲</view>
						<view class="msgItemLL msgItemLMD" v-if="item.scene==640||item.scene==604">免</view>
						<view class="msgItemLL msgItemLGG" v-if="item.scene==600">广</view>
						<view class="msgItemLL msgItemLSY" v-if="item.scene==500">收</view>
						<view class="msgItemLL msgItemDHY" v-if="item.scene==550">大</view>
						<view class="msgItemLL msgItemLHF" v-if="item.scene==70||item.scene==80||item.scene==75">话</view>
						<view class="msgItemLL msgItemGSP" v-if="item.scene==650">高</view>
						<view class="msgItemLR">
							<!-- <view class="msgItemLRT" v-if="item.scene==90||item.scene==100||item.scene==110||item.scene==120||item.scene==130">拼团</view>
							<view class="msgItemLRT" v-if="item.scene==150||item.scene==160">秒杀</view>
							<view class="msgItemLRT" v-if="item.scene==65||item.scene==50||item.scene==60">车票</view>
							<view class="msgItemLRT" v-if="item.scene==20||item.scene==40||item.scene==200">商城</view>
							<view class="msgItemLRT" v-if="item.scene==500">团队收益</view>
							<view class="msgItemLRT" v-if="item.scene==70||item.scene==80||item.scene==75">话费</view> -->
							<view class="msgItemLRT">{{item.describe}}</view>
							<view class="msgItemLRB">{{item.create_time}}</view>
						</view>
					</view>
					<view class="msgItemR">
						<image src="../../static/icon/add.png" class="msgItemRL" v-if="item.addFlag"></image>
						<image src="../../static/icon/reduce.png" class="msgItemRL" v-else mode="widthFix"></image>
						<view class="msgItemRR">{{item.money}}</view>
					</view>
				</view>
			</scroll-view>
			<view v-else style="padding-top: 200rpx;">
				<u-empty></u-empty>
			</view>
		</swiper-item>
	</swiper>
	
  </view>
</template>

<script>
  import * as UserApi from '@/api/user'
  import * as LogApi from '@/api/balance/log.js'
  import SettingModel from '@/common/model/Setting'
  import SettingKeyEnum from '@/common/enum/setting/Key'
  import headNav from '@/components/seckillNav.vue'
  const App = getApp();
  export default {
    data() {
      return {
        // 正在加载
        isLoading: true,
        // 会员信息
        userInfo: {},
        // 充值设置
        setting: {},
		navIndex: 1,
		range: [],
		showModel:false,
		page:1,
		list:[],
		moreFlag:false,
		start:0,
		end:0,
		settleInfo:{
			pay_number:0,
			profit:0
		},
		heights:0
      }
    },
	components:{headNav},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		
      // 获取页面数据
	  let dates = new Date();
      let year = dates.getFullYear();
      let month = dates.getMonth() + 1;
      let day = dates.getDate();
      let start = 0;
      let end = 0;
	 let nowDate = year + "/" + month + "/" + day + " 00:00:00";
	 start = Math.floor(new Date(nowDate).getTime()/1000);
	 end = Math.floor((new Date(nowDate).getTime() + 24*60*60*1000)/1000);
	this.start = start;
	this.end = end;
	  this.getList();
	  setTimeout(()=>{
	  	this.getHeight();
	  },1000)
    },
	onShow() {
		this.getPageData()
	},
	onReachBottom() {
		
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
		loadMore(){
			if(!this.moreFlag){
				return false;
			}
			this.moreFlag = false;
			this.page = this.page + 1;
			this.getList();
		},
		getHeight(){
			let nodes = uni.createSelectorQuery().in(this).select('.headCon');
			let nodes1 = uni.createSelectorQuery().in(this).select('.navHead');
			let nodes2 = uni.createSelectorQuery().in(this).select('.infoWrap');
			nodes.boundingClientRect(cur=>{
				// console.log(cur,5555555) //返回元素节点信息
				if(cur&&cur.height){
					nodes1.boundingClientRect(cur1=>{
						// console.log(cur1,5555555) //返回元素节点信息
						if(cur1&&cur1.height){
							nodes2.boundingClientRect(cur2=>{
								// console.log(cur2,5555555) //返回元素节点信息
								if(cur2&&cur2.height){
									if(this.navIndex == 4){
										let heights = cur.height + cur1.height + cur2.height + App.globalData.navH + 42;
										this.heights = heights;
									}else{
										let heights = cur.height + cur1.height + cur2.height + App.globalData.navH;
										this.heights = heights;
									}
								}
								
								this.$forceUpdate()
							}).exec(res => {
								// console.log(10,res) //回调
							})
						}
					}).exec(res => {
						// console.log(10,res) //回调
					})
				}
			}).exec(res => {
				// console.log(10,res) //回调
			})
		},
		getList(){
			let obj = {};
			obj.page = this.page;
			obj.start_time = this.start;
			obj.end_time = this.end;
			LogApi.list(obj)
			  .then(result => {
			    // 合并新数据
			    if(this.page == 1){
					this.list = result.data.list.data.map(cur=>{
						if(Number(cur.money)>=0){
							cur.addFlag = true;
						}else{
							cur.money = cur.money.substring(1);
							cur.addFlag = false;
						}
						cur.describe = cur.describe.indexOf("：")!=-1?cur.describe.split("：")[0]:cur.describe;
						return cur;
					});
				}else{
					this.list = this.list.concat(result.data.list.data.map(cur=>{
						if(Number(cur.money)>=0){
							cur.addFlag = true;
						}else{
							cur.money = cur.money.substring(1);
							cur.addFlag = false;
						}
						cur.describe = cur.describe.indexOf("：")!=-1?cur.describe.split("：")[0]:cur.describe;
						return cur;
					}));
				}
				if(this.page < result.data.list.last_page){
					this.moreFlag = true;
				}else{
					this.moreFlag = false;
				}
				
				this.getHeight();
			  })
			let objs = {};
			objs.start_time = this.start;
			objs.end_time = this.end;
			LogApi.info(objs).then(res=>{
				console.log(res)
				this.settleInfo = res.data;
			})
		},
		toProfit(){
			uni.navigateTo({
				url:"/pageHome/profit/profit"
			})
		},
		onTargetCashier() {
		  this.$navTo('pageHome/cashier/withdrawal')
		},
		openTime(e){
			let index = e.target.dataset.index || e.currentTarget.dataset.index;
			let dates = new Date();
			let year = dates.getFullYear();
			let month = dates.getMonth() + 1;
			let day = dates.getDate();
			let start = 0;
			let end = 0;
			this.list = [];
			if(index==0){
				this.showModel = false;
				let nowDate = year + "/" + month + "/" + day + " 00:00:00";
				start = Math.floor((new Date(nowDate).getTime() - 24*60*60*1000)/1000);
				end = Math.floor(new Date(nowDate).getTime()/1000);
				this.start = start;
				this.end = end;
				this.page = 1;
				this.getList();
			}else if(index==1){
				this.showModel = false;
				let nowDate = year + "/" + month + "/" + day + " 00:00:00";
				start = Math.floor(new Date(nowDate).getTime()/1000);
				end = Math.floor((new Date(nowDate).getTime() + 24*60*60*1000)/1000);
				this.start = start;
				this.end = end;
				this.page = 1;
				this.getList();
			}else if(index==2){
				this.showModel = false;
				let nowDate = year + "/" + month + "/1 00:00:00";
				let nowDate1 = 0;
				if(month == 12){
					nowDate1 = (year + 1) + "/01/01 00:00:00";
				}else{
					nowDate1 = year + "/" + (month + 1) + "/1 00:00:00";
				}
				start = Math.floor(new Date(nowDate).getTime()/1000);
				end = Math.floor(new Date(nowDate1).getTime()/1000);
				this.start = start;
				this.end = end;
				this.page = 1;
				this.getList();
			}else if(index==3){
				this.showModel = false;
				let nowDate = year + "/01/01 00:00:00";
				let nowDate1 = (year + 1) + "/01/01 00:00:00";
				start = Math.floor(new Date(nowDate).getTime()/1000);
				end = Math.floor(new Date(nowDate1).getTime()/1000);
				this.start = start;
				this.end = end;
				this.page = 1;
				this.getList();
			}else if(index==4){
				this.showModel = true;
				this.getHeight();
			}
			this.navIndex = index;
		},
	changeDate(e){
		console.log(e)
		let start = Math.floor(new Date(e[0] + " 00:00:00").getTime()/1000);
		let end = Math.floor(new Date(e[1] + " 00:00:00").getTime()/1000);
		this.start = start;
		this.end = end;
		this.page = 1;
		this.getList();
	},
	changeDates(e){
		// console.log(e)
		// this.navIndex = e.detail.current;
		let obj = {
			target:{dataset:{}},
			currentTarget:{
				dataset:{
					index:e.detail.current
				}
			}
		}
		this.openTime(obj)
	},
      // 获取页面数据
      getPageData() {
        const app = this
        app.isLoading = true
        Promise.all([app.getUserInfo(), app.getSetting()])
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

      // 获取充值设置
      getSetting() {
        const app = this
        return new Promise((resolve, reject) => {
          SettingModel.item(SettingKeyEnum.RECHARGE.value, false)
            .then(data => {
              app.setting = data
              resolve(data)
            })
        })
      },

      // 跳转充值页面
      onTargetRecharge() {
        this.$navTo('pageHome/wallet/recharge/index')
      },

      // 跳转充值记录页面
      onTargetRechargeOrder() {
        this.$navTo('pageHome/wallet/recharge/order')
      },

      // 跳转账单详情页面
      onTargetBalanceLog() {
        this.$navTo('pageHome/wallet/balance/log')
      },
	  // 跳转退款余额
	  onTargetRefund(){
		  this.$navTo('pageHome/wallet/refund/index')
	  },
	  // 跳转退款余额
	  onTargetTicket(){
	  		  this.$navTo('pageHome/wallet/ticket/index')
	  }

    }
  }
</script>
<style>
  page {
    background: #f4f4f4;
  }
</style>
<style scoped>
	.msgItem{
		width: 690rpx;
		height: 80rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		background: white;
		margin: 20rpx auto 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
	}
	.msgItem:nth-child(1){
		margin-top: 0;
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
	.msgItemLSM{
		background: linear-gradient(45deg, #ffc965 0%, #ffbe45 100%);
	}
	.msgItemLHF{
		background: linear-gradient(45deg, #F28E26 0%, #FD644F 100%);
	}
	.msgItemLMD{
		background: linear-gradient(45deg, #FF8418 100%, #FFB950 100%);
	}
	.msgItemLGG{
		background: linear-gradient(45deg, #FF8418 100%, #FC1A64 100%);
	}
	.msgItemDHY{
		/* background: linear-gradient(45deg, #FF8418 100%, #FC1A64 100%); */
		background: linear-gradient(45deg, #8B26F2 0%, #FD4F5B 100%);
	}
	.msgItemGSP{
		/* background: linear-gradient(45deg, #FF8418 100%, #FC1A64 100%); */
		background: linear-gradient(45deg, #2686f2 0%, #4ffdf7 100%);
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
	
	
	
	.infoWrap{
		width: 690rpx;
		height: 136rpx;
		border-radius: 20rpx;
		background: white;
		margin: 0 auto;
		display: flex;
		box-sizing: border-box;
		padding: 30rpx 0;
	}
	.infoWrapItem{
		width: 50%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}
	.infoWrapItem:nth-child(1)::after{
		content: "";
		width: 2rpx;
		height: 76rpx;
		background: rgba(104, 104, 104, .3);
		position: absolute;
		right: -2rpx;
		top: 50%;
		transform: translateY(-50%);
	}
	.infoWrapLT{
		font-size: 36rpx;
		line-height: 36rpx;
		color: #FE5A60;
	}
	.infoWrapLB{
		font-size: 28rpx;
		line-height: 28rpx;
		color: #999999;
	}
	
	
	
	.navHead{
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 50rpx;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.navHeadItem{
		font-size: 32rpx;
		line-height: 32rpx;
		color: #999999;
	}
	.navHeadItem.active{
		color: #FD6064;
	}
	
	
	
  .headCon{
	  width: 100%;
	  height: 288rpx;
	  background: linear-gradient(90deg, #FF5F60, #DE6BAD);
	  box-sizing: border-box;
	  padding-top: 100rpx;
  }
  .money{
	  display: flex;
	  align-items: baseline;
	  justify-content: center;
	  font-size: 100rpx;
	  font-weight: bold;
	  color: white;
	  text-align: center;
	  line-height: 100rpx;
	  margin-bottom: 24rpx;
  }
  .money>text{
	  font-size: 60rpx;
	  font-weight: bold;
	  line-height: 60rpx;
  }
  .headConB{
	  display: flex;
	  align-items: center;
	  justify-content: center;
  }
  .headConBL{
	  font-size: 32rpx;
	  line-height: 32rpx;
	  margin-right: 20rpx;
	  color: white;
  }
  .headConBC,.headConBR{
	  height: 40rpx;
	  box-sizing: border-box;
	  padding: 0 20rpx;
	  border-radius: 20rpx;
	  border: 2rpx solid white;
	  font-size: 24rpx;
	  line-height: 36rpx;
	  color: white;
  }
  .headConBC{
	  /* margin-right: 20rpx; */
  }
</style>
