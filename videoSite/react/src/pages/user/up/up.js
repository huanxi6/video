import React, { useState, useEffect } from "react";
import { IntlProvider, FormattedMessage } from 'react-intl';
import axios from 'axios';
import en from '../../../lang/en.json';
import ZH_CN from '../../../lang/zh-CN.json';
import ru from '../../../lang/ru.json';
import ZH_TW from '../../../lang/zh-TW.json';
import Upvideo from './img/upload_video_icon.png';
import Video from './img/video_icon.png';
import { Link } from "react-router-dom";

const messages = {
  en,
  'zh-CN': ZH_CN,
  ru,
  'zh-TW': ZH_TW,
};

function VideoUploadPage() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [videoIcon, setVideoIcon] = useState(Upvideo);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // 从sessionStorage获取user的值
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch('http://154.94.6.196:3001/category', { method: 'POST' });
      const data = await response.json();
      setCategories(data.categories);
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`title: ${title}, category: ${category}, file: ${file?.name}`);
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

  const handleFileSelect = (event) => {
    if (event.target.files[0]) {
      setFile(event.target.files[0]);
      setVideoIcon(Video);
      setSelectedFile(event.target.files[0]);
    } else {
      setFile(null);
      setVideoIcon(Upvideo);
      setSelectedFile(null);
    }
  };

  function set1() {
    const lang = localStorage.getItem('lang');
    if (lang) {
      if (lang === 'ru') {
        setUploadStatus(<span style={{ color: 'orange' }}>Загрузка...</span>);
      } else if (lang === 'zh-CN') {
        setUploadStatus(<span style={{ color: 'orange' }}>上传中...</span>);
      } else if (lang === 'zh-TW') {
        setUploadStatus(<span style={{ color: 'orange' }}>上傳中...</span>);
      } else if (lang === 'en') {
        setUploadStatus(<span style={{ color: 'orange' }}>Uploading...</span>);
      }
    }
  }
  function set2() {
    const lang = localStorage.getItem('lang');
    if (lang) {
      if (lang === 'ru') {
        setUploadStatus(<span style={{ color: 'red' }}>заполните все обязательные поля</span>);
      } else if (lang === 'zh-CN') {
        setUploadStatus(<span style={{ color: 'red' }}>请填写完整信息</span>);
      } else if (lang === 'zh-TW') {
        setUploadStatus(<span style={{ color: 'red' }}>請填寫完整資訊</span>);
      } else if (lang === 'en') {
        setUploadStatus(<span style={{ color: 'red' }}>Please fill in all required fields</span>);
      }
    }
  }
  function set3() {
    const lang = localStorage.getItem('lang');
    if (lang) {
      if (lang === 'ru') {
        setUploadStatus(<span style={{ color: 'green' }}>Видео загружено успешно</span>);
      } else if (lang === 'zh-CN') {
        setUploadStatus(<span style={{ color: 'green' }}>上传成功</span>);
      } else if (lang === 'zh-TW') {
        setUploadStatus(<span style={{ color: 'green' }}>上傳成功</span>);
      } else if (lang === 'en') {
        setUploadStatus(<span style={{ color: 'green' }}>Video uploaded successfully</span>);
      }
    }
  }


  const handleFileUpload = async () => {
    try {
      setIsButtonDisabled(true);
      set1();
      const formData = new FormData();
      if (!selectedFile || !title || !category) {
        set2();
        return;
      }
      formData.append('video', selectedFile);

      const response = await axios.post('http://154.94.6.196:3001/upvideo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      if (response.data.message === '视频上传成功') {
        const videoInfo = {
          "user_name": JSON.parse(sessionStorage.getItem("user")).username,
          "file_url": "http://154.94.6.196:8888/down/ia5hqWAvUBtr?fname=img/" + response.data.file.filename + ".jpg",
          "thumbnail_url": "http://154.94.6.196:8888/down/ia5hqWAvUBtr?fname=video/" + response.data.file.filename,
          "title": title,
          "category_name": category
        };
        await axios.post('http://154.94.6.196:3001/upvideoid', JSON.stringify(videoInfo), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        set3();
        setTimeout(() => {
          setTitle("");
          setCategory("");
          setFile(null);
          setVideoIcon(Upvideo); // 设置视频图标为上传图标
          setSelectedFile(null); // 清空选择的文件
        }, 500);

      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  if (!user) {
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2 style={{ fontFamily: "Arial, sans-serif" }}><FormattedMessage id="Loginmessage1" defaultMessage="您需要登录" /></h2>
          <p style={{ fontFamily: "Arial, sans-serif", fontSize: "1rem" }}><FormattedMessage id="Loginmessage2" defaultMessage="请先登录以查看此页面。" /></p>
          <Link to="/login" className="login-btn" style={{ fontFamily: "Arial, sans-serif", fontSize: "1rem", backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", padding: "8px 20px", cursor: "pointer", textDecoration: "none" }}><FormattedMessage id="Login" defaultMessage="登录" /></Link>
        </div>
      </IntlProvider>
    );
  } else {
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 80px)' }}>
          <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <img src={videoIcon} alt="video icon" style={{ width: '200px', height: '200px', marginBottom: '10px' }} />
            {file && (
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                {file.name}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '110%' }}>
              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', width: '100%' }}>
                <label htmlFor="title" style={{ marginRight: '10px', width: '40%' }}><FormattedMessage id="Title" defaultMessage="标题" />:</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />
              </div>
              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', width: '100%' }}>
                <label htmlFor="category" style={{ marginRight: '10px', width: '40%' }}><FormattedMessage id="Category" defaultMessage="类别" />:</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}>
                  <option disabled value=""><FormattedMessage id="Selectvideocategory" defaultMessage="选择视频类别" /></option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.name}>
                      {(() => {
                        switch (cat.name) {
                          case '美食':
                            return <FormattedMessage id="category_food" defaultMessage="美食" />;
                          case '颜值':
                            return <FormattedMessage id="category_beauty" defaultMessage="颜值" />;
                          case '风景':
                            return <FormattedMessage id="category_scenery" defaultMessage="景点" />;
                          default:
                            return cat.name;
                        }
                      })()}
                    </option>
                  ))}
                </select>

              </div>
              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', width: '100%' }}>
                <label htmlFor="file" style={{ marginRight: '10px', width: '40%' }}><FormattedMessage id="File" defaultMessage="文件" />:</label>
                <input type="file" id="file" accept="video/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                <button onClick={() => document.getElementById('file').click()} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}><FormattedMessage id="Selectvideofile" defaultMessage="选择视频文件" /></button>
              </div>
              <button onClick={handleFileUpload} disabled={isButtonDisabled} type="submit" style={{ padding: '5px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff', width: '100%' }}><FormattedMessage id="Uploadvideo" defaultMessage="上传视频" /></button>
              <p>{uploadStatus}</p>
            </form>
          </div>
        </div >
      </IntlProvider >
    );

  }
}

export default VideoUploadPage;
