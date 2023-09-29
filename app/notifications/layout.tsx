import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thông báo',
  description: 'Đọc các thông báo!',
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
