<template>
	<view>
		<view class="inpWrap">
			<input type="text" placeholder="请输入车站名称" @input="showMore" />
			<view class="inpCon" v-if="stationNow.length>0">
				<view class="inpItem" v-for="(item,index) in stationNow" :key="index" :data-id="item.id" @click="back" :data-index="index">{{item.name}}</view>
			</view>
		</view>
		<view class="contentWrap">
			<view class="conTit">热门站点</view>
			<view class="con">
				<view class="conItem" v-for="(item,index) in province" :key="index" :data-id="item.id" @click="back1" :data-index="index">{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {province,station} from "@/utils/station.js";
	export default {
		data() {
			return {
				province,
				station,
				stationNow:[],
				type:'start'
			}
		},
		onLoad(options) {
			//console.log(options)
			this.type = options.type;
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
			back1(e){
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				let pages = getCurrentPages();
				let nowPage = pages[ pages.length - 1];  //当前页页面实例
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				if(this.type == "start"){
					prevPage.$vm.startInfo = this.province[index];
				}else if(this.type == "end"){
					prevPage.$vm.endInfo = this.province[index];
				}
				//console.log(prevPage)
				//console.log(this.province[index])
				uni.navigateBack({
					delta:1
				})
			},
			back(e){
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				let pages = getCurrentPages();
				let nowPage = pages[ pages.length - 1];  //当前页页面实例
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				if(this.type == "start"){
					prevPage.$vm.startInfo = this.stationNow[index];
				}else if(this.type == "end"){
					prevPage.$vm.endInfo = this.stationNow[index];
				}
				//console.log(this.stationNow[index])
				uni.navigateBack({
					delta:1
				})
			},
			showMore(e){
				//console.log(e)
				let keyword = e.detail.value;
				let arr = [];
				if(keyword){
					for(let i=0;i<this.station.length;i++){
						if(this.station[i].name.indexOf(keyword)!=-1){
							arr.push(this.station[i])
						}
					}
				}
				this.stationNow = arr;
			}
		}
	}
</script>

<style scoped>
	.inpCon{
		width: calc(100% - 60upx);
		max-height: 300upx;
		overflow-y: auto;
		position: absolute;
		top: 110upx;
		left: 30upx;
		box-sizing: border-box;
		padding: 0 30upx;
		background: white;
		box-shadow: 0 0 4upx 4upx rgba(0,0,0,.1);
		border-radius: 12upx;
	}
	.inpItem{
		height: 60upx;
		line-height: 60upx;
		border-bottom: 2upx solid #f5f5f5;
	}
	
	.inpWrap{
		width: 100%;
		padding: 20upx 30upx;
		box-sizing: border-box;
		background: white;
	}
	.inpWrap>input{
		width: 100%;
		height: 80upx;
		border-radius: 12upx;
		box-sizing: border-box;
		border: none;
		outline: none;
		background: #f5f5f5;
		padding: 0 30upx;
	}
	.contentWrap{
		width: 100%;
		box-sizing: border-box;
		padding: 30upx;
		margin-top: 10upx;
		background: white;
	}
	.conTit{
		font-size: 32upx;
		color: #333;
		font-weight: bold;
		margin-bottom: 30upx;
	}
	.con{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}
	.conItem{
		height: 38upx;
		font-size: 28upx;
		line-height: 38upx;
		background: #f5f5f5;
		border-radius: 6upx;
		padding: 0 16upx;
		color: #333;
		margin-top: 30upx;
		margin-right: 20upx;
	}
	.conItem:nth-child(1),
	.conItem:nth-child(2),
	.conItem:nth-child(3),
	.conItem:nth-child(4),
	.conItem:nth-child(5),
	.conItem:nth-child(6){
		margin-top: 0;
	}
</style>
