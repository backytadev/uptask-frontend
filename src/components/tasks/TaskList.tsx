import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateStatus } from '@/api/TaskAPI';
import { StatusTranslations } from '@/locales/es';
import { Project, TaskProject, TaskStatus } from '@/types';

import TaskCard from '@/components/tasks/TaskCard';
import DropTask from '@/components/tasks/DropTask';
import { useEffect } from 'react';

type TaskListProps = {
  tasks: TaskProject[];
  canEdit: boolean;
};

type GroupTasks = {
  [key: string]: TaskProject[];
};

const initialStatusGroups: GroupTasks = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

const StatusStyles: { [key: string]: string } = {
  pending: 'border-t-slate-500',
  onHold: 'border-t-red-500',
  inProgress: 'border-t-blue-500',
  underReview: 'border-t-amber-500',
  completed: 'border-t-emerald-500',
};

export default function TaskList({ tasks, canEdit }: TaskListProps) {
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 10,
      },
    })
  );

  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project'], projectId });
      toast.success(data);
    },
  });

  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : []; // Validations status
    currentGroup = [...currentGroup, task]; // Assign current + new task
    return { ...acc, [task.status]: currentGroup }; // [{id: 1, status: "pending"}, {}]
  }, initialStatusGroups);

  // When dragging starts, disable scrolling by setting body overflow to "hidden".
  const handleDragStart = () => {
    document.body.style.overflow = 'hidden';
  };

  const handleDragEnd = (e: DragEndEvent) => {
    // Re-enable scrolling when the drag ends.
    document.body.style.overflow = 'auto';

    const { over, active } = e;

    // If the dragged element is dropped over a valid target
    if (over && over.id) {
      const taskId = active.id.toString();
      const status = over.id as TaskStatus;

      // Update the task's status in the database
      mutate({ projectId, taskId, status });

      // Optimistically update the UI before the database response
      queryClient.setQueryData(['project', projectId], (prevData: Project) => {
        const updatedTasks = prevData.tasks.map((task) => {
          // Update the status of the dragged task
          if (task._id === taskId) {
            return {
              ...task,
              status,
            };
          }
          return task;
        });

        return {
          ...prevData,
          tasks: updatedTasks,
        };
      });
    }
  };

  // Prevent scrolling when dragging on mobile devices
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      // If body overflow is "hidden", block scrolling
      if (document.body.style.overflow === 'hidden') {
        e.preventDefault();
      }
    };

    // Add an event listener for touchmove to prevent scrolling during drag
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      // Clean up: Remove the event listener when the component unmounts
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <>
      <h2 className='text-3xl sm:text-5xl font-black my-8 text-gray-900'>Tareas</h2>

      <div className='flex gap-5 overflow-x-auto 2xl:overflow-visible pb-10 px-4 sm:px-6'>
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div
              key={status}
              className='min-w-[300px] snap-start 2xl:min-w-0 2xl:w-1/5 bg-white shadow-lg rounded-lg p-4'
            >
              <h3
                className={`capitalize text-lg md:text-xl font-semibold border border-gray-300 p-3 rounded-md border-t-8 ${StatusStyles[status]}`}
              >
                {StatusTranslations[status]}
              </h3>

              <DropTask status={status} />

              <ul className='mt-4 space-y-4'>
                {tasks.length === 0 ? (
                  <li className='text-gray-500 text-center py-3'>No hay tareas</li>
                ) : (
                  tasks.map((task) => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  );
}
