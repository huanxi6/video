import React, { useState, useRef, useEffect } from "react";
import { IntlProvider, FormattedMessage } from 'react-intl';
import en from '../../../lang/en.json';
import ZH_CN from '../../../lang/zh-CN.json';
import ru from '../../../lang/ru.json';
import ZH_TW from '../../../lang/zh-TW.json';
import axios from 'axios';
import previousIcon from './img/up.png';
import nextIcon from './img/angle.png';

const messages = {
  en,
  'zh-CN': ZH_CN,
  ru,
  'zh-TW': ZH_TW,
};

const App = () => {
  const [currentVideoId, setCurrentVideoId] = useState(parseInt(localStorage.getItem("videoId")) || 1); // 当前视频ID，从localStorage中获取或默认为1
  const [videoHeight, setVideoHeight] = useState(window.innerHeight - 60); // 视频高度
  const videoRef = useRef(null);
  const [videoUrls, setVideoUrls] = useState([]); // 添加 videoUrls 状态
  const [videoInfo, setVideoInfo] = useState({}); // 添加 videoInfo 状态
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态
  const [user] = JSON.parse(sessionStorage.getItem('user'))?.username.split(':') || [null]; //获取当前名字，用于关注按钮的显示


  // 语言国际化
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // 获取设置的语言，例如从localStorage中读取
    const lang = localStorage.getItem('lang');
    if (lang) {
      setLocale(lang);
    }
  }, []);

  const handleSlide = async (direction) => {
    const newVideoId = currentVideoId + direction;
    if (newVideoId < 1) {
      return;
    }

    try {
      setIsLoading(true);

      // 调用 API 并更新新视频数据的状态
      const response = await axios.post('http://154.94.6.196:3001/videoid', {
        id: newVideoId.toString()
      });
      const responseData = response.data;
      if (responseData.success) {
        const videoData = responseData.video;
        setCurrentVideoId(newVideoId);
        localStorage.setItem("videoId", newVideoId.toString()); // 将当前页码保存至localStorage
        setVideoUrls([videoData.thumbnail_url]); // 更新 videoUrls 状态
        setVideoHeight(window.innerHeight - 60); // 调整视频高度
        videoRef.current.pause(); // 更新视频源前暂停
        videoRef.current.src = videoData.file_url; // 更新视频源
        videoRef.current.load(); // 更新源后重新加载视频
        videoRef.current.addEventListener('canplaythrough', () => {
          setIsLoading(false); // 取消加载状态
          videoRef.current.play().catch(error => console.error(error)); // 源加载完后播放视频，如果自动播放失败，则不自动播放视频
        }, { once: true });
        setVideoInfo({ title: videoData.title, user_name: videoData.user_name, warning: videoData.warning }); // 获取视频标题和作者名字和警告内容
      } else {
        const response = await axios.post('http://154.94.6.196:3001/videoid', {
          id: '1'
        });
        const videoData = response.data.video;
        setCurrentVideoId(1);
        localStorage.setItem("videoId", "1"); // 将当前页码保存至localStorage
        setVideoUrls([videoData.thumbnail_url]); // 更新 videoUrls 状态
        setVideoHeight(window.innerHeight - 60); // 调整视频高度
        videoRef.current.pause(); // 更新视频源前暂停
        videoRef.current.src = videoData.file_url; // 更新视频源
        videoRef.current.load(); // 更新源后重新加载视频
        videoRef.current.addEventListener('canplaythrough', () => {
          setIsLoading(false); // 取消加载状态
          videoRef.current.play().catch(error => console.error(error)); // 源加载完后播放视频，如果自动播放失败，则不自动播放视频
        }, { once: true });
        setVideoInfo({ title: videoData.title, user_name: videoData.user_name, warning: videoData.warning }); // 获取视频标题和作者名字和警告内容
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleVideoEnd = () => {
    videoRef.current.currentTime = 0; // 将当前时间重置为0
    videoRef.current.play(); // 重新播放
  };

  useEffect(() => {
    videoRef.current.defaultPlaybackRate = 1.0;
    // 从sessionStorage中获取当前视频ID
    setCurrentVideoId(parseInt(localStorage.getItem("videoId")) || 1);
  }, []);

  useEffect(() => {
    videoRef.current.autoplay = true;
    setIsLoading(true); // 显示加载状态

    if (videoUrls.length > 0) {
      // 仅在 videoUrls 可用时加载视频
      videoRef.current.src = videoUrls[0];
      videoRef.current.load();
      videoRef.current.addEventListener('canplaythrough', () => {
        setIsLoading(false); // 取消加载状态
        videoRef.current.play().catch(error => console.error(error)); // 源加载完后播放视频，如果自动播放失败，则不自动播放视频
      }, { once: true });
    }
  }, [videoUrls]);

  useEffect(() => {
    const handleResize = () => setVideoHeight(window.innerHeight - 60);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setIsLoading(true); // 显示加载状态

        // 调用 API 以获取初始视频数据
        const response = await axios.post('http://154.94.6.196:3001/videoid', {
          id: currentVideoId.toString()
        });
        const responseData = response.data;
        if (responseData.success) {
          const videoData = responseData.video;
          setVideoUrls([videoData.thumbnail_url]);
          setVideoHeight(window.innerHeight - 60);
          videoRef.current.src = videoData.file_url;
          videoRef.current.addEventListener('canplaythrough', () => {
            setIsLoading(false); // 取消加载状态
            videoRef.current.play().catch(error => console.error(error)); // 源加载完后播放视频，如果自动播放失败，则不自动播放视频
          }, { once: true });
          setVideoInfo({ title: videoData.title, user_name: videoData.user_name, warning: videoData.warning }); // 获取视频标题和作者名字和警告内容
        } else {
          const response = await axios.post('http://154.94.6.196:3001/videoid', {
            id: '1'
          });
          const videoData = response.data.video;
          setVideoUrls([videoData.thumbnail_url]); // 更新 videoUrls 状态
          setVideoHeight(window.innerHeight - 60); // 调整视频高度
          videoRef.current.src = videoData.file_url; // 更新视频源 
          videoRef.current.addEventListener('canplaythrough', () => {
            setIsLoading(false); // 取消加载状态
            videoRef.current.play().catch(error => console.error(error)); // 源加载完后播放视频，如果自动播放失败，则不自动播放视频
          }, { once: true });
          setVideoInfo({ title: videoData.title, user_name: videoData.user_name, warning: videoData.warning }); // 获取视频标题和作者名字和警告内容
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchVideoData();
  }, [currentVideoId]);

  function Warning() {
    if (videoInfo.warning === 0) {
      return null;
    } else if (videoInfo.warning === 1) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div style={{ border: '1px solid lightgrey', borderRadius: '5px', backgroundColor: '#DCDCDC', padding: '5px', marginLeft: '20px', marginTop: '10px' }}>
            <p style={{ margin: 0, paddingLeft: "0px", color: "#000000" }}>
              <FormattedMessage id="warning1" defaultMessage="该行为存在风险，请勿轻易模仿" />
            </p>
          </div>
        </IntlProvider>
      );
    } else if (videoInfo.warning === 2) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div style={{ border: '1px solid lightgrey', borderRadius: '5px', backgroundColor: '#DCDCDC', padding: '5px', marginLeft: '20px', marginTop: '10px' }}>
            <p style={{ margin: 0, paddingLeft: "0px", color: "#000000" }}>
              <FormattedMessage id="warning2" defaultMessage="视频中出现的商品仅供参考，请勿盲目消费" />
            </p>
          </div>
        </IntlProvider>
      );
    } else if (videoInfo.warning === 3) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div style={{ border: '1px solid lightgrey', borderRadius: '5px', backgroundColor: '#DCDCDC', padding: '5px', marginLeft: '20px', marginTop: '10px' }}>
            <p style={{ margin: 0, paddingLeft: "0px", color: "#000000" }}>
              <FormattedMessage id="warning3" defaultMessage="注意保护个人隐私和信息安全" />
            </p>
          </div>
        </IntlProvider>
      );
    } else if (videoInfo.warning === 4) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div style={{ border: '1px solid lightgrey', borderRadius: '5px', backgroundColor: '#DCDCDC', padding: '5px', marginLeft: '20px', marginTop: '10px' }}>
            <p style={{ margin: 0, paddingLeft: "0px", color: "#000000" }}>
              <FormattedMessage id="warning4" defaultMessage="请遵守社区规范和法律法规" />
            </p>
          </div>
        </IntlProvider>
      );
    } else if (videoInfo.warning === 5) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div style={{ border: '1px solid lightgrey', borderRadius: '5px', backgroundColor: '#DCDCDC', padding: '5px', marginLeft: '20px', marginTop: '10px' }}>
            <p style={{ margin: 0, paddingLeft: "0px", color: "#000000" }}>
              <FormattedMessage id="warning5" defaultMessage="请勿将视频内容用于商业用途" />
            </p>
          </div>
        </IntlProvider>
      );
    }
  }





  function FollowButton() {
    const [isFriend, setIsFriend] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    useEffect(() => {
      if (!user) {
        return;
      }
      fetch('http://154.94.6.196:3001/myfriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: user,
          fdname: videoInfo.user_name
        })
      })
        .then(response => response.json())
        .then(data => {
          const success = data.success;
          setIsFriend(success);
        })
    }, []);

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => {
        fetch('http://154.94.6.196:3001/upfriend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: user,
            fdname: videoInfo.user_name
          })
        })
          .then(response => response.json())
          .then(data => {
            const success = data.success;
            setIsFriend(success);
          })
        setIsFriend(true);
      }, 1000);
    }

    if (!user) {
      return <h1 style={{ color: 'rgba(0, 0, 0, 0)' }}>-</h1>;
    } else if (user === videoInfo.user_name) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <button style={{ backgroundColor: '#686868', color: 'white', borderRadius: '10px', padding: '8px 30px', border: 'none', fontSize: '1.2rem', pointerEvents: 'none' }}>
            <FormattedMessage id="Myvideo" defaultMessage="我的视频" />
          </button>
        </IntlProvider>
      );
    } else if (isFriend === false && !isClicked) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <button onClick={handleClick} style={{ backgroundColor: '#294c30', color: 'white', borderRadius: '10px', padding: '8px 30px', border: 'none', fontSize: '1.2rem' }}>
            <FormattedMessage id="Followtheauthor" defaultMessage="关注作者" />
          </button>
        </IntlProvider>
      )
    } else if (isFriend === false && isClicked) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <button style={{ backgroundColor: 'orange', color: 'white', borderRadius: '10px', padding: '8px 30px', border: 'none', fontSize: '1.2rem' }}>
            <FormattedMessage id="Pleasewait" defaultMessage="请稍后..." />
          </button>
        </IntlProvider>
      )
    } else if (isFriend === true) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <button style={{ backgroundColor: '#1c164b', color: 'white', borderRadius: '10px', padding: '8px 30px', border: 'none', fontSize: '1.2rem', pointerEvents: 'none' }}>
            <FormattedMessage id="Youhavealreadyfollowed" defaultMessage="你已关注" />
          </button>
        </IntlProvider>
      )
    }
  }

  const [isClicked, setIsClicked] = useState(false);
  const handleKeyDown = (event) => {
    if (isClicked) {
      return;
    }
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
    if (event.keyCode === 38) {
      handleSlide(-1);
    } else if (event.keyCode === 40) {
      handleSlide(1);
    }
  }

  const handleWheel = (event) => {
    if (isClicked) {
      return;
    }
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
    if (event.deltaY > 0) {
      handleSlide(1);
    } else if (event.deltaY < 0) {
      handleSlide(-1);
    }
  }



  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className="app" style={{ width: "100%", height: "100vh", overflow: "hidden", backgroundColor: "black" }} onKeyDown={handleKeyDown} onWheel={handleWheel}>
        <div className="video-container" style={{ position: "relative", height: videoHeight }}>
          <video ref={videoRef} controls width="100%" height="100%" onEnded={handleVideoEnd} />
          {/* 添加标题和作者名 */}
          <div style={{ position: "absolute", bottom: 70, left: 0, width: "100%", height: "10%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end" }}>
            <p style={{ margin: 0, fontSize: "2rem", paddingLeft: "20px", color: "white" }}>{`@ ${videoInfo.user_name}`}</p>
            <p style={{ margin: 0, paddingLeft: "20px", color: "white" }}>{videoInfo.title}</p>
            <Warning />
          </div>
          {isLoading && (
            // 添加加载中的显示，防止因为重新加载而导致页面卡住
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', }}>
            </div>
          )}
          <div className="slider-controls" style={{
            position: "absolute",
            top: "20%",
            transform: "translateY(-50%)",
            right: 16,
            width: 66,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            background: "gray",
            borderRadius: "10px"
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src={previousIcon} alt="Previous Video" onClick={() => handleSlide(-1)} style={{ flex: 1, paddingBottom: "15px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src={nextIcon} alt="Next Video" onClick={() => handleSlide(1)} style={{ flex: 1 }} />
            </div>
          </div>
        </div>
        <div className="slider-controls" style={{
          position: "absolute",
          top: "88%",
          transform: "translateY(-50%)",
          right: 20,
          width: 240,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          // background: "gray",
        }}>
          <FollowButton />
        </div>
        <style>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: black;
        }
      `}</style>
      </div>
    </IntlProvider>
  );

};

export default App;