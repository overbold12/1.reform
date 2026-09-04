import type { ComparisonService, ServiceId } from "./comparison-data";
import styles from "./comparison.module.css";

type ServiceComparisonTabsProps = {
  services: ComparisonService[];
  activeService: ServiceId;
  onServiceChange: (service: ServiceId) => void;
};

export function ServiceComparisonTabs({
  services,
  activeService,
  onServiceChange,
}: ServiceComparisonTabsProps) {
  return (
    <div className={styles.serviceTabs} role="tablist" aria-label="비교 서비스 선택">
      {services.map((service) => {
        const isActive = service.id === activeService;

        return (
          <button
            type="button"
            role="tab"
            id={`service-tab-${service.id}`}
            aria-selected={isActive}
            aria-controls={`service-panel-${service.id}`}
            className={`${styles.serviceTab} ${isActive ? styles.serviceTabActive : ""}`}
            key={service.id}
            onClick={() => onServiceChange(service.id)}
          >
            {service.title}
          </button>
        );
      })}
    </div>
  );
}
