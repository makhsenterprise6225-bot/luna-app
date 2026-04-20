

function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  
  // --- DATA ---
  const messages = ["You're doing amazing! ✨", "So proud of you!", "Look at you go! 🚀", "You're a superstar!", "Unstoppable energy! 🔥"];
  const quotes = ["Believe you can and you're halfway there.", "Small steps lead to big changes.", "Success is the sum of small efforts."];
  const reasons = ["You never give up, even when it's hard", "Your graduation was a huge milestone", "You are constantly learning and growing", "Your kindness touches everyone you meet", "You are brave for chasing your dreams", "You are building a beautiful future", "Your technical skills are improving every day", "You make people feel seen and heard", "You are worth every bit of happiness", "You have an infectious, lovely energy", "You are a loyal and wonderful friend", "Your attention to detail is unmatched", "You overcome every 'bad day' so far", "You are disciplined and focused", "You are simply one of a kind 🌟"];
  const dailyIntents = ["Focus on the process, not just the result.", "Be kind to your mind today.", "You are making more progress than you realize.", "Celebrate a tiny win before lunch.", "Stay hydrated and stay curious."];

  // --- STATE ---
  const [theme, setTheme] = useState(() => localStorage.getItem('luna_theme') || 'rose');
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('luna_tasks') || '[]'));
  const [savedEntries, setSavedEntries] = useState(() => JSON.parse(localStorage.getItem('luna_journal') || '[]'));
  const [newTask, setNewTask] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState('😊');
  const [celebration, setCelebration] = useState({ show: false, msg: "", quote: "" });
  const [intent] = useState(() => dailyIntents[Math.floor(Math.random() * dailyIntents.length)]);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // --- DERIVED STATE (Daily Spark & Greetings) ---
  const dailySpark = useMemo(() => reasons[Math.floor(Math.random() * reasons.length)], []);
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: <Coffee size={20} /> };
    if (hour < 18) return { text: "Good Afternoon", icon: <Sun size={20} /> };
    return { text: "Good Evening", icon: <Moon size={20} /> };
  }, []);

  // --- THEME ENGINE ---
  const themes:any = {
    rose: { bg: 'bg-[#FFF9F9]', prim: 'text-[#FF8E8E]', acc: 'bg-[#FF8E8E]', border: 'border-rose-100', nav: 'text-rose-200' },
    midnight: { bg: 'bg-[#0F172A]', prim: 'text-[#818CF8]', acc: 'bg-[#818CF8]', border: 'border-slate-800', nav: 'text-slate-600' },
    forest: { bg: 'bg-[#F0F4F0]', prim: 'text-[#4ade80]', acc: 'bg-[#4ade80]', border: 'border-green-100', nav: 'text-green-200' }
  };
  const t = themes[theme];

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('luna_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('luna_journal', JSON.stringify(savedEntries)); }, [savedEntries]);
  useEffect(() => { localStorage.setItem('luna_theme', theme); }, [theme]);
  
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    else if (timeLeft === 0) { 
      setIsActive(false); 
      setCelebration({ show: true, msg: "Session Complete!", quote: "Brilliant work, Luna!" }); 
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // --- LOGIC ---
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) { 
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]); 
      setNewTask(""); 
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((tk:any) => {
      if (tk.id === id && !tk.completed) {
        setCelebration({ 
          show: true, 
          msg: messages[Math.floor(Math.random() * messages.length)], 
          quote: quotes[Math.floor(Math.random() * quotes.length)] 
        });
      }
      return tk.id === id ? { ...tk, completed: !tk.completed } : tk;
    }));
  };

  const saveJournal = () => {
    if(journalEntry.trim()){ 
      setSavedEntries([{
        id: Date.now(), 
        text: journalEntry, 
        mood: selectedMood,
        date: new Date().toLocaleDateString()
      }, ...savedEntries]); 
      setJournalEntry(""); 
    }
  };

  return (
    <div className={`flex flex-col h-screen ${t.bg} transition-all duration-500 font-sans overflow-hidden`}>
      <header className="px-8 pt-10 pb-2 flex justify-between items-end">
        <div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            {greeting.icon} {greeting.text}
          </p>
          <h1 className={`text-3xl font-black ${t.prim} flex items-center gap-2 uppercase tracking-tight`}>
            LUNA <Heart fill="currentColor" size={24} />
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative px-6 pb-32">
        {activeTab === 'tasks' && (
          <div className="h-full pt-4 overflow-y-auto space-y-5 animate-in slide-in-from-bottom-4">
            {/* Daily Spark Card */}
            <div className="bg-white/40 border border-white p-4 rounded-[24px] flex items-center gap-4">
               <div className={`${t.acc} p-2 rounded-full text-white`}><Sparkles size={16}/></div>
               <p className="text-xs font-semibold text-slate-500 italic">"{dailySpark}"</p>
            </div>

            <div className={`${t.acc} p-6 rounded-[32px] text-white shadow-lg flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <Timer size={20} />
                <span className="font-mono text-2xl font-bold">
                  {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}
                </span>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => {setTimeLeft(25*60); setIsActive(false)}} className="hover:bg-white/20 p-3 rounded-2xl transition-all">
                  <RotateCcw size={20} />
                </button>
                <button onClick={() => setIsActive(!isActive)} className="bg-white/20 p-3 rounded-2xl active:scale-90 transition-all">
                  {isActive ? <Pause /> : <Play />}
                </button>
              </div>
            </div>

            <form onSubmit={addTask} className="flex gap-2">
              <input 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
                placeholder="What's the goal?" 
                className="flex-1 px-6 py-4 rounded-2xl bg-white shadow-sm outline-none border border-transparent focus:border-rose-200 transition-all" 
              />
              <button type="submit" className={`${t.acc} p-4 rounded-2xl text-white shadow-md`}><Plus /></button>
            </form>

            <div className="space-y-3 pb-10">
              {tasks.map((tk:any) => (
                <div key={tk.id} onClick={() => toggleTask(tk.id)} className={`p-5 rounded-3xl flex bg-white shadow-sm border ${t.border} items-center justify-between group cursor-pointer transition-all hover:translate-x-1`}>
                  <div className="flex items-center gap-4">
                    {tk.completed ? <CheckCircle2 className="text-green-400" /> : <Circle className="text-slate-200" />}
                    <span className={`font-medium ${tk.completed ? 'line-through text-slate-300' : 'text-slate-600'}`}>{tk.text}</span>
                  </div>
                  <button onClick={(e) => {e.stopPropagation(); setTasks(tasks.filter((x:any)=>x.id!==tk.id))}} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-400 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="h-full pt-4 space-y-4 flex flex-col animate-in fade-in overflow-y-auto">
            <div className="bg-white/60 backdrop-blur-xl rounded-[40px] p-6 flex-shrink-0 flex flex-col border border-white shadow-sm">
              <div className="flex justify-between mb-4">
                {['😊', '🤩', '😐', '😔', '😴'].map(m => (
                  <button 
                    key={m} 
                    onClick={() => setSelectedMood(m)}
                    className={`text-2xl p-2 rounded-xl transition-all ${selectedMood === m ? 'bg-white shadow-md scale-110' : 'opacity-40 hover:opacity-100'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <textarea 
                value={journalEntry} 
                onChange={(e) => setJournalEntry(e.target.value)} 
                placeholder="Talk to me, Luna..." 
                className="w-full h-32 bg-transparent border-none outline-none resize-none text-slate-700 font-medium" 
              />
              <button 
                onClick={saveJournal}
                className={`${t.acc} w-full py-4 mt-2 rounded-2xl text-white font-bold shadow-lg active:scale-95 transition-all`}
              >
                SAVE ENTRY
              </button>
            </div>
            <div className="space-y-4 pb-10">
              {savedEntries.map((entry: any) => (
                <div key={entry.id} className="bg-white p-5 rounded-[32px] border border-slate-50 shadow-sm relative group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{entry.date}</span>
                    <span className="text-lg">{entry.mood}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">{entry.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="h-full pt-4 overflow-y-auto pb-10 space-y-6">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 space-y-4 text-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Change the Vibe</h3>
              <div className="flex justify-center gap-6">
                {['rose', 'midnight', 'forest'].map(n => (
                  <button 
                    key={n} 
                    onClick={() => setTheme(n)} 
                    className={`w-12 h-12 rounded-full border-4 ${theme===n ? 'border-slate-800 scale-110 shadow-lg':'border-white'} ${n==='rose'?'bg-[#FF8E8E]':n==='midnight'?'bg-[#818CF8]':'bg-[#4ade80]'} transition-all`} 
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Your 15 Strengths</h3>
              {reasons.map((r, i) => (
                <div key={i} className={`bg-white/50 p-4 rounded-2xl flex items-center gap-3 border ${t.border}`}>
                  <Heart size={14} className={t.prim} fill="currentColor" />
                  <span className="text-slate-600 font-semibold text-[11px]">{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'music' && (
          <div className="h-full pt-4 animate-in fade-in h-[85%]">
            <iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb9CjXvhS" width="100%" height="100%" frameBorder="0" className="rounded-[40px] shadow-2xl" allow="encrypted-media" />
          </div>
        )}
      </main>

      {celebration.show && (
        <div onClick={() => setCelebration({ ...celebration, show: false })} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white p-8 rounded-[40px] text-center shadow-2xl animate-in zoom-in duration-300 max-w-sm">
            <Sparkles className="mx-auto text-yellow-400 mb-4" size={40} />
            <h2 className={`text-2xl font-black ${t.prim} mb-2`}>{celebration.msg}</h2>
            <p className="text-slate-500 italic">"{celebration.quote}"</p>
          </div>
        </div>
      )}

      <nav className="fixed bottom-8 left-6 right-6 bg-white/90 backdrop-blur-2xl p-3 flex justify-around rounded-[32px] shadow-2xl border border-white">
        {[{id:'music', i:<Music/>}, {id:'tasks', i:<CheckCircle2/>}, {id:'journal', i:<PenTool/>}, {id:'profile', i:<Heart/>}].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`p-4 rounded-2xl transition-all ${activeTab===tab.id ? `${t.acc} text-white shadow-lg` : `${t.nav}`}`}>{tab.i}</button>
        ))}
      </nav>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
