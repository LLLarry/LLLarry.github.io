
import { getAttr }  from '../public/public'
function mvVideo(){

    var video= document.querySelector('.video')
    var play= document.querySelector('.mv-playBtn')
    var nowTime= document.querySelector('.nowTime')
    var allTime= document.querySelector('.allTime') 
    var mvDot= document.querySelector('.mv-dot')
    var mvLineBox= document.querySelector('.mv-lineBox')
    var myDotSpan= document.querySelector('.mv-dot > span')
    var mvVolumeLine= document.querySelector('.mv-volume-line')
    var mvVolume= document.querySelector('.mv-volume')
    var mvVolumeDot= document.querySelector('.mv-volume-dot')
    var mvVolumeDotSpan= document.querySelector('.mv-volume-dot > span')
    var bigScreen= document.querySelector('.bigScreen')
    var mvPlay= document.querySelector('.mv-play')
    var divVideo= document.querySelector('.mv-play .video-div')
    var contral= document.querySelector('.contral')
    var mvPlayBtnI= document.querySelector('.mv-playBtn i')
    var choose= document.querySelector('.mv-play .choose')
    var videoOpacity= document.querySelector('.mv-play .choose .videoOpacity')
    var videoOpacityLi= document.querySelectorAll('.mv-play .choose .videoOpacity li')
    var videoOpacitySpan= document.querySelector('.mv-play .choose>span')
    var isClick= false //控制拖动的时候，进度条不让动
    var isMove= false
    var tTime= 0
    var timer= null
    var isBig= false
    var isVideoOpacityBlock= false //选择清晰度对否显示
    mvPlay.onmouseover= function(){
        contral.style.display= "block"
    }
    mvPlay.onmouseout= function(){
        clearTimeout(timer)
        timer= setTimeout(function(){
            contral.style.display= "none"
        },4000)
    }
    // 一进来就设置控制栏4秒消失，并且设置  开始/暂停 为开始
    mvPlayBtnI.className= 'iconfont icon-bofang4'
    clearTimeout(timer)
        timer= setTimeout(function(){
            contral.style.display= "none"
        },4000)

    play.onclick= function(){  //控制视频播放
        if(video.paused){ //判断视频是不是暂停，暂停的话为true，播放的话为false
            video.play()
            mvPlayBtnI.className= 'iconfont icon-bofang4'
        }else {
            video.pause()
            mvPlayBtnI.className= 'iconfont icon-bofang3'
        }	
    }
         //当视频能播放(已经通过网络加载完成)时
    video.oncanplay = function() {  //暂停/播放
        tTime = video.duration;  //获取视频总时长(单位秒)
        var tTimeStr = getTimeStr(tTime);
        nowTime.innerHTML = tTimeStr;
    }

    video.ontimeupdate = function(e) { //显示时间
        // console.log(e)
        var cTime = video.currentTime;  //获取当前播放时间 
        var cTimeStr = getTimeStr(cTime);
        allTime.innerHTML = cTimeStr;
        // console.log(isClick)
        if(isClick) return
         mvDot.style.width= cTime / tTime * 100 + '%';
        // currProgress.style.width = cTime/tTime*100+"%";
        }
        mvLineBox.onclick= function(e){ //点击到某个位置播放
            e = e || window.event
            var mvLineBoxWidth= mvLineBox.offsetWidth  //元素的总快递
            var mvLineBoxLeft= mvLineBox.getBoundingClientRect().left //元素距离屏幕最左边的距离
            var clientLeft= e.clientX  //触摸点到屏幕的距离
            var p= (clientLeft- mvLineBoxLeft) / mvLineBoxWidth //触摸点站元素的百分比
            mvDot.style.width= p * 100 + '%'
            video.currentTime = p * video.duration
             video.play()
             mvPlayBtnI.className= 'iconfont icon-bofang4'
        }
        // ====================这些事拖拽播放时间
        var mvLineBoxWidth= 0  //元素的总快递
        var leftVal= 0
        myDotSpan.onmousedown= function(e){
             var e = e || window.event;
             mvLineBoxWidth= mvLineBox.offsetWidth  //元素的总快递
            leftVal= e.clientX- this.offsetLeft
             isClick= true
            document.onmousemove= function(e){
                isMove= true
                var	e =	e || window.event;
            var controlleft = e.clientX - leftVal;
            if(controlleft < 0){
                  controlleft = 0;
              }else if(controlleft > mvLineBoxWidth) {
                  controlleft = mvLineBoxWidth
              }
              mvDot.style.width= controlleft+ 'px';
              window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
        }
    
    document.addEventListener('mouseup',function(e){
            if(isMove) {
            e= e || window.event
            var controlleft = e.clientX - leftVal
            video.currentTime = (controlleft / mvLineBoxWidth) * video.duration
            video.play()
            mvPlayBtnI.className= 'iconfont icon-bofang4'
            document.onmousemove= null
            isClick= false
            isMove= false
        }
    })
    //=================================================== 
    handleVol()
    function handleVol(){
        //获取mvVolumeLine元素距离左屏幕的距离
        var volLeft= 0
        var mvVolumeLineWidth= 0
        // mvVolumeLine
        mvVolume.onclick= function(e){
            e= e || window.event
            volLeft= mvVolumeLine.getBoundingClientRect().left
            mvVolumeLineWidth= mvVolumeLine.offsetWidth
            var ratio= (e.clientX- volLeft) / mvVolumeLineWidth
            mvVolumeDot.style.width= ratio * 100 + '%'
            // console.log(ratio)
            video.volume=  ratio
        }
        mvVolumeDotSpan.onmousedown= function(e){
            e= e || window.event
            volLeft= mvVolumeLine.getBoundingClientRect().left
            mvVolumeLineWidth= mvVolumeLine.offsetWidth
            document.onmousemove= null
            document.onmousemove= function(e){
                e= e || window.event
                var moveLong= e.clientX- volLeft
                if(moveLong < 0){
                    moveLong= 0
                }else if(moveLong > mvVolumeLineWidth){
                    moveLong = mvVolumeLineWidth
                }
                var ratio= moveLong / mvVolumeLineWidth
                // console.log(moveLong,mvVolumeLineWidth,ratio)
                mvVolumeDot.style.width= ratio * 100 + '%'
                video.volume=  ratio
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            }
        }
        document.onmouseup= function(e){
            // e= e || window.event
            document.onmousemove= null
        }

    }
     // 点击切换清晰度
     choose.onclick= function(){
         if(isVideoOpacityBlock){
            videoOpacity.style.display= "none"
            isVideoOpacityBlock= false
         }else{
            videoOpacity.style.display= "block"
            isVideoOpacityBlock= true
         }    
     }
    //  遍历清晰度li,添加点击事件
    for(var i=0; i< videoOpacityLi.length; i++){
        videoOpacityLi[i].onclick= function(){

            for(var j=0; j< videoOpacityLi.length; j++){
               videoOpacityLi[j].childNodes[0].classList.remove('icon-duihao')
            }
            this.childNodes[0].classList.add('icon-duihao')
            videoOpacitySpan.innerHTML= '<i class="iconfont icon-dianshi"></i>' + this.childNodes[1].innerHTML
            var url= this.getAttribute('data-url')
            var VideoTime= video.currentTime //获取换清晰度之前的视频播放时间
            video.src= url
            video.currentTime= VideoTime //换清晰度之后将之前播放的时间重新赋给新视频
            mvPlayBtnI.className= 'iconfont icon-bofang4'
        }
    }


    bigScreen.onclick= function(){
        // var videoDiv= document.querySelector('.video-div')
        makeFullScreen(mvPlay)
    }

   function getTimeStr(time){
        time= Math.round(time)
        var h= Math.floor(time / 3600) >= 10 ?  Math.floor(time / 3600) : '0' +  Math.floor(time / 3600)
        var m= Math.floor((time%3600)/60) >= 10 ? Math.floor((time%3600)/60) : '0' + Math.floor((time%3600)/60)
        var s= (time%3600)%60 >= 10 ? (time%3600)%60 : '0' + (time%3600)%60
        return h + ':' + m + ':' + s
    }

            //进入全屏

function makeFullScreen(divObj) {
  divObj= divObj === undefined ? document.documentElement : divObj
  console.log(divObj)
  if (divObj.requestFullscreen) {
    divObj.requestFullscreen();
  }
  else if (divObj.msRequestFullscreen) {
    divObj.msRequestFullscreen();
  }
  else if (divObj.mozRequestFullScreen) {
    divObj.mozRequestFullScreen();
  }
  else if (divObj.webkitRequestFullscreen) {
    divObj.webkitRequestFullscreen();
  } else {
    alert("您的浏览器暂时不支持全屏模式");
  } 

}
    //退出全屏
    // function exitFullscreen() {
    //     var de = document;
    //     if (de.exitFullscreen) {
    //         de.exitFullscreen();
    //     } else if (de.mozCancelFullScreen) {
    //         de.mozCancelFullScreen();
    //     } else if (de.webkitCancelFullScreen) {
    //         de.webkitCancelFullScreen();
    //     }
    // }
;

    document.addEventListener('fullscreenchange', inFullScreeen);
 
    document.addEventListener('webkitfullscreenchange', inFullScreeen);

    document.addEventListener('mozfullscreenchange', inFullScreeen);

    document.addEventListener('MSFullscreenChange', inFullScreeen);
    function inFullScreeen(){
        if(isBig){ //大屏
            // contral.style.bottom= '0px' 
            if(getAttr(mvPlay,'min-height') === '1080px'){ //解决猎豹浏览器全屏的bug
                mvPlay.style.minHeight= '410px'
            }
            divVideo.style.width= '75.89%'
            isBig= false
            video.onmousemove= null
        }else {
            // contral.style.bottom= '65px' 
            if(getAttr(mvPlay,'min-height') === '410px'){
                mvPlay.style.minHeight= '1080px'
            }
            divVideo.style.width= '100%'
            isBig= true
            video.onmousemove=function(){
                contral.style.display= "block"
                clearTimeout(timer)
                timer= setTimeout(function(){
                    contral.style.display= "none"
                },4000)
            }
        }
            

    }

   


       

}

export {
    mvVideo
}