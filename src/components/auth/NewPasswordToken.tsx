import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';

import { ConfirmToken } from '@/types';
import { validateToken } from '@/api/AuthAPI';

type NewPasswordTokenProps = {
  token: ConfirmToken['token'];
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  const { mutate } = useMutation({
    mutationFn: validateToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      setIsValidToken(true);
    },
  });

  const handleChange = (token: ConfirmToken['token']) => {
    setToken(token);
  };

  const handleComplete = (token: ConfirmToken['token']) => {
    mutate({ token });
  };

  return (
    <>
      <form className='space-y-4 md:space-y-5 p-5 md:p-10 rounded-lg bg-white mt-10'>
        <label className='font-normal text-xl md:text-2xl text-center block'>
          Código de 6 dígitos
        </label>
        <div className='flex justify-center flex-wrap md:flex-nowrap gap-2 md:gap-5'>
          <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
            <PinInputField className='h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white' />
          </PinInput>
        </div>
      </form>

      <nav className='mt-10 flex flex-col space-y-4 text-sm md:text-base'>
        <Link
          to='/auth/forgot-password'
          className='text-slate-400 font-medium text-center hover:text-fuchsia-500 transition'
        >
          Solicitar un nuevo código
        </Link>
      </nav>
    </>
  );
}
