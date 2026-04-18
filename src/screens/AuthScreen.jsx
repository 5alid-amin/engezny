import React, { useState } from 'react';
import { User, ArrowLeft, Zap, Eye, EyeOff } from 'lucide-react';

const AuthScreen = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.username && formData.password) {
            onLogin();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-[#022c35]" dir="rtl">

            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(52,165,147,0.2)_0%,rgba(0,59,70,0)_70%)] blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(52,165,147,0.15)_0%,rgba(0,59,70,0)_70%)] blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 p-4">
                <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 sm:p-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center">

                    {/* Logo/Icon */}
                    <div className="w-20 h-20 bg-gradient-to-tr from-[#34A593] to-[#074C5B] rounded-[2rem] flex items-center justify-center shadow-[0_0_30px_rgba(52,165,147,0.4)] mb-8 transform rotate-12 hover:rotate-0 transition-all duration-500">
                        <Zap size={40} className="text-white" fill="currentColor" />
                    </div>

                    <h2 className="text-3xl font-black text-white mb-2 text-center tracking-tight">
                        {isLogin ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}
                    </h2>
                    <p className="text-white/40 mb-10 text-center text-sm">
                        {isLogin ? 'سجل دخولك لمتابعة إنتاجيتك' : 'ابدأ رحلة الإنجاز معنا اليوم'}
                    </p>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">

                        {/* اسم المستخدم */}
                        <div className="flex flex-col gap-2">
                            <label className="text-white/50 text-xs font-bold mr-1 tracking-wider uppercase">اسم المستخدم</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#34A593] transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="أدخل اسمك"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-[#34A593] text-2xl font-medium placeholder-[#34A593]/20 focus:outline-none focus:border-[#34A593] focus:bg-white/10 transition-all text-left"
                                    dir="ltr"
                                    required
                                />
                            </div>
                        </div>

                        {/* كلمة المرور */}
                        <div className="flex flex-col gap-2">
                            <label className="text-white/50 text-xs font-bold mr-1 tracking-wider uppercase">كلمة المرور</label>
                            <div className="relative group">
                                {/* تم استبدال القفل هنا بالعين */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#34A593]/60 hover:text-[#34A593] transition-colors cursor-pointer z-20"
                                >
                                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                </button>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-[#34A593] text-2xl font-medium placeholder-[#34A593]/20 focus:outline-none focus:border-[#34A593] focus:bg-white/10 transition-all text-left"
                                    dir="ltr"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#0a1f24] hover:bg-[#07151a] border border-[#34A593]/30 text-white py-4 rounded-2xl font-bold text-lg mt-4 shadow-[0_0_20px_rgba(10,31,36,0.8)] hover:shadow-[0_0_30px_rgba(52,165,147,0.4)] hover:-translate-y-1 transition-all flex justify-center items-center gap-2 group"
                        >
                            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
                            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 w-full text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-white/60 hover:text-white transition-colors text-sm"
                            type="button"
                        >
                            {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
                            <span className="text-[#34A593] font-bold">
                                {isLogin ? 'سجل الآن' : 'سجل الدخول'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;