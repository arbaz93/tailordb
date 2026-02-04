export default function PhantomBox({ numberOfPhantomBoxes, css }: { numberOfPhantomBoxes: number, css: string }) {
  return   <>
  {Array.from({ length: numberOfPhantomBoxes }).map((a,i) => (
    <div key={i} className={'animate-pulse bg-bg-200 rounded-lg overflow-hidden ' + css}>
      
    </div>
  ))}
</>
}
