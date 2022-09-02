<template>
	<view class="ticket">
		<view class="ticket-main">
			<view class="ticket-content">
				<view class="ticket-header">
					出行信息
				</view>
				<view class="ticket-item">
					<!-- <picker style="width: 92%;" mode="selector" @change="bindPickerChange" :range="arrList" range-key="name">
							<label style="color: #333333;font-size: 24upx;display: inline-block;width: 150upx;">出行工具：</label>
							<label style="color: #333333;font-size: 24upx;padding-left: 40upx;">{{arrList[indexL].name}}</label>
					</picker>
					<view class="ticket-icon">
						<image src="../../static/icon/more_gray.png" mode=""></image>
					</view> -->
					<label style="color: #333333;font-size: 24upx;display: inline-block;width: 200upx;" v-if="type!=3">出行工具：</label>
					<label style="color: #333333;font-size: 24upx;display: inline-block;width: 150upx;" v-else>出行工具：</label>
					<view class="ticket-inp">
						<text v-if="type==1">高铁</text>
						<text v-if="type==2">火车</text>
						<text v-if="type==3">飞机</text>
					</view>
				</view>
				<view class="ticket-item" v-if="type==3">
					<view class="ticket-label">
						出发站点：
					</view>
					<view class="ticket-inp">
						<input type="text" v-model="starting_point" placeholder="例:xxx机场" />
					</view>
				</view>
				<view class="ticket-item" v-else>
					<view class="ticket-label" style="width: 200upx;">
						出发站点：
					</view>
					<view class="ticket-inp">
						{{stationData.queryLeftNewDTO.from_station_name}}
					</view>
				</view>
				<view class="ticket-item" v-if="type==3">
					<view class="ticket-label">
						目的站点：
					</view>
					<view class="ticket-inp">
						<input type="text" v-model="finishing_point" placeholder="例:xxx机场" />
					</view>
				</view>
				<view class="ticket-item" v-else>
					<view class="ticket-label" style="width: 200upx;">
						目的站点：
					</view>
					<view class="ticket-inp">
						{{stationData.queryLeftNewDTO.to_station_name}}
					</view>
				</view>
				<!-- <view class="ticket-item">
					<view class="ticket-label">
						出行时间：
					</view>
					<view style="width: 68%;font-size: 24upx;padding-left: 40upx;color: #333333;" @click="openDatetimePicker">
						{{set_out_time}}
					</view>
					<SimpleDateTimePicker
					      ref="myPicker"
					      @submit="handleSubmit"
					      :start-year="2021"
					      :end-year="2030"
					    />
					<view class="ticket-icon">
						<image src="../../static/icon/more_gray.png" mode=""></image>
					</view>
				</view> -->
				<view class="ticket-item" v-if="type==3">
					<picker style="width: 92%;" mode="date" @change="handleSubmit" :start="startTimes">
							<label style="color: #333333;font-size: 24upx;display: inline-block;width: 150upx;">出行时间：</label>
							<label style="color: #333333;font-size: 24upx;padding-left: 40upx;">{{set_out_time}}</label>
					</picker>
					<view class="ticket-icon">
						<image src="../../static/icon/more_gray.png" mode=""></image>
					</view>
				</view>
				<view class="ticket-item" v-else>
					<label style="color: #333333;font-size: 24upx;display: inline-block;width: 200upx;">出行时间：</label>
					<label style="color: #333333;font-size: 24upx;padding-left: 40upx;">{{startTimeNew + " " +  stationData.queryLeftNewDTO.start_time}}</label>
				</view>
				<view class="ticket-item" v-if="type == 3">
					<view class="ticket-label">
						车次：
					</view>
					<view class="ticket-inp">
						<input type="text" v-model="train_number" placeholder="请输入车次" />
					</view>
				</view>
				<view class="ticket-item" v-else>
					<view class="ticket-label" style="width: 200upx;">
						车次：
					</view>
					<view class="ticket-inp">
						{{stationData.queryLeftNewDTO.station_train_code}}
					</view>
				</view>
				<view class="ticket-item" v-if="type == 1">
					<picker style="width: 92%;" mode="selector" @change="bindPickerChange1" :range="arrList1" range-key="name">
							<label style="color: #333333;font-size: 24upx;display: inline-block;width: 200upx;">坐席：</label>
							<label style="color: #333333;font-size: 24upx;padding-left: 40upx;">{{arrList1[indexL1].name}}</label>
					</picker>
					<view class="ticket-icon">
						<image src="../../static/icon/more_gray.png" mode=""></image>
					</view>
				</view>
				<view class="ticket-item" v-if="type == 2">
					<picker style="width: 92%;" mode="selector" @change="bindPickerChange2" :range="arrList2" range-key="name">
							<label style="color: #333333;font-size: 24upx;display: inline-block;width: 200upx;">坐席：</label>
							<label style="color: #333333;font-size: 24upx;padding-left: 40upx;">{{arrList2[indexL2].name}}</label>
					</picker>
					<view class="ticket-icon">
						<image src="../../static/icon/more_gray.png" mode=""></image>
					</view>
				</view>
				<view class="ticket-item" v-if="type==3">
					<picker style="width: 92%;" mode="selector" @change="bindPickerChange3" :range="arrList3" range-key="name">
							<label style="color: #333333;font-size: 24upx;display: inline-block;width: 150upx;">坐席：</label>
							<label style="color: #333333;font-size: 24upx;padding-left: 40upx;">{{arrList3[indexL3].name}}</label>
					</picker>
					<view class="ticket-icon">
						<image src="../../static/icon/more_gray.png" mode=""></image>
					</view>
				</view>
				
				<view class="ticket-item" v-if="type!=3">
					<view class="ticket-label" style="width: 200upx;">
						12306参考原价：
					</view>
					<view class="ticket-inp" v-if="type==1&&indexL1==0">
						{{stationData.queryLeftNewDTO.swz_price>0?stationData.queryLeftNewDTO.swz_price:'无此座席'}}
					</view>
					<view class="ticket-inp" v-if="type==1&&indexL1==1">
						{{stationData.queryLeftNewDTO.zy_price>0?stationData.queryLeftNewDTO.zy_price:'无此座席'}}
					</view>
					<view class="ticket-inp" v-if="type==1&&indexL1==2">
						{{stationData.queryLeftNewDTO.ze_price>0?stationData.queryLeftNewDTO.ze_price:'无此座席'}}
					</view>
					<view class="ticket-inp" v-if="type==1&&indexL1==3">
						{{stationData.queryLeftNewDTO.wz_price>0?stationData.queryLeftNewDTO.wz_price:'无此座席'}}
					</view>
					<view class="ticket-inp" v-if="type==1&&indexL1==4">
						{{stationData.queryLeftNewDTO.tz_price>0?stationData.queryLeftNewDTO.tz_price:'无此座席'}}
					</view>
					<view class="ticket-inp" v-if="type==1&&indexL1==5">
						{{stationData.queryLeftNewDTO.gr_price>0?stationData.queryLeftNewDTO.gr_price:'无此座席'}}
					</view>
					<view class="ticket-inp" v-if="type==1&&indexL1==6">
						{{stationData.queryLeftNewDTO.srrb_price>0?stationData.queryLeftNewDTO.srrb_price:'无此座席'}}
					</view>
					
					
					<view class="ticket-inp" v-if="type==2&&indexL2==0">
						{{stationData.queryLeftNewDTO.yz_price>0?stationData.queryLeftNewDTO.yz_price:'无此座席'}}
					</view>
					<view class="ticket-inp" v-if="type==2&&indexL2==1">
						{{stationData.queryLeftNewDTO.yw_price>0?stationData.queryLeftNewDTO.yw_price:'无此座席'}}
					</view>
					<view class="ticket-inp" v-if="type==2&&indexL2==2">
						{{stationData.queryLeftNewDTO.rw_price>0?stationData.queryLeftNewDTO.rw_price:'无此座席'}}
					</view>
					<view class="ticket-inp" v-if="type==2&&indexL2==3">
						{{stationData.queryLeftNewDTO.wz_price>0?stationData.queryLeftNewDTO.wz_price:'无此座席'}}
					</view>
					<view class="ticket-inp" v-if="type==2&&indexL2==4">
						{{stationData.queryLeftNewDTO.rz_price>0?stationData.queryLeftNewDTO.rz_price:'无此座席'}}
					</view>
				</view>
				<view class="ticket-item" v-if="type == 3">
					<view class="ticket-label">
						原价：
					</view>
					<view class="ticket-inp">
						<input type="digit" v-model="primary_price" placeholder="请输入价格" @input="getMoeny" />
					</view>
				</view>
				<view class="ticket-item" v-else>
					<view class="ticket-label" style="width: 200upx;">
						原价：
					</view>
					<view class="ticket-inp">
						<input type="digit" v-model="primary_price" placeholder="请输入价格" @input="getMoeny" />
					</view>
				</view>
				<view class="ticket-item" v-if="type == 3">
					<view class="ticket-label">
						备注：
					</view>
					<view class="ticket-inp">
						<input type="text" v-model="stay_word" placeholder="请输入备注" />
					</view>
				</view>
				<view class="ticket-item" v-else>
					<view class="ticket-label" style="width: 200upx;">
						备注：
					</view>
					<view class="ticket-inp">
						<input type="text" v-model="stay_word" placeholder="请输入备注" />
					</view>
				</view>
			</view>
			<view @click="choicePreson" style="width: 150upx;font-size: 24upx;height: 40upx;text-align: center;line-height: 40upx;border-radius: 12upx;margin: 30upx 0 30upx 30upx;background: #ff5060;color: white;">选择乘车人</view>
			<!-- <view @click="choiceStation">选择站点</view> -->
			<view class="ticket-content padd" v-if="infoFlag">
				<view class="ticket-header">
					基础信息
				</view>
				<view class="ticket-item">
					<view class="ticket-label">
						姓名：
					</view>
					<view class="ticket-inp">
						<input type="text" v-model="name" placeholder="请填写真实姓名" />
					</view>
				</view>
				<!-- <view class="ticket-item">
					<picker style="width: 92%;" mode="selector" @change="genderPickerChange" :range="genderList" range-key="name">
							<label style="color: #333333;font-size: 24upx;display: inline-block;width: 150upx;">性别：</label>
							<label style="color: #333333;font-size: 24upx;padding-left: 40upx;">{{genderList[genderL].name}}</label>
					</picker>
					<view class="ticket-icon">
						<image src="../../static/icon/more_gray.png" mode=""></image>
					</view>
				</view> -->
				<view class="ticket-item">
					<picker style="width: 92%;" mode="selector" @change="certificatesPickerChange" :range="certificatesList" range-key="name" :value="indexC">
							<label style="color: #333333;font-size: 24upx;display: inline-block;width: 150upx;">证件类型：</label>
							<label style="color: #333333;font-size: 24upx;padding-left: 40upx;">{{certificatesList[indexC].name}}</label>
					</picker>
					<view class="ticket-icon">
						<image src="../../static/icon/more_gray.png" mode=""></image>
					</view>
				</view>
				
				<view class="ticket-item">
					<view class="ticket-label">
						证件号码：
					</view>
					<view class="ticket-inp">
						<input type="text" v-model="certificates_number" placeholder="请输入证件号码" />
					</view>
				</view>
				<view class="ticket-item">
					<view class="ticket-label">
						联系电话：
					</view>
					<view class="ticket-inp">
						<input type="number" v-model="mobile" placeholder="请输入联系电话" @blur="getMnt" />
					</view>
				</view>
				<!-- <view class="ticket-item">
					<view class="ticket-label">
						12306账号：
					</view>
					<view class="ticket-inp">
						<input type="text" v-model="train_account_number" @blur="toMond" placeholder="请输入12306账号" />
					</view>
				</view>
				<view class="ticket-item">
					<view class="ticket-label">
						12306密码：
					</view>
					<view class="ticket-inp">
						<input type="text" v-model="train_password" placeholder="请输入12306密码" />
					</view>
				</view>
				<view class="ticket-item">
					<picker style="width: 92%;" mode="selector" @change="passengerPickerChange" :range="passengerList" range-key="name" :value="indexP">
							<label style="color: #333333;font-size: 24upx; display: inline-block;width: 150upx;">旅客类型：</label>
							<label style="color: #333333;font-size: 24upx;padding-left: 40upx;">{{passengerList[indexP].name}}</label>
					</picker>
					<view class="ticket-icon">
						<image src="../../static/icon/more_gray.png" mode=""></image>
					</view>
				</view> -->
				<view class="ticketfoB" v-if="passenger_discount_type>2">
					<view class="ticketfoBL">上传证件：</view>
					<view class="ticketfoBR" @click="uplaodImg" :style="{'border':imgInfo.preview_url?'none':'2upx solid #CCCCCC'}">
						<image :src="imgInfo.preview_url?imgInfo.preview_url:'../../static/user/uploadImg.png'" :style="{'width':imgInfo.preview_url?'100%':'38upx','height':imgInfo.preview_url?'100%':'38upx'}"></image>
					</view>
				</view>
				
				<checkbox-group @change="changeFlag">
					<view style="margin-top: 30upx;display: flex;align-items: center;">
						<label>
							<checkbox value="1" color="#ff5060" style="transform: scale(.7);" />
						</label>
						<view>购票前请先阅读并同意<text style="color: red;" @click="toProto">《购票协议》</text></view>
					</view>
				</checkbox-group>
				
				
			</view>
		</view>
		<view class="ticket-footer">
			<view class="ticket-footer-right" @click="btn_Submit">
				提交{{allMoney}}
			</view>
		</view>
		<view style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F3F3F3;z-index: -1;"></view>
		
		<view v-if="showModalStatus3">
			<view class="home-popup2" catchtouchmove="true" >
			 	<view class="home-box2">
			 		<image src="../../static/notvip_model.png" mode="widthFix"></image>
			 		<view class="memberT">
			 			1、“我的”-成为大会员-<text @click="buyNow">点击购买</text>。
			 		</view>
			 		<view class="memberB">
			 			2、“高奢名品”专区累计消费3000元即可。
			 		</view>
			 		<view style="position: absolute; top: 544upx; left: 112upx; width: 306upx; height: 88upx;" @click="toIndex"></view>
			 	</view>
			 	<view class="home-popup2-close" @click="box_close3">
			 		
			 	</view>
			 </view>
			 <view style="background: #000000 ; width: 750upx; height: 1600upx; z-index: 100; opacity: 0.6; position: absolute; top: 0; left: 0; right: 0; bottom: 0;"></view>
		</view>
	</view>
</template>

<script>
	import * as settingApi from '@/api/ticket/setting'
	import * as ticketApi from '@/api/ticket/index.js'
	import SelectRegion from '@/components/select-region/select-region'
	import { isMobile } from '@/utils/verify'
	import SimpleDateTimePicker from "../../components/time/index.vue";
	import {station,province} from "@/utils/station.js";
	import * as AddressApi from '@/api/ticket/address.js'
	import {detail} from "@/api/common.js";
	const App = getApp();
	export default {
		 components: {
		    SimpleDateTimePicker,
		  },
		data() {
			return {
				type:1,
				agreeFlag:false,
				disabled: false,
				commonL:{},
				addressInfo:{},
				allMoney:'',
				infoFlag:false,
				arrList:[
					{id:1,name:'飞机'},
					{id:2,name:'火车'},
					{id:3,name:'高铁'}
					],
				arrList1:[
					{id:1,name:'商务座'},
					{id:2,name:'一等座'},
					{id:3,name:'二等座'},
					{id:7,name:'无座'},
					{id:14,name:'特等座'},
					{id:11,name:'高级软卧'},
					{id:12,name:'动卧'}
					],
				arrList2:[
					{id:4,name:'硬座'},
					{id:5,name:'硬卧'},
					{id:6,name:'软卧'},
					{id:7,name:'无座'},
					{id:13,name:'软座'}
					],
				arrList3:[
					{id:8,name:'头等舱'},
					{id:9,name:'公务舱'},
					{id:10,name:'经济舱'}
					],
				indexL:0,
				indexL1:2,
				indexL2:0,
				indexL3:2,
				stay_word:"",
				genderList:[
					{id:1,name:'男'},
					{id:2,name:'女'}
					],
				genderL:0,
				certificatesList:[
					{id:1,name:'中国居民身份证'},
					{id:2,name:'护照'}
					],
				indexC:0,
				passengerList:[
					{id:1,name:'成人'},
					{id:2,name:'儿童'},
					{id:3,name:'学生'},
					// {id:4,name:'残疾人'},
					// {id:5,name:'军人'}
					],
				indexP:0,
				imgInfo:{},
				name:'',
				mobile:'',
				gender:1,
				certificates_type:1,
				certificates_number:'',
				train_number:'',
				starting_point:'',
				finishing_point:'',
				passenger_discount_type:1,
				primary_price:'',
				traffic_type:1,
				set_out_time: '请选择',
				birthday:'',
				seat_type:8,
				startTimes:"",
				stationData:{},
				startInfo:{},
				endInfo:{},
				startTimeNew:"",
				// train_account_number:"",
				train_password:"",
				info:{},
				showModalStatus3:false
			}
		},
		onLoad(options) {
			detail()
				.then(res=>{
					this.info = res.data.detail;
				})
			// 高铁1，火车2，飞机3
			this.type = options.type;
			
			if(this.type == 3){
				let year = new Date().getFullYear();
				let month = (new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1);
				let day = new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate();
				this.startTimes = year + "-" + month + "-" + day;
				this.indexL = 0;
			}else{
				this.stationData = uni.getStorageSync("stationData");
				let stationInfo = uni.getStorageSync("stationInfo");
				this.startInfo = stationInfo.start;
				this.endInfo = stationInfo.end;
				this.startTimeNew = stationInfo.time;
				let stationData = this.stationData;
				this.stationData.queryLeftNewDTO.swz_price = stationData.queryLeftNewDTO.swz_price > 0 ? (Number(stationData.queryLeftNewDTO.swz_price)/10).toFixed(1) : '--';
				this.stationData.queryLeftNewDTO.zy_price = stationData.queryLeftNewDTO.zy_price > 0 ? (Number(stationData.queryLeftNewDTO.zy_price).toFixed(1)/10) : '--';
				this.stationData.queryLeftNewDTO.ze_price = stationData.queryLeftNewDTO.ze_price > 0 ? (Number(stationData.queryLeftNewDTO.ze_price).toFixed(1)/10) : '--';
				this.stationData.queryLeftNewDTO.wz_price = stationData.queryLeftNewDTO.wz_price > 0 ? (Number(stationData.queryLeftNewDTO.wz_price).toFixed(1)/10) : '--';
				this.stationData.queryLeftNewDTO.yz_price = stationData.queryLeftNewDTO.yz_price > 0 ? (Number(stationData.queryLeftNewDTO.yz_price).toFixed(1)/10) : '--';
				this.stationData.queryLeftNewDTO.yw_price = stationData.queryLeftNewDTO.yw_price > 0 ? (Number(stationData.queryLeftNewDTO.yw_price).toFixed(1)/10) : '--';
				this.stationData.queryLeftNewDTO.rw_price = stationData.queryLeftNewDTO.rw_price > 0 ? (Number(stationData.queryLeftNewDTO.rw_price).toFixed(1)/10) : '--';
				if(this.type == 1){
					this.indexL = 2;
				}else if(this.type == 2){
					this.indexL = 1;
				}
				if(this.indexL == 0){
					this.seat_type = this.arrList3[this.indexL3].id;
				}else if(this.indexL == 1){
					this.seat_type = this.arrList2[this.indexL2].id;
				}else if(this.indexL == 2){
					this.seat_type = this.arrList1[this.indexL1].id;
				}
			}
			
			this.getTicket();
			this.getDefault()
		},
		onShow() {
			
		},
		computed: {
			
			startDate() {
				return this.getDates('start');
			},
			endDate() {
				return this.getDates('end');
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
		methods: {
			getDefault(){
				AddressApi.defaults()
					.then(res=>{
						//console.log(res)
						if(res.data.detail){
							this.infoFlag = true;
							let detail = res.data.detail;
							this.name = detail.name
							this.mobile = detail.mobile
							// this.train_account_number = detail.train_account_number
							// this.train_password = detail.train_password
							this.certificates_number = detail.certificates_number
							this.certificates_type = detail.certificates_type;
							this.passenger_discount_type = detail.passenger_discount_type;
							this.imgInfo = detail.image;
							this.indexC = Number(detail.certificates_type) - 1;
							this.indexP = Number(detail.passenger_discount_type) - 1;
							if(detail.passenger_discount_type == 3){
								uni.showModal({
									showCancel:false,
									content:"输入学生票价后再打9折",
									title:"提示",
									success(res) {
										//console.log(res)
									}
								})
							}
						}
					})
			},
			showToast(){
				if(this.passenger_discount_type == 3){
					uni.showModal({
						showCancel:false,
						content:"输入学生票价后再打9折",
						title:"提示",
						success(res) {
							//console.log(res)
						}
					})
				}
			},
			choiceStation(){
				this.$navTo("pages/ticket/sreach/sreach")
			},
			choicePreson(){
				this.$navTo("pages/passengerManagement/index")
			},
			toProto(){
				this.$navTo("pages/ticket/detail/detail")
			},
			changeFlag(e){
				//console.log(e)
				if(e.detail.value.length>0){
					this.agreeFlag = true;
				}else{
					this.agreeFlag = false;
				}
			},
			getTicket(){
				const app = this
				settingApi.detail()
				.then(result => {
					app.commonL = result.data.detail
				})
			},
			getMnt(){
				if(isMobile(this.mobile)==false){
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					});
					return;
				}
			},
			getMoeny(){
				if(this.primary_price>0){
					this.allMoney=(this.primary_price*Number((this.commonL.ticket_discount)/100)).toFixed(2)
					//console.log(this.allMoney)
				}
			},
			openDatetimePicker() {
			      this.$refs.myPicker.show();
			    },
			
			// 关闭picker
			closeDatetimePicker() {
			  this.$refs.myPicker.hide();
			},
		
			handleSubmit(e) {
			  // {year: "2019", month: "07", day: "17", hour: "15", minute: "21"}
			  //console.log(e);
			  // this.set_out_time=`${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			  this.set_out_time=e.detail.value;
			},
			bindDateChange: function(e) {
				this.set_out_time = e.target.value;
				//console.log(this.set_out_time)
			},
			 getDates(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					year = year;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			bindPickerChange: function(e) {		//改变的事件名
				////console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
				this.indexL = e.target.value			//将数组改变索引赋给定义的index变量
				this.traffic_type=this.arrList[this.indexL].id		//将array【改变索引】的值赋给定义的jg变量
				this.indexL1 = 2;
				this.indexL2 = 0;
				this.indexL3 = 2;
				if(this.indexL == 0){
					this.seat_type = this.arrList3[this.indexL3].id;
				}else if(this.indexL == 1){
					this.seat_type = this.arrList2[this.indexL2].id;
				}else if(this.indexL == 2){
					this.seat_type = this.arrList1[this.indexL1].id;
				}
			//	//console.log("籍贯为：",this.jg)		//输出获取的籍贯值，例如：中国
			},
			bindPickerChange1: function(e) {		//改变的事件名
				////console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
				this.indexL1 = e.target.value			//将数组改变索引赋给定义的index变量
				this.seat_type=this.arrList1[this.indexL1].id		//将array【改变索引】的值赋给定义的jg变量
			//	//console.log("籍贯为：",this.jg)		//输出获取的籍贯值，例如：中国
			},
			bindPickerChange2: function(e) {		//改变的事件名
				////console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
				this.indexL2 = e.target.value			//将数组改变索引赋给定义的index变量
				this.seat_type=this.arrList2[this.indexL2].id		//将array【改变索引】的值赋给定义的jg变量
				if(this.arrList2[this.indexL2].id == 5 || this.arrList2[this.indexL2].id == 6){
					uni.showModal({
						showCancel:false,
						content:"卧铺暂按下铺价付款，抢票成功后按实际票价退还差价",
						title:"提示",
						success(res) {
							//console.log(res)
						}
					})
				}
			//	//console.log("籍贯为：",this.jg)		//输出获取的籍贯值，例如：中国
			},
			bindPickerChange3: function(e) {		//改变的事件名
				////console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
				this.indexL3 = e.target.value			//将数组改变索引赋给定义的index变量
				this.seat_type=this.arrList3[this.indexL3].id		//将array【改变索引】的值赋给定义的jg变量
			//	//console.log("籍贯为：",this.jg)		//输出获取的籍贯值，例如：中国
			},
			//性别
			genderPickerChange: function(e) {
				this.genderL = e.target.value
				this.gender=this.genderList[this.genderL].id	
			},
			//证件类型
			certificatesPickerChange: function(e) {		//改变的事件名
				////console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
				this.indexC = e.target.value			//将数组改变索引赋给定义的index变量
				this.certificates_type = this.certificatesList[this.indexC].id		//将array【改变索引】的值赋给定义的jg变量
			//	//console.log("籍贯为：",this.jg)		//输出获取的籍贯值，例如：中国
			},
			//旅客类型
			passengerPickerChange: function(e) {		//改变的事件名
				////console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
				//console.log(e)
				this.indexP = e.target.value			//将数组改变索引赋给定义的index变量
				this.passenger_discount_type=this.passengerList[this.indexP].id		//将array【改变索引】的值赋给定义的jg变量
				if(this.passengerList[this.indexP].id == 3){
					uni.showModal({
						showCancel:false,
						content:"学生票原价处请填写学生票价格",
						title:"提示",
						success(res) {
							//console.log(res)
						}
					})
				}
			//	//console.log("籍贯为：",this.jg)		//输出获取的籍贯值，例如：中国
			},
			uplaodImg(){
				let _this = this;
				uni.chooseImage({
					count:1,
					success:res=>{
						uni.uploadFile({
							url:App.globalData.uploadBaseUrl + "api/upload/image",
							filePath:res.tempFilePaths[0],
							header:{
								'Access-Token':_this.$store.getters.token
							},
							name:"file",
							success: (rep) => {
								//console.log(rep);
								let data = JSON.parse(rep.data);
								_this.imgInfo = data.data.fileInfo;
							}
						})
					}
				})
			},
			toMond(){
				let _this = this;
				uni.showModal({
					content:`${_this.info.ticket_tips1}`,
					success(res) {
						// if(res.confirm){
						// 	_this.btn_Submit()
						// }
					}
				})
			},
			btn_Submit(){
				// this.navToMyOrder()
				// return false;
				if(!this.agreeFlag){
					uni.showToast({
						icon:'none',
						title:'请先阅读购票协议',
						duration:2000
					})
					return false;
				}
				let obj = {};
				obj.name = this.name;
				obj.mobile = this.mobile;
				obj.certificates_type = this.certificates_type;
				obj.certificates_number = this.certificates_number;
				if(this.passenger_discount_type>2){
					if(!this.imgInfo.file_id){
						uni.showToast({
							icon:'none',
							title:'请上传对应证件',
							duration:2000
						})
						return false;
					}
					obj.image_id = this.imgInfo.file_id;
				}
				if(this.stay_word){
					obj.stay_word = this.stay_word;
				}
				obj.primary_price = this.primary_price;
				obj.price = this.price;
				// obj.train_account_number=this.train_account_number;
				obj.train_password=this.train_password;
				// if(!this.train_account_number){
				// 	let _this = this;
				// 	uni.showModal({
				// 		content:`${_this.info.ticket_tips1}`,
				// 		success(res) {
				// 			// if(res.confirm){
				// 			// 	_this.btn_Submit()
				// 			// }
				// 		}
				// 	})
				// }
				// if(!this.train_password){
				// 	let _this = this;
				// 	uni.showModal({
				// 		content:`${_this.info.ticket_tips1}`,
				// 		success(res) {
				// 			// if(res.confirm){
				// 			// 	_this.btn_Submit()
				// 			// }
				// 		}
				// 	})
				// }
				obj.passenger_discount_type = this.passenger_discount_type;
				obj.seat_type = this.seat_type;
				if(this.type == 3){
					obj.traffic_type = 1;
					
					obj.starting_point = this.starting_point;
					obj.finishing_point = this.finishing_point;
					obj.train_number = this.train_number;
					obj.set_out_time = Math.floor(new Date(this.set_out_time).getTime()/1000);
				}else{
					if(this.type == 2){
						obj.traffic_type = 2;
					}else if(this.type == 1){
						obj.traffic_type = 3;
					}
					obj.starting_point = this.stationData.queryLeftNewDTO.from_station_name;
					obj.finishing_point = this.stationData.queryLeftNewDTO.to_station_name;
					obj.train_number = this.stationData.queryLeftNewDTO.station_train_code;
					obj.set_out_time = Math.floor(new Date((this.startTimeNew.replace(/-/g,"/") + " " + this.stationData.queryLeftNewDTO.start_time)).getTime()/1000);
				}
				ticketApi.add(obj)
					.then(res=>{
						//console.log(res)
						uni.showToast({
							icon:'none',
							title:'下单成功',
							duration:2000
						})
						this.navToMyOrder(res.data.order_id);
					})
					// .catch(err=>{
					// 	uni.showToast({
					// 		icon:'none',
					// 		title:err.message,
					// 		duration:2000
					// 	})
					// 	this.showModalStatus3 = true
					// })
					this.showModalStatus3 = true
			},
			navToMyOrder(order_id) {
			  setTimeout(() => {
			    this.$navTo('pages/cashier/rechargeTicket',{order_id})
			  }, 1000)
			},
			buyNow(){
					uni.navigateTo({
						url:'../../pageMember/pages/index/report'
					})
			},
			toIndex(){
					 // uni.redirectTo({
					 // 	url:'../../pageMember/pages/index/index'
					 // })
					 this.showModalStatus3 = false
			}
		}
	}
</script>

<style scoped>
.ticket-main{
	padding-bottom: 120upx;
}
.ticket-content{
	background-color: #FFFFFF;
	padding: 0 30upx;
	margin-top: 16upx;
}
.padd{
	padding-bottom: 20upx;
}
.ticket-header{
	font-size: 28upx;
	color: #333333;
	font-weight: bold;
	padding: 20upx 0;
	border-bottom:2upx solid #EFEFEF;
}
.ticket .ticket-item{
	display: flex;
	padding: 20upx 0;
	border-bottom:2upx solid #EFEFEF;
}

.ticket .ticket-label{
	font-size: 24upx;
	width: 150upx;
	line-height: 44upx;
}
.ticket .ticket-inp{
	font-size: 24upx;
	color: #333333;
	line-height: 44upx;
	width: 430upx;
	padding-left: 40upx;
}
.ticket .ticket-inp input{
	font-size: 24upx;
}
.ticket-icon{
	width: 14upx;
	height: 25upx;
	margin-left: 40upx;
	margin-top: 10upx;
}
.ticket-icon>image{
	width: 100%;
	height: 100%;
	vertical-align: top;
}
/* #ifdef MP-WEIXIN */
.ticket-footer{
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 100upx;
	display: flex;
	z-index: 99;
}
/* #endif */
/* #ifdef APP-NVUE */
.ticket-footer{
	position: fixed;
	left: 0;
	bottom: 100upx;
	width: 100%;
	height: 100upx;
	z-index: 99;
}
/* #endif */

.ticket-footer-right{
	width: 100%;
	height: 100upx;
	font-size: 24upx;
	text-align: center;
	line-height: 100upx;
	background-color: #ff5060;
	color: #FFFFFF;
}

	.ticketfoT>view:nth-child(1),.ticketfoB>view:nth-child(1){
		width: 180upx;
		font-size: 28upx;
		line-height: 110upx;
		color: #333333;
	}
	.ticketfoT>input{
		width: calc(100% - 180upx);
		height: 60upx;
		box-sizing: border-box;
		border: 2upx solid #C0C0C0;
		background: white;
		border-radius: 12upx;
		font-size: 28upx;
		padding: 0 16upx;
		outline: none;
	}
	.ticketfoB{
		width: 100%;
		display: flex;
		margin-top: 30upx;
	}
	.ticketfoBL{
		
	}
	.ticketfoBR{
		width: 120upx;
		height: 120upx;
		box-sizing: border-box;
		border: 2upx solid #CCCCCC;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6upx;
		background: white;
	}
	.ticketfoBR>image{
		width: 38upx;
		height: 38upx;
	}
	.home-popup2 {
			width: 528upx;
			height: 728upx;
			position: fixed;
			top: 20%;
			left: 14%;
			// transform: translate(-50%,-50%);
			z-index: 2000;
		}
		
		.home-box2 {
			width: 100%;
			height: 636upx;
			position: relative;
			top: 0;
			left: 0;
		}
		.home-box2>image{
			width: 100%;
			height: 100%;
		}
		.home-popup2-close {
			width: 48upx;
			height: 48upx;
			margin: 20upx auto 0;
		}
		
		.home-popup2-close>image {
			width: 100%;
			height: 100%;
			vertical-align: top;
		}
		.memberT{
			width: 396upx;
			position: absolute;
			top: 310upx;
			left: 70upx;
			font-size: 24upx;
			color: #4F2A03;
			/* text-align: center; */
			margin: 0 auto;
		}
		.memberT>text{
			color: #F86F07;
		}
		.memberB{
			width: 396upx;
			position: absolute;
			top: 354upx;
			left: 70upx;
			font-size: 24upx;
			color: #4F2A03;
			// text-align: center;
			margin: 0 auto;
		}
</style>
