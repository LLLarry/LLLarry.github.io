import {ProAjax} from '../public/public.js'
function commentsReq(id,offset,limit,url){ //請求歌曲評論
    return ProAjax({
            url: url,
            params: {id,offset,limit}
        })
}

function searchReq(keywords,offset,limit,type){
    return ProAjax({
        url: 'http://localhost:3000/search',
        params: {keywords,offset,limit,type}
    })
}
function Searchmultimatch(keywords){ //搜索多重匹配
    return ProAjax({
        url: 'http://localhost:3000/search/multimatch',
        params: {keywords}
    })
}
function searchSingerById(id){ 
    return ProAjax({
        url: 'http://localhost:3000/artists',
        params: {id}
    })
}
function searchCdBySingerId(id){ //搜索专辑通过歌手id
    return ProAjax({
        url: 'http://localhost:3000/artist/album',
        params: {id}
    })
}
function searchMvBySingerId(id){
    return ProAjax({
        url: 'http://localhost:3000/artist/mv',
        params: {id}
    })
}
function getSongerDescribe(id){ //获取歌手描述
    return ProAjax({
        url: 'http://localhost:3000/artist/desc',
        params: {id}
    })
}
function getCdList(id){ //获取歌手描述
    return ProAjax({
        url: 'http://localhost:3000/album',
        params: {id}
    })
}
function getHotSinger(offset,limit){ //发送热门歌手请求
    return ProAjax({
        url: 'http://localhost:3000/top/artists',
        params: {offset,limit}
    })
}
function getSongerList(cat,initial,offset,limit){ //获取歌手分类列表
    return ProAjax({
        url: 'http://localhost:3000/artist/list',
        params: {cat,initial,offset,limit}
    })
}
function getMvUrl(id){ //获取mv地址
    return ProAjax({
        url: 'http://localhost:3000/mv/url',
        params: {id}
    })
}
function getSimiMv(mvid){ //获取相似mv
    return ProAjax({
        url: 'http://localhost:3000/simi/mv',
        params: {mvid}
    })
}
function getMvComment(id){ //获取mv评论
    return ProAjax({
        url: 'http://localhost:3000/comment/mv',
        params: {id}
    })
}
function getMvDetail(mvid){ //获取mv详细信息
    return ProAjax({
        url: 'http://localhost:3000/mv/detail',
        params: {mvid}
    })
}
export {
    commentsReq,
    searchReq,
    Searchmultimatch,
    searchSingerById,
    searchCdBySingerId,
    searchMvBySingerId,
    getSongerDescribe,
    getCdList,
    getHotSinger,
    getSongerList,
    getMvUrl,
    getSimiMv,
    getMvComment,
    getMvDetail
}
