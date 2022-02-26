import React, { FC, useCallback } from "react";

//css 
import { CreateModal, CloseModalButton } from './style';

  interface IProps {
    onModalClose: ()=>void;
  }

  
const Modal:FC<IProps> = ({onModalClose, children}) => {

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return(
    <CreateModal onClick={onModalClose}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onModalClose}>X</CloseModalButton>  
        {children}
      </div>
    </CreateModal>
  )
}
export default Modal;