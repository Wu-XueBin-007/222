<template>
	<goods-sku-popup :value="value" @input="onChangeValue" border-radius="20" :custom-action="findGoodsInfo"
		:mode="skuMode" :info_by_key=info_by_key :goodsId=goods.goods_id :defaultPrice="goods.goods_price_min"
		:defaultStock="goods.stock_total" :maskCloseAble="true" @open="openSkuPopup" @close="closeSkuPopup"
		:vip_group_order_id="vip_group_order_id" @add-cart="addCart" @buy-now="buyNow"
		:priceColor="type=='product'?'#EF343D  ':'#DD1010'" :bigId=bigId
		:buyNowBackgroundColor="type=='product'?'#EF343D  ':(((status==0||status==2)&&type=='seckill')?'#999999':'#DD1010')"
		:buyNowText="type=='seckill'?(status==0?'未开始':(status==1?'立即购买':'已结束')):(info_by_key?'立即签约':'立即购买')" />
</template>

<script>
	import {
		setCartTotalNum
	} from '@/utils/app'
	import * as CartApi from '@/api/cart'
	import GoodsSkuPopup from '@/components/goods-sku-popup'
	import * as seckillApi from "@/api/seckill/seckill.js"

	let goodsInfo;

	export default {
		components: {
			GoodsSkuPopup
		},
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			// true 组件显示 false 组件隐藏
			status: {
				Type: Number,
				default: 0
			},
			value: {
				Type: Boolean,
				default: false
			},
			// 模式 1:都显示 2:只显示购物车 3:只显示立即购买
			skuMode: {
				type: Number,
				default: 1
			},
			// 商品详情信息
			goods: {
				type: Object,
				default: {}
			},
			type: {
				type: String,
				default: "product"
			},
			LuckyFreeId: {
				type: String,
				default: ''
			},
			poolId: {
				type: String,
				default: ''
			},
			bigId: {
				type: String,
				default: ''
			},
			group_order_id: {
				type: Number,
				default: 0
			},
			info_by_key: {
				type: Number,
				default: 0
			},
			source: {
				type: String,
				default: ''
			},
			vip_group_order_id: {
				type: Number,
				default: 0
			}
		},

		data() {
			return {}
		},
		created() {

			const app = this
			const {
				goods
			} = app
			goodsInfo = {
				_id: goods.goods_id,
				name: goods.goods_name,
				goods_thumb: goods.goods_image,
				sku_list: app.getSkuList(),
				spec_list: app.getSpecList()
			}
		},

		methods: {

			// 监听组件显示隐藏
			onChangeValue(val) {
				this.$emit('input', val)
			},

			/**
			 * 获取商品信息
			 * 这里可以看到每次打开SKU都会去重新请求商品信息,为的是每次打开SKU组件可以实时看到剩余库存
			 */
			findGoodsInfo() {
				return new Promise((resolve, reject) => {
					// console.log(goodsInfo);return false;
					resolve(goodsInfo)
				})
			},

			// 整理商品SKU列表
			getSkuList() {
				const app = this
				const {
					goods: {
						goods_name,
						goods_image,
						skuList
					}
				} = app
				const skuData = []
				skuList.forEach(item => {
					if (app.type == 'product') {
						skuData.push({
							_id: item.id,
							goods_sku_id: item.goods_sku_id,
							goods_id: item.goods_id,
							goods_name: goods_name,
							image: item.image_url ? item.image_url : goods_image,
							// image: item.image.preview_url,
							price: item.goods_price,
							stock: item.stock_num,
							spec_value_ids: item.spec_value_ids,
							sku_name_arr: app.getSkuNameArr(item.spec_value_ids)
						})
					} else {
						skuData.push({
							_id: item.id,
							goods_sku_id: item.id,
							goods_id: item.goods_id,
							goods_name: goods_name,
							image: item.image_url ? item.image_url : goods_image,
							// image: item.image.preview_url,
							price: item.seckill_price,
							stock: item.seckill_stock,
							spec_value_ids: item.spec_value_ids,
							sku_name_arr: app.getSkuNameArr(item.spec_value_ids)
						})
					}
				})
				return skuData
			},

			// 获取sku记录的规格值列表
			getSkuNameArr(specValueIds) {
				const app = this
				const defaultData = ['默认']
				const skuNameArr = []
				if (specValueIds) {
					specValueIds.forEach((valueId, groupIndex) => {
						const specValueName = app.getSpecValueName(valueId, groupIndex)
						skuNameArr.push(specValueName)
					})
				}
				return skuNameArr.length ? skuNameArr : defaultData
			},

			// 获取指定的规格值名称
			getSpecValueName(valueId, groupIndex) {
				const app = this
				const {
					goods: {
						specList
					}
				} = app
				const res = specList[groupIndex].valueList.find(specValue => {
					return specValue.spec_value_id == valueId
				})
				return res.spec_value
			},

			// 整理规格数据
			getSpecList() {
				const {
					goods: {
						specList
					}
				} = this
				const defaultData = [{
					name: '默认',
					list: [{
						name: '默认'
					}]
				}]
				const specData = []
				specList.forEach(group => {
					const children = []
					group.valueList.forEach(specValue => {
						children.push({
							name: specValue.spec_value
						})
					})
					specData.push({
						name: group.spec_name,
						list: children
					})
				})
				// console.log(specData,"1111111111111111111111111");return false;
				return specData.length ? specData : defaultData
			},

			// sku组件 开始-----------------------------------------------------------
			openSkuPopup() {
				// //console.log("监听 - 打开sku组件")
			},

			closeSkuPopup() {
				// this.$emit('closeSkuPopup')
				// //console.log("监听 - 关闭sku组件")
			},

			// 加入购物车按钮
			addCart(selectShop) {
				const app = this
				const {
					goods_id,
					goods_sku_id,
					buy_num
				} = selectShop
				CartApi.add(goods_id, goods_sku_id, buy_num)
					.then(result => {
						// 显示成功
						app.$toast(result.message)
						// 隐藏当前弹窗
						app.onChangeValue(false)
						// 购物车商品总数量
						const cartTotal = result.data.cartTotal
						// 缓存购物车数量
						setCartTotalNum(cartTotal)
						// 传递给父级
						app.$emit('addCart', cartTotal)
					})
			},

			// 立即购买
			buyNow(selectShop) {
				// 跳转到订单结算页
				// console.log(this.goods);return false;
				// console.log(this.type)
				let type = ''
				console.log(selectShop, 'selectShop');
				if (this.type == 'product') {
					if (this.bigId == 1 || this.bigId == '') {
						this.$navTo('pages/checkout/index', {
							mode: 'buyNow',
							goodsId: selectShop.goods_id,
							goodsSkuId: selectShop.goods_sku_id,
							goodsNum: selectShop.buy_num,
							poolId: this.poolId,
							LuckyFreeId: this.LuckyFreeId,
							info_by_key: this.info_by_key, //成为创始合伙人/成为团长
							bigId: this.bigId,
							source: this.source,
							vip_group_order_id: this.vip_group_order_id
						})
					} else {
						this.$navTo('pages/checkout/index', {
							mode: 'buyNow',
							goodsId: selectShop.goods_id,
							goodsSkuId: selectShop.goods_sku_id,
							goodsNum: selectShop.buy_num,
							poolId: this.poolId,
							bigId: this.bigId,
							group_order_id: this.group_order_id,
							LuckyFreeId: this.LuckyFreeId,
							source: this.source,
							regionId: selectShop.regionId
						})
					}

				} else {
					if (this.status != 1) {
						if (this.status == 0) {
							uni.showToast({
								icon: 'none',
								title: "活动暂未开始"
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: "活动已结束"
							})
						}
						return false;
					}
					uni.navigateTo({
						url: "/pageSecKill/sureOrder/sureOrder?mode=buyNow&goodsId=" + selectShop.goods_id +
							"&goodsSkuId=" + selectShop.goods_sku_id + "&goodsNum=" + selectShop.buy_num +
							"&secid=" + this.goods.seckill_id + "&timeid=" + this.goods.timeId
					})
					// this.$navTo('pageSeckill/sureOrder/sureOrder', {
					//   mode: 'buyNow',
					//   goodsId: selectShop.goods_id,
					//   goodsSkuId: selectShop.goods_sku_id,
					//   goodsNum: selectShop.buy_num
					// })
				}
				// 隐藏当前弹窗
				this.onChangeValue(false)

			}

		}
	}
</script>

<style lang="scss" scoped>

</style>
