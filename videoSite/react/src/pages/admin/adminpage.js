import React, { useState, useEffect } from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import en from '../../lang/en.json';
import ZH_CN from '../../lang/zh-CN.json';
import ru from '../../lang/ru.json';
import ZH_TW from '../../lang/zh-TW.json';
import { Link } from "react-router-dom";

const messages = {
  en,
  'zh-CN': ZH_CN,
  ru,
  'zh-TW': ZH_TW,
};

function Admin() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  // 语言国际化
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // 获取设置的语言，例如从localStorage中读取
    const lang = localStorage.getItem('lang');
    if (lang) {
      setLocale(lang);
    }
  }, []);

  if (user && user.username === "admin") {
    const userInfo = JSON.parse(sessionStorage.getItem("users"))?.userInfo;
    const timeOptions = { timeZone: "Europe/Moscow", hour12: false };
    const createdDate = new Date(userInfo.created_at).toLocaleString(
      "en-US",
      timeOptions
    );
    const updatedDate = new Date(userInfo.updated_at).toLocaleString(
      "en-US",
      timeOptions
    );
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div style={{ width: "80%", margin: "30px auto 0 auto", border: "2px solid black", padding: "20px", borderRadius: "8px", boxShadow: "2px 2px 5px grey" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "30%", minWidth: "180px", objectFit: "cover", display: "flex", justifyContent: "center" }}>
              <img src={userInfo.avatar} alt="User Avatar" style={{ width: "70%", height: "auto", objectFit: "cover", borderRadius: "50%", textAlign: "center" }} />
            </div>
            <div style={{ flexGrow: 1, minWidth: "300px", padding: "20px" }}>
              <h1 style={{ marginTop: "0", fontSize: "2rem", marginBottom: "20px", fontFamily: "Arial, sans-serif" }}>{userInfo.username}</h1>
              <div>
                <p style={{ fontSize: "1.2rem", fontFamily: "Arial, sans-serif" }}><FormattedMessage id="Introduction" defaultMessage="简介" />: {userInfo.bio}</p>
                <p style={{ fontSize: "1.2rem", fontFamily: "Arial, sans-serif" }}><FormattedMessage id="Email" defaultMessage="邮箱" />: {userInfo.email}</p>
                <p style={{ fontSize: "1.2rem", fontFamily: "Arial, sans-serif" }}><FormattedMessage id="Createdat" defaultMessage="创建于" />: {createdDate}</p>
                <p style={{ fontSize: "1.2rem", fontFamily: "Arial, sans-serif" }}><FormattedMessage id="LastLogin" defaultMessage="最近一次登录" />: {updatedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </IntlProvider>
    );
  } else {
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2 style={{ fontFamily: "Arial, sans-serif" }}><FormattedMessage id="Loginmessage1" defaultMessage="您需要登录" /></h2>
          <p style={{ fontFamily: "Arial, sans-serif", fontSize: "1rem" }}><FormattedMessage id="Loginmessage2" defaultMessage="请先登录以查看此页面。" /></p>
          <Link to="/login" className="login-btn" style={{ fontFamily: "Arial, sans-serif", fontSize: "1rem", backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", padding: "8px 20px", cursor: "pointer", textDecoration: "none" }}><FormattedMessage id="Login" defaultMessage="登录" /></Link>
        </div>
      </IntlProvider>
    );
  }
}

export default Admin;




