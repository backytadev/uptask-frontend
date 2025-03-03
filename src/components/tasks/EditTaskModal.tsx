import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';

import { Task, TaskFormData } from '@/types';
import { updateTaskById } from '@/api/TaskAPI';
import TaskForm from '@/components/tasks/TaskForm';

type EditTaskModalProps = {
  data: Task;
  taskId: string;
};

export default function EditTaskModal({ data, taskId }: EditTaskModalProps) {
  const navigate = useNavigate();

  const params = useParams();
  const projectId = params.projectId!;

  const queryCliente = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({ defaultValues: { name: data.name, description: data.description } });

  const { mutate } = useMutation({
    mutationFn: updateTaskById,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryCliente.invalidateQueries({ queryKey: ['project', projectId] });
      queryCliente.invalidateQueries({ queryKey: ['task', taskId] });
      toast.success(data);
      navigate(location.pathname, { replace: true });
      reset();
    },
  });

  const handleEditTask = (formData: TaskFormData) => {
    mutate({ projectId, taskId, formData });
  };

  return (
    <Transition appear show={true} as={Fragment}>
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

        <div className='fixed inset-0 overflow-y-auto flex items-center justify-center p-4 sm:p-6'>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <DialogPanel className='w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all p-6 sm:p-10 md:p-14 lg:p-16'>
              <DialogTitle as='h3' className='font-black text-[1.8rem] md:text-4xl my-3 sm:my-5'>
                Editar Tarea
              </DialogTitle>

              <p className='text-base sm:text-lg md:text-xl font-bold'>
                Realiza cambios a una tarea en{' '}
                <span className='text-fuchsia-600'>este formulario</span>
              </p>

              <form
                className='mt-6 sm:mt-8 space-y-4 sm:space-y-6'
                noValidate
                onSubmit={handleSubmit(handleEditTask)}
              >
                <TaskForm register={register} errors={errors} />

                <input
                  type='submit'
                  className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-sm md:text-base text-white font-bold sm:text-xl rounded-md shadow-md cursor-pointer transition-all uppercase'
                  value='Guardar Tarea'
                />
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
