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
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-5xl font-black'>Editar Proyecto</h1>
        <p className='text-2xl font-light text-gray-500'>
          Llena el siguiente formulario para editar el proyecto.
        </p>

        <nav className='my-5'>
          <Link
            to='/'
            className='bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors'
          >
            Volver a Proyectos
          </Link>
        </nav>

        <form
          className='mt-10 bg-white shadow-lg p-10 rounded-lg'
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <ProjectForm register={register} errors={errors} />

          <input
            type='submit'
            value='Guardar Cambios'
            className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors'
          />
        </form>
      </div>
    </>
  );
}
