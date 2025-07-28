import edit from '../../assets/icons/edit.png';

export default function ProfileForm(){
    return(
        <>
            <h2>프로필 입력</h2>
            <form className="form-box">
                <div className="profile">
                    <img src={edit}  className="image-edit"/>
                </div>
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