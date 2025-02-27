import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Logo from '@/components/Logo';

export default function AuthLayout() {
  return (
    <>
      <div className='bg-slate-900 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-slate-900 p-0 sm:p-6 md:p-10 rounded-lg'>
          <div className='flex justify-center'>
            <Logo />
          </div>
          <div className='mt-8 sm:mt-10'>
            <Outlet />
          </div>
        </div>
      </div>

      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  );
}
