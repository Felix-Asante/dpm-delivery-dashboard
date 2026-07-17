import GuestGuards from "@/guards/GuestGuards";
import LoginBrandPanel, { BrandLogo } from "./LoginBrandPanel";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <GuestGuards>
      <div className="min-h-screen grid lg:grid-cols-2 bg-white">
        <LoginBrandPanel />

        <div className="relative flex min-h-screen flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 lg:hidden bg-gradient-to-b from-secondary/5 via-white to-white"
          />

          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="mb-8 lg:hidden">
              <BrandLogo />
            </div>
            <div className="relative pt-8">
              <span
                aria-hidden
                className="lg:hidden absolute left-0 top-0 h-1 w-12 rounded-full bg-primary"
              />
              <LoginForm />
            </div>
          </div>

          <p className="relative mt-10 text-center text-xs text-gray-400 lg:hidden">
            © {new Date().getFullYear()} DPM Delivery
          </p>
        </div>
      </div>
    </GuestGuards>
  );
}
