type CircleProps = {
  text: string,
  index: number | undefined,
  css: string
}

export default function CircleWithInitial({text, index, css=''}: CircleProps) {
    function bgColor() {
      const colorsClasses = [
        'bg-violet-800',
        'bg-indigo-800',
        'bg-blue-800',
        'bg-cyan-800',
        'bg-emerald-800',
        'bg-orange-800',
        'bg-rose-800',
      ]
        return index === undefined ? 'bg-gray-100 ' : colorsClasses[index % colorsClasses.length]
      }

  return (
    <div className={`w-[2.4em] aspect-square rounded-[50%] flex justify-center items-center text-white bg-bg-200 capitalize  font-semibold ${css} ${index != undefined ? bgColor() : ''} `}>
        {text[0]}
    </div>
  )
}
