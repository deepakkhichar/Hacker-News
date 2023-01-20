import React, { useState, useEffect } from 'react'
import NewsItems from './NewsItems'
import Spinner from './Spinner';
import InfiniteScroll from "react-infinite-scroll-component";


export default function NewsComp(props) {
    const [articles, setArticles] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize] = useState(12)

    const updateNews = async () => {
        props.setProgress(0)
        props.setProgress(20)
        const url = `https://hn.algolia.com/api/v1/search?page=${page}&hitsPerPage=${pageSize}`;
        props.setProgress(40)
        let data = await fetch(url);
        props.setProgress(60)
        let parsedData = await data.json();
        console.log(parsedData)
        setArticles(parsedData.hits)
        props.setProgress(80)
        setTotalPage(parsedData.nbPages)
        props.setProgress(100)
    }

    const Next = async () => {
        const url = `https://hn.algolia.com/api/v1/search?page=${page + 1}&hitsPerPage=${pageSize}`;
        setPage(page + 1)
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.hits))
        setTotalPage(parsedData.nbPages)
    }

    useEffect(() => {
        updateNews()
    }, [])


    return (
        <>
            <h1 className='text-center' style={{ marginTop: '100px', textShadow: "1px 1px 1px #2222226b" }}>Top General Headlines</h1>
            <InfiniteScroll
                dataLength={articles.length}
                next={Next}
                hasMore={page !== totalPage}
                loader={<div className='text-center my-5'><Spinner /></div>}
                style={{ overflow: "hidden" }}
            >
                <div className='container my-3'>
                    <div className="row">
                        {articles.map((element,index) => {
                            return <div className="col-md-4 my-4 d-flex justify-content-center" key={index}>
                                <NewsItems mode={props.mode} title={element.title ? element.title : (element.story_title ? element.story_title : (element.story_text ? element.story_text : " "))} author={element.author ? element.author : "Unknown"} time={element.created_at ? element.created_at : " "} url={element.url ? element.url : (element.story_url ? element.story_url : "#")} comment={element.comment_text?element.comment_text:''}/>
                            </div>
                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )
}
