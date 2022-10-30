import React, { useContext, useEffect, useState } from 'react'
import { Accordion, Container, Form, Spinner } from 'react-bootstrap'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Context } from '..'
import { getCategories } from '../http/categoryAPI'
import style from '../styles/FiltersAndSorts.module.css'
import '../styles/Checkboxes.css'
import '../styles/FiltersAndSort.css'
import Cookies from "js-cookie";

export const FiltersAndSorts = ({params, setParams}) => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)
    const [startDate, setStartDate] = useState(params.filterDateBetween.from)
    const [endDate, setEndDate] = useState(params.filterDateBetween.to)
    const [categories, setCategories] = useState({})
    const [selectedCategories, setSelectedCategories] = useState(params.filterCategory)
    const [selectedStatus, setSelectedStatus] = useState(params.status)
    const [likesOrder, setLikesOrder] = useState(params.byLikes)
    const [dateOrder, setDateOrder] = useState(params.byDate)

    useEffect(() => {
        getCategories().then(data => {
            setCategories(data.allCategories);
        }).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        !params.filterDateBetween.from ? setStartDate(null): setStartDate(new Date(params.filterDateBetween.from))
        !params.filterDateBetween.to ? setEndDate(null): setEndDate(new Date(params.filterDateBetween.from))
        setSelectedCategories(params.filterCategory)
        setSelectedStatus(params.status)
        setLikesOrder(params.byLikes)
        setDateOrder(params.byDate)
    }, [params])

    if (loading) {
        return <Spinner animation={"grow"}/>
    }

    const proccessCategories = (event) => {
        const label = event.target.nextElementSibling.innerText;

        if (event.target.checked) {
            setSelectedCategories([
                ...selectedCategories,
                label
            ]);
        } 
        else {
            setSelectedCategories(
                selectedCategories.filter((selectedCategory) => selectedCategory !== label),
            );
        } 
    }

    const proccessSelectedStatus = (event) => {
        const label = event.target.nextElementSibling.innerText;

        if (event.target.checked) {
            setSelectedStatus([
                ...selectedStatus,
                label
            ]);
        } 
        else {
            setSelectedStatus(
                selectedStatus.filter((stat) => stat !== label),
            );
        } 
    }

    function setStatusCheckboxes (title) {
        for (let i = 0; i < selectedStatus.length; i++) {
            if (selectedStatus[i] === title) {
                return true;
            }
        }

        return false
    }

    function setCategoriesCheckboxes (title) {
        for (let i = 0; i < selectedCategories.length; i++) {
            if (selectedCategories[i] === title) {
                return true;
            }
        }

        return false
    }

    function aplyParams() {
        if (!startDate && endDate) {
            setStartDate(null)
            setEndDate(null)
            return
        }
        
        let byDate;
        dateOrder === 'default' 
        ? byDate = undefined 
        : byDate = dateOrder

        Cookies.set('filters', JSON.stringify({
            byLikes : likesOrder,
            byDate : byDate,
            filterCategory : selectedCategories,
            filterDateBetween : {
                from : startDate,
                to : endDate,
            },
            status : selectedStatus,
        }))

        setParams({
            byLikes : likesOrder,
            byDate : byDate,
            filterCategory : selectedCategories,
            filterDateBetween : {
                from : startDate,
                to : endDate,
            },
            status : selectedStatus,
        })
    } 

    function updateLikesOrder (val) {
        if (val === 'default') {
            setLikesOrder(undefined)
            return
        }
        setLikesOrder(val)
    }

    function updateDateOrder (val) {
        if (val === 'default') {
            setDateOrder(null)
            return
        }
        setDateOrder(val)
    }

    function updateStartDate(date) {
        if (!endDate && date){
            setEndDate(new Date())
        }
        setStartDate(date)
    }

    function resetParams() {
        setStartDate(null)
        setEndDate(null)
        setSelectedCategories([])
        setSelectedStatus((user.user.status === 'admin') ? ['inactive', 'active'] : ['active'])
        document.querySelectorAll('input[type=checkbox]').forEach( el => el.checked = false );
        setLikesOrder('DESC')
        setDateOrder('default')

        Cookies.set('filters', JSON.stringify({
            byLikes : 'DESC',
            byDate : undefined,
            filterCategory : [],
            filterDateBetween : {
                from : null,
                to : null,
            },
            status : [],
        }))
    }

    return (
        <Accordion className='mt-3 mb-1'>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Filters and sorting</Accordion.Header>
                <Accordion.Body className={`d-flex flex-column justify-content-center align-items-center ${style.body}`}>
                    <div className='d-flex flex-row flex-wrap'>
                        <div>
                            <Form.Group className="mb-3 ms-4">
                                <Form.Text>Sort by likes</Form.Text>
                                <Form.Select value={likesOrder} onChange={(choice) => updateLikesOrder(choice.target.value)}>
                                    <option value="default">Select order</option>
                                    <option value="ASC">Ascending order</option>
                                    <option value="DESC">Descending order</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <div>
                            <Form.Group className="mb-3 ms-4">
                                <Form.Text>Sort by dates</Form.Text>
                                <Form.Select value={dateOrder} onChange={(choice) => updateDateOrder(choice.target.value)}>
                                    <option value="default">Select order</option>
                                    <option value="ASC">Ascending order</option>
                                    <option value="DESC">Descending order</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        <Form.Group className="mb-3 ms-4">
                            <Form.Text>Filter datebetween</Form.Text>
                            <div className={`${style.frame}`}>
                                <div>
                                    <Form.Group className="mb-3">
                                        <Form.Text>From date</Form.Text>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => updateStartDate(date)}
                                            showTimeSelect
                                            isClearable
                                            timeFormat="HH:mm"
                                            timeIntervals={60}
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            className={`${style.frame} ${style.input}`}
                                        />
                                    </Form.Group>
                                </div>
                                <div>
                                    <Form.Group className="mb-3">
                                        <Form.Text>To date</Form.Text>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            showTimeSelect
                                            isClearable
                                            timeFormat="HH:mm"
                                            timeIntervals={60}
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            className={`${style.frame} ${style.input}`}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Form.Group>
                       
                        
                        <Form.Group className="mb-3 ms-4">
                            <Form.Text>Filter categories</Form.Text>
                            <Container className={`${style.frame} ${style.categories}`}>
                                {
                                    categories.rows.map((category) => {
                                        return <Form.Check 
                                            key={category.id}
                                            type='checkbox'
                                            id={`${category.title}`}
                                            label={`${category.title}`}
                                            className={style.checkbox}
                                            onChange={(e) => proccessCategories(e)}
                                            defaultChecked={setCategoriesCheckboxes(category.title)}
                                        />
                                    })
                                }
                            </Container>
                        </Form.Group>
                        {
                            user.user.status === 'admin' && 
                            <Form.Group className="mb-3 ms-4">
                                <Form.Text>Filter status (admin's only)</Form.Text>
                                <Container className={`${style.frame}`}>
                                    <Form.Check 
                                        type='checkbox'
                                        id='active'
                                        label='active'
                                        className={style.checkbox}
                                        onChange={(e) => proccessSelectedStatus(e)}
                                        defaultChecked={setStatusCheckboxes('active')}
                                    />
                                    <Form.Check 
                                        type='checkbox'
                                        id='inactive'
                                        label='inactive'
                                        className={style.checkbox}
                                        onChange={(e) => proccessSelectedStatus(e)}
                                        defaultChecked={setStatusCheckboxes('inactive')}
                                    />
                                </Container>
                            </Form.Group>
                        }
                    </div>
                    <div className='d-flex flex-row'>
                        <button className={style.yes_btn} onClick={aplyParams}>Aply</button>
                        <button className={style.no_btn} onClick={resetParams}>Reset</button>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}
