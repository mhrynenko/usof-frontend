import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Pagination } from 'react-bootstrap';
import { Context } from "..";
// import style from '../styles/Pages.module.css'
import '../styles/Pages.css'

export const Pages = observer(() => {
    const {post} = useContext(Context)
    const pages = []

    for (let i = 0; i < post.pageAmount; i++) {
        pages.push(i+1);
    }

    return (
        <Pagination className='mt-5 d-flex justify-content-center align-items-center'>
            {pages.map(page => 
                <Pagination.Item
                    key={page}
                    active={post.page === page}
                    onClick={() => post.setPage(page)}
                    // className={style.item}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    )
})
