const comparisonTargets = [
  { label: "AS-IS", title: "기존 화면" },
  { label: "TO-BE", title: "개선 화면" },
];

export function ComparisonPanel() {
  return (
    <section className="workspace-card comparison-workspace">
      <div className="workspace-card-header">
        <div>
          <span className="workspace-kicker">SIDE-BY-SIDE VIEW</span>
          <h2>화면 비교</h2>
        </div>
        <span className="ready-label">
          <span aria-hidden="true" />
          Ready
        </span>
      </div>

      <div className="comparison-grid">
        {comparisonTargets.map((target) => (
          <div className="comparison-slot" key={target.label}>
            <div className="slot-heading">
              <span>{target.label}</span>
              <strong>{target.title}</strong>
            </div>
            <div className="slot-placeholder" aria-hidden="true">
              <div />
              <div />
              <div />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
