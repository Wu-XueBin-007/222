<template>
  <view class="container">
    <view class="addres-list">
      <view class="address-item" v-for="(item, index) in list" :key="index" @click="choicePreson(index)">
        <view class="contacts">
          <text class="name">{{ item.name }}</text>
          <text class="phone">{{ item.mobile }}</text>
        </view>
        <view class="address">
			<text class="name" style="margin-right: 16upx;">{{item.certificates_type==1?'身份证':'护照'}}</text>
          <text class="region">{{ item.certificates_number }}</text>
        </view>
        <view class="line"></view>
        <view class="item-option">
          <view class="_left">
            <label class="item-radio" @click.stop="handleSetDefault(item.id)">
              <radio class="radio" color="#ff5060" :checked="item.id == defaultId"></radio>
              <text class="text">{{ item.id == defaultId ? '默认' : '选择' }}</text>
            </label>
          </view>
          <view class="_right">
            <view class="events">
              <view class="event-item" @click.stop="handleUpdate(item.id)">
                <text class="iconfont icon-edit"></text>
                <text class="title">编辑</text>
              </view>
              <view class="event-item" @click.stop="handleRemove(item.id)">
                <text class="iconfont icon-delete"></text>
                <text class="title">删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <empty v-if="!list.length" :isLoading="isLoading" tips="亲，暂无乘车人信息" />
    <!-- 底部操作按钮 -->
    <view class="footer-fixed">
      <view class="btn-wrapper">
        <view class="btn-item btn-item-main" @click="handleCreate()">添加乘车人</view>
      </view>
    </view>
  </view>
</template>

<script>
  import * as AddressApi from '@/api/ticket/address.js'
  import Empty from '@/components/empty'

  export default {
    components: {
      Empty
    },
    data() {
      return {
        //当前页面参数
        options: {},
        // 正在加载
        isLoading: true,
        // 收货地址列表
        list: [],
        // 默认收货地址
        defaultId: null
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 当前页面参数
      this.options = options
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
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
		choicePreson(index){
			//console.log(index)
			let pages = getCurrentPages();
			let nowPage = pages[ pages.length - 1];  //当前页页面实例
			let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
			// prevPage.$vm.addressInfo = this.list[index];
			let detail = this.list[index];
			prevPage.$vm.infoFlag = true;
			prevPage.$vm.name = detail.name
			prevPage.$vm.mobile = detail.mobile
			prevPage.$vm.certificates_number = detail.certificates_number
			prevPage.$vm.certificates_type = detail.certificates_type;
			prevPage.$vm.passenger_discount_type = detail.passenger_discount_type;
			prevPage.$vm.imgInfo = detail.image;
			prevPage.$vm.indexC = Number(detail.certificates_type) - 1;
			prevPage.$vm.indexP = Number(detail.passenger_discount_type) - 1;
			prevPage.$vm.train_account_number = detail.train_account_number;
			prevPage.$vm.train_password = detail.train_password;
			prevPage.$vm.showToast()
			uni.navigateBack({
				delta:1
			})
		},
      // 获取页面数据
      getPageData() {
        const app = this
        app.isLoading = true
        Promise.all([app.getDefaultId(), app.getAddressList()])
          .then(() => {
            // 列表排序把默认收货地址放到最前
            app.onReorder()
          })
          .finally(() => app.isLoading = false)
      },

      // 获取收货地址列表
      getAddressList() {
        const app = this
        return new Promise((resolve, reject) => {
          AddressApi.list()
            .then(result => {
              app.list = result.data.list
              resolve(result)
            })
            .catch(reject)
        })
      },

      // 获取默认的收货地址
      getDefaultId() {
        return new Promise((resolve, reject) => {
          const app = this
          AddressApi.defaults()
            .then(result => {
				//console.log(result)
              app.defaultId = result.data.detail?result.data.detail.id:null;
			  
              resolve(result)
            })
            .catch(reject)
        })
      },

      // 列表排序把默认收货地址放到最前
      onReorder() {
        const app = this
        app.list.sort(item => {
          return item.id == app.defaultId ? -1 : 1
        })
      },

      /**
       * 添加新地址
       */
      handleCreate() {
        this.$navTo('pages/passengerManagement/create')
      },

      /**
       * 编辑地址
       * @param {int} addressId 收货地址ID
       */
      handleUpdate(addressId) {
        this.$navTo('pages/passengerManagement/update', { addressId })
      },

      /**
       * 删除收货地址
       * @param {int} addressId 收货地址ID
       */
      handleRemove(addressId) {
        const app = this
        uni.showModal({
          title: "提示",
          content: "您确定要删除当前乘车人吗?",
          success({ confirm }) {
            confirm && app.onRemove(addressId)
          }
        });
      },

      /**
       * 确认删除收货地址
       * @param {int} addressId 收货地址ID
       */
      onRemove(addressId) {
        const app = this
        AddressApi.del({id:addressId})
          .then(result => {
            app.getPageData()
          })
      },

      /**
       * 设置为默认地址
       * @param {Object} addressId
       */
      handleSetDefault(addressId) {
        const app = this
        AddressApi.edit({id:addressId,is_default:1})
          .then(result => {
            app.defaultId = addressId
            app.options.from === 'checkout' && uni.navigateBack()
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .addres-list {
    padding-bottom: 120rpx;
  }

  // 项目内容
  .address-item {
    margin: 20rpx auto 20rpx auto;
    padding: 30rpx 40rpx;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    background: #fff;
  }

  .contacts {
    font-size: 30rpx;
    margin-bottom: 16rpx;

    .name {
      margin-right: 16rpx;
    }
  }

  .address {
    font-size: 28rpx;

    .region {
      margin-right: 10rpx;
    }
  }

  .line {
    margin: 20rpx 0;
    border-bottom: 1rpx solid #f3f3f3;
  }

  .item-option {
    display: flex;
    justify-content: space-between;
    height: 48rpx;

    // 单选框
    .item-radio {
      font-size: 28rpx;

      .radio {
        vertical-align: middle;
        transform: scale(0.76)
      }

      .text {
        vertical-align: middle;
      }
    }

    // 操作
    .events {
      display: flex;
      align-items: center;
      line-height: 48rpx;

      .event-item {
        font-size: 28rpx;
        margin-right: 22rpx;
        color: #4c4c4c;

        &:last-child {
          margin-right: 0;
        }

        .title {
          margin-left: 8rpx;
        }
      }
    }

  }


  // 底部操作栏
  .footer-fixed {
    position: fixed;
    bottom: var(--window-bottom);
    left: 0;
    right: 0;
    height: 100rpx;
    z-index: 11;

    .btn-wrapper {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .btn-item {
      flex: 1;
      font-size: 28rpx;
	  width: 100%;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      color: #fff;
    }

    .btn-item-main {
      background-color: #ff5060;
    }

  }
</style>
