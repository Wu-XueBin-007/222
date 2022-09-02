<template>
	<view class="binding">
		<!-- <view class="binding-head">
			<view class="binding-head-text">
				修改昵称
			</view>
		</view> -->
		<view class="binding-centre">
			<view class="binding-main">
				<view class="binding-item">
					<image src="../../static/tabbar/user.png" mode=""></image>
					<input name="nick_name" v-model="nick_name" type='text' placeholder="请输入昵称" />
				</view>
				<view class="binding-btn">
					<view @click="btn_binding">确认修改</view>
				</view>
			</view>
		</view>
		<view  style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F5F5F5;z-index: -1;"
					 catchtouchmove="true"></view>
	</view>
</template>

<script>
	import {edit_nick_name} from "@/api/user.js"
	export default {
		data() {
			return {
				nick_name:""
			}
		},
		onLoad(options) {
			this.nick_name = options.nick_name;
		},
		components: {
			
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
			//小程序
			btn_binding(){
				if(!this.nick_name){
					uni.showToast({
						icon:'none',
						title:"请输入昵称",
						duration:2000
					})
					return false;
				}
				edit_nick_name({nick_name:this.nick_name})
					.then(res=>{
						uni.showToast({
							icon:'none',
							title:res.message,
							duration:2000
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},1500)
					})
					.catch(err=>{
						uni.showToast({
							icon:'none',
							title:err.message,
							duration:2000
						})
					})
			}
		}
	}
</script>

<style scoped>
	.binding {
		width: 100%;
		background-color: #F1F1F5;
	}

	.line {
		width: 95%;
		height: 2upx;
		display: inline-block;
		margin: 0 auto;
		background-color: #f2f2f2;
		text-align: center;
	}

	.binding-centre {
		background-color: #FFFFFF;
	}
	.binding-head{
		background-color: #FFFFFF;
		padding: 20upx 0;
	}
	.binding-head-text{
		font-size: 28upx;
		color: #909090;
		margin-left: 30upx;
		padding-left: 8upx;
		border-left: 8upx solid #EF343D;
	}
	.binding-main {
		padding-left: 30upx;
		padding-bottom: 30upx;
		background-color: #FFFFFF;
	}


	.binding-item {
		padding: 30upx 0 0 0;
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
	}

	.binding-item>image {
		width: 32upx;
		height: 32upx;
		vertical-align: top;
	}

	.binding-item>input {
		width: 72%;
		padding-left: 28upx;
		font-size: 32upx;
		color: #616161;
		margin-top: -10upx;
	}

	.binding-item1 {
		padding: 30upx 30upx 0 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: #FFFFFF;
	}

	.binding-item1>image {
		width: 32upx;
		height: 32upx;
		vertical-align: top;
	}

	.binding-item1>input {
		width: 66%;
		font-size: 32upx;
		color: #616161;
		margin-top: -10upx;
	}

	.binding-item1-btn {
		font-size: 24upx;
		color: #EF343D;
		border-left: 2upx solid #F1F1F5;
		padding-left: 30upx;
		line-height: 36upx;
	}
	.binding-item1-btn1{
		font-size: 24upx;
		color: #666666;
	}

	.binding-btn{
		margin-top: 48upx;
	}
	.binding-btn view{
		width: 690upx;
		height: 92upx;
		background-color: #EF343D;
		border-radius: 46upx;
		color: #FFFFFF;
		font-size: 28upx;
		line-height: 92upx;
		text-align: center;
		
	}
</style>
