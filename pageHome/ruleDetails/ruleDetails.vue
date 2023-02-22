<template>
	<view class="box">
		<view v-html="group_rules" style="padding: 30upx;box-sizing: border-box;">
		</view>
	</view>
</template>

<script>
	import * as settingApi from '@/api/ticket/setting'
	export default {
		data() {
			return {
				group_rules: ''
			};
		},
		mounted() {
			this.getCommon()
		},
		methods: {
			getCommon() {
				settingApi.detail().then(res => {
					console.log(res);
					this.group_rules = res.data.detail.group_rules.replace(/<img/g, "<img style='width: 100%;'");
					console.log(this.group_rules, 'this.group_rules');
				})
			},
		}
	}
</script>

<style lang="scss">
	.box {
		width: 100%;
		height: 100%;
	}
</style>
