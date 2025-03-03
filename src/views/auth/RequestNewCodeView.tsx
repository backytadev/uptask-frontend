import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { RequestConfirmationCodeForm } from '@/types';
import { requestConfirmationCode } from '@/api/AuthAPI';

import ErrorMessage from '@/components/ErrorMessage';

export default function RegisterView() {
  const initialValues: RequestConfirmationCodeForm = {
    email: '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: requestConfirmationCode,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
    },
  });

  const handleRequestCode = (formData: RequestConfirmationCodeForm) => {
    mutate(formData);
  };

  return (
    <div>
      <h1 className='text-3xl md:text-4xl font-black text-white text-center'>
        Solicitar Código de Confirmación
      </h1>
      <p className='text-lg md:text-xl font-light text-white mt-5 text-center'>
        Coloca tu e-mail para recibir
        <span className='text-fuchsia-500 font-bold'> un nuevo código</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRequestCode)}
        className='bg-white p-6 md:p-8  rounded-lg shadow-md w-full max-w-md mx-auto mt-8 space-y-6'
        noValidate
      >
        <div className='flex flex-col gap-4'>
          <label className='font-medium text-base md:text-xl' htmlFor='email'>
            Email
          </label>
          <input
            id='email'
            type='email'
            placeholder='Email de Registro'
            className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:border-fuchsia-600 focus:ring-1 focus:ring-fuchsia-600 focus:outline-none transition-all'
            {...register('email', {
              required: 'El Email de registro es obligatorio',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'E-mail no válido',
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <button
          type='submit'
          className='bg-fuchsia-600 hover:bg-fuchsia-700 uppercase w-full p-2 md:p-3 text-white font-bold cursor-pointer rounded-lg transition focus:ring-2 focus:ring-fuchsia-400 text-base'
        >
          Enviar Código
        </button>
      </form>

      <nav className='mt-6 flex flex-col items-center space-y-3 text-center text-sm md:text-base'>
        <Link
          to={'/auth/login'}
          className='text-gray-300 font-medium hover:text-fuchsia-500 transition'
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>
        <Link
          to={'/auth/forgot-password'}
          className='text-gray-300 font-medium hover:text-fuchsia-500 transition'
        >
          ¿Olvidaste tu contraseña? Restablecer
        </Link>
      </nav>
    </div>
  );
}
