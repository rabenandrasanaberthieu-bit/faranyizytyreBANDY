import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/authContext"
import { AxiosInitializer } from "@/components/axios-initializer"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Computer Store - Gestion de Magasin",
  description: "Application de gestion pour magasin de matériel informatique",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} dark`}>
      <body className="antialiased">
        <AuthProvider>
          <AxiosInitializer />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
