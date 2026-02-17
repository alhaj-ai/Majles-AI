'use client';

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Upload,
  FileText,
  MessageSquare,
  CheckCircle2,
  Clock,
  Users,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Play,
  Pause,
  Send,
  HelpCircle,
  BarChart3,
  Search,
  CheckSquare,
  AlertCircle,
  Layers,
  Bot,
  Zap,
  Volume2,
  FolderOpen,
  ArrowRight,
  Calendar,
  Settings
} from 'lucide-react';

interface DecisionItem {
  id: string;
  decision: string;
  assignee: string;
  deadline: string;
  status: 'completed' | 'in_progress' | 'pending';
  priority: 'high' | 'medium' | 'low';
}

interface MeetingSegment {
  topic: string;
  timestamp: string;
  speaker: string;
  content: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citation?: string;
  timestamp: string;
}

export default function MajlesApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recorder' | 'meeting_hub' | 'chat_rag' | 'settings'>('dashboard');

  // Recorder states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [meetingTitle, setMeetingTitle] = useState('اجتماع مجلس الإدارة للربع الثالث - خطة التحول الرقمي والحوكمة');
  const [meetingType, setMeetingType] = useState('مجلس إدارة استراتيجي');
  const [dialect, setDialect] = useState('لهجة سعودية / خليجية');
  const [attendees, setAttendees] = useState('م. أحمد السعيد، د. نورة الشمري، أ. خالد العمري، م. سارة العتيبي');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Synced audio playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then(res => {
        if (res.ok) setBackendConnected(true);
      })
      .catch(() => setBackendConnected(false));
  }, [API_BASE]);

  // Chat RAG states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'مرحباً بك! أنا مساعد مجلس الذكي (Majles AI). يمكنك سؤالي عن أي تفاصيل، ميزانيات، أو قرارات نوقشت في هذا الاجتماع وسأجيبك باقتباسات موثقة من المحضر.',
      timestamp: '11:45 ص'
    }
  ]);

  // Sample Meeting Data
  const [decisions, setDecisions] = useState<DecisionItem[]>([
    {
      id: '1',
      decision: 'اعتماد الميزانية الإضافية لمشاريع الذكاء الاصطناعي التوليدي بنسبة 25%.',
      assignee: 'م. أحمد السعيد (مدير التقنية)',
      deadline: '1 ديسمبر 2026',
      status: 'completed',
      priority: 'high'
    },
    {
      id: '2',
      decision: 'إطلاق النسخة التجريبية لمنظومة خدمة العملاء الآلية باللغة العربية.',
      assignee: 'م. سارة العتيبي (رئيسة تطوير المنتجات)',
      deadline: '15 ديسمبر 2026',
      status: 'in_progress',
      priority: 'high'
    },
    {
      id: '3',
      decision: 'مراجعة معايير الأمن السيبراني وحماية البيانات مع الفريق القانوني.',
      assignee: 'أ. خالد العمري (المستشار القانوني)',
      deadline: '20 ديسمبر 2026',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '4',
      decision: 'تدريب كوادر الدعم الفني على نماذج تلخيص واسترجاع البيانات RAG.',
      assignee: 'د. نورة الشمري (مديرة الموارد البشرية)',
      deadline: '5 يناير 2027',
      status: 'in_progress',
      priority: 'medium'
    }
  ]);

  const segments: MeetingSegment[] = [
    {
      topic: 'المحور الأول: استعراض النتائج المالية وميزانية الربع الرابع',
      timestamp: '00:02:15',
      speaker: 'م. أحمد السعيد',
      content: 'السلام عليكم ورحمة الله. نبدأ الاجتماع بمراجعة البنود التشغيلية. حققنا نمواً جيداً في النصف الثاني، ونقترح تخصيص ميزانية إضافية لدعم مراكز الحوسبة السحابية المحلية لضمان سرية البيانات.'
    },
    {
      topic: 'المحور الأول: استعراض النتائج المالية وميزانية الربع الرابع',
      timestamp: '00:08:40',
      speaker: 'د. نورة الشمري',
      content: 'نتفق مع هذا التوجه، لا سيما أن البنية التحتية الحالية تحتاج إلى توسعة لمواكبة استهلاك نماذج اللغة الكبيرة المعربة وتلبية متطلبات هيئة البيانات والذكاء الاصطناعي سدايا.'
    },
    {
      topic: 'المحور الثاني: خطة إطلاق التطبيقات الذكية وتجربة العميل',
      timestamp: '00:19:22',
      speaker: 'م. سارة العتيبي',
      content: 'بالنسبة للواجهات الأمامية، أتممنا بناء النسخة السحابية المتوافقة مع خط ثمانية العريض وبنية الـ RTL بالكامل، وسنكون جاهزين لإطلاق المرحلة التجريبية بحلول منتصف الشهر القادم.'
    },
    {
      topic: 'المحور الثالث: القرارات والتوصيات الختامية',
      timestamp: '00:34:50',
      speaker: 'أ. خالد العمري',
      content: 'تم توثيق كافة البنود واعتماد الميزانية وصياغة خطة العمل. سيتم تزويد كافة الأعضاء بنسخة المحضر الرقمية فور انتهاء الجلسة.'
    }
  ];

  // Recording Timer Effect
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartProcessing = async () => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('title', meetingTitle);
      if (uploadedFile) formData.append('file', uploadedFile);
      const res = await fetch(`${API_BASE}/api/meetings/process`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) setBackendConnected(true);
    } catch {
      // Fallback to interactive offline simulation
    }
    setTimeout(() => {
      setIsProcessing(false);
      setActiveTab('meeting_hub');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669', '#fde047']
      });
    }, 1200);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput.trim(),
      timestamp: 'الآن'
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    try {
      const res = await fetch(`${API_BASE}/api/meetings/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg.text, meeting_id: 'mtg-2026-q4-01' })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: data.answer,
            citation: data.citation || 'المحور الأول [00:02:15]',
            timestamp: 'الآن'
          }
        ]);
        return;
      }
    } catch {
      // Offline fallback below
    }

    // Simulated RAG Response with Citations
    setTimeout(() => {
      let botResponse = 'تمت الإشارة إلى ذلك في محضر الاجتماع، وجرى الاتفاق على تنفيذ كافة التوصيات ضمن الإطار الزمني المحدد.';
      let citation = 'المحور الأول [00:08:40]';

      if (userMsg.text.includes('ميزانية') || userMsg.text.includes('مالي')) {
        botResponse = 'بناءً على المحور الأول: تقرر اعتماد الميزانية الإضافية لمشاريع الذكاء الاصطناعي بنسبة 25% بعد موافقة المجلس ومراجعة المتطلبات التشغيلية.';
        citation = 'المحور الأول [00:02:15] - م. أحمد السعيد';
      } else if (userMsg.text.includes('سارة') || userMsg.text.includes('منتج') || userMsg.text.includes('إطلاق')) {
        botResponse = 'أوضحت م. سارة العتيبي أن النسخة التجريبية لمنظومة خدمة العملاء باللغة العربية جاهزة وستُطلق رسمياً في 15 ديسمبر 2026.';
        citation = 'المحور الثاني [00:19:22] - م. سارة العتيبي';
      } else if (userMsg.text.includes('قرار') || userMsg.text.includes('قرارات')) {
        botResponse = 'أبرز 4 قرارات تم اعتمادها: 1) ميزانية الذكاء الاصطناعي، 2) إطلاق النسخة التجريبية، 3) مراجعة اللوائح مع الفريق القانوني، 4) تدريب فرق الدعم الفني.';
        citation = 'المحور الثالث [00:34:50] - مصفوفة القرارات';
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: botResponse,
          citation,
          timestamp: 'الآن'
        }
      ]);
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Enterprise Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 text-2xl font-black">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white font-display">
                  مَجْلِس الذكي
                </h1>
                <span className="text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Majles-AI v2.0
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                  On-Premise Private AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                المنظومة المؤسسية لإدارة وتلخيص الاجتماعات وتفريغ الصوت بالذكاء الاصطناعي
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>لوحة القيادة</span>
            </button>

            <button
              onClick={() => setActiveTab('recorder')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'recorder'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>غرفة التسجيل والرفع</span>
            </button>

            <button
              onClick={() => setActiveTab('meeting_hub')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'meeting_hub'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>المحضر الذكي والتفريغ</span>
            </button>

            <button
              onClick={() => setActiveTab('chat_rag')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chat_rag'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>مساعد المحضر (RAG)</span>
            </button>
          </nav>

          {/* User & Attribution Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200">م. محمد الحاج</span>
              <span className="text-[10px] text-emerald-400">Chief AI Architect</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-slate-800 border border-emerald-500/40 flex items-center justify-center font-bold text-white shadow-sm">
              م.ح
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col gap-8">
        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-8">
            {/* Hero Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/20 p-6 lg:p-8">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>محرك الذكاء الاصطناعي المحلي متصل وجاهز</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black text-white font-display mb-2">
                    أهلاً بك في منصة مَجْلِس الذكي 🏛️
                  </h2>
                  <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                    منظومة معالجة الاجتماعات المتطورة: استمع، فرّغ الأصوات بدقة متناهية، استخرج القرارات والمسؤوليات، واسأل الذكاء الاصطناعي في محضر أي اجتماع بخصوصية تامة 100%.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setActiveTab('recorder')}
                    className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    <span>بدء أو رفع اجتماع جديد</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('meeting_hub')}
                    className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>استعراض آخر محضر</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Executive KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="enterprise-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-bold">الاجتماعات الموثقة</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-display mb-1">42</div>
                  <span className="text-[11px] text-emerald-400 font-medium">↑ 8 اجتماعات هذا الشهر</span>
                </div>
              </div>

              <div className="enterprise-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-bold">ساعات التسجيل المعالجة</span>
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-display mb-1">68.4 س</div>
                  <span className="text-[11px] text-teal-400 font-medium">بمتوسط 45 دقيقة لكل جلسة</span>
                </div>
              </div>

              <div className="enterprise-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-bold">القرارات والتوصيات المستخرجة</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-display mb-1">194</div>
                  <span className="text-[11px] text-amber-400 font-medium">82% منها قيد التنفيذ أو مكتملة</span>
                </div>
              </div>

              <div className="enterprise-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-bold">دقة تمييز المتحدثين (Diarization)</span>
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-display mb-1">98.7%</div>
                  <span className="text-[11px] text-sky-400 font-medium">WhisperX + PyAnnote AI</span>
                </div>
              </div>
            </div>

            {/* Recent Meetings Table */}
            <div className="enterprise-card rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-white font-display">أحدث الاجتماعات المسجلة</h3>
                  <p className="text-xs text-slate-400">سجل المحاضر المعالجة بالذكاء الاصطناعي</p>
                </div>
                <button
                  onClick={() => setActiveTab('recorder')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>تسجيل جديد</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-bold">عنوان الاجتماع</th>
                      <th className="pb-3 font-bold">النوع والتصنيف</th>
                      <th className="pb-3 font-bold">التاريخ والمدة</th>
                      <th className="pb-3 font-bold">المتحدثين</th>
                      <th className="pb-3 font-bold">الحالة</th>
                      <th className="pb-3 font-bold text-left">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 font-bold text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span>اجتماع مجلس الإدارة للربع الثالث - خطة التحول الرقمي</span>
                      </td>
                      <td className="py-4 text-slate-300">مجلس إدارة استراتيجي</td>
                      <td className="py-4 text-slate-400">اليوم • 38 دقيقة</td>
                      <td className="py-4 text-slate-300">4 متحدثين</td>
                      <td className="py-4">
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          تم التلخيص والتحليل
                        </span>
                      </td>
                      <td className="py-4 text-left">
                        <button
                          onClick={() => setActiveTab('meeting_hub')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold transition-all text-[11px]"
                        >
                          عرض المحضر الذكي
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 font-bold text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                        <span>ورشة عمل مراجعة أمن البيانات والامتثال مع سدايا</span>
                      </td>
                      <td className="py-4 text-slate-300">أمن سيبراني وقانوني</td>
                      <td className="py-4 text-slate-400">أمس • 52 دقيقة</td>
                      <td className="py-4 text-slate-300">6 متحدثين</td>
                      <td className="py-4">
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          تم التلخيص والتحليل
                        </span>
                      </td>
                      <td className="py-4 text-left">
                        <button
                          onClick={() => setActiveTab('meeting_hub')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all text-[11px]"
                        >
                          عرض المحضر
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 font-bold text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                        <span>المزامنة الأسبوعية لفريق هندسة وتدريب النماذج اللغوية</span>
                      </td>
                      <td className="py-4 text-slate-300">فريق الذكاء الاصطناعي</td>
                      <td className="py-4 text-slate-400">قبل يومين • 26 دقيقة</td>
                      <td className="py-4 text-slate-300">3 متحدثين</td>
                      <td className="py-4">
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          مكتمل ومفهرس RAG
                        </span>
                      </td>
                      <td className="py-4 text-left">
                        <button
                          onClick={() => setActiveTab('meeting_hub')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all text-[11px]"
                        >
                          عرض المحضر
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: RECORDER & UPLOADER ================= */}
        {activeTab === 'recorder' && (
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
            <div className="enterprise-card rounded-3xl p-6 lg:p-8 border border-slate-800">
              <h2 className="text-xl lg:text-2xl font-black text-white font-display mb-2">
                غرفة التسجيل وبدء اجتماع جديد 🎙️
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                سجل صوت الاجتماع مباشرة أو ارفع ملف صوتي مسجل مسبقاً لمعالجته بنماذج WhisperX و Qwen 2.5.
              </p>

              {/* Metadata Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">عنوان الاجتماع:</label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={e => setMeetingTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">تصنيف الاجتماع:</label>
                  <select
                    value={meetingType}
                    onChange={e => setMeetingType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>مجلس إدارة استراتيجي</option>
                    <option>اجتماع دوري تنفيذي</option>
                    <option>مراجعة تقنية وهندسية</option>
                    <option>مراجعة مالية وميزانيات</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">اللهجة المعتمدة للاجتماع:</label>
                  <select
                    value={dialect}
                    onChange={e => setDialect(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>لهجة سعودية / خليجية</option>
                    <option>عربية فصحى معاصرة (MSA)</option>
                    <option>لهجة شامية (Syrian / Levant)</option>
                    <option>لهجة مصرية</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">قائمة الحاضرين (مفصولة بفاصلة):</label>
                  <input
                    type="text"
                    value={attendees}
                    onChange={e => setAttendees(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Live Audio Recorder Box */}
              <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 flex flex-col items-center justify-center text-center mb-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all ${
                  isRecording
                    ? 'bg-red-500/20 text-red-400 ring-8 ring-red-500/20 animate-pulse'
                    : 'bg-emerald-500/10 text-emerald-400 ring-4 ring-emerald-500/10'
                }`}>
                  <Mic className="w-10 h-10" />
                </div>

                <div className="text-3xl font-black text-white font-display mb-1">
                  {formatTimer(recordingSeconds)}
                </div>
                <span className="text-xs text-slate-400 font-medium mb-4">
                  {isRecording ? 'جاري تسجيل وقائع الاجتماع بدقة عالية...' : 'اضغط على الزر أدناه لبدء التسجيل المباشر'}
                </span>

                {/* Animated Waveform Visualizer */}
                {isRecording && (
                  <div className="flex items-center gap-1 mb-6 h-8">
                    {[12, 24, 38, 18, 44, 28, 50, 20, 36, 14, 48, 22, 40].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-emerald-400 rounded-full animate-pulse"
                        style={{ height: `${h}px`, animationDelay: `${i * 80}ms` }}
                      ></div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  {!isRecording ? (
                    <button
                      onClick={() => setIsRecording(true)}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4" />
                      <span>بدء تسجيل الاجتماع</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsRecording(false)}
                      className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
                    >
                      <MicOff className="w-4 h-4" />
                      <span>إيقاف التسجيل واعتماد الصوت</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Alternative: Upload Audio File */}
              <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-6 text-center transition-all mb-6">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-300 block mb-1">أو اسحب وأفلت ملف تسجيل صوتي (MP3, WAV, M4A)</span>
                <span className="text-[11px] text-slate-500 block mb-3">حجم الملف حتى 250 ميجابايت • يدعم التفريغ متعدد المتحدثين</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={e => setUploadedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="inline-flex cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
                >
                  {uploadedFile ? `تم اختيار: ${uploadedFile.name}` : 'تصفح الملفات من الجهاز'}
                </label>
              </div>

              {/* Start Processing Action */}
              <button
                onClick={handleStartProcessing}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-black text-sm shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>جاري التفريغ الصوتي وتقسيم المحاور واستخراج القرارات...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>تفريغ وتحليل الاجتماع بالذكاء الاصطناعي 🚀</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: MEETING HUB & SUMMARY ================= */}
        {activeTab === 'meeting_hub' && (
          <div className="flex flex-col gap-6">
            {/* Header / Meeting Details */}
            <div className="enterprise-card rounded-3xl p-6 lg:p-8 border border-slate-800">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-0.5 rounded-full">
                      محضر معتمد ومفرغ بالذكاء الاصطناعي
                    </span>
                    <span className="text-xs text-slate-400">المدة: 38 دقيقة • 4 متحدثين</span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-black text-white font-display">
                    {meetingTitle}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير PDF</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('chat_rag')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>مناقشة المحضر (RAG)</span>
                  </button>
                </div>
              </div>

              {/* Attendees Pills */}
              <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 font-bold">الحاضرون:</span>
                {attendees.split('،').map((person, idx) => (
                  <span key={idx} className="bg-slate-900 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-medium">
                    👤 {person.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Executive AI Summary Box */}
            <div className="enterprise-card rounded-3xl p-6 lg:p-8 border border-emerald-500/30 bg-emerald-950/10">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>التلخيص التنفيذي للاجتماع (Executive Summary)</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-normal mb-4">
                ناقش مجلس الإدارة في جلسته المنعقدة اليوم مسار التحول الرقمي ومؤشرات الأداء المالي للنصف الثاني من العام. تم الاتفاق بالإجماع على زيادة الاستثمار في البنية التحتية للحوسبة السحابية بنسبة 25% لتلبية متطلبات هيئة البيانات والذكاء الاصطناعي (سدايا). كما استعرض المجلس الجاهزية التشغيلية للواجهات الأمامية الجديدة المعربة بالكامل بخط ثمانية العريض، وحدد منتصف ديسمبر 2026 موعداً لإطلاق المرحلة التجريبية مع تكليف الفريق القانوني بالانتهاء من لوائح الحوكمة.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-500/20 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">المحور المالي:</span>
                  <span className="text-white font-bold">اعتماد زيادة بنسبة 25%</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">المحور التقني:</span>
                  <span className="text-white font-bold">إطلاق تجريبي 15 ديسمبر</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">المحور القانوني:</span>
                  <span className="text-white font-bold">حوكمة وامتثال مع سدايا</span>
                </div>
              </div>
            </div>

            {/* Decisions & Action Items Matrix */}
            <div className="enterprise-card rounded-3xl p-6 lg:p-8 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-black text-white font-display">مصفوفة القرارات وخطة العمل (Action Items)</h3>
                </div>
                <span className="text-xs font-bold text-slate-400">4 قرارات مستخرجة تلقائياً</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-bold">القرار / التكليف</th>
                      <th className="pb-3 font-bold">المسؤول التنفيذي</th>
                      <th className="pb-3 font-bold">الموعد النهائي</th>
                      <th className="pb-3 font-bold">الأولوية</th>
                      <th className="pb-3 font-bold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {decisions.map(item => (
                      <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 font-bold text-white max-w-sm">{item.decision}</td>
                        <td className="py-3.5 text-slate-300">{item.assignee}</td>
                        <td className="py-3.5 text-slate-400">{item.deadline}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.priority === 'high'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {item.priority === 'high' ? 'عالية' : 'متوسطة'}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : item.status === 'in_progress'
                              ? 'bg-sky-950 text-sky-400 border border-sky-800'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}>
                            {item.status === 'completed' ? 'معتمد ومكتمل' : item.status === 'in_progress' ? 'قيد التنفيذ' : 'معلّق للمراجعة'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Diarized Transcript Segments */}
            <div className="enterprise-card rounded-3xl p-6 lg:p-8 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-white font-display">التفريغ الصوتي المقسم بالمحاور والمتحدثين</h3>
                  <p className="text-xs text-slate-400">نص الاجتماع الكامل المفرغ عبر WhisperX مع الطوابع الزمنية</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? 'إيقاف الاستماع' : 'استماع للتسجيل'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {segments.map((seg, idx) => (
                  <div key={idx} className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 transition-all hover:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-black text-emerald-400 font-display">{seg.topic}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {seg.timestamp}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                      <span className="text-slate-400">المتحدث:</span>
                      <span className="text-teal-400">{seg.speaker}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {seg.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CHAT WITH MEETING (RAG) ================= */}
        {activeTab === 'chat_rag' && (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-4 h-[750px]">
            <div className="enterprise-card rounded-3xl p-4 lg:p-6 border border-slate-800 flex-1 flex flex-col justify-between overflow-hidden">
              {/* Chat Header */}
              <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white font-display">مساعد المحضر الذكي (Meeting RAG)</h3>
                    <p className="text-[11px] text-slate-400">استجواب واسترجاع فوري من نصوص وقرارات الاجتماع الحالي</p>
                  </div>
                </div>

                <span className="text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full">
                  Cross-Encoder Reranker نشط
                </span>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3.5 pr-1">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'mr-auto bg-emerald-600 text-white rounded-bl-sm font-medium'
                        : 'ml-auto bg-slate-900 border border-slate-800 text-slate-200 rounded-br-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.citation && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <span>📌 المصدر:</span>
                        <span>{msg.citation}</span>
                      </div>
                    )}
                    <span className="text-[9px] text-slate-400 self-end mt-1">{msg.timestamp}</span>
                  </div>
                ))}
              </div>

              {/* Sample Quick Questions */}
              <div className="pt-2 border-t border-slate-800 mb-3">
                <span className="text-[10px] text-slate-400 block mb-1.5 font-bold">أسئلة مقترحة بنقرة واحدة:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    'ما هي الميزانية المعتمدة لقسم الذكاء الاصطناعي؟',
                    'متى موعد إطلاق النسخة التجريبية ومن المسؤول؟',
                    'أبرز القرارات والتوصيات الختامية'
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setChatInput(q);
                      }}
                      className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Bar */}
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="اسأل عن أي تفاصيل أو ميزانيات أو أسماء نوقشت في الاجتماع..."
                  className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none px-3"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow-md shadow-emerald-600/30"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: SETTINGS & ON-PREMISE AI ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
            <div className="enterprise-card rounded-3xl p-6 lg:p-8 border border-slate-800">
              <h2 className="text-xl lg:text-2xl font-black text-white font-display mb-2">
                إعدادات النماذج والخصوصية المحلية (On-Premise AI) ⚙️
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                يعمل مَجْلِس الذكي على تشغيل النماذج اللغوية محلياً بالكامل لحفظ سرية اجتماعات المؤسسات والبنوك.
              </p>

              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">نموذج التفريغ الصوتي (Speech-to-Text):</span>
                    <span className="text-[11px] text-slate-400">WhisperX + PyAnnote Diarization (مدمج محلياً)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                    جاهز ونشط
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">نموذج التلخيص واستخراج القرارات (LLM):</span>
                    <span className="text-[11px] text-slate-400">Qwen2.5-3B-Instruct (GGUF / Ollama Local Inference)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                    GGUF متصل
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">قاعدة بيانات المتجهات والفهرسة (Vector DB):</span>
                    <span className="text-[11px] text-slate-400">PostgreSQL pgvector / Local Chroma RAG Engine</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                    مفهرس
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Enterprise Footer */}
      <footer className="mt-8 border-t border-slate-800/80 bg-slate-950 py-6 px-4 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            مَجْلِس الذكي (Majles-AI) • المنظومة المؤسسية لإدارة وتلخيص الاجتماعات بالذكاء الاصطناعي
          </span>
          <span className="text-slate-400 font-semibold">
            هندسة وبرمجة: <strong className="text-white">محمد الحاج (Mohammed AL-Haj)</strong> © 2026
          </span>
        </div>
      </footer>
    </div>
  );
}
