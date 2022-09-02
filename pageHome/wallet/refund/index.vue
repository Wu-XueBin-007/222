<template>
  <view class="container" v-if="!isLoading">
    <view class="space-upper">
      <view class="wallet-image">
        <image src="/static/wallet02.png" mode="widthFix"></image>
      </view>
      <view class="wallet-account">
        <view class="wallet-account_balance">
          <text>{{ userInfo.money }}</text>
        </view>
		<view class="wallet-account_lable2" @click="onTargetRechargeOrder">
		  <text>查看明细</text>
		</view>
      </view>
    </view>
    <view class="space-lower">
      <view v-if="setting.is_entrance" class="space-lower_item btn-recharge">
        <view class="btn-submit" @click="onTargetCashier()">提现</view>
      </view>
	  <view class="wallet-account_lable2" @click="toGetList" style="text-align: center;margin-top: 30upx;">
	    <text>提现记录</text>
	  </view>
      <!-- <view class="space-lower_item item-lable dis-flex flex-x-around">
        <view class="lable-text" @click="onTargetRechargeOrder()">
          <text>充值记录</text>
        </view>
        <view class="lable-text" @click="onTargetBalanceLog()">
          <text>账单详情</text>
        </view>
      </view> -->
    </view>
  </view>
</template>

<script>
  import * as UserApi from '@/api/user'
  import SettingModel from '@/common/model/Setting'
  import SettingKeyEnum from '@/common/enum/setting/Key'

  export default {
    data() {
      return {
        // 正在加载
        isLoading: true,
        // 会员信息
        userInfo: {},
        // 充值设置
        setting: {},
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 获取页面数据
      this.getPageData()
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
		toGetList(){
			this.$navTo("pageHome/distribution/withdrawal/index",{type:2})
		},
      // 获取页面数据
      getPageData() {
        const app = this
        app.isLoading = true
        Promise.all([app.getUserInfo(), app.getSetting()])
          .then(() => app.isLoading = false)
      },

      // 获取会员信息
      getUserInfo() {
        const app = this
        return new Promise((resolve, reject) => {
          UserApi.info()
            .then(result => {
              app.userInfo = result.data.userInfo
              resolve(app.userInfo)
            })
        })
      },

      // 获取充值设置
      getSetting() {
        const app = this
        return new Promise((resolve, reject) => {
          SettingModel.item(SettingKeyEnum.RECHARGE.value, false)
            .then(data => {
              app.setting = data
              resolve(data)
            })
        })
      },
      onTargetCashier() {
        this.$navTo('pageHome/cashier/withdrawal?type=1')
      },
      onTargetRechargeOrder() {
        this.$navTo('pageHome/wallet/refund/details',{type:1})
      },
      onTargetBalanceLog() {
        this.$navTo('pageHome/wallet/balance/log')
      }

    }
  }
</script>
<style>
  page {
    background: #fff;
  }
</style>
<style lang="scss" scoped>
  .container {
    background: #fff;
  }

  .space-upper {
    padding: 150rpx 0;
    text-align: center;
	position: relative;
  }

  .wallet-image image {
    width: 220rpx;
    height: 220rpx;
  }

  .wallet-account {
    margin-top: 20rpx;
  }

  .wallet-account_balance {
    font-size: 52rpx;
  }

  .wallet-account_lable {
    margin-top: 10rpx;
    color: #cec1c1;
    font-size: 24rpx;
  }
  .wallet-account_lable2{
	  margin-top: 10rpx;
	  color: #ff5060;
	  font-size: 24rpx;
  }
  .space-lower {
    margin-top: 30rpx;
    padding: 0 110rpx;
  }

  .btn-recharge .btn-submit {
    width: 400rpx;
    height: 84rpx;
    line-height: 84rpx;
    margin: 0 auto;
    text-align: center;
    border-radius: 50rpx;
    background: #ff5060;
    color: white;
    font-size: 30rpx;
  }

  .item-lable {
    margin-top: 80rpx;
    font-size: 26rpx;
    color: rgb(94, 94, 94);
    padding: 0 100rpx;
  }
</style>
