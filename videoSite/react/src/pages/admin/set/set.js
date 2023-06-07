import React, { useState, useEffect } from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import en from '../../../lang/en.json';
import ZH_CN from '../../../lang/zh-CN.json';
import ru from '../../../lang/ru.json';
import ZH_TW from '../../../lang/zh-TW.json';

const messages = {
  en,
  'zh-CN': ZH_CN,
  ru,
  'zh-TW': ZH_TW,
};

function Set() {
  const [videoQuality, setVideoQuality] = useState("720p");

  const handleChange = (event) => {
    setVideoQuality(event.target.value);
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

  const selectStyle = {
    backgroundColor: "#000",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(100vh - 80px)",
  };
  const titleStyle = {
    textAlign: "center",
    marginBottom: "20px",
  };
  const subtitleStyle = {
    textAlign: "center",
    marginBottom: "10px",
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className="admin-settings" style={containerStyle}>
        <h1 style={titleStyle}><FormattedMessage id="Administratorsettings" defaultMessage="登录" /></h1>
        <div className="video-settings">
          <h2 style={subtitleStyle}><FormattedMessage id="Videosettings" defaultMessage="登录" /></h2>
          <div>
            <label>
              <FormattedMessage id="Videoquality" defaultMessage="登录" />:
              <select value={videoQuality} onChange={handleChange} style={selectStyle}>
                <option value="480p">480p</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </IntlProvider>
  );
}

export default Set;

