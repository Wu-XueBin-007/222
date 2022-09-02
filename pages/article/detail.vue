<template>
	<view v-if="!isLoading" class="container b-f p-b">
		<view class="article-title">
			<text class="f-32">{{ detail.title }}</text>
		</view>
		<view class="article-little dis-flex flex-x-between m-top10">
			<view class="article-little__left">
				<text class="article-views f-24 col-8">{{ detail.show_views }}次浏览</text>
			</view>
			<view class="article-little__right">
				<text class="article-views f-24 col-8">{{ detail.view_time }}</text>
			</view>
		</view>
		<view class="article-content m-top20">
			<jyf-parser :html="detail.content"></jyf-parser>
		</view>
		<!-- 快捷导航 -->
		<view class="goods-list clearfix column-2">
			<view class="goods-item" v-for="(item, index) in detail.goods" :key="index"
				@click="onTargetDetail(item.goods_id)">

				<!-- 多列显示 -->
				<view class="multi">
					<!-- 商品图片 -->
					<view class="goods-image">
						<image class="image" mode="aspectFill" :src="item.goods_image"></image>
					</view>
					<view class="detail">
						<!-- 商品标题 -->
						<view class="goods-name twolist-hidden">
							{{ item.goods_name }}
						</view>
						<!-- 商品价格 -->
						<view class="detail-price onelist-hidden">
							<text class="goods-price f-30 col-m">￥{{ item.goods_price_min }}</text>
							<text v-if="item.line_price_min > 0"
								class="line-price col-9 f-24">￥{{ item.line_price_min }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<shortcut />
	</view>
</template>

<script>
	import jyfParser from '@/components/jyf-parser/jyf-parser'
	import Shortcut from '@/components/shortcut'
	import * as ArticleApi from '@/api/article'

	export default {
		components: {
			Shortcut
		},
		data() {
			return {
				// 当前文章ID
				articleId: null,
				// 加载中
				isLoading: true,
				// 当前文章详情
				detail: null
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			// 记录文章ID
			this.articleId = options.articleId
			// 获取文章详情
			this.getArticleDetail()
		},

		methods: {
			// 跳转商品详情页
			onTargetDetail(goodsId) {
				this.$navTo('pages/goods/detail', {
					goodsId
				})
			},
			// 获取文章详情
			getArticleDetail() {
				const app = this
				app.isLoading = true
				ArticleApi.detail(app.articleId)
					.then(result => {
						app.detail = result.data.detail
					})
					.finally(() => app.isLoading = false)
			}

		},

		/**
		 * 分享当前页面
		 */
		onShareAppMessage() {
			const app = this
			// 构建页面参数
			const params = app.$getShareUrlParams({
				articleId: app.articleId
			});
			return {
				title: app.detail.title,
				path: "/pages/article/detail?" + params
			}
		},

		/**
		 * 分享到朋友圈
		 * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
		 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
		 */
		onShareTimeline() {
			const app = this
			// 构建页面参数
			const params = app.$getShareUrlParams({
				articleId: app.articleId
			});
			return {
				title: app.detail.title,
				path: "/pages/article/detail?" + params
			}
		}

	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		padding: 20rpx;
		background: #fff;
	}

	.article-content {
		font-size: 28rpx;
	}

	// 商品列表
	.goods-list {
		padding: 4rpx;
		box-sizing: border-box;
	}

	// 平铺显示
	.goods-list.column-2 {
		.goods-item {
			width: 50%;
		}
	}

	.multi {
		box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
	}

	.goods-item {
		float: left;
		box-sizing: border-box;
		padding: 6rpx;

		.goods-image {
			position: relative;
			width: 100%;
			height: 0;
			padding-bottom: 100%;
			overflow: hidden;
			background: #fff;

			&:after {
				content: '';
				display: block;
				margin-top: 100%;
			}

			.image {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				-o-object-fit: cover;
				object-fit: cover;
			}
		}
	}

	.detail {
		padding: 8rpx;
		background: #fff;

		.goods-name {
			height: 64rpx;
			line-height: 32rpx;
			white-space: normal;
			color: #484848;
			font-size: 26rpx;
		}

		.detail-price {
			.goods-price {
				margin-right: 8rpx;
			}

			.line-price {
				text-decoration: line-through;
			}
		}
	}
</style>
