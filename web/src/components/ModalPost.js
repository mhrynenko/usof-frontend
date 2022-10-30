import React, { useEffect, useRef, useState } from 'react'
import { Container, Form, Modal, Spinner } from 'react-bootstrap';
import { XCircle } from 'react-bootstrap-icons';
import { getCategories } from '../http/categoryAPI';
import style from '../styles/ModalPost.module.css'
import '../styles/Checkboxes.css'
import { changeOnePost, createOnePost } from '../http/postAPI';
import { useNavigate } from 'react-router-dom';
import { POST_ROUTE } from '../utils/consts';

export const ModalPost = ({show, setShow, header, editing, setEditing, fetchPost}) => {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState({})
    const [selectedCategories, setSelectedCategories] = useState([])
    const [files, setFiles] = useState([])

    useEffect(() => {
        getCategories().then(data => {
            setCategories(data.allCategories);
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <Spinner animation={"grow"}/>
    }

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

    const setEditingContent = (text) => {
        setEditing({
            id : editing.id,
            title : editing.title,
            content : text,
            categories : editing.categories
        })
    };

    const setEditingTitle = (text) => {
        setEditing({
            id : editing.id,
            title : text,
            content : editing.content,
            categories : editing.categories
        })
    };

    const proccessCategories = (event) => {
        const label = event.target.nextElementSibling.innerText;

        if (event.target.checked) {
            if(editing){
                setEditing({
                    id : editing.id,
                    title : editing.title,
                    content : editing.content,
                    categories : [...editing.categories, label]
                })
                return
            }
            else {
                setSelectedCategories([
                    ...selectedCategories,
                    label
                ]);
            }
        } 
        else {
            if(editing) {
                setEditing({
                    id : editing.id,
                    title : editing.title,
                    content : editing.content,
                    categories : editing.categories.filter((selectedCategory) => selectedCategory !== label)
                })
            }
            else {
                setSelectedCategories(
                    selectedCategories.filter((selectedCategory) => selectedCategory !== label),
                );
            }
        } 
    }

    function submitPost() {
        const chosenCategories = selectedCategories.join(' ')
        if (title === '' || content === '' || chosenCategories === '') {
            return
        }

        if (files.length >= 10) {
            return
        }
        
        const data = new FormData()
        for(let i = 0; i < files.length; i++) {
            data.append('files', files[i])
        }
        data.append('title', title)
        data.append('content', content)
        data.append('categories', chosenCategories)

        createOnePost(data).then(data =>{
            if(data.error != null) {
                console.log(data)
            }
            setTitle('')
            setContent('')
            setSelectedCategories([])
            resetFileInput()
            setShow(false)
            navigate(POST_ROUTE.replace(':post_id', data.id))
        })
    }

    function submitEditingPost() {
        const chosenCategories = editing.categories.join(' ')
        if (editing.title === '' || editing.content === '' || chosenCategories === '') {
            return
        }

        if (files.length >= 10) {
            return
        }
        
        const data = new FormData()
        for(let i = 0; i < files.length; i++) {
            data.append('files', files[i])
        }
        data.append('title', editing.title)
        data.append('content', editing.content)
        data.append('categories', chosenCategories)

        changeOnePost(editing.id, data).then(data =>{
            if(data.error != null) {
                console.log(data)
            }
            setEditing(null)
            resetFileInput()
            setShow(false)
            fetchPost()
        })
    }

    function setCheckboxes (title) {
        if (!editing) {
            for (let i = 0; i < selectedCategories.length; i++) {
                if (selectedCategories[i] === title) {
                    return true;
                }
            }

            return false
        }

        for (let i = 0; i < editing.categories.length; i++) {
            if (editing.categories[i] === title) {
                return true;
            }
        }
    }

    return (
        <Modal 
            show={show} 
            onHide={() => setShow(false)}>
            <Modal.Header closeButton className={style.header}>
                <Modal.Title>{header}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={style.body}>
                <Form.Group className="mb-3">
                    <Form.Text>Post title</Form.Text>
                    <Form.Control
                        required
                        placeholder="Title"
                        value={editing ? editing.title : title}
                        onChange={(e) => editing ? setEditingTitle(e.target.value) : setTitle(e.target.value)}
                        className={style.input}
                    />   
                </Form.Group>
                
                <Container className={style.categories}>
                    {
                        categories.rows.map((category) => {
                            return <Form.Check 
                                key={category.id}
                                type='checkbox'
                                id={`${category.title}`}
                                label={`${category.title}`}
                                className={style.checkbox}
                                onChange={(e) => proccessCategories(e)}
                                defaultChecked={setCheckboxes(category.title)}
                            />
                        })
                    }
                </Container>
                <Form.Group className="mb-3">
                    <Form.Text>Post content</Form.Text>
                    <Form.Control 
                        placeholder="Enter your problem" 
                        as="textarea" 
                        rows={3} 
                        value={editing ? editing.content : content}
                        onChange={(e) => editing ? setEditingContent(e.target.value) : setContent(e.target.value)}
                        className={style.input}
                    />
                </Form.Group>
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
            </Modal.Body>
            <Modal.Footer className={style.footer}>
                <button className={style.yes_btn} onClick={ () => editing ? submitEditingPost() : submitPost() }>
                Confirm
                </button>
                <button className={style.no_btn} onClick={() => setShow(false)}>
                Leave
                </button>
            </Modal.Footer>
        </Modal>
    );
}
