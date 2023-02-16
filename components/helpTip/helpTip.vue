<template>
	<view  @click.stop="close" class="mask">
		<view class="contentWrap">
			<view class="title">
				<view class="titleText">
					{{title}}
				</view>
				<u-icon  @click.stop="close" name="close"></u-icon>
			</view>
			<text class="content">
				{{content}}
			</text>
		</view>
	</view>

</template>

<script>
	export default {
		props:{
			content:{
				default:'',
				type:String
			},
			title:{
				default:'',
				type:String
			}
		},
		name:"helpTip",
		data() {
			return {
				
			};
		},
		methods:{
			close(){
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss">
.mask{
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: transparent;
	z-index: 100;
}
	.contentWrap{
		background: #ffffff;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		width: calc(100% - 150rpx);
		height: 292rpx;
		border: 2rpx solid #99999940;
		border-radius: 20rpx;
		.title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 8rpx 0;
			.titleText{
				font-size: 32rpx;
			}
		}
	}
</style>