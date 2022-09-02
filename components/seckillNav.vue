<template>
	<view>
		<view :style="{'padding-top': navInfo.paddingTop + 'px','background':backGround,'position':'fixed','width':'100%','top':'0','left':'0','z-index':'999999'}">
			<view class="commonHead" :style="{'font-weight':(backType=='seckill'||backType=='other'||backType=='user')?'500':'500','font-size':fontSize+'rpx','height':navInfo.lineHeight+'px','line-height':navInfo.lineHeight+'px','color':color}">
				<view class="commonHeadLBack" @click="back" v-if="backFlag">
					<image :src="backType=='seckill'?'/static/home/back_black.png':(backType=='other'?'/static/icon/back_white.png':'/static/home/back_black.png')"></image>
				</view>
				{{title}}
			</view>
		</view>
		<view class="initHead" :style="{'height':navInfo.navH+'px','width':'100%'}"></view>
	</view>
	
</template>

<script>
	const App = getApp();
	export default {
		props: {
		  fontSize: {
			type: Number,
			default: 30
		  },
		  backType: {
			type: String,
			default: 'seckill'
		  },
		  title: {
		    type: String,
		    default: '',
		  },
		  backFlag: {
			  type: Boolean,
			  default: true
		  },
		  backGround: {
			  type: String,
			  default: "white"
		  },
		  color: {
			  type: String,
			  default: "#333333"
		  }
		},
		name:"seckillNav",
		data() {
			return {
				navInfo: {
					leftDistance: 0,
					lineHeight: 0,
					navH: 0,
					paddingTop: 0
				},
			};
		},
		mounted(){
			let obj = {};
			obj.leftDistance = App.globalData.leftDistance;
			obj.lineHeight = App.globalData.lineHeight;
			obj.navH = App.globalData.navH;
			obj.paddingTop = App.globalData.paddingTop;
			// console.log(obj)
			this.navInfo = obj;
		},
		methods:{
			back(){
				let page = getCurrentPages();
				console.log(page)
				if(page.length == 1){
					uni.switchTab({
						url:"/pages/index/index"
					})
				}else{
					uni.navigateBack({
						delta:1
					})
				}
				
			}
		}
	}
</script>

<style scoped>
	.commonHead{
		text-align: center;
		font-size: 30upx;
		font-family: PingFang;
		/* font-weight: 700; */
		color: #333333;
		/* background: linear-gradient(0deg, #FF5F60 0%, #DF6BAC 98.6328125%); */
		/* -webkit-background-clip: text;
		-webkit-text-fill-color: transparent; */
		position: relative;
	}
	.commonHeadLBack{
		width: 80upx;
		height: 36upx;
		display: flex;
		box-sizing: border-box;
		/* padding-left: 34upx; */
		/* background: linear-gradient(43deg, #FF5F60 0%, #DF6BAC 100%); */
		/* border-radius: 0 18upx 18upx 0; */
		/* margin-right: 14upx; */
		align-items: center;
		position: absolute;
		left: 30rpx;
		top: 50%;
		transform: translateY(-50%);
	}
	.commonHeadLBack>image{
		width: 20upx;
		height: 36upx;
	}
</style>
