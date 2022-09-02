<template>
  <view class="container">
    <!-- 标题 -->
    <view class="page-title">乘车人信息</view>
    <!-- 表单组件 -->
    <view class="form-wrapper">
      <u-form :model="form" ref="uForm" label-width="140rpx">
        <u-form-item label="姓名" prop="name">
          <u-input v-model="form.name" placeholder="请输入乘车人姓名" />
        </u-form-item>
        <u-form-item label="证件类型" prop="certificates_type">
        	<view style="position: relative;">
        		<picker mode="selector" @change="certificatesPickerChange" :range="certificatesList" range-key="name" :value="indexC">
        			<view>{{certificatesList[indexC].name}}</view>	
        		</picker>
        		<image src="../../static/icon/more_gray.png" style="width: 14upx;height: 24upx;position: absolute;right: 0;top: 50%;transform: translateY(-50%);"></image>
        	</view>
        </u-form-item>
        <u-form-item label="证件号码" prop="certificates_number">
          <u-input v-model="form.certificates_number" placeholder="请输入乘车人证件号码" />
        </u-form-item>
        <u-form-item label="联系电话" prop="phone">
          <u-input v-model="form.phone" placeholder="请输入乘车人手机号" />
        </u-form-item>
		<!-- <u-form-item label="12306账号" prop="train_account_number">
		  <u-input v-model="form.train_account_number" @blur="toMond" placeholder="请输入12306账号" />
		</u-form-item>
		<u-form-item label="12306密码" prop="train_password">
		  <u-input v-model="form.train_password" placeholder="请输入12306密码" />
		</u-form-item> -->
        <u-form-item label="旅客类型" prop="passenger_discount_type">
        	<view style="position: relative;">
        		<picker mode="selector" @change="passengerPickerChange" :range="passengerList" range-key="name" :value="indexP">
        			<view>{{passengerList[indexP].name}}</view>	
        		</picker>
        		<image src="../../static/icon/more_gray.png" style="width: 14upx;height: 24upx;position: absolute;right: 0;top: 50%;transform: translateY(-50%);"></image>
        	</view>
        </u-form-item>
		<view class="ticketfoB" v-if="passenger_discount_type>2">
			<view class="ticketfoBL">上传证件</view>
			<view class="ticketfoBR" @click="uplaodImg" :style="{'border':imgInfo.preview_url?'none':'2upx solid #CCCCCC'}">
				<image :src="imgInfo.preview_url?imgInfo.preview_url:'../../static/user/uploadImg.png'" :style="{'width':imgInfo.preview_url?'100%':'38upx','height':imgInfo.preview_url?'100%':'38upx'}"></image>
			</view>
		</view>
      </u-form>
    </view>
    <!-- 操作按钮 -->
    <view class="footer">
      <view class="btn-wrapper">
        <view class="btn-item btn-item-main" :class="{ disabled }" @click="handleSubmit()">保存</view>
      </view>
    </view>
  </view>
</template>

<script>
  import SelectRegion from '@/components/select-region/select-region'
  import { isMobile } from '@/utils/verify'
  import * as AddressApi from '@/api/ticket/address.js'
	import {detail} from "@/api/common.js";
	const App = getApp()
  // 表单验证规则
  const rules = {
    name: [{
      required: true,
      message: '请输入姓名',
      trigger: ['blur', 'change']
    }],
	// train_account_number: [{
	//   required: true,
	//   message: '请输入12306账号',
	//   trigger: ['blur', 'change']
	// }],
	// train_password: [{
	//   required: true,
	//   message: '请输入12306密码',
	//   trigger: ['blur', 'change']
	// }],
    phone: [{
      required: true,
      message: '请输入手机号',
      trigger: ['blur', 'change']
    }, {
      // 自定义验证函数
      validator: (rule, value, callback) => {
        // 返回true表示校验通过，返回false表示不通过
        return isMobile(value)
      },
      message: '手机号码不正确',
      // 触发器可以同时用blur和change
      trigger: ['blur'],
    }],
    region: [{
      required: true,
      message: '请选择省市区',
      trigger: ['blur', 'change'],
      type: 'array'
    }],
    detail: [{
      required: true,
      message: '请输入详细地址',
      trigger: ['blur', 'change']
    }],
  }

  export default {
    components: {
      SelectRegion
    },
    data() {
      return {
        form: {
          name: '',
          phone: '',
          region: [],
          detail: '',
			certificates_number: '',
			train_account_number:'',
			train_password:''
        },
        rules,
        // 加载中
        isLoading: true,
        // 按钮禁用
        disabled: false,
        // 当前收货地址ID
        addressId: null,
		certificatesList:[
		{id:1,name:'中国居民身份证'},
		{id:2,name:'护照'}
		],
		indexC:0,
		certificates_type:1,
		passengerList:[
			{id:1,name:'成人'},
			{id:2,name:'儿童'},
			{id:3,name:'学生'},
			// {id:4,name:'残疾人'},
			// {id:5,name:'军人'}
			],
		indexP:0,
		passenger_discount_type:1,
		detailInfo:{},
		imgInfo:{},
		info:{}
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad({ addressId }) {
      // 当前收货地址ID
      this.addressId = addressId
      // 获取当前记录详情
      this.getDetail();
	  detail()
	  	.then(res=>{
	  		this.info = res.data.detail;
	  	})
    },

    // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
    onReady() {
      this.$refs.uForm.setRules(this.rules)
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
		toMond(){
			let _this = this;
			uni.showModal({
				content:`${_this.info.ticket_tips1}`,
				success(res) {
					// if(res.confirm){
					// 	_this.btn_Submit()
					// }
				}
			})
		},
		passengerPickerChange: function(e) {		//改变的事件名
			////console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
			//console.log(e)
			this.indexP = e.target.value			//将数组改变索引赋给定义的index变量
			this.passenger_discount_type=this.passengerList[this.indexP].id		//将array【改变索引】的值赋给定义的jg变量
			
		//	//console.log("籍贯为：",this.jg)		//输出获取的籍贯值，例如：中国
		},
		certificatesPickerChange: function(e) {		//改变的事件名
			////console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
			this.indexC = e.target.value			//将数组改变索引赋给定义的index变量
			this.certificates_type = this.certificatesList[this.indexC].id		//将array【改变索引】的值赋给定义的jg变量
		//	//console.log("籍贯为：",this.jg)		//输出获取的籍贯值，例如：中国
		},
		// uplaodImg(){
		// 	let _this = this;
		// 	uni.chooseImage({
		// 		count:1,
		// 		success:res=>{
		// 			uni.uploadFile({
		// 				url:App.globalData.uploadBaseUrl + "api/upload/image",
		// 				filePath:res.tempFilePaths[0],
		// 				header:{
		// 					'Access-Token':_this.$store.getters.token
		// 				},
		// 				name:"file",
		// 				success: (rep) => {
		// 					//console.log(rep);
		// 					let data = JSON.parse(rep.data);
		// 					_this.imgInfo = data.data.fileInfo;
		// 				}
		// 			})
		// 		}
		// 	})
		// },
		uplaodImg(){
			let _this = this;
			uni.chooseImage({
				count:1,
				success:res=>{
					uni.uploadFile({
						url:App.globalData.uploadBaseUrl + "api/upload/image",
						filePath:res.tempFilePaths[0],
						header:{
							'Access-Token':_this.$store.getters.token
						},
						name:"file",
						success: (rep) => {
							//console.log(rep);
							let data = JSON.parse(rep.data);
							_this.imgInfo = data.data.fileInfo;
						}
					})
				}
			})
		},
      // 获取当前记录详情
      getDetail() {
        const app = this
        AddressApi.detail(app.addressId)
          .then(result => {
			  //console.log(result)
            const detail = result.data.detail
			app.detailInfo = result.data.detail
            app.createFormData(detail)
          })
      },

      // 生成默认的表单数据
      createFormData(detail) {
        const { form } = this
        form.name = detail.name
        form.phone = detail.mobile
		form.train_account_number = detail.train_account_number;
		form.train_password = detail.train_password;
        form.certificates_number = detail.certificates_number
		this.certificates_type = detail.certificates_type;
		this.passenger_discount_type = detail.passenger_discount_type;
		this.imgInfo = detail.image;
		this.indexC = Number(detail.certificates_type) - 1;
		this.indexP = Number(detail.passenger_discount_type) - 1;
      },

      createRegion(detail) {
        return [{
          label: detail.region.province,
          value: detail.province_id
        }, {
          label: detail.region.city,
          value: detail.city_id
        }, {
          label: detail.region.region,
          value: detail.region_id
        }]
      },

      // 表单提交
      handleSubmit() {
        const app = this
        if (app.disabled) {
          return false
        }
        app.$refs.uForm.validate(valid => {
          if (valid) {
            app.disabled = true
			let obj = {};
			obj.name = app.form.name;
			obj.mobile = app.form.phone;
			obj.train_account_number = app.form.train_account_number;
			obj.train_password = app.form.train_password;
			obj.certificates_type = app.certificates_type;
			obj.certificates_number = app.form.certificates_number;
			obj.passenger_discount_type = app.passenger_discount_type;
			obj.id = app.addressId;
			obj.is_default = app.detailInfo.is_default;
			
			if(app.imgInfo){
				obj.image_id = app.imgInfo.file_id;
			}
            AddressApi.edit(obj)
              .then(result => {
				  console.log(obj,777)
                app.$toast(result.message)
                uni.navigateBack()
              })
              .finally(() => app.disabled = false)
          }
        })
      }

    }
  }
</script>

<style>
  page {
    background: #f7f8fa;
  }
</style>
<style lang="scss" scoped>
	.ticketfoB{
		width: 100%;
		display: flex;
		margin-top: 30upx;
		padding-bottom: 30upx;
	}
	.ticketfoBL{
		width: 140upx;
	}
	.ticketfoBR{
		width: 120upx;
		height: 120upx;
		box-sizing: border-box;
		border: 2upx solid #CCCCCC;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6upx;
		background: white;
	}
	.ticketfoBR>image{
		width: 38upx;
		height: 38upx;
	}
	.ticketfoB>view:nth-child(1){
		width: 140upx;
		font-size: 28upx;
		line-height: 110upx;
		color: #333333;
	}
  .page-title {
    width: 94%;
    margin: 0 auto;
    padding-top: 40rpx;
    font-size: 28rpx;
    color: rgba(69, 90, 100, 0.6);
  }

  .form-wrapper {
    margin: 20rpx auto 120rpx auto;
    padding: 0 40rpx;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    background: #fff;
  }

  /* 底部操作栏 */

  .footer {
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

      // 禁用按钮
      &.disabled {
        background: #ff9779;
      }
    }

  }
</style>
