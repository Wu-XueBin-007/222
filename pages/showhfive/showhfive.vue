<template>
	<view>
		 <web-view :src="url"></web-view>
	</view>
</template>

<script>
	import store from '@/store'
	import {encryptDes} from "@/utils/crypto.js"
	import {decryptDes} from "@/utils/crypto.js"
	export default {
		data() {
			return {
				 url:''
			}
		},
		onLoad(val) {
			let id = encryptDes(this.$store.getters.userId.toString(), "gzrh2022")
			// console.log(encryptDes('10015', "gzrh2022"),decryptDes('nr/mTBgvYnE=','gzrh2022'),111)
			var timestamp = Date.parse(new Date());
			let urls=val.url+'?userid='+encodeURIComponent(id)+'&t='+timestamp;
			console.log(urls)
			this.url=urls;
			// 设置当前的title 如果外链中有的话将被覆盖
			if(this.isNotEmpty('钱包')){
				this.setTitle('钱包');
			}
		},
		methods: {
			isNotEmpty(obj) {
				if (typeof obj == undefined || obj == null || obj == "" || obj == "undefined" || obj.length == 0) {
					return false;
				} else {
					return true;
				}
			},
			// 设置title
			setTitle(title) {
				uni.setNavigationBarTitle({
					title: title
				})
			},
		}
	}
</script>

<style>

</style>
