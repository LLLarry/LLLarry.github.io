import {id$,class$,query$,ajax} from '../public/public.js'
import { hashChange } from './hashChange'
import {search} from './search'
import {find} from './find'
import {mv} from './mv'
import {mvPlay} from './mvPlay.js'
var pathn= ''
var spanList= query$('.nav-icon li span','all')
var list= []
tagCdPage()
hashChange()
for(var i=0; i<spanList.length; i++){
   list.push(spanList[i].parentNode)
}
// find(pathn) //页面一加载先调用find()
window.location.hash= 'find'
find()
for(var i=0; i<list.length; i++){
    list[i].addEventListener('click',function(){
        for(var i=0; i<list.length; i++){
            list[i].classList.remove('active')
        }
        this.classList.add('active')
        // 获取li列表上的data-index
        var index= parseInt(this.getAttribute('data-index'))
        // console.log(window.location)
        // window.location.hash= index
        switch(index){
            case 1: pathn = "/view/search.art"; window.location.hash= 'search'; break;
            case 2: pathn = "/view/find.art";window.location.hash= 'find'; break;
            case 3: pathn = "/view/mv.html";mv(pathn); break;
            // case 4: pathn = "/view/find.html";find(pathn); break;
            // case 5: pathn = "/view/find.html";find(pathn); break;
            // case 6: pathn = "/view/find.html";find(pathn); break;
            // case 7: pathn = "/view/find.html";find(pathn); break;
        }
    })

 }

//  function find(pathn){
//      console.log(555)
//     //  ajax()
//      $('section').load(pathn)
//     // query$('section').loaction= pathn

//  }

 // 给body绑定事件，判断点击mv之后播放mv
 var body= query$('body')
 body.onclick= function(e){
     e= e || window.event
     var target=  e.target
     var regExp = /icon-MV/
     if(target.nodeName.toLowerCase() === 'i' && regExp.test(target.className)){
         // 发送请求并渲染
         var id= target.getAttribute('data-id')
         mvPlay(id)
     }
 }
function tagCdPage(){ //cdPage 页面显示和隐藏
    var isHidden= true
    var headimg= query$('footer .headimg')
    var cdView= query$('.cd-view')
    headimg.onclick=function(){
        if(isHidden){
            cdView.style.display= "block"  
            isHidden= false
        }else {
            cdView.style.display= "none"
            isHidden= true
        }
        
    }
}
