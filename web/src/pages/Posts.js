import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState,  } from "react";
import { Col, Container, Row, } from "react-bootstrap";
import { Context } from "..";
import { FiltersAndSorts } from "../components/FiltersAndSorts";
import { Pages } from "../components/Pages";
import { PostList } from "../components/PostList";
import { getPosts } from "../http/postAPI";
import Cookies from "js-cookie";

const Posts = observer(() => {
    const {user} = useContext(Context)
    const {post} = useContext(Context)
    const [params, setParams] = useState({
        byLikes : 'DESC',
        byDate : undefined,
        filterCategory : [],
        filterDateBetween : {
            from : null,
            to : null,
        },
        status : (user.user.status === 'admin') ? ['inactive', 'active'] : ['active'],
    })

    useEffect(() => {
        if (Cookies.get('filters')) {
            setParams(JSON.parse(Cookies.get('filters')))
        }
        getPosts(0, 5, params).then(data => {
            post.setPosts(data.allPosts.rows)
            post.setPageAmount(data.allPosts.pages)
            post.setLimit(5)
        })
    }, [])

    useEffect(() => {
        getPosts(post.page-1, post.limit, params).then(data => {
            post.setPosts(data.allPosts.rows)
            post.setPageAmount(data.allPosts.pages)
        })
    }, [params])

    useEffect(() => {
        getPosts(post.page-1, post.limit, params).then(data => {
            post.setPosts(data.allPosts.rows)
            post.setPageAmount(data.allPosts.pages)
        })
    }, [post.page])
    
    return (
        <Container>
            <Row className="d-flex space-between">
                <FiltersAndSorts params={params} setParams={setParams}/>
            </Row>
            <Row>
                <Col md={12}>
                    <PostList />
                </Col>
            </Row>
            <Pages />
        </Container>
    )
})

export default Posts;