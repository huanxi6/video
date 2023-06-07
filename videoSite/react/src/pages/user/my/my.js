import React, { useState, useEffect } from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import en from '../../../lang/en.json';
import ZH_CN from '../../../lang/zh-CN.json';
import ru from '../../../lang/ru.json';
import ZH_TW from '../../../lang/zh-TW.json';
import { Link } from "react-router-dom";

const messages = {
  en,
  'zh-CN': ZH_CN,
  ru,
  'zh-TW': ZH_TW,
};

function My() {
  // 获取当前用户名
  // 从sessionStorage中获取用户信息
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [videos, setVideos] = useState([]);
  const [videoMessage, setVideoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || loading) {
      return;
    }
    setLoading(true);
    fetch('http://154.94.6.196:3001/videouser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user.username
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(true);
        if (data.success) {
          setVideos(data.videos);
        } else {
          // 获取设置的语言，例如从localStorage中读取
          const lang = localStorage.getItem('lang');
          if (lang) {
            if (lang === 'ru') {
              setVideoMessage("Видео еще не загружено");
            } else if (lang === 'zh-CN') {
              setVideoMessage("还未上传视频");
            } else if (lang === 'zh-TW') {
              setVideoMessage("還未上傳視頻");
            } else if (lang === 'en') {
              setVideoMessage("No video has been uploaded yet");
            }
          }
        }
      })
  }, [user, loading]);



  // 语言国际化
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // 获取设置的语言，例如从localStorage中读取
    const lang = localStorage.getItem('lang');
    if (lang) {
      setLocale(lang);
    }
  }, []);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showPasword, setShowPasword] = useState(false);

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
    function EnterNewSignature() {
      const lang = localStorage.getItem('lang');
      if (lang) {
        if (lang === 'ru') {
          return (
            <textarea placeholder="Введите новую подпись" id="bios" style={{ width: "80%", height: "100px", borderRadius: "4px", border: "1px solid grey", padding: "5px" }} />
          )
        } else if (lang === 'zh-CN') {
          return (
            <textarea placeholder="输入新的签名" id="bios" style={{ width: "80%", height: "100px", borderRadius: "4px", border: "1px solid grey", padding: "5px" }} />
          )
        } else if (lang === 'zh-TW') {
          return (
            <textarea placeholder="輸入新的簽名" id="bios" style={{ width: "80%", height: "100px", borderRadius: "4px", border: "1px solid grey", padding: "5px" }} />
          )
        } else if (lang === 'en') {
          return (
            <textarea placeholder="Enter New Signature" id="bios" style={{ width: "80%", height: "100px", borderRadius: "4px", border: "1px solid grey", padding: "5px" }} />
          )
        }
      }
    }

    const styles = {
      videoContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '100px'
      },
      video: {
        position: 'relative',
        width: '300px',
        height: '225px',
        margin: '10px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        borderRadius: '5px',
        overflow: 'hidden',
        cursor: 'pointer',
      },
      videoInfo: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '10px',
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        opacity: 0,
        transition: '0.3s'
      },
      videoTitle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        boxSizing: 'border-box',
        width: '100%',
        height: '60px',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: '1rem'
      }
    };
    const handleBioModalClose = () => {
      const bio = document.getElementById("bios").value;
      if (bio === "") {
        const data = {
          user_id: JSON.parse(sessionStorage.getItem('users')).userInfo.user_id.toString(),
          bio: "这个人很懒,什么也没有写"
        }
        fetch('http://154.94.6.196:3001/userbio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error(error));
        setTimeout(() => {
          const lang = localStorage.getItem('lang');
          if (lang) {
            if (lang === 'ru') {
              alert(`Изменения сохранены. Новые настройки вступят в силу после следующего входа.`);
            } else if (lang === 'zh-CN') {
              alert(`修改成功，将在下次登录时生效。`);
            } else if (lang === 'zh-TW') {
              alert(`修改已保存，新设置将在下次登录时生效。`);
            } else if (lang === 'en') {
              alert(`Changes saved. The new settings will take effect upon next login.`);
            }
          }
          setShowBioModal(false);
        }, 300);
      } else {
        const data = {
          user_id: JSON.parse(sessionStorage.getItem('users')).userInfo.user_id.toString(),
          bio: bio
        }
        fetch('http://154.94.6.196:3001/userbio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error(error));
        setTimeout(() => {
          const lang = localStorage.getItem('lang');
          if (lang) {
            if (lang === 'ru') {
              alert(`Изменения сохранены. Новые настройки вступят в силу после следующего входа.`);
            } else if (lang === 'zh-CN') {
              alert(`修改成功，将在下次登录时生效。`);
            } else if (lang === 'zh-TW') {
              alert(`修改已保存，新设置将在下次登录时生效。`);
            } else if (lang === 'en') {
              alert(`Changes saved. The new settings will take effect upon next login.`);
            }
          }
          setShowBioModal(false);
        }, 300);

      }
    }

    const handlePasswordModalClose = () => {
      const password = document.getElementById("password-input").value;
      if (password.length < 6) {
        const lang = localStorage.getItem('lang');
        if (lang) {
          if (lang === 'ru') {
            alert("Пароль должен содержать не менее шести символов");
          } else if (lang === 'zh-CN') {
            alert("密码不少于六位");
          } else if (lang === 'zh-TW') {
            alert("密碼不少於六位");
          } else if (lang === 'en') {
            alert(" Password should not be less than six characters");
          }
        }
        setShowPasword(false);
        return;
      }
      const data = {
        user_id: JSON.parse(sessionStorage.getItem('users')).userInfo.user_id.toString(),
        password: password
      }
      fetch('http://154.94.6.196:3001/userpswd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
      setTimeout(() => {
        const lang = localStorage.getItem('lang');
        if (lang) {
          if (lang === 'ru') {
            alert(`Пароль успешно изменен: ${password}\nНовый пароль будет действовать после следующего входа.`);
          } else if (lang === 'zh-CN') {
            alert(`密码修改成功: ${password}\n新密码将在下次登录时生效。`);
          } else if (lang === 'zh-TW') {
            alert(`密码修改成功: ${password}\n新密码将在下次登录时生效。`);
          } else if (lang === 'en') {
            alert(`Password updated successfully: ${password}\nYour new password will take effect on your next login.`);
          }
        }
        setShowPasword(false);
      }, 300);
    }

    const handleAvatarUpload = () => {
      const data = new FormData();
      data.append('video', document.getElementById("avatar-upload").files[0]);
    }

    const handleAvatarModalClose = () => {
      const file = document.getElementById("avatar-upload").files[0];
      if (!file) {
        const lang = localStorage.getItem('lang');
        if (lang) {
          if (lang === 'ru') {
            alert("Файл не может быть пустым");
          } else if (lang === 'zh-CN') {
            alert("文件不能为空");
          } else if (lang === 'zh-TW') {
            alert("文件不能為空");
          } else if (lang === 'en') {
            alert("File cannot be empty");
          }
        }
        setShowAvatarModal(false);
        return;
      }
      const data = new FormData();
      data.append('video', file);
      fetch('http://154.94.6.196:3001/upuserimg', {
        method: 'POST',
        body: data,
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.message === "视频上传成功") {
            const imgName = data.file.filename;
            const userId = JSON.parse(sessionStorage.getItem('users')).userInfo.user_id.toString();
            const imgData = {
              user_id: userId,
              avatar: "http://154.94.6.196:8888/down/ia5hqWAvUBtr?fname=userimg/" + imgName
            }
            fetch('http://154.94.6.196:3001/userimg', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(imgData)
            })
              .then(response => response.json())
              .then(data => console.log(data))
              .catch(error => console.error(error));
          }
        })
        .catch(error => console.error(error));
      const lang = localStorage.getItem('lang');
      if (lang) {
        if (lang === 'ru') {
          alert(`Изменения сохранены. Новые настройки вступят в силу после следующего входа.`);
        } else if (lang === 'zh-CN') {
          alert(`修改成功，将在下次登录时生效。`);
        } else if (lang === 'zh-TW') {
          alert(`修改已保存，新设置将在下次登录时生效。`);
        } else if (lang === 'en') {
          alert(`Changes saved. The new settings will take effect upon next login.`);
        }
      }
      setShowAvatarModal(false);
    }

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div>
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
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button style={{ backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", padding: "8px 35px", cursor: "pointer", textDecoration: "none", marginRight: "20px" }} onClick={() => setShowAvatarModal(true)}><FormattedMessage id="ChangeAvatar" defaultMessage="修改头像" /></button>
            <button style={{ backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", padding: "8px 35px", cursor: "pointer", textDecoration: "none" }} onClick={() => setShowBioModal(true)}><FormattedMessage id="ChangeSignature" defaultMessage="修改签名" /></button>
            <button style={{ backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", padding: "8px 35px", cursor: "pointer", textDecoration: "none", marginLeft: "20px" }} onClick={() => setShowPasword(true)}><FormattedMessage id="ChangePassword" defaultMessage="修改密码" /></button>
          </div>
          {showAvatarModal && (
            <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "2px 2px 5px grey" }}>
                <center>
                  <h2><FormattedMessage id="ChangeSignature" defaultMessage="修改头像" /></h2>
                  <input type="file" accept="image/*" id="avatar-upload" style={{ display: "none" }} onChange={handleAvatarUpload} />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <button style={{ backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", padding: "8px 35px", cursor: "pointer", textDecoration: "none", marginBottom: "20px" }} onClick={() => document.getElementById("avatar-upload").click()}><FormattedMessage id="ChooseAvatar" defaultMessage="选择头像" /></button>
                    <button style={{ backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", padding: "8px 35px", cursor: "pointer", textDecoration: "none" }} onClick={handleAvatarModalClose}><FormattedMessage id="Confirm" defaultMessage="确认" /></button>
                  </div>
                </center>
              </div>
            </div>
          )}
          {showBioModal && (
            <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "2px 2px 5px grey" }}>
                <center>
                  <h3><FormattedMessage id="ChangeSignature" defaultMessage="修改签名" /></h3>
                  <EnterNewSignature />
                  <button style={{ backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", padding: "8px 35px", cursor: "pointer", textDecoration: "none", marginTop: "20px" }} onClick={handleBioModalClose}><FormattedMessage id="Confirm" defaultMessage="确认" /></button>
                </center>
              </div>
            </div>
          )}
          {showPasword && (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "2px 2px 5px grey" }}>
              <h3><FormattedMessage id="ChangePassword" defaultMessage="修改密码" /></h3>
              <input id="password-input" type="password" style={{ marginBottom: "20px", padding: "10px", borderRadius: "5px", border: "1px solid grey" }} />
              <button style={{ backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", padding: "8px 35px", cursor: "pointer", textDecoration: "none", marginTop: "20px" }} onClick={handlePasswordModalClose}><FormattedMessage id="Confirm" defaultMessage="确认" /></button>
            </div>
          )}
          <div>
            <h1 style={{ textAlign: 'center', marginTop: '50px' }}><FormattedMessage id="MyVideos" defaultMessage="我的视频" /></h1>
            {videos.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2 style={{ fontFamily: "Arial, sans-serif" }}>{videoMessage}</h2>
              </div>
            ) : (
              <div style={styles.videoContainer}>
                {videos.map((video, index) => (
                  <div
                    key={index}
                    style={styles.video}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.zIndex = 1;
                      e.currentTarget.childNodes[0].style.opacity = 0.6;
                      e.currentTarget.childNodes[1].style.opacity = 1;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.zIndex = 0;
                      e.currentTarget.childNodes[0].style.opacity = 1;
                      e.currentTarget.childNodes[1].style.opacity = 0;
                    }}
                  >
                    <img
                      src={video.file_url}
                      style={{ width: '100%', height: '100%', transition: '0.3s' }}
                      alt={video.title}
                    />
                    {/* 视频信息，在鼠标悬停时显示 */}
                    <div style={styles.videoInfo}>
                      <p><FormattedMessage id="Views" defaultMessage="观看次数" />: {video.views}</p>
                      <p><FormattedMessage id="Likes" defaultMessage="点赞次数" />: {video.likes}</p>
                      <p><FormattedMessage id="VideoCategory" defaultMessage="视频分类" />: {(() => {
                        switch (video.category_name) {
                          case '美食':
                            return <FormattedMessage id="category_food" defaultMessage="美食" />;
                          case '颜值':
                            return <FormattedMessage id="category_beauty" defaultMessage="颜值" />;
                          case '风景':
                            return <FormattedMessage id="category_scenery" defaultMessage="景点" />;
                          default:
                            return video.category_name;
                        }
                      })()}</p>
                      <p><FormattedMessage id="Uploadtime" defaultMessage="上传时间" />:{video.created_at}</p>
                    </div>
                    <div style={styles.videoTitle}>
                      {video.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </IntlProvider>
    );

  }
}

export default My;

