import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-stack-md">
      <h1 className="font-display-temp text-headline-lg text-primary">SkyCast</h1>
      <p className="font-body-md text-on-surface-variant">Coming soon</p>
      <Link
        href="/login"
        className="bg-primary text-on-primary font-label-caps text-label-caps px-gutter py-stack-sm rounded-lg hover:bg-primary/90 transition-all"
      >
        Go to Login
      </Link>
    </main>
  );
}
