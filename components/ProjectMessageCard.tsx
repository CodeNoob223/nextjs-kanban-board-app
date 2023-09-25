import SmallUserAvatar from "./SmallUserAvatar"

interface MessageCard extends ChatMessage {
  own: boolean
}

export default function ProjectMessageCard(props: MessageCard): JSX.Element {

  return <article className={`w-max ${props.own ? "ml-auto text-right" : ""} flex-shrink-0`}>
    <div className={`flex gap-1 items-center ${props.own ? "flex-row-reverse" : ""}`}>
      <h1 className="text-sm font-bold">
        {props.profiles.username}
      </h1>
      <span className="font-normal text-xs text-slate-600">{new Date(props.created_at).toLocaleTimeString()}</span>
    </div>
    <div className={`flex items-start gap-1 ${props.own ? "flex-row-reverse" : ""}`}>
      <SmallUserAvatar
        url={props.profiles.avatar_url}
      />
      <p className={`p-2 ${props.own ? "bg-blue-600" : "bg-slate-500"} w-max sm:max-w-[400px] max-w-[250px] rounded-b-lg text-slate-100 ${props.own ? "ml-auto rounded-l-lg" : "rounded-r-lg"}`}>
        {props.content}
      </p>
    </div>
  </article>
}