import { FlowScreen } from "./flow-navigation";
import styles from "./loan-prototype.module.css";

export const carriers = ["SKT", "KT", "LG U+", "알뜰폰"] as const;
export type Carrier = (typeof carriers)[number];

type CarrierSelectionScreenProps = {
  selectedCarrier: Carrier | null;
  onBack: () => void;
  onSelect: (carrier: Carrier) => void;
};

export function CarrierSelectionScreen({
  selectedCarrier,
  onBack,
  onSelect,
}: CarrierSelectionScreenProps) {
  return (
    <FlowScreen onBack={onBack} backLabel="선택동의로 돌아가기">
      <div className={styles.carrierContent}>
        <p>김롯데님, 통신사를 선택해주세요</p>
        <div className={styles.carrierList} role="radiogroup" aria-label="통신사 선택">
          {carriers.map((carrier) => {
            const selected = carrier === selectedCarrier;
            return (
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                className={`${styles.carrierOption} ${selected ? styles.carrierSelected : ""}`}
                key={carrier}
                onClick={() => onSelect(carrier)}
              >
                <span>{carrier}</span>
                <svg viewBox="0 0 22 22" aria-hidden="true">
                  <path d="m5.5 11.2 3.5 3.5 7.5-8" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </FlowScreen>
  );
}
