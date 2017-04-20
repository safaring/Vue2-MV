/*
	https://api.imjad.cn/cloudmusic/index.html
*/
const baseUrl = 'https://api.imjad.cn/cloudmusic/'

export default {
	getMv (id) {
	  return baseUrl+'?type=mv&id='+id
	},
	getMvList (key,offset) {
	  return baseUrl+'?type=search&search_type=1004&s='+key+'&offset='+offset
	},
	getMvComments (id) {
	  return baseUrl+'?type=comments&id='+id
	}
}