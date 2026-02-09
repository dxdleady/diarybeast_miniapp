import Image from "next/image";

export function Header() {
  return (
    <header className="flex items-center px-5 py-2">
      <Image
        src="/logo.png"
        alt="DiaryBeast"
        width={60}
        height={60}
        className="object-contain"
      />
      <span className="text-xl font-bold font-[family-name:var(--font-chakra)] text-[var(--color-primary)]">
        DiaryBeast
      </span>
    </header>
  );
}

export function Footer() {
  return (
    <footer style={{ margin: 12 }} className="flex justify-end">
      <a
        href="https://x.com/_DiaryBeast"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-white transition-colors text-xs"
      >
        <span>Follow us on</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
    </footer>
  );
}
