import "../../styles/AuthFormPanel.css";

import arrowLeft from "../../assets/icons/ArrowLeft.svg";
import FormTitle from "./FormTitle";
import LoginForm from "./LoginForm";
import ProfileForm from "./ProfileForm";

interface AuthFormProps {
  isSignUp: boolean;
  position: "left" | "right";
  onFormChange: () => void;
}

export default function AuthForm({
  isSignUp,
  position,
  onFormChange,
}: AuthFormProps) {
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

function LeftArrow() {
  return (
    <div className="arrow-left">
      <img src={arrowLeft} />
    </div>
  );
}
