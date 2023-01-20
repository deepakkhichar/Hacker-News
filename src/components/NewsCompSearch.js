import React, { useState, useEffect } from 'react'
import NewsItems from './NewsItems'
import Spinner from './Spinner';
import InfiniteScroll from "react-infinite-scroll-component";
import SearchIcon from '../components/images/search.png';
import moment from 'moment';

export default function NewsComp(props) {
    const [articles, setArticles] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize] = useState(12);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTag, setSearchTag] = useState('');
    const [searchByDate, setSearchByDate] = useState('search');
    const [timeInterval, setTimeInterval] = useState('');
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [startDate, setStartDate] = useState(Date.now());
    const [endDate, setEndDate] = useState(moment().subtract(1, 'days').format('x') / 1000);

    const updateNews = async () => {
        props.setProgress(0)
        props.setProgress(20)
        const url = `https://hn.algolia.com/api/v1/${searchByDate}?page=${page}&hitsPerPage=${pageSize}&query=${searchQuery}&tags=${searchTag}&numericFilters=${timeInterval}`;
        const encodeURL = encodeURI(url);
        props.setProgress(40)
        let data = await fetch(encodeURL);
        props.setProgress(60)
        let parsedData = await data.json();
        setArticles(parsedData.hits)
        props.setProgress(80)
        setTotalPage(parsedData.nbPages)
        props.setProgress(100)
    }

    const Next = async () => {
        const url = `https://hn.algolia.com/api/v1/${searchByDate}?page=${page + 1}&hitsPerPage=${pageSize}&query=${searchQuery}&tags=${searchTag}&numericFilters=${timeInterval}`;
        setPage(page + 1);
        const encodeURL = encodeURI(url);
        let data = await fetch(encodeURL);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.hits))
        setTotalPage(parsedData.nbPages)
    }

    useEffect(() => {
        updateNews();
    }, [searchQuery, searchTag, searchByDate, timeInterval])

    const callSearchApi = (query) => {
        setPage(1);
        setSearchQuery(query);
    }

    const callSearchTagApi = (tag) => {
        setPage(1);
        setSearchTag(tag);
    }

    const callSearchByDateApi = (dateSelect) => {
        setPage(1);
        setSearchByDate(dateSelect)
    }

    const callSearchByTimeInterval = (timeIntervalSelected) => {
        if (timeIntervalSelected === "customInput") {
            console.log("customInput")
            setShowCustomDate(true);
        }
        else if (timeIntervalSelected !== "") {
            setPage(1);
            setShowCustomDate(false);
            const X = moment().subtract(1, timeIntervalSelected).format('x') / 1000;
            const timeIntervalInside = "created_at_i>" + X;
            setTimeInterval(timeIntervalInside);
        }
        else {
            setShowCustomDate(false);
            setTimeInterval('');
        }
    }

    const callApiOnCustomInput = (e) => {
        e.preventDefault()
        const X = moment(startDate).format('x') / 1000;
        const Y = moment(endDate).format('x') / 1000;
        if (Y < X) {
            alert("To Date cannot be less then from date");
        }
        else {
            setPage(1);
            const timeIntervalInside = "created_at_i>" + X + ",created_at_i<" + Y;
            setTimeInterval(timeIntervalInside);
        }
    }

    return (
        <>
            <div className="container input-group" style={{ marginTop: '100px', paddingRight: 30, paddingLeft: 30 }}>
                <span className={`input-group-text bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`}>
                    <img src={SearchIcon} alt="search-icon" height={20} width={20} />
                </span>
                <input className={`form-control bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`} placeholder="Search" type="search" aria-label="Search" onChange={(e) => callSearchApi(e.target.value)} />
            </div>
            <div className="container input-group my-4 " style={{ paddingRight: 30, paddingLeft: 30 }}>
                <span className={`input-group-text bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`}>Search</span>
                <select className={`form-select bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`} aria-label="All" onChange={(e) => callSearchTagApi(e.target.value)}>
                    <option selected value=''>All</option>
                    <option value="story">Stories</option>
                    <option value="comment">Comments</option>
                </select>
                <span className={`input-group-text bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`}>by</span>
                <select className={`form-select bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`} aria-label="Popularity" onChange={(e) => callSearchByDateApi(e.target.value)}>
                    <option selected value="search">Popularity</option>
                    <option value="search_by_date">Date</option>
                </select>
                <span className={`input-group-text bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`}>for</span>
                <select className={`form-select bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`} aria-label="All time" onChange={(e) => callSearchByTimeInterval(e.target.value)}>
                    <option selected value="">All Time</option>
                    <option value="days">Last 24h</option>
                    <option value="weeks">Past Week</option>
                    <option value="months">Past Month</option>
                    <option value="year">Past Year</option>
                    <option value="customInput" type="datetime-local">Custom Input</option>
                </select>
            </div>
            {
                showCustomDate ? <form className="container input-group my-4" style={{ paddingRight: 30, paddingLeft: 30 }} onSubmit={callApiOnCustomInput}>
                    <span className={`input-group-text bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`}>From</span>
                    <input className={`form-control bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`} placeholder="Search" type="datetime-local" aria-label="Search" required onChange={(e) => setStartDate(e.target.value)} />
                    <span className={`input-group-text bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`}>To</span>
                    <input className={`form-control bg-${props.mode} text-${props.mode === 'light' ? 'dark' : 'light'}`} placeholder="Search" type="datetime-local" aria-label="Search" required onChange={(e) => setEndDate(e.target.value)} />
                    <button class="btn btn-outline-secondary" type="submit" id="button-addon2">Search</button>
                </form> : <div />
            }
            <InfiniteScroll
                dataLength={articles.length}
                next={Next}
                hasMore={page !== totalPage}
                loader={<div className='text-center my-5'><Spinner /></div>}
                style={{ overflow: "hidden" }}
            >
                <div className='container my-3'>
                    <div className="row">
                        {articles.map((element, index) => {
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
