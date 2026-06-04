import { siteData } from "@/lib/site";

export function CredibilityStrip() {
  return (
    <section className="border-y border-white/8 bg-white/[0.02] py-4">
      <div className="container-shell">
        <div className="grid gap-3 text-sm text-muted md:grid-cols-2 xl:grid-cols-4">
          {siteData.credibility.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
