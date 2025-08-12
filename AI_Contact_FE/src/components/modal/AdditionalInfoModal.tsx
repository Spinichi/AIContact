import { useEffect, useState, type ChangeEvent } from "react";
import { CouplesApi } from "../../apis/couple"; // 예: getPartnerInfo()
import { UsersApi } from "../../apis/user";
import type { MeUserResponse } from "../../apis/user/response";
import heart from "../../assets/images/heart.png";
import placeholderImg from "../../assets/images/symbol.png";
import "../../styles/Modal.css";

export interface formDataType {
  childName: string;
  coupleName: string;
  coupleDate: string; // YYYY-MM-DD
}

interface ModalProps {
  onSubmit: (formData: formDataType) => void;
}

// YYYY-MM-DD 포맷 기본값
const todayISO = (() => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
})();

export default function Modal({ onSubmit }: ModalProps) {
  const [formData, setFormData] = useState<formDataType>({
    childName: "",
    coupleName: "",
    coupleDate: todayISO,
  });

  // 내/연인 프로필 이미지 상태
  const [profileImageUrl, setProfileImageUrl] =
    useState<string>(placeholderImg);
  const [partnerImageUrl, setPartnerImageUrl] =
    useState<string>(placeholderImg);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setErrorMsg("로그인이 필요합니다.");
        setProfileImageUrl(placeholderImg);
        setPartnerImageUrl(placeholderImg);
        return;
      }

      try {
        const mePromise = UsersApi.getMe({ signal: controller.signal });
        const partnerPromise = CouplesApi.getPartnerInfo
          ? CouplesApi.getPartnerInfo()
          : Promise.resolve({ data: null as any });

        const [meRes, partnerRes] = await Promise.all([
          mePromise,
          partnerPromise,
        ]);

        const me: MeUserResponse = meRes.data;
        const myUrl = me?.profileImageUrl || placeholderImg;
        setProfileImageUrl(myUrl);

        const partnerUrl =
          (partnerRes as any)?.data?.profileImageUrl || placeholderImg;
        setPartnerImageUrl(partnerUrl);

        setErrorMsg("");
      } catch (e: any) {
        if (e.message === "UNAUTHORIZED") {
          localStorage.removeItem("accessToken");
          setErrorMsg("세션이 만료되었습니다. 다시 로그인해 주세요.");
        } else if (e.message === "FORBIDDEN") {
          setErrorMsg("접근 권한이 없습니다.");
        } else if (e.name !== "AbortError") {
          setErrorMsg("정보를 불러오는 중 오류가 발생했습니다.");
        }
        console.error(e);
        // 실패 시 안전 폴백
        setProfileImageUrl(placeholderImg);
        setPartnerImageUrl(placeholderImg);
      }
    };

    run();
    return () => controller.abort();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocalSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <div className="modal-overlay additional-info">
        <div className="left-layout">
          {/* 내 이미지 */}
          <div className="profile-container">
            <img
              src={profileImageUrl}
              alt="프로필"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = placeholderImg;
              }}
              className="avatar-img"
            />
          </div>

          <img src={heart} className="rotating-heart" alt="" />

          {/* 연인 이미지 */}
          <div className="profile-container">
            <img
              src={partnerImageUrl}
              alt="연인 프로필"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = placeholderImg;
              }}
              className="avatar-img"
            />
          </div>
        </div>

        <div className="right-layout">
          <h3>연인 정보를 입력해주세요</h3>
          <form className="ai-form" onSubmit={handleLocalSubmit}>
            <div>우리가 시작한 날이에요</div>
            <input
              type="date"
              name="coupleDate"
              value={formData.coupleDate}
              onChange={handleChange}
            />

            <div>우리 커플의 이름이에요</div>
            <input
              type="text"
              placeholder="커플명"
              name="coupleName"
              value={formData.coupleName}
              onChange={handleChange}
            />

            <div>우리 아이의 이름이에요</div>
            <input
              type="text"
              placeholder="아이명"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
            />

            <button type="submit">시작하기</button>
          </form>

          {errorMsg && (
            <p style={{ color: "crimson", marginTop: 12 }}>{errorMsg}</p>
          )}
        </div>
      </div>
    </>
  );
}
