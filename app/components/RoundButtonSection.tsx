import { useState } from 'react';
import RoundButton from './RoundButton'
import { categorieBtns, type CategoryBtn } from '~/utils/constants';

type RoundButtonSectionProps = {
    callback?: (gender:any) => void;
}

export default function RoundButtonSection({ callback }: RoundButtonSectionProps) {
    const [buttons, setButtons] = useState<CategoryBtn[]>(categorieBtns);
    
    function changeActive(text: string) {
        setButtons(prev =>
            prev.map(btn =>
                btn.text === text
                    ? { ...btn, active: true }
                    : { ...btn, active: false }
            )
        );
    }
    return (
    <div className='flex gap-4'>
        {buttons.map(btn => <RoundButton text={btn.text} css={btn.css} active={btn.active} key={btn.text} changeActive={changeActive} callback={callback}/>)}
    </div>
  )
}
