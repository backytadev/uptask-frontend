import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { TaskFormData } from '@/types/index';
import ErrorMessage from '@/components/ErrorMessage';

type TaskFormProps = {
  errors: FieldErrors<TaskFormData>;
  register: UseFormRegister<TaskFormData>;
};

export default function TaskForm({ errors, register }: TaskFormProps) {
  return (
    <>
      <div className='flex flex-col gap-2'>
        <label className='font-medium text-base md:text-xl' htmlFor='name'>
          Nombre de la tarea
        </label>
        <input
          id='name'
          type='text'
          placeholder='Ingrese el nombre de la tarea'
          className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all duration-200 ease-in-out'
          {...register('name', { required: 'El nombre de la tarea es obligatorio' })}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </div>

      <div className='flex flex-col gap-2'>
        <label className='font-medium text-base md:text-xl' htmlFor='description'>
          Descripción de la tarea
        </label>
        <textarea
          id='description'
          placeholder='Ingrese una descripción detallada'
          rows={4}
          className='w-full p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all duration-200 ease-in-out resize-none'
          {...register('description', { required: 'La descripción de la tarea es obligatoria' })}
        />
        {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
      </div>
    </>
  );
}
