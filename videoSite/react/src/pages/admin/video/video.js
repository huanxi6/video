import React, { useState, useEffect } from "react";
import { IntlProvider, FormattedMessage } from 'react-intl';
import en from '../../../lang/en.json';
import ZH_CN from '../../../lang/zh-CN.json';
import ru from '../../../lang/ru.json';
import ZH_TW from '../../../lang/zh-TW.json';
import Like from './img/like_icon.png';
import Play from './img/play_icon.png';
import axios from "axios";

const messages = {
  en,
  'zh-CN': ZH_CN,
  ru,
  'zh-TW': ZH_TW,
};

function VideoPage() {
  const [data, setData] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [page, setPage] = useState(sessionStorage.getItem("currentPage") ? parseInt(sessionStorage.getItem("currentPage")) : 1);
  useEffect(() => { // 新增
    sessionStorage.setItem("currentPage", page);
  }, [page]);

  
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.post(`http://154.94.6.196:3001/video?page=${page}`);
        setData(res.data.videos);
        setTotalVideos(res.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [page]);

  useEffect(() => { // 新增
    sessionStorage.setItem("currentPage", page);
  }, [page]);
  const handlePrevPage = () => {
    const prevPage = Math.max(1, page - 1);
    setErrorMessage(null); // 新增
    setInputPage(""); // 新增
    setPage(prevPage);
  };

  const handleNextPage = () => {
    const nextPage = Math.min(Math.ceil(totalVideos / 10), page + 1);
    setErrorMessage(null); // 新增
    setInputPage(""); // 新增
    setPage(nextPage);
  };


  // 语言国际化
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // 获取设置的语言，例如从localStorage中读取
    const lang = localStorage.getItem('lang');
    if (lang) {
      setLocale(lang);
    }
  }, []);

  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const videoContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
    width: "90%",
    minWidth: "800px",
    margin: "0 auto",
    marginTop: "50px",
    paddingBottom: "50px"
  };
  const videoStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "10px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    margin: "0 auto"
  };
  const imgStyle = {
    width: "200px",
    height: "150px",
    marginRight: "10px",
    borderRadius: "10px"
  };
  const userInfoStyle = {
    width: "60%",
    display: "flex",
    flexDirection: "column"
  };
  const viewsAndLikesStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  };
  const likeIcon = <img src={Like} alt="like" style={{ width: "20px", height: "20px", marginRight: "5px", marginLeft: "-200px" }} />;
  const playIcon = <img src={Play} alt="play" style={{ width: "20px", height: "20px", marginRight: "5px" }} />;
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "50px"
  };
  const buttonStyle = {
    width: "130px",
    height: "40px",
    borderRadius: "10px",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundColor: "green"
  };
  const warningButtonStyle = {
    ...buttonStyle,
    backgroundColor: "orange",
    marginLeft: "20px"
  };
  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: deleteButtonClicked ? "gray" : "red"
  };
  const prevButtonStyle = {
    ...buttonStyle,
    backgroundColor: page === 1 ? "gray" : "lightgreen",
    cursor: page === 1 ? "not-allowed" : "pointer"
  };
  const nextButtonStyle = {
    ...buttonStyle,
    backgroundColor: page >= Math.ceil(totalVideos / 10) ? "gray" : "lightgreen",
    cursor: page >= Math.ceil(totalVideos / 10) ? "not-allowed" : "pointer"
  };

  const handleDeleteButtonClick = async (video_id) => {
    setDeleteButtonClicked(true);
    try {
      const res = await axios.post('http://154.94.6.196:3001/dvideo', {
        "video_id": video_id
      });
      console.log(res);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  const [warningButtonClicked, setWarningButtonClicked] = useState(false);
  const warningBoxStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "500px",
    backgroundColor: "white",
    border: "2px solid gray",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.5)"
  };


  const warningBoxContentStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  };
  const handleWarningButtonClick = (video_id) => {
    sessionStorage.setItem("VideoId", video_id);
    setWarningButtonClicked(true);
    sessionStorage.removeItem("selectedOption"); // 新增
  };
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => { // 新增
    setSelectedOption(option);
    sessionStorage.setItem("selectedOption", option); // 新增
  };
  useEffect(() => {
    const selectedOption = sessionStorage.getItem("selectedOption"); // 修改
    if (selectedOption) { // 修改
      setSelectedOption(selectedOption); // 修改
    }
  }, []);

  const handleOkButtonClick = async () => { // 新增
    setWarningButtonClicked(false);
    const selectedOption = sessionStorage.getItem("selectedOption");
    if (!selectedOption) {
      setSelectedOption(null);
      sessionStorage.removeItem("VideoId"); // 修改
      sessionStorage.removeItem("selectedOption"); // 修改
      return;
    }
    try {
      const res = await axios.post('http://154.94.6.196:3001/warning', {
        "id": sessionStorage.getItem("VideoId"),
        "warning": sessionStorage.getItem("selectedOption")
      });
      console.log(res);
      sessionStorage.removeItem("VideoId"); // 修改
      sessionStorage.removeItem("selectedOption"); // 修改
      window.location.reload(); // 新增
    } catch (error) {
      console.log(error);
      sessionStorage.removeItem("VideoId"); // 修改
      sessionStorage.removeItem("selectedOption"); // 修改
      window.location.reload(); // 新增
    }

  };
  const [inputPage, setInputPage] = useState(page);
  const handleInputPageChange = (e) => {
    setInputPage(e.target.value);
  };

  const [errorMessage, setErrorMessage] = useState(null);
  const handleJumpButtonClick = () => {
    setErrorMessage(null); // 新增
    if (inputPage < 1 || inputPage > Math.ceil(totalVideos / 10)) {
      const lang = localStorage.getItem('lang');
      if (lang) {
        if (lang === 'ru') {
          setErrorMessage("Страница не найдена");
        } else if (lang === 'zh-CN') {
          setErrorMessage("页码不存在");
        } else if (lang === 'zh-TW') {
          setErrorMessage("頁面不存在");
        } else if (lang === 'en') {
          setErrorMessage("Page not found");
        }
      }
      return;
    }
    setPage(parseInt(inputPage));
    setInputPage(""); // 新增
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div style={videoContainerStyle}>
        {data.map((item) => (
          <div key={item.video_id} style={videoStyle}>
            <img src={item.file_url} alt="video" style={imgStyle} />
            <div style={userInfoStyle}>
              <h2>{`@ ${item.user_name}`}</h2>
              <h3>{item.title}</h3>
              <div style={viewsAndLikesStyle}>
                <h4>{playIcon}<FormattedMessage id="Views" defaultMessage="观看次数" />{`: ${item.views}`}</h4>
                <h4>{likeIcon}<FormattedMessage id="Likes" defaultMessage="点赞次数" />{`: ${item.likes}`}</h4>
              </div>
            </div>
            <div style={{ width: "10%", height: "40%", display: "flex", justifyContent: "space-between" }}>
              <center>
                <h4> <FormattedMessage id="Warningtype" defaultMessage="警告类型" /></h4>
                <h4>{item.warning}</h4>
              </center>
            </div>
            <div style={{ width: "40%", height: "60%", display: "flex", justifyContent: "space-between" }}>
              <button style={warningButtonStyle} onClick={() => handleWarningButtonClick(item.video_id)}><FormattedMessage id="Warning" defaultMessage="警告" /></button>
              <button style={deleteButtonStyle} onClick={() => handleDeleteButtonClick(item.video_id)}>
                {deleteButtonClicked ? <FormattedMessage id="Pleasewait" defaultMessage="请稍后" /> : <FormattedMessage id="Deletevideo" defaultMessage="删除视频" />}
              </button>
            </div>
          </div>
        ))}
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px"}}>
          <div style={buttonContainerStyle}>
            <button style={prevButtonStyle} disabled={page === 1} onClick={handlePrevPage}>
              <FormattedMessage id="Previouspage" defaultMessage="上一页" />
            </button>
            <h3 style={{margin: "0 20px"}}>{`${page}/${Math.ceil(totalVideos / 10)}`}</h3>
            <button style={nextButtonStyle} disabled={page >= Math.ceil(totalVideos / 10)} onClick={handleNextPage}>
              <FormattedMessage id="Nextpage" defaultMessage="下一页" />
            </button>
            <div style={{ marginLeft: "20px"}}>
            <input type="number" min="1" max={Math.ceil(totalVideos / 10)} value={inputPage} onChange={handleInputPageChange} style={{width: "50px", marginRight: "10px", borderRadius: "5px", border: "1px solid gray", padding: "5px"}} />
            <button onClick={handleJumpButtonClick} style={{...buttonStyle, backgroundColor: "lightgreen"}}>
              <FormattedMessage id="Jumptopage" defaultMessage="跳转" />
            </button>
            {errorMessage && <p style={{color: "red", marginLeft: "10px"}}>{errorMessage}</p>} {/* 新增 */}
          </div>
          </div>
        </div>
        {warningButtonClicked && (
          <div style={warningBoxStyle}>
            <div style={warningBoxContentStyle}>
              <button
                style={{
                  width: "400px",
                  height: "40px",
                  backgroundColor: selectedOption === "1" && "gray",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  marginBottom: "20px"
                }}
                onClick={() => handleOptionClick("1")}
              >
                <FormattedMessage id="warning1" defaultMessage="该行为存在风险，请勿轻易模仿" />
              </button>
              <button
                style={{
                  width: "400px",
                  height: "40px",
                  backgroundColor: selectedOption === "2" && "gray",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  marginBottom: "20px"
                }}
                onClick={() => handleOptionClick("2")}
              >
                <FormattedMessage id="warning2" defaultMessage="视频中出现的商品仅供参考，请勿盲目消费" />
              </button>
              <button
                style={{
                  width: "400px",
                  height: "40px",
                  backgroundColor: selectedOption === "3" && "gray",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  marginBottom: "20px"
                }}
                onClick={() => handleOptionClick("3")}
              >
                <FormattedMessage id="warning3" defaultMessage="注意保护个人隐私和信息安全" />
              </button>
              <button
                style={{
                  width: "400px",
                  height: "40px",
                  backgroundColor: selectedOption === "4" && "gray",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  marginBottom: "20px"
                }}
                onClick={() => handleOptionClick("4")}
              >
                <FormattedMessage id="warning4" defaultMessage="请遵守社区规范和法律法规" />
              </button>
              <button
                style={{
                  width: "400px",
                  height: "40px",
                  backgroundColor: selectedOption === "5" && "gray",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  marginBottom: "20px"
                }}
                onClick={() => handleOptionClick("5")}
              >
                <FormattedMessage id="warning5" defaultMessage="请勿将视频内容用于商业用途" />
              </button>
              <button
                style={{
                  width: "400px",
                  height: "40px",
                  backgroundColor: selectedOption === "0" && "gray",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  marginBottom: "20px"
                }}
                onClick={() => handleOptionClick("0")}
              >
                <FormattedMessage id="Cancelwarning" defaultMessage="取消警告" />
              </button>
              <button style={buttonStyle} onClick={handleOkButtonClick}>
                <FormattedMessage id="ok" defaultMessage="确定" />
              </button>
            </div>
          </div>
        )}

      </div>
    </IntlProvider>
  );



}

export default VideoPage;
