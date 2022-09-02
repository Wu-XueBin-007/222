<template>
  <view class="teledcard">
	  <view class="teledcard-conter">
		  <!-- <view class="teledcard-header">
		  	不知道怎么使用充值卡？快来看看 <span @click="getTo">使用说明</span>
		  </view> -->
		  <image v-if="setting.TollCardEntryImageId" :src="setting.TollCardEntryImageId.preview_url" mode="widthFix" style="width: 100%;" @click="getTo"></image>
	  	<view class="coupon-list">
	  	  <view :class="['coupon-item','used','color-violet']" v-for="(item,index) in list" :key="index" :style="{'background-image': 'url('+item.SolarTerms.image.preview_url+')'}">
	  	    <view style="font-size: 24upx;line-height: 24upx;position: absolute;top: 312upx;left: 126upx;">卡号：{{item.account_number}}</view>
	  	    <view style="font-size: 24upx;line-height: 24upx;position: absolute;top: 312upx;left: 416upx;">密码：{{item.password}}</view>
	  	  </view>
		  <view class="teledcard-main">
		  	<view class="teledcard-main-head">
		  		看看小伙伴们的卡片
		  	</view>
			
			<view class="teledcard-main-b">
				<view class="teledcard-main-item" v-for="(item,index) in bottomCard" :key="index" :style="{'background-image': 'url('+item.SolarTerms.image.preview_url+')'}">
					<view class="teledcard-main-c">
						<view class="teledcard-main-text">
							{{item.nick_name}}
						</view>
					</view>
				</view>
				<!-- <view class="teledcard-main-item" v-for="(item,index) in bottomCard" :key="index" style="background-image: url(https://oss.gzrhhj.com/10001/20211108/e66b73e5b413c7f8328d984f53ae7b52.png)">
					<view class="teledcard-main-c">
						<view class="teledcard-main-text">
							{{item.nick_name}}
						</view>
					</view>
				</view>
				<view class="teledcard-main-item" v-for="(item,index) in bottomCard" :key="index" style="background-image: url(https://oss.gzrhhj.com/10001/20211108/4bd0caf06ff968ed5964a5552f29b224.png)">
					<view class="teledcard-main-c">
						<view class="teledcard-main-text">
							{{item.nick_name}}
						</view>
					</view>
				</view> -->
				
			</view>
		  </view>
	  	</view>
	  </view>
  </view>
</template>

<script>
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import * as cardVoucherApi from '@/api/cardVoucher'
  import { CouponTypeEnum } from '@/common/enum/coupon'
  import * as teledcardApi from '@/api/teledcard/index.js'
  import * as Rapi from '@/api/home/rotation'
  
	
  export default {
    components: {
      MescrollBody
    },
    mixins: [MescrollMixin],
    data() {
      return {
        // 枚举类
        CouponTypeEnum,
        // 优惠券列表数据
        list:{},
		setting:{},
		bottomCard:{},
		page:1
        
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
	onShow() {
		this.getCouponList();
		this.getSetting();
		this.getbottomList();
	},
	onReachBottom() {
		this.bottomCallBack()
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
		bottomCallBack(e){
			console.log(e)
			if(!this.reqFlag){
				return false;
			}
			this.reqFlag = false;
			this.page = this.page + 1;
			this.getbottomList();
		},
		getbottomList(){
			let obj = {};
			obj.page = this.page;
			obj.limit = this.limit;
			teledcardApi.subordinateOrder(obj)
				.then(res=>{
					console.log(res)
					if(this.page<res.data.list.last_page){
						this.reqFlag = true;
					}
					if(this.page == 1){
						this.bottomCard = res.data.list.data ? res.data.list.data : [];
					}else{
						this.bottomCard = this.bottomCard.concat(res.data.list.data);
					}
				})
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
	  toDetail(e){
		  if(this.curTab == 0){
			  let goodsId = e.currentTarget.dataset.id || e.target.dataset.id;
			  this.$navTo('pages/goods/detail', {
			  	goodsId
			  })
		  }
		  
	  },
	  getTo(){
		  this.$navTo('pageHome/teledcard/manual')
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
          teledcardApi.list()
            .then(result => {
				console.log(result)
			 app.list=result.data.list.data
              resolve(result)
            })
        })
      },


    }
  }
</script>

<style lang="scss" scoped>
	.teledcard-header{
		width: 100%;
		height: 60upx;
		background-color: #F0FAFF;
		text-align: center;
		line-height: 60upx;
		color: #999999;
		font-size: 20upx;
	}
	.teledcard-header>span{
		color: #ff5060;
	}
  .coupon-list {
    padding: 20rpx 0;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
  }


  .coupon-item {
    position: relative;
    overflow: hidden;
    margin-bottom: 22rpx;
	width: 702upx;
	// background-image: url(../../static/back.png);
	background-size: 100% 100%;
	background-position: 0 0;
	height: 454upx;
	border-radius: 12upx;
	// padding: 24upx;
	box-sizing: border-box;
  }
  .express{
	  background-image: url(../../static/user/coupon.png);
  }
  
  .couponWrap{
	  width: 100%;
	  height: 100%;
	  background: #F0FAFF;
	  box-sizing: border-box;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  padding: 0 30upx;
  }
  .imgWrap{
	  width: 88upx;
	  height: 88upx;
	  // margin-right: 24upx;
	  background-position: center;
	  background-size: cover;
  }
  .couponWrapR{
	  width: calc(100% - 248upx);
	  display: flex;
	  align-items: center;
	  margin-left: 24upx;
  }
  .couponWrapRL{
	  width: 100%;
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
	  // height: 112upx;
	  // border-radius: 50%;
	  // background: #FFCDA7;
	  // line-height: 112upx;
	  font-size: 24upx;
	  text-align: center;
	  color: #333333;
	  box-sizing: border-box;
	  // padding: 8upx;
  }
  .couponWrapRR>span{
	  font-size: 48upx;
	  font-family: Alibaba PuHuiTi;
	  font-weight: bold;
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
  .teledcard-main-head{
	  font-size: 24upx;
	  color: #999999;
	  margin-top: 12upx;
  }
  .teledcard-main-b{
  	width: 702upx;
  	// height: 598upx;
  	background-color: #FFFFFF;
  	margin: 24upx auto 0;
  	overflow: auto;
  }
  .teledcard-main-item{
  	width: 100%;
	height: 144upx;
	margin-bottom: 24upx;
	padding-top: 12upx;
	box-sizing: border-box;
	background-size: 100% 332%;
	background-position: 0 0;
	border-radius: 16upx;
  }
  .teledcard-main-c{
	  width: 674upx;
	  height: 100upx;
	  margin: 12upx 14upx 12upx;
	  border: 2upx solid rgba(255,255,255,0.26);
	  
	  border-radius: 16upx;
	  position: relative;
  }
  .teledcard-main-text{
	  font-size: 36upx;
	  color: #352B25;
	  font-family: Noto Sans S Chinese;
	  font-weight: Medium;
	  padding: 8upx 10upx;
	  background-color: #FFFFFF;
	  position: absolute;
	  top: 16upx;
	  left: 22upx;
  }
</style>
