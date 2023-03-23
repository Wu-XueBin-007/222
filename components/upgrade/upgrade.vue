<template>
	<view @click="closeModule" v-if="display" class="upgradeBox">
		<view class="imgModule">
			<image src="https://oss.gzrhhj.com/10001/20230323/fb52800c1934da649b890a7b68800189.png" mode="widthFix">
			</image>
			<button class="upgradeBtn">立即升级</button>
			<view class="close">
				<image @click="closeModule" class="closeImg" style="width: 40rpx;height: 40rpx;"
					src="../../static/home/close_icon.png" mode="widthFix">
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "upgrade",
		data() {
			return {
				display: false
			};
		},
		methods: {
			closeModule() {
				this.display = false
			}
		}
	}
</script>

<style lang="less">
	.upgradeBox {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		background: rgba(0, 0, 0, 0.2);

		.imgModule {
			background: white;
			border-radius: 12rpx;
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			// display: flex;
			// align-items: center;
			// justify-content: center;

			.close {
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 4rpx;
				height: 40rpx;
				background: #3333333;

				.closeImg {
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
				}
			}

			.upgradeBtn {
				background: red;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				font-size: 24rpx;
			}

		}
	}
</style>
