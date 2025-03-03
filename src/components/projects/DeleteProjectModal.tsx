import { Fragment } from 'react';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

import { CheckPasswordForm } from '@/types';

import { checkPassword } from '@/api/AuthAPI';
import { deleteProjectById } from '@/api/ProjectAPI';

import ErrorMessage from '@/components/ErrorMessage';

export default function DeleteProjectModal() {
  const initialValues: CheckPasswordForm = {
    password: '',
  };
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const deleteProjectId = queryParams.get('deleteProject')!;
  const show = deleteProjectId ? true : false;

  const queryClient = useQueryClient();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const checkUserPasswordMutation = useMutation({
    mutationFn: checkPassword,
    onError: (error) => {
      toast.error(error.message);
      reset();
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProjectById,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate(location.pathname, { replace: true });
      reset();
    },
  });

  const handleForm = async (formData: CheckPasswordForm) => {
    await checkUserPasswordMutation.mutateAsync(formData);
    await deleteProjectMutation.mutateAsync(deleteProjectId);
  };

  return (
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

        <div className='fixed inset-0 overflow-y-auto flex items-center justify-center p-4'>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <DialogPanel className='w-full max-w-lg sm:max-w-xl md:max-w-3xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-2xl transition-all p-6 sm:p-10'>
              <DialogTitle as='h3' className='font-black text-2xl md:text-3xl text-center mb-6'>
                Eliminar Proyecto
              </DialogTitle>

              <p className='text-lg sm:text-xl font-semibold text-center mb-6'>
                Confirma la eliminación del proyecto {''}
                <span className='text-fuchsia-600'>colocando tu password</span>
              </p>

              <form className='space-y-6' onSubmit={handleSubmit(handleForm)} noValidate>
                <div className='flex flex-col gap-2'>
                  <label className='font-medium text-base sm:text-lg' htmlFor='password'>
                    Password
                  </label>
                  <input
                    id='password'
                    type='password'
                    placeholder='Ingresa tu contraseña'
                    className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:outline-none'
                    {...register('password', { required: 'El password es obligatorio' })}
                  />
                  {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <button
                  type='submit'
                  disabled={deleteProjectMutation.isPending}
                  className={`w-full font-bold text-base p-2 md:p-3 rounded-lg transition-all uppercase
              ${deleteProjectMutation.isPending ? 'bg-fuchsia-400 cursor-not-allowed opacity-75 animate-pulse text-fuchsia-600' : 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white cursor-pointer'}`}
                >
                  {deleteProjectMutation.isPending ? 'Eliminando...' : '  Eliminar Proyecto'}
                </button>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
