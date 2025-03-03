import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Project, ProjectFormData } from '@/types';
import { updateProjectById } from '@/api/ProjectAPI';
import ProjectForm from '@/components/projects/ProjectForm';

type EditProjectFormProps = {
  data: ProjectFormData;
  projectId: Project['_id'];
};

export default function EditProjectForm({ data, projectId }: EditProjectFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: data.projectName,
      clientName: data.clientName,
      description: data.description,
    },
  });

  const { mutate } = useMutation({
    mutationFn: updateProjectById,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['editProject', projectId] });
      navigate('/');
    },
  });

  const handleForm = (formData: ProjectFormData) => {
    const data = {
      projectId,
      formData,
    };

    mutate(data);
  };

  return (
    <>
      <div className='max-w-3xl mx-auto p-4 sm:p-6'>
        <h1 className='text-3xl sm:text-5xl font-black text-gray-900'>Editar Proyecto</h1>
        <p className='text-lg sm:text-2xl font-light text-gray-500 mt-2'>
          Llena el siguiente formulario para editar el proyecto
        </p>

        <nav className='my-6'>
          <Link
            to='/'
            className='inline-block bg-purple-500 hover:bg-purple-600 px-6 sm:px-10 py-2 sm:py-3 text-white text-lg sm:text-xl font-bold rounded-lg shadow-md transition-all'
          >
            Volver a Proyectos
          </Link>
        </nav>

        <form
          className='mt-8 sm:mt-10 bg-white shadow-md p-6 sm:p-10 rounded-lg'
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <ProjectForm register={register} errors={errors} />

          <input
            type='submit'
            value='Guardar Cambios'
            className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 md:p-3 text-white uppercase font-bold rounded-md shadow-md cursor-pointer transition-all'
          />
        </form>
      </div>
    </>
  );
}
