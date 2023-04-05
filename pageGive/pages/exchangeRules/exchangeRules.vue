<template>
	<view v-html="group_rules" style="padding: 20rpx;">

	</view>
</template>

<script>
	import * as settingApi from '@/api/exchange'
	export default {
		data() {
			return {
				group_rules: ''
			};
		},
		onLoad() {
			settingApi.rule({}).then(res => {
				this.group_rules = res.data.rule.replace(/<img/g, "<img style='width: 100%;'");
				console.log(this.group_rules, 'this.group_rules');
			})
		}
	}
</script>

<style lang="scss">

</style>
