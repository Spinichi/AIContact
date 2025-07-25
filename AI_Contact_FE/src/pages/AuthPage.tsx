import '../styles/MainPages.css';
import React, { useState } from 'react';
import AuthBackground from '../components/AuthBackground.tsx';
import AuthForm from '../components/AuthForm';

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);

    return(
        <div className="main-layout">
            <AuthBackground />
            
            <AuthForm position = {isSignUp ? 'right' : 'left'} 
            onFormChange={()=>setIsSignUp(isSignUp => !isSignUp)} />

        </div>
    );
}