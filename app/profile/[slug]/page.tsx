"use client";
import Avatar from '@/components/Avatar';
import { MyInput, MyLabel } from '@/components/NewTask';
import { Database } from '@/lib/database.types';
import { useAppSelector } from '@/store/hooks';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react'

export default function Page({ params }: {
  params: {
    slug: string
  }
}) {
  const userData = useAppSelector(state => state.user);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [full_name, setFull_name] = useState<string>("");
  const [avatar_url, setAvatarUrl] = useState<string>("");

  const supabase = createClientComponentClient<Database>();
  useEffect(() => {
    const getProfile = async () => {
      if (!loading) return;

      const res = await fetch(`http://localhost:3000/profile/api?profile=${params.slug}`, {
        method: "get"
      });

      const { data, error }: GetSupaBaseResSingle<ForeignUser> = await res.json();

      if (error) {
        console.log(error);
      } else {
        setUsername(data.username!);
        setFull_name(data.full_name!);
        setAvatarUrl(data.avatar_url!);
      }
      setLoading(false);
    };

    getProfile();
  }, [params, supabase, loading])

  const updateProfile = async (event: React.FormEvent, avatarUrl: string = "") => {
    setLoading(true);

    let { error } = await supabase.from('profiles').upsert({
      profile_id: userData?.profile_id!,
      username: username,
      full_name: full_name,
      avatar_url: avatarUrl || avatar_url,
      updated_at: new Date().toISOString()
    });

    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      updateProfile(e);
    }}
      className="sm:p-4 p-1 flex gap-2 flex-wrap"
    >
      {userData?.profile_id === params.slug ?
        <Avatar
          size={200}
          url={avatar_url}
          onUpload={updateProfile}
          className='w-max rounded border-[3px] border-slate-950 border-solid flex-shrink-0'
        /> : <div className='w-[200px] h-[200px] rounded border-[3px] border-slate-950 border-solid flex-shrink-0'
          style={{
            backgroundImage: `url(${avatar_url})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}></div>
      }

      <section className='bg-slate-100 shadow-lg p-2 flex gap-3 flex-col flex-shrink-0'>
        {userData?.profile_id === params.slug && <div className='flex gap-2 sm:flex-row flex-col items-center'>
          <MyLabel
            for='email'
            content='Email '
          />
          <MyInput
            id="email"
            name='email'
            type="text"
            value={userData.email}
            onChange={() => { }}
            readOnly={true}
          />
        </div>}
        <div className='flex gap-2 sm:flex-row flex-col items-center'>
          <MyLabel
            for='full_name'
            content='Họ & tên '
          />
          <MyInput
            id="full_name"
            name='full_name'
            type="text"
            value={full_name || ''}
            onChange={(e) => setFull_name(e.target.value)}
            disabled={userData?.profile_id !== params.slug}
          />
        </div>

        <div className='flex gap-2 sm:flex-row flex-col items-center'>
          <MyLabel
            for='username'
            content='Biệt danh: '
          />
          <MyInput
            id='username'
            name='username'
            type='text'
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            disabled={userData?.profile_id !== params.slug}
          />
        </div>

        {userData?.profile_id === params.slug &&
          <button className="p-2 bg-primary text-slate-950 rounded font-bold" type="submit" disabled={loading}>
            {loading ? 'Đang tải ...' : 'Cập nhật'}
          </button>
        }
      </section>
      
      <section className='flex gap-2 flex-shrink-0 mt-10'>
        <article className='p-4 w-[25vw] min-w-[80px] rounded flex flex-col gap-3 text-center shadow-lg items-center flex-shrink-0'>
          <h1 className='font-bold lg:text-3xl sm:text-2xl text-xl text-green-600'>Đã xong</h1>
          <p className='lg:text-2xl sm:text-lg text-blue-600'>321</p>
          <p className='lg:text-2xl sm:text-lg font-bold'>Công việc</p>
        </article>
        <article className='p-4 w-[25vw] min-w-[80px] rounded flex flex-col gap-3 text-center shadow-lg items-center flex-shrink-0'>
          <h1 className='font-bold lg:text-3xl sm:text-2xl text-xl text-green-600'>Hoàn thành</h1>
          <p className='lg:text-2xl sm:text-lg text-blue-600'>30</p>
          <p className='lg:text-2xl sm:text-lg font-bold'>Dự án</p>
        </article>
        <article className='p-4 w-[25vw] min-w-[80px] rounded flex flex-col gap-3 text-center shadow-lg items-center flex-shrink-0'>
          <h1 className='font-bold lg:text-3xl sm:text-2xl text-xl text-green-600'>Đã viết</h1>
          <p className='lg:text-2xl sm:text-lg text-blue-600'>3012</p>
          <p className='lg:text-2xl sm:text-lg font-bold'>Báo cáo</p>
        </article>
      </section>
    </form>
  )
}