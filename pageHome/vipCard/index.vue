<template>
  <view class="container">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ use: false }" :up="upOption"
      @up="upCallback">

      <!-- tab栏 -->
      <u-tabs :list="tabs" :is-scroll="false" :current="curTab" active-color="#ff5060" :duration="0.2"
        @change="onChangeTab" />
		<view class="card-privileg" v-if="curTab==0">
			<view class="card-privilegT" :style="{'background-image': 'url('+setting.vipMobilePicId.preview_url+')'}">
				<view class="card-bord">
					
				</view>
				<view class="card-btn">
					<view class="card-text" @click="reCard">
						<view class="">
							立即
						</view>
						<view class="">
							申请
						</view>
					</view>
				</view>
			</view>
			<view class="card-privilegB">
				<view class="card-privilegB-head">
					已领取的VIP特权卡
				</view>
				<view class="card-privilegB-item card-top" v-for="(item,index) in cardList" :key="index" :style="{'background-image': 'url('+setting.vipMobilePicId.preview_url+')'}">
					<view class="card-bord">
						<view class="card-bordC">
							<view class="card-bordL">
								卡号：{{item.account_number}}
							</view>
							<view class="card-bordR">
								密码：{{item.password}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
      <!-- 优惠券列表 -->
      <view class="coupon-list" v-if="curTab==1">
        <view v-if="list.length" class="coupon-list">
          <view class="coupon-item" v-for="(item, index) in list" :key="index">
            <view class="item-wrapper" :class="['color-' + color[index % color.length]]">
              <view class="coupon-type">{{ CouponTypeEnum[item.coupon_type].name }}</view>
              <view class="tip dis-flex flex-dir-column flex-x-center">
                <view v-if="item.coupon_type == CouponTypeEnum.FULL_DISCOUNT.value">
                  <text class="f-30">￥</text>
                  <text class="money">{{ item.reduce_price }}</text>
                </view>
                <text class="money" v-if="item.coupon_type == CouponTypeEnum.DISCOUNT.value">{{ item.discount }}折</text>
                <text class="pay-line">满{{ item.min_price }}元可用</text>
              </view>
              <view class="split-line"></view>
              <view class="content dis-flex flex-dir-column flex-x-between">
                <view class="title">{{ item.name }}</view>
                <view class="bottom dis-flex flex-y-center">
                  <view class="time flex-box">
                    <text v-if="item.expire_type == 10">领取{{ item.expire_day }}天内有效</text>
                    <text v-if="item.expire_type == 20">{{ item.start_time }}~{{ item.end_time }}</text>
                  </view>
                  <view class="receive" v-if="item.state.value" @click="receive(item.coupon_id)">
                    <text>立即领取</text>
                  </view>
                  <view v-else class="receive state">
                    <text>{{ item.state.text }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
	  <view class="card-voucher" v-if="curTab==2">
	  	<view class="card-voucherT" v-for="(item,index) in gList" :key="index" :style="{'background-image': 'url('+item.image.preview_url+')'}">
	  		<view class="card-bord2">
	  			
	  		</view>
	  		<view class="card-btn2" @click="reGoods(item.id)">
	  			<view class="card-text2">
	  				<view class="">
	  					立即
	  				</view>
	  				<view class="">
	  					申请
	  				</view>
	  			</view>
	  		</view>
	  	</view>
		<!-- <view class="card-voucherT">
			<view class="card-bord2">
				
			</view>
			<view class="card-btn2">
				<view class="card-text2">
					<view class="">
						立即
					</view>
					<view class="">
						申请
					</view>
				</view>
			</view>
		</view> -->
	  	<view class="card-voucherB">
	  		<view class="card-voucherB-head" v-if="gList">
	  			已领取的VIP特权卡
	  		</view>
	  		<view class="card-voucherB-item card-top" v-for="(item,index) in GoodsOrderList" :key="index" :style="{'background-image': 'url('+item.counterImage.preview_url+')'}">
	  			<view class="card-bord2">
	  				<view class="card-btn2">
	  					<view class="card-text3" @click="getred(item.id)">
	  						<view class="">
								去使用
	  						</view>
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
  import MescrollBody from '@/components/mescroll-uni/mescroll-body2.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData } from '@/utils/app'
  import * as CouponApi from '@/api/coupon'
  import * as MyCouponApi from '@/api/myCoupon'
  import * as VipCardApi from '@/api/teledcard/vipCard'
  import { CouponTypeEnum } from '@/common/enum/coupon'
  import * as Rapi from '@/api/home/rotation'
  import store from '../../store'

  const color = ['red', 'blue', 'violet', 'yellow']
  const pageSize = 15
  const tabs = [{
    name: `VIP特权卡`,
    // value: 'isUsable'
  }, {
    name: `VIP商城券`,
    // value: 'isUse'
  }, {
    name: `VIP礼品券`,
    // value: 'isExpire'
  }]

  export default {
    components: {
      MescrollBody
    },
    mixins: [MescrollMixin],
    data() {
      return {
		  // 系统设置
		  setting: {},
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
            tip: '亲，暂无相关VIP卡券'
          },
		  isLoading: true
        },
		cardList:{},
		gList:{},
		GoodsOrderList:{}
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
		this.getSetting()
		this.getCardlist()
		this.getGoodsList()
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
          CouponApi.list({is_user:2}, { load: false })
            .then(result => {
              // 合并新数据
              const newList = result.data.list;
			  app.list=newList
              // app.list = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
        })
      },
	  /**
	   * 获取优惠券列表
	   * @param {bool} load 是否显示loading弹窗
	   */
	  // getCouponList(pageNo = 1) {
	  //   const app = this
	  //   app.isLoading = true
	  //   CouponApi.list({user_id:store.getters.userId},{ page: pageNo }, { load:false})
	  //     .then(result => {
	  //       app.list = result.data.list
	  //     })
	  //     .finally(() => app.isLoading = false)
	  // },
	  
	  // 立即领取
	  receive(couponId) {
	    const app = this
	    MyCouponApi.receive(couponId)
	      .then(result => {
	        // 显示领取成功提示
	        app.$success(result.message)
	        // 刷新优惠券列表
	        app.getCouponList(false)
	      })
	  },
	  getCardlist(){
		 const app = this
		 VipCardApi.list()
		   .then(result => {
			   console.log(result)
			   app.cardList=result.data.list;
		     // 显示领取成功提示
		     // app.$success(result.message)
		     // 刷新优惠券列表
		     // app.getCouponList(false)
		   }) 
	  },
	  getGoodsList(){
	  		 const app = this
	  		 VipCardApi.gList()
	  		   .then(result => {
	  			   console.log(result)
	  			   app.gList=result.data.list.data;
	  		     // 显示领取成功提示
	  		     // app.$success(result.message)
	  		     // 刷新优惠券列表
	  		     // app.getCouponList(false)
	  		   }) 
	  },
	  getGoodsOrderList(){
		  const app = this
		  VipCardApi.goodsOrderList()
		    .then(result => {
			   console.log(result)
			   app.GoodsOrderList=result.data.list.data;
		      // 显示领取成功提示
		      // app.$success(result.message)
		      // 刷新优惠券列表
		      // app.getCouponList(false)
		    }) 
	  },
	  reGoods(id){
		  const app = this
		  VipCardApi.goods_order({counter_goods_id:id})
		    .then(result => {
		      // 显示领取成功提示
		      app.$success(result.message)
		      // 刷新优惠券列表
		      // app.getCouponList(false)
		    })
	  },
	  reCard(){
		  const app = this
		  VipCardApi.add()
		    .then(result => {
		      // 显示领取成功提示
		      app.$success(result.message)
		      // 刷新优惠券列表
		      // app.getCouponList(false)
		    })
	  },
	  getSetting() {
	  	const app = this
	  	return new Promise((resolve, reject) => {
	  		Rapi.info().then(setting => {
	  			app.setting = setting.data.storeInfo
	  			resolve(setting)
	  		}).catch(reject)
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
		if(app.curTab==1){
			app.onRefreshList()
		}else if(app.curTab==0){
			app.getCardlist()
		}else if(app.curTab==2){
			app.getGoodsList()
			app.getGoodsOrderList()
		}
        
      },
	  getred(id){
		  this.$navTo('pageHome/vipCard/voucher/index', {
		  	id
		  })
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
	.mescroll-body-content .mescroll-empty .empty-icon{
		display: none;
	}
  .coupon-list {
    padding: 20rpx;
  }


  .coupon-item {
    position: relative;
    overflow: hidden;
    margin-bottom: 22rpx;
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
	  background-image: url(../../static/couponBjt.png);
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
  .card-privileg{
	  
  }
  .card-privilegT{
	  width: 702upx;
	  height: 168upx;
	  margin: 32upx auto 0;
	  // background-image: url('https://oss.gzrhhj.com/10001/20211020/e260ccab85dac58da93608a1d2aaefac.png');
	  background-size: 100% 100%;
	  background-position: 0 0;
	  border-radius: 16upx;
	  position: relative;
	  padding-top: 12upx;
	  box-sizing: border-box;
	  background-color: #ff5060;
  }
  .card-bord{
	 width: 674upx;
	 height: 140upx;
	 margin: 0 auto 0;
	 border: 2upx solid rgba(255,255,255,0.26);
	 display: flex;
	 border-radius: 16upx;
  }
  .card-btn{
	  position: absolute;
	  top: 20upx;
	  right: 44upx;
	  width: 112upx;
	  height: 112upx;
	  border-radius: 50%;
	  background-color: #D0EBFF;
  }
  .card-text{
	  width: 96upx;
	  height: 96upx;
	  // line-height: 96upx;
	  border: 2upx solid #FFFFFF;
	  border-radius: 50%;
	  font-size: 24upx;
	  color: #333333;
	  font-weight: Bold;
	  text-align: center;
	  margin: 8upx auto 0;
  }
  .card-text>view:nth-child(1){
	  margin-top: 14upx;
  }
  .card-privilegB{
	  
  }
  .card-privilegB-head{
	  font-size: 24upx;
	  color: #999999;
	  margin-top: 32upx;
	  margin-left: 24upx;
  }
  .card-privilegB-item{
	  width: 702upx;
	  height: 168upx;
	  margin: 32upx auto 0;
	  // background-image: url('https://oss.gzrhhj.com/10001/20211020/e260ccab85dac58da93608a1d2aaefac.png');
	  background-size: 100% 100%;
	  background-position: 0 0;
	  border-radius: 16upx;
	  position: relative;
	  padding-top: 12upx;
	  box-sizing: border-box;
	  background-color: #ff5060;
  }
  .card-top{
	  margin-top: 24upx;
  }
  .card-bordC{
	  background-color: #FFFFFF;
	  height: 40upx;
	  padding-right: 14upx;
	  // margin: 64upx 0 0 -16upx;
	  display: flex;
	  line-height: 40upx;
	  position: absolute;
	  top: 35%;
	  left: 0;
  }
  .card-bordR{
	  font-size: 24upx;
	  color: #333333;
	  margin-left: 12upx;
  }
  .card-bordL{
	  font-size: 24upx;
	  color: #333333;
	  margin-left: 32upx;
  }
  .card-voucher{
  	  
  }
  .card-voucherT{
  	  width: 702upx;
  	  height: 168upx;
  	  margin: 32upx auto 0;
  	  // background-image: url('https://oss.gzrhhj.com/10001/20211020/e260ccab85dac58da93608a1d2aaefac.png');
  	  background-size: 100% 100%;
  	  background-position: 0 0;
  	  border-radius: 16upx;
  	  position: relative;
  	  padding-top: 12upx;
  	  box-sizing: border-box;
	  background-color: #ff5060;
  }
  .card-bord2{
  	 width: 674upx;
  	 height: 140upx;
  	 margin: 0 auto 0;
  	 border: 2upx solid rgba(255,255,255,0.26);
  	 display: flex;
  	 border-radius: 16upx;
  }
  .card-btn2{
  	  position: absolute;
  	  top: 20upx;
  	  right: 44upx;
  	  width: 112upx;
  	  height: 112upx;
  	  border-radius: 50%;
  	  background-color: #D0EBFF;
  }
  .card-text2{
  	  width: 96upx;
  	  height: 96upx;
  	  // line-height: 96upx;
  	  border: 2upx solid #FFFFFF;
  	  border-radius: 50%;
  	  font-size: 24upx;
  	  color: #333333;
  	  font-weight: Bold;
  	  text-align: center;
  	  margin: 8upx auto 0;
  }
  .card-text2>view:nth-child(1){
  	  margin-top: 14upx;
  }
  .card-text3{
  	  width: 96upx;
  	  height: 96upx;
  	  // line-height: 96upx;
  	  border: 2upx solid #FFFFFF;
  	  border-radius: 50%;
  	  font-size: 24upx;
  	  color: #FFFFFF;
  	  font-weight: Bold;
  	  text-align: center;
  	  margin: 8upx auto 0;
  }
  .card-text3>view:nth-child(1){
  	  margin-top: 30upx;
  }
  .card-voucherB{
  	  
  }
  .card-voucherB-head{
  	  font-size: 24upx;
  	  color: #999999;
  	  margin-top: 32upx;
  	  margin-left: 24upx;
  }
  .card-voucherB-item{
  	  width: 702upx;
  	  height: 168upx;
  	  margin: 32upx auto 0;
  	  // background-image: url('https://oss.gzrhhj.com/10001/20211020/e260ccab85dac58da93608a1d2aaefac.png');
  	  background-size: 100% 100%;
  	  background-position: 0 0;
  	  border-radius: 16upx;
  	  position: relative;
  	  padding-top: 12upx;
  	  box-sizing: border-box;
	  background-color: #ff5060;
  }

</style>
