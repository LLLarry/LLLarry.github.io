
import searchArt from '../view/search.art'
import searchHistoryArt from '../view/searchHistory.art'
import {id$,class$,query$,tagName$,ajax,ProAjax,HandleSearch,handleCd} from '../public/public.js'
import {searchReq,Searchmultimatch} from '../public/require.js'
import {searchDetail} from './searchDetail.js'

var hotSearch= []
function search(pathn){
    // window.location.hash= 'search'
    // window.location.pathname= 'search'
    // history.pushState(null, null, '/search')
    // window.history.pushState(null, null,'/search')
   var P15= ProAjax({
        url: 'http://localhost:3000/search/hot',
    })
    P15.then((res)=>{
        if(res.code === 200){
            hotSearch= res.result.hots
            renderHistory()
            // =========================================在这里进行搜索
            // query$('.search  .searchInput').addEventListener('blur',enterDowm(false))
            query$('.search  .searchInput').onfocus= null
            query$('.search  .searchInput').onfocus= function(){ //获取焦点之后绑定enter
            
                                    document.addEventListener('keydown',function(e){  
                                        if(e.keyCode === 13){
                                            // 发送ajax请求
                                            var keywords= query$('.searchInput').value.trim()
                                            // searchKeywords(keywords)
                                            window.location.hash= '#search/detail?keywords='+keywords
                                        }
                                    })
        
                            }
             //  这个是图片搜索
          id$('iconSearch').onclick= function(){
            var keywords= query$('.searchInput').value.trim()
            // searchKeywords(keywords)
            window.location.hash= '#search/detail?keywords='+keywords
         }
         clickSearch() //在这里调用,也就是点击搜索在这里生效

        }
         

    },(err)=>{})
    

    // function searchKeywords(keywords){
    //     if(!keywords) return //如果搜索框没有内容，则下面的不执行
    //     searchHistory(keywords) //执行搜索历史
    //     var searchResult= [] 
    //     var SearchMatch= [] //多重匹配
    //     var cdContent= [] //专辑容器
    //     console.log('执行search')
    //     // 获取input的value
    //     // query$('.searchInput').value=''
    //     var P16= searchReq(keywords,0,100,1)
    //     var P17= Searchmultimatch(keywords)
    //     var P18= searchReq(keywords,0,50,10)
    //     P16.then((res)=>{
    //         if(res.code === 200){
    //             HandleSearch(res.result,searchResult)
    //             // console.log(searchResult)
    //         }
    //         return P17
    //     },(err)=>{})
    //     .then((res)=>{
    //         SearchMatch = res.result
    //         return P18
    //     },(err)=>{})
    //     .then((res=>{
    //         // console.log(res)
    //         handleCd(res.result,cdContent)
    //         searchDetail(SearchMatch,searchResult,cdContent,keywords)
    //     }),(err)=>{})
    // }

 
    
}
function searchKeywords(keywords){
    if(!keywords) return //如果搜索框没有内容，则下面的不执行
        searchHistory(keywords) //执行搜索历史
        var searchResult= [] 
        var SearchMatch= [] //多重匹配
        var cdContent= [] //专辑容器
        console.log('执行search')
        // 获取input的value
        // query$('.searchInput').value=''
        var P16= searchReq(keywords,0,100,1)
        var P17= Searchmultimatch(keywords)
        var P18= searchReq(keywords,0,50,10)
        P16.then((res)=>{
            if(res.code === 200){
                HandleSearch(res.result,searchResult)
                console.log(searchResult)
            }
            return P17
        },(err)=>{})
        .then((res)=>{
            SearchMatch = res.result
            return P18
        },(err)=>{})
        .then((res=>{
            // console.log(res)
            handleCd(res.result,cdContent)
            searchDetail(SearchMatch,searchResult,cdContent,keywords)
        }),(err)=>{})
}

function searchHistory(keywords){
    var keyArr= JSON.parse(localStorage.getItem('key')) || []
    //===================== 这一步是找到历史缓存重复的删除掉
    var index= -1
    for(var i=0; i< keyArr.length; i++){
        if(keyArr[i] == keywords){
            index= i
        }
    }
    if(index > -1){
        keyArr.splice(index, 1)
    }
    //===================
    keyArr.unshift(keywords)
    localStorage.setItem('key',JSON.stringify(keyArr))
    // renderHistory()
    getLocationAndRender()
}
function renderHistory(){ //将搜索历史记录和热搜显示在页面上
    const searchHtml= searchArt({hotSearch})
    query$('section').innerHTML= searchHtml
    getLocationAndRender()
    cancleHister()
}

function cancleHister(){ //删除历史，只有在页面渲染之后才能删除

     var right= query$('.search .right')
     right.onclick= function(e){

        e= e || window.event
        var searchUl= query$('.search .search-ul')
        var iconX= searchUl.getElementsByTagName('i')
        for(var i= 0; i< iconX.length; i++){
            iconX[i].index= i     
        } 
       if(e.target.nodeName.toLowerCase() === 'i' && e.target.className === "iconfont icon-x"){
           var i= e.target.index
           console.log(i)
           var keyArr= JSON.parse(localStorage.getItem('key')) || []
                        keyArr.splice(i,1)
                        localStorage.setItem('key',JSON.stringify(keyArr))
                        getLocationAndRender()
        }
       if(e.target.nodeName.toLowerCase() === 'i' && e.target.className === "iconfont icon-laji"){  //清空搜索历史
           var keyArr= []
           localStorage.setItem('key',JSON.stringify(keyArr))
           getLocationAndRender()
        }
       if(e.target.nodeName.toLowerCase() === 'span'){ //点击所搜记录搜索
           var keywords= e.target.innerHTML.trim()
        window.location.hash= '#search/detail?keywords='+keywords
       }
     }
}
function getLocationAndRender(){
    var searchArr= JSON.parse(localStorage.getItem('key')) || []  //这两个是获取本地存储的数据，并渲染到页面上
    if(query$('section .search-ul')){
        query$('section .search-ul').innerHTML= searchHistoryArt({searchArr})
    } 
}
function clickSearch(){
    var hotSearchSpan= query$('.hot-search').getElementsByTagName('span')
    for(var i=0; i<hotSearchSpan.length;i++){
        (function(i){
            hotSearchSpan[i].onclick= function(){
                // searchKeywords(this.innerHTML.trim())
                var keywords= this.innerHTML.trim()
                    window.location.hash= '#search/detail?keywords='+keywords
            }
        })(i)
    }
}
export {
    search,
    searchKeywords
}