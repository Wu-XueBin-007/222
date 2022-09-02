<template>
	<view class="signin">
		<view class="signin-popup">
			<view class="signin-box">
				<view class="signin-box-t">
					<view class="signin-box-text1">
						本月积分活动签到
					</view>
					<!-- <view class="signin-box-text2">
						连续签到1天
					</view> -->
				</view>
				<view class="signin-box-c">
					<view class="signin-box-item" v-for="(item,index) in signArr" :key="index">
						<view :class="[item.flag?'signin-box-list':'signin-box-list2']">
							<view :class="[item.flag?'signin-box-tt':'signin-box-tt2']">
								{{item.value}}积分
							</view>
							<view :class="[item.flag?'signin-box-bb':'signin-box-bb2']"></view>
						</view>
						<view class="signin-box-text3">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="signin-box-b" v-if="showTo">
					已签到
				</view>
				<view class="signin-box-b" v-else @click="signin">
					签到
				</view>
			</view>
			<!-- <view class="signin-popup-close" @click="box_close">
				<image src="../../static/signin/icon_close.png" mode=""></image>
			</view> -->
		</view>
		<view
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: linear-gradient(136deg, #FFE8D9 0%, #FAE8DA 100%);z-index: -1;">
		</view>
	</view>
</template>

<script>
	import * as SigninApi from '@/api/home/signin'
	import store from '@/store'
	var now = new Date(); // 当前日期
	var nowDayOfWeek = now.getDay(); // 今天本周的第几天
	var nowDay = now.getDate(); // 当前日
	var nowMonth = now.getMonth(); // 当前月
	var nowYear = now.getYear(); // 当前年
	nowYear += (nowYear < 2000) ? 1900 : 0;

	var DateUtil = {
		/**
		 * 获得当前日期
		 * 
		 * @returns
		 */
		getNowDay() {
			return this.formatDate(new Date());
		},
		/**
		 * 获得本周的开始时间
		 * 
		 * @returns
		 */
		getStartDayOfWeek() {
			var day = nowDayOfWeek || 7;
			return this.formatDate(new Date(now.getFullYear(), nowMonth, nowDay + 1 - day));
		},
		/**
		 * 获得本周的结束时间
		 * 
		 * @returns
		 */
		getEndDayOfWeek() {
			var day = nowDayOfWeek || 7;
			return this.formatDate(new Date(now.getFullYear(), nowMonth, nowDay + 7 - day));
		},
		/**
		 * 获得本月的开始时间
		 * 
		 * @returns
		 */
		getStartDayOfMonth() {
			var monthStartDate = new Date(nowYear, nowMonth, 1);
			return this.formatDate(monthStartDate);
		},
		/**
		 * 获得本月的结束时间
		 * 
		 * @returns
		 */
		getEndDayOfMonth() {
			var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays());
			return this.formatDate(monthEndDate);
		},
		/**
		 * 获得本月天数
		 * 
		 * @returns
		 */
		getMonthDays() {
			var monthStartDate = new Date(nowYear, nowMonth, 1);
			var monthEndDate = new Date(nowYear, nowMonth + 1, 1);
			var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
			return days;
		},
		/**
		 * @param 日期格式化
		 * @returns {String}
		 */
		formatDate(date) {
			var myyear = date.getFullYear();
			var mymonth = date.getMonth() + 1;
			var myweekday = date.getDate();

			if (mymonth < 10) {
				mymonth = "0" + mymonth;
			}
			if (myweekday < 10) {
				myweekday = "0" + myweekday;
			}
			return (myyear + "-" + mymonth + "-" + myweekday);
		}
	};
	export default {
		DateUtil,
		data() {
			return {
				signArr: [],
				showTo: false
			}
		},
		onLoad() {
			var start_time = DateUtil.getStartDayOfMonth() + " 00:00:00";
			var start_times = new Date(start_time).getTime();
			var end_time = DateUtil.getEndDayOfMonth() + " 23:59:59";
			var end_times = new Date(end_time).getTime();
			
			let arr = [];
			var dayAll = DateUtil.getMonthDays();
			var weekArr = [];
			for (var i = 0; i < dayAll; i++) {
				var str = i + 1 + '号';
				weekArr.push(str)
			}
			// let weekArr = ["周一","周二","周三","周四","周五","周六","周日"];
			for (let i = 0; i < dayAll; i++) {
				let obj = {};
				obj.name = weekArr[i];
				obj.startTime = start_times + 60 * 60 * 24 * i * 1000;
				obj.endTime = start_times + 60 * 60 * 24 * (i + 1) * 1000;
				obj.flag = false;
				obj.value = "?";
				arr.push(obj)
			}
			this.signArr = arr;
			this.getPageData();

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

			// 获取页面数据
			getPageData(callback) {
				const app = this
				app.isLoading = true
				Promise.all([])
					.then(result => {
						app.isLoading = false;
						if (store.getters.token) {
							//签到记录
							app.getSameMonthSignIn();
							//判断用户今天是否登陆
							app.getIfUserSignIn();
						}
						// 执行回调函数
						callback && callback()
					})
					.catch(err => {
						//console.log('catch', err)
					})
			},
			//签到记录
			getSameMonthSignIn() {
				const app = this;

				var start_time = DateUtil.getStartDayOfMonth() + " 00:00:00";
				var start_times = (new Date(start_time).getTime()) / 1000;
				var end_time = DateUtil.getEndDayOfMonth() + " 23:59:59";
				var end_times = (new Date(end_time).getTime()) / 1000;
				// var start_time= (new Date(new Date(new Date().toLocaleDateString()).getTime()-oneTiem).getTime())/1000;
				// var end_time=(new Date(new Date(new Date().toLocaleDateString()).getTime()+endTiem).getTime())/1000;
				return new Promise((resolve, reject) => {
					SigninApi.SameMonthSignIn({
						b_time: start_times,
						e_time: end_times
					}).then(res => {
						let signArr = JSON.parse(JSON.stringify(this.signArr))
						for (let i = 0; i < res.data.list.length; i++) {
							let times = new Date(res.data.list[i].create_time).getTime();
							for (let j = 0; j < signArr.length; j++) {
								if (times >= signArr[j].startTime && times < signArr[j].endTime) {
									signArr[j].flag = true;
									signArr[j].value = res.data.list[i].value;
								}
							}
						}
						this.signArr = signArr;
						resolve(res)
					}).catch(reject)
				})
			},
			// 获取判断用户今天是否已签到
			getIfUserSignIn() {
				const app = this
				return new Promise((resolve, reject) => {
					SigninApi.IfUserSignIn().then(res => {
						if (res.message == '已签到') {
							app.showTo = true
						} else if (res.message == '未签到') {
							app.showTo = false
						}
						resolve(res)
					}).catch(reject)
				})
			},
			//签到
			signin() {
				const app = this;
				let loginPopupNum = 0;
				if (store.getters.token) {
					return new Promise((resolve, reject) => {
						SigninApi.signin().then(res => {
							//console.log(res)
							uni.showToast({
								icon: "none",
								title: res.message,
								duration: 2000
							})
							app.getSameMonthSignIn()
							resolve(res)
						}).catch(reject)
					})
				} else {
					if (loginPopupNum <= 0) {
						loginPopupNum++
						uni.showModal({
							title: '温馨提示',
							content: '此时此刻需要您登录喔~',
							confirmText: "去登录",
							cancelText: "再逛会",
							success: res => {
								loginPopupNum--
								if (res.confirm) {
									uni.navigateTo({
										url: "/pages/login/index"
									})
								}
							}
						})
					}
				}

			},
		}
	}
</script>

<style scoped>
	.signin-popup {}

	.signin-box {
		padding: 0 50upx 50upx 50upx;
		margin: 0 auto;
	}

	.signin-box-t {
		padding-top: 32upx;
	}

	.signin-box-text1 {
		font-size: 28upx;
		color: #850000;
		font-family: Alibaba PuHuiTi;
		font-weight: 400;
		line-height: 40upx;
		text-align: center;
	}

	.signin-box-text2 {
		font-size: 16upx;
		color: #333333;
		line-height: 28upx;
		text-align: center;
	}

	.signin-box-b {
		width: 232upx;
		height: 82upx;
		text-align: center;
		line-height: 82upx;
		margin: 40upx auto 0;
		border-radius: 42upx;
		font-size: 36upx;
		font-weight: bold;
		color: #333333;
		background: linear-gradient(360deg, #F4BF5A 0%, #FFECAD 100%);
	}

	.signin-box-c {
		display: flex;
		flex-wrap: wrap;
	}

	.signin-box-item {
		margin-left: 40upx;
		margin-top: 24upx;
	}

	.signin-box-text3 {
		font-size: 20upx;
		color: #333333;
		text-align: center;
		margin-top: 32upx;
	}

	.signin-box-list {
		width: 80upx;
		height: 80upx;
		background-color: #FFEDC3;
	}

	.signin-box-tt {
		font-size: 16upx;
		color: #CB5302;
		line-height: 40upx;
		text-align: center;
	}

	.signin-box-bb {
		width: 80upx;
		height: 52upx;
		background-image: url(../../static/home/icon_qd1.png);
		background-size: 80upx 52upx;
	}

	.signin-box-list2 {
		width: 80upx;
		height: 80upx;
		background-color: #F1F1F1;
	}

	.signin-box-tt2 {
		font-size: 16upx;
		color: #D0D0D0;
		line-height: 40upx;
		text-align: center;
	}

	.signin-box-bb2 {
		width: 80upx;
		height: 52upx;
		background-image: url(../../static/home/icon_qd2.png);
		background-size: 80upx 52upx;
	}

	.signin-popup-close {
		width: 48upx;
		height: 48upx;
		margin: 48upx auto 0;
	}

	.signin-popup-close>image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}
</style>
