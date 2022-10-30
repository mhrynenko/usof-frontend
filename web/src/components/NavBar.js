import React, { useContext, useState } from 'react'
import { Context } from '../index'
import { Navbar, InputGroup, Form, NavbarBrand } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { LOGIN_ROUTE, MAIN_ROUTE, POSTS_ROUTE, REGISTER_ROUTE, SETTINGS_ROUTE } from '../utils/consts';
import { ModalConfirm } from './ModalConfirm';
import style from '../styles/NavBar.module.css'
import { signOUT } from '../http/userAPI';
import logo from '../files/logo.png'
import { ModalPost } from './ModalPost';

export const NavBar = observer(() => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    const handleClick = () => {
        setShow(current => !current);
    }

    const handleClickCreate = () => {
        setShowCreate(current => !current);
    }

    const logout = async () => {
        setShow(false)
        await signOUT()
        user.setIsAuth(false);
        user.setUser({});
        navigate(MAIN_ROUTE)
    }

    return (
        <Navbar className={style.nav} collapseOnSelect expand='lg'>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse className={style.inner} id='responsive-navbar-nav'>
                <NavLink to={MAIN_ROUTE}>
                    <img className={style.brand} src={logo}></img>
                </NavLink>
                <button 
                    onClick={() => navigate(POSTS_ROUTE)}
                    className={`${style.btns} ${style.info_btns}`}
                >
                    Posts
                </button>
                {
                    user.isAuth ? 
                    <button 
                        onClick={() => navigate(SETTINGS_ROUTE)}
                        className={style.info_btns}
                    >
                        Settings
                    </button>
                    :
                    <button 
                        onClick={() => navigate(MAIN_ROUTE)}
                        className={style.info_btns}
                    >
                        Secret
                    </button>
                }
                <button 
                    onClick={() => navigate(MAIN_ROUTE)}
                    className={style.info_btns}
                >
                    Help
                </button>
                <InputGroup className={style.input}>
                    <button id="inputGroup-sizing-default">
                        <Search />
                    </button>
                    <Form.Control
                        placeholder='Serach problem'
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                    />
                </InputGroup>
                {   
                    user.isAuth ? 
                    <>
                        <button 
                            variant={"outline-light"}
                            className={style.action_btns}
                            onClick={handleClickCreate}
                        >
                            Create Post
                        </button>
                        <button 
                            variant={"outline-light"}
                            onClick={handleClick}
                            className={style.action_btns}
                        >
                            Logout
                        </button>
                    </>
                    :
                    <>
                        <button 
                            variant={"outline-light"} 
                            onClick={() => navigate(LOGIN_ROUTE)}
                            className={style.action_btns}
                        >
                            Login
                        </button>
                        <button 
                            variant={"outline-light"}
                            onClick={() => navigate(REGISTER_ROUTE)}
                            className={style.action_btns}
                        >
                            Register
                        </button>
                    </>
                }
            </Navbar.Collapse>
            <ModalConfirm func={logout} show={show} setShow={(bool) => setShow(bool)}/>
            <ModalPost show={showCreate} header={'Create your post'} setShow={(bool) => setShowCreate(bool)}/>
        </Navbar>
    )
})
