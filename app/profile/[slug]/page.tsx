"use client";
import Avatar from '@/components/Avatar';
import { MyInput, MyLabel } from '@/components/NewTask';
import { Database } from '@/lib/database.types';
import { useAppDispatch } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { addNotification } from '@/store/slices/notificationSlice';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react'
import { FaPlus, FaUserMinus } from 'react-icons/fa';
import { FaArrowRightFromBracket } from 'react-icons/fa6';

export default function Page({ params }: {
  params: {
    slug: string
  }
}) {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.user);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [full_name, setFull_name] = useState<string>("");
  const [avatar_url, setAvatarUrl] = useState<string>("");
  const [popUp, setPopUp] = useState<boolean>(false);
  const [inviteContent, setInviteContent] = useState<string>("");
  const [projectData, setProjectData] = useState<{
    project_id: number,
    project_name: string
  }>({
    project_id: 0,
    project_name: ""
  });
  const [stats, setStats] = useState<{
    completed_tasks: number,
    projects_joined: number,
    reports_written: number
  }>({
    completed_tasks: 0,
    projects_joined: 0,
    reports_written: 0
  });

  const supabase = createClientComponentClient<Database>();
  useEffect(() => {
    const getProfile = async () => {
      if (!loading) return;

      const res = await fetch(`${location.origin}/profile/api?profile=${params.slug}`, {
        method: "get"
      });

      const { data, error }: GetSupaBaseResSingle<ForeignUser> = await res.json();

      if (error) {
        console.log(error);
      } else {
        setUsername(data.username);
        setFull_name(data.full_name);
        setAvatarUrl(data.avatar_url);
        setStats({
          completed_tasks: data.completed_tasks.length,
          projects_joined: data.projects_joined.length,
          reports_written: data.reports_written.length
        })
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

  const sendInvite = async () => {
    setLoading(true);

    if (projectData.project_id === 0 || !projectData.project_name || !inviteContent) {
      dispatch(addNotification({
        content: "Vui lòng chọn dự án!",
        type: "error"
      }));
      return;
    }

    const res = await fetch(`${location.origin}/notifications/api`, {
      method: "post",
      body: JSON.stringify({
        inviteContent,
        profile_id: params.slug,
        title: "Mời tham gia"
      })
    });

    const { error }: PostSupaBaseRes<ServerNotification> = await res.json();

    if (error) {
      console.log(error);
      dispatch(addNotification({
        content: "Có lỗi khi gửi lời mời",
        type: "error"
      }));
      return;
    }

    setPopUp(false);

    setProjectData({
      project_id: 0,
      project_name: ""
    });

    setLoading(false);

    dispatch(addNotification({
      content: "Gửi lời mời thành công",
      type: "success"
    }));
  }

  useEffect(() => {
    if (userData && projectData.project_name) {
      setInviteContent(`${userData.username} mời bạn tham gia dự án "${projectData.project_name}". Mã dự án: ${projectData.project_id}`);
    }
  }, [projectData, userData])

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      updateProfile(e);
    }}
      className="sm:p-4 p-1 flex gap-2 flex-wrap"
    >
      {
        (popUp && userData) &&
        <section className="fixed z-20 top-0 left-0 w-[100vw] h-[100vh] bg-slate-950/[.5]"
          onClick={(e) => {
            setPopUp(false);
            setProjectData({
              project_id: 0,
              project_name: ""
            });
          }}
        >
          <article className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:w-full w-[90vw] max-w-[400px] sm:p-10 p-4 flex flex-col gap-3 bg-slate-100 shadow-xl rounded-md"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setPopUp(false);
                setProjectData({
                  project_id: 0,
                  project_name: ""
                });
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h1 className="text-xl w-max mx-auto font-bold">Lời mời</h1>
            <div className="flex gap-3 items-center">
              <MyLabel
                content="Trạng thái: "
                for="status"
              />
              <select name="status" id="status"
                className="sm:h-[40px] max-w-[300px] w-[60vw] sm:py-2 sm:px-3 py-1 px-2 border-[3px] border-solid border-slate-950 rounded-md sm:text-base text-sm outline-none font-medium"
                onChange={(e) => {
                  if (parseInt(e.target.value) > 0) {
                    setProjectData(prev => ({
                      project_id: parseInt(e.target.value),
                      project_name: e.target.options[e.target.selectedIndex].text
                    }));
                  } else {
                    setProjectData(prev => ({
                      project_id: 0,
                      project_name: ""
                    }));
                  }
                }}
                value={projectData.project_id}
              >
                <option value="0">Chọn dự án</option>
                {userData.projects.map(project => {
                  return <option key={project.project_id} value={project.project_id}>{project.project_name}</option>
                })}
              </select>
            </div>
            <div className="flex gap-3 items-start">
              <MyLabel
                content="Lời mời: "
                for="invite_content"
              />
              <textarea
                name="invite_content"
                id="invite_content"
                rows={5}
                className='leading-tight w-full resize-none p-1 border-[3px] border-solid border-slate-950 text-base'
                value={inviteContent}
                readOnly
              ></textarea>
            </div>
            <button
              onClick={() => {
                sendInvite();
              }}
              disabled={loading}
              className="mt-3 py-2 max-w-[400px] mx-auto px-4 bg-slate-950 hover:bg-primary hover:text-slate-950 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
              <div className="flex gap-2 items-center w-max mx-auto">
                <FaPlus /> {loading ? 'Đang gửi ...' : 'Gửi lời mời'}
              </div>
            </button>
            <button
              onClick={() => {
                setPopUp(false);
                setProjectData({
                  project_id: 0,
                  project_name: ""
                });
              }}
              className="py-2 max-w-[400px] mx-auto px-4 bg-red-600 hover:bg-red-500 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
              <div className="flex gap-2 items-center w-max mx-auto">
                <FaArrowRightFromBracket /> Quay lại
              </div>
            </button>
          </article>
        </section>}
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

        {userData?.profile_id === params.slug ?
          <button className="p-2 bg-primary text-slate-950 rounded font-bold" type="submit" disabled={loading}>
            {loading ? 'Đang tải ...' : 'Cập nhật'}
          </button> :
          <button type="button" onClick={() => {setPopUp(true)}} className="p-2 bg-primary text-slate-950 rounded font-bold" disabled={loading}>
            Mời tham gia
          </button>
        }
      </section>

      <section className='flex gap-2 flex-shrink-0 mt-10'>
        <article className='p-4 w-[25vw] min-w-[80px] rounded flex flex-col gap-3 text-center shadow-lg items-center flex-shrink-0'>
          <h1 className='font-bold lg:text-3xl sm:text-2xl text-xl text-green-600'>Đã xong</h1>
          <p className='lg:text-2xl sm:text-lg text-blue-600'>{stats.completed_tasks}</p>
          <p className='lg:text-2xl sm:text-lg font-bold'>Công việc</p>
        </article>
        <article className='p-4 w-[25vw] min-w-[80px] rounded flex flex-col gap-3 text-center shadow-lg items-center flex-shrink-0'>
          <h1 className='font-bold lg:text-3xl sm:text-2xl text-xl text-green-600'>Tham gia</h1>
          <p className='lg:text-2xl sm:text-lg text-blue-600'>{stats.projects_joined}</p>
          <p className='lg:text-2xl sm:text-lg font-bold'>Dự án</p>
        </article>
        <article className='p-4 w-[25vw] min-w-[80px] rounded flex flex-col gap-3 text-center shadow-lg items-center flex-shrink-0'>
          <h1 className='font-bold lg:text-3xl sm:text-2xl text-xl text-green-600'>Đã viết</h1>
          <p className='lg:text-2xl sm:text-lg text-blue-600'>{stats.reports_written}</p>
          <p className='lg:text-2xl sm:text-lg font-bold'>Báo cáo</p>
        </article>
      </section>
    </form>
  )
}