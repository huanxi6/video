import React, { useState, useEffect } from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import en from '../../../lang/en.json';
import ZH_CN from '../../../lang/zh-CN.json';
import ru from '../../../lang/ru.json';
import ZH_TW from '../../../lang/zh-TW.json';
import "./login.css";

const messages = {
  en,
  'zh-CN': ZH_CN,
  ru,
  'zh-TW': ZH_TW,
};

function Login(props) {
  const [login, setLogin] = useState({ username: '', password: '' });
  const [errorMsg, setErrorMsg] = useState("");

  // 语言国际化
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // 获取设置的语言，例如从localStorage中读取
    const lang = localStorage.getItem('lang');
    if (lang) {
      setLocale(lang);
    }
  }, []);

  //处理点击登录按钮事件
  async function handleLoginClick() {
    try {
      //向服务器发送POST请求来验证登录
      const response = await fetch('http://154.94.6.196:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login) //修正登录数据对象错误
      });

      const data = await response.json();

      // 如果登录成功
      if (data.success === true) {
        if (data.isAdmin === true) {
          window.location.href = "/userpage";
        } else {
          window.location.href = "/";
        }
        // 将登录信息和用户信息输出到sessionStorage
        sessionStorage.setItem("user", JSON.stringify({ username: login.username }));
      } else {
        // 获取设置的语言，例如从localStorage中读取
        const lang = localStorage.getItem('lang');
        if (lang) {
          setLocale(lang);
          if (lang === 'ru') {
            setErrorMsg("Неправильное имя пользователя или пароль"); // 将错误信息显示到页面
          } else if (lang === 'zh-CN') {
            setErrorMsg("账号或密码错误"); // 将错误信息显示到页面
          } else if (lang === 'zh-TW') {
            setErrorMsg("帳號或密碼錯誤"); // 将错误信息显示到页面
          } else if (lang === 'en') {
            setErrorMsg("Incorrect username or password"); // 将错误信息显示到页面
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function onSubmit(event) {
    event.preventDefault(); // 阻止默认提交表单行为
    handleLoginClick(); // 处理登录按钮点击事件
  }

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div >
        <h2 className="h2"><FormattedMessage id="Userlogin" defaultMessage="用户登录" /></h2>
        <form className="form" onSubmit={onSubmit}>
          <div>
            <label className="label"><FormattedMessage id="Account" defaultMessage="帐号" />:</label>
            <input
              className="input"
              type="text"
              onChange={(e) => setLogin({ ...login, username: e.target.value })}
              value={login.username} // maintain input value
            />
          </div>
          <div>
            <label className="label"><FormattedMessage id="Password" defaultMessage="密码" />:</label>
            <input
              className="input"
              type="password"
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              value={login.password} // maintain input value
            />
          </div>
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>} {/*在页面中显示错误信息*/}
          <button className="button" type="submit"><FormattedMessage id="Login" defaultMessage="登录" /></button>
        </form>
      </div>
    </IntlProvider>
  );

}

export default Login;

