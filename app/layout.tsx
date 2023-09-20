import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from "next";
import { AuthProvider } from '@/components/AuthProvider';
import SSRNotification from '@/components/CSRNotification';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Todos',
  description: 'Quản lý công việc hiệu quả!',
  icons: "/images/logo_black.png",
  viewport: "width=device-width, initial-scale=1.0", 
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
          <div className="w-full h-[60px] bg-red-600"></div>
          <SSRNotification />
          <div className='flex w-full h-full'>
            <Sidebar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html >
  )
}
