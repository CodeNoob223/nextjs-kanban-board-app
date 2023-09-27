import SmallUserAvatar from "./SmallUserAvatar"

interface MessageCard extends ChatMessage {
  own: boolean
}

export default function ProjectMessageCard(props: MessageCard): JSX.Element {

  return <article className={`w-max ${props.own ? "ml-auto text-right" : ""} flex-shrink-0`}>
    <div className={`flex items-start gap-1 ${props.own ? "flex-row-reverse" : ""}`}>
      <SmallUserAvatar
        url={props.profiles.avatar_url}
      />
      <div>
        <div className={`flex gap-1 items-center ${props.own ? "flex-row-reverse" : ""}`}>
          <a href={"/profile/" + props.profiles.profile_id} target="_blank" className="text-sm font-bold hover:text-primary">
            {props.profiles.username}
          </a>
          <span className="font-normal text-xs text-slate-600">
            {
              new Date(Date.now()).toLocaleDateString() === new Date(props.created_at).toLocaleDateString() ?
              new Date(props.created_at).toLocaleTimeString() : new Date(props.created_at).toLocaleDateString()
            }
          </span>
        </div>
        <p className={`p-2 ${props.own ? "bg-blue-600" : "bg-slate-500"} whitespace-pre-wrap w-max sm:max-w-[400px] max-w-[250px] rounded-b-lg text-slate-100 ${props.own ? "ml-auto rounded-l-lg" : "rounded-r-lg"}`}>
          {props.content}
        </p>
      </div>
    </div>
  </article>
}