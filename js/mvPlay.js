import { getMvUrl,getSimiMv,getMvComment,getMvDetail } from  '../public/require'
import { query$,filters,Handlecomments } from '../public/public'
import mvPlayArt from '../view/mvPlay.art'
import commentsPageArt from '../view/commentsPage.art'
import { mvVideo } from './mvVideo'
import {fenye} from '../public/commentPage.js'
var url= ''
var comments= []  //mv评论
var comiMv= [] //相似mv
var mvDetail = [] //mv详情

function mvPlay(id){
    var P30= getMvUrl(id)
    var P31= getSimiMv(id)
    var P32= getMvComment(id)
    var P33= getMvDetail(id)

    P30.then((res)=>{
        // console.log(res)
        if(res.data.url){
            url=  res.data.url
        }
        return P31
    },(err)=>{})
    .then((res)=>{
        // console.log(res)
        comiMv= res.mvs
        if(comiMv.length > 0){
            for(var i=0; i< comiMv.length;i++){
                comiMv[i].playCount=  filters(comiMv[i].playCount)
            }
        }
        console.log(comiMv)
        return P32
    },(err)=>{})
    .then((res)=>{
        Handlecomments(res,comments) //调用歌曲评论处理函数
        // console.log(comments)
        return P33
    },(err)=>{})
    .then((res)=>{
        
        mvDetail= res.data
        mvDetail.shareCount= filters(mvDetail.shareCount)
        mvDetail.subCount= filters(mvDetail.subCount)
        mvDetail.playCount= filters(mvDetail.playCount)
        mvDetail.commentCount= filters(mvDetail.commentCount)
        console.log(mvDetail)
        renderMvPlay(id)
    },(err)=>{})
    // 先渲染页面
    
}
function renderMvPlay(id){
    var total= comments.total
    var mvPlayHtml= mvPlayArt({url,comiMv,mvDetail})
    var cocommentsPageHtml= commentsPageArt({comments}) //评论页面
    // console.log(cocommentsPageHtml)
    var mvView= query$('.mv-view')
    mvView.innerHTML= mvPlayHtml
    var mvCom= query$('.mv-view .left .mv-com')
    var divObj= query$('.mv-view .comment-paging') //方块放的位置
    // console.log(divObj)
    var fenList= divObj.getElementsByTagName('li') //获取所有评论的li
    mvCom.innerHTML= cocommentsPageHtml
    fenye(divObj, fenList,total,'http://localhost:3000/comment/mv',commentsPageArt,mvCom,id)
    mvView.style.display= "block"

    mvVideo() 
    var mvViewTopB= query$('.mv-view .top > b')
    var video= document.querySelector('.video')
    mvViewTopB.onclick= function(){  //点击返回，暂停播放
        mvView.style.display= "none"
        video.pause()
    }
    var mvMoreLi= query$('.mv-box .mv-more li' ,'all')
    for(var i=0; i< mvMoreLi.length; i++){
        mvMoreLi[i].onclick= function(){
            var id= this.getAttribute('data-id')
            mvPlay(id)
        }
    }

}

export {
    mvPlay
}