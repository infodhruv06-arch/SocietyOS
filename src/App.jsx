import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Bell, LayoutDashboard, Users, GitBranch, Calendar as CalendarIcon,
  BarChart3, Settings as SettingsIcon, Plus, Filter, Download, X, Check,
  Clock, Mail, Phone, GraduationCap, FileText, ArrowLeft, MoreHorizontal,
  TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Menu, LogOut, Video,
  ExternalLink, AlertCircle, CheckCircle2, Circle, Sparkles, MapPin,
  ChevronDown, ArrowRight, PlayCircle, Building2, User as UserIcon, Trash2,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ============================================================
   MOCK DATA
   ============================================================ */

const DEPARTMENTS = ["Marketing", "Finance", "Events", "Operations", "Content"];

const INTERVIEWERS = [
  { id: "int1", name: "Ananya Reddy", email: "ananya.reddy@societyos.club" },
  { id: "int2", name: "Kabir Malhotra", email: "kabir.malhotra@societyos.club" },
  { id: "int3", name: "Meera Nair", email: "meera.nair@societyos.club" },
  { id: "int4", name: "Dhruv Kapoor", email: "dhruv.kapoor@societyos.club" },
];

const STAGES = ["New", "Screening", "Shortlisted", "Interview", "Selected", "Rejected"];

const STAGE_STYLE = {
  New: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", ring: "ring-gray-200" },
  Screening: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", ring: "ring-amber-200" },
  Shortlisted: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", ring: "ring-blue-200" },
  Interview: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500", ring: "ring-violet-200" },
  Selected: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", ring: "ring-emerald-200" },
  Rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", ring: "ring-red-200" },
};

const COLLEGES = [
  "SRCC", "Hindu College", "LSR", "Shaheed Sukhdev College",
  "Miranda House", "Kirori Mal College", "Hansraj College",
  "St. Stephen's College", "IIT Delhi", "Jamia Millia Islamia",
  "Ramjas College", "Venkateswara College",
];

const ANSWER_BANK = {
  Marketing: {
    q1: "Why do you want to join the society?",
    a1: "I've run three Instagram campaigns for my college fest and grew a page from 400 to 6,000 followers. I want to bring that same experimentation to a bigger stage and learn how a real recruitment funnel is measured.",
    q2: "Tell us about a project you have worked on.",
    a2: "I led the content calendar for my department's annual fest, coordinating five designers and two copywriters. We hit our registration target three days early by A/B testing reels against static posts.",
  },
  Finance: {
    q1: "Why do you want to join the society?",
    a1: "I've been building a small stock-tracking spreadsheet for my friend group for a year and I want to turn that hobby into real analytical work — building models, not just watching numbers.",
    q2: "Tell us about a project you have worked on.",
    a2: "For a college case competition, I built a three-statement model for a D2C brand and presented a valuation range to judges from Bain. We placed second out of 40 teams.",
  },
  Events: {
    q1: "Why do you want to join the society?",
    a1: "I managed logistics for my school's 800-person annual day and loved the chaos of it — vendors, volunteers, timelines all at once. I want to do that at college scale.",
    q2: "Tell us about a project you have worked on.",
    a2: "I coordinated venue, catering and AV for a 300-person cultural night on a budget cut by 20% two weeks before the event, and we still came in under budget.",
  },
  Operations: {
    q1: "Why do you want to join the society?",
    a1: "I like fixing broken processes more than I like starting new ones. My hostel's mess committee had no complaint tracking, so I built one in Google Sheets that's still used today.",
    q2: "Tell us about a project you have worked on.",
    a2: "I redesigned the volunteer shift-scheduling process for a 150-person fest crew, cutting no-shows from 22% to 6% using a simple confirmation-reminder system.",
  },
  Content: {
    q1: "Why do you want to join the society?",
    a1: "I write a small newsletter for my batch with about 300 subscribers, mostly essays on campus life. I want to write for an audience that has to be earned, not just friends.",
    q2: "Tell us about a project you have worked on.",
    a2: "I ghost-wrote LinkedIn posts for our placement cell during recruitment season, and one thread on interview prep crossed 40,000 views.",
  },
};

const RIYA_ANSWERS = {
  q1: "Why do you want to join the society?",
  a1: "Marketing is the one part of college life where I get to see an idea turn into a number — signups, shares, footfall. I ran paid promotion for our fest on a ₹5,000 budget and tracked every rupee against registrations. I want to do that with better tools and a sharper team.",
  q2: "Tell us about a project you have worked on.",
  a2: "I led social media for SRCC's annual business fest. We restructured the content calendar around three content pillars instead of posting reactively, and grew event page visits by 65% year-on-year while keeping the same two-person team.",
};

const NAMED_ANSWERS = {
  "Arjun Kapoor": ANSWER_BANK.Finance,
  "Simran Gupta": ANSWER_BANK.Events,
  "Kabir Singh": ANSWER_BANK.Operations,
  "Neha Sharma": ANSWER_BANK.Content,
};

function makeApplicant(id, name, college, course, year, department, stage, score, appliedOn, interviewerId, email, phone) {
  const bank = NAMED_ANSWERS[name] || ANSWER_BANK[department];
  return {
    id, name, college, course, year, department,
    role: department,
    stage, score, applicationDate: appliedOn, interviewerId,
    email, phone,
    resumeUrl: `#resume-${id}`,
    applicationAnswers:
      name === "Riya Mehta"
        ? [{ q: RIYA_ANSWERS.q1, a: RIYA_ANSWERS.a1 }, { q: RIYA_ANSWERS.q2, a: RIYA_ANSWERS.a2 }]
        : [{ q: bank.q1, a: bank.a1 }, { q: bank.q2, a: bank.a2 }],
  };
}

const INITIAL_APPLICANTS = [
  makeApplicant("a1", "Riya Mehta", "SRCC", "B.Com (Hons.)", "2nd Year", "Marketing", "Interview", 8.7, "Aug 18", "int1", "riya.mehta@srcc.edu", "+91 98111 22334"),
  makeApplicant("a2", "Arjun Kapoor", "Hindu College", "B.A. Economics (Hons.)", "3rd Year", "Finance", "Shortlisted", 8.2, "Aug 18", null, "arjun.kapoor@hinducollege.edu", "+91 98220 33445"),
  makeApplicant("a3", "Simran Gupta", "LSR", "BMS", "2nd Year", "Events", "Interview", 9.1, "Aug 17", "int2", "simran.gupta@lsr.edu", "+91 97330 44556"),
  makeApplicant("a4", "Kabir Singh", "SRCC", "B.Com (Hons.)", "1st Year", "Operations", "Screening", 7.4, "Aug 17", null, "kabir.singh@srcc.edu", "+91 96440 55667"),
  makeApplicant("a5", "Neha Sharma", "Shaheed Sukhdev College", "B.A. English (Hons.)", "3rd Year", "Content", "Selected", 9.3, "Aug 15", "int1", "neha.sharma@ssc.edu", "+91 95550 66778"),
  makeApplicant("a6", "Aditi Rao", "Miranda House", "B.A. Economics (Hons.)", "2nd Year", "Marketing", "Screening", 7.1, "Aug 19", null, "aditi.rao@mirandahouse.edu", "+91 94660 77889"),
  makeApplicant("a7", "Rohan Verma", "Hansraj College", "B.Com", "2nd Year", "Finance", "New", 6.8, "Aug 20", null, "rohan.verma@hansraj.edu", "+91 93770 88990"),
  makeApplicant("a8", "Priya Sharma", "Kirori Mal College", "BMS", "3rd Year", "Events", "Shortlisted", 8.4, "Aug 16", null, "priya.sharma@kmc.edu", "+91 92880 99001"),
  makeApplicant("a9", "Rahul Mehta", "St. Stephen's College", "B.A. Economics (Hons.)", "1st Year", "Operations", "New", 6.5, "Aug 18", null, "rahul.mehta@ststephens.edu", "+91 91990 00112"),
  makeApplicant("a10", "Ananya Verma", "LSR", "B.A. English (Hons.)", "2nd Year", "Content", "Interview", 8.5, "Aug 17", "int3", "ananya.verma@lsr.edu", "+91 90001 11223"),
  makeApplicant("a11", "Vikram Chauhan", "Ramjas College", "B.Com (Hons.)", "3rd Year", "Marketing", "Rejected", 5.9, "Aug 14", "int4", "vikram.chauhan@ramjas.edu", "+91 89112 22334"),
  makeApplicant("a12", "Ishita Malhotra", "Venkateswara College", "B.A. Economics (Hons.)", "2nd Year", "Finance", "Shortlisted", 8.0, "Aug 17", null, "ishita.malhotra@venky.edu", "+91 88223 33445"),
  makeApplicant("a13", "Karan Bansal", "IIT Delhi", "B.Tech", "3rd Year", "Operations", "Interview", 8.9, "Aug 16", "int2", "karan.bansal@iitd.ac.in", "+91 87334 44556"),
  makeApplicant("a14", "Tanvi Joshi", "LSR", "BMS", "1st Year", "Events", "New", 6.2, "Aug 20", null, "tanvi.joshi@lsr.edu", "+91 86445 55667"),
  makeApplicant("a15", "Aryan Khanna", "Hindu College", "B.A. Economics (Hons.)", "2nd Year", "Marketing", "Screening", 7.6, "Aug 19", null, "aryan.khanna@hinducollege.edu", "+91 85556 66778"),
  makeApplicant("a16", "Meera Iyer", "Miranda House", "B.A. English (Hons.)", "3rd Year", "Content", "Shortlisted", 8.3, "Aug 15", null, "meera.iyer@mirandahouse.edu", "+91 84667 77889"),
  makeApplicant("a17", "Siddharth Rao", "SRCC", "B.Com (Hons.)", "2nd Year", "Finance", "Interview", 8.6, "Aug 16", "int3", "siddharth.rao@srcc.edu", "+91 83778 88990"),
  makeApplicant("a18", "Divya Nair", "Jamia Millia Islamia", "BMS", "1st Year", "Events", "Screening", 7.0, "Aug 18", null, "divya.nair@jmi.ac.in", "+91 82889 99001"),
  makeApplicant("a19", "Yash Agarwal", "Kirori Mal College", "B.A. Economics (Hons.)", "3rd Year", "Operations", "Selected", 9.0, "Aug 13", "int4", "yash.agarwal@kmc.edu", "+91 81990 00112"),
  makeApplicant("a20", "Naina Kapoor", "Hansraj College", "B.A. English (Hons.)", "2nd Year", "Content", "New", 6.9, "Aug 19", null, "naina.kapoor@hansraj.edu", "+91 80001 11223"),
  makeApplicant("a21", "Varun Mehta", "St. Stephen's College", "B.A. Economics (Hons.)", "3rd Year", "Marketing", "Rejected", 5.5, "Aug 12", "int1", "varun.mehta@ststephens.edu", "+91 79112 22334"),
  makeApplicant("a22", "Sanya Bhatia", "Ramjas College", "BMS", "2nd Year", "Events", "Shortlisted", 8.1, "Aug 16", null, "sanya.bhatia@ramjas.edu", "+91 78223 33445"),
  makeApplicant("a23", "Kunal Sethi", "IIT Delhi", "B.Tech", "2nd Year", "Finance", "Screening", 7.3, "Aug 18", null, "kunal.sethi@iitd.ac.in", "+91 77334 44556"),
  makeApplicant("a24", "Riya Choudhary", "Venkateswara College", "B.A. Economics (Hons.)", "1st Year", "Operations", "New", 6.4, "Aug 20", null, "riya.choudhary@venky.edu", "+91 76445 55667"),
  makeApplicant("a25", "Ananya Kapoor", "LSR", "B.A. English (Hons.)", "3rd Year", "Content", "Selected", 9.2, "Aug 14", "int3", "ananya.kapoor@lsr.edu", "+91 75556 66778"),
];

const INITIAL_INTERVIEWS = [
  { id: "iv1", applicantId: "a1", interviewerId: "int1", date: "2026-08-21", time: "11:30", duration: 30, type: "Video", status: "Upcoming", meetingLink: "meet.societyos.club/riya-mehta" },
  { id: "iv2", applicantId: "a2", interviewerId: "int3", date: "2026-08-21", time: "12:00", duration: 30, type: "Video", status: "Upcoming", meetingLink: "meet.societyos.club/arjun-kapoor" },
  { id: "iv3", applicantId: "a3", interviewerId: "int2", date: "2026-08-21", time: "14:30", duration: 45, type: "In-person", status: "Upcoming", meetingLink: "Room 204, Student Activity Centre" },
  { id: "iv4", applicantId: "a4", interviewerId: "int4", date: "2026-08-21", time: "16:00", duration: 30, type: "Video", status: "Upcoming", meetingLink: "meet.societyos.club/kabir-singh" },
  { id: "iv5", applicantId: "a13", interviewerId: "int2", date: "2026-08-18", time: "10:00", duration: 30, type: "Video", status: "Completed", meetingLink: "meet.societyos.club/karan-bansal" },
  { id: "iv6", applicantId: "a17", interviewerId: "int3", date: "2026-08-18", time: "15:00", duration: 30, type: "Video", status: "Completed", meetingLink: "meet.societyos.club/siddharth-rao" },
  { id: "iv7", applicantId: "a10", interviewerId: "int3", date: "2026-08-17", time: "11:00", duration: 30, type: "Video", status: "Completed", meetingLink: "meet.societyos.club/ananya-verma" },
  { id: "iv8", applicantId: "a5", interviewerId: "int1", date: "2026-08-15", time: "13:00", duration: 30, type: "In-person", status: "Completed", meetingLink: "Room 118, Student Activity Centre" },
];

const INITIAL_EVALUATIONS = [
  { id: "ev1", applicantId: "a1", interviewerId: "int1", communication: 9, problemSolving: 8, creativity: 9, domainKnowledge: 8, cultureFit: 9, overallScore: 8.7, recommendation: "Strong Hire", comments: "Strong communicator with excellent understanding of marketing. Would recommend moving forward." },
  { id: "ev2", applicantId: "a3", interviewerId: "int2", communication: 9, problemSolving: 9, creativity: 9, domainKnowledge: 8, cultureFit: 9, overallScore: 9.1, recommendation: "Strong Hire", comments: "Exceptional ownership of past events. Handles pressure calmly and asks sharp clarifying questions." },
  { id: "ev3", applicantId: "a13", interviewerId: "int2", communication: 8, problemSolving: 9, creativity: 8, domainKnowledge: 9, cultureFit: 9, overallScore: 8.9, recommendation: "Hire", comments: "Very structured thinker, brings a process mindset that Operations is missing right now." },
  { id: "ev4", applicantId: "a17", interviewerId: "int3", communication: 8, problemSolving: 9, creativity: 8, domainKnowledge: 9, cultureFit: 9, overallScore: 8.6, recommendation: "Hire", comments: "Confident with numbers, walked through his model cleanly. Slightly reserved but improves with prompting." },
  { id: "ev5", applicantId: "a10", interviewerId: "int3", communication: 9, problemSolving: 8, creativity: 8, domainKnowledge: 8, cultureFit: 9, overallScore: 8.5, recommendation: "Hire", comments: "Clear writing voice and good instincts on what makes a post shareable." },
  { id: "ev6", applicantId: "a5", interviewerId: "int1", communication: 10, problemSolving: 9, creativity: 9, domainKnowledge: 9, cultureFit: 9, overallScore: 9.3, recommendation: "Strong Hire", comments: "One of the strongest writing samples we've seen this cycle. Easy Strong Hire." },
];

const APPLICATION_TREND = [
  { day: "Aug 8", applications: 9 }, { day: "Aug 9", applications: 14 },
  { day: "Aug 10", applications: 11 }, { day: "Aug 11", applications: 18 },
  { day: "Aug 12", applications: 22 }, { day: "Aug 13", applications: 16 },
  { day: "Aug 14", applications: 20 }, { day: "Aug 15", applications: 25 },
  { day: "Aug 16", applications: 19 }, { day: "Aug 17", applications: 23 },
  { day: "Aug 18", applications: 28 }, { day: "Aug 19", applications: 21 },
  { day: "Aug 20", applications: 17 }, { day: "Aug 21", applications: 12 },
];

const RECENT_ACTIVITY = [
  { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", text: "Priya Sharma was shortlisted", time: "24 min ago" },
  { icon: FileText, color: "text-blue-600", bg: "bg-blue-50", text: "Rahul Mehta submitted an application", time: "1 hr ago" },
  { icon: CalendarIcon, color: "text-violet-600", bg: "bg-violet-50", text: "12 interviews were scheduled", time: "3 hr ago" },
  { icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50", text: "Ananya Verma received an interview score of 8.5", time: "5 hr ago" },
];

/* ============================================================
   HELPERS
   ============================================================ */

function initials(name) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

const AVATAR_COLORS = ["bg-indigo-100 text-indigo-700", "bg-violet-100 text-violet-700", "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"];
function avatarColor(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function downloadCSV(applicants) {
  const headers = ["Name", "College", "Department", "Stage", "Score", "Applied On"];
  const rows = applicants.map((a) => [a.name, a.college, a.department, a.stage, a.score, a.applicationDate]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "societyos-applicants.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ============================================================
   SHARED UI PRIMITIVES
   ============================================================ */

function Logo({ dark }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="9" fill="#4F46E5" />
        <path
          d="M21 11.5c0-1.38-1.12-2.5-2.5-2.5h-4c-1.66 0-3 1.34-3 3s1.34 3 3 3h3c1.66 0 3 1.34 3 3s-1.34 3-3 3h-4c-1.38 0-2.5-1.12-2.5-2.5"
          stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"
        />
      </svg>
      <span className={`font-semibold text-[17px] tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
        SocietyOS
      </span>
    </div>
  );
}

function StatusBadge({ stage }) {
  const s = STAGE_STYLE[stage] || STAGE_STYLE.New;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {stage}
    </span>
  );
}

function KPICard({ label, value, delta, deltaLabel, icon: Icon, positive = true }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Icon size={16} className="text-indigo-600" />
          </div>
        )}
      </div>
      <div className="text-3xl font-semibold text-gray-900 tabular-nums tracking-tight">{value}</div>
      {delta && (
        <div className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}>
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {delta} <span className="text-gray-400 font-normal">{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}

function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-xl border border-gray-100 w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} aria-label="Close dialog" className="text-gray-400 hover:text-gray-600 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div key={t.id} className="bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-[fadeIn_0.15s_ease-out] max-w-sm">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          {t.message}
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

function Toggle({ checked, onChange, label, sub }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${checked ? "bg-indigo-600" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
      </button>
    </div>
  );
}

/* ============================================================
   NAVIGATION SHELL
   ============================================================ */

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "applicants", label: "Applicants", icon: Users },
  { key: "pipeline", label: "Pipeline", icon: GitBranch },
  { key: "scheduler", label: "Interviews", icon: CalendarIcon },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

function Sidebar({ view, setView, sidebarOpen, setSidebarOpen, role, setRole }) {
  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <Logo />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = view === item.key || (view === "applicant-detail" && item.key === "applicants") || (view === "evaluation" && item.key === "scheduler") || (view === "interviewer" && item.key === "scheduler");
            return (
              <button
                key={item.key}
                onClick={() => { setView(item.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  active ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={17} strokeWidth={2} />
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-gray-100">
            <button
              onClick={() => { setView("interviewer"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                view === "interviewer" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <UserIcon size={17} strokeWidth={2} />
              Interviewer View
            </button>
          </div>
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold shrink-0">
              AR
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">Aryan Sharma</div>
              <div className="text-xs text-gray-500 truncate">Recruitment Head</div>
            </div>
            <LogOut size={15} className="text-gray-400" />
          </div>
        </div>
      </aside>
    </>
  );
}

function TopBar({ setSidebarOpen, title, subtitle }) {
  return (
    <div className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button className="md:hidden text-gray-500 p-1" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="min-w-0 hidden md:block">
          <div className="text-sm font-semibold text-gray-900 truncate">{title}</div>
          {subtitle && <div className="text-xs text-gray-500 truncate">{subtitle}</div>}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search applicants, interviews..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button className="relative text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
          AR
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LANDING PAGE
   ============================================================ */

function LandingPage({ onDemo }) {
  const features = [
    { icon: FileText, title: "Applications", desc: "Collect and organize candidate applications in one workspace." },
    { icon: Filter, title: "Screening", desc: "Shortlist candidates using customizable, department-specific criteria." },
    { icon: CalendarIcon, title: "Interviews", desc: "Schedule interviews and automatically track interviewer feedback." },
    { icon: BarChart3, title: "Analytics", desc: "Understand your recruitment funnel and interviewer performance." },
  ];
  const steps = [
    { n: "01", t: "Collect", d: "Applicants apply through a branded form built for your society." },
    { n: "02", t: "Screen", d: "Filter by college, score and department in a shared table." },
    { n: "03", t: "Interview", d: "Auto-schedule slots and sync interviewer calendars." },
    { n: "04", t: "Select", d: "Compare scorecards side by side before deciding." },
    { n: "05", t: "Onboard", d: "Move selected members straight into your team roster." },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-6">
            <a href="#how" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block">How it works</a>
            <button onClick={onDemo} className="text-sm font-medium text-gray-900 hover:text-indigo-600">Log in</button>
            <button onClick={onDemo} className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Try the Demo
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium mb-6">
          <Sparkles size={12} /> Built for college societies
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1] text-gray-900">
          Society recruitment,
          <br />
          without the spreadsheet chaos.
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          SocietyOS helps college clubs manage applications, screening, interviews and onboarding from one simple workspace.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={onDemo} className="bg-indigo-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
            Try the Demo
          </button>
          <a href="#how" className="text-sm font-medium text-gray-700 px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
            See how it works
          </a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-gray-50">
          <div className="h-9 bg-white border-b border-gray-200 flex items-center gap-1.5 px-4">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          </div>
          <div className="p-6 grid grid-cols-4 gap-4">
            {[["Applicants", "248"], ["Shortlisted", "64"], ["Interviews", "38"], ["Selected", "21"]].map(([l, v]) => (
              <div key={l} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="text-xs text-gray-500">{l}</div>
                <div className="text-2xl font-semibold text-gray-900 mt-1">{v}</div>
              </div>
            ))}
            <div className="col-span-4 bg-white rounded-xl border border-gray-100 p-4 h-40 flex items-end gap-1.5">
              {APPLICATION_TREND.map((d) => (
                <div key={d.day} className="flex-1 bg-indigo-100 rounded-t" style={{ height: `${d.applications * 3.2}px` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-10">Everything your recruitment team needs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                <f.icon size={18} className="text-indigo-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">{f.title}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-10">How it works</h2>
        <div className="grid sm:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="text-xs font-mono text-indigo-400 font-semibold mb-2">{s.n}</div>
              <div className="font-semibold text-gray-900 mb-1">{s.t}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">Run this cycle without the chaos.</h2>
          <p className="text-gray-400 mb-8">See a fully populated demo workspace — no signup required.</p>
          <button onClick={onDemo} className="bg-white text-gray-900 text-sm font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
            Try the Demo
          </button>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-gray-400">
        SocietyOS — Recruit better. Run smoother.
      </footer>
    </div>
  );
}

/* ============================================================
   LOGIN PAGE
   ============================================================ */

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8"><Logo /></div>
        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">Log in to your recruitment workspace.</p>
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <Field label="Email">
              <input type="email" className={inputClass} placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Password">
              <input type="password" className={inputClass} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <button type="submit" className="w-full bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
              Log in
            </button>
          </form>
          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          <button onClick={onLogin} className="w-full border border-gray-200 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-700">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account? <button onClick={onLogin} className="text-indigo-600 font-medium hover:underline">Create one</button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */

function FunnelBar({ label, value, max, color }) {
  const pct = Math.max(8, (value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs text-gray-500 text-right shrink-0">{label}</div>
      <div className="flex-1 bg-gray-100 rounded-lg h-8 relative overflow-hidden">
        <div className={`h-full rounded-lg flex items-center justify-end px-3 ${color}`} style={{ width: `${pct}%` }}>
          <span className="text-xs font-semibold text-white tabular-nums">{value}</span>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ applicants, interviews, setView, openApplicant }) {
  const today = INITIAL_INTERVIEWS.filter((i) => i.date === "2026-08-21");
  const funnel = [
    { label: "Applied", value: 248, color: "bg-gray-400" },
    { label: "Screened", value: 156, color: "bg-amber-500" },
    { label: "Shortlisted", value: 64, color: "bg-blue-500" },
    { label: "Interviewed", value: 38, color: "bg-violet-500" },
    { label: "Selected", value: 21, color: "bg-emerald-500" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Good morning, Aryan</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your recruitment.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Applicants" value="248" delta="+12%" deltaLabel="vs last week" icon={Users} />
        <KPICard label="Shortlisted" value="64" delta="+8%" deltaLabel="vs last week" icon={Filter} />
        <KPICard label="Interviews Scheduled" value="38" delta="+15%" deltaLabel="vs last week" icon={CalendarIcon} />
        <KPICard label="Selected" value="21" delta="+3" deltaLabel="this week" icon={CheckCircle2} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-5">Recruitment Funnel</h3>
          <div className="space-y-3">
            {funnel.map((f) => <FunnelBar key={f.label} {...f} max={248} />)}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Upcoming Interviews</h3>
            <span className="text-xs text-gray-400">Today</span>
          </div>
          <div className="space-y-3 flex-1">
            {today.map((iv) => {
              const app = applicants.find((a) => a.id === iv.applicantId);
              return (
                <button
                  key={iv.id}
                  onClick={() => openApplicant(iv.applicantId)}
                  className="w-full flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-50 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="w-12 text-xs font-medium text-gray-500 shrink-0 tabular-nums">
                    {formatTime(iv.time)}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${avatarColor(app.name)}`}>
                    {initials(app.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">{app.name}</div>
                    <div className="text-xs text-gray-400 truncate">{app.department}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => setView("scheduler")} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            View all interviews <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Application Trends</h3>
          <p className="text-xs text-gray-400 mb-4">Last 14 days</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={APPLICATION_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Line type="monotone" dataKey="applications" stroke="#4F46E5" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Recruitment deadline</h3>
            <p className="text-xs text-gray-400 mb-4">Applications close in</p>
            <div className="text-3xl font-semibold text-gray-900 tabular-nums">06<span className="text-sm font-normal text-gray-400"> days </span>14<span className="text-sm font-normal text-gray-400"> hrs</span></div>
          </div>
          <button onClick={() => setView("applicants")} className="mt-6 w-full bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
            View Recruitment
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon size={15} className={item.color} />
                </div>
                <div className="flex-1 text-sm text-gray-700">{item.text}</div>
                <div className="text-xs text-gray-400 shrink-0">{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} />
            <h3 className="font-semibold">Product Insights</h3>
          </div>
          <div className="space-y-4 flex-1">
            <div>
              <div className="text-2xl font-semibold tabular-nums">72%</div>
              <div className="text-xs text-indigo-100">of applicants complete their profile</div>
            </div>
            <div>
              <div className="text-sm font-medium">Biggest drop-off</div>
              <div className="text-xs text-indigo-100">Application → Screening</div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-xs leading-relaxed mt-2">
            Add a progress indicator and save-draft functionality to improve application completion.
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/* ============================================================
   APPLICANTS PAGE
   ============================================================ */

function ApplicantsPage({ applicants, openApplicant, showToast, addApplicant }) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const perPage = 10;

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.college.toLowerCase().includes(search.toLowerCase());
      const matchesStage = stageFilter === "All" || a.stage === stageFilter;
      const matchesDept = deptFilter === "All" || a.department === deptFilter;
      return matchesSearch && matchesStage && matchesDept;
    });
  }, [applicants, search, stageFilter, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Applicants</h1>
          <p className="text-gray-500 text-sm mt-1">Review, filter and manage candidates.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { downloadCSV(filtered); showToast(`Exported ${filtered.length} applicants to CSV`); }}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 px-3.5 py-2 rounded-lg hover:bg-gray-50"
          >
            <Download size={15} /> Export
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 px-3.5 py-2 rounded-lg hover:bg-indigo-700">
            <Plus size={15} /> Add Applicant
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search applicants or colleges..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>
        <select value={stageFilter} onChange={(e) => { setStageFilter(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All stages</option>
          {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} results</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left font-medium px-5 py-3">Applicant</th>
                <th className="text-left font-medium px-5 py-3 hidden md:table-cell">College</th>
                <th className="text-left font-medium px-5 py-3 hidden lg:table-cell">Applied For</th>
                <th className="text-left font-medium px-5 py-3">Stage</th>
                <th className="text-left font-medium px-5 py-3">Score</th>
                <th className="text-left font-medium px-5 py-3 hidden lg:table-cell">Interviewer</th>
                <th className="text-left font-medium px-5 py-3 hidden md:table-cell">Applied On</th>
                <th className="text-left font-medium px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 && (
                <tr><td colSpan={8} className="text-center py-14 text-gray-400 text-sm">No applicants match your filters.</td></tr>
              )}
              {pageItems.map((a) => {
                const interviewer = INTERVIEWERS.find((i) => i.id === a.interviewerId);
                return (
                  <tr key={a.id} onClick={() => openApplicant(a.id)} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${avatarColor(a.name)}`}>
                          {initials(a.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{a.name}</div>
                          <div className="text-xs text-gray-400 md:hidden truncate">{a.college}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{a.college}</td>
                    <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{a.department}</td>
                    <td className="px-5 py-3"><StatusBadge stage={a.stage} /></td>
                    <td className="px-5 py-3 font-medium text-gray-900 tabular-nums">{a.score.toFixed(1)}</td>
                    <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{interviewer ? interviewer.name.split(" ")[0] : "—"}</td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{a.applicationDate}</td>
                    <td className="px-5 py-3 text-right">
                      <MoreHorizontal size={16} className="text-gray-300" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
              <ChevronLeft size={15} />
            </button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Applicant">
        <AddApplicantForm
          onSubmit={(data) => { addApplicant(data); setShowAdd(false); showToast(`${data.name} added to Applicants`); }}
        />
      </Modal>
    </div>
  );
}

function AddApplicantForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (!name.trim()) return;
      onSubmit({ name, college: college || "Not specified", department });
    }}>
      <Field label="Full name">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ishaan Bhatt" required />
      </Field>
      <Field label="College">
        <input className={inputClass} value={college} onChange={(e) => setCollege(e.target.value)} placeholder="e.g. SRCC" />
      </Field>
      <Field label="Department applying for">
        <select className={inputClass} value={department} onChange={(e) => setDepartment(e.target.value)}>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>
      <button type="submit" className="w-full bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700 mt-2">
        Add Applicant
      </button>
    </form>
  );
}

/* ============================================================
   APPLICANT DETAIL
   ============================================================ */

function ApplicantDetailPage({ applicant, onBack, setStage, showToast, evaluations, goToSchedule }) {
  const [confirmReject, setConfirmReject] = useState(false);
  if (!applicant) return null;
  const evalRecord = evaluations.find((e) => e.applicantId === applicant.id);
  const timelineSteps = ["Application submitted", "Screened", "Shortlisted", "Interview scheduled", "Interview completed"];
  const stageOrder = ["New", "Screening", "Shortlisted", "Interview", "Selected"];
  const currentIdx = stageOrder.indexOf(applicant.stage);
  const completedSteps = applicant.stage === "Rejected" ? 2 : Math.max(1, currentIdx + 1);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft size={15} /> Back to Applicants
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-semibold shrink-0 ${avatarColor(applicant.name)}`}>
              {initials(applicant.name)}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{applicant.name}</h1>
              <p className="text-sm text-gray-500">{applicant.college} • {applicant.course}</p>
              <p className="text-sm text-gray-500">Applied for: <span className="font-medium text-gray-700">{applicant.department}</span></p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <StatusBadge stage={applicant.stage} />
            <div className="flex items-center gap-2">
              <select
                value={applicant.stage}
                onChange={(e) => { setStage(applicant.id, e.target.value); showToast(`${applicant.name} moved to ${e.target.value}`); }}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => goToSchedule(applicant.id)} className="text-sm font-medium text-white bg-indigo-600 px-3.5 py-2 rounded-lg hover:bg-indigo-700 whitespace-nowrap">
                Schedule Interview
              </button>
              <button onClick={() => setConfirmReject(true)} className="text-sm font-medium text-red-600 border border-red-200 px-3.5 py-2 rounded-lg hover:bg-red-50 whitespace-nowrap">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Candidate Information</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <InfoRow icon={Mail} label="Email" value={applicant.email} />
              <InfoRow icon={Phone} label="Phone" value={applicant.phone} />
              <InfoRow icon={Building2} label="College" value={applicant.college} />
              <InfoRow icon={GraduationCap} label="Course" value={applicant.course} />
              <InfoRow icon={Clock} label="Year" value={applicant.year} />
              <InfoRow icon={MapPin} label="Location" value="New Delhi, India" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Application Answers</h3>
            <div className="space-y-5">
              {applicant.applicationAnswers.map((qa, i) => (
                <div key={i}>
                  <div className="text-sm font-medium text-gray-900 mb-1.5">{qa.q}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{qa.a}</p>
                </div>
              ))}
            </div>
            <a href={applicant.resumeUrl} onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-5">
              <FileText size={15} /> View Resume <ExternalLink size={12} />
            </a>
          </div>

          {evalRecord && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Interviewer Feedback</h3>
              <p className="text-sm text-gray-600 leading-relaxed italic">"{evalRecord.comments}"</p>
              <p className="text-xs text-gray-400 mt-3">— {INTERVIEWERS.find((i) => i.id === evalRecord.interviewerId)?.name}</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Scorecard</h3>
            <div className="space-y-3">
              {evalRecord ? (
                [
                  ["Communication", evalRecord.communication],
                  ["Problem Solving", evalRecord.problemSolving],
                  ["Creativity", evalRecord.creativity],
                  ["Domain Knowledge", evalRecord.domainKnowledge],
                  ["Culture Fit", evalRecord.cultureFit],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{val}/10</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No scorecard submitted yet.</p>
              )}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall</span>
              <span className="text-xl font-semibold text-indigo-600 tabular-nums">{applicant.score.toFixed(1)}/10</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {timelineSteps.map((step, i) => {
                const done = i < completedSteps;
                return (
                  <div key={step} className="flex items-center gap-3">
                    {done ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <Circle size={16} className="text-gray-200 shrink-0" />}
                    <span className={`text-sm ${done ? "text-gray-700" : "text-gray-300"}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal open={confirmReject} onClose={() => setConfirmReject(false)} title="Reject applicant?">
        <p className="text-sm text-gray-600 mb-6">
          This will move <span className="font-medium text-gray-900">{applicant.name}</span> to the Rejected stage. This action can be undone later from the Pipeline view.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setConfirmReject(false)} className="text-sm font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => { setStage(applicant.id, "Rejected"); showToast(`${applicant.name} was rejected`); setConfirmReject(false); }}
            className="text-sm font-medium text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Reject candidate
          </button>
        </div>
      </Modal>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={15} className="text-gray-400 shrink-0" />
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-gray-800">{value}</div>
      </div>
    </div>
  );
}

/* ============================================================
   PIPELINE (KANBAN)
   ============================================================ */

const MONTH_INDEX = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
function daysSince(dateStr) {
  const [monthAbbr, dayNum] = dateStr.split(" ");
  const d = new Date(2026, MONTH_INDEX[monthAbbr] ?? 7, Number(dayNum));
  const now = new Date(2026, 7, 21); // Aug 21, 2026
  return Math.max(0, Math.round((now - d) / 86400000));
}

function PipelineCard({ applicant, onOpen, onDragStart }) {
  const draggedRef = useRef(false);
  return (
    <div
      draggable
      onDragStart={(e) => { draggedRef.current = true; onDragStart(e, applicant.id); }}
      onDragEnd={() => { setTimeout(() => { draggedRef.current = false; }, 0); }}
      onClick={() => { if (!draggedRef.current) onOpen(applicant.id); }}
      className="bg-white border border-gray-200 rounded-xl p-3.5 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all active:cursor-grabbing"
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${avatarColor(applicant.name)}`}>
          {initials(applicant.name)}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{applicant.name}</div>
          <div className="text-xs text-gray-400 truncate">{applicant.college}</div>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{applicant.department}</span>
        <span className="font-semibold text-gray-900 tabular-nums">{applicant.score.toFixed(1)}</span>
      </div>
      <div className="text-[11px] text-gray-400 mt-1.5">{daysSince(applicant.applicationDate)}d since applied</div>
    </div>
  );
}

function PipelinePage({ applicants, setStage, openApplicant, showToast }) {
  const [deptFilter, setDeptFilter] = useState("All departments");
  const [dragOverCol, setDragOverCol] = useState(null);

  const filtered = applicants.filter((a) => deptFilter === "All departments" || a.department === deptFilter);

  const onDragStart = (e, id) => e.dataTransfer.setData("text/plain", id);
  const onDrop = (e, stage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const app = applicants.find((a) => a.id === id);
    if (app && app.stage !== stage) {
      setStage(id, stage);
      showToast(`${app.name} moved to ${stage}`);
    }
    setDragOverCol(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-full mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Interview Pipeline</h1>
          <p className="text-gray-500 text-sm mt-1">Drag candidates between stages as they progress.</p>
        </div>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option>All departments</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const items = filtered.filter((a) => a.stage === stage);
          const s = STAGE_STYLE[stage];
          return (
            <div
              key={stage}
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(stage); }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => onDrop(e, stage)}
              className={`w-72 shrink-0 rounded-2xl p-3 transition-colors ${dragOverCol === stage ? "bg-indigo-50 ring-2 ring-indigo-200" : "bg-gray-50"}`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-sm font-semibold text-gray-700">{stage}</span>
                </div>
                <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">{items.length}</span>
              </div>
              <div className="space-y-2.5 min-h-[80px]">
                {items.map((a) => (
                  <PipelineCard key={a.id} applicant={a} onOpen={openApplicant} onDragStart={onDragStart} />
                ))}
                {items.length === 0 && (
                  <div className="text-xs text-gray-300 text-center py-8 border border-dashed border-gray-200 rounded-xl">
                    No candidates here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   SCHEDULER
   ============================================================ */

function SchedulerPage({ applicants, interviews, addInterview, showToast }) {
  const [calView, setCalView] = useState("Month");
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-08-21");

  const daysInMonth = 31; // August
  const firstWeekday = new Date(2026, 7, 1).getDay();
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const interviewsByDay = {};
  interviews.forEach((iv) => {
    const day = Number(iv.date.split("-")[2]);
    interviewsByDay[day] = interviewsByDay[day] || [];
    interviewsByDay[day].push(iv);
  });

  const selectedDay = Number(selectedDate.split("-")[2]);
  const dayInterviews = (interviewsByDay[selectedDay] || []).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Interview Scheduler</h1>
          <p className="text-gray-500 text-sm mt-1">Plan and track every interview slot.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["Month", "Week", "Day"].map((v) => (
              <button key={v} onClick={() => setCalView(v)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${calView === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
                {v}
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 px-3.5 py-2 rounded-lg hover:bg-indigo-700">
            <Plus size={15} /> Create Interview
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">August 2026</h3>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400"><ChevronLeft size={16} /></button>
              <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400"><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const hasInterviews = interviewsByDay[day];
              const isSelected = day === selectedDay;
              const isToday = day === 21;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(`2026-08-${String(day).padStart(2, "0")}`)}
                  className={`aspect-square rounded-lg text-sm flex flex-col items-center justify-center gap-0.5 transition-colors relative
                    ${isSelected ? "bg-indigo-600 text-white" : isToday ? "bg-indigo-50 text-indigo-700 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}
                >
                  {day}
                  {hasInterviews && <span className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-indigo-500"}`} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            {(() => {
              const [y, m, d] = selectedDate.split("-").map(Number);
              return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
            })()}
          </h3>
          <div className="space-y-3">
            {dayInterviews.length === 0 && <p className="text-sm text-gray-400">No interviews scheduled.</p>}
            {dayInterviews.map((iv) => {
              const app = applicants.find((a) => a.id === iv.applicantId);
              const interviewer = INTERVIEWERS.find((i) => i.id === iv.interviewerId);
              if (!app) return null;
              return (
                <div key={iv.id} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-900">{formatTime(iv.time)}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${iv.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{iv.status}</span>
                  </div>
                  <div className="text-sm text-gray-700">{app.name}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    {iv.type === "Video" ? <Video size={11} /> : <MapPin size={11} />} {iv.duration} min with {interviewer?.name.split(" ")[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Schedule Interview" wide>
        <ScheduleForm
          applicants={applicants}
          onSubmit={(data) => {
            addInterview(data);
            setShowModal(false);
            showToast(`Interview scheduled with ${data.applicantName}`);
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}

function ScheduleForm({ applicants, onSubmit, onCancel }) {
  const [applicantId, setApplicantId] = useState(applicants[0]?.id || "");
  const [interviewerId, setInterviewerId] = useState(INTERVIEWERS[0].id);
  const [date, setDate] = useState("2026-08-24");
  const [time, setTime] = useState("11:00");
  const [duration, setDuration] = useState("30");
  const [type, setType] = useState("Video");
  const [link, setLink] = useState("");

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const app = applicants.find((a) => a.id === applicantId);
      onSubmit({
        id: `iv${Date.now()}`, applicantId, interviewerId, date, time,
        duration: Number(duration), type, status: "Upcoming",
        meetingLink: link || (type === "Video" ? "meet.societyos.club/new-session" : "Room TBD"),
        applicantName: app?.name,
      });
    }}>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="Applicant">
          <select className={inputClass} value={applicantId} onChange={(e) => setApplicantId(e.target.value)}>
            {applicants.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        <Field label="Interviewer">
          <select className={inputClass} value={interviewerId} onChange={(e) => setInterviewerId(e.target.value)}>
            {INTERVIEWERS.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </Field>
        <Field label="Date">
          <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Time">
          <input type="time" className={inputClass} value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
        <Field label="Duration (minutes)">
          <select className={inputClass} value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="15">15</option><option value="30">30</option><option value="45">45</option><option value="60">60</option>
          </select>
        </Field>
        <Field label="Interview type">
          <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
            <option>Video</option><option>In-person</option><option>Phone</option>
          </select>
        </Field>
      </div>
      <Field label="Meeting link (optional)">
        <input className={inputClass} value={link} onChange={(e) => setLink(e.target.value)} placeholder="meet.societyos.club/..." />
      </Field>
      <div className="flex gap-2 justify-end mt-2">
        <button type="button" onClick={onCancel} className="text-sm font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
        <button type="submit" className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700">Schedule Interview</button>
      </div>
    </form>
  );
}

/* ============================================================
   INTERVIEWER DASHBOARD
   ============================================================ */

function InterviewerDashboardPage({ applicants, interviews, openApplicant, goToEvaluation }) {
  const upcoming = interviews.filter((iv) => iv.interviewerId === "int1" && iv.status === "Upcoming");
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Your Interviews</h1>
        <p className="text-gray-500 text-sm mt-1">Ananya Reddy • Marketing & Content Interviewer</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <KPICard label="Today's Interviews" value="4" icon={CalendarIcon} />
        <KPICard label="Pending Evaluations" value="2" icon={AlertCircle} />
        <KPICard label="Completed" value="18" icon={CheckCircle2} />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Interviews</h3>
        <div className="space-y-3">
          {upcoming.length === 0 && <p className="text-sm text-gray-400">No interviews scheduled for today.</p>}
          {upcoming.map((iv) => {
            const app = applicants.find((a) => a.id === iv.applicantId);
            if (!app) return null;
            return (
              <div key={iv.id} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 flex-wrap">
                <div className="w-14 text-sm font-semibold text-gray-900 tabular-nums">{formatTime(iv.time)}</div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarColor(app.name)}`}>
                  {initials(app.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <button onClick={() => openApplicant(app.id)} className="text-sm font-medium text-gray-900 hover:text-indigo-600 block truncate">{app.name}</button>
                  <div className="text-xs text-gray-400">{app.department}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openApplicant(app.id)} className="text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                    <FileText size={12} /> Profile
                  </button>
                  <button onClick={() => goToEvaluation(app.id)} className="text-xs font-medium text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 flex items-center gap-1">
                    <PlayCircle size={12} /> Start Interview
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EVALUATION
   ============================================================ */

function RatingRow({ label, value, onChange }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-indigo-600 tabular-nums">{value || "—"}/10</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`Rate ${n} out of 10`}
            className={`flex-1 h-8 rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              value >= n ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function EvaluationPage({ applicant, submitEvaluation, showToast, onBack }) {
  const [scores, setScores] = useState({ communication: 0, problemSolving: 0, creativity: 0, domainKnowledge: 0, cultureFit: 0 });
  const [recommendation, setRecommendation] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!applicant) return null;

  const values = Object.values(scores);
  const overall = values.some((v) => v === 0) ? 0 : (values.reduce((a, b) => a + b, 0) / values.length);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (values.some((v) => v === 0) || !recommendation) return;
    submitEvaluation(applicant.id, { ...scores, overallScore: Number(overall.toFixed(1)), recommendation, comments });
    setSubmitted(true);
    showToast("Evaluation submitted successfully.");
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${avatarColor(applicant.name)}`}>
            {initials(applicant.name)}
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">{applicant.name}</h1>
            <p className="text-sm text-gray-500">{applicant.department}</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-10">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-3" />
            <p className="font-medium text-gray-900">Evaluation submitted successfully.</p>
            <p className="text-sm text-gray-500 mt-1">Overall score recorded as {overall.toFixed(1)}/10.</p>
            <button onClick={onBack} className="mt-5 text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <RatingRow label="Communication" value={scores.communication} onChange={(v) => setScores((s) => ({ ...s, communication: v }))} />
            <RatingRow label="Problem Solving" value={scores.problemSolving} onChange={(v) => setScores((s) => ({ ...s, problemSolving: v }))} />
            <RatingRow label="Creativity" value={scores.creativity} onChange={(v) => setScores((s) => ({ ...s, creativity: v }))} />
            <RatingRow label="Domain Knowledge" value={scores.domainKnowledge} onChange={(v) => setScores((s) => ({ ...s, domainKnowledge: v }))} />
            <RatingRow label="Culture Fit" value={scores.cultureFit} onChange={(v) => setScores((s) => ({ ...s, cultureFit: v }))} />

            <div className="mb-5">
              <span className="block text-sm font-medium text-gray-700 mb-2">Overall Recommendation</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Strong Hire", "Hire", "Maybe", "Reject"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRecommendation(r)}
                    className={`text-sm font-medium py-2 rounded-lg border transition-colors ${
                      recommendation === r ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Comments">
              <textarea
                className={`${inputClass} min-h-[100px] resize-none`}
                placeholder="Add interviewer feedback..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </Field>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
              <span className="text-sm text-gray-500">Overall: <span className="font-semibold text-gray-900">{overall ? overall.toFixed(1) : "—"}/10</span></span>
              <button type="submit" className="text-sm font-medium text-white bg-indigo-600 px-5 py-2.5 rounded-lg hover:bg-indigo-700">
                Submit Evaluation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ANALYTICS
   ============================================================ */

function AnalyticsPage({ applicants }) {
  const [range, setRange] = useState("Last 30 days");
  const deptCounts = DEPARTMENTS.map((d) => ({ department: d, count: applicants.filter((a) => a.department === d).length }));
  const interviewerStats = [
    { name: "Ananya", interviews: 18, avg: 8.6, pending: 1 },
    { name: "Kabir", interviews: 15, avg: 8.1, pending: 0 },
    { name: "Meera", interviews: 12, avg: 8.8, pending: 2 },
    { name: "Dhruv", interviews: 9, avg: 7.9, pending: 1 },
  ];
  const funnel = [
    { label: "Applied", value: 248, color: "bg-gray-400" },
    { label: "Screened", value: 156, color: "bg-amber-500" },
    { label: "Shortlisted", value: 64, color: "bg-blue-500" },
    { label: "Interviewed", value: 38, color: "bg-violet-500" },
    { label: "Selected", value: 21, color: "bg-emerald-500" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Recruitment Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Funnel health and interviewer performance.</p>
        </div>
        <select value={range} onChange={(e) => setRange(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option>Last 7 days</option><option>Last 30 days</option><option>Recruitment Cycle</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Applications" value="248" delta="+12%" deltaLabel="cycle over cycle" icon={Users} />
        <KPICard label="Shortlist Rate" value="26%" delta="+3pt" deltaLabel="cycle over cycle" icon={Filter} />
        <KPICard label="Interview Attendance" value="59%" delta="-4pt" deltaLabel="cycle over cycle" icon={CalendarIcon} positive={false} />
        <KPICard label="Selection Rate" value="33%" delta="+6pt" deltaLabel="cycle over cycle" icon={CheckCircle2} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Insight</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">
            Marketing received <span className="font-semibold">34%</span> of all applications, but has the <span className="font-semibold">lowest shortlist rate</span> of any department.
          </p>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-violet-600" />
            <span className="text-xs font-semibold text-violet-700 uppercase tracking-wide">Insight</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">
            Interview evaluation turnaround <span className="font-semibold">increased by 18%</span> this week — evaluations are being submitted faster after each interview.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Application Trend</h3>
          <p className="text-xs text-gray-400 mb-4">Daily submissions</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={APPLICATION_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Line type="monotone" dataKey="applications" stroke="#4F46E5" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Applicants by Department</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptCounts} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recruitment Funnel</h3>
        <div className="space-y-3">
          {funnel.map((f) => <FunnelBar key={f.label} {...f} max={248} />)}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Interviewer Performance</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <th className="text-left font-medium px-6 py-3">Interviewer</th>
              <th className="text-left font-medium px-6 py-3">Interviews</th>
              <th className="text-left font-medium px-6 py-3">Avg Score</th>
              <th className="text-left font-medium px-6 py-3">Pending Reviews</th>
            </tr>
          </thead>
          <tbody>
            {interviewerStats.map((row) => (
              <tr key={row.name} className="border-b border-gray-50 last:border-0">
                <td className="px-6 py-3 font-medium text-gray-900">{row.name}</td>
                <td className="px-6 py-3 text-gray-600 tabular-nums">{row.interviews}</td>
                <td className="px-6 py-3 text-gray-600 tabular-nums">{row.avg}</td>
                <td className="px-6 py-3">
                  {row.pending > 0 ? (
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{row.pending} pending</span>
                  ) : (
                    <span className="text-xs text-gray-400">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS
   ============================================================ */

function SettingsPage({ showToast }) {
  const [allowEdit, setAllowEdit] = useState(true);
  const [autoReminders, setAutoReminders] = useState(true);
  const [requireScorecards, setRequireScorecards] = useState(false);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your society profile and recruitment configuration.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Society Profile</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Society Name">
            <input className={inputClass} defaultValue="SRCC Consulting Club" />
          </Field>
          <Field label="Recruitment Cycle">
            <input className={inputClass} defaultValue="2026–27" />
          </Field>
          <Field label="Application Deadline">
            <input type="date" className={inputClass} defaultValue="2026-08-27" />
          </Field>
        </div>
        <button onClick={() => showToast("Society profile saved")} className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700">
          Save changes
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 divide-y divide-gray-50">
        <h3 className="font-semibold text-gray-900 mb-1">Recruitment Settings</h3>
        <Toggle checked={allowEdit} onChange={setAllowEdit} label="Allow applicants to edit applications" sub="Candidates can revise answers until the deadline" />
        <Toggle checked={autoReminders} onChange={setAutoReminders} label="Enable automated reminders" sub="Email nudges before interview slots" />
        <Toggle checked={requireScorecards} onChange={setRequireScorecards} label="Require interviewer scorecards" sub="Block stage changes until an evaluation is submitted" />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Team Members</h3>
        <div className="space-y-3">
          {[
            { name: "Aryan Sharma", role: "President" },
            { name: "You", role: "Recruitment Head" },
            ...INTERVIEWERS.map((i) => ({ name: i.name, role: "Interviewer" })),
          ].map((m) => (
            <div key={m.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold ${avatarColor(m.name)}`}>{initials(m.name)}</div>
                <span className="text-sm text-gray-900">{m.name}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">{m.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */

export default function App() {
  const [stage, setStage] = useState("landing"); // landing | login | app
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [interviews, setInterviews] = useState(INITIAL_INTERVIEWS);
  const [evaluations, setEvaluations] = useState(INITIAL_EVALUATIONS);
  const [selectedApplicantId, setSelectedApplicantId] = useState("a1");
  const [toasts, setToasts] = useState([]);

  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const openApplicant = (id) => { setSelectedApplicantId(id); setView("applicant-detail"); };
  const goToEvaluation = (id) => { setSelectedApplicantId(id); setView("evaluation"); };
  const goToSchedule = (id) => { setSelectedApplicantId(id); setView("scheduler"); };

  const setApplicantStage = (id, newStage) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, stage: newStage } : a)));
  };

  const addApplicant = ({ name, college, department }) => {
    const newApp = makeApplicant(`a${Date.now()}`, name, college, "B.A. (Hons.)", "1st Year", department, "New", 0, "Aug 21", null, `${name.split(" ")[0].toLowerCase()}@college.edu`, "+91 90000 00000");
    setApplicants((prev) => [newApp, ...prev]);
  };

  const addInterview = (data) => setInterviews((prev) => [...prev, data]);

  const submitEvaluation = (applicantId, data) => {
    setEvaluations((prev) => {
      const existing = prev.find((e) => e.applicantId === applicantId);
      const record = { id: existing?.id || `ev${Date.now()}`, applicantId, interviewerId: "int1", ...data };
      return existing ? prev.map((e) => (e.applicantId === applicantId ? record : e)) : [...prev, record];
    });
    setApplicants((prev) => prev.map((a) => (a.id === applicantId ? { ...a, score: data.overallScore } : a)));
  };

  if (stage === "landing") return <LandingPage onDemo={() => setStage("login")} />;
  if (stage === "login") return <LoginPage onLogin={() => { setStage("app"); setView("dashboard"); }} />;

  const selectedApplicant = applicants.find((a) => a.id === selectedApplicantId);

  const titles = {
    dashboard: ["Dashboard", "Recruitment overview"],
    applicants: ["Applicants", "All candidates"],
    "applicant-detail": [selectedApplicant?.name || "Applicant", "Candidate profile"],
    pipeline: ["Pipeline", "Interview stages"],
    scheduler: ["Interviews", "Scheduling"],
    interviewer: ["Interviewer View", "Ananya Reddy"],
    evaluation: ["Evaluation", selectedApplicant?.name || ""],
    analytics: ["Analytics", "Recruitment performance"],
    settings: ["Settings", "Workspace configuration"],
  };
  const [titleText, subtitleText] = titles[view] || ["SocietyOS", ""];

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <Sidebar view={view} setView={setView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar setSidebarOpen={setSidebarOpen} title={titleText} subtitle={subtitleText} />
        <main className="flex-1 overflow-y-auto">
          {view === "dashboard" && (
            <DashboardPage applicants={applicants} interviews={interviews} setView={setView} openApplicant={openApplicant} />
          )}
          {view === "applicants" && (
            <ApplicantsPage applicants={applicants} openApplicant={openApplicant} showToast={showToast} addApplicant={addApplicant} />
          )}
          {view === "applicant-detail" && (
            <ApplicantDetailPage
              applicant={selectedApplicant}
              onBack={() => setView("applicants")}
              setStage={setApplicantStage}
              showToast={showToast}
              evaluations={evaluations}
              goToSchedule={goToSchedule}
            />
          )}
          {view === "pipeline" && (
            <PipelinePage applicants={applicants} setStage={setApplicantStage} openApplicant={openApplicant} showToast={showToast} />
          )}
          {view === "scheduler" && (
            <SchedulerPage applicants={applicants} interviews={interviews} addInterview={addInterview} showToast={showToast} />
          )}
          {view === "interviewer" && (
            <InterviewerDashboardPage applicants={applicants} interviews={interviews} openApplicant={openApplicant} goToEvaluation={goToEvaluation} />
          )}
          {view === "evaluation" && (
            <EvaluationPage applicant={selectedApplicant} submitEvaluation={submitEvaluation} showToast={showToast} onBack={() => setView("interviewer")} />
          )}
          {view === "analytics" && <AnalyticsPage applicants={applicants} />}
          {view === "settings" && <SettingsPage showToast={showToast} />}
        </main>
      </div>
      <ToastStack toasts={toasts} />
    </div>
  );
}
