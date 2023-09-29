import { Database } from '@/lib/database.types'
import { createServerComponentClient,  } from '@supabase/auth-helpers-nextjs'
import type { Metadata, ResolvingMetadata } from 'next'
import { cookies } from 'next/headers'

type Props = {
  params: { slug: string }
}

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const supabase= createServerComponentClient<Database>({cookies});

  const {data} = await supabase.from("profiles")
  .select(`username`)
  .eq('profile_id', params.slug)
  .single();

  return {
    title: data?.username + " - Hồ sơ",
    description: data?.username,
    icons: "/images/logo_black.png",
    viewport: "width=device-width, initial-scale=1.0"
  }
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
