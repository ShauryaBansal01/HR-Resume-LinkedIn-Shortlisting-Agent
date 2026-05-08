import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Candidates', path: '/candidates', icon: Users },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Insights', path: '/insights', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col p-4">
      <div className="flex items-center space-x-3 px-2 py-4 mb-6">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
          H
        </div>
        <span className="font-bold text-xl tracking-tight">HireAI</span>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-md"
                    initial={false}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
            HR
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">HR Admin</span>
            <span className="text-xs text-muted-foreground">admin@hireai.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
