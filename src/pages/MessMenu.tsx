import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Star, ThumbsUp, ThumbsDown, MessageSquare, Award, Clock } from 'lucide-react';

interface Meal {
  name: string;
  time: string;
  items: string[];
  likes: number;
  dislikes: number;
  userVoted?: 'LIKE' | 'DISLIKE';
}

interface DayMenu {
  [mealName: string]: Meal;
}

interface WeeklyMenu {
  [day: string]: DayMenu;
}

interface MessMenuProps {
  gainXp?: (amount: number) => void;
  gainCoins?: (amount: number) => void;
}

const INITIAL_WEEKLY_MENU: WeeklyMenu = {
  Monday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Idli Sambar', 'Coconut Chutney', 'Boiled Eggs / Banana', 'Tea / Coffee / Milk'], likes: 42, dislikes: 4 },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Steamed Rice', 'Dal Tadka', 'Alu Gobi Sukha', 'Chapatis', 'Curd & Salad'], likes: 35, dislikes: 8 },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Veg Samosa (2 pcs)', 'Green Chutney', 'Tea / Coffee'], likes: 58, dislikes: 2 },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Jeera Rice', 'Kadhi Pakora', 'Bhindi Fry', 'Chapatis', 'Rice Kheer'], likes: 49, dislikes: 5 }
  },
  Tuesday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Aloo Paratha', 'Chilled Curd & Pickle', 'Butter', 'Tea / Coffee / Milk'], likes: 65, dislikes: 3 },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Veg Dum Biryani', 'Onion Raita', 'Mirchi Ka Salan', 'Roasted Papad'], likes: 72, dislikes: 4 },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Onion Pakoda', 'Tomato Ketchup', 'Tea / Coffee'], likes: 51, dislikes: 6 },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Plain Rice', 'Paneer Butter Masala', 'Dal Makhani', 'Butter Roti', 'Gulab Jamun (1 pc)'], likes: 84, dislikes: 2 }
  },
  Wednesday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Indori Poha', 'Sev & Onion', 'Jalebi', 'Tea / Coffee / Milk'], likes: 55, dislikes: 5 },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Steamed Rice', 'Punjabi Rajma Masala', 'Aloo Gajar', 'Tandoori Roti', 'Spiced Buttermilk'], likes: 48, dislikes: 7 },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Grilled Veg Sandwich', 'Potato Chips', 'Tea / Coffee'], likes: 62, dislikes: 3 },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Steamed Rice', 'Egg Curry / Paneer Bhurji', 'Moong Dal', 'Chapatis', 'Vanilla Ice Cream'], likes: 69, dislikes: 6 }
  },
  Thursday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Veg Uttapam', 'Coconut & Tomato Chutney', 'Fruits', 'Tea / Coffee / Milk'], likes: 38, dislikes: 9 },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Jeera Rice', 'Yellow Dal Fry', 'Mix Veg Curry', 'Chapatis', 'Boondi Raita'], likes: 40, dislikes: 11 },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Dhokla with Mustard & Chilli', 'Imli Chutney', 'Tea / Coffee'], likes: 44, dislikes: 8 },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Veg Pulao', 'Malai Kofta Curry', 'Dal Lasuni', 'Butter Naan', 'Fruit Custard'], likes: 78, dislikes: 3 }
  },
  Friday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Puri (4 pcs)', 'Alu Tomato Curry', 'Suji Halwa', 'Tea / Coffee / Milk'], likes: 70, dislikes: 4 },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Steamed Rice', 'Sambhar & Rasam', 'Potato Fry (South Style)', 'Chapatis', 'Curd'], likes: 43, dislikes: 9 },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Aloo Bonda', 'Mint Chutney', 'Tea / Coffee'], likes: 52, dislikes: 4 },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Veg Fried Rice', 'Veg Manchurian Gravy', 'Spring Rolls', 'Chocolate Ice Cream'], likes: 81, dislikes: 3 }
  },
  Saturday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Chole Bhature', 'Sweet Lassi', 'Pickle & Salad', 'Tea / Coffee'], likes: 88, dislikes: 2 },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Steamed Rice', 'Dal Palak', 'Jeera Aloo', 'Chapatis', 'Butter Milk'], likes: 36, dislikes: 14 },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Sweet Cookies / Biscuits', 'Salted Peanuts', 'Tea / Coffee'], likes: 31, dislikes: 12 },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Plain Rice', 'Shahi Paneer', 'Dal Fry', 'Butter Roti', 'Bengali Rasgulla'], likes: 79, dislikes: 5 }
  },
  Sunday: {
    Breakfast: { name: 'Breakfast', time: '08:00 - 09:30 AM', items: ['Masala Dosa', 'Sambar & Chutney Duo', 'Boiled Eggs / Apple', 'Tea / Coffee / Milk'], likes: 82, dislikes: 2 },
    Lunch: { name: 'Lunch', time: '12:30 - 02:30 PM', items: ['Veg Thali Special', 'Shahi Kaju Curry', 'Veg Pulao', 'Dal Tadka', 'Butter Naan', 'Gulab Jamun'], likes: 91, dislikes: 1 },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Atta Maggi with Veggies', 'Tea / Coffee / Cold Coffee'], likes: 95, dislikes: 0 },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Steamed Rice', 'Sev Tomato Curry', 'Yellow Dal', 'Chapatis', 'Fresh Fruits'], likes: 45, dislikes: 8 }
  }
};

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface RPGStats {
  hunger: number;
  hearts: number;
  buff?: string;
  buffColor?: string;
}

const getItemRPGStats = (item: string): RPGStats => {
  const name = item.toLowerCase();
  if (name.includes('paneer') || name.includes('biryani') || name.includes('bhature') || name.includes('dosa') || name.includes('thali') || name.includes('makhani') || name.includes('kofta')) {
    return { hunger: 4, hearts: 3, buff: 'Strength II', buffColor: 'text-red-400 border-red-500/30 bg-red-500/10' };
  }
  if (name.includes('tea') || name.includes('coffee') || name.includes('milk') || name.includes('lassi') || name.includes('buttermilk')) {
    return { hunger: 1, hearts: 1, buff: 'Speed I', buffColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' };
  }
  if (name.includes('idli') || name.includes('poha') || name.includes('uttapam') || name.includes('paratha') || name.includes('puri') || name.includes('sandwich')) {
    return { hunger: 3, hearts: 2, buff: 'Haste I', buffColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
  }
  if (name.includes('samosa') || name.includes('pakoda') || name.includes('bonda') || name.includes('maggi') || name.includes('chips') || name.includes('cookies')) {
    return { hunger: 2, hearts: 1, buff: 'Saturation', buffColor: 'text-orange-400 border-orange-500/30 bg-orange-500/10' };
  }
  if (name.includes('sweet') || name.includes('halwa') || name.includes('jamun') || name.includes('rasgulla') || name.includes('kheer') || name.includes('cream') || name.includes('custard')) {
    return { hunger: 2, hearts: 2, buff: 'Regeneration', buffColor: 'text-pink-400 border-pink-500/30 bg-pink-500/10' };
  }
  return { hunger: 2, hearts: 1, buff: 'Resistance I', buffColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
};

const getActiveMealKey = (day: string): string | null => {
  const currentDay = DAYS_OF_WEEK[new Date().getDay()];
  if (day !== currentDay) return null;

  const hour = new Date().getHours() + new Date().getMinutes() / 60;
  
  if (day === 'Sunday') {
    if (hour >= 8.0 && hour < 9.5) return 'Breakfast';
    if (hour >= 12.5 && hour < 14.5) return 'Lunch';
  } else {
    if (hour >= 7.5 && hour < 9.0) return 'Breakfast';
    if (hour >= 12.5 && hour < 14.0) return 'Lunch';
  }
  if (hour >= 17.0 && hour < 18.0) return 'Snacks';
  if (hour >= 19.5 && hour < 21.0) return 'Dinner';

  return null;
};

const GOLEM_NOTICES = [
  "Furnace thermal levels optimized to 1200K for baking tandoori nan rotis. Efficiency +15%.",
  "Tuesday Paneer recipe infused with Resistance potion essence. Consume for temporary defence buffs.",
  "Warning: Kitchen Slimes detected near the potato stocks. Chef Golem has engaged defensive protocols.",
  "Sunday Feast vote is now live. Cast your scroll ballot before the guild resets!",
];

export const MessMenu: React.FC<MessMenuProps> = ({ gainXp, gainCoins }) => {
  const currentDayName = DAYS_OF_WEEK[new Date().getDay()] || 'Monday';
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>(INITIAL_WEEKLY_MENU);
  const [selectedDay, setSelectedDay] = useState<string>(currentDayName);
  const [reviews, setReviews] = useState<{ id: string; rating: number; text: string; date: string; user: string }[]>([
    { id: 'r1', rating: 5, text: "Paneer Butter Masala on Tuesday was top notch! Highly recommended.", date: '2026-06-12', user: 'Vikram Patel' },
    { id: 'r2', rating: 2, text: "Saturday's Dal Palak felt very bland. Please add more spices.", date: '2026-06-11', user: 'Aarav Sharma' }
  ]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);

  const [pollVotes, setPollVotes] = useState({
    opt1: 142,
    opt2: 118,
    opt3: 86
  });
  const [userVotedOpt, setUserVotedOpt] = useState<string | null>(null);
  
  // Simulator States
  const [eatingMealKey, setEatingMealKey] = useState<string | null>(null);
  const [eatenMeals, setEatenMeals] = useState<string[]>([]);
  const [chompText, setChompText] = useState<string>('');
  const [showToast, setShowToast] = useState<{ show: boolean; title: string; desc: string }>({ show: false, title: '', desc: '' });

  const totalPollVotes = pollVotes.opt1 + pollVotes.opt2 + pollVotes.opt3;

  const handlePollVote = (option: 'opt1' | 'opt2' | 'opt3') => {
    if (userVotedOpt === option) return; // Disallow double vote
    
    setPollVotes(prev => {
      const updated = { ...prev };
      if (userVotedOpt) {
        updated[userVotedOpt as 'opt1' | 'opt2' | 'opt3'] -= 1;
      }
      updated[option] += 1;
      return updated;
    });
    setUserVotedOpt(option);
    
    // Reward player
    if (gainXp) gainXp(10);
    if (gainCoins) gainCoins(2);
  };

  const handleVote = (day: string, meal: string, vote: 'LIKE' | 'DISLIKE') => {
    setWeeklyMenu(prev => {
      const dayMenu = { ...prev[day] };
      const targetMeal = { ...dayMenu[meal] };
      
      if (targetMeal.userVoted === vote) {
        if (vote === 'LIKE') targetMeal.likes -= 1;
        else targetMeal.dislikes -= 1;
        targetMeal.userVoted = undefined;
      } else {
        if (targetMeal.userVoted === 'LIKE') targetMeal.likes -= 1;
        if (targetMeal.userVoted === 'DISLIKE') targetMeal.dislikes -= 1;
        
        if (vote === 'LIKE') targetMeal.likes += 1;
        else targetMeal.dislikes += 1;
        targetMeal.userVoted = vote;

        // Reward for first time vote on this meal
        if (gainXp) gainXp(5);
        if (gainCoins) gainCoins(1);
      }

      return {
        ...prev,
        [day]: {
          ...dayMenu,
          [meal]: targetMeal
        }
      };
    });
  };

  const handleEatMeal = (mealKey: string) => {
    if (eatingMealKey) return;
    setEatingMealKey(mealKey);
    setChompText('* CHOMP *');
    
    const interval = setInterval(() => {
      setChompText(prev => prev === '* CHOMP *' ? '* CRUNCH *' : '* CHOMP *');
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      setEatingMealKey(null);
      setEatenMeals(prev => [...prev, `${selectedDay}-${mealKey}`]);
      if (gainXp) gainXp(10);
      if (gainCoins) gainCoins(2);
      
      setShowToast({
        show: true,
        title: 'DIET CONSUMED!',
        desc: `Ate ${mealKey} for +10 XP and +2 Emeralds.`,
      });
      setTimeout(() => setShowToast({ show: false, title: '', desc: '' }), 4000);
    }, 1800);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newReview = {
      id: `r-${Date.now()}`,
      rating: newRating,
      text: newReviewText,
      date: new Date().toISOString().split('T')[0],
      user: 'Aarav Sharma (You)'
    };

    setReviews([newReview, ...reviews]);
    setNewReviewText('');
    setNewRating(5);

    // Reward player
    if (gainXp) gainXp(15);
    if (gainCoins) gainCoins(3);
  };

  const days = Object.keys(weeklyMenu);
  const selectedDayMenu = weeklyMenu[selectedDay];
  const activeMealKey = getActiveMealKey(selectedDay);

  const getPercent = (votes: number) => {
    if (totalPollVotes === 0) return '0%';
    return `${Math.round((votes / totalPollVotes) * 100)}%`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans text-white">
      {/* ═══ Advancement Banner (Advancement Notification) ═══ */}
      <AnimatePresence>
        {showToast.show && (
          <div className="fixed top-6 right-6 z-[9999] pointer-events-none">
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="bg-[#211f20] border-3 border-[#f2ab13] p-4 rounded shadow-2xl flex items-center gap-3.5 max-w-sm w-full"
              style={{
                boxShadow: 'inset 2px 2px 0 #3a3839, inset -2px -2px 0 #111011, 0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              <div className="w-10 h-10 bg-[#141419] border-2 border-[#3a3839] flex items-center justify-center text-xl shadow-inner shrink-0">
                🍗
              </div>
              <div>
                <p className="text-[#f2ab13] font-mc-sub text-[10px] uppercase font-bold tracking-widest leading-none">Advancement Made!</p>
                <p className="text-white font-mc-title text-[9px] mt-1.5 uppercase leading-none">{showToast.title}</p>
                <p className="text-[10px] text-slate-400 font-mono-readable mt-2">{showToast.desc}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#26262a] pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#1f1f26] border-2 border-[#101014] rounded flex items-center justify-center text-mc-cyan shadow-inner">
              <Utensils size={18} />
            </div>
            <h1 className="text-xl font-black text-white font-mc-title uppercase tracking-wide">Mess Kitchen</h1>
          </div>
          <p className="text-slate-400 font-mono-readable text-xs mt-1.5">
            [ Check daily recipes, rate food flavor items, and vote on upcoming sunday feasts ]
          </p>
        </div>
        
        {/* Chef Score Card */}
        <div className="mc-card bg-[#1f1f26]/90 p-4 flex items-center gap-3.5 shrink-0">
          <Award size={20} className="text-mc-gold shrink-0 animate-pulse" />
          <div>
            <h4 className="text-[10px] font-black text-white font-mc-sub uppercase">Chef Score</h4>
            <p className="text-[10px] text-mc-gold font-mc-sub font-bold mt-0.5">⭐ 4.6 / 5.0 (230 votes)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Special Chef Recommendation Card */}
        <div className="lg:col-span-2 mc-card bg-[#1f1f26] border border-[#f2ab13] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-white font-mc-title uppercase tracking-wide flex items-center gap-1.5">
              <span>🍳</span> Chef Recommendation
            </h3>
            <p className="text-xs text-slate-300 font-mono-readable">
              Try today's dinner recipe — <span className="text-mc-gold font-bold underline">Jeera Rice with Kadhi Pakora</span>, seasoned with home-ground portal spices!
            </p>
          </div>
          <div className="btn-mc bg-[#f2ab13] text-[#141419] border-[#f2ab13] font-bold text-[9px] uppercase tracking-wider py-1 px-3">
            Tavern Pick ⭐
          </div>
        </div>

        {/* Chef Golem Command Log */}
        <div className="mc-card bg-[#1f1f26] border border-[#3c3c44] p-4 font-mono-readable flex flex-col justify-center">
          <h4 className="text-[9px] font-black text-mc-cyan font-mc-title uppercase mb-2 flex items-center gap-1.5">
            <span>🤖</span> Chef Golem Command Log
          </h4>
          <div className="text-[9px] text-slate-400 space-y-1">
            {GOLEM_NOTICES.map((notice, idx) => (
              <div key={idx} className="flex gap-1.5 leading-relaxed">
                <span className="text-[#00e676] shrink-0">►</span>
                <p>{notice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekday Selector */}
      <div className="flex overflow-x-auto pb-2 gap-2.5 scrollbar-none">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`btn-mc ${
              selectedDay === day
                ? 'bg-mc-cyan text-black border-mc-cyan'
                : 'bg-[#1f1f26] text-slate-400 border-[#26262a]'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {(Object.entries(selectedDayMenu) as [string, Meal][]).map(([mealKey, meal]) => {
            const isServingNow = activeMealKey === mealKey;
            const mealId = `${selectedDay}-${mealKey}`;
            const hasBeenEaten = eatenMeals.includes(mealId);
            const isEatingThis = eatingMealKey === mealKey;

            return (
              <motion.div
                key={`${selectedDay}-${mealKey}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className={`mc-card bg-[#1f1f26] flex flex-col justify-between overflow-hidden transition-all ${
                  isServingNow ? 'now-serving border-[#00e676] border-2 shadow-[0_0_15px_rgba(0,230,118,0.25)]' : ''
                }`}
              >
                <div className="p-5 relative">
                  {isServingNow && (
                    <div className="absolute top-4 right-4 bg-[#00e676] text-black text-[8px] font-mc-title font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                      <span className="w-1 h-1 bg-black rounded-full animate-ping" />
                      NOW SERVING
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs font-black text-white font-mc-title uppercase">{meal.name}</h3>
                      <p className="text-[10px] text-slate-500 font-mono-readable flex items-center gap-1.5 mt-1.5">
                        <Clock size={12} />
                        {meal.time}
                      </p>
                    </div>
                    {!isServingNow && (
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mc-sub uppercase border ${
                        mealKey === 'Breakfast' ? 'bg-[#ffbe00]/10 text-[#ffbe00] border-[#ffbe00]/30' :
                        mealKey === 'Lunch' ? 'bg-[#00d8df]/10 text-[#00d8df] border-[#00d8df]/30' :
                        mealKey === 'Snacks' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                        'bg-[#00e676]/10 text-[#00e676] border-[#00e676]/30'
                      }`}>
                        {mealKey}
                      </span>
                    )}
                  </div>

                  <div className="border-t border-[#26262a] my-3"></div>

                  <ul className="space-y-3">
                    {meal.items.map((item, idx) => {
                      const rpgStats = getItemRPGStats(item);
                      return (
                        <li key={idx} className="flex flex-col gap-1 text-xs font-mono-readable">
                          <div className="flex items-center space-x-2.5 text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-sm bg-mc-cyan shrink-0"></div>
                            <span>{item}</span>
                          </div>
                          
                          {/* RPG Stat Indicators */}
                          <div className="flex items-center gap-2 pl-4 flex-wrap mt-0.5">
                            <span className="text-[10px] flex items-center tracking-tight text-orange-400 select-none">
                              {Array.from({ length: rpgStats.hunger }).map((_, i) => '🍗').join('')}
                            </span>
                            <span className="text-[10px] flex items-center tracking-tight text-red-500 select-none">
                              {Array.from({ length: rpgStats.hearts }).map((_, i) => '❤️').join('')}
                            </span>
                            {rpgStats.buff && (
                              <span className={`px-1.5 py-0.5 rounded text-[8px] border font-bold uppercase font-mc-sub scale-90 origin-left ${rpgStats.buffColor}`}>
                                {rpgStats.buff}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Eat Meal Simulator Interface */}
                <div className="bg-[#141419]/60 p-4 border-t border-[#26262a] flex flex-col gap-3">
                  {isEatingThis ? (
                    /* Chomp progress bar state */
                    <div className="space-y-2 py-1">
                      <div className="flex justify-between items-center text-[9px] font-mc-sub uppercase text-[#ffbe00]">
                        <span className="animate-pulse">{chompText}</span>
                        <span>Eating...</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#141419] border border-[#3c3c44] p-0.5 rounded-sm overflow-hidden">
                        <div className="h-full bg-mc-green chomp-bar" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center gap-4">
                      {isServingNow ? (
                        <button
                          disabled={hasBeenEaten}
                          onClick={() => handleEatMeal(mealKey)}
                          className="btn-mc flex-1 uppercase text-[10px] py-1.5 px-3 bg-[#00e676] text-black border-[#00e676] hover:bg-[#00e676]/90 disabled:opacity-50"
                        >
                          {hasBeenEaten ? '✓ Diet Logged' : '🍖 Consume Diet'}
                        </button>
                      ) : (
                        <span className="text-[8px] font-mc-sub text-slate-500 uppercase">Rate Menu Flavor</span>
                      )}

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleVote(selectedDay, mealKey, 'LIKE')}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-[9px] font-bold font-mc-sub transition-all border ${
                            meal.userVoted === 'LIKE'
                              ? 'bg-[#00e676]/25 border-[#00e676] text-[#00e676]'
                              : 'bg-[#1f1f26] hover:bg-[#2b2b35] text-slate-400 border-[#26262a]'
                          }`}
                        >
                          <ThumbsUp size={12} />
                          <span>{meal.likes}</span>
                        </button>
                        <button
                          onClick={() => handleVote(selectedDay, mealKey, 'DISLIKE')}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-[9px] font-bold font-mc-sub transition-all border ${
                            meal.userVoted === 'DISLIKE'
                              ? 'bg-red-500/25 border-red-500 text-red-400'
                              : 'bg-[#1f1f26] hover:bg-[#2b2b35] text-slate-400 border-[#26262a]'
                          }`}
                        >
                          <ThumbsDown size={12} />
                          <span>{meal.dislikes}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Sunday Special Food Request Poll */}
      <div className="mc-card bg-[#1f1f26]/90 p-5 md:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#26262a] pb-3">
            <span className="text-xl">🍲</span>
            <h3 className="text-xs font-black text-white font-mc-title uppercase">Tavern Recipe Poll</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono-readable">
            Cast your vote below for Sunday's special recipe slot. Choice with highest votes wins!
          </p>

          <div className="space-y-4 pt-2">
            {/* Option 1 */}
            <div 
              onClick={() => handlePollVote('opt1')}
              className={`p-4 rounded border transition-all cursor-pointer flex flex-col justify-between ${
                userVotedOpt === 'opt1'
                  ? 'border-[#00e676] bg-[#00e676]/10'
                  : 'border-[#26262a] hover:border-mc-cyan/45 bg-[#141419]'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-xs text-white flex items-center gap-2 font-mc-sub uppercase">
                  🍲 Paneer Tikka Biryani
                </span>
                <span className="text-xs font-bold text-mc-cyan font-mc-sub">{getPercent(pollVotes.opt1)}</span>
              </div>
              <div className="w-full h-2 bg-[#1f1f26] rounded-sm overflow-hidden border border-[#3c3c44] p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: getPercent(pollVotes.opt1) }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-mc-cyan"
                ></motion.div>
              </div>
              <p className="text-[9px] text-slate-500 font-mono-readable mt-1.5">{pollVotes.opt1} votes</p>
            </div>

            {/* Option 2 */}
            <div 
              onClick={() => handlePollVote('opt2')}
              className={`p-4 rounded border transition-all cursor-pointer flex flex-col justify-between ${
                userVotedOpt === 'opt2'
                  ? 'border-[#00e676] bg-[#00e676]/10'
                  : 'border-[#26262a] hover:border-mc-cyan/45 bg-[#141419]'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-xs text-white flex items-center gap-2 font-mc-sub uppercase">
                  🥖 Amritsari Chole Bhature
                </span>
                <span className="text-xs font-bold text-mc-cyan font-mc-sub">{getPercent(pollVotes.opt2)}</span>
              </div>
              <div className="w-full h-2 bg-[#1f1f26] rounded-sm overflow-hidden border border-[#3c3c44] p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: getPercent(pollVotes.opt2) }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-mc-cyan"
                ></motion.div>
              </div>
              <p className="text-[9px] text-slate-500 font-mono-readable mt-1.5">{pollVotes.opt2} votes</p>
            </div>

            {/* Option 3 */}
            <div 
              onClick={() => handlePollVote('opt3')}
              className={`p-4 rounded border transition-all cursor-pointer flex flex-col justify-between ${
                userVotedOpt === 'opt3'
                  ? 'border-[#00e676] bg-[#00e676]/10'
                  : 'border-[#26262a] hover:border-mc-cyan/45 bg-[#141419]'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-xs text-white flex items-center gap-2 font-mc-sub uppercase">
                  🥞 Mysore Masala Dosa
                </span>
                <span className="text-xs font-bold text-mc-cyan font-mc-sub">{getPercent(pollVotes.opt3)}</span>
              </div>
              <div className="w-full h-2 bg-[#1f1f26] rounded-sm overflow-hidden border border-[#3c3c44] p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: getPercent(pollVotes.opt3) }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-mc-cyan"
                ></motion.div>
              </div>
              <p className="text-[9px] text-slate-500 font-mono-readable mt-1.5">{pollVotes.opt3} votes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submit Review Card */}
        <div className="mc-card bg-[#1f1f26]/90 p-5">
          <form onSubmit={handleReviewSubmit} className="space-y-4 font-mono-readable">
            <div className="flex items-center space-x-2 border-b border-[#26262a] pb-2">
              <MessageSquare size={16} className="text-mc-cyan" />
              <h3 className="text-[10px] font-black text-white font-mc-title uppercase">Add Feedback</h3>
            </div>
            
            <div>
              <label className="block text-[8px] font-bold text-slate-500 uppercase font-mc-sub mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer text-slate-500"
                  >
                    <Star
                      size={20}
                      className={star <= newRating ? 'text-[#ffbe00] fill-[#ffbe00]' : 'text-slate-700'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-bold text-slate-500 uppercase font-mc-sub mb-2">Log Comments</label>
              <textarea
                required
                value={newReviewText}
                onChange={e => setNewReviewText(e.target.value)}
                placeholder="Share recipes critique..."
                rows={3}
                className="w-full text-xs font-semibold p-3 bg-[#141419] border border-[#26262a] text-white rounded outline-none focus:border-mc-cyan/50 transition-all"
              />
            </div>

            <button
              type="submit"
              className="btn-mc w-full text-[10px] uppercase py-2.5"
            >
              Submit Rations Review
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 mc-card bg-[#1f1f26]/90 p-5 flex flex-col">
          <h3 className="text-xs font-black text-white font-mc-title uppercase border-b border-[#26262a] pb-3 mb-4 flex items-center gap-2">
            <span>📜</span> Recent Tavern Feedback logs
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 no-scrollbar">
            {reviews.map(review => (
              <div key={review.id} className="p-3.5 bg-[#141419]/70 border border-[#26262a] rounded space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white font-mc-sub uppercase text-[9px]">{review.user}</span>
                  <span className="text-[9px] text-slate-500 font-mono-readable">{review.date}</span>
                </div>
                <div className="flex space-x-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={12}
                      className={idx < review.rating ? 'text-[#ffbe00] fill-[#ffbe00]' : 'text-slate-800'}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-300 font-mono-readable leading-relaxed">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
