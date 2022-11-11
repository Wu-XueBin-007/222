<template>
  <view class="container">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ use: false }" :up="upOption"
      @up="upCallback">

      <!-- tab栏 -->
      <u-tabs :list="tabs" :is-scroll="false" :current="curTab" active-color="#ff5060" :duration="0.2"
        @change="onChangeTab" />

      <!-- 优惠券列表 -->
      <view class="coupon-list">
        <view :class="['coupon-item',curTab == 1 ? 'used' : '',curTab == 2 ? 'express' : '']" v-for="(item, index) in list.data" :key="index">
          <view class="couponWrap">
			  <image :src="item.goods[0].images[0].file.preview_url"></image>
			  <view class="couponWrapR">
				  <view class="couponWrapRL">
					  <view>{{item.goods[0].goods_name}}</view>
					  <view>有效期至{{item.effective_time | dateFormat}}</view>
				  </view>
				  <view class="couponWrapRR" @click="toDetail" :data-id="item.goods_id">
					  <view>
						  去使用
					  </view>
				  </view>
			  </view>
		  </view>
        </view>
      </view>
    </mescroll-body>
  </view>
</template>

<script>
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData } from '@/utils/app'
  import * as cardVoucherApi from '@/api/cardVoucher'
  import { CouponTypeEnum } from '@/common/enum/coupon'

  const color = ['red', 'blue', 'violet', 'yellow']
  const pageSize = 15
  const tabs = [{
    name: `未使用`,
    value: 0
  }, {
    name: `已使用`,
    value: 1
  }, {
    name: `已过期`,
    value: 2
  }]

  export default {
    components: {
      MescrollBody
    },
    mixins: [MescrollMixin],
    data() {
      return {
        // 枚举类
        CouponTypeEnum,
        // 颜色组
        color,
        // 标签栏数据
        tabs,
        // 当前标签索引
        curTab: 0,
        // 优惠券列表数据
        list: getEmptyPaginateObj(),
        // 上拉加载配置
        upOption: {
          // 首次自动执行
          auto: true,
          // 每页数据的数量; 默认10
          page: { size: pageSize },
          // 数量要大于4条才显示无更多数据
          noMoreSize: 4,
          // 空布局
          empty: {
            tip: '亲，暂无相关卡券'
          }
        }
      }
    },
	filters: {
		dateFormat: function(value) {
			var date = new Date(value*1000);
			let year = date.getFullYear();
			let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
			let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
			let hour = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
			let min = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
			let sec = date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
			var result = year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
			return result;
		}
	},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
	onShareAppMessage() {
		const app = this
		const {
			page
		} = app
		return {
			title: "融汇商城",
			path: "/pages/index/index"
		}
	},
	
	/**
	 * 分享到朋友圈
	 * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
	 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
	 */
	onShareTimeline() {
		const app = this
		const {
			page
		} = app
		return {
			title: "融汇商城",
			path: "/pages/index/index"
		}
	},
    methods: {
	  toDetail(e){
		  if(this.curTab == 0){
			  let goodsId = e.currentTarget.dataset.id || e.target.dataset.id;
			  this.$navTo('pages/goods/detail', {
			  	goodsId
			  })
		  }
	  },
      /**
       * 上拉加载的回调 (页面初始化时也会执行一次)
       * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
       * @param {Object} page
       */
      upCallback(page) {
        const app = this
        // 设置列表数据
        app.getCouponList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },

      /**
       * 获取优惠券列表
       */
      getCouponList(pageNo = 1) {
        const app = this
        return new Promise((resolve, reject) => {
          cardVoucherApi.list({type: app.getTabValue(), page: pageNo }, { load: false })
            .then(result => {
              // 合并新数据
              let newList = result.data.list
			  //console.log(newList)
			  newList.data = newList.data.map(cur=>{
				  cur.create_time_str = new Date(cur.create_time).getTime() + Number(cur.effective_time)*1000;
				  return cur;
			  })
              app.list.data = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
        })
      },

	// 评分类型
      getTabValue() {
        return this.tabs[this.curTab].value
      },
      // 切换标签项
      onChangeTab(index) {
        const app = this
        // 设置当前选中的标签
        app.curTab = index
        // 刷新优惠券列表
        app.onRefreshList()
      },

      // 刷新优惠券列表
      onRefreshList() {
        this.list = getEmptyPaginateObj()
        setTimeout(() => {
          this.mescroll.resetUpScroll()
        }, 120)
      },

    }
  }
</script>

<style lang="scss" scoped>
	
  .coupon-list {
    padding: 20rpx;
	width: 100%;
	box-sizing: border-box;
  }


  .coupon-item {
    position: relative;
    overflow: hidden;
    margin-bottom: 22rpx;
	width: 100%;
	background-image: url(../../static/user/coupon_act.png);
	background-size: 100% 100%;
	background-position: 0 0;
	height: 200upx;
	padding: 24upx;
	box-sizing: border-box;
  }
  .express{
	  background-image: url(../../static/user/coupon.png);
  }
  
  .couponWrap{
	  width: 100%;
	  height: 100%;
	  background: #FFF9F0;
	  box-sizing: border-box;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  padding: 0 30upx;
  }
  .couponWrap>image{
	  width: 88upx;
	  height: 88upx;
	  margin-right: 24upx;
  }
  .couponWrapR{
	  width: calc(100% - 112upx);
	  display: flex;
	  align-items: center;
  }
  .couponWrapRL{
	  width: calc(100% - 136upx);
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
  }
  .couponWrapRL>view:nth-child(1){
	  font-size: 24upx;
	  line-height: 24upx;
	  color: #333333;
	  margin-bottom: 24upx;
	  width: 100%;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
  }
  .couponWrapRL>view:nth-child(2){
	  font-size: 20upx;
	  line-height: 20upx;
	  color: #999999;
	  width: 100%;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
  }
  .couponWrapRR{
	  width: 112upx;
	  height: 112upx;
	  border-radius: 50%;
	  background: #FFCDA7;
	  box-sizing: border-box;
	  padding: 8upx;
  }
  .used>.couponWrap>.couponWrapR>.couponWrapRR,.express>.couponWrap>.couponWrapR>.couponWrapRR{
	  background: #EEEEEE;
  }
  .couponWrapRR>view{
	  width: 100%;
	  height: 100%;
	  border-radius: 50%;
	  background: #FFCDA7;
	  box-sizing: border-box;
	  border: 2upx solid white;
	  text-align: center;
	  line-height: 96upx;
	  font-size: 24upx;
	  font-weight: bold;
  }
  .used>.couponWrap>.couponWrapR>.couponWrapRR>view,.express>.couponWrap>.couponWrapR>.couponWrapRR>view{
  	  background: #EEEEEE;
  }

  .item-wrapper {
    width: 100%;
    display: flex;
    background: #fff;
    border-radius: 8rpx;
    color: #fff;
    height: 180rpx;

    .coupon-type {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 10;
      width: 128rpx;
      padding: 6rpx 0;
      background: #a771ff;
      font-size: 20rpx;
      text-align: center;
      color: #ffffff;
      transform: rotate(45deg);
      transform-origin: 64rpx 64rpx;
    }

    &.color-blue {
      background: linear-gradient(-125deg, #57bdbf, #2f9de2);
    }

    &.color-red {
      // background: linear-gradient(-128deg, #ff6d6d, #ff3636);
	  background-image: url(../../static/background/cardVoucher1.png);
	  background-size: 710upx 200upx;
    }

    &.color-violet {
      background: linear-gradient(-113deg, #ef86ff, #b66ff5);

      .coupon-type {
        background: #55b5ff;
      }
    }

    &.color-yellow {
      background: linear-gradient(-141deg, #f7d059, #fdb054);
    }

    &.color-gray {
      background: linear-gradient(-113deg, #bdbdbd, #a2a1a2);

      .coupon-type {
        background: #9e9e9e;
      }
    }

    .content {
      flex: 1;
      padding: 30rpx 20rpx;
      border-radius: 16rpx 0 0 16rpx;

      .title {
        font-size: 32rpx;
      }

      .bottom {
        .time {
          font-size: 24rpx;
        }

        .receive {
          height: 46rpx;
          width: 122rpx;
          line-height: 46rpx;
          text-align: center;
          border: 1rpx solid #fff;
          border-radius: 30rpx;
          color: #fff;
          font-size: 24rpx;

          &.state {
            border: none;
          }
        }
      }
    }

    .tip {
      position: relative;
      flex: 0 0 32%;
      text-align: center;
      border-radius: 0 16rpx 16rpx 0;

      .money {
        font-weight: bold;
        font-size: 52rpx;
      }

      .pay-line {
        font-size: 22rpx;
      }
    }

    .split-line {
      position: relative;
      flex: 0 0 0;
      border-left: 4rpx solid #fff;
      margin: 0 10rpx 0 6rpx;
      background: #fff;

      &:before,
        {
        border-radius: 0 0 16rpx 16rpx;
        top: 0;
      }

      &:after {
        border-radius: 16rpx 16rpx 0 0;
        bottom: 0;
      }

      &:before,
      &:after {
        content: '';
        position: absolute;
        width: 24rpx;
        height: 12rpx;
        background: #f7f7f7;
        left: -14rpx;
        z-index: 1;
      }


    }
  }
</style>
