import { useState, type ChangeEvent } from "react";
import closeBtn from "../../assets/icons/WhiteLeftArrow.svg";
import "../../styles/Modal.css";
import heart from "../../assets/images/heart.png";

export interface formDataType{
  childName : string
  coupleName : string
  coupleDate : string
}


interface ModalProps {
  onClose: () => void; // 아무 인자도 받지 않고 아무것도 반환하지 않는 함수
  onSubmit: (formData : formDataType) => void;
}

export default function Modal({
  onClose,
  onSubmit
}: ModalProps) {

  const [formData, setFormData] = useState<formDataType>({
    childName: '',
    coupleName: '',
    coupleDate: new Date().toDateString(),
  });

  const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocalSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // 상위 컴포넌트로부터 받은 onSubmit 함수에 현재 폼 데이터를 담아 호출
    onSubmit(formData);
  };

  return (
    <>
      <img src={closeBtn} className="close-btn" onClick={onClose} />
      <div className="modal-overlay additional-info">
        <div className="left-layout">
          <img src={heart} className="rotating-heart" />
        </div>
        <div className="right-layout">
            <p>마지막으로, 추가정보를 입력해주세요</p>
            <form className="ai-form" onSubmit={handleLocalSubmit}>
                <div>우리 아이의 이름이에요</div>
                <input
                    type="text"
                    placeholder="아이명"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                />
                <div>우리 커플의 이름이에요</div>
                <input
                    type="text"
                    placeholder="커플명"
                    name="coupleName"
                    value={formData.coupleName}
                    onChange={handleChange}
                />
                <div>우리가 시작한 날이에요</div>
                <input
                    type="date"
                    name="coupleDate"
                    value={formData.coupleDate}
                    onChange={handleChange}
                />
                <button>시작하기</button>
            </form>
        </div>
      </div>
    </>
  );
}
