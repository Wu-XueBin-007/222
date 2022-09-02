<template>
	<view class="caShier">
		<view class="caShier-content">
			<view class="caShier-header">
				<view class="caShier-header-title">
					<text class="caShier-header-txte1">支付金额</text>
					<!-- <text class="caShier-header-txte2">{{orderDetailsList.order_number}}</text> -->
				</view>
				<view class="caShier-header-title">
					<text class="caShier-header-txte3">￥</text>
					<text class="caShier-header-txte4">140.00</text>
				</view>
				<view class="caShier-footer-text">
					剩余时间{{countdownTime | dateFormat}}
				</view>
			</view>
			<view class="caShier-item">
				<!-- #ifdef APP-PLUS -->
				<!-- <view class="caShier-item-list caShier-color" @click="btn_payTa(1)">
					<view class="caShier-item-icon">
						<image src="../../static/icon/icon_zfbzf.png" mode=""></image>
					</view>
					<view class="coupons-item-chbox">
							<checkbox class="checks1-h5" :checked="paymentType==1" ></checkbox>
					</view>
					
				</view> -->
				<!-- #endif -->
				<view class="caShier-item-list caShier-color" @click="btn_payTa(2)">
					<view class="caShier-item-icon">
						<image src="../../static/icon/icon_wxzf.png" mode=""></image>
					</view>
					<view class="coupons-item-chbox">
							<checkbox class="checks1-h5" :checked="paymentType==2"  ></checkbox>
					</view>
				</view>
				<view class="caShier-item-list" @click="btn_payTa(3)">
					<view class="caShier-item-icon">
						<image src="../../static/icon/icon_ye.png" mode=""></image>
					</view>
					<view class="coupons-item-chbox">
							<checkbox class="checks1-h5" :checked="paymentType==3"  ></checkbox>
					</view>
				</view>
			</view>
		</view>
		
		<view class="caShier-footer">
			
			<view class="caShier-footer-btn" @click="btn_backTran">
				支付
			</view>
		</view>
		<view style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F3F3F3;z-index: -1;"></view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				orderDetailsList:{},
				Imgurl:'',
				order_number:'',
				CommonLst:{},
				countdownTime:'',
				timeOut:'',
				paymentType:2
			}
		},
		onLoad(options) {
			this.order_number=options.order_number;
			this.init()
			// // #ifdef MP-WEIXIN
			// wx.enableAlertBeforeUnload({  
			//     message:"确认放弃付款？", 
			// 	 success: function (res) {
			// 		//console.log("方法注册成功：", res);
			// 	  },
			// 	  fail: function (errMsg) {
			// 		//console.log("方法注册失败：", errMsg);
			// 	  },
			//     complete:(e)=>{  
			//         //console.log(e);  
			//     }                 
			// })  
			// // #endif
		},
		onShow() {
			this.Imgurl=app.globalData.Imgurl;
			
		},
		onBackPress(options){
			  uni.showModal({  
			  title: '确认放弃付款？',  
			  content: '您的订单在规定时间内未完成支付将被取消，请尽快完成支付!',
			  cancelText:"放弃支付",
			  confirmText:"我在想想",
			  success: function(res) {  
				  if (res.confirm) {  
					  // 退出当前应用，改方法只在App中生效  
					  // plus.runtime.quit();  
				  } else if (res.cancel) {  
					  //console.log('用户点击取消');
					  uni.redirectTo({
					  	url:'/pages/order/order?type=0'
					  })
				  }  
			  }  
			});  
			return true 
			  
		},
		filters:{
			dateFormat: function(value) {
			    var date = new Date(value); 
			    var sdate = Math.floor(value/1000/60/60/24);
			    var hour = Math.floor((value - sdate*1000*60*60*24)/1000/60/60);
			    var minute = Math.floor((value - sdate*1000*60*60*24 - hour*1000*60*60)/1000/60);
			    var second = Math.floor((value - sdate*1000*60*60*24 - hour*1000*60*60 - minute*1000*60)/1000);
			    sdate = sdate < 10 ? "0" + sdate : sdate;
			    hour = hour < 10 ? "0" + hour : hour;
			    minute = minute < 10 ? "0" + minute : minute;
			    second = second < 10 ? "0" + second : second;
			    var result = hour + "时" + minute + "分" + second + "秒";
			    return result;
			   }
		},
		beforeDestroy() {
			clearInterval(this.timeOut)
			clearInterval(timer)
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
			init(){
				var _that=this;
				//#ifdef MP-WEIXIN
				app.$vm.$options.api.OrderFind({order_number:this.order_number}).then(res=>{
					//console.log(res)
					if(res.data.code=='success'){
						this.orderDetailsList=res.data.data.data;
						var date=_that.orderDetailsList.create_time;
						var newDate2 = new Date(date.replace(/-/g, '/'));
						_that.timeOut=setInterval(function(){
							_that.countdownTime= 24*60*60*1000-(new Date().getTime()-(new Date(newDate2).getTime()));
						},1000);
					}
				})
				
				app.$vm.$options.api.CommonLst({
					
				}).then(res=>{
					if(res.data.code=='success'){
						this.CommonLst=res.data.data.data;
						
					}
				})
				//#endif
				//#ifdef H5
				app.$options.api.OrderFind({order_number:this.order_number}).then(res=>{
					//console.log(res)
					if(res.data.code=='success'){
						this.orderDetailsList=res.data.data.data;
						var date=_that.orderDetailsList.create_time;
						var newDate2 = new Date(date.replace(/-/g, '/'));
						_that.timeOut=setInterval(function(){
							_that.countdownTime= 24*60*60*1000-(new Date().getTime()-(new Date(newDate2).getTime()));
						},1000);
					}
				})
				app.$options.api.CommonLst({
					
				}).then(res=>{
					if(res.data.code=='success'){
						this.CommonLst=res.data.data.data;
						
					}
				})
				//#endif
			},
			btn_payTa(type){
				this.paymentType=type;
			},
			btn_backTran(){
				if(this.paymentType==1){
					//#ifdef H5
					app.$options.api.OrderPya({
						order_number:this.order_number,
						type:5
						}).then(res=>{
						//console.log(res)
						const div = document.createElement('divform');
						
						div.innerHTML= res.data.data.data;//这个data是后端返回的form表单
						
						document.body.appendChild(div);
						
						document.forms[0].submit();
					})
					//#endif
				}else if(this.paymentType==2){
					//#ifdef MP-WEIXIN
					app.$vm.$options.api.OrderPya({
						order_number:this.order_number,
						type:2
						}).then(res=>{
						//console.log(res)
						if(res.data.code=='success'){
							uni.requestPayment({
							    provider: 'wxpay',
								appId:res.data.data.data.appId,
							    timeStamp: res.data.data.data.timeStamp,
							    nonceStr: res.data.data.data.nonceStr,
							    package: res.data.data.data.package,
							    signType: res.data.data.data.signType,
							    paySign: res.data.data.data.paySign,
							    success: function (res) {
							        //console.log('success:' + JSON.stringify(res));
									// _that.shuaxin();
									uni.redirectTo({
										url:'/pages/order/order?type=0'
									})
							    },
							    fail: function (err) {
									uni.showToast({
										icon:"none",
										title:"未支付"
									})
									uni.redirectTo({
										url:'/pages/order/order?type=0'
									})
							    }
							});
						}
					})
					//#endif
					//#ifdef H5
					app.$options.api.OrderPya({
						order_number:this.order_number,
						type:3
						}).then(res=>{
						//console.log(res)
						window.location.href = res.data.data.data;
					})
					//#endif
				}else if(this.paymentType==3){
					//#ifdef MP-WEIXIN
					app.$vm.$options.api.OrderPya({
						order_number:this.order_number,
						type:6
						}).then(res=>{
						//console.log(res)
						if(res.data.code=='success'){
							uni.showToast({
								icon:"none",
								title:res.data.msg
							})
							uni.redirectTo({
								url:'/pages/order/order?type=0'
							})
						}else{
							uni.showToast({
								icon:"none",
								title:res.data.msg
							})
						}
					})
					//#endif
					//#ifdef H5
					app.$options.api.OrderPya({
						order_number:this.order_number,
						type:6
						}).then(res=>{
						//console.log(res)
						if(res.data.code=='success'){
							uni.showToast({
								icon:"none",
								title:res.data.msg
							})
							uni.redirectTo({
								url:'/pages/order/order?type=0'
							})
						}else{
							uni.showToast({
								icon:"none",
								title:res.data.msg
							})
						}
					})
					//#endif
				}
				
			}
			
		}
	}
</script>

<style>
	/* checkbox样式修改 */
	checkbox .wx-checkbox-input {
		border-radius: 50%;
		/* 		background-color: #ff5060;
		color: #FFFFFF !important; */
	}
	
	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		border: 2upx solid #ff5060;
		background: #ff5060;
		color: #FFFFFF !important;
	}
	
	checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
		font-size: 28upx;
	}
	.checks1-h5>>>.uni-checkbox-input {
		width: 28upx;
		height: 28upx;
		border-radius: 50%;
	}
	/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
	.checks1-h5>>>.uni-checkbox-input.uni-checkbox-input-checked {
		border: 2upx solid #ff5060;
		/* border: none; */
		background: #ff5060;
		color: #FFFFFF !important;
	}
	
	/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
	.checks1-h5>>>.uni-checkbox-input.uni-checkbox-input-checked::before {
		border-radius: 50%;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}
	.checks1-wx>>>.uni-checkbox-input {
		width: 28upx;
		height: 28upx;
		border-radius: 50%;
	}
	/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
	.checks1-wx>>>.uni-checkbox-input.uni-checkbox-input-checked {
		border: 2upx solid #ff5060;
		/* border: none; */
		background: #ff5060;
		color: #FFFFFF !important;
	}
	
	/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
	.checks1-wx>>>.uni-checkbox-input.uni-checkbox-input-checked::before {
		border-radius: 50%;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}
	.checks>>>.uni-checkbox-input {
		width: 28upx;
		height: 28upx;
		border-radius: 50%;
	}
	
	/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
	.checks>>>.uni-checkbox-input.uni-checkbox-input-checked {
		border: 2upx solid #ff5060;
		/* border: none; */
		background: #ff5060;
		color: #FFFFFF !important;
	}
	
	/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
	.checks>>>.uni-checkbox-input.uni-checkbox-input-checked::before {
		border-radius: 50%;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}
	.caShier-content{
		padding: 30upx;
		/* background-color: #FFFFFF; */
		margin-top: 16upx;
	}
	.caShier-header{
		/* display: flex; */
		/* justify-content: space-between; */
		padding: 10upx 0 50upx 0;
		text-align: center;
		/* border-bottom: 2upx solid #F5F5F5; */
	}
	.caShier-header-title{
		margin-top: 32upx;
	}
	.caShier-header-txte1{
		font-size: 24upx;
		color: #333333;
	}
	.caShier-header-txte2{
		font-size: 20upx;
		color: #000000;
		margin-left: 16upx;
	}
	.caShier-header-txte3{
		font-size: 24upx;
		color: #000000;
	}
	.caShier-header-txte4{
		font-size: 28upx;
		color: #333333;
		font-weight: bold;
	}
	.caShier-main{
		margin-top: 30upx;
	}
	.caShier-main-title{
		font-size: 26upx;
		color: #333333;
	}
	.caShier-main-list{
		display: flex;
		margin-top: 32upx;
	}
	.caShier-main-laber{
		width: 130upx;
		font-size: 24upx;
		color: #333333;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.caShier-main-text1{
		font-size: 24upx;
		color: #333333;
		margin-left: 40upx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.caShier-main-text2{
		font-size: 24upx;
		color:#DB0B0B;
		margin-left: 40upx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.caShier-careful{
		width: 690upx;
		margin: 32upx auto 0;
		font-size: 20upx;
		color: #999999;
	}
	.caShier-footer{
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
	}
	.caShier-footer-text{
		width: 100%;
		font-size: 20upx;
		color: #D0D0D0;
		text-align: center;
		margin-bottom: 24upx;
		margin-top: 16upx;
	}
	.caShier-footer-btn{
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		font-size: 24upx;
		color: #FFFFFF;
		background-color: #ff5060;
	}
	.caShier-item{
		width: 702upx;
		margin: 20upx auto 30upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
		/* padding: 16upx; */
		overflow: hidden;
	}
	.caShier-item-list{
		display: flex;
		justify-content: space-between;
		padding: 20upx;
		/* margin: 20upx 0 0 0; */
		
	}
	.caShier-color{
		border-bottom: 2upx solid #F5F5F5;
	}
	.caShier-item-icon{
		width: 48upx;
		height: 40upx;
	}
	.caShier-item-icon>image{
		width: 100%;
		height: 100%;
	}
	.caShier-careful{
		font-size: 20upx;
		color: #DB0B0B;
	}
</style>
