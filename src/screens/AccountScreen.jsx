import React, { useState } from 'react';
import { User, Lock, Unlock, LogOut, Save, Camera, Key, AtSign, Activity } from 'lucide-react';

const AccountScreen = ({ onLogout }) => {
    const [isEditable, setIsEditable] = useState(false);
    const [profileEmoji, setProfileEmoji] = useState("");
    const [formData, setFormData] = useState({
        name: 'خالد أمين',
        username: '@khaledamin',
        password: '••••••••',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // وظيفة فتح القفل للتعديل
    const handleUnlockPassword = () => {
        const oldPass = prompt("برجاء إدخال كلمة المرور القديمة لتتمكن من التعديل:");
        if (oldPass === "123") { // يمكنك تغيير هذا ليتناسب مع الباسوورد الفعلي
            setIsEditable(true);
            setFormData({ ...formData, password: "" });
        } else if (oldPass !== null) {
            alert("كلمة المرور غير صحيحة!");
        }
    };

    // وظيفة إضافة إيموجي
    const handleEmojiChange = () => {
        const emoji = prompt("أدخل الإيموجي الذي تريده لصورتك الشخصية:");
        if (emoji) setProfileEmoji(emoji);
    };

    // استخراج أول حرفين من الاسم تلقائياً
    const getInitials = (name) => {
        if (!name) return "م";
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + ' ' + parts[1][0]).slice(0, 3);
        }
        return name.slice(0, 2);
    };

    return (
        <div className="flex flex-col min-h-screen p-4 sm:p-8 font-sans relative overflow-hidden" dir="rtl">

            {/* Header */}
            <div className="flex justify-between items-center mb-10 relative z-50">
                <div className="text-right">
                    <p className="text-white/40 mb-1 text-sm tracking-wide">إدارة بياناتك الشخصية</p>
                    <h2 className="text-4xl font-bold text-white tracking-tight">إعدادات الحساب</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">

                {/* Profile Card */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#34A593]/20 rounded-full blur-[50px]"></div>

                        <div className="relative group mb-6 mt-4">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#34A593] to-[#074C5B] p-1 shadow-[0_0_30px_rgba(52,165,147,0.3)]">
                                <div className="w-full h-full rounded-full bg-[#003B46] border-4 border-[#074C5B] flex items-center justify-center overflow-hidden relative">
                                    <span className={`${profileEmoji ? 'text-6xl' : 'text-4xl'} font-black text-[#34A593]`}>
                                        {profileEmoji || getInitials(formData.name)}
                                    </span>
                                    <div
                                        onClick={handleEmojiChange}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                    >
                                        <Camera className="text-white" size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-1">{formData.name}</h3>
                        <p className="text-[#34A593] font-medium mb-6" dir="ltr">{formData.username}</p>

                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>

                        <div className="w-full flex flex-col gap-3">
                            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all text-white/80 hover:text-white group">
                                <div className="flex items-center gap-3">
                                    <Activity size={20} className="text-[#34A593]" />
                                    <span>النشاط والحالة</span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-[#34A593] shadow-[0_0_8px_#34A593]"></div>
                            </button>

                            <button 
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-transparent hover:border-red-500/20 transition-all text-red-400 group mt-4"
                            >
                                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="font-semibold">تسجيل الخروج</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Details */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-8 sm:p-10 border border-white/10 shadow-2xl relative flex-1 overflow-hidden">

                        <h3 className="text-2xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
                            <User className="text-[#34A593]" />
                            البيانات الشخصية
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <InputField
                                icon={<User size={18} />}
                                label="الاسم الكامل"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <InputField
                                icon={<AtSign size={18} />}
                                label="اسم المستخدم"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                dir="ltr"
                            />
                        </div>

                        <h3 className="text-2xl font-bold text-white mt-12 mb-8 relative z-10 flex items-center gap-3">
                            <Key className="text-[#34A593]" />
                            الأمان وكلمة المرور
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div className="flex flex-col gap-2">
                                <label className="text-white/60 text-sm font-medium mr-1">كلمة المرور</label>
                                <div className="relative group">
                                    <div
                                        onClick={handleUnlockPassword}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-white/40 hover:text-[#34A593] transition-colors z-20"
                                    >
                                        {isEditable ? <Unlock size={18} className="text-[#34A593]" /> : <Lock size={18} />}
                                    </div>
                                    <input
                                        type={isEditable ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        readOnly={!isEditable}
                                        dir="ltr"
                                        className={`w-full bg-white/5 border ${isEditable ? 'border-[#34A593] bg-white/10' : 'border-white/10'} rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:border-[#34A593] transition-all`}
                                    />
                                </div>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleUnlockPassword}
                                    className="h-[60px] w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-medium transition-all duration-300"
                                >
                                    تغيير كلمة المرور
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10 flex justify-end relative z-10">
                            <button className="bg-gradient-to-r from-[#34A593] to-[#2b8a7b] hover:from-[#3bd1ba] hover:to-[#34A593] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(52,165,147,0.4)] hover:shadow-[0_0_30px_rgba(52,165,147,0.6)] hover:-translate-y-1 transition-all flex items-center gap-3 group">
                                <Save size={22} className="group-hover:scale-110 transition-transform" />
                                حفظ التعديلات
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ icon, label, name, value, onChange, type = "text", dir = "rtl" }) => (
    <div className="flex flex-col gap-2">
        <label className="text-white/60 text-sm font-medium mr-1">{label}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#34A593] transition-colors">
                {icon}
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                dir={dir}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-white/20 focus:outline-none focus:border-[#34A593] focus:bg-white/10 transition-all"
            />
        </div>
    </div>
);

export default AccountScreen;
