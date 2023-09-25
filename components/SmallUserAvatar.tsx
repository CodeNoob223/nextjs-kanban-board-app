export default function SmallUserAvatar({ url }: {
  url: string
}) : JSX.Element {
  return <div
    className="w-[30px] h-[30px] rounded-full"
    style={{
      backgroundImage: `url(${url})`,
      backgroundColor: "whitesmoke",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}
  ></div>
}