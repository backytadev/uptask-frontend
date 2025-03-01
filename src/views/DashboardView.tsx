import { Fragment } from 'react';

import { useQuery } from '@tanstack/react-query';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { EyeIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react';

import { useAuth } from '@/hooks/useAuth';
import { isManager } from '@/utils/policies';
import { getProjects } from '@/api/ProjectAPI';

import DeleteProjectModal from '@/components/projects/DeleteProjectModal';

export default function DashboardView() {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: user, isLoading: authLoading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  if ((isLoading && authLoading) || authLoading || isLoading)
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <div className='relative flex items-center justify-center'>
          <div className='animate-spin rounded-full border-4 border-gray-300 border-t-fuchsia-500 h-16 w-16'></div>
          <span className='absolute text-fuchsia-500 font-semibold'>💻</span>
        </div>
        <p className='mt-4 text-lg font-medium text-gray-600 animate-pulse'>
          Cargando Proyectos...
        </p>
      </div>
    );

  if (data && user)
    return (
      <>
        <div className='text-center lg:text-left'>
          <h1 className='text-4xl sm:text-5xl font-black'>Mis Proyectos</h1>
          <p className='text-lg sm:text-2xl font-light text-gray-500 my-2'>
            Maneja y administra tus proyectos
          </p>
        </div>

        <nav className='my-5 flex justify-center lg:justify-start'>
          <Link
            to='/projects/create'
            className='bg-purple-500 hover:bg-purple-600 px-6 sm:px-10 py-3 text-white text-lg sm:text-xl font-bold rounded-lg transition-colors'
          >
            Nuevo Proyecto
          </Link>
        </nav>

        {data.length ? (
          <ul className='mt-5 grid gap-5 sm:gap-8 lg:gap-10 lg:grid-cols-2 xl:grid-cols-3'>
            {data.map((project) => (
              <li
                key={project._id}
                className='bg-white shadow-md hover:shadow-lg transition p-6 rounded-xl border border-gray-200 relative'
              >
                <div className='absolute top-3 right-3'>
                  <Menu as='div' className='relative'>
                    <MenuButton className='p-2 text-gray-500 hover:text-gray-900 cursor-pointer'>
                      <EllipsisVerticalIcon className='h-6 w-6' aria-hidden='true' />
                    </MenuButton>

                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-100'
                      enterFrom='opacity-0 scale-95'
                      enterTo='opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='opacity-100 scale-100'
                      leaveTo='opacity-0 scale-95'
                    >
                      <MenuItems className='absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-gray-200 py-2'>
                        <MenuItem>
                          <Link
                            to={`/projects/${project._id}`}
                            className='flex items-center text-sm md:text-base gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100'
                          >
                            <EyeIcon className='w-5 h-5 text-gray-500' />
                            Ver Proyecto
                          </Link>
                        </MenuItem>

                        {isManager(project.manager, user._id) && (
                          <>
                            <MenuItem>
                              <Link
                                to={`/projects/${project._id}/edit`}
                                className='flex items-center text-sm md:text-base gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100'
                              >
                                <PencilSquareIcon className='w-5 h-5 text-gray-500' />
                                Editar Proyecto
                              </Link>
                            </MenuItem>

                            <MenuItem>
                              <button
                                type='button'
                                className='flex items-center text-sm md:text-base gap-2 px-4 py-2 text-red-500 hover:bg-red-100 w-full text-left cursor-pointer'
                                onClick={() =>
                                  navigate(location.pathname + `?deleteProject=${project._id}`)
                                }
                              >
                                <TrashIcon className='w-5 h-5 text-red-500' />
                                Eliminar Proyecto
                              </button>
                            </MenuItem>
                          </>
                        )}
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>

                <div className='space-y-4 mt-6'>
                  <div
                    className={`inline-block px-4 py-1 text-xs font-bold uppercase rounded-lg border-2 tracking-wide ${
                      isManager(project.manager, user._id)
                        ? 'bg-purple-100 text-purple-600 border-purple-500'
                        : 'bg-green-50 text-green-500 border-green-500'
                    }`}
                  >
                    {isManager(project.manager, user._id) ? 'Manager' : 'Colaborador'}
                  </div>

                  <Link
                    to={`/projects/${project._id}`}
                    className='text-gray-700 text-xl sm:text-2xl font-bold block hover:underline'
                  >
                    {project.projectName}
                  </Link>

                  <p className='text-sm md:text-base text-gray-400'>
                    Cliente: {project.clientName}
                  </p>
                  <p className='text-sm md:text-base text-gray-400'>{project.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-center py-20 text-gray-500'>
            No hay proyectos aún{' '}
            <Link to='/projects/create' className='text-purple-500 font-bold hover:underline'>
              Crear Proyecto
            </Link>
          </p>
        )}

        <DeleteProjectModal />
      </>
    );
}
