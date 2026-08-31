type ContentHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ContentHeader({
  eyebrow,
  title,
  description,
}: ContentHeaderProps) {
  return (
    <header className="content-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      <span className="phase-badge">UI SKELETON</span>
    </header>
  );
}
