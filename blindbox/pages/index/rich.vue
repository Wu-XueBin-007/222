<template>
	<view class="rich">
		<view v-html="blindbox_auth_rules" style="padding: 30upx;box-sizing: border-box;">
			
		</view>
	</view>
</template>

<script>
	// import * as boxApi from "@/api/blindbox/index.js";
	import * as settingApi from '@/api/ticket/setting'
	const App = getApp();
	export default {
		data() {
			return {
				blindbox_auth_rules: '',
			}
		},
		onLoad(){
			this.getCommon();
			uni.setStorageSync('agreementState',true)
		},
		methods: {
			getCommon(){
				settingApi.detail().then(res=>{
					this.blindbox_auth_rules = res.data.detail.blindbox_auth_rules.replace(/<img/g,"<img style='width: 100%;'");
				})
			},
		}
	}
</script>

<style scoped>
	.{
		
	}
</style>