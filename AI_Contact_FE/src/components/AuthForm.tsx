import '../styles/AuthFormPanel.css';

interface AuthFormProps {
    position : 'left' | 'right';
    onFormChange : () => void;
}

export default function AuthForm({position, onFormChange} : AuthFormProps) {
    return (
        <div className={`auth-form-panel ${position}`} onClick={onFormChange}>

        </div>
    );
}