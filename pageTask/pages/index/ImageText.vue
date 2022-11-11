<template>
	<view class="ImageText">
		<view class="ImageTextH" v-if="view_time!=0&&advertPlanInfo.view_status==1">
			再浏览{{view_time}}S即可领取奖励
		</view>
		<view class="ImageTextH" v-else>
			已完成浏览任务，获得{{advertPlanInfo.price}}元
		</view>
		<view class="ImageTextMain">
			<view class="ImageTextMainT">
				{{advertPlanInfo.txt_info.title}}
			</view>
			<view class="ImageTextMainC" v-html="advertPlanInfo.txt_info.content">
				
			</view>
			<view class="ImageTextMainB">
				
			</view>
		</view>
		<view class="videoDetailsC" v-if="advertPlanInfo.is_card==1">
			<view class="videoDetailsCT">
				<view class="title">
					<view class="Left">
						<view class="Lable">
							<text style="color: #FF4040;">*</text> {{card_config.name}}
						</view>
						<view class="Input">
							<input type="text" v-model="name" value="">
						</view>
					</view>
					<view class="Image" v-if="card_config.sex">
						<view class="ImageL" >
							<image v-if="sex==0" src="../../static/selet_cat.png" mode="" @click="getSex(1)"></image>
							<image v-if="sex==1" src="../../static/selet.png" mode="" @click="getSex(0)"></image>先生
						</view>
						<view class="ImageR">
							<image v-if="sex==1" src="../../static/selet_cat.png" mode="" @click="getSex(0)"></image>
							<image v-if="sex==0" src="../../static/selet.png" mode="" @click="getSex(1)"></image>女士
						</view>
					</view>
				</view>
				<view class="main">
					<view class="mItem">
						<view class="Lable">
							<text style="color: #FF4040;">*</text>{{card_config.phone}}
						</view>
						<view class="Input">
							<input type="number" v-model="phone"  value="">
						</view>
					</view>
					<view class="mItem">
						<view class="Lable" style="padding-left: 20upx;">
							{{card_config.address}}
						</view>
						<view class="Input">
							<input type="text" v-model="address" value="">
						</view>
					</view>
					<view class="mItem" v-if="card_config.other">
						<view class="Lable" style="padding-left: 20upx;">
							{{card_config.other}}
						</view>
						<view class="Input">
							<input type="text" v-model="other" value="">
						</view>
					</view>
				</view>
			</view>
			<view class="videoDetailsCB" @click="Submit">
				预约提交
			</view>
		</view>
	</view>
</template>

<script>
	import * as taskApi from "@/api/task/index.js";
	const App = getApp()
	let timer = null;
	export default{
		data(){
			return{
				id:1,
				advertPlanInfo:{},
				card_config:{
					address: "",
					name: "",
					phone: null,
					sex: "",
					other:""
				},
				address: "",
				name: "",
				phone: '',
				sex: 0,
				other:"",
				view_time:0,
				isSize:true
			}
		},
		onLoad(options) {
			this.id=options.id;
			this.init();
			if(this.advertPlanInfo.view_status==1){
				this.getBeforeProfit();
			}
			
		},
		methods:{
			init(){
				var obj={}
				obj.plan_id=this.id
				taskApi.detail(obj).then(res=>{
					console.log(res)
					this.advertPlanInfo=res.data.advertPlanInfo;
					this.card_config=this.advertPlanInfo.card_config;
					this.view_time=this.advertPlanInfo.view_time;
					if(this.advertPlanInfo.view_status==1){
						if(this.view_time>0){
							timer=setInterval(()=>{
								this.view_time=this.view_time-1;
								if(this.view_time<=0){
									clearInterval(timer)
									this.view_time=0;
									this.isSize=false;
									this.sutProfit()
								}
							},1000)
							
						}
					}else{
						
					}
					
				})
			},
			onUnload() {
				clearInterval(timer)
			},
			sutProfit(){
				var obj={}
				obj.plan_id=this.id;
				taskApi.profit(obj).then(res=>{
					console.log(res)
				})
			},
			getBeforeProfit(){
				var obj={}
				obj.plan_id=this.id;
				taskApi.beforeProfit(obj).then(res=>{
					console.log(res)
				})
			},
			getSex(type){
				this.sex=type;
			},
			Submit(){
				var obj={};
				obj.plan_id=Number(this.id);
				if(this.name==''){
					uni.showToast({
						icon:"none",
						title:"请填写姓名"
					})
					return false;
				}
				if(this.phone==''){
					uni.showToast({
						icon:"none",
						title:"请填写电话"
					})
					return false;
				}
				obj.name=this.name;
				obj.phone=this.phone;
				if(this.card_config.sex){
					obj.sex=this.sex
				}
				if(this.card_config.address){
					obj.address=this.address
				}
				if(this.card_config.other){
					obj.other=this.other
				}
				taskApi.cardForm(obj).then(res=>{
					console.log(res)
					uni.showToast({
						icon:"none",
						title:res.message
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ImageTextH{
		width: 750upx;
		height: 68upx;
		line-height: 68upx;
		padding: 0 30upx;
		background-color: #E5EEFF;
		color: #2969FF;
		font-size: 28upx;
		font-weight: bold;
	}
	.ImageTextMain{
		width: 690upx;
		margin: 20upx auto 24upx;
	}
	.ImageTextMainT{
		font-size: 32upx;
		color: #333333;
		font-weight: bold;
	}
	.ImageTextMainC{
		margin-top: 94upx;
	}
	.videoDetailsC{
		padding: 0 30upx;
		background-color: #FFFFFF;
		.videoDetailsCT{
			.title{
				padding: 30upx 0;
				border-bottom: 1upx solid #E8E8E8;
				display: flex;
				.Left{
					display: flex;
					width: 442upx;
					.Lable{
						font-size: 32upx;
						font-weight: bold;
						color: #333333;
					}
					.Input{
						width: 80%;
						padding-left: 20upx;
						color: #888888;
						font-size: 28upx;
					}
				}
				.Image{
					display: flex;
					width: calc(100% - 460upx);
					margin-left: 30upx;
					.ImageL{
						// width: 36upx;
						// height: 36upx;
						image{
							width: 36upx;
							height: 36upx;
							vertical-align: top;
							margin-right: 10upx;
						}
					}
					.ImageR{
						// width: 36upx;
						// height: 36upx;
						margin-left: 16upx;
						image{
							width: 36upx;
							height: 36upx;
							vertical-align: top;
							margin-right: 10upx;
						}
					}
				}
			}
			.main{
				
				.mItem{
					padding: 30upx 0;
					border-bottom: 1upx solid #E8E8E8;
					display: flex;
					.Lable{
						font-size: 32upx;
						font-weight: bold;
						color: #333333;
					}
					.Input{
						width: 80%;
						padding-left: 20upx;
						color: #888888;
						font-size: 28upx;
					}
				}
			}
			
		}
		.videoDetailsCB{
			width: 344upx;
			height: 80upx;
			border-radius: 40upx;
			background-color: #EF343D  ;
			line-height: 80upx;
			color: #FFFFFF;
			margin: 36upx auto 30upx;
			text-align: center;
			font-size: 30upx;
		}
	}
</style>