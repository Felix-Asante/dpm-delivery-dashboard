import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#ff7043",
				},
				acsend: {
					DEFAULT: "#2E66F6",
				},
				black: {
					DEFAULT: "#263238",
				},
				grey: {
					DEFAULT: "#78889B",
					100: "#f8f9fb",
					200: "#eaeef5",
				},
			},
		},
	},
	plugins: [
		nextui({
			defaultTheme: "light",
			defaultExtendTheme: "light",
			themes: {},
		}),
	],
};
export default config;
