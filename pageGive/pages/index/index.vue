<template>
	<view class="give">
		<seckill-nav v-if="showMap==false" title="幸运免单"></seckill-nav>
		<nav-head v-if="showMap" backGround="rage(0,0,0,0.01)" backL="transparent" color="white"></nav-head>
		<view class="give-heard" v-if="showMap">
			<image :src="givemap.image_url" mode=""></image>
		</view>
		<view class="fault" v-else>
			<image src="../../static/fault.png" mode=""></image>
			<view class="faultText">
				暂无活动哦~
			</view>
		</view>
		<view class="give-heardR">
			<view class="give-heardRT" @click="checkRule">
				规则说明
			</view>
			<u-popup v-model="showRule" mode="bottom" @close="close" @open="open">
				<view class=""
					style="font-size: 36upx;color: #404040;text-align: center;padding-top: 30upx;font-weight: bold;">
					规则说明
				</view>
				<view style="max-height: 740upx;">
					<view v-html="lucky_free_activity_rules" style="padding: 30upx;box-sizing: border-box;">

					</view>
				</view>
			</u-popup>
			<view class="give-heardRB" @click="checkgive">
				往期活动
			</view>
			<u-popup v-model="showAgree" mode="bottom" @close="close" @open="open">
				<view class=""
					style="font-size: 36upx;color: #404040;text-align: center;padding-top: 30upx;font-weight: bold;">
					往期活动
				</view>
				<view style="max-height: 740upx;">
					<view style="padding: 30upx;box-sizing: border-box;">
						<view class="previousItem" v-for="(itemP,indexP) in luckyList" :key="indexP" :data-id="itemP.id"
							@click="getLuck">
							<view class="previousItemL">
								<view class="previousT">
									{{itemP.name}}
								</view>
								<view class="previousB">
									{{itemP.start_time}}
								</view>
							</view>
							<view class="previousItemR" v-if="itemP.status==1">
								待开始
							</view>
							<view class="previousItemR" v-else-if="itemP.status==2">
								正常
							</view>
							<view class="previousItemR" v-else-if="itemP.status==3">
								结束
							</view>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		<view class="giveB" v-if="showMap">
			<view class="giveBT">
				<view class="giveBTT" v-if="givemap.status!=3">
					距结束
					<text>{{countdownTime | dateFormat}}</text>
				</view>
				<view class="giveBTT" v-else>
					已结束
					<!-- <text>{{countdownTime | dateFormat}}</text> -->
				</view>
				<scroll-view scroll-x="true"
					style="display: flex;white-space: nowrap;width: 100%;box-sizing: border-box;overflow: scroll;">
					<view class="giveBTB" v-if="givemap.status!=3">
						<view :class="[givemap.pool.lenght>3?'giveBTBI2':'giveBTBI']"
							v-for="(item,index) in givemap.pool" :data-name="item.name" :data-id="item.id" :key="index"
							@click="getGoods">
							<view class="giveBImage">
								<image :src="item.image_url" mode=""></image>
							</view>
							<view class="giveBText">
								{{item.name}}
							</view>
							<view class="giveBbtn">
								￥{{item.turnover}}
							</view>
						</view>
					</view>
					<view class="giveBTB" v-else>
						<view :class="[givemap.pool.lenght>3?'giveBTBI2':'giveBTBI']" style="position: relative;"
							v-for="(item,index) in givemap.pool" :data-name="item.name" :data-id="item.id" :key="index">
							<view class="giveBImage">
								<image :src="item.image_url" mode=""></image>
							</view>
							<view class="giveBText">
								{{item.name}}
							</view>
							<view class="giveBbtn">
								￥{{item.turnover}}
							</view>
							<view class="" v-if="givemap.status==3"
								style="width: 210upx;height: 100%; position: absolute;top: 0;left: 0;background-color: rgba(0, 0, 0, 0.4);z-index: 9999;">

							</view>
							<image v-if="item.free_status==2" src="../../static/backFree.png"
								style="width: 146upx;height: 146upx;position: absolute;top: 36upx;left: 32upx;" mode="">
							</image>
						</view>
					</view>
				</scroll-view>

			</view>
			<view class="giveOrder" v-if="giveList.length>0&&givemap.status!=3">
				<view class="head" v-if="!isFinish">
					实时订单
				</view>
				<view class="main">
					<view class="item" v-for="(items,indexs) in giveList" :key="indexs">
						<view class="itemL">
							<image :src="items.user_image" mode=""></image>
							<text>{{items.name}}</text>
						</view>
						<view class="itemR">
							<view class="itemRT">
								下单成功
							</view>
							<view class="itemRB">
								{{items.time}}
								<!-- {{items.pay_time}}秒前 -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="myParticipate" @click="checkParticipate" v-if="showMap">
			<image src="../../static/pate.png" mode=""></image>
		</view>
		<u-popup v-model="showParticipate" mode="bottom" @close="close" @open="open">
			<view class=""
				style="font-size: 36upx;color: #404040;text-align: center;padding-top: 30upx;font-weight: bold;">
				我的参与
			</view>
			<view style="max-height: 740upx;">
				<view style="padding: 30upx;box-sizing: border-box;">
					<view class="ParticItem" v-for="(itemP,indexP) in myOrderList" :key="indexP">
						<view class="buoy" v-if="itemP.pool.free_status==1">
							待公布
						</view>
						<view class="buoy2" v-if="itemP.pool.free_status!=1">
							已结束
						</view>
						<view class="ParticItemL">
							<image :src="itemP.goods[0].goods_image" mode=""></image>

						</view>
						<view class="ParticItemR">
							<view class="ParticT">
								{{itemP.pool.lucky_free_name}}-{{itemP.pool.name}}
							</view>
							<view class="ParticC">
								{{itemP.goods[0].goods_name}}
							</view>
							<view class="ParticB">
								{{itemP.pay_time}}
							</view>
						</view>
						<view class="ParticImage" v-if="itemP.pool.free_status==2">
							<image src="../../static/icon_Free.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<view v-if="showMap"
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: linear-gradient(180deg, #EC1347 0%, #FF3434 100%);z-index: -1;"
			catchtouchmove="true"></view>
	</view>
	</view>
</template>

<script>
	import * as UserApi from "@/api/user.js";
	import {
		detail
	} from '@/api/order/comment.js'
	import * as giveApi from "@/api/give/index.js";
	import * as settingApi from '@/api/ticket/setting'
	import seckillNav from "@/components/seckillNav.vue";
	import navHead from "@/components/navHead.vue";
	const App = getApp();
	let timer = null;
	let drawTimer = null;
	let timeOut = null;
	export default {
		data() {
			return {
				isActive: 1,
				balance: 0.00,
				giveList: [],
				page: 1,
				limit: 6,
				bottomFlag: true,
				topFlag: true,
				showAgree: false,
				showRule: false,
				showParticipate: false,
				lucky_free_activity_rules: '',
				givemap: {},
				showMap: false,
				countdownTime: 0,

				luckyList: [],
				myOrderList: [],
				isFinish: false
			}
		},
		onLoad() {


		},
		onUnload() {},
		filters: {
			dateFormat: function(value) {
				var date = new Date(value);
				var sdate = Math.floor(value / 1000 / 60 / 60 / 24);
				var hour = Math.floor((value - sdate * 1000 * 60 * 60 * 24) / 1000 / 60 / 60);
				var minute = Math.floor((value - sdate * 1000 * 60 * 60 * 24 - hour * 1000 * 60 * 60) / 1000 / 60);
				var second = Math.floor((value - sdate * 1000 * 60 * 60 * 24 - hour * 1000 * 60 * 60 - minute * 1000 *
					60) / 1000);
				sdate = sdate < 10 ? "0" + sdate : sdate;
				hour = hour < 10 ? "0" + hour : hour;
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				var result = sdate + "天" + hour + "时" + minute + "分" + second + "秒";
				return result;
			}
		},
		beforeDestroy() {
			clearInterval(this.timeOut)
			// clearInterval(timer)
		},
		onShow() {
			// this.init();
			// this.getBalance();
			clearInterval(this.timeOut)
			this.getgivemap();
			this.getCommon();
		},
		components: {
			seckillNav,
			navHead
		},
		onPullDownRefresh() {
			// 下拉
			if (!this.topFlag) {
				return false;
			}
			clearInterval(this.timeOut)
			this.getgivemap();
			this.bottomFlag = true;
			this.page = 1;
			this.topFlag = false;
			this.init(true);
		},
		onReachBottom() {
			// 触底
			if (!this.bottomFlag) {
				return false;
			}
			this.page = this.page + 1;
			this.bottomFlag = false;
			this.status = "loading";
			// clearInterval(this.timeOut)
			this.init();

		},
		methods: {
			close() {

			},
			open() {

			},
			getActive(type) {
				this.isActive = type;
				this.page = 1;
				this.init()
			},
			checkRule() {
				this.showRule = true
			},
			checkgive() {
				this.showAgree = true;
				this.getPeriod();
			},
			checkParticipate() {
				this.showParticipate = true;
				this.getReal()
			},
			getCommon() {
				settingApi.detail().then(res => {
					this.lucky_free_activity_rules = res.data.detail.lucky_free_activity_rules.replace(/<img/g,
						"<img style='width: 100%;'");
					// this.commonL = res.data.detail.map(cur=>{
					// 	cur.content = cur.content.replace(/<img/g,"<img style='width: 100%;'");
					// 	return cur;
					// });
				})
			},
			getLuck(e) {
				let id = e.currentTarget.dataset.id || e.target.dataset.id;
				let obj = {};
				obj.lucky_free_id = id;
				giveApi.detail(obj).then(res => {
					//console.log(res)

					if (res.status == 200) {
						this.givemap = res.data;
						this.showMap = true;
						let date = res.data.end_time;
						var newDate2 = new Date(date.replace(/-/g, '/'));
						let times = newDate2 - (new Date().getTime())
						this.countdownTime = times;
						this.timeOut = setInterval(() => {
							this.countdownTime = this.countdownTime - 1000;
						}, 1000);
						this.giveList = [];
						this.init();
						this.isFinish = true;
						this.showAgree = false;
					} else {
						// this.givemap=res.data;
						this.showMap = false;
					}
				})
			},
			getgivemap() {
				clearInterval(this.timeOut)
				giveApi.detail().then(res => {
					//console.log(res)

					if (res.status == 200) {
						this.givemap = res.data;
						this.showMap = true;
						let date = res.data.end_time;
						var newDate2 = new Date(date.replace(/-/g, '/'));
						let times = newDate2 - (new Date().getTime())
						this.countdownTime = times;
						this.timeOut = setInterval(() => {
							this.countdownTime = this.countdownTime - 1000;
						}, 1000);
						this.init();
						this.isFinish = false;
					} else {
						// this.givemap=res.data;
						this.showMap = false;
					}
				})
			},
			getReal() {
				giveApi.myOrderList().then(res => {
					//console.log(res)
					this.myOrderList = res.data.list.data
				})
			},
			getPeriod() {
				giveApi.luckyList().then(res => {
					//console.log(res)
					this.luckyList = res.data.list.data;
					//console.log(this.luckyList)
				})
			},
			getGoods(e) {
				let id = e.currentTarget.dataset.id || e.target.dataset.id;
				let name = e.currentTarget.dataset.name || e.target.dataset.name;
				uni.navigateTo({
					url: "/pageGive/pages/index/giveGoods?id=" + id + "&name=" + name
				})
			},
			getImageText(e) {
				let id = e.currentTarget.dataset.id || e.target.dataset.id;
				uni.navigateTo({
					url: "/pageGive/pages/index/ImageText?id=" + id
				})
			},
			init(flag) {
				var obj = {}
				obj.lucky_free_id = this.givemap.id;
				obj.page = this.page;
				obj.listRows = this.limit;
				giveApi.real_time_order_list(obj).then(res => {
					// this.giveList=res.data.list.data;
					if (res.status == 200) {
						// this.JgoodsList=res.data.list.data;
						if (flag) {
							this.topFlag = true;
							this.bottomFlag = true;
							uni.stopPullDownRefresh()
						}
						if (Math.ceil(res.data.list.total / this.limit) != this.page && res.data.list.last_page >
							0) {
							this.bottomFlag = true;
							this.status = "loadmore";
						} else {
							this.status = "normal";
						}
						if (this.page != 1) {
							this.giveList = this.giveList.concat(res.data.list.data).map(cur => {
								cur.name = '';
								cur.time = '';
								return cur;
							});
							for (var i = 0; i < this.giveList.length; i++) {
								var str = this.giveList[i].user_name;
								let date = new Date(this.giveList[i].pay_time.replace(/-/g, '/'));
								let time2 = (new Date().getTime()) - date;
								if (1 * 1000 <= time2 && time2 < 60 * 1000) {
									let day = Math.ceil(time2 / (1 * 1000))
									this.giveList[i].time = day + '秒前'

								} else if (1 * 60 * 1000 <= time2 && time2 < 60 * 60 * 1000) {
									let day = Math.ceil(time2 / (1 * 60 * 1000))
									this.giveList[i].time = day + '分钟前'
									// this.giveList[i].time='5分钟前'
								} else if (1 * 60 * 60 * 1000 <= time2 && time2 < 24 * 60 * 60 * 1000) {
									let day = Math.ceil(time2 / (1 * 60 * 60 * 1000))
									this.giveList[i].time = day + '小时前'
								} else if (time2 >= 1 * 24 * 60 * 60 * 1000) {
									let day = Math.ceil(time2 / (1 * 24 * 60 * 60 * 1000))
									this.giveList[i].time = day + '天前'
								}
								//console.log(str.charAt(0),22)
								this.giveList[i].name = str.charAt(0) + '***' + str.charAt(str.length - 1);

							}

						} else {
							this.giveList = res.data.list.data.map(cur => {
								cur.name = '';
								cur.time = '';
								return cur;
							});
							for (var i = 0; i < this.giveList.length; i++) {
								var str = this.giveList[i].user_name;
								let date = new Date(this.giveList[i].pay_time.replace(/-/g, '/'));
								let time2 = (new Date().getTime()) - date;
								if (1 * 1000 <= time2 && time2 < 60 * 1000) {
									let day = Math.ceil(time2 / (1 * 1000))
									this.giveList[i].time = day + '秒前'

								} else if (1 * 60 * 1000 <= time2 && time2 < 60 * 60 * 1000) {
									let day = Math.ceil(time2 / (1 * 60 * 1000))
									this.giveList[i].time = day + '分钟前'
									// this.giveList[i].time='5分钟前'
								} else if (1 * 60 * 60 * 1000 <= time2 && time2 < 24 * 60 * 60 * 1000) {
									let day = Math.ceil(time2 / (1 * 60 * 60 * 1000))
									this.giveList[i].time = day + '小时前'
								} else if (time2 >= 1 * 24 * 60 * 60 * 1000) {
									let day = Math.ceil(time2 / (1 * 24 * 60 * 60 * 1000))
									this.giveList[i].time = day + '天前'
								}
								//console.log(str.charAt(0),22)
								this.giveList[i].name = str.charAt(0) + '***' + str.charAt(str.length - 1);

							}
						}

					}
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.give {}

	.fault {
		width: 352upx;
		margin: 200upx auto 0;

		.faultText {
			font-size: 28upx;
			color: #848484;
			text-align: center;
			// margin-top: 32upx;
			font-weight: bold;
		}

		image {
			width: 352upx;
			height: 272upx;
		}
	}

	.give-heard {
		position: fixed;
		top: 0;
		left: 0;
		width: 750upx;
		height: 704upx;
		z-index: 9;
	}

	.give-heard image {
		position: fixed;
		top: 0;
		left: 0;
		width: 750upx;
		height: 704upx;
		z-index: -1;
	}

	.give-heardR {
		position: fixed;
		top: 176upx;
		right: 0;
		z-index: 99;
	}

	.give-heardRT {
		width: 154upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		color: #FFFFFF;
		background-color: rgba(0, 0, 0, 0.2);
		font-size: 30upx;
		border-radius: 32upx 0 0 32upx;
	}

	.give-heardRB {
		width: 154upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		color: #FFFFFF;
		background-color: rgba(0, 0, 0, 0.2);
		font-size: 30upx;
		border-radius: 32upx 0 0 32upx;
		margin-top: 12upx;
	}

	.giveB {
		position: relative;
		margin-top: 584upx;
		z-index: 9;

	}

	.giveBT {
		width: 702upx;
		height: 482upx;
		border: 8upx solid #FFE9B7;
		margin: -80upx auto 0;
		// padding-bottom: 16upx;
		background-color: #FF473D;
		border-radius: 30upx;
	}

	.giveBTT {
		font-size: 40upx;
		color: #FFFFFF;
		height: 80upx;
		line-height: 80upx;
		padding-left: 24upx;
		font-style: oblique;
		font-weight: bold;
	}

	.giveBTT text {
		margin-left: 12upx;
	}

	.giveBTB {
		display: flex;
		margin-left: 8upx;

		.giveBTBI {
			width: 210upx;
			background-color: #FFFFFF;
			border-radius: 20upx;
			margin-left: 12upx;
			fiex: 1;

			.giveBImage {
				width: 210upx;
				height: 210upx;
				border-radius: 20upx 20upx 0 0;

				image {
					width: 100%;
					height: 100%;
					vertical-align: top;
					border-radius: 20upx 20upx 0 0;
				}
			}

			.giveBText {
				margin: 16upx 0 0 12upx;
				width: 100%;
				font-size: 28upx;
				color: #333333;
				font-weight: bold;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.giveBbtn {
				width: 186upx;
				height: 60upx;
				line-height: 60upx;
				background-color: #EF343D;
				color: #FFFFFF;
				border-radius: 30upx;
				margin: 16upx auto 24upx;
				font-size: 28upx;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

		}

		.giveBTBI2 {
			width: 190upx;
			background-color: #FFFFFF;
			border-radius: 20upx;
			margin-left: 12upx;
			fiex: 1;

			.giveBImage {
				width: 190upx;
				height: 190upx;
				border-radius: 20upx 20upx 0 0;

				image {
					width: 100%;
					height: 100%;
					vertical-align: top;
					border-radius: 20upx 20upx 0 0;
				}
			}

			.giveBText {
				margin: 16upx 0 0 12upx;
				width: 100%;
				font-size: 28upx;
				color: #333333;
				font-weight: bold;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.giveBbtn {
				width: 160upx;
				height: 60upx;
				line-height: 60upx;
				background-color: #EF343D;
				color: #FFFFFF;
				border-radius: 30upx;
				margin: 16upx auto 24upx;
				font-size: 28upx;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

		}

		.giveBTBback {
			background-color: rgba(0, 0, 0, 0.4);
		}
	}

	.giveOrder {
		width: 702upx;
		// height: 482upx;
		min-height: 480upx;
		border: 8upx solid #FFE9B7;
		margin: 24upx auto 26upx;
		background-color: #FF473D;
		border-radius: 30upx;

		.head {
			font-size: 40upx;
			color: #FFFFFF;
			height: 80upx;
			line-height: 80upx;
			padding-left: 24upx;
			font-style: oblique;
			font-weight: bold;
		}

		.main {
			padding: 24upx 16upx 0 16upx;

			.item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 24upx;

				.itemL {
					width: 45%;

					image {
						width: 64upx;
						height: 64upx;
						border-radius: 50%;
						vertical-align: top;
					}

					text {
						font-size: 26upx;
						color: #FFFFFF;
						margin-left: 20upx;
						line-height: 64upx;
					}

				}

				.itemR {
					width: 50%;
					display: flex;
					justify-content: space-between;
					line-height: 64upx;

					.itemRT {
						font-size: 26upx;
						color: #FFFFFF;
					}

					.itemRB {
						font-size: 26upx;
						color: #FFFFFF;
						margin-left: 40upx;
					}
				}
			}
		}


	}

	.previousItem {
		width: 702upx;
		height: 134upx;
		border-radius: 20upx;
		background-color: rgba(0, 0, 0, 0.05);
		margin: 20upx auto 0;
		display: flex;
		justify-content: space-between;

		.previousItemL {
			margin-left: 24upx;

			.previousT {
				font-size: 28upx;
				color: #333333;
				font-weight: bold;
				margin-top: 24upx;
			}

			.previousB {
				font-size: 24upx;
				color: #666666;
				margin-top: 12upx;
			}
		}

		.previousItemR {
			width: 112upx;
			height: 60upx;
			line-height: 60upx;
			background-color: #C9C9C9;
			border-radius: 30upx;
			font-size: 26upx;
			color: #FFFFFF;
			text-align: center;
			margin: 38upx 24upx 0 0;
		}
	}

	// .ParticItem:active{
	// 	background-color: #D9D9D9;
	// }
	.ParticItem {
		width: 702upx;
		height: 180upx;
		margin: 24upx auto 0;
		padding: 24upx;
		position: relative;
		display: flex;
		border: 2upx solid #E1E1E1;
		border-radius: 20upx;

		.buoy {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 99;
			width: 112upx;
			height: 60upx;
			line-height: 60upx;
			text-align: center;
			font-size: 26upx;
			color: #FFFFFF;
			background-color: #EF343D;
			border-radius: 30upx;
		}

		.buoy2 {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 99;
			width: 112upx;
			height: 60upx;
			line-height: 60upx;
			text-align: center;
			font-size: 26upx;
			color: #FFFFFF;
			background-color: #C9C9C9;
			border-radius: 30upx;
		}

		.ParticItemL {
			position: relative;

			image {
				width: 130upx;
				height: 130upx;
				vertical-align: top;
			}

		}

		.ParticItemR {
			margin-left: 20upx;
			width: calc(100% - 240upx);

			.ParticT {
				font-size: 28upx;
				color: #333333;
				font-weight: bold;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.ParticC {
				font-size: 28upx;
				color: #333333;
				font-weight: bold;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-top: 10upx;
			}

			.ParticB {
				font-size: 24upx;
				color: #666666;
				margin-top: 12upx;
			}
		}

		.ParticImage {
			position: absolute;
			right: 0;
			top: 0;
			width: 106upx;
			height: 106upx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.myParticipate {
		position: fixed;
		right: 24upx;
		bottom: 88upx;
		width: 136upx;
		height: 136upx;
		z-index: 99;

		image {
			width: 100%;
			height: 100%;
			vertical-align: top;
		}
	}
</style>
