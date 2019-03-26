import {id$,class$,query$,ajax,ProAjax,filters,creatTime,timeFilter} from '../public/public.js'
import {musicPlay} from './musicPlay.js'
import findArt from '../view/find.art'
import recomArt from '../view/recommendDeatil.art'
import personRecomArt from '../view/personRecom.art'
import {singPage} from './singPage.js'
var bannerList= [] //轮播图
var musicList= [] //推荐歌单
var Sole= [] //独家放送
var newSong= [] //最新音乐
var recommendMv= [] //推荐mv
var anchorStation= [] //主播电台
var recomList= [] //推荐详细列表

var leftDiv= document.createElement('div')
leftDiv.className= "left"
leftDiv.innerHTML= '<'
var rightDiv= document.createElement('div')
rightDiv.className= "right"
rightDiv.innerHTML= '>'
var eleLeft= null
var eleRight= null
var ifFirst= true //是不是第一次调用click
var timer= null
var aList= null //banner横条
function find(pathn){
    //点击发现音乐就要发送请求
    //获取轮播图
    // window.location.hash= 'find'
    // window.location.pathname= 'find'
    var P0= ProAjax({
        url: 'http://localhost:3000/banner'
    })
    // 首先发送 推荐歌单 ，
    var P1= ProAjax({
        url: 'http://localhost:3000/personalized'
    })
    // 独家放送

    var P2= ProAjax({
        url: 'http://localhost:3000/personalized/privatecontent'
    })
     // 最新音乐

    var P3= ProAjax({
        url: 'http://localhost:3000/personalized/newsong'
    })
      // 推荐mv

    var P4= ProAjax({
        url: 'http://localhost:3000/personalized/mv'
    })
     // 主播电台
     var P5= ProAjax({
        url: 'http://localhost:3000/personalized/djprogram'
    })

    P0.then(function(res){
        // console.log(res)
        bannerList= res.banners
        return P1
    },function(err){})
    P1.then(function(res){
        // console.log(res)
        musicList= res.result.slice(0,12)
       for(var i=0; i< musicList.length; i++){
        musicList[i].playCount= filters(musicList[i].playCount)
       }
        return P2
    },function(err){})
    .then(function(res){
        // console.log(res)
        Sole=res.result
        return P3
    },function(err){})
    .then(function(res){
        // console.log(res)
        newSong= res.result
        return P4
    },function(err){})
    .then(function(res){
        // console.log(res)
        recommendMv= res.result
        return P5
    },function(err){})
    .then(function(res){
        // console.log(res)
        anchorStation= res.result
        //走到这一步的时候，说明前面几个数据已经获取好了，所以，我们需要在这里将页面渲染
        // console.log(bannerList)
        renderFind()
        //渲染页面之后轮播图要开始转动
        bannerFun()
        //渲然之后给推荐歌单绑定时间
        clickRecom()

    },function(err){})

function renderFind(){  //渲染页面的函数
//     var findHtml= findArt({musicList,Sole,newSong,recommendMv,anchorStation,bannerList})
//    query$('section').innerHTML= findHtml
   var findHtml= findArt()
   query$('section').innerHTML= findHtml
   var personRecomHtml= personRecomArt({musicList,Sole,newSong,recommendMv,anchorStation,bannerList})
   query$('.find .main').innerHTML= personRecomHtml
//    点击切换个性推荐个歌手
   var listObj= query$('.find-nav .openul li','all') //获取导航li
   listObj[0].onclick= function(){
        listObj[1].classList.remove('active')
        this.classList.add('active')
        find()
   }
   listObj[1].onclick= function(){
        listObj[0].classList.remove('active')
        this.classList.add('active')
        singPage()
    }
   
}

function bannerFun(){ //轮播图函数
    var arr= []
    var list= query$('.Cooldog_container ul li','all')
    for(var i=0; i< list.length; i++){
        arr.push([getAttr(list[i],'transform'),getAttr(list[i],'opacity'),getAttr(list[i],'zIndex')])
        // console.log([getAttr(list[i],'transform'),getAttr(list[i],'opacity'),getAttr(list[i],'zIndex')])
    }
    //banner线的宽度设定 
    aList= query$('.buttons a','all')
    for(var i=0; i<aList.length; i++){
        aList[i].style.width= 180/aList.length + 'px'
    }
    //=======鼠标移入，移除事件
    
    query$('.Cooldog_container').onmouseover=function(){ 
        clearInterval(timer)
        // console.log(1)
        for(var k=0; k< list.length; k++){
           if(getAttr(list[k],'transform') == 'matrix(0.81, 0, 0, 0.81, -355, 0)'){
            eleLeft= list[k]
            eleLeft.appendChild(leftDiv)
           }
           if(getAttr(list[k],'transform') == "matrix(0.81, 0, 0, 0.81, 462, 0)"){
            eleRight= list[k]
            eleRight.appendChild(rightDiv)
           }
        }
        if(ifFirst){
            click('left',arr,list)  //在这里调用
            click('right',arr,list)  //在这里调用
        }
        ifFirst=  false
    }
    query$('.Cooldog_container').addEventListener('mouseleave',function(){
        eleLeft.removeChild(leftDiv)
        eleRight.removeChild(rightDiv)
        time(arr,list)
    })
   
    // console.log(arr)
    time(arr,list)
}

function click(dir,arr,list){  //这里封装
   if(dir== 'left'){
    query$('.Cooldog_container .left').addEventListener('click',function(){
        arr.push(arr[0])
        arr.shift()
        //  console.log(arr)
        for(var j=0; j< list.length; j++){
            list[j].style.transform= arr[j][0]
            list[j].style.opacity= arr[j][1]
            list[j].style.zIndex= arr[j][2]
        }
        bannerLine(arr)
        // ============================
    for(var m=0; m< list.length; m++){
    if(getAttr(list[m],'transform') == 'matrix(0.81, 0, 0, 0.81, -355, 0)'){
     eleLeft= list[m]
     eleLeft.appendChild(leftDiv)
    }
    if(getAttr(list[m],'transform') == "matrix(0.81, 0, 0, 0.81, 462, 0)"){
     eleRight= list[m]
     eleRight.appendChild(rightDiv)
    }
    // ================================
 }
    })
   }else{
    query$('.Cooldog_container .right').addEventListener('click',function(){
        arr.unshift(arr[arr.length-1])
        arr.pop()
        //   console.log(arr)
        for(var j=0; j< list.length; j++){
            list[j].style.transform= arr[j][0]
            list[j].style.opacity= arr[j][1]
            list[j].style.zIndex= arr[j][2]
        }
        bannerLine(arr)
        
    })
   }

}

function time(arr,list){
    clearInterval(timer)
    timer= setInterval(function(){
            arr.unshift(arr[arr.length-1])
            arr.pop()
            for(var j=0; j< list.length; j++){
                list[j].style.transform= arr[j][0]
                list[j].style.opacity= arr[j][1]
                list[j].style.zIndex= arr[j][2]
            }
            // console.log(arr)
            bannerLine(arr)

    },5000)
}

function bannerLine(arr){
    for(var i=0; i< arr.length; i++){
        if(arr[i][0] === "matrix(1, 0, 0, 1, 0, 0)"){
            // 小横条红色
            for(var j=0;j<aList.length; j++){
                aList[j].classList.remove('color')
                aList[i].classList.add('color')
            }
        }
    }   
}

function getAttr(obj,attr){ //获取元素的css内部的属性值
    if(obj.currentStyle){
        return obj.currentStyle[attr]
    }else{
        return getComputedStyle(obj,false)[attr]
    }
}
//点击推荐歌单
function clickRecom(){
    var recomObj= query$('.recommend-song > div','all')
    for(var i=0;i< recomObj.length;i++){
        recomObj[i].addEventListener('click',function(){
            var id= this.getAttribute('data-recommendid')
            // 发送请求
            sendAjaxAndRender(id)
           })
    }
 
}

}
function sendAjaxAndRender(id){
    ProAjax({
        url: 'http://localhost:3000/playlist/detail',
        params: {id}
    }).then(function(res){
        console.log('hhhh',res)
        // 在这里筛选有价值的信息
        recomList.name= res.playlist.name
        recomList.coverImgUrl= res.playlist.coverImgUrl
        recomList.playCount= filters(res.playlist.playCount)
        recomList.createTime= creatTime(res.playlist.createTime)
        recomList.description= res.playlist.description //介绍
        recomList.subscribedCount=  filters(res.playlist.subscribedCount) //收藏数
        recomList.commentCount= filters(res.playlist.commentCount)   //评论数
        recomList.shareCount=  filters(res.playlist.shareCount) //分享数
        recomList.tags= res.playlist.tags  //标签
        recomList.avatarUrl= res.playlist.creator.avatarUrl //头像地址
        recomList.nickname= res.playlist.creator.nickname //名称
        recomList.tracks= res.playlist.tracks //歌曲
        recomList.trackIds= res.playlist.trackIds //整个列表数组
        // recomList.time=timeFilter()
        for(var i=0; i<res.playlist.tracks.length;i++){
            res.playlist.tracks[i].dt= timeFilter(res.playlist.tracks[i].dt)
        }
        console.log(recomList)
        var recomHtml= recomArt({recomList})
        window.location.hash= 'find/recommend?id='+id
       query$('section').innerHTML= recomHtml
    //    在这里推荐歌单的详情已经渲染好了了
        recomDetail()
    },function(err){})
}

function recomDetail(){
    var listObj= query$('.recomDetail .music-list li','all')
    for(var i=0; i< listObj.length;i++){
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

                musicPlay(id,recomList.trackIds,recomList.name)//参数1 当前需要播放的id , 参数2 当前id所在的id列表, 参数3：来源哪里 

            })
        })
    }
}
export {
    find,
    sendAjaxAndRender
}