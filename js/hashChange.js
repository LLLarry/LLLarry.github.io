import { parseUrlHash,parseUrlParmas, } from '../public/public'
import { find } from './find'
import { search,searchKeywords } from './search'
import { sendAjaxAndRender } from './find'
import { getSingerById } from './singPage'
import { searchCd } from './searchDetail'
import cdSearchPageArt from '../view/cdSearchPage.art'
function hashChange(){
    window.onhashchange= (function(){
        var preTime= 0
        return function(e){
            var time= new Date()
            if(time - preTime > 300){
                e= e || event
                var url= parseUrlHash(e.newURL).substring(0,parseUrlHash(e.newURL).indexOf('?'))
                if(parseUrlHash(e.newURL) === 'find'){
                    find()
                }else if(parseUrlHash(e.newURL) === 'search'){
                    search()
                }else if(url === 'search/detail'){
                    search()
                    searchKeywords(parseUrlParmas(e.newURL).keywords)
                }else if(url === 'find/recommend'){
                    var id= parseUrlParmas(e.newURL).id
                    sendAjaxAndRender(id)
                }else if(url === 'find/singer'){
                    var id= parseUrlParmas(e.newURL).id
                    getSingerById(id)
                }else if(url === 'search/detail/cd'){
                    var id= parseUrlParmas(e.newURL).id
                    searchCd(id,cdSearchPageArt)
                }
            }
            preTime= time  
        }
    })()
}
export {
    hashChange
}