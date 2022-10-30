import React from 'react'
import { Modal } from 'react-bootstrap';
import style from '../styles/ModalConfirm.module.css'

export const ModalConfirm = ({show, setShow, func}) => {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton className={style.header}>
        <Modal.Title>Confirm your action, please</Modal.Title>
      </Modal.Header>
      <Modal.Body className={style.body}>Are you sure?</Modal.Body>
      <Modal.Footer className={style.footer}>
        <button className={style.yes_btn} onClick={ func }>
          Yes
        </button>
        <button className={style.no_btn} onClick={ () => { setShow(false) }}>
          No
        </button>
      </Modal.Footer>
    </Modal>
  );
}
