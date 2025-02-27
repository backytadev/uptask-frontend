import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import ErrorMessage from '@/components/ErrorMessage';
import { updatePasswordWithToken } from '@/api/AuthAPI';
import type { ConfirmToken, NewPasswordForm } from '@/types';

type NewPasswordFormProps = {
  token: ConfirmToken['token'];
};

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  const navigate = useNavigate();

  const initialValues: NewPasswordForm = {
    password: '',
    password_confirmation: '',
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: updatePasswordWithToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
      navigate('/auth/login');
    },
  });

  const handleNewPassword = (formData: NewPasswordForm) => {
    mutate({ formData, token });
  };

  const password = watch('password');

  return (
    <>
      <form
        onSubmit={handleSubmit(handleNewPassword)}
        className='space-y-6 p-6 sm:p-10 bg-white shadow-lg rounded-xl mt-10 w-full max-w-lg mx-auto'
        noValidate
      >
        <div className='flex flex-col gap-3'>
          <label className='font-medium text-base sm:text-xl'>Password</label>
          <input
            type='password'
            placeholder='Password de Registro'
            className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:border-fuchsia-600 focus:ring-1 focus:ring-fuchsia-600 focus:outline-none transition-all'
            {...register('password', {
              required: 'El Password es obligatorio',
              minLength: {
                value: 8,
                message: 'El Password debe ser mínimo de 8 caracteres',
              },
            })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>

        <div className='flex flex-col gap-3'>
          <label className='font-medium text-base sm:text-xl'>Repetir Password</label>
          <input
            id='password_confirmation'
            type='password'
            placeholder='Repite Password de Registro'
            className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:border-fuchsia-600 focus:ring-1 focus:ring-fuchsia-600 focus:outline-none transition-all'
            {...register('password_confirmation', {
              required: 'Repetir Password es obligatorio',
              validate: (value) => value === password || 'Los Passwords no son iguales',
            })}
          />
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type='submit'
          value='Establecer Password'
          className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full py-3 text-white font-bold uppercase text-base sm:text-lg rounded-lg transition-all cursor-pointer focus:ring-2 focus:ring-fuchsia-400'
        />
      </form>
    </>
  );
}
