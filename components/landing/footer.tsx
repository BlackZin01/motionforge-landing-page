import { siteData } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-8">
      <div className="container-shell flex flex-col gap-4 text-sm text-muted lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="display-text text-lg font-medium text-white">
            {siteData.footer.label}
          </p>
          <p className="max-w-xl leading-6">{siteData.footer.note}</p>
        </div>
        <p className="text-xs uppercase tracking-[0.18em] text-white/62">
          {siteData.footer.rights}
        </p>
      </div>
    </footer>
  );
}
