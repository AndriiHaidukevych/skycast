import { GoogleSignInButton } from "./components";

export function LoginScreen() {
  return (
    <main className="min-h-screen flex items-center justify-center px-container-padding-mobile relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "radial-gradient(circle at 30% 20%, #1e3a8a 0%, #0b1326 60%)",
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(164, 201, 255, 0.15) 0%, rgba(164, 201, 255, 0) 70%)",
        }}
      />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-stack-lg">
          <h1 className="font-display-temp text-headline-lg text-primary tracking-tight">
            SkyCast
          </h1>
          <p className="font-body-md text-on-surface-variant mt-2">
            Atmospheric insights, personalized for you
          </p>
        </div>

        {/* Auth card */}
        <div className="glass-card rounded-xl p-stack-md space-y-stack-md">
          <div className="text-center">
            <h2 className="font-headline-md text-headline-md mb-2">Welcome</h2>
            <p className="font-body-md text-on-surface-variant text-sm">
              Sign in to save your favorite cities and get personalized recommendations.
            </p>
          </div>

          {/* Google OAuth */}
          <GoogleSignInButton />
        </div>

        {/* Footer */}
        <p className="text-center font-label-caps text-label-caps text-on-surface-variant mt-stack-md">
          Weather data sourced from OpenWeather
        </p>
      </div>
    </main>
  );
}
