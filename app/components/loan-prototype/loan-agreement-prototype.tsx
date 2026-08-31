"use client";

import { useRef, useState } from "react";
import { allAgreementGroups, loanAgreementGroups } from "./agreement-data";
import { AgreementDetail } from "./agreement-detail";
import {
  AgreementTypeSheet,
  type AgreementType,
} from "./agreement-type-sheet";
import { LpointValidationSheet } from "./lpoint-validation-sheet";
import {
  initialOptionalAgreements,
  optionalAgreementGroups,
  optionalChildId,
} from "./optional-agreement-data";
import { OptionalAgreementScreen } from "./optional-agreement-screen";
import { RequiredAgreementScreen } from "./required-agreement-screen";
import styles from "./loan-prototype.module.css";

type PrototypeStep =
  | "agreement-type"
  | "required-agreement"
  | "optional-agreement";

const initialAgreements = Object.fromEntries(
  allAgreementGroups.map((group) => [group.id, false]),
);

export function LoanAgreementPrototype() {
  const [step, setStep] = useState<PrototypeStep>("agreement-type");
  const [agreementType, setAgreementType] = useState<AgreementType>("summary");
  const [agreements, setAgreements] =
    useState<Record<string, boolean>>(initialAgreements);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [optionalAgreements, setOptionalAgreements] =
    useState<Record<string, boolean>>(initialOptionalAgreements);
  const [showLpointValidation, setShowLpointValidation] = useState(false);
  const [detailTitle, setDetailTitle] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allLoanAgreementsChecked = loanAgreementGroups.every(
    (group) => agreements[group.id],
  );
  const allRequiredChecked = allAgreementGroups.every(
    (group) => agreements[group.id],
  );
  const allOptionalChecked = optionalAgreementGroups.every(
    (group) => optionalAgreements[group.id],
  );

  function moveToRequiredAgreement() {
    setStep("required-agreement");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }

  function moveBackToAgreementType() {
    setDetailTitle(null);
    setStep("agreement-type");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }

  function moveToOptionalAgreement() {
    setDetailTitle(null);
    setStep("optional-agreement");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }

  function moveBackToRequiredAgreement() {
    setDetailTitle(null);
    setShowLpointValidation(false);
    setStep("required-agreement");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }

  function toggleAgreement(id: string) {
    setAgreements((current) => ({ ...current, [id]: !current[id] }));
  }

  function toggleLoanAgreements() {
    setAgreements((current) => {
      const next = { ...current };
      loanAgreementGroups.forEach((group) => {
        next[group.id] = !allLoanAgreementsChecked;
      });
      return next;
    });
  }

  function toggleExpanded(id: string) {
    setExpandedGroups((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleOptionalAgreement(id: string) {
    setOptionalAgreements((current) => {
      const group = optionalAgreementGroups.find((item) => item.id === id);
      if (!group) return current;

      const next = { ...current };
      const nextValue = !current[id];
      next[id] = nextValue;

      if (group.kind === "channels") {
        group.children.forEach((child) => {
          next[optionalChildId(id, child)] = nextValue;
        });
      }

      return next;
    });
  }

  function toggleOptionalChild(id: string, child: string) {
    setOptionalAgreements((current) => {
      const group = optionalAgreementGroups.find((item) => item.id === id);
      if (!group) return current;

      const next = { ...current };
      const childId = optionalChildId(id, child);
      next[childId] = !current[childId];
      next[id] = group.children.every((item) =>
        item === child
          ? next[childId]
          : Boolean(next[optionalChildId(id, item)]),
      );
      return next;
    });
  }

  function toggleAllOptionalAgreements() {
    const nextValue = !allOptionalChecked;
    setOptionalAgreements(
      Object.fromEntries(
        Object.keys(initialOptionalAgreements).map((id) => [id, nextValue]),
      ),
    );
  }

  function handleOptionalNext() {
    const lpointMarketing = optionalAgreementGroups.find(
      (group) => group.id === "lpoint-marketing",
    );
    const hasLpointMarketingSelection =
      Boolean(optionalAgreements["lpoint-marketing"]) ||
      Boolean(
        lpointMarketing?.children.some(
          (child) => optionalAgreements[optionalChildId("lpoint-marketing", child)],
        ),
      );
    const requestedLpointBenefit =
      Boolean(optionalAgreements["lpoint-optional-personal"]) ||
      hasLpointMarketingSelection;
    const hasRequiredLpointAgreements =
      Boolean(optionalAgreements["lotte-members-provide"]) &&
      Boolean(optionalAgreements["lpoint-required-personal"]);

    if (requestedLpointBenefit && !hasRequiredLpointAgreements) {
      setShowLpointValidation(true);
    }
  }

  function resetPrototype() {
    setStep("agreement-type");
    setAgreementType("summary");
    setAgreements({ ...initialAgreements });
    setOptionalAgreements({ ...initialOptionalAgreements });
    setExpandedGroups(new Set());
    setShowLpointValidation(false);
    setDetailTitle(null);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }

  return (
    <section className={`workspace-card ${styles.prototypeWorkspace}`}>
      <div className="workspace-card-header">
        <div>
          <span className="workspace-kicker">INTERACTIVE MOBILE PROTOTYPE</span>
          <h2>대출 신청 · 약관동의</h2>
        </div>
        <div className={styles.workspaceActions}>
          <span className={styles.stepBadge}>
            {step === "agreement-type"
              ? "01 동의서 선택"
              : step === "required-agreement"
                ? "02 필수동의"
                : "03 선택동의"}
          </span>
          <button type="button" className={styles.resetButton} onClick={resetPrototype}>
            다시 시작
          </button>
        </div>
      </div>

      <div className={styles.prototypeStage}>
        <div className={styles.phoneFrame}>
          {step === "optional-agreement" ? (
            <OptionalAgreementScreen
              agreements={optionalAgreements}
              expandedGroups={expandedGroups}
              allOptionalChecked={allOptionalChecked}
              scrollRef={scrollRef}
              onBack={moveBackToRequiredAgreement}
              onNext={handleOptionalNext}
              onToggleAll={toggleAllOptionalAgreements}
              onToggleAgreement={toggleOptionalAgreement}
              onToggleChild={toggleOptionalChild}
              onToggleExpanded={toggleExpanded}
              onDocumentOpen={setDetailTitle}
            />
          ) : (
            <RequiredAgreementScreen
              agreements={agreements}
              expandedGroups={expandedGroups}
              allLoanAgreementsChecked={allLoanAgreementsChecked}
              allRequiredChecked={allRequiredChecked}
              scrollRef={scrollRef}
              onBack={moveBackToAgreementType}
              onContinue={moveToOptionalAgreement}
              onToggleLoanAll={toggleLoanAgreements}
              onToggleAgreement={toggleAgreement}
              onToggleExpanded={toggleExpanded}
              onDocumentOpen={setDetailTitle}
            />
          )}

          {step === "agreement-type" ? (
            <AgreementTypeSheet
              selectedType={agreementType}
              onSelect={setAgreementType}
              onConfirm={moveToRequiredAgreement}
            />
          ) : null}

          {detailTitle ? (
            <AgreementDetail title={detailTitle} onClose={() => setDetailTitle(null)} />
          ) : null}

          {showLpointValidation ? (
            <LpointValidationSheet onClose={() => setShowLpointValidation(false)} />
          ) : null}
        </div>

        <div className={styles.demoGuide}>
          <span>DEMO GUIDE</span>
          <h3>동의 흐름을 직접 조작해 보세요</h3>
          <ol>
            <li>
              <b>01</b>
              <span>동의서 종류 선택</span>
            </li>
            <li>
              <b>02</b>
              <span>전체 또는 개별 필수동의</span>
            </li>
            <li>
              <b>03</b>
              <span>선택동의 및 L.POINT 조건 확인</span>
            </li>
          </ol>
          <p>이번 구현 범위는 선택동의 단계에서 종료됩니다.</p>
        </div>
      </div>
    </section>
  );
}
