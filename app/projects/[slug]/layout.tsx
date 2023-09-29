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

  const {data} = await supabase.from("projects")
  .select(`name`)
  .eq('project_id', parseInt(params.slug))
  .single();

  return {
    title: 'Dự án ' + data?.name,
    description: 'Các công việc của dự án ' + data?.name,
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
