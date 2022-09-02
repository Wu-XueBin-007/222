<template>
  <!-- 商品评价 -->
  <view v-if="!isLoading && list.length" class="goods-comment m-top20">
    <view class="item-title dis-flex">
      <view class="block-left flex-box" style="font-size: 30upx;font-weight: bold;color: #333333;">
        评价 (<text class="total">{{ total }}</text>)
      </view>
      <view class="block-right comment-icon">
        <text @click="onTargetToComment" class="show-more col-9">查看全部更多</text>
        <image src="../../../static/icon/icon_right2.png" mode=""></image>
      </view>
    </view>
    <!-- 评论列表 -->
    <view class="comment-list">
      <view class="comment-item" v-for="(item, index) in list" :key="index">
        <view class="comment-item_row dis-flex flex-y-center">
          <view class="user-info dis-flex flex-y-center">
            <image class="avatar" :src="item.user.avatar_url"></image>
            
          </view>
          <!-- 评星 -->
          <view class="star-rating">
			  <text class="user-name">{{ item.user.nick_name }}</text>
            <u-rate active-color="#f4a213" :current="rates[item.score]" :disabled="true" />
          </view>
        </view>
        <view class="item-content m-top20">
          <text class="f-26 twolist-hidden">{{ item.content }}</text>
        </view>
        <view class="comment-time">{{ item.create_time }}</view>
      </view>
    </view>
  </view>

</template>

<script>
  import * as CommentApi from '@/api/comment'

  export default {
    props: {
      // 商品ID
      goodsId: {
        type: Number,
        default: null
      },
      // 加载多少条记录 默认2条
      limit: {
        type: Number,
        default: 2
      }
    },
    data() {
      return {
        // 正在加载
        isLoading: true,
        // 评星数据转换
        rates: { 10: 5, 20: 3, 30: 1 },
        // 评价列表数据
        list: [],
        // 评价总数量
        total: 0
      }
    },

    created() {
      // 加载评价列表数据
      this.getCommentList()
    },

    methods: {

      // 加载评价列表数据
      getCommentList() {
        const app = this
        app.isLoading = true
        CommentApi.listRows(app.goodsId, app.limit)
          .then(result => {
            app.list = result.data.list
            app.total = result.data.total
          })
          .catch(err => err)
          .finally(() => app.isLoading = false)
      },

      // 跳转到评论列表页
      onTargetToComment() {
        const app = this
        app.$navTo('pages/comment/index', { goodsId: app.goodsId })
      }

    }
  }
</script>

<style lang="scss" scoped>
  .goods-comment {
	  width: 702upx;
	  margin: 20upx auto 20upx;
	  padding: 20rpx 20rpx;
	  background-color: #F8F8F8;
  }

  .item-title {
    font-size: 28rpx;
    padding-bottom: 20rpx;
	border-bottom: 2upx solid #EFEFEF;
    .total {
      margin: 0 4rpx;
    }

    .show-more {
      margin-right: 8rpx;
      font-size: 24rpx;
    }
  }

  .comment-item {
    padding: 15rpx 5rpx;
    margin-bottom: 10rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    .comment-item_row {
      margin-bottom: 10rpx;
    }
  }

  .user-info {
    margin-right: 15rpx;

    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      // margin-right: 10rpx;
    }

    

  }
  .user-name {
    font-size: 28rpx;
    color: #666666;
    display: block;
  }
  .item-content {
    color: #666666;
	font-size: 26upx;
    margin: 16rpx 0 16rpx 108rpx;
    max-height: 76rpx;
    line-height: 38rpx;
  }

  .comment-time {
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
	margin-left: 108rpx;
  }
  .comment-icon{
	  
  }
  .comment-icon text{
	  font-size: 26upx;
	  color: #666666;
  }
  .comment-icon image{
	  width: 28upx;
	  height: 40upx;
	  vertical-align: top;
  }
</style>
