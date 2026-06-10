import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{
        background: "#0D0D0D",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }}
    >
      {/* Spotlight laranja canto superior direito */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 100% 0%, rgba(255,77,0,0.07), transparent)",
        }}
      />

      {/* Logo centralizado linkando para home */}
      <Link href="/" className="relative mb-10 block">
        <Logo size="nav" />
      </Link>

      {/* Conteúdo das páginas de auth */}
      <div className="relative w-full max-w-[440px]">{children}</div>
    </div>
  )
}
