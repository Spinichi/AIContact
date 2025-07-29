import { useState } from "react";
import AuthBackground from "../components/auth/AuthBackground.tsx";
import AuthForm from "../components/auth/AuthForm.tsx";
import "../styles/MainPages.css";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="main-layout">
      <AuthBackground />
      <AuthForm
        position={isSignUp ? "right" : "left"}
        onFormChange={() => setIsSignUp((prev) => !prev)}
        isSignUp={isSignUp}
      />
    </div>
  );
}
