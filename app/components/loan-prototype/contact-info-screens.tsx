"use client";

import Image from "next/image";
import addressInfoSheetImage from "../../../references/to-be/Bottom Sheet(주소정보).png";
import { PaymentScreenShell } from "./payment-info-screens";
import styles from "./loan-prototype.module.css";

function NextButton({ onClick, inert = false }: { onClick?: () => void; inert?: boolean }) {
  return (
    <button
      type="button"
      className={styles.paymentNextButton}
      onClick={inert ? undefined : onClick}
      aria-label={inert ? "다음 버튼은 프로토타입 UI로만 제공됩니다" : undefined}
    >
      <span>다음</span>
      <span className={styles.paymentArrow} aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
      </span>
    </button>
  );
}

export function AddressInputScreen({
  kind,
  detail = false,
  value,
  onValueChange,
  onBack,
  onNext,
}: {
  kind: "자택" | "직장";
  detail?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const inputId = `${kind === "자택" ? "home" : "office"}-${detail ? "detail" : "address"}`;

  return (
    <PaymentScreenShell onClose={onBack}>
      <section className={`${styles.contactContent} ${detail ? styles.contactDetailContent : ""}`}>
        <label htmlFor={inputId}>{detail ? "상세주소를 입력해주세요" : `${kind}주소를 입력해주세요`}</label>
        <input
          id={inputId}
          type="text"
          autoComplete="street-address"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        />

        {!detail ? (
          <div className={styles.addressGuide}>
            <p><span aria-hidden="true">i</span> 아래의 조합으로 정확한 주소를 검색할 수 있어요.</p>
            <ul>
              <li><b>도로명 + 건물번호</b><span>(예: 테헤란로 142)</span></li>
              <li><b>지역명 + 번지</b><span>(예: 역삼동 736-1)</span></li>
              <li><b>건물명, 아파트명</b><span>(예: 캐피탈타워)</span></li>
            </ul>
          </div>
        ) : null}

        {value.trim() ? <NextButton onClick={onNext} /> : null}
      </section>
    </PaymentScreenShell>
  );
}

export function PhoneInputScreen({
  kind,
  value,
  noPhone,
  onValueChange,
  onNoPhoneChange,
  onBack,
  onNext,
}: {
  kind: "자택" | "직장";
  value: string;
  noPhone: boolean;
  onValueChange: (value: string) => void;
  onNoPhoneChange: (checked: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const inputId = `${kind === "자택" ? "home" : "office"}-phone`;
  const canProceed = noPhone || value.length >= 8;

  return (
    <PaymentScreenShell onClose={onBack}>
      <section className={`${styles.contactContent} ${styles.phoneContactContent}`}>
        <label htmlFor={inputId}>{kind} 전화번호를 입력해 주세요</label>
        <input
          id={inputId}
          className={noPhone ? styles.noPhoneInput : ""}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={value}
          placeholder={noPhone ? `${kind} 전화번호 없음` : ""}
          disabled={noPhone}
          onChange={(event) => onValueChange(event.target.value.replace(/\D/g, "").slice(0, 12))}
        />
        <button
          type="button"
          role="checkbox"
          aria-checked={noPhone}
          className={styles.noPhoneCheck}
          onClick={() => onNoPhoneChange(!noPhone)}
        >
          <span className={noPhone ? styles.noPhoneChecked : ""} aria-hidden="true">✓</span>
          <strong>{kind} 전화번호 없음</strong>
        </button>

        {canProceed ? <NextButton onClick={onNext} /> : null}
      </section>
    </PaymentScreenShell>
  );
}

export function EmailInputScreen({
  value,
  onValueChange,
  onBack,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onBack: () => void;
}) {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  return (
    <PaymentScreenShell onClose={onBack}>
      <section className={`${styles.contactContent} ${styles.emailContactContent}`}>
        <label htmlFor="customer-email">이메일주소를 입력해주세요</label>
        <input
          id="customer-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          autoFocus
        />
        {isValid ? <NextButton inert /> : null}
      </section>
    </PaymentScreenShell>
  );
}

export function AddressAutofillSheet({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className={styles.addressSheetLayer} role="presentation">
      <div className={styles.addressSheetDim} aria-hidden="true" />
      <div className={styles.addressSheet} role="dialog" aria-modal="true" aria-label="기존 주소 정보 사용">
        <Image
          src={addressInfoSheetImage}
          alt="기존에 등록된 주소지를 사용할 수 있어요. 기존 주소로 사용할까요? 취소, 확인"
          priority
        />
        <button type="button" className={styles.addressSheetCancel} aria-label="취소" />
        <button type="button" className={styles.addressSheetConfirm} onClick={onConfirm} aria-label="기존 주소 사용 확인" />
      </div>
    </div>
  );
}
