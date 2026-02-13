import { MoonIcon, SunIcon } from '~/icons/ColorSchemeIcons';
import { InfoIcon } from '~/icons/measurementsIcons';
import { useColorSchemeStore } from '~/zustand/colorSchemeStore';
import { useNotificationStore } from '~/zustand/notificationStore';
import Spinner from './Spinner';

export default function NotificationBox() {
  /* ---------------------------------------- */
  /* ------------ Zustand States ------------ */
  /* ---------------------------------------- */
  const notification = useNotificationStore(state => state.notification);
  const colorScheme = useColorSchemeStore(state => state.colorScheme);
  const setColorScheme = useColorSchemeStore(state => state.setColorScheme);

  /* ---------------------------------------- */
  /* -------------- Constants --------------- */
  /* ---------------------------------------- */
  const DefaultIcon = InfoIcon;

  const statusStyles: Record<
    'success' | 'error' | 'warning' | 'processing',
    string
  > = {
    success: 'bg-green-100 text-green-700 border-green-500 fill-green-700',
    error: 'bg-red-100 text-red-700 border-red-500 fill-red-700',
    warning: 'bg-amber-100 text-amber-700 border-amber-500 fill-amber-700',
    processing: 'bg-blue-100 text-blue-800 border-blue-500 fill-blue-700',
  };

  /* ---------------------------------------- */
  /* ---------------- Render ---------------- */
  /* ---------------------------------------- */
  return (
    <header
      className={`
        h-15 gap-4 w-full flex items-center justify-between px-8 z-50
        duration-200 border-b
        ${statusStyles[notification.type]}
      `}
      style={{
        position: 'fixed',
        top: 0,
        transform: notification.displayModal
          ? 'translateY(0%)'
          : 'translateY(-100%)',
      }}
    >
      {/* Left: Icon + Text */}
      <div className="flex gap-4 justify-center items-center flex-1">
        {notification.type === 'processing' ? (
          <Spinner spin={true} />
        ) : (
          <DefaultIcon className="w-6 fill-clr-100" />
        )}
        <p className="text-inherit font-semibold text-text-200 w-full max-w-full truncate">
          {notification.text}
        </p>
      </div>

      {/* Right: Color Scheme Toggle */}
      <div className="flex gap-4 items-center">
        <button
          type="button"
          onClick={() => setColorScheme(undefined)}
          className="cursor-pointer hover:opacity-80 duration-200"
          aria-label="Toggle Color Scheme"
        >
          {colorScheme === 'light' ? (
            <SunIcon className="w-6 fill-inherit" />
          ) : (
            <MoonIcon className="w-6 fill-inherit" />
          )}
        </button>
      </div>
    </header>
  );
}
