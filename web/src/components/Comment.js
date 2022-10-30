import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Image, Row, Spinner } from 'react-bootstrap'
import { HandThumbsUpFill, HandThumbsDownFill, Pencil, Trash, Paperclip, FileArrowDown } from 'react-bootstrap-icons'
import { Context } from '..'
import { createOneCommentLike, deleteOneComment, deleteOneCommentLike, getOneCommentLikes } from '../http/commentAPI'
import style from '../styles/Comment.module.css'
import { getFullDate } from '../utils/helpers'
import { ModalConfirm } from './ModalConfirm'

import default_img from '../files/default_img.png'
import { getOneUserAvatar } from '../http/userAPI'
export const Comment = observer(({comment, fetchComments, post_id, setEditing}) => {
    const {user} = useContext(Context)
    const [like, setLikes] = useState({})
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false)
    const [photo, setPhoto] = useState('')
    
    useEffect(() => {
        getOneCommentLikes(comment.id).then(data => {
            setLikes(data)
            getOneUserAvatar(comment.author).then(data => {
                setPhoto(data.profile_picture)
            })
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <Spinner animation={"grow"}/>
    }

    const handleClick = () => {
        setShow(current => !current);
    };

    function createLike (type) {
        createOneCommentLike(comment.id, type).then(data => {
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
        deleteOneCommentLike(comment.id).then(data => {
            if (data.error) {
                console.log(data.error);
            }
            fetchLikes();
        })
    }

    const deleteComment = (comment_id) => {
        deleteOneComment(comment_id).then(data => {
            if (data.error) {
                console.log(data.error);
            }
            setShow(false)
            fetchComments(post_id)  
        })
    } 

    const fetchLikes = async () => {
        getOneCommentLikes(comment.id).then(data => {setLikes(data)})
    }

    function proccessPhotoSrc(filename) {
        if (filename === '') { 
            return default_img
        }
        return process.env.REACT_APP_SERVER_URL+photo
    }

    return (
        <>
            <Row className={style.main}>
                <Col md={2} className={style.buttons}>
                    <button onClick={() => createLike("like")} className={style.like_btn}><HandThumbsUpFill /></button>
                    <span>{like.amount}</span>
                    <button onClick={() => createLike("dislike")} className={style.dislike_btn}><HandThumbsDownFill /></button>
                </Col>
                <Col md={10} className={style.body}>
                    <Row className={`${style.content}`}>
                        {comment.content}
                        {  
                            comment.files && <div className={`mt-2 ${style.frame} ${style.attach_cont}`}> <Paperclip />
                                {
                                    comment.files.split(' ').map(file => {
                                        return <a key={file} className={`mt-2`} href={process.env.REACT_APP_SERVER_URL+file} download><FileArrowDown className={`${style.download}`}/></a>
                                    })
                                }
                            </div>
                        }
                    </Row>
                    <hr/>
                    <Container className={`d-flex flex-row justify-content-between ${style.about}`}>
                        <span><span className={style.secondaryText}>Answered:</span> <span>{getFullDate(comment.publish_date)}</span></span>
                        <div>
                            <span><span className={style.secondaryText}>Author:</span> <span>{comment.author}</span></span>
                            {
                                <Image className='ms-2' height='36px' src={proccessPhotoSrc(photo)} />
                            }
                        </div>
                    </Container>
                </Col>
            </Row>
            {
                user.user.login === comment.author && 
                <Container className={style.edit_buttons}>
                    <Pencil className={style.edit_button} onClick={() => setEditing({id:comment.id, content:comment.content})}/>
                    <Trash className={style.edit_button} onClick={handleClick}/>
                </Container>
            }
            <ModalConfirm func={() => deleteComment(comment.id)} show={show} setShow={(bool) => setShow(bool)}/>
        </>
    )
})
