import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng ký',
  description: 'Tạo tài khoản!',
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
