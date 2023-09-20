"use client";
import { Separator } from "@/components/Sidebar";
import {useState} from "react";
import {FaUser, FaUsers, FaPlus, FaBell} from "react-icons/fa";

export default function Home() {
  const [content, setContent] = useState<string>("");
  return (
    <main className="p-2">
      <h1 className="text-4xl font-bold mb-3">Phần mềm quản lý công việc</h1>
      <Separator />
      <h2 className="text-xl font-medium my-3">Vui lòng đăng nhập trước khi sử dụng</h2>
      <Separator />
      <section className="flex flex-col gap-3 text-lg mt-3">
        <p>
          Nhấn vào <FaUser className="inline bg-primary" /> để xem công việc cá nhân
        </p>
        {/* <p>
          Nhấn vào <FaBell className="inline bg-primary" /> để xem thông báo
        </p> */}
        <p>
          Nhấn vào <FaUsers className="inline bg-primary" /> để xem công việc nhóm
        </p>
        <p>
          Nhấn vào <FaPlus className="inline bg-primary" /> để thêm hoặc tạo nhóm
        </p>
      </section>
    </main>
  )
}
