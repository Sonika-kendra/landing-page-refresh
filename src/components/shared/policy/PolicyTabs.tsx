import { Link, useLocation } from 'react-router-dom';
import { policyNav } from './policyNav';

const TABS_PER_ROW = 7;

const PolicyTabs = () => {
  const { pathname } = useLocation();

  const rows = [];
  for (let i = 0; i < policyNav.length; i += TABS_PER_ROW) {
    rows.push(policyNav.slice(i, i + TABS_PER_ROW));
  }

  return (
    <nav className="mb-10 pb-4 border-b border-border">
      <div className="flex flex-col items-center gap-y-3">
        {rows.map((row, rowIndex) => (
          <ul key={rowIndex} className="flex flex-wrap justify-center gap-x-4 gap-y-3">
            {row.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`block whitespace-nowrap text-sm py-2 px-4 rounded-sm border transition-colors ${
                      isActive
                        ? 'border-primary/30 bg-primary/10 text-primary font-medium'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </nav>
  );
};

export default PolicyTabs;
