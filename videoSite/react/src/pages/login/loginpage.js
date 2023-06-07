import React, { useState, useEffect } from 'react';
import Login from "./login/login";
import Enroll from "./enroll/enroll";
import { IntlProvider, FormattedMessage } from 'react-intl';
import en from '../../lang/en.json';
import ZH_CN from '../../lang/zh-CN.json';
import ru from '../../lang/ru.json';
import ZH_TW from '../../lang/zh-TW.json';

const messages = {
  en,
  'zh-CN': ZH_CN,
  ru,
  'zh-TW': ZH_TW,
};


function LoginPage() {
  const [showLogin, setShowLogin] = useState(true); // 控制登录表单和注册表单的显示
  const navStyle = { // 外层容器的样式
    display: "flex",
    justifyContent: "center",
  };
  const buttonStyle = { // 按钮的样式
    width: "50%",
    padding: "10px",
    border: "none",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundColor: showLogin ? "#333" : "#eee",
    borderRight: "1px solid #000",
  };
  // 如果按钮背景为深色，文本颜色应该修改为白色
  if (showLogin) {
    buttonStyle.color = "#fff";
  } else {
    buttonStyle.color = "#000";
  }

  // 语言国际化
  const [locale, setLocale] = useState('en');
  useEffect(() => {
    // 获取设置的语言，例如从localStorage中读取
    const lang = localStorage.getItem('lang');
    if (lang) {
      setLocale(lang);
    }
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div>
        <nav style={navStyle}>
          <button style={buttonStyle} onClick={() => setShowLogin(true)}><FormattedMessage id="Login" defaultMessage="登录" /></button>
          <button style={{ ...buttonStyle, backgroundColor: !showLogin ? "#333" : "#eee", color: !showLogin ? "#fff" : "#000" }} onClick={() => setShowLogin(false)}><FormattedMessage id="Register" defaultMessage="注册" /></button>
        </nav>
        {showLogin ? <Login /> : <Enroll />}
      </div>
    </IntlProvider>
  );
}

export default LoginPage;
