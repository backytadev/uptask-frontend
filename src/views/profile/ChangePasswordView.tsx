import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { changePassword } from '@/api/ProfileAPI';
import { UpdateCurrentUserPasswordForm } from '@/types';

import ErrorMessage from '@/components/ErrorMessage';

export default function ChangePasswordView() {
  const initialValues: UpdateCurrentUserPasswordForm = {
    current_password: '',
    password: '',
    password_confirmation: '',
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: changePassword,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
    },
  });

  const password = watch('password');

  const handleChangePassword = (formData: UpdateCurrentUserPasswordForm) => {
    mutate(formData);
  };

  return (
    <>
      <div className='mx-auto max-w-lg px-4 sm:px-0'>
        <h1 className='text-4xl font-black text-center sm:text-5xl'>Cambiar Password</h1>
        <p className='text-lg sm:text-xl font-light text-gray-500 mt-4 text-center'>
          Utiliza este formulario para cambiar tu password
        </p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className='mt-10 space-y-6 bg-white shadow-md p-6 sm:p-10 rounded-xl'
          noValidate
        >
          <div className='space-y-2'>
            <label className='text-sm font-bold uppercase' htmlFor='current_password'>
              Password Actual
            </label>
            <input
              id='current_password'
              type='password'
              placeholder='Password Actual'
              className='w-full mt-1 p-2 md:p-3 border border-gray-300 rounded-lg focus:border-fuchsia-600 focus:ring-1 focus:ring-fuchsia-600 focus:outline-none transition-all'
              {...register('current_password', {
                required: 'El password actual es obligatorio',
              })}
            />
            {errors.current_password && (
              <ErrorMessage>{errors.current_password.message}</ErrorMessage>
            )}
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-bold uppercase' htmlFor='password'>
              Nuevo Password
            </label>
            <input
              id='password'
              type='password'
              placeholder='Nuevo Password'
              className='w-full mt-1 p-2 md:p-3  border border-gray-300 rounded-lg focus:border-fuchsia-600 focus:ring-1 focus:ring-fuchsia-600 focus:outline-none transition-all'
              {...register('password', {
                required: 'El Nuevo Password es obligatorio',
                minLength: {
                  value: 8,
                  message: 'El Password debe ser mínimo de 8 caracteres',
                },
              })}
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-bold uppercase' htmlFor='password_confirmation'>
              Repetir Password
            </label>
            <input
              id='password_confirmation'
              type='password'
              placeholder='Repetir Password'
              className='w-full mt-1 p-2 md:p-3 border border-gray-300 rounded-lg focus:border-fuchsia-600 focus:ring-1 focus:ring-fuchsia-600 focus:outline-none transition-all'
              {...register('password_confirmation', {
                required: 'Este campo es obligatorio',
                validate: (value) => value === password || 'Los Passwords no son iguales',
              })}
            />
            {errors.password_confirmation && (
              <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
            )}
          </div>

          <input
            type='submit'
            value='Cambiar Password'
            className='bg-fuchsia-600 w-full py-4 text-white uppercase font-bold  rounded-lg hover:bg-fuchsia-700 focus:ring-4 focus:ring-fuchsia-400 transition-all cursor-pointer'
          />
        </form>
      </div>
    </>
  );
}
