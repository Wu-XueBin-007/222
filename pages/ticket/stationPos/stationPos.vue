<template>
	<view style="padding: 60upx 24upx 130upx;box-sizing: border-box;height: 100vh;background: white;">
		<view class="start_station" @click="choiceStation" data-type="start">
			<image src="../../../static/user/start_station.png" class="start_station_img"></image>
			<view class="start_station_txt">
				<view>出发站点</view>
				<view>{{startInfo.name?startInfo.name:'请选择出发站点'}}</view>
			</view>
			<image src="../../../static/user/ticket_button_exchange.png" class="start_station_ex" @click.stop="exchange"></image>
		</view>
		<view class="start_station" @click="choiceStation" data-type="end">
			<image src="../../../static/user/end_station.png" class="start_station_img"></image>
			<view class="start_station_txt">
				<view>目标站点</view>
				<view>{{endInfo.name?endInfo.name:'请选择目标站点'}}</view>
			</view>
		</view>
		<picker mode="date" @change="choiceDate" :start="startTime">
			<view class="start_station" style="padding-left: 56upx;">
				<image src="../../../static/user/ticket_icon_calendar.png" class="start_station_img1"></image>
				<view class="start_station_txt">
					<view>出发日期</view>
					<view>{{pickerTime?pickerTime:'请选择'}}</view>
				</view>
			</view>
		</picker>
		<view class="nowCheck" @click="nowCheck">立即查询</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				startTime:"",
				pickerTime:"",
				startInfo:{},
				endInfo:{}
			}
		},
		onLoad() {
			this.startTime = this.getDate(new Date());
			this.pickerTime = this.startTime;
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
			exchange(){
				let data = this.startInfo;
				this.startInfo = this.endInfo;
				this.endInfo = data;
			},
			getDate(time){
				let times = new Date(time);
				let year = times.getFullYear();
				let month = (times.getMonth() + 1) > 9 ? (times.getMonth() + 1) : '0' + (times.getMonth() + 1);
				let day = times.getDate() > 9 ? times.getDate() : '0' + times.getDate();
				return year + "-" + month + "-" + day;
			},
			choiceDate(e){
				//console.log(e)
				this.pickerTime = e.detail.value;
			},
			choiceStation(e){
				let type = e.target.dataset.type || e.currentTarget.dataset.type;
				this.$navTo("pages/ticket/sreach/sreach",{type});
			},
			nowCheck(){
				if(!this.startInfo.id){
					uni.showToast({
						icon:'none',
						duration:2000,
						title:'请选择出发站点'
					})
					return false;
				}
				if(!this.endInfo.id){
					uni.showToast({
						icon:'none',
						duration:2000,
						title:'请选择目标站点'
					})
					return false;
				}
				if(this.startInfo.id == this.endInfo.id){
					uni.showToast({
						icon:'none',
						duration:2000,
						title:'出发站点和目标站点不能一致'
					})
					return false;
				}
				let obj = {};
				obj.start = this.startInfo;
				obj.end = this.endInfo;
				obj.time = this.pickerTime;
				uni.setStorageSync("stationInfo",obj)
				this.$navTo("pages/ticket/stationList/stationList")
			}
		}
	}
</script>

<style scoped>
	.nowCheck{
		width: 100%;
		height: 100upx;
		position: fixed;
		left: 0;
		bottom: 0;
		line-height: 100upx;
		text-align: center;
		font-size: 24upx;
		color: white;
		background: #ff5060;
	}
	.start_station_img1{
		width: 28upx;
		height: 28upx;
		margin-right: 30upx;
	}
	.start_station{
		width: 100%;
		border: 2upx solid #EFEFEF;
		border-radius: 24upx;
		box-sizing: border-box;
		height: 140upx;
		display: flex;
		align-items: center;
		padding: 0 60upx;
		position: relative;
		margin-bottom: 40upx;
	}
	.start_station_img{
		width: 24upx;
		height: 68upx;
		margin-right: 30upx;
	}
	.start_station_txt{
		height: 68upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.start_station_txt>view:nth-child(1){
		font-size: 24upx;
		line-height: 24upx;
		color: #D0D0D0;
	}
	.start_station_txt>view:nth-child(2){
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
	}
	.start_station_ex{
		width: 88upx;
		height: 88upx;
		position: absolute;
		right: 60upx;
		bottom: 0;
		transform: translateY(64upx);
		z-index: 99;
	}
</style>
