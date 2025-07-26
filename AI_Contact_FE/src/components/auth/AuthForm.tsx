import '../../styles/AuthFormPanel.css';

import arrowLeft from '../../assets/icons/ArrowLeft.png'
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import FormTitle from './FormTitle';

interface AuthFormProps {
    isSignUp : boolean;
    position : 'left' | 'right';
    onFormChange : () => void;
}

export default function AuthForm({isSignUp, position, onFormChange} : AuthFormProps) {
    return (
        <div className={`auth-form-panel ${position}`}>
          <LeftArrow />
          <FormTitle />
            {isSignUp ? (
              <SignUpForm onToggle={onFormChange} />
            ) : (
              <LoginForm onToggle={onFormChange} />
              // <ProfileForm />
            )}
        </div>
    );
}

function LeftArrow(){
  return(
    <div className="arrow-left">
      <img src={arrowLeft} />
    </div>
  )
}