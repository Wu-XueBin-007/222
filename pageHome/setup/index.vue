<template>
	<view class="setUp">
		<view class="setUp-content">
			<view class="setUp-item-footer" @click="btn_userInfo">
				<view class="setUp-lable">头像 </view>
				<view class="setUp-yhq">
					<view class="setUp-head-icon1">
						<image :src="userInfo.avatar?userInfo.avatar.preview_url:'../../static/default-avatar.png'"></image>
					</view>
				</view>
			</view>
			<view style="background-color: #FFFFFF;width: 750upx;">
				<view style="width: 692upx; height: 2upx;background-color: #F5F5F5;margin: 0 auto;"></view>
			</view>
			<view class="setUp-item-footer" @click="btn_certifindMember">
				<view class="setUp-lable">昵称</view>
				<view class="setUp-yhq">
					<text class="texts">{{userInfo.nick_name?userInfo.nick_name:"未认证"}}</text>
				</view>
			</view>
			<view style="background-color: #FFFFFF;width: 750upx;">
				<view style="width: 692upx; height: 2upx;background-color: #F5F5F5;margin: 0 auto;"></view>
			</view>
			<!-- <view class="setUp-item-footer" @click="btn_supplierCooperation">
				<view class="setUp-lable">性别</view>
				<view class="setUp-yhq">
					<picker style="width: 30%;margin-right: 24upx;" mode="selector" @change="bindPickerChange" :range="arrList">
							<label style="color: #333333;font-size: 24upx;">{{arrList[indexL]}}</label>
					</picker>
					<view class="setUp-head-icon">
						<image src="../../static/icon/more_gray.png"></image>
					</view>
				</view>
			</view>
			<view style="background-color: #FFFFFF;width: 750upx;">
				<view style="width: 692upx; height: 2upx;background-color: #F5F5F5;margin: 0 auto;"></view>
			</view>
			<view class="setUp-item-footer" @click="btn_realName">
				<view class="setUp-lable">生日</view>
				<view class="setUp-yhq">
					<view class="setUp-head-icon">
						<image src="../../static/icon/more_gray.png"></image>
					</view>
				</view>
			</view>
			<view style="background-color: #FFFFFF;width: 750upx;">
				<view style="width: 692upx; height: 2upx;background-color: #F5F5F5;margin: 0 auto;"></view>
			</view>
			<view class="setUp-item-footer" @click="btn_detailed">
				<view class="setUp-lable">地区 </view>
				<view class="setUp-yhq">
					<view class="setUp-head-icon">
						<image src="../../static/icon/more_gray.png"></image>
					</view>
				</view>
			</view>
			<view style="background-color: #FFFFFF;width: 750upx;">
				<view style="width: 692upx; height: 2upx;background-color: #F5F5F5;margin: 0 auto;"></view>
			</view> -->
			<!-- <view class="setUp-item-footer" @click="btn_unbunding">
				<view class="setUp-lable">手机号</view>
				<view class="setUp-yhq">
					<view class="setUp-head-icon">
						<image src="../../static/icon/more_gray.png"></image>
					</view>
				</view>
			</view> -->
			<view class="setUp-item-footer" @click="btn_aboutUs">
				<view class="setUp-lable">关于我们</view>
				<view class="setUp-yhq">
					<view class="setUp-head-icon">
						<image src="../../static/icon/more_gray.png"></image>
					</view>
				</view>
			</view>
			<view style="background-color: #FFFFFF;width: 750upx;">
				<view style="width: 692upx; height: 2upx;background-color: #F5F5F5;margin: 0 auto;"></view>
			</view>
			<!-- #ifdef !MP-WEIXIN -->
			<view class="setUp-item-footer" @click="btn_changePassword">
				<view class="setUp-lable">修改密码</view>
				<view class="setUp-yhq">
					<view class="setUp-head-icon">
						<image src="../../static/icon/more_gray.png"></image>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- <view style="background-color: #FFFFFF;width: 750upx;">
				<view style="width: 692upx; height: 2upx;background-color: #F5F5F5;margin: 0 auto;"></view>
			</view>
			<view class="setUp-item-footer" @click="btn_unbunding">
				<view class="setUp-lable">换绑手机号</view>
				<view class="setUp-yhq">
					<view class="setUp-head-icon">
						<image src="../../static/icon/more_gray.png"></image>
					</view>
				</view>
			</view> -->
		</view>
		<view class="setUp-buttom" @click="btn_signOut">
			退出登录
		</view>
		<view style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F5F5F5;z-index: -1;"></view>
	</view>
</template>

<script>
	import * as UserApi from '@/api/user'
	const App = getApp()
	export default {
		data() {
			return {
				text:"未认证",
				Imgurl:'',
				base1:'',
				userL:{},
				CommonLst:{},
				arrList:['男', '女'],
				indexL:0,
				userInfo:{},
				imgInfo:{}
			}
		},
		onLoad(options) {
			
		},
		onShow(){
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
			btn_certifindMember(){
				this.$navTo("pageHome/setup/editName",{nick_name:this.userInfo.nick_name})
			},
			// 获取页面数据
			getPageData() {
			  const app = this
			  app.isLoading = true
			  Promise.all([app.getUserInfo()])
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
			//上传头像
			btn_portrait(){
				var _that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (res) => {
						//console.log(res)
						// _that.with_img = res.tempFilePaths;
						uni.uploadFile({
							url:this.base1+"/index/file/FileAdd",
							filePath:res.tempFilePaths[0],
							name:"file",
							success(res) {
								var data=JSON.parse(res.data);
								var pic=_that.Imgurl+data.data.url
								//#ifdef MP-WEIXIN
								app.$vm.$options.api.UserUpd({
									pic:pic
								}).then(res=>{
									//console.log(res)
									if(res.data.code=='success'){
										_that.init()
									}
								})
								//#endif
								//#ifdef H5
								app.$options.api.UserUpd({
									pic:pic
								}).then(res=>{
									//console.log(res)
									if(res.data.code=='success'){
										_that.init()
									}
								})
								//#endif
							},
							fail(err) {
								//console.log(err)
							}
						})
					}
				})
				
			},
			//账号信息
			btn_userInfo(){
				let _this = this;
				uni.chooseImage({
					count:1,
					success(res) {
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
								
								UserApi.edit_avatar({avatar_id:data.data.fileInfo.file_id})
									.then(res=>{
										_this.userInfo.avatar = data.data.fileInfo;
										uni.showToast({
											icon:'none',
											title:res.message,
											duration:2000
										})
									})
									.catch(err=>{
										uni.showToast({
											icon:'none',
											title:err.message,
											duration:2000
										})
									})
							}
						})
					}
				})
			},
			bindPickerChange: function(e) {		//改变的事件名
				////console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
				this.indexL = e.target.value			//将数组改变索引赋给定义的index变量
				this.vehicle_id=this.arrList[this.indexL].id		//将array【改变索引】的值赋给定义的jg变量
			//	//console.log("籍贯为：",this.jg)		//输出获取的籍贯值，例如：中国
			},
			//修改密码
			btn_changePassword(){
				this.$navTo('pageHome/setup/changePassword')
			},
			//解绑手机号
			btn_unbunding(){
				this.$navTo('pageHome/setup/unbundling')
			},
			//退出登陆
			btn_signOut(){
				//console.log(this.$store)
				uni.removeStorageSync('AccessToken');
				// uni.removeStorageSync('userId');
				uni.removeStorageSync('AccessToken_expiry');
				this.$store.state.token = '';
				this.$store.state.user.token = '';
				// this.$store.state.userId = '';
				this.$store.state.user.userId = '';
				uni.navigateBack({
					delta:1
				})
			},
			btn_aboutUs(){
				this.$navTo('pageHome/setup/aboutUs')
				
				console.log(123)
			}
		}
	}
</script>

<style scoped>
.setUp{
	background-color: #F5F5F5;
}
.setUp-header{
	width: 650upx;
	height: 100upx;
	background-color: #FFFFFF;
	display: flex;
	padding: 50upx;
}

.setUp-header-img{
	width: 100upx;
	height: 100upx;
	border-radius: 50%;
	overflow: hidden;
}
.setUp-header-img>image{
	width: 100%;
	height: 100%;
}
.setUp-header-title{
	width: 450upx;
	margin-left: 30upx;
}
.setUp-header-text1{
	font-size: 32upx;
	color: #000000;
}
.setUp-header-member{
	margin-top: 16upx;
}
.setUp-header-member .mine-dj{
	font-size: 24upx;
	color: #000000;
	
}
.setUp-header-member .mine-jf{
	display: inline-block;
	padding: 0 20upx;
	text-align: center;
	height: 40upx;
	line-height: 40upx;
	background-color: #DB0B0B;
	color: #FFFFFF;
	border-radius: 20upx;
	margin-left: 30upx;
}

.setUp-content{
	padding-top: 20upx;
}
.setUp-item-footer {
	display: flex;
	background-color: #FFFFFF;
	flex-direction: row;
	justify-content: space-between;
	/* margin-top: 10px; */
	line-height: 80upx;
	text-align: center;
	padding: 0 30upx;
}

.texts {
	font-size: 24upx;
	color: #DB0B0B;
}

.setUp-yhq {
	display: flex;
	flex-direction: row;
}

.setUp-yhq>text {
	color: #808080;
	font-size: 24upx;
}

.setUp-head-icon {
	/* margin-top: 4upx; */
	margin-left: 10upx;
}

.setUp-head-icon>image {
	width: 14upx;
	height: 22upx;
}
.setUp-head-icon1 {
	border-radius: 50%;
}

.setUp-head-icon1>image {
	width: 48upx;
	height: 48upx;
	border-radius: 50%;
	vertical-align: top;
	margin-top: 20upx;
}
.setUp-item {
	padding: 30upx;
	display: flex;
	flex-direction: row;
	background-color: #FFFFFF;
	margin-bottom: 30upx;
	
}

.setUp-item>label {
	font-size: 32upx;
	color: #000000;
}

.setUp-item>input {
	width: 72%;
	padding-left: 28upx;
	font-size: 32upx;
	color: #727272;
	/* margin-top: -6upx; */
}
.setUp-buttom{
	position: fixed;
	left: 0;
	bottom: 0;
	width: 750upx;
	/* height: 100upx; */
	text-align: center;
	line-height: 100upx;
	font-size: 32upx;
	color: #333333;
	background-color: #FFFFFF;
	font-weight: bold;
	bottom: var(--window-bottom);
	padding-top: 12rpx;
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}
.setUp-lable{
	font-size: 28upx;
	font-weight: bold;
	color: #333333;
}
</style>
