import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Alert, Button, CloseButton, Container, FloatingLabel, Form } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { signUP, signIN } from "../http/userAPI";
import { LOGIN_ROUTE, MAIN_ROUTE, REGISTER_ROUTE } from "../utils/consts";
import jwt_decode from 'jwt-decode';
import { Context } from "..";
import style from '../styles/Auth.module.css'
import logo from '../files/logo.png'

const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation();
    const navigate = useNavigate();
    let isLogin = location.pathname === LOGIN_ROUTE;
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirm, setPasswordConfirm] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('errmsg');

    const checkFields = () => {
        if(login === '' || email === '' || password === '') {
            return false
        }
        return true
    };

    const auth = async () => {
        if (!checkFields()) {
            setError("Please, fill all fields")
            setShow(true)
            return;
        }

        setShow(false);
        let data;
        if (isLogin) {
            data = await signIN(login, email, password)
        }
        else {
            data = await signUP(login, email, password, password_confirm)
        }
        
        if (data.error) {
            console.log(data.error);
            setError(data.error)
            setShow(true)
            return;
        }

        if(isLogin) {
            user.setUser(jwt_decode(data.token))
            user.setIsAuth(true)
            navigate(MAIN_ROUTE)
            return;
        }
        else {
            navigate(LOGIN_ROUTE)
            return
        }
    }
    return (
        <Container className ="d-flex justify-content-center align-items-center flex-column">
            <div className={style.blur}>
                <div className="d-flex w-100 justify-content-center align-items-center">
                    <NavLink to={MAIN_ROUTE}>
                        <img className={style.brand} src={logo}></img>
                    </NavLink>
                </div>
                <Alert 
                    show={show} 
                    variant="danger"
                    className={style.alert}>
                    <span>{error}</span>
                    <CloseButton className={style.close_btn} onClick={() => setShow(false)}/>
                </Alert>
                <Form className={style.my_form}>
                    <Form.Group className="mb-3" controlId="formBasicLogin">
                        <Form.Control 
                            required
                            type="text" 
                            placeholder="Login" 
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                            className={style.input}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control 
                            required
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={style.input}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control 
                            required
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={style.input}
                        />
                    </Form.Group>

                    { !isLogin &&
                        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                            <Form.Control 
                                required
                                type="password" 
                                placeholder="Confirm password" 
                                value={password_confirm}
                                onChange={e => setPasswordConfirm(e.target.value)}
                                className={style.input}
                            />
                        </Form.Group>
                    }
                    { isLogin
                        ?
                        <Container className='d-flex justify-content-between'>
                            <Container className='d-flex flex-column'>
                                <span>No account?</span>
                                <NavLink className={style.link} to={REGISTER_ROUTE}>Create it now!</NavLink>
                            </Container>
                            <button 
                                type="button"
                                onClick={auth}
                                className={style.action_btn}
                            >
                                LOGIN
                            </button>
                        </Container>
                        :
                        <Container className='d-flex justify-content-between'>
                            <Container className='d-flex flex-column'>
                                <span>Have account?</span> 
                                <NavLink className={style.link} to={LOGIN_ROUTE}>Sign in!</NavLink>
                            </Container>
                            <button 
                                type="button"
                                onClick={auth}
                                className={style.action_btn}
                            >
                                REGISTER
                            </button>
                        </Container>
                    }
                </Form>
            </div>
        </Container>
    )
})

export default Auth;