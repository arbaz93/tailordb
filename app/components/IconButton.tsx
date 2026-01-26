type IconButtonCallbackArgs = {
  event: React.MouseEvent<HTMLButtonElement>
}

type IconButtonProps = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  css?: string
  callback?: (args: IconButtonCallbackArgs) => void
}

export default function IconButton({ icon: Icon, css, callback }: IconButtonProps) {
  return (
    <button
      className={`bg-primary rounded-3xl w-16.25 h-11.5 flex justify-center items-center ${css}`}
      onClick={(event) => callback?.({ event })}
    >
      <Icon className="w-6.5 fill-clr-200 " />
    </button>
  )
}
