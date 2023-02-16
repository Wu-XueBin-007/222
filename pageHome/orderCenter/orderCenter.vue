<template>
	<view class="order">
		<navigator v-for="(item,index) in navList" class="nav" :key="index" :url="item.url">
			<view class="navLeft">
				<image :src="item.icon" mode=""></image>
				<view class="name">
					{{item.name}}
				</view>
			</view>
		</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navList: [{
						name: '商城订单',
						icon: 'https://oss.gzrhhj.com/10001/20230210/c6fd06e48ffd58daa0b275f3e2f02837.png',
						url: '/pageHome/order/index'
					},
					{
						name: '秒杀订单',
						icon: 'https://oss.gzrhhj.com/10001/20230210/cfacf48e68526744ed7389e4140fb19f.png',
						url: '/pageHome/order/index'
					},
					{
						name: '拼团订单',
						icon: 'https://oss.gzrhhj.com/10001/20230210/416e2eadec67f7987ae36ceb1c8c5932.png',
						url: '/pageHome/order/index'
					},
					{
						name: '盲盒订单',
						icon: 'https://oss.gzrhhj.com/10001/20230210/8e72ec25100107ce6beec931ddb7051b.png',
						url: '/pageHome/order/index'
					},
					{
						name: '高奢订单',
						icon: 'https://oss.gzrhhj.com/10001/20230210/7efbcd44ae7f058ab7cb0f3e11fca40d.png',
						url: '/pageHome/order/index'
					},
					{
						name: '会员订单',
						icon: 'https://oss.gzrhhj.com/10001/20230210/dbf9c8ab8978948be5553cc148faf785.png',
						url: '/pageHome/order/index'
					},
					{
						name: '大会员订单',
						icon: 'https://oss.gzrhhj.com/10001/20230210/3947b79c3c5b96fc8c4a3d359884877e.png',
						url: '/pageHome/order/index'
					},
				]
			};
		}
	}
</script>

<style lang="scss">
	.order {
		width: 100%;
		height: 100vh;
		background: white;
		padding: 52rpx 30rpx 30rpx;
		box-sizing: border-box;

		.nav {
			width: 100%;
			background: #FFFFFF;
			border: 1rpx solid #F3F3F3;
			border-radius: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 40rpx;
			box-sizing: border-box;
			margin-bottom: 30rpx;

			&::after {
				content: '';
				background: url('https://oss.gzrhhj.com/10001/20230210/2f6400df14a9db0131a3c4b9a9c29c02.png');
				background-size: cover;
				width: 40rpx;
				height: 40rpx;
			}

			.navLeft {
				display: flex;

				image {
					width: 40rpx;
					height: 40rpx;
				}

				.name {
					font-weight: 700;
					font-size: 28rpx;
					color: #333333;
					margin-left: 30rpx;
				}

			}
		}
	}
</style>
