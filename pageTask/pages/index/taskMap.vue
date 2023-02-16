<template>
	<view class="taskMap">
		<view class="taskMap-main">
			<view class="taskMap-img">
				<image src="../../static/logo.png" mode=""></image>
			</view>
			<view class="taskMap-content">
				<view class="taskMap-text1">
					请复制链接到PC端开通
				</view>
				<view class="taskMap-text2">
					{{advertUrl}}
				</view>
			</view>
			<view class="taskMapBtn" @click="copyConnection">
				复制
			</view>
			
			<view class="taskMap-text3">
				<button open-type="contact">联系客服</button>
			</view>
		</view>
		<view style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background:#EF343D   ;z-index: -1;" catchtouchmove="true"></view>
	</view>
</template>

<script>
	import * as taskApi from "@/api/task/index.js";
	import * as settingApi from '@/api/ticket/setting'
	const App = getApp();
	export default {
		data() {
			return {
				advertUrl: {},
			}
		},
		onLoad(){
			this.getAurl();
			// uni.setStorageSync('agreementState',true)
		},
		methods: {
			getAurl(){
				taskApi.advert_register().then(res=>{
					console.log(res)
					this.advertUrl = res.data.url
				})
			},
			copyConnection(){
				var _this=this;
				// #ifndef H5
				uni.getClipboardData({
					success: (res) => {
						console.log(res)
					}
				})
				uni.setClipboardData({
					data:_this.advertUrl,
					success: () => {
						
					}
				})
				// #endif
				// #ifdef H5
				var textarea=document.createElement("textarea")
				textarea.value=_this.advertUrl
				textarea.readOnly="readOnly"
				document.body.appendChild(textarea)
				textarea.select()
				textarea.setSelectionRange(0,_this.advertUrl.length)
				document.execCommand("copy")
				textarea.remove()
				// #endif
			}
		}
	}
</script>

<style scoped>
	.taskMap{
		background-color: #EF343D  ;
	}
	.taskMap-main{
		width: 578upx;
		height: 712upx;
		background-color: #FFFFFF;
		border-radius: 40upx;
		margin: 116upx auto 0;
	}
	.taskMap-img{
		width: 240upx;
		padding-top: 66rpx;
		margin: 0 auto 60upx;
	}
	.taskMap-img image{
		width: 240upx;
		height: 200upx;
		vertical-align: top;
	}
	.taskMap-content{
		padding: 0 24upx;
	}
	.taskMap-text1{
		font-size: 30upx;
		color: #666666;
		text-align: center;
	}
	.taskMap-text2{
		font-size: 24upx;
		color: #666666;
		text-align: center;
		margin-top: 22upx;
	}
	.taskMapBtn{
		width: 284upx;
		height: 80upx;
		background-color: #EF343D  ;
		text-align: center;
		line-height: 80upx;
		border-radius: 40upx;
		color: #FFFFFF;
		margin: 64upx auto 0;
	}
	.taskMap-text3{
		margin-top: 22upx;
	}
	.taskMap-text3 button{
		width: 240upx;
		text-align: center;
		font-size: 30upx;
		color: #666666;
		background-color: #FFFFFF;
	}
</style>