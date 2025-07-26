import '../../styles/AuthFormPanel.css';

import arrowLeft from '../../assets/icons/ArrowLeft.png'
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ProfileForm from './ProfileForm';
import FormTitle from './FormTitle';

interface AuthFormProps {
    isSignUp : boolean;
    position : 'left' | 'right';
    onFormChange : () => void;
}

export default function AuthForm({isSignUp, position, onFormChange} : AuthFormProps) {
    return (
        <div className={`auth-form-panel ${position}`}>
          
            {isSignUp ? (
              //<SignUpForm onToggle={onFormChange} />
              <ProfileForm />
            ) : (
              <>
                <LeftArrow />
                <FormTitle />
                <LoginForm onToggle={onFormChange} />
              </>
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