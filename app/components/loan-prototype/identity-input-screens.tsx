import type { ChangeEvent, RefObject } from "react";
import { FlowScreen, InlineNextButton } from "./flow-navigation";
import styles from "./loan-prototype.module.css";

function onlyDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

type NameInputScreenProps = {
  name: string;
  onNameChange: (name: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function NameInputScreen({
  name,
  onNameChange,
  onBack,
  onNext,
}: NameInputScreenProps) {
  return (
    <FlowScreen onBack={onBack} backLabel="통신사 선택으로 돌아가기">
      <div className={styles.identityFormContent}>
        <label className={styles.inputLabel} htmlFor="customer-name">
          이름을 입력해주세요
        </label>
        <input
          id="customer-name"
          className={styles.identityTextInput}
          value={name}
          maxLength={20}
          autoComplete="name"
          onChange={(event) => onNameChange(event.target.value)}
        />
        <div className={styles.inlineActionArea}>
          <InlineNextButton
            label="확인"
            disabled={!name.trim()}
            onClick={onNext}
          />
        </div>
      </div>
    </FlowScreen>
  );
}

type PhoneInputScreenProps = {
  phoneNumber: string;
  onPhoneNumberChange: (phoneNumber: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function PhoneInputScreen({
  phoneNumber,
  onPhoneNumberChange,
  onBack,
  onNext,
}: PhoneInputScreenProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onPhoneNumberChange(onlyDigits(event.target.value, 11));
  }

  return (
    <FlowScreen onBack={onBack} backLabel="이름 입력으로 돌아가기">
      <div className={styles.identityFormContent}>
        <label className={styles.inputLabel} htmlFor="customer-phone">
          휴대폰번호를 입력해주세요
        </label>
        <input
          id="customer-phone"
          className={styles.identityTextInput}
          value={phoneNumber}
          inputMode="numeric"
          autoComplete="tel"
          placeholder="'-'없이 입력"
          onChange={handleChange}
        />
        {phoneNumber.length === 11 ? (
          <div className={styles.inlineActionArea}>
            <InlineNextButton label="확인" onClick={onNext} />
          </div>
        ) : null}
      </div>
    </FlowScreen>
  );
}

type ResidentInputScreenProps = {
  birthDate: string;
  genderDigit: string;
  privateDigits: string;
  genderInputRef: RefObject<HTMLInputElement | null>;
  privateInputRef: RefObject<HTMLInputElement | null>;
  onBirthDateChange: (value: string) => void;
  onGenderDigitChange: (value: string) => void;
  onPrivateDigitsChange: (value: string) => void;
  onBack: () => void;
  onRequestVerification: () => void;
};

export function ResidentInputScreen({
  birthDate,
  genderDigit,
  privateDigits,
  genderInputRef,
  privateInputRef,
  onBirthDateChange,
  onGenderDigitChange,
  onPrivateDigitsChange,
  onBack,
  onRequestVerification,
}: ResidentInputScreenProps) {
  const complete =
    birthDate.length === 6 &&
    genderDigit.length === 1 &&
    privateDigits.length === 6;

  function handleBirthDateChange(event: ChangeEvent<HTMLInputElement>) {
    const next = onlyDigits(event.target.value, 6);
    onBirthDateChange(next);
    if (next.length === 6) genderInputRef.current?.focus();
  }

  function handleGenderChange(event: ChangeEvent<HTMLInputElement>) {
    const next = onlyDigits(event.target.value, 1);
    onGenderDigitChange(next);
    if (next.length === 1) privateInputRef.current?.focus();
  }

  function handlePrivateChange(event: ChangeEvent<HTMLInputElement>) {
    onPrivateDigitsChange(onlyDigits(event.target.value, 6));
  }

  return (
    <FlowScreen onBack={onBack} backLabel="휴대폰번호 입력으로 돌아가기">
      <div className={styles.identityFormContent}>
        <span className={styles.inputLabel}>주민등록번호를 입력해주세요</span>
        <div className={styles.residentInputRow}>
          <label className={styles.visuallyHidden} htmlFor="resident-birth">
            주민등록번호 앞 6자리
          </label>
          <input
            id="resident-birth"
            value={birthDate}
            inputMode="numeric"
            placeholder="생년월일"
            onChange={handleBirthDateChange}
          />
          <span aria-hidden="true">-</span>
          <label className={styles.visuallyHidden} htmlFor="resident-gender">
            주민등록번호 뒷자리 첫 숫자
          </label>
          <input
            id="resident-gender"
            ref={genderInputRef}
            className={styles.genderDigitInput}
            type="password"
            value={genderDigit}
            inputMode="numeric"
            onChange={handleGenderChange}
          />
          <label className={styles.visuallyHidden} htmlFor="resident-private">
            주민등록번호 뒷자리 나머지 6자리
          </label>
          <input
            id="resident-private"
            ref={privateInputRef}
            className={styles.privateDigitInput}
            type="password"
            value={privateDigits}
            inputMode="numeric"
            onChange={handlePrivateChange}
          />
        </div>
        {complete ? (
          <div className={styles.inlineActionArea}>
            <InlineNextButton
              label="인증번호 요청하기"
              onClick={onRequestVerification}
            />
          </div>
        ) : null}
      </div>
    </FlowScreen>
  );
}
