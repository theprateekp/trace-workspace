import { useMemo, useRef, useState, type DragEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  Command,
  Copy,
  FileCode2,
  FilePenLine,
  FilePlus2,
  FileText,
  Files,
  Filter,
  FolderKanban,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  Grid2X2,
  Headphones,
  History,
  LayoutDashboard,
  Link2,
  ListFilter,
  MessageCircle,
  MessageSquareText,
  Mic,
  MoreHorizontal,
  Paperclip,
  PenLine,
  Play,
  Plus,
  Presentation,
  Search,
  Settings2,
  Share2,
  ShieldCheck,
  Sparkles,
  SquareArrowOutUpRight,
  Star,
  Tag,
  Timer,
  UserPlus,
  Users,
  Video,
  Volume2,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

type View = "overview" | "projects" | "calendar" | "meetings" | "files" | "analytics";
type Status = "backlog" | "progress" | "review" | "done";
type Priority = "Urgent" | "High" | "Medium" | "Low";

type Task = {
  id: string;
  title: string;
  project: string;
  status: Status;
  priority: Priority;
  assignee: string;
  initials: string;
  color: string;
  due: string;
  subtasks: [number, number];
  tags: string[];
  comments: number;
  attachments: number;
};

type FileItem = {
  name: string;
  type: "figma" | "ppt" | "pdf" | "doc" | "code";
  size: string;
  updated: string;
  accent: string;
  shared: string[];
};

const navItems: { id: View; label: string; icon: LucideIcon; count?: string }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban, count: "4" },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "meetings", label: "Meetings", icon: Video, count: "2" },
  { id: "files", label: "Files & docs", icon: Files },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const seedTasks: Task[] = [
  { id: "t1", title: "Finalize onboarding flow", project: "Atlas Launch", status: "backlog", priority: "High", assignee: "Mira Chen", initials: "MC", color: "#2e7dd7", due: "Today", subtasks: [2, 5], tags: ["UX", "Growth"], comments: 6, attachments: 2 },
  { id: "t2", title: "Audit API rate limits", project: "Platform", status: "backlog", priority: "Medium", assignee: "Arjun Rao", initials: "AR", color: "#e9836b", due: "Sep 20", subtasks: [1, 3], tags: ["API"], comments: 3, attachments: 1 },
  { id: "t3", title: "Map edge-case states", project: "Atlas Launch", status: "progress", priority: "Urgent", assignee: "Nadia Iqbal", initials: "NI", color: "#8b72d8", due: "Today", subtasks: [4, 6], tags: ["UX", "QA"], comments: 9, attachments: 4 },
  { id: "t4", title: "Instrument activation events", project: "Atlas Launch", status: "progress", priority: "High", assignee: "Leo Park", initials: "LP", color: "#27a58c", due: "Sep 19", subtasks: [3, 4], tags: ["Data"], comments: 4, attachments: 2 },
  { id: "t5", title: "Review security checklist", project: "Platform", status: "progress", priority: "Medium", assignee: "Sam Rivera", initials: "SR", color: "#f2a950", due: "Sep 21", subtasks: [6, 8], tags: ["Security"], comments: 2, attachments: 1 },
  { id: "t6", title: "Pricing page content pass", project: "Atlas Launch", status: "review", priority: "High", assignee: "Mira Chen", initials: "MC", color: "#2e7dd7", due: "Sep 18", subtasks: [5, 5], tags: ["Copy", "Growth"], comments: 7, attachments: 3 },
  { id: "t7", title: "Release notes v0.9", project: "Atlas Launch", status: "review", priority: "Medium", assignee: "Leo Park", initials: "LP", color: "#27a58c", due: "Sep 18", subtasks: [2, 3], tags: ["Docs"], comments: 5, attachments: 1 },
  { id: "t8", title: "Set up error budget alerts", project: "Platform", status: "done", priority: "Low", assignee: "Arjun Rao", initials: "AR", color: "#e9836b", due: "Sep 16", subtasks: [4, 4], tags: ["SRE"], comments: 3, attachments: 0 },
  { id: "t9", title: "Stakeholder demo recording", project: "Atlas Launch", status: "done", priority: "High", assignee: "Nadia Iqbal", initials: "NI", color: "#8b72d8", due: "Sep 15", subtasks: [3, 3], tags: ["Launch"], comments: 11, attachments: 2 },
];

const files: FileItem[] = [
  { name: "Atlas launch brief", type: "figma", size: "12.4 MB", updated: "8 min ago", accent: "#ee8c74", shared: ["MC", "NI", "LP"] },
  { name: "Q4 product narrative", type: "ppt", size: "4.8 MB", updated: "22 min ago", accent: "#2e7dd7", shared: ["MC", "SR"] },
  { name: "Security review checklist", type: "pdf", size: "2.1 MB", updated: "1 hr ago", accent: "#8b72d8", shared: ["AR", "SR"] },
  { name: "Release notes v0.9", type: "doc", size: "184 KB", updated: "3 hr ago", accent: "#27a58c", shared: ["LP", "NI"] },
  { name: "activation-events.ts", type: "code", size: "38 KB", updated: "Yesterday", accent: "#f2a950", shared: ["LP", "AR"] },
];

const columns: { id: Status; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "#9aa6b5" },
  { id: "progress", label: "In progress", color: "#2e7dd7" },
  { id: "review", label: "In review", color: "#e9836b" },
  { id: "done", label: "Done", color: "#27a58c" },
];

const avatarColors: Record<string, string> = { MC: "#e9836b", NI: "#8b72d8", LP: "#2e7dd7", AR: "#27a58c", SR: "#f2a950" };

function Avatar({ initials, color, size = "md" }: { initials: string; color?: string; size?: "sm" | "md" | "lg" }) {
  return <span className={`avatar avatar-${size}`} style={{ background: color || avatarColors[initials] || "#8491a5" }}>{initials}</span>;
}

function AvatarStack({ names, limit = 3 }: { names: string[]; limit?: number }) {
  return <span className="avatar-stack">{names.slice(0, limit).map(name => <Avatar key={name} initials={name} size="sm" />)}{names.length > limit && <span className="avatar avatar-sm avatar-more">+{names.length - limit}</span>}</span>;
}

function IconButton({ icon: Icon, label, onClick, active = false }: { icon: LucideIcon; label: string; onClick?: () => void; active?: boolean }) {
  return <button className={`icon-button ${active ? "is-active" : ""}`} aria-label={label} title={label} onClick={onClick}><Icon size={17} strokeWidth={1.8} /></button>;
}

function MetricCard({ label, value, delta, trend, icon: Icon, tint }: { label: string; value: string; delta: string; trend: "up" | "down"; icon: LucideIcon; tint: string }) {
  return <div className="metric-card surface">
    <div className="metric-top"><span className="metric-icon" style={{ background: tint }}><Icon size={16} /></span><span className={`trend ${trend}`}>{trend === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{delta}</span></div>
    <div className="metric-value">{value}</div><div className="metric-label">{label}</div>
  </div>;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const className = priority.toLowerCase();
  return <span className={`priority priority-${className}`}><span className="priority-dot" />{priority}</span>;
}

function TaskCard({ task, onOpen, onDragStart }: { task: Task; onOpen: () => void; onDragStart: (event: DragEvent<HTMLDivElement>, id: string) => void }) {
  const percent = Math.round((task.subtasks[0] / task.subtasks[1]) * 100);
  return <div className="task-card" draggable onDragStart={event => onDragStart(event, task.id)} onClick={onOpen}>
    <div className="task-card-top"><PriorityBadge priority={task.priority} /><IconButton icon={MoreHorizontal} label="Task actions" /></div>
    <div className="task-title">{task.title}</div>
    <div className="task-meta"><span className="project-mark" />{task.project}<span className="meta-spacer" /><span className={task.due === "Today" ? "due-today" : ""}><Clock3 size={12} />{task.due}</span></div>
    <div className="task-progress"><span className="task-progress-track"><span style={{ width: `${percent}%` }} /></span><span>{task.subtasks[0]}/{task.subtasks[1]}</span></div>
    <div className="task-card-bottom"><div className="tag-row">{task.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div><div className="task-activity"><MessageCircle size={13} />{task.comments}<Paperclip size={13} />{task.attachments}<Avatar initials={task.initials} size="sm" /></div></div>
  </div>;
}

function Sidebar({ activeView, setActiveView, onNewTask, toast }: { activeView: View; setActiveView: (view: View) => void; onNewTask: () => void; toast: (message: string) => void }) {
  return <aside className="trace-sidebar">
    <div className="brand"><span className="brand-mark"><span /></span><span>trace<span className="brand-dot">.</span></span><span className="brand-beta">beta</span></div>
    <button className="workspace-switcher"><span className="workspace-avatar">N</span><span className="workspace-copy"><strong>Northstar Studio</strong><small>Personal workspace</small></span><ChevronDown size={15} /></button>
    <button className="quick-add" onClick={onNewTask}><Plus size={17} />Create task<span className="shortcut">⌘ K</span></button>
    <nav className="side-nav" aria-label="Primary navigation">
      <div className="nav-label">Workspace</div>
      {navItems.map(item => <button key={item.id} className={`nav-item ${activeView === item.id ? "active" : ""}`} onClick={() => setActiveView(item.id)}><item.icon size={17} /><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}</button>)}
      <div className="nav-label nav-label-spaced">Spaces</div>
      <button className="space-item" onClick={() => { setActiveView("projects"); toast("Opened Atlas Launch project"); }}><span className="space-dot coral" />Atlas Launch</button>
      <button className="space-item" onClick={() => { setActiveView("projects"); toast("Opened Platform project"); }}><span className="space-dot blue" />Platform</button>
      <button className="space-item" onClick={() => { setActiveView("projects"); toast("Opened Research space"); }}><span className="space-dot purple" />Research</button>
      <button className="add-space" onClick={() => toast("Space creation is ready for your next workspace") }><Plus size={15} />Add space</button>
    </nav>
    <div className="sidebar-bottom">
      <div className="sync-card"><div className="sync-icon"><Zap size={15} /></div><div><strong>Live sync on</strong><small>All changes saved</small></div><span className="live-dot" /></div>
      <button className="nav-item" onClick={() => toast("Settings panel queued for the next workspace pass")}><Settings2 size={17} /><span>Settings</span></button>
      <div className="profile-row"><Avatar initials="AK" color="#34465f" /><div><strong>Alex Kim</strong><small>Product lead</small></div><MoreHorizontal size={16} /></div>
    </div>
  </aside>;
}

function Topbar({ activeView, search, setSearch, toast, setMeetingOpen }: { activeView: View; search: string; setSearch: (value: string) => void; toast: (message: string) => void; setMeetingOpen: (value: boolean) => void }) {
  const title = navItems.find(item => item.id === activeView)?.label || "Overview";
  return <header className="trace-topbar"><div className="breadcrumb"><span>Northstar Studio</span><ChevronRight size={14} /><strong>{title}</strong></div><div className="topbar-actions"><label className="search-wrap"><Search size={16} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search anything" /><kbd>⌘ K</kbd></label><button className="command-button" onClick={() => toast("Command palette: type to jump anywhere") }><Command size={15} /><span>Command</span><kbd>⌘ /</kbd></button><IconButton icon={Bell} label="Notifications" onClick={() => toast("You have 4 unread updates")} /><button className="huddle-button" onClick={() => setMeetingOpen(true)}><Video size={15} />Start huddle</button></div></header>;
}

function OverviewView({ setActiveView, setMeetingOpen, toast }: { setActiveView: (view: View) => void; setMeetingOpen: (value: boolean) => void; toast: (message: string) => void }) {
  return <div className="page-stack">
    <div className="hero-row"><div><div className="eyebrow"><CircleDot size={13} />Wednesday, September 17, 2026</div><h1>Good afternoon, Alex<span className="heading-dot">.</span></h1><p className="lede">Your team is moving with intent. Here is what needs your attention.</p></div><div className="hero-actions"><button className="button-ghost" onClick={() => toast("Invite link copied to clipboard")}><UserPlus size={15} />Invite</button><button className="button-primary" onClick={() => setActiveView("projects")}><FolderKanban size={15} />Open project board</button></div></div>
    <div className="metric-grid"><MetricCard label="Open tasks" value="42" delta="12.5%" trend="up" icon={CircleDot} tint="#eaf3ff" /><MetricCard label="Due this week" value="18" delta="4.2%" trend="down" icon={Clock3} tint="#fff0eb" /><MetricCard label="Cycle time" value="3.8d" delta="18.0%" trend="up" icon={Timer} tint="#f1edff" /><MetricCard label="Team pulse" value="8.7/10" delta="0.6" trend="up" icon={Sparkles} tint="#e8f8f1" /></div>
    <div className="overview-grid"><section className="surface focus-card"><div className="section-head"><div><span className="section-kicker">Team focus</span><h2>What is moving today</h2></div><button className="text-button" onClick={() => setActiveView("projects")}>View board <ArrowUpRight size={14} /></button></div><div className="focus-list"><div className="focus-item"><span className="focus-marker coral" /><div><strong>Atlas Launch</strong><p>12 tasks in motion · next milestone in 2 days</p></div><div className="focus-bar"><span style={{ width: "74%" }} /></div><b>74%</b></div><div className="focus-item"><span className="focus-marker blue" /><div><strong>Platform reliability</strong><p>7 tasks in motion · error budget healthy</p></div><div className="focus-bar blue"><span style={{ width: "48%" }} /></div><b>48%</b></div><div className="focus-item"><span className="focus-marker purple" /><div><strong>Customer research</strong><p>3 insights captured · synthesis Friday</p></div><div className="focus-bar purple"><span style={{ width: "62%" }} /></div><b>62%</b></div></div></section><section className="surface pulse-card"><div className="section-head"><div><span className="section-kicker">Live pulse</span><h2>Team is online</h2></div><span className="live-label"><span className="live-dot" />6 active</span></div><div className="pulse-visual"><div className="pulse-ring ring-a" /><div className="pulse-ring ring-b" /><div className="pulse-core"><Users size={23} /><strong>6</strong><small>in focus mode</small></div></div><div className="pulse-members"><AvatarStack names={["MC", "NI", "LP", "AR", "SR"]} /><span>+ 1 more in <strong>Atlas Launch</strong></span></div><button className="button-soft" onClick={() => setMeetingOpen(true)}><Headphones size={15} />Join team huddle</button></section></div>
    <div className="lower-grid"><section className="surface activity-card"><div className="section-head"><div><span className="section-kicker">Activity stream</span><h2>Recent work</h2></div><button className="icon-button" title="Filter activity" onClick={() => toast("Activity filters: project, person, and event type")}><Filter size={16} /></button></div><div className="activity-list"><div className="activity-row"><span className="activity-icon coral"><GitPullRequest size={15} /></span><div><p><strong>Mira Chen</strong> opened pull request <strong>#218</strong> · Update onboarding states</p><span>8 minutes ago · Atlas Launch</span></div><span className="activity-status open">Open</span></div><div className="activity-row"><span className="activity-icon blue"><GitCommitHorizontal size={15} /></span><div><p><strong>Leo Park</strong> pushed 4 commits to <strong>feat/activation-events</strong></p><span>26 minutes ago · Platform</span></div><span className="activity-status merged">Synced</span></div><div className="activity-row"><span className="activity-icon purple"><MessageSquareText size={15} /></span><div><p><strong>Nadia Iqbal</strong> commented on <strong>Map edge-case states</strong></p><span>48 minutes ago · “This feels ready for a quick pair review.”</span></div><Avatar initials="NI" size="sm" /></div><div className="activity-row"><span className="activity-icon green"><CheckCircle2 size={15} /></span><div><p><strong>Sam Rivera</strong> completed <strong>Security review checklist</strong></p><span>1 hour ago · Platform</span></div><span className="activity-status done">Done</span></div></div><button className="activity-footer" onClick={() => toast("Activity history loaded through the last 30 days")}>Open full activity history <ArrowUpRight size={14} /></button></section><section className="surface calendar-preview"><div className="section-head"><div><span className="section-kicker">This week</span><h2>Calendar</h2></div><button className="text-button" onClick={() => setActiveView("calendar")}>Open <ArrowUpRight size={14} /></button></div><div className="mini-calendar-head"><button>‹</button><strong>September 2026</strong><button>›</button></div><div className="mini-week"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span></div><div className="mini-days">{[14,15,16,17,18].map(day => <div key={day} className={`mini-day ${day === 17 ? "today" : ""}`}><span>{day}</span>{day === 17 ? <i className="mini-event coral" /> : day === 18 ? <i className="mini-event blue" /> : <i className="mini-event muted" />}</div>)}</div><div className="calendar-events"><div><span className="event-time">10:00</span><strong><span className="event-dot coral" />Product sync</strong><small>Atlas Launch · 30 min</small></div><div><span className="event-time">14:30</span><strong><span className="event-dot blue" />Design critique</strong><small>Room Aurora · 45 min</small></div><div><span className="event-time">16:00</span><strong><span className="event-dot purple" />Focus block</strong><small>Protected time · 2 hrs</small></div></div></section></div>
  </div>;
}

function ProjectsView({ tasks, setTasks, search, openTask, toast }: { tasks: Task[]; setTasks: (tasks: Task[]) => void; search: string; openTask: (task: Task) => void; toast: (message: string) => void }) {
  const dragTask = useRef<string | null>(null);
  const filtered = useMemo(() => tasks.filter(task => `${task.title} ${task.project} ${task.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase())), [tasks, search]);
  const moveTask = (status: Status) => { if (!dragTask.current) return; setTasks(tasks.map(task => task.id === dragTask.current ? { ...task, status } : task)); toast("Task moved and synced for the team"); dragTask.current = null; };
  const addTask = () => { const task: Task = { id: `new-${tasks.length + 1}`, title: "New workflow task", project: "Atlas Launch", status: "backlog", priority: "Medium", assignee: "Alex Kim", initials: "AK", color: "#34465f", due: "Sep 22", subtasks: [0, 3], tags: ["New"], comments: 0, attachments: 0 }; setTasks([...tasks, task]); openTask(task); };
  return <div className="page-stack"><div className="page-header"><div><div className="eyebrow"><FolderKanban size={13} />Project workspace / Atlas Launch</div><h1>Project board<span className="heading-dot">.</span></h1><p className="lede">One view for the work, the context, and the decisions behind it.</p></div><div className="hero-actions"><button className="button-ghost" onClick={() => toast("Board filters opened: assignee, label, priority, due date")}><ListFilter size={15} />Filter</button><button className="button-primary" onClick={addTask}><Plus size={15} />New task</button></div></div><div className="project-strip surface"><div className="project-summary"><span className="project-logo coral"><Sparkles size={17} /></span><div><strong>Atlas Launch</strong><span>Product launch · 74% complete</span></div></div><div className="project-progress"><span><b>74%</b> complete</span><div className="large-progress"><span /></div></div><div className="project-people"><AvatarStack names={["MC", "NI", "LP", "AR", "SR"]} /><button className="icon-button" title="Invite to project" onClick={() => toast("Invite link copied to clipboard")}><UserPlus size={15} /></button></div></div><div className="board-toolbar"><div className="view-toggle"><button className="selected"><Grid2X2 size={15} />Board</button><button onClick={() => toast("List view is ready in the project shell")}><ListFilter size={15} />List</button></div><div className="board-toolbar-right"><span className="saved-filter"><span className="live-dot" />Live board</span><button className="icon-button" title="Project settings" onClick={() => toast("Project settings opened")}><Settings2 size={16} /></button></div></div><div className="board-grid">{columns.map(column => <section className="board-column" key={column.id} onDragOver={event => event.preventDefault()} onDrop={() => moveTask(column.id)}><div className="column-head"><div><span className="column-dot" style={{ background: column.color }} /><strong>{column.label}</strong><span className="column-count">{filtered.filter(task => task.status === column.id).length}</span></div><IconButton icon={Plus} label={`Add task to ${column.label}`} onClick={addTask} /></div><div className="column-tasks">{filtered.filter(task => task.status === column.id).map(task => <TaskCard key={task.id} task={task} onOpen={() => openTask(task)} onDragStart={(event, id) => { dragTask.current = id; event.dataTransfer.effectAllowed = "move"; }} />)}{filtered.filter(task => task.status === column.id).length === 0 && <div className="empty-drop">Drop tasks here</div>}</div><button className="column-add" onClick={addTask}><Plus size={14} />Add task</button></section>)}</div></div>;
}

function CalendarView({ toast }: { toast: (message: string) => void }) {
  const [selectedDay, setSelectedDay] = useState(17);
  const calendarDays = Array.from({ length: 35 }, (_, index) => index - 1);
  return <div className="page-stack"><div className="page-header"><div><div className="eyebrow"><CalendarDays size={13} />Team planning</div><h1>Calendar<span className="heading-dot">.</span></h1><p className="lede">Meetings, milestones, and protected focus time in one shared rhythm.</p></div><div className="hero-actions"><button className="button-ghost" onClick={() => toast("Calendar subscribed to your workspace feed")}><Share2 size={15} />Share</button><button className="button-primary" onClick={() => toast("New event composer opened")}><Plus size={15} />New event</button></div></div><div className="calendar-layout"><section className="surface calendar-main"><div className="calendar-toolbar"><div className="month-switch"><button className="icon-button">‹</button><h2>September 2026</h2><button className="icon-button">›</button></div><div className="view-toggle"><button className="selected">Month</button><button onClick={() => toast("Week view is available from the same calendar feed")}>Week</button><button onClick={() => toast("Agenda view is available from the same calendar feed")}>Agenda</button></div></div><div className="calendar-weekdays">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{calendarDays.map((day, index) => { const dayNumber = day <= 0 ? 31 + day : day; const muted = day <= 0 || day > 30; const isSelected = dayNumber === selectedDay && !muted; return <button key={`${day}-${index}`} className={`calendar-cell ${muted ? "muted" : ""} ${isSelected ? "selected" : ""}`} onClick={() => !muted && setSelectedDay(dayNumber)}><span className="calendar-number">{dayNumber}</span>{dayNumber === 17 && !muted && <><span className="calendar-event coral">Product sync</span><span className="calendar-event blue">Design critique</span></>}{dayNumber === 18 && !muted && <span className="calendar-event purple">Sprint review</span>}{dayNumber === 22 && !muted && <span className="calendar-event green">Launch check-in</span>}{dayNumber === 25 && !muted && <span className="calendar-event gray">Team retro</span>}</button>; })}</div></section><aside className="surface day-detail"><div className="section-head"><div><span className="section-kicker">Selected day</span><h2>Thu, Sep {selectedDay}</h2></div><IconButton icon={MoreHorizontal} label="Calendar actions" /></div><div className="day-summary"><strong>3</strong><span>events · 5h 15m scheduled</span></div><div className="agenda-list"><div className="agenda-item"><span className="agenda-time">10:00</span><div className="agenda-line coral" /><div><strong>Product sync</strong><p>Atlas Launch · 30 min</p><div className="agenda-people"><AvatarStack names={["MC", "NI", "LP"]} /></div></div></div><div className="agenda-item"><span className="agenda-time">14:30</span><div className="agenda-line blue" /><div><strong>Design critique</strong><p>Room Aurora · 45 min</p><div className="agenda-people"><AvatarStack names={["MC", "SR", "NI"]} /></div></div></div><div className="agenda-item"><span className="agenda-time">16:00</span><div className="agenda-line purple" /><div><strong>Focus block</strong><p>Protected time · 2 hrs</p></div></div></div><button className="button-soft full" onClick={() => toast("Agenda copied to clipboard")}><Copy size={14} />Copy agenda</button></aside></div></div>;
}

function MeetingsView({ setMeetingOpen, toast }: { setMeetingOpen: (value: boolean) => void; toast: (message: string) => void }) {
  return <div className="page-stack"><div className="page-header"><div><div className="eyebrow"><Video size={13} />Collaboration hub</div><h1>Meetings<span className="heading-dot">.</span></h1><p className="lede">Calls that leave a useful trail: notes, decisions, files, and follow-through.</p></div><div className="hero-actions"><button className="button-ghost" onClick={() => toast("Meeting templates opened")}><FilePlus2 size={15} />New template</button><button className="button-primary" onClick={() => setMeetingOpen(true)}><Video size={15} />Start huddle</button></div></div><div className="meeting-grid"><section className="surface next-meeting"><div className="meeting-banner"><div className="live-label"><span className="live-dot" />Live now</div><span>Room Aurora · 6 people</span></div><div className="meeting-title"><span className="meeting-symbol"><Video size={20} /></span><div><h2>Atlas Launch product sync</h2><p>Started 12 minutes ago · Decisions are being captured</p></div></div><div className="meeting-participants"><AvatarStack names={["MC", "NI", "LP", "AR", "SR"]} /><span>+ 1 more participant</span><button className="button-primary compact" onClick={() => setMeetingOpen(true)}>Join now <ArrowUpRight size={14} /></button></div><div className="meeting-notes"><div className="notes-head"><span><FileText size={15} />Live notes</span><span className="saving"><span className="live-dot" />Saving</span></div><p><strong>Decision:</strong> Keep the activation checklist in the launch brief and make progress visible from the project board.</p><p><strong>Next:</strong> Leo will ship the event names before Thursday's design critique.</p><button className="text-button" onClick={() => toast("Full meeting notes opened in Files & docs")}>Open transcript <ArrowUpRight size={14} /></button></div></section><section className="surface meeting-side-card"><div className="section-head"><div><span className="section-kicker">Up next</span><h2>Scheduled</h2></div><button className="text-button" onClick={() => toast("Meeting calendar opened")}>All <ArrowUpRight size={14} /></button></div><div className="scheduled-list"><div className="scheduled-item"><span className="scheduled-time">14:30</span><div><strong>Design critique</strong><p>Room Aurora · 45 min</p></div><Avatar initials="MC" size="sm" /></div><div className="scheduled-item"><span className="scheduled-time">16:00</span><div><strong>Customer research readout</strong><p>Room Sol · 60 min</p></div><Avatar initials="NI" size="sm" /></div><div className="scheduled-item"><span className="scheduled-time">Tomorrow</span><div><strong>Sprint review</strong><p>All hands · 30 min</p></div><Avatar initials="LP" size="sm" /></div></div></section></div><div className="meeting-lower-grid"><section className="surface"><div className="section-head"><div><span className="section-kicker">Recent recordings</span><h2>Meeting trail</h2></div><button className="icon-button" onClick={() => toast("Recording filters opened")}><Filter size={16} /></button></div><div className="recording-list">{[["Product sync · Sep 17", "34 min", "6 participants", "MC"], ["Launch retro · Sep 16", "48 min", "8 participants", "LP"], ["Design critique · Sep 15", "52 min", "5 participants", "NI"]].map(([name, time, people, initials]) => <div className="recording-row" key={name}><span className="recording-play"><Play size={13} fill="currentColor" /></span><div><strong>{name}</strong><span>{time} · {people}</span></div><span className="recording-tags"><span className="tag">Transcript</span><span className="tag">Decisions</span></span><Avatar initials={initials} size="sm" /><IconButton icon={MoreHorizontal} label="Recording actions" /></div>)}</div></section><section className="surface meeting-principles"><div className="section-head"><div><span className="section-kicker">Trace difference</span><h2>Meetings with memory</h2></div><Sparkles size={17} className="accent-icon" /></div><p>Every huddle can attach decisions to tasks, sync files, and keep a searchable transcript—so the work does not disappear when the call ends.</p><div className="principle"><span><Check size={14} /></span><div><strong>Decision capture</strong><small>Turn a sentence into an assigned task.</small></div></div><div className="principle"><span><Check size={14} /></span><div><strong>Context carry-over</strong><small>Keep the brief, deck, and transcript together.</small></div></div><div className="principle"><span><Check size={14} /></span><div><strong>Low-noise follow-up</strong><small>One digest instead of five notifications.</small></div></div></section></div></div>;
}

function FileIcon({ type }: { type: FileItem["type"] }) {
  const Icon = type === "ppt" ? Presentation : type === "pdf" ? FileText : type === "doc" ? FilePenLine : type === "code" ? FileCode2 : PenLine;
  return <Icon size={18} />;
}

function FilesView({ toast }: { toast: (message: string) => void }) {
  const [selectedFile, setSelectedFile] = useState(files[1]);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("Q4 product narrative");
  const [body, setBody] = useState("A tighter story for a team that ships with context.");
  return <div className="page-stack"><div className="page-header"><div><div className="eyebrow"><Files size={13} />Workspace library</div><h1>Files & docs<span className="heading-dot">.</span></h1><p className="lede">The brief, the deck, the transcript, and the code—kept close to the work.</p></div><div className="hero-actions"><button className="button-ghost" onClick={() => toast("Folder created in workspace library")}><Plus size={15} />New folder</button><button className="button-primary" onClick={() => toast("Upload flow opened · drag files here")}><FilePlus2 size={15} />Upload files</button></div></div><div className="files-layout"><aside className="surface files-tree"><div className="tree-head"><strong>Library</strong><button className="icon-button" onClick={() => toast("Library options opened")}><MoreHorizontal size={16} /></button></div><button className="tree-item active"><Files size={15} />All files<span>42</span></button><button className="tree-item"><Star size={15} />Starred<span>8</span></button><button className="tree-item"><History size={15} />Recent<span>12</span></button><div className="tree-divider" /><span className="tree-label">Projects</span><button className="tree-item"><span className="space-dot coral" />Atlas Launch<span>18</span></button><button className="tree-item"><span className="space-dot blue" />Platform<span>14</span></button><button className="tree-item"><span className="space-dot purple" />Research<span>10</span></button><div className="tree-divider" /><span className="tree-label">Smart views</span><button className="tree-item"><GitBranch size={15} />Unpublished changes<span>3</span></button><button className="tree-item"><ShieldCheck size={15} />Needs review<span>5</span></button></aside><section className="surface files-content"><div className="files-toolbar"><div className="file-search"><Search size={15} /><span>Search library</span></div><div className="view-toggle"><button className="selected"><Grid2X2 size={14} />Grid</button><button onClick={() => toast("List view selected")}><ListFilter size={14} />List</button></div></div><div className="file-grid">{files.map(file => <button className={`file-card ${selectedFile.name === file.name ? "selected" : ""}`} key={file.name} onClick={() => setSelectedFile(file)}><div className="file-preview" style={{ background: `${file.accent}12` }}><FileIcon type={file.type} /><span className="file-type">{file.type.toUpperCase()}</span>{file.type === "ppt" && <div className="slide-preview"><span /><span /><span /></div>}{file.type === "code" && <div className="code-preview"><i /><i /><i /></div>}</div><div className="file-card-copy"><strong>{file.name}</strong><span>{file.size} · {file.updated}</span></div><AvatarStack names={file.shared} limit={3} /></button>)}</div><div className="editor-divider"><span>Quick edit</span><span className="editor-line" /></div><div className="quick-editor"><div className="editor-toolbar"><div><span className="file-breadcrumb"><Presentation size={14} />Slides / {selectedFile.name}</span><span className="saved-note"><span className="live-dot" />Version 14 saved</span></div><div className="editor-actions"><button className="button-ghost compact" onClick={() => toast("Version history opened") }><History size={14} />History</button><button className="button-primary compact" onClick={() => { setEditing(!editing); toast(editing ? "Slide changes saved" : "Editing mode on"); }}><PenLine size={14} />{editing ? "Save changes" : "Edit deck"}</button></div></div><div className="slide-editor"><div className="slide-sidebar"><span className="slide-thumb active"><b>01</b><small>Signal</small></span><span className="slide-thumb"><b>02</b><small>Story</small></span><span className="slide-thumb"><b>03</b><small>Plan</small></span><button onClick={() => toast("New slide added to this deck")}><Plus size={14} /></button></div><div className="slide-canvas"><div className="slide-label">Q4 / 01</div>{editing ? <input className="slide-title-input" value={title} onChange={event => setTitle(event.target.value)} /> : <h2>{title}</h2>}{editing ? <textarea className="slide-body-input" value={body} onChange={event => setBody(event.target.value)} /> : <p>{body}</p>}<div className="slide-footer"><span><GitBranch size={13} />trace/launch-story</span><span>Edited by Alex Kim · 8 min ago</span></div></div><aside className="slide-inspector"><div className="inspector-head"><strong>Context</strong><MoreHorizontal size={15} /></div><div className="inspector-row"><Tag size={14} /><span>Atlas Launch</span></div><div className="inspector-row"><Users size={14} /><AvatarStack names={["MC", "NI", "LP"]} /></div><div className="inspector-row"><MessageCircle size={14} /><span>4 comments</span></div><div className="inspector-note"><Sparkles size={14} /><span>Slide is linked to <strong>Launch narrative</strong></span></div></aside></div></div></section></div></div>;
}

function AnalyticsView({ toast }: { toast: (message: string) => void }) {
  const bars = [42, 56, 49, 68, 61, 78, 72, 88, 82, 96, 85, 91];
  return <div className="page-stack"><div className="page-header"><div><div className="eyebrow"><BarChart3 size={13} />Workspace intelligence</div><h1>Analytics<span className="heading-dot">.</span></h1><p className="lede">Patterns for better planning, not more pressure.</p></div><div className="hero-actions"><button className="button-ghost" onClick={() => toast("Analytics export queued")}><SquareArrowOutUpRight size={15} />Export</button><button className="button-primary" onClick={() => toast("Date range selector opened")}><CalendarDays size={15} />Last 30 days <ChevronDown size={14} /></button></div></div><div className="analytics-grid"><section className="surface velocity-card"><div className="section-head"><div><span className="section-kicker">Delivery velocity</span><h2>Tasks completed</h2></div><span className="trend up"><ArrowUpRight size={13} />18.4%</span></div><div className="chart-summary"><strong>128</strong><span>tasks closed</span></div><div className="bar-chart">{bars.map((height, index) => <div className="bar-wrap" key={index}><span className={`bar ${index === 9 ? "highlight" : ""}`} style={{ height: `${height}%` }} /><small>{index % 2 === 0 ? `W${index / 2 + 1}` : ""}</small></div>)}</div></section><section className="surface cycle-card"><div className="section-head"><div><span className="section-kicker">Flow health</span><h2>Cycle time</h2></div><IconButton icon={MoreHorizontal} label="Cycle time actions" /></div><div className="donut-wrap"><div className="donut"><div><strong>3.8</strong><small>days</small></div></div><div className="donut-legend"><span><i className="legend-dot coral" />Build <b>52%</b></span><span><i className="legend-dot blue" />Review <b>28%</b></span><span><i className="legend-dot purple" />Waiting <b>20%</b></span></div></div></section><section className="surface insights-card"><div className="section-head"><div><span className="section-kicker">Trace insights</span><h2>What changed</h2></div><WandSparkles size={17} className="accent-icon" /></div><div className="insight-list"><div className="insight-row"><span className="insight-number">01</span><p><strong>Reviews are 22% faster</strong><br />when a meeting decision links directly to the task.</p><ArrowUpRight size={15} /></div><div className="insight-row"><span className="insight-number">02</span><p><strong>Atlas Launch is in the green</strong><br />but two urgent tasks need owners today.</p><ArrowUpRight size={15} /></div><div className="insight-row"><span className="insight-number">03</span><p><strong>Context is being reused</strong><br />the same brief appears in 4 active workflows.</p><ArrowUpRight size={15} /></div></div></section><section className="surface analytics-table-card"><div className="section-head"><div><span className="section-kicker">Project health</span><h2>Portfolio pulse</h2></div><button className="text-button" onClick={() => toast("Portfolio detail view opened")}>Details <ArrowUpRight size={14} /></button></div><div className="portfolio-table"><div className="portfolio-row header"><span>Project</span><span>Progress</span><span>Cycle</span><span>Pulse</span></div>{[["Atlas Launch", "74%", "3.2d", "On track", "coral"], ["Platform", "48%", "4.6d", "Needs focus", "blue"], ["Research", "62%", "2.1d", "On track", "purple"]].map(([name, progress, cycle, pulse, color]) => <div className="portfolio-row" key={name}><span><i className={`space-dot ${color}`} />{name}</span><span><b>{progress}</b><span className="mini-track"><i className={color} style={{ width: progress }} /></span></span><span>{cycle}</span><span className={`pulse-status ${pulse === "On track" ? "good" : "watch"}`}><span />{pulse}</span></div>)}</div></section></div></div>;
}

function TaskDrawer({ task, onClose, onUpdate, toast }: { task: Task; onClose: () => void; onUpdate: (task: Task) => void; toast: (message: string) => void }) {
  const [comment, setComment] = useState("");
  const [subtasks, setSubtasks] = useState(["Write empty state copy", "Pair with design on edge cases", "Add event instrumentation", "QA keyboard path", "Share walkthrough"]);
  const addComment = () => { if (!comment.trim()) return; setComment(""); toast("Comment added to the task"); };
  return <div className="drawer-backdrop" onClick={onClose}><aside className="task-drawer" onClick={event => event.stopPropagation()}><div className="drawer-top"><div className="drawer-breadcrumb"><span className="project-mark" />{task.project}<ChevronRight size={13} />{task.id.toUpperCase()}</div><div><IconButton icon={Share2} label="Share task" onClick={() => toast("Task link copied")} /><IconButton icon={MoreHorizontal} label="More task actions" onClick={() => toast("Task actions opened")} /><IconButton icon={X} label="Close task" onClick={onClose} /></div></div><div className="drawer-scroll"><div className="drawer-title-row"><div className="drawer-check" onClick={() => onUpdate({ ...task, status: task.status === "done" ? "progress" : "done" })}><Check size={17} /></div><input className="drawer-title" value={task.title} onChange={event => onUpdate({ ...task, title: event.target.value })} /></div><div className="drawer-meta-row"><button className="drawer-select"><CircleDot size={14} />{columns.find(column => column.id === task.status)?.label}<ChevronDown size={13} /></button><button className="drawer-select"><PriorityBadge priority={task.priority} /><ChevronDown size={13} /></button><button className="drawer-assignee"><Avatar initials={task.initials} size="sm" />{task.assignee}<ChevronDown size={13} /></button></div><div className="drawer-section"><div className="drawer-section-head"><h3>Subtasks <span>{task.subtasks[0]}/{task.subtasks[1]}</span></h3><button className="text-button" onClick={() => setSubtasks([...subtasks, "New checklist item"])}><Plus size={14} />Add</button></div><div className="subtask-progress"><span style={{ width: `${Math.round((task.subtasks[0] / task.subtasks[1]) * 100)}%` }} /></div><div className="subtask-list">{subtasks.map((item, index) => <label key={`${item}-${index}`}><input type="checkbox" defaultChecked={index < task.subtasks[0]} onChange={event => { const next = event.target.checked ? task.subtasks[0] + 1 : Math.max(0, task.subtasks[0] - 1); onUpdate({ ...task, subtasks: [Math.min(next, task.subtasks[1]), task.subtasks[1]] }); }} /><span>{item}</span></label>)}</div></div><div className="drawer-section"><div className="drawer-section-head"><h3>Context</h3><button className="text-button" onClick={() => toast("Context picker opened")}><Plus size={14} />Link</button></div><div className="context-links"><button><FileText size={15} /><span><strong>Atlas launch brief</strong><small>Updated 8 min ago</small></span><Link2 size={14} /></button><button><GitPullRequest size={15} /><span><strong>PR #218 · onboarding states</strong><small>Awaiting review</small></span><Link2 size={14} /></button></div></div><div className="drawer-section"><div className="drawer-section-head"><h3>Attachments <span>{task.attachments}</span></h3><button className="text-button" onClick={() => toast("Attachment picker opened")}><Paperclip size={14} />Attach</button></div><div className="attachment-row"><div className="attachment-thumb"><Presentation size={16} /></div><div><strong>onboarding-states.fig</strong><small>3.4 MB · Mira Chen</small></div><MoreHorizontal size={15} /></div></div><div className="drawer-section comments-section"><div className="drawer-section-head"><h3>Comments <span>{task.comments}</span></h3><button className="icon-button" onClick={() => toast("Mention someone with @") }><MessageCircle size={15} /></button></div><div className="comment-row"><Avatar initials="NI" size="sm" /><div><p><strong>Nadia Iqbal</strong> <span>48m</span></p><div className="comment-bubble">This is the right edge-case set. I left one note on the keyboard path.</div><small>Reply · React</small></div></div><div className="comment-row"><Avatar initials="LP" size="sm" /><div><p><strong>Leo Park</strong> <span>1h</span></p><div className="comment-bubble">I can pick up instrumentation after the design critique.</div><small>Reply · React</small></div></div><div className="comment-compose"><Avatar initials="AK" color="#34465f" size="sm" /><div><textarea value={comment} onChange={event => setComment(event.target.value)} placeholder="Write a comment or use @mention…" /><div><button className="icon-button" title="Attach"><Paperclip size={14} /></button><button className="button-primary compact" onClick={addComment}>Comment</button></div></div></div></div></div></aside></div>;
}

function MeetingModal({ onClose, toast }: { onClose: () => void; toast: (message: string) => void }) {
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);
  const [captions, setCaptions] = useState(true);
  const [chat, setChat] = useState("");
  return <div className="meeting-overlay"><div className="meeting-room"><div className="meeting-room-top"><div className="room-title"><span className="room-live"><span className="live-dot" />LIVE</span><strong>Atlas Launch product sync</strong><span>00:24:18</span></div><div className="room-actions"><button className="room-button" onClick={() => toast("Meeting link copied")}><Link2 size={15} />Copy link</button><button className="room-button" onClick={() => toast("Invite panel opened")}><UserPlus size={15} />Invite</button><button className="room-close" onClick={onClose}><X size={17} /></button></div></div><div className="meeting-room-body"><div className="meeting-stage"><div className="participant-grid"><div className="participant large coral-bg"><Avatar initials="MC" color="#e9836b" size="lg" /><span className="participant-name"><span className="mic-status"><Mic size={12} /></span>Mira Chen</span></div><div className="participant blue-bg"><Avatar initials="LP" color="#2e7dd7" size="lg" /><span className="participant-name"><span className="mic-status"><Mic size={12} /></span>Leo Park</span></div><div className="participant purple-bg"><Avatar initials="NI" color="#8b72d8" size="lg" /><span className="participant-name"><span className="mic-status"><Mic size={12} /></span>Nadia Iqbal</span></div><div className="participant green-bg"><Avatar initials="AR" color="#27a58c" size="lg" /><span className="participant-name"><span className="mic-status muted"><Mic size={12} /></span>Arjun Rao</span></div></div><div className="caption-bar"><span className="caption-label">Live captions</span><p>“Keep the activation checklist in the brief and make progress visible from the board.”</p></div><div className="meeting-controls"><button className={`control-button ${mic ? "active" : "off"}`} onClick={() => setMic(!mic)}>{mic ? <Mic size={18} /> : <Mic size={18} />}<small>{mic ? "Mute" : "Unmute"}</small></button><button className={`control-button ${camera ? "active" : "off"}`} onClick={() => setCamera(!camera)}>{camera ? <Video size={18} /> : <Video size={18} />}<small>{camera ? "Camera" : "Camera off"}</small></button><button className="control-button" onClick={() => toast("Screen share picker opened")}><Share2 size={18} /><small>Share</small></button><button className={`control-button ${captions ? "active" : "off"}`} onClick={() => setCaptions(!captions)}><MessageSquareText size={18} /><small>Captions</small></button><button className="control-button" onClick={() => toast("Recording started and will attach to this meeting")}><CircleDot size={18} /><small>Record</small></button><button className="leave-button" onClick={onClose}>Leave</button></div></div><aside className="meeting-room-sidebar"><div className="room-tabs"><button className="active">Chat</button><button>Notes</button><button>People <span>6</span></button></div><div className="room-chat"><div className="chat-event"><span><Sparkles size={13} /></span><p>Meeting notes are being synced to <strong>Atlas Launch</strong>.</p></div><div className="chat-message"><Avatar initials="NI" size="sm" /><div><p><strong>Nadia</strong><span>14:03</span></p><div>Can we keep the “why now” slide short?</div></div></div><div className="chat-message"><Avatar initials="LP" size="sm" /><div><p><strong>Leo</strong><span>14:04</span></p><div>Yes — I linked the longer context in the brief.</div></div></div><div className="chat-message"><Avatar initials="MC" size="sm" /><div><p><strong>Mira</strong><span>14:05</span></p><div>Perfect. I’ll update the deck after this.</div></div></div></div><div className="room-chat-compose"><input value={chat} onChange={event => setChat(event.target.value)} placeholder="Message everyone…" onKeyDown={event => { if (event.key === "Enter") { setChat(""); toast("Message sent to the huddle"); } }} /><button onClick={() => { setChat(""); toast("Message sent to the huddle"); }}><ArrowUpRight size={15} /></button></div></aside></div></div></div>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("overview");
  const [tasks, setTasks] = useState(seedTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const toast = (message: string) => { setToastMessage(message); window.setTimeout(() => setToastMessage(""), 2400); };
  const updateTask = (updated: Task) => { setTasks(tasks.map(task => task.id === updated.id ? updated : task)); setSelectedTask(updated); };
  const createTask = () => { const task: Task = { id: `new-${tasks.length + 1}`, title: "New workflow task", project: "Atlas Launch", status: "backlog", priority: "Medium", assignee: "Alex Kim", initials: "AK", color: "#34465f", due: "Sep 22", subtasks: [0, 3], tags: ["New"], comments: 0, attachments: 0 }; setTasks([...tasks, task]); setSelectedTask(task); setActiveView("projects"); };
  return <div className="trace-app"><Sidebar activeView={activeView} setActiveView={setActiveView} onNewTask={createTask} toast={toast} /><main className="trace-main"><Topbar activeView={activeView} search={search} setSearch={setSearch} toast={toast} setMeetingOpen={setMeetingOpen} /><div className="trace-content">{activeView === "overview" && <OverviewView setActiveView={setActiveView} setMeetingOpen={setMeetingOpen} toast={toast} />}{activeView === "projects" && <ProjectsView tasks={tasks} setTasks={setTasks} search={search} openTask={setSelectedTask} toast={toast} />}{activeView === "calendar" && <CalendarView toast={toast} />}{activeView === "meetings" && <MeetingsView setMeetingOpen={setMeetingOpen} toast={toast} />}{activeView === "files" && <FilesView toast={toast} />}{activeView === "analytics" && <AnalyticsView toast={toast} />}</div></main>{selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} onUpdate={updateTask} toast={toast} />}{meetingOpen && <MeetingModal onClose={() => setMeetingOpen(false)} toast={toast} />}{toastMessage && <div className="toast"><CheckCircle2 size={16} /><span>{toastMessage}</span></div>}</div>;
}
