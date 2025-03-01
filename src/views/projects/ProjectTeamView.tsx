import { toast } from 'react-toastify';
import { Fragment } from 'react/jsx-runtime';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  TrashIcon,
  UserPlusIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

import { getProjectTeam, removeUserFromProject } from '@/api/TeamAPI';

import AddMemberModal from '@/components/team/AddMemberModal';

export default function ProjectTeamView() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['projectTeam', projectId],
    queryFn: () => getProjectTeam(projectId),
    retry: false,
  });

  const { mutate } = useMutation({
    mutationFn: removeUserFromProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['projectTeam', projectId] });
    },
  });

  if (isLoading)
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <div className='relative flex items-center justify-center'>
          <div className='animate-spin rounded-full border-4 border-gray-300 border-t-fuchsia-500 h-16 w-16'></div>
          <span className='absolute text-fuchsia-500 font-semibold'>💼</span>
        </div>
        <p className='mt-4 text-lg font-medium text-gray-600 animate-pulse'>
          Cargando Colaboradores del Proyecto...
        </p>
      </div>
    );

  if (isError) return <Navigate to={'/404'} />;

  if (data)
    return (
      <>
        <h1 className='text-4xl sm:text-5xl font-black'>Administrar Equipo</h1>
        <p className='text-lg sm:text-2xl font-light text-gray-500 mt-4'>
          Administra el equipo de trabajo para este proyecto
        </p>

        <nav className='my-5 flex flex-wrap gap-3'>
          <button
            type='button'
            className='flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-6 py-3 text-white text-base sm:text-lg w-full font-bold rounded-lg transition-colors justify-center md:justify-normal md:w-auto cursor-pointer'
            onClick={() => navigate(location.pathname + '?addMember=true')}
          >
            <UserPlusIcon className='h-6 w-6' />
            Agregar Colaborador
          </button>

          <Link
            to={`/projects/${projectId}`}
            className='flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 px-6 py-3 text-white sm:text-lg w-full font-bold rounded-lg transition-colors justify-center md:justify-normal md:w-auto'
          >
            <ArrowLeftIcon className='h-6 w-6' />
            Volver a Proyecto
          </Link>
        </nav>

        <h2 className='text-4xl sm:text-5xl font-black my-10'>Miembros actuales</h2>
        {data.length ? (
          <ul className='divide-y divide-gray-200 border border-gray-200 mt-5 bg-white shadow-md rounded-lg'>
            {data?.map((member) => (
              <li
                key={member._id}
                className='relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-5 py-6'
              >
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='min-w-0 flex-auto'>
                      <p className='text-lg sm:text-xl font-bold text-gray-700'>{member.name}</p>
                      <p className='text-sm text-gray-500'>{member.email}</p>
                    </div>
                  </div>

                  <Menu as='div' className='relative'>
                    <MenuButton className='p-2.5 text-gray-500 hover:text-gray-900 transition-colors focus:ring-2 focus:ring-gray-400 cursor-pointer'>
                      <EllipsisVerticalIcon className='h-6 w-6' aria-hidden='true' />
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-100'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'
                    >
                      <MenuItems className='absolute  -right-4 md:right-0 top-12 md:top-10 z-20 w-[12.5rem] bg-white shadow-lg ring-1 ring-gray-300 rounded-md py-2'>
                        <MenuItem>
                          <button
                            type='button'
                            className='flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer'
                            onClick={() => mutate({ projectId, userId: member._id })}
                          >
                            <TrashIcon className='h-5 w-5' />
                            Eliminar del Proyecto
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-center py-10 text-gray-500 text-lg'>No hay miembros en este equipo</p>
        )}

        <AddMemberModal />
      </>
    );
}
