import Link from "next/link";

const actions = [
  {
    id: "fab-register",
    label: "Register",
    href: "/register",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth={2}>
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M16 3l5 5-9 9H7v-5l9-9z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    primary: true,
  },
  {
    id: "fab-discord",
    label: "Discord",
    href: "https://discord.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.115 18.1.136 18.113a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    ),
    external: true,
  },
  {
    id: "fab-instagram",
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    external: true,
  },
  {
    id: "fab-email",
    label: "Email",
    href: "mailto:hello@incuxai.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth={1.5}>
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function FloatingActions() {
  return (
    <div className="fixed right-5 bottom-6 z-50 flex flex-col gap-2.5 items-end">
      {actions.map((action) => {
        const Wrapper = action.external || action.href.startsWith("mailto") ? "a" : Link;
        const wrapperProps = action.external ? { href: action.href, target: "_blank", rel: "noreferrer" } : { href: action.href };

        return (
          <div key={action.id} className="group flex items-center gap-2">
            {/* Tooltip */}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-white/70 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/10 whitespace-nowrap">
              {action.label}
            </span>

            {/* @ts-ignore */}
            <Wrapper {...wrapperProps}>
              <button
                id={action.id}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  action.primary
                    ? "cyber-btn !p-0 !rounded-xl shadow-glow"
                    : "glass-card border border-white/10 text-white/60 hover:text-primary hover:border-primary/30 hover:shadow-glow-sm"
                }`}
              >
                {action.icon}
              </button>
            </Wrapper>
          </div>
        );
      })}
    </div>
  );
}
