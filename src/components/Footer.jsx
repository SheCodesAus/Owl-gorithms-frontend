const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-[var(--dividers)] px-8 py-5">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-3">
        <div className="flex flex-row flex-wrap items-center justify-center gap-6">
          <img
            src="/text_logo_dark.png"
            alt="KickIt"
            className="h-7"
          />

          <a
            href="mailto:info@kickit.com"
            className="text-xs font-medium text-[var(--primary-cta)] transition hover:opacity-70"
          >
            info@kickit.com
          </a>
        </div>

        <p className="text-[11px] text-[var(--muted-text)]">
          © {CURRENT_YEAR} Owl-gorithms
        </p>
      </div>
    </footer>
  );
}