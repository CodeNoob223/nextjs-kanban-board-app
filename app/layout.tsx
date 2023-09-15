import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from "next";
import { AuthProvider } from '@/components/AuthProvider';
import SSRNotification from '@/components/CSRNotification';

export const metadata: Metadata = {
  title: 'Todos',
  description: 'Quản lý công việc hiệu quả!',
  icons: "/images/logo_black.png"
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={"font-body bg-slate-50"}>
        <AuthProvider>
          <Navbar />
          <div className="w-full h-[53px] bg-transparent"></div>
          <SSRNotification />
          {children}
        </AuthProvider>
      </body>
    </html >
  )
}
