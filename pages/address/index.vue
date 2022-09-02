<template>
  <view class="container">
    <view class="addres-list">
      <view class="address-item" v-for="(item, index) in list" :key="index" @click.stop="handleSetDefault(item.address_id)">
        <view class="contacts">
          <text class="name">{{ item.name }}</text>
          <text class="phone">{{ item.phone }}</text>
        </view>
        <view class="address">
          <text class="region" v-for="(region, idx) in item.region" :key="idx">{{ region }}</text>
          <text class="detail">{{ item.detail }}</text>
        </view>
        <view class="line"></view>
        <view class="item-option">
          <view class="_left">
            <label class="item-radio">
              <radio class="radio" color="#ff5060" :checked="item.address_id == defaultId"></radio>
              <text class="text">{{ item.address_id == defaultId ? '默认' : '选择' }}</text>
            </label>
          </view>
          <view class="_right">
            <view class="events">
              <view class="event-item" @click.stop="handleUpdate(item.address_id)">
                <text class="iconfont icon-edit"></text>
                <text class="title">编辑</text>
              </view>
              <view class="event-item" @click.stop="handleRemove(item.address_id)">
                <text class="iconfont icon-delete"></text>
                <text class="title">删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <empty v-if="!list.length" :isLoading="isLoading" tips="亲，暂无收货地址" />
    <!-- 底部操作按钮 -->
    <view class="footer-fixed">
      <view class="btn-wrapper">
        <view class="btn-item btn-item-main" @click="handleCreate()">添加新地址</view>
      </view>
    </view>
  </view>
</template>

<script>
  import * as AddressApi from '@/api/address'
  import Empty from '@/components/empty'
  import * as seckillApi from '@/api/seckill/seckill.js'

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

    methods: {

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
          AddressApi.defaultId()
            .then(result => {
              app.defaultId = result.data.defaultId
              resolve(result)
            })
            .catch(reject)
        })
      },

      // 列表排序把默认收货地址放到最前
      onReorder() {
        const app = this
        app.list.sort(item => {
          return item.address_id == app.defaultId ? -1 : 1
        })
      },

      /**
       * 添加新地址
       */
      handleCreate() {
        this.$navTo('pages/address/create')
      },

      /**
       * 编辑地址
       * @param {int} addressId 收货地址ID
       */
      handleUpdate(addressId) {
        this.$navTo('pages/address/update', { addressId })
      },

      /**
       * 删除收货地址
       * @param {int} addressId 收货地址ID
       */
      handleRemove(addressId) {
        const app = this
        uni.showModal({
          title: "提示",
          content: "您确定要删除当前收货地址吗?",
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
        AddressApi.remove(addressId)
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
        AddressApi.setDefault(addressId)
          .then(result => {
            app.defaultId = addressId
			if(app.options.from === 'checkout'){
				uni.navigateBack()
			}else if(app.options.from === 'order'){
				let obj = {};
				obj.addressId = addressId;
				obj.orderId = app.options.orderId;
				seckillApi.updateAddress(obj).then(res=>{
					setTimeout(()=>{
						uni.navigateBack();
					},1500)
					this.$success("修改成功");
				})
			}
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
