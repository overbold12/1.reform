"use client";

import { useEffect, useRef } from "react";
import styles from "./loan-prototype.module.css";

export type PrototypeStep =
  | "agreement-type"
  | "required-agreement"
  | "optional-agreement"
  | "carrier-selection"
  | "name-input"
  | "phone-input"
  | "resident-input"
  | "verification-code"
  | "public-data-entry"
  | "electronic-signature"
  | "public-data-receive"
  | "screening"
  | "loan-result"
  | "loan-condition";

export const prototypeStages: Array<{
  id: PrototypeStep;
  number: string;
  label: string;
}> = [
  { id: "agreement-type", number: "01", label: "동의서 선택" },
  { id: "required-agreement", number: "02", label: "필수동의" },
  { id: "optional-agreement", number: "03", label: "선택동의" },
  { id: "carrier-selection", number: "04", label: "통신사" },
  { id: "name-input", number: "05", label: "이름" },
  { id: "phone-input", number: "06", label: "휴대폰번호" },
  { id: "resident-input", number: "07", label: "주민번호" },
  { id: "verification-code", number: "08", label: "인증번호" },
  { id: "public-data-entry", number: "09", label: "마이데이터" },
  { id: "electronic-signature", number: "10", label: "전자서명" },
  { id: "public-data-receive", number: "11", label: "정보수신" },
  { id: "screening", number: "12", label: "심사중" },
  { id: "loan-result", number: "13", label: "심사결과" },
  { id: "loan-condition", number: "14", label: "대출조건 설정" },
];

type PrototypeFlowGraphProps = {
  currentStep: PrototypeStep;
  onNavigate: (step: PrototypeStep) => void;
};

export function PrototypeFlowGraph({
  currentStep,
  onNavigate,
}: PrototypeFlowGraphProps) {
  const activeNodeRef = useRef<HTMLButtonElement>(null);
  const graphScrollRef = useRef<HTMLDivElement>(null);
  const currentIndex = prototypeStages.findIndex(
    (stage) => stage.id === currentStep,
  );

  useEffect(() => {
    const node = activeNodeRef.current;
    const container = graphScrollRef.current;
    if (!node || !container) return;

    const nodeBounds = node.getBoundingClientRect();
    const containerBounds = container.getBoundingClientRect();
    const left =
      container.scrollLeft +
      nodeBounds.left -
      containerBounds.left -
      (container.clientWidth - nodeBounds.width) / 2;

    container.scrollTo({ left, behavior: "smooth" });
  }, [currentStep]);

  return (
    <nav className={styles.flowGraph} aria-label="프로토타입 단계 바로가기">
      <div className={styles.flowGraphHeader}>
        <span>CONSENT &amp; IDENTITY FLOW</span>
        <p>단계를 선택하면 해당 화면으로 바로 이동합니다. 14단계까지 직접 확인할 수 있습니다.</p>
      </div>
      <div ref={graphScrollRef} className={styles.flowGraphScroll}>
        <ol className={styles.flowGraphList}>
          {prototypeStages.map((stage, index) => {
            const active = stage.id === currentStep;
            const visited = index < currentIndex;
            return (
              <li key={stage.id}>
                <button
                  type="button"
                  ref={active ? activeNodeRef : undefined}
                  className={`${styles.flowNode} ${active ? styles.flowNodeActive : ""} ${visited ? styles.flowNodeVisited : ""}`}
                  aria-current={active ? "step" : undefined}
                  onClick={() => onNavigate(stage.id)}
                >
                  <span>{stage.number}</span>
                  <strong>{stage.label}</strong>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
