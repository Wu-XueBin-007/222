<template>
	<view class="report">
		<view class="reportH">
			<view class="reportHT">
				<text>*</text>请选择举报原因
			</view>
			<view :class="['reportHB',item.state?'reportActive':'']" v-for="(item,index) in reasonList" :key="index"
				:data-index="index" @click="getActive">
				<view class="reportHBT">
					{{item.name}}
				</view>
				<view class="reportHBB">
					<image src="../../static/selet_cat.png" mode="" v-if="item.state"></image>
					<image src="../../static/selet.png" mode="" v-else></image>
				</view>
			</view>
		</view>
		<view class="reportB">
			<view class="reportBT">
				<view class="reportBTL">
					举报描述(选填)
				</view>
				<view class="reportBTR">
					{{length}}/100
				</view>
			</view>
			<view class="reportBB">
				<textarea name="" @input="getlength" placeholder="请描述举报内容" v-model="desc" id="" maxlength="100"
					disable-default-padding="true" cols="30" rows="10"></textarea>
			</view>
		</view>
		<view class="reportBtn" v-if="isState" @click="Submit">
			提交
		</view>
		<view class="reportBtn2" v-else>
			感谢您的反馈，我们将尽快处理
		</view>
		<view class="" style="position: fixed;top: 0;right: 0;bottom: 0;left: 0;background-color: #FFFFFF;z-index: -1;">
		</view>
	</view>
</template>

<script>
	import * as taskApi from "@/api/task/index.js";
	const App = getApp()
	export default {
		data() {
			return {
				reasonList: [{
					id: 0,
					state: false,
					name: "令人恶心、反感或不适"
				}, {
					id: 1,
					state: false,
					name: "含有不雅/色情内容"
				}, {
					id: 2,
					state: false,
					name: "涉及侵权（知识产权等合法权益"
				}, {
					id: 3,
					state: true,
					name: "其他问题"
				}],
				desc: "",
				isState: true,
				reason: "其他问题",
				length: 0
			}
		},
		onLoad(options) {
			this.id = options.id;
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2]
			prevPage.$vm.isSwitch = false;
			prevPage.$vm.eliminateTimer()
		},
		methods: {
			getActive(e) {
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				for (var i = 0; i < this.reasonList.length; i++) {
					if (this.reasonList[i].id == index) {
						this.reasonList[i].state = true;
						this.reason = this.reasonList[i].name;
					} else {
						this.reasonList[i].state = false;
					}
				}
			},
			getlength(e) {
				this.length = e.detail.cursor
			},
			Submit() {
				var obj = {}
				obj.plan_id = this.id;
				obj.desc = this.desc;
				obj.reason = this.reason;
				taskApi.report(obj).then(res => {
					//console.log(res)
					this.isState = false;
				})
			}
		}

	}
</script>

<style scoped>
	.report {}

	.reportH {
		width: 690upx;
		margin: 20upx auto 0;
	}

	.reportHT {
		font-size: 30upx;
		color: #333333;
	}

	.reportHT text {
		color: #FF4040;
	}

	.reportHB {
		padding: 24upx 24upx 24upx 40upx;
		margin-top: 20upx;
		display: flex;
		justify-content: space-between;
	}

	.reportHBT {
		font-size: 28upx;
		color: #333333;
	}

	.reportHBB {
		width: 36upx;
		height: 36upx;

	}

	.reportHBB image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}

	.reportActive {
		background-color: #F6F6F6;
		border-radius: 10upx;
	}

	.reportB {
		width: 690upx;
		margin: 60upx auto 0;
	}

	.reportBT {
		display: flex;
		justify-content: space-between;
		margin-left: 16upx;
	}

	.reportBTL {
		font-size: 30upx;
		color: #333333;
	}

	.reportBTR {
		font-size: 28upx;
		color: #999999;
	}

	.reportBB {
		margin-top: 20upx;
	}

	.reportBB textarea {
		width: 650upx;
		height: 206upx;
		padding: 20upx;
		border-radius: 10upx;
		background-color: #F6F6F6;
		font-size: 28upx;
		color: #999999;
	}

	.reportBtn {
		margin: 220upx auto 24upx;
		width: 540upx;
		height: 80upx;
		background-color: #EF343D  ;
		color: #FFFFFF;
		font-size: 26upx;
		text-align: center;
		line-height: 80upx;
		border-radius: 40upx;
	}

	.reportBtn2 {
		margin: 220upx auto 24upx;
		width: 540upx;
		height: 80upx;
		background-color: #666666;
		color: #FFFFFF;
		font-size: 26upx;
		text-align: center;
		line-height: 80upx;
		border-radius: 40upx;
	}
</style>
