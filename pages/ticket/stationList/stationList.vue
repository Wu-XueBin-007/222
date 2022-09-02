<template>
	<view>
		<view class="head">
			<view :class="['prev',prevFlag?'active':'']" @click="toPrev">前一天</view>
			
			<picker mode="date" @change="choiceDate" :start="startTimes" :value="startTime">
				<view class="nowDate">
					<image src="../../../static/user/ticket_icon_calendar.png"></image>
					<view class="dates">{{timeStr}}</view>
					<view class="week">{{week}}</view>
				</view>
			</picker>
			<view class="next" @click="toNext">后一天</view>
		</view>
		<view class="con">
			<view class="conItem" v-for="(item,index) in list" :key="index" :data-index="index" @click="toSubmit" v-if="item.queryLeftNewDTO.controlled_train_flag==0&&index<page*10">
				<view class="conItemT">
					<view class="conItemTL">
						<view>{{item.queryLeftNewDTO.start_time}}</view>
						<view>
							<image src="../../../static/user/ticket_lab_shi.png" v-if="item.queryLeftNewDTO.from_station_telecode == item.queryLeftNewDTO.start_station_telecode"></image>
							<image src="../../../static/user/ticket_lab_guo.png" v-else></image>
							<text>{{item.queryLeftNewDTO.from_station_name}}</text>
						</view>
					</view>
					<view class="conItemTC">
						<view>
							<text>{{item.queryLeftNewDTO.station_train_code}}</text>
							<text>历时：{{item.queryLeftNewDTO.lishi}}</text>
						</view>
						<image src="../../../static/user/ticket_icon_goto.png"></image>
					</view>
					<view class="conItemTL">
						<view>{{item.queryLeftNewDTO.arrive_time}}</view>
						<view>
							<image src="../../../static/user/ticket_lab_guo.png" v-if="item.queryLeftNewDTO.to_station_telecode != item.queryLeftNewDTO.end_station_telecode"></image>
							<image src="../../../static/user/ticket_lab_zhong.png" v-else></image>
							<text>{{item.queryLeftNewDTO.to_station_name}}</text>
						</view>
					</view>
				</view>
				<view class="conItemB" v-if="item.queryLeftNewDTO.station_train_code_type==1">
					<view>商务:<text>{{item.queryLeftNewDTO.swz_num=='有'?'有':(item.queryLeftNewDTO.swz_num>0?(item.queryLeftNewDTO.swz_num+'张'):'无')}}</text></view>
					<view>一等:<text>{{item.queryLeftNewDTO.zy_num=='有'?'有':(item.queryLeftNewDTO.zy_num>0?(item.queryLeftNewDTO.zy_num+'张'):'无')}}</text></view>
					<view>二等:<text>{{item.queryLeftNewDTO.ze_num=='有'?'有':(item.queryLeftNewDTO.ze_num>0?(item.queryLeftNewDTO.ze_num+'张'):'无')}}</text></view>
					<view>无座:<text>{{item.queryLeftNewDTO.wz_num=='有'?'有':(item.queryLeftNewDTO.wz_num>0?(item.queryLeftNewDTO.wz_num+'张'):'无')}}</text></view>
				</view>
				<view class="conItemB" v-else>
					<view>软卧:<text>{{item.queryLeftNewDTO.rw_num=='有'?'有':(item.queryLeftNewDTO.rw_num>0?(item.queryLeftNewDTO.rw_num+'张'):'无')}}</text></view>
					<view>硬卧:<text>{{item.queryLeftNewDTO.yw_num=='有'?'有':(item.queryLeftNewDTO.yw_num>0?(item.queryLeftNewDTO.yw_num+'张'):'无')}}</text></view>
					<view>硬座:<text>{{item.queryLeftNewDTO.yz_num=='有'?'有':(item.queryLeftNewDTO.yz_num>0?(item.queryLeftNewDTO.yz_num+'张'):'无')}}</text></view>
					<view>无座:<text>{{item.queryLeftNewDTO.wz_num=='有'?'有':(item.queryLeftNewDTO.wz_num>0?(item.queryLeftNewDTO.wz_num+'张'):'无')}}</text></view>
				</view>
			</view>
			<view style="padding-top: 100upx;text-align: center;" v-if="list.length == 0">暂无可乘车次</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				prevFlag:false,
				startInfo:{},
				endInfo:{},
				startTimes:"",
				startTime:"",
				week:"",
				timeStr:"",
				list:[],
				page:1,
				bottomFlag:false
			}
		},
		onLoad() {
			this.startTimes = this.getDate(new Date());
			let stationInfo = uni.getStorageSync("stationInfo");
			this.startInfo = stationInfo.start;
			this.endInfo = stationInfo.end;
			this.startTime = stationInfo.time;
			this.getInfo()
			this.getList()
		},
		onReachBottom() {
			if(this.bottomFlag){
				return false;
			}
			this.bottomFlag = true;
			this.page = this.page + 1;
			this.bottomFlag = false;
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
			toSubmit(e){
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				uni.setStorageSync("stationData",this.list[index]);
				// 高铁1，火车2，飞机3
				this.$navTo("pages/ticket/index",{type:this.list[index].queryLeftNewDTO.station_train_code_type})
			},
			getList(){
				let _this = this;
				uni.showLoading({
					title:"加载中..."
				})
				uni.request({
					method:"GET",
					data:{'leftTicketDTO.train_date':_this.startTime,'leftTicketDTO.from_station':_this.startInfo.id,'leftTicketDTO.to_station':_this.endInfo.id,'leftTicketDTO.ticket_type':1},
					url:"https://kyfw.12306.cn/otn/leftTicketPrice/query",
					success(res) {
						//console.log(res)
						
						if(res.data.messages.length>0){
							uni.showToast({
								icon:'none',
								title:res.data.messages[0],
								duration:2000
							})
						}
						_this.list = res.data.data.map(cur=>{
							if(cur.queryLeftNewDTO.station_train_code.indexOf("G")!=-1||cur.queryLeftNewDTO.station_train_code.indexOf("C")!=-1||cur.queryLeftNewDTO.station_train_code.indexOf("D")!=-1){
								cur.queryLeftNewDTO.station_train_code_type = 1;
							}else{
								cur.queryLeftNewDTO.station_train_code_type = 2;
							}
							return cur;
						});
						uni.hideLoading()
					}
				})
			},
			toPrev(){
				if(this.prevFlag){
					return false;
				}
				let start = new Date(this.startTime).getTime();
				start = start - 24*60*60*1000;
				this.startTime = this.getDate(start);
				let stationInfo = uni.getStorageSync("stationInfo");
				stationInfo.time = this.startTime;
				uni.setStorageSync("stationInfo",stationInfo)
				this.getInfo();
				this.getList();
			},
			toNext(){
				let start = new Date(this.startTime).getTime();
				start = start + 24*60*60*1000;
				this.startTime = this.getDate(start);
				let stationInfo = uni.getStorageSync("stationInfo");
				stationInfo.time = this.startTime;
				uni.setStorageSync("stationInfo",stationInfo)
				this.getInfo();
				this.getList();
			},
			choiceDate(e){
				this.startTime = e.detail.value;
				let stationInfo = uni.getStorageSync("stationInfo");
				stationInfo.time = this.startTime;
				uni.setStorageSync("stationInfo",stationInfo)
				this.getInfo()
				this.getList();
			},
			getDate(time){
				let times = new Date(time);
				let year = times.getFullYear();
				let month = (times.getMonth() + 1) > 9 ? (times.getMonth() + 1) : '0' + (times.getMonth() + 1);
				let day = times.getDate() > 9 ? times.getDate() : '0' + times.getDate();
				return year + "-" + month + "-" + day;
			},
			getInfo(){
				this.timeStr = this.startTime.split("-")[1] + "月" + this.startTime.split("-")[2] + "日";
				let week = new Date(this.startTime).getDay();
				if(week == 0){
					this.week = "周日";
				}else if(week == 1){
					this.week = "周一";
				}else if(week == 2){
					this.week = "周二";
				}else if(week == 3){
					this.week = "周三";
				}else if(week == 4){
					this.week = "周四";
				}else if(week == 5){
					this.week = "周五";
				}else if(week == 6){
					this.week = "周六";
				}
				let nowTime = this.getDate(new Date());
				if(this.startTime == nowTime){
					this.prevFlag = true;
				}else{
					this.prevFlag = false;
				}
			}
		}
	}
</script>

<style>
	.conItem{
		width: 100%;
		margin-top: 16upx;
		background: white;
		box-sizing: border-box;
		padding: 0 24upx;
	}
	.conItemT{
		width: 100%;
		height: 140upx;
		box-sizing: border-box;
		border-bottom: 2upx solid #EFEFEF;
		padding: 0 16upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.conItemTL>view:nth-child(1){
		font-size: 32upx;
		line-height: 32upx;
		color: #333333;
		margin-bottom: 8upx;
		font-weight: bold;
	}
	.conItemTL>view:nth-child(2){
		display: flex;
		align-items: center;
		
	}
	.conItemTL>view:nth-child(2)>image{
		width: 24upx;
		height: 24upx;
		margin-right: 4upx;
	}
	.conItemTL>view:nth-child(2)>text{
		font-size: 24upx;
		line-height: 24upx;
	}
	.conItemTC>view:nth-child(1){
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.conItemTC>view:nth-child(1)>text:nth-child(1){
		font-size: 24upx;
		line-height: 24upx;
		margin-right: 12upx;
	}
	.conItemTC>view:nth-child(1)>text:nth-child(2){
		font-size: 24upx;
		line-height: 24upx;
	}
	.conItemTC>image{
		width: 196upx;
		height: 6upx;
		margin-top: 12upx;
	}
	.conItemB{
		width: 100%;
		height: 84upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 12upx;
		font-size: 20upx;
		line-height: 20upx;
		color: #333333;
	}
	
	
	.head{
		width: 100%;
		height: 92upx;
		box-sizing: border-box;
		padding: 0 36upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: white;
	}
	.prev{
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
	}
	.prev.active{
		color: #D0D0D0;
	}
	.next{
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
	}
	.nowDate{
		display: flex;
		align-items: center;
		position: relative;
	}
	.nowDate>image{
		width: 28upx;
		height: 28upx;
		margin-right: 16upx;
	}
	.dates{
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
		margin-right: 16upx;
	}
	.week{
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
	}
	.nowDate::after{
		width: 72upx;
		height: 4upx;
		border-radius: 4upx;
		background: #ff5060;
		content: "";
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: -18upx;
	}
</style>
