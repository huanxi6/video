import React, { useState, useEffect } from 'react';
import axios from "axios";

function Category() {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("颜值"); //initialize with default category
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVideoCount, setTotalVideoCount] = useState(0); // total video count for current category
  const [videoInfo, setVideoInfo] = useState({});
  const [play, setPlay] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch('http://154.94.6.196:3001/category', { method: 'POST' });
      const data = await response.json();
      setCategories(data.categories);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchVideos() {
      // Updated fetch to use video category API with query params
      const response = await fetch(`http://154.94.6.196:3001/videocategory?category=${currentCategory}&page=${currentPage}`, { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setVideos(data.videos);
        setTotalVideoCount(data.count); // set totalVideoCount state
      } else {
        setVideos([]);
        setTotalVideoCount(0);
      }
    }
    fetchVideos();
  }, [currentCategory, currentPage]);

  const buttonWidth = categories.length === 0 ? "100%" : `${100 / categories.length}%`;

  function handleCategoryClick(category) {
    setCurrentCategory(category);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  const getVideoInfo = async (id) => {
    const res = await axios.post("http://154.94.6.196:3001/videoid", {
      id: id
    });
    setVideoInfo(res.data.video);
    setPlay(true);
  };

  const handlePlay = (id) => {
    setPlay(false);
    getVideoInfo(id);
  };

  const selectedStyle = {
    background: "#000",
    color: "#fff",
  }

  const normalStyle = {
    background: "#eee",
    color: "#000",
  }

  const disableButton = videos.length < 10 || (currentPage * 10 >= totalVideoCount); // disable next button if there are no more videos

  const lang = localStorage.getItem('lang');
  const categoryNames = {
    '美食': {
      'ru': 'кулинария',
      'zh-CN': '美食',
      'zh-TW': '美食',
      'en': 'food'
    },
    '颜值': {
      'ru': 'красавица',
      'zh-CN': '颜值',
      'zh-TW': '顏值',
      'en': 'beauty'
    },
    '风景': {
      'ru': 'пейзаж',
      'zh-CN': '风景',
      'zh-TW': '風景',
      'en': 'scenery'
    }
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', minWidth: '1000px' }}>
      {/* left column */}
      <div style={{ width: '80%', height: 'calc(100vh - 80px)', overflow: 'hidden', backgroundColor: '#000' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', height: 'auto', maxHeight: 'calc(100% - 50px)', overflow: 'auto' }}>
          {categories.map((category) => (
            <button
              key={category.category_id}
              style={{
                width: buttonWidth,
                height: '50px', // added to set button height to 50px
                borderLeft: '2px solid #000',
                borderRight: '2px solid #000',
                borderTop: 'none',
                borderBottom: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 'px',
                fontWeight: category.name === currentCategory ? 'bold' : 'normal', // bold current selected category button
                ...((category.name === currentCategory) ? selectedStyle : normalStyle), //added dynamic styling
              }}
              onClick={() => handleCategoryClick(category.name)}
              onMouseEnter={() => { // add on mouse enter event
                if (category.name !== currentCategory) {
                  document.getElementById(`category-${category.category_id}`).style.background = "#aaa"
                }
              }}
              onMouseLeave={() => { //add on mouse leave event
                if (category.name !== currentCategory) {
                  document.getElementById(`category-${category.category_id}`).style.background = normalStyle.background
                }
              }}
              id={`category-${category.category_id}`}
            >
              <div style={{ marginLeft: '5px', marginRight: '5px' }}>{categoryNames[category.name][lang]}</div>
            </button>
          ))}
        </div>
        <div style={{ width: "100%", height: "calc(100vh - 130px)" }}>
          {play ? (
            <video style={{ height: "auto", maxHeight: '100%', width: "100%", objectFit: "contain" }} autoPlay loop controls>
              <source src={videoInfo.thumbnail_url} type="video/mp4" />
            </video>
          ) : (
            <p>请选择要观看的视频</p>
          )}
        </div>
      </div>
      {/* right column */}
      <div style={{ width: '20%', height: 'calc(100vh - 80px)', overflow: 'auto', borderLeft: '2px solid #000' }}>
        <center>
          <div style={{ width: '95%' }}>
            {videos.map((video, index) => (
              <div key={video.video_id} style={{ border: '1px solid #000', borderRadius: '8px', overflow: 'hidden', marginTop: index !== 0 ? '30px' : '20px' /*Add a marginTop of 20px to the first video*/ }}>
                <button style={{ width: '100%', height: '100%', background: 'none', border: 'none' }} onClick={() => handlePlay((video.video_id))}>
                  <img src={video.file_url} alt="Thumbnail" style={{ height: '160px', width: '100%', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
                  <div style={{ padding: '10px' }}>
                    <p style={{ margin: '0', fontSize: '16px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{video.title}</p>
                  </div>
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' /*add margin top of 30px to center buttons*/ }}>
              <div style={{ height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    height: '25px', width: '25px', borderRadius: '50%', background: '#eee', marginRight: '10px', fontSize: '20px',
                    border: '1px solid #000', fontWeight: 'bold'
                  }}>
                  {"<"}
                </button>
                <span style={{ marginRight: '10px', fontSize: '16px' }}>{currentPage}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={disableButton}
                  style={{
                    height: '25px', width: '25px', borderRadius: '50%', background: '#eee', fontSize: '20px',
                    border: '1px solid #000', fontWeight: 'bold'
                  }}>
                  {">"}
                </button>
              </div>
            </div>
          </div>
        </center>
      </div>
    </div>
  );
}

export default Category;

