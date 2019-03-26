//评论分页处理函数
import {commentsReq} from '../public/require.js'
import {Handlecomments} from '../public/public.js'

function fenye(divObj, fenList,count,url,tamplatePage,Dom,id){ //参数1：divObj，方块要放的父亲位置，参数2：fenList,list所有元素,参数3：数据个数
    if(count === 0) return
    var length= 57  //arr的length                          //参数4：url请求评论的地址 参数5 tamplatePage:要渲染的模板页面，参数6，模板页面要放在的元素
    count= Math.ceil(count/10)                             //参数7： 歌曲的id
    divObj.innerHTML= xuanran(count)
    var index

    divObj.onclick= function(e){
        e= e || window.event
        var target= e.target
        if( target.nodeName === 'LI'){
            if(target.getAttribute('data') === 'left'){ //左边被点击
                // 先获取active在谁身上
                for(var i=0; i<fenList.length;i++){
                    if(fenList[i].getAttribute('class') === 'active'){
                        index= i
                    }
                }
                var num= parseInt(fenList[index].innerHTML)-1 >= 1 ? parseInt(fenList[index].innerHTML) : 1
                index= index-1
                index= index >= 1 ? index : 1
                var target= fenList[index]
                // move(num,target,count)

                }else if(target.getAttribute('data') === 'right'){
                // 先获取active在谁身上
                for(var i=0; i<fenList.length;i++){
                    if(fenList[i].getAttribute('class') === 'active'){
                        index= i
                    }
                }
                var num= parseInt(fenList[index].innerHTML)+1 >= count ?  count : parseInt(fenList[index].innerHTML)
                index= index+1
                index= index >= fenList.length-2 ? fenList.length-2 : index
                var target= fenList[index]
                // move(num,target,count)
            }
            var num= target.innerHTML
            move(num,target,count) // num是被点击的html target是被点击的元素

        }
        
    }
    function xuanran(count){
        var html= ''
        if(count <= 11){
            for(var i=0; i < count; i++ ){
                // console.log(i)
                if(i===0){
                    html += '<li class="active">1</li>'	
                }else{
                    html += '<li>'+ (i+1) +'</li>'
                }	
            }

             html= '<li data="left"><</li>'+html+'<li data="right">></li>'
        }else{
        html= '<li data="left"><</li><li class="active">1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li class="more">...</li><li>'+ count +'</li><li data="right">></li>'
        }
        return html 
    }
    function move(num,target,count){ 
// var fenList= query$('li','all')
        if(count > 11){
            if(num >= 6 && num <= count-5 ){
                    fenList[2].innerHTML= '...'
                    fenList[2].classList.add('more')
                    fenList[10].innerHTML= '...'
                    fenList[10].classList.add('more')
                        setTimeout(function(){
                            fenList[6].innerHTML= parseInt(num)

                            fenList[3].innerHTML= parseInt(fenList[6].innerHTML)-3
                            fenList[4].innerHTML= parseInt(fenList[6].innerHTML)-2
                            fenList[5].innerHTML= parseInt(fenList[6].innerHTML)-1
                            
                            fenList[7].innerHTML= parseInt(fenList[6].innerHTML)+1
                            fenList[8].innerHTML= parseInt(fenList[6].innerHTML)+2
                            fenList[9].innerHTML= parseInt(fenList[6].innerHTML)+3
                        },50)
                    
                    for(var i=0; i< fenList.length; i++){
                        fenList[i].classList.remove('active')
                    }
                    fenList[6].classList.add('active')
                    if(num == count-5){
                        fenList[10].innerHTML= count-1
                        fenList[10].classList.remove('more')
                    }
                    // debugger
                }else if(num < 6){
                    fenList[2].innerHTML= 2
                    fenList[2].classList.remove('more')

                    fenList[3].innerHTML= 3
                    fenList[4].innerHTML= 4
                    fenList[5].innerHTML= 5
                    fenList[6].innerHTML= 6
                    fenList[7].innerHTML= 7
                    fenList[8].innerHTML= 8
                    fenList[9].innerHTML= 9

                    for(var i=0; i< fenList.length; i++){
                        fenList[i].classList.remove('active')
                    }
                    target.classList.add('active')
                }else if(num > count-5){
                    fenList[10].innerHTML= count-1
                    fenList[10].classList.remove('more')
                    fenList[2].innerHTML= '...'
                    fenList[2].classList.add('more')

                    fenList[3].innerHTML= count-8
                    fenList[4].innerHTML= count-7
                    fenList[5].innerHTML= count-6
                    fenList[6].innerHTML= count-5
                    fenList[7].innerHTML= count-4
                    fenList[8].innerHTML= count-3
                    fenList[9].innerHTML= count-2
                    fenList[10].innerHTML= count-1

                    fenList[10].classList.remove('more')
                    for(var i=0; i< fenList.length; i++){
                        fenList[i].classList.remove('active')
                    }
                    target.classList.add('active')
                }
        }else { //小于等于11的时候
            for(var i=0; i< fenList.length; i++){
                fenList[i].classList.remove('active')
            }
            target.classList.add('active')
        }
        updateData(target.innerHTML,url,tamplatePage,Dom,id)
    }
}

function updateData(innerHtml,url,tamplatePage,Dom,id){ //这个是将请求过来的数据冲洗渲染在页面上
    // 1拿到点击页面的innerHTML，2,发送请求,3，处理数据，将数据传到模板页，然后再渲染页面
    var limit= 10
    var offset= (parseInt(innerHtml)-1) * 10
    var P14= commentsReq(id,offset,limit,url)
    P14.then((res)=>{
        // console.log(res)
        var comments= [] //存放歌曲评论列表的
        Handlecomments(res,comments)
        var tamplatePageHtml= tamplatePage({comments})
        Dom.innerHTML= tamplatePageHtml
    },(err)=>{})
}

export {
    fenye
}