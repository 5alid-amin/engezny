import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Check, Plus, X, Loader2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance'; // Interceptor بتاعنا

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // سحب الـ userId من التخزين المحلي
  const userId = localStorage.getItem('userId');

  // Modal States
  const [formData, setFormData] = useState({ title: '', icon: '', useCustomIcon: false });

  // 1. جلب البيانات من الباك إند عند تحميل الصفحة
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // GetById(int userid) -> api/Categories/{userid}
      const response = await axiosInstance.get(`/Categories/${userId}`);
      setCategories(response.data);
    } catch (error) {
      console.error("خطأ في جلب التصنيفات:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setIsEditing(cat.id);
      setFormData({
        title: cat.name, // الباك إند بيبعت name
        icon: cat.iconName, // الباك إند بيبعت iconName
        useCustomIcon: true
      });
    } else {
      setIsEditing(null);
      setFormData({ title: '', icon: '', useCustomIcon: false });
    }
    setIsModalOpen(true);
  };

  // 2. حذف تصنيف
  const handleDelete = async (id) => {
    if (!window.confirm("متأكد إنك عايز تحذف التصنيف ده؟")) return;

    try {
      // Delete(int id, [FromQuery] int userId)
      await axiosInstance.delete(`/Categories/${id}?userId=${userId}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      alert("فشل الحذف، تأكد من الصلاحيات");
    }
  };

  // 3. إضافة أو تعديل
  const handleSave = async () => {
    if (!formData.title) return;

    const finalIcon = formData.useCustomIcon && formData.icon
      ? formData.icon
      : formData.title.charAt(0).toUpperCase();

    const payload = {
      name: formData.title,
      iconName: finalIcon,
      userId: parseInt(userId)
    };

    try {
      if (isEditing) {
        // Update(int id, CreateCategoryDto dto, int userId)
        const response = await axiosInstance.put(`/Categories/${isEditing}?userId=${userId}`, payload);
        setCategories(categories.map(c => c.id === isEditing ? response.data : c));
      } else {
        // Create(CreateCategoryDto dto)
        const response = await axiosInstance.post('/Categories', payload);
        setCategories([...categories, response.data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("خطأ في الحفظ:", error);
      alert("حصلت مشكلة وأحنا بنحفظ البيانات");
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full relative p-8">

      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center mt-4 mb-12">
        <h2 className="text-4xl text-white font-bold mb-3 tracking-tight">هتركز علي اي الفتره دي..</h2>
        <p className="text-brand-gray text-lg opacity-70">متسرحش اوي ..</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="text-brand-teal animate-spin" size={48} />
        </div>
      )}

      {/* Categories Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto w-full mb-24">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/10 shadow-xl relative overflow-hidden transition-all duration-500 hover:bg-white/10 hover:-translate-y-2"
            >
              <div className="flex flex-row-reverse items-center justify-between relative z-10">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-black/30 border-[0.5px] border-[#80A1BA]/50"
                  style={{ backgroundColor: '#0E2F35' }}
                >
                  {cat.iconName}
                </div>

                <div className="text-right">
                  <span className="text-xs tracking-[0.2em] text-brand-gray/50 uppercase block mb-2">CATEGORY / {cat.id}</span>
                  <h3 className="text-3xl text-white font-bold">{cat.name}</h3>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => handleOpenModal(cat)}
                  className="p-3 rounded-xl bg-white/5 text-brand-gray hover:text-brand-teal hover:bg-white/10 transition-all"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-3 rounded-xl bg-white/5 text-brand-gray hover:text-red-400 hover:bg-white/10 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <div className="absolute bottom-10 right-0 translate-x-[-40px] z-30 pointer-events-none">
        <button
          onClick={() => handleOpenModal()}
          className="w-20 h-20 bg-brand-teal text-brand-dark rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(52,165,147,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto"
        >
          <Plus size={35} strokeWidth={2.5} />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />

          <div className="bg-brand-surface border border-white/10 w-full max-w-lg rounded-[3.5rem] p-12 relative z-10 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 left-8 text-white/30 hover:text-white transition-colors">
              <X size={32} />
            </button>

            <h2 className="text-3xl text-white text-right mb-10 font-bold">
              {isEditing ? 'تعديل الفئة' : 'فئة جديدة'}
            </h2>

            <div className="flex flex-col gap-6 text-right">
              <div>
                <label className="text-brand-gray block mb-3 text-lg">اسم الفئة</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl text-white focus:outline-none focus:border-brand-teal/50 transition-all text-right"
                  placeholder="مثلاً: تعلم، رياضة، عمل"
                />
              </div>

              <div className="flex flex-col gap-4 py-4 border-y border-white/5">
                <label className="flex items-center justify-end gap-3 cursor-pointer group">
                  <span className="text-lg text-white/80 group-hover:text-brand-teal transition-colors">تخصيص أيقونة (Emoji)</span>
                  <div
                    onClick={() => setFormData({ ...formData, useCustomIcon: !formData.useCustomIcon })}
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${formData.useCustomIcon ? 'bg-brand-teal border-brand-teal' : 'border-white/20'}`}
                  >
                    {formData.useCustomIcon && <Check size={18} className="text-brand-dark" />}
                  </div>
                </label>

                {formData.useCustomIcon && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <input
                      type="text"
                      maxLength="2"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-20 bg-white/5 border border-white/10 rounded-2xl p-4 text-3xl text-center focus:outline-none focus:border-brand-teal/50 transition-all mx-auto block"
                      placeholder="😊"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-brand-teal text-brand-dark py-5 rounded-2xl text-xl font-bold mt-4 hover:shadow-[0_10px_30px_rgba(52,165,147,0.3)] active:scale-95 transition-all"
              >
                {isEditing ? 'حفظ التعديلات' : 'إضافة الفئة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesScreen;