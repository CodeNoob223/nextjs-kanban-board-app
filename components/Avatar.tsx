/* eslint-disable @next/next/no-img-element */
"use client";
import { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react'

export default function Avatar({ url, size, onUpload, className = "" } : {
  url: string,
  size: number,
  onUpload: (event : React.ChangeEvent<HTMLInputElement>, file: string) => void,
  className: string
}) {
  
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [uploading, setUploading] = useState<boolean>(false)
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (url) setAvatarUrl(url);
  }, [url])


  async function uploadAvatar(event : React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${file.name.split('.')[0].replaceAll(' ','')}${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      let uploadRes = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadRes.error) {
        return console.log(uploadRes.error)
      }

      const {data: {publicUrl: url}} = supabase.storage.from('avatars').getPublicUrl(uploadRes.data.path!);
      onUpload(event, url);
    } catch (error : any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={className}>
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size + "px", width: size + "px"}}
        />
      )}
      <div className='flex' style={{ width: size }}>
        <input
          className=''
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}