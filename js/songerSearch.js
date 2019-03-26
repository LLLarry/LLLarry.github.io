import {id$,class$,query$,tagName$,ProAjax,HandleSearchCdBySingerId,filters,HandleSingerDesc,getIdList} from '../public/public.js'
import {searchCdBySingerId,searchMvBySingerId,getSongerDescribe} from '../public/require.js'
import songerSearchArt from '../view/songerSearch.art'
import searchCdBySingerIdArt from '../view/searchCdBySingerId.art'
import searchMvBySingIdArt from '../view/searchMvBySingId.art'
import singerDescribeArt from '../view/singerDescribe.art'
import {musicPlay} from './musicPlay.js'
import {searchCd} from './searchDetail.js'
import {mvPlay} from './mvPlay.js'
import cdSearchPageArt from '../view/cdSearchPage.art'
function songerSearchJs(SearchSinger,id){
    window.location.hash= 'find/singer?id='+id
    var idList= [] //存放id的，目的是为了播放音乐使用
    getIdList(SearchSinger.hotSongs,idList)//获取id列表，存放在idList中
    var songerSearchHtml= songerSearchArt({SearchSinger})
    console.log(SearchSinger)
    tagName$('section')[0].innerHTML= songerSearchHtml 
    switchUl(SearchSinger.artist.id,SearchSinger.artist.name,idList) //渲染好以后就调用切换内容的函数 ,参数1： 歌手的id,参数2：歌手名字
    var authorHost= query$('section .authorHost')
    singerHost(authorHost,idList)
}

function switchUl (id,name,idList){ //点击导航，切换内容
    var openulList= query$('section .openul li','all') 
    var authorHost= query$('section .authorHost')
    var authorCd= query$('section .authorCd')
    var authorMv= query$('section .authorMv')
    var authorDeta= query$('section .authorDeta')
    for(var i=0; i< openulList.length; i++){
        openulList[i].onclick= (function(i){
            return function(){
                for(var j=0; j< openulList.length; j++){
                    openulList[j].classList.remove('active')
                }
                this.classList.add('active')
                // 获取四个切换显示的元素所有的有display:none
                authorHost.style.display= "none"
                authorCd.style.display= "none"
                authorMv.style.display= "none"
                authorDeta.style.display= "none"
                switch(i){
                    case 0: singerHost(authorHost,idList) ; break;
                    case 1: reqCd(id,authorCd) ; break;
                    case 2: reqMv(id,authorMv) ; break;
                    case 3: reqSingDetail(id,authorDeta,name) ; break;
                }
            }
        })(i)
    }
}
function singerHost(authorHost,idList){
    authorHost.style.display= "block"
    
    // 获取所有的li
    var list= query$('section .authorHost li','all')
    for(var i=0; i< list.length;i++){
        list[i].onmouseover= function(){
            if(!this.isClick){
                this.style.backgroundColor= '#F4F4F6'
            } 
        } 
        list[i].onmouseleave= function(){
            if(!this.isClick){
                this.style.backgroundColor= ''
            }
        } 
        // background-color: #F4F4F6;
        list[i].onclick= function(){
                for(var j=0; j< list.length; j++){
                    if(list[j].isClick){
                        list[j].isClick= false
                        list[j].style.backgroundColor= ''
                        list[j].querySelector('.music-list-mid').style.display= "none"
                    }   
                }
                this.style.backgroundColor= '#E8E8EA'
            this.isClick= true
            this.querySelector('.music-list-mid').style.display= "block"
            var that= this
            this.querySelector('.music-list-mid .icon-bofang').addEventListener('click',function(){
                var id= this.getAttribute('data-id')
                var musicForm= that.querySelector('.cd-name').innerHTML
                musicPlay(id,idList,musicForm)//参数1 当前需要播放的id , 参数2 当前id所在的id列表, 参数3：来源哪里 
            })
        }
    }
}
function reqCd(id,authorCd){
    var cdContentBySingerId= []
    //发送请求，处理数据，拿到数据将数据渲染到页面上
    var P19= searchCdBySingerId(id)
    P19.then((res)=>{
        HandleSearchCdBySingerId(res,cdContentBySingerId)
        // console.log(cdContentBySingerId)
        var searchCdBySingerIdHtml= searchCdBySingerIdArt({cdContentBySingerId})
        // 获取
        authorCd.innerHTML= searchCdBySingerIdHtml
        authorCd.style.display= "block"
        // 渲染好了，点击专辑，可以跳转到专辑详情页面了
        var listObj= query$('.singer-search .authorCd li', 'all')
        for(var i=0; i < listObj.length; i++){
            listObj[i].onclick= function(){
                var id= this.getAttribute('data-id')
                searchCd(id,cdSearchPageArt)
            }
        }
    },(err)=>{})
}
function reqMv(id,authorMv){
    var mvContentBySingerId= []
    var P20= searchMvBySingerId(id)
    P20.then((res)=>{
        // console.log(res)
        if(res.mvs && res.mvs.length > 0){
            for(var i=0; i< res.mvs.length; i++){
                res.mvs[i].playCount= filters(res.mvs[i].playCount)
            }
        }
        mvContentBySingerId= res
        var searchMvBySingIdHtml= searchMvBySingIdArt({mvContentBySingerId})
        authorMv.innerHTML= searchMvBySingIdHtml
        authorMv.style.display= "block"
        // 点击播放mv
        var Mvlist= query$('.singer-search .authorMv li', 'all')
        for(var i=0;i< Mvlist.length; i++ ){
            Mvlist[i].onclick= function(){
                var id= this.getAttribute('data-id')
                mvPlay(id)
            }
        }
    },(err)=>{})
}
function reqSingDetail(id,authorDeta,name){
    var singerDesc= []
    var P21= getSongerDescribe(id)
    P21.then((res)=>{
        // console.log(res)
        singerDesc.name= name
        HandleSingerDesc(res,singerDesc)
        var singerDescribeHtml= singerDescribeArt({singerDesc})
        authorDeta.innerHTML= singerDescribeHtml
        authorDeta.style.display= "block"
    },(err)=>{})
}
// 其那面的四个函数是对应的四个切换按钮

export {
    songerSearchJs
}