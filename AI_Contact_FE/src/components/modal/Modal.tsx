import closeBtn from '../../assets/icons/WhiteLeftArrow.svg';
import prvBtn from '../../assets/icons/CaretLeft.svg';
import nxtBtn from '../../assets/icons/CaretRight.svg';
import '../../styles/Modal.css'

interface ModalProps {
  onClose: () => void; // 아무 인자도 받지 않고 아무것도 반환하지 않는 함수   
  hasPrev: boolean;          // boolean 값
  hasNext: boolean;          // boolean 값
  children : React.ReactNode; // 렌더링될 모든 React 요소 (가장 유연함)
}

export default function Modal({ onClose, hasPrev, hasNext, children  } : ModalProps){
    return(
      <>
        <img src={closeBtn} className="close-btn" onClick={onClose} />
        <div className="modal-overlay">
            {hasPrev && <img src={prvBtn} className="move-btn" />}
            <div className="content">
                {children }
            </div>
            {hasNext && <img src={nxtBtn} className="move-btn" />}
        </div>
      </>
    )
}