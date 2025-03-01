import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Link, Outlet, Navigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

import Logo from '@/components/Logo';
import NavMenu from '@/components/NavMenu';

export default function AppLayout() {
  const { data, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <div className='relative flex items-center justify-center'>
          <div className='animate-spin rounded-full border-4 border-gray-300 border-t-fuchsia-500 h-16 w-16'></div>
          <span className='absolute text-fuchsia-500 font-semibold'>⏳</span>
        </div>
        <p className='mt-4 text-lg font-medium text-gray-600 animate-pulse'>
          Conectando con el servidor...
        </p>
      </div>
    );

  if (!data) {
    return <Navigate to='/auth/login' />;
  }

  if (data)
    return (
      <div className='flex flex-col min-h-screen text-black'>
        <header className='bg-slate-900 py-4 shadow-md'>
          <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center'>
            <div className='w-48 sm:w-48 lg:w-64'>
              <Link to='/'>
                <Logo />
              </Link>
            </div>
            <NavMenu name={data.name} />
          </div>
        </header>

        <section className='flex-1 w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8'>
          <Outlet />
        </section>

        <footer className='bg-slate-900 text-gray-300 py-6 text-center text-sm sm:text-base'>
          <div className='max-w-screen-lg mx-auto px-4 flex flex-col sm:flex-row items-center justify-between'>
            <p className='mb-2 sm:mb-0'>
              &copy; {new Date().getFullYear()} Todos los derechos reservados.
            </p>
            <div className='flex gap-4'>
              <Link to='/' className='hover:text-purple-400 transition'>
                Política de Privacidad
              </Link>
              <Link to='/' className='hover:text-purple-400 transition'>
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </footer>

        <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
      </div>
    );
}
