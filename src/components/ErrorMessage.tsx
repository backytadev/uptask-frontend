import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      role='alert'
      className='flex items-center gap-3 text-center my-3 md:my-4 bg-red-100 border border-red-400 text-red-700 font-semibold p-3 rounded-lg text-sm sm:text-base'
    >
      <ExclamationCircleIcon className='w-5 h-5 sm:w-6 sm:h-6 text-red-600' />
      <span>{children}</span>
    </div>
  );
}
