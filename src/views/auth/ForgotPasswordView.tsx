import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { ForgotPasswordForm } from '@/types';
import { forgotPassword } from '@/api/AuthAPI';

import ErrorMessage from '@/components/ErrorMessage';

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: '',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      navigate('/auth/new-password');
      toast.success(data);
      reset();
    },
  });

  const handleForgotPassword = (formData: ForgotPasswordForm) => {
    mutate(formData);
  };

  return (
    <div className=''>
      <h1 className='text-4xl sm:text-5xl font-black text-white text-center'>
        Restablecer Contraseña
      </h1>
      <p className='text-lg sm:text-2xl font-light text-white mt-5 text-center'>
        ¿Olvidaste tu password? Coloca tu email{' '}
        <span className='text-fuchsia-500 font-bold'>y restablece tu contraseña</span>
      </p>

      <form
        onSubmit={handleSubmit(handleForgotPassword)}
        className='mt-10 bg-white shadow-md rounded-xl p-6 sm:p-10 w-full max-w-lg'
        noValidate
      >
        <div className='flex flex-col gap-3'>
          <label className='font-medium text-base sm:text-xl' htmlFor='email'>
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

        <input
          type='submit'
          value='Enviar Instrucciones'
          className='mt-6 bg-fuchsia-600 w-full py-2 md:py-4 text-white uppercase font-bold rounded-lg  hover:bg-fuchsia-700 focus:ring-2 focus:ring-fuchsia-400 transition-all cursor-pointer'
        />
      </form>

      <nav className='mt-6 flex flex-col items-center space-y-3 text-sm md:text-base'>
        <Link
          to={'/auth/login'}
          className='text-slate-400 font-medium transition hover:text-fuchsia-500'
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>
        <Link
          to={'/auth/register'}
          className='text-slate-400 font-medium transition hover:text-fuchsia-500'
        >
          ¿No tienes cuenta? Crea una
        </Link>
      </nav>
    </div>
  );
}
