import type { MenuId } from "./app-shell";

type SidebarProps = {
  activeMenu: MenuId;
  onMenuChange: (menu: MenuId) => void;
};

const menus: Array<{ id: MenuId; label: string }> = [
  { id: "to-be", label: "TO-BE" },
  { id: "comparison", label: "비교" },
];

function MenuIcon({ id }: { id: MenuId }) {
  if (id === "comparison") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5" width="6.5" height="14" rx="1.5" />
        <rect x="14" y="5" width="6.5" height="14" rx="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-block" aria-label="서비스 프로토타입">
        <span className="brand-mark" aria-hidden="true">
          R
        </span>
        <div>
          <strong>REFORM</strong>
          <span>Service Prototype</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="프로토타입 메뉴">
        <p className="nav-label">WORKSPACE</p>
        <ul>
          {menus.map((menu) => {
            const isActive = activeMenu === menu.id;

            return (
              <li key={menu.id}>
                <button
                  type="button"
                  className={`nav-item${isActive ? " is-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onMenuChange(menu.id)}
                >
                  <span className="nav-icon">
                    <MenuIcon id={menu.id} />
                  </span>
                  <span>{menu.label}</span>
                  <span className="active-indicator" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot" aria-hidden="true" />
        <span>기획 시연용 환경</span>
      </div>
    </aside>
  );
}
