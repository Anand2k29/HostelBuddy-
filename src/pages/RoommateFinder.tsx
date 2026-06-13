import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Users, Sparkles, MessageSquare, Info, ShieldCheck, Heart, Moon, BookOpen, Trash2, X, RefreshCw, Send, ArrowLeft } from 'lucide-react';

interface Questionnaire {
  sleep: string;
  study: string;
  cleanliness: string;
  diet: string;
}

interface RoommateProfile {
  id: string;
  name: string;
  room: string;
  photo?: string;
  answers: Questionnaire;
  bio: string;
  contact: string;
  age: number;
  year: string;
  major: string;
  avatarGradient: string;
}

const MOCK_PROFILES: RoommateProfile[] = [
  {
    id: 'p1',
    name: 'Rohit Patel',
    room: '102-A',
    bio: 'I love watching movies, playing CS:GO, ordering late-night biryani, and studying with ambient lo-fi music. Chill roommate vibe!',
    contact: 'rohit.p@university.edu',
    age: 21,
    year: 'Senior',
    major: 'Business Admin',
    avatarGradient: 'from-sky-400 to-blue-600',
    answers: {
      sleep: 'NIGHT_OWL',
      study: 'AMBIENT',
      cleanliness: 'CASUAL',
      diet: 'NON_VEG'
    }
  },
  {
    id: 'p2',
    name: 'Priya Nair',
    room: '204-C',
    bio: 'Looking for a quiet, focused roommate. I sleep early, keep my desk pristine, and study in absolute silence. Respect others space.',
    contact: 'priya.n@university.edu',
    age: 20,
    year: 'Sophomore',
    major: 'English Literature',
    avatarGradient: 'from-pink-500 to-rose-600',
    answers: {
      sleep: 'EARLY_BIRD',
      study: 'SILENT',
      cleanliness: 'NEAT_FREAK',
      diet: 'VEG'
    }
  },
  {
    id: 'p3',
    name: 'Vihaan Sharma',
    room: '308-B',
    bio: 'Avid badminton player. I have a balanced sleep cycle, try to keep the room clean, and do not mind study sessions together.',
    contact: 'vihaan.s@university.edu',
    age: 21,
    year: 'Senior',
    major: 'Sports Science',
    avatarGradient: 'from-emerald-400 to-teal-600',
    answers: {
      sleep: 'BALANCED',
      study: 'COLLABORATIVE',
      cleanliness: 'NEAT_FREAK',
      diet: 'ANY'
    }
  },
  {
    id: 'p4',
    name: 'Ananya Iyer',
    room: '112-D',
    bio: 'Super friendly, love decorating the room! Balanced schedule. Messy desk but clean in general. Veg foodie.',
    contact: 'ananya.i@university.edu',
    age: 20,
    year: 'Junior',
    major: 'Fashion Design',
    avatarGradient: 'from-purple-500 to-indigo-600',
    answers: {
      sleep: 'BALANCED',
      study: 'AMBIENT',
      cleanliness: 'CASUAL',
      diet: 'VEG'
    }
  },
  {
    id: 'p5',
    name: 'Ishaan Verma',
    room: '401-A',
    bio: 'Highly structured routine. 10:00 PM sleep time. Pin drop silence for coding. Expect roommate agreement rules!',
    contact: 'ishaan.v@university.edu',
    age: 19,
    year: 'PhD Candidate',
    major: 'Theoretical Physics',
    avatarGradient: 'from-yellow-400 to-amber-600',
    answers: {
      sleep: 'EARLY_BIRD',
      study: 'SILENT',
      cleanliness: 'NEAT_FREAK',
      diet: 'ANY'
    }
  }
];

const MOCK_REPLIES: { [key: string]: string[] } = {
  p1: [
    "Ayyy! We matched! HostelBuddy says we are highly compatible. I am already planning our Valorant setup. Thinking of a mini snack bar, what do you think?",
    "Haha, awesome! Honestly, I just want a chill roommate to order late-night pizzas with. What's your go-to pizza topping?",
    "Nice! We are going to be the best roommate duo this hostel has ever seen! Let's build a epic gaming room agreement!"
  ],
  p2: [
    "Hi! I saw we had a high compatibility score. I really value having a quiet, neat space to study. How do you feel about study hours?",
    "That sounds reasonable! I usually sleep around 10 PM. As long as we keep our desks tidy, we will get along perfectly.",
    "Great! Let me know if you want to meet up on campus sometime to chat more about room arrangements."
  ],
  p3: [
    "Hey mate! Glad we matched. I'm usually out on the sports field or training during the day, but I keep the space clean. Do you play any sports?",
    "Nice! We should definitely hit the gym or court sometime. Or just watch IPL matches together in the common room. What team do you support?",
    "Ah cool! Looking forward to it. I'll make sure to get some extra storage for sports gear!"
  ],
  p4: [
    "Oh my gosh, hi! I am so excited we matched! Tell me everything about your style - should we go with a cozy bohemian vibe or modern minimalist for the room?",
    "Love that! I can bring some cool posters and fairy lights. By the way, I hope you don't mind if I occasionally store some extra bags in the closet space!",
    "Yay! Let's grab coffee at the campus canteen tomorrow to plan out our shopping list!"
  ],
  p5: [
    "Greetings. I have noted our roommate match. Before we proceed, you must review the 42-page Roommate Agreement. Let's start with Clause 1: Room temperature must remain at 72°F. Do you agree?",
    "Excellent. Clause 2: Thursdays are reservation nights for television viewing of Doctor Who. Under no circumstances can this schedule be altered.",
    "Fascinating. Your responses are within acceptable parameters. Please prepare for the official roommate induction ceremony next week."
  ]
};

interface SwipeCardProps {
  profile: RoommateProfile & { score: number };
  onSwipe: (direction: 'left' | 'right') => void;
  active: boolean;
  exitDirection: 'left' | 'right' | null;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ profile, onSwipe, active, exitDirection }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0.6, 1, 0.6]);

  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 110;
    if (info.offset.x < -threshold) {
      onSwipe('left');
    } else if (info.offset.x > threshold) {
      onSwipe('right');
    }
  };

  return (
    <motion.div
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute w-full max-w-[340px] md:max-w-[360px] h-[460px] bg-[#1f1f26] rounded border-3 border-[#101014] overflow-hidden flex flex-col justify-between select-none ${
        active ? 'z-20 cursor-grab active:cursor-grabbing' : 'z-10 scale-95 translate-y-3 opacity-60 pointer-events-none'
      }`}
      style={{
        boxShadow: active ? 'inset 2px 2px 0px rgba(255, 255, 255, 0.05), inset -2px -2px 0px rgba(0, 0, 0, 0.3), 0 8px 30px rgba(0,0,0,0.5)' : 'none',
        ...active ? { x, rotate, opacity } : {}
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: active ? 1 : 0.95, y: active ? 0 : 12, opacity: active ? 1 : 0.6 }}
      exit={{
        x: exitDirection === 'left' ? -350 : 350,
        opacity: 0,
        rotate: exitDirection === 'left' ? -25 : 25,
        transition: { duration: 0.25 }
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Body */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Swipe Overlays */}
        {active && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-6 left-6 z-30 bg-[#00e676] text-black font-black text-[10px] uppercase px-3.5 py-1.5 rounded border-2 border-black rotate-[-12deg] tracking-wider font-mc-sub shadow-md"
            >
              RECRUIT
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-6 right-6 z-30 bg-mc-red text-white font-black text-[10px] uppercase px-3.5 py-1.5 rounded border-2 border-black rotate-[12deg] tracking-wider font-mc-sub shadow-md"
            >
              SKIP
            </motion.div>
          </>
        )}

        {/* Gradient Avatar Slot */}
        <div className={`h-32 bg-gradient-to-br ${profile.avatarGradient} flex items-center justify-center relative border-b-3 border-[#101014]`}>
          <div className="text-white font-black text-3xl tracking-widest drop-shadow-[0_2px_0_rgba(0,0,0,0.8)] font-mc-title">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="absolute -bottom-4 left-5 flex items-center">
            <div className="bg-[#10b981] text-white px-3 py-1 rounded border border-[#101014] text-[9px] font-bold shadow-md flex items-center gap-1.5 font-mc-sub">
              <span>💎</span>
              <span>{profile.score}% Synergy</span>
            </div>
          </div>
        </div>

        {/* Profile Stats Content */}
        <div className="p-5 pt-7 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-white font-mc-sub uppercase tracking-wide leading-none">{profile.name}, {profile.age}</h3>
                <p className="text-[9px] text-mc-cyan font-mono-readable mt-1.5 uppercase tracking-wider">
                  {profile.year} • {profile.major}
                </p>
              </div>
              <span className="text-[8px] bg-[#141419] text-slate-400 font-mc-sub uppercase tracking-wider px-2 py-0.5 rounded border border-[#3c3c44] shrink-0">
                Slot {profile.room}
              </span>
            </div>
            <p className="text-xs text-slate-350 font-semibold leading-relaxed italic mt-2.5 font-mono-readable">
              "{profile.bio}"
            </p>
          </div>

          {/* Minecraft Status Tag Slots */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-[#141419] border border-[#26262a] p-2 rounded flex items-center space-x-2">
              <span className="text-xs">⏰</span>
              <div className="min-w-0">
                <p className="text-[8px] text-slate-500 font-mc-sub uppercase leading-none">Chrono</p>
                <p className="text-[9px] text-slate-300 font-mono-readable uppercase font-bold truncate mt-0.5">
                  {profile.answers.sleep.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="bg-[#141419] border border-[#26262a] p-2 rounded flex items-center space-x-2">
              <span className="text-xs">📚</span>
              <div className="min-w-0">
                <p className="text-[8px] text-slate-500 font-mc-sub uppercase leading-none">Vibe</p>
                <p className="text-[9px] text-slate-300 font-mono-readable uppercase font-bold truncate mt-0.5">
                  {profile.answers.study}
                </p>
              </div>
            </div>
            <div className="bg-[#141419] border border-[#26262a] p-2 rounded flex items-center space-x-2">
              <span className="text-xs">✨</span>
              <div className="min-w-0">
                <p className="text-[8px] text-slate-500 font-mc-sub uppercase leading-none">Clean</p>
                <p className="text-[9px] text-slate-300 font-mono-readable uppercase font-bold truncate mt-0.5">
                  {profile.answers.cleanliness.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="bg-[#141419] border border-[#26262a] p-2 rounded flex items-center space-x-2">
              <span className="text-xs">🍗</span>
              <div className="min-w-0">
                <p className="text-[8px] text-slate-500 font-mc-sub uppercase leading-none">Diet</p>
                <p className="text-[9px] text-slate-300 font-mono-readable uppercase font-bold truncate mt-0.5">
                  {profile.answers.diet.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const RoommateFinder: React.FC = () => {
  const [answers, setAnswers] = useState<Questionnaire | null>(null);
  const [tempAnswers, setTempAnswers] = useState<Questionnaire>({
    sleep: 'BALANCED',
    study: 'AMBIENT',
    cleanliness: 'CASUAL',
    diet: 'ANY'
  });

  const [matches, setMatches] = useState<(RoommateProfile & { score: number })[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [likes, setLikes] = useState<string[]>([]);
  const [passes, setPasses] = useState<string[]>([]);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const [showCelebration, setShowCelebration] = useState<(RoommateProfile & { score: number }) | null>(null);

  const [chatRoommateId, setChatRoommateId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{ [key: string]: { sender: 'user' | 'roommate'; text: string; timestamp: Date }[] }>({});
  const [typingState, setTypingState] = useState<{ [key: string]: boolean }>({});
  const [messageInput, setMessageInput] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatRoommateId, typingState]);

  const handleSelectOption = (key: keyof Questionnaire, value: string) => {
    setTempAnswers(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const calculateMatchScore = (userAnswers: Questionnaire, candidateAnswers: Questionnaire): number => {
    let matchesCount = 0;
    const totalQuestions = 4;

    if (userAnswers.sleep === candidateAnswers.sleep) matchesCount++;
    if (userAnswers.study === candidateAnswers.study) matchesCount++;
    if (userAnswers.cleanliness === candidateAnswers.cleanliness) matchesCount++;
    if (userAnswers.diet === 'ANY' || candidateAnswers.diet === 'ANY' || userAnswers.diet === candidateAnswers.diet) {
      matchesCount++;
    }

    return Math.round((matchesCount / totalQuestions) * 100);
  };

  const handleFindMatches = (e: React.FormEvent) => {
    e.preventDefault();
    const computedMatches = MOCK_PROFILES.map(profile => ({
      ...profile,
      score: calculateMatchScore(tempAnswers, profile.answers)
    })).sort((a, b) => b.score - a.score);

    setMatches(computedMatches);
    setAnswers(tempAnswers);
    setCurrentIndex(0);
    setLikes([]);
    setPasses([]);
    setChatMessages({});
  };

  const handleReset = () => {
    setAnswers(null);
    setMatches([]);
    setCurrentIndex(0);
    setLikes([]);
    setPasses([]);
    setChatRoommateId(null);
    setChatMessages({});
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= matches.length) return;
    const currentProfile = matches[currentIndex];

    setExitDirection(direction);

    setTimeout(() => {
      if (direction === 'right') {
        setLikes(prev => [...prev, currentProfile.id]);

        setChatMessages(prev => {
          if (!prev[currentProfile.id]) {
            const firstMsg = MOCK_REPLIES[currentProfile.id]?.[0] || "Hey there! Nice to match with you.";
            return {
              ...prev,
              [currentProfile.id]: [
                { sender: 'roommate', text: firstMsg, timestamp: new Date() }
              ]
            };
          }
          return prev;
        });

        if (currentProfile.score >= 75) {
          setShowCelebration(currentProfile);
        }
      } else {
        setPasses(prev => [...prev, currentProfile.id]);
      }

      setCurrentIndex(prev => prev + 1);
      setExitDirection(null);
    }, 150);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !chatRoommateId) return;

    const currentRoommateId = chatRoommateId;
    const userMsgText = messageInput;

    const userMessage = {
      sender: 'user' as const,
      text: userMsgText,
      timestamp: new Date()
    };

    setChatMessages(prev => ({
      ...prev,
      [currentRoommateId]: [...(prev[currentRoommateId] || []), userMessage]
    }));
    setMessageInput('');

    setTypingState(prev => ({ ...prev, [currentRoommateId]: true }));

    setTimeout(() => {
      setTypingState(prev => ({ ...prev, [currentRoommateId]: false }));

      setChatMessages(prev => {
        const history = prev[currentRoommateId] || [];
        const userMsgCount = history.filter(m => m.sender === 'user').length;
        
        const replies = MOCK_REPLIES[currentRoommateId] || [];
        const replyText = replies[userMsgCount] || "Sounds awesome! Let's sync up in person at the lobby or dining hall later today.";

        return {
          ...prev,
          [currentRoommateId]: [
            ...history,
            { sender: 'roommate' as const, text: replyText, timestamp: new Date() }
          ]
        };
      });
    }, 1500);
  };

  const getRoommateById = (id: string) => {
    return matches.find(p => p.id === id);
  };

  const activeMatchesList = matches.filter(profile => likes.includes(profile.id));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-mc-cyan to-[#2b2b35] rounded border-2 border-[#101014] flex items-center justify-center text-white shadow-md">
              <Users size={20} />
            </div>
            <h1 className="text-xl font-black text-white tracking-wider font-mc-title uppercase">Roommate Match Lobby</h1>
          </div>
          <p className="text-slate-400 font-mono-readable text-xs mt-1.5">
            [ Sync compatibility filters to discover other players on this server block ]
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!answers ? (
          // Questionnaire Form
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mc-card bg-[#1f1f26]/90 p-6 md:p-8 relative"
          >
            <div className="absolute inset-0 scanline opacity-5 pointer-events-none"></div>
            <div className="max-w-xl mx-auto space-y-8">
              <div className="text-center">
                <h3 className="text-xs font-black text-white font-mc-title uppercase">Attribute Matcher</h3>
                <p className="text-xs text-slate-500 font-mono-readable mt-1.5 uppercase tracking-widest">Select matrix details to initialize lobby deck</p>
              </div>

              <form onSubmit={handleFindMatches} className="space-y-6">
                {/* Sleep Schedule */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 tracking-wider uppercase flex items-center gap-1.5 font-mc-sub">
                    ⏰ 1. Chronology Vibe
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'EARLY_BIRD', label: 'Early Bird', desc: 'Sleep early, rise at dawn' },
                      { value: 'BALANCED', label: 'Balanced', desc: 'Typical 11 PM - 7 AM sleep' },
                      { value: 'NIGHT_OWL', label: 'Night Owl', desc: 'Late logs, sleep past midnight' }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectOption('sleep', opt.value)}
                        className={`p-4 text-left rounded border transition-all cursor-pointer ${
                          tempAnswers.sleep === opt.value
                            ? 'border-mc-cyan bg-[#2b2b35] text-[#00d8df] shadow-[inset_0_0_8px_rgba(0,216,223,0.15)]'
                            : 'border-[#26262a] hover:border-mc-cyan/40 text-slate-400 bg-[#141419]/70 hover:text-white'
                        }`}
                      >
                        <p className="font-bold text-xs font-mc-sub uppercase">{opt.label}</p>
                        <p className="text-[10px] text-slate-500 font-mono-readable mt-1">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Study Environment */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 tracking-wider uppercase flex items-center gap-1.5 font-mc-sub">
                    📚 2. Focus Matrix
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'SILENT', label: 'Silent Room', desc: 'Requires complete pin-drop quiet' },
                      { value: 'AMBIENT', label: 'Ambient Lofi', desc: 'Background chatter or soft music' },
                      { value: 'COLLABORATIVE', label: 'Co-Op Study', desc: 'Interactive review discussions' }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectOption('study', opt.value)}
                        className={`p-4 text-left rounded border transition-all cursor-pointer ${
                          tempAnswers.study === opt.value
                            ? 'border-mc-cyan bg-[#2b2b35] text-[#00d8df] shadow-[inset_0_0_8px_rgba(0,216,223,0.15)]'
                            : 'border-[#26262a] hover:border-mc-cyan/40 text-slate-400 bg-[#141419]/70 hover:text-white'
                        }`}
                      >
                        <p className="font-bold text-xs font-mc-sub uppercase">{opt.label}</p>
                        <p className="text-[10px] text-slate-500 font-mono-readable mt-1">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cleanliness Habits */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 tracking-wider uppercase flex items-center gap-1.5 font-mc-sub">
                    ✨ 3. Sanitation Order
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'NEAT_FREAK', label: 'Spotless Knight', desc: 'Highly organized desk slot' },
                      { value: 'CASUAL', label: 'Casual Tidy', desc: 'Weekly guild cleaning sweeps' },
                      { value: 'ANY', label: 'Easygoing', desc: 'Flexible, relaxed conditions' }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectOption('cleanliness', opt.value)}
                        className={`p-4 text-left rounded border transition-all cursor-pointer ${
                          tempAnswers.cleanliness === opt.value
                            ? 'border-mc-cyan bg-[#2b2b35] text-[#00d8df] shadow-[inset_0_0_8px_rgba(0,216,223,0.15)]'
                            : 'border-[#26262a] hover:border-mc-cyan/40 text-slate-400 bg-[#141419]/70 hover:text-white'
                        }`}
                      >
                        <p className="font-bold text-xs font-mc-sub uppercase">{opt.label}</p>
                        <p className="text-[10px] text-slate-500 font-mono-readable mt-1">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diet */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 tracking-wider uppercase flex items-center gap-1.5 font-mc-sub">
                    🍗 4. Rations Preference
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'VEG', label: 'Veg Only', desc: 'Strict vegetarian conditions' },
                      { value: 'NON_VEG', label: 'Non-Veg Room', desc: 'Permit non-veg items in room' },
                      { value: 'ANY', label: 'Any Diet', desc: 'No dietary matrix restrictions' }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectOption('diet', opt.value)}
                        className={`p-4 text-left rounded border transition-all cursor-pointer ${
                          tempAnswers.diet === opt.value
                            ? 'border-mc-cyan bg-[#2b2b35] text-[#00d8df] shadow-[inset_0_0_8px_rgba(0,216,223,0.15)]'
                            : 'border-[#26262a] hover:border-mc-cyan/40 text-slate-400 bg-[#141419]/70 hover:text-white'
                        }`}
                      >
                        <p className="font-bold text-xs font-mc-sub uppercase">{opt.label}</p>
                        <p className="text-[10px] text-slate-500 font-mono-readable mt-1">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-mc w-full py-3.5 uppercase tracking-widest"
                >
                  Launch Synergy Scanner
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          // Match Workspace (Deck + Matches List Side-by-side)
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            {/* Left Column: Deck Swiper */}
            <div className="lg:col-span-2 mc-card bg-[#1f1f26]/90 p-6 flex flex-col items-center justify-between min-h-[570px] relative overflow-hidden">
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none"></div>
              
              <div className="absolute top-4 left-4 z-30">
                <button
                  onClick={handleReset}
                  className="btn-mc py-1 px-3 uppercase text-[9px] bg-[#141419]"
                >
                  ← Reset Filters
                </button>
              </div>

              {/* Deck Info */}
              <div className="text-center pt-2 pb-6">
                <span className="text-[9px] bg-cyber-purple/15 text-mc-cyan border border-mc-cyan/30 font-mc-sub px-3.5 py-1.5 rounded uppercase tracking-wider">
                  Swiping Matrix
                </span>
                <p className="text-[9px] text-slate-500 font-mono-readable mt-3.5 uppercase tracking-widest">
                  Candidate {Math.min(currentIndex + 1, matches.length)} of {matches.length} pool entities
                </p>
              </div>

              {/* Swiping Deck Stack */}
              <div className="relative w-full max-w-[340px] md:max-w-[360px] h-[460px] flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  {currentIndex < matches.length ? (
                    matches.slice(currentIndex, currentIndex + 2).reverse().map((profile, index, arr) => {
                      const isTopCard = index === arr.length - 1;
                      return (
                        <SwipeCard
                          key={profile.id}
                          profile={profile}
                          active={isTopCard}
                          onSwipe={handleSwipe}
                          exitDirection={exitDirection}
                        />
                      );
                    })
                  ) : (
                    // Out of Matches state
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center space-y-4 px-6 flex flex-col items-center justify-center h-full py-8"
                    >
                      <div className="w-14 h-14 bg-[#141419] border-2 border-[#26262a] text-slate-500 rounded flex items-center justify-center shadow-inner">
                        👤
                      </div>
                      <h4 className="text-sm font-black text-white font-mc-title uppercase">Lobby Exceeded</h4>
                      <p className="text-[11px] text-slate-400 font-mono-readable leading-relaxed max-w-xs">
                        You have traversed the entire roommate pool. Adjust lifestyle parameters to search another block chunk.
                      </p>
                      <button
                        onClick={handleReset}
                        className="btn-mc py-2 px-4 uppercase text-[10px]"
                      >
                        Recalibrate Filters
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Swiper Controls */}
              {currentIndex < matches.length && (
                <div className="flex justify-center items-center gap-6 mt-6 pb-2 relative z-30">
                  <button
                    onClick={() => handleSwipe('left')}
                    className="w-12 h-12 bg-[#141419] hover:bg-red-950/20 border-2 border-mc-red rounded-full flex items-center justify-center text-mc-red shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="Skip Candidate"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentIndex(0);
                      setLikes([]);
                      setPasses([]);
                    }}
                    className="w-8 h-8 bg-[#141419] hover:bg-amber-950/20 border-2 border-cyber-yellow/40 rounded-full flex items-center justify-center text-mc-gold shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="Rewind Deck"
                  >
                    <RefreshCw size={14} strokeWidth={2.5} />
                  </button>

                  <button
                    onClick={() => handleSwipe('right')}
                    className="w-12 h-12 bg-[#141419] hover:bg-emerald-950/20 border-2 border-[#00e676] rounded-full flex items-center justify-center text-[#00e676] shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="Match Member"
                  >
                    <Heart size={20} strokeWidth={2.5} className="fill-[#00e676]/10" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Chat/Matches console */}
            <div className="mc-card bg-[#1f1f26]/90 overflow-hidden flex flex-col h-[570px] relative shadow-2xl">
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none"></div>
              
              <AnimatePresence mode="wait">
                {chatRoommateId ? (
                  // Chat workspace
                  <motion.div
                    key="chat-workspace"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col h-full bg-[#141419]/35"
                  >
                    {/* Chat Header */}
                    <div className="p-4 bg-[#1f1f26] border-b border-[#26262a] flex items-center justify-between shrink-0 shadow-md">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setChatRoommateId(null)}
                          className="p-1 hover:bg-[#2b2b35] rounded text-slate-400 hover:text-white cursor-pointer"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <div className={`w-8 h-8 rounded bg-gradient-to-br ${getRoommateById(chatRoommateId)?.avatarGradient} flex items-center justify-center text-white font-mc-sub text-xs font-bold`}>
                          {getRoommateById(chatRoommateId)?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-white font-mc-sub uppercase leading-none">{getRoommateById(chatRoommateId)?.name.split(' ')[0]}</h4>
                          <span className="text-[8px] text-[#00e676] font-mc-sub uppercase tracking-wider block mt-1">Lobby Connected</span>
                        </div>
                      </div>
                      <span className="text-[8px] bg-[#141419] text-slate-400 font-mono-readable uppercase tracking-wider px-2 py-0.5 rounded border border-[#26262a]">
                        Room {getRoommateById(chatRoommateId)?.room}
                      </span>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#141419]/50 no-scrollbar">
                      {chatMessages[chatRoommateId]?.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded px-3 py-2 text-xs leading-relaxed shadow-sm font-mono-readable border ${
                              msg.sender === 'user'
                                ? 'bg-[#2b2b35] text-[#00d8df] border-mc-cyan/40'
                                : 'bg-[#1f1f26] text-slate-350 border border-[#26262a]'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p className="text-[8px] text-right mt-1.5 font-bold text-slate-500">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {typingState[chatRoommateId] && (
                        <div className="flex justify-start">
                          <div className="bg-[#1f1f26] border border-[#26262a] rounded px-3 py-2.5 flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 bg-[#00d8df] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-[#00d8df] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-[#00d8df] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Transmit Console */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-[#1f1f26] border-t border-[#26262a] flex items-center space-x-2 shrink-0">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        placeholder={`Transmit chat packet...`}
                        className="flex-1 bg-[#141419] text-xs font-mono-readable p-2.5 border border-[#26262a] text-white rounded focus:outline-none focus:border-mc-cyan/50 focus:bg-[#141419] transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="btn-mc py-2 px-3 uppercase text-[9px]"
                      >
                        Send
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  // Matches Sidebar List
                  <motion.div
                    key="matches-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col h-full"
                  >
                    <div className="p-5 border-b border-[#26262a] shrink-0">
                      <h3 className="text-xs font-black text-white flex items-center gap-2 font-mc-title uppercase">
                        💚 synced party lists ({activeMatchesList.length})
                      </h3>
                      <p className="text-[9px] text-slate-500 font-mono-readable mt-1 uppercase tracking-wider">
                        Residents sharing reciprocal matches
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-[#141419]/25">
                      {activeMatchesList.length > 0 ? (
                        activeMatchesList.map(profile => (
                          <div
                            key={profile.id}
                            onClick={() => setChatRoommateId(profile.id)}
                            className="p-3 bg-[#141419]/80 hover:bg-[#2b2b35]/40 border border-[#26262a] hover:border-mc-cyan/30 rounded flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className={`w-8 h-8 rounded bg-gradient-to-br ${profile.avatarGradient} flex items-center justify-center text-white font-mc-sub text-xs font-bold shrink-0 shadow-sm`}>
                                {profile.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-[11px] font-bold text-white truncate font-mc-sub uppercase leading-none">{profile.name}</h4>
                                <p className="text-[9px] text-[#00d8df] font-mono-readable mt-1.5 truncate uppercase">
                                  {profile.score}% Synergy • Room {profile.room}
                                </p>
                              </div>
                            </div>
                            <button className="p-1.5 bg-[#2b2b35] hover:bg-[#2b2b35]/70 border border-[#3c3c44] text-[#00d8df] rounded shrink-0">
                              <MessageSquare size={12} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 space-y-3">
                          <div className="w-12 h-12 rounded bg-red-950/10 border border-red-900/20 text-mc-red flex items-center justify-center">
                            💚
                          </div>
                          <h5 className="text-[10px] font-black text-white font-mc-title uppercase">Lobbies vacant</h5>
                          <p className="text-[9px] text-slate-500 font-mono-readable leading-relaxed max-w-[190px] uppercase tracking-wider">
                            Sync compatibility with residents to initiate communication channels.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advancement celebration modal overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#0c0c0e]/95 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-full max-w-md bg-[#211f20] rounded border-3 border-[#f2ab13] p-8 text-center text-white shadow-2xl relative overflow-hidden"
              style={{
                boxShadow: 'inset 2px 2px 0 #3a3839, inset -2px -2px 0 #111011, 0 8px 30px rgba(0,0,0,0.8)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 scanline opacity-5 pointer-events-none"></div>
                <div className="absolute top-[-25%] left-[-25%] w-[320px] h-[320px] bg-mc-cyan/10 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-[-25%] right-[-25%] w-[320px] h-[320px] bg-mc-green/10 rounded-full blur-[80px]"></div>
              </div>

              {/* Trophy Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 bg-[#141419] border-2 border-[#3c3c44] flex items-center justify-center text-2xl shadow-inner animate-bounce">
                  🏆
                </div>
              </div>

              <h2 className="text-sm font-black text-[#f2ab13] font-mc-title uppercase tracking-widest leading-none">
                Synergy Synced!
              </h2>
              <p className="text-[10px] text-slate-400 font-mono-readable mt-2.5 uppercase tracking-widest">
                Advancement channel initialized with {showCelebration.name.split(' ')[0]}
              </p>

              {/* Circles */}
              <div className="flex items-center justify-center my-8 space-x-[-16px]">
                <div className="w-16 h-16 rounded bg-[#2b2b35] border-3 border-[#101014] flex items-center justify-center text-white font-mc-title text-sm relative z-10">
                  YOU
                </div>
                <div className="w-7 h-7 rounded-full bg-mc-cyan border-2 border-[#101014] flex items-center justify-center text-black z-20 shadow-md text-xs">
                  💚
                </div>
                <div className={`w-16 h-16 rounded bg-gradient-to-br ${showCelebration.avatarGradient} border-3 border-[#101014] flex items-center justify-center text-white font-mc-title text-sm relative z-10`}>
                  {showCelebration.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              <div className="bg-[#141419] border border-[#26262a] rounded p-4 mb-6">
                <span className="text-[#00e676] font-mc-sub text-[10px] block uppercase font-bold tracking-wider">⭐ {showCelebration.score}% synergy score</span>
                <span className="text-[10px] text-slate-400 font-mono-readable block mt-1.5 leading-relaxed">
                  Both value a <span className="text-white font-bold">{showCelebration.answers.study.toLowerCase()} study environment</span> with matching routines.
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setChatRoommateId(showCelebration.id);
                    setShowCelebration(null);
                  }}
                  className="btn-mc py-3.5 uppercase font-bold tracking-wide"
                >
                  Initiate Link
                </button>
                <button
                  onClick={() => setShowCelebration(null)}
                  className="btn-mc py-3 bg-[#141419] hover:bg-[#2b2b35]/60 text-slate-400 hover:text-white uppercase font-bold tracking-wide border-transparent shadow-none"
                >
                  Keep Scanning
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
