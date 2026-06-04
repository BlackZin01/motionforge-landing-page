import { ReactNode } from "react";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  align?: "left" | "center";
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  align = "center",
}: SectionShellProps) {
  const headerClasses =
    align === "center"
      ? "mx-auto max-w-4xl text-center"
      : "max-w-3xl text-left";

  return (
    <section id={id} className="relative py-20 sm:py-24">
      <div className="container-shell">
        <div className={headerClasses}>
          <div
            className={`relative overflow-hidden rounded-[2rem] border border-white/7 bg-[linear-gradient(180deg,rgba(11,8,20,0.92),rgba(11,8,20,0.44))] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:px-8 ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(159,51,255,0.18),transparent_72%)]" />
            {eyebrow ? (
              <span className="relative mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                {eyebrow}
              </span>
            ) : null}
            <h2 className="relative display-text text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
              {title}
            </h2>
            {description ? (
              <p className="relative mt-4 text-base leading-7 text-muted sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
