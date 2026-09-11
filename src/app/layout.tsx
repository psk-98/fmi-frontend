import type { Metadata } from "next";

import { MotionProvider } from "@/components/layout/motion-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getCurrentUser } from "@/lib/server-api";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FMI — Face-first image discovery",
    template: "%s — FMI",
  },
  description:
    "Upload, process, organize, and search every face across your image galleries.",
};

const themeBootScript = `(() => {
  try {
    const stored = localStorage.getItem("fmi-theme");
    const theme = stored === "light" || stored === "dark" ? stored : "system";
    const isDark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.dataset.theme = theme;
    root.style.colorScheme = isDark ? "dark" : "light";
  } catch {}
})();`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: This constant, user-input-free script applies the saved theme before first paint. */}
				<script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <ThemeProvider>
          <MotionProvider>
            <SiteHeader user={user} />
            <main>{children}</main>
            <SiteFooter />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
