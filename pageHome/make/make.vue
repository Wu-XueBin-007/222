<template>
	<view class="distribution">
		<head-nav title="天天赚" :backFlag="true" color="white" backGround="#03031D" backType="other" fontSize="36">
		</head-nav>
		<view class="headBanner">
			<image class="headBg" src="../static/bg.png" mode=""></image>
			<view class="textWrap">
				<view class="MemberShow">
					<view class="Memberw">
						成员展示
					</view>
					<view class="Memberpink">
						成员展示
					</view>
				</view>
				<view class="memberList">
					Member list
				</view>
				<view v-if="teamInfo.superior_user_info&&teamInfo.superior_user_info.user_id&&false" @click="showMark"
					class="referees">
					<image class="refereesImg" src="../static/referees.png" mode=""></image> 我的推荐人
				</view>
				<view v-else @click="bindReferees" class="referees ct">
					绑定推荐人
				</view>
				<template v-if="teamInfo.progress_meter_show"
					style="margin-top: 20rpx;z-index: 2;display: flex;flex-direction: column;justify-content: center;">
					<view v-for="item in teamInfo.progress_meter" class="progressx_box">
						<text>{{item.notes||'推广进度条'}}({{item.now||0}}/{{item.count||0}})</text>
						<view class="progress">
							<view :style="{width:((item.now||0)/(item.count||0))*100+'%'}" class="progress_w">
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>
		<!-- tabs -->
		<scroll-view class="scroll-view_H" :scroll-into-view='scroll_into_view' scroll-with-animation scroll-x="true">
			<template v-for="(tab,index) in nav">
				<view class="scroll-view-item_H" v-if="tab.isShow" :id="tab.field"
					:class="navIndex==index ? 'activite' : ''" @click="checkIndex(index)">{{tab.name}}</view>
			</template>
		</scroll-view>

		<view class="listWrap_box">
			<view class="listHead">
				<view class="">
					<view class="allNum">
						共<text style="color: red;">{{nav[navIndex].num}}</text>人
						总参与<text style="color: red;margin-left: 10rpx;">{{nav[navIndex].pay_num}}</text>人
					</view>
				</view>
				<view class="inpwrap">
					<input type="text" class="findInput" placeholder="ID查找" v-model="keyword" @confirm="searchList"
						placeholder-class="findId" value="" />
					<view style="z-index: 2;" @click="searchList" class="findimgwrap">
						<image class="findimg" src="../static/query.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view v-if="teamList.length" style="padding: 0 24rpx;box-sizing: border-box;">
			<view v-for="item in teamList" class="listWrap">
				<view class="member_avater">
					<image :src="item.user.avatar_url" class="mavater" mode=""></image>
					<view class="member_identity">
						{{item.level}}
					</view>
				</view>
				<view class="member_information">
					<view class="member_na_id">
						<view class="member_name">
							{{item.user.nick_name}}
						</view>
						<view class="member_id">
							<text>ID:{{item.user_id}}</text>
							<text>总参与:{{item.pay_num}}</text>
							<text>团队:<text class="member_id_num">{{item.subordinate_count||0}}</text>人 </text>
						</view>
					</view>
					<view class="member_phone">
						<text>手机号:{{item.user.mobile}}</text>
						<text>{{item.user.create_time}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="mark" v-if="markFlag" @click="hideMark"></view>
		<view class="topUserWrap" v-if="markFlag">
			<view class="topUserWrapT">
				<view class="topUserWrapTT">推荐人</view>
				<view class="topUserWrapTB">
					<view class="topUserWrapTBL"
						:style="{'background-image':'url('+teamInfo.superior_user_info.avatar_url+')'}"></view>
					<view class="topUserWrapTBR">
						<view class="topUserWrapTBRT">{{teamInfo.superior_user_info.nick_name}}</view>
						<view class="topUserWrapTBRB">
							<view class="topUserWrapTBRBL">ID：{{teamInfo.superior_user_info.user_id}}</view>
							<view class="topUserWrapTBRBR" :data-id="teamInfo.superior_user_info.user_id" @click="copy">
								复制</view>
						</view>
					</view>
				</view>
			</view>
			<image src="../../static/home/close_icon.png" class="topUserWrapB" @click="hideMark"></image>
		</view>

		<view class="mark" v-if="showAgree" @click="hideMark1"></view>
		<view class="topUserWrap" v-if="showAgree">
			<view class="topUserWrapT">
				<view class="topUserWrapTT">绑定推荐人</view>
				<view class="topUserWrapTB">
					<input class="input ct" type="number" min=0 v-model="superior" placeholder="请绑定推荐人ID"></input>
				</view>
				<button class="btn ct" @click="update_superior" type="primary">绑定</button>
			</view>
			<image src="../../static/home/close_icon.png" class="topUserWrapB" @click="hideMark1"></image>
		</view>
	</view>
</template>

<script>
	import * as API from "@/api/distribution/index.js";
	import * as UserApi from '@/api/user'
	import headNav from '@/components/seckillNav.vue'
	import Empty from '@/components/empty'
	export default {
		data() {
			return {
				userInfo: {},
				topUser: "",
				bottomUser: [],
				page: 1,
				limit: 10,
				reqFlag: true,
				totalUser: 0,
				teamInfo: {},
				total: 0,
				teamList: [],
				moreFlag: false,
				keyword: "",
				markFlag: false,
				nav: [],
				current: 0,
				itemWidth: 0, //每个item的宽度
				totalWidth: 10000, //设置一个默认总宽度
				scrollLeft: 0, //滑动距离
				tabTopList: [],
				tabTopCurrent: 0,
				scroll_into_view: 'team_count',
				navIndex: 0,
				showAgree: false,
				superior: ''
			}
		},
		components: {
			headNav
		},
		onLoad() {
			this.getPageData()
			this.getList()
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
		onReachBottom() {
			if (!this.moreFlag) {
				return false;
			}
			this.moreFlag = false;
			this.page = this.page + 1;
			this.getUserList();
		},
		methods: {
			copy(e) {
				let id = e.target.dataset.id || e.currentTarget.dataset.id;
				uni.setClipboardData({
					data: id.toString()
				})
			},
			// TAB切换
			checkIndex(index) {
				this.navIndex = index;
				this.keyword = ''
				this.scroll_into_view = this.nav[index].field;
				this.getList();
			},
			update_superior() {
				UserApi.update_superior({
						superior_user_id: this.superior
					})
					.then(result => {
						console.log(result, 'result');
					})
			},
			// 我的推荐人
			showMark() {
				this.markFlag = true;
			},
			hideMark1() {
				this.showAgree = false;
			},
			bindReferees() {
				this.showAgree = true;
			},
			// 隐藏 我的推荐人
			hideMark() {
				this.markFlag = false;
			},
			// 搜索
			searchList() {
				console.log(2222);
				this.page = 1;
				this.getUserList();
			},
			bottomCallBack(e) {
				console.log(e)
				if (!this.reqFlag) {
					return false;
				}
				this.reqFlag = false;
				this.page = this.page + 1;
				this.getbottomList();
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
			getbottomList() {
				let obj = {};
				obj.page = this.page;
				obj.limit = this.limit;
				obj.type = 0;
				API.relationship(obj)
					.then(res => {
						if (this.page < res.data.userInfo.last_page) {
							this.reqFlag = true;
						}
						if (this.page == 1) {
							this.bottomUser = res.data.userInfo.data ? res.data.userInfo.data : [];
						} else {
							this.bottomUser = this.bottomUser.concat(res.data.userInfo.data);
						}
						this.totalUser = res.data.userInfo.total;
					})
			},
			async getList() {
				let res = await API.group()
				this.teamInfo = res.data.data;
				this.nav = res.data.data.nav
				this.getUserList();
			},
			getUserList() {
				let obj = {};
				obj.page = this.page;
				if (this.keyword) {
					obj.user_id = this.keyword;
				}
				let type = this.nav[this.navIndex].field;
				obj.type = type
				API.group_list(obj).then(res => {
					console.log(res)
					if (this.page == 1) {
						this.teamList = res.data.user_list.data;
					} else {
						this.teamList = this.teamList.concat(res.data.user_list.data);
					}
					if (this.page < res.data.user_list.last_page) {
						this.moreFlag = true;
					} else {
						this.moreFlag = false;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url("index.scss");

	// scroll-view_H
	/* 隐藏滚动条样式 */
	::-webkit-scrollbar {
		width: 0;
		height: 0;
	}

	.input {
		border: 1rpx solid #dfdfdf;
		height: 59rpx;
		padding-left: 16rpx;
		background: #d6d6d6;
		border-radius: 10rpx;
	}

	.btn {
		width: 200rpx;
		height: 68rpx;
		margin-top: 40rpx;
		// width: 120rpx;
	}

	// 空数据按钮
	.empty-ipt {
		width: 100%;
		height: 100%;
		font-size: 28rpx;
		// height: 64rpx;
		// line-height: 64rpx;
		text-align: center;
		color: black;
		// background-color: #EF343D  ;
		border-radius: 60rpx;
		// background: linear-gradient(to right, #f9211c, #ff6335);
		// border: 2upx solid #EF343D  ;
	}

	.distribution {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.progressx_box {
		margin-top: 10rpx;
		z-index: 1;
		color: white;
	}

	.progress {
		width: 342rpx;
		height: 10rpx;
		background: #69172B;
		border-radius: 6rpx;
		margin-top: 22rpx;
		position: relative;
	}

	.progress_w {
		position: absolute;
		left: 0;
		top: 0;
		background: #FFFFFF;
		z-index: 2;
		height: 100%;
		border-radius: 3px;
	}

	.scroll-view_H {
		white-space: nowrap;
		margin-top: -40rpx;
		height: 104rpx;
		z-index: 3;
		background: linear-gradient(0deg, #000000 0%, #27273C 100%);

		.scroll-view-item_H {
			width: 316rpx;
			display: inline-block;
			text-align: center;
			background: linear-gradient(0deg, #000000 0%, #27273C 100%);
			color: white;
			height: 104rpx;
			line-height: 104rpx;
		}

		.activite {
			background: linear-gradient(0deg, #0A0A0F 0%, #C6836B 100%);
			border-radius: 10px 0px 0px 0px;
			width: 316rpx;
		}
	}
</style>
