
function id$(id){
	return document.getElementById(id)
}
 function class$(tt){
 	return document.getElementsByClassName(tt)
 }
 function query$(selector,sum) {
 	if(sum == undefined){
 		return document.querySelector(selector)
 	}
 		return document.querySelectorAll(selector)
 }
 function tagName$(dom,par){
	 if(arguments.length == 2){
		return par.getElementsByTagName(dom)
	 }else{
		return document.getElementsByTagName(dom)
	 }	 
 }

 function ajax(obj){
		obj= obj || {}
		var method= obj.method || 'get'
		var url= obj.url || ''
		var params= obj.params || ''
		var asyn= obj.asyn || true
		var success= obj.success || function(){}
	 var tt= ''
	 var xhr= null
	 if(window.XMLHttpRequest){
		 xhr= new XMLHttpRequest()	 
	 }else {
		 xhr= new ActiveXObject('Microsoft.XMLHttp')
	 }
	 if(params){
		for(var key in params){
			tt += '&' + key + '=' +params[key]
		}
		tt= tt.substr(1)
	}
	 if(method == 'post'){  //post请求
		xhr.setRequ
		xhr.open('post',url,asyn)
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
		xhr.send(tt)
	 }else{  //get请求
		xhr.open('get',url+'?'+tt,asyn)
		xhr.send(null)
	 }
	 xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			　　　　　　success(JSON.parse(xhr.responseText));
		}
	 }
 }

 
 function ProAjax(obj){
	return new Promise(function(resolve,reject){
			obj= obj || {}
			var method= obj.method || 'get'
			var url= obj.url || ''
			var params= obj.params || ''
			var asyn= obj.asyn || true
			// var success= obj.success || function(){}
		 var tt= ''
		 var xhr= null
		 if(window.XMLHttpRequest){
			 xhr= new XMLHttpRequest()	 
		 }else {
			 xhr= new ActiveXObject('Microsoft.XMLHttp')
		 }
		 if(params){
			for(var key in params){
				tt += '&' + key + '=' +params[key]
			}
			tt= tt.substr(1)
		}
		 if(method == 'post'){  //post请求
			xhr.setRequ
			xhr.open('post',url,asyn)
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
			xhr.send(tt)
		 }else{  //get请求
			xhr.open('get',url+'?'+tt,asyn)
			xhr.send(null)
		 }
		 xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				resolve(JSON.parse(xhr.responseText));
			}
			// else{
			// 	console.log('fffff')
			// 	reject('获取失败')
			// }
		 }
		
	})
 }

 function filters(num){ //过滤器
	num= parseInt(num)
	if(num > 100000){
		return parseInt(num / 10000)+'万'
	}else {
		return num
	}
}
function creatTime(time,argum){ //时间过滤器
	var dt= new Date(time)
	var Y= 	dt.getFullYear()
	var M=	(dt.getMonth()+1)
	var D=	dt.getDate()
	M= M>=10? M : ('0'+M)
	D= D>=10? D : ('0'+D)
if(arguments.length == 1){
	return `${Y}-${M}-${D}`
}else {
	var h= dt.getHours() 
	var mi= dt.getMinutes()
	var s= dt.getSeconds()
	h= h>=10? h : ('0'+h)
	mi= mi>10? mi : ('0'+mi)
	s= s>=10? s : ('0'+s)
	return `${Y}-${M}-${D} ${h}:${mi}:${s}`
}




}

function timeFilter(time,argu){
	if(arguments.length === 2){
		Math.round(parseInt(time))
	}else{
	time= Math.round(parseInt(time/1000))
	}
	var t= parseInt(time/60)
	var h= Math.round(time % 60)
	
	if(t < 10){
		t= '0'+t
	}
	if(h < 10){
		h= '0'+ h
	}
	return `${t}:${h}`
}

function parseLyric(lrc) { //解析歌词
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for(var i=0;i<lyrics.length;i++){
        var lyric = decodeURIComponent(lyrics[i]);
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        if(!timeRegExpArr)continue;
        var clause = lyric.replace(timeReg,'');
        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
        }
    }
    return lrcObj;
	}

	function Handlecomments(res,comments){ //歌曲评论数据的处理
		comments.hotComments= []
		comments.comments=[]
		comments.total= res.total
		// comments.comments= res.comments
		if(res.comments.length > 0){
			for(var i=0;i<res.comments.length;i++){
				var obj2= { 
					commentId: res.comments[i].commentId,//评论id
					content: res.comments[i].content,//评论内容
					time: creatTime(res.comments[i].time), //创建时间
					avatarUrl: res.comments[i].user.avatarUrl,  //头像地址
					nickname: res.comments[i].user.nickname, //名称
					userId: res.comments[i].user.userId, //评论者id
					beReplied: res.comments[i].beReplied, //回复。。
					userId: res.comments[i].user.userId, //回复。。
					likedCount: res.comments[i].likedCount
				}
				comments.comments.push(obj2)
			}
		}
		if(res.hotComments){ //这里判断是否有热评，有的话就提取出来
			var length= res.hotComments.length > 10? 10: res.hotComments.length
			for(var i=0;i<length;i++){
				var obj= { 
					content: res.hotComments[i].content,//评论
					likedCount: res.hotComments[i].likedCount,//喜欢数量
					time: creatTime(res.hotComments[i].time), //创建时间
					avatarUrl: res.hotComments[i].user.avatarUrl,  //头像地址
					nickname: res.hotComments[i].user.nickname, //名称
					userId: res.hotComments[i].user.userId, //评论者id
					beReplied: res.hotComments[i].beReplied //回复。。
				}
				comments.hotComments.push(obj)
			}
		}
	}
	function HandleIncludeThisSong(res,includeThisSong){ //处理是否包含此歌的歌单
		if(res.playlists.length > 0){
			for(var i=0; i< res.playlists.length;i++){
				var obj= {}
				obj.id= res.playlists[i].id
				obj.name= res.playlists[i].name
				obj.coverImgUrl= res.playlists[i].coverImgUrl
				obj.playCount= filters(res.playlists[i].playCount)
				includeThisSong.push(obj)
			}
		}
	}
	function HandleSimilarSong(res,similarSong){ //处理相似歌曲 
		
		if(res.songs.length > 0){
			for(var i=0; i< res.songs.length;i++){
				var obj= {}
				obj.artists= []
				obj.name= res.songs[i].name
				obj.mvid= res.songs[i].mvid
				obj.id= res.songs[i].id
				for(var j=0;j<res.songs[i].artists.length; j++){
					obj.artists.push(res.songs[i].artists[j].name)
				}
				obj.artists= obj.artists.join('/')
				similarSong.push(obj)	
			}
		}
	}
	function HandleSearch(res,searchResult){
		searchResult.songCount= res.songCount //搜索歌曲数量
		for(var i=0;i<res.songs.length;i++){
			var obj= {}
			obj.artists= []
			obj.album= {}
			obj.name= res.songs[i].name
			obj.id= res.songs[i].id
			obj.mvid= res.songs[i].mvid
			obj.time= timeFilter(res.songs[i].duration)
			obj.alias= res.songs[i].alias.join(',')
			obj.album.id= res.songs[i].album.id //专辑id
			obj.album.name= res.songs[i].album.name
			if(res.songs[i].artists.length > 0){
				var obj2= {}
				for(var j=0; j < res.songs[i].artists.length; j++){
					obj2.id= res.songs[i].artists[j].id
					obj2.name= res.songs[i].artists[j].name
					obj.artists.push(obj2)

				}

			}
			searchResult.push(obj)	
		}
	}
	function getIdList(data,idList){
		for(var i=0; i< data.length; i++){
			idList.push({id:data[i].id})
		}
	}
	function handleCd(res,cdContent){  //处理cd
		if(res.albums && res.albums.length >0){
			for(var i=0; i< res.albums.length; i++){
				var obj= {}
				obj.artist= {}
				obj.picUrl= res.albums[i].picUrl
				obj.id= res.albums[i].id
				obj.name= res.albums[i].name
				obj.artist.name= res.albums[i].artist.name
				obj.artist.id= res.albums[i].artist.id
				obj.artist.alia= ''
				if(res.albums[i].artist.alia && res.albums[i].artist.alia.length > 0){
					obj.artist.alia= res.albums[i].artist.alia[0]
				}
				obj.alias= ''
				if(res.albums[i].alias && res.albums[i].alias.length > 0){
					obj.alias= res.albums[i].alias[0]
				}
				cdContent.push(obj)
			}
		}
	}
	function HandleSearchSingerById(res,SearchSinger){ //处理通过id搜索歌手
		SearchSinger.artist= {}
		SearchSinger.hotSongs=[]
		SearchSinger.artist.alias= res.artist.alias[0]
		SearchSinger.artist.id= res.artist.id
		SearchSinger.artist.img1v1Url= res.artist.img1v1Url
		SearchSinger.artist.musicSize= res.artist.musicSize
		SearchSinger.artist.mvSize= res.artist.mvSize
		SearchSinger.artist.name= res.artist.name
		SearchSinger.artist.albumSize= res.artist.albumSize
		SearchSinger.artist.briefDesc= res.artist.briefDesc
		SearchSinger.hotSongsNum= ''
		SearchSinger.hotSongs= []
		if(res.hotSongs && res.hotSongs.length>0){
			SearchSinger.hotSongsNum= res.hotSongs.length
			for(var i=0; i< res.hotSongs.length; i++){
				var obj= {}
				obj.al= {}
				obj.al.name= res.hotSongs[i].al.name
				obj.al.id= res.hotSongs[i].al.id
				obj.name= res.hotSongs[i].name
				obj.alia= res.hotSongs[i].alia[0]
				obj.mv= res.hotSongs[i].mv
				obj.time= timeFilter(res.hotSongs[i].dt)
				obj.ar= {}
				obj.ar.id= res.hotSongs[i].ar[0].id
				obj.ar.name= res.hotSongs[i].ar[0].name
				obj.id= res.hotSongs[i].id
				SearchSinger.hotSongs.push(obj)
			}
		}

	}
	function HandleSearchCdBySingerId(res,cdContentBySingerId){ //处理通过歌手id搜索的专辑
		cdContentBySingerId.hotAlbums=[]
		if(res.hotAlbums && res.hotAlbums.length > 0){
			for(var i=0;i< res.hotAlbums.length; i++){
				var obj= {}
				obj.name= res.hotAlbums[i].name
				obj.id= res.hotAlbums[i].id
				obj.publishTime= creatTime(res.hotAlbums[i].publishTime)
				obj.picUrl= res.hotAlbums[i].picUrl
				cdContentBySingerId.hotAlbums.push(obj)
			}
		}
	}
	function HandleSingerDesc(res,singerDesc){
		singerDesc.briefDesc= res.briefDesc
		singerDesc.introduction= []
		if(res.introduction && res.introduction.length> 0){
			for(var i=0;i < res.introduction.length; i++){
				var obj= {}
				obj.ti= res.introduction[i].ti
				obj.txt= parseText(res.introduction[i].txt)
				singerDesc.introduction.push(obj)
			}
		}

	}
	function parseText(str){
		return str.split('\n')
	}
	function HandleCdById(res,SearchCdList){ //处理通过id获取专辑的数据
		SearchCdList.name= res.album.name
		SearchCdList.description= res.album.description
		SearchCdList.publishTime= creatTime(res.album.publishTime)
		SearchCdList.picUrl= res.album.picUrl
		SearchCdList.commentCount= filters(res.album.info.commentCount)
		SearchCdList.shareCount= filters(res.album.info.shareCount)
		SearchCdList.commentCount= filters(res.album.info.commentCount)
		SearchCdList.artist= {}
		SearchCdList.artist.name= res.album.artist.name
		SearchCdList.artist.id= res.album.artist.id
		SearchCdList.id= res.album.id
		SearchCdList.songs= []
		SearchCdList.long= res.songs.length
		for(var i=0; i< res.songs.length; i++){
			var obj= {}
			obj.name= res.songs[i].name
			obj.dt= timeFilter(res.songs[i].dt)
			obj.id= res.songs[i].privilege.id
			obj.mv= res.songs[i].mv
			obj.pop= res.songs[i].pop

			obj.alia= res.songs[i].alia.length > 0 ? res.songs[i].alia[0] : ''
			obj.al= []
			for(var j=0; j< res.songs[i].ar.length; j++){
				var obj2= {}
				obj2.id= res.songs[i].ar[j].id
				obj2.name= res.songs[i].ar[j].name
				obj.al.push(obj2)
			}
			SearchCdList.songs.push(obj)
		}

	}
	function scroll(dom,callback){ //卷曲底部处理函数
		var isFirst= true
		dom.onscroll= function(e){
			e= e || window.event
			var target= e.target
			var maxScrollHeight= target.scrollHeight - target.offsetHeight //卷曲做大高度
			// console.log(target.scrollTop,maxScrollHeight)
			if(10*target.scrollTop / maxScrollHeight >= 9){ //target.scrollTop向上卷曲的实时距离 / 卷曲做大高度 >= 0.9
				if(isFirst){
					isFirst= false
					callback && callback()
				}    
			}
		} 
	}
	function parseUrlHash(url){ //解析url的hash值
		var str= ''
		str= url.substring((url.indexOf('#')+1))
		return str
	}
	function parseUrlParmas(url){ //解析url参数部分
		url= parseUrlHash(url)
		url= url.substring(url.indexOf('?')+1)
		var arr= url.split('&')
		var obj= {}
		for(var i=0; i < arr.length; i++ ){
			var arr2= arr[i].split('=')
			obj[arr2[0]]= decodeURI(arr2[1])
		}
		// console.log(obj)
		return obj
	}
	function getAttr(obj,attr){ //获取元素的css内部的属性值
		if(obj.currentStyle){
			return obj.currentStyle[attr]
		}else{
			return getComputedStyle(obj,false)[attr]
		}
	}

export {
	id$,
	class$,
	query$,
	tagName$,
	ajax,
	ProAjax,
	filters,
	creatTime,
	timeFilter,
	parseLyric,
	Handlecomments,
	HandleIncludeThisSong,
	HandleSimilarSong,
	HandleSearch,
	getIdList,
	handleCd,
	HandleSearchSingerById,
	HandleSearchCdBySingerId,
	HandleSingerDesc,
	HandleCdById,
	scroll,
	parseUrlHash,
	parseUrlParmas,
	getAttr
}