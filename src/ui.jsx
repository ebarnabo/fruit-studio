import { Check } from "lucide-react";

export function NavBtn({ icon: Icon, label, on, active }) {
  return (
    <button
      onClick={on}
      className={`flex min-w-[72px] flex-col items-center gap-1 rounded-[24px] px-3 py-2 text-[11px] font-bold ${
        active ? "bg-berry text-white" : "text-cream/50"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

export function StatusBadge({ status }) {
  const map = {
    draft: "bg-white/10 text-cream/70",
    ready: "bg-mango/20 text-mango",
    filmed: "bg-berry/20 text-berry",
    shared: "bg-lime/20 text-lime",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${map[status] || map.draft}`}>
      {status}
    </span>
  );
}

export function CheckRow({ done, label, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-4 rounded-[20px] bg-ink/60 p-4 text-left">
      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${done ? "bg-lime text-ink" : "bg-white/8 text-transparent"}`}>
        <Check size={16} />
      </span>
      <span className={`text-sm font-semibold ${done ? "text-cream/50 line-through" : ""}`}>{label}</span>
    </button>
  );
}
