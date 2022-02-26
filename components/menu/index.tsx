import React, { FC, CSSProperties } from 'react';

// css 
import { CreateMenu, CloseModalButton } from './style';

interface IProps {
  isModal?: boolean,
  onModalClose: () => void,
  style: CSSProperties,
}

const onstopPropagation = (e)=> {
  e.stopPropagation();
}

const Menu: FC<IProps> = ({children, isModal, onModalClose, style}) => {
  return (
    <CreateMenu onClick={onModalClose}>
      <div style={style} onClick={onstopPropagation}>
        <CloseModalButton onClick={onModalClose}>X</CloseModalButton>
        {children}  
      </div>
    </CreateMenu>
  )
}

export default Menu;