interface LoginFromProps{
    onToggle : () => void;
}

export default function LoginForm({onToggle} : LoginFromProps){
  return (
    <form className="form-box">
      <input type="text" placeholder="아이디" />
      <input type="password" placeholder="비밀번호" />
      <button type="button">로그인</button>
      <p className="toggle-text">아직 회원이 아니신가요? <span onClick={onToggle}>회원가입</span></p>
    </form>
  );  
}