<template>
  <view class="container">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback"
      :up="upOption" @up="upCallback">

      <!-- tab栏 -->
      <u-tabs :list="tabs" :is-scroll="false" :current="curTab" active-color="#ff5060" :duration="0.2"
        @change="onChangeTab" />

      <!-- 订单列表 -->
      <view class="order-list">
        <view class="order-item" v-for="(item, index) in list.data" :key="index">
			
          <view class="item-top">
            <view class="item-top-left">
				<view class="item-top-icon">
					<image src="../../static/user/icon_ticket_plane.png" mode="" v-if="item.traffic_type == 1"></image>
					<image src="../../static/user/icon_ticket_train.png" mode="" v-if="item.traffic_type == 2"></image>
					<image src="../../static/user/icon_ticket_tall.png" mode="" v-if="item.traffic_type == 3"></image>
				</view>
				<view class="order-time">
					{{ item.train_number }} {{item.starting_point}} - {{item.finishing_point}}
				</view>
            </view>
            <view class="item-top-right">
				<!-- <image src="../../static/order/status/issued.png" class="orderOver" v-if="item.type == 3"></image> -->
              <text class="state-text" v-if="item.type == 1 && item.is_refund != 3" style="color: #FF5555;">{{ item.state_text }}</text>
			  <text class="state-text" v-if="item.type == 2 && item.is_refund != 3" style="color: #999999;">{{ item.state_text }}</text>
			  <text class="state-text" v-if="item.type == 3 && item.is_refund != 3" style="color: #999999;">{{ item.state_text }}</text>
			  <text class="state-text" v-if="item.type == 4 && item.is_refund != 3" style="color: #D0D0D0;">{{ item.state_text }}</text>
			  <text class="state-text" v-if="item.type == 5 && item.is_refund != 3" style="color: #D0D0D0;">{{ item.state_text }}</text>
			  <text class="state-text" v-if="item.type == 6 && item.is_refund != 3" style="color: #999999;">{{ item.state_text }}</text>
			  <text class="state-text" v-if="item.is_refund == 3" style="color: #999999;">已退款</text>
            </view>
          </view>
          <!-- 商品列表 -->
          <view class="goods-list" @click="handleTargetDetail(item.id)">
            <view class="goods-item">
              <view class="goods-text1" style="display: flex;justify-content: space-between;">
				  <view>
					  发车时间：<text>{{item.set_out_time_str}}</text>
				  </view>
				<view :style="{'color':item.is_processing==1?'#ff5060':'red','font-size':'30upx'}">{{item.is_processing==1?'已接单':'未接单'}}</view>
				
              </view>
			  <view class="goods-text2" style="display: flex;align-items: center;justify-content: space-between;">
				  <view>
					  姓名：<text>{{item.name}}</text>
				  </view>
				  <view style="display: flex;align-items: auto;">
					  <view>原价:<text style="color: red;">￥{{item.primary_price}}</text></view>
					  <view style="margin-left: 30upx;">实付:<text style="color: red;">￥{{item.price}}</text></view>
				  </view>
			  </view>
            </view>
          </view>
          <!-- 订单合计 -->
          <!-- <view class="order-total">
            <text>共{{ item.total_num }}件商品，总金额</text>
            <text class="unit">￥</text>
            <text class="money">{{ item.pay_price }}</text>
          </view> -->
          <!-- 订单操作 -->
          <view class="order-handle">
            <view class="btn-group clearfix" style="display: flex;justify-content: flex-end;">
              <!-- 未支付取消订单 -->
              <view v-if="item.type == 1" style="margin-right: 20upx;">
                <view class="btn-item" @click="onCancel(item.id)">取消</view>
              </view>
              <!-- 已支付取消订单 -->
              <!-- <block v-if="(item.type == 3 || (item.type == 2 && item.is_processing == 0)) && item.is_refund == 1">
                <view>
                  <view class="btn-item" @click="onRefund(item.id)">申请退款</view>
                </view>
              </block> -->
			  <block v-if="item.is_refund == 1 && item.type != 1">
			    <view>
			      <view class="btn-item" @click="onRefund(item.id)">申请退款</view>
			    </view>
			  </block>
			  
              <view v-if="(item.type == 3 || item.type == 2) && item.is_refund == 2" class="f-28 col-8">退款申请中</view>
			  
              <!-- 订单支付 -->
              <view v-if="item.type == 1">
                <view class="btn-item active" @click="onPay(item.id)">立即支付</view>
              </view>
              <!-- 确认收货 -->
              <view v-if="item.type == 4 || item.type == 5 || item.type == 6" style="margin-left: 20upx;">
                <view class="btn-item active" @click="againBuy">再次购票</view>
              </view>
              <!-- 订单评价 -->
			  <button @click="but_kf" class="btn-normal" v-if="item.type == 4 || item.type == 5 || item.type == 6" style="margin-left: 20upx;">
				  <view class="btn-item">联系客服</view>
			  </button>
			  <!-- <button open-type="contact" class="btn-normal" v-if="item.type == 4 || item.type == 5 || item.type == 6" style="margin-left: 20upx;">
			  				  <view class="btn-item">联系客服</view>
			  </button> -->
             
              
            </view>
          </view>
        </view>
		 <!--弹出框  -->
		<view class="popup-kf" v-if="showModalStatus2" catchtouchmove="true">
			<view class="popup-kf-img">
				<image :src="setting.CustomerServiceImage.preview_url" mode=""></image>
			</view>
		</view>
		
		<view v-if="showModalStatus2"
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: rgba(0,0,0,.5);z-index: 999;"
			catchtouchmove="true" @click="btn_cose"></view>
      </view>

    </mescroll-body>

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
  import * as OrderApi from '@/api/ticket/index.js'
  import { wxPayment } from '@/utils/app'
  import * as Rapi from '@/api/home/rotation'

  // 每页记录数量
  const pageSize = 15

  // tab栏数据
  const tabs = [{
    name: `全部`,
    value: 'all'
  }, {
    name: `待支付`,
    value: '1'
  }, {
    name: `待出票`,
    value: '2'
  }, {
    name: `已出票`,
    value: '3'
  }, {
    name: `已完结`,
    value: '4'
  }, {
    name: `已退款`,
    value: '5'
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
        showPayPopup: false,
		showModalStatus2:false,
		setting:{}
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
	  this.getSetting()
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
		//客服
		but_kf(){
			this.showModalStatus2=true;
		},
		btn_cose(){
			this.showModalStatus2=false;
		},
		// 获取商城设置
		getSetting() {
			const app = this
			return new Promise((resolve, reject) => {
				Rapi.info().then(setting => {
					app.setting = setting.data.storeInfo
					resolve(setting)
				}).catch(reject)
			})
		},
		onRefund(orderId){
			const app = this
			uni.showModal({
			  title: '友情提示',
			  content: '确认要申请退款吗？',
			  success(o) {
			    if (o.confirm) {
			      OrderApi.refund({id:orderId})
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
		againBuy(){
			this.$navTo("pages/ticket/index")
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
			let obj = {};
			obj.page = pageNo;
			//console.log(app.getTabValue())
			if(app.getTabValue() == 'all'){
				
			}else if(app.getTabValue() == 'refund'){
				obj.is_refund = 3;
			}else{
				obj.type = app.getTabValue();
			}
          OrderApi.list(obj, { load: false })
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
			  if(item.type == 1){
				  item.state_text = "待支付"
			  }else if(item.type == 2){
				  item.state_text = "待出票"
			  }else if(item.type == 3){
				  item.state_text = "已出票"
			  }else if(item.type == 4){
				  item.state_text = "已完结"
			  }else if(item.type == 5){
				  item.state_text = "已取消"
			  }else if(item.type == 6){
				  item.state_text = "已过期"
			  }
			  let year = new Date(item.set_out_time*1000).getFullYear();
			  let month = (new Date(item.set_out_time*1000).getMonth() + 1) > 9 ? (new Date(item.set_out_time*1000).getMonth() + 1) : ('0' + (new Date(item.set_out_time*1000).getMonth() + 1));
			  let day = new Date(item.set_out_time*1000).getDate() > 9 ? new Date(item.set_out_time*1000).getDate() : '0' + new Date(item.set_out_time*1000).getDate();
			  let hour = new Date(item.set_out_time*1000).getHours() > 9 ? new Date(item.set_out_time*1000).getHours() : '0' + new Date(item.set_out_time*1000).getHours();
			  let min = new Date(item.set_out_time*1000).getMinutes() > 9 ? new Date(item.set_out_time*1000).getMinutes() : '0' + new Date(item.set_out_time*1000).getMinutes();
			  let sec = new Date(item.set_out_time*1000).getSeconds() > 9 ? new Date(item.set_out_time*1000).getSeconds() : '0' + new Date(item.set_out_time*1000).getSeconds();
			item.set_out_time_str = year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
		  });
        return newList
      },

      // 获取当前标签项的值
      getTabValue() {
		  if(this.tabs[this.curTab].value == 'all') {
			  return 'all';
		  }else if(this.tabs[this.curTab].value == 5){
			  return 'refund'
		  }else{
			  return this.tabs[this.curTab].value
		  }
        
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
              OrderApi.cancel({id:orderId})
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

      // 点击去支付
      onPay(orderId) {
        // 记录订单id
        // this.payOrderId = orderId
        // // 显示支付方式弹窗
        // this.showPayPopup = true
		this.$navTo('pages/cashier/rechargeTicket',{order_id:orderId})
      },
	  onCode(orderId){
		  this.$navTo('pageHome/order/orderCode',{orderId:orderId})
	  },

      // 跳转到订单详情页
      handleTargetDetail(orderId) {
        this.$navTo('pageHome/orderTicket/detail', { orderId })
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
    padding: 30rpx 30rpx;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    background: #fff;
	position: relative;
  }
  .item-top-right{
	  position: relative;
  }
  .orderOver{
	  position: absolute;
	  width: 40upx;
	  height: 40upx;
	  
	  top: 50%;
	  transform: translate(-120%,-50%);
  }

  // 项目顶部
  .item-top {
    display: flex;
    justify-content: space-between;
    font-size: 26rpx;
	border-bottom: 2upx solid #EFEFEF;
    padding-bottom: 20rpx;
	.item-top-left{
		display: flex;
		.item-top-icon{
			width: 30upx;
			height: 32upx;
			margin-top: 4upx;
			image{
				width: 100%;
				height: 100%;
				// vertical-align: top;
			}
		}
		.order-time {
			font-size: 28upx;
			font-weight: bold;
			color: #333333;
			margin-left: 10upx;
		}
	}
    

    .state-text {
		font-size: 32upx;
		font-weight: bold;
      color: $uni-text-color-active;
    }
  }

  // 商品列表
  .goods-list {
	  margin-top: 40upx;
    // 商品项
    .goods-item {
      margin-bottom: 40rpx;
	  .goods-text1{
		  font-size: 24upx;
		  color: #333333;
	  }
	  .goods-text2{
		  font-size: 24upx;
		  color: #333333;
		  margin-top: 40upx;
	  }

      // 交易信息
      .goods-trade {
        padding-top: 16rpx;
        width: 150rpx;
        text-align: right;
        color: $uni-text-color-grey;
        font-size: 26rpx;

        .goods-price {
          vertical-align: bottom;
          margin-bottom: 16rpx;

          .unit {
            margin-right: -2rpx;
            font-size: 24rpx;
          }
        }
      }

    }

  }

  // 订单合计
  .order-total {
    font-size: 26rpx;
    vertical-align: bottom;
    text-align: right;
    height: 40rpx;
    margin-bottom: 30rpx;

    .unit {
      margin-left: 8rpx;
      margin-right: -2rpx;
      font-size: 26rpx;
    }

    .money {
      font-size: 28rpx;
    }
  }

  // 订单操作
  .order-handle {
    .btn-group {

      .btn-item {
        border-radius: 10rpx;
        padding: 6rpx 20rpx;
        font-size: 28rpx;
        float: right;
        color: #383838;
        border: 1rpx solid #a8a8a8;

        &.active {
          color: $uni-text-color-active;
          border: 1rpx solid $uni-text-color-active;
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
  //客服
  .popup-kf{
  	width: 400upx;
  	position: fixed;
  	top: 50%;
  	left: 50%;
  	transform: translate(-50%,-50%);
  	z-index: 2000;
  	// background-color: #FFFFFF;
  }
  .popup-kf-img{
  	width: 400upx;
  	height: 400upx;
  }
  .popup-kf-img>image{
  	width: 100%;
  	height: 100%;
  }
</style>
