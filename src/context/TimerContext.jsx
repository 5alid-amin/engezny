import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

import focusStartSound from '../assets/sounds/focus_start.wav';
import focusCompleteSound from '../assets/sounds/focus_complete.wav';
import breakCompleteSound from '../assets/sounds/break_complete.wav';
import longBreakSound from '../assets/sounds/Long_Break.mp3';
import TimerNotification from '../components/TimerNotification';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  // --- الحالات الأساسية ---
  const [focusTime, setFocusTime] = useState(() => {
    const saved = localStorage.getItem('timerFocusTime');
    return saved ? parseInt(saved) : 25;
  });
  const [breakTime, setBreakTime] = useState(() => {
    const saved = localStorage.getItem('timerBreakTime');
    return saved ? parseInt(saved) : 5;
  });

  // --- الحالات الجديدة للبريك الطويل ---
  const [longBreakTime, setLongBreakTime] = useState(() => {
    const saved = localStorage.getItem('timerLongBreakTime');
    return saved ? parseInt(saved) : 15;
  });
  const [longBreakInterval, setLongBreakInterval] = useState(() => {
    const saved = localStorage.getItem('timerLongBreakInterval');
    return saved ? parseInt(saved) : 4;
  });
  const [completedSessions, setCompletedSessions] = useState(() => {
    const saved = localStorage.getItem('timerCompletedSessions');
    return saved ? parseInt(saved) : 0;
  });
  const [isLongBreak, setIsLongBreak] = useState(() => {
    return localStorage.getItem('timerIsLongBreak') === 'true';
  });

  const [isFocusSession, setIsFocusSession] = useState(() => {
    const saved = localStorage.getItem('timerIsFocusSession');
    return saved === null ? true : saved === 'true';
  });
  const [isActive, setIsActive] = useState(() => {
    const saved = localStorage.getItem('timerIsActive');
    return saved === 'true';
  });
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const savedSeconds = localStorage.getItem('timerSecondsLeft');
    const savedEndTime = localStorage.getItem('timerTargetEndTime');
    const savedIsActive = localStorage.getItem('timerIsActive') === 'true';

    if (savedIsActive && savedEndTime) {
      const remaining = Math.max(0, Math.ceil((parseInt(savedEndTime) - Date.now()) / 1000));
      return remaining;
    }
    return savedSeconds ? parseInt(savedSeconds) : 25 * 60;
  });

  const audioRefs = {
    focusStart: useRef(new Audio(focusStartSound)),
    focusComplete: useRef(new Audio(focusCompleteSound)),
    breakComplete: useRef(new Audio(breakCompleteSound)),
    longBreak: useRef(new Audio(longBreakSound))
  };

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || 'يا بطل';
  
  const [notification, setNotification] = useState({ show: false, type: '', duration: 0 });

  // حفظ الحالة في localStorage
  useEffect(() => {
    localStorage.setItem('timerFocusTime', focusTime);
    localStorage.setItem('timerBreakTime', breakTime);
    localStorage.setItem('timerLongBreakTime', longBreakTime);
    localStorage.setItem('timerLongBreakInterval', longBreakInterval);
    localStorage.setItem('timerCompletedSessions', completedSessions);
    localStorage.setItem('timerIsLongBreak', isLongBreak);
    localStorage.setItem('timerIsFocusSession', isFocusSession);
    localStorage.setItem('timerIsActive', isActive);
    if (!isActive) {
      localStorage.setItem('timerSecondsLeft', secondsLeft);
    }
  }, [focusTime, breakTime, longBreakTime, longBreakInterval, completedSessions, isLongBreak, isFocusSession, isActive, secondsLeft]);

  const recordFocusSession = async (minutes) => {
    if (!userId) return;
    try {
      await axiosInstance.post('/FocusSessions', {
        userId: parseInt(userId),
        durationInMinutes: parseInt(minutes)
      });
      console.log("تم تسجيل جلسة التركيز بنجاح 💪");
    } catch (error) {
      console.error("فشل في تسجيل الجلسة:", error);
    }
  };

  const playSound = (audioObj) => {
    if (audioObj.current) {
      audioObj.current.currentTime = 0;
      audioObj.current.play().catch(err => console.error("خطأ في تشغيل الصوت:", err));
    }
  };

  const triggerNotification = (type, duration) => {
    setNotification({ show: true, type, duration });
    
    // إشعار على مستوى نظام التشغيل (OS Notification)
    let message = "";
    if (type === 'shortBreak') {
      message = `هناخد بريك ${duration} دقايق يا ${userName} ليسجووو..`;
    } else if (type === 'focus') {
      message = "هنبدأ فترة تركيز جديده حماسيه ليسجوو .. ناار🔥";
    } else if (type === 'longBreak') {
      message = "عاااش علي الشغل ودلوقتي وقت اللعب 🎉✨";
    }

    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Engz.ny (إنجزني)", { body: message });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("Engz.ny (إنجزني)", { body: message });
          }
        });
      }
    }
  };

  // المنطق الرئيسي للعداد
  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        const endTime = localStorage.getItem('timerTargetEndTime');
        if (endTime) {
          const remaining = Math.max(0, Math.ceil((parseInt(endTime) - Date.now()) / 1000));
          setSecondsLeft(remaining);
        } else {
          setSecondsLeft(prev => prev - 1);
        }
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      let nextSessionIsFocus = false;
      let nextIsLongBreak = false;
      let nextDuration = 0;

      if (isFocusSession) {
        // انتهت جلسة التركيز
        recordFocusSession(focusTime);
        const newCount = completedSessions + 1;

        if (newCount >= longBreakInterval) {
          // حان وقت البريك الطويل
          playSound(audioRefs.longBreak); // تشغيل صوت البريك الطويل
          triggerNotification('longBreak', longBreakTime);
          nextSessionIsFocus = false;
          nextIsLongBreak = true;
          nextDuration = longBreakTime * 60;
          setCompletedSessions(0);
        } else {
          // بريك قصير عادي
          playSound(audioRefs.focusComplete);
          triggerNotification('shortBreak', breakTime);
          nextSessionIsFocus = false;
          nextIsLongBreak = false;
          nextDuration = breakTime * 60;
          setCompletedSessions(newCount);
        }
      } else {
        // انتهى البريك (سواء طويل أو قصير)
        playSound(audioRefs.breakComplete);
        triggerNotification('focus', focusTime);
        nextSessionIsFocus = true;
        nextIsLongBreak = false;
        nextDuration = focusTime * 60;
      }

      setIsFocusSession(nextSessionIsFocus);
      setIsLongBreak(nextIsLongBreak);
      setSecondsLeft(nextDuration);

      const newEndTime = Date.now() + nextDuration * 1000;
      localStorage.setItem('timerTargetEndTime', newEndTime);
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, isFocusSession, completedSessions, focusTime, breakTime, longBreakTime, longBreakInterval]);

  // تحديث الوقت عند العودة للتابة (للدقة)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        const endTime = localStorage.getItem('timerTargetEndTime');
        if (endTime) {
          const remaining = Math.max(0, Math.ceil((parseInt(endTime) - Date.now()) / 1000));
          setSecondsLeft(remaining);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive]);

  const handleStartAction = () => {
    playSound(audioRefs.focusStart);
    const endTime = Date.now() + secondsLeft * 1000;
    localStorage.setItem('timerTargetEndTime', endTime);
    setIsActive(true);

    // طلب إذن الإشعارات من المتصفح لو لسه متحددش
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const handlePauseAction = () => {
    setIsActive(false);
    localStorage.removeItem('timerTargetEndTime');
  };

  const handleResetAction = () => {
    setIsActive(false);
    localStorage.removeItem('timerTargetEndTime');
    let resetSeconds = focusTime * 60;
    if (!isFocusSession) {
      resetSeconds = (isLongBreak ? longBreakTime : breakTime) * 60;
    }
    setSecondsLeft(resetSeconds);
  };

  const handleSkipAction = () => {
    if (isFocusSession) return;
    
    playSound(audioRefs.breakComplete);
    triggerNotification('focus', focusTime);
    setIsFocusSession(true);
    setIsLongBreak(false);
    setSecondsLeft(focusTime * 60);
    
    if (isActive) {
      const newEndTime = Date.now() + focusTime * 60 * 1000;
      localStorage.setItem('timerTargetEndTime', newEndTime);
    } else {
      localStorage.removeItem('timerTargetEndTime');
    }
  };

  const saveSettings = (f, b, lb, lbi) => {
    const newF = Math.min(60, Math.max(1, parseInt(f) || 1));
    const newB = Math.min(60, Math.max(1, parseInt(b) || 1));
    const newLB = Math.min(60, Math.max(1, parseInt(lb) || 1));
    const newLBI = Math.min(5, Math.max(2, parseInt(lbi) || 2));

    setFocusTime(newF);
    setBreakTime(newB);
    setLongBreakTime(newLB);
    setLongBreakInterval(newLBI);

    let newSeconds = newF * 60;
    if (!isFocusSession) {
      newSeconds = (isLongBreak ? newLB : newB) * 60;
    }
    setSecondsLeft(newSeconds);

    if (isActive) {
      const newEndTime = Date.now() + newSeconds * 1000;
      localStorage.setItem('timerTargetEndTime', newEndTime);
    }
  };

  return (
    <TimerContext.Provider value={{
      focusTime, setFocusTime,
      breakTime, setBreakTime,
      longBreakTime, setLongBreakTime,
      longBreakInterval, setLongBreakInterval,
      completedSessions, setCompletedSessions,
      isLongBreak, setIsLongBreak,
      isFocusSession, setIsFocusSession,
      isActive, setIsActive,
      secondsLeft, setSecondsLeft,
      handleStartAction, handlePauseAction, handleResetAction, handleSkipAction,
      saveSettings, playSound, audioRefs
    }}>
      {children}
      <TimerNotification 
        show={notification.show} 
        type={notification.type} 
        duration={notification.duration} 
        userName={userName}
        onComplete={() => setNotification({ ...notification, show: false })}
      />
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);