import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FingerPrintIcon, UserIcon } from '@heroicons/react/20/solid';

const tabs = [
  { name: 'Mi Cuenta', href: '/profile', icon: UserIcon },
  { name: 'Cambiar Contraseña', href: '/profile/password', icon: FingerPrintIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Tabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = tabs.filter((tab) => tab.href === location.pathname)[0].href;

  return (
    <div className='mb-10'>
      <div className='sm:hidden relative'>
        <label htmlFor='tabs' className='sr-only'>
          Selecciona una pestaña
        </label>
        <div className='relative'>
          <select
            id='tabs'
            name='tabs'
            className='block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 py-3 pl-4 pr-12 text-gray-700 shadow-sm focus:border-fuchsia-700 focus:ring-1 focus:ring-fuchsia-700 focus:outline-none focus-visible:ring-fuchsia-700 transition-all'
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => navigate(e.target.value)}
            value={currentTab}
          >
            {tabs.map((tab) => (
              <option key={tab.name} value={tab.href} className='py-2 px-4'>
                {tab.name}
              </option>
            ))}
          </select>

          <div className='pointer-events-none absolute inset-y-0 right-4 flex items-center'>
            {currentTab === '/profile' ? (
              <UserIcon className='h-6 w-6 text-fuchsia-700 transition-all' />
            ) : (
              <FingerPrintIcon className='h-6 w-6 text-fuchsia-700 transition-all' />
            )}
          </div>
        </div>
      </div>

      <div className='hidden sm:block'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.href}
                className={classNames(
                  location.pathname === tab.href
                    ? 'border-fuchsia-700 text-fuchsia-700'
                    : 'border-transparent text-gray-500 hover:border-gray-400 hover:text-gray-700',
                  'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-all'
                )}
                aria-current={location.pathname === tab.href ? 'page' : undefined}
              >
                <tab.icon
                  className={classNames(
                    location.pathname === tab.href
                      ? 'text-fuchsia-700'
                      : 'text-gray-400 group-hover:text-gray-500 transition-all',
                    '-ml-0.5 mr-2 h-5 w-5'
                  )}
                  aria-hidden='true'
                />
                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
