"use client";

import { MyInput, MyLabel } from "./NewTask";

export default function SearchForm(props: {
  placeholder?: string,
  deadlineInput: boolean,
  search: string,
  searchDate: string,
  deadlineStr?: string,
  setSearch: (str: string) => void;
  setSearchDate: (str: string) => void;
  setDeadline?: (str: string) => void;
}): JSX.Element {
  return <form className="p-2 bg-slate-200 w-full rounded flex gap-2 flex-wrap items-center my-3"
    style={{
      maxWidth: props.deadlineInput ? "1000px" : "528px"
    }}
  >
    <MyLabel
      for="search"
      content="Tìm: "
    />
    <MyInput
      id="search"
      name="search"
      onChange={(e) => {
        props.setSearch(e.target.value);
      }}
      type="text"
      value={props.search}
      placeholder={props.placeholder || "Nội dung"}
    />
    <MyInput
      id="created_at"
      name="created_at"
      onChange={(e) => {
        props.setSearchDate(e.target.value)
      }}
      type="month"
      value={props.searchDate}
      placeholder="Thời gian"
    />
    {
      props.deadlineInput &&
      <div className="flex gap-2 flex-wrap items-center">
        <MyLabel
          for="deadline_search"
          content="Hạn: "
        />
        <MyInput
          id="deadline_search"
          name="deadline_search"
          onChange={(e) => {
            if (props.setDeadline) {
              props.setDeadline(e.target.value)
            }
          }}
          type="month"
          value={props.deadlineStr || ""}
          placeholder="Hạn"
        />
      </div>
    }
  </form>
}