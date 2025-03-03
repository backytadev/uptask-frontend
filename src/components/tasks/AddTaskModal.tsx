import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Dialog, Transition, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react';

import { TaskFormData } from '@/types';
import { createTask } from '@/api/TaskAPI';
import TaskForm from '@/components/tasks/TaskForm';

export default function AddTaskModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modalTask = queryParams.get('newTask');
  const show = modalTask ? true : false;

  const params = useParams();
  const projectId = params.projectId!;

  const initialValues: TaskFormData = {
    name: '',
    description: '',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const queryCliente = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryCliente.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success(data);
      navigate(location.pathname, { replace: true });
      reset();
    },
  });

  const handleCreateTask = (formData: TaskFormData) => {
    mutate({ formData, projectId });
  };

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-50'
          onClose={() => navigate(location.pathname, { replace: true })} // Remove the query string
        >
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-200'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-150'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/50' />
          </TransitionChild>

          <div className='fixed inset-0 flex items-center justify-center p-4 sm:p-6'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-200'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-150'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-lg sm:max-w-3xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all p-6 sm:p-12'>
                <DialogTitle as='h3' className='text-[1.8rem] md:text-4xl font-black my-3 sm:my-5'>
                  Nueva Tarea
                </DialogTitle>

                <p className='text-lg sm:text-xl font-medium'>
                  Llena el formulario y crea <span className='text-fuchsia-600'>una tarea</span>
                </p>

                <form
                  className='mt-6 sm:mt-10 space-y-6 sm:space-y-10'
                  onSubmit={handleSubmit(handleCreateTask)}
                  noValidate
                >
                  <TaskForm register={register} errors={errors} />

                  <input
                    type='submit'
                    value='Crear Tarea'
                    className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 md:p-3 text-base text-white uppercase font-bold rounded-md shadow-md cursor-pointer transition-all'
                  />
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
