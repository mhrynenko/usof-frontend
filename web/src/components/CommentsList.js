import React, { useEffect, useState } from "react"
import { Row, Spinner } from "react-bootstrap"
import { Comment } from "./Comment"
import { observer } from "mobx-react-lite"
import { getOnePostComments } from "../http/postAPI"
import { Input } from "./Input"

export const CommentsList = observer(({auth, login, post_id, status}) => {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(null)

    const fetchComments = async (postID) => {
        getOnePostComments(postID).then(data => {setComments(data.comments.rows)})
    }

    useEffect(() => {
        getOnePostComments(post_id).then(data => {
            setComments(data.comments.rows)
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <Spinner animation={"grow"}/>
    }

    return (
        <>
            <Row className='d-flex'>
                {
                    comments.map(comment => 
                        <Comment 
                            key={comment.id}
                            comment={comment} 
                            post_id={post_id} 
                            fetchComments={fetchComments}
                            editing={editing}
                            setEditing={setEditing}
                        />
                    )
                }
            </Row>
            <hr />
            <Input 
                auth={auth} 
                login={login} 
                post_id={post_id} 
                fetchComments={fetchComments}
                editing={editing}
                setEditing={setEditing}
                status={status}
            />
        </>
    )
})