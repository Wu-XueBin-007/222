<template>
	<view>
		<mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback"
		  :up="upOption" @up="upCallback">
		<view class="con">
			<view class="conItem" v-for="(item,index) in list" :key="index">
				<image src="../../static/default-avatar.png"></image>
				<view class="conItemR">
					<view class="conItemRT">标题标题</view>
					<view class="conItemRB">浏览量:1234</view>
				</view>
			</view>
		</view>
		</mescroll-body>
	</view>
	
</template>

<script>
	import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	export default {
		components: {
		  MescrollBody
		},
		mixins: [MescrollMixin],
		data(){
			return {
				upOption: {
				  // 首次自动执行
				  auto: true,
				  // 每页数据的数量; 默认10
				  page: { size: 15 },
				  // 数量要大于4条才显示无更多数据
				  noMoreSize: 15,
				  // 空布局
				  empty: {
				    tip: '暂无动态'
				  }
				},
				list:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			}
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
		methods:{
			upCallback(page) {
				//console.log(page)
			  let app = this
			  setTimeout(()=>{
				  if(page.num == 1){
					  app.list = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				  }else{
					  app.list = app.list.concat([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
				  }
				  
				  app.mescroll.endBySize(15, 44);
			  },3000)
			  
			}
		}
	}
</script>

<style scoped>
	.status{
		font-size: 32upx;
		line-height: 32upx;
		padding: 30upx 0;
		text-align: center;
		color: #999999;
	}
	.conItem{
		width: 100%;
		height: 194upx;
		border-bottom: 2upx solid #F5F5F5;
		box-sizing: border-box;
		padding: 32upx 24upx;
		display: flex;
		justify-content: space-between;
		background: white;
	}
	.conItem:last-child{
		height: 192upx;
		border-bottom: none;
	}
	.conItem>image{
		width: 128upx;
		height: 128upx;
	}
	.conItemR{
		width: calc(100% - 168upx);
		height: 128upx;
		box-sizing: border-box;
		padding: 12upx 0 16upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.conItemRT{
		font-size: 24upx;
		line-height: 32upx;
		color: #333333;
	}
	.conItemRB{
		font-size: 20upx;
		line-height: 20upx;
		color: #999999;
	}
</style>
