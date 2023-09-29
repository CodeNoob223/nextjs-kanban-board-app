import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Báo cáo',
  description: 'Đọc các báo cáo của dự án!',
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
