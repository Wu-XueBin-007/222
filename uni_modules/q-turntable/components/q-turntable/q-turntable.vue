<template>
	<view>
		<view class="turntable_wp sol-class">
			<image src="https://oss.gzrhhj.com/10001/20230328/15c88e65cf0caac6c21c070a9d30765a.png"
				:style="'-webkit-transform:rotate(' + deg + 'deg) translateZ(0);transform:rotate(' + deg + 'deg) translateZ(0)'">
			</image>
			<view class="turntable_pointer" @tap="start">
				<image src="https://oss.gzrhhj.com/10001/20230327/f8f26c9d132ac4e78e81806117ff2651.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deg: 0,
				singleAngle: '',
				// 每片扇形的角度
				isStart: false
			};
		},

		components: {},
		props: {
			// 划分区域
			areaNumber: {
				type: Number,
				default: 6
			},
			// 速度
			speed: {
				type: Number,
				default: 16
			}
		},

		beforeMount() {
			this.init();
		},

		methods: {
			init() {
				let {
					areaNumber
				} = this;
				const singleAngle = 360 / areaNumber;
				this.singleAngle = singleAngle;
			},

			// 点击开始抽奖
			start() {
				this.$emit('start');
			},

			begin(awardNumer) {
				var deg = this.deg;
				var singleAngle = this.singleAngle;
				var speed = this.speed;
				var isStart = this.isStart;
				if (isStart) return;
				this.isStart = true;
				let endAddAngle = 0;
				endAddAngle = 360 - ((awardNumer - 1) * singleAngle + singleAngle / 2); // 中奖角度
				const rangeAngle = (Math.floor(Math.random() * 4) + 4) * 360; // 随机旋转几圈再停止
				console.log(endAddAngle);
				let cAngle;
				deg = 0;
				this.timer = setInterval(() => {
					if (deg < rangeAngle) {
						deg += speed;
					} else {
						cAngle = (endAddAngle + rangeAngle - deg) / speed;
						cAngle = cAngle > speed ? speed : cAngle < 1 ? 1 : cAngle;
						deg += cAngle;

						if (deg >= endAddAngle + rangeAngle) {
							deg = endAddAngle + rangeAngle;
							this.isStart = false;
							clearInterval(this.timer);
							this.$emit('success');
						}
					}

					this.deg = deg;
				}, 1000 / 60);
			}
		}
	};
</script>
<style>
	.turntable_wp {
		width: 610rpx;
		height: 610rpx;
		position: relative;
		margin: 0 auto;
	}

	.turntable_wp image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.turntable_wp .turntable_pointer {
		position: absolute;
		width: 150rpx;
		height: 150rpx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
