import "../../styles/AuthFormPanel.css";

import arrowLeft from "../../assets/icons/ArrowLeft.svg";
import FormTitle from "./FormTitle";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

interface AuthFormProps {
  isSignUp: boolean;
  position: "left" | "right";
  onFormChange: () => void;
  isVisible: boolean;
  onSignUpSubmit?: (email: string, password: string) => void; // New prop
}

export default function AuthForm({
  isSignUp,
  position,
  onFormChange,
  isVisible,
  onSignUpSubmit,
}: AuthFormProps) {
  return (
    <div className={`auth-form-panel ${position} ${isVisible ? "" : "hidden"}`}>
      {isSignUp ? (
        <>
          <LeftArrow onBack={onFormChange} />
          <FormTitle />
          <SignUpForm onToggle={onFormChange} onSignUpSubmit={onSignUpSubmit} />
        </>
      ) : (
        <>
          <LeftArrow onBack={onFormChange} />
          <FormTitle />
          <LoginForm onToggle={onFormChange} />
        </>
      )}
    </div>
  );
}

interface LeftArrowProps {
  onBack: () => void;
}

function LeftArrow({ onBack }: LeftArrowProps) {
  return (
    <div className="arrow-left" onClick={onBack}>
      <img src={arrowLeft} />
    </div>
  );
}
