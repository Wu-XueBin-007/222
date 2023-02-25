import Enum from '../enum'

/**
 * 枚举类：订单支付方式
 * PayTypeEnum
 */
export default new Enum([{
		key: 'BALANCE',
		name: '我的钱包',
		value: 10
	},
	{
		key: 'WECHAT',
		name: '微信支付',
		value: 20
	},
	{
		key: 'ZHIFUBAO',
		name: '支付宝支付',
		value: 30
	},
	{
		key: 'ConsumptionQuota',
		name: '权益消费额度',
		value: 100
	}
])
