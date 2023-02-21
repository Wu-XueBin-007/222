<template>
	<view class="back">
		<view class="headTop">
			<nav-head v-if="showStaic" title="收益明细" backGround="rage(0,0,0,0.01)" backBlack='true' :fontSize="16"
				backL="transparent" color="#333333">
			</nav-head>
			<seckill-nav v-else backGround="rage(0,0,0,1)" :fontSize="30" backL="transparent" color="#000000">
			</seckill-nav>
			<view class="allIncome ct">
				总收益（通证）
			</view>
			<view class="IncomeNum ct">
				{{all_profit}}
			</view>
			<view class="boxDetails">
				<view class="Details">
					<view class="Ditem">
						<text>当前活跃值</text>
						<text>{{dynamic_active}}</text>
					</view>
					<view class="Ditem">
						<text>待释放（通证）</text>
						<text>{{wait_profit}}</text>
					</view>
					<view class="Ditem">
						<text>已释放（通证）</text>
						<text>{{release_profit}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class='index_tab'>
			<scroll-view class="bottom_scroll" :scroll-x="true" :scroll-with-animation='true' :scroll-left="x">
				<view class='nav' :class="brand_index == index?'cur':''" v-for="(item,index) in nav_list"
					:key="item.index" @click='switchTap(index)'>
					<view>{{item.brand_name}}</view>
					<span></span>
				</view>
			</scroll-view>
		</view>
		<view class="listBox">
			<view v-for="(item) in Income_list" class="listLi">
				<view class="static">
					<text>{{item.describe}}</text>
					<text>{{item.create_time}}</text>
				</view>
				<text class="staticNum">{{item.money>0?'+'+item.money:item.money}}</text>
			</view>
			<empty v-if='Income_list.length==0&&isLoading' :isLoading='Income_list.length!==0&&!isLoading'></empty>
		</view>


	</view>
</template>

<script>
	import navHead from "@/components/navHead.vue";
	import seckillNav from "@/components/seckillNav.vue";
	import * as IncomeApi from '@/api/home/income'
	import Empty from '@/components/empty'
	export default {
		data() {
			return {
				showStaic: true,
				navInfo: {
					leftDistance: 0,
					lineHeight: 0,
					navH: 0,
					paddingTop: 0
				},
				contentScrollW: 0,
				x: 0,
				//测试数据,实际项目中引入自己的数据
				nav_list: [{
						brand_id: '',
						brand_name: "全部"
					},
					{
						brand_id: 901,
						brand_name: "静态收益"
					},
					{
						brand_id: 902,
						brand_name: "抢购收益"
					},
					{
						brand_id: 903,
						brand_name: "直推抢购收益"
					},
					{
						brand_id: 904,
						brand_name: "间推抢购收益"
					},
					{
						brand_id: 905,
						brand_name: "股东收益"
					},
					{
						brand_id: 906,
						brand_name: "董事收益"
					},
					{
						brand_id: 907,
						brand_name: "合伙人收益"
					}
				],
				brand_index: 0, // 当前选中的下标值
				all_profit: 0, //总收益
				wait_profit: 0, //待释放
				release_profit: 0, //已释放
				dynamic_active: 0, //当前活跃值
				Income_list: [],
				page: 1,
				isLoading: false
			};
		},
		components: {
			navHead,
			seckillNav,
			Empty
		},
		mounted() {
			this.getScrollW()
		},

		onShow() {
			this.groupinfo();
			this.grouplist()
		},
		onReachBottom() {
			this.grouplist(this.brand_index)
		},
		methods: {
			groupinfo() {
				IncomeApi.groupinfo().then(res => {
					// 收益明细上半部分
					let {
						all_profit,
						wait_profit,
						release_profit,
						dynamic_active
					} = res.data;
					console.log(res, 'res');
					console.log(dynamic_active, 'dynamic_active');
					this.all_profit = all_profit || 0;
					this.wait_profit = wait_profit || 0;
					this.release_profit = release_profit || 0;
					this.dynamic_active = dynamic_active || 0;
				}).catch(err => {
					console.log('groupinfocatch', err)
				})
			},
			grouplist(index = 0) {
				let nav_list = this.nav_list;
				let parameter = {
					page: this.page,
					scene: nav_list[index].brand_id
				}
				IncomeApi.grouplist(parameter).then(res => {
					console.log(res)
					let list = res.data.list;
					let page = list.current_page;
					this.page = page++;
					this.Income_list = list.data || [];
					this.isLoading = true;
				}).catch(err => {
					console.log('grouplistcatch', err)
				})

			},
			getScrollW() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.bottom_scroll').boundingClientRect(data => {
					this.contentScrollW = data.width
				}).exec();
				query.selectAll('.nav').boundingClientRect(data => {
					let dataLen = data.length;
					for (let i = 0; i < dataLen; i++) {
						this.nav_list[i].left = data[i].left;
						this.nav_list[i].width = data[i].width
					}
				}).exec()
			},
			switchTap(index) {
				this.brand_index = index;
				this.grouplist(index);
				this.x = this.nav_list[index].left - this.contentScrollW / 2 + this.nav_list[index].width / 2;

			}
		}
	}
</script>

<style lang="scss">
	::-webkit-scrollbar {
		display: none
	}

	.back {
		width: 100%;
		min-height: 100vh;
		font-family: 'PingFang SC';
		font-style: normal;
		background: white;

		.index_tab .bottom_scroll {
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			font-weight: 400;
			font-size: 24rpx;
			border-bottom: 0.5px solid #EEEEEE;
			color: #999999;
			padding-left: 34rpx;
		}

		.index_tab .bottom_scroll .nav {
			// width: 20%;
			display: inline-block;
			white-space: normal;
			text-align: center;
			padding: 30rpx 0;
			color: #6f7580;
			// font-size: 30rpx;
			position: relative;
			margin-right: 60rpx;
		}

		.index_tab .cur {
			color: #333;
			font-weight: 700;
		}

		.index_tab .cur span {
			width: 40rpx;
			height: 4rpx;
			border-radius: 5rpx;
			background: #ff8700;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0px;
			background: #F23A3A;
		}

		.listBox {
			padding: 40rpx 30rpx;
			background: white;
			font-size: 28rpx;
			color: #333333;
			display: flex;
			justify-content: center;
			flex-direction: column;

			.listLi {
				padding-bottom: 30rpx;
				border-bottom: 0.5px solid #EEEEEE;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 30rpx;

				.static {
					display: flex;
					justify-content: center;
					flex-direction: column;

					&>text:nth-child(1) {
						font-weight: 400;
						font-size: 28rpx;
						color: #333333;
					}

					&>text:nth-child(2) {
						font-weight: 400;
						font-size: 24rpx;
						color: #999999;
						margin-top: 10rpx;
					}
				}

				.staticNum {
					color: #333333;
					font-weight: 700;
					font-size: 32rpx;
				}
			}
		}

		.headTop {
			width: 100%;
			height: 520rpx;
			background: linear-gradient(180deg, #FFC493 0%, rgba(255, 196, 147, 0.2) 100%);
			border-radius: 0px 0px 10px 10px;
			position: relative;
			background: url('https://oss.gzrhhj.com/10001/20230210/43c878a78651073f303e91fb8feb2ef7.png');
			background-size: cover;


			.allIncome {
				font-weight: 400;
				font-size: 24rpx;
				color: #947256;
				margin-top: 54rpx;
			}

			.IncomeNum {
				font-size: 60rpx;
				color: #633A19;
				margin-top: 10rpx;
			}

			.boxDetails {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 144rpx;

				.Details {
					width: calc(100% - 60rpx);
					margin: 0 auto;
					height: 144rpx;
					// border: 2rpx solid;
					// border-radius: 20rpx 20rpx 0px 0px;
					// border-image-source: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
					// background: linear-gradient(180deg, #FFEDDD 0%, #FFF1E6 100%),
					// 	linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
					// background: red;
					display: flex;
					align-items: center;
					justify-content: space-around;

					.Ditem {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						text-align: center;

						&>text:nth-child(1) {
							font-weight: 400;
							font-size: 20rpx;
							color: #947256;
						}

						&>text:nth-child(2) {
							font-weight: 900;
							font-size: 36rpx;
							color: #633A19;
							margin-top: 10rpx;
						}
					}

				}
			}

		}
	}
</style>
