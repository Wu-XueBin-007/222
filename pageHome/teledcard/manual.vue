<template>
	<view class="manual" style="display: flex;justify-content: center;padding: 132upx 0 50upx;background: linear-gradient(270deg, #6FA3FF 0%, #76D0FF 100%);">
		<!-- <view style="padding: 0 30upx;height: 88upx;position: fixed;top: 44upx;left: 0;display: flex;align-items: center;">
			<image src="../../static/back_white.png" style="width: 40upx;height: 40upx;" @click="back"></image>
		</view> -->
		<!-- <image src="https://oss.gzrhhj.com/10001/221f1e456ad667835ae274fe10d1713.png" mode="widthFix" style="width: 654upx;"></image> -->
		<image :src="setting.TollCardImageId.preview_url" mode="widthFix" style="width: 654upx;"></image>
	</view>
</template>

<script>
	import * as Rapi from '@/api/home/rotation'
	export default {
		data() {
			return {
				setting:{}
			}
		},
		onLoad() {
			this.getSetting();
		},
		methods: {
			// 获取商城设置
			getSetting() {
				const app = this
				return new Promise((resolve, reject) => {
					Rapi.info().then(setting => {
						app.setting = setting.data.storeInfo
						resolve(setting)
					}).catch(reject)
				})
			},
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style>

</style>
