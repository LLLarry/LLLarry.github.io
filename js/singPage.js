
import {id$,class$,query$,HandleSearchSingerById,scroll} from '../public/public.js'
import {getHotSinger,getSongerList,searchSingerById} from '../public/require.js'
import singPageArt from '../view/singPage.art'
import singPageListArt from '../view/singPageList.art'
import {songerSearchJs} from './songerSearch.js'
function singPage(){
    var hotSingerContent= [] //热搜歌手容器
    // 发送热门歌手请求
    var offset1= 0
    var limit1= 30  
    var P22= getSongerList(1001,'#',offset1,limit1)
    P22.then((res)=>{
        hotSingerContent.artists= res.artists
        hotSingerContent.more= res.more
        query$('.find .main').innerHTML= singPageArt()
        var singPageListHtml= singPageListArt({hotSingerContent})
        query$('.find .singPage-bottom').innerHTML= singPageListHtml
        // ================================================== scroll加载更多事件
        var mainEle= query$('.find .main')
        if(hotSingerContent.more){
            scroll(mainEle,myScroll)
        }
        function myScroll(){ //这里调用卷曲函数
            offset1 += limit1
            var P23= getSongerList(1001,'#',offset1,limit1)
            P23.then((res)=>{
                console.log(res)
                var hotSingerContentScroll= [] //热搜歌手容器
                hotSingerContentScroll.artists= res.artists
                hotSingerContentScroll.more= res.more
                hotSingerContent.artists= hotSingerContent.artists.concat(hotSingerContentScroll.artists)
                var singPageListHtml= singPageListArt({hotSingerContent})
                query$('.find .singPage-bottom').innerHTML= singPageListHtml
                clickSearch()
                getSongerDetail()
                if(hotSingerContentScroll.more){ //当more为true的时候才执行
                    scroll(mainEle,myScroll)
                }     
            })   
        }
// =====================================================
        clickSearch()
        getSongerDetail()//没有点击的时候也要绑定点击事件，发送请求
    },(err)=>{})
}
function clickSearch(){ //点击搜索
    var ulObj= query$('.find .singPage-top ul','all')
    var listTop= ulObj[0].querySelectorAll('li')
    var listMid= ulObj[1].querySelectorAll('li')
    var listBot= ulObj[2].querySelectorAll('li')
    addAndRemoveClass(listTop,listTop,listMid,listBot) //这三个是点击添加或删除active
    addAndRemoveClass(listMid,listTop,listMid,listBot)
    addAndRemoveClass(listBot,listTop,listMid,listBot)
}

function addAndRemoveClass(listObj,listTop,listMid,listBot){//参数1：需要添加属性的元素列表， 参数2,3,4是三个元素列表
    for(var i=0; i < listObj.length; i++){
        if( i > 0){
             listObj[i].onclick= function(){
                 for(var j=0; j < listObj.length; j++){
                     listObj[j].classList.remove('active')
                 }
                 this.classList.add('active')
                 getInnerHtmlAndReq(listTop,listMid,listBot)
             }
        }
     }
}
function getInnerHtmlAndReq(listTop,listMid,listBot){ 
    var cat= 1001
    var initial= ''
    var topStr= getActiveEleInnerHtml(listTop)
    var midStr= getActiveEleInnerHtml(listMid)
    var botStr= getActiveEleInnerHtml(listBot)
   if( botStr === '热门'){
       if(topStr === '华语'){
            switch(midStr){
                case '男歌手' : cat= 1001 ; break ;
                case '女歌手' : cat= 1002 ; break ;
                case '乐队组合' : cat= 1003 ; break ;
            }
       }else if(topStr === '欧美'){
            switch(midStr){
                case '男歌手' : cat= 2001 ; break ;
                case '女歌手' : cat= 2002 ; break ;
                case '乐队组合' : cat= 2003 ; break ;
            }
       }else if(topStr === '日本'){
            switch(midStr){
                case '男歌手' : cat= 6001 ; break ;
                case '女歌手' : cat= 6002 ; break ;
                case '乐队组合' : cat= 6003 ; break ;
            }
       }else if(topStr === '韩国'){
            switch(midStr){
                case '男歌手' : cat= 7001 ; break ;
                case '女歌手' : cat= 7002 ; break ;
                case '乐队组合' : cat= 7003 ; break ;
            }
       }else if(topStr === '其他'){
            switch(midStr){
                case '男歌手' : cat= 4001 ; break ;
                case '女歌手' : cat= 4002 ; break ;
                case '乐队组合' : cat= 4003 ; break ;
            }
       }
   }else{
    initial= botStr.toLowerCase()
            if(topStr === '华语'){
                switch(midStr){
                    case '男歌手' : cat= 1001 ; break ;
                    case '女歌手' : cat= 1002 ; break ;
                    case '乐队组合' : cat= 1003 ; break ;
                }
        }else if(topStr === '欧美'){
                switch(midStr){
                    case '男歌手' : cat= 2001 ; break ;
                    case '女歌手' : cat= 2002 ; break ;
                    case '乐队组合' : cat= 2003 ; break ;
                }
        }else if(topStr === '日本'){
                switch(midStr){
                    case '男歌手' : cat= 6001 ; break ;
                    case '女歌手' : cat= 6002 ; break ;
                    case '乐队组合' : cat= 6003 ; break ;
                }
        }else if(topStr === '韩国'){
                switch(midStr){
                    case '男歌手' : cat= 7001 ; break ;
                    case '女歌手' : cat= 7002 ; break ;
                    case '乐队组合' : cat= 7003 ; break ;
                }
        }else if(topStr === '其他'){
                switch(midStr){
                    case '男歌手' : cat= 4001 ; break ;
                    case '女歌手' : cat= 4002 ; break ;
                    case '乐队组合' : cat= 4003 ; break ;
                }
        }
   }
//  发送请求
    var offset= 0
    var limit= 30
   var P23= getSongerList(cat,initial,offset,limit)
   P23.then((res)=>{
    console.log(res)
    var hotSingerContent= [] //热搜歌手容器
    hotSingerContent.artists= res.artists
    hotSingerContent.more= res.more
    console.log(hotSingerContent)
    var singPageListHtml= singPageListArt({hotSingerContent})
    query$('.find .singPage-bottom').innerHTML= singPageListHtml
    // 找到滚动的父元素
    // ================================================== scroll加载更多事件
    var mainEle= query$('.find .main')
    if(hotSingerContent.more){
        scroll(mainEle,myScroll)
    }
    function myScroll(){ //这里调用卷曲函数
        offset += limit
        var P23= getSongerList(cat,initial,offset,limit)
        P23.then((res)=>{
            var hotSingerContentScroll= [] //热搜歌手容器
            hotSingerContentScroll.artists= res.artists
            hotSingerContentScroll.more= res.more
            hotSingerContent.artists= hotSingerContent.artists.concat(hotSingerContentScroll.artists)
            var singPageListHtml= singPageListArt({hotSingerContent})
            query$('.find .singPage-bottom').innerHTML= singPageListHtml
            getSongerDetail()
            if(hotSingerContentScroll.more){ //当more为true的时候才执行
                scroll(mainEle,myScroll)
            }     
        })   
    }
// =====================================================
    getSongerDetail() //点击之后要重新获取
   },(err)=>{})
}
function getActiveEleInnerHtml(obj){ //获取带有active元素的innerHTML
    for(var i=0; i< obj.length; i++){
        if(obj[i].className === 'active'){
            return obj[i].innerHTML
        }
    }
    return ''
}

function getSongerDetail(){ //点击列表，获得歌手详细信息
     // 这里是可以点击歌手列表的
     var singList= query$('.find .singPage .singPage-bottom li','all')
     for(var i=0; i< singList.length; i++){
         singList[i].onclick= function(){
            var id= this.getAttribute('data-id')
            getSingerById(id)
         }   
     }
}

function getSingerById(id){
    var SearchSinger= []
    var P24= searchSingerById(id)  //这里直接套用searchDetail.js中的方法,调用songerSearchJs函数
             P24.then((res)=>{
                 HandleSearchSingerById(res,SearchSinger)
                 songerSearchJs(SearchSinger,id) //将数据传进songerSearchJ函数中进行处理
             },(err)=>{})
}
export {
    singPage,
    getSingerById
}