import React from 'react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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

function Data() {
  const [userInfo, setUserInfo] = useState({});
  const [videoInfo, setVideoInfo] = useState({});

  // 用户数据详细信息的表
  useEffect(() => {
    const fetchData = async () => {
      const userResponse = await fetch('http://154.94.6.196:3001/userstatistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // any request body data goes here
        })
      });
      const userData = await userResponse.json();
      setUserInfo(userData.userInfo);
    };
    fetchData();
  }, []);


  // 语言国际化
  const [locale, setLocale] = useState('en');
  useEffect(() => {
    // 获取设置的语言，例如从localStorage中读取
    const lang = localStorage.getItem('lang');
    if (lang) {
      setLocale(lang);
    }
  }, []);

  // 对表格语言国际化处理
  const [chartData, setChartData] = useState([
    { name: 'Number of male users', value: userInfo.male_users, fill: '#87cefa' },
    { name: 'Number of female users', value: userInfo.female_users, fill: '#ffb6c1' }
  ]);

  useEffect(() => {
    // 获取设置的语言，例如从localStorage中读取
    const lang = localStorage.getItem('lang');
    if (lang) {
      setLocale(lang);
      if (lang === 'ru') {
        setChartData([
          { name: 'мужчин-пользователей', value: userInfo.male_users, fill: '#87cefa' },
          { name: 'женщин-пользователей', value: userInfo.female_users, fill: '#ffb6c1' }
        ]);
      } else if (lang === 'zh-CN') {
        setChartData([
          { name: '男性用户数', value: userInfo.male_users, fill: '#87cefa' },
          { name: '女性用户数', value: userInfo.female_users, fill: '#ffb6c1' }
        ]);
      } else if (lang === 'zh-TW') {
        setChartData([
          { name: '男性用戶數', value: userInfo.male_users, fill: '#87cefa' },
          { name: '女性用戶數', value: userInfo.female_users, fill: '#ffb6c1' }
        ]);
      } else if (lang === 'en') {
        setChartData([
          { name: 'Number of male users', value: userInfo.male_users, fill: '#87cefa' },
          { name: 'Number of female users', value: userInfo.female_users, fill: '#ffb6c1' }
        ]);
      }
    }
  }, [userInfo.female_users, userInfo.male_users]);

  const userChart = (
    <BarChart
      width={500}
      height={300}
      data={chartData}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" />
    </BarChart>
  );


  // 视频分类信息的表格
  const [videoChartData, setVideoChartData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://154.94.6.196:3001/videostatistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // any request body data goes here
        })
      });
      const data = await response.json();
      const lang = localStorage.getItem('lang');
      setVideoInfo(data.videoInfo);
      if (lang) {
        if (lang === 'ru') {
          setVideoChartData(data.videoInfo.category_videos.map((category) => ({
            name: category.category_name === '美食' ? 'кулинария' : category.category_name === '颜值' ? 'красавица' : 'пейзаж',
            value: category.category_videos,
            fill: '#808080',
          })));
        } else if (lang === 'zh-CN') {
          setVideoChartData(data.videoInfo.category_videos.map((category) => ({
            name: category.category_name === '美食' ? '美食' : category.category_name === '颜值' ? '颜值' : '风景',
            value: category.category_videos,
            fill: '#808080',
          })));
        } else if (lang === 'zh-TW') {
          setVideoChartData(data.videoInfo.category_videos.map((category) => ({
            name: category.category_name === '美食' ? '美食' : category.category_name === '颜值' ? '顏值' : '風景',
            value: category.category_videos,
            fill: '#808080',
          })));
        } else if (lang === 'en') {
          setVideoChartData(data.videoInfo.category_videos.map((category) => ({
            name: category.category_name === '美食' ? 'food' : category.category_name === '颜值' ? 'beauty' : 'scenery',
            value: category.category_videos,
            fill: '#808080',
          })));
        }
      }
    };
    fetchData();

  }, []);


  const videoChart = (
    <BarChart
      width={500}
      height={300}
      data={videoChartData}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#808080" />
    </BarChart>
  );


  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', minWidth: '1000px' }}>
        <div style={{ marginLeft: '80px' }}>
          <center>
            <h2><FormattedMessage id="Useranalysis" defaultMessage="用户分析" /></h2>
            <h3><FormattedMessage id="Totalnumberofusers" defaultMessage="用户总数" />: {userInfo.total_users}</h3>
            <div>{userChart}</div>
          </center>
        </div>
        <div style={{ marginRight: '160px' }}>
          <center>
            <h2><FormattedMessage id="Videoanalysis" defaultMessage="视频分析" /></h2>
            <h3><FormattedMessage id="Totalnumberofvideos" defaultMessage="视频总数" />: {videoInfo.total_videos}</h3>
            <div>{videoChart}</div>
          </center>
        </div>
      </div>
    </IntlProvider>
  );

}

export default Data;