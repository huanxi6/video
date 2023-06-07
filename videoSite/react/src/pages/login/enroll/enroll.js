import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import "../login/login.css";

function Register() {
    const [gender, setGender] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false); // changed variable name to camelCase
    const [errorMsg, setErrorMsg] = useState("");

    const handleRegisterClick = async (e) => {
        e.preventDefault();
        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;
        const confirmPassword = e.target.elements.confirmPassword.value;
        const email = e.target.elements.email.value;
        const genderValue = gender === 'male' ? 1 : 0;
        if (username === '' || password === '' || confirmPassword === '' || email === '') {
            const lang = localStorage.getItem('lang');
            if (lang === 'ru') {
                setErrorMsg('Поле имени пользователя, пароля, подтверждения пароля и электронной почты обязательно к заполнению');
            } else if (lang === 'zh-CN') {
                setErrorMsg('用户名、密码、确认密码、邮箱不能为空');
            } else if (lang === 'zh-TW') {
                setErrorMsg('使用者名稱、密碼、確認密碼和電子郵件不能為空');
            } else if (lang === 'en') {
                setErrorMsg('Username, password, confirmation password and email cannot be empty');
            }
        } else if (password.length < 6) { // 验证密码长度是否小于六位
            const lang = localStorage.getItem('lang');
            if (lang === 'ru') {
                setErrorMsg('Пароль должен содержать не менее шести символов');
            } else if (lang === 'zh-CN') {
                setErrorMsg('密码不少于六位');
            } else if (lang === 'zh-TW') {
                setErrorMsg('密碼不少於六位');
            } else if (lang === 'en') {
                setErrorMsg(' Password should not be less than six characters');
            }
        } else if (password !== confirmPassword) { // 验证两次密码是否一致
            const lang = localStorage.getItem('lang');
            if (lang === 'ru') {
                setErrorMsg('Пароли не совпадают');
            } else if (lang === 'zh-CN') {
                setErrorMsg('两次密码不一致');
            } else if (lang === 'zh-TW') {
                setErrorMsg('兩次密碼不一致');
            } else if (lang === 'en') {
                setErrorMsg('The two passwords do not match');
            }
        } else {
            const registerData = {
                username,
                password,
                email,
                gender: genderValue,
                avatar: "https://storage.googleapis.com/huanxi_video/img/default%20avatar.png",
                bio: "这个人很懒，怎么也没有写",
                isAdmin: 0
            };
            try {
                const response = await fetch('http://154.94.6.196:3001/upuser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registerData)
                });
                const data = await response.json();
                console.log(data);
                if (data.success) { // if registration is successful
                    setRegisterSuccess(true); // set register success state to true
                    setErrorMsg(""); // clear error message
                } else if (data.message === "用户名或邮箱已存在") { // 如果返回的是 {"success": false,"message": "用户名或邮箱已存在"} 则提示用户名或邮箱已经存在
                    const lang = localStorage.getItem('lang');
                    if (lang === 'ru') {
                        setErrorMsg('Имя пользователя или адрес электронной почты уже существует');
                    } else if (lang === 'zh-CN') {
                        setErrorMsg('用户名或邮箱已经存在');
                    } else if (lang === 'zh-TW') {
                        setErrorMsg('使用者名稱或電子郵件已經存在');
                    } else if (lang === 'en') {
                        setErrorMsg('Username or email already exists');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <div>
            <h2 className="h2"><FormattedMessage id="Userregistration" defaultMessage="用户注册" /></h2>
            <form className="form" onSubmit={handleRegisterClick}>
                <div>
                    <label className="label"><FormattedMessage id="Account" defaultMessage="帐号" />:</label>
                    <input
                        className="input"
                        type="text"
                        name="username"
                    />
                </div>
                <div>
                    <label className="label"><FormattedMessage id="Password" defaultMessage="密码" />:</label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                    />
                </div>
                <div>
                    <label className="label"><FormattedMessage id="ConfirmPassword" defaultMessage="确认密码" />:</label>
                    <input
                        className="input"
                        type="password"
                        name="confirmPassword"
                    />
                </div>
                <div>
                    <label className="label"><FormattedMessage id="gender" defaultMessage="性别" />:</label>
                    <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="" disabled>{<FormattedMessage id="SelectGender" defaultMessage="请选择你的性别" />}</option>
                        <option value="male">{<FormattedMessage id="male" defaultMessage="男" />}</option>
                        <option value="female">{<FormattedMessage id="female" defaultMessage="女" />}</option>
                    </select>
                </div>
                <div>
                    <label className="label"><FormattedMessage id="Email" defaultMessage="邮箱" />:</label>
                    <input
                        className="input"
                        type="email"
                        name="email"
                    />
                </div>
                {registerSuccess && <p style={{ color: 'green' }}><FormattedMessage id="Registrationsuccessful" defaultMessage="注册成功" /></p>} {/* show success message if registration is successful */}
                {errorMsg && !registerSuccess && <p style={{ color: 'red' }}>{errorMsg}</p>} {/* show error message only if registration is not successful */}
                <button className="button" type="submit"><FormattedMessage id="Register" defaultMessage="注册" /></button>
            </form>
        </div>
    );

}

export default Register;
