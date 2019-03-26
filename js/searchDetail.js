
import {id$,class$,query$,tagName$,ajax,ProAjax,HandleSearch,getIdList,HandleSearchSingerById,HandleCdById} from '../public/public.js'
import {searchSingerById,getCdList} from '../public/require.js'
import searchDetailArt from '../view/searchDetail.art'
// import cdSearchPageArt from '../view/cdSearchPage.art'
import {musicPlay} from './musicPlay.js'
import {songerSearchJs} from './songerSearch.js'

function searchDetail(SearchMatch,searchResult,cdContent,keywords){
    // window.location.hash= '#search/detail?keywords='+keywords
    var idList= []
    getIdList(searchResult,idList) //将数据处理获取id列表
    var searchDetailHtml= searchDetailArt({SearchMatch,searchResult,cdContent})
    query$('.search .main').innerHTML= searchDetailHtml
    operation(idList) 
    bestMatchJs()   
    // SingMusicSinger() //歌手处理
    cdListClick() //处理cd列表的点击
}

function operation(idList) {
    var listObj= query$('.singMusic .music-list li','all')
    for(var i=0; i< listObj.length;i++){ //播放单曲页的音乐
        listObj[i].addEventListener('mouseover',function(){
            if(!this.isClick){
                this.style.backgroundColor= '#F4F4F6'
            }   
        })
        listObj[i].addEventListener('mouseleave',function(){
            if(!this.isClick){
                this.style.backgroundColor= ''
            } 
        })
        listObj[i].addEventListener('click',function(){
            listObj.forEach((item,i)=> {
                if(listObj[i].isClick){ //找到上次被点击的那个
                    listObj[i].isClick= false  //将上一次的isClick改为false
                    listObj[i].style.backgroundColor= ''  //移除掉背景色
                    listObj[i].querySelector('.music-list-mid').style.display= "none"
                }
            })
            this.style.backgroundColor= '#E8E8EA'
            this.querySelector('.music-list-mid').style.display= "block"
            this.isClick= true
            // 这里 播放图标显示出来了，所以可以绑定点击事件，发送ajax请求
            this.querySelector('.music-list-mid .icon-bofang').addEventListener('click',function(){
                var id= this.getAttribute('data-songid')
                // console.log(id)
                musicPlay(id,idList,'搜索')//参数1 当前需要播放的id , 参数2 当前id所在的id列表, 参数3：来源哪里 
                // var P19= searchReq()
            })
        })
    }

    switchNav()
function switchNav(){ //切换导航栏
        var singMusic= query$('.search .singMusic')
        var singerMusic= query$('.search .singerMusic')
        var cdPlayer= query$('.search .cdPlayer')
        var searchNav= query$('.search-nav li','all')
        for(var i=0; i< searchNav.length; i++){
			searchNav[i].onclick= function(i){
				return function(){
					for(var j=0; j< searchNav.length; j++){
						searchNav[j].classList.remove('active') //移除所有的active
					}
					this.classList.add('active')
                    switch (i){
                        case 0: 
                        cdPlayer.style.display= 'none'
                        singerMusic.style.display= 'none'
                        singMusic.style.display= 'block';
                        break ;
                        case 1: 
                        cdPlayer.style.display= 'none'
                        singMusic.style.display= 'none'
						singerMusic.style.display= 'block';
                        break ;
                        case 2: 
                        singMusic.style.display= 'none'
                        singerMusic.style.display= 'none';
                        cdPlayer.style.display= 'block'
                        break ;
                                
                    }
					
				}
			}(i)
		}
    }
}
function bestMatchJs(){ //处理最佳匹配
    // var SearchSinger= [] //存放搜索的歌手信息列表
    if(query$('.bestMatch .songer') || query$('.bestMatch .cd')){
        // if(query$('.bestMatch .songer')){
        //     var songer= query$('.bestMatch .songer')
        //     songer.onmouseover= function(){
        //         this.style.backgroundColor= '#F4F4F6'
        //     } 
        //     songer.onmouseleave= function(){
        //         this.style.backgroundColor= ''
        //     } 
        //     songer.onclick= function(){
        //         this.style.backgroundColor= '#E8E8EA'
        //         // 点击发送请求，查询歌手id
        //         // searchSinger(this.getAttribute('data-id')) //调用searchSinger函数并将id传进去 参数1：歌手id
        //         window.location.hash= 'find/singer?id='+this.getAttribute('data-id')
        //     } 
        // }
        if(query$('.search .songer','all')){  
            var songer= query$('.search .songer','all')
            for(var i=0; i < songer.length; i++){
                songer[i].onmouseover= function(){
                    this.style.backgroundColor= '#F4F4F6'
                } 
                songer[i].onmouseleave= function(){
                    this.style.backgroundColor= ''
                } 
                songer[i].onclick= function(){
                    this.style.backgroundColor= '#E8E8EA'
                    // 点击发送请求，查询歌手id
                    // searchSinger(this.getAttribute('data-id')) //调用searchSinger函数并将id传进去 参数1：歌手id
                    window.location.hash= 'find/singer?id='+this.getAttribute('data-id')
                } 
            }
            
        }
        if(query$('.bestMatch .cd')){ //点击 最佳匹配cd
            var cd= query$('.bestMatch .cd')
            cd.onmouseover= function(){
                this.style.backgroundColor= '#F4F4F6'
            } 
            cd.onmouseleave= function(){
                this.style.backgroundColor= ''
            }
            cd.onclick= function(){
                this.style.backgroundColor= '#E8E8EA'
                // searchCd(this.getAttribute('data-id'),cdSearchPageArt) //调用通过id搜索专辑函数
                var id= this.getAttribute('data-id')
                window.location.hash= 'search/detail/cd?id='+id
            }   
        }
    }
}
// function searchSinger(id){
//     var SearchSinger= [] //存放搜索的歌手信息列表
//     var P19= searchSingerById(id)
//     P19.then((res)=>{
//         console.log(res)
//         HandleSearchSingerById(res,SearchSinger)
//         // console.log(SearchSinger)
//         songerSearchJs(SearchSinger) //将数据传进songerSearchJ函数中进行处理
//     },(err)=>{})
// }
function cdListClick(){ //处理cd列表的点击
    var cdList= query$('section .cdPlayer li','all')
    for(var i=0; i< cdList.length; i++){
        cdList[i].onclick= function(){
            var id= this.getAttribute('data-id')
            // searchCd(this.getAttribute('data-id'),cdSearchPageArt) //调用下面封装好的函数，这个函数的功能是：拿到专辑id，和模板引擎，并将数据渲染到页面上
            window.location.hash= 'search/detail/cd?id='+id
        }
    }
}
function searchCd(id,template){  //这个是发送专辑的id并获得数据渲染到页面的, 参数1专辑的id ,参数2：模板art
    var SearchCdList= [] //存放搜索的cd信息列表
    var idList= []
    var P22= getCdList(id)
    P22.then((res)=>{
        HandleCdById(res,SearchCdList)
        getIdList(res.songs,idList) //将数据处理获取id列表
        var from= SearchCdList.name //是为了设置在播放的时候来源
        var cdSearchPageHtml= template({SearchCdList})
        query$('section').innerHTML= cdSearchPageHtml
        // window.location.hash= '#search/detail/cd'
        // 获取 歌曲列表
        var songerList= query$('.cd-search .cd-songList li', 'all')
        for(var i=0; i< songerList.length; i++ ){
            songerList[i].onmouseover= function(){
                if(!this.isClick){
                    this.style.backgroundColor= '#F4F4F6'
                }
            }
            songerList[i].onmouseleave= function(){
                if(!this.isClick){
                    this.style.backgroundColor= ''
                }
            }
            songerList[i].onclick= function(){
                for(var j=0; j< songerList.length; j++){
                    if(songerList[j].isClick){
                        songerList[j].isClick= false
                        songerList[j].style.backgroundColor= ''
                        songerList[j].querySelector('.music-list-mid').style.display= "none"
                    }  
                }
                this.querySelector('.music-list-mid').style.display= "block"
                this.style.backgroundColor= '#E8E8EA'
                this.isClick= true
                this.querySelector('.music-list-mid .icon-bofang').onclick=function(){
                    var id= this.getAttribute('data-id')
                    musicPlay(id,idList,from)//参数1 当前需要播放的id , 参数2 当前id所在的id列表, 参数3：来源哪里 
                }
              
            }
        }
    },(err)=>{})
}

export {
    searchDetail,
    searchCd
}