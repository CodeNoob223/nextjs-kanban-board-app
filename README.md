## Green kaban board

- Allow users to manage projects with tasks, reports, chat.
- Have drag and drop implemented.

## Technologies

- Languagues: HTML, CSS, JavaScript, Typescript
- Frontend: NextJs, TailwindCSS
- Backend: [Supabase](https://supabase.com/)
- Libraries: Redux, React beautiful DnD, React icons

## Installation:

1. Create a `.env.local` in the root directory
2. Fill in the following

```
SUPA_BASE_PASSWORD=GetInSupabaseDashboard

AUTH_SECRET=WhatEverYouChoose
NEXT_PUBLIC_SUPABASE_URL=GetInSupabaseDashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY=GetInSupabaseDashboard
SUPABASE_SERVICE_ROLE_KEY=GetInSupabaseDashboard
```
## Start developing:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Demo on Vercel

> https://greenkanban.vercel.app/

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
