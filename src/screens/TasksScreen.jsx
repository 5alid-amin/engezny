import React, { useState, useEffect } from 'react';
import {
  Pencil,
  Trash2,
  Check,
  Plus,
  X,
  Loader2,
  GripVertical
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

// مكتبات السحب والإفلات
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableTask = ({ task, handleToggleStatus, handleOpenModal, handleDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 flex items-center gap-8 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.2)] transition-all duration-300
        ${task.isDone ? 'opacity-50' : 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-white/10 hover:-translate-y-1'}
      `}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50">
        <GripVertical size={24} />
      </div>

      <div className="flex-shrink-0 cursor-pointer" onClick={() => handleToggleStatus(task.id)}>
        {task.isDone ? (
          <div className="w-12 h-12 rounded-full bg-brand-teal/20 border border-brand-teal/50 flex items-center justify-center">
            <Check size={24} className="text-brand-teal" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full border-2 border-brand-teal/40 flex items-center justify-center p-1 hover:bg-brand-teal/10 transition-all">
            <div className="w-full h-full rounded-full border-2 border-transparent"></div>
          </div>
        )}
      </div>

      <div className="flex-1 text-right">
        {task.categoryName && (
          <div className="flex items-center justify-end gap-4 mb-3">
            <span className="px-4 py-1.5 rounded-full text-xs tracking-wider bg-brand-teal/20 text-brand-teal border border-brand-teal/30">
              {task.categoryName}
            </span>
          </div>
        )}

        <div className="relative inline-block group -mt-2">
          <h3 className={`text-3xl mb-2 tracking-wide font-bold transition-colors duration-500 ${task.isDone ? 'text-white/40' : 'text-white'}`}>
            {task.title}
          </h3>
          <span className={`absolute top-[48%] right-0 h-[3px] bg-brand-teal/60 transition-all duration-500 ease-in-out pointer-events-none rounded-full ${task.isDone ? 'w-full' : 'w-0'}`} />
        </div>

        {task.description && <p className="text-base text-brand-gray leading-relaxed mt-1">{task.description}</p>}
      </div>

      <div className="flex flex-col items-center justify-center gap-5 border-r border-white/10 pr-8">
        <button onClick={() => handleOpenModal(task)} className="text-white/40 hover:text-brand-teal transition-all hover:scale-110">
          <Pencil size={22} />
        </button>
        <button onClick={() => handleDelete(task.id)} className="text-white/40 hover:text-red-400 transition-all hover:scale-110">
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
};

const TasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [showProjectList, setShowProjectList] = useState(false);
  const [showDescriptionField, setShowDescriptionField] = useState(false);

  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({ title: '', description: '', categoryId: null });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, catsRes] = await Promise.all([
        axiosInstance.get(`/Tasks/${userId}`),
        axiosInstance.get(`/Categories/${userId}`)
      ]);
      const savedOrder = localStorage.getItem(`tasksOrder_${userId}`);
      if (savedOrder) {
        const orderIds = JSON.parse(savedOrder);
        const orderedTasks = [...tasksRes.data].sort((a, b) => {
          const indexA = orderIds.indexOf(a.id);
          const indexB = orderIds.indexOf(b.id);
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
        setTasks(orderedTasks);
      } else {
        setTasks(tasksRes.data);
      }
      setCategories(catsRes.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem(`tasksOrder_${userId}`, JSON.stringify(newItems.map(t => t.id)));
        return newItems;
      });
    }
  };

  const playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log("Sound play blocked"));
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await axiosInstance.patch(`/Tasks/toggle/${id}?userId=${userId}`);
      if (response.data === true) playSuccessSound();
      setTasks(tasks.map(t => t.id === id ? { ...t, isDone: response.data } : t));
    } catch (error) {
      console.error("Toggle Error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await axiosInstance.delete(`/Tasks/${id}?userId=${userId}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setIsEditing(task.id);
      const foundCat = categories.find(c => c.name === task.categoryName);
      setFormData({
        title: task.title,
        description: task.description || '',
        categoryId: foundCat ? foundCat.id : null
      });
      setShowProjectList(!!foundCat);
      setShowDescriptionField(!!task.description);
    } else {
      setIsEditing(null);
      setFormData({ title: '', description: '', categoryId: null });
      setShowProjectList(false);
      setShowDescriptionField(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) return;

    const payload = {
      title: formData.title,
      description: showDescriptionField ? (formData.description || "") : "",
      categoryId: showProjectList ? (formData.categoryId ? parseInt(formData.categoryId) : null) : null,
      userId: parseInt(userId)
    };

    try {
      if (isEditing) {
        await axiosInstance.put(`/Tasks/${isEditing}?userId=${userId}`, payload);
      } else {
        await axiosInstance.post('/Tasks', payload);
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  // --- منطق عداد التاسكات الذكي ---
  const getRemainingTasksText = () => {
    const remainingCount = tasks.filter(t => !t.isDone).length;

    if (remainingCount === 0) return "خلصنا كل اللي ورانا.. بطل! 🔥";
    if (remainingCount === 1) return "فاضلنا تاسك واحد عااش..";
    if (remainingCount === 2) return "فاضلنا تاسكين.. قربت";
    if (remainingCount >= 3 && remainingCount <= 10) return `فاضلنا ${remainingCount} تاسكات..`;
    return `فاضلنا ${remainingCount} تاسك..`;
  };

  return (
    <div className="flex flex-col flex-1 h-full relative p-8">
      {loading && (
        <div className="flex justify-center my-4">
          <Loader2 className="animate-spin text-brand-teal" size={30} />
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 mt-12 mb-24">

        {/* العداد الذكي */}
        {!loading && tasks.length > 0 && (
          <div className="text-right px-4 animate-in fade-in slide-in-from-right-4 duration-700">
            <span className="text-white/10 text-xl font-medium tracking-wide italic">
              {getRemainingTasksText()}
            </span>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableTask
                key={task.id}
                task={task}
                handleToggleStatus={handleToggleStatus}
                handleOpenModal={handleOpenModal}
                handleDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="absolute bottom-10 right-0 translate-x-[-40px] z-30 pointer-events-none">
        <button
          onClick={() => handleOpenModal()}
          className="w-20 h-20 bg-brand-teal text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(52,165,147,0.3)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(52,165,147,0.5)] hover:scale-110 pointer-events-auto"
        >
          <Plus size={35} strokeWidth={2.5} />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />

          <div className="bg-brand-surface border border-white/10 w-full max-w-2xl rounded-[3rem] p-12 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 left-8 text-white/30 hover:text-white transition-colors">
              <X size={32} />
            </button>

            <h2 className="text-4xl text-white text-right mb-12 font-medium">
              {isEditing ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
            </h2>

            <div className="flex flex-col gap-8 text-right" dir="rtl">
              <div>
                <label className="text-brand-gray block mb-3 text-lg">عنوان المهمة</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl text-white focus:outline-none focus:border-brand-teal/50 transition-all"
                  placeholder="ماذا ستنجز اليوم؟"
                />
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex items-center justify-start gap-3 cursor-pointer group" onClick={() => setShowDescriptionField(!showDescriptionField)}>
                  <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${showDescriptionField ? 'bg-brand-teal border-brand-teal' : 'border-white/20'}`}>
                    {showDescriptionField && <Check size={18} className="text-brand-dark" />}
                  </div>
                  <span className="text-lg text-white/80 group-hover:text-brand-teal transition-colors">إضافة وصف للمهمة</span>
                </label>

                {showDescriptionField && (
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl text-white focus:outline-none focus:border-brand-teal/50 h-32 resize-none transition-all animate-in slide-in-from-top-2 duration-300"
                    placeholder="أضف وصفاً بسيطاً..."
                  />
                )}
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex items-center justify-start gap-3 cursor-pointer group" onClick={() => setShowProjectList(!showProjectList)}>
                  <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${showProjectList ? 'bg-brand-teal border-brand-teal' : 'border-white/20'}`}>
                    {showProjectList && <Check size={18} className="text-brand-dark" />}
                  </div>
                  <span className="text-lg text-white/80 group-hover:text-brand-teal transition-colors">اختيار مشروع</span>
                </label>

                {showProjectList && (
                  <div className="flex flex-wrap gap-3 mt-2 animate-in slide-in-from-top-2 duration-300">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                        className={`px-6 py-2 rounded-full border transition-all ${formData.categoryId === cat.id ? 'bg-brand-teal text-brand-dark border-brand-teal' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-brand-teal text-brand-dark py-5 rounded-2xl text-2xl font-medium mt-6 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              >
                {isEditing ? 'حفظ التعديلات' : 'إضافة الآن'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksScreen;