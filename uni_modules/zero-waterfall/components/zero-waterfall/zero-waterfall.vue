<template>
	<view class="container">
		<view class="waterfall_left">
			<view class="waterfall_item" v-for="(item,index) in listLeft" :key="index" :data-id="item.goods_id"
					@click="onTargetGoodsList" v-if="item.goods_id">
				<view class="item_img">
					<!-- <image :src="item.url" mode="widthFix" @load="considerPush"></image> -->
					<zero-lazy-load :image="item.goods_image" :imgMode='imgMode' @load='considerPush' @error='considerPush'>
					</zero-lazy-load>
				</view>
				<view  class="item_info">
					<view class="item_info_title">{{item.goods_name}}</view>
					<!-- <view class="item_info_note">{{item.note}}</view> -->
					<view class="item_info_note">
						<view class="item_info_price">
							￥<text>{{item.goods_price_min}}</text>
						</view>
						<!-- <view class="item_info_price" v-if="item.line_price_min>0">
							￥<text>{{item.line_price_min}}</text>
						</view> -->
						<view class="item_info_sales">已售{{item.goods_sales}}件</view>
					</view>
					<!--  #ifdef  MP-WEIXIN -->
					<slot name="slot{{item.goods_id}}" />
					<!--  #endif -->

					<!-- #ifndef  MP-WEIXIN -->
					<slot v-bind="item" />
					<!-- #endif -->
				</view>
			</view>
		</view>
		<view class="waterfall_right">
			<view class="waterfall_item" v-for="(item,index) in listRight" :key="index" :data-id="item.goods_id"
					@click="onTargetGoodsList" v-if="item.goods_id">
				<view class="item_img">
					<!-- <image :src="item.url" mode="widthFix" @load="considerPush"></image> -->
					<zero-lazy-load :image="item.goods_image" :imgMode='imgMode' @load='considerPush' @error='considerPush'>
					</zero-lazy-load>
				</view>
				<view class="item_info">
					<view class="item_info_title">{{item.goods_name}}</view>
					<view class="item_info_note">
						<view class="item_info_price">
							￥<text>{{item.goods_price_min}}</text>
						</view>
						<!-- <view class="item_info_price" v-if="item.line_price_min>0">
							￥<text>{{item.line_price_min}}</text>
						</view> -->
						<view class="item_info_sales">已售{{item.goods_sales}}件</view>
					</view>
					<!-- <view class="item_info_note">{{item.note}}</view> -->
					<!--  #ifdef  MP-WEIXIN -->
					<slot name="slot{{item.goods_id}}" />
					<!--  #endif -->

					<!-- #ifndef  MP-WEIXIN -->
					<slot v-bind="item" />
					<!-- #endif -->
				</view>
			</view>
		</view>
	</view>

</template>
<script>
	export default {
		name: "zero-waterfall",
		props: {
			// 需要在使用页面 onPageScroll 传进来
			list: {
				type: Array,
				required: true,
				default: []
			},
			// 图片裁剪模式
			imgMode: {
				type: String,
				default: 'widthFix'
			},
		},
		data() {
			return {
				listLeft: [],
				listRight: [],
				newList: [],
				loadFlag: true
			}
		},
		watch: {
		 list: {
			handler (newValue, oldValue) {
				    let newarr = [...this.listLeft,...this.listRight]
					this.newList = newValue.slice(newarr?newarr.length:0);
					this.considerPush()
			},
			immediate: true
		 }
		},
		mounted() {
			// this.init()
		},

		methods: {
			// 跳转至商品列表页
			onTargetGoodsList(e) {
				let goodsId = e.currentTarget.dataset.id || e.target.dataset.id;
				this.$navTo('pages/goods/detail', {
					goodsId
				})
			},
			// 触发重新排列
			init() {
				// this.newList = [...this.list];
				// console.log(3333);
				this.listLeft = [];
				this.listRight = [];
				if (this.newList.length != 0) {
					// this.listLeft.push(this.newList.shift()); //触发排列
					// this.listRight.push(this.newList[1]); //触发排列
				}

			},
			// 清空数据列表
			clear() {
				this.listLeft = [];
				this.listRight = [];
				// 同时清除父组件列表中的数据
				this.$emit('clear', []);
				this.newList = [];
			},

			// 计算排列
			considerPush() {
				// console.log(123456,"加载",this.newList)
				// if(!this.loadFlag){
				// 	return false;
				// }
				// this.loadFlag = false;
				if (this.newList.length == 0) return; //没有数据了
				let leftH = 0,
					rightH = 0; //左右高度
				var query = uni.createSelectorQuery().in(this);

				query.selectAll('.waterfall_left').boundingClientRect()
				query.selectAll('.waterfall_right').boundingClientRect()
				query.exec(res => {
					// console.log('结果',res)
					leftH = res[0].length != 0 ? res[0][0].height : 0; //防止查询不到做个处理
					rightH = res[1].length != 0 ? res[1][0].height : 0;
					// console.log('结果',leftH,rightH)
					if (leftH == rightH || leftH < rightH) {
						// 相等 || 左边小  
						this.listLeft.push(this.newList.shift());
					} else {
						// 右边小
						this.listRight.push(this.newList.shift());
					}
					// this.loadFlag = true;
				});

			},

		}

	}
</script>
<style lang="scss" scoped>
	.container {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-around;
		align-items: flex-start;
	}

	.waterfall_left,
	.waterfall_right {
		width: 46%;
	}

	.waterfall_item {
		width: 100%;
		margin: 0 0 24rpx 0;
		background-color: #FFFFFF;
		border-radius: 15rpx;
		overflow: hidden;

		.item_img {
			width: 100%;

			image {
				width: 100%;
				overflow: hidden;
			}
		}

		.item_info {
			padding: 10rpx 0;

			.item_info_title {
				font-size: 28upx;
				color: #333333;
				font-weight: Bold;
				padding: 0 10upx;
				// height: 80upx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				margin-bottom: 24upx;
			}

			.item_info_note {
				display: flex;
				padding: 0 10upx;
				margin-bottom: 20upx;
				justify-content: space-between;
				.item_info_sales{
					font-size: 22upx;
					color: #878787;
					// margin-top: 18upx;
					line-height: 22upx;
				}
				 .item_info_price {
					font-size: 22upx;
					// font-weight: bold;
					line-height: 22upx;
					color: #EF343D;
					margin-right: 18upx;
					text{
						font-size: 36upx;
						font-weight: bold;
					}
				}
				.item_info_texts {
					font-size: 22upx;
					// font-weight: bold;
					line-height: 22upx;
					color: #878787;
					text-decoration: line-through;
				}
			}
			
		}

	}
</style>
