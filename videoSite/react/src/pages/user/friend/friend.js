import React, { useEffect, useState } from 'react';
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

const Friend = () => {
  const [showFans, setShowFans] = useState(false); // 默认不展示粉丝列表
  const [myFriends, setMyFriends] = useState([]); // 我的好友列表
  const [friendOf, setFriendOf] = useState([]); // 关注我的人列表
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteFriend = (friendId) => {
    setIsDeleting(true);  // 禁用按钮
    setTimeout(() => {
      const url = 'http://154.94.6.196:3001/dfriend/'; // 删除好友的API地址
      fetch(url, {
        method: 'POST', // 请求方法为POST
        headers: {
          'Content-Type': 'application/json' // 请求头中的Content-Type为application/json
        },
        body: JSON.stringify({ id: friendId }) // 请求体中的数据为要删除的好友的id
      })
        .then(response => response.json()) // 将响应转换为JSON格式
        .catch(error => {
          console.error('Error:', error); // 如果返回信息
          window.location.reload(); // 刷新页面
        });
    }, 500);
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

  const [user] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [noFriends, setNoFriends] = useState(false);
  useEffect(() => {
    if (!user) {
      return;
    }
    const { username } = JSON.parse(sessionStorage.getItem('user'));
    const name = username;
    const fdname = username;
    fetch('http://154.94.6.196:3001/friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, fdname })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMyFriends(data.myFriends);
          setFriendOf(data.friendOf);
        } else if (data.message === "用户不存在") {
          setNoFriends(true);
        }
      })
      .catch(err => console.log(err));
  }, [user]);

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
    if (noFriends) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div style={{ marginTop: '0px', overflowY: 'scroll', height: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)', width: 'calc(100% - 120px)', position: 'fixed', top: '80px', left: '120px' }}>
            <div style={{ marginTop: '60px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px', height: '80px' }}>
              <h2><FormattedMessage id="notfollowersfollowing" defaultMessage="你没有关注任何人，也没有任何人关注你" /></h2>
            </div>
          </div>
        </IntlProvider>
      );
    }
    if (!myFriends) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div>
            <div style={{ position: 'fixed', top: '80px', left: '120px', width: 'calc(100% - 120px)', zIndex: '1' }}>
              <button style={{ width: '50%', height: '50px', backgroundColor: !showFans ? 'black' : 'white', color: !showFans ? 'white' : 'black', fontWeight: 'bold' }} onClick={() => setShowFans(false)}><FormattedMessage id="Myfollowing" defaultMessage="我的关注" /></button>
              <button style={{ width: '50%', height: '50px', backgroundColor: showFans ? 'black' : 'white', color: showFans ? 'white' : 'black', fontWeight: 'bold' }} onClick={() => setShowFans(true)}><FormattedMessage id="Myfollowers" defaultMessage="我的粉丝" /></button>
            </div>
            <div style={{ marginTop: '0px', overflowY: 'scroll', height: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)', width: 'calc(100% - 120px)', position: 'fixed', top: '80px', left: '120px' }}>
              {showFans ?
                <div style={{ marginTop: '60px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px', height: '80px' }}>
                  {friendOf.map((friend) => (
                    <div key={friend.id} style={{ border: '1px solid black', borderRadius: '10px', padding: '10px', margin: '10px', minWidth: '300px', display: 'flex', alignItems: 'center', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)' }}>
                      <img src={friend.avatar} alt={friend.name} style={{ width: '70px', height: '70px', borderRadius: '50%', marginRight: '10px' }} />
                      <p style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '80px' }}>{friend.name}</p>
                    </div>
                  ))}
                </div>
                :
                <div style={{ marginTop: '60px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px', height: '80px' }}>
                  <h1><FormattedMessage id="notfollowing" defaultMessage="你没有关注任何人" /></h1>
                </div>
              }
            </div>
          </div>
        </IntlProvider>
      );
    } else if (!myFriends) {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div>
            <div style={{ position: 'fixed', top: '80px', left: '120px', width: 'calc(100% - 120px)', zIndex: '1' }}>
              <button style={{ width: '50%', height: '50px', backgroundColor: !showFans ? 'black' : 'white', color: !showFans ? 'white' : 'black', fontWeight: 'bold' }} onClick={() => setShowFans(false)}><FormattedMessage id="Myfollowing" defaultMessage="我的关注" /></button>
              <button style={{ width: '50%', height: '50px', backgroundColor: showFans ? 'black' : 'white', color: showFans ? 'white' : 'black', fontWeight: 'bold' }} onClick={() => setShowFans(true)}><FormattedMessage id="Myfollowers" defaultMessage="我的粉丝" /></button>
            </div>
            <div style={{ marginTop: '0px', overflowY: 'scroll', height: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)', width: 'calc(100% - 120px)', position: 'fixed', top: '80px', left: '120px' }}>
              {showFans ?
                <div style={{ marginTop: '60px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px', height: '80px' }}>
                  <h1><FormattedMessage id="notfollowers" defaultMessage="你还没有粉丝" /></h1>
                </div>
                :
                <div style={{ marginTop: '60px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px', height: '80px' }}>
                  {myFriends.map((friend) => (
                    <div key={friend.id} style={{ border: '1px solid black', borderRadius: '10px', padding: '10px', margin: '10px', minWidth: '300px', display: 'flex', alignItems: 'center', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)' }}>
                      <img src={friend.avatar} alt={friend.name} style={{ width: '70px', height: '70px', borderRadius: '50%', marginRight: '10px' }} />
                      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{friend.name}</p>
                      <button
                        style={{ marginLeft: 'auto', backgroundColor: isDeleting ? 'gray' : 'red', color: 'white', fontWeight: 'bold', borderRadius: '5px', padding: '5px' }}
                        onClick={() => handleDeleteFriend(friend.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <FormattedMessage id="Pleasewait" defaultMessage="请稍后" /> : <FormattedMessage id="Unfollow" defaultMessage="取消关注" />}
                      </button>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
        </IntlProvider>
      );
    } else {
      return (
        <IntlProvider locale={locale} messages={messages[locale]}>
          <div>
            <div style={{ position: 'fixed', top: '80px', left: '120px', width: 'calc(100% - 120px)', zIndex: '1' }}>
              <button style={{ width: '50%', height: '50px', backgroundColor: !showFans ? 'black' : 'white', color: !showFans ? 'white' : 'black', fontWeight: 'bold' }} onClick={() => setShowFans(false)}><FormattedMessage id="Myfollowing" defaultMessage="我的关注" /></button>
              <button style={{ width: '50%', height: '50px', backgroundColor: showFans ? 'black' : 'white', color: showFans ? 'white' : 'black', fontWeight: 'bold' }} onClick={() => setShowFans(true)}><FormattedMessage id="Myfollowers" defaultMessage="我的粉丝" /></button>
            </div>
            <div style={{ marginTop: '0px', overflowY: 'scroll', height: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)', width: 'calc(100% - 120px)', position: 'fixed', top: '80px', left: '120px' }}>
              {showFans ?
                <div style={{ marginTop: '60px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px', height: '80px' }}>
                  {friendOf.map((friend) => (
                    <div key={friend.id} style={{ border: '1px solid black', borderRadius: '10px', padding: '10px', margin: '10px', minWidth: '300px', display: 'flex', alignItems: 'center', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)' }}>
                      <img src={friend.avatar} alt={friend.name} style={{ width: '70px', height: '70px', borderRadius: '50%', marginRight: '10px' }} />
                      <p style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '80px' }}>{friend.name}</p>
                    </div>
                  ))}
                </div>
                :
                <div style={{ marginTop: '60px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px', height: '80px' }}>
                  {myFriends.map((friend) => (
                    <div key={friend.id} style={{ border: '1px solid black', borderRadius: '10px', padding: '10px', margin: '10px', minWidth: '300px', display: 'flex', alignItems: 'center', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)' }}>
                      <img src={friend.avatar} alt={friend.name} style={{ width: '70px', height: '70px', borderRadius: '50%', marginRight: '10px' }} />
                      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{friend.name}</p>
                      <button
                        style={{ marginLeft: 'auto', backgroundColor: isDeleting ? 'gray' : 'red', color: 'white', fontWeight: 'bold', borderRadius: '5px', padding: '5px' }}
                        onClick={() => handleDeleteFriend(friend.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <FormattedMessage id="Pleasewait" defaultMessage="请稍后" /> : <FormattedMessage id="Unfollow" defaultMessage="取消关注" />}
                      </button>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
        </IntlProvider>
      )
    };
  };
};

export default Friend;






