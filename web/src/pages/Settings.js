import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, CloseButton, Container, Form, Image, Spinner } from "react-bootstrap";
import { XCircle } from "react-bootstrap-icons";
import style from '../styles/Settings.module.css'
import { Context } from '../index'
import { getOneUser, updateOneUserAvatar, updateOneUserData } from "../http/userAPI";

import default_img from '../files/default_img.png'

const Settings = () => {
    const {user} = useContext(Context)
    const [usr, setUsr] = useState({})
    const inputRef = useRef(null);
    const [file, setFile] = useState()
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false);
    const [error, setError] = useState('errmsg');

    useEffect(() => {
        getOneUser(user.user.id).then(data => {
            setUsr(data.user)
            setLogin(data.user.login)
            setFullName(data.user.full_name)
            setEmail(data.user.email)
            setAvatar(data.user.profile_picture)
        }).finally(() => setLoading(false))
    }, [])

    if (loading ) {
        return <Spinner animation={"grow"}/>
    }

    const handleFileChange = event => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }
        setFile(event.target.files[0])
    };

    const fetchUser = async () => {
        getOneUser(user.user.id).then(data => {
            setUsr(data.user)
            setLogin(data.user.login)
            setFullName(data.user.full_name)
            setEmail(data.user.email)
            setAvatar(data.user.profile_picture)
        })
    }
    
    const resetFileInput = () => {
        inputRef.current.value = null;
        setFile()
    }

    const updatePhoto = () => {
        setShow(false)

        if (!file) {
            setError('No photo was loaded')
            setShow(true)
            return
        }

        if (file.type !== "image/png" && file.type !== "image/jpg" && file.type !== "image/jpeg") {
            setError('Only .png, .jpg and .jpeg format allowed!')
            setShow(true)
            return
        }
        const data = new FormData()
        data.append('avatar', file)

        updateOneUserAvatar(data).then(data =>{
            if(data.error != null) {
                console.log(data)
                setError(data.error)
                setShow(true)
            }
            fetchUser()
        })
    }

    const deletePhoto = () => {
        setShow(false)
        if (avatar === '') {
            return
        }

        resetFileInput()

        const data = new FormData()
        data.append('avatar', null)

        updateOneUserAvatar(data).then(data =>{
            if(data.error != null) {
                console.log(data)
                setError(data.error)
                setShow(true)
            }
            fetchUser()
        })
    }

    const changeData = () => {
        let finalLogin = login
        let finalFullName = fullName

        if (login === '' || login === usr.login) {
            finalLogin = null
        }
        if (fullName === '' || fullName === usr.full_name) {
            finalFullName = null
        }

        updateOneUserData(user.user.id, finalLogin, finalFullName, null).then(data =>{
            console.log(data);
            if(data.error != null) {
                console.log(data)
                setError(data.error)
                setShow(true)
            }
            fetchUser()
        })
    }

    return (
        <div className={`d-flex flex-column justify-content-center align-items-center mt-5`}>
            <div className={`d-flex flex-row`}>
                <div className={`${style.frame}`}>
                    {
                        avatar 
                        ? <Image height='250px' src={process.env.REACT_APP_SERVER_URL+avatar} />
                        : <Image height='250px' src={default_img} />
                    }
                </div>

                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <Container className="d-flex">
                        <Form.Control 
                            ref={inputRef} 
                            onChange={handleFileChange} 
                            className={style.inputfile} 
                            type="file" 
                        />
                        <button type="button" onClick={resetFileInput} className={style.inputClear}><XCircle /></button>
                    </Container>
                    {
                        file &&
                        <button onClick={updatePhoto} className={`mt-3 ${style.yes_btn}`}>Change photo</button>
                    }
                    
                    <button onClick={deletePhoto} className={`mt-3 ${style.no_btn}`}>Delete photo</button>   
                </div>
            </div>

            <div className={`mt-4`}>
                <Container className='d-flex justify-content-center align-items-center'>
                    <span className={`${style.span}`}>Your rating is <strong>{usr.rating}</strong></span>
                </Container>

                <Container className="d-flex">
                    <Form.Group className="mb-3">
                        <Form.Text>Login</Form.Text>
                        <Form.Control
                            required
                            placeholder="Login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className={style.input}
                        />   
                    </Form.Group>

                    <Form.Group className="mb-3 ms-3 ">
                        <Form.Text>Status</Form.Text>
                        <Form.Control
                            required
                            placeholder="Login"
                            readOnly={true}
                            value={user.user.status}
                            className={style.input}
                        />   
                    </Form.Group>
                </Container>

                <Container className="d-flex">
                    <Form.Group className="mb-3">
                        <Form.Text>Full name</Form.Text>
                        <Form.Control
                            required
                            placeholder="Full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={style.input}
                        />   
                    </Form.Group>

                    <Form.Group className="mb-3 ms-3">
                        <Form.Text>Email</Form.Text>
                        <Form.Control
                            required
                            placeholder="Email"
                            readOnly={true}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={style.input}
                        />   
                    </Form.Group>
                </Container>
            </div>
            
            <button onClick={changeData} className={`${style.yes_btn}`}>Change user data</button>

            <Alert 
                show={show} 
                variant="danger"
                className={`mt-3 ${style.alert}`}>
                <span className="me-4">{error}</span>
                <CloseButton className={`${style.close_btn}`} onClick={() => setShow(false)}/>
            </Alert>
        </div>
    )
}

export default Settings;