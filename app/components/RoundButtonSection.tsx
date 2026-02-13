import { useState } from 'react';
import RoundButton from './RoundButton';
import { categorieBtns, type CategoryBtn } from '~/utils/constants';

type RoundButtonSectionProps = {
  // Optional callback triggered when a button is clicked
  // The clicked button's text is passed to the callback
  callback?: (text: string) => void;
};

export default function RoundButtonSection({ callback }: RoundButtonSectionProps) {
  // Local state to track all buttons and their active status
  const [buttons, setButtons] = useState<CategoryBtn[]>(categorieBtns);

  /**
   * changeActive
   * Updates the buttons state so that only the clicked button becomes active
   * @param text - the text of the button that was clicked
   */
  function changeActive(text: string) {
    setButtons(prev =>
      prev.map(btn =>
        btn.text === text
          ? { ...btn, active: true }  // Set clicked button to active
          : { ...btn, active: false } // All others are inactive
      )
    );
  }

  return (
    <div className='flex gap-4'>
      {buttons.map(btn => (
        // Render each button using the RoundButton component
        <RoundButton
          key={btn.text}            // Unique key for React list rendering
          text={btn.text}           // Text displayed on the button
          css={btn.css}             // Button's styling classes
          active={btn.active}       // Whether this button is active
          changeActive={changeActive} // Function to toggle active state
          callback={callback}       // Optional callback when clicked
        />
      ))}
    </div>
  );
}
