<template>
	<view class="boxList">
		<view class="head">
			<view class="head-item">
				<view class="">在线开盒</view>
				<view class="">物超所值</view>
			</view>
			<view class="head-item">
				<view class="">一件发货</view>
				<view class="">实时跟踪</view>
			</view>
			<view class="head-item">
				<view class="">官方正品</view>
				<view class="">100%保障</view>
			</view>
			<view class="head-item">
				<view class="">兑换豪礼</view>
				<view class="">超全品类</view>
			</view>
		</view>
		<view class="main">
			<view class="main-item" v-for="(item,index) in boxList" :key="index">
				<view class="main-item-top">
					<image src="../../static/bj2.png" mode=""></image>
					<view class="main-item-text">
						{{item.name}}
					</view>
				</view>
				<view class="main-item-bottom">
					<view class="main-item-bL" @click="close" :data-id="item.id" :data-index="index">
						<view class="main-item-bLT">
							<image :src="item.preview_url" mode=""></image>
						</view>
						<view class="main-item-bLB">
							￥{{item.price}}<text>/个</text>
						</view>
					</view>
					<view class="main-item-bR">
						<view class="modular" v-if="indexs<4" v-for="(items,indexs) in item.goods_list" :key="indexs">
							<view class="modular-left">
								<view class="modular-text1">
									{{items.goods_name}}
								</view>
								<view class="modular-text2">
									￥{{items.goods_price}}
								</view>
							</view>
							<view class="modular-right">
								<image :src="items.preview_url!=null?items.preview_url:items.images.file.preview_url"
									mode=""></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: rgba(255,255,255,1);z-index: -1;"
			catchtouchmove="true"></view>
	</view>

</template>

<script>
	import * as boxApi from "@/api/blindbox/index.js";
	const App = getApp();
	export default {
		data() {
			return {
				boxList: [],
				Index: -1
			}
		},
		onLoad(options) {
			this.Index = options.navIndex;
			//console.log(options.navIndex,88)
			this.init()
		},
		methods: {
			init() {
				boxApi.list().then(res => {
					//console.log(res)
					if (res.status == 200) {
						let middleNum = Math.floor(res.data.list.length / 2);
						//console.log(res.data.list)
						res.data.list = res.data.list.map((cur, index) => {
							cur.ind = index;
							cur.left = -50;
							return cur;
						})
						for (let i = 0; i < res.data.list.length; i++) {
							if (i <= middleNum) {
								let obj = res.data.list[i];
								obj.left = obj.left + 120 * i;
								res.data.list.splice(i, 1, obj);
							} else if (i > middleNum) {
								let obj = res.data.list[i];
								obj.left = obj.left - 120 * (res.data.list.length - i) - 25;
								res.data.list.splice(i, 1, obj);
							}
						}
						this.boxList = res.data.list
						// this.getDetail(this.boxList[0].id)
					}

				})
			},
			close(e) {
				let id = e.target.dataset.id || e.currentTarget.dataset.id;
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]

				let Indexs = Number(this.Index)

				if (index != Indexs) {
					//console.log(index,Indexs,55)
					prevPage.$vm.boxId = id
					prevPage.$vm.navIndex = index
					prevPage.$vm.changeNav(index)
				}
				// prevPage.$vm.navIndex=index
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style scoped>
	.head {
		margin-top: 44upx;
		display: flex;
		justify-content: space-around;
	}

	.head-item {
		width: 154upx;
		height: 96upx;
		background-color: #F5F5F5;
		border-radius: 16upx;
	}

	.head-item view:nth-child(1) {
		font-size: 28upx;
		color: #404040;
		text-align: center;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 30upx;
		margin-top: 16upx;
	}

	.head-item view:nth-child(2) {
		font-size: 24upx;
		color: #5F5F5F;
		text-align: center;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 30upx;
		margin-top: 16upx;
	}

	.main {
		margin-top: 44upx;
	}

	.main-item {
		width: 690upx;
		/* height: 310upx; */
		box-shadow: 0px 5upx 24upx 0px rgba(0, 0, 0, 0.09);
		border-radius: 0px 0px 20upx 20upx;
		margin: 0 auto 22upx;
	}

	.main-item-top {
		position: relative;
		width: 690upx;
		height: 88upx;
	}

	.main-item-top image {
		width: 690upx;
		height: 88upx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.main-item-top .main-item-text {
		font-size: 30upx;
		color: #D3B171;
		padding-top: 28upx;
		padding-left: 24upx;
		position: relative;
		z-index: 99;
	}

	.main-item-bottom {
		display: flex;
		padding-bottom: 6upx;
	}

	.main-item-bL {
		margin: 26upx 0 0 20upx;
	}

	.main-item-bLT {
		width: 210upx;
		height: 210upx;
	}

	.main-item-bLT image {
		width: 100%;
		height: 100%;
	}

	.main-item-bLB {
		font-size: 34upx;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
		color: #FF3464;
		text-align: center;
		margin-top: 15upx;
	}

	.main-item-bLB text {
		color: #5F5F5F;
	}

	.main-item-bR {
		/* margin-left: 10upx; */
		margin-top: 26upx;
		display: flex;
		flex-wrap: wrap;
	}

	.modular {
		width: 210upx;
		height: 130upx;
		border-radius: 10upx;
		background-color: #F6F6F6;
		margin: 0 0 10upx 10upx;
		display: flex;
		padding: 20upx 10upx;
	}

	.modular-left {
		width: 53%;
	}

	.modular-text1 {
		width: 90%;
		font-size: 20upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #2A2A2A;
		line-height: 30upx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.modular-text2 {
		width: 90%;
		display: inline-block;
		font-size: 20upx;
		padding: 4upx 10upx;
		text-align: center;
		color: #D3B171;
		border-radius: 20upx;
		background-color: #010101;
		margin: 6upx auto 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.modular-right {
		width: 90upx;
		height: 90upx;
	}

	.modular-right image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}
</style>
