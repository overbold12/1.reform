"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./loan-prototype.module.css";

type AnimatedProgressProps = {
  durationMs: number;
  label: string;
  onComplete?: () => void;
};

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

export function AnimatedProgress({
  durationMs,
  label,
  onComplete,
}: AnimatedProgressProps) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let animationFrame = 0;
    let completionTimer: ReturnType<typeof setTimeout> | null = null;
    const startedAt = performance.now();

    function updateProgress(now: number) {
      const elapsed = Math.min((now - startedAt) / durationMs, 1);
      setProgress(Math.round(easeInOutCubic(elapsed) * 100));

      if (elapsed < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
        return;
      }

      completionTimer = setTimeout(() => onCompleteRef.current?.(), 320);
    }

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrame);
      if (completionTimer) clearTimeout(completionTimer);
    };
  }, [durationMs]);

  return (
    <div
      className={styles.animatedProgress}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className={styles.receiveProgressLabel}>
        <span>진행중</span>
        <strong>{progress}%</strong>
      </div>
      <div className={styles.receiveProgressTrack}>
        <span style={{ width: `${progress}%` }}>
          <i className={progress === 0 ? styles.progressDotHidden : ""} />
        </span>
      </div>
    </div>
  );
}
