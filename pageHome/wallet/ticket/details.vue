<template>
  <view class="container">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ use: false }" :up="upOption"
      @up="upCallback">
      <view class="log-list">
        <view v-for="(item, index) in list.data" :key="index" class="log-item">
          <view class="item-left flex-box">
            <view class="rec-status">
              <text>{{ item.order_no }}</text>
            </view>
            <view class="rec-time">
              <text>{{ item.create_time }}</text>
            </view>
          </view>
          <view class="item-right">
            <text>{{ item.pay_price }}元</text>
          </view>
        </view>
      </view>
    </mescroll-body>
  </view>
</template>

<script>
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import * as LogApi from '@/api/balance/log'
  import * as OrderApi from "@/api/order"
  import { getEmptyPaginateObj, getMoreListData } from '@/utils/app'

  const pageSize = 15

  export default {
    components: {
      MescrollBody
    },
    mixins: [MescrollMixin],
    data() {
      return {
        // 余额账单明细列表
        list: getEmptyPaginateObj(),
        // 上拉加载配置
        upOption: {
          // 首次自动执行
          auto: true,
          // 每页数据的数量; 默认10
          page: { size: pageSize },
          // 数量要大于12条才显示无更多数据
          noMoreSize: 12,
          // 空布局
          empty: {
            tip: '亲，暂无退款明细'
          }
        }
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
		// 刷新订单列表
		onRefreshList() {
		  this.list = getEmptyPaginateObj()
		  setTimeout(() => {
		    this.mescroll.resetUpScroll()
		  }, 120)
		},
      /**
       * 上拉加载的回调 (页面初始化时也会执行一次)
       * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
       * @param {Object} page
       */
      upCallback(page) {
        const app = this
        // 设置列表数据
        app.getOrderList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },
		// 获取订单列表
		getOrderList(pageNo = 1) {
		  const app = this
		  return new Promise((resolve, reject) => {
		    OrderApi.list({ dataType: "apply_cancel", page: pageNo }, { load: false })
		      .then(result => {
		        // 合并新数据
		        const newList = app.initList(result.data.list)
		        app.list.data = getMoreListData(newList, app.list, pageNo)
		        resolve(newList)
		      })
		  })
		},
		// 初始化订单列表数据
		initList(newList) {
		  newList.data.forEach(item => {
		    item.total_num = 0
		    item.goods.forEach(goods => {
		      item.total_num += goods.total_num
		    })
		  })
		  return newList
		},
      // 获取余额账单明细列表
      getLogList(pageNo = 1) {
        const app = this
        return new Promise((resolve, reject) => {
          LogApi.backList({ page: pageNo })
            .then(result => {
				//console.log(result)
              // 合并新数据
              const newList = result.data.list
              app.list.data = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
        })
      }

    }
  }
</script>

<style lang="scss" scoped>
  page,
  .container {
    background: #fff;
  }

  .log-list {
    padding: 0 30rpx;
  }

  .log-item {
    font-size: 28rpx;
    padding: 20rpx 20rpx;
    line-height: 1.8;
    border-bottom: 1rpx solid rgb(238, 238, 238);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .rec-status {
    color: #333;

    .rec-time {
      color: rgb(160, 160, 160);
      font-size: 26rpx;
    }
  }
</style>
