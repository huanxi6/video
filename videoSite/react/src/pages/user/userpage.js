import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { IntlProvider, FormattedMessage } from 'react-intl';
import en from '../../lang/en.json';
import ZH_CN from '../../lang/zh-CN.json';
import ru from '../../lang/ru.json';
import ZH_TW from '../../lang/zh-TW.json';
import home_icon from "./img/home.png";
import hot_icon from "./img/chat-arrow-grow.png";
import friend_icon from "./img/users-alt.png";
import my_icon from "./img/user.png";
import video_icon from "./img/video-icon.png";
import data_icon from "./img/data_icon.png";
import set_icon from "./img/set_icon.png";
import logo from "./img/logo.png";
import up from "./img/upload_icon.png";
import Home from "./home/home";
import Hot from "./hot/hot";
import Friend from "./friend/friend";
import My from "./my/my";
import Login from "../login/loginpage";
import Up from "./up/up";
import Admin from '../admin/adminpage';
import Admindata from '../admin/data/data';
import Adminset from '../admin/set/set';
import Adminvideo from '../admin/video/video';
const messages = {
  en,
  'zh-CN': ZH_CN,
  ru,
  'zh-TW': ZH_TW,
};


function UserLogin() {
  // 获取当前用户名
  // 从sessionStorage中获取用户信息
  const user = JSON.parse(sessionStorage.getItem("user"));
  // 清除登录信息
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("users");
    sessionStorage.removeItem("currentPage");

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

  if (!user) {
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px', width: '100px' }}><FormattedMessage id="Login" defaultMessage="登录" /></Link>
      </IntlProvider>
    )
  } else {
    return (
      <Link to="/" onClick={handleLogout} style={{ color: 'white', textDecoration: 'none', marginLeft: '20px', width: '100px' }}><FormattedMessage id="Loginout" defaultMessage="退出" /></Link>
    )
  }
}

function Userinput() {
  const lang = localStorage.getItem('lang');
  if (lang) {
    if (lang === 'ru') {
      return (
        <input type="text" placeholder="Введите поисковой запрос" style={{ border: '2px solid black', borderRadius: '10px', height: '40px', width: '40%', maxWidth: '400px', fontSize: '20px', textAlign: 'center' }} />
      )
    } else if (lang === 'zh-CN') {
      return (
        <input type="text" placeholder="请输入搜索内容" style={{ border: '2px solid black', borderRadius: '10px', height: '40px', width: '40%', maxWidth: '400px', fontSize: '20px', textAlign: 'center' }} />
      )
    } else if (lang === 'zh-TW') {
      return (
        <input type="text" placeholder="請輸入搜尋內容" style={{ border: '2px solid black', borderRadius: '10px', height: '40px', width: '40%', maxWidth: '400px', fontSize: '20px', textAlign: 'center' }} />
      )
    } else if (lang === 'en') {
      return (
        <input type="text" placeholder="Enter search term" style={{ border: '2px solid black', borderRadius: '10px', height: '40px', width: '40%', maxWidth: '400px', fontSize: '20px', textAlign: 'center' }} />
      )
    }
  }
}
function handleClick(){
  const lang = localStorage.getItem('lang');
  if (lang) {
    if (lang === 'ru') {
      alert("Не хочу писать, напишу в следующем семестре");
    } else if (lang === 'zh-CN') {
      alert("不想写，下学期再写");
    } else if (lang === 'zh-TW') {
      alert("下學期再寫");
    } else if (lang === 'en') {
      alert("Don't want to write, will write next semester");
    }
  }
}
function Userpage() {
  // 从sessionStorage中获取用户信息
  const [user] = useState(JSON.parse(sessionStorage.getItem("user")));
  // 设置滚动条位置
  const [, setScrollY] = useState(0);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 处理鼠标进入事件
  const handleMouseEnter = (e) => {
    e.target.style.transform = "rotate(360deg)";
    e.target.style.transition = "0.5s";
  };
  // 处理鼠标离开事件
  const handleMouseLeave = (e) => {
    e.target.style.transform = "rotate(0deg)";
    e.target.style.transition = "0.5s";
  };

  // 监听sessionStorage中用户信息的变化
  useEffect(() => {
    let preUser = JSON.parse(sessionStorage.getItem("user"));
    const intervalId = setInterval(() => {
      const curUser = JSON.parse(sessionStorage.getItem("user"));
      if (JSON.stringify(preUser) !== JSON.stringify(curUser)) {
        window.location.reload();
      }
      preUser = curUser;
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  // 语言国际化
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // 获取设置的语言，例如从localStorage中读取
    const lang = localStorage.getItem('lang');
    if (!lang) {
      localStorage.setItem('lang', 'en');
    } else {
      setLocale(lang);
    }
  }, []);


  const changeLocale = (lang) => {
    // 保存语言设置
    localStorage.setItem('lang', lang);
    setLocale(lang);
  };

  if (user && user.username === "admin") {
    // 从http://154.94.6.196:3001/user中获取用户信息
    if (user) {
      if (!sessionStorage.getItem("users")) {
        fetch("http://154.94.6.196:3001/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: user.username
          })
        })
          .then(res => res.json())
          .then(data => {
            sessionStorage.setItem("users", JSON.stringify(data));
          })
          .catch(error => console.error(error));
      } else {
        // console.log(sessionStorage.getItem("user"));
        console.clear()
      }
    }
    const handleLogout = () => {
      sessionStorage.removeItem("users");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("users");
      sessionStorage.removeItem("currentPage");
    };
    return (
      <Router >
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div style={{ margin: 0, padding: 0 }}>
            <header style={{ backgroundColor: 'gray', width: '100%', height: '80px', position: 'fixed', top: 0, zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <img src={logo} alt="logo" style={{ width: '90px', height: '90px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <h1><FormattedMessage id="Media" defaultMessage="马林传媒" /></h1>
                  </div>
                </div>
                <h4 ><FormattedMessage id="Welcome" defaultMessage="欢迎您" />{user.username}</h4>
                <div style={{ float: 'left', marginLeft: '0px', border: '2px solid gray', display: 'inline-block', padding: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <select
                      style={{ fontSize: '16px', backgroundColor: 'white', border: 'none', borderRadius: 5, boxShadow: '1px 1px 5px gray', padding: '3px 8px' }}
                      value={locale}
                      onChange={(e) => {
                        changeLocale(e.target.value);
                        setTimeout(() => {
                          window.location.reload();
                        }, 50);
                      }}
                    >
                      <option value="en">English</option>
                      <option value="zh-CN">简体中文</option>
                      <option value="zh-TW">繁體中文</option>
                      <option value="ru">Русский</option>
                    </select>
                  </div>
                </div>

                <Link to="/" onClick={handleLogout} style={{ color: 'white', textDecoration: 'none', marginLeft: '20px', width: '100px' }}><FormattedMessage id="Loginout" defaultMessage="退出" /></Link>
              </div>
            </header>
            <div style={{ display: 'flex', marginTop: '80px' }}>
              <div className="sidebar" style={{ backgroundColor: 'gray', margin: 0, padding: 0, minWidth: '120px', maxWidth: '200px', height: 'calc(100vh - 80px)', position: 'fixed', left: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '25%' }}>
                    <Link to="/admin" style={{ color: 'black', fontWeight: 'bold', fontSize: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                      <img src={my_icon} alt="home icon" style={{ width: '30px', height: '30px' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                      <span style={{ marginTop: '10px', display: 'inline-block', textAlign: 'center' }}><FormattedMessage id="home" defaultMessage="我的" /></span>
                    </Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '25%' }}>
                    <Link to="/video" style={{ color: 'black', fontWeight: 'bold', fontSize: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                      <img src={video_icon} alt="hot icon" style={{ width: '30px', height: '30px' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                      <span style={{ marginTop: '10px', display: 'inline-block', textAlign: 'center' }}><FormattedMessage id="Review" defaultMessage="审核" /></span>
                    </Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '25%' }}>
                    <Link to="/data" style={{ color: 'black', fontWeight: 'bold', fontSize: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                      <img src={data_icon} alt="friend icon" style={{ width: '30px', height: '30px' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                      <span style={{ marginTop: '10px', display: 'inline-block', textAlign: 'center' }}><FormattedMessage id="Data" defaultMessage="数据" /></span>
                    </Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '25%' }}>
                    <Link to="/set" style={{ color: 'black', fontWeight: 'bold', fontSize: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                      <img src={set_icon} alt="my icon" style={{ width: '30px', height: '30px' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                      <span style={{ marginTop: '10px', display: 'inline-block', textAlign: 'center' }}><FormattedMessage id="Settings" defaultMessage="设置" /></span>
                    </Link>
                  </div>
                </div>
              </div>
              <div style={{ marginLeft: '120px', width: '100%' }}>
                <Routes>
                  <Route path='/admin' element={<Admin />} />
                  <Route path='/data' element={<Admindata />} />
                  <Route path='/set' element={<Adminset />} />
                  <Route path='/video' element={<Adminvideo />} />
                </Routes>
              </div>
            </div>
          </div>
        </IntlProvider>
      </Router >
    );
  } else {
    // 从http://154.94.6.196:3001/user中获取用户信息
    // if (!sessionStorage.getItem("user")) {
    if (user) {
      if (!sessionStorage.getItem("users")) {
        fetch("http://154.94.6.196:3001/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: user.username
          })
        })
          .then(res => res.json())
          .then(data => {
            sessionStorage.setItem("users", JSON.stringify(data));
          })
          .catch(error => console.error(error));
      } else {
        // console.log(sessionStorage.getItem("user"));
        console.clear()
      }
    }

    return (
      <Router >
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div style={{ margin: 0, padding: 0 }}>
            <header style={{ backgroundColor: 'gray', width: '100%', height: '80px', position: 'fixed', top: 0, zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <img src={logo} alt="logo" style={{ width: '90px', height: '90px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Userinput />
                    <button style={{ backgroundColor: 'white', border: '2px solid black', borderRadius: '10px', fontSize: '20px', marginLeft: '20px' }} onClick={handleClick}><FormattedMessage id="Search" defaultMessage="搜索" /></button>
                  </div>
                </div>
                <Link to="/up" style={{ color: 'white', textDecoration: 'none' }}>
                  <img src={up} alt="home icon" style={{ width: '30px', height: '30px', marginRight: '10px' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></img>
                </Link>
                <div style={{ float: 'left', marginLeft: '0px', border: '2px solid gray', display: 'inline-block', padding: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <select
                      style={{ fontSize: '16px', backgroundColor: 'white', border: 'none', borderRadius: 5, boxShadow: '1px 1px 5px gray', padding: '3px 8px' }}
                      value={locale}
                      onChange={(e) => {
                        changeLocale(e.target.value);
                        setTimeout(() => {
                          window.location.reload();
                        }, 50);
                      }}
                    >
                      <option value="en">English</option>
                      <option value="zh-CN">简体中文</option>
                      <option value="zh-TW">繁體中文</option>
                      <option value="ru">Русский</option>
                    </select>
                  </div>
                </div>
                <UserLogin />
              </div>
            </header>
            <div style={{ display: 'flex', marginTop: '80px' }}>
              <div className="sidebar" style={{ backgroundColor: 'gray', margin: 0, padding: 0, minWidth: '120px', maxWidth: '200px', height: 'calc(100vh - 80px)', position: 'fixed', left: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '25%' }}>
                    <Link to="/" style={{ color: 'black', fontWeight: 'bold', fontSize: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                      <img src={home_icon} alt="home icon" style={{ width: '30px', height: '30px' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                      <span style={{ marginTop: '10px', display: 'inline-block', textAlign: 'center' }}><FormattedMessage id="home" defaultMessage="主页" /></span>
                    </Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '25%' }}>
                    <Link to="/hot" style={{ color: 'black', fontWeight: 'bold', fontSize: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                      <img src={hot_icon} alt="hot icon" style={{ width: '30px', height: '30px' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                      <span style={{ marginTop: '10px', display: 'inline-block', textAlign: 'center' }}><FormattedMessage id="classify" defaultMessage="分类" /></span>
                    </Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '25%' }}>
                    <Link to="/friend" style={{ color: 'black', fontWeight: 'bold', fontSize: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                      <img src={friend_icon} alt="friend icon" style={{ width: '30px', height: '30px' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                      <span style={{ marginTop: '10px', display: 'inline-block', textAlign: 'center' }}><FormattedMessage id="friend" defaultMessage="好友" /></span>
                    </Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '25%' }}>
                    <Link to="/my" style={{ color: 'black', fontWeight: 'bold', fontSize: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                      <img src={my_icon} alt="my icon" style={{ width: '30px', height: '30px' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                      <span style={{ marginTop: '10px', display: 'inline-block', textAlign: 'center' }}><FormattedMessage id="my" defaultMessage="我的" /></span>
                    </Link>
                  </div>
                </div>
              </div>
              <div style={{ marginLeft: '120px', width: '100%' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/hot" element={<Hot />} />
                  <Route path="/friend" element={<Friend />} />
                  <Route path="/my" element={<My />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/up' element={<Up />} />
                </Routes>
              </div>
            </div>
          </div >
        </IntlProvider>
      </Router >
    );
  }
}

export default Userpage;
