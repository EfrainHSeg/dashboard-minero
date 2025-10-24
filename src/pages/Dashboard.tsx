import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUserRole } from "../hooks/useUserRole";
import {
  Activity,
  Home,
  Layers,
  ClipboardList,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { motion } from "framer-motion";
import AdminPanel from "../components/AdminPanel";

type Tab = "home" | "calandrias" | "summary";

interface DashboardProps {
  userName: string;
  userId: string;
}

export default function Dashboard({ userName, userId }: DashboardProps) {
  const [active, setActive] = useState<Tab>("calandrias");
  const [loading, setLoading] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // ⬅️ colapsable
  const { role, isAdmin, loading: roleLoading } = useUserRole(userId);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (showAdminPanel && isAdmin) {
    return <AdminPanel onClose={() => setShowAdminPanel(false)} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      {/* Sidebar (colapsable) */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }} // 72px vs 256px
        className="bg-white/95 backdrop-blur border-r border-slate-200 flex flex-col overflow-hidden"
      >
        {/* Header/brand + toggle */}
        <div className="px-3 py-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm">
              <Activity className="text-white" size={18} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[13px] font-extrabold leading-5 text-slate-900">
                  Dashboard Minero
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {userName}
                  {!roleLoading && role && (
                    <span
                      className={`ml-2 px-1.5 py-[2px] align-middle rounded text-[10px] font-semibold ${
                        isAdmin
                          ? "bg-purple-100 text-purple-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {isAdmin ? "Admin" : "Trabajador"}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Botón toggle */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-2 space-y-1">
          <SideItem
            icon={Home}
            label="Inicio"
            active={active === "home"}
            onClick={() => setActive("home")}
            collapsed={collapsed}
          />
          <SideItem
            icon={Layers}
            label="Calandrias"
            active={active === "calandrias"}
            onClick={() => setActive("calandrias")}
            collapsed={collapsed}
          />
          <SideItem
            icon={ClipboardList}
            label="Summary"
            active={active === "summary"}
            onClick={() => setActive("summary")}
            collapsed={collapsed}
          />
        </nav>

        {/* Botón admin solo para admin */}
        {isAdmin && (
          <div className="px-2">
            <button
              onClick={() => setShowAdminPanel(true)}
              className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors ${
                collapsed ? "justify-center" : ""
              }`}
              title={collapsed ? "Administración" : ""}
            >
              <Settings size={16} />
              {!collapsed && <span>Administración</span>}
            </button>
          </div>
        )}

        {/* Footer / Salir */}
        <div className="px-2 py-3 border-t border-slate-200">
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`w-full inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                        bg-slate-100 text-slate-700 hover:bg-slate-200 ring-1 ring-slate-200 transition-colors disabled:opacity-50 ${
                          collapsed ? "justify-center" : "justify-center"
                        }`}
            title={collapsed ? "Salir" : ""}
          >
            <LogOut size={16} />
            {!collapsed && <span>Salir</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {/* Pon aquí tus secciones reales (dejamos placeholders) */}
        {active === "home" && (
          <Section title="Inicio" hint="Resumen general">
            <EmptyCopy text="Aquí mostraremos métricas globales cuando conectemos datos." />
          </Section>
        )}
        {active === "calandrias" && (
          <Section title="Calandrias" hint="Registro y monitoreo">
            <EmptyCopy text="Próximo paso: formulario de ingreso y tabla en tiempo real." />
          </Section>
        )}
        {active === "summary" && (
          <Section title="Summary" hint="Consolidado general">
            <EmptyCopy text="Aquí verás totales y comparativas por áreas." />
          </Section>
        )}
      </main>
    </div>
  );
}

/* ---------- Helpers UI ---------- */

function SideItem({
  icon: Icon,
  label,
  active,
  onClick,
  collapsed,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition
      ${active ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
      title={collapsed ? label : ""}
    >
      <Icon size={17} className={active ? "opacity-100" : "opacity-90"} />
      {!collapsed && <span className="truncate">{label}</span>}
      {active && (
        <motion.span
          layoutId="side-pill"
          className="absolute left-0 top-0 h-full w-1 rounded-r bg-blue-500"
        />
      )}
    </button>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
      <div className="mb-2">
        <h1 className="text-[22px] font-bold text-slate-900">{title}</h1>
        {hint && <p className="text-sm text-slate-500">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function EmptyCopy({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 bg-slate-50/60">
      {text}
    </div>
  );
}
