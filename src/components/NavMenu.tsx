import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { User } from '@/types';
import {
  Bars3Icon,
  UserIcon,
  FolderIcon,
  ArrowLeftEndOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Popover, PopoverPanel, PopoverButton, Transition } from '@headlessui/react';

type NavMenuProps = {
  name: User['name'];
};
export default function NavMenu({ name }: NavMenuProps) {
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem('AUTH_TOKEN');
    queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  return (
    <Popover className='relative z-20'>
      <PopoverButton className='cursor-pointer inline-flex items-center gap-x-2 text-sm font-semibold p-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-300'>
        <Bars3Icon className='w-8 h-8 text-white' />
      </PopoverButton>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 translate-y-1'
        enterTo='opacity-100 translate-y-0'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100 translate-y-0'
        leaveTo='opacity-0 translate-y-1'
      >
        <PopoverPanel className='absolute -left-[5.2rem] md:-left-44 md:right-0 mt-3 w-52 sm:w-56 bg-white shadow-lg rounded-lg ring-1 ring-gray-900/10 overflow-hidden'>
          <div className='p-4 text-sm font-medium text-gray-900'>
            <p className='text-center text-gray-700 mb-2'>
              Hola, <span className='font-semibold'>{name}</span>
            </p>
            <hr className='border-gray-200 mb-2' />

            <Link
              to='/profile'
              className='flex items-center gap-2 px-4 py-2 rounded-md hover:bg-purple-50 transition'
            >
              <UserIcon className='w-5 h-5 text-purple-600' />
              Mi Perfil
            </Link>

            <Link
              to='/'
              className='flex items-center gap-2 px-4 py-2 rounded-md hover:bg-purple-50 transition'
            >
              <FolderIcon className='w-5 h-5 text-purple-600' />
              Mis Proyectos
            </Link>

            <button
              className='flex items-center gap-2 w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition cursor-pointer'
              type='button'
              onClick={logout}
            >
              <ArrowLeftEndOnRectangleIcon className='w-5 h-5 text-red-600' />
              Cerrar Sesión
            </button>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
