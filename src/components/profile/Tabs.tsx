import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FingerPrintIcon, UserIcon } from '@heroicons/react/20/solid';

const tabs = [
  { name: 'Mi Cuenta', href: '/profile', icon: UserIcon },
  { name: 'Cambiar Password', href: '/profile/password', icon: FingerPrintIcon },
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
      {/* Mobile Select */}
      <div className='sm:hidden relative'>
        <label htmlFor='tabs' className='sr-only'>
          Select a tab
        </label>
        <div className='relative'>
          <select
            id='tabs'
            name='tabs'
            className='block w-full appearance-none rounded-md border border-gray-300 bg-gray-100 py-2 pl-3 pr-10 text-gray-700 shadow-sm focus:border-purple-800 focus:ring-2 focus:ring-purple-800'
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => navigate(e.target.value)}
            value={currentTab}
          >
            {tabs.map((tab) => (
              <option value={tab.href} key={tab.name} className='py-2 px-4'>
                {tab.name}
              </option>
            ))}
          </select>

          {/* Check Icon */}
          <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
            {currentTab === '/profile' ? (
              <UserIcon className='h-5 w-5 text-purple-800' />
            ) : (
              <FingerPrintIcon className='h-5 w-5 text-purple-800' />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className='hidden sm:block'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.href}
                className={classNames(
                  location.pathname === tab.href
                    ? 'border-purple-800 text-purple-800'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
                )}
              >
                <tab.icon
                  className={classNames(
                    location.pathname === tab.href
                      ? 'text-purple-800'
                      : 'text-gray-400 group-hover:text-gray-500',
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
