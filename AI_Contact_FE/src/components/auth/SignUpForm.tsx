interface SignUpFormProps{
    onToggle : () => void;
}

export default function SignUpForm({ onToggle } : SignUpFormProps) {
  return (
    <div className="form-box">
      <input type="text" placeholder="아이디" />
      <input type="email" placeholder="이메일" />
      <input type="password" placeholder="비밀번호" />
      <input type="password" placeholder="비밀번호 확인" />
      <button>회원가입</button>
      <p className="toggle-text">이미 계정이 있으신가요? <span onClick={onToggle}>로그인</span></p>
    </div>
  );
}