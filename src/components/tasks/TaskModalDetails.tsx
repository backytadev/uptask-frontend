import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';

import { TaskStatus } from '@/types';
import { formatDate } from '@/utils/utils';
import { StatusTranslations } from '@/locales/es';
import { getTaskById, updateStatus } from '@/api/TaskAPI';

import NotesPanel from '@/components/notes/NotesPanel';

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
            className='relative z-50'
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
                  <DialogPanel className='w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all p-4 sm:p-6'>
                    <p className='text-[10px] sm:text-xs md:text-sm text-slate-400'>
                      Agregada el: {formatDate(data.createdAt)}
                    </p>
                    <p className='text-[10px] sm:text-xs md:text-sm text-slate-400'>
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>

                    <DialogTitle
                      as='h3'
                      className='font-black text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-700 my-4'
                    >
                      {data.name}
                    </DialogTitle>

                    <p className='text-xs sm:text-sm md:text-base text-slate-600 mb-4'>
                      <span className='font-semibold'>Descripción:</span> {data.description}
                    </p>

                    {data.completedBy.length > 0 && (
                      <div>
                        <p className='font-bold text-base sm:text-lg md:text-xl text-slate-700 mb-3'>
                          Historial de Cambios
                        </p>
                        <ul className='pl-4 list-disc text-xs sm:text-sm md:text-base space-y-1'>
                          {data.completedBy.map((activityLog) => (
                            <li
                              key={activityLog._id}
                              className={`font-bold ${
                                activityLog.status === 'completed'
                                  ? 'text-green-600'
                                  : activityLog.status === 'inProgress'
                                    ? 'text-amber-500'
                                    : activityLog.status === 'pending'
                                      ? 'text-red-600'
                                      : activityLog.status === 'onHold'
                                        ? 'text-blue-600'
                                        : activityLog.status === 'underReview'
                                          ? 'text-purple-600'
                                          : 'text-slate-600'
                              }`}
                            >
                              {StatusTranslations[activityLog.status]}{' '}
                              <p className='text-slate-600 font-medium text-[10px] sm:text-xs'>
                                Actualizado por: {activityLog.user.name}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className='my-4 space-y-2'>
                      <label className='font-bold text-sm md:text-base block'>Estado Actual:</label>
                      <select
                        className={`w-full p-2 sm:p-3 bg-white border text-sm md:text-base border-gray-300 rounded-md focus:ring-2 focus:outline-none ${
                          data.status === 'completed'
                            ? 'focus:ring-green-500'
                            : data.status === 'inProgress'
                              ? 'focus:ring-amber-500'
                              : data.status === 'pending'
                                ? 'focus:ring-red-500'
                                : data.status === 'onHold'
                                  ? 'focus:ring-blue-500'
                                  : data.status === 'underReview'
                                    ? 'focus:ring-purple-500'
                                    : 'focus:ring-gray-400'
                        }`}
                        defaultValue={data.status}
                        onChange={handleChange}
                      >
                        {Object.entries(StatusTranslations).map(([key, value]) => (
                          <option
                            key={key}
                            value={key}
                            className={
                              key === 'completed'
                                ? 'text-green-600'
                                : key === 'inProgress'
                                  ? 'text-amber-600'
                                  : key === 'pending'
                                    ? 'text-red-600'
                                    : key === 'onHold'
                                      ? 'text-blue-600'
                                      : key === 'underReview'
                                        ? 'text-purple-600'
                                        : 'text-slate-600'
                            }
                          >
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <NotesPanel notes={data.notes} />
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
