type CircleProps = {
  text: string,
  index: number | undefined,
  css: string
}

export default function CircleWithInitial({text, index, css=''}: CircleProps) {
    function bgColor() {
        const colorsClasses = ['bg-violet-700', 'bg-indigo-700', 'bg-blue-700', 'bg-cyan-700', 'bg-lime-700', 'bg-orange-700', 'bg-rose-700']
        return index === undefined ? 'bg-gray-100 ' : colorsClasses[index % colorsClasses.length]
      }

  return (
    <div className={`w-full aspect-square rounded-[50%] flex justify-center items-center text-white text-heading-100 bg-bg-200 capitalize  font-semibold ${css} ${index != undefined ? bgColor() : ''} `}>
        {text[0]}
    </div>
  )
}
