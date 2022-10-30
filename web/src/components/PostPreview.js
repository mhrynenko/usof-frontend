import React from 'react'
import { Card, Col } from 'react-bootstrap'
import { Calendar2Plus, PersonPlus, LightningCharge, ChatRightDots } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import { POSTS_ROUTE } from '../utils/consts'
import style from '../styles/PostPreview.module.css'
import { getFullDate } from '../utils/helpers'

export const PostPreview = ({post}) => {
  const navigate = useNavigate();

  let styleClass;
  if (post.status === 'inactive') {
    styleClass =`${style.card} ${style.inactive}`
  }
  else {
    styleClass = style.card
  }

  return (
    <Col md={11} className='d-flex w-100 ' onClick={() => navigate(POSTS_ROUTE + `/${post.id}`)}>
      <Card className={styleClass}>
        <Card.Body>
            <Card.Title>
              {post.title}
            </Card.Title>
            <Card.Text>
              { post.content.length > 200 
                ? post.content.substring(0, 200) + ' ...'
                : post.content
              }
            </Card.Text>
            {
              post.categories.split(' ').map(category => 
                <Card.Link className={style.category} key={category}>{category}</Card.Link>
              )
            }
            <Card.Footer className={style.footer}>
              <p className={style.paragraph}><PersonPlus className={style.icons}/> {post.author}</p>
              <p className={style.paragraph}><Calendar2Plus className={style.icons}/> {getFullDate(post.publish_date)}</p>
              <p className={style.paragraph}><LightningCharge className={style.icons}/> {post.likes}</p>
              <p className={style.paragraph}><ChatRightDots className={style.icons}/> {post.commentAmount}</p>
            </Card.Footer>
        </Card.Body>
      </Card>
    </Col>
  )
}
