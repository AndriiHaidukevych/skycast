export function Footer() {
  return (
    <footer className="bg-surface-container-lowest/80 backdrop-blur-xl border-t border-white/5 flex flex-col md:flex-row justify-between items-center w-full px-container-padding-desktop py-stack-md mt-auto">
      <div className="mb-stack-sm md:mb-0">
        <div className="font-display-temp text-headline-md text-primary">SkyCast</div>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          © 2026 SkyCast. Weather data sourced from OpenWeather.
        </p>
      </div>
      <div className="flex gap-gutter">
        <span className="font-label-caps text-label-caps text-on-surface-variant/40 cursor-not-allowed select-none">
          Privacy Policy
        </span>
        <span className="font-label-caps text-label-caps text-on-surface-variant/40 cursor-not-allowed select-none">
          Terms of Service
        </span>
      </div>
    </footer>
  );
}
