import { useState } from "react";
import AuthBackground from "../components/auth/AuthBackground.tsx";
import AuthForm from "../components/auth/AuthForm.tsx";
import "../styles/MainPages.css";
import ProfileForm from "../components/auth/ProfileForm.tsx"; // New import for ProfileForm

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpStep, setSignUpStep] = useState<"emailPassword" | "profile">(
    "emailPassword"
  );
  const [signUpData, setSignUpData] = useState({ email: "", password: "" });
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleSignUpSubmit = (email: string, password: string) => {
    setSignUpData({ email, password });
    setSignUpStep("profile");
  };

  const handleProfileSubmit = () => {
    setShowCompletionModal(true);
  };

  const handleCloseModal = () => {
    setShowCompletionModal(false);
    setIsSignUp(false); // Go back to login view after modal closes
    setSignUpStep("emailPassword"); // Reset sign-up step
  };

  return (
    <div className="main-layout">
      <AuthBackground isSignUp={isSignUp} />
      <AuthForm
        position="left"
        onFormChange={() => {
          setIsSignUp((prev) => !prev);
          setSignUpStep("emailPassword"); // Reset step when switching forms
        }}
        isSignUp={false}
        isVisible={!isSignUp}
      />
      {signUpStep === "emailPassword" && (
        <AuthForm
          position="right"
          onFormChange={() => {
            setIsSignUp((prev) => !prev);
            setSignUpStep("emailPassword"); // Reset step when switching forms
          }}
          isSignUp={true}
          isVisible={isSignUp}
          onSignUpSubmit={handleSignUpSubmit} // Pass the submit handler
        />
      )}
      {signUpStep === "profile" && isSignUp && (
        <ProfileForm
          email={signUpData.email}
          password={signUpData.password}
          onProfileSubmit={handleProfileSubmit}
          isVisible={isSignUp} // Only show if isSignUp is true
        />
      )}

      {showCompletionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>회원가입이 완료되었습니다.</h2>
            <button onClick={handleCloseModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}
