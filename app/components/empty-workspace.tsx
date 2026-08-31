type EmptyWorkspaceProps = {
  label: string;
  description: string;
};

export function EmptyWorkspace({ label, description }: EmptyWorkspaceProps) {
  return (
    <section className="workspace-card">
      <div className="workspace-card-header">
        <div>
          <span className="workspace-kicker">MOBILE APP FRAME</span>
          <h2>{label}</h2>
        </div>
        <span className="ready-label">
          <span aria-hidden="true" />
          Ready
        </span>
      </div>

      <div className="empty-stage">
        <div className="phone-outline" aria-hidden="true">
          <div className="phone-speaker" />
          <div className="phone-placeholder">
            <span />
            <span />
            <span />
          </div>
        </div>
        <p>{description}</p>
      </div>
    </section>
  );
}
