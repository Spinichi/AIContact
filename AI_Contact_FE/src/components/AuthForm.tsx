import '../styles/AuthFormPanel.css';

interface AuthFormProps {
    isSignUp : boolean;
    position : 'left' | 'right';
    onFormChange : () => void;
}

export default function AuthForm({isSignUp, position, onFormChange} : AuthFormProps) {
    return (
        <div className={`auth-form-panel ${position}`}>
            {isSignUp ? (
                <LoginForm onToggle={onFormChange} />
                ) : (
                <SignUpForm onToggle={onFormChange} />
                )}
        </div>
    );
}

function LoginForm({onToggle}){
  return (
    <div className="form-box">
      <h2>AI Contact</h2>
      <input type="text" placeholder="아이디" />
      <input type="password" placeholder="비밀번호" />
      <button>로그인</button>
      <p onClick={onToggle} className="toggle-text">아직 회원이 아니신가요? 회원가입</p>
    </div>
  );  
}

function SignUpForm({ onToggle }) {
  return (
    <div className="form-box">
      <h2>AI Contact</h2>
      <input type="text" placeholder="아이디" />
      <input type="email" placeholder="이메일" />
      <input type="password" placeholder="비밀번호" />
      <input type="password" placeholder="비밀번호 확인" />
      <button>회원가입</button>
      <p onClick={onToggle} className="toggle-text">이미 계정이 있으신가요? 로그인</p>
    </div>
  );
}