import { useRef, useState } from "react";
import "../../styles/AuthFormPanel.css"; // Re-use existing styles
import arrowLeft from "../../assets/icons/ArrowLeft.svg";
import editIcon from "../../assets/icons/edit.svg"; // Import edit.svg

interface ProfileFormProps {
  email: string;
  password: string;
  onProfileSubmit: () => void;
  isVisible: boolean;
  onBack: () => void;
}

export default function ProfileForm({
  email,
  password,
  onProfileSubmit,
  isVisible,
  onBack,
}: ProfileFormProps) {
  const [name, setName] = useState("");
  const [birthDate, setBirthdate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setImagePreview(null);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("프로필 이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("birthDate", birthDate);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch(`${BASE_URL}/api/v1/users/sign-up`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        onProfileSubmit();
      } else {
        const errorData = await response.json();
        alert(`회원가입 실패`);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={`auth-form-panel right ${isVisible ? "" : "hidden"}`}>
      <div className="arrow-left" onClick={onBack}>
        <img src={arrowLeft} />
      </div>
      <form className="form-box" onSubmit={handleSubmit}>
        <h3>프로필 정보 입력</h3>
        <div className="image-upload-area" onClick={handleImageClick}>
          {imagePreview ? (
            <div className="image-preview-container">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="image-preview"
              />
            </div>
          ) : (
            <div className="image-placeholder"></div>
          )}
          <div className="editsvg">
            <img src={editIcon} alt="Edit" />
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="생년월일"
          value={birthDate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
        <button type="submit">시작하기</button>
      </form>
    </div>
  );
}
