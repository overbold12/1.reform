import Image from "next/image";
import spinnerImage from "../../../references/to-be(platform)/Spinner Animation.png";
import styles from "./loan-prototype.module.css";

type LoadingSpinnerProps = {
  label: string;
  className?: string;
};

export function LoadingSpinner({ label, className }: LoadingSpinnerProps) {
  return (
    <span
      className={`${styles.loadingSpinner} ${className ?? ""}`}
      role="status"
      aria-label={label}
    >
      <Image src={spinnerImage} alt="" aria-hidden="true" />
    </span>
  );
}
