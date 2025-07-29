import { useRef, useState } from "react";
import "../../styles/AuthFormPanel.css"; // Re-use existing styles

interface ProfileFormProps {
  email: string;
  password: string;
  onProfileSubmit: () => void;
  isVisible: boolean;
}

export default function ProfileForm({
  email,
  password,
  onProfileSubmit,
  isVisible,
}: ProfileFormProps) {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState(""); // New state for birthdate
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // New state for image preview
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

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
    fileInputRef.current?.click(); // Trigger click on hidden file input
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("birthdate", birthdate);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/sign-up",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        onProfileSubmit();
      } else {
        const errorData = await response.json();
        alert(`회원가입 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={`auth-form-panel right ${isVisible ? "" : "hidden"}`}>
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>프로필 정보 입력</h2>
        <div className="image-upload-area" onClick={handleImageClick}>
          {" "}
          {/* Make this clickable */}
          {imagePreview ? (
            <div className="image-preview-container">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="image-preview"
              />
            </div>
          ) : (
            <div className="image-placeholder"></div> // Placeholder for when no image is selected
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef} // Assign ref
          style={{ display: "none" }} // Hide the actual file input
        />
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="date" // Changed to type="date" for birthdate
          placeholder="생년월일" // Placeholder for birthdate
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
        <button type="submit">시작하기</button>
      </form>
    </div>
  );
}
