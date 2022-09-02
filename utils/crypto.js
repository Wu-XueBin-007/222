import CryptoJS from "../node_modules/crypto-js/crypto-js.js";

// des加密
export const encryptDes = (message, key) => {
	var keyHex = CryptoJS.enc.Utf8.parse(key);
	var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.ZeroPadding,
	});
	return encrypted.toString();
};
// 解密
export const decryptDes = (ciphertext, key) => {
	var keyHex = CryptoJS.enc.Utf8.parse(key);
	var decrypted = CryptoJS.DES.decrypt({
			ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
		},
		keyHex, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.ZeroPadding,
		}
	);
	return decrypted.toString(CryptoJS.enc.Utf8);
};