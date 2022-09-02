<template>
	<view >
		<view class="voucher">
			<image :src="goodsOrderDetail.couponsImage.preview_url" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import * as VipCardApi from '@/api/teledcard/vipCard'
	export default {
		data() {
			return {
				goodsOrderDetail:{}
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getGoodsOrderList();
		},
		methods: {
			getGoodsOrderList(){
			  const app = this
			  VipCardApi.goodsOrderDetail({id:this.id})
				.then(result => {
				   console.log(result)
				   app.goodsOrderDetail=result.data.details;
				  // 显示领取成功提示
				  // app.$success(result.message)
				  // 刷新优惠券列表
				  // app.getCouponList(false)
				}) 
			},
		}
	}
</script>

<style scoped>
.voucher{
	width: 702upx;
	margin: 32upx auto 0;
	background-color: #ff5060;
}
.voucher>image{
	width: 100%;
}
</style>
