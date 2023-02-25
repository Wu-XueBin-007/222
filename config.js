let apiUrl = ''

try {
	let version = __wxConfig.envVersion;
	console.log(version, 'version');
	switch (version) {
		// 开发版
		case 'develop':
			apiUrl = 'https://dev.gzrhhj.com/index.php?s=/api/'
			break
			// 体验版
		case 'trial':
			apiUrl = 'https://dev.gzrhhj.com/index.php?s=/api/'
			break
			// 正式版
		case 'release':
			apiUrl = 'https://shop.gzrhhj.com/index.php?s=/api/'
			break
		default:
			apiUrl = 'https://shop.gzrhhj.com/index.php?s=/api/'
	}
} catch (e) {
	apiUrl = 'https://shop.gzrhhj.com/index.php?s=/api/'
}
// apiUrl = 'https://dev.gzrhhj.com/index.php?s=/api/'


module.exports = {
	// 系统名称
	name: "融汇商城",
	// 请求URL
	apiUrl
}
