import logo from '../assets/logo-white-black.svg'
import logoBlack from '../assets/logo black.svg'
import { useColorSchemeStore } from '~/zustand/colorSchemeStore'

/**
 * SplashScreen Component
 * Displays a full-screen splash screen with logo and app name.
 * Supports color schemes (dark/light) and optional pulse animation.
 *
 * @param display - whether to show or hide the splash screen
 * @param pulse - whether to apply pulse animation to logo and text
 */
export default function SplashScreen({ display, pulse }: { display: boolean, pulse: boolean }) {
  // Get current color scheme from Zustand store
  const colorScheme = useColorSchemeStore(state => state.colorScheme)

  return (
    <div
      className={`bg-splash-screen fixed inset-0 items-center flex-col z-50 ` +
        (display ? 'flex' : 'hidden')} // show or hide the splash screen
    >
      {/* Logo */}
      <img
        src={colorScheme === 'dark' ? logo : logoBlack} // switch logo based on color scheme
        alt="logo"
        className={
          'w-67.5 mt-[27.73dvh] [animation-duration:3s] ' +
          (pulse && 'animate-pulse') // add pulse animation if pulse is true
        }
      />

      {/* App Name */}
      <h1
        className={
          'text-small-initial ff-montserrat ml-2 text-clr-200/80 [animation-duration:3s] ' +
          (pulse && 'animate-pulse') // add pulse animation if pulse is true
        }
      >
        <span className='text-big-initial font-bold text-primary tracking-tight'>AR</span>
        <span className='tracking-tighter'>TAILORS</span>
      </h1>
    </div>
  )
}
