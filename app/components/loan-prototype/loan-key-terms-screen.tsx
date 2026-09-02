"use client";

import { useState } from "react";
import { MobileStatusBar } from "./mobile-status-bar";
import styles from "./loan-prototype.module.css";

type Answer = "yes" | "no" | null;

const KEY_TERM_QUESTIONS = [
  {
    id: "no-payment-request",
    title: "1. 금전 요구 및 지급 없음 확인",
    body: "본인은 본 대출 신청과 관련하여 귀사의 직원, 대출상담사 또는 제 3자로부터 수수료, 선수금, 예치금, 보증금, 수고비 등 어떠한 명목으로도 금전을 요구받은 적이 없으며 추후에도 지급의사 없음을 알려드립니다.",
    question: "해당사항을 확인하셨습니까?",
  },
  {
    id: "document-return",
    title: "2. 대출심사 및 서류미반환",
    body: "본인은 대출심사에 관한 모든 사항(대출 거부의 결정, 대출한도, 금리) 등은 귀사가 결정하는 것과, 대출 산정을 위해 제출 및 작성한 서류 일체는 대출 거절시에도",
    question: "반환되지 않음을 확인하셨습니까?",
  },
  {
    id: "rate-reduction",
    title: "3. 금리인하요구권",
    body: "본인은 본인의 신용상태가 개선 되었다고 판단되는 경우(예: 취업, 승진, 재산증가, 개인신용평점 상승) 금융회사에 금리인하를 요구할 수 있습니다. 단, 신용상태가 금리에 영향을 미치지 않는 상품은 금리인하요구권의 행사 대상에서 제외될 수 있으며, 금리인하 요구는",
    question: "수용되지 않을 수 있음을 확인하셨습니까?",
  },
  {
    id: "transaction-disadvantage",
    title: "4. 대출거래 불이익 설명",
    body: "본인의 소득, 재산, 부채상황, 신용 및 변제계획 등을 고려하여 적합한 대출상품을 선택하였으며, 대출이 필요한 자금의 범위를 초과하지 않도록 하였습니다. 그리고 대출 사실만으로 신용점수가 하락할 수 있다는 사실과 은행 등에서의 대출보다 신용점수가 더 큰 폭으로 하락할 수 있다는",
    question: "사실을 설명 듣고 확인하셨습니까?",
  },
  {
    id: "overdue-interest",
    title: "5. 연체 및 연체이자",
    body: "본 상품을 연체하셨을 때에는 대출원금에 대해 3%의 연체이자율(지역세납금율)이 법정최고금리 내에서 적용되며, 이자를 납입하기로 약정한 날, 원금을 상환하기로 약정한 날, 분할상환금을 상환하기로 한 날 등에 상환하지 않았을 경우 연체이자를 낼 수 있다는",
    question: "사항을 확인하셨습니까?",
  },
  {
    id: "early-repayment-fee",
    title: "6. 중도상환수수료",
    body: "상품에 따라 3년 이내에 중도 상환하시는 경우, 정해진 요율에 의하여 중도상환수수료가 발생할 수 있습니다. 이때, 상환하려는 금액의 최장기간에 해당하는 금액에 대한 중도상환수수료를 납부하여야",
    question: "대출상품의 중도해지가 가능함을 확인하셨습니까?",
    notice: "금융회사가 금융소비자보호법 제47조 상 의무를 위반하여 대출계약을 체결한 경우, 해당 계약을 위약금 등 수수료 부과없이 해지할 수 있습니다.",
  },
  {
    id: "withdrawal-right",
    title: "7. 청약철회권",
    body: "고객은 계약체결일 또는 계약서류를 제공받은 날로부터 14일 이내에 계약에 대한 청약을 철회할 수 있습니다. 다만, 동일한 금융회사를 대상으로 최근 1개월 내에 2회 이상 대출계약을 철회하는 경우, 신규대출·만기연장 거절, 대출한도 축소, 금리우대 제한 등 불이익이 발생할 수",
    question: "있음을 확인하셨습니까?",
  },
] as const;

const INITIAL_ANSWERS = Object.fromEntries(
  KEY_TERM_QUESTIONS.map((question) => [question.id, null]),
) as Record<(typeof KEY_TERM_QUESTIONS)[number]["id"], Answer>;

export function LoanKeyTermsScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [answers, setAnswers] = useState({ ...INITIAL_ANSWERS });
  const allYes = KEY_TERM_QUESTIONS.every((question) => answers[question.id] === "yes");

  return (
    <div className={`${styles.appScreen} ${styles.keyTermsScreen}`}>
      <header className={styles.customerInfoHeader}>
        <MobileStatusBar inverse />
        <div className={styles.paymentNav}>
          <button type="button" className={styles.paymentCloseButton} onClick={onBack} aria-label="대출 주요 내용 확인 닫기"><span /><span /></button>
          <div className={styles.customerInfoStep} aria-label="대출 신청 5단계 중 3단계 약관동의">
            <i aria-hidden="true" /><i aria-hidden="true" /><b>3</b><strong>약관동의</strong><span>4</span><span>5</span>
          </div>
        </div>
      </header>

      <main className={styles.keyTermsPanel}>
        <div className={styles.paymentHandle} aria-hidden="true" />
        <div className={styles.keyTermsScroll}>
          <h1>안전하고 투명한 대출신청을 위해<br />아래 내용을 확인해주세요</h1>
          <p className={styles.keyTermsIntro}>※ 금융소비자가 충분한 이해없이 확인했다고 답변할 경우 추후 소송이나 분쟁에서 소비자에게 불리하게 작용할 수 있습니다.</p>

          <div className={styles.keyTermsQuestions}>
            {KEY_TERM_QUESTIONS.map((item) => (
              <section key={item.id} className={styles.keyTermsQuestion}>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
                {"question" in item ? <strong>{item.question}</strong> : null}
                {"notice" in item ? <p className={styles.keyTermsNotice}><span aria-hidden="true">i</span>{item.notice}</p> : null}

                <div className={styles.keyTermsAnswers} role="radiogroup" aria-label={`${item.title} 확인`}>
                  {(["yes", "no"] as const).map((answer) => {
                    const selected = answers[item.id] === answer;
                    return (
                      <button
                        type="button"
                        key={answer}
                        role="radio"
                        aria-checked={selected}
                        className={selected ? styles.keyTermsAnswerSelected : ""}
                        onClick={() => setAnswers((current) => ({ ...current, [item.id]: answer }))}
                      >
                        <span aria-hidden="true">✓</span>
                        <b>{answer === "yes" ? "예" : "아니오"}</b>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {allYes ? (
            <button type="button" className={styles.keyTermsNextButton} onClick={onNext}>
              <span>다음</span>
              <span className={styles.paymentArrow} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>
            </button>
          ) : null}
        </div>
      </main>
      <div className={styles.homeIndicator} aria-hidden="true" />
    </div>
  );
}
