import React, { useState } from 'react';
import {
  Pencil,
  Trash2,
  Check,
  Plus,
  X,
  ChevronDown
} from 'lucide-react';

const initialTasks = [
  {
    id: 1,
    title: 'مراجعة نظام التصميم "التدفق الأثيري"',
    description: 'تحديث تدرجات الألوان والتأكد من مطابقة جميع المكونات للمعايير الجديدة.',
    tag: 'تصميم',
    tagColor: 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30',
    status: 'pending',
  },
  {
    id: 2,
    title: 'برمجة واجهة المهام الرئيسية',
    description: 'استخدام Tailwind CSS لبناء المكونات التفاعلية وتطبيق تأثيرات الزجاج.',
    tag: 'تطوير',
    tagColor: 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30',
    status: 'pending',
  },
  {
    id: 3,
    title: 'اجتماع الفريق الصباحي',
    description: 'تمت مناقشة تحديثات الأسبوع وتوزيع المهام الجديدة.',
    tag: 'إدارة',
    tagColor: 'bg-white/10 text-white/70 border border-white/10',
    status: 'completed',
  }
];

const TasksScreen = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [showProjectList, setShowProjectList] = useState(false);

  // Form States
  const [formData, setFormData] = useState({ title: '', description: '', tag: 'تصميم' });

  // Function to play reward sound
  const playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log("Sound play blocked by browser"));
  };

  const handleToggleStatus = (id) => {
    const newTasks = tasks.map(t => {
      if (t.id === id) {
        const newStatus = t.status === 'completed' ? 'pending' : 'completed';
        if (newStatus === 'completed') playSuccessSound(); // Play sound on check
        return { ...t, status: newStatus };
      }
      return t;
    });
    setTasks(newTasks);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setIsEditing(task.id);
      setFormData({ title: task.title, description: task.description, tag: task.tag });
      setShowProjectList(true);
    } else {
      setIsEditing(null);
      setFormData({ title: '', description: '', tag: 'تصميم' });
      setShowProjectList(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) return;
    if (isEditing) {
      setTasks(tasks.map(t => t.id === isEditing ? { ...t, ...formData } : t));
    } else {
      const newTask = {
        id: Date.now(),
        ...formData,
        tagColor: 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30',
        status: 'pending'
      };
      setTasks([newTask, ...tasks]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 h-full relative p-8">

      {/* Task List */}
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 mt-12 mb-24">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 flex items-center gap-8 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.2)] transition-all duration-300
              ${task.status === 'completed' ? 'opacity-50' : 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-white/10 hover:-translate-y-1'}
            `}
          >
            {/* Status Icon / Checkbox */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => handleToggleStatus(task.id)}>
              {task.status === 'completed' ? (
                <div className="w-12 h-12 rounded-full bg-brand-teal/20 border border-brand-teal/50 flex items-center justify-center">
                  <Check size={24} className="text-brand-teal" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-brand-teal/40 flex items-center justify-center p-1 hover:bg-brand-teal/10 transition-all">
                  <div className="w-full h-full rounded-full border-2 border-transparent"></div>
                </div>
              )}
            </div>

            {/* Task Content */}
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end gap-4 mb-3">
                <span className={`px-4 py-1.5 rounded-full text-xs tracking-wider ${task.tagColor}`}>
                  {task.tag}
                </span>
              </div>

              {/* Title with Centered Animated Strikethrough */}
              <div className="relative inline-block group">
                <h3 className={`text-2xl mb-2 tracking-wide font-medium transition-colors duration-500 ${task.status === 'completed' ? 'text-white/40' : 'text-white'}`}>
                  {task.title}
                </h3>
                {/* The Animated Line - Centered exactly on text height */}
                <span
                  className={`absolute top-[48%] right-0 h-[3px] bg-brand-teal/60 transition-all duration-500 ease-in-out pointer-events-none rounded-full
                    ${task.status === 'completed' ? 'w-full' : 'w-0'}`}
                />
              </div>

              <p className="text-base text-brand-gray leading-relaxed">{task.description}</p>
            </div>

            {/* Actions (Pencil & Trash) */}
            <div className="flex flex-col items-center justify-center gap-5 border-r border-white/10 pr-8">
              <button
                onClick={() => handleOpenModal(task)}
                className="text-white/40 hover:text-brand-teal transition-all hover:scale-110"
              >
                <Pencil size={22} />
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-white/40 hover:text-red-400 transition-all hover:scale-110"
              >
                <Trash2 size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button - Dynamic Positioning */}
      {/* تم استخدام absolute و right-0 ليكون دائماً على يمين المحتوى (يسار السايد بار) */}
      <div className="absolute bottom-10 right-0 translate-x-[-40px] z-30 pointer-events-none">
        <button
          onClick={() => handleOpenModal()}
          className="w-20 h-20 bg-brand-teal text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(52,165,147,0.3)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(52,165,147,0.5)] hover:scale-110 pointer-events-auto"
        >
          <Plus size={35} strokeWidth={2.5} />
        </button>
      </div>

      {/* Add/Edit Modal */}
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

            <div className="flex flex-col gap-8 text-right">
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

              <div>
                <label className="text-brand-gray block mb-3 text-lg">التفاصيل (اختياري)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl text-white focus:outline-none focus:border-brand-teal/50 h-32 resize-none transition-all"
                  placeholder="أضف وصفاً بسيطاً..."
                />
              </div>

              {/* Project Toggle */}
              <div className="flex flex-col gap-4">
                <label className="flex items-center justify-end gap-3 cursor-pointer group">
                  <span className="text-lg text-white/80 group-hover:text-brand-teal transition-colors">اختيار مشروع</span>
                  <div
                    onClick={() => setShowProjectList(!showProjectList)}
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${showProjectList ? 'bg-brand-teal border-brand-teal' : 'border-white/20'}`}
                  >
                    {showProjectList && <Check size={18} className="text-brand-dark" />}
                  </div>
                </label>

                {showProjectList && (
                  <div className="flex flex-row-reverse gap-3 mt-2 animate-in slide-in-from-top-2 duration-300">
                    {['تصميم', 'تطوير', 'إدارة', 'إبداع'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFormData({ ...formData, tag: cat })}
                        className={`px-6 py-2 rounded-full border transition-all ${formData.tag === cat ? 'bg-brand-teal text-brand-dark border-brand-teal' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
                      >
                        {cat}
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