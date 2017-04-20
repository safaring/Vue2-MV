export function listCover (url) {
  return 'background-image:url('+url+'?param=300y180)'
}

export function playerCover (url) {
  return 'background-image:url('+url+'?param=480y263)'
}

export function userCover (url) {
  return url+'?param=50*50'
}

export function numberConversion (num) {
  var n = parseInt(num/10000)
  if(n == 0){
  	return num
  }else {
  	return n+'万'
  }
}

export function timeToDate (time) {
  var unixTimestamp = new Date( time ) ;
  return unixTimestamp.toLocaleString();
}

Date.prototype.toLocaleString = function() {
  if(this.getFullYear() == (new Date()).getFullYear()){
  	return (this.getMonth() + 1) + "月" + this.getDate() + "日"
  }else {
  	return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日"
  }
};
