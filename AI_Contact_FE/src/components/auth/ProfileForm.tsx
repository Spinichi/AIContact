import edit from '../../assets/icons/edit.png';

import {useState} from 'react';

export default function ProfileForm(){

    const [imagePreview, setImagePreview] = useState('');

    const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
  
    setImagePreview(previewUrl);
    };

    return(
        <>
            <h2>프로필 입력</h2>
            <form className="form-box">
                    <div className="profile">
                        <label htmlFor="profile-image">
                            {imagePreview && (<img src={imagePreview} className="image-preview"/>)}
                            <img src={edit}  className="image-edit"/>
                        </label>
                    </div>
                <input type="file" name="image" 
                id="profile-image" accept="image/*" 
                style={{'display':'none'}} onChange={uploadImage} />
                <input type="text" placeholder="이름" />
                <label>생년월일</label>
                <div className="birth">
                    <input type="text" name="year" placeholder="년(4자)" />
                    <input type="text" name="month" placeholder="월" />
                    <input type="text" name="day" placeholder="일" />
                </div>
                <button type="button">시작하기</button>
            </form>
        </>
    );
}