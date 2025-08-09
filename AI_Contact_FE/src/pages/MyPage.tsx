import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/MainPages.css";
import "../styles/MyPage.css";
import "../styles/UserInfo.css";

import { useNavigate } from "react-router-dom";
import { CouplesApi } from "../apis/couple";
import type { PartnerInfoResponse } from "../apis/couple/response";
import { UsersApi } from "../apis/user";
import type { MeUserResponse } from "../apis/user/response";

const MyPage: React.FC = () => {
  const [me, setMe] = useState<MeUserResponse | null>(null);
  const [partner, setPartner] = useState<PartnerInfoResponse | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 비밀번호 변경 UI 상태
  const [pwEditing, setPwEditing] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const navigate = useNavigate();

  // 내 정보 + (커플이면) 연인 정보 로딩
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const meRes = await UsersApi.getMe();
        setMe(meRes.data);

        if (meRes.data.coupleStatus === "COUPLED") {
          const partnerRes = await CouplesApi.getPartnerInfo();
          setPartner(partnerRes.data);
        }
      } catch (error) {
        console.error("정보 조회 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // 프로필 이미지 수정 버튼 -> 숨겨진 파일 입력 클릭
  const handleClickChangeProfile = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 시: 미리보기(optimistic) -> API 업로드 -> 결과 반영
  const handleChangeProfileFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !me) return;

    const prevUrl = me.profileImageUrl;
    const localPreview = URL.createObjectURL(file);

    // 즉시 미리보기 반영
    setMe({ ...me, profileImageUrl: localPreview });

    try {
      setIsUploading(true);
      // BE: PUT /users/me/profile-image (multipart/form-data) 가정
      const res = await UsersApi.updateProfileImage(file);
      setMe(res.data); // 서버에서 최종 URL 반환
    } catch (err) {
      console.error(err);
      alert("프로필 이미지 업데이트에 실패했습니다.");
      // 실패 시 롤백
      setMe({ ...me, profileImageUrl: prevUrl });
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localPreview);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 비밀번호 변경 제출
  const submitChangePassword = async () => {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      alert("모든 비밀번호 입력칸을 채워주세요.");
      return;
    }
    // if (pwForm.next.length < 8) {
    //   alert("새 비밀번호는 8자 이상이어야 합니다.");
    //   return;
    // }
    if (pwForm.next !== pwForm.confirm) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setPwSaving(true);
      // BE: PUT /users/me/password { currentPassword, newPassword } 가정
      await UsersApi.updatePassword({
        currentPassword: pwForm.current,
        newPassword: pwForm.next,
      });
      alert("비밀번호가 변경되었습니다.");
      setPwEditing(false);
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (e: any) {
      console.error(e);
      alert("비밀번호 변경에 실패했습니다.\n" + (e?.message || ""));
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="main-layout">
      <Sidebar />

      <div className="main-content">
        <div className="page-header">
          <h4># 보안 # 철저 </h4>
          <h3>마이페이지 🍀</h3>
        </div>

        <div className="mypage-container">
          <div>
            {/* 내 정보 */}
            {me && (
              <div className="mypage-card-wrapper">
                <div className="mypage-card-title-wrapper">
                  <div className="mypage-card-title">내 정보</div>
                  <div className="danger-btn-wrapper">
                    <button
                      className="danger-btn"
                      onClick={async () => {
                        const confirmed = window.confirm(
                          "회원 탈퇴를 하면 커플 연결 해제 및 모든 데이터가 삭제됩니다.\n정말 탈퇴하시겠습니까?"
                        );
                        if (!confirmed) return;

                        try {
                          await CouplesApi.deleteCouple();
                          await UsersApi.deleteMe();
                          alert(
                            "커플 연결 해제 및 회원 탈퇴가 완료되었습니다."
                          );
                          navigate("/auth");
                        } catch (e) {
                          console.error(e);
                          alert("회원 탈퇴 중 오류가 발생했습니다.");
                        }
                      }}
                    >
                      회원 탈퇴
                    </button>
                  </div>
                </div>
                <div className="mypage-card">
                  <div className="mypage-card-section-wrapper">
                    {!pwEditing ? (
                      <>
                        <div className="mypage-card-section">
                          <div className="mypage-card-section-name">이름</div>
                          <div className="mypage-card-section-value">
                            {me.name}
                          </div>
                        </div>

                        <div className="mypage-card-section">
                          <div className="mypage-card-section-name">
                            프로필사진
                          </div>
                          <div className="mypage-card-section-value">
                            <img
                              src={me.profileImageUrl || "/profile1.png"}
                              alt="내 프로필"
                              className="profile-img"
                            />
                          </div>
                          <div className="mypage-card-section-btn">
                            <button
                              className="useredit-btn"
                              onClick={handleClickChangeProfile}
                              disabled={isUploading}
                            >
                              {isUploading ? "진행중" : "변경"}
                            </button>
                            {/* 숨김 파일 입력 */}
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={handleChangeProfileFile}
                            />
                          </div>
                        </div>

                        <div className="mypage-card-section">
                          <div className="mypage-card-section-name">
                            생년월일
                          </div>
                          <div className="mypage-card-section-value">
                            {me.birthDate}
                          </div>
                        </div>

                        <div className="mypage-card-section">
                          <div className="mypage-card-section-name">이메일</div>
                          <div className="mypage-card-section-value">
                            {me.email}
                          </div>
                        </div>
                        <div className="mypage-card-section">
                          <div className="mypage-card-section-name">
                            연인코드
                          </div>
                          <div className="mypage-card-section-value">
                            {me.coupleId ? `${me.coupleId}` : "없음"}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mypage-card-section-password">
                          <div className="mypage-card-section-password-name">
                            현재 비밀번호
                          </div>
                          <input
                            type="password"
                            placeholder=""
                            value={pwForm.current}
                            onChange={(e) =>
                              setPwForm((s) => ({
                                ...s,
                                current: e.target.value,
                              }))
                            }
                            className="password-input"
                            autoComplete="current-password"
                          />
                        </div>
                        <div className="mypage-card-section-password">
                          <div className="mypage-card-section-password-name">
                            새 비밀번호
                          </div>
                          <input
                            type="password"
                            placeholder=""
                            value={pwForm.next}
                            onChange={(e) =>
                              setPwForm((s) => ({
                                ...s,
                                next: e.target.value,
                              }))
                            }
                            className="password-input"
                            autoComplete="new-password"
                          />
                        </div>
                        <div className="mypage-card-section-password">
                          <div className="mypage-card-section-password-name">
                            새 비밀번호 확인
                          </div>
                          <input
                            type="password"
                            placeholder=""
                            value={pwForm.confirm}
                            onChange={(e) =>
                              setPwForm((s) => ({
                                ...s,
                                confirm: e.target.value,
                              }))
                            }
                            className="password-input"
                            autoComplete="new-password"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    {!pwEditing ? (
                      <div className="mypage-card-section-btn password-btn">
                        <button
                          className="useredit-btn"
                          onClick={() => setPwEditing(true)}
                        >
                          비밀번호 변경
                        </button>
                      </div>
                    ) : (
                      <div
                        className="mypage-card-section-btn"
                        style={{ gap: 8 }}
                      >
                        <button
                          className="useredit-btn"
                          onClick={() => {
                            setPwEditing(false);
                            setPwForm({
                              current: "",
                              next: "",
                              confirm: "",
                            });
                          }}
                          disabled={pwSaving}
                        >
                          취소
                        </button>{" "}
                        <button
                          className="useredit-btn"
                          onClick={submitChangePassword}
                          disabled={pwSaving}
                        >
                          {pwSaving ? "저장 중..." : "저장"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 연인 정보 */}
            {partner && (
              <div className="mypage-card-wrapper">
                <div className="mypage-card-title-wrapper">
                  <div className="mypage-card-title">연인 정보</div>
                  <div className="danger-btn-wrapper">
                    <button
                      className="danger-btn"
                      onClick={async () => {
                        const confirmed = window.confirm(
                          "커플 연결을 해제하면 모든 데이터가 삭제됩니다.\n정말 해제하시겠습니까?"
                        );
                        if (!confirmed) return;

                        try {
                          await CouplesApi.deleteCouple();
                          alert("커플 연결이 해제되었습니다.");
                          navigate("/connection");
                        } catch (e) {
                          console.error(e);
                          alert("연결 해제 중 오류가 발생했습니다.");
                        }
                      }}
                    >
                      커플 연결 해제
                    </button>
                  </div>
                </div>
                <div className="mypage-card">
                  <div className="mypage-card-section-wrapper">
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">이름</div>
                      <div className="mypage-card-section-value">
                        {partner.name}
                      </div>
                    </div>
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">프로필사진</div>
                      <div className="mypage-card-section-value">
                        <img
                          src={partner.profileImageUrl || "/profile2.png"}
                          alt="연인 프로필"
                          className="profile-img"
                        />
                      </div>
                    </div>
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">생년월일</div>
                      <div className="mypage-card-section-value">
                        {partner.birthDate}
                      </div>
                    </div>
                    <div className="mypage-card-section">
                      <div className="mypage-card-section-name">이메일</div>
                      <div className="mypage-card-section-value">
                        {partner.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 아이 정보 (임시 고정 데이터) */}
            <div className="mypage-card-wrapper">
              <div className="mypage-card-title">아이 정보</div>
              <div className="mypage-card">
                <div className="mypage-card-section-wrapper">
                  <div className="mypage-card-section">
                    <div className="mypage-card-section-name">이름</div>
                    <div className="mypage-card-section-value">김포비</div>
                    <div className="mypage-card-section-btn">
                      <button className="useredit-btn">변경</button>
                    </div>
                  </div>
                  <div className="mypage-card-section">
                    <div className="mypage-card-section-name">프로필사진</div>
                    <div className="mypage-card-section-value">
                      <img
                        src="/child.png"
                        alt="아이 프로필"
                        className="profile-img"
                      />
                    </div>
                  </div>
                  <div className="mypage-card-section">
                    <div className="mypage-card-section-name">생년월일</div>
                    <div className="mypage-card-section-value">
                      2025년 7월 27일
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /아이 정보 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
