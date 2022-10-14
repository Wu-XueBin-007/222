<template>
	<view class="container" :style="{'box-sizing': 'border-box'}">
		<!-- <view @click="choicePhone">测试通讯录</view> -->
		<!-- 店铺页面组件 -->
		<!-- <Page :items="items" /> -->
		<!-- <view class="subject" :style="{'height': 210+navInfo.navH+'px','padding-top': navInfo.navH+'px','background-image': 'url(../../static/home/home_bj.png)'}"> -->
		<view class="header" :style="{'height': navInfo.navH+'px','padding-top':navInfo.paddingTop+'px'}">
			<!-- #ifdef MP-WEIXIN -->
			<view class="heads2">
				<view class="heads2-left">
					<image src="../../static/home/icon_home.png"></image>
					<text>融汇链生活</text>
				</view>
				<view class="heads2-right" @click="btn_invitation">
					<image src="../../static/home/icon_code.png" mode=""></image>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef !MP-WEIXIN -->
			<view class="heads2" style="width: 100%;">
				<view class="heads2-left">
					<image src="../../static/home/icon_home.png"></image>
					<text>融汇链生活</text>
				</view>
				<view class="heads2-right" @click="btn_invitation">
					<image src="../../static/home/icon_code.png" mode=""></image>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<view class="subject" :style="{'padding-top': navInfo.navH-10+'px'}">
			<!-- <view class="subject-img" :style="{'height': 210+navInfo.navH+'px'}" @click="toMyCollage">
				<image src="../../static/home/home_bj.png" mode=""></image>
			</view> -->
			<!-- <view class="heads" :style="{'height': navInfo.navH+'px','padding-top': navInfo.paddingTop+'px'}">
				
			</view> -->
			<!-- <view class="heads2">
				<image src="../../static/home/logo.png"></image>
				<text>融汇商城</text>
			</view> -->
			<!-- <view class="heads2">
				<view class="heads2-left">
					<image src="../../static/home/icon_home.png"></image>
					<text>融汇链生活</text>
				</view>
				<view class="heads2-right" @click="btn_invitation">
					<image src="../../static/home/icon_code.png" mode=""></image>
				</view>
			</view> -->
			<view class="home-header">
				<!-- <view class="home-header-icon">
					<image :src="setting.logoImage.preview_url" mode="" v-if="setting.logoImage"></image>
				</view> -->
				<view class="home-header-inp">
					<!-- <input type="text" placeholder="搜索产品" @click="handleSearch" style="height: ;" /> -->
					<view @click="handleSearch">
						融汇链生活
					</view>
					<image src="../../static/sreach.png" mode=""></image>
				</view>
			</view>
			<!-- 分类 -->
			<view class="" style="position: relative;margin-top: 20upx;">
				<scroll-view scroll-x="true"
					style="display: flex;white-space: nowrap;width: 84%;height: 80upx;margin: 0 0 0 12upx;box-sizing: border-box;overflow: scroll;">
					<view class="district-item2" v-for="(item,index) in classList" :key="index"
						@click="onTargetGoodsLists(item.category_id)">
						<view :class="['district-text',index==0?'active':'']">{{item.name}}</view>
					</view>

				</scroll-view>
				<view class="classification-conter">

				</view>
				<view class="classification" @click="getClass">
					<image src="../../static/icon/icon_fl.png" mode=""></image>
					<text>分类</text>
				</view>
			</view>

		</view>
		<view class="newMain">
			<!-- 轮播图 -->
			<view class="home-lunb">
				<swiper class="swiper" indicator-dots="false" indicator-active-color="#ff5060" indicator-color="#FFFFFF"
					autoplay="true" interval="3000" duration="500">
					<swiper-item v-for="(item,index) in imgList" :key="index">
						<image :src="item.image" :data-url="item.url" @click="btn_tourl"></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- 轮播图 end-->
			<!-- 金刚区 -->
			<view class="home-point">
				<view class="point-item" v-if="commonL.lucky_free_activity_switch==1" @click="btn_give">
					<view class="point-img">
						<image src="../../static/home/give.png"></image>
					</view>
					<view class="point-text">幸运免单</view>
				</view>
				<view class="point-item" @click="btn_collage">
					<view class="point-img">
						<image src="../../static/home/collage.png"></image>
					</view>
					<view class="point-text">幸运拼团</view>
				</view>
				<view class="point-item" @click="btn_seckill">
					<view class="point-img">
						<image src="../../static/home/seckill.png"></image>
					</view>
					<view class="point-text">秒杀专区</view>
				</view>
				<view class="point-item" v-if="commonL.luxury_goods_switch==1" @click="btn_LuxuryGoods">
					<view class="point-img">
						<image src="../../static/home/LuxuryGoods.png"></image>
					</view>
					<view class="point-text">高奢名品</view>
				</view>


				<view class="point-item" v-if="commonL.blindbox_switch==1" @click="btn_blindbox">
					<view class="point-img">
						<image src="../../static/home/blindbox.png"></image>
					</view>
					<view class="point-text">盲盒</view>
				</view>
				<view class="point-item" v-if="commonL.advert_switch==1" @click="btn_advertisement">
					<view class="point-img">
						<image src="../../static/home/advertisement.png"></image>
					</view>
					<view class="point-text">广告专区</view>
				</view>
				<view class="point-item" @click="btn_groupBuying">
					<view class="point-img">
						<image src="../../static/home/groupBuying.png"></image>
					</view>
					<view class="point-text">团购专区</view>
				</view>
				<view class="point-item" @click="btn_shoppingGuide">
					<view class="point-img">
						<image src="../../static/home/shoppingGuide.png"></image>
					</view>
					<view class="point-text">导购专区</view>
				</view>

				<view class="point-item" v-if="bigVip.big_vip_switch==1" @click="btn_bigber">
					<view class="point-img">
						<image src="../../static/home/bigber.png"></image>
					</view>
					<view class="point-text">会员专区</view>
				</view>
				<view class="point-item" @click="btn_brand">
					<view class="point-img">
						<image src="../../static/home/brand.png"></image>
					</view>
					<view class="point-text">国有品牌</view>
				</view>
				<!-- <view class="point-item" @click="btn_welfare">
					<view class="point-img">
						<image src="../../static/home/welfare.png"></image>
					</view>
					<view class="point-text">免费试用</view>
				</view> -->

				<view class="point-item" @click="btn_boutique">
					<view class="point-img">
						<image src="../../static/home/boutique.png"></image>
					</view>
					<view class="point-text">大牌专区</view>
				</view>
				<!-- <swiper class="swiper6" indicator-dots="false" indicator-active-color="#ff5060" indicator-color="#FFFFFF"
					autoplay="true" interval="3000" duration="500">
					<swiper-item>
						<view class="point-item" @click="btn_groupBuying">
							<view class="point-img">
								<image src="../../static/home/groupBuying.png"></image>
							</view>
							<view class="point-text">团购专区</view>
						</view>
						<view class="point-item" v-if="commonL.lucky_free_activity_switch==1" @click="btn_give">
							<view class="point-img">
								<image src="../../static/home/give.png"></image>
							</view>
							<view class="point-text">幸运免单</view>
						</view>
						<view class="point-item" v-if="commonL.blindbox_switch==1" @click="btn_blindbox">
							<view class="point-img">
								<image src="../../static/home/blindbox.png"></image>
							</view>
							<view class="point-text">盲盒</view>
						</view>
						<view class="point-item" @click="btn_collage">
							<view class="point-img">
								<image src="../../static/home/collage.png"></image>
							</view>
							<view class="point-text">幸运拼团</view>
						</view>
						<view class="point-item" @click="btn_shoppingGuide">
							<view class="point-img">
								<image src="../../static/home/shoppingGuide.png"></image>
							</view>
							<view class="point-text">导购专区</view>
						</view>
						<view class="point-item" v-if="commonL.advert_switch==1" @click="btn_advertisement">
							<view class="point-img">
								<image src="../../static/home/advertisement.png"></image>
							</view>
							<view class="point-text">广告专区</view>
						</view>
						<view class="point-item" @click="btn_seckill">
							<view class="point-img">
								<image src="../../static/home/seckill.png"></image>
							</view>
							<view class="point-text">秒杀专区</view>
						</view>
						<view class="point-item" @click="btn_brand">
							<view class="point-img">
								<image src="../../static/home/brand.png"></image>
							</view>
							<view class="point-text">国有品牌</view>
						</view>
						<view class="point-item" @click="btn_welfare">
							<view class="point-img">
								<image src="../../static/home/welfare.png"></image>
							</view>
							<view class="point-text">免费试用</view>
						</view>
						<view class="point-item" @click="btn_boutique">
							<view class="point-img">
								<image src="../../static/home/boutique.png"></image>
							</view>
							<view class="point-text">大牌专区</view>
						</view>
					</swiper-item>
					
				</swiper> -->


			</view>
			<!-- 金刚区 end-->
		</view>


		<!-- <swiper :indicator-dots="false" :autoplay="false" class="cateBox" :style="{'height':(classList1.length>0&&classList1[0].length>4) ? '336rpx' : '190rpx'}">
			<swiper-item v-for="(item,index) in classList1" :key="index" class="cateWrap">
				<view class="swiper-item cateItems" v-for="(pitem,pindex) in item" :key="pindex" @click="onTargetGoodsLists(pitem.category_id)">
					<image :src="pitem.image.preview_url"></image>
					<text>{{pitem.name}}</text>
				</view>
			</swiper-item>
		</swiper> -->


		<!-- 轮播图 -->
		<!-- <view class="home-lunb2">
			<swiper class="swiper2" indicator-dots="false" indicator-active-color="#d7b262" indicator-color="#FFFFFF"
				autoplay="true" interval="3000" vertical="true" duration="500">
				<swiper-item v-for="(item,index) in imgList" :key="index">
					<image :src="item.image" :data-url="item.url" @click="btn_tourl"></image>
				</swiper-item>
			</swiper>
		</view> -->

		<!-- 通证信息 -->
		<view class="pass">
			<view class="passL">
				<view class="passMessageL">
					<image src="../../static/home/pass.png"></image>
				</view>
				<view class="passMessageR">
					<!-- {{passMessage.name}} -->
					BLCXF
				</view>
				<view class="passData" v-if="passMessage.token_price">
					￥{{passMessage.token_price}}
				</view>
				<view v-else style="margin-left: 20rpx; margin-top: 16rpx;font-size: 24rpx;">￥--</view>
				<!-- <view class="passData" v-if="showPass">
					￥{{passMessage.token_price}}
				</view> -->
			</view>
			<view class="passR" v-if="passMessage.token_increase">
				+{{passMessage.token_increase}}
			</view>
		</view>
		<!-- 通证信息 end -->

		<!-- 购票入口 -->
		<view class="addCon" v-if="commonL.ticketImage&&commonL.MobileRechargeImage">
			<view class="ticket" v-if="commonL.is_open_ticket&&commonL.if_switch">
				<view class="ticket-left" @click="getTicket">

					<view class="ticket-img">
						<image :src="commonL.ticketImage.preview_url" mode=""></image>
					</view>
					<!-- <view class="ticket-conter">
						<view class="ticket-conterT">
							出行购票
							<view class="ticket-label">
								9折
							</view>
						</view>
						<view class="ticket-conterB">
							高铁票火车票
						</view>
					</view> -->
				</view>
				<view class="ticket-right" @click="toPrepaid">
					<view class="ticket-img">
						<image :src="commonL.MobileRechargeImage.preview_url" mode=""></image>
					</view>
					<!-- <view class="ticket-conter">
						<view class="ticket-conterT">
							话费购买
							<view class="ticket-label">
								9折
							</view>
						</view>
						<view class="ticket-conterB">
							全网在线冲 秒到账
						</view>
					</view> -->
				</view>
			</view>

		</view>
		<!-- 秒杀 -->
		<view class="home-seckill" @click="btn_seckill" v-if="seckillGoodsBanner.length>0">
			<view class="seckill-header">
				<view class="seckill-headerL" style="display: flex;align-items: center;">
					<image src="../../static/icon/seckill.png" mode=""></image>
				</view>
				<view class="seckillMore">查看更多 <image src="../../static/icon/icon_right.png" mode=""></image>
				</view>
			</view>
			<view class="seckillConWrap">
				<scroll-view scroll-x="true"
					style="display: flex;white-space: nowrap;width: 100%;box-sizing: border-box;overflow: scroll;">
					<view class="seckillCon">
						<view class="seckillItem" v-for="(pitem,pindex) in seckillGoodsBanner" :key="pindex"
							v-if="pitem.seckill_price!=null">
							<view class="seckillItemT"
								:style="{'background-image': 'url('+pitem.images[0].file.preview_url+')'}"></view>
							<view class="seckillItemB">
								<view class="seckillItemBT">￥{{pitem.seckill_price}}</view>
								<view class="seckillItemBB">￥{{pitem.goods_price_min}}</view>
							</view>
						</view>
					</view>
					<!-- <swiper :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" :circular="true" style="height: 244rpx;" @change="changeSecKill">
						<swiper-item class="seckillCon" v-for="(item,index) in seckillGoodsBanner" :key="index">
							<view class="seckillItem" v-for="(pitem,pindex) in item" :key="pindex">
								<view class="seckillItemT" :style="{'background-image': 'url('+pitem.images[0].file.preview_url+')'}"></view>
								<view class="seckillItemB">
									<view class="seckillItemBT">￥{{pitem.seckill_price}}</view>
									<view class="seckillItemBB">￥{{pitem.goods_price_min}}</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<view class="indoctor">
						<view :class="['indoctorItem',secIndex==index?'indoctorItemActive':'']" v-for="(item,index) in seckillGoodsBanner" :key="index"></view>
					</view> -->
				</scroll-view>
			</view>
		</view>
		<!-- 秒杀 end-->
		<!-- <view class="home-district">
			<view class="home-district-header">
				<view class="home-district-left">
					<view class="home-district-colour">
						<view class="home-district-color1"></view>
						<view class="home-district-color2"></view>
					</view>
					<view class="home-district-text1">
						融汇资讯
					</view>
				</view>
				<view class="home-district-right" @click="toNoticeList">
					<view class="home-district-text3">
						查看更多
					</view>
					<view class="home-district-icon">
						<image src="../../static/home/icon_right.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="noticeCon">
				<view class="noticeItem" v-for="(item,index) in articleList" :key="index" v-if="index<3"
					@click="onTargetDetail(item.article_id)">
					<view>{{item.title}}</view>
					<image src="../../static/icon/left.png"></image>
				</view>
			</view>
		</view> -->


		<!-- 公告 -->
		<!-- <view class="homepage-lantern">
			<view class="homepage-lantern-icon1">
				<image src="../../static/home/icon_notice.png"></image>
			</view>
			<swiper class="swiper4" vertical="true" indicator-active-color="#d7b262" indicator-color="#FFFFFF"
				autoplay="true" interval="3000" duration="500">

				<swiper-item v-for="(item,index) in articleList" :key="index">
					<text class="homepage-lantern-text" @click="onTargetDetail(item.article_id)">{{item.title}}</text>
				</swiper-item>
			</swiper>
			<view class="homepage-lantern-icon2" @click="toNoticeList">
				<image src="../../static/icon/icon_right.png"></image>
			</view>
		</view> -->
		<view class="adverImg" v-if="setting.ActivityTopicsImageId">
			<image :src="setting.ActivityTopicsImageId.preview_url" :data-url="setting.activity_topics_url"
				@click="btn_tourl"></image>
		</view>
		<!-- 特价 -->
		<!-- <view class="home-district">
			<view class="home-district-header">
				<view class="home-district-left">
					<view class="home-district-colour">
						<view class="home-district-color1"></view>
						<view class="home-district-color2"></view>
					</view>
					<view class="home-district-text1">
						限时特价
					</view>
					<view class="home-district-text2">
						好价尝鲜
					</view>
				</view>
				<view class="home-district-right" @click="toList" data-type="special">
					<view class="home-district-text3">
						查看更多
					</view>
					<view class="home-district-icon">
						<image src="../../static/home/icon_right.png" mode=""></image>
					</view>
				</view>
			</view>

			<view class="home-district-item">
				<view class="home-district-list" v-for="(item,index) in TgoodsList" :key="index" v-if="index<3"
					:data-id="item.goods_id" @click="onTargetGoodsList">
					<view class="home-district-img">
						<image :src="item.goods_image" mode=""></image>
					</view>
					<view class="home-district-text4">
						{{item.goods_name}}
					</view>
					<view class="home-list-b">
						<view class="home-list-b-left">
							<view>￥{{item.goods_price_min}}</view>
						</view>
						<view class="home-list-b-right">
							￥{{item.line_price_min}}
						</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- 热门商品 -->
		<!-- <view class="home-district">
			<view class="home-district-header">
				<view class="home-district-left">
					<view class="home-district-colour">
						<view class="home-district-color1"></view>
						<view class="home-district-color2"></view>
					</view>
					<view class="home-district-text1">
						热门商品
					</view>
					<view class="home-district-text2">
						好价尝鲜
					</view>
				</view>
				<view class="home-district-right" @click="toList" data-type="hot">
					<view class="home-district-text3">
						查看更多
					</view>
					<view class="home-district-icon">
						<image src="../../static/home/icon_right.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="home-district-item">
				<view class="home-district-list" v-for="(item,index) in RgoodsList" :key="index" v-if="index<3"
					:data-id="item.goods_id" @click="onTargetGoodsList">
					<view class="home-district-img">
						<image :src="item.goods_image" mode=""></image>
					</view>
					<view class="home-district-text4">
						{{item.goods_name}}
					</view>
					<view class="home-list-bb">
						<view class="home-list-bb-left">
							￥{{item.goods_price_min}}
						</view>
					</view>
				</view>
			</view>
		</view> -->


		<!-- 首页推荐 -->
		<view class="home-recommend">
			<!-- <view class="recommend-header">
				<image src="../../static/icon/icon_rx.png" mode=""></image>
				<text>热销精选</text>
			</view> -->
			<!-- <view class="recommend-bjt"></view> -->
			<!-- <view class="recommend-content">
				<view class="recommend-item" v-for="(item,index) in JgoodsList" :key="index" :data-id="item.goods_id"
					@click="onTargetGoodsList">
					<view class="recommend-img">
						<image :src="item.goods_image" mode=""></image>
					</view>
					<view class="recommend-main">
						<view class="recommend-title1">
							{{item.goods_name}}
						</view>
						<view class="recommend-title2">
							<view class="recommend-text1">
								￥<text>{{item.goods_price_min}}</text>
							</view>
							<view class="recommend-texts" v-if="item.line_price_min>0">
								￥<text>{{item.line_price_min}}</text>
							</view>
							<view class="recommend-title3">已售{{item.goods_sales}}件</view>
						</view>
						
					</view>
				</view>
				
			</view> -->
			<zero-waterfall :list="JgoodsList" v-if="JgoodsList.length>0">
				<!--  #ifdef  MP-WEIXIN -->
				<view v-for="(item, index) of JgoodsList" :key="index" slot="slot{{item.goods_id}}">
					<view class="cnt">
						<view class="text">{{ item.extra }}</view>
					</view>
				</view>
				<!--  #endif -->

				<!-- #ifndef  MP-WEIXIN -->
				<template v-slot:default="item">
					<view class="cnt">
						<view class="text">{{ item.extra }}</view>
					</view>
				</template>
				<!-- #endif -->
			</zero-waterfall>
			<uni-load-more bg-color="rgb(240, 240, 240)" :status="loadStatus" @clickLoadMore='loadMore'></uni-load-more>

		</view>
		<!--弹出框  -->
		<view class="home-popup" v-if="showModalStatus&&false" catchtouchmove="true">
			<view class="home-box">
				<view class="home-box-t">
					<view class="home-box-text1">
						本周积分活动签到
					</view>
					<view class="home-box-text2">
						每周一重置
					</view>
				</view>
				<view class="home-box-c">
					<view class="home-box-item" v-for="(item,index) in signArr" :key="index">
						<view :class="[item.flag?'home-box-list':'home-box-list2']">
							<view :class="[item.flag?'home-box-tt':'home-box-tt2']">
								{{item.value}}积分
							</view>
							<view :class="[item.flag?'home-box-bb':'home-box-bb2']"></view>
						</view>
						<view class="home-box-text3">
							{{item.name}}
						</view>
					</view>

				</view>
				<view class="home-box-b" @click="signin">
					签到
				</view>
			</view>
			<view class="home-popup-close" @click="box_close">
				<image src="../../static/home/icon_close.png" mode=""></image>
			</view>
		</view>

		<view v-if="showModalStatus&&false"
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: rgba(0,0,0,.5);z-index: 999;"
			catchtouchmove="true"></view>
		<!-- 充值卡 -->
		<!--弹出框  -->
		<view class="home-popup2" v-if="showModalStatus3" catchtouchmove="true">
			<view class="home-box2" @click="getLq">
				<image src="https://oss.gzrhhj.com/10001/d0708c2f6b61dafdde1e934033ec7bf.png" mode="widthFix"></image>
			</view>
			<view class="home-popup2-close" @click="box_close3">
				<image src="../../static/home/icon_close.png" mode=""></image>
			</view>
		</view>

		<view v-if="showModalStatus3"
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: rgba(0,0,0,.5);z-index: 999;"
			catchtouchmove="true"></view>
		<!-- 充值卡 end-->
		<!--弹出框  -->
		<view class="popup-kf" v-if="showModalStatus2" catchtouchmove="true">
			<view class="popup-kf-img">
				<image :src="setting.CustomerServiceImage.preview_url" mode=""></image>
			</view>
		</view>

		<view v-if="showModalStatus2"
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: rgba(0,0,0,.5);z-index: 999;"
			catchtouchmove="true" @click="btn_cose"></view>

		<!-- #ifdef MP-WEIXIN -->
		<button open-type="contact" style="opacity: 1;">
			<view class="home-kf">
				<image src="../../static/home/icon_kfb.png" mode=""></image>
			</view>
		</button>
		<!-- #endif -->
		<!-- <button @click="but_kf">
			<view class="home-kf">
				<image src="../../static/home/icon_kfb.png" mode=""></image>
			</view>
		</button> -->
		<view class="home-returnTop" v-if="back" @click="btn_top">
			<image src="../../static/home/icon_top.png" mode=""></image>
		</view>

	</view>
</template>

<script>
	import {
		setCartTabBadge
	} from '@/utils/app'
	import * as Api from '@/api/page'
	import Page from '@/components/page'
	import * as Rapi from '@/api/home/rotation'
	import * as SigninApi from '@/api/home/signin'
	import * as goodsApi from '@/api/goods'
	import * as articleApi from "@/api/article/index.js"
	import * as CategoryApi from '@/api/category'
	import * as settingApi from '@/api/ticket/setting'
	import * as teledcardApi from '@/api/teledcard/index.js'
	import * as seckillApi from '@/api/seckill/seckill.js'
	import {
		detail,
		blockChina
	} from "@/api/common.js"
	import store from '@/store'
	import {
		nativeCommon
	} from '@/utils/phone.js' //获取手机通讯录
	// const App = getApp()
	const App = getApp()
	let timer2 = null;
	export default {
		components: {
			Page
		},
		data() {
			return {
				secIndex: 0,
				imgList: {},
				Imgurl: '',
				notice_click_lst: {},
				// 页面参数
				options: {},
				// 页面属性
				page: {},
				navInfo: {
					leftDistance: 0,
					lineHeight: 0,
					navH: 0,
					paddingTop: 0
				},
				// 页面元素
				items: [],
				showModalStatus: false,
				showModalStatus2: false,
				showModalStatus3: false,
				// 系统设置
				setting: {},
				//特价商品
				TgoodsList: {},
				//热门商品
				RgoodsList: {},
				//精选商品
				JgoodsList: {},
				rulesList: {},
				SameMonthList: {},
				signArr: [],
				articleList: [],
				classList: [],
				commonL: {},
				classList1: [],
				oneObj: {},
				twoObj: {},
				threeObj: {},
				fourObj: {},
				fiveObj: {},
				sixObj: {},
				sevenObj: {},
				eightObj: {},
				seckillGoodsBanner: [],
				loading: false,
				dataList: [],
				loadStatus: 'more',
				page: 1,
				limit: 15,
				bottomFlag: true,
				topFlag: true,
				back: false,
				windowHeight: [],
				bigVip: {},
				passMessage: {},
				showPass: false
				// vajraDistrict:[
				// 	{name:"",url:"",icon:"",index:0},
				// 	]
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			// 当前页面参数
			// this.options = options;
			// this.Imgurl=app.globalData.Imgurl;
			// 加载页面数据
			let obj = {};
			obj.leftDistance = App.globalData.leftDistance;
			obj.lineHeight = App.globalData.lineHeight;
			obj.navH = App.globalData.navH;
			obj.paddingTop = App.globalData.paddingTop;
			this.navInfo = obj;
			this.getPageData();
			// this.getArticle();
			// timer=setInterval(()=>{
			// 	this.getRandomList();
			// },1000)
			this.getRandomList();
			this.getPass();
		},
		watch: {
			classList: function(val) {
				let time = null;
				if (uni.getSystemInfoSync().platform == "ios") {
					time = setInterval(() => {
						console.log(111);
						if (val.length == 0) {
							this.onLoad();
							this.onShow()
						} else {
							clearInterval(time)
						}
					}, 500)
				}
			}
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			// console.log(this.$store.state.user.superior_user_id, 'superior_user_id');
			var now = new Date();
			var day = now.getDay() - 1;
			var oneTiem = day * 24 * 60 * 60 * 1000;
			var endTiem = (7 - day) * 24 * 60 * 60 * 1000;
			var start_time = (new Date(new Date(new Date().toLocaleDateString()).getTime() - oneTiem).getTime());
			var end_time = (new Date(new Date(new Date().toLocaleDateString()).getTime() + endTiem).getTime());
			let arr = [];
			let weekArr = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
			for (let i = 0; i < 7; i++) {
				let obj = {};
				obj.name = weekArr[i];
				obj.startTime = start_time + 60 * 60 * 24 * i * 1000;
				obj.endTime = start_time + 60 * 60 * 24 * (i + 1) * 1000;
				obj.flag = false;
				obj.value = "?";
				arr.push(obj)
			}
			this.signArr = arr;
			// this.getPageData();
			// this.getArticle();
			// this.getRandomList();
			// 更新购物车角标
			setCartTabBadge()
			// if(this.$store.getters.token){
			// 	this.getFreeCollection()
			// }else{
			// 	this.showModalStatus3=true
			// }
			// this.showModalStatus=true;
			if (store.getters.token) {

			} else {
				this.showModalStatus = true;
			}
			this.getbigVip()
			this.setStorage()
		},
		created() {},
		onPullDownRefresh() {
			// 下拉
			this.getPageData(() => {
				uni.stopPullDownRefresh()
			})
			// if(!this.topFlag){
			// 	return false;
			// }
			// this.bottomFlag = true;
			// this.page = 1;
			// this.topFlag = false;
			// this.getJgoodslist(true);
		},
		onReachBottom() {
			// if (this.dataList.length >= this.JgoodsList.length) {
			// 	this.loadingStatus = 'noMore'
			// } else {
			// 	this.loadStatus = 'more';
			// 	setTimeout(() => {
			// 		// this.loadMore();
			// 		this.loadStatus = 'loadmore';
			// 	}, 1000)
			// }
			// 触底
			if (!this.bottomFlag) {
				return false;
			}
			this.page = this.page + 1;
			this.bottomFlag = false;
			this.status = "loading";
			this.getJgoodslist();

		},
		onPageScroll(e) {
			// 获取页面高度
			uni.getSystemInfo({
				success: res => {
					this.windowHeight = res.windowHeight
				}
			})
			if (e.scrollTop >= this.windowHeight) {
				this.back = true;
			} else {
				this.back = false;
			}
		},
		methods: {
			// 模拟数据加载
			loadMore() {
				console.log(this.dataList, this.JgoodsList)
				this.loadStatus = 'loading';
				this.page++
				this.dataList = this.dataList.concat(this.JgoodsList.slice(this.dataList.length, this.page * this.limit))
			},
			getRandomList() {
				seckillApi.randomList().then(res => {
					console.log(res)
					let arr = res.data.list;
					// arr.splice(0,2);
					// let len = arr.length;
					// let len1 = len%4;
					// let len2 = Math.floor(len/4);
					// let goodsArr = [];
					// if(len1 == 0){
					// 	for(let i=0;i<len2;i++){
					// 		let lenArr = [];
					// 		for(let j=0;j<len;j++){
					// 			if(j>=i*4&&j<(i+1)*4){
					// 				lenArr.push(arr[j]);
					// 			}
					// 		}
					// 		goodsArr.push(lenArr);
					// 	}
					// }else{
					// 	for(let i=0;i<(len2+1);i++){
					// 		let lenArr = [];
					// 		for(let j=0;j<len;j++){
					// 			if(j>=i*4&&j<(i+1)*4){
					// 				lenArr.push(arr[j]);
					// 			}
					// 		}
					// 		goodsArr.push(lenArr);
					// 	}
					// }
					// console.log(goodsArr)
					this.seckillGoodsBanner = arr;
				})
			},
			changeSecKill(e) {
				// console.log(e)
				this.secIndex = e.detail.current;
			},
			toMyCollage() {
				// uni.navigateTo({
				// 	url:"/pages/collageDetail/collageDetail"
				// })
			},
			//客服
			but_kf() {
				this.showModalStatus2 = true;
			},
			btn_top() {
				uni.pageScrollTo({
					scrollTop: 0
				});
			},
			btn_cose() {
				this.showModalStatus2 = false;
			},
			// 领取充值卡
			getLq() {
				if (this.$store.getters.token) {
					teledcardApi.add()
						.then(res => {
							console.log(res)
							if (res.message == "领取成功") {
								this.showModalStatus3 = false
							}
						})
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '此时此刻需要您登录喔~',
						confirmText: "去登录",
						cancelText: "再逛会",
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: "/pages/login/index"
								})
							}
						}
					})
				}

			},
			toPrepaid() {

				if (this.$store.getters.token) {
					detail()
						.then(res => {
							// this.$navTo("pages/prepaidRefill/prepaidRefill")
							if (res.data.detail.if_switch == 1) {
								this.$navTo("pages/prepaidRefill/prepaidRefill")
							} else {
								uni.showToast({
									title: res.data.detail.mobile_tips,
									icon: "none",
									duration: 2000
								});
							}
						})
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '此时此刻需要您登录喔~',
						confirmText: "去登录",
						cancelText: "再逛会",
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: "/pages/login/index"
								})
							}
						}
					})
				}
			},
			choicePhone() {
				let that = this
				// #ifdef APP-PLUS
				nativeCommon.contacts.getContact(function callBack(name, phoneNumber) {
					that.name = name;
					that.mobile = phoneNumber.replace(/\s|-+/g, "");
				});
				// #endif
				// #ifdef MP-WEIXIN
				wx.chooseContact({
					success(res) {
						that.name = res.displayName;
						that.mobile = res.phoneNumber.replace(/\s|-+/g, "");
					},
					fail(err) {
						console.log(err)
					}
				})
				// #endif
			},
			// 跳转文章详情页
			onTargetDetail(articleId) {
				this.$navTo('pages/article/detail', {
					articleId
				})
			},
			getArticle() {
				articleApi.list()
					.then(res => {
						//console.log(res,9999999999)
						this.articleList = res.data.list.data;
					})
			},
			toNoticeList() {
				this.$navTo("pages/article/index")
			},
			//轮播图
			btn_tourl(e) {
				let url = e.currentTarget.dataset.url || e.target.dataset.url;
				console.log(url)
				var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
				if (!reg.test(url)) {
					uni.navigateTo({
						url: url
					})
					// console.log('这网址不是以http://https://开头，或者不是网址')
				} else {
					if (this.$store.getters.token) {
						let url = this.commonL.blc_url;
						// let url='https://walletc.rhchainos.com/#/?id='+this.$store.getters.userId;
						if (this.commonL.pass_cert_switch == 1) {
							uni.navigateTo({
								url: '/pages/showhfive/showhfive?url=' + url
							})
						}

						// window.location.href='http://47.114.119.227?id='+this.$store.getters.userId
						// this.$store.getters.userId
					} else {
						uni.showModal({
							title: '温馨提示',
							content: '此时此刻需要您登录喔~',
							confirmText: "去登录",
							cancelText: "再逛会",
							success: res => {
								if (res.confirm) {
									uni.navigateTo({
										url: "/pages/login/index"
									})
								}
							}
						})
					}
				}

			},
			getTicket() {
				if (this.$store.getters.token) {
					detail()
						.then(res => {
							if (res.data.detail.is_open_ticket == 1) {
								this.$navTo('pages/ticket/stationType/stationType')
								// this.$navTo('pageTicket/ticket/stationType/stationType')
							} else {
								uni.showToast({
									title: res.data.detail.ticket_tips,
									icon: "none",
									duration: 2000
								});
							}
						})
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '此时此刻需要您登录喔~',
						confirmText: "去登录",
						cancelText: "再逛会",
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: "/pages/login/index"
								})
							}
						}
					})
				}

				// this.$navTo('pages/ticket/index')
			},
			btn_invitation() {
				if (this.$store.getters.token) {
					detail()
						.then(res => {
							this.$navTo('pageHome/code/index')
						})
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '此时此刻需要您登录喔~',
						confirmText: "去登录",
						cancelText: "再逛会",
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: "/pages/login/index"
								})
							}
						}
					})
				}
			},
			btn_collage() {
				if (this.commonL.group_switch == 1) {
					uni.navigateTo({
						url: "/pages/groupGoodList/groupGoodList"
					})
				} else {
					uni.showToast({
						title: '此功能暂未开放，敬请期待',
						icon: "none",
						duration: 2000
					});
				}

			},
			btn_brand() {
				uni.showToast({
					title: '此功能暂未开放，敬请期待',
					icon: "none",
					duration: 2000
				});
			},
			btn_seckill() {
				if (this.commonL.seckill_switch == 1) {
					uni.navigateTo({
						url: "/pageSecKill/seckillList/seckillList"
					})
				} else {
					uni.showToast({
						title: '此功能暂未开放，敬请期待',
						icon: "none",
						duration: 2000
					});
				}

			},
			btn_boutique() {
				uni.showToast({
					title: '此功能暂未开放，敬请期待',
					icon: "none",
					duration: 2000
				});
			},
			// 免费专区
			btn_welfare() {
				uni.showToast({
					title: '此功能暂未开放，敬请期待',
					icon: "none",
					duration: 2000
				});
				// uni.navigateTo({
				// 	url:"/blindbox/pages/index/index"
				// })
			},
			//高奢名品
			btn_LuxuryGoods() {
				let type = "is_luxury_goods"
				if (this.commonL.luxury_goods_switch == 1) {
					// this.$navTo('pageLuxury/pages/index/index', { type })
					this.$navTo('pageLuxury/pages/index/index')
					// this.$navTo('pages/goods/luxuryList', { type })
				} else {
					uni.showToast({
						title: '此功能暂未开放，敬请期待',
						icon: "none",
						duration: 2000
					});
				}
			},
			btn_groupBuying() {
				uni.showToast({
					title: '此功能暂未开放，敬请期待',
					icon: "none",
					duration: 2000
				});
			},
			btn_give() {
				// uni.showToast({
				//     title: '此功能暂未开放，敬请期待',
				// 	icon:"none",
				//     duration: 2000
				// });
				// uni.navigateTo({
				// 	url:"/pageGive/pages/index/index"
				// })
				if (this.commonL.lucky_free_activity_switch == 1) {
					uni.navigateTo({
						url: "/pageGive/pages/index/index"
					})
				} else {
					uni.showToast({
						title: '此功能暂未开放，敬请期待',
						icon: "none",
						duration: 2000
					});
				}
			},
			btn_shoppingGuide() {
				uni.showToast({
					title: '此功能暂未开放，敬请期待',
					icon: "none",
					duration: 2000
				});
			},
			btn_advertisement() {
				if (this.commonL.advert_switch == 1) {
					uni.navigateTo({
						url: "/pageTask/pages/index/index"
					})
				} else {
					uni.showToast({
						title: '此功能暂未开放，敬请期待',
						icon: "none",
						duration: 2000
					});
				}
				// uni.showToast({
				//     title: '此功能暂未开放，敬请期待',
				// 	icon:"none",
				//     duration: 2000
				// });
				// uni.navigateTo({
				// 	url:"/pageTask/pages/index/index"
				// })
			},
			btn_blindbox() {
				if (this.commonL.blindbox_switch == 1) {
					uni.navigateTo({
						url: "/blindbox/pages/index/index"
					})
				} else {
					uni.showToast({
						title: '此功能暂未开放，敬请期待',
						icon: "none",
						duration: 2000
					});
				}
				// uni.navigateTo({
				// 	url:"/blindbox/pages/index/index"
				// })
			},
			// 大会员
			btn_bigber() {
				if (this.bigVip.big_vip_switch == 1) {
					uni.navigateTo({
						url: '/pageMember/pages/index/index'
					})
				} else {
					uni.showToast({
						title: '此功能暂未开放，敬请期待',
						icon: "none",
						duration: 2000
					});
				}
			},
			toList(e) {
				let type = e.target.dataset.type || e.currentTarget.dataset.type;
				if (type == "hot") {
					this.$navTo('pages/goods/list', {
						type: "hot"
					})
				} else if (type == "special") {
					this.$navTo('pages/goods/list', {
						type: "special"
					})
				}
			},
			box_close() {
				this.showModalStatus = false;
			},
			box_close3() {
				this.showModalStatus3 = false;
			},
			/**
			 * 加载页面数据
			 * @param {Object} callback
			 */
			// getPageData(callback) {
			//   const app = this
			//   const pageId = app.options.pageId || 0
			//   Api.detail(pageId)
			//     .then(result => {
			//       // 设置页面数据
			//       const { data: { pageData } } = result
			//       app.page = pageData.page
			//       app.items = pageData.items
			//       // 设置顶部导航栏栏
			//       // app.setPageBar();
			//     })
			//     .finally(() => callback && callback())
			// },
			// 获取页面数据
			getPageData(callback) {
				const app = this
				app.isLoading = true
				app.page = 1;
				app.JgoodsList = [];
				Promise.all([app.getrotation(), app.getSetting(), app.getTgoodslist(), app.getRgoodslist(), app
						.getCategory(), app.getCommon(),
						app.getJgoodslist(true)
					])
					.then(result => {
						app.isLoading = false;
						if (store.getters.token) {
							//签到记录
							// app.getSameMonthSignIn();
							//判断用户今天是否签到
							// app.getIfUserSignIn();
						}
						// 执行回调函数
						callback && callback()
					})
					.catch(err => {
						//console.log('catch', err)
					})
			},
			// 获取轮播图
			getrotation() {
				const app = this
				return new Promise((resolve, reject) => {
					Rapi.list().then(res => {
						app.imgList = res.data.list.data;
						resolve(res)
					}).catch(reject)
				})
			},
			// 获取商城设置
			getSetting() {
				const app = this
				return new Promise((resolve, reject) => {
					Rapi.info().then(setting => {
						app.setting = setting.data.storeInfo
						resolve(setting)
					}).catch(reject)
				})
			},
			getbigVip() {
				Rapi.big_vip().then(res => {
					console.log(res)
					this.bigVip = res.data.values
				})
			},
			//分类
			getCategory() {
				const app = this
				return new Promise((resolve, reject) => {
					CategoryApi.getList({
						is_selected: 1
					}).then(res => {
						//console.log(res,888)
						app.classList = res.data.list;
						let ind = 1;
						let arr = [];
						let arr1 = [];
						for (let i = 0; i < app.classList.length; i++) {
							if (app.classList[i].category_id == 10037) {
								app.oneObj = app.classList[i];
							} else if (app.classList[i].category_id == 10028) {
								app.twoObj = app.classList[i];
							} else if (app.classList[i].category_id == 10039) {
								app.threeObj = app.classList[i];
							} else if (app.classList[i].category_id == 10038) {
								app.fourObj = app.classList[i];
							} else if (app.classList[i].category_id == 10026) {
								app.fiveObj = app.classList[i];
							} else if (app.classList[i].category_id == 10010) {
								app.sixObj = app.classList[i];
							} else if (app.classList[i].category_id == 10040) {
								app.sevenObj = app.classList[i];
							} else if (app.classList[i].category_id == 10023) {
								app.eightObj = app.classList[i];
							}
							// if(i<8*ind){
							// 	arr1.push(app.classList[i])
							// 	if(i == (app.classList.length-1)){
							// 		arr.push(arr1);
							// 	}
							// }else{
							// 	ind = ind + 1;
							// 	arr.push(arr1);
							// 	arr1 = [];
							// 	arr1.push(app.classList[i])
							// }
						}
						// app.classList1 = arr;
						resolve(res)
					}).catch(reject)
				})
			},
			getCommon() {
				const app = this
				return new Promise((resolve, reject) => {
					settingApi.detail().then(res => {
						app.commonL = res.data.detail
						resolve(res)
					}).catch(reject)
				})
			},
			// 获取商品列表
			getTgoodslist() {
				const app = this
				return new Promise((resolve, reject) => {
					goodsApi.list({
						if_special_offer: 1
					}).then(res => {
						app.TgoodsList = res.data.list.data
						resolve(res)
					}).catch(reject)
				})
			},
			// 获取热门商品列表
			getRgoodslist() {
				const app = this
				return new Promise((resolve, reject) => {
					goodsApi.list({
						if_hot: 1
					}).then(res => {
						app.RgoodsList = res.data.list.data
						resolve(res)
					}).catch(reject)
				})
			},
			// 获取精选商品列表
			// getJgoodslist() {
			// 	const app = this
			// 	return new Promise((resolve, reject) => {
			// 		goodsApi.list({
			// 			if_selected: 1
			// 		}).then(res => {
			// 			app.JgoodsList = res.data.list.data
			// 			resolve(res)
			// 		}).catch(reject)
			// 	})
			// },
			getJgoodslist(flag) {
				var _that = this;
				var obj = {};
				obj.page = this.page;
				obj.limit = this.limit;
				obj.if_selected = 1;
				goodsApi.list(obj).then(res => {
					console.log(res)
					if (res.status == 200) {
						// this.JgoodsList=res.data.list.data;
						if (flag) {
							this.topFlag = true;
							this.bottomFlag = true;
							uni.stopPullDownRefresh()
						}
						if (Math.ceil(res.data.list.total / _that.limit) != this.page && res.data.list.last_page >
							0) {
							this.bottomFlag = true;
							this.status = "loadmore";
						} else {
							this.status = "normal";
						}
						if (this.page != 1) {
							this.JgoodsList = this.JgoodsList.concat(res.data.list.data);

						} else {
							this.JgoodsList = res.data.list.data;
						}

					}
				})
			},
			// 获取签到积分赠送规则
			getCheckrules() {
				const app = this
				return new Promise((resolve, reject) => {
					SigninApi.listAll().then(res => {
						app.rulesList = res
						resolve(res)
					}).catch(reject)
				})
			},
			//签到记录
			getSameMonthSignIn() {
				const app = this;
				var now = new Date();
				var day = now.getDay() - 1;
				var oneTiem = day * 24 * 60 * 60 * 1000;
				var endTiem = (7 - day) * 24 * 60 * 60 * 1000;
				var start_time = (new Date(new Date(new Date().toLocaleDateString()).getTime() - oneTiem).getTime()) /
					1000;
				var end_time = (new Date(new Date(new Date().toLocaleDateString()).getTime() + endTiem).getTime()) / 1000;
				return new Promise((resolve, reject) => {
					SigninApi.SameMonthSignIn({
						b_time: start_time,
						e_time: end_time
					}).then(res => {
						app.SameMonthList = res;
						let signArr = JSON.parse(JSON.stringify(this.signArr))
						for (let i = 0; i < res.data.list.length; i++) {
							let times = new Date(res.data.list[i].create_time).getTime();
							for (let j = 0; j < signArr.length; j++) {
								if (times >= signArr[j].startTime && times < signArr[j].endTime) {
									signArr[j].flag = true;
									signArr[j].value = res.data.list[i].value;
								}
							}
						}
						this.signArr = signArr;
						resolve(res)
					}).catch(reject)
				})
			},
			// 获取判断用户今天是否已签到
			getIfUserSignIn() {
				const app = this
				return new Promise((resolve, reject) => {
					SigninApi.IfUserSignIn().then(res => {
						if (res.message == '已签到') {
							app.showModalStatus = false;

						} else if (res.message == '未签到') {
							app.showModalStatus = true;
						}
						resolve(res)
					}).catch(reject)
				})
			},
			// 获取判断用户今天是否领取充值卡
			getFreeCollection() {
				const app = this
				return new Promise((resolve, reject) => {
					teledcardApi.isFreeCollection().then(res => {
						res.data.data
						if (res.data.data == 0) {
							app.showModalStatus3 = true;
						} else if (res.data.data == 1) {
							app.showModalStatus3 = false;
						}

						resolve(res)
					}).catch(reject)
				})
			},
			//签到
			signin() {
				const app = this;
				let loginPopupNum = 0;
				if (store.getters.token) {
					return new Promise((resolve, reject) => {
						SigninApi.signin().then(res => {
							if (res.status == 200) {
								app.showModalStatus = false;
								uni.showToast({
									icon: "none",
									title: "签到成功",
									duration: 2000
								})
							} else if (res.status == 500) {
								app.showModalStatus = true;
							}
							resolve(res)
						}).catch(reject)
					})
				} else {
					if (loginPopupNum <= 0) {
						loginPopupNum++
						uni.showModal({
							title: '温馨提示',
							content: '此时此刻需要您登录喔~',
							confirmText: "去登录",
							cancelText: "再逛会",
							success: res => {
								loginPopupNum--
								if (res.confirm) {
									uni.navigateTo({
										url: "/pages/login/index"
									})
								}
							}
						})
					}
				}

			},
			// 跳转至商品列表页
			onTargetGoodsList(e) {
				let goodsId = e.currentTarget.dataset.id || e.target.dataset.id;
				this.$navTo('pages/goods/detail', {
					goodsId
				})
			},
			onTargetGoodsLists(categoryId) {
				this.$navTo('pages/goods/list', {
					categoryId
				})
			},
			getClass() {
				this.$navTo('pages/category/index')
			},
			/**
			 * 商品搜索
			 */
			handleSearch() {
				const searchPageUrl = 'pages/search/index'
				// 判断来源页面
				let pages = getCurrentPages()
				if (pages.length > 1 &&
					pages[pages.length - 2].route === searchPageUrl) {
					uni.navigateBack()
					return
				}
				// 跳转到商品搜索页
				this.$navTo(searchPageUrl)
			},
			/**
			 * 设置顶部导航栏
			 */
			setPageBar() {
				const {
					page
				} = this
				// 设置页面标题
				uni.setNavigationBarTitle({
					title: page.params.title
				});
				// 设置navbar标题、颜色
				uni.setNavigationBarColor({
					frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
					backgroundColor: page.style.titleBackgroundColor
				})
			},
			getPass() {
				blockChina().then(res => {
						console.log(res, 121)
						this.passMessage = res.data.data
						this.showPass = true
					})
					.catch(err => {
						if (err.status == 500) {

						}
						this.showPass = true
					})
					.finally(res => {
						this.showPass = true
					})
			},
			setStorage() {
				uni.setStorage({
					key: 'storage_key',
					data: 'passMessage',
					success(res) {
						console.log(res, 55)
					}
				})
			}
		},

		/**
		 * 下拉刷新
		 */
		// onPullDownRefresh() {
		// 	// 获取首页数据
		// 	this.getPageData(() => {
		// 		uni.stopPullDownRefresh()
		// 	})
		// },

		/**
		 * 分享当前页面
		 */
		onShareAppMessage() {
			const app = this
			const {
				page
			} = app;
			console.log("/pages/index/index?" + app.$getShareUrlParams());
			return {
				// title: page.params.share_title,
				path: "/pages/index/index?" + app.$getShareUrlParams()
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
				// title: page.params.share_title,
				path: "/pages/index/index?" + app.$getShareUrlParams()
			}
		}

	}
</script>

<style lang="scss" scoped>
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}

	.indoctor {
		position: absolute;
		bottom: -44rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;

	}

	.indoctorItem {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		background: rgba(255, 95, 96, .5);
		margin-right: 12rpx;
	}

	.indoctorItem:last-child {
		margin-right: 0;
	}

	.indoctorItem.indoctorItemActive {
		background: #FF5F60;
	}


	.seckillConWrap {
		position: relative;
		// width: 702rpx;
		margin: 20rpx auto 0;
	}

	.seckillCon {
		width: 100%;
		display: flex;
		// justify-content: space-around;
	}

	.seckillItem {
		width: 160rpx;
		margin: 0 8upx 0 20upx;
		// height: 214rpx;
	}

	.seckillItemT {
		width: 160rpx;
		height: 160rpx;
		// background: #E7E6E6;
		box-shadow: 0 4rpx 4rpx 0 rgba(45, 45, 45, 0.10);
		border-radius: 10rpx;
		background-size: cover;
		background-position: center;
	}

	.seckillItemB {
		margin-top: 20rpx;
		// display: flex;
	}

	.seckillItemBT {
		font-size: 28rpx;
		// line-height: 20rpx;
		color: #EF343D;
		text-align: center;
		// margin-bottom: 12rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 700;
	}

	.seckillItemBB {
		font-size: 20rpx;
		// line-height: 20rpx;
		color: #999999;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-decoration: line-through;
	}

	.header {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 99999;
		background-color: #EF343D;
		// padding-bottom: 20upx;
	}

	.subject {
		// position: fixed;
		// width: 100%;
		// top: 0;
		// left: 0;
		// align-items: center;
		box-sizing: border-box;
		// z-index: 1;
		// color: white;
		position: relative;
		// background-image: url(../../static/home/logo.png);
		// background-size: 750upx 560upx;
		background-color: #EF343D;
	}

	.subject-img {
		position: absolute;
		top: 0;
		left: 0;
		width: 750upx;
		// height: 560upx;
		// z-index: -1;
	}

	.subject-img image {
		width: 100%;
		height: 100%;
	}

	.typeTwo {
		margin-top: 18upx;
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	.typeTwoL,
	.typeTwoR {
		width: 342upx;
		height: 120upx;
		border-radius: 8upx;
		overflow: hidden;
		font-family: Adobe Heiti Std;
		background-size: 100% 100%;
		background-position: 0 0;
		font-size: 30upx;
		line-height: 56upx;
		box-sizing: border-box;
		padding: 6upx 20upx;
		color: white;
		font-weight: bold;
		letter-spacing: 2rpx;
	}

	.typeOne {
		width: 100%;
		display: flex;
		margin-top: 18upx;
		justify-content: space-between;
		// height: 250upx;
	}

	.typeOneL {
		width: 262upx;
		height: 258upx;
		border-radius: 8upx;
		overflow: hidden;
		font-family: Adobe Heiti Std;
		background-size: 100% 100%;
		background-position: 0 0;
		font-size: 30upx;
		line-height: 56upx;
		box-sizing: border-box;
		padding: 12upx 36upx 12upx 20upx;
		color: white;
		font-weight: bold;
		letter-spacing: 2rpx;
	}

	.typeOneLMain {
		padding: 12upx 30upx 12upx 40upx;
	}

	.typeOneRT,
	.typeOneRB {
		width: 422upx;
		height: 120upx;
		padding: 12upx 20upx;
		font-size: 30upx;
		line-height: 56upx;
		color: white;
		box-sizing: border-box;
		border-radius: 8upx;
		overflow: hidden;
		background-size: 100% 100%;
		background-position: 0 0;
		font-weight: bold;
		font-family: Adobe Heiti Std;
		letter-spacing: 2rpx;
	}

	.typeOneRB {
		margin-top: 18upx;
	}

	.cateBox {
		width: 100%;
		height: 336upx;
		box-sizing: border-box;
		padding: 32upx 54upx;
	}

	.cateWrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.cateItems {
		width: 90upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 94upx;
		margin-bottom: 20upx;
		height: 126upx;
	}

	.cateItems:nth-child(4n+4) {
		margin-right: 0;
	}

	.cateItems>image {
		width: 90upx;
		height: 90upx;
		margin-bottom: 16upx;
		border-radius: 6upx;
	}

	.cateItems>text {
		width: 90upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 20upx;
		line-height: 20upx;
		color: #333333;
		text-align: center;
	}


	.heads {
		position: fixed;
		width: 100%;

		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		// background: white;
		box-sizing: border-box;
		z-index: 1;
		color: #FFFFFF;
	}

	.heads2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		width: 78%;
		padding: 0 40rpx 0 40upx;
		color: #FFFFFF;
		height: 100%;
	}

	.heads2 .heads2-left image {
		width: 40upx;
		height: 40upx;
		vertical-align: top;
	}

	.heads2 .heads2-right image {
		width: 40upx;
		height: 40upx;
		vertical-align: top;
	}

	.heads2-left text {
		font-size: 32upx;
		color: #FFFFFF;
		margin-left: 12upx;
		font-family: PingFang SC-Medium, PingFang SC;
		font-weight: 500;
	}

	/* #ifdef H5 */
	uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}

	/* #endif */
	.noticeCon {
		width: 100%;
		box-sizing: border-box;
		padding: 0 24upx;
		margin-top: 16upx;
	}

	.noticeItem {
		width: 100%;
		height: 70upx;
		box-sizing: border-box;
		border-bottom: 2upx solid #F5F5F5;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		padding-left: 32upx;
	}

	.noticeItem::before {
		width: 20upx;
		height: 20upx;
		border-radius: 50%;
		background: linear-gradient(180deg, #90F0C6 0%, #1EE6D8 100%);
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.noticeItem>image {
		width: 24upx;
		height: 24upx;
	}

	.noticeItem>view {
		width: calc(100% - 48upx);
		font-size: 20upx;
		line-height: 20upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.container {
		background: #F8F8F8;
	}

	.home-header {
		width: 100%;
		// height: 72upx;
		display: flex;
		justify-content: center;
		// background: white;
		margin-top: 28upx;
		// margin-bottom: 14upx;
	}

	.home-header .home-header-icon {
		width: 80upx;
		height: 70upx;
	}

	.home-header-icon>image {
		width: 100%;
		height: 100%;
		border-radius: 10upx;
	}

	.home-header-inp {
		position: relative;
		width: 702upx;
		box-sizing: border-box;
		height: 64upx;
		// border: 2upx solid #737373;
		border-radius: 36upx;
		background-color: #FFFFFF;
	}

	.home-header-inp>image {
		position: absolute;
		top: 20upx;
		left: 30upx;
		width: 28upx;
		height: 28upx;
	}

	.home-header-inp>view {
		width: 702upx;
		padding: 0;
		margin: 0;
		padding-left: 68upx;
		border: none;
		height: 64upx;
		font-size: 24upx;
		line-height: 64upx;
		box-sizing: border-box;
		color: #A7A7A7;
	}

	/* 轮播 */
	.home-lunb {
		// margin-top: 24upx;
		z-index: 999;
	}

	.swiper {
		// height: 382upx;
		width: 702upx;
		height: 300upx;
		margin: 0 auto 0;
		border-radius: 10upx;
	}

	.swiper swiper-item image {
		width: 100%;
		height: 300upx;
		border-radius: 10upx;
	}

	// .swiper6{
	// 	width: 750upx;
	// 	height: 300upx;
	// 	margin: 0 auto 0;
	// }
	/* 轮播 */
	.home-lunb2 {
		margin-top: -12upx;
	}

	.adverImg {
		width: 702upx;
		height: 192upx;
		margin: 24upx auto 0;
		display: flex;
		border-radius: 20upx;
	}

	.adverImg>image {
		width: 100%;
		height: 100%;
		border-radius: 20upx;
	}

	.swiper2 {
		// height: 382upx;
		width: 702upx;
		height: 192upx;
		margin: 0 auto 0;
		border-radius: 10upx;
	}

	.swiper2 swiper-item image {
		width: 100%;
		height: 192upx;
		border-radius: 10upx;
	}

	/* 走马灯 */
	.swiper4 {
		height: 60upx;
		width: 82%;
		padding-left: 20upx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.swiper4 swiper-item image {
		width: 100%;
		height: 60upx;
	}

	.newMain {
		width: 702upx;
		margin: 24upx auto 0;
		background-color: #FFFFFF;
		border-radius: 20upx;
	}

	.home-point {
		// padding: 30upx 0;
		/* display: flex;
		justify-content: space-between; */
		background-color: #FFFFFF;
		margin-top: 40upx;
	}

	.swiper6 {
		width: 702upx;
		height: 380upx;
		margin: 0 auto 0;
	}

	/* 金刚区 */
	.home-district {
		padding: 30upx 0;
		width: 100%;
		/* display: flex;
		flex-wrap: wrap;
		justify-content: flex-start; */
		background-color: #FFFFFF;
		margin-top: 20upx;
	}

	.home-district-header {
		font-size: 30upx;
		color: #333333;
		padding-left: 28upx;
		margin-bottom: 30upx;
		font-weight: PingFang-SC-Regular;
	}

	.point-item {
		width: 126upx;
		margin-left: 14upx;
		margin-bottom: 24upx;
		display: inline-block;
	}

	.point-item:nth-child(6),
	.point-item:nth-child(7),
	.point-item:nth-child(8),
	.point-item:nth-child(9),
	.point-item:nth-child(10) {
		margin-bottom: 20upx;
	}

	.point-img {
		width: 80upx;
		height: 80upx;
		margin: 0 auto 8upx;
	}

	.point-img>image {
		width: 100%;
		height: 100%;
	}

	.point-item .point-text {
		font-size: 22upx;
		text-align: center;
		display: inline-block;
		width: 100%;
	}

	/* 金刚区 end*/
	.homepage-lantern {
		width: 702upx;
		height: 82upx;
		margin: 24upx auto 0;
		border-radius: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		background-color: #FFFFFF;
	}

	.homepage-lantern-item {
		width: 82%;
		height: 100%;
		padding-left: 20upx;
	}

	.homepage-lantern-text {
		display: inline-block;
		width: 100%;
		height: 82upx;
		line-height: 82upx;
		font-size: 28upx;
		color: #333333;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.homepage-lantern-icon1 {
		width: 40upx;
		height: 40upx;
		padding-top: 22upx;
	}

	.homepage-lantern-icon1>image {
		vertical-align: top;
		width: 40upx;
		height: 40upx;
	}

	.homepage-lantern-icon2 {
		width: 28upx;
		height: 28upx;
		padding-top: 30upx;
	}

	.homepage-lantern-icon2>image {
		width: 28upx;
		height: 28upx;
		vertical-align: top;
	}


	.homepage-lantern-icon2>text {
		display: inline-block;

	}

	// 限时特价
	.home-district {
		padding: 0 24upx;
		margin-top: 32upx;
		box-sizing: border-box;
	}

	.home-district-header {
		display: flex;
		justify-content: space-between;
	}

	.home-district-left {
		display: flex;
	}

	.home-district-right {
		display: flex;
		padding-top: 6upx;
	}

	.home-district-text1 {
		font-size: 28upx;
		color: #333333;
		font-weight: bold;
		margin-left: 20upx;
	}

	.home-district-text2 {
		font-size: 16upx;
		color: #999999;
		font-weight: bold;
		height: 32upx;
		line-height: 32upx;
		margin: 8upx 0 0 16upx;
	}

	.home-district-text3 {
		font-size: 20upx;
		color: #333333;
		margin-right: 8upx;
		line-height: 34upx;
	}

	.home-district-colour {
		position: relative;
	}

	.home-district-color1 {
		width: 40upx;
		height: 40upx;
		background-color: #ff5060;
	}

	.home-district-color2 {
		width: 32upx;
		height: 32upx;
		background-color: #5FFFEF;
		position: absolute;
		top: 16upx;
		left: 12upx;
	}

	.home-district-icon {
		width: 32upx;
		height: 32upx;
	}

	.home-district-icon>image {
		width: 100%;
		height: 100%;
	}

	.home-district-item {
		width: 702upx;
		height: 342upx;
		padding-top: 24upx;
		padding-left: 14upx;
		background-color: #F3F3F3;
		border-radius: 8upx;
		margin: 32upx auto 0;
		display: flex;
	}

	.home-district-list {
		width: 204upx;
		height: 300upx;
		padding-top: 24upx;
		background-color: #FFFFFF;
		margin: 0 0 0 16upx;
	}

	.home-district-img {
		width: 144upx;
		height: 144upx;
		margin: 0 auto 0;
	}

	.home-district-img>image {
		width: 100%;
		height: 100%;
	}

	.home-district-text4 {
		font-size: 20upx;
		color: #333333;
		width: 172upx;
		height: 50upx;
		margin: 16upx auto 0;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.home-list-b {
		position: relative;
		margin-top: 16upx;
		width: 100%;
		height: 48upx;
	}

	.home-list-b-left {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 134upx;
		height: 48upx;
		padding-left: 8upx;
		line-height: 48upx;
		background-image: url(../../static/home/icon_bjt.png);
		background-size: 134upx 48px;
		z-index: 88;
	}

	// .home-list-b-left view:nth-child(1){
	//  display: inline-block;
	//  font-size: 20upx;
	//  color: #333333;
	//  margin-left: 8upx;
	//  font-weight: bold;
	//  vertical-align: top;
	// }
	.home-list-b-left view:nth-child(1) {
		display: inline-block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 20upx;
		color: #333333;
		font-weight: bold;
	}

	.home-list-b-right {
		width: 76upx;
		height: 32upx;
		background-color: #515151;
		position: absolute;
		right: 0;
		bottom: 0;
		line-height: 32upx;
		font-size: 16upx;
		color: #D0D0D0;
		text-align: center;
		text-decoration: line-through;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.home-list-bb {
		margin-top: 16upx;
		padding: 0 16upx;
		display: flex;
		justify-content: space-between;
	}

	.home-list-bb-left {
		font-size: 20upx;
		color: #ff5060;
		line-height: 32upx;
		font-weight: bold;
	}

	.home-list-bb-right {
		width: 32upx;
		height: 32upx;
		padding: 4upx;
		border-radius: 50%;
		background-color: #ff5060;
	}

	.home-list-bb-right>image {
		width: 24upx;
		height: 24upx;
		vertical-align: top;
	}

	// 客服
	.home-kf {
		position: fixed;
		bottom: 204upx;
		right: 24upx;
		width: 108upx;
		height: 108upx;
		border-radius: 50%;
	}

	.home-kf>image {
		width: 108upx;
		height: 108upx;
		vertical-align: top;
	}

	// 返回头部
	.home-returnTop {
		position: fixed;
		bottom: 120upx;
		right: 24upx;
		width: 108upx;
		height: 108upx;
		border-radius: 50%;
	}

	.home-returnTop>image {
		width: 108upx;
		height: 108upx;
		vertical-align: top;
	}

	/* 首页推荐 */
	.home-recommend {
		margin-top: 24upx;
		padding: 0 12upx;
		// background-color: #FFFFFF;
	}

	.home-recommend .recommend-header {
		width: 702upx;
		height: 46upx;
		// background: linear-gradient(90deg, #FF5F60 60%, #DE6BAE 100%);
		background-image: url(../../static/icon/icon_bjt.png);
		background-size: 702upx 46rpx;
		margin: 0 auto 0;
		display: flex;
		align-items: center;
	}

	.recommend-header image {
		width: 21upx;
		height: 26upx;
		margin: 6upx 12upx 4upx 10upx;
	}

	.recommend-header text {
		font-size: 30upx;
		color: #FFFFFF;
		line-height: 46upx;
		vertical-align: top;
	}

	.home-seckill {
		width: 702upx;
		margin: 24upx auto 0;
		background-color: #FFFFFF;
		border-radius: 20upx;
		padding: 24upx 20upx;
	}

	.seckill-header {
		height: 46upx;
		margin: 0 auto 0;
		display: flex;
		align-items: center;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.seckill-headerL image {
		width: 172upx;
		height: 36upx;
	}

	.seckillMore {
		font-size: 28rpx;
		color: #565656;
		line-height: 28rpx;
	}

	.seckillMore image {
		width: 28upx;
		height: 28upx;
		vertical-align: top;
	}

	.recommend-bjt {
		width: 80upx;
		height: 4upx;
		margin: 8upx auto 0;
	}

	.home-recommend .recommend-content {
		display: flex;
		flex-wrap: wrap;
	}

	.home-recommend .recommend-item {
		// width: 342upx;
		// height: 424upx;
		width: 338upx;
		// height: 500upx;
		margin-left: 24upx;
		margin-bottom: 24upx;
		background-color: #FFFFFF;
		// background: rgba(135,135,135,0.1);
		// opacity: 0.1;
		color: #595858;
		border-radius: 20upx;
	}

	.home-recommend .recommend-img {
		width: 338upx;
		height: 338upx;
		border-radius: 20upx 20upx 0 0;
	}

	.home-recommend .recommend-img>image {
		width: 100%;
		height: 100%;
		border-radius: 20upx 20upx 0 0;
	}

	.home-recommend .recommend-main {
		// padding: 0 24upx;
		margin-top: 10upx;
		// max-width: calc(100% - 270upx);
	}

	.home-recommend .recommend-title1 {
		font-size: 28upx;
		color: #333333;
		font-weight: Bold;
		padding: 0 10upx;
		height: 80upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		margin-bottom: 24upx;
	}

	.home-recommend .recommend-title2 {
		display: flex;
		padding: 0 10upx;
		justify-content: space-between;
		// margin-top: 17upx;
		margin-bottom: 20upx;
	}

	.home-recommend .recommend-title3 {
		font-size: 22upx;
		color: #878787;
		// margin-top: 18upx;
		line-height: 22upx;
	}

	.home-recommend .recommend-text1 {
		font-size: 22upx;
		// font-weight: bold;
		line-height: 22upx;
		color: #EF343D;
		margin-right: 18upx;
	}

	.home-recommend .recommend-text1 text {
		font-size: 36upx;
		font-weight: bold;
	}

	.home-recommend .recommend-texts {
		font-size: 22upx;
		// font-weight: bold;
		line-height: 22upx;
		color: #878787;
		text-decoration: line-through;
	}

	.home-recommend .recommend-text2 {
		width: 48upx;
		height: 48upx;
		padding: 8upx;
		background-color: #ff5060;
		border-radius: 50%;
	}

	.recommend-text2>image {
		width: 32upx;
		height: 32upx;
		vertical-align: top;
	}

	/* 首页推荐 end */

	.home-popup {
		width: 526upx;
		position: fixed;
		top: 26%;
		left: 14%;
		z-index: 2000;
	}

	.home-box {
		width: 100%;
		height: 568upx;
		background: linear-gradient(180deg, #F7E5B5 0%, #F2923E 100%);
	}

	.home-box-t {
		padding-top: 32upx;
	}

	.home-box-text1 {
		font-size: 28upx;
		color: #850000;
		font-family: Alibaba PuHuiTi;
		font-weight: 400;
		line-height: 40upx;
		text-align: center;
	}

	.home-box-text2 {
		font-size: 16upx;
		color: #333333;
		line-height: 28upx;
		text-align: center;
	}

	.home-box-b {
		width: 232upx;
		height: 82upx;
		text-align: center;
		line-height: 82upx;
		margin: 40upx auto 0;
		border-radius: 42upx;
		font-size: 36upx;
		font-weight: bold;
		color: #333333;
		background: linear-gradient(360deg, #F4BF5A 0%, #FFECAD 100%);
	}

	.home-box-c {
		display: flex;
		flex-wrap: wrap;
	}

	.home-box-item {
		margin-left: 40upx;
		margin-top: 24upx;
	}

	.home-box-text3 {
		font-size: 20upx;
		color: #333333;
		text-align: center;
		margin-top: 32upx;
	}

	.home-box-list {
		width: 80upx;
		height: 80upx;
		background-color: #FFEDC3;
	}

	.home-box-tt {
		font-size: 16upx;
		color: #CB5302;
		line-height: 40upx;
		text-align: center;
	}

	.home-box-bb {
		width: 80upx;
		height: 52upx;
		background-image: url(../../static/home/icon_qd1.png);
		background-size: 80upx 52upx;
	}

	.home-box-list2 {
		width: 80upx;
		height: 80upx;
		background-color: #F1F1F1;
	}

	.home-box-tt2 {
		font-size: 16upx;
		color: #D0D0D0;
		line-height: 40upx;
		text-align: center;
	}

	.home-box-bb2 {
		width: 80upx;
		height: 52upx;
		background-image: url(../../static/home/icon_qd2.png);
		background-size: 80upx 52upx;
	}

	.home-popup-close {
		width: 48upx;
		height: 48upx;
		margin: 48upx auto 0;
	}

	.home-popup-close>image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}

	.home-district {
		padding: 30upx 0;
		width: 100%;
		/* display: flex;
		flex-wrap: wrap;
		justify-content: flex-start; */
		background-color: #FFFFFF;
		margin-top: 20upx;
	}

	.home-district-header {
		font-size: 30upx;
		color: #333333;
		padding-left: 28upx;
		padding-right: 24upx;
		margin-bottom: 30upx;
		font-weight: PingFang-SC-Regular;
	}

	// 分类
	.district-item2 {
		width: 22%;
		// margin-left: 32upx;
		display: inline-block;
	}

	.district-item2 .district-text {
		font-size: 28upx;
		color: #FFE9E9;
		text-align: center;
		display: inline-block;
		width: 100%;
		// position: relative;
		margin-top: 20upx;
		// padding: 32upx 0 16upx 0;
	}

	.district-item2 .active {
		position: relative;
		padding-bottom: 16upx;
		font-weight: bold;
		color: #FFFFFF;
	}

	.active::after {
		content: "";
		position: absolute;
		width: 40upx;
		height: 4upx;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
		border-radius: 2upx;
		background-color: #FFFFFF;
	}

	.classification-conter {
		position: absolute;
		top: 0;
		right: 110upx;
		width: 46upx;
		height: 52upx;
		margin: 20upx 0 10upx 0;
		background: linear-gradient(272deg, #EF343D 0%, rgba(222, 59, 67, 0) 100%);
		opacity: 1;
	}

	.classification {
		width: 17.2%;
		height: 52upx;
		position: absolute;
		top: 0;
		right: 0;
		margin: 18upx 0 10upx 0;
		padding: 0 10upx 0 10upx;
		background-color: #EF343D;
		// border-radius:30upx 0 0 30upx ;

	}

	.classification image {
		width: 40upx;
		height: 40upx;
		vertical-align: top;
	}

	.classification text {
		font-size: 28upx;
		color: #FFFFFF;
		margin-left: 6upx;
	}

	// 购票
	.addCon {
		box-sizing: border-box;
		width: 702upx;
		margin: 24upx auto 0;
	}

	.ticket {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin: 24upx 0 0 0;
		box-sizing: border-box;
		// padding: 0 24upx;
	}

	.ticket-left {
		width: 340upx;
		height: 160upx;
		overflow: hidden;
		background: #FFFFFF;
		border-radius: 20upx;
		display: flex;
		// padding: 24upx 16upx;
		box-sizing: border-box;
	}

	.ticket-right {
		width: 340upx;
		// height: 136upx;
		height: 160upx;
		background: #FFFFFF;
		border-radius: 20upx;
		display: flex;
		// padding: 24upx 16upx;
		box-sizing: border-box;
	}

	.ticket-img {
		// width: 88upx;
		// height: 88upx;
		width: 340upx;
		height: 160upx;
	}

	.ticket-img>image {
		// width: 100%;
		// height: 100%;
		width: 340upx;
		height: 160upx;
		vertical-align: top;
	}

	.ticket-conter {
		margin-left: 8upx;
	}

	.ticket-conterT {
		font-size: 32upx;
		color: #333333;
		font-family: PingFang SC-Bold, PingFang SC;
		font-weight: bold;
		position: relative;
		display: inline-block;
	}

	.ticket-label {
		position: absolute;
		top: 4upx;
		right: -76upx;
		width: 66upx;
		height: 32upx;
		line-height: 32upx;
		background: linear-gradient(272deg, #FF3A43 0%, #FF9F74 100%);
		border-radius: 20upx 20upx 20upx 0upx;
		font-size: 22upx;
		color: #FFFFFF;
		text-align: center;
		font-weight: 500;
	}

	.ticket-conterB {
		font-size: 24upx;
		color: #9C9C9C;
		margin-top: 10upx;
	}

	//客服
	.popup-kf {
		width: 400upx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2000;
		// background-color: #FFFFFF;
	}

	.popup-kf-img {
		width: 400upx;
		height: 400upx;
	}

	.popup-kf-img>image {
		width: 100%;
		height: 100%;
	}

	.home-popup2 {
		width: 528upx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2000;
	}

	.home-box2 {
		width: 100%;
		// height: 512upx;
	}

	.home-box2>image {
		width: 100%;
		height: 100%;
	}

	.home-popup2-close {
		width: 48upx;
		height: 48upx;
		margin: 0 auto 0;
	}

	.home-popup2-close>image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}

	.pass {
		width: 702upx;
		height: 66upx;
		margin: 20upx auto 0;
		background-color: white;
		border-radius: 10upx;
		padding-left: 20upx;
		padding-right: 12upx;
		display: flex;
		justify-content: space-between;
	}

	.passL {
		display: flex;
		justify-content: flex-start;
	}

	.passMessage {
		height: 42upx;
		margin-top: 12upx;
		display: flex;
		justify-content: flex-start;
	}

	.passMessageL {
		width: 36upx;
		height: 36upx;
		margin-top: 16upx;
	}

	.passMessageL>image {
		width: 100%;
		height: 100%;
	}

	.passMessageR {
		width: 102upx;
		height: 42upx;
		font-weight: bold;
		font-size: 30upx;
		line-height: 42upx;
		text-align: center;
		margin-left: 20upx;
		margin-top: 12upx;
	}

	.passData {
		height: 34upx;
		margin-top: 16upx;
		margin-left: 16upx;
		font-size: 24upx;
		color: #333333;
		font-weight: 400;
		line-height: 34upx;
		text-align: center;
	}

	.passR {
		width: 130upx;
		height: 42upx;
		background-color: #FFF2F2;
		color: #EF343D;
		line-height: 42upx;
		border-radius: 6upx;
		margin: 12upx 0;
		text-align: center;
		font-size: 24upx;
		font-weight: 500;

	}
</style>
