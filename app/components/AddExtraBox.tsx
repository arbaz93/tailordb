import { useEffect, useState } from "react";
import Button100 from "./Button100";

type InputType = 
| 'text'
| 'radio'
| 'checkbox'

type AddExtraProps = {
    type: InputType,
    label: string,
    name: string | undefined | null | '',
    css: string,
    group: string
}
type AddExtraBoxProps = {
    modalIsShowing: boolean;
    setModalIsShowing: (value: boolean) => void;
    addLocalExtra: (newExtra: any) => void; // NEW
  };
  
export default function AddExtraBox({
    modalIsShowing,
    setModalIsShowing,
    addLocalExtra
  }: AddExtraBoxProps) {
    const [fields, setFields] = useState<any>({
        type: 'text',
        label: '',
        name: '',
        css: 'h-5 h-5',
        group: ''
    })
    const types = ['text', 'radio', 'checkbox'];
    const randomId = Math.floor(Math.random() * 1000);


    if(!modalIsShowing) return null;

    const addExtra = (obj:any) => {
        const localStorageName = 'tailor-db-extra';
        const arr = JSON.parse(
            window?.localStorage?.getItem(localStorageName) ?? '[]'
        );
        arr.push(fields);
        console.log(arr);

        window?.localStorage?.setItem(localStorageName, JSON.stringify(arr));
    }

    return (
    (<div className='bg-bg-200 fixed left-5 top-1/3 px-6 py-6 w-[90%] rounded-[10px] shadow-2xl'>
        <button className='ml-auto mb-4 text-clr-100 text-text-300 text-right block' onClick={() => setModalIsShowing(false)}>close</button>
        <div className="flex flex-col gap-4">
            <label htmlFor={`${randomId}`} className="text-text-300 text-clr-100 mb-2">
                <p>type:</p>
                <select className="outline-none m-0 p-0 border-b-2 border-clr-200 text-clr-200 text-text-100 w-full" value={fields?.type} onChange={(e) => setFields((prev:any) => ({...prev, type: e.target.value}))}>
                    {types.map((t,i) => <option className="bg-bg-100 rouded-lg text-text-100" key={i}>{t}</option>)}
                </select>
            </label>
            <label htmlFor={`${randomId}label`} className="text-text-300 text-clr-100 mb-2">
                <p>label</p>
                <input id={`${randomId}label`} value={fields?.label} className="bg-none outline-none  border-b-2 border-clr-200 text-clr-200 text-text-100 w-full" type="text" onChange={(e) => setFields((prev:any) => ({...prev, label: e.target.value}))} />
                {/* <input id={`${randomId}label`} value={fields?.label} className="bg-none outline-none  border-b-2 border-clr-200 text-clr-200 text-text-100 w-full" type="text" onChange={(e) => setFields((prev) => console.log(e.currentTarget?.value))}/> */}
            </label>
            {(fields?.type === 'radio' && (
                <label htmlFor={`${randomId}name`} className="text-text-300 text-clr-100 mb-2">
                    <p>group</p>
                    <input id={`${randomId}name`} value={fields?.name} className="bg-none outline-none border-b-2 border-clr-200 text-clr-200 text-text-100 w-full" type="text" onChange={(e) => setFields((prev:any) => ({...prev, name: e.target.value, group: e.target.value}))}/>
                </label>
            ))}
        </div>
        <Button100
  text="ADD"
  css="text-clr-100 bg-primary mt-4"
  callback={() => {
    // 1️⃣ Update localStorage
    const localStorageName = 'tailor-db-extra';
    const arr = JSON.parse(window?.localStorage?.getItem(localStorageName) ?? '[]');
    arr.push(fields);
    window?.localStorage?.setItem(localStorageName, JSON.stringify(arr));

    // 2️⃣ Update parent state immediately
    addLocalExtra(fields);

    // 3️⃣ Reset fields
    setFields((prev: any) => ({ ...prev, label: '', name: '' }));
  }}
/>

    </div>)
  )
}
