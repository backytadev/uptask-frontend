import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';

import { TaskStatus } from '@/types';
import { formatDate } from '@/utils/utils';
import { StatusTranslations } from '@/locales/es';
import { getTaskById, updateStatus } from '@/api/TaskAPI';
import NotesPanel from '../notes/NotesPanel';

export default function TaskModalDetails() {
  const navigate = useNavigate();

  const params = useParams();
  const projectId = params.projectId!;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('viewTask')!;

  const show = taskId ? true : false;

  const { data, isError, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId,
    retry: false,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project'], projectId });
      queryClient.invalidateQueries({ queryKey: ['task'], taskId });
      toast.success(data);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    mutate({ projectId, taskId, status: e.target.value as TaskStatus });
  };

  if (isError) {
    toast.error(error.message, { toastId: 'error' });
    return <Navigate to={`/projects/${projectId}`} />;
  }

  if (data)
    return (
      <>
        <Transition appear show={show} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-10'
            onClose={() => navigate(location.pathname, { replace: true })}
          >
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-black/60' />
            </TransitionChild>

            <div className='fixed inset-0 overflow-y-auto'>
              <div className='flex min-h-full items-center justify-center p-4 text-center'>
                <TransitionChild
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 scale-95'
                  enterTo='opacity-100 scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'
                >
                  <DialogPanel className='w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16'>
                    <p className='text-sm text-slate-400'>
                      Agregada el: {formatDate(data.createdAt)}
                    </p>
                    <p className='text-sm text-slate-400'>
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>

                    <DialogTitle as='h3' className='font-black text-4xl text-slate-600 my-5'>
                      {data.name}
                    </DialogTitle>

                    <p className='text-lg text-slate-500 mb-2'>Descripción: {data.description}</p>

                    {data.completedBy.length ? (
                      <>
                        <p className='text-2xl text-slate-500 mb-2'>Historial de Cambios</p>

                        <ul className='pl-4 list-decimal'>
                          {data.completedBy.map((activityLog) => (
                            <li key={activityLog._id}>
                              <span className='font-bold text-slate-600'>
                                {StatusTranslations[activityLog.status]}
                              </span>{' '}
                              por: {activityLog.user.name}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}

                    <div className='my-5 space-y-3'>
                      <label className='font-bold'>Estado Actual:</label>
                      <select
                        className='w-full p-3 bg-white border border-gray-300'
                        defaultValue={data.status}
                        onChange={handleChange}
                      >
                        {Object.entries(StatusTranslations).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <NotesPanel />
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
