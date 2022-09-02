<template>
	<view>
		<view class="aboutMessage">
			<view class="aboutIcon">
				<image src="../../static/icon/trademark.png" mode=""></image>
			</view>
			<view class="edition">
				版本 2.0.8
			</view>
		</view>
	     <view class="setUp-item-footer" @click="toService">
	     	<view class="setUp-lable">服务协议</view>
	     	<view class="setUp-yhq">
	     		<view class="setUp-head-icon">
	     			<image src="../../static/icon/more_gray.png"></image>
	     		</view>
	     	</view>
	     </view>
			 <view class="setUp-item-footer" @click="toPrivacy">
			 	<view class="setUp-lable">隐私协议</view>
			 	<view class="setUp-yhq">
			 		<view class="setUp-head-icon">
			 			<image src="../../static/icon/more_gray.png"></image>
			 		</view>
			 	</view>
			 </view>	
			 <view class="setUp-item-footer">
			 	<view class="setUp-lable">当前版本号</view>
			 	<view class="setUp-yhq">
			 		<!-- <view class="setUp-head-icon">
			 			<image src="../../static/icon/more_gray.png"></image>
			 		</view> -->
					V2.0.8
			 	</view>
			 </view>	
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		
		methods:{
			toService(){
				uni.navigateTo({
					url:'./serviceAgreement'
				})
			},
			toPrivacy(){
				uni.navigateTo({
					url:'./privacyAgreement'
				})
			}
		}
	}
</script>

<style scoped>
	.aboutMessage{
		width: 750upx;
		height: 394upx;
		padding-top: 100upx;
	}
	.aboutIcon{
		width: 160upx;
		height: 160upx;
		margin: 0 auto;
	}
	.aboutIcon>image{
		width: 100%;
		height: 100%;
	}
	.edition{
		width: 116upx;
		height: 34upx;
		margin: 0 320upx;
		font-size: 24upx;
		color: #999999;
	}
	.setUp-item-footer {
		display: flex;
		background-color: #FFFFFF;
		flex-direction: row;
		justify-content: space-between;
		/* margin-top: 10px; */
		line-height: 80upx;
		text-align: center;
		padding: 0 30upx;
	}
	
	.texts {
		font-size: 24upx;
		color: #DB0B0B;
	}
	
	.setUp-yhq {
		display: flex;
		flex-direction: row;
		font-size: 28upx;
		color: #333333;
		font-weight: 400;
		
	}
	
	.setUp-yhq>text {
		color: #808080;
		font-size: 24upx;
	}
	
	.setUp-head-icon {
		/* margin-top: 4upx; */
		margin-left: 10upx;
	}
	
	.setUp-head-icon>image {
		width: 14upx;
		height: 22upx;
	}
	
	.home-popup2 {
			width: 528upx;
			position: fixed;
			top: 50%;
			/* left: 50%; */
			/* transform: translate(-50%,-50%); */
			z-index: 2000;
		}
		
		.home-box2 {
			width: 100%;
			// height: 512upx;
		}
		.home-box2>image{
			width: 100%;
			height: 100%;
		}
		.home-popup2-close {
			width: 48upx;
			height: 48upx;
			margin: 0 auto 0;
		}
		
		.home-popup2-close>image {
			width: 100%;
			height: 100%;
			vertical-align: top;
		}
</style>
