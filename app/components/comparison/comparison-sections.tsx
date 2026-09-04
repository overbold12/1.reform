import type { ReactNode } from "react";
import type {
  ComparisonItem,
  ComparisonSummaryData,
  FlowConsolidationItem,
  FlowStepData,
  ScreenComparisonItem,
} from "./comparison-data";
import styles from "./comparison.module.css";

type ComparisonSectionProps = {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function ComparisonSection({
  number,
  title,
  description,
  children,
}: ComparisonSectionProps) {
  return (
    <section className={styles.section} aria-labelledby={`comparison-section-${number}`}>
      <header className={styles.sectionHeader}>
        <span>{number}</span>
        <div>
          <h3 id={`comparison-section-${number}`}>{title}</h3>
          <p>{description}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

export function ComparisonSummary({ summary }: { summary: ComparisonSummaryData | null }) {
  if (!summary) {
    return (
      <div className={styles.summaryPlaceholder}>
        <div className={styles.summaryMessage}>핵심 개선 메시지 입력 예정</div>
        <div className={styles.metricGrid}>
          <MetricPlaceholder />
          <MetricPlaceholder />
        </div>
        <p className={styles.effectPlaceholder}>개선 효과 입력 예정</p>
      </div>
    );
  }

  return (
    <div className={styles.summaryContent}>
      <p className={styles.summaryMessage}>{summary.message}</p>
      <div className={styles.metricGrid}>
        {summary.metrics.length > 0 ? (
          summary.metrics.map((metric) => (
            <div className={styles.metric} key={metric.id}>
              <span>{metric.label}</span>
              <div>
                <strong>{metric.asIs}</strong>
                <ComparisonArrow />
                <strong>{metric.toBe}</strong>
              </div>
            </div>
          ))
        ) : (
          <MetricPlaceholder />
        )}
      </div>
      <p className={styles.summaryEffect}>{summary.effect ?? "개선 효과 입력 예정"}</p>
    </div>
  );
}

function MetricPlaceholder() {
  return (
    <div className={`${styles.metric} ${styles.isPlaceholder}`}>
      <span>지표 입력 예정</span>
      <div>
        <strong>AS-IS</strong>
        <ComparisonArrow />
        <strong>TO-BE</strong>
      </div>
    </div>
  );
}

export function FlowComparison({
  asIsFlow,
  toBeFlow,
}: {
  asIsFlow: FlowStepData[];
  toBeFlow: FlowStepData[];
}) {
  return (
    <div className={styles.flowComparison}>
      <FlowLane label="AS-IS" steps={asIsFlow} emptyText="AS-IS 프로세스 입력 예정" />
      <FlowLane label="TO-BE" steps={toBeFlow} emptyText="TO-BE 프로세스 입력 예정" />
    </div>
  );
}

function FlowLane({
  label,
  steps,
  emptyText,
}: {
  label: "AS-IS" | "TO-BE";
  steps: FlowStepData[];
  emptyText: string;
}) {
  return (
    <div className={styles.flowLane}>
      <ComparisonLabel kind={label} />
      <div className={styles.flowSteps}>
        {steps.length > 0 ? (
          steps.map((step, index) => (
            <div className={styles.flowStepGroup} key={step.id}>
              <FlowStep step={step} />
              {index < steps.length - 1 ? <ComparisonArrow /> : null}
            </div>
          ))
        ) : (
          <div className={styles.flowEmpty}>{emptyText}</div>
        )}
      </div>
    </div>
  );
}

export function FlowStep({ step }: { step: FlowStepData }) {
  return (
    <div className={styles.flowStep}>
      <strong>{step.title}</strong>
      {step.description ? <span>{step.description}</span> : null}
    </div>
  );
}

export function ComparisonItems({ items }: { items: ComparisonItem[] }) {
  if (items.length === 0) {
    return (
      <div className={styles.itemList}>
        <ScreenComparison />
        <FlowConsolidationComparison />
      </div>
    );
  }

  return (
    <div className={styles.itemList}>
      {items.map((item) =>
        item.type === "screen-comparison" ? (
          <ScreenComparison item={item} key={item.id} />
        ) : (
          <FlowConsolidationComparison item={item} key={item.id} />
        ),
      )}
    </div>
  );
}

export function ScreenComparison({ item }: { item?: ScreenComparisonItem }) {
  return (
    <article className={styles.comparisonItem}>
      <ComparisonItemHeader type="TYPE A · SCREEN COMPARISON" title={item?.title} />
      <div className={styles.screenPair}>
        <ScreenColumn label="AS-IS">
          <MobileFramePlaceholder label={item?.asIsScreen ?? "AS-IS 화면 등록 예정"} />
        </ScreenColumn>
        <ComparisonArrow large />
        <ScreenColumn label="TO-BE">
          <MobileFramePlaceholder label={item?.toBeScreen ?? "TO-BE 화면 등록 예정"} />
        </ScreenColumn>
      </div>
      <ComparisonDetailRows detail={item?.detail} />
    </article>
  );
}

export function FlowConsolidationComparison({ item }: { item?: FlowConsolidationItem }) {
  const asIsLabels = item?.asIsScreens.length
    ? item.asIsScreens
    : ["AS-IS 화면 등록 예정"];
  const toBeLabels = item?.toBeScreens.length
    ? item.toBeScreens
    : ["TO-BE 화면 등록 예정"];

  return (
    <article className={styles.comparisonItem}>
      <ComparisonItemHeader type="TYPE B · FLOW CONSOLIDATION" title={item?.title} />
      <div className={styles.consolidationPair}>
        <ScreenColumn label="AS-IS" compact>
          <div className={styles.frameSequence}>
            {asIsLabels.map((label, index) => (
              <MobileFramePlaceholder compact label={label} key={`${label}-${index}`} />
            ))}
          </div>
        </ScreenColumn>
        <ComparisonArrow large />
        <ScreenColumn label="TO-BE">
          <div className={styles.frameSequence}>
            {toBeLabels.map((label, index) => (
              <MobileFramePlaceholder label={label} key={`${label}-${index}`} />
            ))}
          </div>
        </ScreenColumn>
      </div>
      <ComparisonDetailRows detail={item?.detail} />
    </article>
  );
}

function ComparisonItemHeader({ type, title }: { type: string; title?: string }) {
  return (
    <header className={styles.itemHeader}>
      <span>{type}</span>
      <h4>{title ?? "비교 항목 입력 예정"}</h4>
    </header>
  );
}

function ScreenColumn({
  label,
  compact = false,
  children,
}: {
  label: "AS-IS" | "TO-BE";
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.screenColumn} ${compact ? styles.screenColumnCompact : ""}`}>
      <ComparisonLabel kind={label} />
      {children}
    </div>
  );
}

export function MobileFramePlaceholder({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <div className={`${styles.mobileFrame} ${compact ? styles.mobileFrameCompact : ""}`}>
      <span className={styles.mobileSpeaker} aria-hidden="true" />
      <span>{label}</span>
      <i aria-hidden="true" />
    </div>
  );
}

function ComparisonDetailRows({
  detail,
}: {
  detail?: { change: string | null; intent: string | null; effect: string | null };
}) {
  const rows = [
    { label: "변경 내용", value: detail?.change },
    { label: "개선 의도", value: detail?.intent },
    { label: "기대 효과", value: detail?.effect },
  ];

  return (
    <dl className={styles.detailRows}>
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd className={row.value ? undefined : styles.placeholderText}>
            {row.value ?? "입력 예정"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function InteractiveComparison({
  asIsPrototype,
  toBePrototype,
}: {
  asIsPrototype?: ReactNode;
  toBePrototype?: ReactNode;
}) {
  return (
    <div className={styles.prototypeGrid}>
      <PrototypeSlot label="AS-IS" placeholder="AS-IS 프로토타입 연결 예정">
        {asIsPrototype}
      </PrototypeSlot>
      <PrototypeSlot label="TO-BE" placeholder="TO-BE 프로토타입 연결 예정">
        {toBePrototype}
      </PrototypeSlot>
    </div>
  );
}

function PrototypeSlot({
  label,
  placeholder,
  children,
}: {
  label: "AS-IS" | "TO-BE";
  placeholder: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.prototypeSlot}>
      <ComparisonLabel kind={label} />
      <div className={styles.prototypeArea}>
        {children ?? (
          <div className={styles.prototypePlaceholder}>
            <span aria-hidden="true" />
            <p>{placeholder}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ComparisonLabel({ kind }: { kind: "AS-IS" | "TO-BE" }) {
  return (
    <span
      className={`${styles.comparisonLabel} ${
        kind === "TO-BE" ? styles.toBeLabel : styles.asIsLabel
      }`}
    >
      {kind}
    </span>
  );
}

function ComparisonArrow({ large = false }: { large?: boolean }) {
  return (
    <svg
      className={`${styles.arrow} ${large ? styles.arrowLarge : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12h13M14 8l4 4-4 4" />
    </svg>
  );
}
