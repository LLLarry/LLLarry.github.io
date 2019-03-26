import {id$,class$,query$,ajax,timeFilter,ProAjax,parseLyric,Handlecomments,HandleIncludeThisSong,HandleSimilarSong} from '../public/public.js'
import {commentsReq} from '../public/require.js' 
import {fenye} from '../public/commentPage.js' 
import cdPageArt from '../view/cdPage.art'
import commentPage from '../view/commentsPage.art'
function musicPlay(id, idList,from){
    // 获取 audio
    var audio= query$('#audio')
    //获取开始时间
    var startTime= query$('.musicTime span')
    //获取结束时间
    var endTime= query$('.musicTime span', 'all')[1]
    //获取进度条线总元素
    var progressBar= query$('.progress-bar')
    //获取实时进度条元素
    var bar= query$('.bar')
    //获取进度小圆点
    var control= query$('.control')
    // 获取上一曲
    var preSong= query$('.play-icon span','all')[0]
    //获取 开始/暂停 按钮
    var pauseOrPlay= query$('.play-icon span','all')[1]
     //获取 下一曲 按钮
     var nextSong= query$('.play-icon span','all')[2]
    var controlleft= 0
    var isPlay= false //正在播放音乐?
    var url= ''
    var songDetail= [] //歌曲详细信息
    //这里 ele是传过来的原来，身上有歌曲的id
    var timer= null
    var cdPageView= [] //传进cdPage的数据
    var comments= [] //存放歌曲评论列表的
    var includeThisSong= [] //包含这首歌的歌单
    var similarSong= [] //相似歌曲
    cdPageView.from= from  //接受传过来的歌曲来源
    var b= 0
    var isAutMove= false //判断是不是点击进度条移动了
    getUrl(id)

    //=======================
      function getUrl(id){ //这是封装的请求歌曲url的函数，回调函数返回的是url
        // var id= ele.getAttribute('data-songid') //是歌曲id 重点
        var P8= ProAjax({
            url: 'http://localhost:3000/song/url',  //请求歌曲地址
            params: {id}
          })
        var P9=  ProAjax({
            url: 'http://localhost:3000/song/detail', //请求歌曲详细信息
            params: {ids:id}
         })
        var P10= ProAjax({
          url: 'http://localhost:3000/lyric', //请求歌词
          params: {id}
        })
        var P11= commentsReq(id,0,10,'http://localhost:3000/comment/music') //請求第一頁的評論
        var P12= ProAjax({
          url: 'http://localhost:3000/simi/playlist', //包含这首歌的歌单
          params: {id}
        })
        var P13= ProAjax({
          url: 'http://localhost:3000/simi/song', //相似歌曲
          params: {id}
        })

         P8.then(function(res){ 
             url= res.data[0].url  //请求过来的id  
            //  console.log(res) 
            return P9                      
        },function(err){})
        .then(function(res){
          // console.log(res)
        songDetail.name= res.songs[0].name //歌曲名 
        var ty= res.songs[0].ar
        songDetail.songer= ''
        songDetail.picUrl=res.songs[0].al.picUrl
        ty.forEach((item,i)=>{
            songDetail.songer+= '/'+item.name 
        })
        songDetail.songer= songDetail.songer.substr(1) //歌手名
        cdPageView.songer= songDetail.songer //传进cdPage的数据
        cdPageView.name= songDetail.name
        cdPageView.al= res.songs[0].al  //专辑
        var b= 0
        console.log(cdPageView)
        return P10
        },function(err){})
        .then(function(res){
          if(res.lrc){
            cdPageView.lrc= parseLyric(res.lrc.lyric) //将歌词传进cdPageView数组中
          }else {
            cdPageView.lrc= {0:'暂无歌词'}
          }
          return P11
        },function(err){})
        .then(function(res){
          Handlecomments(res,comments) //调用歌曲评论处理函数
          return P12
        },function(err){})
        .then((res)=>{
          // console.log(res)
          includeThisSong=[]
          HandleIncludeThisSong(res,includeThisSong)
          return P13
        },(err)=>{})
        .then((res)=>{
          // console.log(res)
          similarSong= []
          HandleSimilarSong(res,similarSong)
          query$('.headimg img').src=songDetail.picUrl
          query$('.musicName').innerHTML= songDetail.name
          query$('.progress .author').innerHTML= '-' + songDetail.songer
          var commentsTotal= {} //这两步是将单个评论总数传进cdPage中
          commentsTotal.total= comments.total
          var cdPageHtml= cdPageArt({cdPageView,includeThisSong,similarSong,commentsTotal})
          console.log(commentsTotal)
          query$('.cd-view').innerHTML= cdPageHtml

          var commentPageHtml= commentPage({comments}) //这两部是将评论页面的页面抽出来，单独存放
          query$('.cdPage .goodComment').innerHTML= commentPageHtml

          playMusic(id) // 调用音乐播放
          playNextOrplayPro(id)//这里绑定 上一曲/下一曲的事件
          var fenList= query$('.cdPage .comment-paging').getElementsByTagName('li') //获取所有评论的li
          fenye(query$('.cdPage .comment-paging'),fenList,comments.total,'http://localhost:3000/comment/music',commentPage, query$('.cdPage .goodComment'),id) //生成分页页码
        },(err)=>{})
      }
//================================这里传进url就能播放
      function playMusic(id){
        audio.src= url
        audio.onloadedmetadata = null
        audio.onloadedmetadata = function () { //音频加载后触发
            endTime.innerHTML = "/"+timeFilter(audio.duration, 's') //获取音乐时间
            startTime.innerHTML = timeFilter(audio.currentTime,'s')
            audio.play()
            pauseOrPlay.childNodes[0].classList.remove('icon-bofang1')
            pauseOrPlay.childNodes[0].classList.add('icon-zantingtingzhi')
            isPlay= true
          }
    
          progressBar.addEventListener('click', function (event) {
            let coordStart = this.getBoundingClientRect().left
            let coordEnd = event.pageX
            let p = (coordEnd - coordStart) / this.offsetWidth
            bar.style.width = p.toFixed(3) * 100 + '%'
            control.style.left= p.toFixed(3) * 100 + '%'
            audio.currentTime = p * audio.duration
            audio.play()
            pauseOrPlay.childNodes[0].classList.remove('icon-bofang1')
            pauseOrPlay.childNodes[0].classList.add('icon-zantingtingzhi')
            isPlay= true
          })
          
    
          control.addEventListener('mousedown',function(event){
            var event = event || window.event;
            var leftVal = event.clientX - this.offsetLeft; //左边距离屏幕左边的距离
            var that = this;
            clearInterval(timer)
                document.onmousemove= function(event){
                    var event = event || window.event;
                    controlleft = event.clientX - leftVal;    
                    if(controlleft < 0){
                        controlleft = 0;
                    }else if(controlleft > progressBar.offsetWidth - control.offsetWidth) {
                        controlleft = progressBar.offsetWidth - control.offsetWidth
                    }
                    bar.style.width = controlleft +'px'
                    that.style.left = controlleft + "px"
                    b= controlleft / (progressBar.offsetWidth - control.offsetWidth)
                    isAutMove= true
                    // console.log(progressBar.offsetWidth - control.offsetWidth)
                    //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
             })
            document.addEventListener('mouseup',function(event){
              if(!isAutMove) return
              audio.currentTime = b * audio.duration
              audio.play()
              pauseOrPlay.childNodes[0].classList.remove('icon-bofang1')
              pauseOrPlay.childNodes[0].classList.add('icon-zantingtingzhi')
              document.onmousemove = null
              isAutMove= false
            setTime()
             })
          //这里控制暂停、播放
            pauseOrPlay.onclick= null //在绑定之前先清理下之前的点击事件
            pauseOrPlay.onclick=function(){
            if(isPlay){
                audio.pause()
                pauseOrPlay.childNodes[0].classList.remove('icon-zantingtingzhi')
                pauseOrPlay.childNodes[0].classList.add('icon-bofang1')
                isPlay= false
            }else{
                audio.play() 
                pauseOrPlay.childNodes[0].classList.remove('icon-bofang1')
                pauseOrPlay.childNodes[0].classList.add('icon-zantingtingzhi')
                isPlay= true
            }
          }
          audio.onended= null
          audio.onended= function(){
              //==这里是当歌曲唱完之后自动播放下一曲
            console.log('end')
            var index= idList.findIndex((item,i)=>{ //获取当前id的索引
                return item.id === parseInt(id)
            })
            index++
            var i= index === idList.length ? 0 : index
            getUrl(idList[i].id)
          }
          

          setTime()
         function setTime(){
            clearInterval(timer)
            timer= setInterval(() => {
                startTime.innerHTML = timeFilter(audio.currentTime,'s')
                bar.style.width = audio.currentTime / audio.duration.toFixed(3) * 100 + '%'
                control.style.left= audio.currentTime / audio.duration.toFixed(3) * 100 + '%'
              }, 1000)
         }
         audio.ontimeupdate= null
         audio.ontimeupdate= function(e) {  //监听歌曲播放时间，并滚动歌词

          var time = parseInt(e.target.currentTime);
              // console.log(time)
          var lines = query$('[data-timeline]','all');
          var top = 0;
          var _thisHeight = 0;
          var nextLine = {  //下一行的 索引，时间
              i: 0,
              time: 0
          };
          for( var i=0; i< lines.length; i++){
            var timeline= lines[i].getAttribute('data-timeline') //获取当前li的时间

            nextLine.i = (parseInt(i) + 1) == lines.length ? 0 :  (parseInt(i) + 1); //下一次的索引
             nextLine.time= lines[nextLine.i].getAttribute('data-timeline') //下一次的时间
             
            if(timeline <= time && time < nextLine.time){  //  上一次时间 <= time && time < 下一次时间
              _thisHeight= lines[i].clientHeight;

              for(var j=0;j<lines.length; j++){  //在每次添加active之前把所有的类样式清除
                lines[j].className= ''
              }
             lines[i].className = "active";

             nextLine.i = parseInt(i) + 1; //下一次的索引
             nextLine.time= lines[nextLine.i].getAttribute('data-timeline') //下一次的时间
                     if (nextLine.time > 0) {  //判断 下一次还有没有
                          var interval = nextLine.time - timeline;
                          (function(k) {
                              setTimeout(function() {
                                  lines[k].className = "";
                              }, interval * 1000);
                          })(i);
                      }  // 几秒钟之后当前的 类移除
                      query$('.lrc>.lrc-ul').style.marginTop = -(top - _thisHeight) + 'px';
             }else if(timeline < time){
               top += lines[i].clientHeight;
             }
          }
        }
    
      }
      function playNextOrplayPro(id){
           
          var playNextBtn= query$('.play span','all')[2]
          var playpreBtn= query$('.play span','all')[0]
          playNextBtn.onclick= null  //调用的时候先把上一次绑定的点击事件清除
          var index= idList.findIndex((item,i)=>{ //获取当前id的索引
            return item.id === parseInt(id)
        })
          playNextBtn.onclick=function(){ 
            index++
          var i= index === idList.length ? 0 : index
            // console.log(index)
            getUrl(idList[i].id) //调用 获取url函数，将id传进去
          }
          playpreBtn.onclick=function(){ 
            index--
         var i= index === -1 ? (idList.length-1) : index
            // console.log(index)
            getUrl(idList[i].id) //调用 获取url函数，将id传进去
          }
      }
}
export {
    musicPlay 
}