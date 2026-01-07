type CircleProps = {
  text: string,
  index: number,
  css: ''
}

export default function CircleWithInitial({text, index, css=''}: CircleProps) {
    function bgColor() {
        const colorsClasses = ['bg-violet-700', 'bg-indigo-700', 'bg-blue-700', 'bg-cyan-700', 'bg-lime-700', 'bg-orange-700', 'bg-rose-700']
        return colorsClasses[index % colorsClasses.length]
      }

  return (
    <div className={`w-full aspect-square rounded-[50%] flex justify-center items-center text-white text-heading-100 capitalize bg-blue-700 font-semibold ${bgColor()} ${css}`}>
        {text[0]}
    </div>
  )
}
