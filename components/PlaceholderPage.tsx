import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  description: string;
  eyebrow?: string;
}

const PlaceholderPage: React.FC<Props> = ({
  title,
  description,
  eyebrow = "Coming soon",
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-theme-primary relative overflow-hidden px-6 pb-12 pt-28 md:px-12 md:pb-16 md:pt-32"
      style={{
        background: "var(--color-background)",
        backgroundColor: "var(--color-background-solid)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(76,114,255,0.12),transparent_42%)] dark:bg-[radial-gradient(circle_at_top,rgba(111,145,255,0.18),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(circle_at_bottom,rgba(200,165,91,0.10),transparent_42%)] dark:bg-[radial-gradient(circle_at_bottom,rgba(76,114,255,0.12),transparent_42%)]" />
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate("/brand-hall")}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-theme-border bg-theme-card px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-theme-secondary transition-colors hover:text-indigo-600"
        >
          <span aria-hidden="true">←</span>
          Back to home
        </button>

        <div
          className="overflow-hidden rounded-[2rem] border shadow-[0_28px_70px_rgba(9,23,74,0.12)] dark:shadow-[0_30px_80px_rgba(4,10,32,0.42)]"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--color-card-background) 96%, white 4%) 0%, var(--color-card-background) 100%)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="bg-[linear-gradient(135deg,rgba(23,64,209,0.14),rgba(255,255,255,0))] px-8 py-10 dark:bg-[linear-gradient(135deg,rgba(110,146,255,0.18),rgba(255,255,255,0))]">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[var(--brand-primary)] dark:text-[#AFC0FF]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-theme-primary">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-theme-secondary">
              {description}
            </p>
          </div>

          <div className="border-t border-theme-border px-8 py-8">
            <div className="rounded-[1.5rem] border border-dashed border-[rgba(23,64,209,0.2)] bg-[rgba(23,64,209,0.04)] px-6 py-6 dark:border-[#3756A6] dark:bg-[#13265B]/40">
              <p className="text-sm font-semibold text-theme-primary">
                This section is now linked correctly and ready for a fuller build.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-theme-secondary">
                We can flesh this out next with real data, actions, and a more complete experience when you’re ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
