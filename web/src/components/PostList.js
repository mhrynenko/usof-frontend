import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Row } from 'react-bootstrap'
import { Context } from '..'
import { PostPreview } from './PostPreview'

export const PostList = observer(() => {
  const {post} = useContext(Context)
  const {user} = useContext(Context);

  return (
    <Row className='d-flex'>
      {
        post.posts.map(post => {
            if (user.user.status === "admin") {
              return <PostPreview key={post.id} post={post}></PostPreview>
            }
            else {
              if (post.status === "active") {
                return <PostPreview key={post.id} post={post}></PostPreview>
              }
            }            
          }
        )
      }
    </Row>
  )
})
