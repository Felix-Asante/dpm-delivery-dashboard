import { Package, Truck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Delivery workflow",
    description: "Manage assigned work from pickup through completion.",
  },
  {
    icon: Package,
    title: "Order visibility",
    description: "Live status updates from pickup through delivery.",
  },
];

export function BrandLogo({ light = false }: Readonly<{ light?: boolean }>) {
  return (
    <div
      className={
        light
          ? "text-2xl font-bold uppercase tracking-tight text-white"
          : "text-2xl font-bold uppercase tracking-tight text-secondary"
      }
    >
      Dpm <span className="text-primary">delivery</span>
    </div>
  );
}

export default function LoginBrandPanel() {
  return (
    <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-secondary px-12 py-10 xl:px-16 xl:py-14">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 800 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g className="stroke-white/6" strokeWidth="2">
          <path d="M-80 120C90 180 170 120 315 175S570 320 890 205" />
          <path d="M-50 330C135 250 245 300 375 390S630 510 860 420" />
          <path d="M-65 650C100 570 225 625 340 705S620 830 865 720" />
          <path d="M90-60C140 145 70 275 165 445S275 735 205 1060" />
          <path d="M385-70C320 135 405 260 360 455S410 770 500 1060" />
          <path d="M690-45C600 160 665 320 590 495S625 790 720 1050" />
        </g>

        <g className="stroke-white/4" strokeWidth="1">
          <path d="M-50 235L850 850" />
          <path d="M-90 805L830 120" />
          <path d="M-40 510L840 580" />
          <path d="M260-40L40 1040" />
          <path d="M565-50L790 1040" />
        </g>

        <path
          d="M95 790C180 730 200 620 285 585S430 570 485 475 560 300 700 245"
          className="stroke-primary/55"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="8 10"
        />
        <circle
          cx="95"
          cy="790"
          r="10"
          className="fill-secondary stroke-primary"
          strokeWidth="4"
        />
        <circle
          cx="700"
          cy="245"
          r="10"
          className="fill-primary stroke-secondary"
          strokeWidth="4"
        />
        <circle cx="285" cy="585" r="4" className="fill-primary/70" />
        <circle cx="485" cy="475" r="4" className="fill-primary/70" />
      </svg>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-secondary/10 via-secondary/35 to-secondary/80"
      />

      <div className="relative z-10">
        <BrandLogo light />
      </div>

      <div className="relative z-10 max-w-lg space-y-10">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Delivery operations
          </p>
          <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] text-white">
            Run deliveries with clarity and control.
          </h1>
          <p className="text-base leading-relaxed text-white/70">
            One secure workspace for administrators and riders to coordinate
            work, track progress, and keep deliveries moving.
          </p>
        </div>

        <ul className="space-y-5">
          {features.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary ring-1 ring-white/10">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-white/60">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 text-sm text-white/40">
        © {new Date().getFullYear()} DPM Delivery. All rights reserved.
      </p>
    </aside>
  );
}
