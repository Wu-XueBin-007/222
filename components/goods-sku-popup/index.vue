<template>
	<view class="goods-sku-popup popup" catchtouchmove="true" :class="(value && complete) ? 'show' : 'none'"
		@touchmove.stop.prevent="moveHandle">
		<!-- 页面内容开始 -->
		<view class="mask" @click="close('mask')"></view>
		<!-- 页面开始 -->
		<view class="layer attr-content" :style="'border-radius: '+borderRadius+'rpx '+borderRadius+'rpx 0 0;'">
			<view class="specification-wrapper">
				<scroll-view class="specification-wrapper-content" scroll-y="true">
					<view class="specification-header">
						<view class="specification-left">
							<image class="product-img"
								:src="selectShop.image ? selectShop.image : goodsInfo[goodsThumbName]"
								mode="aspectFill"></image>
						</view>
						<view class="specification-right">
							<view class="price-content" :style="'color: '+priceColor+' ;'">
								<text class="sign">¥</text>
								<text class="price">{{ (selectShop.price || defaultPrice) | priceFilter }}</text>
							</view>
							<view class="inventory"> <text
									style="color: #333333;font-weight: bold;">{{ stockText }}</text>
								：{{ selectShop[stockName] || defaultStock }}</view>
							<view class="choose"
								v-show="goodsInfo[specListName] && goodsInfo[specListName][0].name !== defaultSingleSkuName">
								<text v-if="!selectArr.every(val => val == '')"> <text
										style="color: #333333;font-weight: bold;">已选：</text>
									{{ selectArr.join(' ') }}</text>
							</view>
						</view>
					</view>

					<view class="specification-content">
						<view v-show="goodsInfo[specListName][0].name !== defaultSingleSkuName"
							class="specification-item" v-for="(item, index1) in goodsInfo[specListName]" :key="index1">
							<view class="item-title">{{ item.name }}</view>
							<view class="item-wrapper">
								<view class="item-content" @tap="skuClick(item_value, index1, $event, index2)"
									v-for="(item_value, index2) in item.list" :key="index2"
									:class="[item_value.ishow ? '' : 'noactived', subIndex[index1] == index2 ? 'actived' : '']"
									:style="[item_value.ishow ? '' : disableStyle,
													item_value.ishow ? btnStyle :'',
													subIndex[index1] == index2 ? activedStyle : ''
									]">
									{{ item_value.name }}
								</view>
							</view>
						</view>
						<!-- 成为创始人 合伙人 隐藏数量 -->
						<view v-if='!info_by_key' style="display: flex;">
							<view style="flex: 1;">
								<text
									style="font-size: 28rpx; color: #333; line-height: 50rpx; font-weight: bold;">数量</text>
							</view>
							<view style="flex: 4;text-align: right;">
								<number-box :bigId=bigId :disabled=disabled :disabledInput=disabledInput
									:min="minBuyNum" :max="maxBuyNum" :step="stepBuyNum" v-model="selectNum"
									:positive-integer="true">
								</number-box>
							</view>
						</view>
						<!--is_city = 0 隐藏地区选择模块
						is_city = 1 显示地区选择模块
						is_area = 0 只显示省市
						is_area = 1 显示省市区 -->
						<!-- v-if='info_by_key==1&&(Region.is_area||Region.is_city)' -->
						<u-form :model="form" ref="uForm" label-width="140rpx">
							<u-form-item v-if='info_by_key&&(Region.is_area||Region.is_city)' label="地区" prop="region">
								<select-region :class="{'noarea': Region.is_area == 0}" @change=dateChange
									v-model="form.region" />
							</u-form-item>
						</u-form>
						<checkbox-group v-if='info_by_key' @change="changeFlag">
							<view style="margin-top: 30upx;display: flex;align-items: center;">
								<label>
									<checkbox value="1" color="#ff5060" style="transform: scale(.7);" />
								</label>
								<view>签约前请先阅读并同意<text style="color: red;" @click="toProto">《签约协议》</text></view>
							</view>
						</checkbox-group>
					</view>
				</scroll-view>
				<view class="close" @click="close('close')" v-if="showClose">
					<image class="close-item" :src="closeImage"></image>
				</view>
			</view>

			<view class="btn-wrapper" v-if="outFoStock || mode == 4">
				<view class="sure" style="color:#ffffff;background-color:#cccccc">{{ noStockText }}</view>
			</view>
			<view class="btn-wrapper" v-else-if="mode == 1">
				<view class="sure3 add-cart" style="" @click="addCart"
					:style="'color:'+addCartColor+';background:'+addCartBackgroundColor">{{ addCartText }}</view>

				<view class="sure2" style="" @click="buyNow"
					:style="'color:'+buyNowColor+';background-color:'+buyNowBackgroundColor">{{ buyNowText }}</view>
			</view>
			<view class="btn-wrapper" v-else-if="mode == 2">
				<view class="sure add-cart" @click="addCart"
					:style="'color:'+addCartColor+';background:'+addCartBackgroundColor">{{ addCartText }}</view>
			</view>
			<view class="btn-wrapper" v-else-if="mode == 3">
				<view class="sure" @click="buyNow" :style="'color:'+buyNowColor+';background:'+buyNowBackgroundColor">
					{{ buyNowText }}
				</view>
			</view>
			<!-- 页面结束 -->
		</view>
		<!-- 页面内容结束 -->
	</view>
</template>

<script>
	import NumberBox from './number-box'
	var that; // 当前页面对象
	var vk; // 自定义函数集
	import {
		areaInfo,
		isShowRegion
	} from "@/api/region"
	import SelectRegion from '@/components/select-region/select-region'
	import Region from '../../common/model/Region';
	const rules = {
		region: [{
			required: true,
			message: '请选择省市区',
			trigger: ['blur', 'change'],
			type: 'array'
		}]
	}
	export default {
		name: 'GoodsSkuPopup',
		components: {
			NumberBox,
			SelectRegion
		},
		props: {
			// true 组件显示 false 组件隐藏
			value: {
				Type: Boolean,
				default: false
			},
			// vk云函数路由模式参数开始-----------------------------------------------------------
			// 商品id
			goodsId: {
				Type: String,
				default: ""
			},
			// vk路由模式框架下的云函数地址
			action: {
				Type: String,
				default: ""
			},
			// vk云函数路由模式参数结束-----------------------------------------------------------
			// 该商品已抢完时的按钮文字
			noStockText: {
				Type: String,
				default: "该商品已抢完"
			},
			// 库存文字
			stockText: {
				Type: String,
				default: "库存"
			},
			// 商品表id的字段名
			goodsIdName: {
				Type: String,
				default: "_id"
			},
			// sku表id的字段名
			skuIdName: {
				Type: String,
				default: "_id"
			},
			// sku_list的字段名
			skuListName: {
				Type: String,
				default: "sku_list"
			},
			// spec_list的字段名
			specListName: {
				Type: String,
				default: "spec_list"
			},
			// stock的字段名
			stockName: {
				Type: String,
				default: "stock"
			},
			// sku_name的字段名
			skuName: {
				Type: String,
				default: "sku_name"
			},
			// sku组合路径的字段名
			skuArrName: {
				Type: String,
				default: "sku_name_arr"
			},
			// 默认单规格时的规格组名称
			defaultSingleSkuName: {
				Type: String,
				default: "默认"
			},
			// 模式 1:都显示  2:只显示购物车 3:只显示立即购买 4:显示缺货按钮 默认 1
			mode: {
				Type: Number,
				default: 1
			},
			// 点击遮罩是否关闭组件 true 关闭 false 不关闭 默认true
			maskCloseAble: {
				Type: Boolean,
				default: true
			},
			// 顶部圆角值
			borderRadius: {
				Type: [String, Number],
				default: 0
			},
			// 商品缩略图字段名(未选择sku时)
			goodsThumbName: {
				Type: [String],
				default: "goods_thumb"
			},
			// 最小购买数量
			minBuyNum: {
				Type: Number,
				default: 1
			},
			// 最大购买数量
			maxBuyNum: {
				Type: Number,
				default: 100000
			},
			// 每次点击后的数量
			stepBuyNum: {
				Type: Number,
				default: 1
			},
			// 自定义获取商品信息的函数
			customAction: {
				Type: [Function],
				default: null
			},
			// 价格的字体颜色
			priceColor: {
				Type: String,
				default: "#EF343D  "
			},
			// 立即购买按钮的文字
			buyNowText: {
				Type: String,
				default: "立即购买"
			},
			// 立即购买按钮的字体颜色
			buyNowColor: {
				Type: String,
				default: "#ffffff"
			},
			// 立即购买按钮的背景颜色
			buyNowBackgroundColor: {
				Type: String,
				default: "#EF343D  "
			},
			// 加入购物车按钮的文字
			addCartText: {
				Type: String,
				default: "加入购物车"
			},
			// 加入购物车按钮的字体颜色
			addCartColor: {
				Type: String,
				default: "#EF343D  "
			},
			// 加入购物车按钮的背景颜色
			addCartBackgroundColor: {
				Type: String,
				default: "#FFFFFF"
			},
			// 不可点击时,按钮的样式
			disableStyle: {
				Type: Object,
				default: null
			},
			// 按钮点击时的样式
			activedStyle: {
				Type: Object,
				default: null
			},
			// 按钮常态的样式
			btnStyle: {
				Type: Object,
				default: null
			},
			// 是否显示右上角关闭按钮
			showClose: {
				Type: Boolean,
				default: true
			},
			// 关闭按钮的图片地址
			closeImage: {
				Type: String,
				default: "../../static/icon/icon_close.png"
			},
			// 默认库存数量 (未选择sku时)
			defaultStock: {
				Type: Number,
				default: 0
			},
			// 默认显示的价格 (未选择sku时)
			defaultPrice: {
				Type: Number,
				default: 0
			},
			// info_by_key
			info_by_key: {
				Type: Number,
				default: 0
			},
			vip_group_order_id: {
				Type: Number,
				default: 0
			},
			// 空 普通商品 1会员商品 2高瑟
			bigId: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				complete: false, // 组件是否加载完成
				goodsInfo: {}, // 商品信息
				isShow: false, // true 显示 false 隐藏
				initKey: true, // 是否已初始化
				shopItemInfo: {}, // 存放要和选中的值进行匹配的数据
				selectArr: [], // 存放被选中的值
				subIndex: [], // 是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
				selectShop: {}, // 存放最后选中的商品
				selectNum: this.minBuyNum, // 选中数量
				outFoStock: false, // 是否全部sku都缺货
				form: {
					region: [] //省市区
				},
				rules,
				Region: {}, //地区
				agreeFlag: false,
				disabled: false,
				disabledInput: false
			};
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
			if (this.bigId == 1) {
				this.disabledInput = true;
				this.disabled = true
			}
		},
		mounted() {
			that = this;
			vk = that.vk;
			if (that.value) {
				that.open();
			}
			if (that.info_by_key) {
				// this.getAreaInfo()
				this.getRegion()
			}
		},
		methods: {
			// 初始化
			init() {
				// 清空之前的数据
				that.selectArr = [];
				that.subIndex = [];
				that.selectShop = {};
				that.selectNum = that.minBuyNum;
				that.outFoStock = false;
				that.shopItemInfo = {};
				// that.shopItemInfo = that.goodsInfo;
				let specListName = that.specListName;
				that.goodsInfo[specListName].map(item => {
					that.selectArr.push('');
					that.subIndex.push(-1);
				});

				that.checkItem(); // 计算sku里面规格形成路径
				that.checkInpath(-1); // 传-1是为了不跳过循环
				that.autoClickSku(); // 自动选择sku策略
			},
			changeFlag(e) {
				if (e.detail.value.length > 0) {
					this.agreeFlag = true;
				} else {
					this.agreeFlag = false;
				}
			},
			toProto() {
				let info_by_key = this.info_by_key
				this.$navTo("pageHome/prepaidRefill/detail/detail?info_by_key=" + info_by_key)
			},
			getRegion() {
				isShowRegion({
					goodsId: this.goodsId
				}).then(res => {
					this.Region = res.data.res;
				})
			},
			dateChange(val) {
				if (this.Region.is_area == 0) {
					this.form.region.length = 2
				}
			},
			getAreaInfo() {
				areaInfo({
					id: this.goodsId
				}).then(res => {
					this.$nextTick((res) => {
						this.form.region = [{
							label: '北京',
							value: 1
						}]
					})

				})
			},
			onnodeclick(node) {},
			// 使用vk路由模式框架获取商品信息
			findGoodsInfo() {
				if (typeof vk == "undefined") {
					that.toast("custom-action必须是function");
					return false;
				}
				vk.callFunction({
					url: that.action,
					title: '请求中...',
					data: {
						goods_id: that.goodsId
					},
					success(data) {
						console.log(33355566);
						that.updateGoodsInfo(data.goodsInfo);
					}
				});
			},
			// 更新商品信息(库存、名称、图片)
			updateGoodsInfo(goodsInfo) {
				let skuListName = that.skuListName;
				if (JSON.stringify(that.goodsInfo) === "{}" || that.goodsInfo[that.goodsIdName] !== goodsInfo[that
						.goodsIdName]) {
					that.goodsInfo = goodsInfo;
					that.initKey = true;
				} else {
					that.goodsInfo[skuListName] = goodsInfo[skuListName];
				}
				if (that.initKey) {
					that.initKey = false;
					that.init();
				}
				// 更新选中sku的库存信息
				let select_sku_info = that.getListItem(that.goodsInfo[skuListName], that.skuIdName, that.selectShop[
					that.skuIdName]);
				Object.assign(that.selectShop, select_sku_info);
				that.complete = true;
				that.$emit("open", true);
				that.$emit("input", true);
			},
			async open() {
				let findGoodsInfoRun = true;
				let skuListName = that.skuListName;
				if (that.customAction && typeof(that.customAction) === 'function') {
					let goodsInfo = await that.customAction();
					let shopItemInfo = {};
					that.shopItemInfo = that.goodsInfo;
					if (goodsInfo && typeof goodsInfo == "object" && JSON.stringify(goodsInfo) != "{}") {
						findGoodsInfoRun = false;
						that.updateGoodsInfo(goodsInfo);
					} else {
						that.toast("未获取到商品信息");
						that.$emit("input", false);
						return false;
					}
				} else {
					if (findGoodsInfoRun) that.findGoodsInfo();
				}
			},
			// 监听 - 弹出层收起
			close(s) {
				if (s == "close") {
					that.$emit("input", false);
					that.$emit("close", "close");
				} else if (s == "mask") {
					if (that.maskCloseAble) {
						that.$emit("input", false);
						that.$emit("close", "mask");
					}
				}
			},
			moveHandle() {
				//禁止父元素滑动
			},
			// sku按钮的点击事件
			skuClick(value, index1, event, index2) {
				if (value.ishow) {
					if (that.selectArr[index1] != value.name) {
						that.$set(that.selectArr, index1, value.name);
						that.$set(that.subIndex, index1, index2);
					} else {
						that.$set(that.selectArr, index1, '');
						that.$set(that.subIndex, index1, -1);
					}
					that.checkItem();
					that.checkInpath(index1);
					// 如果全部选完
					that.checkSelectShop();
				}
			},
			// 检测是否已经选完sku
			checkSelectShop() {
				// 如果全部选完
				if (that.selectArr.every(item => item != '')) {
					that.selectShop = that.shopItemInfo[that.selectArr];
					that.selectNum = that.minBuyNum;
				} else {
					that.selectShop = {};
				}
			},
			// 检查路径
			checkInpath(clickIndex) {
				let specListName = that.specListName;
				//console.time('筛选可选路径需要的时间是');
				//循环所有属性判断哪些属性可选
				//当前选中的兄弟节点和已选中属性不需要循环
				let specList = that.goodsInfo[specListName];
				for (let i = 0, len = specList.length; i < len; i++) {
					if (i == clickIndex) {
						continue;
					}
					let len2 = specList[i].list.length;
					for (let j = 0; j < len2; j++) {
						if (that.subIndex[i] != -1 && j == that.subIndex[i]) {
							continue;
						}
						let choosed_copy = [...that.selectArr];
						that.$set(choosed_copy, i, specList[i].list[j].name);
						let choosed_copy2 = choosed_copy.filter(item => item !== '' && typeof item !== 'undefined');
						if (that.shopItemInfo.hasOwnProperty(choosed_copy2)) {
							specList[i].list[j].ishow = true;
						} else {
							specList[i].list[j].ishow = false;
						}
					}
				}
				that.$set(that.goodsInfo, specListName, specList);
			},
			// 计算sku里面规格形成路径
			checkItem() {
				let skuListName = that.skuListName;
				// console.time('计算有多小种可选路径需要的时间是');
				// 去除库存小于等于0的商品sku
				let skuList = that.goodsInfo[skuListName];
				let stockNum = 0;
				for (let i = 0; i < skuList.length; i++) {
					if (skuList[i][that.stockName] <= 0) {
						skuList.splice(i, 1);
						i--;
					} else {
						stockNum += skuList[i][that.stockName];
					}
				}
				if (stockNum <= 0) {
					that.outFoStock = true;
				}
				// 计算有多小种可选路径
				let result = skuList.reduce(
					(arrs, items) => {
						return arrs.concat(
							items[that.skuArrName].reduce(
								(arr, item) => {
									return arr.concat(
										arr.map(item2 => {
											// 利用对象属性的唯一性实现二维数组去重
											if (!that.shopItemInfo.hasOwnProperty([...item2, item])) {
												that.shopItemInfo[[...item2, item]] = items;
											}
											let r = that.shopItemInfo;
											return [...item2, item];
										})
									);
								},
								[
									[]
								]
							)
						);
					},
					[
						[]
					]
				);
				// console.timeEnd('计算有多小种可选路径需要的时间是');
			},
			// 检测sku选项是否已全部选完,且有库存
			checkSelectComplete(obj = {}) {
				let selectShop = that.selectShop;
				if (selectShop && selectShop[that.skuIdName]) {
					// 判断库存
					if (that.selectNum <= selectShop[that.stockName]) {
						if (typeof obj.success == "function") obj.success(selectShop);
					} else {
						that.toast(that.stockText + "不足", "none")
					}
				} else {
					that.toast("请先选择对应规格", "none");
				}
			},
			// 加入购物车
			addCart() {
				that.checkSelectComplete({
					success: function(selectShop) {
						selectShop.buy_num = that.selectNum;
						that.$emit("add-cart", selectShop);
					}
				});
			},
			// 立即购买
			buyNow() {
				let app = this
				that.checkSelectComplete({
					success: function(selectShop) {
						selectShop.buy_num = that.selectNum;
						if (!app.agreeFlag && that.info_by_key) {
							uni.showToast({
								icon: 'none',
								title: '请先勾选签约协议'
							})
							return
						}
						// 合伙人 团长
						if (that.info_by_key && (that.Region.is_area || that.Region.is_city)) {
							that.$refs.uForm.validate(valid => {
								if (valid) {
									let formIndex = app.form.region.length - 1;
									selectShop.regionId = app.form.region[formIndex].value;
									app.$emit("buy-now", selectShop);
								}
							})
						} else {
							that.$emit("buy-now", selectShop);
						}

					}
				});
			},
			// 弹窗
			toast(title, icon) {
				uni.showToast({
					title: title,
					icon: icon
				});
			},
			// 获取对象数组中的某一个item,根据指定的键值
			getListItem(list, key, value) {
				let item;
				for (let i in list) {
					if (typeof value == "object") {
						if (JSON.stringify(list[i][key]) === JSON.stringify(value)) {
							item = list[i];
							break;
						}
					} else {
						if (list[i][key] === value) {
							item = list[i];
							break;
						}
					}
				}
				return item;
			},
			// 自动选择sku前提是只有一组sku,默认自动选择最前面的有库存的sku
			autoClickSku() {
				let skuList = that.goodsInfo[that.skuListName];
				let specListArr = that.goodsInfo[that.specListName];
				if (specListArr.length == 1) {
					let specList = specListArr[0].list;
					for (let i = 0; i < specList.length; i++) {
						let sku = that.getListItem(skuList, that.skuArrName, [specList[i].name]);
						if (sku) {
							that.skuClick(specList[i], 0, {}, i);
							break;
						}
					}
				}
			}
		},
		// 过滤器
		filters: {
			// 金额显示过滤器
			// priceFilter(n = 0) {
			//   if (typeof n == "string") {
			//     n = parseFloat(n);
			//   }
			//   return (n / 100).toFixed(2);
			// },

			// 金额显示过滤器
			priceFilter(n = 0) {
				if (typeof n == "string") {
					n = parseFloat(n)
				}
				return n.toFixed(2)
			}
		},
		watch: {
			value: function(val) {
				if (val) {
					that.open();
				}
			},
		}
	};
</script>

<style lang="scss" scoped>
	/*  sku弹出层 */
	.goods-sku-popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 21;
		overflow: hidden;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.65);
		}

		.layer {
			display: flex;
			width: 100%;
			// height: 1014rpx;
			flex-direction: column;
			// min-height: 40vh;
			// max-height: 1014rpx;
			position: fixed;
			z-index: 99;
			bottom: 0;
			border-radius: 10rpx 10rpx 0 0;
			background-color: #fff;

			.specification-wrapper {
				width: 100%;
				padding: 30rpx 24rpx 0;
				box-sizing: border-box;
				margin-bottom: 112upx;

				.specification-wrapper-content {
					width: 100%;
					max-height: 900rpx;
					min-height: 300rpx;

					&::-webkit-scrollbar {
						/*隐藏滚轮*/
						display: none;
					}

					.specification-header {
						width: 100%;
						display: flex;
						flex-direction: row;
						position: relative;
						margin-bottom: 40rpx;
						padding-bottom: 10rpx;
						border-bottom: 2rpx solid #EFEFEF;

						.specification-left {
							width: 180rpx;
							height: 180rpx;
							flex: 0 0 180rpx;

							.product-img {
								width: 180rpx;
								height: 180rpx;
								background-color: #999999;
							}
						}

						.specification-right {
							flex: 1;
							padding: 0 35rpx 10rpx 28rpx;
							box-sizing: border-box;
							display: flex;
							flex-direction: column;
							justify-content: flex-end;
							font-weight: 500;

							.price-content {
								color: #EF343D;
								margin-bottom: 10rpx;

								.sign {
									font-size: 28rpx;
									margin-right: 4rpx;
								}

								.price {
									font-size: 44rpx;
								}
							}

							.inventory {
								font-size: 24rpx;
								color: #525252;
								margin-bottom: 14rpx;

							}

							.choose {
								font-size: 24rpx;
								color: #525252;
								min-height: 32rpx;
							}
						}
					}

					.specification-content {
						font-weight: 500;

						&::v-deep .uni-data-tree-dialog {
							top: -17vh !important;
						}

						.noarea {
							::v-deep picker-view-column:nth-child(3) {
								display: none;
							}
						}

						.specification-item {
							margin-bottom: 40rpx;

							&:last-child {
								margin-bottom: 0;
							}

							.item-title {
								margin-bottom: 20rpx;
								font-size: 28rpx;
								color: #333333;
								font-weight: bold;
							}

							.item-wrapper {
								display: flex;
								flex-direction: row;
								flex-flow: wrap;
								margin-bottom: -20rpx;

								.item-content {
									display: inline-block;
									padding: 10rpx 35rpx;
									font-size: 24rpx;
									border-radius: 30rpx;
									background-color: #ffffff;
									color: #333333;
									margin-right: 20rpx;
									margin-bottom: 20rpx;
									border: 2rpx solid #999999;
									box-sizing: border-box;

									&.actived {
										border-color: #EF343D;
										color: #EF343D;
									}

									&.noactived {
										// background-color: #e4e4e4;
										// border-color: #e4e4e4;
										// color: #9e9e9e;
										// text-decoration: line-through;
										color: #c8c9cc;
										background: #f2f3f5;
										border-color: #f2f3f5;
									}
								}
							}
						}
					}
				}

				.close {
					position: absolute;
					top: 30rpx;
					right: 25rpx;
					width: 50rpx;
					height: 50rpx;
					text-align: center;
					line-height: 50rpx;

					.close-item {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}

			.btn-wrapper {
				display: flex;
				width: 100%;
				height: 120rpx;
				flex: 0 0 120rpx;
				align-items: center;
				justify-content: space-between;
				padding: 0 24rpx;
				box-sizing: border-box;
				// padding-bottom: 10rpx;
				padding-bottom: 0;
				padding-bottom: constant(safe-area-inset-bottom);
				padding-bottom: env(safe-area-inset-bottom);
				// border-radius: 8rpx;

				.layer-btn {
					width: 335rpx;
					height: 76rpx;
					border-radius: 38rpx;
					color: #fff;
					line-height: 76rpx;
					text-align: center;
					font-weight: 500;
					font-size: 28rpx;

					&.add-cart {
						background-color: #ffffff;
						border: 3rpx solid #EF343D;
					}

					&.buy {
						background: #EF343D;
					}
				}

				.sure {
					width: 698rpx;
					height: 80rpx;
					// border-radius: 38rpx;
					color: #fff;
					line-height: 80rpx;
					text-align: center;
					font-weight: bold;
					font-size: 28rpx;
					background: #EF343D;
					border-radius: 46rpx;
				}

				.sure2 {
					width: 342rpx;
					height: 80rpx;
					// border-radius: 38rpx;
					color: #fff;
					line-height: 80rpx;
					text-align: center;
					font-weight: bold;
					font-size: 28rpx;
					background: #EF343D;
					border-radius: 46rpx;
				}

				.sure3 {
					width: 342rpx;
					height: 80rpx;
					// border-radius: 38rpx;
					color: #EF343D;
					line-height: 80rpx;
					text-align: center;
					font-weight: bold;
					font-size: 28rpx;
					border-radius: 46rpx;
					border: 3rpx solid #EF343D;
				}

				.sure.add-cart {
					background-color: #ffffff;
					border: 3rpx solid #EF343D;
				}
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}
</style>
