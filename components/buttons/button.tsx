export default function Button(props: {
  handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  type: "button" | "submit" | "reset",
  className?: string,
  children: React.ReactNode
}): JSX.Element {
  return <button
    onClick={props.handleClick}
    type={props.type}
    className={`py-2 px-3 rounded-md sm:text-base text-sm ${props.className || ""}`}
  >
    {props.children}
  </button>
}