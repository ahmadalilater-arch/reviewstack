import { useState, useEffect } from 'react';
import {
  LayoutDashboard, MessageSquare, Users, Settings, Star,
  TrendingUp, Bell, Search, Plus, ChevronRight, Mail,
  Phone, CheckCircle, AlertCircle, BarChart2,
  Shield, Zap, Globe, CreditCard, LogOut, X, Send,
  Eye, Download, Filter, Copy, Edit3,
  HelpCircle, ExternalLink, ChevronDown, Menu,
  ArrowUpRight, ArrowDownRight, FileText, Lock
} from 'lucide-react';
import { ReputeLogo } from './ui/repute-logo';
import { useTheme } from '../context/ThemeContext';

interface DashboardProps {
  campaigns?: any[];
  setView?: (v: any) => void;
  onViewCampaign?: (id: string) => void;
  user?: { name: string; email: string; business: string } | null;
  onNavigate?: (view: string) => void;
  userEmail?: string;
  userName?: string;
}

const SField = ({ label, defaultValue, type = 'text', placeholder = '' }: { label: string; defaultValue?: string; type?: string; placeholder?: string }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg text-sm border transition-all focus:outline-none"
      style={{
        background: 'var(--bg-surface-2)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-primary)',
      }}
      onFocus={e => e.target.style.borderColor = '#38bdf8'}
      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
    />
  </div>
);

const campaigns = [
  { id: 1, name: 'Summer Hotel Guests', status: 'active', contacts: 248, sent: 248, positive: 187, negative: 34, pending: 27, happy: 75, date: '2024-06-01' },
  { id: 2, name: 'Restaurant Post-Visit', status: 'active', contacts: 156, sent: 156, positive: 134, negative: 12, pending: 10, happy: 86, date: '2024-05-28' },
  { id: 3, name: 'Spa Experience Follow-up', status: 'completed', contacts: 89, sent: 89, positive: 71, negative: 8, pending: 10, happy: 80, date: '2024-05-15' },
  { id: 4, name: 'Dental Clinic Q2', status: 'draft', contacts: 312, sent: 0, positive: 0, negative: 0, pending: 312, happy: 0, date: '2024-06-10' },
];

const contacts = [
  { id: 1, name: 'Maria Garcia', email: 'maria@example.com', phone: '+1 555-0101', campaign: 'Summer Hotel Guests', status: 'positive', date: '2024-06-02' },
  { id: 2, name: 'James Wilson', email: 'james@example.com', phone: '+1 555-0102', campaign: 'Restaurant Post-Visit', status: 'negative', date: '2024-06-02' },
  { id: 3, name: 'Sarah Chen', email: 'sarah@example.com', phone: '+1 555-0103', campaign: 'Summer Hotel Guests', status: 'positive', date: '2024-06-01' },
  { id: 4, name: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '+1 555-0104', campaign: 'Spa Experience Follow-up', status: 'pending', date: '2024-05-30' },
  { id: 5, name: 'Emma Thompson', email: 'emma@example.com', phone: '+1 555-0105', campaign: 'Dental Clinic Q2', status: 'pending', date: '2024-05-29' },
  { id: 6, name: 'Carlos Rivera', email: 'carlos@example.com', phone: '+1 555-0106', campaign: 'Restaurant Post-Visit', status: 'negative', date: '2024-05-28' },
];

const inboxItems = [
  { id: 1, name: 'James Wilson', campaign: 'Restaurant Post-Visit', message: 'The wait time was way too long, over 45 minutes for a table. Staff was rude when we asked about it. Will not be returning.', date: '2h ago', resolved: false, rating: 2 },
  { id: 2, name: 'Carlos Rivera', campaign: 'Restaurant Post-Visit', message: 'Food was cold when it arrived and the portion sizes were much smaller than advertised. Disappointing experience overall.', date: '5h ago', resolved: false, rating: 1 },
  { id: 3, name: 'Linda Park', campaign: 'Spa Experience Follow-up', message: 'The massage was okay but the facilities were not as clean as I expected for the price point.', date: '1d ago', resolved: true, rating: 3 },
];

const templates = [
  { id: 1, name: 'Hotel Post-Stay', subject: 'How was your stay at {{business}}?', body: 'Hi {{name}}, thank you for staying with us at {{business}}! We would love to hear about your experience. How did we do?', usage: 248, positive: 75, channel: 'email' },
  { id: 2, name: 'Restaurant Follow-up', subject: 'Thanks for dining with us!', body: 'Hey {{name}}! Thanks for visiting {{business}} recently. We hope you enjoyed your meal. Would you mind sharing your experience?', usage: 156, positive: 86, channel: 'sms' },
  { id: 3, name: 'Service Business', subject: 'Your recent appointment at {{business}}', body: 'Hi {{name}}, we hope your recent visit to {{business}} went well. Your feedback helps us improve our service for everyone!', usage: 89, positive: 80, channel: 'email' },
  { id: 4, name: 'Spa & Wellness', subject: 'How was your wellness experience?', body: 'Hello {{name}}, we hope you left {{business}} feeling refreshed! We value your thoughts on your recent visit.', usage: 44, positive: 91, channel: 'email' },
];

function OverviewTab({ onNavigate }: { onNavigate: (v: string) => void }) {
  const [counts, setCounts] = useState({ businesses: 0, reviews: 0, rate: 0, rating: 0 });
  useEffect(() => {
    const targets = { businesses: 2418, reviews: 48320, rate: 94, rating: 48 };
    const duration = 1800;
    const steps = 60;
    const interval = setInterval(() => {
      setCounts(prev => ({
        businesses: Math.min(prev.businesses + Math.ceil(targets.businesses / steps), targets.businesses),
        reviews: Math.min(prev.reviews + Math.ceil(targets.reviews / steps), targets.reviews),
        rate: Math.min(prev.rate + Math.ceil(targets.rate / steps), targets.rate),
        rating: Math.min(prev.rating + Math.ceil(targets.rating / steps), targets.rating),
      }));
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Reviews Earned', value: counts.reviews.toLocaleString(), change: '+12%', up: true, icon: Star, color: '#f59e0b' },
    { label: 'Active Campaigns', value: '3', change: '+1', up: true, icon: TrendingUp, color: '#38bdf8' },
    { label: 'Routing Rate', value: `${counts.rate}%`, change: '+2%', up: true, icon: ArrowUpRight, color: '#0ea5e9' },
    { label: 'Avg Rating Boost', value: `+${(counts.rating / 10).toFixed(1)}★`, change: '+0.2', up: true, icon: Shield, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6 animate-[tab-enter_0.3s_ease_forwards]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Good morning ☀️</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Here's what's happening with your reviews today.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl p-4 border transition-all hover:scale-[1.01]" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${s.up ? 'text-sky-500' : 'text-red-500'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{s.change}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Recent Campaigns</h3>
            <button onClick={() => onNavigate('campaigns')} className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors">View all <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-3">
            {campaigns.slice(0, 3).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg transition-colors" style={{ background: 'var(--bg-surface-2)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === 'active' ? 'bg-sky-500/10 text-sky-400' : c.status === 'completed' ? 'bg-sky-500/10 text-sky-400' : 'bg-zinc-500/10 text-zinc-400'}`}>{c.status}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-zinc-700/50 overflow-hidden">
                      <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${c.happy}%` }} />
                    </div>
                    <span className="text-xs text-sky-400 font-medium">{c.happy}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-sky-400">+{c.positive}</div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>reviews</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: Plus, label: 'New Campaign', color: '#38bdf8', action: 'new-campaign' },
              { icon: MessageSquare, label: 'View Inbox', color: '#ef4444', action: 'inbox' },
              { icon: Users, label: 'Manage Contacts', color: '#0ea5e9', action: 'contacts' },
              { icon: BarChart2, label: 'Analytics', color: '#f59e0b', action: 'analytics' },
            ].map((a, i) => (
              <button key={i} onClick={() => onNavigate(a.action)} className="w-full flex items-center gap-3 p-2.5 rounded-lg transition-all hover:scale-[1.01] text-left" style={{ background: 'var(--bg-surface-2)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${a.color}18` }}>
                  <a.icon className="w-3.5 h-3.5" style={{ color: a.color }} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.label}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: 'var(--text-tertiary)' }} />
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Satisfaction Rate</span>
              <span className="text-xs font-bold text-sky-400">87%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface-2)' }}>
              <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all" style={{ width: '87%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignsTab({ onNavigate }: { onNavigate: (v: string) => void }) {
  const [search, setSearch] = useState('');
  const filtered = campaigns.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-4 animate-[tab-enter_0.3s_ease_forwards]">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} onFocus={e => e.target.style.borderColor = '#38bdf8'} onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <Filter className="w-4 h-4" /> Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <Download className="w-4 h-4" /> Export
        </button>
      </div>
      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.id} className="rounded-xl border p-4 transition-all hover:border-sky-500/40" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === 'active' ? 'bg-sky-500/10 text-sky-400' : c.status === 'completed' ? 'bg-sky-500/10 text-sky-400' : 'bg-zinc-500/10 text-zinc-400'}`}>{c.status}</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Created {c.date}</p>
              </div>
              <button onClick={() => onNavigate('campaign-detail')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors">
                Open <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {[
                { label: 'Contacts', value: c.contacts, color: 'var(--text-primary)' },
                { label: 'Reviews', value: c.positive, color: '#0ea5e9' },
                { label: 'Intercepted', value: c.negative, color: '#ef4444' },
                { label: 'Happy %', value: `${c.happy}%`, color: '#38bdf8' },
              ].map((s, i) => (
                <div key={i} className="rounded-lg p-2.5 text-center" style={{ background: 'var(--bg-surface-2)' }}>
                  <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface-2)' }}>
                <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-500" style={{ width: `${c.happy}%` }} />
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{c.happy}% positive</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InboxTab() {
  const [items, setItems] = useState(inboxItems);
  const [replyTo, setReplyTo] = useState<null | typeof inboxItems[0]>(null);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  const handleResolve = (id: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, resolved: true } : i));
  const handleReply = () => {
    setReplySent(true);
    setTimeout(() => { setReplyTo(null); setReplySent(false); setReplyText(''); }, 1200);
  };

  return (
    <div className="space-y-4 animate-[tab-enter_0.3s_ease_forwards]">
      <div className="rounded-xl border p-4 flex items-center gap-4" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10">
          <Shield className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Private Feedback Intercepted</h3>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{items.filter(i => !i.resolved).length} unresolved — respond privately before they go public</p>
        </div>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className={`rounded-xl border p-4 transition-all ${item.resolved ? 'opacity-50' : 'hover:border-red-500/30'}`} style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">{item.name[0]}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                    {!item.resolved && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium">New</span>}
                    {item.resolved && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-medium">Resolved</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.campaign}</span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>• {item.date}</span>
                    <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-2.5 h-2.5 ${i < item.rating ? 'text-red-400 fill-red-400' : 'text-zinc-600'}`} />)}</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-3 pl-10" style={{ color: 'var(--text-secondary)' }}>{item.message}</p>
            {!item.resolved && (
              <div className="flex items-center gap-2 pl-10">
                <button onClick={() => setReplyTo(item)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors">
                  <Send className="w-3 h-3" /> Reply Privately
                </button>
                <button onClick={() => handleResolve(item.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)' }}>
                  <CheckCircle className="w-3 h-3" /> Mark Resolved
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {replyTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-2xl border p-6 animate-[modal-enter_0.25s_ease_forwards]" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Reply to {replyTo.name}</h3>
              <button onClick={() => setReplyTo(null)} className="p-1.5 rounded-lg transition-colors" style={{ background: 'var(--bg-surface-2)' }}><X className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} /></button>
            </div>
            <div className="rounded-lg p-3 mb-4 text-sm border-l-2 border-red-500" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)' }}>{replyTo.message}</div>
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} placeholder="Write a private response..." className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none resize-none transition-all mb-4" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
            <button onClick={handleReply} disabled={replySent} className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 disabled:opacity-60">
              {replySent ? '✓ Sent!' : 'Send Private Reply'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactsTab() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const filtered = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });
  return (
    <div className="space-y-4 animate-[tab-enter_0.3s_ease_forwards]">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
        </div>
        <div className="flex gap-1.5 p-1 rounded-xl border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          {['all', 'positive', 'negative', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-sky-500 text-white' : ''}`} style={filter !== f ? { color: 'var(--text-tertiary)' } : {}}>{f}</button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="grid grid-cols-12 gap-4 px-4 py-2.5 text-xs font-medium border-b" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
          <span className="col-span-3">Contact</span><span className="col-span-3">Email</span><span className="col-span-2">Campaign</span><span className="col-span-2">Status</span><span className="col-span-2">Actions</span>
        </div>
        {filtered.map(c => (
          <div key={c.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b transition-colors hover:bg-sky-500/5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <div className="col-span-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white text-xs font-bold">{c.name[0]}</div>
              <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
            </div>
            <div className="col-span-3 flex items-center text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{c.email}</div>
            <div className="col-span-2 flex items-center text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{c.campaign}</div>
            <div className="col-span-2 flex items-center">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === 'positive' ? 'bg-sky-500/10 text-sky-400' : c.status === 'negative' ? 'bg-red-500/10 text-red-400' : 'bg-red-500/10 text-red-400'}`}>{c.status}</span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5">
              {c.status === 'negative' && <button className="p-1 rounded hover:bg-sky-500/10 transition-colors"><Mail className="w-3.5 h-3.5 text-sky-400" /></button>}
              <button className="p-1 rounded hover:bg-zinc-500/10 transition-colors"><Eye className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplatesTab() {
  const [selected, setSelected] = useState<typeof templates[0] | null>(null);
  const [editName, setEditName] = useState('');
  const [editBody, setEditBody] = useState('');
  const [saved, setSaved] = useState(false);

  const handleEdit = (t: typeof templates[0]) => { setSelected(t); setEditName(t.name); setEditBody(t.body); setSaved(false); };
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const insertTag = (tag: string) => setEditBody(prev => prev + ` ${tag}`);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-[tab-enter_0.3s_ease_forwards]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Message Templates</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors"><Plus className="w-3 h-3" /> New</button>
        </div>
        {templates.map(t => (
          <div key={t.id} onClick={() => handleEdit(t)} className={`rounded-xl border p-4 cursor-pointer transition-all ${selected?.id === t.id ? 'border-sky-500/60 bg-sky-500/5' : 'hover:border-sky-500/30'}`} style={{ background: selected?.id === t.id ? undefined : 'var(--bg-surface)', borderColor: selected?.id === t.id ? undefined : 'var(--border-subtle)' }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${t.channel === 'email' ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-500/10 text-sky-400'}`}>{t.channel}</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{t.usage} sent</span>
                  <span className="text-[10px] text-sky-400">{t.positive}% positive</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-sky-500/10 transition-colors"><Edit3 className="w-3.5 h-3.5 text-sky-400" /></button>
                <button className="p-1.5 rounded-lg hover:bg-zinc-500/10 transition-colors"><Copy className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} /></button>
              </div>
            </div>
            <p className="text-xs line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>{t.body}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Edit Template</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg transition-colors" style={{ background: 'var(--bg-surface-2)' }}><X className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} /></button>
            </div>
            <SField label="Template Name" defaultValue={editName} />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Message Body</label>
              <textarea value={editBody} onChange={e => setEditBody(e.target.value)} rows={5} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none resize-none transition-all" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Insert Tags</label>
              <div className="flex flex-wrap gap-2">
                {['{{name}}', '{{business}}', '{{date}}', '{{service}}'].map(tag => (
                  <button key={tag} onClick={() => insertTag(tag)} className="px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors hover:border-sky-500/60 hover:text-sky-400" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>{tag}</button>
                ))}
              </div>
            </div>
            <div className="rounded-lg p-3 border-l-2 border-sky-500" style={{ background: 'var(--bg-surface-2)' }}>
              <p className="text-xs font-medium mb-1 text-sky-400">Live Preview</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{editBody.replace('{{name}}', 'Maria').replace('{{business}}', 'Grand Hotel').replace('{{date}}', 'June 1').replace('{{service}}', 'your stay')}</p>
            </div>
            <button onClick={handleSave} className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500">
              {saved ? '✓ Saved!' : 'Save Template'}
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <FileText className="w-10 h-10 mb-3 opacity-20" style={{ color: 'var(--text-tertiary)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Select a template to edit</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Click any template on the left to preview and customize it</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const weeklyData = [
    { day: 'Mon', sent: 42, positive: 31 },
    { day: 'Tue', sent: 58, positive: 47 },
    { day: 'Wed', sent: 35, positive: 28 },
    { day: 'Thu', sent: 71, positive: 63 },
    { day: 'Fri', sent: 89, positive: 78 },
    { day: 'Sat', sent: 54, positive: 41 },
    { day: 'Sun', sent: 23, positive: 19 },
  ];
  const maxVal = Math.max(...weeklyData.map(d => d.sent));

  return (
    <div className="space-y-4 animate-[tab-enter_0.3s_ease_forwards]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Open Rate', value: '68%', icon: Mail, color: '#38bdf8' },
          { label: 'Click-Through', value: '43%', icon: ArrowUpRight, color: '#0ea5e9' },
          { label: 'Conversion', value: '31%', icon: TrendingUp, color: '#f59e0b' },
          { label: 'Unsubscribes', value: '0.4%', icon: ArrowDownRight, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border p-4" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <h3 className="font-semibold text-sm mb-5" style={{ color: 'var(--text-primary)' }}>Weekly Performance</h3>
        <div className="flex items-end gap-3 h-36">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col gap-1 items-center">
                <div className="w-full rounded-t-md bg-sky-500/20 relative overflow-hidden" style={{ height: `${(d.sent / maxVal) * 120}px` }}>
                  <div className="absolute bottom-0 w-full rounded-t-md bg-sky-500 transition-all" style={{ height: `${(d.positive / d.sent) * 100}%` }} />
                </div>
              </div>
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{d.day}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-sky-500/20" /><span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Sent</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-sky-500" /><span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Positive</span></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>By Channel</h3>
          <div className="space-y-3">
            {[{ label: 'Email', pct: 68, color: '#38bdf8' }, { label: 'SMS', pct: 24, color: '#0ea5e9' }, { label: 'WhatsApp', pct: 8, color: '#f59e0b' }].map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-secondary)' }}>{c.label}</span><span style={{ color: 'var(--text-tertiary)' }}>{c.pct}%</span></div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface-2)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Review Funnel</h3>
          <div className="space-y-2">
            {[
              { label: 'Messages Sent', value: 493, pct: 100, color: '#38bdf8' },
              { label: 'Opened', value: 335, pct: 68, color: '#38bdf8' },
              { label: 'Responded', value: 212, pct: 43, color: '#0ea5e9' },
              { label: 'Reviews Left', value: 153, pct: 31, color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-7 rounded-lg flex items-center px-3" style={{ width: `${s.pct}%`, background: `${s.color}18`, minWidth: '100px' }}>
                  <span className="text-xs font-medium truncate" style={{ color: s.color }}>{s.label}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ google: true, gmail: true, twilio: false, stripe: false, zapier: false, hubspot: false, sheets: true, webhooks: false });
  const integrations = [
    { id: 'google', name: 'Google Business', desc: 'Sync reviews to your Google profile', icon: Globe, color: '#38bdf8' },
    { id: 'gmail', name: 'Gmail', desc: 'Send review requests via Gmail', icon: Mail, color: '#ef4444' },
    { id: 'sheets', name: 'Google Sheets', desc: 'Import contacts from spreadsheets', icon: FileText, color: '#0ea5e9' },
    { id: 'twilio', name: 'Twilio SMS', desc: 'Send review requests via SMS', icon: Phone, color: '#f59e0b' },
    { id: 'stripe', name: 'Stripe', desc: 'Trigger reviews after payments', icon: CreditCard, color: '#38bdf8' },
    { id: 'zapier', name: 'Zapier', desc: 'Connect 5,000+ apps', icon: Zap, color: '#f97316' },
    { id: 'hubspot', name: 'HubSpot', desc: 'Sync CRM contacts automatically', icon: Users, color: '#ef4444' },
    { id: 'webhooks', name: 'Webhooks', desc: 'Custom HTTP webhooks for any app', icon: Globe, color: '#a3a3a3' },
  ];
  return (
    <div className="space-y-4 animate-[tab-enter_0.3s_ease_forwards]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {integrations.map(int => (
          <div key={int.id} className="rounded-xl border p-4 flex items-center gap-4 transition-all hover:border-sky-500/30" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${int.color}15` }}>
              <int.icon className="w-5 h-5" style={{ color: int.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{int.name}</span>
                {connected[int.id] && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-medium">Connected</span>}
              </div>
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>{int.desc}</p>
            </div>
            <button onClick={() => setConnected(prev => ({ ...prev, [int.id]: !prev[int.id] }))} className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${connected[int.id] ? 'bg-sky-500' : ''}`} style={!connected[int.id] ? { background: 'var(--border-subtle)' } : {}}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${connected[int.id] ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillingTab() {
  const [annual, setAnnual] = useState(false);
  const plans = [
    { name: 'Starter', price: annual ? 29 : 39, features: ['Up to 100 contacts/mo', '1 campaign', 'Email only', 'Basic analytics', 'Email support'], current: false },
    { name: 'Growth', price: annual ? 79 : 99, features: ['Up to 1,000 contacts/mo', '10 campaigns', 'Email + SMS', 'Advanced analytics', 'Priority support', 'Custom templates', 'Integrations'], current: true },
    { name: 'Enterprise', price: annual ? 199 : 249, features: ['Unlimited contacts', 'Unlimited campaigns', 'All channels', 'White-label', 'Dedicated CSM', 'SLA guarantee', 'Custom integrations'], current: false },
  ];
  return (
    <div className="space-y-6 animate-[tab-enter_0.3s_ease_forwards]">
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Monthly</span>
        <button onClick={() => setAnnual(a => !a)} className={`relative w-10 h-5 rounded-full transition-all ${annual ? 'bg-sky-500' : ''}`} style={!annual ? { background: 'var(--border-subtle)' } : {}}>
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${annual ? 'left-5' : 'left-0.5'}`} />
        </button>
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Annual <span className="text-sky-400 text-xs font-bold">Save 20%</span></span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p, i) => (
          <div key={i} className={`rounded-2xl border p-5 flex flex-col transition-all ${p.current ? 'border-sky-500/60' : 'hover:border-sky-500/30'}`} style={{ background: p.current ? 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(56,189,248,0.04))' : 'var(--bg-surface)', borderColor: p.current ? undefined : 'var(--border-subtle)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
              {p.current && <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-medium">Current</span>}
            </div>
            <div className="mb-4">
              <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>${p.price}</span>
              <span className="text-sm ml-1" style={{ color: 'var(--text-tertiary)' }}>/mo</span>
            </div>
            <ul className="space-y-2 flex-1 mb-4">
              {p.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <CheckCircle className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${p.current ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-400 hover:to-sky-500' : 'border hover:border-sky-500/40'}`} style={!p.current ? { borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' } : {}}>
              {p.current ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Usage This Month</h3>
        <div className="space-y-3">
          {[
            { label: 'Contacts Messaged', used: 248, total: 1000, color: '#38bdf8' },
            { label: 'Campaigns Active', used: 3, total: 10, color: '#0ea5e9' },
            { label: 'Reviews Earned', used: 187, total: null, color: '#f59e0b' },
          ].map((u, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>{u.label}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{u.used}{u.total ? `/${u.total}` : ' earned'}</span>
              </div>
              {u.total && (
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface-2)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(u.used / u.total) * 100}%`, background: u.color }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) {
  const [sub, setSub] = useState('account');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ newReview: true, negativeAlert: true, weeklyReport: false, productUpdates: true });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const subSections = [
    { id: 'account', label: 'Account', icon: Users },
    { id: 'business', label: 'Business', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Star },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-[tab-enter_0.3s_ease_forwards]">
      <div className="lg:col-span-1">
        <div className="rounded-xl border p-2" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          {subSections.map(s => (
            <button key={s.id} onClick={() => setSub(s.id)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${sub === s.id ? 'bg-sky-500/10 text-sky-400' : ''}`} style={sub !== s.id ? { color: 'var(--text-secondary)' } : {}}>
              <s.icon className="w-4 h-4" />{s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-3 rounded-xl border p-5 animate-[tab-enter_0.25s_ease_forwards]" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        {sub === 'account' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Account Settings</h3>
            <div className="flex items-center gap-4 p-4 rounded-xl border" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)' }}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white text-xl font-bold">R</div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Profile Photo</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>JPG, PNG up to 5MB</p>
                <button className="text-xs text-sky-400 font-medium mt-1 hover:text-sky-300 transition-colors">Upload photo</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SField label="Full Name" defaultValue="Repute User" />
              <SField label="Email" defaultValue="user@repute.io" type="email" />
            </div>
            <SField label="Phone" defaultValue="+1 (555) 000-0000" type="tel" />
            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500">
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        )}
        {sub === 'business' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Business Settings</h3>
            <SField label="Business Name" defaultValue="Grand Palms Hotel" />
            <SField label="Google Maps URL" defaultValue="https://maps.google.com/..." />
            <div className="grid grid-cols-2 gap-3">
              <SField label="Industry" defaultValue="Hospitality" />
              <SField label="Timezone" defaultValue="UTC-5 Eastern" />
            </div>
            <SField label="Website" defaultValue="https://grandpalms.com" />
            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500">
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        )}
        {sub === 'notifications' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h3>
            {[
              { key: 'newReview', label: 'New Review Earned', desc: 'When a customer leaves a Google review' },
              { key: 'negativeAlert', label: 'Negative Feedback Alert', desc: 'When a customer gives private negative feedback' },
              { key: 'weeklyReport', label: 'Weekly Report', desc: 'Summary of review activity every Monday' },
              { key: 'productUpdates', label: 'Product Updates', desc: 'New features and improvements from Repute' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between p-4 rounded-xl border" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{n.desc}</p>
                </div>
                <button onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))} className={`relative w-10 h-5 rounded-full transition-all ${notifs[n.key as keyof typeof notifs] ? 'bg-sky-500' : ''}`} style={!notifs[n.key as keyof typeof notifs] ? { background: 'var(--border-subtle)' } : {}}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifs[n.key as keyof typeof notifs] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        )}
        {sub === 'security' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Security</h3>
            <div className="p-4 rounded-xl border flex items-center justify-between" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Two-Factor Authentication</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors">Enable</button>
            </div>
            <div className="space-y-3">
              <SField label="Current Password" type="password" placeholder="••••••••" />
              <SField label="New Password" type="password" placeholder="••••••••" />
              <SField label="Confirm Password" type="password" placeholder="••••••••" />
            </div>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500">
              {saved ? '✓ Updated!' : 'Update Password'}
            </button>
            <div className="p-4 rounded-xl border border-red-500/20" style={{ background: 'rgba(244,63,94,0.05)' }}>
              <p className="text-sm font-medium text-red-400 mb-1">Danger Zone</p>
              <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>Permanently delete your account and all data</p>
              <button className="px-4 py-2 rounded-lg text-sm font-medium border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors">Delete Account</button>
            </div>
          </div>
        )}
        {sub === 'appearance' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Appearance</h3>
            <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)' }}>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Theme</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'dark', label: 'Dark', desc: 'Midnight Deep' },
                  { id: 'light', label: 'Light', desc: 'Soft Bone' },
                ].map(t => (
                  <button key={t.id} onClick={toggleTheme} className={`p-4 rounded-xl border-2 text-left transition-all ${isDark === (t.id === 'dark') ? 'border-sky-500' : 'border-transparent'}`} style={{ background: t.id === 'dark' ? '#0E0F14' : '#F7F6F3' }}>
                    <p className="text-sm font-semibold" style={{ color: t.id === 'dark' ? '#E8E9ED' : '#0D1117' }}>{t.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: t.id === 'dark' ? '#6B7280' : '#6B7280' }}>{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)' }}>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Accent Color</p>
              <div className="flex gap-2">
                {['#38bdf8', '#0ea5e9', '#ef4444', '#0ea5e9', '#f59e0b', '#0284c7'].map(color => (
                  <button key={color} className="w-7 h-7 rounded-full border-2 border-transparent hover:border-white/40 transition-all" style={{ background: color }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate, setView, userEmail, userName }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: TrendingUp },
    { id: 'inbox', label: 'Inbox', icon: MessageSquare, badge: inboxItems.filter(i => !i.resolved).length },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const nav = onNavigate ?? setView ?? (() => {});
  const handleNav = (id: string) => {
    if (id === 'new-campaign') { nav('new-campaign'); return; }
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col border-r transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
          <ReputeLogo />
          <button className="lg:hidden p-1.5 rounded-lg transition-colors" style={{ background: 'var(--bg-surface-2)' }} onClick={() => setMobileOpen(false)}><X className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} /></button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => handleNav(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeTab === item.id ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'border border-transparent hover:border-sky-500/10 hover:bg-sky-500/5'}`} style={activeTab !== item.id ? { color: 'var(--text-secondary)' } : {}}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{item.badge}</span> : null}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="rounded-xl p-3 border" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(56,189,248,0.04))', borderColor: 'rgba(56,189,248,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-xs font-semibold text-sky-400">Growth Plan</span>
            </div>
            <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>248/1000 contacts used</p>
            <div className="h-1 rounded-full overflow-hidden mb-2" style={{ background: 'var(--bg-surface-2)' }}>
              <div className="h-full rounded-full bg-sky-500" style={{ width: '24.8%' }} />
            </div>
            <button className="text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors">Upgrade to Pro →</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-4 lg:px-6 h-16 border-b flex-shrink-0" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          <button className="lg:hidden p-2 rounded-lg" style={{ background: 'var(--bg-surface-2)' }} onClick={() => setMobileOpen(true)}><Menu className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} /></button>
          <div className="flex-1 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <input placeholder="Search..." className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border focus:outline-none transition-all" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} onFocus={e => e.target.style.borderColor = '#38bdf8'} onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {activeTab === 'campaigns' && (
              <button onClick={() => nav('new-campaign')} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 shadow-lg shadow-sky-500/20">
                <Plus className="w-4 h-4" /> New Campaign
              </button>
            )}
            <div className="relative">
              <button onClick={() => setNotifOpen(v => !v)} className="w-9 h-9 rounded-xl flex items-center justify-center border relative transition-colors hover:border-sky-500/40" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)' }}>
                <Bell className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden animate-[modal-enter_0.2s_ease_forwards]" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                    <button onClick={() => setNotifOpen(false)}><X className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} /></button>
                  </div>
                  {[
                    { icon: Star, color: '#38bdf8', title: 'New review earned', time: '2m ago', desc: 'Maria Garcia left a 5★ review on Google' },
                    { icon: AlertCircle, color: '#ef4444', title: 'Negative feedback', time: '1h ago', desc: 'James Wilson sent private feedback' },
                    { icon: CheckCircle, color: '#0ea5e9', title: 'Campaign completed', time: '3h ago', desc: 'Spa Experience Follow-up finished' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 border-b transition-colors hover:bg-sky-500/5 cursor-pointer" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${n.color}18` }}><n.icon className="w-4 h-4" style={{ color: n.color }} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{n.time}</span>
                        </div>
                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setUserMenuOpen(v => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-xl border transition-all hover:border-sky-500/40" style={{ background: 'var(--bg-surface-2)', borderColor: 'var(--border-subtle)' }}>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white text-xs font-bold">{userName?.[0] || 'R'}</div>
                <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--text-primary)' }}>{userName || 'User'}</span>
                <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-11 w-52 rounded-2xl border shadow-2xl z-50 overflow-hidden animate-[modal-enter_0.2s_ease_forwards]" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{userName}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{userEmail}</p>
                  </div>
                  {[
                    { label: 'Settings', icon: Settings, action: () => { setActiveTab('settings'); setUserMenuOpen(false); } },
                    { label: 'Billing', icon: CreditCard, action: () => { setActiveTab('billing'); setUserMenuOpen(false); } },
                    { label: 'Help Center', icon: HelpCircle, action: () => {} },
                    { label: 'Sign Out', icon: LogOut, action: () => nav('landing'), danger: true },
                  ].map((item, i) => (
                    <button key={i} onClick={item.action} className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left ${item.danger ? 'text-red-400 hover:bg-red-500/10' : 'hover:bg-sky-500/5'}`} style={!item.danger ? { color: 'var(--text-secondary)' } : {}}>
                      <item.icon className="w-4 h-4" />{item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeTab === 'overview' && <OverviewTab onNavigate={handleNav} />}
          {activeTab === 'campaigns' && <CampaignsTab onNavigate={handleNav} />}
          {activeTab === 'inbox' && <InboxTab />}
          {activeTab === 'contacts' && <ContactsTab />}
          {activeTab === 'templates' && <TemplatesTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'integrations' && <IntegrationsTab />}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'settings' && <SettingsTab toggleTheme={toggleTheme} isDark={isDark} />}
        </main>
      </div>
    </div>
  );
}
