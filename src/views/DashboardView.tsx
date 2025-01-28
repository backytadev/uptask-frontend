import { Link } from 'react-router-dom';

export default function DashboardView() {
  return (
    <>
      <h1 className='text-5xl font-black'>Mis Proyectos</h1>
      <p className='text-2xl font-light text-gray-500'>Maneja y administra tus proyectos</p>

      <nav className='my-5'>
        <Link
          to='/projects/create'
          className='bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors'
        >
          Nuevo Proyecto
        </Link>
      </nav>
    </>
  );
}
