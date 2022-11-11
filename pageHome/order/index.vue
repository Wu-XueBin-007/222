<template>
  <view class="container">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback"
      :up="upOption" @up="upCallback">

      <!-- tab栏 -->
      <u-tabs :list="tabs" :is-scroll="false" :current="curTab" active-color="#ff5060" :duration="0.2"
        @change="onChangeTab" />

      <!-- 订单列表 -->
      <view class="order-list">
        <view class="order-item" v-for="(item, index) in list.data" :key="index" style="position: relative;">
          <view class="item-top">
            <view class="item-top-left" style="display: flex;align-items: center;">
				<image src="../../static/home/seckill_order_icon.png" v-if="item.is_big_vip==0&&item.order_source==20" style="width: 52rpx;z-index: 9;" mode="widthFix"></image>
				<image src="../../static/home/lucky_order_icon.png" v-else-if="item.is_big_vip==0&&item.order_source==40" style="width: 52rpx;z-index: 9;" mode="widthFix"></image>
				<image src="../../static/home/BigMember.png" v-else-if="item.is_big_vip==1" style="width: 52rpx;z-index: 9;" mode="widthFix"></image>
				<image src="../../static/home/huxury.png" v-else-if="item.is_luxury_goods==1" style="width: 52rpx;z-index: 9;" mode="widthFix"></image>
				<image src="../../static/home/product_order_icon.png" v-else style="width: 52rpx;z-index: 9;" mode="widthFix"></image>
              <text class="order-time" v-if="item.is_big_vip==0&&item.order_source==20">秒杀订单</text>
			  <text class="order-time" v-else-if="item.is_big_vip==0&&item.order_source==40">活动订单</text>
			  <text class="order-time" v-else-if="item.is_big_vip==1">大会员订单</text>
			  <text class="order-time" v-else-if="item.is_luxury_goods==1">高奢订单</text>
			  <text class="order-time" v-else>商城订单</text>
			  <!-- <text class="order-time" style="color: #ff5060;margin-left: 20rpx;">{{ item.state_text }}</text> -->
			  <!-- <image src="../../static/icon/seckill_icon.png" v-if="item.order_source==20" style="width: 34rpx;height: 34rpx;margin-left: 24rpx;"></image> -->
            </view>
            <!-- <view class="item-top-right">
              <text class="state-text">{{ item.state_text }}</text>
            </view> -->
          </view>
          <!-- 商品列表 -->
          <view class="goods-list" @click="handleTargetDetail(item.order_id)">
            <view class="goods-item" v-for="(goods, idx) in item.goods" :key="idx">
              <!-- 商品图片 -->
              <view class="goods-image">
                <image class="image" :src="goods.goods_image" mode=""></image>
              </view>
              <!-- 商品信息 -->
              <view class="goods-content">
                <view class="goods-title twolist-hidden"><text>{{ goods.goods_name }}</text></view>
                <view class="goods-props clearfix">
                  <view class="goods-props-item" v-for="(props, idx) in goods.goods_props" :key="idx">
                    <text>{{ props.value.name }}</text>
                  </view>
                </view>
              </view>
              <!-- 交易信息 -->
              <view class="goods-trade">
                <view class="goods-price">
                  <text class="unit">￥</text>
                  <text class="value">{{ goods.goods_price }}</text>
                </view>
                <view class="goods-num">
                  <text>×{{ goods.total_num }}</text>
                </view>
              </view>
            </view>
			<view class="goods-list-item">
				<text class="state-text">{{ item.state_text }}</text>
			</view>
          </view>
          <!-- 订单合计 -->
          <view class="order-total">
            <text>共{{ item.total_num }}件商品，实付款</text>
            <text class="unit">￥</text>
            <text class="money">{{ item.pay_price }}</text>
          </view>
          <!-- 订单操作 -->
          <view v-if="item.order_status != 20" class="order-handle">
            <view class="btn-group clearfix" style="display: flex;justify-content: flex-end;">
              <!-- 未支付取消订单 -->
              <view v-if="item.pay_status == 10" style="margin-right: 20upx;">
                <view class="btn-item" @click="onCancel(item.order_id)">取消</view>
              </view>
			  <view v-if="(item.order_status != OrderStatusEnum.APPLY_CANCEL.value && item.order_status != OrderStatusEnum.COMPLETED.value)||item.pay_status == 10" style="margin-right: 20upx;">
			    <view v-if="(item.pay_status == PayStatusEnum.SUCCESS.value && item.delivery_status == DeliveryStatusEnum.NOT_DELIVERED.value)||item.pay_status == 10">
			      <view class="btn-item" @click="editAddress(item.order_id)">修改地址</view>
			    </view>
			  </view>
              <!-- 已支付取消订单 -->
              <block v-if="item.order_status != OrderStatusEnum.APPLY_CANCEL.value && item.order_status != OrderStatusEnum.COMPLETED.value">
                <view v-if="(item.pay_status == PayStatusEnum.SUCCESS.value && item.delivery_status == DeliveryStatusEnum.NOT_DELIVERED.value) || (item.delivery_status == DeliveryStatusEnum.DELIVERED.value && item.receipt_status == ReceiptStatusEnum.NOT_RECEIVED.value)">
                  <view class="btn-item" @click="onCancel(item.order_id)">申请退款</view>
                </view>
              </block>
			  
              <view v-if="item.order_status == OrderStatusEnum.APPLY_CANCEL.value && item.order_status != OrderStatusEnum.COMPLETED.value" class="f-28 col-8">退款申请中</view>
			  <view style="margin-left: 20upx;" v-if="item.order_status != OrderStatusEnum.COMPLETED.value && item.order_status != OrderStatusEnum.APPLY_CANCEL.value && item.delivery_type == 20 && item.pay_status == PayStatusEnum.SUCCESS.value && item.delivery_status == DeliveryStatusEnum.NOT_DELIVERED.value">
			    <view class="btn-item active" @click="onCode(item.order_id)">核销码</view>
			  </view>
              <!-- 订单支付 -->
              <view v-if="item.pay_status == 10">
                <view class="btn-item active" @click="onPay(item.order_id)">去支付</view>
              </view>
			  <!-- 查看物流 -->
			  <view v-if="item.delivery_status == DeliveryStatusEnum.DELIVERED.value && item.receipt_status == ReceiptStatusEnum.NOT_RECEIVED.value && item.order_status != OrderStatusEnum.APPLY_CANCEL.value" style="margin-left: 20upx;">
			    <view class="btn-item" @click="handleTargetExpress(item.order_id)">查看物流</view>
			  </view>
              <!-- 确认收货 -->
              <view v-if="item.delivery_status == DeliveryStatusEnum.DELIVERED.value && item.receipt_status == ReceiptStatusEnum.NOT_RECEIVED.value && item.order_status != OrderStatusEnum.APPLY_CANCEL.value" style="margin-left: 20upx;">
                <view class="btn-item active" @click="onReceipt(item.order_id)">确认收货</view>
              </view>
			 
              <!-- 订单评价 -->
              <view v-if="item.order_status == OrderStatusEnum.COMPLETED.value && item.is_comment == 0">
                <view class="btn-item" @click="handleTargetComment(item.order_id)">评价</view>
              </view>
            </view>
          </view>
        </view>

      </view>

    </mescroll-body>

    <!-- 支付方式弹窗 -->
    <u-popup v-model="showPayPopup" mode="bottom" border-radius="26" :closeable="true">
      <view class="pay-popup">
        <view class="title">请选择支付方式</view>
        <view class="pop-content">
          <!-- 微信支付 -->
          <!-- #ifdef MP-WEIXIN -->
          <view class="pay-item dis-flex flex-x-between" @click="onSelectPayType(PayTypeEnum.WECHAT.value)">
            <view class="item-left dis-flex flex-y-center">
              <view class="item-left_icon wechat">
                <text class="iconfont icon-wxpay"></text>
              </view>
              <view class="item-left_text">
                <text>{{ PayTypeEnum.WECHAT.name }}</text>
              </view>
            </view>
          </view>
          <!-- #endif -->
          <!-- 余额支付 -->
          <view class="pay-item dis-flex flex-x-between" @click="onSelectPayType(PayTypeEnum.BALANCE.value)">
            <view class="item-left dis-flex flex-y-center">
              <view class="item-left_icon balance">
                <text class="iconfont icon-qiandai"></text>
              </view>
              <view class="item-left_text">
                <text>{{ PayTypeEnum.BALANCE.name }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </u-popup>

  </view>

</template>

<script>
  import {
    DeliveryStatusEnum,
    DeliveryTypeEnum,
    OrderStatusEnum,
    PayStatusEnum,
    PayTypeEnum,
    ReceiptStatusEnum
  } from '@/common/enum/order'
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData } from '@/utils/app'
  import * as OrderApi from '@/api/order'
  import { wxPayment } from '@/utils/app'

  // 每页记录数量
  const pageSize = 15

  // tab栏数据
  const tabs = [{
    name: `全部`,
    value: 'all'
  },
  {
    name: `待支付`,
    value: 'payment'
  },
  {
    name: `待发货`,
    value: 'received'
  }, {
    name: `待收货`,
    value: 'delivery'
  }, {
    name: `待评价`,
    value: 'comment'
  }]

  export default {
    components: {
      MescrollBody
    },
    mixins: [MescrollMixin],
    data() {
      return {
        // 枚举类
        DeliveryStatusEnum,
        DeliveryTypeEnum,
        OrderStatusEnum,
        PayStatusEnum,
        PayTypeEnum,
        ReceiptStatusEnum,

        // 当前页面参数
        options: { dataType: 'all' },
        // tab栏数据
        tabs,
        // 当前标签索引
        curTab: 0,
        // 订单列表数据
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
            tip: '亲，暂无订单记录'
          }
        },
        // 控制首次触发onShow事件时不刷新列表
        canReset: false,
        // 支付方式弹窗
        showPayPopup: false
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 初始化当前选中的标签
      this.initCurTab(options)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      this.canReset && this.onRefreshList()
      this.canReset = true
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
		editAddress(order_id){
			uni.navigateTo({
				url:"/pages/address/index?from=order&orderId="+order_id
			})
		},
		toDetail(e){
			let id = e.target.dataset.id || e.currentTarget.dataset.id;
			uni.navigateTo({
				url:"/pageHome/order/detail?orderId="+id
			})
		},

      // 初始化当前选中的标签
      initCurTab(options) {
        const app = this
        if (options.dataType) {
          const index = app.tabs.findIndex(item => item.value == options.dataType)
          app.curTab = index > -1 ? index : 0
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
          OrderApi.list({ dataType: app.getTabValue(), page: pageNo }, { load: false })
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

      // 获取当前标签项的值
      getTabValue() {
        return this.tabs[this.curTab].value
      },

      // 切换标签项
      onChangeTab(index) {
        const app = this
        // 设置当前选中的标签
        app.curTab = index
        // 刷新订单列表
        app.onRefreshList()
      },

      // 刷新订单列表
      onRefreshList() {
        this.list = getEmptyPaginateObj()
        setTimeout(() => {
          this.mescroll.resetUpScroll()
        }, 120)
      },

      // 取消订单
      onCancel(orderId) {
        const app = this
        uni.showModal({
          title: '友情提示',
          content: '确认要取消该订单吗？',
          success(o) {
            if (o.confirm) {
              OrderApi.cancel(orderId)
                .then(result => {
                  // 显示成功信息
                  app.$success(result.message)
                  // 刷新订单列表
                  app.onRefreshList()
                })
            }
          }
        });
      },

      // 确认收货
      onReceipt(orderId) {
        const app = this
        uni.showModal({
          title: '友情提示',
          content: '确认收到商品了吗？',
          success(o) {
            if (o.confirm) {
              OrderApi.receipt(orderId)
                .then(result => {
                  // 显示成功信息
                  app.$success(result.message)
                  // 刷新订单列表
                  app.onRefreshList()
                })
            }
          }
        });
      },
	  handleTargetExpress(orderId){
		  this.$navTo('pageHome/order/express/index', { orderId: orderId,type:1 })
	  },
      // 点击去支付
      onPay(orderId) {
        // 记录订单id
        // this.payOrderId = orderId
        // // 显示支付方式弹窗
        // this.showPayPopup = true
		this.$navTo('pages/cashier/index',{order_id:orderId})
      },
	  onCode(orderId){
		  this.$navTo('pageHome/order/orderCode',{orderId:orderId})
	  },

      // 选择支付方式
      onSelectPayType(payType) {
        const app = this
        // 隐藏支付方式弹窗
        this.showPayPopup = false
        // 发起支付请求
        OrderApi.pay(app.payOrderId, payType)
          .then(result => app.onSubmitCallback(result))
      },

      // 订单提交成功后回调
      onSubmitCallback(result) {
        const app = this
        // 发起微信支付
        if (result.data.pay_type == PayTypeEnum.WECHAT.value) {
          wxPayment(result.data.payment)
            .then(() => {
              app.$success('支付成功')
              setTimeout(() => {
                app.onRefreshList()
              }, 1500)
            })
            .catch(err => {
              app.$error('订单未支付')
            })
            .finally(() => {
              app.disabled = false
            })
        }
        // 余额支付
        if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
          app.$success('支付成功')
          app.disabled = false
          setTimeout(() => {
            app.onRefreshList()
          }, 1500)
        }
      },

      // 跳转到订单详情页
      handleTargetDetail(orderId) {
		  console.log(orderId)
        this.$navTo('pageHome/order/detail', { orderId })
      },

      // 跳转到订单评价页
      handleTargetComment(orderId) {
        this.$navTo('pageHome/order/comment/index', { orderId })
      }

    },

  }
</script>

<style lang="scss" scoped>
  // 项目内容
  .order-item {
    margin: 20rpx auto 20rpx auto;
    padding: 24rpx 24rpx;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    background: #fff;
  }

  // 项目顶部
  .item-top {
    display: flex;
    justify-content: space-between;
    font-size: 26rpx;
	// font-weight: bold;
    margin-bottom: 20rpx;

    .order-time {
		font-size: 32upx;
		font-weight: bold;
		color: #333333;
		margin-left: 12upx;
    }

    .state-text {
      color: #EF343D  ;
    }
  }

  // 商品列表
  .goods-list {
	  position: relative;
	  .goods-list-item{
		  position: absolute;
		  bottom: -84upx;
		  left: -30upx;
		  width: 120upx;
		  height: 60upx;
		  background-color: #FFF6F7;
		  border-radius: 0upx 40upx 40upx 0upx;
		  text-align: center;
		  line-height: 60upx;
		  .state-text{
			  font-size: 26upx;
			  font-weight: bold;
			  color: #EF343D  ;
			  
		  }
	  }
    // 商品项
    .goods-item {
      display: flex;
      margin-bottom: 22rpx;

      // 商品图片
      .goods-image {
        width: 180rpx;
        height: 180rpx;

        .image {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 8rpx;
        }
      }

      // 商品内容
      .goods-content {
        flex: 1;
        padding-left: 16rpx;
        // padding-top: 16rpx;

        .goods-title {
          font-size: 28rpx;
          max-height: 76rpx;
		  font-weight: bold;
		  color: #333333;
        }

        .goods-props {
          margin-top: 14rpx;
          height: 40rpx;
          color: #ababab;
          font-size: 24rpx;
          overflow: hidden;

          .goods-props-item {
            display: inline-block;
            margin-right: 14rpx;
            padding: 4rpx 16rpx;
            border-radius: 12rpx;
            background-color: #F5F5F5;
            width: auto;
          }
        }


      }

      // 交易信息
      .goods-trade {
        // padding-top: 16rpx;
        width: 150rpx;
        text-align: right;
        color: $uni-text-color-grey;
        font-size: 26rpx;

        .goods-price {
          vertical-align: bottom;
          margin-bottom: 16rpx;
		  color: #333333;
		  font-size: 28upx;
		  font-weight: bold;

          .unit {
            margin-right: -2rpx;
            font-size: 24rpx;
          }
        }
		.goods-num{
			font-size: 28upx;
			color: #666666;
			margin-top: 60upx;
		}
      }

    }

  }

  // 订单合计
  .order-total {
    font-size: 28rpx;
    vertical-align: bottom;
    text-align: right;
    height: 40rpx;
	line-height: 50upx;
	color: #666666;
	margin-top: 24upx;
	font-weight: 500;
    // margin-bottom: 30rpx;

    .unit {
      margin-left: 8rpx;
      margin-right: -2rpx;
      font-size: 26rpx;
	  color: #333333;
	  font-weight: bold;
    }

    .money {
      font-size: 28rpx;
	  color: #333333;
	  font-weight: bold;
    }
  }

  // 订单操作
  .order-handle {
	  margin-top: 40rpx;
    .btn-group {

      .btn-item {
        border-radius: 40rpx;
        // padding: 20rpx 30rpx;
		width: 176upx;
		height: 80upx;
		line-height: 80upx;
        font-size: 28rpx;
        float: right;
        color: #333333;
		font-weight: bold;
		text-align: center;
        border: 1rpx solid #C8C8C8;

        &.active {
          color: #EF343D  ;
          border: 1rpx solid #EF343D  ;
        }
      }

    }

  }

  // 弹出层-支付方式
  .pay-popup {
    padding: 24rpx;

    .title {
      font-size: 30rpx;
      margin-bottom: 40rpx;
      font-weight: bold;
      text-align: center;
    }

    .pop-content {
      min-height: 260rpx;
      padding: 0 10rpx;

      .pay-item {
        padding: 24rpx 35rpx;
        font-size: 28rpx;
        border-bottom: 1rpx solid #f1f1f1;

        &:last-child {
          border-bottom: none;
        }

        .item-left_icon {
          margin-right: 20rpx;
          font-size: 32rpx;

          &.wechat {
            color: #00c800;
          }

          &.balance {
            color: #ff9700;
          }
        }
      }
    }
  }
</style>
