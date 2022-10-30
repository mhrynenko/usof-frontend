import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { HandThumbsUpFill, HandThumbsDownFill, Pencil, Trash, EyeSlash, Eye, Paperclip, FileArrowDown, } from 'react-bootstrap-icons'
import { useNavigate, useParams } from "react-router-dom";
import { CommentsList } from "../components/CommentsList";
import { changeOnePostStatus, createOnePostLike, deleteOnePost, deleteOnePostLike, getOnePost, getOnePostLikes } from "../http/postAPI";
import style from '../styles/PostPage.module.css'
import { getFullDate } from "../utils/helpers";
import { Context } from '../index'
import { observer } from "mobx-react-lite";
import { ModalConfirm } from "../components/ModalConfirm";
import { POSTS_ROUTE } from "../utils/consts";
import { ModalPost } from "../components/ModalPost";
import { getOneUserAvatar } from "../http/userAPI";

import default_img from '../files/default_img.png'

const PostPage = observer(() => {
    const navigate = useNavigate()
    const {user} = useContext(Context);
    const [post, setPost] = useState({})
    const [like, setLike] = useState({})
    const {post_id} = useParams()
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState(null)
    const [photo, setPhoto] = useState('')

    useEffect(() => {
        Promise.all([getOnePost(post_id), getOnePostLikes(post_id),]).then(data => {
            setPost(data[0].post)
            setLike(data[1].likes)
            getOneUserAvatar(data[0].post.author).then(data => {
                setPhoto(data.profile_picture)
            })
        }).finally(() => {setLoading(false)})
    }, [])

    if (loading ) {
        return <Spinner animation={"grow"}/>
    }

    const fetchLikes = async () => {
        getOnePostLikes(post_id).then(data => {setLike(data.likes)})
    }

    const fetchPost = async () => {
        getOnePost(post_id).then(data => {setPost(data.post)})
    }

    const handleClick = () => {
        setShow(current => !current);
    };

    function createLike (type) {
        if(!user.isAuth) {
            return
        }

        createOnePostLike(post_id, type).then(data => {
            if (data.error === 'Your dislike already exists' || data.error === 'Your like already exists') {
                console.log('Your like/dislike will be deleted');
                deleteLike()
                return;
            }
            if (data.error) {
                console.log(data.error);
            }
            fetchLikes();
        })
    }

    function deleteLike () {
        if(!user.isAuth) {
            return
        }
        
        deleteOnePostLike(post_id).then(data => {
            if (data.error) {
                console.log(data.error);
            }
            fetchLikes();
        })
    }

    function deletePost(postId) {
        deleteOnePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            }
            setShow(false)
            navigate(POSTS_ROUTE)
        })
    }

    function changePostStatus (postId) {
        changeOnePostStatus(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            }
            fetchPost()
        })
    }

    const handleClickEdit = () => {
        setShowCreate(current => !current);
        setEditing({
            id : post.id,
            title : post.title,
            content : post.content,
            categories : post.categories.split(' ')
        })
    }

    function proccessPhotoSrc(filename) {
        if (filename === '') { 
            return default_img
        }
        return process.env.REACT_APP_SERVER_URL+photo
    }

    let edit_buttons;
    if (user.user.login === post.author) {
        edit_buttons =  
        <div className={style.edit_buttons}>
            <Pencil className={style.edit_button} onClick={handleClickEdit} />
            <Trash className={style.edit_button} onClick={handleClick} />
        </div>
    }
    if (user.user.login === post.author && user.user.status === 'admin') {
        edit_buttons =  
        <div className={style.edit_buttons}>
            {
                post.status === 'active' 
                ? <Eye className={style.edit_button} onClick={() => changePostStatus(post_id)}/>
                : <EyeSlash className={style.edit_button} onClick={() => changePostStatus(post_id)}/>
            }
            <Pencil className={style.edit_button} onClick={handleClickEdit}/>
            <Trash className={style.edit_button} onClick={handleClick}/>
        </div>
    }
    else if (user.user.status === 'admin') {
        edit_buttons =  
        <div className={style.edit_buttons}>
            {
                post.status === 'active' 
                ? <Eye className={style.edit_button} onClick={() => changePostStatus(post_id)}/>
                : <EyeSlash className={style.edit_button} onClick={() => changePostStatus(post_id)}/>
            }
            <Trash className={style.edit_button} onClick={handleClick}/>
        </div>
    }

    return (
        <Container>
            <Row className={style.main}>
                <Col md={2} className={style.buttons}>
                    <button onClick={() => createLike('like')} className={style.like_btn}><HandThumbsUpFill /></button>
                    <Row>{like.amount}</Row>
                    <button onClick={() => createLike('dislike')} className={style.dislike_btn}><HandThumbsDownFill /></button>
                </Col>
                <Col md={10}>
                    <div className="d-flex justify-content-between">
                        <div className={`d-flex flex-column justify-content-between`}>
                            <span className={`${style.title}`}>{post.title}</span>
                            <span><span className={style.secondaryText}>Asked:</span> <span>{getFullDate(post.publish_date)}</span></span>
                        </div>
                        <div className="d-flex">
                            <div className={`d-flex flex-column justify-content-between`}>
                                <span className="me-2"><span className={style.secondaryText}>Author: </span> <span>{post.author}</span></span>
                                {edit_buttons}
                            </div>
                            {
                                <Image height='100px' src={proccessPhotoSrc(photo)} />
                            }
                        </div>
                    </div>
                    
                    <hr />
                    <Row className={style.content}>
                        {post.content}
                        {  
                            post.files && <div className={`mt-2 ${style.frame} ${style.attach_cont}`}> <Paperclip />
                                {
                                    post.files.split(' ').map(file => 
                                        <a key={file} className={`mt-2`} href={process.env.REACT_APP_SERVER_URL+file} download><FileArrowDown className={`${style.download}`}/></a>
                                    )
                                }
                            </div>
                        }
                    </Row>
                    <hr />
                    {
                        post.categories.split(' ').map(category => 
                            <button key={category} className={style.category}>{category}</button>
                        )
                    }
                </Col>
                <Col md={12}>
                    <hr />
                    {
                        user.isAuth 
                        ? <CommentsList auth={true} login={user.user.login} post_id={post_id} status={post.status}/> 
                        : <CommentsList auth={false} login={null} post_id={post_id} status={post.status}/> 
                    }
                </Col>
            </Row>
            <ModalConfirm func={() => deletePost(post_id)} show={show} setShow={(bool) => setShow(bool)}/>
            <ModalPost 
                show={showCreate} 
                header={'Edit your post'}
                setShow={(bool) => setShowCreate(bool)} 
                editing={editing} 
                setEditing={setEditing}
                fetchPost={fetchPost}
            />
        </Container>
    )
})

export default PostPage;