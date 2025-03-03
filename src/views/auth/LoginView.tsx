import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '@/api/AuthAPI';
import { UserLoginForm } from '@/types/index';

import ErrorMessage from '@/components/ErrorMessage';
import { useState } from 'react';

export default function LoginView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      navigate('/');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  console.log(isSubmitting);

  const handleLogin = (formData: UserLoginForm) => {
    mutate(formData);
  };

  return (
    <>
      <h1 className='text-4xl md:text-5xl font-black text-white text-center'>Iniciar Sesión</h1>
      <p className='text-lg md:text-2xl font-light text-white mt-4 text-center'>
        Comienza a planear tus proyectos{' '}
        <span className='text-fuchsia-500 font-bold'>iniciando sesión en este formulario</span>
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className='space-y-6 p-6 md:p-8 mt-8 bg-white shadow-lg rounded-xl max-w-md w-full mx-auto'
        noValidate
      >
        <div className='flex flex-col gap-2'>
          <label className='font-medium  text-gray-700'>Email</label>
          <input
            id='email'
            type='email'
            placeholder='Email de Registro'
            className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition'
            {...register('email', {
              required: 'El Email es obligatorio',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'E-mail no válido',
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-medium  text-gray-700'>Password</label>
          <input
            type='password'
            placeholder='Password de Registro'
            className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition'
            {...register('password', {
              required: 'El Password es obligatorio',
            })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-full p-2 md:p-3 text-base font-bold uppercase rounded-lg transition focus:ring-2 focus:ring-fuchsia-500 
          ${isSubmitting ? 'bg-fuchsia-400 cursor-not-allowed opacity-75 animate-pulse text-fuchsia-600' : 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white cursor-pointer'}`}
        >
          {isSubmitting ? 'Conectando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <nav className='mt-6 flex flex-col items-center space-y-3 text-sm md:text-base'>
        <Link
          to={'/auth/register'}
          className='text-slate-400 hover:text-fuchsia-500 font-medium transition'
        >
          ¿No tienes cuenta? Crea Una.
        </Link>
        <Link
          to={'/auth/forgot-password'}
          className='text-slate-400 hover:text-fuchsia-500 font-medium transition'
        >
          ¿Olvidaste tu contraseña? Restablecer.
        </Link>
      </nav>
    </>
  );
}
