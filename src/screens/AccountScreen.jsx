import React, { useState, useEffect } from 'react';
import { User, LogOut, Save, Camera, AtSign, ChevronLeft, Trash2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const AccountScreen = ({ onLogout, setActiveTab }) => {
    const [profileEmoji, setProfileEmoji] = useState("");
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: localStorage.getItem('userName') || '',
    });

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRes = await axiosInstance.get(`/Account/profile/${userId}`);
                const data = userRes.data;

                const fetchedName = data.userName || data.username || '';
                const fetchedEmoji = data.profilePictureUrl || data.profilepictureurl || "";

                setFormData({ username: fetchedName });
                setProfileEmoji(fetchedEmoji);

                if (fetchedName) localStorage.setItem('userName', fetchedName);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchUserData();
    }, [userId]);

    const handleSaveUpdates = async () => {
        try {
            const updateDto = {
                userName: formData.username,
                profilePictureUrl: profileEmoji
            };
            await axiosInstance.put(`/Account/update/${userId}`, updateDto);
            localStorage.setItem('userName', formData.username);
            alert("تم التحديث بنجاح! ✅");
        } catch (error) {
            console.error("API Error Details:", error.response?.data);
            alert("فشل التحديث، راجع الكونسول.");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("حذف الحساب نهائياً؟")) {
            try {
                await axiosInstance.delete(`/Account/delete/${userId}`);
                onLogout();
            } catch (error) {
                alert("فشل الحذف.");
            }
        }
    };

    const handleEmojiChange = () => {
        const emoji = prompt("أدخل الأيقونة الجديدة:");
        if (emoji) setProfileEmoji(emoji);
    };

    if (loading && !formData.username) return <div className="min-h-screen flex items-center justify-center text-white">جاري التحميل...</div>;

    return (
        <div className="flex flex-col min-h-screen p-4 sm:p-8 font-sans relative text-right" dir="rtl">
            <div className="mb-10">
                <p className="text-white/40 mb-1 text-sm">إدارة بياناتك الشخصية</p>
                <h2 className="text-4xl font-bold text-white">إعدادات الحساب</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* كارت الصورة الشخصية */}
                <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center shadow-2xl">
                    <div className="relative group mb-6">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#34A593] to-[#074C5B] p-1">
                            <div className="w-full h-full rounded-full bg-[#003B46] border-4 border-[#074C5B] flex items-center justify-center relative overflow-hidden text-white">
                                <span className="text-5xl">
                                    {profileEmoji || (formData.username ? formData.username.slice(0, 2).toUpperCase() : "U")}
                                </span>
                                <div onClick={handleEmojiChange} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-6" dir="ltr">@{formData.username}</h3>
                    <div className="w-full flex flex-col gap-3">
                        <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5">
                            <LogOut size={20} /> تسجيل الخروج
                        </button>
                        <button onClick={handleDeleteAccount} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/10">
                            <Trash2 size={20} /> حذف الحساب
                        </button>
                    </div>
                </div>

                {/* فورم التعديل - تم التعديل هنا لحل مشكلة الخط العمودي */}
                <div className="lg:col-span-2 bg-[#0a1f24] rounded-[3rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* طبقة إضافية للشفافية بدلاً من backdrop-blur المسبب للمشكلة */}
                    <div className="absolute inset-0 bg-white/[0.02] pointer-events-none"></div>

                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                            <User className="text-[#34A593]" /> البيانات الأساسية
                        </h3>
                        <div className="max-w-md mb-12">
                            <label className="text-white/60 text-sm mb-2 block mr-1">اسم المستخدم</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40">
                                    <AtSign size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ username: e.target.value })}
                                    dir="ltr"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:border-[#34A593] outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-8">
                            <button onClick={handleSaveUpdates} className="bg-[#34A593] hover:bg-[#2b8a7b] text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center gap-3 self-start active:scale-95">
                                <Save size={22} /> حفظ التعديلات
                            </button>
                            <div className="pt-6 border-t border-white/5">
                                <button onClick={() => setActiveTab('stats')} className="flex items-center gap-2 text-white/40 hover:text-[#34A593] transition-colors group">
                                    <span>للمزيد من المعلومات والإحصاءات اضغط هنا</span>
                                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountScreen;