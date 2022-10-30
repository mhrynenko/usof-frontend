import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react'
import { Container, Form } from 'react-bootstrap';
import { XCircle } from 'react-bootstrap-icons';
import { changeOneComment } from '../http/commentAPI';
import { createOnePostComment } from '../http/postAPI';
import style from '../styles/Input.module.css'

export const Input = observer(({auth, login, post_id, fetchComments, editing, setEditing, status}) => {
    const inputRef = useRef(null);
    const [answerText, setAnswerText] = useState('');
    const [files, setFiles] = useState([])

    const handleFileChange = event => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }
        setFiles(event.target.files)
    };

    const resetFileInput = () => {
        inputRef.current.value = null;
        setFiles([])
    };

    let classname, text;
    if (!auth) { 
        classname = style.overlay
        text = 'Only authorized guys can write here'
    }
    else if (status === 'inactive') {
        classname = style.overlay
        text = 'Post is inacitve'
    }
    
    function submitAnswer() {
        if (answerText === '') {
            return
        }
        if (files.length >= 10) {
            return
        }

        const data = new FormData()
        for(let i = 0; i < files.length; i++) {
            data.append('files', files[i])
        }
        data.append('author', login)
        data.append('content', answerText)

        createOnePostComment(post_id, data).then(data =>{
            if(data.error != null) {
                console.log(data)
            }
            setAnswerText('')
            resetFileInput()
            fetchComments(post_id)
        })
    }

    function setEditingText(text) {
        setEditing({
            id:editing.id,
            content:text
        })
    }

    function submitEditing() {
        if (editing.content === '') {
            setEditing(null)
            return
        }

        if (files.length >= 10) {
            return
        }

        const data = new FormData()
        for(let i = 0; i < files.length; i++) {
            data.append('files', files[i])
        }
        data.append('author', login)
        data.append('content', editing.content)

        changeOneComment(editing.id, data).then(data => {
            if(data.error != null) {
                console.log(data)
            }
            setEditing(null)
            resetFileInput()
            fetchComments(post_id)
        })
    }
    
    return (
        <Form className={style.formAuth}>
            <Form.Group className={style.z}>
                <textarea 
                    className={style.textarea} 
                    placeholder="Enter your thoughts" 
                    rows="3"
                    value={editing ? editing.content : answerText}
                    onChange={(e) => editing ? setEditingText(e.target.value): setAnswerText(e.target.value)}
                />
                <Container className={style.buttons_cont}>
                    <Container className="d-flex">
                        <Form.Control 
                            ref={inputRef} 
                            onChange={handleFileChange} 
                            className={style.inputfile} 
                            type="file" 
                            multiple 
                        />
                        <button type="button" onClick={resetFileInput} className={style.inputClear}><XCircle /></button>
                    </Container>
                    <button type="button" onClick={() => editing ? submitEditing() : submitAnswer()} className={style.button}>Send</button>
                </Container>
            </Form.Group>
            <Container className={classname}>{text}</Container>
        </Form>
    );
})
