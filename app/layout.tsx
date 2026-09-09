import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google"

import "./globals.css"
import { Providers } from "@/components/providers"
import { cn } from "cn"

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" })

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
})

export const metadata = {
  title: "Tripwire — Your Travel Guardian",
  description:
    "We spot flight disruptions before the airline tells you and fix your entire trip automatically. By nan chalants for HackCelestial 3.0.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={cn("antialiased", grotesk.variable, plexMono.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
