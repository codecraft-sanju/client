'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  Activity,AlertTriangle,
  ArrowDownLeft,
  ArrowUpDown,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  Calendar,
  CalendarCheck,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Gauge,
  Hammer,
  HardHat,
  IndianRupee,
  Inbox,
  Info,
  Layers,
  LayoutDashboard,
  Loader2,
  Mail,
  MapPin,
  Menu,
  MoreVertical,
  Package,
  PackageMinus,
  PackagePlus,
  Pencil,
  Phone,
  Plus,
  Printer,
  Receipt,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  UserPlus,
  Users,
  Wallet,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import gsap from 'gsap';

/* ========================================================= */
/* Types                                                     */
/* ========================================================= */

type SectionKey =
  | 'dashboard'
  | 'labour'
  | 'attendance'
  | 'work'
  | 'khata'
  | 'projects'
  | 'materials'
  | 'expenses'
  | 'reports'
  | 'settings';

type Trade =
  | 'Mason'
  | 'Helper'
  | 'Carpenter'
  | 'Electrician'
  | 'Plumber'
  | 'Painter'
  | 'Supervisor'
  | 'Tile Worker'
  | 'Other';

type WorkerStatus = 'Active' | 'Inactive';
type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave';
type WorkUnit = 'sq.ft.' | 'running ft.' | 'cubic ft.' | 'nos.' | 'kg' | 'day' | 'custom';

type TransactionType =
  | 'Salary/Wage'
  | 'Daily Allowance'
  | 'Advance'
  | 'Payment'
  | 'Reimbursement'
  | 'Expense'
  | 'Bonus'
  | 'Deduction'
  | 'Other';

type TransactionDirection = 'credit' | 'debit';
type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
type ProjectStage = 'Enquiry' | 'Coming Soon' | 'Running' | 'Completed';

type MaterialCategory =
  | 'Cement'
  | 'Sand'
  | 'Steel'
  | 'Bricks'
  | 'Tiles'
  | 'Paint'
  | 'Electrical'
  | 'Plumbing'
  | 'Hardware'
  | 'Other';

type MaterialUnit =
  | 'bag'
  | 'kg'
  | 'ton'
  | 'cubic ft.'
  | 'nos.'
  | 'box'
  | 'litre'
  | 'running ft.'
  | 'coil'
  | 'sq.ft.';

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
type MovementType = 'Receive' | 'Use';

type ExpenseCategory =
  | 'Labour'
  | 'Material'
  | 'Transport'
  | 'Machinery'
  | 'Food'
  | 'Accommodation'
  | 'Fuel'
  | 'Site Expense'
  | 'Office'
  | 'Other';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';
type NotificationType = ToastVariant;

type ActivityType =
  | 'worker'
  | 'attendance'
  | 'work'
  | 'payment'
  | 'project'
  | 'material'
  | 'expense'
  | 'system';

type TimeRange = 'daily' | 'weekly' | 'monthly';
type CostKind = 'labour' | 'material' | 'other';
type CostSource = 'attendance' | 'ledger' | 'material' | 'expense';

type ReportType =
  | 'labour'
  | 'productivity'
  | 'site'
  | 'daily-expense'
  | 'weekly-expense'
  | 'monthly-expense'
  | 'material'
  | 'salary'
  | 'khata'
  | 'project-cost'
  | 'profit-loss'
  | 'attendance'
  | 'work';

interface Worker {
  id: string;
  name: string;
  phone: string;
  trade: Trade;
  /** Empty string means the worker is not assigned to any project. */
  projectId: string;
  joiningDate: string;
  dailyWage: number;
  status: WorkerStatus;
}

interface AttendanceRecord {
  id: string;
  date: string;
  projectId: string;
  workerId: string;
  status: AttendanceStatus;
  overtimeHours: number;
  notes: string;
}

interface WorkEntry {
  id: string;
  date: string;
  workerId: string;
  projectId: string;
  task: string;
  quantity: number;
  unit: WorkUnit;
  customUnit: string;
  notes: string;
}

interface Project {
  id: string;
  name: string;
  stage: ProjectStage;
  location: string;
  address: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  referenceSource: string;
  engineerName: string;
  architectName: string;
  startDate: string;
  expectedCompletion: string;
  projectValue: number;
  estimatedCost: number;
  labourBudget: number;
  materialBudget: number;
  otherBudget: number;
  /** Costs booked before records started being tracked in this system. */
  priorLabourCost: number;
  priorMaterialCost: number;
  priorOtherCost: number;
  /** Total planned built-up work in sq.ft. */
  workTarget: number;
  /** Completed sq.ft. before tracking started. */
  priorCompletedWork: number;
}

interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  unit: MaterialUnit;
  openingStock: number;
  purchaseRate: number;
  supplier: string;
  date: string;
  projectId: string;
  minStock: number;
}

interface MaterialMovement {
  id: string;
  materialId: string;
  type: MovementType;
  quantity: number;
  projectId: string;
  date: string;
  note: string;
}

interface Transaction {
  id: string;
  workerId: string;
  projectId: string;
  date: string;
  type: TransactionType;
  amount: number;
  mode: PaymentMode;
  direction: TransactionDirection;
  notes: string;
}

interface Expense {
  id: string;
  date: string;
  /** Empty string means head office / not linked to a site. */
  projectId: string;
  category: ExpenseCategory;
  vendor: string;
  description: string;
  amount: number;
  mode: PaymentMode;
  referenceNo: string;
  notes: string;
}

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  section: SectionKey;
  createdAt: number;
  read: boolean;
}

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  timestamp: number;
}

interface AppSettings {
  companyName: string;
  ownerName: string;
  city: string;
  standardHours: number;
  overtimeMultiplier: number;
  lowStockAlerts: boolean;
  persistData: boolean;
}

interface AppData {
  version: number;
  settings: AppSettings;
  workers: Worker[];
  projects: Project[];
  attendance: AttendanceRecord[];
  workEntries: WorkEntry[];
  materials: Material[];
  movements: MaterialMovement[];
  transactions: Transaction[];
  expenses: Expense[];
  notifications: AppNotification[];
  activities: ActivityItem[];
}

interface WorkerMetrics {
  workerId: string;
  markedDays: number;
  presentDays: number;
  halfDays: number;
  absentDays: number;
  leaveDays: number;
  effectiveDays: number;
  overtimeHours: number;
  attendanceRate: number;
  attendanceWages: number;
  wageCredits: number;
  allowances: number;
  reimbursements: number;
  bonuses: number;
  expenseClaims: number;
  otherCredits: number;
  payments: number;
  advances: number;
  deductions: number;
  otherDebits: number;
  totalEarning: number;
  totalDebits: number;
  payable: number;
  workQuantity: number;
  primaryUnit: string;
  quantityByUnit: Record<string, number>;
  workEntryCount: number;
  workDays: number;
  productivity: number;
  lastAttendanceDate: string;
}

interface ProjectFinancials {
  projectId: string;
  labourCost: number;
  materialCost: number;
  otherCost: number;
  trackedCost: number;
  actualCost: number;
  profitLoss: number;
  profitMargin: number;
  remainingBudget: number;
  budgetUsage: number;
  labourBudgetUsage: number;
  materialBudgetUsage: number;
  otherBudgetUsage: number;
  completedWork: number;
  progress: number;
  costPerSqft: number;
  activeWorkers: number;
  isOverBudget: boolean;
}

interface MaterialStock {
  materialId: string;
  received: number;
  used: number;
  remaining: number;
  totalCost: number;
  stockValue: number;
  status: StockStatus;
}

interface CostEvent {
  date: string;
  projectId: string;
  kind: CostKind;
  source: CostSource;
  amount: number;
  workerId: string;
  label: string;
}

interface Analytics {
  workersById: Record<string, Worker>;
  projectsById: Record<string, Project>;
  materialsById: Record<string, Material>;
  workerMetrics: Record<string, WorkerMetrics>;
  projectFinancials: Record<string, ProjectFinancials>;
  materialStock: Record<string, MaterialStock>;
  costEvents: CostEvent[];
}

interface AttendanceSummary {
  present: number;
  absent: number;
  halfDay: number;
  leave: number;
  total: number;
  rate: number;
}

interface DateRangeBounds {
  start: string;
  end: string;
  previousStart: string;
  previousEnd: string;
  days: number;
  label: string;
}

interface CostTrendPoint {
  key: string;
  label: string;
  labour: number;
  material: number;
  other: number;
  total: number;
}

type CsvValue = string | number | boolean | null | undefined;

/* ========================================================= */
/* Constants                                                 */
/* ========================================================= */

const DATA_VERSION = 1;
const STORAGE_KEY = 'nirmaan-erp-data';

const TRADES: readonly Trade[] = [
  'Mason',
  'Helper',
  'Carpenter',
  'Electrician',
  'Plumber',
  'Painter',
  'Supervisor',
  'Tile Worker',
  'Other',
];

const ATTENDANCE_STATUSES: readonly AttendanceStatus[] = ['Present', 'Absent', 'Half Day', 'Leave'];
const WORK_UNITS: readonly WorkUnit[] = ['sq.ft.', 'running ft.', 'cubic ft.', 'nos.', 'kg', 'day', 'custom'];

const TRANSACTION_TYPES: readonly TransactionType[] = [
  'Salary/Wage',
  'Daily Allowance',
  'Advance',
  'Payment',
  'Reimbursement',
  'Expense',
  'Bonus',
  'Deduction',
  'Other',
];

const PAYMENT_MODES: readonly PaymentMode[] = ['Cash', 'UPI', 'Bank Transfer', 'Cheque'];
const PROJECT_STAGES: readonly ProjectStage[] = ['Enquiry', 'Coming Soon', 'Running', 'Completed'];

const MATERIAL_CATEGORIES: readonly MaterialCategory[] = [
  'Cement',
  'Sand',
  'Steel',
  'Bricks',
  'Tiles',
  'Paint',
  'Electrical',
  'Plumbing',
  'Hardware',
  'Other',
];

const MATERIAL_UNITS: readonly MaterialUnit[] = [
  'bag',
  'kg',
  'ton',
  'cubic ft.',
  'nos.',
  'box',
  'litre',
  'running ft.',
  'coil',
  'sq.ft.',
];

const STOCK_STATUSES: readonly StockStatus[] = ['In Stock', 'Low Stock', 'Out of Stock'];

const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'Labour',
  'Material',
  'Transport',
  'Machinery',
  'Food',
  'Accommodation',
  'Fuel',
  'Site Expense',
  'Office',
  'Other',
];

const TIME_RANGES: readonly TimeRange[] = ['daily', 'weekly', 'monthly'];

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

/**
 * Credit = increases what the company owes the person.
 * Debit  = reduces what the company owes the person.
 * Expense and Other can be flipped by the user in the transaction form.
 */
const TRANSACTION_DEFAULT_DIRECTION: Record<TransactionType, TransactionDirection> = {
  'Salary/Wage': 'credit',
  'Daily Allowance': 'credit',
  Advance: 'debit',
  Payment: 'debit',
  Reimbursement: 'credit',
  Expense: 'credit',
  Bonus: 'credit',
  Deduction: 'debit',
  Other: 'credit',
};

const FLEXIBLE_DIRECTION_TYPES: ReadonlySet<TransactionType> = new Set<TransactionType>(['Expense', 'Other']);

/** Ledger credits that represent labour cost for the linked project. */
const LABOUR_COST_TRANSACTION_TYPES: ReadonlySet<TransactionType> = new Set<TransactionType>([
  'Salary/Wage',
  'Daily Allowance',
  'Bonus',
]);

const EXPENSE_CATEGORY_KIND: Record<ExpenseCategory, CostKind> = {
  Labour: 'labour',
  Material: 'material',
  Transport: 'other',
  Machinery: 'other',
  Food: 'other',
  Accommodation: 'other',
  Fuel: 'other',
  'Site Expense': 'other',
  Office: 'other',
  Other: 'other',
};

const ATTENDANCE_FACTOR: Record<AttendanceStatus, number> = {
  Present: 1,
  'Half Day': 0.5,
  Absent: 0,
  Leave: 0,
};

const NAV_ITEMS: ReadonlyArray<{ key: SectionKey; label: string; icon: LucideIcon }> = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'labour', label: 'Labour', icon: HardHat },
  { key: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { key: 'work', label: 'Work Entries', icon: ClipboardList },
  { key: 'khata', label: 'Khata Book', icon: BookOpen },
  { key: 'projects', label: 'Projects', icon: Building2 },
  { key: 'materials', label: 'Materials', icon: Package },
  { key: 'expenses', label: 'Expenses', icon: Receipt },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const SECTION_META: Record<SectionKey, { title: string; subtitle: string; addLabel: string | null }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Sites, labour, costs and cash position at a glance',
    addLabel: 'Add Expense',
  },
  labour: { title: 'Labour', subtitle: 'Workers, wages, advances and assignments', addLabel: 'Add Worker' },
  attendance: { title: 'Attendance', subtitle: 'Mark daily site attendance and overtime', addLabel: 'Mark All Present' },
  work: { title: 'Work Entries', subtitle: 'Measured work and worker productivity', addLabel: 'Add Work Entry' },
  khata: { title: 'Khata Book', subtitle: 'Person-wise ledger with running balances', addLabel: 'Add Transaction' },
  projects: { title: 'Projects', subtitle: 'Enquiries, running sites and project profitability', addLabel: 'Add Project' },
  materials: { title: 'Materials', subtitle: 'Stock, receipts, consumption and suppliers', addLabel: 'Add Material' },
  expenses: { title: 'Expenses', subtitle: 'Every rupee spent across sites and office', addLabel: 'Add Expense' },
  reports: { title: 'Reports', subtitle: 'Filter, analyse, export and print business reports', addLabel: null },
  settings: { title: 'Settings', subtitle: 'Company profile, wage rules and data', addLabel: null },
};

const REPORT_DEFINITIONS: ReadonlyArray<{ key: ReportType; title: string; description: string; icon: LucideIcon }> = [
  { key: 'labour', title: 'Labour Report', description: 'Attendance, work and salary', icon: HardHat },
  { key: 'productivity', title: 'Worker Productivity', description: 'Worker-wise work per day', icon: Gauge },
  { key: 'site', title: 'Site Report', description: 'Project work and expenses', icon: Building2 },
  { key: 'daily-expense', title: 'Daily Expense', description: 'Day-by-day expense detail', icon: Receipt },
  { key: 'weekly-expense', title: 'Weekly Expense', description: 'Week-wise comparison', icon: Calendar },
  { key: 'monthly-expense', title: 'Monthly Expense', description: 'Month-wise analysis', icon: BarChart3 },
  { key: 'material', title: 'Material Report', description: 'Received, used and remaining', icon: Boxes },
  { key: 'salary', title: 'Salary Report', description: 'Paid and payable wages', icon: Wallet },
  { key: 'khata', title: 'Khata Report', description: 'Person-wise transactions', icon: BookOpen },
  { key: 'project-cost', title: 'Project Cost', description: 'Estimated vs actual cost', icon: Layers },
  { key: 'profit-loss', title: 'Project Profit/Loss', description: 'Project value vs total cost', icon: TrendingUp },
  { key: 'attendance', title: 'Attendance Report', description: 'Present and absent by worker', icon: CalendarCheck },
  { key: 'work', title: 'Work Report', description: 'Work done by worker and site', icon: Hammer },
];

const ATTENDANCE_STYLES: Record<AttendanceStatus, { pill: string; active: string; dot: string; color: string }> = {
  Present: {
    pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    active: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
    dot: 'bg-emerald-500',
    color: '#10b981',
  },
  Absent: {
    pill: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    active: 'bg-rose-600 text-white border-rose-600 shadow-sm',
    dot: 'bg-rose-500',
    color: '#f43f5e',
  },
  'Half Day': {
    pill: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    active: 'bg-amber-500 text-white border-amber-500 shadow-sm',
    dot: 'bg-amber-500',
    color: '#f59e0b',
  },
  Leave: {
    pill: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    active: 'bg-violet-600 text-white border-violet-600 shadow-sm',
    dot: 'bg-violet-500',
    color: '#8b5cf6',
  },
};

const STAGE_STYLES: Record<ProjectStage, { pill: string; dot: string }> = {
  Enquiry: { pill: 'bg-sky-50 text-sky-700 ring-sky-600/20', dot: 'bg-sky-500' },
  'Coming Soon': { pill: 'bg-violet-50 text-violet-700 ring-violet-600/20', dot: 'bg-violet-500' },
  Running: { pill: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20', dot: 'bg-indigo-500' },
  Completed: { pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
};

const STOCK_STYLES: Record<StockStatus, { pill: string; dot: string; bar: string }> = {
  'In Stock': { pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500', bar: 'bg-emerald-500' },
  'Low Stock': { pill: 'bg-amber-50 text-amber-700 ring-amber-600/20', dot: 'bg-amber-500', bar: 'bg-amber-500' },
  'Out of Stock': { pill: 'bg-rose-50 text-rose-700 ring-rose-600/20', dot: 'bg-rose-500', bar: 'bg-rose-500' },
};

const WORKER_STATUS_STYLES: Record<WorkerStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Inactive: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

const CHART_COLORS = {
  labour: '#6366f1',
  material: '#f59e0b',
  other: '#0ea5e9',
  estimated: '#cbd5e1',
  actual: '#6366f1',
  value: '#10b981',
  grid: '#eef2f6',
  axis: '#94a3b8',
  loss: '#f43f5e',
} as const;

const AVATAR_TONES: readonly string[] = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-800',
  'bg-sky-100 text-sky-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-800',
];

const DEFAULT_SETTINGS: AppSettings = {
  companyName: 'Rathore Infra Projects',
  ownerName: 'Mahendra Rathore',
  city: 'Jaipur, Rajasthan',
  standardHours: 8,
  overtimeMultiplier: 1.5,
  lowStockAlerts: true,
  persistData: true,
};

/* ========================================================= */
/* Helpers                                                   */
/* ========================================================= */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const shortDateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' });
const weekdayFormatter = new Intl.DateTimeFormat('en-IN', { weekday: 'short' });
const monthFormatter = new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit' });

function formatINR(value: number): string {
  return inrFormatter.format(Number.isFinite(value) ? Math.round(value) : 0);
}

function formatINRCompact(value: number): string {
  if (!Number.isFinite(value)) return '₹0';
  const sign = value < 0 ? '-' : '';
  const absolute = Math.abs(value);
  if (absolute >= 1_00_00_000) return `${sign}₹${trimDecimals(absolute / 1_00_00_000)} Cr`;
  if (absolute >= 1_00_000) return `${sign}₹${trimDecimals(absolute / 1_00_000)} L`;
  if (absolute >= 1_000) return `${sign}₹${trimDecimals(absolute / 1_000)}K`;
  return formatINR(value);
}

function trimDecimals(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, '');
}

function formatNumber(value: number): string {
  return numberFormatter.format(Number.isFinite(value) ? value : 0);
}

function formatPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(digits).replace(/\.0+$/, '')}%`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function safeDivide(numerator: number, denominator: number, fallback = 0): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return fallback;
  return numerator / denominator;
}

function roundTo(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function sumBy<T>(items: readonly T[], selector: (item: T) => number): number {
  let total = 0;
  for (const item of items) {
    const value = selector(item);
    if (Number.isFinite(value)) total += value;
  }
  return total;
}

function indexById<T extends { id: string }>(items: readonly T[]): Record<string, T> {
  const index: Record<string, T> = {};
  for (const item of items) index[item.id] = item;
  return index;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) ?? '' : '';
  return `${first}${last}`.toUpperCase();
}

function getAvatarTone(id: string): string {
  return AVATAR_TONES[hashString(id) % AVATAR_TONES.length] ?? AVATAR_TONES[0] ?? '';
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generates readable sequential IDs such as WRK-013 based on the highest existing suffix. */
function createId(prefix: string, existing: ReadonlyArray<{ id: string }>, padLength = 3): string {
  let max = 0;
  const marker = `${prefix}-`;
  for (const item of existing) {
    if (!item.id.startsWith(marker)) continue;
    const numeric = Number.parseInt(item.id.slice(marker.length), 10);
    if (Number.isFinite(numeric) && numeric > max) max = numeric;
  }
  return `${marker}${String(max + 1).padStart(padLength, '0')}`;
}

/* ---------------- Dates (local ISO yyyy-mm-dd) ---------------- */

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parseISODate(value);
  return toISODate(date) === value;
}

function parseISODate(iso: string): Date {
  const [year = 1970, month = 1, day = 1] = iso.split('-').map((part) => Number.parseInt(part, 10));
  if ([year, month, day].some((part) => Number.isNaN(part))) return new Date(1970, 0, 1);
  return new Date(year, month - 1, day);
}

function addDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

function diffInDays(fromISO: string, toISO: string): number {
  const from = parseISODate(fromISO).getTime();
  const to = parseISODate(toISO).getTime();
  return Math.round((to - from) / 86_400_000);
}

function isDateInRange(iso: string, start: string, end: string): boolean {
  return iso >= start && iso <= end;
}

function startOfWeekISO(iso: string): string {
  const date = parseISODate(iso);
  const mondayOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - mondayOffset);
  return toISODate(date);
}

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

function formatDate(iso: string): string {
  if (!iso || !isValidISODate(iso)) return '—';
  return dateFormatter.format(parseISODate(iso));
}

function formatDateShort(iso: string): string {
  if (!iso || !isValidISODate(iso)) return '—';
  return shortDateFormatter.format(parseISODate(iso));
}

function formatWeekday(iso: string): string {
  if (!iso || !isValidISODate(iso)) return '';
  return weekdayFormatter.format(parseISODate(iso));
}

function formatMonthLabel(key: string): string {
  const [year = 1970, month = 1] = key.split('-').map((part) => Number.parseInt(part, 10));
  return monthFormatter.format(new Date(year, month - 1, 1));
}

function formatRelativeTime(timestamp: number, now: number): string {
  const seconds = Math.max(0, Math.round((now - timestamp) / 1000));
  if (seconds < 60) return 'Just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return formatDate(toISODate(new Date(timestamp)));
}

function getRangeBounds(range: TimeRange, today: string): DateRangeBounds {
  const days = range === 'daily' ? 1 : range === 'weekly' ? 7 : 30;
  const end = today;
  const start = addDays(today, -(days - 1));
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(days - 1));
  const label = range === 'daily' ? 'Today' : range === 'weekly' ? 'Last 7 days' : 'Last 30 days';
  return { start, end, previousStart, previousEnd, days, label };
}

function listDates(start: string, end: string): string[] {
  const dates: string[] = [];
  const span = diffInDays(start, end);
  if (span < 0 || span > 400) return dates;
  for (let i = 0; i <= span; i += 1) dates.push(addDays(start, i));
  return dates;
}

/* ---------------- Validation & sanitisation ---------------- */

/** Strips control characters and collapses whitespace. React escapes output, this keeps stored data clean. */
function sanitizeText(value: string, maxLength = 160): string {
  let cleaned = '';
  for (const char of value) {
    const code = char.charCodeAt(0);
    cleaned += code < 32 || code === 127 ? ' ' : char;
  }
  return cleaned.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function sanitizeMultiline(value: string, maxLength = 600): string {
  let cleaned = '';
  for (const char of value) {
    const code = char.charCodeAt(0);
    const allowed = code === 10 || (code >= 32 && code !== 127);
    cleaned += allowed ? char : ' ';
  }
  return cleaned.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, maxLength);
}

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

function isValidIndianPhone(value: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizePhone(value));
}

function formatPhone(value: string): string {
  const digits = normalizePhone(value);
  return digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : value;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function parsePositiveNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseNonNegativeNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function getWorkUnitLabel(unit: WorkUnit, customUnit: string): string {
  return unit === 'custom' ? customUnit.trim() || 'units' : unit;
}

function getStockStatus(remaining: number, minStock: number): StockStatus {
  if (remaining <= 0) return 'Out of Stock';
  if (remaining <= minStock) return 'Low Stock';
  return 'In Stock';
}

/* ---------------- CSV export ---------------- */

/** Escapes CSV cells and neutralises spreadsheet formula injection for text values. */
function toCsvCell(value: CsvValue): string {
  if (value === null || value === undefined) return '';
  let text = String(value);
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  if (/[",\n\r]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

function buildExportFilename(base: string, today: string): string {
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${slug || 'export'}-${today}.csv`;
}

function downloadCsv(filename: string, headers: readonly string[], rows: ReadonlyArray<readonly CsvValue[]>): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const lines = [headers.map(toCsvCell).join(','), ...rows.map((row) => row.map(toCsvCell).join(','))];
    const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* ========================================================= */
/* Calculation Engine                                        */
/* ========================================================= */

function calculateAttendanceWage(record: AttendanceRecord, dailyWage: number, settings: AppSettings): number {
  const factor = ATTENDANCE_FACTOR[record.status];
  if (factor === 0 || dailyWage <= 0) return 0;
  const hourlyRate = safeDivide(dailyWage, settings.standardHours);
  const overtimePay = Math.max(0, record.overtimeHours) * hourlyRate * settings.overtimeMultiplier;
  return Math.round(dailyWage * factor + overtimePay);
}

function getAttendanceSummary(records: readonly AttendanceRecord[]): AttendanceSummary {
  const summary: AttendanceSummary = { present: 0, absent: 0, halfDay: 0, leave: 0, total: records.length, rate: 0 };
  for (const record of records) {
    if (record.status === 'Present') summary.present += 1;
    else if (record.status === 'Absent') summary.absent += 1;
    else if (record.status === 'Half Day') summary.halfDay += 1;
    else summary.leave += 1;
  }
  summary.rate = safeDivide(summary.present + summary.halfDay * 0.5, summary.total) * 100;
  return summary;
}

/**
 * Every rupee of project cost becomes a dated event, so project totals,
 * time-range dashboards and trend charts all come from one source.
 * Worker payments/advances are settlements of liabilities, not new costs.
 */
function buildCostEvents(
  data: AppData,
  workersById: Record<string, Worker>,
  materialsById: Record<string, Material>,
): CostEvent[] {
  const events: CostEvent[] = [];

  for (const record of data.attendance) {
    const worker = workersById[record.workerId];
    if (!worker) continue;
    const amount = calculateAttendanceWage(record, worker.dailyWage, data.settings);
    if (amount <= 0) continue;
    events.push({
      date: record.date,
      projectId: record.projectId,
      kind: 'labour',
      source: 'attendance',
      amount,
      workerId: worker.id,
      label: `${worker.name} – ${record.status}`,
    });
  }

  for (const transaction of data.transactions) {
    if (transaction.direction !== 'credit' || !LABOUR_COST_TRANSACTION_TYPES.has(transaction.type)) continue;
    events.push({
      date: transaction.date,
      projectId: transaction.projectId,
      kind: 'labour',
      source: 'ledger',
      amount: transaction.amount,
      workerId: transaction.workerId,
      label: transaction.type,
    });
  }

  for (const movement of data.movements) {
    if (movement.type !== 'Receive') continue;
    const material = materialsById[movement.materialId];
    if (!material) continue;
    events.push({
      date: movement.date,
      projectId: movement.projectId,
      kind: 'material',
      source: 'material',
      amount: Math.round(movement.quantity * material.purchaseRate),
      workerId: '',
      label: material.name,
    });
  }

  for (const expense of data.expenses) {
    events.push({
      date: expense.date,
      projectId: expense.projectId,
      kind: EXPENSE_CATEGORY_KIND[expense.category],
      source: 'expense',
      amount: expense.amount,
      workerId: '',
      label: expense.category,
    });
  }

  return events;
}

function createEmptyWorkerMetrics(workerId: string): WorkerMetrics {
  return {
    workerId,
    markedDays: 0,
    presentDays: 0,
    halfDays: 0,
    absentDays: 0,
    leaveDays: 0,
    effectiveDays: 0,
    overtimeHours: 0,
    attendanceRate: 0,
    attendanceWages: 0,
    wageCredits: 0,
    allowances: 0,
    reimbursements: 0,
    bonuses: 0,
    expenseClaims: 0,
    otherCredits: 0,
    payments: 0,
    advances: 0,
    deductions: 0,
    otherDebits: 0,
    totalEarning: 0,
    totalDebits: 0,
    payable: 0,
    workQuantity: 0,
    primaryUnit: '—',
    quantityByUnit: {},
    workEntryCount: 0,
    workDays: 0,
    productivity: 0,
    lastAttendanceDate: '',
  };
}

function computeAnalytics(data: AppData): Analytics {
  const workersById = indexById(data.workers);
  const projectsById = indexById(data.projects);
  const materialsById = indexById(data.materials);
  const costEvents = buildCostEvents(data, workersById, materialsById);

  /* ---- Worker attendance & wages ---- */
  const workerMetrics: Record<string, WorkerMetrics> = {};
  for (const worker of data.workers) workerMetrics[worker.id] = createEmptyWorkerMetrics(worker.id);

  const attendanceFactorByWorkerDate = new Map<string, number>();

  for (const record of data.attendance) {
    const metrics = workerMetrics[record.workerId];
    const worker = workersById[record.workerId];
    if (!metrics || !worker) continue;
    metrics.markedDays += 1;
    if (record.status === 'Present') metrics.presentDays += 1;
    else if (record.status === 'Half Day') metrics.halfDays += 1;
    else if (record.status === 'Absent') metrics.absentDays += 1;
    else metrics.leaveDays += 1;
    if (ATTENDANCE_FACTOR[record.status] > 0) metrics.overtimeHours += Math.max(0, record.overtimeHours);
    metrics.attendanceWages += calculateAttendanceWage(record, worker.dailyWage, data.settings);
    if (record.date > metrics.lastAttendanceDate) metrics.lastAttendanceDate = record.date;
    const key = `${record.workerId}|${record.date}`;
    attendanceFactorByWorkerDate.set(
      key,
      Math.max(attendanceFactorByWorkerDate.get(key) ?? 0, ATTENDANCE_FACTOR[record.status]),
    );
  }

  /* ---- Ledger ---- */
  for (const transaction of data.transactions) {
    const metrics = workerMetrics[transaction.workerId];
    if (!metrics) continue;
    const amount = Math.max(0, transaction.amount);
    if (transaction.direction === 'credit') {
      switch (transaction.type) {
        case 'Salary/Wage':
          metrics.wageCredits += amount;
          break;
        case 'Daily Allowance':
          metrics.allowances += amount;
          break;
        case 'Reimbursement':
          metrics.reimbursements += amount;
          break;
        case 'Bonus':
          metrics.bonuses += amount;
          break;
        case 'Expense':
          metrics.expenseClaims += amount;
          break;
        default:
          metrics.otherCredits += amount;
      }
    } else {
      switch (transaction.type) {
        case 'Payment':
          metrics.payments += amount;
          break;
        case 'Advance':
          metrics.advances += amount;
          break;
        case 'Deduction':
          metrics.deductions += amount;
          break;
        default:
          metrics.otherDebits += amount;
      }
    }
  }

  /* ---- Work & productivity ---- */
  const workDatesByWorker = new Map<string, Set<string>>();
  for (const entry of data.workEntries) {
    const metrics = workerMetrics[entry.workerId];
    if (!metrics) continue;
    const unitLabel = getWorkUnitLabel(entry.unit, entry.customUnit);
    metrics.quantityByUnit[unitLabel] = (metrics.quantityByUnit[unitLabel] ?? 0) + entry.quantity;
    metrics.workEntryCount += 1;
    const dates = workDatesByWorker.get(entry.workerId) ?? new Set<string>();
    dates.add(entry.date);
    workDatesByWorker.set(entry.workerId, dates);
  }

  for (const metrics of Object.values(workerMetrics)) {
    metrics.effectiveDays = metrics.presentDays + metrics.halfDays * 0.5;
    metrics.attendanceRate = safeDivide(metrics.effectiveDays, metrics.markedDays) * 100;
    metrics.totalEarning =
      metrics.attendanceWages +
      metrics.wageCredits +
      metrics.allowances +
      metrics.reimbursements +
      metrics.bonuses +
      metrics.expenseClaims +
      metrics.otherCredits;
    metrics.totalDebits = metrics.payments + metrics.advances + metrics.deductions + metrics.otherDebits;
    metrics.payable = metrics.totalEarning - metrics.totalDebits;

    // Productivity uses the unit the worker records most (excluding "day" entries).
    const measurableUnits = Object.entries(metrics.quantityByUnit).filter(([unit]) => unit !== 'day');
    if (measurableUnits.length > 0) {
      measurableUnits.sort((a, b) => b[1] - a[1]);
      const [unit, quantity] = measurableUnits[0] ?? ['—', 0];
      metrics.primaryUnit = unit;
      metrics.workQuantity = quantity;
    } else if (metrics.quantityByUnit.day) {
      metrics.primaryUnit = 'day';
      metrics.workQuantity = metrics.quantityByUnit.day;
    }

    // Effective working days = attendance factor on dates with measured work (1 if unmarked).
    const dates = workDatesByWorker.get(metrics.workerId);
    let workDays = 0;
    if (dates) {
      for (const date of dates) {
        const factor = attendanceFactorByWorkerDate.get(`${metrics.workerId}|${date}`);
        workDays += factor && factor > 0 ? factor : 1;
      }
    }
    metrics.workDays = workDays;
    metrics.productivity = metrics.primaryUnit === 'day' ? 0 : roundTo(safeDivide(metrics.workQuantity, workDays), 1);
  }

  /* ---- Projects ---- */
  const projectFinancials: Record<string, ProjectFinancials> = {};
  for (const project of data.projects) {
    projectFinancials[project.id] = {
      projectId: project.id,
      labourCost: project.priorLabourCost,
      materialCost: project.priorMaterialCost,
      otherCost: project.priorOtherCost,
      trackedCost: 0,
      actualCost: 0,
      profitLoss: 0,
      profitMargin: 0,
      remainingBudget: 0,
      budgetUsage: 0,
      labourBudgetUsage: 0,
      materialBudgetUsage: 0,
      otherBudgetUsage: 0,
      completedWork: project.priorCompletedWork,
      progress: 0,
      costPerSqft: 0,
      activeWorkers: 0,
      isOverBudget: false,
    };
  }

  for (const event of costEvents) {
    const financials = projectFinancials[event.projectId];
    if (!financials) continue;
    financials.trackedCost += event.amount;
    if (event.kind === 'labour') financials.labourCost += event.amount;
    else if (event.kind === 'material') financials.materialCost += event.amount;
    else financials.otherCost += event.amount;
  }

  for (const entry of data.workEntries) {
    const financials = projectFinancials[entry.projectId];
    if (financials && entry.unit === 'sq.ft.') financials.completedWork += entry.quantity;
  }

  for (const worker of data.workers) {
    const financials = projectFinancials[worker.projectId];
    if (financials && worker.status === 'Active') financials.activeWorkers += 1;
  }

  for (const project of data.projects) {
    const financials = projectFinancials[project.id];
    if (!financials) continue;
    financials.actualCost = financials.labourCost + financials.materialCost + financials.otherCost;
    financials.profitLoss = project.projectValue - financials.actualCost;
    financials.profitMargin = safeDivide(financials.profitLoss, project.projectValue) * 100;
    financials.remainingBudget = project.estimatedCost - financials.actualCost;
    financials.budgetUsage = safeDivide(financials.actualCost, project.estimatedCost) * 100;
    financials.labourBudgetUsage = safeDivide(financials.labourCost, project.labourBudget) * 100;
    financials.materialBudgetUsage = safeDivide(financials.materialCost, project.materialBudget) * 100;
    financials.otherBudgetUsage = safeDivide(financials.otherCost, project.otherBudget) * 100;
    financials.completedWork = Math.min(financials.completedWork, Math.max(project.workTarget, financials.completedWork));
    financials.progress =
      project.stage === 'Completed' ? 100 : clamp(safeDivide(financials.completedWork, project.workTarget) * 100, 0, 100);
    financials.costPerSqft = safeDivide(financials.actualCost, financials.completedWork);
    financials.isOverBudget = project.estimatedCost > 0 && financials.actualCost > project.estimatedCost;
  }

  /* ---- Materials ---- */
  const materialStock: Record<string, MaterialStock> = {};
  for (const material of data.materials) {
    materialStock[material.id] = {
      materialId: material.id,
      received: 0,
      used: 0,
      remaining: 0,
      totalCost: 0,
      stockValue: 0,
      status: 'In Stock',
    };
  }
  for (const movement of data.movements) {
    const stock = materialStock[movement.materialId];
    if (!stock) continue;
    if (movement.type === 'Receive') stock.received += movement.quantity;
    else stock.used += movement.quantity;
  }
  for (const material of data.materials) {
    const stock = materialStock[material.id];
    if (!stock) continue;
    stock.remaining = roundTo(material.openingStock + stock.received - stock.used, 2);
    stock.totalCost = Math.round(material.purchaseRate * stock.received);
    stock.stockValue = Math.round(Math.max(0, stock.remaining) * material.purchaseRate);
    stock.status = getStockStatus(stock.remaining, material.minStock);
  }

  return { workersById, projectsById, materialsById, workerMetrics, projectFinancials, materialStock, costEvents };
}

function sumCostEvents(
  events: readonly CostEvent[],
  start: string,
  end: string,
  projectId?: string,
): { labour: number; material: number; other: number; total: number } {
  const totals = { labour: 0, material: 0, other: 0, total: 0 };
  for (const event of events) {
    if (!isDateInRange(event.date, start, end)) continue;
    if (projectId && event.projectId !== projectId) continue;
    totals[event.kind] += event.amount;
    totals.total += event.amount;
  }
  return totals;
}

function buildDailyCostTrend(
  events: readonly CostEvent[],
  start: string,
  end: string,
  projectId?: string,
): CostTrendPoint[] {
  const points = new Map<string, CostTrendPoint>();
  for (const date of listDates(start, end)) {
    points.set(date, { key: date, label: formatDateShort(date), labour: 0, material: 0, other: 0, total: 0 });
  }
  for (const event of events) {
    if (projectId && event.projectId !== projectId) continue;
    const point = points.get(event.date);
    if (!point) continue;
    point[event.kind] += event.amount;
    point.total += event.amount;
  }
  return Array.from(points.values());
}

function buildMonthlyCostTrend(events: readonly CostEvent[], today: string, months = 6, projectId?: string): CostTrendPoint[] {
  const base = parseISODate(today);
  const points = new Map<string, CostTrendPoint>();
  for (let i = months - 1; i >= 0; i -= 1) {
    const key = monthKey(toISODate(new Date(base.getFullYear(), base.getMonth() - i, 1)));
    points.set(key, { key, label: formatMonthLabel(key), labour: 0, material: 0, other: 0, total: 0 });
  }
  for (const event of events) {
    if (projectId && event.projectId !== projectId) continue;
    const point = points.get(monthKey(event.date));
    if (!point) continue;
    point[event.kind] += event.amount;
    point.total += event.amount;
  }
  return Array.from(points.values());
}

function buildWeeklyCostTrend(events: readonly CostEvent[], today: string, weeks = 8, projectId?: string): CostTrendPoint[] {
  const currentWeekStart = startOfWeekISO(today);
  const points = new Map<string, CostTrendPoint>();
  for (let i = weeks - 1; i >= 0; i -= 1) {
    const key = addDays(currentWeekStart, -7 * i);
    points.set(key, { key, label: `Wk ${formatDateShort(key)}`, labour: 0, material: 0, other: 0, total: 0 });
  }
  for (const event of events) {
    if (projectId && event.projectId !== projectId) continue;
    const point = points.get(startOfWeekISO(event.date));
    if (!point) continue;
    point[event.kind] += event.amount;
    point.total += event.amount;
  }
  return Array.from(points.values());
}

/* ========================================================= */
/* Local Storage                                             */
/* ========================================================= */

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAppData(value: unknown): value is AppData {
  if (!isRecordObject(value)) return false;
  if (value.version !== DATA_VERSION || !isRecordObject(value.settings)) return false;
  const collections = [
    'workers',
    'projects',
    'attendance',
    'workEntries',
    'materials',
    'movements',
    'transactions',
    'expenses',
    'notifications',
    'activities',
  ] as const;
  return collections.every((key) => {
    const collection = value[key];
    return Array.isArray(collection) && collection.every((item) => isRecordObject(item) && typeof item.id === 'string');
  });
}

function loadStoredData(): AppData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isAppData(parsed)) return null;
    return { ...parsed, settings: { ...DEFAULT_SETTINGS, ...parsed.settings } };
  } catch {
    return null;
  }
}

function persistAppData(data: AppData): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

function clearStoredData(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private browsing; nothing else to clean up.
  }
}

/* ========================================================= */
/* Dummy Data                                                */
/* ========================================================= */

type WorkEntrySeed = [dayOffset: number, workerId: string, task: string, quantity: number, unit: WorkUnit];

type TransactionSeed = [
  dayOffset: number,
  workerId: string,
  type: TransactionType,
  amount: number,
  mode: PaymentMode,
  notes: string,
];

type ExpenseSeed = [
  dayOffset: number,
  projectId: string,
  category: ExpenseCategory,
  vendor: string,
  description: string,
  amount: number,
  mode: PaymentMode,
  referenceNo: string,
];

interface MaterialSeed {
  material: Omit<Material, 'date'> & { dateOffset: number };
  receives: Array<[dayOffset: number, quantity: number]>;
  uses: Array<[dayOffset: number, quantity: number]>;
}

function createSeedData(today: string, now: number): AppData {
  const day = (offset: number): string => addDays(today, offset);

  const projects: Project[] = [
    {
      id: 'PRJ-001',
      name: 'Green Residency',
      stage: 'Running',
      location: 'Jaipur',
      address: 'Plot 14, Sector 9, Vaishali Nagar, Jaipur, Rajasthan 302021',
      clientName: 'Anil Agarwal',
      clientPhone: '9829012345',
      clientEmail: 'anil.agarwal@gmail.com',
      referenceSource: 'Architect referral',
      engineerName: 'Er. Sandeep Joshi',
      architectName: 'Ar. Neha Mathur',
      startDate: day(-240),
      expectedCompletion: day(165),
      projectValue: 42000000,
      estimatedCost: 34000000,
      labourBudget: 9500000,
      materialBudget: 21000000,
      otherBudget: 3500000,
      priorLabourCost: 5200000,
      priorMaterialCost: 11800000,
      priorOtherCost: 1600000,
      workTarget: 48000,
      priorCompletedWork: 26500,
    },
    {
      id: 'PRJ-002',
      name: 'Skyline Heights',
      stage: 'Running',
      location: 'Jodhpur',
      address: 'Survey No. 112, Pal Road, Jodhpur, Rajasthan 342008',
      clientName: 'Mehta Buildcon Pvt. Ltd.',
      clientPhone: '9414056789',
      clientEmail: 'projects@mehtabuildcon.in',
      referenceSource: 'Tender',
      engineerName: 'Er. Rohit Bhandari',
      architectName: 'Ar. Kavya Singhvi',
      startDate: day(-150),
      expectedCompletion: day(420),
      projectValue: 68000000,
      estimatedCost: 56000000,
      labourBudget: 15000000,
      materialBudget: 34000000,
      otherBudget: 7000000,
      priorLabourCost: 4800000,
      priorMaterialCost: 14200000,
      priorOtherCost: 1800000,
      workTarget: 72000,
      priorCompletedWork: 21000,
    },
    {
      id: 'PRJ-003',
      name: 'Metro Plaza Renovation',
      stage: 'Running',
      location: 'Ahmedabad',
      address: '2nd Floor, Metro Plaza, CG Road, Navrangpura, Ahmedabad, Gujarat 380009',
      clientName: 'Patel Retail Holdings',
      clientPhone: '9825034567',
      clientEmail: 'facility@patelretail.com',
      referenceSource: 'Existing client',
      engineerName: 'Er. Harsh Desai',
      architectName: 'Ar. Priya Shah',
      startDate: day(-190),
      expectedCompletion: day(18),
      projectValue: 13500000,
      estimatedCost: 10800000,
      labourBudget: 3400000,
      materialBudget: 6200000,
      otherBudget: 1200000,
      priorLabourCost: 3450000,
      priorMaterialCost: 5900000,
      priorOtherCost: 1180000,
      workTarget: 18000,
      priorCompletedWork: 15900,
    },
    {
      id: 'PRJ-004',
      name: 'Sharma Villa',
      stage: 'Completed',
      location: 'Udaipur',
      address: 'Plot 7, Fatehpura, Udaipur, Rajasthan 313004',
      clientName: 'Dr. Rajendra Sharma',
      clientPhone: '9460078901',
      clientEmail: 'dr.rsharma@yahoo.co.in',
      referenceSource: 'Website enquiry',
      engineerName: 'Er. Sandeep Joshi',
      architectName: 'Ar. Neha Mathur',
      startDate: day(-420),
      expectedCompletion: day(-35),
      projectValue: 7800000,
      estimatedCost: 6200000,
      labourBudget: 1800000,
      materialBudget: 3800000,
      otherBudget: 600000,
      priorLabourCost: 1650000,
      priorMaterialCost: 3820000,
      priorOtherCost: 520000,
      workTarget: 4200,
      priorCompletedWork: 4200,
    },
    {
      id: 'PRJ-005',
      name: 'Sunrise Apartments',
      stage: 'Coming Soon',
      location: 'Pune',
      address: 'S. No. 45/2, Baner-Pashan Link Road, Baner, Pune, Maharashtra 411045',
      clientName: 'Sunrise Developers LLP',
      clientPhone: '9822045678',
      clientEmail: 'info@sunrisedevelopers.co.in',
      referenceSource: 'Broker – Kulkarni Associates',
      engineerName: 'Er. Amit Kulkarni',
      architectName: 'Ar. Rhea Deshpande',
      startDate: day(21),
      expectedCompletion: day(560),
      projectValue: 31000000,
      estimatedCost: 25500000,
      labourBudget: 7000000,
      materialBudget: 15500000,
      otherBudget: 3000000,
      priorLabourCost: 0,
      priorMaterialCost: 0,
      priorOtherCost: 0,
      workTarget: 36000,
      priorCompletedWork: 0,
    },
    {
      id: 'PRJ-006',
      name: 'Lotus Commercial Complex',
      stage: 'Enquiry',
      location: 'Indore',
      address: 'Plot 22, Scheme No. 54, Vijay Nagar, Indore, Madhya Pradesh 452010',
      clientName: 'Lotus Hospitality Group',
      clientPhone: '9893067890',
      clientEmail: 'vp.projects@lotushospitality.in',
      referenceSource: 'LinkedIn',
      engineerName: 'Er. Vivek Tiwari',
      architectName: 'Ar. Sameer Jain',
      startDate: day(90),
      expectedCompletion: day(730),
      projectValue: 95000000,
      estimatedCost: 78000000,
      labourBudget: 19000000,
      materialBudget: 47000000,
      otherBudget: 12000000,
      priorLabourCost: 0,
      priorMaterialCost: 0,
      priorOtherCost: 0,
      workTarget: 110000,
      priorCompletedWork: 0,
    },
  ];

  const workers: Worker[] = [
    { id: 'WRK-001', name: 'Ramesh Kumar', phone: '9784512360', trade: 'Tile Worker', projectId: 'PRJ-001', joiningDate: day(-410), dailyWage: 950, status: 'Active' },
    { id: 'WRK-002', name: 'Suresh Meena', phone: '9928134570', trade: 'Mason', projectId: 'PRJ-001', joiningDate: day(-380), dailyWage: 900, status: 'Active' },
    { id: 'WRK-003', name: 'Mahesh Choudhary', phone: '9460321875', trade: 'Helper', projectId: 'PRJ-001', joiningDate: day(-200), dailyWage: 550, status: 'Active' },
    { id: 'WRK-004', name: 'Vikram Singh Rathore', phone: '9829745610', trade: 'Supervisor', projectId: 'PRJ-001', joiningDate: day(-720), dailyWage: 1200, status: 'Active' },
    { id: 'WRK-005', name: 'Imran Khan', phone: '8003456721', trade: 'Electrician', projectId: 'PRJ-001', joiningDate: day(-260), dailyWage: 950, status: 'Active' },
    { id: 'WRK-006', name: 'Dinesh Prajapat', phone: '9414278903', trade: 'Carpenter', projectId: 'PRJ-002', joiningDate: day(-150), dailyWage: 850, status: 'Active' },
    { id: 'WRK-007', name: 'Rakesh Sharma', phone: '9772013468', trade: 'Electrician', projectId: 'PRJ-002', joiningDate: day(-140), dailyWage: 950, status: 'Active' },
    { id: 'WRK-008', name: 'Kailash Jat', phone: '9636507812', trade: 'Mason', projectId: 'PRJ-002', joiningDate: day(-145), dailyWage: 900, status: 'Active' },
    { id: 'WRK-009', name: 'Pappu Ram', phone: '7568290314', trade: 'Helper', projectId: 'PRJ-002', joiningDate: day(-90), dailyWage: 550, status: 'Active' },
    { id: 'WRK-010', name: 'Mohan Lal Suthar', phone: '9879034512', trade: 'Plumber', projectId: 'PRJ-003', joiningDate: day(-185), dailyWage: 900, status: 'Active' },
    { id: 'WRK-011', name: 'Bhagirath Bishnoi', phone: '9001283456', trade: 'Tile Worker', projectId: 'PRJ-003', joiningDate: day(-170), dailyWage: 950, status: 'Active' },
    { id: 'WRK-012', name: 'Arjun Solanki', phone: '9727865103', trade: 'Painter', projectId: 'PRJ-003', joiningDate: day(-120), dailyWage: 750, status: 'Inactive' },
  ];

  /* ---- Attendance: last 30 days, Sundays off (except today) ---- */
  const random = createSeededRandom(20260917);
  const attendance: AttendanceRecord[] = [];
  const unmarkedToday = new Set<string>(['WRK-010', 'WRK-011']);
  let attendanceCounter = 1;

  for (let offset = -29; offset <= 0; offset += 1) {
    const date = day(offset);
    if (parseISODate(date).getDay() === 0 && offset !== 0) continue;
    for (const worker of workers) {
      if (!worker.projectId) continue;
      if (worker.status === 'Inactive' && offset > -12) continue;
      if (offset === 0 && unmarkedToday.has(worker.id)) continue;
      const roll = random();
      const status: AttendanceStatus = roll < 0.8 ? 'Present' : roll < 0.88 ? 'Half Day' : roll < 0.95 ? 'Absent' : 'Leave';
      const overtimeHours = status === 'Present' && random() < 0.18 ? 1 + Math.floor(random() * 3) : 0;
      const notes =
        status === 'Leave'
          ? 'Informed leave'
          : status === 'Absent'
            ? 'Did not report to site'
            : overtimeHours > 0
              ? 'Overtime for slab casting'
              : '';
      attendance.push({
        id: `ATT-${String(attendanceCounter).padStart(4, '0')}`,
        date,
        projectId: worker.projectId,
        workerId: worker.id,
        status,
        overtimeHours,
        notes,
      });
      attendanceCounter += 1;
    }
  }

  /* ---- Work entries ---- */
  const workerProject = (workerId: string): string => workers.find((worker) => worker.id === workerId)?.projectId ?? '';

  const workSeeds: WorkEntrySeed[] = [
    [-24, 'WRK-001', 'Floor tile installation – Tower A, 3rd floor', 380, 'sq.ft.'],
    [-22, 'WRK-002', 'Internal wall plaster (12 mm)', 520, 'sq.ft.'],
    [-21, 'WRK-006', 'Slab shuttering – Block B', 640, 'sq.ft.'],
    [-20, 'WRK-007', 'Concealed conduit & wiring – Floor 2', 310, 'running ft.'],
    [-19, 'WRK-010', 'CPVC line fitting – toilets', 180, 'running ft.'],
    [-18, 'WRK-008', 'Brick masonry – 9 inch external wall', 165, 'cubic ft.'],
    [-17, 'WRK-011', 'Wall tile dado – food court', 290, 'sq.ft.'],
    [-16, 'WRK-012', 'Wall putty & primer – corridor', 850, 'sq.ft.'],
    [-15, 'WRK-001', 'Floor tile installation – Tower A, 4th floor', 420, 'sq.ft.'],
    [-14, 'WRK-005', 'DB & switchboard wiring – Tower A', 260, 'running ft.'],
    [-13, 'WRK-002', 'External plaster with waterproofing', 480, 'sq.ft.'],
    [-12, 'WRK-009', 'Material shifting & curing', 1, 'day'],
    [-11, 'WRK-006', 'Column box shuttering', 280, 'sq.ft.'],
    [-10, 'WRK-008', 'Brick masonry – partition walls', 190, 'cubic ft.'],
    [-9, 'WRK-011', 'Floor tile laying – retail units', 410, 'sq.ft.'],
    [-8, 'WRK-007', 'Cable tray installation', 140, 'running ft.'],
    [-7, 'WRK-001', 'Skirting & floor tiles – Tower A lobby', 360, 'sq.ft.'],
    [-6, 'WRK-003', 'Curing & scaffolding support', 1, 'day'],
    [-5, 'WRK-010', 'Drainage line – basement', 120, 'running ft.'],
    [-4, 'WRK-002', 'Ceiling plaster – Floor 5', 450, 'sq.ft.'],
    [-3, 'WRK-004', 'Site supervision – slab casting', 1, 'day'],
    [-3, 'WRK-011', 'Anti-skid tiles – washrooms', 240, 'sq.ft.'],
    [-2, 'WRK-008', 'Brick masonry – staircase wall', 120, 'cubic ft.'],
    [-1, 'WRK-006', 'Door frame fixing', 16, 'nos.'],
    [-1, 'WRK-001', 'Bathroom wall tiles – Flat 402', 210, 'sq.ft.'],
    [0, 'WRK-005', 'Earthing & point wiring', 180, 'running ft.'],
  ];

  const workEntries: WorkEntry[] = workSeeds.map(([offset, workerId, task, quantity, unit], index) => ({
    id: `WE-${String(index + 1).padStart(3, '0')}`,
    date: day(offset),
    workerId,
    projectId: workerProject(workerId),
    task,
    quantity,
    unit,
    customUnit: '',
    notes: '',
  }));

  /* ---- Materials & stock movements ---- */
  const materialSeeds: MaterialSeed[] = [
    {
      material: { id: 'MAT-001', name: 'OPC Cement 53 Grade', category: 'Cement', unit: 'bag', openingStock: 180, purchaseRate: 385, supplier: 'Shree Cement Depot', dateOffset: -6, projectId: 'PRJ-001', minStock: 150 },
      receives: [[-20, 400], [-6, 300]],
      uses: [[-18, 220], [-12, 260], [-4, 280], [-1, 90]],
    },
    {
      material: { id: 'MAT-002', name: 'River Sand (Zone II)', category: 'Sand', unit: 'cubic ft.', openingStock: 900, purchaseRate: 58, supplier: 'Marwar Sand Suppliers', dateOffset: -15, projectId: 'PRJ-001', minStock: 600 },
      receives: [[-15, 1200]],
      uses: [[-14, 450], [-7, 380]],
    },
    {
      material: { id: 'MAT-003', name: 'TMT Bar Fe550D 12 mm', category: 'Steel', unit: 'kg', openingStock: 2500, purchaseRate: 68, supplier: 'Kamdhenu Steel Traders', dateOffset: -10, projectId: 'PRJ-002', minStock: 1500 },
      receives: [[-10, 6000]],
      uses: [[-9, 2200], [-5, 2600], [-2, 1900]],
    },
    {
      material: { id: 'MAT-004', name: 'Red Clay Bricks (Class A)', category: 'Bricks', unit: 'nos.', openingStock: 8000, purchaseRate: 8.5, supplier: 'Jai Bhawani Brick Kiln', dateOffset: -11, projectId: 'PRJ-002', minStock: 5000 },
      receives: [[-11, 20000]],
      uses: [[-10, 6500], [-6, 7200], [-3, 6800]],
    },
    {
      material: { id: 'MAT-005', name: 'Vitrified Tiles 600×600 mm', category: 'Tiles', unit: 'box', openingStock: 60, purchaseRate: 640, supplier: 'Kajaria Galaxy Showroom', dateOffset: -9, projectId: 'PRJ-001', minStock: 40 },
      receives: [[-9, 180]],
      uses: [[-8, 55], [-4, 62], [-1, 58]],
    },
    {
      material: { id: 'MAT-006', name: 'Tile Adhesive C2TE', category: 'Tiles', unit: 'bag', openingStock: 20, purchaseRate: 520, supplier: 'Kajaria Galaxy Showroom', dateOffset: -9, projectId: 'PRJ-003', minStock: 25 },
      receives: [[-9, 60]],
      uses: [[-7, 30], [-3, 34], [-1, 16]],
    },
    {
      material: { id: 'MAT-007', name: 'Asian Paints Apex Exterior', category: 'Paint', unit: 'litre', openingStock: 40, purchaseRate: 310, supplier: 'Rang Mahal Paints', dateOffset: -13, projectId: 'PRJ-003', minStock: 50 },
      receives: [[-13, 120]],
      uses: [[-12, 45], [-6, 50], [-2, 28]],
    },
    {
      material: { id: 'MAT-008', name: 'FRLS Wire 2.5 sq mm (90 m)', category: 'Electrical', unit: 'coil', openingStock: 15, purchaseRate: 2350, supplier: 'Havells Power Point', dateOffset: -7, projectId: 'PRJ-002', minStock: 10 },
      receives: [[-7, 30]],
      uses: [[-6, 12], [-2, 9]],
    },
    {
      material: { id: 'MAT-009', name: 'CPVC Pipe 1 inch (SDR 11)', category: 'Plumbing', unit: 'running ft.', openingStock: 400, purchaseRate: 46, supplier: 'Ashirvad Pipes Distributor', dateOffset: -12, projectId: 'PRJ-003', minStock: 300 },
      receives: [[-12, 800]],
      uses: [[-10, 350], [-5, 320]],
    },
    {
      material: { id: 'MAT-010', name: 'Binding Wire 18 Gauge', category: 'Hardware', unit: 'kg', openingStock: 60, purchaseRate: 88, supplier: 'Rathi Hardware Mart', dateOffset: -10, projectId: 'PRJ-002', minStock: 50 },
      receives: [[-10, 150]],
      uses: [[-8, 70], [-4, 55]],
    },
    {
      material: { id: 'MAT-011', name: 'Wall Putty (40 kg)', category: 'Paint', unit: 'bag', openingStock: 25, purchaseRate: 820, supplier: 'Rang Mahal Paints', dateOffset: -14, projectId: 'PRJ-003', minStock: 20 },
      receives: [[-14, 50]],
      uses: [[-11, 22], [-5, 28], [-2, 9]],
    },
    {
      material: { id: 'MAT-012', name: 'Manufactured Sand (M-Sand)', category: 'Sand', unit: 'cubic ft.', openingStock: 600, purchaseRate: 48, supplier: 'Marwar Sand Suppliers', dateOffset: -5, projectId: 'PRJ-002', minStock: 800 },
      receives: [[-5, 1500]],
      uses: [[-4, 400], [-1, 350]],
    },
  ];

  const materials: Material[] = materialSeeds.map(({ material }) => {
    const { dateOffset, ...rest } = material;
    return { ...rest, date: day(dateOffset) };
  });

  const movements: MaterialMovement[] = [];
  for (const seed of materialSeeds) {
    for (const [offset, quantity] of seed.receives) {
      movements.push({
        id: '',
        materialId: seed.material.id,
        type: 'Receive',
        quantity,
        projectId: seed.material.projectId,
        date: day(offset),
        note: `Received from ${seed.material.supplier}`,
      });
    }
    for (const [offset, quantity] of seed.uses) {
      movements.push({
        id: '',
        materialId: seed.material.id,
        type: 'Use',
        quantity,
        projectId: seed.material.projectId,
        date: day(offset),
        note: 'Issued to site',
      });
    }
  }
  movements.sort((a, b) => a.date.localeCompare(b.date));
  movements.forEach((movement, index) => {
    movement.id = `MOV-${String(index + 1).padStart(3, '0')}`;
  });

  /* ---- Khata transactions ---- */
  const transactionSeeds: TransactionSeed[] = [
    [-27, 'WRK-001', 'Advance', 5000, 'Cash', 'Advance for family function'],
    [-25, 'WRK-002', 'Advance', 3000, 'UPI', 'Medical advance'],
    [-22, 'WRK-003', 'Daily Allowance', 1200, 'Cash', 'Travel allowance – 6 days'],
    [-21, 'WRK-006', 'Advance', 4000, 'Cash', 'Advance against wages'],
    [-20, 'WRK-004', 'Reimbursement', 1850, 'UPI', 'Site tools purchased by supervisor'],
    [-18, 'WRK-007', 'Payment', 8000, 'Bank Transfer', 'Part wage settlement'],
    [-16, 'WRK-001', 'Payment', 10000, 'UPI', 'Wage payment – first fortnight'],
    [-15, 'WRK-002', 'Payment', 9500, 'Cash', 'Wage payment – first fortnight'],
    [-15, 'WRK-008', 'Payment', 9000, 'Cash', 'Wage payment – first fortnight'],
    [-14, 'WRK-010', 'Salary/Wage', 6500, 'Cash', 'Piece-rate: bathroom plumbing, 4 units'],
    [-13, 'WRK-011', 'Advance', 2500, 'UPI', 'Room rent advance'],
    [-12, 'WRK-005', 'Payment', 7500, 'Bank Transfer', 'Wage payment'],
    [-11, 'WRK-009', 'Daily Allowance', 900, 'Cash', 'Food allowance'],
    [-10, 'WRK-004', 'Payment', 15000, 'Bank Transfer', 'Supervisor payout'],
    [-9, 'WRK-012', 'Deduction', 1500, 'Cash', 'Damaged paint roller set'],
    [-8, 'WRK-006', 'Payment', 9000, 'UPI', 'Wage payment'],
    [-7, 'WRK-001', 'Bonus', 2000, 'UPI', 'Tile work finished ahead of schedule'],
    [-6, 'WRK-003', 'Payment', 6000, 'Cash', 'Wage payment'],
    [-5, 'WRK-007', 'Expense', 650, 'Cash', 'Bought wire connectors for site'],
    [-4, 'WRK-010', 'Payment', 9000, 'UPI', 'Wage payment incl. piece-rate'],
    [-3, 'WRK-012', 'Payment', 8000, 'Cash', 'Partial final settlement'],
    [-2, 'WRK-008', 'Advance', 2000, 'Cash', 'Travel advance'],
    [-1, 'WRK-011', 'Payment', 7000, 'UPI', 'Wage payment'],
    [0, 'WRK-002', 'Payment', 5000, 'Cash', 'Weekly payment'],
  ];

  const transactions: Transaction[] = transactionSeeds.map(([offset, workerId, type, amount, mode, notes], index) => ({
    id: `TXN-${String(index + 1).padStart(3, '0')}`,
    workerId,
    projectId: workerProject(workerId),
    date: day(offset),
    type,
    amount,
    mode,
    direction: TRANSACTION_DEFAULT_DIRECTION[type],
    notes,
  }));

  /* ---- Expenses: recent detail + monthly history for trend charts ---- */
  const expenseSeeds: ExpenseSeed[] = [
    [0, 'PRJ-001', 'Transport', 'Balaji Transport Co.', 'Cement & sand delivery – 2 trips', 4800, 'UPI', 'UPI-4298715036'],
    [0, 'PRJ-002', 'Food', 'Annapurna Tiffin Service', 'Worker lunch – 22 plates', 2640, 'Cash', ''],
    [-1, 'PRJ-003', 'Machinery', 'Gujarat Equipment Rentals', 'Tile cutter & grinder rental – 3 days', 5400, 'Bank Transfer', 'NEFT-GER-7781'],
    [-1, 'PRJ-001', 'Fuel', 'HP Petrol Pump, Ajmer Road', 'Diesel for concrete mixer', 3900, 'Cash', 'BILL-2291'],
    [-2, 'PRJ-002', 'Machinery', 'Marudhar Crane Services', 'Tower crane hire – 1 day', 18500, 'Bank Transfer', 'INV-MCS-0412'],
    [-2, 'PRJ-003', 'Site Expense', 'Navrangpura Safety Store', 'Safety nets & barricade tape', 3250, 'UPI', ''],
    [-3, 'PRJ-001', 'Labour', 'Shiv Shakti Labour Contractor', 'Excavation gang – 4 labourers', 14400, 'Cash', 'LC-118'],
    [-3, 'PRJ-002', 'Accommodation', 'Rao Guest House', 'Worker stay – 5 rooms, weekly', 8750, 'UPI', ''],
    [-4, 'PRJ-003', 'Material', 'Patel Sanitary Mart', 'Sanitary fittings – washroom batch', 22800, 'Cheque', 'CHQ-004512'],
    [-5, 'PRJ-001', 'Site Expense', 'Jaipur Water Tankers', 'Water tanker – 6 loads', 4200, 'Cash', ''],
    [-5, 'PRJ-002', 'Transport', 'Rajputana Roadlines', 'Steel unloading & shifting', 6500, 'Bank Transfer', 'LR-7781'],
    [-6, '', 'Office', 'Stationery World', 'Site registers & measurement books', 1850, 'UPI', ''],
    [-7, 'PRJ-003', 'Labour', 'Mehul Painting Contractors', 'Exterior painting crew – advance', 25000, 'Bank Transfer', 'NEFT-MPC-2290'],
    [-8, 'PRJ-001', 'Machinery', 'Jaipur Earthmovers', 'JCB – 6 hours', 9600, 'Cash', ''],
    [-9, 'PRJ-002', 'Food', 'Annapurna Tiffin Service', 'Worker lunch – weekly bill', 15400, 'UPI', ''],
    [-10, 'PRJ-003', 'Fuel', 'Indian Oil – CG Road', 'Generator diesel', 5200, 'Cash', ''],
    [-12, 'PRJ-001', 'Material', 'Ambuja Cement Dealer', 'Emergency cement – 40 bags', 16200, 'UPI', ''],
    [-14, 'PRJ-002', 'Site Expense', 'Vardhman Hardware', 'Safety helmets & shoes', 11800, 'Bank Transfer', 'INV-VH-2231'],
    [-16, '', 'Office', 'Airtel Business', 'Site internet & phone bills', 2360, 'Bank Transfer', ''],
    [-18, 'PRJ-003', 'Transport', 'Shree Logistics', 'Debris removal – 3 trucks', 9000, 'Cash', ''],
    [-21, 'PRJ-001', 'Accommodation', 'Gopal Labour Camp', 'Monthly labour camp rent', 12000, 'Bank Transfer', ''],
    [-25, 'PRJ-002', 'Other', 'Jodhpur Municipal Corporation', 'Road cutting permission fee', 7500, 'Bank Transfer', 'JMC-RCP-889'],
    [-28, 'PRJ-005', 'Other', 'Rajdeep Geo Labs', 'Soil testing & topographic survey', 38000, 'Bank Transfer', 'INV-RGL-102'],
  ];

  const historyTemplates: Array<[string, ExpenseCategory, string, string, number, PaymentMode]> = [
    ['PRJ-001', 'Material', 'Rajasthan Cement Traders', 'Bulk cement & aggregate bill', 145000, 'Bank Transfer'],
    ['PRJ-002', 'Labour', 'Shiv Shakti Labour Contractor', 'Contract labour gang – monthly', 98000, 'Bank Transfer'],
    ['PRJ-003', 'Machinery', 'Gujarat Equipment Rentals', 'Scaffolding rental – monthly', 36000, 'Cheque'],
    ['PRJ-001', 'Transport', 'Balaji Transport Co.', 'Material transport – monthly', 18000, 'UPI'],
    ['PRJ-002', 'Fuel', 'HP Petrol Pump, Pal Road', 'Diesel – DG set & mixer', 14000, 'Cash'],
  ];

  const historyRandom = createSeededRandom(4471);
  for (let monthBack = 1; monthBack <= 5; monthBack += 1) {
    historyTemplates.forEach(([projectId, category, vendor, description, baseAmount, mode], index) => {
      const amount = Math.round((baseAmount * (0.8 + historyRandom() * 0.4)) / 100) * 100;
      expenseSeeds.push([-(30 * monthBack) - ((index * 6) % 25), projectId, category, vendor, description, amount, mode, '']);
    });
  }

  const expenses: Expense[] = expenseSeeds
    .map(([offset, projectId, category, vendor, description, amount, mode, referenceNo]) => ({
      id: '',
      date: day(offset),
      projectId,
      category,
      vendor,
      description,
      amount,
      mode,
      referenceNo,
      notes: '',
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((expense, index) => ({ ...expense, id: `EXP-${String(index + 1).padStart(3, '0')}` }));

  /* ---- Notifications & activity ---- */
  const minutesAgo = (minutes: number): number => now - minutes * 60_000;

  const notifications: AppNotification[] = [
    {
      id: 'NTF-001',
      title: 'Low cement stock',
      message: 'OPC Cement 53 Grade at Green Residency is below the minimum level of 150 bags.',
      type: 'warning',
      section: 'materials',
      createdAt: minutesAgo(25),
      read: false,
    },
    {
      id: 'NTF-002',
      title: 'Salary pending',
      message: 'Fortnightly wage settlement is due for Skyline Heights workers.',
      type: 'warning',
      section: 'khata',
      createdAt: minutesAgo(130),
      read: false,
    },
    {
      id: 'NTF-003',
      title: 'Worker attendance missing',
      message: 'Mohan Lal Suthar and Bhagirath Bishnoi are not marked yet at Metro Plaza Renovation.',
      type: 'info',
      section: 'attendance',
      createdAt: minutesAgo(190),
      read: false,
    },
    {
      id: 'NTF-004',
      title: 'Project over budget',
      message: 'Metro Plaza Renovation has crossed its estimated cost. Review pending bills before handover.',
      type: 'error',
      section: 'projects',
      createdAt: minutesAgo(310),
      read: false,
    },
    {
      id: 'NTF-005',
      title: 'New material received',
      message: '1,500 cubic ft. M-Sand received at Skyline Heights from Marwar Sand Suppliers.',
      type: 'success',
      section: 'materials',
      createdAt: minutesAgo(60 * 24 * 5),
      read: true,
    },
    {
      id: 'NTF-006',
      title: 'Project nearing completion',
      message: 'Metro Plaza Renovation is scheduled for handover in 18 days.',
      type: 'info',
      section: 'projects',
      createdAt: minutesAgo(60 * 26),
      read: true,
    },
  ];

  const activities: ActivityItem[] = [
    { id: 'ACT-001', type: 'expense', title: 'Expense added', detail: 'Transport ₹4,800 · Green Residency', timestamp: minutesAgo(18) },
    { id: 'ACT-002', type: 'attendance', title: 'Attendance updated', detail: '10 workers marked across 3 sites', timestamp: minutesAgo(52) },
    { id: 'ACT-003', type: 'payment', title: 'Payment recorded', detail: 'Suresh Meena · ₹5,000 cash', timestamp: minutesAgo(95) },
    { id: 'ACT-004', type: 'work', title: 'Work entry added', detail: 'Imran Khan · 180 running ft. wiring', timestamp: minutesAgo(140) },
    { id: 'ACT-005', type: 'material', title: 'Material consumed', detail: 'OPC Cement · 90 bags at Green Residency', timestamp: minutesAgo(60 * 22) },
    { id: 'ACT-006', type: 'project', title: 'Project updated', detail: 'Sunrise Apartments moved to Coming Soon', timestamp: minutesAgo(60 * 30) },
  ];

  return {
    version: DATA_VERSION,
    settings: { ...DEFAULT_SETTINGS },
    workers,
    projects,
    attendance,
    workEntries,
    materials,
    movements,
    transactions,
    expenses,
    notifications,
    activities,
  };
}
/* ========================================================= */
/* Reusable UI                                               */
/* ========================================================= */

/* ---------------- Class names, shared styles & UI copy ---------------- */

type ClassValue = string | false | null | undefined;

function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}

type IconTone = 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'teal' | 'slate';
type BadgeTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'violet' | 'indigo';
type ProgressTone = 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'slate';
type SortDirection = 'asc' | 'desc';

interface SortState<K extends string = string> {
  key: K;
  direction: SortDirection;
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type FormErrors<K extends string> = Partial<Record<K, string>>;

interface ElementRefLike {
  readonly current: HTMLElement | null;
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

const FOCUS_RING_INSET =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/60';

const ICON_TONES: Record<IconTone, string> = {
  indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-600/10',
  emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-600/10',
  amber: 'bg-amber-50 text-amber-600 ring-amber-600/10',
  rose: 'bg-rose-50 text-rose-600 ring-rose-600/10',
  sky: 'bg-sky-50 text-sky-600 ring-sky-600/10',
  violet: 'bg-violet-50 text-violet-600 ring-violet-600/10',
  teal: 'bg-teal-50 text-teal-600 ring-teal-600/10',
  slate: 'bg-slate-100 text-slate-600 ring-slate-600/10',
};

const DOT_TONES: Record<IconTone, string> = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  teal: 'bg-teal-500',
  slate: 'bg-slate-400',
};

const BADGE_TONES: Record<BadgeTone, { pill: string; dot: string }> = {
  neutral: { pill: 'bg-slate-100 text-slate-700 ring-slate-500/20', dot: 'bg-slate-400' },
  success: { pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
  danger: { pill: 'bg-rose-50 text-rose-700 ring-rose-600/20', dot: 'bg-rose-500' },
  warning: { pill: 'bg-amber-50 text-amber-800 ring-amber-600/20', dot: 'bg-amber-500' },
  info: { pill: 'bg-sky-50 text-sky-700 ring-sky-600/20', dot: 'bg-sky-500' },
  violet: { pill: 'bg-violet-50 text-violet-700 ring-violet-600/20', dot: 'bg-violet-500' },
  indigo: { pill: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20', dot: 'bg-indigo-500' },
};

const PROGRESS_TONES: Record<ProgressTone, string> = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-400',
};

const PILL_BASE =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset';

/** Shown beside the transaction type select so users know how each entry affects payable and project cost. */
const LEDGER_TYPE_HINTS: Record<TransactionType, string> = {
  'Salary/Wage':
    'Extra wage earning on top of attendance wages (piece-rate or contract work). Adds labour cost to the project.',
  'Daily Allowance': 'Food or travel allowance owed to the person. Adds labour cost to the project.',
  Advance: 'Money given before wages are earned. Reduces payable. Not a project cost.',
  Payment: 'Settles wages already earned. Reduces payable. Not a project cost.',
  Reimbursement:
    'Pays back money the person spent for the company. Increases payable. Record the purchase in Expenses if it should count as project cost.',
  Expense:
    'Site purchase paid from the person’s own pocket. Increases payable. Record it in Expenses too if it should count as project cost.',
  Bonus: 'Extra earning for good work. Adds labour cost to the project.',
  Deduction: 'Recovery for damage, loss or penalty. Reduces payable.',
  Other: 'Manual adjustment. Choose credit or debit. Does not change project cost.',
};

const EXPENSE_CATEGORY_HINTS: Partial<Record<ExpenseCategory, string>> = {
  Material:
    'Use only for purchases not entered through Materials → Receive Stock. Stock receipts are already counted as material cost.',
  Labour:
    'Use for labour contractors or gangs not tracked in attendance. Attendance wages are already counted as labour cost.',
};

const DIRECTION_LABELS: Record<TransactionDirection, string> = {
  credit: 'Credit · adds to payable',
  debit: 'Debit · reduces payable',
};

const GLOBAL_CSS = `
.erp-shimmer{position:relative;overflow:hidden;background-color:#edf0f4}
.erp-shimmer::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.7),rgba(255,255,255,0));animation:erp-shimmer 1.4s ease-in-out infinite}
@keyframes erp-shimmer{100%{transform:translateX(100%)}}
.erp-scrollbar-none{scrollbar-width:none;-ms-overflow-style:none}
.erp-scrollbar-none::-webkit-scrollbar{display:none}
.erp-scroll-thin{scrollbar-width:thin;scrollbar-color:#cbd5e1 transparent}
.erp-scroll-thin::-webkit-scrollbar{width:8px;height:8px}
.erp-scroll-thin::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:9999px}
input[type=number].erp-no-spin::-webkit-outer-spin-button,input[type=number].erp-no-spin::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
input[type=number].erp-no-spin{-moz-appearance:textfield;appearance:textfield}
.erp-print-only{display:none}
@media (prefers-reduced-motion: reduce){.erp-shimmer::after{animation:none}}
@media print{
  @page{margin:12mm}
  body{background:#fff!important}
  .erp-print-hidden{display:none!important}
  .erp-print-only{display:block!important}
  .erp-print-card{box-shadow:none!important;border-color:#e2e8f0!important;break-inside:avoid}
  .erp-print-expand{max-height:none!important;overflow:visible!important}
}
`;

function GlobalStyles() {
  // Static, developer-authored CSS only. No user data is ever interpolated here.
  return <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />;
}

/* ---------------- Hooks ---------------- */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useLatestRef<T>(value: T): { current: T } {
  const ref = useRef(value);
  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, [query]);

  return matches;
}

function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

function useDebouncedValue<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

/** Ticking clock for relative timestamps. Starts at 0 so server and client markup match. */
function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return now;
}

/**
 * Runs an action after a short simulated delay and tracks pending state per key,
 * so a single table row can show its own delete spinner. Repeat clicks are ignored.
 */
function usePendingActions() {
  const [pendingKeys, setPendingKeys] = useState<Record<string, true>>({});
  const inFlightRef = useRef(new Set<string>());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(
    async <TResult,>(
      key: string,
      action: () => TResult | Promise<TResult>,
      delayMs = 500,
    ): Promise<TResult | undefined> => {
      if (inFlightRef.current.has(key)) return undefined;
      inFlightRef.current.add(key);
      setPendingKeys((current) => ({ ...current, [key]: true }));
      try {
        await wait(delayMs);
        return await action();
      } finally {
        inFlightRef.current.delete(key);
        if (mountedRef.current) {
          setPendingKeys((current) => {
            const next = { ...current };
            delete next[key];
            return next;
          });
        }
      }
    },
    [],
  );

  const isPending = useCallback((key: string): boolean => Boolean(pendingKeys[key]), [pendingKeys]);

  return { run, isPending, hasPending: Object.keys(pendingKeys).length > 0 };
}

type DismissReason = 'outside' | 'escape';

/**
 * Closes popovers on outside pointer or Escape. Escape is captured and stopped
 * so an open popover inside a modal closes without also closing the modal.
 */
function useDismissableLayer(
  active: boolean,
  refs: ReadonlyArray<ElementRefLike>,
  onDismiss: (reason: DismissReason) => void,
): void {
  const refsRef = useLatestRef(refs);
  const onDismissRef = useLatestRef(onDismiss);

  useEffect(() => {
    if (!active) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (refsRef.current.some((ref) => ref.current?.contains(target))) return;
      onDismissRef.current('outside');
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      onDismissRef.current('escape');
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [active, refsRef, onDismissRef]);
}

let scrollLockCount = 0;
let previousBodyOverflow = '';
let previousBodyPaddingRight = '';

function lockBodyScroll(): void {
  if (typeof document === 'undefined') return;
  if (scrollLockCount === 0) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    previousBodyOverflow = document.body.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  scrollLockCount += 1;
}

function unlockBodyScroll(): void {
  if (typeof document === 'undefined') return;
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.body.style.paddingRight = previousBodyPaddingRight;
  }
}

function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    lockBodyScroll();
    return unlockBodyScroll;
  }, [active]);
}

function getRovingIndex(key: string, index: number, length: number): number | null {
  if (length === 0) return null;
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (index + 1) % length;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (index - 1 + length) % length;
    case 'Home':
      return 0;
    case 'End':
      return length - 1;
    default:
      return null;
  }
}

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getClientRects().length > 0 && !element.hasAttribute('data-focus-skip'),
  );
}

/* ---------------- Sorting ---------------- */

function toggleSort<K extends string>(current: SortState<K> | null, key: K): SortState<K> {
  if (!current || current.key !== key) return { key, direction: 'asc' };
  return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
}

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'en-IN', { numeric: true, sensitivity: 'base' });
}

function sortRecords<T>(items: readonly T[], accessor: (item: T) => string | number, direction: SortDirection): T[] {
  const factor = direction === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => compareValues(accessor(a), accessor(b)) * factor);
}

function toSelectOptions<T extends string>(values: readonly T[], labels?: Partial<Record<T, string>>): SelectOption[] {
  return values.map((value) => ({ value, label: labels?.[value] ?? value }));
}

function hasFormErrors<K extends string>(errors: FormErrors<K>): boolean {
  return Object.values(errors).some(Boolean);
}

/* ---------------- Toast system ---------------- */

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastRecord {
  id: string;
  title: string;
  description: string;
  variant: ToastVariant;
  duration: number;
  leaving: boolean;
}

interface ToastContextValue {
  notify: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_VISIBLE_TOASTS = 4;
const TOAST_EXIT_MS = 200;

const TOAST_STYLES: Record<ToastVariant, { icon: LucideIcon; iconClass: string; accent: string }> = {
  success: { icon: CheckCircle2, iconClass: 'text-emerald-600', accent: 'bg-emerald-500' },
  error: { icon: XCircle, iconClass: 'text-rose-600', accent: 'bg-rose-500' },
  warning: { icon: AlertTriangle, iconClass: 'text-amber-600', accent: 'bg-amber-500' },
  info: { icon: Info, iconClass: 'text-sky-600', accent: 'bg-sky-500' },
};

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const counterRef = useRef(0);
  const exitTimersRef = useRef(new Map<string, number>());

  useEffect(() => {
    const timers = exitTimersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    if (exitTimersRef.current.has(id)) return;
    setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)));
    const timer = window.setTimeout(() => {
      exitTimersRef.current.delete(id);
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_EXIT_MS);
    exitTimersRef.current.set(id, timer);
  }, []);

  const notify = useCallback((options: ToastOptions) => {
    counterRef.current += 1;
    const id = `toast-${counterRef.current}`;
    const variant = options.variant ?? 'info';
    const record: ToastRecord = {
      id,
      title: sanitizeText(options.title, 120),
      description: options.description ? sanitizeText(options.description, 240) : '',
      variant,
      duration: options.duration ?? (variant === 'error' ? 6000 : 4000),
      leaving: false,
    };
    setToasts((current) => [...current, record].slice(-MAX_VISIBLE_TOASTS));
    return id;
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      notify,
      dismiss,
      success: (title, description) => notify({ title, description, variant: 'success' }),
      error: (title, description) => notify({ title, description, variant: 'error' }),
      warning: (title, description) => notify({ title, description, variant: 'warning' }),
      info: (title, description) => notify({ title, description, variant: 'info' }),
    }),
    [notify, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        className="erp-print-hidden pointer-events-none fixed inset-x-0 top-0 z-[70] flex flex-col items-center gap-2 p-3 sm:inset-x-auto sm:bottom-0 sm:right-0 sm:top-auto sm:items-end sm:p-5"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const remainingRef = useRef(toast.duration);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const style = TOAST_STYLES[toast.variant];
  const Icon = style.icon;

  useIsomorphicLayoutEffect(() => {
    const element = cardRef.current;
    if (!element || reducedMotion) return;
    const tween = gsap.fromTo(
      element,
      { opacity: 0, y: 12, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power3.out', clearProps: 'transform,opacity' },
    );
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (paused || toast.leaving) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => onDismiss(toast.id), Math.max(0, remainingRef.current));
    return () => {
      window.clearTimeout(timer);
      remainingRef.current -= Date.now() - startedAt;
    };
  }, [paused, toast.leaving, toast.id, onDismiss]);

  return (
    <div
      ref={cardRef}
      role={toast.variant === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        'pointer-events-auto relative flex w-full max-w-[420px] items-start gap-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-3.5 pl-4 pr-10 shadow-lg shadow-slate-900/10 sm:w-[380px]',
        toast.leaving && 'translate-y-1 scale-[0.98] opacity-0 transition-[opacity,transform] duration-200',
      )}
    >
      <span className={cn('absolute inset-y-0 left-0 w-1', style.accent)} aria-hidden="true" />
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', style.iconClass)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-[13px] leading-5 text-slate-600">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className={cn(
          'absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700',
          FOCUS_RING,
        )}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>.');
  return context;
}

/* ---------------- Spinners & loaders ---------------- */

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

const SPINNER_SIZES: Record<SpinnerSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
};

function Spinner({ size = 'sm', className, label }: { size?: SpinnerSize; className?: string; label?: string }) {
  return (
    <span role={label ? 'status' : undefined} className="inline-flex items-center">
      <Loader2 className={cn('animate-spin', SPINNER_SIZES[size], className)} aria-hidden="true" />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

function InlineLoader({ label = 'Loading', className }: { label?: string; className?: string }) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-2 text-xs font-medium text-slate-500', className)}>
      <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" aria-hidden="true" />
      {label}
    </span>
  );
}

function ProgressLoader({
  label,
  description,
  progress,
  className,
}: {
  label: string;
  description?: string;
  progress?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-4 px-6 py-14 text-center', className)}
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 ring-1 ring-inset ring-indigo-600/10">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {description && <p className="mt-1 text-[13px] text-slate-500">{description}</p>}
      </div>
      {typeof progress === 'number' && (
        <div className="w-full max-w-xs">
          <ProgressBar value={progress} tone="indigo" size="sm" label={label} />
          <p className="mt-1.5 text-xs tabular-nums text-slate-500">{Math.round(clamp(progress, 0, 100))}%</p>
        </div>
      )}
    </div>
  );
}

/* ---------------- Skeletons ---------------- */

type SkeletonRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SKELETON_RADIUS: Record<SkeletonRadius, string> = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const SKELETON_WIDTHS: readonly string[] = ['w-3/4', 'w-1/2', 'w-2/3', 'w-5/12', 'w-7/12', 'w-4/5'];
const SKELETON_BAR_HEIGHTS: readonly number[] = [42, 68, 55, 84, 60, 92, 48, 74, 58, 80];

function Skeleton({ className, rounded = 'md' }: { className?: string; rounded?: SkeletonRadius }) {
  return <div aria-hidden="true" className={cn('erp-shimmer', SKELETON_RADIUS[rounded], className)} />;
}

function KpiCardSkeleton() {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-9 w-9" rounded="xl" />
      </div>
      <Skeleton className="mt-3 h-7 w-28" />
      <Skeleton className="mt-3 h-3 w-32" />
    </Card>
  );
}

function KpiGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div role="status" className={cn('grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4', className)}>
      {Array.from({ length: count }, (_, index) => (
        <KpiCardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading summary</span>
    </div>
  );
}

function TableSkeletonRows({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <tr key={rowIndex} aria-hidden="true">
          {Array.from({ length: columns }, (_, columnIndex) => (
            <td key={columnIndex} className="border-b border-slate-100 px-4 py-3.5">
              {columnIndex === 0 ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 shrink-0" rounded="full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                </div>
              ) : (
                <Skeleton className={cn('h-3', SKELETON_WIDTHS[(rowIndex + columnIndex) % SKELETON_WIDTHS.length])} />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function MobileCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5" aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 shrink-0" rounded="full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-2.5 w-20" />
        </div>
        <Skeleton className="h-5 w-14" rounded="full" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
      </div>
    </div>
  );
}

function ListSkeleton({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div role="status" className={cn('space-y-3', className)}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-3" aria-hidden="true">
          <Skeleton className="h-9 w-9 shrink-0" rounded="xl" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className={cn('h-3', SKELETON_WIDTHS[index % SKELETON_WIDTHS.length])} />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
      <span className="sr-only">Loading list</span>
    </div>
  );
}

function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div role="status" className="flex h-full w-full items-end gap-2 px-3 pb-6 sm:gap-3" style={{ height }}>
      {SKELETON_BAR_HEIGHTS.map((barHeight, index) => (
        <Skeleton
          key={index}
          className={cn('flex-1', index > 6 && 'hidden sm:block')}
          rounded="md"
          aria-hidden="true"
        />
      )).map((bar, index) => (
        <div key={index} className={cn('flex flex-1', index > 6 && 'hidden sm:flex')} style={{ height: `${SKELETON_BAR_HEIGHTS[index] ?? 50}%` }}>
          {bar}
        </div>
      ))}
      <span className="sr-only">Loading chart</span>
    </div>
  );
}

/* ---------------- Buttons ---------------- */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-500',
  secondary: 'bg-slate-900 text-white shadow-sm hover:bg-slate-800',
  outline:
    'border border-slate-200 bg-white text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  soft: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
  danger: 'bg-rose-600 text-white shadow-sm shadow-rose-600/20 hover:bg-rose-500',
  success: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-500',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  xs: 'h-8 gap-1.5 px-2.5 text-xs',
  sm: 'h-9 gap-1.5 px-3 text-[13px]',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-11 gap-2 px-5 text-sm',
};

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  fullWidth?: boolean;
}

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const iconClass = size === 'xs' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-lg font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-55',
        FOCUS_RING,
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? (
        <Loader2 className={cn(iconClass, 'animate-spin')} aria-hidden="true" />
      ) : (
        Icon && <Icon className={iconClass} aria-hidden="true" />
      )}
      {loading && loadingText ? loadingText : children}
      {!loading && IconRight && <IconRight className={iconClass} aria-hidden="true" />}
    </button>
  );
}

type IconButtonVariant = 'ghost' | 'outline' | 'soft' | 'danger';

const ICON_BUTTON_VARIANTS: Record<IconButtonVariant, string> = {
  ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
  outline: 'border border-slate-200 bg-white text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:bg-slate-50 hover:text-slate-900',
  soft: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
  danger: 'text-slate-500 hover:bg-rose-50 hover:text-rose-600',
};

interface IconButtonProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  label: string;
  icon: LucideIcon;
  variant?: IconButtonVariant;
  size?: 'sm' | 'md';
  loading?: boolean;
  badgeCount?: number;
}

function IconButton({
  label,
  icon: Icon,
  variant = 'ghost',
  size = 'sm',
  loading = false,
  badgeCount,
  className,
  disabled,
  type = 'button',
  ...rest
}: IconButtonProps) {
  const showBadge = typeof badgeCount === 'number' && badgeCount > 0;

  return (
    <button
      {...rest}
      type={type}
      aria-label={showBadge ? `${label} (${badgeCount} unread)` : label}
      title={label}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'relative inline-grid shrink-0 place-items-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-50',
        FOCUS_RING,
        size === 'sm' ? 'h-9 w-9 sm:h-8 sm:w-8' : 'h-10 w-10',
        ICON_BUTTON_VARIANTS[variant],
        className,
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Icon className={size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]'} aria-hidden="true" />
      )}
      {showBadge && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white"
        >
          {badgeCount > 9 ? '9+' : badgeCount}
        </span>
      )}
    </button>
  );
}

/** Stops row click handlers from firing when inline actions are used. */
function RowActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn('flex items-center justify-end gap-0.5', className)}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  );
}

/* ---------------- Action menu ---------------- */

interface ActionMenuItem {
  key: string;
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
  separatorBefore?: boolean;
}

interface ActionMenuProps {
  items: ReadonlyArray<ActionMenuItem>;
  label?: string;
  triggerIcon?: LucideIcon;
  triggerClassName?: string;
  menuWidth?: number;
}

const MENU_ITEM_SELECTOR = '[role="menuitem"]:not([disabled])';

/** Uses fixed positioning so menus are not clipped by scrollable tables or modal bodies. */
function ActionMenu({
  items,
  label = 'More actions',
  triggerIcon: TriggerIcon = MoreVertical,
  triggerClassName,
  menuWidth = 208,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    setPosition(null);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  useDismissableLayer(open, [triggerRef, menuRef], (reason) => close(reason === 'escape'));

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = menu.offsetHeight;
    const left = clamp(rect.right - menuWidth, 8, Math.max(8, window.innerWidth - menuWidth - 8));
    const below = rect.bottom + 6;
    const top = below + menuHeight > window.innerHeight - 8 ? Math.max(8, rect.top - menuHeight - 6) : below;
    setPosition({ top, left });
    menu.querySelector<HTMLElement>(MENU_ITEM_SELECTOR)?.focus({ preventScroll: true });

    const handleViewportChange = () => close(false);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [open, menuWidth, close]);

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const menu = menuRef.current;
    if (!menu) return;
    if (event.key === 'Tab') {
      close(false);
      return;
    }
    const elements = Array.from(menu.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR));
    const currentIndex = Math.max(0, elements.findIndex((element) => element === document.activeElement));
    const nextIndex = getRovingIndex(event.key, currentIndex, elements.length);
    if (nextIndex === null) return;
    event.preventDefault();
    elements[nextIndex]?.focus();
  };

  return (
    <div
      className="relative inline-flex"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close(false) : setOpen(true))}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          'inline-grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:h-8 sm:w-8',
          FOCUS_RING,
          open && 'bg-slate-100 text-slate-900',
          triggerClassName,
        )}
      >
        <TriggerIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={handleMenuKeyDown}
          className="fixed z-[60] rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10"
          style={{ top: position?.top ?? 0, left: position?.left ?? 0, width: menuWidth, opacity: position ? 1 : 0 }}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key}>
                {item.separatorBefore && <div role="separator" className="my-1 h-px bg-slate-100" />}
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    close(true);
                    item.onSelect();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45',
                    FOCUS_RING_INSET,
                    item.tone === 'danger'
                      ? 'text-rose-600 hover:bg-rose-50 focus-visible:bg-rose-50'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus-visible:bg-slate-50',
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn('h-4 w-4 shrink-0', item.tone === 'danger' ? 'text-rose-500' : 'text-slate-400')}
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate">{item.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------- Modal / Drawer / Confirmation ---------------- */

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ModalVariant = 'dialog' | 'drawer';

const DIALOG_SIZES: Record<ModalSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  '2xl': 'sm:max-w-6xl',
};

const DRAWER_SIZES: Record<ModalSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-xl',
  xl: 'sm:max-w-3xl',
  '2xl': 'sm:max-w-5xl',
};

/** Tracks open modals so Escape only closes the top-most one. */
const modalStack: string[] = [];

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  iconTone?: IconTone;
  children?: ReactNode;
  footer?: ReactNode;
  headerAction?: ReactNode;
  size?: ModalSize;
  variant?: ModalVariant;
  preventClose?: boolean;
  closeOnBackdrop?: boolean;
  mobileFullScreen?: boolean;
  bodyClassName?: string;
}

function Modal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  iconTone = 'indigo',
  children,
  footer,
  headerAction,
  size = 'md',
  variant = 'dialog',
  preventClose = false,
  closeOnBackdrop = true,
  mobileFullScreen = false,
  bodyClassName,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const modalId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(open);
  const reducedMotion = usePrefersReducedMotion();
  const onCloseRef = useLatestRef(onClose);
  const preventCloseRef = useLatestRef(preventClose);

  const requestClose = useCallback(() => {
    if (!preventCloseRef.current) onCloseRef.current();
  }, [onCloseRef, preventCloseRef]);

  useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    modalStack.push(modalId);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || modalStack[modalStack.length - 1] !== modalId) return;
      event.preventDefault();
      requestClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const index = modalStack.lastIndexOf(modalId);
      if (index >= 0) modalStack.splice(index, 1);
    };
  }, [open, modalId, requestClose]);

  useEffect(() => {
    if (!open || !rendered) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel || panel.contains(document.activeElement)) return;
      const explicitTarget = panel.querySelector<HTMLElement>('[data-autofocus]');
      // Avoid popping the on-screen keyboard on touch devices.
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const firstField = !isTouch && bodyRef.current ? getFocusableElements(bodyRef.current)[0] : undefined;
      (explicitTarget ?? firstField ?? panel).focus({ preventScroll: true });
    });
    return () => {
      window.cancelAnimationFrame(frame);
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open, rendered]);

  useIsomorphicLayoutEffect(() => {
    if (!rendered) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    if (reducedMotion) {
      if (!open) setRendered(false);
      return;
    }

    const isDesktop = window.matchMedia('(min-width: 640px)').matches;
    const offset = !isDesktop ? { y: 48 } : variant === 'drawer' ? { x: 48 } : { y: 12, scale: 0.98 };

    if (open) {
      const timeline = gsap.timeline();
      timeline
        .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' })
        .fromTo(
          panel,
          { opacity: 0, ...offset },
          { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.32, ease: 'power3.out', clearProps: 'transform,opacity' },
          0,
        );
      return () => {
        timeline.kill();
      };
    }

    const timeline = gsap.timeline({ onComplete: () => setRendered(false) });
    timeline
      .to(panel, { opacity: 0, ...offset, duration: 0.18, ease: 'power2.in' })
      .to(backdrop, { opacity: 0, duration: 0.18, ease: 'power1.in' }, 0);
    return () => {
      timeline.kill();
    };
  }, [open, rendered, reducedMotion, variant]);

  const handlePanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = getFocusableElements(panel);
    if (focusable.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  if (!rendered) return null;

  const isDrawer = variant === 'drawer';

  return (
    <div
      role="presentation"
      className={cn(
        'fixed inset-0 z-50 flex',
        isDrawer ? 'items-end justify-center sm:items-stretch sm:justify-end' : 'items-end justify-center sm:items-center sm:p-6',
      )}
    >
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={closeOnBackdrop ? requestClose : undefined}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDown={handlePanelKeyDown}
        className={cn(
          'relative flex w-full flex-col overflow-hidden bg-white shadow-2xl shadow-slate-900/20 outline-none ring-1 ring-slate-900/5',
          mobileFullScreen ? 'h-[100dvh] max-h-[100dvh] rounded-none' : 'max-h-[92dvh] rounded-t-2xl',
          isDrawer
            ? cn('sm:h-[100dvh] sm:max-h-[100dvh] sm:rounded-tr-none sm:rounded-tl-2xl sm:rounded-bl-2xl', DRAWER_SIZES[size])
            : cn('sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:rounded-2xl', DIALOG_SIZES[size]),
        )}
      >
        {!mobileFullScreen && (
          <div className="flex justify-center pt-2 sm:hidden" aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-slate-200" />
          </div>
        )}

        <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-6 sm:py-4">
          {Icon && (
            <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset', ICON_TONES[iconTone])}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 id={titleId} className="text-base font-semibold leading-6 text-slate-900">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="mt-0.5 text-[13px] leading-5 text-slate-500">
                {description}
              </div>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
          <button
            type="button"
            onClick={requestClose}
            disabled={preventClose}
            aria-label="Close"
            title="Close"
            data-focus-skip
            className={cn(
              '-mr-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40',
              FOCUS_RING,
            )}
          >
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>

        {children !== undefined && children !== null && (
          <div
            ref={bodyRef}
            className={cn('erp-scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5', bodyClassName)}
          >
            {children}
          </div>
        )}

        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:flex-row sm:items-center sm:justify-end sm:px-6 sm:pb-3 [&>button]:w-full sm:[&>button]:w-auto">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary';
  icon?: LucideIcon;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  children?: ReactNode;
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  tone = 'danger',
  icon,
  onConfirm,
  onClose,
  children,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleConfirm = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onConfirm();
    } catch {
      // The caller owns error reporting; the dialog stays open so the user can retry.
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      preventClose={busy}
      title={title}
      description={description}
      icon={icon ?? (tone === 'danger' ? Trash2 : AlertTriangle)}
      iconTone={tone === 'danger' ? 'rose' : 'amber'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={busy} data-autofocus>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            loading={busy}
            loadingText={tone === 'danger' ? 'Deleting…' : 'Please wait…'}
            onClick={() => {
              void handleConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}

/* ---------------- Form fields ---------------- */

const INPUT_BASE =
  'block w-full rounded-lg border bg-white text-sm text-slate-900 shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-[border-color,box-shadow] placeholder:text-slate-400 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';
const INPUT_VALID = 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15';
const INPUT_INVALID = 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15';

function getDescribedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  labelAction?: ReactNode;
  className?: string;
  children: ReactNode;
}

function FieldShell({ id, label, required, hint, error, labelAction, className, children }: FieldShellProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <div className="flex min-h-5 items-center justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-medium text-slate-700">
          {label}
          {required && (
            <>
              <span className="ml-0.5 text-rose-500" aria-hidden="true">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>
        {labelAction}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1 text-xs font-medium text-rose-600">
          <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs leading-5 text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface InputFieldProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  label: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  leadingText?: string;
  trailingText?: string;
  labelAction?: ReactNode;
  containerClassName?: string;
}

function InputField({
  label,
  error,
  hint,
  icon: Icon,
  leadingText,
  trailingText,
  labelAction,
  containerClassName,
  id,
  className,
  required,
  type = 'text',
  onWheel,
  inputMode,
  ...rest
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isNumber = type === 'number';

  return (
    <FieldShell
      id={inputId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      labelAction={labelAction}
      className={containerClassName}
    >
      <div className="relative flex items-center">
        {Icon && <Icon className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" aria-hidden="true" />}
        {!Icon && leadingText && (
          <span className="pointer-events-none absolute left-3 text-sm text-slate-500" aria-hidden="true">
            {leadingText}
          </span>
        )}
        <input
          {...rest}
          id={inputId}
          type={type}
          required={required}
          inputMode={inputMode ?? (isNumber ? 'decimal' : undefined)}
          aria-invalid={error ? true : undefined}
          aria-describedby={getDescribedBy(inputId, error, hint)}
          onWheel={(event) => {
            // Stops accidental value changes when scrolling past a focused number input.
            if (isNumber) event.currentTarget.blur();
            onWheel?.(event);
          }}
          className={cn(
            INPUT_BASE,
            error ? INPUT_INVALID : INPUT_VALID,
            'h-11 sm:h-10',
            Icon ? 'pl-9' : leadingText ? 'pl-7' : 'pl-3',
            trailingText ? 'pr-16' : 'pr-3',
            isNumber && 'erp-no-spin tabular-nums',
            className,
          )}
        />
        {trailingText && (
          <span className="pointer-events-none absolute right-3 max-w-[3.5rem] truncate text-xs text-slate-500" aria-hidden="true">
            {trailingText}
          </span>
        )}
      </div>
    </FieldShell>
  );
}

interface SelectFieldProps extends Omit<React.ComponentPropsWithoutRef<'select'>, 'children' | 'size'> {
  label: string;
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  labelAction?: ReactNode;
  containerClassName?: string;
}

function SelectField({
  label,
  options,
  placeholder,
  error,
  hint,
  icon: Icon,
  labelAction,
  containerClassName,
  id,
  className,
  required,
  ...rest
}: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <FieldShell
      id={selectId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      labelAction={labelAction}
      className={containerClassName}
    >
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        )}
        <select
          {...rest}
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={getDescribedBy(selectId, error, hint)}
          className={cn(
            INPUT_BASE,
            error ? INPUT_INVALID : INPUT_VALID,
            'h-11 cursor-pointer appearance-none pr-9 sm:h-10',
            Icon ? 'pl-9' : 'pl-3',
            className,
          )}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
}

interface TextAreaFieldProps extends React.ComponentPropsWithoutRef<'textarea'> {
  label: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  containerClassName?: string;
}

function TextAreaField({
  label,
  error,
  hint,
  showCount = false,
  containerClassName,
  id,
  className,
  required,
  rows = 3,
  maxLength,
  value,
  ...rest
}: TextAreaFieldProps) {
  const generatedId = useId();
  const textAreaId = id ?? generatedId;
  const length = typeof value === 'string' ? value.length : 0;

  return (
    <FieldShell
      id={textAreaId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={containerClassName}
      labelAction={
        showCount && maxLength ? (
          <span className="text-[11px] tabular-nums text-slate-400" aria-hidden="true">
            {length}/{maxLength}
          </span>
        ) : undefined
      }
    >
      <textarea
        {...rest}
        id={textAreaId}
        rows={rows}
        value={value}
        maxLength={maxLength}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={getDescribedBy(textAreaId, error, hint)}
        className={cn(INPUT_BASE, error ? INPUT_INVALID : INPUT_VALID, 'resize-y px-3 py-2.5 leading-5', className)}
      />
    </FieldShell>
  );
}

function FormSection({
  title,
  description,
  columns = 2,
  children,
  className,
}: {
  title: string;
  description?: string;
  columns?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
}) {
  const gridClass =
    columns === 1 ? 'grid-cols-1' : columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';

  return (
    <fieldset className={cn('min-w-0 border-0 p-0', className)}>
      <legend className="mb-3 w-full">
        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {description && <span className="mt-0.5 block text-xs font-normal text-slate-400">{description}</span>}
      </legend>
      <div className={cn('grid gap-3.5 sm:gap-4', gridClass)}>{children}</div>
    </fieldset>
  );
}

function FormErrorSummary({
  errors,
  title = 'Please fix the highlighted fields',
}: {
  errors: Readonly<Record<string, string | undefined>>;
  title?: string;
}) {
  const messages = Object.values(errors).filter((message): message is string => Boolean(message));
  if (messages.length === 0) return null;

  return (
    <div role="alert" className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-rose-800">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs">
          {messages.slice(0, 5).map((message, index) => (
            <li key={`${index}-${message}`}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  const switchId = useId();

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={switchId} className="text-sm font-medium text-slate-800">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>}
      </div>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          FOCUS_RING,
          checked ? 'bg-indigo-600' : 'bg-slate-200',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-slate-900/5 transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}

function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  label,
  hideLabel = false,
  disabled = false,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hideLabel?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const checkboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        'inline-flex min-h-9 cursor-pointer select-none items-center gap-2 sm:min-h-0',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        ref={inputRef}
        id={checkboxId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.checked)}
        aria-checked={indeterminate && !checked ? 'mixed' : checked}
        className={cn('h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600', FOCUS_RING)}
      />
      <span className={hideLabel ? 'sr-only' : 'text-sm text-slate-700'}>{label}</span>
    </label>
  );
}

/* ---------------- Segmented control & tabs ---------------- */

interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  fullWidth = false,
  className,
}: {
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasActive = options.some((option) => option.value === value);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const nextIndex = getRovingIndex(event.key, index, options.length);
    if (nextIndex === null) return;
    const nextOption = options[nextIndex];
    if (!nextOption) return;
    event.preventDefault();
    onChange(nextOption.value);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('inline-flex items-center rounded-lg bg-slate-100 p-1', fullWidth && 'flex w-full', className)}
    >
      {options.map((option, index) => {
        const active = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active || (!hasActive && index === 0) ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-[background-color,color,box-shadow]',
              FOCUS_RING_INSET,
              size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3 text-[13px]',
              fullWidth && 'flex-1',
              active ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface TabItem<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

function Tabs<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  className,
}: {
  items: ReadonlyArray<TabItem<T>>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasActive = items.some((item) => item.value === value);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const nextIndex = getRovingIndex(event.key, index, items.length);
    if (nextIndex === null) return;
    const nextItem = items[nextIndex];
    if (!nextItem) return;
    event.preventDefault();
    onChange(nextItem.value);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('erp-scrollbar-none flex items-center gap-1 overflow-x-auto border-b border-slate-200', className)}
    >
      {items.map((item, index) => {
        const active = item.value === value;
        const Icon = item.icon;
        return (
          <button
            key={item.value}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active || (!hasActive && index === 0) ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'relative inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-t-md px-3 text-[13px] font-medium transition-colors',
              FOCUS_RING_INSET,
              active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {Icon && <Icon className={cn('h-4 w-4', active ? 'text-indigo-600' : 'text-slate-400')} aria-hidden="true" />}
            {item.label}
            {typeof item.count === 'number' && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-px text-[11px] font-semibold tabular-nums',
                  active ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500',
                )}
              >
                {item.count}
              </span>
            )}
            <span
              aria-hidden="true"
              className={cn('absolute inset-x-2 bottom-0 h-0.5 rounded-full', active ? 'bg-indigo-600' : 'bg-transparent')}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Search & filters ---------------- */

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  loading?: boolean;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  trailing?: ReactNode;
}

function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  label = 'Search',
  loading = false,
  className,
  inputClassName,
  autoFocus,
  onKeyDown,
  onFocus,
  trailing,
}: SearchInputProps) {
  const inputId = useId();

  return (
    <div className={cn('relative flex items-center', className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" aria-hidden="true" />
      <input
        id={inputId}
        type="search"
        value={value}
        autoFocus={autoFocus}
        maxLength={80}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        className={cn(
          INPUT_BASE,
          INPUT_VALID,
          'h-10 pl-9 pr-10 sm:h-9 [&::-webkit-search-cancel-button]:hidden',
          inputClassName,
        )}
      />
      <div className="absolute right-2 flex items-center gap-1">
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" aria-hidden="true" />}
        {!loading && value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className={cn(
              'grid h-6 w-6 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700',
              FOCUS_RING,
            )}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
        {trailing}
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<SelectOption>;
  allLabel?: string;
  icon?: LucideIcon;
  className?: string;
}

function FilterSelect({ label, value, onChange, options, allLabel, icon: Icon, className }: FilterSelectProps) {
  const selectId = useId();
  const active = value !== '';

  return (
    <div className={cn('relative shrink-0', className)}>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      {Icon && (
        <Icon
          className={cn('pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2', active ? 'text-indigo-500' : 'text-slate-400')}
          aria-hidden="true"
        />
      )}
      <select
        id={selectId}
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
        className={cn(
          'h-10 w-full min-w-[9.5rem] cursor-pointer appearance-none rounded-lg border bg-white pr-8 text-[13px] font-medium transition-[border-color,background-color,box-shadow] focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 sm:h-9',
          Icon ? 'pl-8' : 'pl-3',
          active ? 'border-indigo-200 bg-indigo-50/60 text-indigo-700' : 'border-slate-200 text-slate-700 hover:border-slate-300',
        )}
      >
        <option value="">{allLabel ?? `All ${label.toLowerCase()}`}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
    </div>
  );
}

function FilterBar({
  search,
  children,
  activeCount = 0,
  onReset,
  trailing,
  className,
}: {
  search?: ReactNode;
  children?: ReactNode;
  activeCount?: number;
  onReset?: () => void;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2.5 lg:flex-row lg:items-center', className)}>
      {search && <div className="w-full lg:max-w-xs">{search}</div>}
      {(children || onReset) && (
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            role="group"
            aria-label="Filters"
            className="erp-scrollbar-none flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-0.5 py-1 lg:flex-wrap lg:overflow-visible"
          >
            {children}
          </div>
          {onReset && activeCount > 0 && (
            <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onReset} className="shrink-0">
              <span className="hidden sm:inline">Reset</span>
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold text-white">
                {activeCount}
              </span>
            </Button>
          )}
        </div>
      )}
      {trailing && <div className="flex shrink-0 flex-wrap items-center gap-2">{trailing}</div>}
    </div>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="hidden h-5 items-center rounded border border-slate-200 bg-slate-50 px-1.5 font-sans text-[10px] font-medium text-slate-500 sm:inline-flex">
      {children}
    </kbd>
  );
}

/* ---------------- Pagination ---------------- */

type PageToken = number | 'ellipsis-start' | 'ellipsis-end';

function getPageTokens(current: number, total: number): PageToken[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const tokens: PageToken[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) tokens.push('ellipsis-start');
  for (let page = start; page <= end; page += 1) tokens.push(page);
  if (end < total - 1) tokens.push('ellipsis-end');
  tokens.push(total);
  return tokens;
}

function usePagination<T>(items: readonly T[], initialPageSize = 10, resetKey = '') {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = clamp(page, 1, totalPages);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const pageItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize],
  );

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  return { page: currentPage, setPage, pageSize, setPageSize, totalPages, pageItems, totalItems: items.length };
}

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: readonly number[];
  itemLabel?: string;
  className?: string;
}

function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  itemLabel = 'records',
  className,
}: PaginationProps) {
  const pageSizeId = useId();
  if (totalItems === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(totalItems, page * pageSize);
  const tokens = getPageTokens(page, totalPages);
  const navButtonClass = cn(
    'inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-45 sm:h-8 sm:min-w-8',
    FOCUS_RING,
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'erp-print-hidden flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>
          Showing{' '}
          <span className="font-medium tabular-nums text-slate-700">
            {from}–{to}
          </span>{' '}
          of <span className="font-medium tabular-nums text-slate-700">{totalItems}</span> {itemLabel}
        </span>
        {onPageSizeChange && (
          <span className="hidden items-center gap-1.5 sm:flex">
            <label htmlFor={pageSizeId}>Rows</label>
            <select
              id={pageSizeId}
              value={pageSize}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => onPageSizeChange(Number(event.target.value))}
              className="h-8 cursor-pointer rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-1.5 sm:justify-end">
        <button
          type="button"
          className={navButtonClass}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="sm:hidden">Prev</span>
        </button>

        <span className="text-xs font-medium tabular-nums text-slate-600 sm:hidden">
          Page {page} of {totalPages}
        </span>

        <div className="hidden items-center gap-1 sm:flex">
          {tokens.map((token) =>
            typeof token === 'number' ? (
              <button
                key={token}
                type="button"
                onClick={() => onPageChange(token)}
                aria-label={`Page ${token}`}
                aria-current={token === page ? 'page' : undefined}
                className={cn(
                  'h-8 min-w-8 rounded-lg px-2 text-[13px] font-medium tabular-nums transition-colors',
                  FOCUS_RING,
                  token === page ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                {token}
              </button>
            ) : (
              <span key={token} className="px-1 text-slate-400" aria-hidden="true">
                …
              </span>
            ),
          )}
        </div>

        <button
          type="button"
          className={navButtonClass}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <span className="sm:hidden">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

/* ---------------- Badges, avatars & amounts ---------------- */

function Badge({
  tone = 'neutral',
  dot = false,
  icon: Icon,
  children,
  className,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  const style = BADGE_TONES[tone];
  return (
    <span className={cn(PILL_BASE, style.pill, className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden="true" />}
      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {children}
    </span>
  );
}

function AttendanceBadge({ status }: { status: AttendanceStatus }) {
  const style = ATTENDANCE_STYLES[status];
  return (
    <span className={cn(PILL_BASE, style.pill)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden="true" />
      {status}
    </span>
  );
}

function StageBadge({ stage }: { stage: ProjectStage }) {
  const style = STAGE_STYLES[stage];
  return (
    <span className={cn(PILL_BASE, style.pill)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden="true" />
      {stage}
    </span>
  );
}

function StockBadge({ status }: { status: StockStatus }) {
  const style = STOCK_STYLES[status];
  return (
    <span className={cn(PILL_BASE, style.pill)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden="true" />
      {status}
    </span>
  );
}

function WorkerStatusBadge({ status }: { status: WorkerStatus }) {
  return <span className={cn(PILL_BASE, WORKER_STATUS_STYLES[status])}>{status}</span>;
}

function DirectionBadge({ direction }: { direction: TransactionDirection }) {
  const isCredit = direction === 'credit';
  return (
    <span
      title={DIRECTION_LABELS[direction]}
      className={cn(
        PILL_BASE,
        isCredit ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-rose-50 text-rose-700 ring-rose-600/20',
      )}
    >
      {isCredit ? (
        <ArrowDownLeft className="h-3 w-3" aria-hidden="true" />
      ) : (
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      )}
      {isCredit ? 'Credit' : 'Debit'}
    </span>
  );
}

function CountBadge({ count, tone = 'neutral' }: { count: number; tone?: 'neutral' | 'danger' | 'indigo' }) {
  if (count <= 0) return null;
  const toneClass =
    tone === 'danger' ? 'bg-rose-500 text-white' : tone === 'indigo' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700';
  return (
    <span className={cn('grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums', toneClass)}>
      {count > 99 ? '99+' : count}
    </span>
  );
}

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

const AVATAR_SIZES: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

function Avatar({ name, id, size = 'sm', className }: { name: string; id: string; size?: AvatarSize; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-grid shrink-0 select-none place-items-center rounded-full font-semibold ring-2 ring-white',
        AVATAR_SIZES[size],
        getAvatarTone(id),
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}

function AmountText({
  value,
  tone = 'neutral',
  compact = false,
  showSign = false,
  className,
}: {
  value: number;
  tone?: 'neutral' | 'auto' | 'credit' | 'debit' | 'muted';
  compact?: boolean;
  showSign?: boolean;
  className?: string;
}) {
  const formatted = compact ? formatINRCompact(Math.abs(value)) : formatINR(Math.abs(value));
  const sign = value < 0 ? '−' : showSign && value > 0 ? '+' : '';
  const toneClass =
    tone === 'credit'
      ? 'text-emerald-700'
      : tone === 'debit'
        ? 'text-rose-600'
        : tone === 'muted'
          ? 'text-slate-500'
          : tone === 'auto'
            ? value < 0
              ? 'text-rose-600'
              : value > 0
                ? 'text-emerald-700'
                : 'text-slate-700'
            : 'text-slate-900';

  return (
    <span className={cn('whitespace-nowrap font-medium tabular-nums', toneClass, className)} title={formatINR(value)}>
      {sign}
      {formatted}
    </span>
  );
}

function TrendIndicator({ value, label, invert = false }: { value: number; label?: string; invert?: boolean }) {
  const rounded = Number.isFinite(value) ? roundTo(clamp(value, -999, 999), 1) : 0;

  if (rounded === 0) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">0%</span>
        {label && <span className="text-slate-500">{label}</span>}
      </span>
    );
  }

  const isUp = rounded > 0;
  const isGood = invert ? !isUp : isUp;
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold tabular-nums',
          isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
        )}
      >
        <Icon className="h-3 w-3" aria-hidden="true" />
        {formatPercent(Math.abs(rounded))}
      </span>
      {label && <span className="text-slate-500">{label}</span>}
    </span>
  );
}

function Tooltip({
  content,
  children,
  side = 'top',
  className,
}: {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom';
  className?: string;
}) {
  return (
    <span className={cn('group/tooltip relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-40 w-max max-w-[220px] -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium leading-4 text-white opacity-0 shadow-lg transition-opacity delay-150 duration-150 group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100',
          side === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
        )}
      >
        {content}
      </span>
    </span>
  );
}

/* ---------------- Empty states ---------------- */

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', compact ? 'px-4 py-8' : 'px-6 py-14', className)}>
      <div className="relative mb-4">
        <span className="absolute inset-0 -m-2 rounded-3xl bg-slate-100/70" aria-hidden="true" />
        <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-[13px] leading-5 text-slate-500">{description}</p>}
      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {secondaryAction && (
            <Button variant="outline" size="sm" icon={secondaryAction.icon} onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button size="sm" icon={action.icon ?? Plus} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Cards & layout ---------------- */

type CardPadding = 'none' | 'sm' | 'md';

const CARD_PADDING: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5',
};

interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  padding?: CardPadding;
  interactive?: boolean;
}

function Card({ padding = 'md', interactive = false, className, children, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        'erp-print-card min-w-0 rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
        CARD_PADDING[padding],
        interactive && 'transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-md',
        className,
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  description,
  icon: Icon,
  iconTone = 'slate',
  action,
  className,
}: {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  iconTone?: IconTone;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset', ICON_TONES[iconTone])}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {description && <div className="mt-0.5 text-xs leading-5 text-slate-500">{description}</div>}
        </div>
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}

function SectionHeading({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-slate-500">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}

interface DetailItem {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

function DetailList({ items, columns = 2, className }: { items: ReadonlyArray<DetailItem>; columns?: 2 | 3; className?: string }) {
  return (
    <dl
      className={cn(
        'grid gap-x-6 gap-y-4',
        columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2',
        className,
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isEmpty = item.value === '' || item.value === null || item.value === undefined;
        return (
          <div key={item.label} className={cn('min-w-0', item.fullWidth && 'sm:col-span-full')}>
            <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />}
              {item.label}
            </dt>
            <dd className="mt-1 break-words text-sm text-slate-900">{isEmpty ? '—' : item.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}

/* ---------------- KPI / stat primitives ---------------- */

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: IconTone;
  trend?: { value: number; label?: string; invert?: boolean };
  secondary?: ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

function StatCard({ label, value, icon: Icon, tone = 'indigo', trend, secondary, loading = false, onClick, className }: StatCardProps) {
  if (loading) return <KpiCardSkeleton />;

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-medium leading-5 text-slate-500 sm:text-[13px]">{label}</p>
        <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-xl ring-1 ring-inset sm:h-9 sm:w-9', ICON_TONES[tone])}>
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-1.5 truncate text-lg font-semibold tracking-tight text-slate-900 tabular-nums sm:mt-2 sm:text-2xl" title={value}>
        {value}
      </p>
      {(trend || secondary) && (
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-[11px] sm:text-xs">
          {trend && <TrendIndicator value={trend.value} label={trend.label} invert={trend.invert} />}
          {secondary && <span className="min-w-0 truncate text-slate-500">{secondary}</span>}
        </div>
      )}
    </>
  );

  const baseClass = cn(
    'erp-print-card flex h-full min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5',
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        data-animate
        onClick={onClick}
        className={cn(baseClass, 'transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-md', FOCUS_RING)}
      >
        {content}
      </button>
    );
  }

  return (
    <div data-animate className={baseClass}>
      {content}
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone = 'slate',
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  tone?: IconTone;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 sm:px-4 sm:py-3', className)}>
      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span className={cn('h-2 w-2 shrink-0 rounded-full', DOT_TONES[tone])} aria-hidden="true" />
        <span className="truncate">{label}</span>
      </p>
      <p className="mt-1 truncate text-lg font-semibold tabular-nums text-slate-900">{value}</p>
      {hint && <p className="truncate text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

/* ---------------- Progress ---------------- */

function getUtilisationTone(percent: number): ProgressTone {
  if (percent > 100) return 'rose';
  if (percent >= 85) return 'amber';
  return 'emerald';
}

function ProgressBar({
  value,
  max = 100,
  tone = 'indigo',
  size = 'md',
  label,
  valueLabel,
  showValue = false,
  className,
}: {
  value: number;
  max?: number;
  tone?: ProgressTone;
  size?: 'xs' | 'sm' | 'md';
  label?: string;
  valueLabel?: string;
  showValue?: boolean;
  className?: string;
}) {
  const percent = clamp(safeDivide(value, max) * 100, 0, 100);
  const heightClass = size === 'xs' ? 'h-1' : size === 'sm' ? 'h-1.5' : 'h-2';
  const showHeader = Boolean(label && showValue) || Boolean(valueLabel);

  return (
    <div className={cn('w-full min-w-0', className)}>
      {showHeader && (
        <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
          {label && <span className="truncate font-medium text-slate-600">{label}</span>}
          <span className="shrink-0 font-semibold tabular-nums text-slate-900">
            {valueLabel ?? formatPercent(safeDivide(value, max) * 100)}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label ?? 'Progress'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        className={cn('w-full overflow-hidden rounded-full bg-slate-100', heightClass)}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500 ease-out', PROGRESS_TONES[tone])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function RingProgress({
  value,
  size = 128,
  strokeWidth = 10,
  color = CHART_COLORS.value,
  trackColor = '#eef2f6',
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label: string;
  sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = clamp(Number.isFinite(value) ? value : 0, 0, 100);
  const offset = circumference * (1 - percent / 100);

  return (
    <div
      role="img"
      aria-label={`${label}: ${formatPercent(percent)}`}
      className="relative inline-grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="text-xl font-semibold tabular-nums text-slate-900">{formatPercent(percent)}</span>
        {sublabel && <span className="text-[11px] text-slate-500">{sublabel}</span>}
      </div>
    </div>
  );
}

/* ---------------- Charts ---------------- */

const CHART_AXIS_PROPS = {
  tick: { fill: CHART_COLORS.axis, fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

const CHART_GRID_PROPS = {
  strokeDasharray: '3 3',
  stroke: CHART_COLORS.grid,
  vertical: false,
} as const;

function formatAxisINR(value: number): string {
  return formatINRCompact(value);
}

interface ChartTooltipPayloadItem {
  name?: string | number;
  value?: number | string | ReadonlyArray<number | string>;
  color?: string;
  fill?: string;
  dataKey?: string | number;
  payload?: unknown;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<ChartTooltipPayloadItem>;
  label?: string | number;
  valueFormatter?: (value: number, name: string) => string;
  labelFormatter?: (label: string) => string;
  hideZero?: boolean;
  showTotal?: boolean;
}

/** Pass as `content={<ChartTooltip />}` so Recharts injects active/payload/label. */
function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = (value) => formatINR(value),
  labelFormatter,
  hideZero = false,
  showTotal = false,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const rows = payload
    .map((item, index) => {
      const numeric = typeof item.value === 'number' ? item.value : typeof item.value === 'string' ? Number(item.value) : 0;
      const nestedFill = isRecordObject(item.payload) && typeof item.payload.fill === 'string' ? item.payload.fill : undefined;
      return {
        key: `${String(item.dataKey ?? item.name ?? 'value')}-${index}`,
        name: String(item.name ?? item.dataKey ?? ''),
        value: Number.isFinite(numeric) ? numeric : 0,
        color: item.color ?? item.fill ?? nestedFill ?? CHART_COLORS.axis,
      };
    })
    .filter((row) => !hideZero || row.value !== 0);

  if (rows.length === 0) return null;

  const heading = label === undefined || label === '' ? '' : labelFormatter ? labelFormatter(String(label)) : String(label);
  const total = sumBy(rows, (row) => row.value);

  return (
    <div className="min-w-[170px] rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 text-xs shadow-lg shadow-slate-900/10 backdrop-blur">
      {heading && <p className="mb-1.5 font-semibold text-slate-900">{heading}</p>}
      <ul className="space-y-1">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center justify-between gap-4">
            <span className="flex min-w-0 items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 shrink-0 rounded-[3px]" style={{ backgroundColor: row.color }} aria-hidden="true" />
              <span className="truncate">{row.name}</span>
            </span>
            <span className="font-semibold tabular-nums text-slate-900">{valueFormatter(row.value, row.name)}</span>
          </li>
        ))}
      </ul>
      {showTotal && rows.length > 1 && (
        <div className="mt-1.5 flex items-center justify-between gap-4 border-t border-slate-100 pt-1.5">
          <span className="font-medium text-slate-500">Total</span>
          <span className="font-semibold tabular-nums text-slate-900">{valueFormatter(total, 'Total')}</span>
        </div>
      )}
    </div>
  );
}

interface ChartLegendItem {
  label: string;
  color: string;
  value?: string;
}

function ChartLegend({ items, className }: { items: ReadonlyArray<ChartLegendItem>; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: item.color }} aria-hidden="true" />
          {item.label}
          {item.value && <span className="font-semibold tabular-nums text-slate-900">{item.value}</span>}
        </li>
      ))}
    </ul>
  );
}

function ChartCard({
  title,
  description,
  action,
  legend,
  children,
  footer,
  loading = false,
  isEmpty = false,
  emptyTitle = 'No data for this period',
  emptyDescription = 'Try a different date range or filter.',
  height = 280,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  legend?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  height?: number;
  className?: string;
}) {
  return (
    <Card padding="none" data-animate className={cn('flex flex-col', className)}>
      <div className="flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:pt-5">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
        {action && <div className="erp-print-hidden shrink-0">{action}</div>}
      </div>
      {legend && !loading && !isEmpty && <div className="px-4 pt-3 sm:px-5">{legend}</div>}
      <div className="min-w-0 flex-1 px-2 pb-3 pt-3 sm:px-3">
        <div className="w-full min-w-0" style={{ height }}>
          {loading ? (
            <ChartSkeleton height={height} />
          ) : isEmpty ? (
            <EmptyState icon={BarChart3} title={emptyTitle} description={emptyDescription} compact className="h-full" />
          ) : (
            children
          )}
        </div>
      </div>
      {footer && <div className="border-t border-slate-100 px-4 py-3 sm:px-5">{footer}</div>}
    </Card>
  );
}

/* ---------------- Responsive data table ---------------- */

type ColumnAlign = 'left' | 'right' | 'center';

const ALIGN_CLASSES: Record<ColumnAlign, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

const TABLE_BREAKPOINTS = {
  md: { table: 'hidden md:block', cards: 'md:hidden' },
  lg: { table: 'hidden lg:block', cards: 'lg:hidden' },
} as const;

interface TableColumn<T> {
  key: string;
  header: ReactNode;
  render: (row: T, index: number) => ReactNode;
  align?: ColumnAlign;
  sortKey?: string;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: ReadonlyArray<TableColumn<T>>;
  rows: readonly T[];
  getRowKey: (row: T) => string;
  renderMobileCard?: (row: T, index: number) => ReactNode;
  mobileBreakpoint?: keyof typeof TABLE_BREAKPOINTS;
  loading?: boolean;
  skeletonRows?: number;
  emptyState?: ReactNode;
  sort?: SortState | null;
  onSortChange?: (key: string) => void;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  caption?: string;
  footer?: ReactNode;
  maxHeightClassName?: string;
  minWidthClassName?: string;
  dense?: boolean;
}

function SortableHeader({
  label,
  active,
  direction,
  align = 'left',
  onClick,
}: {
  label: ReactNode;
  active: boolean;
  direction: SortDirection;
  align?: ColumnAlign;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group inline-flex items-center gap-1 rounded uppercase tracking-wide transition-colors hover:text-slate-900',
        FOCUS_RING,
        align === 'right' && 'flex-row-reverse',
        active ? 'text-slate-900' : 'text-slate-500',
      )}
    >
      {label}
      {active ? (
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform', direction === 'asc' && 'rotate-180')}
          aria-hidden="true"
        />
      ) : (
        <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-500" aria-hidden="true" />
      )}
    </button>
  );
}

function DataTable<T>({
  columns,
  rows,
  getRowKey,
  renderMobileCard,
  mobileBreakpoint = 'md',
  loading = false,
  skeletonRows = 5,
  emptyState,
  sort = null,
  onSortChange,
  onRowClick,
  rowClassName,
  caption,
  footer,
  maxHeightClassName = 'max-h-[68vh]',
  minWidthClassName = 'min-w-[760px]',
  dense = false,
}: DataTableProps<T>) {
  const breakpoint = TABLE_BREAKPOINTS[mobileBreakpoint];
  const hasCards = Boolean(renderMobileCard);

  if (!loading && rows.length === 0 && emptyState) return <>{emptyState}</>;

  const cellPadding = dense ? 'px-4 py-2' : 'px-4 py-3';

  return (
    <div className="min-w-0">
      <div className={cn(hasCards ? breakpoint.table : 'block', 'erp-scroll-thin erp-print-expand overflow-auto', maxHeightClassName)}>
        <table className={cn('w-full border-separate border-spacing-0 text-sm', minWidthClassName)}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr>
              {columns.map((column) => {
                const isSorted = Boolean(column.sortKey) && sort?.key === column.sortKey;
                const ariaSort = column.sortKey
                  ? isSorted
                    ? sort?.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                  : undefined;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cn(
                      'sticky top-0 z-10 whitespace-nowrap border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500',
                      ALIGN_CLASSES[column.align ?? 'left'],
                      column.headerClassName,
                    )}
                  >
                    {column.sortKey && onSortChange ? (
                      <SortableHeader
                        label={column.header}
                        active={isSorted}
                        direction={sort?.direction ?? 'asc'}
                        align={column.align}
                        onClick={() => {
                          if (column.sortKey) onSortChange(column.sortKey);
                        }}
                      />
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeletonRows rows={skeletonRows} columns={columns.length} />
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-500">
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={getRowKey(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.target !== event.currentTarget) return;
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  className={cn(
                    'group transition-colors hover:bg-slate-50/80',
                    onRowClick && cn('cursor-pointer', FOCUS_RING_INSET),
                    rowClassName?.(row),
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'border-b border-slate-100 align-middle text-slate-700',
                        cellPadding,
                        ALIGN_CLASSES[column.align ?? 'left'],
                        column.className,
                      )}
                    >
                      {column.render(row, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {renderMobileCard && (
        <div className={cn(breakpoint.cards, 'space-y-2.5 p-3')}>
          {loading
            ? Array.from({ length: Math.min(skeletonRows, 4) }, (_, index) => <MobileCardSkeleton key={index} />)
            : rows.length === 0
              ? <p className="py-8 text-center text-sm text-slate-500">No records found.</p>
              : rows.map((row, index) => <div key={getRowKey(row)}>{renderMobileCard(row, index)}</div>)}
        </div>
      )}

      {footer}
    </div>
  );
}

interface MobileRecordField {
  label: string;
  value: ReactNode;
  className?: string;
}

function MobileRecordCard({
  title,
  subtitle,
  leading,
  badge,
  fields = [],
  actions,
  footer,
  onClick,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  badge?: ReactNode;
  fields?: ReadonlyArray<MobileRecordField>;
  actions?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const heading = (
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
      {subtitle && <p className="mt-0.5 truncate text-xs text-slate-500">{subtitle}</p>}
    </div>
  );

  return (
    <div className={cn('rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]', className)}>
      <div className="flex items-start gap-3">
        {leading}
        {onClick ? (
          <button type="button" onClick={onClick} className={cn('min-w-0 flex-1 rounded-md text-left', FOCUS_RING)}>
            {heading}
          </button>
        ) : (
          heading
        )}
        {badge && <div className="shrink-0">{badge}</div>}
        {actions && <RowActions className="-mr-1.5 -mt-1 shrink-0">{actions}</RowActions>}
      </div>
      {fields.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-slate-100 pt-3">
          {fields.map((field) => (
            <div key={field.label} className={cn('min-w-0', field.className)}>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{field.label}</dt>
              <dd className="mt-0.5 truncate text-[13px] font-medium text-slate-800">{field.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {footer && <div className="mt-3 border-t border-slate-100 pt-3">{footer}</div>}
    </div>
  );
}

/* ---------------- Section transition ---------------- */

/**
 * Fades the section in and staggers any `[data-animate]` children whenever
 * `animationKey` changes. Transforms are cleared afterwards so fixed-position
 * popovers inside the section keep positioning against the viewport.
 */
function AnimatedSection({
  animationKey,
  children,
  className,
}: {
  animationKey: string;
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        container,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'transform,opacity' },
      );
      const items = container.querySelectorAll('[data-animate]');
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: 0.04,
            stagger: { each: 0.035, amount: 0.35 },
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
        );
      }
    }, container);

    return () => context.revert();
  }, [animationKey, reducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/* ========================================================= */
/* App Context & Section Contracts                           */
/* ========================================================= */

type RecordKind = 'worker' | 'project' | 'workEntry' | 'transaction' | 'expense' | 'material';

type Draft<T extends { id: string }> = Omit<T, 'id'> & { id?: string };

type ProjectDetailTab =
  | 'overview'
  | 'analytics'
  | 'workers'
  | 'attendance'
  | 'work'
  | 'materials'
  | 'expenses'
  | 'payments';

interface DeleteTarget {
  kind: RecordKind;
  id: string;
  label: string;
  description?: string;
}

/** Form modals rendered by the main page (Part 4). `record: null` means create. */
type ModalState =
  | { kind: 'worker'; record: Worker | null }
  | { kind: 'project'; record: Project | null }
  | { kind: 'workEntry'; record: WorkEntry | null; defaults?: Partial<WorkEntry> }
  | { kind: 'transaction'; record: Transaction | null; defaults?: Partial<Transaction> }
  | { kind: 'expense'; record: Expense | null; defaults?: Partial<Expense> }
  | { kind: 'material'; record: Material | null }
  | { kind: 'stock'; material: Material; movementType: MovementType };

/** Passed with navigation so the target section can open a record (used by global search and cross-links). */
interface NavigationFocus {
  workerId?: string;
  projectId?: string;
  projectTab?: ProjectDetailTab;
  materialId?: string;
}

interface AttendanceInput {
  workerId: string;
  projectId: string;
  date: string;
  status: AttendanceStatus;
  overtimeHours: number;
  notes: string;
}

type MutationResult = { ok: true } | { ok: false; error: string };

interface ErpContextValue {
  data: AppData;
  analytics: Analytics;
  /** False until client-side data is initialised; sections show skeletons meanwhile. */
  ready: boolean;
  /** Real current date on the client. */
  today: string;
  /** Working date chosen in the header date selector. */
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  focus: NavigationFocus | null;
  consumeFocus: () => void;
  /** Incremented by the header "Add New" button for the active section. */
  primaryAction: { section: SectionKey; nonce: number };
  navigate: (section: SectionKey, focus?: NavigationFocus) => void;
  openModal: (modal: ModalState) => void;
  requestDelete: (target: DeleteTarget) => void;
  /** Inserts or replaces the record for each worker + date. Consecutive calls are merged into one activity entry. */
  upsertAttendance: (entries: readonly AttendanceInput[]) => void;
  removeAttendance: (workerIds: readonly string[], date: string) => void;
  saveWorker: (draft: Draft<Worker>) => Worker;
  saveProject: (draft: Draft<Project>) => Project;
  saveWorkEntry: (draft: Draft<WorkEntry>) => WorkEntry;
  saveTransaction: (draft: Draft<Transaction>) => Transaction;
  saveExpense: (draft: Draft<Expense>) => Expense;
  /** Rejects edits that would make remaining stock negative. */
  saveMaterial: (draft: Draft<Material>) => MutationResult;
  /** Rejects usage larger than remaining stock. */
  recordMovement: (movement: Omit<MaterialMovement, 'id'>) => MutationResult;
  /** Removes the record plus dependent rows (e.g. a worker's attendance, work and ledger). */
  deleteRecord: (kind: RecordKind, id: string) => void;
  updateSettings: (settings: AppSettings) => void;
  resetData: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const ErpContext = createContext<ErpContextValue | null>(null);

function useErp(): ErpContextValue {
  const context = useContext(ErpContext);
  if (!context) throw new Error('useErp must be used inside the ERP provider.');
  return context;
}

/* ---------------- Section helpers ---------------- */

const OFFICE_FILTER = '__office__';

const CATEGORY_PALETTE: readonly string[] = [
  '#6366f1',
  '#f59e0b',
  '#0ea5e9',
  '#10b981',
  '#f43f5e',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
  '#64748b',
  '#ec4899',
];

const ATTENDANCE_SHORT_LABELS: Record<AttendanceStatus, string> = {
  Present: 'Present',
  Absent: 'Absent',
  'Half Day': 'Half',
  Leave: 'Leave',
};

const ACTIVITY_META: Record<ActivityType, { icon: LucideIcon; tone: IconTone }> = {
  worker: { icon: HardHat, tone: 'indigo' },
  attendance: { icon: CalendarCheck, tone: 'emerald' },
  work: { icon: ClipboardList, tone: 'sky' },
  payment: { icon: Wallet, tone: 'violet' },
  project: { icon: Building2, tone: 'indigo' },
  material: { icon: Package, tone: 'amber' },
  expense: { icon: Receipt, tone: 'rose' },
  system: { icon: Settings, tone: 'slate' },
};

function isOneOf<T extends string>(value: string, options: readonly T[]): value is T {
  return (options as readonly string[]).includes(value);
}

function matchesQuery(query: string, ...fields: ReadonlyArray<string | number | undefined>): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return fields.some((field) => field !== undefined && String(field).toLowerCase().includes(needle));
}

function countActive(...values: readonly string[]): number {
  return values.filter((value) => value !== '').length;
}

function truncateLabel(value: string, max = 12): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function getProjectName(analytics: Analytics, projectId: string, fallback = 'Unassigned'): string {
  if (!projectId) return fallback;
  return analytics.projectsById[projectId]?.name ?? 'Removed project';
}

function getWorkerName(analytics: Analytics, workerId: string): string {
  return analytics.workersById[workerId]?.name ?? 'Removed worker';
}

function buildProjectOptions(projects: readonly Project[]): SelectOption[] {
  return [...projects].sort((a, b) => a.name.localeCompare(b.name)).map((project) => ({ value: project.id, label: project.name }));
}

function buildWorkerOptions(workers: readonly Worker[]): SelectOption[] {
  return [...workers]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((worker) => ({ value: worker.id, label: `${worker.name} · ${worker.trade}` }));
}

function normalizeDateRange(from: string, to: string): { start: string; end: string } {
  const start = from && isValidISODate(from) ? from : '0000-01-01';
  const end = to && isValidISODate(to) ? to : '9999-12-31';
  return start <= end ? { start, end } : { start: end, end: start };
}

function formatQuantity(quantity: number, unit: string): string {
  return `${formatNumber(quantity)} ${unit}`;
}

/** Keeps the last non-null value so modal content stays visible during the close animation. */
function useRetainedValue<T>(value: T | null): T | null {
  const [retained, setRetained] = useState<T | null>(value);
  useEffect(() => {
    if (value !== null) setRetained(value);
  }, [value]);
  return value ?? retained;
}

/** Briefly shows skeleton rows when filters change, simulating a data reload. */
function useSoftReload(key: string, delayMs = 320): boolean {
  const [loading, setLoading] = useState(false);
  const firstRunRef = useRef(true);

  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), delayMs);
    return () => window.clearTimeout(timer);
  }, [key, delayMs]);

  return loading;
}

function usePrimaryAction(section: SectionKey, handler: () => void): void {
  const { primaryAction } = useErp();
  const handlerRef = useLatestRef(handler);
  const lastNonceRef = useRef(primaryAction.nonce);

  useEffect(() => {
    if (primaryAction.nonce === lastNonceRef.current) return;
    lastNonceRef.current = primaryAction.nonce;
    if (primaryAction.section === section) handlerRef.current();
  }, [primaryAction, section, handlerRef]);
}

/** Handler returns true when it used the focus, which then gets cleared. */
function useNavigationFocus(handler: (focus: NavigationFocus) => boolean): void {
  const { focus, consumeFocus } = useErp();
  const handlerRef = useLatestRef(handler);

  useEffect(() => {
    if (!focus) return;
    if (handlerRef.current(focus)) consumeFocus();
  }, [focus, consumeFocus, handlerRef]);
}

interface ProductivityRow {
  key: string;
  workerId: string;
  unit: string;
  quantity: number;
  days: number;
  perDay: number;
  entries: number;
}

/** Productivity for a filtered set of entries: quantity ÷ effective attendance days on dates with work. */
function computeProductivityRows(
  entries: readonly WorkEntry[],
  attendance: readonly AttendanceRecord[],
): ProductivityRow[] {
  const factorByWorkerDate = new Map<string, number>();
  for (const record of attendance) {
    const key = `${record.workerId}|${record.date}`;
    factorByWorkerDate.set(key, Math.max(factorByWorkerDate.get(key) ?? 0, ATTENDANCE_FACTOR[record.status]));
  }

  const groups = new Map<string, { workerId: string; unit: string; quantity: number; dates: Set<string>; entries: number }>();
  for (const entry of entries) {
    const unit = getWorkUnitLabel(entry.unit, entry.customUnit);
    const key = `${entry.workerId}|${unit}`;
    const group = groups.get(key) ?? { workerId: entry.workerId, unit, quantity: 0, dates: new Set<string>(), entries: 0 };
    group.quantity += entry.quantity;
    group.dates.add(entry.date);
    group.entries += 1;
    groups.set(key, group);
  }

  const rows: ProductivityRow[] = [];
  groups.forEach((group, key) => {
    let days = 0;
    group.dates.forEach((date) => {
      const factor = factorByWorkerDate.get(`${group.workerId}|${date}`);
      days += factor && factor > 0 ? factor : 1;
    });
    rows.push({
      key,
      workerId: group.workerId,
      unit: group.unit,
      quantity: group.quantity,
      days,
      perDay: group.unit === 'day' ? 0 : roundTo(safeDivide(group.quantity, days), 1),
      entries: group.entries,
    });
  });

  return rows.sort((a, b) => b.perDay - a.perDay);
}

interface LedgerRow {
  id: string;
  date: string;
  source: 'attendance' | 'transaction';
  title: string;
  detail: string;
  projectId: string;
  mode: PaymentMode | '';
  credit: number;
  debit: number;
  balance: number;
  transaction: Transaction | null;
}

/**
 * Attendance wages are folded into read-only weekly credit rows so the running
 * balance matches `WorkerMetrics.payable` exactly, without duplicating wages as transactions.
 */
function buildLedgerRows(data: AppData, worker: Worker): LedgerRow[] {
  const weeks = new Map<string, { amount: number; days: number; overtime: number; lastDate: string; projectId: string }>();

  for (const record of data.attendance) {
    if (record.workerId !== worker.id) continue;
    const amount = calculateAttendanceWage(record, worker.dailyWage, data.settings);
    if (amount <= 0) continue;
    const key = `${startOfWeekISO(record.date)}|${record.projectId}`;
    const group = weeks.get(key) ?? { amount: 0, days: 0, overtime: 0, lastDate: record.date, projectId: record.projectId };
    group.amount += amount;
    group.days += ATTENDANCE_FACTOR[record.status];
    group.overtime += Math.max(0, record.overtimeHours);
    if (record.date > group.lastDate) group.lastDate = record.date;
    weeks.set(key, group);
  }

  const rows: LedgerRow[] = [];
  weeks.forEach((group, key) => {
    const weekStart = key.split('|')[0] ?? group.lastDate;
    const overtimeText = group.overtime > 0 ? ` + ${formatNumber(group.overtime)} hr OT` : '';
    rows.push({
      id: `wages-${key}`,
      date: group.lastDate,
      source: 'attendance',
      title: 'Attendance wages',
      detail: `${formatNumber(group.days)} day${group.days === 1 ? '' : 's'}${overtimeText} · week of ${formatDateShort(weekStart)}`,
      projectId: group.projectId,
      mode: '',
      credit: group.amount,
      debit: 0,
      balance: 0,
      transaction: null,
    });
  });

  for (const transaction of data.transactions) {
    if (transaction.workerId !== worker.id) continue;
    const amount = Math.max(0, transaction.amount);
    rows.push({
      id: transaction.id,
      date: transaction.date,
      source: 'transaction',
      title: transaction.type,
      detail: transaction.notes || transaction.id,
      projectId: transaction.projectId,
      mode: transaction.mode,
      credit: transaction.direction === 'credit' ? amount : 0,
      debit: transaction.direction === 'debit' ? amount : 0,
      balance: 0,
      transaction,
    });
  }

  rows.sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    if (a.source !== b.source) return a.source === 'attendance' ? -1 : 1;
    return a.id.localeCompare(b.id);
  });

  let balance = 0;
  for (const row of rows) {
    balance += row.credit - row.debit;
    row.balance = balance;
  }
  return rows;
}

/* ---------------- Section-level shared UI ---------------- */

function WorkerCell({ worker, subtitle }: { worker: Worker; subtitle?: ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={worker.name} id={worker.id} />
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{worker.name}</p>
        <p className="truncate text-xs text-slate-500">{subtitle ?? worker.id}</p>
      </div>
    </div>
  );
}

function DateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
  max,
}: {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  max?: string;
}) {
  const fromId = useId();
  const toId = useId();
  const invalid = Boolean(from && to && from > to);
  const inputClass = (active: boolean) =>
    cn(
      'h-10 w-[8.75rem] rounded-lg border bg-white px-2.5 text-[13px] text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 sm:h-9',
      invalid ? 'border-rose-300' : active ? 'border-indigo-200 bg-indigo-50/60' : 'border-slate-200',
    );

  return (
    <div className="flex shrink-0 items-center gap-1.5" title={invalid ? 'From date is after To date; the range is swapped' : undefined}>
      <label htmlFor={fromId} className="sr-only">
        From date
      </label>
      <input
        id={fromId}
        type="date"
        value={from}
        max={max}
        aria-invalid={invalid || undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onFromChange(event.target.value)}
        className={inputClass(Boolean(from))}
      />
      <span className="text-xs text-slate-400" aria-hidden="true">
        to
      </span>
      <label htmlFor={toId} className="sr-only">
        To date
      </label>
      <input
        id={toId}
        type="date"
        value={to}
        max={max}
        aria-invalid={invalid || undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onToChange(event.target.value)}
        className={inputClass(Boolean(to))}
      />
    </div>
  );
}

function FilterPills<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: ReadonlyArray<{ value: T | ''; label: string; count: number; dot?: string }>;
  value: T | '';
  onChange: (value: T | '') => void;
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="erp-scrollbar-none -mx-1 flex items-center gap-1.5 overflow-x-auto px-1 py-0.5">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value || 'all'}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-[13px] font-medium transition-colors sm:h-8',
              FOCUS_RING,
              active
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900',
            )}
          >
            {option.dot && <span className={cn('h-1.5 w-1.5 rounded-full', option.dot)} aria-hidden="true" />}
            {option.label}
            <span className={cn('text-xs tabular-nums', active ? 'text-slate-300' : 'text-slate-400')}>{option.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function AttendanceStatusPicker({
  value,
  onChange,
  ariaLabel,
  disabled = false,
}: {
  value: AttendanceStatus | null;
  onChange: (status: AttendanceStatus) => void;
  ariaLabel: string;
  disabled?: boolean;
}) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = value ? ATTENDANCE_STATUSES.indexOf(value) : -1;

  return (
    <div role="radiogroup" aria-label={ariaLabel} className="grid grid-cols-4 gap-1.5">
      {ATTENDANCE_STATUSES.map((status, index) => {
        const active = status === value;
        return (
          <button
            key={status}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={status}
            title={status}
            disabled={disabled}
            tabIndex={active || (activeIndex === -1 && index === 0) ? 0 : -1}
            onClick={() => onChange(status)}
            onKeyDown={(event) => {
              const nextIndex = getRovingIndex(event.key, index, ATTENDANCE_STATUSES.length);
              if (nextIndex === null) return;
              const nextStatus = ATTENDANCE_STATUSES[nextIndex];
              if (!nextStatus) return;
              event.preventDefault();
              onChange(nextStatus);
              buttonRefs.current[nextIndex]?.focus();
            }}
            className={cn(
              'h-9 min-w-0 rounded-lg border px-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              FOCUS_RING,
              active ? ATTENDANCE_STYLES[status].active : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
            )}
          >
            {ATTENDANCE_SHORT_LABELS[status]}
          </button>
        );
      })}
    </div>
  );
}

function TableCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card padding="none" data-animate className={cn('overflow-hidden', className)}>
      {title && (
        <div className="border-b border-slate-100 px-4 py-3.5 sm:px-5">
          <CardHeader title={title} description={description} action={action} />
        </div>
      )}
      {children}
    </Card>
  );
}

/* ========================================================= */
/* Dashboard Section                                         */
/* ========================================================= */

interface MoneyFeedItem {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  amount: number;
  flow: 'out' | 'accrual';
  icon: LucideIcon;
  tone: IconTone;
  onOpen: () => void;
}

function DashboardSection() {
  const { data, analytics, ready, today, selectedDate, navigate, openModal } = useErp();
  const now = useNow();
  const [leaderUnit, setLeaderUnit] = useState('sq.ft.');

  usePrimaryAction('dashboard', () => openModal({ kind: 'expense', record: null }));

  const isToday = selectedDate === today;

  const kpis = useMemo(() => {
    const runningCount = data.projects.filter((project) => project.stage === 'Running').length;
    const upcomingCount = data.projects.filter((project) => project.stage === 'Coming Soon').length;
    const completedCount = data.projects.filter((project) => project.stage === 'Completed').length;
    const activeWorkers = data.workers.filter((worker) => worker.status === 'Active').length;

    const day = getAttendanceSummary(data.attendance.filter((record) => record.date === selectedDate));
    let previousMarkedDate = '';
    for (const record of data.attendance) {
      if (record.date < selectedDate && record.date > previousMarkedDate) previousMarkedDate = record.date;
    }
    const previousDay = getAttendanceSummary(data.attendance.filter((record) => record.date === previousMarkedDate));

    const dayCost = sumCostEvents(analytics.costEvents, selectedDate, selectedDate);
    const yesterday = addDays(selectedDate, -1);
    const previousDayCost = sumCostEvents(analytics.costEvents, yesterday, yesterday);
    const month = getRangeBounds('monthly', selectedDate);
    const monthCost = sumCostEvents(analytics.costEvents, month.start, month.end);
    const previousMonthCost = sumCostEvents(analytics.costEvents, month.previousStart, month.previousEnd);

    let outstanding = 0;
    let peopleWithDues = 0;
    for (const metrics of Object.values(analytics.workerMetrics)) {
      if (metrics.payable > 0) {
        outstanding += metrics.payable;
        peopleWithDues += 1;
      }
    }

    return {
      runningCount,
      upcomingCount,
      completedCount,
      totalWorkers: data.workers.length,
      activeWorkers,
      day,
      previousDay,
      dayCost,
      previousDayCost,
      monthCost,
      previousMonthCost,
      outstanding,
      peopleWithDues,
      stockValue: sumBy(Object.values(analytics.materialStock), (stock) => stock.stockValue),
      bookedValue: sumBy(
        data.projects.filter((project) => project.stage !== 'Enquiry'),
        (project) => project.projectValue,
      ),
      enquiryValue: sumBy(
        data.projects.filter((project) => project.stage === 'Enquiry'),
        (project) => project.projectValue,
      ),
    };
  }, [data, analytics, selectedDate]);

  const projectCostData = useMemo(
    () =>
      data.projects
        .filter((project) => project.stage === 'Running' || project.stage === 'Completed')
        .map((project) => ({
          name: project.name,
          Estimated: project.estimatedCost,
          Actual: analytics.projectFinancials[project.id]?.actualCost ?? 0,
          Value: project.projectValue,
        })),
    [data.projects, analytics.projectFinancials],
  );

  const breakdownData = useMemo(
    () => [
      { name: 'Labour', value: kpis.monthCost.labour, color: CHART_COLORS.labour },
      { name: 'Material', value: kpis.monthCost.material, color: CHART_COLORS.material },
      { name: 'Other', value: kpis.monthCost.other, color: CHART_COLORS.other },
    ],
    [kpis.monthCost],
  );

  const monthlyTrend = useMemo(() => buildMonthlyCostTrend(analytics.costEvents, selectedDate, 6), [analytics.costEvents, selectedDate]);

  const runningProjects = useMemo(
    () =>
      data.projects
        .filter((project) => project.stage === 'Running')
        .map((project) => ({ project, financials: analytics.projectFinancials[project.id] }))
        .filter((item): item is { project: Project; financials: ProjectFinancials } => Boolean(item.financials)),
    [data.projects, analytics.projectFinancials],
  );

  const moneyFeed = useMemo<MoneyFeedItem[]>(() => {
    const items: MoneyFeedItem[] = data.transactions.map((transaction) => {
      const isOut = transaction.type === 'Payment' || transaction.type === 'Advance';
      return {
        id: transaction.id,
        date: transaction.date,
        title: `${transaction.type} · ${getWorkerName(analytics, transaction.workerId)}`,
        subtitle: `${transaction.mode} · ${getProjectName(analytics, transaction.projectId)}`,
        amount: transaction.amount,
        flow: isOut ? 'out' : 'accrual',
        icon: transaction.direction === 'debit' ? ArrowUpRight : ArrowDownLeft,
        tone: transaction.direction === 'debit' ? 'rose' : 'emerald',
        onOpen: () => navigate('khata', { workerId: transaction.workerId }),
      };
    });
    for (const expense of data.expenses) {
      items.push({
        id: expense.id,
        date: expense.date,
        title: `${expense.category} · ${expense.vendor}`,
        subtitle: `${expense.mode} · ${getProjectName(analytics, expense.projectId, 'Head office')}`,
        amount: expense.amount,
        flow: 'out',
        icon: expense.category === 'Transport' ? Truck : Receipt,
        tone: 'amber',
        onOpen: () => navigate('expenses'),
      });
    }
    return items.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 7);
  }, [data.transactions, data.expenses, analytics, navigate]);

  const lowStock = useMemo(
    () =>
      data.materials
        .map((material) => ({ material, stock: analytics.materialStock[material.id] }))
        .filter((item): item is { material: Material; stock: MaterialStock } => Boolean(item.stock) && item.stock?.status !== 'In Stock')
        .sort((a, b) => safeDivide(a.stock.remaining, a.material.minStock) - safeDivide(b.stock.remaining, b.material.minStock))
        .slice(0, 5),
    [data.materials, analytics.materialStock],
  );

  const leaderUnits = useMemo(() => {
    const units = new Set<string>();
    for (const metrics of Object.values(analytics.workerMetrics)) {
      if (metrics.productivity > 0) units.add(metrics.primaryUnit);
    }
    return Array.from(units);
  }, [analytics.workerMetrics]);

  const activeLeaderUnit = leaderUnits.includes(leaderUnit) ? leaderUnit : leaderUnits[0] ?? '';

  const leaderboard = useMemo(
    () =>
      data.workers
        .map((worker) => ({ worker, metrics: analytics.workerMetrics[worker.id] }))
        .filter(
          (item): item is { worker: Worker; metrics: WorkerMetrics } =>
            Boolean(item.metrics) && item.metrics?.primaryUnit === activeLeaderUnit && (item.metrics?.productivity ?? 0) > 0,
        )
        .sort((a, b) => b.metrics.productivity - a.metrics.productivity)
        .slice(0, 5),
    [data.workers, analytics.workerMetrics, activeLeaderUnit],
  );

  const activities = useMemo(() => [...data.activities].sort((a, b) => b.timestamp - a.timestamp).slice(0, 7), [data.activities]);

  const unmarkedToday = useMemo(() => {
    const marked = new Set(data.attendance.filter((record) => record.date === selectedDate).map((record) => record.workerId));
    return data.workers.filter((worker) => worker.status === 'Active' && worker.projectId && !marked.has(worker.id)).length;
  }, [data.attendance, data.workers, selectedDate]);

  if (!ready) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <KpiGridSkeleton />
        <div className="grid gap-4 lg:grid-cols-3">
          <ChartCard title="Project Cost Overview" loading className="lg:col-span-2">
            {null}
          </ChartCard>
          <ChartCard title="Expense Breakdown" loading>
            {null}
          </ChartCard>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Card key={index}>
              <ListSkeleton rows={4} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const presentCount = kpis.day.present + kpis.day.halfDay;
  const previousPresent = kpis.previousDay.present + kpis.previousDay.halfDay;

  const kpiCards: StatCardProps[] = [
    {
      label: 'Active Projects',
      value: String(kpis.runningCount),
      icon: Building2,
      tone: 'indigo',
      secondary: `${kpis.upcomingCount} coming soon · ${kpis.completedCount} completed`,
      onClick: () => navigate('projects'),
    },
    {
      label: 'Total Workers',
      value: String(kpis.totalWorkers),
      icon: Users,
      tone: 'sky',
      secondary: `${kpis.activeWorkers} active · ${kpis.totalWorkers - kpis.activeWorkers} inactive`,
      onClick: () => navigate('labour'),
    },
    {
      label: isToday ? 'Present Today' : `Present · ${formatDateShort(selectedDate)}`,
      value: String(presentCount),
      icon: CalendarCheck,
      tone: 'emerald',
      trend: { value: percentChange(presentCount, previousPresent), label: 'vs last day' },
      secondary: `${formatPercent(kpis.day.rate)} rate`,
      onClick: () => navigate('attendance'),
    },
    {
      label: isToday ? "Today's Expense" : `Expense · ${formatDateShort(selectedDate)}`,
      value: formatINR(kpis.dayCost.total),
      icon: Receipt,
      tone: 'rose',
      trend: { value: percentChange(kpis.dayCost.total, kpis.previousDayCost.total), label: 'vs prev day', invert: true },
      onClick: () => navigate('expenses'),
    },
    {
      label: 'Outstanding Salary',
      value: formatINR(kpis.outstanding),
      icon: Wallet,
      tone: 'amber',
      secondary: `${kpis.peopleWithDues} people with dues`,
      onClick: () => navigate('khata'),
    },
    {
      label: 'Material Cost',
      value: formatINR(kpis.monthCost.material),
      icon: Package,
      tone: 'violet',
      trend: { value: percentChange(kpis.monthCost.material, kpis.previousMonthCost.material), label: '30 days', invert: true },
      secondary: `Stock ${formatINRCompact(kpis.stockValue)}`,
      onClick: () => navigate('materials'),
    },
    {
      label: 'Monthly Expense',
      value: formatINR(kpis.monthCost.total),
      icon: BarChart3,
      tone: 'teal',
      trend: { value: percentChange(kpis.monthCost.total, kpis.previousMonthCost.total), label: 'vs prev 30d', invert: true },
      onClick: () => navigate('reports'),
    },
    {
      label: 'Total Project Value',
      value: formatINRCompact(kpis.bookedValue),
      icon: IndianRupee,
      tone: 'indigo',
      secondary: `${formatINRCompact(kpis.enquiryValue)} in enquiries`,
      onClick: () => navigate('projects'),
    },
  ];

  const breakdownTotal = kpis.monthCost.total;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <ChartCard
          title="Project Cost Overview"
          description="Estimated cost, actual cost and contract value for running and completed sites"
          className="lg:col-span-2"
          isEmpty={projectCostData.length === 0}
          legend={
            <ChartLegend
              items={[
                { label: 'Estimated', color: CHART_COLORS.estimated },
                { label: 'Actual', color: CHART_COLORS.actual },
                { label: 'Project value', color: CHART_COLORS.value },
              ]}
            />
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectCostData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2}>
              <CartesianGrid {...CHART_GRID_PROPS} />
              <XAxis dataKey="name" {...CHART_AXIS_PROPS} tickFormatter={(value: string) => truncateLabel(String(value), 11)} />
              <YAxis {...CHART_AXIS_PROPS} tickFormatter={formatAxisINR} width={56} />
              <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip />} />
              <Bar dataKey="Estimated" name="Estimated" fill={CHART_COLORS.estimated} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Actual" name="Actual" fill={CHART_COLORS.actual} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Value" name="Project value" fill={CHART_COLORS.value} radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Expense Breakdown"
          description="Last 30 days across all sites"
          isEmpty={breakdownTotal === 0}
          height={200}
          footer={
            <ul className="space-y-2">
              {breakdownData.map((item) => (
                <li key={item.name} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: item.color }} aria-hidden="true" />
                    {item.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs tabular-nums text-slate-400">{formatPercent(safeDivide(item.value, breakdownTotal) * 100)}</span>
                    <span className="font-semibold tabular-nums text-slate-900">{formatINR(item.value)}</span>
                  </span>
                </li>
              ))}
            </ul>
          }
        >
          <div className="relative h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdownData} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={2} stroke="none">
                  {breakdownData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
              <span className="text-[11px] text-slate-500">Total</span>
              <span className="text-base font-semibold tabular-nums text-slate-900">{formatINRCompact(breakdownTotal)}</span>
            </div>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <ChartCard
          title="Monthly Expense Trend"
          description="Labour, material and other costs over the last 6 months"
          className="lg:col-span-2"
          isEmpty={monthlyTrend.every((point) => point.total === 0)}
          legend={
            <ChartLegend
              items={[
                { label: 'Labour', color: CHART_COLORS.labour },
                { label: 'Material', color: CHART_COLORS.material },
                { label: 'Other', color: CHART_COLORS.other },
              ]}
            />
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...CHART_GRID_PROPS} />
              <XAxis dataKey="label" {...CHART_AXIS_PROPS} />
              <YAxis {...CHART_AXIS_PROPS} tickFormatter={formatAxisINR} width={56} />
              <RechartsTooltip content={<ChartTooltip showTotal />} />
              <Area type="monotone" dataKey="labour" name="Labour" stackId="cost" stroke={CHART_COLORS.labour} fill={CHART_COLORS.labour} fillOpacity={0.18} strokeWidth={2} />
              <Area type="monotone" dataKey="material" name="Material" stackId="cost" stroke={CHART_COLORS.material} fill={CHART_COLORS.material} fillOpacity={0.18} strokeWidth={2} />
              <Area type="monotone" dataKey="other" name="Other" stackId="cost" stroke={CHART_COLORS.other} fill={CHART_COLORS.other} fillOpacity={0.18} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card data-animate className="flex flex-col">
          <CardHeader
            title="Attendance Overview"
            description={isToday ? 'Today across all sites' : formatDate(selectedDate)}
            icon={CalendarCheck}
            iconTone="emerald"
          />
          <div className="mt-4 flex flex-1 flex-col items-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
            <RingProgress value={kpis.day.rate} label="Attendance rate" sublabel="attendance" />
            <div className="grid w-full flex-1 grid-cols-2 gap-2">
              <MiniStat label="Present" value={kpis.day.present} tone="emerald" />
              <MiniStat label="Absent" value={kpis.day.absent} tone="rose" />
              <MiniStat label="Half Day" value={kpis.day.halfDay} tone="amber" />
              <MiniStat label="Leave" value={kpis.day.leave} tone="violet" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <p className="text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{unmarkedToday}</span> active worker{unmarkedToday === 1 ? '' : 's'} not marked
            </p>
            <Button size="xs" variant="outline" iconRight={ChevronRight} onClick={() => navigate('attendance')}>
              Mark
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <TableCard
          title="Running Projects"
          description="Progress, spend and margin per site"
          action={
            <Button size="xs" variant="ghost" iconRight={ChevronRight} onClick={() => navigate('projects')}>
              All projects
            </Button>
          }
          className="lg:col-span-2"
        >
          {runningProjects.length === 0 ? (
            <EmptyState icon={Building2} title="No running projects" description="Move a project to Running to track it here." compact />
          ) : (
            <ul className="divide-y divide-slate-100">
              {runningProjects.map(({ project, financials }) => (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() => navigate('projects', { projectId: project.id, projectTab: 'analytics' })}
                    className={cn('grid w-full gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center sm:px-5', FOCUS_RING_INSET)}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{project.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                        <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                        {project.location} · {project.clientName}
                      </p>
                    </div>
                    <ProgressBar
                      value={financials.progress}
                      tone="indigo"
                      size="sm"
                      label="Progress"
                      showValue
                      valueLabel={`${formatPercent(financials.progress, 0)} done`}
                    />
                    <div className="flex items-center justify-between gap-4 sm:justify-end sm:text-right">
                      <div>
                        <p className="text-[11px] text-slate-500">Spent</p>
                        <p className="text-sm font-semibold tabular-nums text-slate-900">{formatINRCompact(financials.actualCost)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Profit</p>
                        <AmountText value={financials.profitLoss} tone="auto" compact className="text-sm" />
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </TableCard>

        <Card data-animate>
          <CardHeader title="Budget Utilisation" description="Actual cost against estimated cost" icon={Target} iconTone="amber" />
          {runningProjects.length === 0 ? (
            <EmptyState icon={Target} title="Nothing to track" compact />
          ) : (
            <ul className="mt-4 space-y-4">
              {runningProjects.map(({ project, financials }) => (
                <li key={project.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-medium text-slate-700">{project.name}</span>
                    <span className={cn('shrink-0 font-semibold tabular-nums', financials.isOverBudget ? 'text-rose-600' : 'text-slate-900')}>
                      {formatPercent(financials.budgetUsage)}
                    </span>
                  </div>
                  <ProgressBar value={financials.budgetUsage} tone={getUtilisationTone(financials.budgetUsage)} size="sm" label={`${project.name} budget used`} />
                  <p className="mt-1 text-[11px] tabular-nums text-slate-500">
                    {formatINRCompact(financials.actualCost)} of {formatINRCompact(project.estimatedCost)}
                    {financials.isOverBudget ? ` · over by ${formatINRCompact(-financials.remainingBudget)}` : ` · ${formatINRCompact(financials.remainingBudget)} left`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <TableCard title="Recent Transactions" description="Ledger entries and site expenses" className="lg:col-span-2">
          {moneyFeed.length === 0 ? (
            <EmptyState icon={Receipt} title="No transactions yet" compact />
          ) : (
            <ul className="divide-y divide-slate-100">
              {moneyFeed.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={item.onOpen}
                      className={cn('flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 sm:px-5', FOCUS_RING_INSET)}
                    >
                      <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset', ICON_TONES[item.tone])}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-900">{item.title}</span>
                        <span className="block truncate text-xs text-slate-500">
                          {formatDate(item.date)} · {item.subtitle}
                        </span>
                      </span>
                      <span className="text-right">
                        <AmountText value={item.flow === 'out' ? -item.amount : item.amount} tone={item.flow === 'out' ? 'debit' : 'muted'} className="text-sm" />
                        <span className="block text-[11px] text-slate-400">{item.flow === 'out' ? 'Paid out' : 'Accrued'}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </TableCard>

        <Card data-animate>
          <CardHeader title="Recent Activity" icon={Activity} iconTone="slate" />
          {activities.length === 0 ? (
            <EmptyState icon={Clock} title="No activity yet" compact />
          ) : (
            <ol className="relative mt-4 space-y-4 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-slate-100">
              {activities.map((activity) => {
                const meta = ACTIVITY_META[activity.type];
                const Icon = meta.icon;
                return (
                  <li key={activity.id} className="relative flex gap-3">
                    <span className={cn('relative grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-white', ICON_TONES[meta.tone])}>
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[13px] font-medium text-slate-900">{activity.title}</p>
                      <p className="truncate text-xs text-slate-500">{activity.detail}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{formatRelativeTime(activity.timestamp, now)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card data-animate>
          <CardHeader
            title="Low Stock Alerts"
            description="Materials at or below minimum level"
            icon={AlertTriangle}
            iconTone="amber"
            action={
              <Button size="xs" variant="ghost" iconRight={ChevronRight} onClick={() => navigate('materials')}>
                Inventory
              </Button>
            }
          />
          {lowStock.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="Stock levels look healthy" description="Every material is above its minimum threshold." compact />
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {lowStock.map(({ material, stock }) => (
                <li key={material.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{material.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {formatQuantity(stock.remaining, material.unit)} left · min {formatNumber(material.minStock)} ·{' '}
                      {getProjectName(analytics, material.projectId)}
                    </p>
                  </div>
                  <StockBadge status={stock.status} />
                  <IconButton
                    label={`Receive stock for ${material.name}`}
                    icon={PackagePlus}
                    variant="soft"
                    onClick={() => openModal({ kind: 'stock', material, movementType: 'Receive' })}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card data-animate>
          <CardHeader
            title="Worker Productivity"
            description="Work per effective day, all recorded entries"
            icon={Gauge}
            iconTone="sky"
            action={
              leaderUnits.length > 1 ? (
                <SegmentedControl
                  ariaLabel="Productivity unit"
                  size="sm"
                  value={activeLeaderUnit}
                  onChange={setLeaderUnit}
                  options={leaderUnits.map((unit) => ({ value: unit, label: unit }))}
                />
              ) : undefined
            }
          />
          {leaderboard.length === 0 ? (
            <EmptyState
              icon={Hammer}
              title="No measured work yet"
              description="Add work entries to rank productivity."
              action={{ label: 'Add work entry', onClick: () => openModal({ kind: 'workEntry', record: null }) }}
              compact
            />
          ) : (
            <ol className="mt-3 space-y-3">
              {leaderboard.map(({ worker, metrics }, index) => {
                const top = leaderboard[0]?.metrics.productivity ?? 1;
                return (
                  <li key={worker.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold',
                        index === 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600',
                      )}
                    >
                      {index + 1}
                    </span>
                    <Avatar name={worker.name} id={worker.id} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[13px] font-medium text-slate-900">{worker.name}</p>
                        <p className="shrink-0 text-xs font-semibold tabular-nums text-slate-900">
                          {formatNumber(metrics.productivity)} {metrics.primaryUnit}/day
                        </p>
                      </div>
                      <ProgressBar value={metrics.productivity} max={top} tone="sky" size="xs" label={`${worker.name} productivity`} className="mt-1.5" />
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ========================================================= */
/* Labour Section                                            */
/* ========================================================= */

const LABOUR_SORT_KEYS = ['name', 'trade', 'project', 'dailyWage', 'attendanceRate', 'workQuantity', 'advances', 'payable'] as const;
type LabourSortKey = (typeof LABOUR_SORT_KEYS)[number];

function LabourSection() {
  const { data, analytics, ready, today, selectedDate, navigate, openModal, requestDelete } = useErp();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [trade, setTrade] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState<SortState<LabourSortKey>>({ key: 'name', direction: 'asc' });
  const [detailWorkerId, setDetailWorkerId] = useState<string | null>(null);
  const [attendanceWorker, setAttendanceWorker] = useState<Worker | null>(null);
  const debouncedSearch = useDebouncedValue(search, 200);
  const filterKey = [debouncedSearch, trade, projectId, status].join('|');
  const reloading = useSoftReload(filterKey);

  usePrimaryAction('labour', () => openModal({ kind: 'worker', record: null }));

  useNavigationFocus((focus) => {
    if (!focus.workerId) return false;
    setDetailWorkerId(focus.workerId);
    return true;
  });

  const attendanceToday = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    for (const record of data.attendance) if (record.date === selectedDate) map.set(record.workerId, record);
    return map;
  }, [data.attendance, selectedDate]);

  const summary = useMemo(() => {
    const active = data.workers.filter((worker) => worker.status === 'Active').length;
    let present = 0;
    attendanceToday.forEach((record) => {
      if (record.status === 'Present' || record.status === 'Half Day') present += 1;
    });
    const payable = sumBy(Object.values(analytics.workerMetrics), (metrics) => Math.max(0, metrics.payable));
    const advances = sumBy(Object.values(analytics.workerMetrics), (metrics) => metrics.advances);
    return { total: data.workers.length, active, present, payable, advances };
  }, [data.workers, attendanceToday, analytics.workerMetrics]);

  const rows = useMemo(() => {
    const filtered = data.workers.filter(
      (worker) =>
        (!trade || worker.trade === trade) &&
        (!projectId || worker.projectId === projectId) &&
        (!status || worker.status === status) &&
        matchesQuery(debouncedSearch, worker.name, worker.id, worker.phone, worker.trade, getProjectName(analytics, worker.projectId)),
    );
    return sortRecords(
      filtered,
      (worker) => {
        const metrics = analytics.workerMetrics[worker.id];
        switch (sort.key) {
          case 'trade':
            return worker.trade;
          case 'project':
            return getProjectName(analytics, worker.projectId);
          case 'dailyWage':
            return worker.dailyWage;
          case 'attendanceRate':
            return metrics?.attendanceRate ?? 0;
          case 'workQuantity':
            return metrics?.workQuantity ?? 0;
          case 'advances':
            return metrics?.advances ?? 0;
          case 'payable':
            return metrics?.payable ?? 0;
          default:
            return worker.name;
        }
      },
      sort.direction,
    );
  }, [data.workers, analytics, trade, projectId, status, debouncedSearch, sort]);

  const pagination = usePagination(rows, 10, `${filterKey}|${sort.key}|${sort.direction}`);
  const activeFilters = countActive(search, trade, projectId, status);

  const resetFilters = () => {
    setSearch('');
    setTrade('');
    setProjectId('');
    setStatus('');
  };

  const handleExport = () => {
    const ok = downloadCsv(
      buildExportFilename('workers', today),
      ['Worker ID', 'Name', 'Phone', 'Trade', 'Project', 'Joining Date', 'Daily Wage', 'Attendance %', 'Advances', 'Payable', 'Status'],
      rows.map((worker) => {
        const metrics = analytics.workerMetrics[worker.id];
        return [
          worker.id,
          worker.name,
          worker.phone,
          worker.trade,
          getProjectName(analytics, worker.projectId),
          worker.joiningDate,
          worker.dailyWage,
          roundTo(metrics?.attendanceRate ?? 0, 1),
          metrics?.advances ?? 0,
          metrics?.payable ?? 0,
          worker.status,
        ];
      }),
    );
    if (ok) toast.success('Export completed', `${rows.length} workers exported to CSV.`);
    else toast.error('Export failed', 'Your browser blocked the download.');
  };

  const buildActions = (worker: Worker): ActionMenuItem[] => [
    { key: 'view', label: 'View details', icon: Eye, onSelect: () => setDetailWorkerId(worker.id) },
    { key: 'edit', label: 'Edit worker', icon: Pencil, onSelect: () => openModal({ kind: 'worker', record: worker }) },
    {
      key: 'attendance',
      label: worker.projectId ? 'Mark attendance' : 'Mark attendance (assign a project)',
      icon: CalendarCheck,
      disabled: !worker.projectId,
      onSelect: () => setAttendanceWorker(worker),
    },
    {
      key: 'payment',
      label: 'Add payment',
      icon: Wallet,
      onSelect: () =>
        openModal({
          kind: 'transaction',
          record: null,
          defaults: { workerId: worker.id, projectId: worker.projectId, type: 'Payment', direction: 'debit' },
        }),
    },
    {
      key: 'work',
      label: 'Add work entry',
      icon: ClipboardList,
      onSelect: () => openModal({ kind: 'workEntry', record: null, defaults: { workerId: worker.id, projectId: worker.projectId } }),
    },
    { key: 'ledger', label: 'Open ledger', icon: BookOpen, onSelect: () => navigate('khata', { workerId: worker.id }) },
    {
      key: 'delete',
      label: 'Delete worker',
      icon: Trash2,
      tone: 'danger',
      separatorBefore: true,
      onSelect: () =>
        requestDelete({
          kind: 'worker',
          id: worker.id,
          label: worker.name,
          description: 'This also removes the worker’s attendance, work entries and ledger transactions. Consider marking them Inactive instead.',
        }),
    },
  ];

  const renderToday = (worker: Worker) => {
    const record = attendanceToday.get(worker.id);
    return record ? <AttendanceBadge status={record.status} /> : <span className="text-xs text-slate-400">Not marked</span>;
  };

  const columns: ReadonlyArray<TableColumn<Worker>> = [
    {
      key: 'name',
      header: 'Worker',
      sortKey: 'name',
      render: (worker) => <WorkerCell worker={worker} subtitle={`${worker.id} · ${formatPhone(worker.phone)}`} />,
    },
    { key: 'trade', header: 'Trade', sortKey: 'trade', render: (worker) => worker.trade },
    {
      key: 'project',
      header: 'Project',
      sortKey: 'project',
      render: (worker) => (
        <span className={cn('block max-w-[160px] truncate', !worker.projectId && 'text-slate-400')}>
          {getProjectName(analytics, worker.projectId)}
        </span>
      ),
    },
    { key: 'today', header: selectedDate === today ? 'Today' : formatDateShort(selectedDate), render: renderToday },
    { key: 'wage', header: 'Daily wage', sortKey: 'dailyWage', align: 'right', render: (worker) => <AmountText value={worker.dailyWage} /> },
    {
      key: 'attendance',
      header: 'Attendance',
      sortKey: 'attendanceRate',
      render: (worker) => {
        const rate = analytics.workerMetrics[worker.id]?.attendanceRate ?? 0;
        return (
          <div className="flex w-28 items-center gap-2">
            <ProgressBar value={rate} tone={rate >= 85 ? 'emerald' : rate >= 70 ? 'amber' : 'rose'} size="xs" label={`${worker.name} attendance`} />
            <span className="w-10 shrink-0 text-right text-xs tabular-nums text-slate-600">{formatPercent(rate, 0)}</span>
          </div>
        );
      },
    },
    {
      key: 'work',
      header: 'Work done',
      sortKey: 'workQuantity',
      align: 'right',
      render: (worker) => {
        const metrics = analytics.workerMetrics[worker.id];
        return metrics && metrics.workQuantity > 0 ? (
          <span className="whitespace-nowrap tabular-nums">{formatQuantity(metrics.workQuantity, metrics.primaryUnit)}</span>
        ) : (
          <span className="text-slate-400">—</span>
        );
      },
    },
    {
      key: 'advances',
      header: 'Advance',
      sortKey: 'advances',
      align: 'right',
      render: (worker) => <AmountText value={analytics.workerMetrics[worker.id]?.advances ?? 0} tone="muted" />,
    },
    {
      key: 'payable',
      header: 'Payable',
      sortKey: 'payable',
      align: 'right',
      render: (worker) => {
        const payable = analytics.workerMetrics[worker.id]?.payable ?? 0;
        return <AmountText value={payable} tone={payable < 0 ? 'debit' : 'neutral'} className="font-semibold" />;
      },
    },
    { key: 'status', header: 'Status', render: (worker) => <WorkerStatusBadge status={worker.status} /> },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (worker) => (
        <RowActions>
          <IconButton label={`View ${worker.name}`} icon={Eye} onClick={() => setDetailWorkerId(worker.id)} />
          <ActionMenu items={buildActions(worker)} label={`Actions for ${worker.name}`} />
        </RowActions>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {ready ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard label="Total Workers" value={String(summary.total)} icon={Users} tone="indigo" secondary={`${summary.total - summary.active} inactive`} />
          <StatCard label="Active" value={String(summary.active)} icon={HardHat} tone="emerald" secondary={`${formatPercent(safeDivide(summary.active, summary.total) * 100, 0)} of workforce`} />
          <StatCard
            label={selectedDate === today ? 'Present Today' : `Present · ${formatDateShort(selectedDate)}`}
            value={String(summary.present)}
            icon={CalendarCheck}
            tone="sky"
            secondary="Includes half days"
            onClick={() => navigate('attendance')}
          />
          <StatCard
            label="Total Payable"
            value={formatINR(summary.payable)}
            icon={Wallet}
            tone="amber"
            secondary={`${formatINRCompact(summary.advances)} advances given`}
            onClick={() => navigate('khata')}
          />
        </div>
      ) : (
        <KpiGridSkeleton count={4} />
      )}

      <TableCard>
        <div className="border-b border-slate-100 p-3 sm:p-4">
          <FilterBar
            search={<SearchInput value={search} onChange={setSearch} placeholder="Search name, ID, phone…" label="Search workers" loading={search !== debouncedSearch} />}
            activeCount={activeFilters}
            onReset={resetFilters}
            trailing={
              <>
                <Button variant="outline" size="sm" icon={Download} onClick={handleExport} disabled={rows.length === 0}>
                  Export
                </Button>
                <Button size="sm" icon={UserPlus} onClick={() => openModal({ kind: 'worker', record: null })}>
                  Add Worker
                </Button>
              </>
            }
          >
            <FilterSelect label="Trade" value={trade} onChange={setTrade} options={toSelectOptions(TRADES)} allLabel="All trades" icon={Hammer} />
            <FilterSelect label="Project" value={projectId} onChange={setProjectId} options={buildProjectOptions(data.projects)} allLabel="All projects" icon={Building2} />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={toSelectOptions<WorkerStatus>(['Active', 'Inactive'])} allLabel="Any status" icon={Filter} />
          </FilterBar>
        </div>

        <DataTable
          columns={columns}
          rows={pagination.pageItems}
          getRowKey={(worker) => worker.id}
          loading={!ready || reloading}
          mobileBreakpoint="lg"
          minWidthClassName="min-w-[1180px]"
          caption="Workers"
          sort={sort}
          onSortChange={(key) => {
            if (isOneOf(key, LABOUR_SORT_KEYS)) setSort((current) => toggleSort(current, key));
          }}
          onRowClick={(worker) => setDetailWorkerId(worker.id)}
          emptyState={
            data.workers.length === 0 ? (
              <EmptyState
                icon={HardHat}
                title="No workers yet"
                description="Add your masons, helpers and supervisors to start tracking attendance and wages."
                action={{ label: 'Add Worker', icon: UserPlus, onClick: () => openModal({ kind: 'worker', record: null }) }}
              />
            ) : (
              <EmptyState
                icon={Search}
                title="No workers match these filters"
                description="Try a different name, trade or project."
                secondaryAction={{ label: 'Reset filters', icon: RotateCcw, onClick: resetFilters }}
              />
            )
          }
          renderMobileCard={(worker) => {
            const metrics = analytics.workerMetrics[worker.id];
            return (
              <MobileRecordCard
                leading={<Avatar name={worker.name} id={worker.id} size="md" />}
                title={worker.name}
                subtitle={`${worker.trade} · ${getProjectName(analytics, worker.projectId)}`}
                badge={<WorkerStatusBadge status={worker.status} />}
                onClick={() => setDetailWorkerId(worker.id)}
                actions={<ActionMenu items={buildActions(worker)} label={`Actions for ${worker.name}`} />}
                fields={[
                  { label: 'Daily wage', value: formatINR(worker.dailyWage) },
                  { label: 'Payable', value: <AmountText value={metrics?.payable ?? 0} tone={(metrics?.payable ?? 0) < 0 ? 'debit' : 'neutral'} /> },
                  { label: 'Attendance', value: formatPercent(metrics?.attendanceRate ?? 0, 0) },
                  { label: selectedDate === today ? 'Today' : formatDateShort(selectedDate), value: renderToday(worker) },
                ]}
              />
            );
          }}
          footer={
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setPage}
              onPageSizeChange={pagination.setPageSize}
              itemLabel="workers"
            />
          }
        />
      </TableCard>

      <WorkerDetailModal
        workerId={detailWorkerId}
        onClose={() => setDetailWorkerId(null)}
        onMarkAttendance={(worker) => {
          setDetailWorkerId(null);
          setAttendanceWorker(worker);
        }}
      />
      <QuickAttendanceModal worker={attendanceWorker} onClose={() => setAttendanceWorker(null)} />
    </div>
  );
}

function WorkerDetailModal({
  workerId,
  onClose,
  onMarkAttendance,
}: {
  workerId: string | null;
  onClose: () => void;
  onMarkAttendance: (worker: Worker) => void;
}) {
  const { data, analytics, navigate, openModal } = useErp();
  const retainedId = useRetainedValue(workerId);
  const worker = retainedId ? analytics.workersById[retainedId] : undefined;
  const metrics = retainedId ? analytics.workerMetrics[retainedId] : undefined;

  useEffect(() => {
    if (workerId && !analytics.workersById[workerId]) onClose();
  }, [workerId, analytics.workersById, onClose]);

  const recentAttendance = useMemo(
    () =>
      retainedId
        ? data.attendance
            .filter((record) => record.workerId === retainedId)
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 14)
        : [],
    [data.attendance, retainedId],
  );

  const recentWork = useMemo(
    () =>
      retainedId
        ? data.workEntries
            .filter((entry) => entry.workerId === retainedId)
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 5)
        : [],
    [data.workEntries, retainedId],
  );

  return (
    <Modal
      open={Boolean(workerId && worker)}
      onClose={onClose}
      variant="drawer"
      size="lg"
      title={worker?.name ?? 'Worker'}
      description={worker ? `${worker.id} · ${worker.trade} · ${getProjectName(analytics, worker.projectId)}` : undefined}
      icon={HardHat}
      footer={
        worker ? (
          <>
            <Button variant="outline" icon={BookOpen} onClick={() => navigate('khata', { workerId: worker.id })}>
              Open ledger
            </Button>
            <Button variant="outline" icon={CalendarCheck} disabled={!worker.projectId} onClick={() => onMarkAttendance(worker)}>
              Mark attendance
            </Button>
            <Button icon={Pencil} onClick={() => openModal({ kind: 'worker', record: worker })}>
              Edit
            </Button>
          </>
        ) : undefined
      }
    >
      {worker && metrics && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar name={worker.name} id={worker.id} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <WorkerStatusBadge status={worker.status} />
                <Badge tone="indigo">{worker.trade}</Badge>
              </div>
              <a
                href={`tel:+91${normalizePhone(worker.phone)}`}
                className={cn('mt-1.5 inline-flex items-center gap-1.5 rounded text-sm text-slate-600 hover:text-indigo-600', FOCUS_RING)}
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {formatPhone(worker.phone)}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <MiniStat label="Total earning" value={formatINR(metrics.totalEarning)} tone="emerald" />
            <MiniStat label="Paid" value={formatINR(metrics.payments)} tone="indigo" />
            <MiniStat label="Advances" value={formatINR(metrics.advances)} tone="amber" />
            <MiniStat
              label={metrics.payable < 0 ? 'Recoverable' : 'Payable'}
              value={<AmountText value={Math.abs(metrics.payable)} tone={metrics.payable < 0 ? 'debit' : 'neutral'} />}
              tone={metrics.payable < 0 ? 'rose' : 'violet'}
            />
            <MiniStat label="Attendance" value={formatPercent(metrics.attendanceRate)} tone="sky" hint={`${formatNumber(metrics.effectiveDays)} effective days`} />
            <MiniStat
              label="Productivity"
              value={metrics.productivity > 0 ? formatNumber(metrics.productivity) : '—'}
              tone="teal"
              hint={metrics.productivity > 0 ? `${metrics.primaryUnit} per day` : 'No measured work'}
            />
          </div>

          <DetailList
            items={[
              { label: 'Project', value: getProjectName(analytics, worker.projectId), icon: Building2 },
              { label: 'Joining date', value: formatDate(worker.joiningDate), icon: Calendar },
              { label: 'Daily wage', value: formatINR(worker.dailyWage), icon: IndianRupee },
              { label: 'Overtime logged', value: `${formatNumber(metrics.overtimeHours)} hrs`, icon: Clock },
            ]}
          />

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recent attendance</h3>
            {recentAttendance.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No attendance recorded yet.</p>
            ) : (
              <ul className="mt-3 grid grid-cols-7 gap-1.5">
                {recentAttendance.map((record) => (
                  <li key={record.id} title={`${formatDate(record.date)}: ${record.status}`} className="flex flex-col items-center gap-1">
                    <span className={cn('h-7 w-full rounded-md', ATTENDANCE_STYLES[record.status].dot)} aria-hidden="true" />
                    <span className="text-[10px] tabular-nums text-slate-500">{formatDateShort(record.date).split(' ')[0]}</span>
                    <span className="sr-only">
                      {formatDate(record.date)} {record.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recent work</h3>
              <Button
                size="xs"
                variant="ghost"
                icon={Plus}
                onClick={() => openModal({ kind: 'workEntry', record: null, defaults: { workerId: worker.id, projectId: worker.projectId } })}
              >
                Add
              </Button>
            </div>
            {recentWork.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No work entries yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200/80">
                {recentWork.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-slate-900">{entry.task}</p>
                      <p className="text-xs text-slate-500">
                        {formatDate(entry.date)} · {getProjectName(analytics, entry.projectId)}
                      </p>
                    </div>
                    <span className="shrink-0 text-[13px] font-semibold tabular-nums text-slate-900">
                      {formatQuantity(entry.quantity, getWorkUnitLabel(entry.unit, entry.customUnit))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function QuickAttendanceModal({ worker, onClose }: { worker: Worker | null; onClose: () => void }) {
  const { data, analytics, today, selectedDate, upsertAttendance } = useErp();
  const toast = useToast();
  const formId = useId();
  const current = useRetainedValue(worker);
  const [date, setDate] = useState(selectedDate);
  const [status, setStatus] = useState<AttendanceStatus>('Present');
  const [overtime, setOvertime] = useState('0');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors<'date' | 'overtime' | 'project'>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!worker) return;
    setDate(selectedDate > today ? today : selectedDate);
    setErrors({});
  }, [worker, selectedDate, today]);

  const existing = useMemo(
    () => (current ? data.attendance.find((record) => record.workerId === current.id && record.date === date) : undefined),
    [data.attendance, current, date],
  );

  useEffect(() => {
    setStatus(existing?.status ?? 'Present');
    setOvertime(String(existing?.overtimeHours ?? 0));
    setNotes(existing?.notes ?? '');
  }, [existing]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!current || saving) return;
    const nextErrors: FormErrors<'date' | 'overtime' | 'project'> = {};
    if (!isValidISODate(date)) nextErrors.date = 'Choose a valid date.';
    else if (date > today) nextErrors.date = 'Attendance cannot be marked for a future date.';
    const overtimeHours = parseNonNegativeNumber(overtime === '' ? '0' : overtime);
    if (overtimeHours === null || overtimeHours > 12) nextErrors.overtime = 'Enter overtime between 0 and 12 hours.';
    const siteId = existing?.projectId ?? current.projectId;
    if (!siteId) nextErrors.project = 'Assign this worker to a project before marking attendance.';
    setErrors(nextErrors);
    if (hasFormErrors(nextErrors) || overtimeHours === null) {
      toast.error('Attendance not saved', 'Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    await wait(450);
    upsertAttendance([
      {
        workerId: current.id,
        projectId: siteId,
        date,
        status,
        overtimeHours: ATTENDANCE_FACTOR[status] > 0 ? roundTo(overtimeHours, 1) : 0,
        notes: sanitizeText(notes, 120),
      },
    ]);
    setSaving(false);
    toast.success('Attendance updated', `${current.name} marked ${status.toLowerCase()} for ${formatDate(date)}.`);
    onClose();
  };

  return (
    <Modal
      open={Boolean(worker)}
      onClose={onClose}
      preventClose={saving}
      size="sm"
      title="Mark attendance"
      description={current ? `${current.name} · ${getProjectName(analytics, current.projectId)}` : undefined}
      icon={CalendarCheck}
      iconTone="emerald"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={saving} loadingText="Saving…">
            {existing ? 'Update attendance' : 'Save attendance'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={(event) => void handleSubmit(event)} className="space-y-4" noValidate>
        {errors.project && <FormErrorSummary errors={{ project: errors.project }} title="Cannot mark attendance" />}
        <InputField
          label="Date"
          type="date"
          required
          value={date}
          max={today}
          onChange={(event) => setDate(event.target.value)}
          error={errors.date}
          hint={existing ? `Already marked ${existing.status.toLowerCase()}; saving will update it.` : undefined}
        />
        <div className="space-y-1.5">
          <p className="text-[13px] font-medium text-slate-700">Status</p>
          <AttendanceStatusPicker value={status} onChange={setStatus} ariaLabel="Attendance status" />
        </div>
        <InputField
          label="Overtime"
          type="number"
          min={0}
          max={12}
          step={0.5}
          value={overtime}
          disabled={ATTENDANCE_FACTOR[status] === 0}
          onChange={(event) => setOvertime(event.target.value)}
          trailingText="hours"
          error={errors.overtime}
          hint={current ? `Paid at ${formatINR(safeDivide(current.dailyWage, data.settings.standardHours) * data.settings.overtimeMultiplier)}/hr` : undefined}
        />
        <TextAreaField label="Notes" rows={2} maxLength={120} showCount value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional" />
      </form>
    </Modal>
  );
}

/* ========================================================= */
/* Attendance Section                                        */
/* ========================================================= */

type AttendanceFilter = '' | AttendanceStatus | 'Unmarked';

interface RosterRow {
  worker: Worker;
  record: AttendanceRecord | undefined;
  siteId: string;
}

function AttendanceSection() {
  const { data, analytics, ready, today, selectedDate, setSelectedDate, upsertAttendance, removeAttendance, navigate } = useErp();
  const toast = useToast();
  const { run, isPending } = usePendingActions();
  const [projectId, setProjectId] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceFilter>('');
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [savedWorkerId, setSavedWorkerId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 200);
  const reloading = useSoftReload(`${selectedDate}|${projectId}`, 380);
  const isFuture = selectedDate > today;
  const dateInputId = useId();

  useEffect(() => {
    setSelectedIds(new Set());
  }, [selectedDate, projectId]);

  useEffect(() => {
    if (!savedWorkerId) return;
    const timer = window.setTimeout(() => setSavedWorkerId(null), 1400);
    return () => window.clearTimeout(timer);
  }, [savedWorkerId]);

  const recordsForDate = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    for (const record of data.attendance) if (record.date === selectedDate) map.set(record.workerId, record);
    return map;
  }, [data.attendance, selectedDate]);

  const roster = useMemo<RosterRow[]>(
    () =>
      data.workers
        .filter((worker) => (worker.status === 'Active' && worker.projectId) || recordsForDate.has(worker.id))
        .map((worker) => {
          const record = recordsForDate.get(worker.id);
          return { worker, record, siteId: record?.projectId ?? worker.projectId };
        })
        .filter((row) => !projectId || row.siteId === projectId)
        .sort((a, b) => a.worker.name.localeCompare(b.worker.name)),
    [data.workers, recordsForDate, projectId],
  );

  const visibleRows = useMemo(
    () =>
      roster.filter((row) => {
        if (statusFilter === 'Unmarked' && row.record) return false;
        if (statusFilter && statusFilter !== 'Unmarked' && row.record?.status !== statusFilter) return false;
        return matchesQuery(debouncedSearch, row.worker.name, row.worker.trade, row.worker.id, getProjectName(analytics, row.siteId));
      }),
    [roster, statusFilter, debouncedSearch, analytics],
  );

  const summary = useMemo(() => {
    const records = roster.map((row) => row.record).filter((record): record is AttendanceRecord => Boolean(record));
    const base = getAttendanceSummary(records);
    const wages = sumBy(records, (record) => {
      const worker = analytics.workersById[record.workerId];
      return worker ? calculateAttendanceWage(record, worker.dailyWage, data.settings) : 0;
    });
    return { ...base, unmarked: roster.length - records.length, wages };
  }, [roster, analytics.workersById, data.settings]);

  const historyDates = useMemo(() => listDates(addDays(selectedDate, -6), selectedDate), [selectedDate]);

  const historyMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    const start = historyDates[0] ?? selectedDate;
    for (const record of data.attendance) {
      if (record.date >= start && record.date <= selectedDate) map.set(`${record.workerId}|${record.date}`, record.status);
    }
    return map;
  }, [data.attendance, historyDates, selectedDate]);

  const guardFuture = (): boolean => {
    if (!isFuture) return true;
    toast.warning('Future date selected', 'Attendance can only be marked for today or earlier.');
    return false;
  };

  const toInput = (row: RosterRow, status: AttendanceStatus, overrides?: Partial<AttendanceInput>): AttendanceInput => ({
    workerId: row.worker.id,
    projectId: row.siteId,
    date: selectedDate,
    status,
    overtimeHours: ATTENDANCE_FACTOR[status] > 0 ? row.record?.overtimeHours ?? 0 : 0,
    notes: row.record?.notes ?? '',
    ...overrides,
  });

  const markSingle = (row: RosterRow, status: AttendanceStatus) => {
    if (!guardFuture() || row.record?.status === status) return;
    upsertAttendance([toInput(row, status)]);
    setSavedWorkerId(row.worker.id);
  };

  const markAllPresent = () => {
    if (!guardFuture()) return;
    const targets = visibleRows.filter((row) => !row.record);
    if (targets.length === 0) {
      toast.info('Nothing to mark', 'Every worker in this list already has attendance for this date.');
      return;
    }
    void run(
      'mark-all',
      () => {
        upsertAttendance(targets.map((row) => toInput(row, 'Present')));
        toast.success('Attendance updated', `${targets.length} worker${targets.length === 1 ? '' : 's'} marked present for ${formatDate(selectedDate)}.`);
      },
      550,
    );
  };

  usePrimaryAction('attendance', markAllPresent);

  const selectedRows = visibleRows.filter((row) => selectedIds.has(row.worker.id));

  const applyBulk = (status: AttendanceStatus) => {
    if (!guardFuture() || selectedRows.length === 0) return;
    void run(
      `bulk-${status}`,
      () => {
        upsertAttendance(selectedRows.map((row) => toInput(row, status)));
        toast.success('Attendance updated', `${selectedRows.length} worker${selectedRows.length === 1 ? '' : 's'} marked ${status.toLowerCase()}.`);
        setSelectedIds(new Set());
      },
      450,
    );
  };

  const clearSelectedMarks = () => {
    const withRecords = selectedRows.filter((row) => row.record);
    if (withRecords.length === 0) {
      toast.info('Nothing to clear', 'The selected workers are not marked yet.');
      return;
    }
    void run(
      'bulk-clear',
      () => {
        removeAttendance(
          withRecords.map((row) => row.worker.id),
          selectedDate,
        );
        toast.success('Attendance cleared', `${withRecords.length} record${withRecords.length === 1 ? '' : 's'} removed.`);
        setSelectedIds(new Set());
      },
      450,
    );
  };

  const commitOvertime = (row: RosterRow, input: HTMLInputElement) => {
    const record = row.record;
    if (!record) return;
    const value = parseNonNegativeNumber(input.value === '' ? '0' : input.value);
    if (value === null || value > 12) {
      toast.error('Invalid overtime', 'Enter between 0 and 12 hours.');
      input.value = String(record.overtimeHours);
      return;
    }
    const rounded = roundTo(value, 1);
    if (rounded === record.overtimeHours) return;
    upsertAttendance([toInput(row, record.status, { overtimeHours: rounded })]);
    setSavedWorkerId(row.worker.id);
  };

  const commitNotes = (row: RosterRow, input: HTMLInputElement) => {
    const record = row.record;
    if (!record) return;
    const cleaned = sanitizeText(input.value, 120);
    if (cleaned === record.notes) return;
    upsertAttendance([toInput(row, record.status, { notes: cleaned })]);
    setSavedWorkerId(row.worker.id);
  };

  const allVisibleSelected = visibleRows.length > 0 && visibleRows.every((row) => selectedIds.has(row.worker.id));
  const someVisibleSelected = visibleRows.some((row) => selectedIds.has(row.worker.id));

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(visibleRows.map((row) => row.worker.id)) : new Set());
  };

  const toggleOne = (workerId: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(workerId);
      else next.delete(workerId);
      return next;
    });
  };

  const loading = !ready || reloading;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card data-animate padding="sm" className="erp-print-hidden">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <IconButton label="Previous day" icon={ChevronLeft} variant="outline" size="md" onClick={() => setSelectedDate(addDays(selectedDate, -1))} />
            <label htmlFor={dateInputId} className="sr-only">
              Attendance date
            </label>
            <input
              id={dateInputId}
              type="date"
              value={selectedDate}
              max={today}
              onChange={(event) => {
                if (isValidISODate(event.target.value)) setSelectedDate(event.target.value);
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15"
            />
            <IconButton
              label="Next day"
              icon={ChevronRight}
              variant="outline"
              size="md"
              disabled={selectedDate >= today}
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            />
            {selectedDate !== today && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedDate(today)}>
                Today
              </Button>
            )}
            <span className="text-[13px] text-slate-500">{formatWeekday(selectedDate)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              label="Site"
              value={projectId}
              onChange={setProjectId}
              options={buildProjectOptions(data.projects.filter((project) => project.stage === 'Running' || project.id === projectId))}
              allLabel="All sites"
              icon={Building2}
              className="flex-1 sm:flex-none"
            />
            <Button icon={CheckCheck} variant="success" onClick={markAllPresent} loading={isPending('mark-all')} loadingText="Marking…" disabled={isFuture}>
              Mark All Present
            </Button>
          </div>
        </div>
        {isFuture && (
          <p role="alert" className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            This date is in the future. Attendance can only be marked for today or earlier.
          </p>
        )}
      </Card>

      <Card data-animate>
        {loading ? (
          <div className="flex items-center gap-6">
            <Skeleton className="h-28 w-28 shrink-0" rounded="full" />
            <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-5">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className="h-16" rounded="xl" />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <RingProgress value={summary.rate} size={112} label="Attendance rate" sublabel={`${summary.total} marked`} />
            <div className="grid w-full flex-1 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
              <MiniStat label="Present" value={summary.present} tone="emerald" />
              <MiniStat label="Absent" value={summary.absent} tone="rose" />
              <MiniStat label="Half Day" value={summary.halfDay} tone="amber" />
              <MiniStat label="Leave" value={summary.leave} tone="violet" />
              <MiniStat label="Not marked" value={summary.unmarked} tone="slate" />
              <MiniStat label="Wages earned" value={formatINRCompact(summary.wages)} tone="indigo" hint="Incl. overtime" />
            </div>
          </div>
        )}
      </Card>

      <TableCard>
        <div className="border-b border-slate-100 p-3 sm:p-4">
          <FilterBar
            search={<SearchInput value={search} onChange={setSearch} placeholder="Search worker or trade…" label="Search roster" />}
            activeCount={countActive(search, statusFilter)}
            onReset={() => {
              setSearch('');
              setStatusFilter('');
            }}
          >
            <FilterPills<Exclude<AttendanceFilter, ''>>
              ariaLabel="Filter by attendance status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'All', count: roster.length },
                { value: 'Unmarked', label: 'Not marked', count: summary.unmarked, dot: 'bg-slate-400' },
                { value: 'Present', label: 'Present', count: summary.present, dot: ATTENDANCE_STYLES.Present.dot },
                { value: 'Absent', label: 'Absent', count: summary.absent, dot: ATTENDANCE_STYLES.Absent.dot },
                { value: 'Half Day', label: 'Half Day', count: summary.halfDay, dot: ATTENDANCE_STYLES['Half Day'].dot },
                { value: 'Leave', label: 'Leave', count: summary.leave, dot: ATTENDANCE_STYLES.Leave.dot },
              ]}
            />
          </FilterBar>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-3 py-2.5 sm:px-4">
          <Checkbox
            checked={allVisibleSelected}
            indeterminate={someVisibleSelected}
            onChange={toggleAll}
            label={selectedRows.length > 0 ? `${selectedRows.length} selected` : 'Select all'}
            disabled={visibleRows.length === 0 || isFuture}
          />
          {selectedRows.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 sm:ml-2">
              {ATTENDANCE_STATUSES.map((status) => (
                <Button
                  key={status}
                  size="xs"
                  variant="outline"
                  loading={isPending(`bulk-${status}`)}
                  onClick={() => applyBulk(status)}
                  disabled={isFuture}
                >
                  <span className={cn('h-2 w-2 rounded-full', ATTENDANCE_STYLES[status].dot)} aria-hidden="true" />
                  {status}
                </Button>
              ))}
              <Button size="xs" variant="ghost" icon={RotateCcw} loading={isPending('bulk-clear')} onClick={clearSelectedMarks}>
                Clear marks
              </Button>
            </div>
          )}
          <span className="ml-auto" aria-live="polite">
            {savedWorkerId && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Saved
              </span>
            )}
          </span>
        </div>

        {loading ? (
          <div className="space-y-2.5 p-3 sm:p-4">
            {Array.from({ length: 5 }, (_, index) => (
              <MobileCardSkeleton key={index} />
            ))}
          </div>
        ) : roster.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No workers on this site"
            description="Assign active workers to a running project to mark their attendance."
            action={{ label: 'Go to Labour', icon: HardHat, onClick: () => navigate('labour') }}
          />
        ) : visibleRows.length === 0 ? (
          <EmptyState icon={Search} title="No workers match" description="Change the search or status filter." compact />
        ) : (
          <ul className="divide-y divide-slate-100">
            {visibleRows.map((row) => {
              const { worker, record } = row;
              const wage = record ? calculateAttendanceWage(record, worker.dailyWage, data.settings) : 0;
              const canOvertime = Boolean(record && ATTENDANCE_FACTOR[record.status] > 0);
              return (
                <li
                  key={worker.id}
                  className={cn(
                    'grid gap-3 px-3 py-3 transition-colors sm:px-4 xl:grid-cols-[minmax(220px,1.2fr)_minmax(280px,1.4fr)_96px_minmax(140px,1fr)_110px] xl:items-center',
                    selectedIds.has(worker.id) && 'bg-indigo-50/40',
                    savedWorkerId === worker.id && 'bg-emerald-50/50',
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Checkbox
                      checked={selectedIds.has(worker.id)}
                      onChange={(checked) => toggleOne(worker.id, checked)}
                      label={`Select ${worker.name}`}
                      hideLabel
                      disabled={isFuture}
                    />
                    <WorkerCell worker={worker} subtitle={`${worker.trade} · ${getProjectName(analytics, row.siteId)}`} />
                    <div className="ml-auto hidden items-center gap-1 2xl:flex" aria-label="Last 7 days">
                      {historyDates.map((date) => {
                        const status = historyMap.get(`${worker.id}|${date}`);
                        return (
                          <span
                            key={date}
                            title={`${formatDate(date)}: ${status ?? 'Not marked'}`}
                            className={cn('h-2.5 w-2.5 rounded-full', status ? ATTENDANCE_STYLES[status].dot : 'bg-slate-200')}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <AttendanceStatusPicker
                    value={record?.status ?? null}
                    onChange={(status) => markSingle(row, status)}
                    ariaLabel={`Attendance for ${worker.name}`}
                    disabled={isFuture}
                  />

                  <div className="grid grid-cols-[96px_1fr] gap-2 xl:contents">
                    <div className="relative">
                      <label htmlFor={`ot-${worker.id}`} className="sr-only">
                        Overtime hours for {worker.name}
                      </label>
                      <Clock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                      <input
                        id={`ot-${worker.id}`}
                        key={`ot-${record?.id ?? 'none'}-${record?.overtimeHours ?? 0}`}
                        type="number"
                        min={0}
                        max={12}
                        step={0.5}
                        inputMode="decimal"
                        defaultValue={record?.overtimeHours ?? 0}
                        disabled={!canOvertime || isFuture}
                        title={canOvertime ? 'Overtime hours' : 'Mark present or half day to add overtime'}
                        onBlur={(event) => commitOvertime(row, event.currentTarget)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') event.currentTarget.blur();
                        }}
                        onWheel={(event) => event.currentTarget.blur()}
                        className="erp-no-spin h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-7 text-[13px] tabular-nums focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">hr</span>
                    </div>
                    <div>
                      <label htmlFor={`note-${worker.id}`} className="sr-only">
                        Notes for {worker.name}
                      </label>
                      <input
                        id={`note-${worker.id}`}
                        key={`note-${record?.id ?? 'none'}-${record?.notes ?? ''}`}
                        type="text"
                        maxLength={120}
                        placeholder={record ? 'Add note' : 'Mark status first'}
                        defaultValue={record?.notes ?? ''}
                        disabled={!record || isFuture}
                        onBlur={(event) => commitNotes(row, event.currentTarget)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') event.currentTarget.blur();
                        }}
                        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[13px] placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 disabled:bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs xl:justify-end xl:text-right">
                    <span className="text-slate-500 xl:hidden">Wage for the day</span>
                    <AmountText value={wage} tone={wage > 0 ? 'neutral' : 'muted'} className="text-[13px]" />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </TableCard>
    </div>
  );
}

/* ========================================================= */
/* Work Entries Section                                      */
/* ========================================================= */

const WORK_SORT_KEYS = ['date', 'worker', 'project', 'task', 'quantity'] as const;
type WorkSortKey = (typeof WORK_SORT_KEYS)[number];

function WorkSection() {
  const { data, analytics, ready, today, openModal, requestDelete } = useErp();
  const [search, setSearch] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [chartUnit, setChartUnit] = useState('sq.ft.');
  const [sort, setSort] = useState<SortState<WorkSortKey>>({ key: 'date', direction: 'desc' });
  const debouncedSearch = useDebouncedValue(search, 200);
  const filterKey = [debouncedSearch, workerId, projectId, dateFrom, dateTo].join('|');
  const reloading = useSoftReload(filterKey);

  usePrimaryAction('work', () => openModal({ kind: 'workEntry', record: null, defaults: { workerId, projectId } }));

  useNavigationFocus((focus) => {
    if (!focus.workerId) return false;
    setWorkerId(focus.workerId);
    return true;
  });

  const filtered = useMemo(() => {
    const { start, end } = normalizeDateRange(dateFrom, dateTo);
    return data.workEntries.filter(
      (entry) =>
        (!workerId || entry.workerId === workerId) &&
        (!projectId || entry.projectId === projectId) &&
        isDateInRange(entry.date, start, end) &&
        matchesQuery(debouncedSearch, entry.task, entry.id, getWorkerName(analytics, entry.workerId), getProjectName(analytics, entry.projectId)),
    );
  }, [data.workEntries, workerId, projectId, dateFrom, dateTo, debouncedSearch, analytics]);

  const sorted = useMemo(
    () =>
      sortRecords(
        filtered,
        (entry) => {
          switch (sort.key) {
            case 'worker':
              return getWorkerName(analytics, entry.workerId);
            case 'project':
              return getProjectName(analytics, entry.projectId);
            case 'task':
              return entry.task;
            case 'quantity':
              return entry.quantity;
            default:
              return `${entry.date}|${entry.id}`;
          }
        },
        sort.direction,
      ),
    [filtered, sort, analytics],
  );

  const totalsByUnit = useMemo(() => {
    const totals = new Map<string, number>();
    for (const entry of filtered) {
      const unit = getWorkUnitLabel(entry.unit, entry.customUnit);
      totals.set(unit, (totals.get(unit) ?? 0) + entry.quantity);
    }
    return totals;
  }, [filtered]);

  const productivityRows = useMemo(() => computeProductivityRows(filtered, data.attendance), [filtered, data.attendance]);

  const measurableUnits = useMemo(
    () => Array.from(new Set(productivityRows.filter((row) => row.unit !== 'day').map((row) => row.unit))),
    [productivityRows],
  );
  const activeUnit = measurableUnits.includes(chartUnit) ? chartUnit : measurableUnits[0] ?? '';

  const chartData = useMemo(
    () =>
      productivityRows
        .filter((row) => row.unit === activeUnit)
        .slice(0, 8)
        .map((row) => ({ name: getWorkerName(analytics, row.workerId), perDay: row.perDay, quantity: row.quantity })),
    [productivityRows, activeUnit, analytics],
  );

  const pagination = usePagination(sorted, 10, `${filterKey}|${sort.key}|${sort.direction}`);
  const selectedWorker = workerId ? analytics.workersById[workerId] : undefined;
  const workerRows = selectedWorker ? productivityRows.filter((row) => row.workerId === selectedWorker.id) : [];

  const resetFilters = () => {
    setSearch('');
    setWorkerId('');
    setProjectId('');
    setDateFrom('');
    setDateTo('');
  };

  const entryActions = (entry: WorkEntry): ActionMenuItem[] => [
    { key: 'edit', label: 'Edit entry', icon: Pencil, onSelect: () => openModal({ kind: 'workEntry', record: entry }) },
    { key: 'worker', label: 'Worker history', icon: HardHat, onSelect: () => setWorkerId(entry.workerId) },
    {
      key: 'delete',
      label: 'Delete entry',
      icon: Trash2,
      tone: 'danger',
      separatorBefore: true,
      onSelect: () =>
        requestDelete({
          kind: 'workEntry',
          id: entry.id,
          label: `${entry.task} (${formatDate(entry.date)})`,
          description: 'Productivity and project progress will be recalculated.',
        }),
    },
  ];

  const columns: ReadonlyArray<TableColumn<WorkEntry>> = [
    {
      key: 'date',
      header: 'Date',
      sortKey: 'date',
      render: (entry) => (
        <div>
          <p className="whitespace-nowrap font-medium text-slate-900">{formatDate(entry.date)}</p>
          <p className="text-xs text-slate-500">{entry.id}</p>
        </div>
      ),
    },
    {
      key: 'worker',
      header: 'Worker',
      sortKey: 'worker',
      render: (entry) => {
        const worker = analytics.workersById[entry.workerId];
        return worker ? (
          <button type="button" onClick={() => setWorkerId(worker.id)} className={cn('rounded-md text-left', FOCUS_RING)} title="Show worker history">
            <WorkerCell worker={worker} subtitle={worker.trade} />
          </button>
        ) : (
          <span className="text-slate-400">Removed worker</span>
        );
      },
    },
    { key: 'project', header: 'Project', sortKey: 'project', render: (entry) => <span className="block max-w-[160px] truncate">{getProjectName(analytics, entry.projectId)}</span> },
    { key: 'task', header: 'Task', sortKey: 'task', render: (entry) => <span className="line-clamp-2 max-w-[280px] text-slate-700">{entry.task}</span> },
    {
      key: 'quantity',
      header: 'Quantity',
      sortKey: 'quantity',
      align: 'right',
      render: (entry) => (
        <span className="whitespace-nowrap font-semibold tabular-nums text-slate-900">
          {formatQuantity(entry.quantity, getWorkUnitLabel(entry.unit, entry.customUnit))}
        </span>
      ),
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (entry) => (
        <RowActions>
          <IconButton label="Edit entry" icon={Pencil} onClick={() => openModal({ kind: 'workEntry', record: entry })} />
          <ActionMenu items={entryActions(entry)} label={`Actions for ${entry.id}`} />
        </RowActions>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {ready ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard label="Work Entries" value={String(filtered.length)} icon={ClipboardList} tone="indigo" secondary={`${new Set(filtered.map((entry) => entry.workerId)).size} workers`} />
          <StatCard label="Area Work" value={formatQuantity(totalsByUnit.get('sq.ft.') ?? 0, 'sq.ft.')} icon={Layers} tone="emerald" secondary="Tiles, plaster, painting" />
          <StatCard label="Linear Work" value={formatQuantity(totalsByUnit.get('running ft.') ?? 0, 'rft')} icon={Activity} tone="sky" secondary="Wiring, piping" />
          <StatCard label="Volume Work" value={formatQuantity(totalsByUnit.get('cubic ft.') ?? 0, 'cft')} icon={Boxes} tone="amber" secondary="Masonry, concrete" />
        </div>
      ) : (
        <KpiGridSkeleton count={4} />
      )}

      {selectedWorker && (
        <Card data-animate className="border-indigo-100 bg-indigo-50/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <WorkerCell worker={selectedWorker} subtitle={`Work history · ${selectedWorker.trade} · ${getProjectName(analytics, selectedWorker.projectId)}`} />
            <div className="flex flex-wrap items-center gap-2">
              {workerRows.length === 0 ? (
                <span className="text-sm text-slate-500">No entries in this range</span>
              ) : (
                workerRows.map((row) => (
                  <Badge key={row.key} tone="indigo">
                    {formatQuantity(row.quantity, row.unit)}
                    {row.perDay > 0 ? ` · ${formatNumber(row.perDay)}/day` : ''}
                  </Badge>
                ))
              )}
              <Button size="xs" variant="outline" icon={X} onClick={() => setWorkerId('')}>
                Clear worker
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-5">
        <ChartCard
          title="Worker Productivity"
          description="Quantity per effective working day for the filtered entries"
          className="xl:col-span-3"
          loading={!ready}
          isEmpty={chartData.length === 0}
          emptyTitle="No measurable work"
          emptyDescription="Entries recorded only in days are excluded from productivity."
          action={
            measurableUnits.length > 1 ? (
              <SegmentedControl
                ariaLabel="Productivity unit"
                size="sm"
                value={activeUnit}
                onChange={setChartUnit}
                options={measurableUnits.map((unit) => ({ value: unit, label: unit }))}
              />
            ) : undefined
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid {...CHART_GRID_PROPS} horizontal={false} vertical />
              <XAxis type="number" {...CHART_AXIS_PROPS} />
              <YAxis type="category" dataKey="name" {...CHART_AXIS_PROPS} width={104} tickFormatter={(value: string) => truncateLabel(String(value), 14)} />
              <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip valueFormatter={(value) => `${formatNumber(value)} ${activeUnit}/day`} />} />
              <Bar dataKey="perDay" name="Per day" fill={CHART_COLORS.labour} radius={[0, 4, 4, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card data-animate padding="none" className="overflow-hidden xl:col-span-2">
          <div className="border-b border-slate-100 px-4 py-3.5 sm:px-5">
            <CardHeader title="Productivity by Worker" description="Click a worker to see their history" icon={Gauge} iconTone="sky" />
          </div>
          {productivityRows.length === 0 ? (
            <EmptyState icon={Hammer} title="No work in this range" compact />
          ) : (
            <ul className="erp-scroll-thin max-h-[300px] divide-y divide-slate-100 overflow-y-auto">
              {productivityRows.map((row) => (
                <li key={row.key}>
                  <button
                    type="button"
                    onClick={() => setWorkerId(row.workerId)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 sm:px-5',
                      FOCUS_RING_INSET,
                      row.workerId === workerId && 'bg-indigo-50/60',
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-slate-900">{getWorkerName(analytics, row.workerId)}</span>
                      <span className="block text-xs text-slate-500">
                        {formatQuantity(row.quantity, row.unit)} · {formatNumber(row.days)} days · {row.entries} entries
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-[13px] font-semibold tabular-nums text-slate-900">
                      {row.perDay > 0 ? `${formatNumber(row.perDay)}/day` : '—'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <TableCard>
        <div className="border-b border-slate-100 p-3 sm:p-4">
          <FilterBar
            search={<SearchInput value={search} onChange={setSearch} placeholder="Search task, worker or ID…" label="Search work entries" />}
            activeCount={countActive(search, workerId, projectId, dateFrom, dateTo)}
            onReset={resetFilters}
            trailing={
              <Button size="sm" icon={Plus} onClick={() => openModal({ kind: 'workEntry', record: null, defaults: { workerId, projectId } })}>
                Add Work Entry
              </Button>
            }
          >
            <FilterSelect label="Worker" value={workerId} onChange={setWorkerId} options={buildWorkerOptions(data.workers)} allLabel="All workers" icon={HardHat} />
            <FilterSelect label="Project" value={projectId} onChange={setProjectId} options={buildProjectOptions(data.projects)} allLabel="All projects" icon={Building2} />
            <DateRangeFilter from={dateFrom} to={dateTo} onFromChange={setDateFrom} onToChange={setDateTo} max={today} />
          </FilterBar>
        </div>
        <DataTable
          columns={columns}
          rows={pagination.pageItems}
          getRowKey={(entry) => entry.id}
          loading={!ready || reloading}
          caption="Work entries"
          minWidthClassName="min-w-[880px]"
          sort={sort}
          onSortChange={(key) => {
            if (isOneOf(key, WORK_SORT_KEYS)) setSort((current) => toggleSort(current, key));
          }}
          emptyState={
            <EmptyState
              icon={ClipboardList}
              title={data.workEntries.length === 0 ? 'No work entries yet' : 'No entries match these filters'}
              description="Record measured work such as tiling, plaster or wiring to track productivity."
              action={{ label: 'Add Work Entry', onClick: () => openModal({ kind: 'workEntry', record: null }) }}
              secondaryAction={data.workEntries.length > 0 ? { label: 'Reset filters', icon: RotateCcw, onClick: resetFilters } : undefined}
            />
          }
          renderMobileCard={(entry) => (
            <MobileRecordCard
              title={entry.task}
              subtitle={`${formatDate(entry.date)} · ${getWorkerName(analytics, entry.workerId)}`}
              badge={<Badge tone="indigo">{formatQuantity(entry.quantity, getWorkUnitLabel(entry.unit, entry.customUnit))}</Badge>}
              actions={<ActionMenu items={entryActions(entry)} label={`Actions for ${entry.id}`} />}
              fields={[
                { label: 'Project', value: getProjectName(analytics, entry.projectId) },
                { label: 'Entry', value: entry.id },
              ]}
            />
          )}
          footer={
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setPage}
              onPageSizeChange={pagination.setPageSize}
              itemLabel="entries"
            />
          }
        />
      </TableCard>
    </div>
  );
}

/* ========================================================= */
/* Khata Book Section                                        */
/* ========================================================= */

type KhataTab = 'ledger' | 'transactions';

function KhataSection() {
  const { data, analytics, ready, today, openModal, requestDelete } = useErp();
  const toast = useToast();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [tab, setTab] = useState<KhataTab>('ledger');
  const [peopleSearch, setPeopleSearch] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [mobileLedgerOpen, setMobileLedgerOpen] = useState(false);
  const [txnSearch, setTxnSearch] = useState('');
  const [txnType, setTxnType] = useState('');
  const [txnMode, setTxnMode] = useState('');
  const debouncedTxnSearch = useDebouncedValue(txnSearch, 200);
  const txnFilterKey = [debouncedTxnSearch, txnType, txnMode, projectId, dateFrom, dateTo].join('|');
  const reloading = useSoftReload(txnFilterKey);

  useNavigationFocus((focus) => {
    if (!focus.workerId) return false;
    setTab('ledger');
    setSelectedWorkerId(focus.workerId);
    setPeopleSearch('');
    setProjectId('');
    if (!window.matchMedia('(min-width: 1024px)').matches) setMobileLedgerOpen(true);
    return true;
  });

  const totals = useMemo(() => {
    const all = Object.values(analytics.workerMetrics);
    return {
      wages: sumBy(all, (metrics) => metrics.attendanceWages + metrics.wageCredits + metrics.allowances + metrics.bonuses),
      paid: sumBy(all, (metrics) => metrics.payments),
      advances: sumBy(all, (metrics) => metrics.advances),
      payable: sumBy(all, (metrics) => Math.max(0, metrics.payable)),
      recoverable: sumBy(all, (metrics) => Math.max(0, -metrics.payable)),
      dues: all.filter((metrics) => metrics.payable > 0).length,
    };
  }, [analytics.workerMetrics]);

  const people = useMemo(
    () =>
      data.workers
        .filter((worker) => (!projectId || worker.projectId === projectId) && matchesQuery(peopleSearch, worker.name, worker.id, worker.trade, worker.phone))
        .sort((a, b) => (analytics.workerMetrics[b.id]?.payable ?? 0) - (analytics.workerMetrics[a.id]?.payable ?? 0)),
    [data.workers, projectId, peopleSearch, analytics.workerMetrics],
  );

  useEffect(() => {
    if (!isDesktop || tab !== 'ledger') return;
    if (!selectedWorkerId || !analytics.workersById[selectedWorkerId]) {
      const first = people[0];
      if (first) setSelectedWorkerId(first.id);
    }
  }, [isDesktop, tab, selectedWorkerId, people, analytics.workersById]);

  useEffect(() => {
    if (isDesktop) setMobileLedgerOpen(false);
  }, [isDesktop]);

  const selectedWorker = selectedWorkerId ? analytics.workersById[selectedWorkerId] : undefined;

  const openAddTransaction = (worker?: Worker, type: TransactionType = 'Payment') =>
    openModal({
      kind: 'transaction',
      record: null,
      defaults: worker
        ? { workerId: worker.id, projectId: worker.projectId, type, direction: TRANSACTION_DEFAULT_DIRECTION[type] }
        : { type, direction: TRANSACTION_DEFAULT_DIRECTION[type] },
    });

  usePrimaryAction('khata', () => openAddTransaction(tab === 'ledger' ? selectedWorker : undefined));

  const transactions = useMemo(() => {
    const { start, end } = normalizeDateRange(dateFrom, dateTo);
    return data.transactions
      .filter(
        (transaction) =>
          (!projectId || transaction.projectId === projectId) &&
          (!txnType || transaction.type === txnType) &&
          (!txnMode || transaction.mode === txnMode) &&
          isDateInRange(transaction.date, start, end) &&
          matchesQuery(debouncedTxnSearch, transaction.id, transaction.notes, transaction.type, getWorkerName(analytics, transaction.workerId)),
      )
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  }, [data.transactions, projectId, txnType, txnMode, dateFrom, dateTo, debouncedTxnSearch, analytics]);

  const pagination = usePagination(transactions, 10, txnFilterKey);

  const transactionActions = (transaction: Transaction): ActionMenuItem[] => [
    { key: 'edit', label: 'Edit transaction', icon: Pencil, onSelect: () => openModal({ kind: 'transaction', record: transaction }) },
    {
      key: 'ledger',
      label: 'Open ledger',
      icon: BookOpen,
      onSelect: () => {
        setTab('ledger');
        setSelectedWorkerId(transaction.workerId);
        if (!isDesktop) setMobileLedgerOpen(true);
      },
    },
    {
      key: 'delete',
      label: 'Delete transaction',
      icon: Trash2,
      tone: 'danger',
      separatorBefore: true,
      onSelect: () =>
        requestDelete({
          kind: 'transaction',
          id: transaction.id,
          label: `${transaction.type} of ${formatINR(transaction.amount)}`,
          description: `${getWorkerName(analytics, transaction.workerId)}'s balance will be recalculated.`,
        }),
    },
  ];

  const handleExport = () => {
    const ok = downloadCsv(
      buildExportFilename('khata-transactions', today),
      ['Transaction ID', 'Date', 'Person', 'Project', 'Type', 'Direction', 'Amount', 'Mode', 'Notes'],
      transactions.map((transaction) => [
        transaction.id,
        transaction.date,
        getWorkerName(analytics, transaction.workerId),
        getProjectName(analytics, transaction.projectId),
        transaction.type,
        transaction.direction,
        transaction.amount,
        transaction.mode,
        transaction.notes,
      ]),
    );
    if (ok) toast.success('Export completed', `${transactions.length} transactions exported.`);
    else toast.error('Export failed', 'Your browser blocked the download.');
  };

  const transactionColumns: ReadonlyArray<TableColumn<Transaction>> = [
    {
      key: 'date',
      header: 'Date',
      render: (transaction) => (
        <div>
          <p className="whitespace-nowrap font-medium text-slate-900">{formatDate(transaction.date)}</p>
          <p className="text-xs text-slate-500">{transaction.id}</p>
        </div>
      ),
    },
    {
      key: 'person',
      header: 'Person',
      render: (transaction) => {
        const worker = analytics.workersById[transaction.workerId];
        return worker ? <WorkerCell worker={worker} subtitle={getProjectName(analytics, transaction.projectId)} /> : 'Removed worker';
      },
    },
    {
      key: 'type',
      header: 'Type',
      render: (transaction) => (
        <div>
          <p className="font-medium text-slate-800">{transaction.type}</p>
          {transaction.notes && <p className="max-w-[220px] truncate text-xs text-slate-500">{transaction.notes}</p>}
        </div>
      ),
    },
    { key: 'mode', header: 'Mode', render: (transaction) => transaction.mode },
    { key: 'direction', header: 'Entry', render: (transaction) => <DirectionBadge direction={transaction.direction} /> },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (transaction) => (
        <AmountText
          value={transaction.direction === 'debit' ? -transaction.amount : transaction.amount}
          tone={transaction.direction === 'debit' ? 'debit' : 'credit'}
          showSign
          className="font-semibold"
        />
      ),
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (transaction) => (
        <RowActions>
          <ActionMenu items={transactionActions(transaction)} label={`Actions for ${transaction.id}`} />
        </RowActions>
      ),
    },
  ];

  const peopleList = (
    <Card padding="none" data-animate className="flex min-h-0 flex-col overflow-hidden lg:max-h-[calc(100dvh-10rem)]">
      <div className="space-y-2 border-b border-slate-100 p-3">
        <SearchInput value={peopleSearch} onChange={setPeopleSearch} placeholder="Search people…" label="Search people" />
        <FilterSelect label="Project" value={projectId} onChange={setProjectId} options={buildProjectOptions(data.projects)} allLabel="All projects" icon={Building2} className="w-full" />
      </div>
      {!ready ? (
        <div className="p-3">
          <ListSkeleton rows={6} />
        </div>
      ) : people.length === 0 ? (
        <EmptyState icon={Users} title="No people found" description="Try another name or project." compact />
      ) : (
        <ul className="erp-scroll-thin min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto" aria-label="People">
          {people.map((worker) => {
            const payable = analytics.workerMetrics[worker.id]?.payable ?? 0;
            const active = worker.id === selectedWorkerId && (isDesktop || mobileLedgerOpen);
            return (
              <li key={worker.id}>
                <button
                  type="button"
                  aria-current={active ? 'true' : undefined}
                  onClick={() => {
                    setSelectedWorkerId(worker.id);
                    if (!isDesktop) setMobileLedgerOpen(true);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-slate-50',
                    FOCUS_RING_INSET,
                    active && 'bg-indigo-50/70 hover:bg-indigo-50',
                  )}
                >
                  <Avatar name={worker.name} id={worker.id} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-slate-900">{worker.name}</span>
                    <span className="block truncate text-xs text-slate-500">
                      {worker.trade} · {getProjectName(analytics, worker.projectId)}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <AmountText value={Math.abs(payable)} tone={payable < 0 ? 'debit' : payable > 0 ? 'neutral' : 'muted'} className="text-[13px]" />
                    <span className={cn('block text-[10px] font-medium uppercase tracking-wide', payable < 0 ? 'text-rose-500' : payable > 0 ? 'text-amber-600' : 'text-slate-400')}>
                      {payable < 0 ? 'Recover' : payable > 0 ? 'Due' : 'Settled'}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 lg:hidden" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {ready ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard label="Total Wages" value={formatINR(totals.wages)} icon={IndianRupee} tone="indigo" secondary="Attendance + manual wages" />
          <StatCard label="Total Paid" value={formatINR(totals.paid)} icon={CheckCircle2} tone="emerald" secondary="Wage settlements" />
          <StatCard label="Total Advances" value={formatINR(totals.advances)} icon={ArrowUpRight} tone="amber" secondary="Adjusted against wages" />
          <StatCard
            label="Total Payable"
            value={formatINR(totals.payable)}
            icon={Wallet}
            tone="rose"
            secondary={totals.recoverable > 0 ? `${formatINRCompact(totals.recoverable)} to recover` : `${totals.dues} people with dues`}
          />
        </div>
      ) : (
        <KpiGridSkeleton count={4} />
      )}

      <Tabs<KhataTab>
        ariaLabel="Khata views"
        value={tab}
        onChange={setTab}
        items={[
          { value: 'ledger', label: 'Person ledger', icon: BookOpen, count: data.workers.length },
          { value: 'transactions', label: 'All transactions', icon: Receipt, count: data.transactions.length },
        ]}
      />

      {tab === 'ledger' ? (
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          {peopleList}
          {isDesktop &&
            (selectedWorker ? (
              <LedgerDetail worker={selectedWorker} projectId={projectId} dateFrom={dateFrom} dateTo={dateTo} onDateFromChange={setDateFrom} onDateToChange={setDateTo} />
            ) : (
              <Card>
                <EmptyState icon={BookOpen} title="Select a person" description="Choose someone from the list to open their khata." />
              </Card>
            ))}
        </div>
      ) : (
        <TableCard>
          <div className="border-b border-slate-100 p-3 sm:p-4">
            <FilterBar
              search={<SearchInput value={txnSearch} onChange={setTxnSearch} placeholder="Search person, note or ID…" label="Search transactions" />}
              activeCount={countActive(txnSearch, txnType, txnMode, projectId, dateFrom, dateTo)}
              onReset={() => {
                setTxnSearch('');
                setTxnType('');
                setTxnMode('');
                setProjectId('');
                setDateFrom('');
                setDateTo('');
              }}
              trailing={
                <>
                  <Button variant="outline" size="sm" icon={Download} onClick={handleExport} disabled={transactions.length === 0}>
                    Export
                  </Button>
                  <Button size="sm" icon={Plus} onClick={() => openAddTransaction()}>
                    Add Transaction
                  </Button>
                </>
              }
            >
              <FilterSelect label="Type" value={txnType} onChange={setTxnType} options={toSelectOptions(TRANSACTION_TYPES)} allLabel="All types" icon={Filter} />
              <FilterSelect label="Mode" value={txnMode} onChange={setTxnMode} options={toSelectOptions(PAYMENT_MODES)} allLabel="All modes" icon={Wallet} />
              <FilterSelect label="Project" value={projectId} onChange={setProjectId} options={buildProjectOptions(data.projects)} allLabel="All projects" icon={Building2} />
              <DateRangeFilter from={dateFrom} to={dateTo} onFromChange={setDateFrom} onToChange={setDateTo} max={today} />
            </FilterBar>
          </div>
          <DataTable
            columns={transactionColumns}
            rows={pagination.pageItems}
            getRowKey={(transaction) => transaction.id}
            loading={!ready || reloading}
            caption="Khata transactions"
            minWidthClassName="min-w-[900px]"
            emptyState={
              <EmptyState
                icon={Receipt}
                title="No transactions found"
                description="Record payments, advances and allowances to keep every khata up to date."
                action={{ label: 'Add Transaction', onClick: () => openAddTransaction() }}
              />
            }
            renderMobileCard={(transaction) => (
              <MobileRecordCard
                leading={
                  <span
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset',
                      transaction.direction === 'credit' ? ICON_TONES.emerald : ICON_TONES.rose,
                    )}
                  >
                    {transaction.direction === 'credit' ? <ArrowDownLeft className="h-4 w-4" aria-hidden="true" /> : <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                  </span>
                }
                title={`${transaction.type} · ${getWorkerName(analytics, transaction.workerId)}`}
                subtitle={`${formatDate(transaction.date)} · ${transaction.mode}`}
                badge={
                  <AmountText
                    value={transaction.direction === 'debit' ? -transaction.amount : transaction.amount}
                    tone={transaction.direction === 'debit' ? 'debit' : 'credit'}
                    showSign
                    className="text-sm font-semibold"
                  />
                }
                actions={<ActionMenu items={transactionActions(transaction)} label={`Actions for ${transaction.id}`} />}
                fields={[
                  { label: 'Project', value: getProjectName(analytics, transaction.projectId) },
                  { label: 'Notes', value: transaction.notes || '—' },
                ]}
              />
            )}
            footer={
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                pageSize={pagination.pageSize}
                onPageChange={pagination.setPage}
                onPageSizeChange={pagination.setPageSize}
                itemLabel="transactions"
              />
            }
          />
        </TableCard>
      )}

      <Modal
        open={!isDesktop && mobileLedgerOpen && Boolean(selectedWorker)}
        onClose={() => setMobileLedgerOpen(false)}
        mobileFullScreen
        size="xl"
        title={selectedWorker?.name ?? 'Ledger'}
        description={selectedWorker ? `${selectedWorker.trade} · ${getProjectName(analytics, selectedWorker.projectId)}` : undefined}
        icon={BookOpen}
        bodyClassName="px-3 py-3"
      >
        {selectedWorker && (
          <LedgerDetail
            worker={selectedWorker}
            projectId={projectId}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            embedded
          />
        )}
      </Modal>
    </div>
  );
}

function LedgerDetail({
  worker,
  projectId,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  embedded = false,
}: {
  worker: Worker;
  projectId: string;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  embedded?: boolean;
}) {
  const { data, analytics, today, openModal, requestDelete } = useErp();
  const metrics = analytics.workerMetrics[worker.id];
  const allRows = useMemo(() => buildLedgerRows(data, worker), [data, worker]);

  const visibleRows = useMemo(() => {
    const { start, end } = normalizeDateRange(dateFrom, dateTo);
    return allRows.filter((row) => isDateInRange(row.date, start, end) && (!projectId || row.projectId === projectId)).reverse();
  }, [allRows, dateFrom, dateTo, projectId]);

  const periodCredit = sumBy(visibleRows, (row) => row.credit);
  const periodDebit = sumBy(visibleRows, (row) => row.debit);
  const isFiltered = Boolean(dateFrom || dateTo || projectId);
  const payable = metrics?.payable ?? 0;

  const addTransaction = (type: TransactionType) =>
    openModal({
      kind: 'transaction',
      record: null,
      defaults: { workerId: worker.id, projectId: worker.projectId, type, direction: TRANSACTION_DEFAULT_DIRECTION[type] },
    });

  const rowActions = (transaction: Transaction): ActionMenuItem[] => [
    { key: 'edit', label: 'Edit transaction', icon: Pencil, onSelect: () => openModal({ kind: 'transaction', record: transaction }) },
    {
      key: 'delete',
      label: 'Delete transaction',
      icon: Trash2,
      tone: 'danger',
      separatorBefore: true,
      onSelect: () =>
        requestDelete({
          kind: 'transaction',
          id: transaction.id,
          label: `${transaction.type} of ${formatINR(transaction.amount)}`,
          description: `${worker.name}'s balance will be recalculated.`,
        }),
    },
  ];

  const content = (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!embedded && <WorkerCell worker={worker} subtitle={`${worker.trade} · ${getProjectName(analytics, worker.projectId)} · ${formatINR(worker.dailyWage)}/day`} />}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" icon={ArrowUpRight} onClick={() => addTransaction('Advance')}>
            Advance
          </Button>
          <Button size="sm" variant="outline" icon={Plus} onClick={() => addTransaction('Daily Allowance')}>
            Other entry
          </Button>
          <Button size="sm" icon={Wallet} onClick={() => addTransaction('Payment')}>
            Add Payment
          </Button>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 2xl:grid-cols-5">
          <MiniStat label="Total earning" value={formatINR(metrics.totalEarning)} tone="emerald" hint={`${formatINR(metrics.attendanceWages)} from attendance`} />
          <MiniStat label="Total payment" value={formatINR(metrics.payments)} tone="indigo" />
          <MiniStat label="Advance" value={formatINR(metrics.advances)} tone="amber" />
          <MiniStat label="Expenses" value={formatINR(metrics.expenseClaims + metrics.reimbursements)} tone="sky" hint="Claims & reimbursements" />
          <div
            className={cn(
              'col-span-2 min-w-0 rounded-xl border px-3 py-2.5 md:col-span-1 sm:px-4 sm:py-3',
              payable < 0 ? 'border-rose-200 bg-rose-50/60' : 'border-slate-900 bg-slate-900 text-white',
            )}
          >
            <p className={cn('text-xs font-medium', payable < 0 ? 'text-rose-700' : 'text-slate-300')}>
              {payable < 0 ? 'To recover from worker' : 'Remaining payable'}
            </p>
            <p className={cn('mt-1 truncate text-lg font-semibold tabular-nums', payable < 0 ? 'text-rose-700' : 'text-white')}>{formatINR(Math.abs(payable))}</p>
            {metrics.deductions > 0 && (
              <p className={cn('text-[11px]', payable < 0 ? 'text-rose-600' : 'text-slate-400')}>After {formatINR(metrics.deductions)} deductions</p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 sm:flex-row sm:items-center sm:justify-between">
        <DateRangeFilter from={dateFrom} to={dateTo} onFromChange={onDateFromChange} onToChange={onDateToChange} max={today} />
        <p className="text-xs text-slate-500">
          {isFiltered ? 'In view: ' : 'All time: '}
          <span className="font-semibold text-emerald-700">+{formatINR(periodCredit)}</span> ·{' '}
          <span className="font-semibold text-rose-600">−{formatINR(periodDebit)}</span>
        </p>
      </div>

      <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
        Credit adds to what the company owes this person; debit reduces it. Attendance wages are added automatically each week. Balance is the running total.
      </p>

      {visibleRows.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No ledger entries"
          description={isFiltered ? 'Nothing recorded for this date range or project.' : 'Mark attendance or add a transaction to start this khata.'}
          action={{ label: 'Add Transaction', onClick: () => addTransaction('Payment') }}
          compact
        />
      ) : (
        <>
          <div className="erp-scroll-thin hidden max-h-[60vh] overflow-auto rounded-xl border border-slate-200/80 md:block">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
              <caption className="sr-only">Ledger for {worker.name}</caption>
              <thead>
                <tr>
                  {['Date', 'Particulars', 'Mode', 'Credit', 'Debit', 'Balance', ''].map((heading, index) => (
                    <th
                      key={heading || `col-${index}`}
                      scope="col"
                      className={cn(
                        'sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500',
                        index >= 3 ? 'text-right' : 'text-left',
                      )}
                    >
                      {heading || <span className="sr-only">Actions</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-slate-700">{formatDate(row.date)}</td>
                    <td className="border-b border-slate-100 px-3 py-2.5">
                      <p className="flex items-center gap-1.5 font-medium text-slate-900">
                        {row.title}
                        {row.source === 'attendance' && <Badge tone="neutral">Auto</Badge>}
                      </p>
                      <p className="max-w-[260px] truncate text-xs text-slate-500">
                        {row.detail} · {getProjectName(analytics, row.projectId)}
                      </p>
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2.5 text-slate-600">{row.mode || '—'}</td>
                    <td className="border-b border-slate-100 px-3 py-2.5 text-right">
                      {row.credit > 0 ? <AmountText value={row.credit} tone="credit" /> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2.5 text-right">
                      {row.debit > 0 ? <AmountText value={row.debit} tone="debit" /> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2.5 text-right">
                      <AmountText value={row.balance} tone={row.balance < 0 ? 'debit' : 'neutral'} className="font-semibold" />
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2.5 text-right">
                      {row.transaction ? (
                        <RowActions>
                          <ActionMenu items={rowActions(row.transaction)} label={`Actions for ${row.transaction.id}`} />
                        </RowActions>
                      ) : (
                        <Tooltip content="Generated from attendance. Edit attendance to change it.">
                          <span className="inline-grid h-8 w-8 place-items-center text-slate-300" tabIndex={0} aria-label="Automatic entry">
                            <Info className="h-4 w-4" aria-hidden="true" />
                          </span>
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-2 md:hidden">
            {visibleRows.map((row) => (
              <li key={row.id} className="rounded-xl border border-slate-200/80 bg-white p-3">
                <div className="flex items-start gap-3">
                  <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset', row.credit > 0 ? ICON_TONES.emerald : ICON_TONES.rose)}>
                    {row.credit > 0 ? <ArrowDownLeft className="h-4 w-4" aria-hidden="true" /> : <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{row.title}</p>
                    <p className="truncate text-xs text-slate-500">
                      {formatDate(row.date)} · {row.mode || 'Auto'} · {row.detail}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <AmountText value={row.credit > 0 ? row.credit : -row.debit} tone={row.credit > 0 ? 'credit' : 'debit'} showSign className="text-sm" />
                    <p className="text-[11px] tabular-nums text-slate-500">Bal {formatINR(row.balance)}</p>
                  </div>
                  {row.transaction && (
                    <RowActions className="-mr-1.5 -mt-1">
                      <ActionMenu items={rowActions(row.transaction)} label={`Actions for ${row.transaction.id}`} />
                    </RowActions>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  return embedded ? content : <Card data-animate>{content}</Card>;
}

/* ========================================================= */
/* Projects Section                                          */
/* ========================================================= */

type ProjectView = 'grid' | 'table';

function ProjectsSection() {
  const { data, analytics, ready, openModal, requestDelete } = useErp();
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState<ProjectStage | ''>('');
  const [location, setLocation] = useState('');
  const [view, setView] = useState<ProjectView>('grid');
  const [detailProjectId, setDetailProjectId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<ProjectDetailTab>('overview');
  const debouncedSearch = useDebouncedValue(search, 200);
  const reloading = useSoftReload([debouncedSearch, stage, location, view].join('|'));

  usePrimaryAction('projects', () => openModal({ kind: 'project', record: null }));

  useNavigationFocus((focus) => {
    if (!focus.projectId) return false;
    setDetailTab(focus.projectTab ?? 'overview');
    setDetailProjectId(focus.projectId);
    return true;
  });

  const openDetail = useCallback((projectId: string, tab: ProjectDetailTab = 'overview') => {
    setDetailTab(tab);
    setDetailProjectId(projectId);
  }, []);

  const closeDetail = useCallback(() => setDetailProjectId(null), []);

  const summary = useMemo(() => {
    const booked = data.projects.filter((project) => project.stage === 'Running' || project.stage === 'Completed');
    return {
      total: data.projects.length,
      running: data.projects.filter((project) => project.stage === 'Running').length,
      value: sumBy(
        data.projects.filter((project) => project.stage !== 'Enquiry'),
        (project) => project.projectValue,
      ),
      actual: sumBy(booked, (project) => analytics.projectFinancials[project.id]?.actualCost ?? 0),
      profit: sumBy(booked, (project) => analytics.projectFinancials[project.id]?.profitLoss ?? 0),
      overBudget: booked.filter((project) => analytics.projectFinancials[project.id]?.isOverBudget).length,
    };
  }, [data.projects, analytics.projectFinancials]);

  const stageCounts = useMemo(() => {
    const counts: Record<ProjectStage, number> = { Enquiry: 0, 'Coming Soon': 0, Running: 0, Completed: 0 };
    for (const project of data.projects) counts[project.stage] += 1;
    return counts;
  }, [data.projects]);

  const locations = useMemo(() => Array.from(new Set(data.projects.map((project) => project.location))).sort(), [data.projects]);

  const filtered = useMemo(
    () =>
      data.projects
        .filter(
          (project) =>
            (!stage || project.stage === stage) &&
            (!location || project.location === location) &&
            matchesQuery(debouncedSearch, project.name, project.id, project.clientName, project.location, project.engineerName, project.address),
        )
        .sort((a, b) => PROJECT_STAGES.indexOf(b.stage === 'Running' ? 'Completed' : a.stage) - PROJECT_STAGES.indexOf(a.stage === 'Running' ? 'Completed' : b.stage) || a.name.localeCompare(b.name)),
    [data.projects, stage, location, debouncedSearch],
  );

  const projectActions = (project: Project): ActionMenuItem[] => [
    { key: 'view', label: 'View details', icon: Eye, onSelect: () => openDetail(project.id) },
    { key: 'analytics', label: 'Site analytics', icon: BarChart3, onSelect: () => openDetail(project.id, 'analytics') },
    { key: 'edit', label: 'Edit project', icon: Pencil, onSelect: () => openModal({ kind: 'project', record: project }) },
    {
      key: 'expense',
      label: 'Add expense',
      icon: Receipt,
      onSelect: () => openModal({ kind: 'expense', record: null, defaults: { projectId: project.id } }),
    },
    {
      key: 'delete',
      label: 'Delete project',
      icon: Trash2,
      tone: 'danger',
      separatorBefore: true,
      onSelect: () =>
        requestDelete({
          kind: 'project',
          id: project.id,
          label: project.name,
          description: 'Assigned workers will be unassigned. Expenses and stock linked to this project will no longer count towards any project.',
        }),
    },
  ];

  const resetFilters = () => {
    setSearch('');
    setStage('');
    setLocation('');
  };

  const columns: ReadonlyArray<TableColumn<Project>> = [
    {
      key: 'name',
      header: 'Project',
      render: (project) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{project.name}</p>
          <p className="truncate text-xs text-slate-500">
            {project.id} · {project.clientName}
          </p>
        </div>
      ),
    },
    { key: 'stage', header: 'Stage', render: (project) => <StageBadge stage={project.stage} /> },
    { key: 'location', header: 'Location', render: (project) => project.location },
    { key: 'value', header: 'Value', align: 'right', render: (project) => <AmountText value={project.projectValue} compact /> },
    {
      key: 'actual',
      header: 'Actual cost',
      align: 'right',
      render: (project) => <AmountText value={analytics.projectFinancials[project.id]?.actualCost ?? 0} compact />,
    },
    {
      key: 'profit',
      header: 'Profit/Loss',
      align: 'right',
      render: (project) => <AmountText value={analytics.projectFinancials[project.id]?.profitLoss ?? 0} tone="auto" compact className="font-semibold" />,
    },
    {
      key: 'budget',
      header: 'Budget used',
      render: (project) => {
        const usage = analytics.projectFinancials[project.id]?.budgetUsage ?? 0;
        return (
          <div className="flex w-32 items-center gap-2">
            <ProgressBar value={usage} tone={getUtilisationTone(usage)} size="xs" label={`${project.name} budget`} />
            <span className="w-11 shrink-0 text-right text-xs tabular-nums">{formatPercent(usage, 0)}</span>
          </div>
        );
      },
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (project) => {
        const progress = analytics.projectFinancials[project.id]?.progress ?? 0;
        return (
          <div className="flex w-28 items-center gap-2">
            <ProgressBar value={progress} tone="indigo" size="xs" label={`${project.name} progress`} />
            <span className="w-9 shrink-0 text-right text-xs tabular-nums">{formatPercent(progress, 0)}</span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (project) => (
        <RowActions>
          <IconButton label={`View ${project.name}`} icon={Eye} onClick={() => openDetail(project.id)} />
          <ActionMenu items={projectActions(project)} label={`Actions for ${project.name}`} />
        </RowActions>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {ready ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard label="Total Projects" value={String(summary.total)} icon={Building2} tone="indigo" secondary={`${summary.running} running`} />
          <StatCard label="Portfolio Value" value={formatINRCompact(summary.value)} icon={IndianRupee} tone="emerald" secondary="Excludes enquiries" />
          <StatCard label="Actual Cost" value={formatINRCompact(summary.actual)} icon={Layers} tone="amber" secondary="Running & completed" />
          <StatCard
            label="Projected Profit"
            value={formatINRCompact(summary.profit)}
            icon={summary.profit >= 0 ? TrendingUp : TrendingDown}
            tone={summary.profit >= 0 ? 'teal' : 'rose'}
            secondary={summary.overBudget > 0 ? `${summary.overBudget} over budget` : 'All within budget'}
          />
        </div>
      ) : (
        <KpiGridSkeleton count={4} />
      )}

      <Card padding="sm" data-animate className="space-y-3">
        <FilterPills<ProjectStage>
          ariaLabel="Filter by stage"
          value={stage}
          onChange={setStage}
          options={[
            { value: '', label: 'All', count: data.projects.length },
            ...PROJECT_STAGES.map((item) => ({ value: item, label: item, count: stageCounts[item], dot: STAGE_STYLES[item].dot })),
          ]}
        />
        <FilterBar
          search={<SearchInput value={search} onChange={setSearch} placeholder="Search project, client, city…" label="Search projects" />}
          activeCount={countActive(search, stage, location)}
          onReset={resetFilters}
          trailing={
            <>
              <SegmentedControl<ProjectView>
                ariaLabel="Project view"
                value={view}
                onChange={setView}
                options={[
                  { value: 'grid', label: 'Cards', icon: LayoutDashboard },
                  { value: 'table', label: 'Table', icon: FileText },
                ]}
              />
              <Button size="sm" icon={Plus} onClick={() => openModal({ kind: 'project', record: null })}>
                Add Project
              </Button>
            </>
          }
        >
          <FilterSelect label="Location" value={location} onChange={setLocation} options={toSelectOptions(locations)} allLabel="All locations" icon={MapPin} />
        </FilterBar>
      </Card>

      {filtered.length === 0 && ready ? (
        <Card>
          <EmptyState
            icon={Building2}
            title={data.projects.length === 0 ? 'No projects yet' : 'No projects match'}
            description={data.projects.length === 0 ? 'Add an enquiry or a running site to start tracking costs.' : 'Try another stage, location or search.'}
            action={{ label: 'Add Project', onClick: () => openModal({ kind: 'project', record: null }) }}
            secondaryAction={data.projects.length > 0 ? { label: 'Reset filters', icon: RotateCcw, onClick: resetFilters } : undefined}
          />
        </Card>
      ) : view === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {!ready || reloading
            ? Array.from({ length: 6 }, (_, index) => (
                <Card key={index}>
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="mt-2 h-3 w-28" />
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                  </div>
                  <Skeleton className="mt-5 h-2 w-full" rounded="full" />
                </Card>
              ))
            : filtered.map((project) => {
                const financials = analytics.projectFinancials[project.id];
                if (!financials) return null;
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    financials={financials}
                    actions={projectActions(project)}
                    onOpen={() => openDetail(project.id)}
                  />
                );
              })}
        </div>
      ) : (
        <TableCard>
          <DataTable
            columns={columns}
            rows={filtered}
            getRowKey={(project) => project.id}
            loading={!ready || reloading}
            caption="Projects"
            minWidthClassName="min-w-[1080px]"
            mobileBreakpoint="lg"
            onRowClick={(project) => openDetail(project.id)}
            renderMobileCard={(project) => {
              const financials = analytics.projectFinancials[project.id];
              return (
                <MobileRecordCard
                  title={project.name}
                  subtitle={`${project.location} · ${project.clientName}`}
                  badge={<StageBadge stage={project.stage} />}
                  onClick={() => openDetail(project.id)}
                  actions={<ActionMenu items={projectActions(project)} label={`Actions for ${project.name}`} />}
                  fields={[
                    { label: 'Value', value: formatINRCompact(project.projectValue) },
                    { label: 'Profit/Loss', value: <AmountText value={financials?.profitLoss ?? 0} tone="auto" compact /> },
                  ]}
                  footer={<ProgressBar value={financials?.progress ?? 0} label="Progress" showValue tone="indigo" size="sm" />}
                />
              );
            }}
          />
        </TableCard>
      )}

      <ProjectDetailModal projectId={detailProjectId} tab={detailTab} onTabChange={setDetailTab} onClose={closeDetail} />
    </div>
  );
}

function ProjectCard({
  project,
  financials,
  actions,
  onOpen,
}: {
  project: Project;
  financials: ProjectFinancials;
  actions: ActionMenuItem[];
  onOpen: () => void;
}) {
  return (
    <Card data-animate interactive className="flex flex-col">
      <div className="flex items-start gap-3">
        <button type="button" onClick={onOpen} className={cn('min-w-0 flex-1 rounded-md text-left', FOCUS_RING)}>
          <div className="flex flex-wrap items-center gap-2">
            <StageBadge stage={project.stage} />
            {financials.isOverBudget && (
              <Badge tone="danger" icon={AlertTriangle}>
                Over budget
              </Badge>
            )}
          </div>
          <h3 className="mt-2 truncate text-[15px] font-semibold text-slate-900">{project.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
            {project.location} · {project.clientName}
          </p>
        </button>
        <ActionMenu items={actions} label={`Actions for ${project.name}`} />
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50/80 p-3">
        <div className="min-w-0">
          <dt className="text-[11px] text-slate-500">Value</dt>
          <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-slate-900">{formatINRCompact(project.projectValue)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[11px] text-slate-500">Actual</dt>
          <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-slate-900">{formatINRCompact(financials.actualCost)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[11px] text-slate-500">Profit</dt>
          <dd className="mt-0.5 truncate text-sm">
            <AmountText value={financials.profitLoss} tone="auto" compact className="font-semibold" />
          </dd>
        </div>
      </dl>

      <div className="mt-4 space-y-3">
        <ProgressBar value={financials.progress} tone="indigo" size="sm" label="Work progress" showValue />
        <ProgressBar
          value={financials.budgetUsage}
          tone={getUtilisationTone(financials.budgetUsage)}
          size="sm"
          label="Budget used"
          valueLabel={formatPercent(financials.budgetUsage)}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {financials.activeWorkers} workers
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          Due {formatDate(project.expectedCompletion)}
        </span>
      </div>
    </Card>
  );
}

function ProjectDetailModal({
  projectId,
  tab,
  onTabChange,
  onClose,
}: {
  projectId: string | null;
  tab: ProjectDetailTab;
  onTabChange: (tab: ProjectDetailTab) => void;
  onClose: () => void;
}) {
  const { data, analytics, openModal, requestDelete } = useErp();
  const retainedId = useRetainedValue(projectId);
  const project = retainedId ? analytics.projectsById[retainedId] : undefined;
  const financials = retainedId ? analytics.projectFinancials[retainedId] : undefined;

  useEffect(() => {
    if (projectId && !analytics.projectsById[projectId]) onClose();
  }, [projectId, analytics.projectsById, onClose]);

  const counts = useMemo(() => {
    if (!retainedId) return { workers: 0, work: 0, materials: 0, expenses: 0, payments: 0 };
    return {
      workers: data.workers.filter((worker) => worker.projectId === retainedId).length,
      work: data.workEntries.filter((entry) => entry.projectId === retainedId).length,
      materials: data.materials.filter((material) => material.projectId === retainedId).length,
      expenses: data.expenses.filter((expense) => expense.projectId === retainedId).length,
      payments: data.transactions.filter((transaction) => transaction.projectId === retainedId).length,
    };
  }, [data, retainedId]);

  const tabs: ReadonlyArray<TabItem<ProjectDetailTab>> = [
    { value: 'overview', label: 'Overview', icon: LayoutDashboard },
    { value: 'analytics', label: 'Site Dashboard', icon: BarChart3 },
    { value: 'workers', label: 'Workers', icon: Users, count: counts.workers },
    { value: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { value: 'work', label: 'Work', icon: ClipboardList, count: counts.work },
    { value: 'materials', label: 'Materials', icon: Package, count: counts.materials },
    { value: 'expenses', label: 'Expenses', icon: Receipt, count: counts.expenses },
    { value: 'payments', label: 'Payments', icon: Wallet, count: counts.payments },
  ];

  return (
    <Modal
      open={Boolean(projectId && project)}
      onClose={onClose}
      size="2xl"
      mobileFullScreen
      title={project?.name ?? 'Project'}
      description={
        project ? (
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <StageBadge stage={project.stage} />
            <span>
              {project.id} · {project.location}
            </span>
          </span>
        ) : undefined
      }
      icon={Building2}
      bodyClassName="pt-0 sm:pt-0"
      footer={
        project ? (
          <>
            <Button
              variant="ghost"
              icon={Trash2}
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 sm:mr-auto"
              onClick={() =>
                requestDelete({
                  kind: 'project',
                  id: project.id,
                  label: project.name,
                  description: 'Assigned workers will be unassigned. Linked records will no longer count towards any project.',
                })
              }
            >
              Delete
            </Button>
            <Button variant="outline" icon={Receipt} onClick={() => openModal({ kind: 'expense', record: null, defaults: { projectId: project.id } })}>
              Add Expense
            </Button>
            <Button icon={Pencil} onClick={() => openModal({ kind: 'project', record: project })}>
              Edit Project
            </Button>
          </>
        ) : undefined
      }
    >
      {project && financials && (
        <div>
          <div className="sticky top-0 z-20 -mx-4 bg-white px-4 sm:-mx-6 sm:px-6">
            <Tabs ariaLabel="Project sections" items={tabs} value={tab} onChange={onTabChange} />
          </div>
          <div className="pt-4 sm:pt-5">
            {tab === 'overview' && <ProjectOverviewTab project={project} financials={financials} />}
            {tab === 'analytics' && <RunningProjectDashboard project={project} financials={financials} />}
            {tab === 'workers' && <ProjectWorkersTab project={project} />}
            {tab === 'attendance' && <ProjectAttendanceTab project={project} />}
            {tab === 'work' && <ProjectWorkTab project={project} />}
            {tab === 'materials' && <ProjectMaterialsTab project={project} />}
            {tab === 'expenses' && <ProjectExpensesTab project={project} />}
            {tab === 'payments' && <ProjectPaymentsTab project={project} />}
          </div>
        </div>
      )}
    </Modal>
  );
}

function ProjectOverviewTab({ project, financials }: { project: Project; financials: ProjectFinancials }) {
  const budgetData = [
    { name: 'Labour', Budget: project.labourBudget, Actual: financials.labourCost },
    { name: 'Material', Budget: project.materialBudget, Actual: financials.materialCost },
    { name: 'Other', Budget: project.otherBudget, Actual: financials.otherCost },
  ];
  const heads: Array<{ label: string; actual: number; budget: number; usage: number }> = [
    { label: 'Labour', actual: financials.labourCost, budget: project.labourBudget, usage: financials.labourBudgetUsage },
    { label: 'Material', actual: financials.materialCost, budget: project.materialBudget, usage: financials.materialBudgetUsage },
    { label: 'Other', actual: financials.otherCost, budget: project.otherBudget, usage: financials.otherBudgetUsage },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
        <MiniStat label="Project value" value={formatINRCompact(project.projectValue)} tone="emerald" />
        <MiniStat label="Estimated cost" value={formatINRCompact(project.estimatedCost)} tone="slate" />
        <MiniStat label="Actual cost" value={formatINRCompact(financials.actualCost)} tone="indigo" />
        <MiniStat
          label={financials.profitLoss >= 0 ? 'Profit' : 'Loss'}
          value={<AmountText value={financials.profitLoss} tone="auto" compact />}
          tone={financials.profitLoss >= 0 ? 'teal' : 'rose'}
          hint={`${formatPercent(financials.profitMargin)} margin`}
        />
        <MiniStat label="Progress" value={formatPercent(financials.progress)} tone="sky" hint={`${formatNumber(financials.completedWork)} / ${formatNumber(project.workTarget)} sq.ft.`} />
        <MiniStat label="Cost per sq.ft." value={financials.costPerSqft > 0 ? formatINR(financials.costPerSqft) : '—'} tone="amber" hint="Actual cost ÷ completed area" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card padding="none" className="lg:col-span-3">
          <div className="px-4 pt-4 sm:px-5">
            <CardHeader title="Budget vs Actual" description="By cost head" />
          </div>
          <div className="h-[260px] px-2 pb-3 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid {...CHART_GRID_PROPS} />
                <XAxis dataKey="name" {...CHART_AXIS_PROPS} />
                <YAxis {...CHART_AXIS_PROPS} tickFormatter={formatAxisINR} width={56} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#475569' }} />
                <Bar dataKey="Budget" name="Budget" fill={CHART_COLORS.estimated} radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Actual" name="Actual" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {budgetData.map((item) => (
                    <Cell key={item.name} fill={item.Actual > item.Budget ? CHART_COLORS.loss : CHART_COLORS.actual} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Budget Utilisation" description={`${formatPercent(financials.budgetUsage)} of estimate used`} icon={Target} iconTone="amber" />
          <div className="mt-4 space-y-4">
            <ProgressBar
              value={financials.budgetUsage}
              tone={getUtilisationTone(financials.budgetUsage)}
              label="Overall"
              valueLabel={`${formatINRCompact(financials.actualCost)} / ${formatINRCompact(project.estimatedCost)}`}
            />
            {heads.map((head) => (
              <ProgressBar
                key={head.label}
                value={head.usage}
                tone={getUtilisationTone(head.usage)}
                size="sm"
                label={head.label}
                valueLabel={`${formatPercent(head.usage, 0)} · ${formatINRCompact(head.actual)}`}
              />
            ))}
            <p className={cn('rounded-lg px-3 py-2 text-xs font-medium', financials.remainingBudget < 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700')}>
              {financials.remainingBudget < 0
                ? `Over estimate by ${formatINR(-financials.remainingBudget)}`
                : `${formatINR(financials.remainingBudget)} remaining in estimate`}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Project Information" icon={Building2} />
          <DetailList
            className="mt-4"
            items={[
              { label: 'Address', value: project.address, icon: MapPin, fullWidth: true },
              { label: 'Start date', value: formatDate(project.startDate), icon: Calendar },
              { label: 'Expected completion', value: formatDate(project.expectedCompletion), icon: CalendarCheck },
              { label: 'Engineer', value: project.engineerName, icon: HardHat },
              { label: 'Architect', value: project.architectName, icon: Layers },
              { label: 'Work target', value: `${formatNumber(project.workTarget)} sq.ft.`, icon: Target },
              { label: 'Active workers', value: financials.activeWorkers, icon: Users },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Owner / Client" icon={Users} />
          <DetailList
            className="mt-4"
            items={[
              { label: 'Client name', value: project.clientName, fullWidth: true },
              {
                label: 'Mobile',
                icon: Phone,
                value: project.clientPhone ? (
                  <a href={`tel:+91${normalizePhone(project.clientPhone)}`} className={cn('rounded text-indigo-600 hover:underline', FOCUS_RING)}>
                    {formatPhone(project.clientPhone)}
                  </a>
                ) : (
                  ''
                ),
              },
              {
                label: 'Email',
                icon: Mail,
                value: project.clientEmail ? (
                  <a href={`mailto:${project.clientEmail}`} className={cn('break-all rounded text-indigo-600 hover:underline', FOCUS_RING)}>
                    {project.clientEmail}
                  </a>
                ) : (
                  ''
                ),
              },
              { label: 'Reference / source', value: project.referenceSource, icon: Info, fullWidth: true },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}

function RunningProjectDashboard({ project, financials }: { project: Project; financials: ProjectFinancials }) {
  const { data, analytics, selectedDate } = useErp();
  const [range, setRange] = useState<TimeRange>('weekly');
  const bounds = useMemo(() => getRangeBounds(range, selectedDate), [range, selectedDate]);

  const stats = useMemo(() => {
    const current = sumCostEvents(analytics.costEvents, bounds.start, bounds.end, project.id);
    const previous = sumCostEvents(analytics.costEvents, bounds.previousStart, bounds.previousEnd, project.id);
    const entries = data.workEntries.filter((entry) => entry.projectId === project.id && isDateInRange(entry.date, bounds.start, bounds.end));
    const sqft = sumBy(
      entries.filter((entry) => entry.unit === 'sq.ft.'),
      (entry) => entry.quantity,
    );
    return { current, previous, entries, sqft };
  }, [analytics.costEvents, data.workEntries, bounds, project.id]);

  const workerRows = useMemo(() => {
    const rows = new Map<string, { workerId: string; salary: number; effectiveDays: number; markedDays: number; work: Map<string, number> }>();
    const ensure = (workerId: string) => {
      const existing = rows.get(workerId);
      if (existing) return existing;
      const created = { workerId, salary: 0, effectiveDays: 0, markedDays: 0, work: new Map<string, number>() };
      rows.set(workerId, created);
      return created;
    };
    for (const event of analytics.costEvents) {
      if (event.projectId !== project.id || event.kind !== 'labour' || !event.workerId) continue;
      if (!isDateInRange(event.date, bounds.start, bounds.end)) continue;
      ensure(event.workerId).salary += event.amount;
    }
    for (const record of data.attendance) {
      if (record.projectId !== project.id || !isDateInRange(record.date, bounds.start, bounds.end)) continue;
      const row = ensure(record.workerId);
      row.markedDays += 1;
      row.effectiveDays += ATTENDANCE_FACTOR[record.status];
    }
    for (const entry of stats.entries) {
      const row = ensure(entry.workerId);
      const unit = getWorkUnitLabel(entry.unit, entry.customUnit);
      row.work.set(unit, (row.work.get(unit) ?? 0) + entry.quantity);
    }
    return Array.from(rows.values()).sort((a, b) => b.salary - a.salary);
  }, [analytics.costEvents, data.attendance, stats.entries, bounds, project.id]);

  const trend = useMemo(() => {
    if (range === 'monthly') return buildMonthlyCostTrend(analytics.costEvents, selectedDate, 6, project.id);
    if (range === 'weekly') return buildWeeklyCostTrend(analytics.costEvents, selectedDate, 8, project.id);
    return buildDailyCostTrend(analytics.costEvents, addDays(selectedDate, -6), selectedDate, project.id);
  }, [range, analytics.costEvents, selectedDate, project.id]);

  const productivity = useMemo(() => {
    const rows = computeProductivityRows(stats.entries, data.attendance).filter((row) => row.unit !== 'day');
    const unitTotals = new Map<string, number>();
    for (const row of rows) unitTotals.set(row.unit, (unitTotals.get(row.unit) ?? 0) + row.entries);
    const unit = Array.from(unitTotals.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
    return {
      unit,
      data: rows
        .filter((row) => row.unit === unit)
        .slice(0, 8)
        .map((row) => ({ name: getWorkerName(analytics, row.workerId), perDay: row.perDay })),
    };
  }, [stats.entries, data.attendance, analytics]);

  const breakdown = [
    { name: 'Labour', value: stats.current.labour, color: CHART_COLORS.labour },
    { name: 'Material', value: stats.current.material, color: CHART_COLORS.material },
    { name: 'Other', value: stats.current.other, color: CHART_COLORS.other },
  ];

  const budgetVsActual = [
    { name: 'Labour', Budget: project.labourBudget, Actual: financials.labourCost },
    { name: 'Material', Budget: project.materialBudget, Actual: financials.materialCost },
    { name: 'Other', Budget: project.otherBudget, Actual: financials.otherCost },
  ];

  const rangeCostPerSqft = safeDivide(stats.current.total, stats.sqft);
  const trendLabel = range === 'monthly' ? 'Last 6 months' : range === 'weekly' ? 'Last 8 weeks' : 'Last 7 days';

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Site dashboard · {bounds.label}</p>
          <p className="text-xs text-slate-500">
            {formatDate(bounds.start)} – {formatDate(bounds.end)}
            {project.stage !== 'Running' && ' · based on recorded activity for this project'}
          </p>
        </div>
        <SegmentedControl<TimeRange>
          ariaLabel="Time range"
          value={range}
          onChange={setRange}
          options={TIME_RANGES.map((value) => ({ value, label: TIME_RANGE_LABELS[value] }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total Expense"
          value={formatINR(stats.current.total)}
          icon={Receipt}
          tone="rose"
          trend={{ value: percentChange(stats.current.total, stats.previous.total), label: 'vs previous', invert: true }}
        />
        <StatCard label="Labour Salary" value={formatINR(stats.current.labour)} icon={HardHat} tone="indigo" secondary={`${workerRows.filter((row) => row.salary > 0).length} workers paid`} />
        <StatCard label="Material Expense" value={formatINR(stats.current.material)} icon={Package} tone="amber" />
        <StatCard label="Other Expenses" value={formatINR(stats.current.other)} icon={Truck} tone="sky" />
        <StatCard label="Work Completed" value={formatQuantity(stats.sqft, 'sq.ft.')} icon={Layers} tone="emerald" secondary={`${stats.entries.length} entries`} />
        <StatCard label="Cost per sq.ft." value={rangeCostPerSqft > 0 ? formatINR(rangeCostPerSqft) : '—'} icon={Gauge} tone="violet" secondary="For this period" />
        <StatCard label="Remaining Budget" value={formatINRCompact(financials.remainingBudget)} icon={Target} tone={financials.remainingBudget < 0 ? 'rose' : 'teal'} secondary={`of ${formatINRCompact(project.estimatedCost)}`} />
        <StatCard label="Budget Used" value={formatPercent(financials.budgetUsage)} icon={BarChart3} tone={financials.isOverBudget ? 'rose' : 'slate'} secondary={`${formatPercent(financials.progress)} work progress`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Cost Breakdown" description={bounds.label} height={220} isEmpty={stats.current.total === 0} legend={<ChartLegend items={breakdown.map((item) => ({ label: item.name, color: item.color, value: formatINRCompact(item.value) }))} />}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={2} stroke="none">
                {breakdown.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <RechartsTooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expense Trend" description={trendLabel} height={220} isEmpty={trend.every((point) => point.total === 0)}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid {...CHART_GRID_PROPS} />
              <XAxis dataKey="label" {...CHART_AXIS_PROPS} />
              <YAxis {...CHART_AXIS_PROPS} tickFormatter={formatAxisINR} width={56} />
              <RechartsTooltip content={<ChartTooltip showTotal />} />
              <Line type="monotone" dataKey="labour" name="Labour" stroke={CHART_COLORS.labour} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="material" name="Material" stroke={CHART_COLORS.material} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="other" name="Other" stroke={CHART_COLORS.other} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Budget vs Actual" description="Project to date" height={220}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetVsActual} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...CHART_GRID_PROPS} />
              <XAxis dataKey="name" {...CHART_AXIS_PROPS} />
              <YAxis {...CHART_AXIS_PROPS} tickFormatter={formatAxisINR} width={56} />
              <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip />} />
              <Bar dataKey="Budget" name="Budget" fill={CHART_COLORS.estimated} radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar dataKey="Actual" name="Actual" fill={CHART_COLORS.actual} radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Labour Productivity"
          description={productivity.unit ? `${productivity.unit} per effective day · ${bounds.label}` : bounds.label}
          height={220}
          isEmpty={productivity.data.length === 0}
          emptyTitle="No measured work in this period"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productivity.data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...CHART_GRID_PROPS} />
              <XAxis dataKey="name" {...CHART_AXIS_PROPS} tickFormatter={(value: string) => truncateLabel(String(value), 9)} />
              <YAxis {...CHART_AXIS_PROPS} width={44} />
              <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip valueFormatter={(value) => `${formatNumber(value)} ${productivity.unit}/day`} />} />
              <Bar dataKey="perDay" name="Per day" fill={CHART_COLORS.value} radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3.5 sm:px-5">
          <CardHeader title="Worker-wise Summary" description={`Salary, attendance and work · ${bounds.label}`} icon={Users} />
        </div>
        {workerRows.length === 0 ? (
          <EmptyState icon={Users} title="No worker activity in this period" compact />
        ) : (
          <DataTable
            columns={[
              {
                key: 'worker',
                header: 'Worker',
                render: (row) => {
                  const worker = analytics.workersById[row.workerId];
                  return worker ? <WorkerCell worker={worker} subtitle={worker.trade} /> : 'Removed worker';
                },
              },
              {
                key: 'attendance',
                header: 'Attendance',
                render: (row) => (
                  <span className="tabular-nums">
                    {formatNumber(row.effectiveDays)} / {row.markedDays} days
                  </span>
                ),
              },
              {
                key: 'work',
                header: 'Work',
                render: (row) =>
                  row.work.size === 0 ? (
                    <span className="text-slate-400">—</span>
                  ) : (
                    <span className="tabular-nums">
                      {Array.from(row.work.entries())
                        .map(([unit, quantity]) => formatQuantity(quantity, unit))
                        .join(', ')}
                    </span>
                  ),
              },
              { key: 'salary', header: 'Salary', align: 'right', render: (row) => <AmountText value={row.salary} className="font-semibold" /> },
            ]}
            rows={workerRows}
            getRowKey={(row) => row.workerId}
            minWidthClassName="min-w-[620px]"
            maxHeightClassName="max-h-none"
            dense
            renderMobileCard={(row) => (
              <MobileRecordCard
                title={getWorkerName(analytics, row.workerId)}
                subtitle={`${formatNumber(row.effectiveDays)} effective days`}
                badge={<AmountText value={row.salary} className="text-sm font-semibold" />}
                fields={[
                  {
                    label: 'Work',
                    value:
                      Array.from(row.work.entries())
                        .map(([unit, quantity]) => formatQuantity(quantity, unit))
                        .join(', ') || '—',
                    className: 'col-span-2',
                  },
                ]}
              />
            )}
          />
        )}
      </Card>
    </div>
  );
}

function ProjectWorkersTab({ project }: { project: Project }) {
  const { data, analytics, openModal, navigate } = useErp();

  const rows = useMemo(() => {
    const ids = new Set(data.workers.filter((worker) => worker.projectId === project.id).map((worker) => worker.id));
    for (const record of data.attendance) if (record.projectId === project.id) ids.add(record.workerId);
    const labour = new Map<string, number>();
    for (const event of analytics.costEvents) {
      if (event.projectId === project.id && event.kind === 'labour' && event.workerId) {
        labour.set(event.workerId, (labour.get(event.workerId) ?? 0) + event.amount);
      }
    }
    return Array.from(ids)
      .map((id) => analytics.workersById[id])
      .filter((worker): worker is Worker => Boolean(worker))
      .map((worker) => ({
        worker,
        assigned: worker.projectId === project.id,
        labourCost: labour.get(worker.id) ?? 0,
        days: sumBy(
          data.attendance.filter((record) => record.workerId === worker.id && record.projectId === project.id),
          (record) => ATTENDANCE_FACTOR[record.status],
        ),
      }))
      .sort((a, b) => Number(b.assigned) - Number(a.assigned) || b.labourCost - a.labourCost);
  }, [data.workers, data.attendance, analytics, project.id]);

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No workers on this project"
        description="Assign workers to this project from their profile."
        action={{ label: 'Add Worker', icon: UserPlus, onClick: () => openModal({ kind: 'worker', record: null }) }}
      />
    );
  }

  return (
    <DataTable
      columns={[
        { key: 'worker', header: 'Worker', render: (row) => <WorkerCell worker={row.worker} subtitle={`${row.worker.trade} · ${formatINR(row.worker.dailyWage)}/day`} /> },
        { key: 'assigned', header: 'Assignment', render: (row) => (row.assigned ? <Badge tone="success" dot>Assigned</Badge> : <Badge tone="neutral">Previously worked</Badge>) },
        { key: 'days', header: 'Days on site', align: 'right', render: (row) => <span className="tabular-nums">{formatNumber(row.days)}</span> },
        { key: 'cost', header: 'Labour cost here', align: 'right', render: (row) => <AmountText value={row.labourCost} className="font-semibold" /> },
        {
          key: 'payable',
          header: 'Total payable',
          align: 'right',
          render: (row) => <AmountText value={analytics.workerMetrics[row.worker.id]?.payable ?? 0} tone={(analytics.workerMetrics[row.worker.id]?.payable ?? 0) < 0 ? 'debit' : 'neutral'} />,
        },
        {
          key: 'actions',
          header: <span className="sr-only">Actions</span>,
          align: 'right',
          render: (row) => (
            <RowActions>
              <IconButton label={`Open ledger for ${row.worker.name}`} icon={BookOpen} onClick={() => navigate('khata', { workerId: row.worker.id })} />
            </RowActions>
          ),
        },
      ]}
      rows={rows}
      getRowKey={(row) => row.worker.id}
      minWidthClassName="min-w-[760px]"
      maxHeightClassName="max-h-none"
      renderMobileCard={(row) => (
        <MobileRecordCard
          leading={<Avatar name={row.worker.name} id={row.worker.id} />}
          title={row.worker.name}
          subtitle={row.worker.trade}
          badge={row.assigned ? <Badge tone="success">Assigned</Badge> : undefined}
          fields={[
            { label: 'Days on site', value: formatNumber(row.days) },
            { label: 'Labour cost', value: formatINR(row.labourCost) },
          ]}
          actions={<IconButton label="Open ledger" icon={BookOpen} onClick={() => navigate('khata', { workerId: row.worker.id })} />}
        />
      )}
    />
  );
}

function ProjectAttendanceTab({ project }: { project: Project }) {
  const { data, selectedDate } = useErp();

  const days = useMemo(() => {
    const dates = listDates(addDays(selectedDate, -13), selectedDate);
    return dates.map((date) => {
      const summary = getAttendanceSummary(data.attendance.filter((record) => record.projectId === project.id && record.date === date));
      return {
        date,
        label: formatDateShort(date),
        Present: summary.present,
        'Half Day': summary.halfDay,
        Absent: summary.absent,
        Leave: summary.leave,
        rate: summary.rate,
        total: summary.total,
      };
    });
  }, [data.attendance, project.id, selectedDate]);

  const selected = days[days.length - 1];
  const markedDays = days.filter((day) => day.total > 0);
  const averageRate = safeDivide(sumBy(markedDays, (day) => day.rate), markedDays.length);

  if (markedDays.length === 0) {
    return <EmptyState icon={CalendarCheck} title="No attendance in the last 14 days" description="Attendance marked for this site will appear here." />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-5">
        <MiniStat label={`Present · ${formatDateShort(selectedDate)}`} value={selected?.Present ?? 0} tone="emerald" />
        <MiniStat label="Half Day" value={selected?.['Half Day'] ?? 0} tone="amber" />
        <MiniStat label="Absent" value={selected?.Absent ?? 0} tone="rose" />
        <MiniStat label="Leave" value={selected?.Leave ?? 0} tone="violet" />
        <MiniStat label="14-day avg rate" value={formatPercent(averageRate)} tone="sky" />
      </div>
      <ChartCard
        title="Daily Attendance"
        description="Last 14 days"
        height={240}
        legend={<ChartLegend items={ATTENDANCE_STATUSES.map((status) => ({ label: status, color: ATTENDANCE_STYLES[status].color }))} />}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={days} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid {...CHART_GRID_PROPS} />
            <XAxis dataKey="label" {...CHART_AXIS_PROPS} interval="preserveStartEnd" />
            <YAxis {...CHART_AXIS_PROPS} allowDecimals={false} width={32} />
            <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip valueFormatter={(value) => `${value} workers`} hideZero />} />
            {ATTENDANCE_STATUSES.map((status, index) => (
              <Bar
                key={status}
                dataKey={status}
                name={status}
                stackId="attendance"
                fill={ATTENDANCE_STYLES[status].color}
                radius={index === ATTENDANCE_STATUSES.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                maxBarSize={28}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ProjectWorkTab({ project }: { project: Project }) {
  const { data, analytics, openModal } = useErp();
  const entries = useMemo(
    () => data.workEntries.filter((entry) => entry.projectId === project.id).sort((a, b) => b.date.localeCompare(a.date)),
    [data.workEntries, project.id],
  );

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" icon={Plus} onClick={() => openModal({ kind: 'workEntry', record: null, defaults: { projectId: project.id } })}>
          Add Work Entry
        </Button>
      </div>
      <DataTable
        columns={[
          { key: 'date', header: 'Date', render: (entry) => <span className="whitespace-nowrap">{formatDate(entry.date)}</span> },
          { key: 'worker', header: 'Worker', render: (entry) => getWorkerName(analytics, entry.workerId) },
          { key: 'task', header: 'Task', render: (entry) => <span className="line-clamp-2 max-w-[320px]">{entry.task}</span> },
          {
            key: 'qty',
            header: 'Quantity',
            align: 'right',
            render: (entry) => <span className="font-semibold tabular-nums">{formatQuantity(entry.quantity, getWorkUnitLabel(entry.unit, entry.customUnit))}</span>,
          },
          {
            key: 'actions',
            header: <span className="sr-only">Actions</span>,
            align: 'right',
            render: (entry) => (
              <RowActions>
                <IconButton label="Edit entry" icon={Pencil} onClick={() => openModal({ kind: 'workEntry', record: entry })} />
              </RowActions>
            ),
          },
        ]}
        rows={entries}
        getRowKey={(entry) => entry.id}
        minWidthClassName="min-w-[680px]"
        maxHeightClassName="max-h-none"
        emptyState={<EmptyState icon={ClipboardList} title="No work recorded for this project" compact />}
        renderMobileCard={(entry) => (
          <MobileRecordCard
            title={entry.task}
            subtitle={`${formatDate(entry.date)} · ${getWorkerName(analytics, entry.workerId)}`}
            badge={<Badge tone="indigo">{formatQuantity(entry.quantity, getWorkUnitLabel(entry.unit, entry.customUnit))}</Badge>}
            actions={<IconButton label="Edit entry" icon={Pencil} onClick={() => openModal({ kind: 'workEntry', record: entry })} />}
          />
        )}
      />
    </div>
  );
}

function ProjectMaterialsTab({ project }: { project: Project }) {
  const { data, analytics, openModal } = useErp();

  const rows = useMemo(() => {
    const receivedHere = new Map<string, { received: number; used: number }>();
    for (const movement of data.movements) {
      if (movement.projectId !== project.id) continue;
      const totals = receivedHere.get(movement.materialId) ?? { received: 0, used: 0 };
      if (movement.type === 'Receive') totals.received += movement.quantity;
      else totals.used += movement.quantity;
      receivedHere.set(movement.materialId, totals);
    }
    const ids = new Set([...data.materials.filter((material) => material.projectId === project.id).map((material) => material.id), ...receivedHere.keys()]);
    return Array.from(ids)
      .map((id) => analytics.materialsById[id])
      .filter((material): material is Material => Boolean(material))
      .map((material) => {
        const here = receivedHere.get(material.id) ?? { received: 0, used: 0 };
        return { material, stock: analytics.materialStock[material.id], here, cost: Math.round(here.received * material.purchaseRate) };
      });
  }, [data.materials, data.movements, analytics, project.id]);

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No materials for this project"
        description="Add materials and receive stock against this site to track material cost."
        action={{ label: 'Add Material', onClick: () => openModal({ kind: 'material', record: null }) }}
      />
    );
  }

  return (
    <DataTable
      columns={[
        {
          key: 'material',
          header: 'Material',
          render: (row) => (
            <div>
              <p className="font-medium text-slate-900">{row.material.name}</p>
              <p className="text-xs text-slate-500">
                {row.material.category} · {row.material.supplier}
              </p>
            </div>
          ),
        },
        { key: 'received', header: 'Received here', align: 'right', render: (row) => <span className="tabular-nums">{formatQuantity(row.here.received, row.material.unit)}</span> },
        { key: 'used', header: 'Used here', align: 'right', render: (row) => <span className="tabular-nums">{formatQuantity(row.here.used, row.material.unit)}</span> },
        {
          key: 'remaining',
          header: 'In stock',
          align: 'right',
          render: (row) => <span className="font-semibold tabular-nums">{formatQuantity(row.stock?.remaining ?? 0, row.material.unit)}</span>,
        },
        { key: 'cost', header: 'Cost to project', align: 'right', render: (row) => <AmountText value={row.cost} className="font-semibold" /> },
        { key: 'status', header: 'Status', render: (row) => (row.stock ? <StockBadge status={row.stock.status} /> : null) },
        {
          key: 'actions',
          header: <span className="sr-only">Actions</span>,
          align: 'right',
          render: (row) => (
            <RowActions>
              <IconButton label="Receive stock" icon={PackagePlus} onClick={() => openModal({ kind: 'stock', material: row.material, movementType: 'Receive' })} />
              <IconButton
                label="Use material"
                icon={PackageMinus}
                disabled={(row.stock?.remaining ?? 0) <= 0}
                onClick={() => openModal({ kind: 'stock', material: row.material, movementType: 'Use' })}
              />
            </RowActions>
          ),
        },
      ]}
      rows={rows}
      getRowKey={(row) => row.material.id}
      minWidthClassName="min-w-[880px]"
      maxHeightClassName="max-h-none"
      renderMobileCard={(row) => (
        <MobileRecordCard
          title={row.material.name}
          subtitle={row.material.category}
          badge={row.stock ? <StockBadge status={row.stock.status} /> : undefined}
          fields={[
            { label: 'In stock', value: formatQuantity(row.stock?.remaining ?? 0, row.material.unit) },
            { label: 'Cost here', value: formatINR(row.cost) },
          ]}
          actions={
            <>
              <IconButton label="Receive stock" icon={PackagePlus} onClick={() => openModal({ kind: 'stock', material: row.material, movementType: 'Receive' })} />
              <IconButton
                label="Use material"
                icon={PackageMinus}
                disabled={(row.stock?.remaining ?? 0) <= 0}
                onClick={() => openModal({ kind: 'stock', material: row.material, movementType: 'Use' })}
              />
            </>
          }
        />
      )}
    />
  );
}

function ProjectExpensesTab({ project }: { project: Project }) {
  const { data, openModal, requestDelete } = useErp();
  const expenses = useMemo(
    () => data.expenses.filter((expense) => expense.projectId === project.id).sort((a, b) => b.date.localeCompare(a.date)),
    [data.expenses, project.id],
  );
  const total = sumBy(expenses, (expense) => expense.amount);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {expenses.length} expenses · <span className="font-semibold text-slate-900">{formatINR(total)}</span>
        </p>
        <Button size="sm" icon={Plus} onClick={() => openModal({ kind: 'expense', record: null, defaults: { projectId: project.id } })}>
          Add Expense
        </Button>
      </div>
      <DataTable
        columns={[
          { key: 'date', header: 'Date', render: (expense) => <span className="whitespace-nowrap">{formatDate(expense.date)}</span> },
          {
            key: 'desc',
            header: 'Description',
            render: (expense) => (
              <div>
                <p className="font-medium text-slate-900">{expense.description}</p>
                <p className="text-xs text-slate-500">{expense.vendor}</p>
              </div>
            ),
          },
          { key: 'category', header: 'Category', render: (expense) => <Badge tone="neutral">{expense.category}</Badge> },
          { key: 'mode', header: 'Mode', render: (expense) => expense.mode },
          { key: 'amount', header: 'Amount', align: 'right', render: (expense) => <AmountText value={expense.amount} className="font-semibold" /> },
          {
            key: 'actions',
            header: <span className="sr-only">Actions</span>,
            align: 'right',
            render: (expense) => (
              <RowActions>
                <IconButton label="Edit expense" icon={Pencil} onClick={() => openModal({ kind: 'expense', record: expense })} />
                <IconButton
                  label="Delete expense"
                  icon={Trash2}
                  variant="danger"
                  onClick={() => requestDelete({ kind: 'expense', id: expense.id, label: `${expense.description} (${formatINR(expense.amount)})` })}
                />
              </RowActions>
            ),
          },
        ]}
        rows={expenses}
        getRowKey={(expense) => expense.id}
        minWidthClassName="min-w-[760px]"
        maxHeightClassName="max-h-none"
        emptyState={
          <EmptyState
            icon={Receipt}
            title="No expenses for this project"
            action={{ label: 'Add Expense', onClick: () => openModal({ kind: 'expense', record: null, defaults: { projectId: project.id } }) }}
            compact
          />
        }
        renderMobileCard={(expense) => (
          <MobileRecordCard
            title={expense.description}
            subtitle={`${formatDate(expense.date)} · ${expense.category}`}
            badge={<AmountText value={expense.amount} className="text-sm font-semibold" />}
            actions={<IconButton label="Edit expense" icon={Pencil} onClick={() => openModal({ kind: 'expense', record: expense })} />}
          />
        )}
      />
    </div>
  );
}

function ProjectPaymentsTab({ project }: { project: Project }) {
  const { data, analytics, openModal } = useErp();
  const transactions = useMemo(
    () => data.transactions.filter((transaction) => transaction.projectId === project.id).sort((a, b) => b.date.localeCompare(a.date)),
    [data.transactions, project.id],
  );
  const paid = sumBy(
    transactions.filter((transaction) => transaction.direction === 'debit'),
    (transaction) => transaction.amount,
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Paid out & recovered: <span className="font-semibold text-slate-900">{formatINR(paid)}</span>
        </p>
        <Button
          size="sm"
          icon={Wallet}
          onClick={() => openModal({ kind: 'transaction', record: null, defaults: { projectId: project.id, type: 'Payment', direction: 'debit' } })}
        >
          Add Payment
        </Button>
      </div>
      <DataTable
        columns={[
          { key: 'date', header: 'Date', render: (transaction) => <span className="whitespace-nowrap">{formatDate(transaction.date)}</span> },
          { key: 'person', header: 'Person', render: (transaction) => getWorkerName(analytics, transaction.workerId) },
          { key: 'type', header: 'Type', render: (transaction) => transaction.type },
          { key: 'mode', header: 'Mode', render: (transaction) => transaction.mode },
          { key: 'entry', header: 'Entry', render: (transaction) => <DirectionBadge direction={transaction.direction} /> },
          {
            key: 'amount',
            header: 'Amount',
            align: 'right',
            render: (transaction) => (
              <AmountText
                value={transaction.direction === 'debit' ? -transaction.amount : transaction.amount}
                tone={transaction.direction === 'debit' ? 'debit' : 'credit'}
                showSign
                className="font-semibold"
              />
            ),
          },
          {
            key: 'actions',
            header: <span className="sr-only">Actions</span>,
            align: 'right',
            render: (transaction) => (
              <RowActions>
                <IconButton label="Edit transaction" icon={Pencil} onClick={() => openModal({ kind: 'transaction', record: transaction })} />
              </RowActions>
            ),
          },
        ]}
        rows={transactions}
        getRowKey={(transaction) => transaction.id}
        minWidthClassName="min-w-[760px]"
        maxHeightClassName="max-h-none"
        emptyState={<EmptyState icon={Wallet} title="No payments linked to this project" compact />}
        renderMobileCard={(transaction) => (
          <MobileRecordCard
            title={`${transaction.type} · ${getWorkerName(analytics, transaction.workerId)}`}
            subtitle={`${formatDate(transaction.date)} · ${transaction.mode}`}
            badge={
              <AmountText
                value={transaction.direction === 'debit' ? -transaction.amount : transaction.amount}
                tone={transaction.direction === 'debit' ? 'debit' : 'credit'}
                showSign
                className="text-sm font-semibold"
              />
            }
            actions={<IconButton label="Edit transaction" icon={Pencil} onClick={() => openModal({ kind: 'transaction', record: transaction })} />}
          />
        )}
      />
    </div>
  );
}

/* ========================================================= */
/* Materials Section                                         */
/* ========================================================= */

const MATERIAL_SORT_KEYS = ['name', 'category', 'remaining', 'totalCost', 'date'] as const;
type MaterialSortKey = (typeof MATERIAL_SORT_KEYS)[number];

function MaterialsSection() {
  const { data, analytics, ready, today, openModal, requestDelete } = useErp();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus | ''>('');
  const [projectId, setProjectId] = useState('');
  const [supplier, setSupplier] = useState('');
  const [sort, setSort] = useState<SortState<MaterialSortKey>>({ key: 'name', direction: 'asc' });
  const [historyMaterialId, setHistoryMaterialId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 200);
  const filterKey = [debouncedSearch, category, stockStatus, projectId, supplier].join('|');
  const reloading = useSoftReload(filterKey);

  usePrimaryAction('materials', () => openModal({ kind: 'material', record: null }));

  useNavigationFocus((focus) => {
    if (!focus.materialId) return false;
    const material = analytics.materialsById[focus.materialId];
    setCategory('');
    setStockStatus('');
    setProjectId('');
    setSupplier('');
    setSearch(material?.name ?? '');
    if (material) setHistoryMaterialId(material.id);
    return true;
  });

  const summary = useMemo(() => {
    const stocks = Object.values(analytics.materialStock);
    return {
      items: data.materials.length,
      stockValue: sumBy(stocks, (stock) => stock.stockValue),
      purchased: sumBy(stocks, (stock) => stock.totalCost),
      low: stocks.filter((stock) => stock.status === 'Low Stock').length,
      out: stocks.filter((stock) => stock.status === 'Out of Stock').length,
    };
  }, [data.materials.length, analytics.materialStock]);

  const suppliers = useMemo(() => Array.from(new Set(data.materials.map((material) => material.supplier))).sort(), [data.materials]);

  const alerts = useMemo(
    () => data.materials.filter((material) => analytics.materialStock[material.id]?.status !== 'In Stock'),
    [data.materials, analytics.materialStock],
  );

  const rows = useMemo(() => {
    const filtered = data.materials.filter((material) => {
      const stock = analytics.materialStock[material.id];
      return (
        (!category || material.category === category) &&
        (!stockStatus || stock?.status === stockStatus) &&
        (!projectId || material.projectId === projectId) &&
        (!supplier || material.supplier === supplier) &&
        matchesQuery(debouncedSearch, material.name, material.id, material.supplier, material.category)
      );
    });
    return sortRecords(
      filtered,
      (material) => {
        const stock = analytics.materialStock[material.id];
        switch (sort.key) {
          case 'category':
            return material.category;
          case 'remaining':
            return safeDivide(stock?.remaining ?? 0, Math.max(1, material.minStock));
          case 'totalCost':
            return stock?.totalCost ?? 0;
          case 'date':
            return material.date;
          default:
            return material.name;
        }
      },
      sort.direction,
    );
  }, [data.materials, analytics.materialStock, category, stockStatus, projectId, supplier, debouncedSearch, sort]);

  const pagination = usePagination(rows, 10, `${filterKey}|${sort.key}|${sort.direction}`);

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setStockStatus('');
    setProjectId('');
    setSupplier('');
  };

  const handleExport = () => {
    const ok = downloadCsv(
      buildExportFilename('material-inventory', today),
      ['Material ID', 'Name', 'Category', 'Unit', 'Project', 'Supplier', 'Opening', 'Received', 'Used', 'Remaining', 'Min Stock', 'Rate', 'Total Cost', 'Status'],
      rows.map((material) => {
        const stock = analytics.materialStock[material.id];
        return [
          material.id,
          material.name,
          material.category,
          material.unit,
          getProjectName(analytics, material.projectId),
          material.supplier,
          material.openingStock,
          stock?.received ?? 0,
          stock?.used ?? 0,
          stock?.remaining ?? 0,
          material.minStock,
          material.purchaseRate,
          stock?.totalCost ?? 0,
          stock?.status ?? '',
        ];
      }),
    );
    if (ok) toast.success('Export completed', `${rows.length} materials exported.`);
    else toast.error('Export failed', 'Your browser blocked the download.');
  };

  const materialActions = (material: Material): ActionMenuItem[] => {
    const remaining = analytics.materialStock[material.id]?.remaining ?? 0;
    return [
      { key: 'receive', label: 'Receive stock', icon: PackagePlus, onSelect: () => openModal({ kind: 'stock', material, movementType: 'Receive' }) },
      {
        key: 'use',
        label: remaining > 0 ? 'Use material' : 'Use material (out of stock)',
        icon: PackageMinus,
        disabled: remaining <= 0,
        onSelect: () => openModal({ kind: 'stock', material, movementType: 'Use' }),
      },
      { key: 'history', label: 'Stock history', icon: Clock, onSelect: () => setHistoryMaterialId(material.id) },
      { key: 'edit', label: 'Edit material', icon: Pencil, onSelect: () => openModal({ kind: 'material', record: material }) },
      {
        key: 'delete',
        label: 'Delete material',
        icon: Trash2,
        tone: 'danger',
        separatorBefore: true,
        onSelect: () =>
          requestDelete({
            kind: 'material',
            id: material.id,
            label: material.name,
            description: 'Its stock movements will be removed and its purchase cost will no longer count towards project material cost.',
          }),
      },
    ];
  };

  const columns: ReadonlyArray<TableColumn<Material>> = [
    {
      key: 'name',
      header: 'Material',
      sortKey: 'name',
      render: (material) => (
        <div className="min-w-0">
          <p className="max-w-[220px] truncate font-medium text-slate-900">{material.name}</p>
          <p className="text-xs text-slate-500">
            {material.id} · {material.unit}
          </p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', sortKey: 'category', render: (material) => <Badge tone="neutral">{material.category}</Badge> },
    {
      key: 'site',
      header: 'Site / Supplier',
      render: (material) => (
        <div className="min-w-0">
          <p className="max-w-[170px] truncate text-slate-800">{getProjectName(analytics, material.projectId)}</p>
          <p className="max-w-[170px] truncate text-xs text-slate-500">{material.supplier}</p>
        </div>
      ),
    },
    { key: 'opening', header: 'Opening', align: 'right', render: (material) => <span className="tabular-nums">{formatNumber(material.openingStock)}</span> },
    {
      key: 'received',
      header: 'Received',
      align: 'right',
      render: (material) => <span className="tabular-nums text-emerald-700">+{formatNumber(analytics.materialStock[material.id]?.received ?? 0)}</span>,
    },
    {
      key: 'used',
      header: 'Used',
      align: 'right',
      render: (material) => <span className="tabular-nums text-rose-600">−{formatNumber(analytics.materialStock[material.id]?.used ?? 0)}</span>,
    },
    {
      key: 'remaining',
      header: 'Remaining',
      sortKey: 'remaining',
      render: (material) => {
        const stock = analytics.materialStock[material.id];
        const remaining = stock?.remaining ?? 0;
        const capacity = Math.max(material.openingStock + (stock?.received ?? 0), material.minStock * 2, 1);
        const status = stock?.status ?? 'In Stock';
        return (
          <div className="w-32">
            <p className="text-right text-[13px] font-semibold tabular-nums text-slate-900">{formatQuantity(remaining, material.unit)}</p>
            <ProgressBar
              value={Math.max(0, remaining)}
              max={capacity}
              tone={status === 'In Stock' ? 'emerald' : status === 'Low Stock' ? 'amber' : 'rose'}
              size="xs"
              label={`${material.name} stock level`}
              className="mt-1"
            />
            <p className="mt-0.5 text-right text-[10px] text-slate-400">min {formatNumber(material.minStock)}</p>
          </div>
        );
      },
    },
    { key: 'rate', header: 'Rate', align: 'right', render: (material) => <AmountText value={material.purchaseRate} tone="muted" /> },
    {
      key: 'cost',
      header: 'Total cost',
      sortKey: 'totalCost',
      align: 'right',
      render: (material) => <AmountText value={analytics.materialStock[material.id]?.totalCost ?? 0} className="font-semibold" />,
    },
    { key: 'status', header: 'Status', render: (material) => <StockBadge status={analytics.materialStock[material.id]?.status ?? 'In Stock'} /> },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (material) => {
        const remaining = analytics.materialStock[material.id]?.remaining ?? 0;
        return (
          <RowActions>
            <IconButton label={`Receive ${material.name}`} icon={PackagePlus} onClick={() => openModal({ kind: 'stock', material, movementType: 'Receive' })} />
            <IconButton
              label={remaining > 0 ? `Use ${material.name}` : `${material.name} is out of stock`}
              icon={PackageMinus}
              disabled={remaining <= 0}
              onClick={() => openModal({ kind: 'stock', material, movementType: 'Use' })}
            />
            <ActionMenu items={materialActions(material)} label={`Actions for ${material.name}`} />
          </RowActions>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {ready ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard label="Materials" value={String(summary.items)} icon={Boxes} tone="indigo" secondary={`${suppliers.length} suppliers`} />
          <StatCard label="Stock Value" value={formatINRCompact(summary.stockValue)} icon={Package} tone="emerald" secondary="At purchase rate" />
          <StatCard label="Material Purchased" value={formatINRCompact(summary.purchased)} icon={IndianRupee} tone="violet" secondary="Received stock cost" />
          <StatCard
            label="Stock Alerts"
            value={String(summary.low + summary.out)}
            icon={AlertTriangle}
            tone={summary.low + summary.out > 0 ? 'amber' : 'slate'}
            secondary={`${summary.low} low · ${summary.out} out`}
            onClick={() => setStockStatus(summary.out > 0 ? 'Out of Stock' : 'Low Stock')}
          />
        </div>
      ) : (
        <KpiGridSkeleton count={4} />
      )}

      {ready && alerts.length > 0 && (
        <div data-animate role="status" className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-sm font-medium text-amber-900">
              {alerts.length} material{alerts.length === 1 ? '' : 's'} need reordering
            </p>
          </div>
          <div className="erp-scrollbar-none flex min-w-0 flex-1 gap-1.5 overflow-x-auto sm:justify-end">
            {alerts.slice(0, 5).map((material) => (
              <button
                key={material.id}
                type="button"
                onClick={() => openModal({ kind: 'stock', material, movementType: 'Receive' })}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-white px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100',
                  FOCUS_RING,
                )}
                title={`Receive stock for ${material.name}`}
              >
                <PackagePlus className="h-3 w-3" aria-hidden="true" />
                {truncateLabel(material.name, 22)}
              </button>
            ))}
          </div>
        </div>
      )}

      <TableCard>
        <div className="border-b border-slate-100 p-3 sm:p-4">
          <FilterBar
            search={<SearchInput value={search} onChange={setSearch} placeholder="Search material or supplier…" label="Search materials" />}
            activeCount={countActive(search, category, stockStatus, projectId, supplier)}
            onReset={resetFilters}
            trailing={
              <>
                <Button variant="outline" size="sm" icon={Download} onClick={handleExport} disabled={rows.length === 0}>
                  Export
                </Button>
                <Button size="sm" icon={Plus} onClick={() => openModal({ kind: 'material', record: null })}>
                  Add Material
                </Button>
              </>
            }
          >
            <FilterSelect label="Category" value={category} onChange={setCategory} options={toSelectOptions(MATERIAL_CATEGORIES)} allLabel="All categories" icon={Layers} />
            <FilterSelect
              label="Stock"
              value={stockStatus}
              onChange={(value) => setStockStatus(isOneOf(value, STOCK_STATUSES) ? value : '')}
              options={toSelectOptions(STOCK_STATUSES)}
              allLabel="Any stock level"
              icon={Filter}
            />
            <FilterSelect label="Project" value={projectId} onChange={setProjectId} options={buildProjectOptions(data.projects)} allLabel="All sites" icon={Building2} />
            <FilterSelect label="Supplier" value={supplier} onChange={setSupplier} options={toSelectOptions(suppliers)} allLabel="All suppliers" icon={Truck} />
          </FilterBar>
        </div>
        <DataTable
          columns={columns}
          rows={pagination.pageItems}
          getRowKey={(material) => material.id}
          loading={!ready || reloading}
          caption="Material inventory"
          mobileBreakpoint="lg"
          minWidthClassName="min-w-[1240px]"
          sort={sort}
          onSortChange={(key) => {
            if (isOneOf(key, MATERIAL_SORT_KEYS)) setSort((current) => toggleSort(current, key));
          }}
          rowClassName={(material) => (analytics.materialStock[material.id]?.status === 'Out of Stock' ? 'bg-rose-50/30' : '')}
          emptyState={
            <EmptyState
              icon={Package}
              title={data.materials.length === 0 ? 'No materials yet' : 'No materials match these filters'}
              description="Add cement, steel, tiles and other materials to track stock and cost."
              action={{ label: 'Add Material', onClick: () => openModal({ kind: 'material', record: null }) }}
              secondaryAction={data.materials.length > 0 ? { label: 'Reset filters', icon: RotateCcw, onClick: resetFilters } : undefined}
            />
          }
          renderMobileCard={(material) => {
            const stock = analytics.materialStock[material.id];
            return (
              <MobileRecordCard
                title={material.name}
                subtitle={`${material.category} · ${getProjectName(analytics, material.projectId)}`}
                badge={<StockBadge status={stock?.status ?? 'In Stock'} />}
                actions={<ActionMenu items={materialActions(material)} label={`Actions for ${material.name}`} />}
                fields={[
                  { label: 'Remaining', value: formatQuantity(stock?.remaining ?? 0, material.unit) },
                  { label: 'Min stock', value: formatNumber(material.minStock) },
                  { label: 'Received / Used', value: `${formatNumber(stock?.received ?? 0)} / ${formatNumber(stock?.used ?? 0)}` },
                  { label: 'Total cost', value: formatINR(stock?.totalCost ?? 0) },
                ]}
                footer={
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" icon={PackagePlus} onClick={() => openModal({ kind: 'stock', material, movementType: 'Receive' })}>
                      Receive
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={PackageMinus}
                      disabled={(stock?.remaining ?? 0) <= 0}
                      onClick={() => openModal({ kind: 'stock', material, movementType: 'Use' })}
                    >
                      Use
                    </Button>
                  </div>
                }
              />
            );
          }}
          footer={
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setPage}
              onPageSizeChange={pagination.setPageSize}
              itemLabel="materials"
            />
          }
        />
      </TableCard>

      <StockHistoryModal materialId={historyMaterialId} onClose={() => setHistoryMaterialId(null)} />
    </div>
  );
}

function StockHistoryModal({ materialId, onClose }: { materialId: string | null; onClose: () => void }) {
  const { data, analytics, openModal } = useErp();
  const retainedId = useRetainedValue(materialId);
  const material = retainedId ? analytics.materialsById[retainedId] : undefined;
  const stock = retainedId ? analytics.materialStock[retainedId] : undefined;

  useEffect(() => {
    if (materialId && !analytics.materialsById[materialId]) onClose();
  }, [materialId, analytics.materialsById, onClose]);

  const history = useMemo(() => {
    if (!material) return [];
    const movements = data.movements
      .filter((movement) => movement.materialId === material.id)
      .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    let running = material.openingStock;
    return movements
      .map((movement) => {
        running += movement.type === 'Receive' ? movement.quantity : -movement.quantity;
        return { movement, balance: roundTo(running, 2) };
      })
      .reverse();
  }, [data.movements, material]);

  return (
    <Modal
      open={Boolean(materialId && material)}
      onClose={onClose}
      variant="drawer"
      size="md"
      title={material?.name ?? 'Stock history'}
      description={material ? `${material.id} · ${material.category} · ${material.supplier}` : undefined}
      icon={Clock}
      iconTone="amber"
      footer={
        material ? (
          <>
            <Button
              variant="outline"
              icon={PackageMinus}
              disabled={(stock?.remaining ?? 0) <= 0}
              onClick={() => openModal({ kind: 'stock', material, movementType: 'Use' })}
            >
              Use Material
            </Button>
            <Button icon={PackagePlus} onClick={() => openModal({ kind: 'stock', material, movementType: 'Receive' })}>
              Receive Stock
            </Button>
          </>
        ) : undefined
      }
    >
      {material && stock && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2.5">
            <MiniStat label="Remaining" value={formatQuantity(stock.remaining, material.unit)} tone={stock.status === 'In Stock' ? 'emerald' : stock.status === 'Low Stock' ? 'amber' : 'rose'} hint={stock.status} />
            <MiniStat label="Stock value" value={formatINR(stock.stockValue)} tone="indigo" hint={`@ ${formatINR(material.purchaseRate)} / ${material.unit}`} />
            <MiniStat label="Received" value={formatNumber(stock.received)} tone="sky" hint={formatINR(stock.totalCost)} />
            <MiniStat label="Used" value={formatNumber(stock.used)} tone="violet" hint={`Opening ${formatNumber(material.openingStock)}`} />
          </div>
          {history.length === 0 ? (
            <EmptyState icon={Package} title="No stock movements yet" description="Receive or issue stock to build this history." compact />
          ) : (
            <ol className="space-y-2">
              {history.map(({ movement, balance }) => {
                const isReceive = movement.type === 'Receive';
                return (
                  <li key={movement.id} className="flex items-start gap-3 rounded-xl border border-slate-200/80 p-3">
                    <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset', isReceive ? ICON_TONES.emerald : ICON_TONES.rose)}>
                      {isReceive ? <PackagePlus className="h-4 w-4" aria-hidden="true" /> : <PackageMinus className="h-4 w-4" aria-hidden="true" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-slate-900">
                        {isReceive ? 'Received' : 'Used'} {formatQuantity(movement.quantity, material.unit)}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {formatDate(movement.date)} · {getProjectName(analytics, movement.projectId)}
                        {movement.note ? ` · ${movement.note}` : ''}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[13px] font-semibold tabular-nums text-slate-900">{formatNumber(balance)}</p>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">Balance</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ========================================================= */
/* Expenses Section                                          */
/* ========================================================= */

const EXPENSE_SORT_KEYS = ['date', 'amount', 'category', 'vendor'] as const;
type ExpenseSortKey = (typeof EXPENSE_SORT_KEYS)[number];

function ExpensesSection() {
  const { data, analytics, ready, today, selectedDate, openModal, requestDelete } = useErp();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [projectId, setProjectId] = useState('');
  const [mode, setMode] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState<SortState<ExpenseSortKey>>({ key: 'date', direction: 'desc' });
  const debouncedSearch = useDebouncedValue(search, 200);
  const filterKey = [debouncedSearch, category, projectId, mode, dateFrom, dateTo].join('|');
  const reloading = useSoftReload(filterKey);

  usePrimaryAction('expenses', () =>
    openModal({ kind: 'expense', record: null, defaults: projectId && projectId !== OFFICE_FILTER ? { projectId } : undefined }),
  );

  const windows = useMemo(() => {
    const week = getRangeBounds('weekly', selectedDate);
    const monthStart = `${monthKey(selectedDate)}-01`;
    const inWindow = (start: string, end: string) =>
      sumBy(
        data.expenses.filter((expense) => isDateInRange(expense.date, start, end)),
        (expense) => expense.amount,
      );
    const yesterday = addDays(selectedDate, -1);
    return {
      today: inWindow(selectedDate, selectedDate),
      yesterday: inWindow(yesterday, yesterday),
      week: inWindow(week.start, week.end),
      previousWeek: inWindow(week.previousStart, week.previousEnd),
      month: inWindow(monthStart, selectedDate),
    };
  }, [data.expenses, selectedDate]);

  const filtered = useMemo(() => {
    const { start, end } = normalizeDateRange(dateFrom, dateTo);
    return data.expenses.filter(
      (expense) =>
        (!category || expense.category === category) &&
        (!projectId || (projectId === OFFICE_FILTER ? expense.projectId === '' : expense.projectId === projectId)) &&
        (!mode || expense.mode === mode) &&
        isDateInRange(expense.date, start, end) &&
        matchesQuery(debouncedSearch, expense.description, expense.vendor, expense.id, expense.referenceNo, expense.notes),
    );
  }, [data.expenses, category, projectId, mode, dateFrom, dateTo, debouncedSearch]);

  const sorted = useMemo(
    () =>
      sortRecords(
        filtered,
        (expense) => {
          switch (sort.key) {
            case 'amount':
              return expense.amount;
            case 'category':
              return expense.category;
            case 'vendor':
              return expense.vendor;
            default:
              return `${expense.date}|${expense.id}`;
          }
        },
        sort.direction,
      ),
    [filtered, sort],
  );

  const categoryTotals = useMemo(() => {
    const totals = new Map<ExpenseCategory, number>();
    for (const expense of filtered) totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
    return EXPENSE_CATEGORIES.map((item, index) => ({ name: item, value: totals.get(item) ?? 0, color: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length] ?? CHART_COLORS.other }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const filteredTotal = sumBy(filtered, (expense) => expense.amount);
  const labourTotal = sumBy(
    filtered.filter((expense) => expense.category === 'Labour'),
    (expense) => expense.amount,
  );
  const materialTotal = sumBy(
    filtered.filter((expense) => expense.category === 'Material'),
    (expense) => expense.amount,
  );
  const pagination = usePagination(sorted, 10, `${filterKey}|${sort.key}|${sort.direction}`);
  const categoryHint = isOneOf(category, EXPENSE_CATEGORIES) ? EXPENSE_CATEGORY_HINTS[category] : undefined;

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setProjectId('');
    setMode('');
    setDateFrom('');
    setDateTo('');
  };

  const handleExport = () => {
    const ok = downloadCsv(
      buildExportFilename('expenses', today),
      ['Expense ID', 'Date', 'Project', 'Category', 'Vendor', 'Description', 'Amount', 'Mode', 'Reference', 'Notes'],
      sorted.map((expense) => [
        expense.id,
        expense.date,
        getProjectName(analytics, expense.projectId, 'Head office'),
        expense.category,
        expense.vendor,
        expense.description,
        expense.amount,
        expense.mode,
        expense.referenceNo,
        expense.notes,
      ]),
    );
    if (ok) toast.success('Export completed', `${sorted.length} expenses exported.`);
    else toast.error('Export failed', 'Your browser blocked the download.');
  };

  const expenseActions = (expense: Expense): ActionMenuItem[] => [
    { key: 'edit', label: 'Edit expense', icon: Pencil, onSelect: () => openModal({ kind: 'expense', record: expense }) },
    {
      key: 'duplicate',
      label: 'Add similar',
      icon: Plus,
      onSelect: () =>
        openModal({
          kind: 'expense',
          record: null,
          defaults: { projectId: expense.projectId, category: expense.category, vendor: expense.vendor, mode: expense.mode, description: expense.description },
        }),
    },
    {
      key: 'delete',
      label: 'Delete expense',
      icon: Trash2,
      tone: 'danger',
      separatorBefore: true,
      onSelect: () =>
        requestDelete({
          kind: 'expense',
          id: expense.id,
          label: `${expense.description} (${formatINR(expense.amount)})`,
          description: expense.projectId ? 'Project actual cost and profit will be recalculated.' : undefined,
        }),
    },
  ];

  const columns: ReadonlyArray<TableColumn<Expense>> = [
    {
      key: 'date',
      header: 'Date',
      sortKey: 'date',
      render: (expense) => (
        <div>
          <p className="whitespace-nowrap font-medium text-slate-900">{formatDate(expense.date)}</p>
          <p className="text-xs text-slate-500">{expense.id}</p>
        </div>
      ),
    },
    {
      key: 'vendor',
      header: 'Description',
      sortKey: 'vendor',
      render: (expense) => (
        <div className="min-w-0">
          <p className="max-w-[260px] truncate font-medium text-slate-900">{expense.description}</p>
          <p className="max-w-[260px] truncate text-xs text-slate-500">{expense.vendor}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', sortKey: 'category', render: (expense) => <Badge tone={expense.category === 'Labour' ? 'indigo' : expense.category === 'Material' ? 'warning' : 'neutral'}>{expense.category}</Badge> },
    {
      key: 'project',
      header: 'Project',
      render: (expense) => (
        <span className={cn('block max-w-[160px] truncate', !expense.projectId && 'text-slate-500')}>{getProjectName(analytics, expense.projectId, 'Head office')}</span>
      ),
    },
    {
      key: 'mode',
      header: 'Mode / Ref.',
      render: (expense) => (
        <div>
          <p className="text-slate-700">{expense.mode}</p>
          {expense.referenceNo && <p className="max-w-[140px] truncate text-xs text-slate-500">{expense.referenceNo}</p>}
        </div>
      ),
    },
    { key: 'amount', header: 'Amount', sortKey: 'amount', align: 'right', render: (expense) => <AmountText value={expense.amount} className="font-semibold" /> },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (expense) => (
        <RowActions>
          <IconButton label="Edit expense" icon={Pencil} onClick={() => openModal({ kind: 'expense', record: expense })} />
          <ActionMenu items={expenseActions(expense)} label={`Actions for ${expense.id}`} />
        </RowActions>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {ready ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 2xl:grid-cols-6">
          <StatCard
            label={selectedDate === today ? 'Today' : formatDateShort(selectedDate)}
            value={formatINR(windows.today)}
            icon={Calendar}
            tone="rose"
            trend={{ value: percentChange(windows.today, windows.yesterday), label: 'vs prev day', invert: true }}
          />
          <StatCard
            label="This Week"
            value={formatINR(windows.week)}
            icon={CalendarCheck}
            tone="amber"
            trend={{ value: percentChange(windows.week, windows.previousWeek), label: 'vs prev', invert: true }}
          />
          <StatCard label="This Month" value={formatINR(windows.month)} icon={BarChart3} tone="indigo" secondary="Month to date" />
          <StatCard label="Labour" value={formatINR(labourTotal)} icon={HardHat} tone="violet" secondary="In current filter" />
          <StatCard label="Material" value={formatINR(materialTotal)} icon={Package} tone="teal" secondary="In current filter" />
          <StatCard label="Others" value={formatINR(filteredTotal - labourTotal - materialTotal)} icon={Truck} tone="sky" secondary="Transport, fuel, food…" />
        </div>
      ) : (
        <KpiGridSkeleton count={6} className="md:grid-cols-3 2xl:grid-cols-6" />
      )}

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-5">
        <ChartCard
          title="Spend by Category"
          description={`${filtered.length} expenses · ${formatINR(filteredTotal)}`}
          className="xl:col-span-3"
          loading={!ready}
          isEmpty={categoryTotals.length === 0}
          height={Math.max(220, categoryTotals.length * 34 + 30)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryTotals} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid {...CHART_GRID_PROPS} horizontal={false} vertical />
              <XAxis type="number" {...CHART_AXIS_PROPS} tickFormatter={formatAxisINR} />
              <YAxis type="category" dataKey="name" {...CHART_AXIS_PROPS} width={96} />
              <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip />} />
              <Bar dataKey="value" name="Amount" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {categoryTotals.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card data-animate className="xl:col-span-2">
          <CardHeader title="How expenses are counted" icon={Info} iconTone="sky" />
          <ul className="mt-4 space-y-3 text-[13px] leading-5 text-slate-600">
            <li className="flex gap-2.5">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
              <span>
                Stock received through <span className="font-medium text-slate-800">Materials → Receive Stock</span> is already counted as project material cost and is not
                listed here. Record a Material expense only for purchases not entered as stock.
              </span>
            </li>
            <li className="flex gap-2.5">
              <HardHat className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" aria-hidden="true" />
              <span>
                Attendance wages are counted automatically. Use a Labour expense for contractors or gangs who are not tracked in attendance.
              </span>
            </li>
            <li className="flex gap-2.5">
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span>Head office expenses have no project and do not affect project profit.</span>
            </li>
          </ul>
          {categoryHint && <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">{categoryHint}</p>}
        </Card>
      </div>

      <TableCard>
        <div className="border-b border-slate-100 p-3 sm:p-4">
          <FilterBar
            search={<SearchInput value={search} onChange={setSearch} placeholder="Search vendor, description, ref…" label="Search expenses" />}
            activeCount={countActive(search, category, projectId, mode, dateFrom, dateTo)}
            onReset={resetFilters}
            trailing={
              <>
                <Button variant="outline" size="sm" icon={Download} onClick={handleExport} disabled={sorted.length === 0}>
                  Export
                </Button>
                <Button
                  size="sm"
                  icon={Plus}
                  onClick={() => openModal({ kind: 'expense', record: null, defaults: projectId && projectId !== OFFICE_FILTER ? { projectId } : undefined })}
                >
                  Add Expense
                </Button>
              </>
            }
          >
            <FilterSelect label="Category" value={category} onChange={setCategory} options={toSelectOptions(EXPENSE_CATEGORIES)} allLabel="All categories" icon={Layers} />
            <FilterSelect
              label="Project"
              value={projectId}
              onChange={setProjectId}
              options={[{ value: OFFICE_FILTER, label: 'Head office' }, ...buildProjectOptions(data.projects)]}
              allLabel="All projects"
              icon={Building2}
            />
            <FilterSelect label="Mode" value={mode} onChange={setMode} options={toSelectOptions(PAYMENT_MODES)} allLabel="All modes" icon={Wallet} />
            <DateRangeFilter from={dateFrom} to={dateTo} onFromChange={setDateFrom} onToChange={setDateTo} max={today} />
          </FilterBar>
        </div>
        <DataTable
          columns={columns}
          rows={pagination.pageItems}
          getRowKey={(expense) => expense.id}
          loading={!ready || reloading}
          caption="Expenses"
          minWidthClassName="min-w-[980px]"
          sort={sort}
          onSortChange={(key) => {
            if (isOneOf(key, EXPENSE_SORT_KEYS)) setSort((current) => toggleSort(current, key));
          }}
          emptyState={
            <EmptyState
              icon={Receipt}
              title={data.expenses.length === 0 ? 'No expenses recorded' : 'No expenses match these filters'}
              description="Track transport, machinery, fuel and site costs to see true project profit."
              action={{ label: 'Add Expense', onClick: () => openModal({ kind: 'expense', record: null }) }}
              secondaryAction={data.expenses.length > 0 ? { label: 'Reset filters', icon: RotateCcw, onClick: resetFilters } : undefined}
            />
          }
          renderMobileCard={(expense) => (
            <MobileRecordCard
              title={expense.description}
              subtitle={`${formatDate(expense.date)} · ${expense.vendor}`}
              badge={<AmountText value={expense.amount} className="text-sm font-semibold" />}
              actions={<ActionMenu items={expenseActions(expense)} label={`Actions for ${expense.id}`} />}
              fields={[
                { label: 'Category', value: expense.category },
                { label: 'Project', value: getProjectName(analytics, expense.projectId, 'Head office') },
                { label: 'Mode', value: expense.mode },
                { label: 'Reference', value: expense.referenceNo || '—' },
              ]}
            />
          )}
          footer={
            <>
              {filtered.length > 0 && (
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-[13px]">
                  <span className="text-slate-500">Total for current filter</span>
                  <span className="font-semibold tabular-nums text-slate-900">{formatINR(filteredTotal)}</span>
                </div>
              )}
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                pageSize={pagination.pageSize}
                onPageChange={pagination.setPage}
                onPageSizeChange={pagination.setPageSize}
                itemLabel="expenses"
              />
            </>
          }
        />
      </TableCard>
    </div>
  );
}

//part 4
/* ========================================================= */
/* Reports Section                                           */
/* ========================================================= */

interface ReportTableColumn {
  key: string;
  header: string;
  align?: ColumnAlign;
  /** Rendered in the report table. */
  cell: (row: ReportRow) => ReactNode;
  /** Plain value used for CSV export. */
  csv: (row: ReportRow) => CsvValue;
}

/** One report row keeps its own primitive values so the table and the CSV stay in sync. */
interface ReportRow {
  id: string;
  values: Record<string, CsvValue>;
  nodes?: Record<string, ReactNode>;
}

interface ReportSummaryItem {
  label: string;
  value: string;
  tone?: IconTone;
  hint?: string;
}

interface ReportPayload {
  columns: ReportTableColumn[];
  rows: ReportRow[];
  summary: ReportSummaryItem[];
  chart?: ReactNode;
  minWidth?: string;
  emptyTitle: string;
  emptyDescription: string;
}

function textCell(value: CsvValue): ReactNode {
  if (value === null || value === undefined || value === '') return <span className="text-slate-400">—</span>;
  return String(value);
}

function moneyCell(value: CsvValue, tone: 'neutral' | 'auto' | 'muted' = 'neutral'): ReactNode {
  return <AmountText value={typeof value === 'number' ? value : 0} tone={tone} />;
}

function numberCell(value: CsvValue, unit?: string): ReactNode {
  const numeric = typeof value === 'number' ? value : 0;
  return <span className="tabular-nums">{unit ? formatQuantity(numeric, unit) : formatNumber(numeric)}</span>;
}

function ReportsSection() {
  const { data, analytics, ready, today, navigate } = useErp();
  const toast = useToast();
  const { run, isPending } = usePendingActions();
  const [reportType, setReportType] = useState<ReportType>('labour');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [projectId, setProjectId] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [category, setCategory] = useState('');
  const [switching, setSwitching] = useState(false);

  const definition = REPORT_DEFINITIONS.find((item) => item.key === reportType) ?? REPORT_DEFINITIONS[0];
  const range = useMemo(() => normalizeDateRange(dateFrom, dateTo), [dateFrom, dateTo]);

  const changeReport = useCallback((next: ReportType) => {
    setReportType(next);
    setSwitching(true);
  }, []);

  useEffect(() => {
    if (!switching) return;
    const timer = window.setTimeout(() => setSwitching(false), 420);
    return () => window.clearTimeout(timer);
  }, [switching, reportType]);

  const usesWorkerFilter = ['labour', 'productivity', 'salary', 'khata', 'attendance', 'work'].includes(reportType);
  const usesCategoryFilter = ['daily-expense', 'weekly-expense', 'monthly-expense', 'material'].includes(reportType);

  const filteredAttendance = useMemo(
    () =>
      data.attendance.filter(
        (record) =>
          isDateInRange(record.date, range.start, range.end) &&
          (!projectId || record.projectId === projectId) &&
          (!workerId || record.workerId === workerId),
      ),
    [data.attendance, range, projectId, workerId],
  );

  const filteredWorkEntries = useMemo(
    () =>
      data.workEntries.filter(
        (entry) =>
          isDateInRange(entry.date, range.start, range.end) &&
          (!projectId || entry.projectId === projectId) &&
          (!workerId || entry.workerId === workerId),
      ),
    [data.workEntries, range, projectId, workerId],
  );

  const filteredTransactions = useMemo(
    () =>
      data.transactions.filter(
        (transaction) =>
          isDateInRange(transaction.date, range.start, range.end) &&
          (!projectId || transaction.projectId === projectId) &&
          (!workerId || transaction.workerId === workerId),
      ),
    [data.transactions, range, projectId, workerId],
  );

  const filteredExpenses = useMemo(
    () =>
      data.expenses.filter(
        (expense) =>
          isDateInRange(expense.date, range.start, range.end) &&
          (!projectId || expense.projectId === projectId) &&
          (!category || expense.category === category),
      ),
    [data.expenses, range, projectId, category],
  );

  const filteredWorkers = useMemo(
    () => data.workers.filter((worker) => (!projectId || worker.projectId === projectId) && (!workerId || worker.id === workerId)),
    [data.workers, projectId, workerId],
  );

  const filteredProjects = useMemo(
    () => data.projects.filter((project) => !projectId || project.id === projectId),
    [data.projects, projectId],
  );

  const filteredMaterials = useMemo(
    () => data.materials.filter((material) => (!projectId || material.projectId === projectId) && (!category || material.category === category)),
    [data.materials, projectId, category],
  );

  /** Wage/attendance figures restricted to the selected range, so the report matches its filters. */
  const rangeWorkerStats = useMemo(() => {
    const stats = new Map<
      string,
      { effectiveDays: number; marked: number; present: number; half: number; absent: number; leave: number; wages: number; overtime: number }
    >();
    const ensure = (id: string) => {
      const existing = stats.get(id);
      if (existing) return existing;
      const created = { effectiveDays: 0, marked: 0, present: 0, half: 0, absent: 0, leave: 0, wages: 0, overtime: 0 };
      stats.set(id, created);
      return created;
    };
    for (const record of filteredAttendance) {
      const worker = analytics.workersById[record.workerId];
      if (!worker) continue;
      const entry = ensure(record.workerId);
      entry.marked += 1;
      entry.effectiveDays += ATTENDANCE_FACTOR[record.status];
      if (record.status === 'Present') entry.present += 1;
      else if (record.status === 'Half Day') entry.half += 1;
      else if (record.status === 'Absent') entry.absent += 1;
      else entry.leave += 1;
      if (ATTENDANCE_FACTOR[record.status] > 0) entry.overtime += Math.max(0, record.overtimeHours);
      entry.wages += calculateAttendanceWage(record, worker.dailyWage, data.settings);
    }
    return stats;
  }, [filteredAttendance, analytics.workersById, data.settings]);

  const rangeLedgerStats = useMemo(() => {
    const stats = new Map<
      string,
      { wageCredits: number; allowances: number; bonuses: number; reimbursements: number; expenses: number; otherCredits: number; payments: number; advances: number; deductions: number; otherDebits: number }
    >();
    const ensure = (id: string) => {
      const existing = stats.get(id);
      if (existing) return existing;
      const created = {
        wageCredits: 0,
        allowances: 0,
        bonuses: 0,
        reimbursements: 0,
        expenses: 0,
        otherCredits: 0,
        payments: 0,
        advances: 0,
        deductions: 0,
        otherDebits: 0,
      };
      stats.set(id, created);
      return created;
    };
    for (const transaction of filteredTransactions) {
      const entry = ensure(transaction.workerId);
      const amount = Math.max(0, transaction.amount);
      if (transaction.direction === 'credit') {
        if (transaction.type === 'Salary/Wage') entry.wageCredits += amount;
        else if (transaction.type === 'Daily Allowance') entry.allowances += amount;
        else if (transaction.type === 'Bonus') entry.bonuses += amount;
        else if (transaction.type === 'Reimbursement') entry.reimbursements += amount;
        else if (transaction.type === 'Expense') entry.expenses += amount;
        else entry.otherCredits += amount;
      } else {
        if (transaction.type === 'Payment') entry.payments += amount;
        else if (transaction.type === 'Advance') entry.advances += amount;
        else if (transaction.type === 'Deduction') entry.deductions += amount;
        else entry.otherDebits += amount;
      }
    }
    return stats;
  }, [filteredTransactions]);

  const report = useMemo<ReportPayload>(() => {
    const emptyLedger = {
      wageCredits: 0,
      allowances: 0,
      bonuses: 0,
      reimbursements: 0,
      expenses: 0,
      otherCredits: 0,
      payments: 0,
      advances: 0,
      deductions: 0,
      otherDebits: 0,
    };
    const emptyAttendance = { effectiveDays: 0, marked: 0, present: 0, half: 0, absent: 0, leave: 0, wages: 0, overtime: 0 };

    switch (reportType) {
      case 'labour': {
        const rows: ReportRow[] = filteredWorkers.map((worker) => {
          const attendance = rangeWorkerStats.get(worker.id) ?? emptyAttendance;
          const ledger = rangeLedgerStats.get(worker.id) ?? emptyLedger;
          const additional = ledger.wageCredits + ledger.allowances + ledger.bonuses + ledger.reimbursements + ledger.expenses + ledger.otherCredits;
          return {
            id: worker.id,
            values: {
              worker: worker.name,
              trade: worker.trade,
              project: getProjectName(analytics, worker.projectId),
              days: roundTo(attendance.effectiveDays, 1),
              rate: roundTo(safeDivide(attendance.effectiveDays, attendance.marked) * 100, 1),
              wages: attendance.wages,
              additional,
              payments: ledger.payments,
              advances: ledger.advances,
              deductions: ledger.deductions + ledger.otherDebits,
              payable: analytics.workerMetrics[worker.id]?.payable ?? 0,
            },
          };
        });
        return {
          columns: [
            { key: 'worker', header: 'Worker', cell: (row) => <span className="font-medium text-slate-900">{textCell(row.values.worker)}</span>, csv: (row) => row.values.worker },
            { key: 'trade', header: 'Trade', cell: (row) => textCell(row.values.trade), csv: (row) => row.values.trade },
            { key: 'project', header: 'Project', cell: (row) => textCell(row.values.project), csv: (row) => row.values.project },
            { key: 'days', header: 'Eff. days', align: 'right', cell: (row) => numberCell(row.values.days), csv: (row) => row.values.days },
            {
              key: 'rate',
              header: 'Attendance %',
              align: 'right',
              cell: (row) => <span className="tabular-nums">{formatPercent(typeof row.values.rate === 'number' ? row.values.rate : 0)}</span>,
              csv: (row) => row.values.rate,
            },
            { key: 'wages', header: 'Attendance wages', align: 'right', cell: (row) => moneyCell(row.values.wages), csv: (row) => row.values.wages },
            { key: 'additional', header: 'Additional earnings', align: 'right', cell: (row) => moneyCell(row.values.additional, 'muted'), csv: (row) => row.values.additional },
            { key: 'payments', header: 'Payments', align: 'right', cell: (row) => moneyCell(row.values.payments, 'muted'), csv: (row) => row.values.payments },
            { key: 'advances', header: 'Advance', align: 'right', cell: (row) => moneyCell(row.values.advances, 'muted'), csv: (row) => row.values.advances },
            { key: 'deductions', header: 'Deductions', align: 'right', cell: (row) => moneyCell(row.values.deductions, 'muted'), csv: (row) => row.values.deductions },
            {
              key: 'payable',
              header: 'Payable (all time)',
              align: 'right',
              cell: (row) => <AmountText value={typeof row.values.payable === 'number' ? row.values.payable : 0} tone={(row.values.payable as number) < 0 ? 'debit' : 'neutral'} className="font-semibold" />,
              csv: (row) => row.values.payable,
            },
          ],
          rows,
          summary: [
            { label: 'Workers', value: String(rows.length), tone: 'indigo' },
            { label: 'Attendance wages', value: formatINR(sumBy(rows, (row) => Number(row.values.wages) || 0)), tone: 'emerald' },
            { label: 'Payments made', value: formatINR(sumBy(rows, (row) => Number(row.values.payments) || 0)), tone: 'sky' },
            { label: 'Advances', value: formatINR(sumBy(rows, (row) => Number(row.values.advances) || 0)), tone: 'amber' },
          ],
          minWidth: 'min-w-[1180px]',
          emptyTitle: 'No labour data',
          emptyDescription: 'No workers match the selected filters.',
        };
      }

      case 'productivity': {
        const productivity = computeProductivityRows(filteredWorkEntries, data.attendance);
        const rows: ReportRow[] = productivity.map((row) => {
          const worker = analytics.workersById[row.workerId];
          return {
            id: row.key,
            values: {
              worker: worker?.name ?? 'Removed worker',
              trade: worker?.trade ?? '—',
              project: worker ? getProjectName(analytics, worker.projectId) : '—',
              quantity: row.quantity,
              unit: row.unit,
              days: roundTo(row.days, 1),
              perDay: row.perDay,
              entries: row.entries,
            },
          };
        });
        const unitCounts = new Map<string, number>();
        for (const row of productivity) if (row.unit !== 'day') unitCounts.set(row.unit, (unitCounts.get(row.unit) ?? 0) + row.entries);
        const topUnit = Array.from(unitCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
        const chartData = productivity
          .filter((row) => row.unit === topUnit)
          .slice(0, 10)
          .map((row) => ({ name: getWorkerName(analytics, row.workerId), perDay: row.perDay }));
        return {
          columns: [
            { key: 'worker', header: 'Worker', cell: (row) => <span className="font-medium text-slate-900">{textCell(row.values.worker)}</span>, csv: (row) => row.values.worker },
            { key: 'trade', header: 'Trade', cell: (row) => textCell(row.values.trade), csv: (row) => row.values.trade },
            { key: 'project', header: 'Project', cell: (row) => textCell(row.values.project), csv: (row) => row.values.project },
            { key: 'quantity', header: 'Quantity', align: 'right', cell: (row) => numberCell(row.values.quantity), csv: (row) => row.values.quantity },
            { key: 'unit', header: 'Unit', cell: (row) => <Badge tone="neutral">{String(row.values.unit)}</Badge>, csv: (row) => row.values.unit },
            { key: 'days', header: 'Eff. work days', align: 'right', cell: (row) => numberCell(row.values.days), csv: (row) => row.values.days },
            {
              key: 'perDay',
              header: 'Per day',
              align: 'right',
              cell: (row) =>
                Number(row.values.perDay) > 0 ? (
                  <span className="font-semibold tabular-nums text-slate-900">
                    {formatNumber(Number(row.values.perDay))} {String(row.values.unit)}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                ),
              csv: (row) => row.values.perDay,
            },
            { key: 'entries', header: 'Entries', align: 'right', cell: (row) => numberCell(row.values.entries), csv: (row) => row.values.entries },
          ],
          rows,
          summary: [
            { label: 'Worker-unit rows', value: String(rows.length), tone: 'indigo' },
            { label: 'Work entries', value: String(filteredWorkEntries.length), tone: 'sky' },
            { label: 'Primary unit', value: topUnit || '—', tone: 'emerald' },
            {
              label: `Total ${topUnit || 'work'}`,
              value: formatNumber(sumBy(productivity.filter((row) => row.unit === topUnit), (row) => row.quantity)),
              tone: 'amber',
            },
          ],
          chart:
            chartData.length > 0 ? (
              <ChartCard title="Productivity by Worker" description={`${topUnit} per effective working day`} height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
                    <CartesianGrid {...CHART_GRID_PROPS} horizontal={false} vertical />
                    <XAxis type="number" {...CHART_AXIS_PROPS} />
                    <YAxis type="category" dataKey="name" {...CHART_AXIS_PROPS} width={112} tickFormatter={(value: string) => truncateLabel(String(value), 15)} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip valueFormatter={(value) => `${formatNumber(value)} ${topUnit}/day`} />} />
                    <Bar dataKey="perDay" name="Per day" fill={CHART_COLORS.labour} radius={[0, 4, 4, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            ) : undefined,
          minWidth: 'min-w-[900px]',
          emptyTitle: 'No measured work',
          emptyDescription: 'No work entries match the selected filters.',
        };
      }

      case 'site': {
        const rows: ReportRow[] = filteredProjects.map((project) => {
          const financials = analytics.projectFinancials[project.id];
          return {
            id: project.id,
            values: {
              project: project.name,
              stage: project.stage,
              workers: financials?.activeWorkers ?? 0,
              value: project.projectValue,
              estimated: project.estimatedCost,
              actual: financials?.actualCost ?? 0,
              labour: financials?.labourCost ?? 0,
              material: financials?.materialCost ?? 0,
              other: financials?.otherCost ?? 0,
              usage: roundTo(financials?.budgetUsage ?? 0, 1),
              progress: roundTo(financials?.progress ?? 0, 1),
              profit: financials?.profitLoss ?? 0,
            },
            nodes: { stage: <StageBadge stage={project.stage} /> },
          };
        });
        return {
          columns: [
            { key: 'project', header: 'Project', cell: (row) => <span className="font-medium text-slate-900">{textCell(row.values.project)}</span>, csv: (row) => row.values.project },
            { key: 'stage', header: 'Stage', cell: (row) => row.nodes?.stage ?? textCell(row.values.stage), csv: (row) => row.values.stage },
            { key: 'workers', header: 'Workers', align: 'right', cell: (row) => numberCell(row.values.workers), csv: (row) => row.values.workers },
            { key: 'value', header: 'Project value', align: 'right', cell: (row) => moneyCell(row.values.value), csv: (row) => row.values.value },
            { key: 'estimated', header: 'Estimated', align: 'right', cell: (row) => moneyCell(row.values.estimated, 'muted'), csv: (row) => row.values.estimated },
            { key: 'actual', header: 'Actual', align: 'right', cell: (row) => moneyCell(row.values.actual), csv: (row) => row.values.actual },
            { key: 'labour', header: 'Labour', align: 'right', cell: (row) => moneyCell(row.values.labour, 'muted'), csv: (row) => row.values.labour },
            { key: 'material', header: 'Material', align: 'right', cell: (row) => moneyCell(row.values.material, 'muted'), csv: (row) => row.values.material },
            { key: 'other', header: 'Other', align: 'right', cell: (row) => moneyCell(row.values.other, 'muted'), csv: (row) => row.values.other },
            {
              key: 'usage',
              header: 'Budget used',
              align: 'right',
              cell: (row) => <span className={cn('tabular-nums', Number(row.values.usage) > 100 && 'font-semibold text-rose-600')}>{formatPercent(Number(row.values.usage))}</span>,
              csv: (row) => row.values.usage,
            },
            {
              key: 'progress',
              header: 'Progress',
              align: 'right',
              cell: (row) => <span className="tabular-nums">{formatPercent(Number(row.values.progress))}</span>,
              csv: (row) => row.values.progress,
            },
            {
              key: 'profit',
              header: 'Profit/Loss',
              align: 'right',
              cell: (row) => <AmountText value={Number(row.values.profit)} tone="auto" className="font-semibold" />,
              csv: (row) => row.values.profit,
            },
          ],
          rows,
          summary: [
            { label: 'Projects', value: String(rows.length), tone: 'indigo' },
            { label: 'Portfolio value', value: formatINRCompact(sumBy(rows, (row) => Number(row.values.value) || 0)), tone: 'emerald' },
            { label: 'Actual cost', value: formatINRCompact(sumBy(rows, (row) => Number(row.values.actual) || 0)), tone: 'amber' },
            { label: 'Profit/Loss', value: formatINRCompact(sumBy(rows, (row) => Number(row.values.profit) || 0)), tone: 'teal' },
          ],
          minWidth: 'min-w-[1240px]',
          emptyTitle: 'No projects',
          emptyDescription: 'Add a project or clear the project filter.',
        };
      }

      case 'daily-expense':
      case 'weekly-expense':
      case 'monthly-expense': {
        const groups = new Map<string, { label: string; labour: number; material: number; other: number; total: number; count: number }>();
        const keyFor = (date: string): { key: string; label: string } => {
          if (reportType === 'daily-expense') return { key: date, label: formatDate(date) };
          if (reportType === 'weekly-expense') {
            const start = startOfWeekISO(date);
            return { key: start, label: `${formatDateShort(start)} – ${formatDateShort(addDays(start, 6))}` };
          }
          const month = monthKey(date);
          return { key: month, label: formatMonthLabel(month) };
        };
        for (const expense of filteredExpenses) {
          const { key, label } = keyFor(expense.date);
          const group = groups.get(key) ?? { label, labour: 0, material: 0, other: 0, total: 0, count: 0 };
          const kind = EXPENSE_CATEGORY_KIND[expense.category];
          group[kind] += expense.amount;
          group.total += expense.amount;
          group.count += 1;
          groups.set(key, group);
        }
        const ordered = Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
        const rows: ReportRow[] = ordered
          .slice()
          .reverse()
          .map(([key, group]) => ({
            id: key,
            values: { period: group.label, labour: group.labour, material: group.material, other: group.other, total: group.total, count: group.count },
          }));
        const chartData = ordered.map(([, group]) => ({ label: group.label, labour: group.labour, material: group.material, other: group.other }));
        const periodLabel = reportType === 'daily-expense' ? 'Day' : reportType === 'weekly-expense' ? 'Week' : 'Month';
        const total = sumBy(filteredExpenses, (expense) => expense.amount);
        return {
          columns: [
            { key: 'period', header: periodLabel, cell: (row) => <span className="whitespace-nowrap font-medium text-slate-900">{textCell(row.values.period)}</span>, csv: (row) => row.values.period },
            { key: 'count', header: 'Entries', align: 'right', cell: (row) => numberCell(row.values.count), csv: (row) => row.values.count },
            { key: 'labour', header: 'Labour', align: 'right', cell: (row) => moneyCell(row.values.labour, 'muted'), csv: (row) => row.values.labour },
            { key: 'material', header: 'Material', align: 'right', cell: (row) => moneyCell(row.values.material, 'muted'), csv: (row) => row.values.material },
            { key: 'other', header: 'Other', align: 'right', cell: (row) => moneyCell(row.values.other, 'muted'), csv: (row) => row.values.other },
            { key: 'total', header: 'Total', align: 'right', cell: (row) => moneyCell(row.values.total), csv: (row) => row.values.total },
          ],
          rows,
          summary: [
            { label: `${periodLabel}s`, value: String(rows.length), tone: 'indigo' },
            { label: 'Total expense', value: formatINR(total), tone: 'rose' },
            { label: `Average per ${periodLabel.toLowerCase()}`, value: formatINR(safeDivide(total, rows.length)), tone: 'amber' },
            { label: 'Entries', value: String(filteredExpenses.length), tone: 'sky' },
          ],
          chart:
            chartData.length > 0 ? (
              <ChartCard
                title={`${periodLabel}-wise Expense`}
                description="Split by labour, material and other heads"
                height={260}
                legend={
                  <ChartLegend
                    items={[
                      { label: 'Labour', color: CHART_COLORS.labour },
                      { label: 'Material', color: CHART_COLORS.material },
                      { label: 'Other', color: CHART_COLORS.other },
                    ]}
                  />
                }
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid {...CHART_GRID_PROPS} />
                    <XAxis dataKey="label" {...CHART_AXIS_PROPS} interval="preserveStartEnd" tickFormatter={(value: string) => truncateLabel(String(value), 10)} />
                    <YAxis {...CHART_AXIS_PROPS} tickFormatter={formatAxisINR} width={56} />
                    <RechartsTooltip content={<ChartTooltip showTotal />} />
                    <Area type="monotone" dataKey="labour" name="Labour" stackId="cost" stroke={CHART_COLORS.labour} fill={CHART_COLORS.labour} fillOpacity={0.18} strokeWidth={2} />
                    <Area type="monotone" dataKey="material" name="Material" stackId="cost" stroke={CHART_COLORS.material} fill={CHART_COLORS.material} fillOpacity={0.18} strokeWidth={2} />
                    <Area type="monotone" dataKey="other" name="Other" stackId="cost" stroke={CHART_COLORS.other} fill={CHART_COLORS.other} fillOpacity={0.18} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            ) : undefined,
          minWidth: 'min-w-[760px]',
          emptyTitle: 'No expenses in this range',
          emptyDescription: 'Adjust the date range, project or category filter.',
        };
      }

      case 'material': {
        const rows: ReportRow[] = filteredMaterials.map((material) => {
          const stock = analytics.materialStock[material.id];
          return {
            id: material.id,
            values: {
              material: material.name,
              category: material.category,
              project: getProjectName(analytics, material.projectId),
              unit: material.unit,
              opening: material.openingStock,
              received: stock?.received ?? 0,
              used: stock?.used ?? 0,
              remaining: stock?.remaining ?? 0,
              rate: material.purchaseRate,
              cost: stock?.totalCost ?? 0,
              stockValue: stock?.stockValue ?? 0,
              status: stock?.status ?? 'In Stock',
            },
            nodes: { status: <StockBadge status={stock?.status ?? 'In Stock'} /> },
          };
        });
        const statusCounts = STOCK_STATUSES.map((status, index) => ({
          name: status,
          value: rows.filter((row) => row.values.status === status).length,
          color: index === 0 ? CHART_COLORS.value : index === 1 ? CHART_COLORS.material : CHART_COLORS.loss,
        })).filter((item) => item.value > 0);
        return {
          columns: [
            { key: 'material', header: 'Material', cell: (row) => <span className="font-medium text-slate-900">{textCell(row.values.material)}</span>, csv: (row) => row.values.material },
            { key: 'category', header: 'Category', cell: (row) => <Badge tone="neutral">{String(row.values.category)}</Badge>, csv: (row) => row.values.category },
            { key: 'project', header: 'Project', cell: (row) => textCell(row.values.project), csv: (row) => row.values.project },
            { key: 'opening', header: 'Opening', align: 'right', cell: (row) => numberCell(row.values.opening), csv: (row) => row.values.opening },
            { key: 'received', header: 'Received', align: 'right', cell: (row) => numberCell(row.values.received), csv: (row) => row.values.received },
            { key: 'used', header: 'Used', align: 'right', cell: (row) => numberCell(row.values.used), csv: (row) => row.values.used },
            {
              key: 'remaining',
              header: 'Remaining',
              align: 'right',
              cell: (row) => <span className="font-semibold tabular-nums">{formatQuantity(Number(row.values.remaining), String(row.values.unit))}</span>,
              csv: (row) => row.values.remaining,
            },
            { key: 'rate', header: 'Rate', align: 'right', cell: (row) => moneyCell(row.values.rate, 'muted'), csv: (row) => row.values.rate },
            { key: 'cost', header: 'Purchase cost', align: 'right', cell: (row) => moneyCell(row.values.cost), csv: (row) => row.values.cost },
            { key: 'stockValue', header: 'Stock value', align: 'right', cell: (row) => moneyCell(row.values.stockValue, 'muted'), csv: (row) => row.values.stockValue },
            { key: 'status', header: 'Status', cell: (row) => row.nodes?.status ?? textCell(row.values.status), csv: (row) => row.values.status },
          ],
          rows,
          summary: [
            { label: 'Materials', value: String(rows.length), tone: 'indigo' },
            { label: 'Purchase cost', value: formatINRCompact(sumBy(rows, (row) => Number(row.values.cost) || 0)), tone: 'violet' },
            { label: 'Stock value', value: formatINRCompact(sumBy(rows, (row) => Number(row.values.stockValue) || 0)), tone: 'emerald' },
            {
              label: 'Needs reorder',
              value: String(rows.filter((row) => row.values.status !== 'In Stock').length),
              tone: 'amber',
            },
          ],
          chart:
            statusCounts.length > 0 ? (
              <ChartCard
                title="Stock Status"
                description="Distribution across the filtered materials"
                height={240}
                legend={<ChartLegend items={statusCounts.map((item) => ({ label: item.name, color: item.color, value: String(item.value) }))} />}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={2} stroke="none">
                      {statusCounts.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<ChartTooltip valueFormatter={(value) => `${value} materials`} />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            ) : undefined,
          minWidth: 'min-w-[1200px]',
          emptyTitle: 'No materials',
          emptyDescription: 'Adjust the project or category filter.',
        };
      }

      case 'salary': {
        const rows: ReportRow[] = filteredWorkers.map((worker) => {
          const attendance = rangeWorkerStats.get(worker.id) ?? emptyAttendance;
          const ledger = rangeLedgerStats.get(worker.id) ?? emptyLedger;
          return {
            id: worker.id,
            values: {
              worker: worker.name,
              wages: attendance.wages,
              wageCredits: ledger.wageCredits,
              allowances: ledger.allowances,
              bonuses: ledger.bonuses,
              reimbursements: ledger.reimbursements + ledger.expenses,
              payments: ledger.payments,
              advances: ledger.advances,
              deductions: ledger.deductions,
              payable: analytics.workerMetrics[worker.id]?.payable ?? 0,
            },
          };
        });
        const chartData = rows
          .slice()
          .sort((a, b) => Number(b.values.wages) - Number(a.values.wages))
          .slice(0, 10)
          .map((row) => ({
            name: String(row.values.worker),
            Earned: Number(row.values.wages) + Number(row.values.wageCredits) + Number(row.values.allowances) + Number(row.values.bonuses),
            Paid: Number(row.values.payments) + Number(row.values.advances),
          }));
        return {
          columns: [
            { key: 'worker', header: 'Worker', cell: (row) => <span className="font-medium text-slate-900">{textCell(row.values.worker)}</span>, csv: (row) => row.values.worker },
            { key: 'wages', header: 'Attendance wages', align: 'right', cell: (row) => moneyCell(row.values.wages), csv: (row) => row.values.wages },
            { key: 'wageCredits', header: 'Manual wages', align: 'right', cell: (row) => moneyCell(row.values.wageCredits, 'muted'), csv: (row) => row.values.wageCredits },
            { key: 'allowances', header: 'Allowances', align: 'right', cell: (row) => moneyCell(row.values.allowances, 'muted'), csv: (row) => row.values.allowances },
            { key: 'bonuses', header: 'Bonus', align: 'right', cell: (row) => moneyCell(row.values.bonuses, 'muted'), csv: (row) => row.values.bonuses },
            { key: 'reimbursements', header: 'Reimbursements', align: 'right', cell: (row) => moneyCell(row.values.reimbursements, 'muted'), csv: (row) => row.values.reimbursements },
            { key: 'payments', header: 'Payments', align: 'right', cell: (row) => moneyCell(row.values.payments), csv: (row) => row.values.payments },
            { key: 'advances', header: 'Advance', align: 'right', cell: (row) => moneyCell(row.values.advances, 'muted'), csv: (row) => row.values.advances },
            { key: 'deductions', header: 'Deductions', align: 'right', cell: (row) => moneyCell(row.values.deductions, 'muted'), csv: (row) => row.values.deductions },
            {
              key: 'payable',
              header: 'Payable (all time)',
              align: 'right',
              cell: (row) => <AmountText value={Number(row.values.payable)} tone={Number(row.values.payable) < 0 ? 'debit' : 'neutral'} className="font-semibold" />,
              csv: (row) => row.values.payable,
            },
          ],
          rows,
          summary: [
            { label: 'Workers', value: String(rows.length), tone: 'indigo' },
            { label: 'Wages earned', value: formatINR(sumBy(rows, (row) => Number(row.values.wages) + Number(row.values.wageCredits) + Number(row.values.allowances) + Number(row.values.bonuses))), tone: 'emerald' },
            { label: 'Paid & advanced', value: formatINR(sumBy(rows, (row) => Number(row.values.payments) + Number(row.values.advances))), tone: 'sky' },
            { label: 'Payable now', value: formatINR(sumBy(rows, (row) => Math.max(0, Number(row.values.payable)))), tone: 'amber' },
          ],
          chart:
            chartData.length > 0 ? (
              <ChartCard title="Earnings vs Payments" description="Top workers in the selected range" height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid {...CHART_GRID_PROPS} />
                    <XAxis dataKey="name" {...CHART_AXIS_PROPS} tickFormatter={(value: string) => truncateLabel(String(value), 9)} />
                    <YAxis {...CHART_AXIS_PROPS} tickFormatter={formatAxisINR} width={56} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#475569' }} />
                    <Bar dataKey="Earned" name="Earned" fill={CHART_COLORS.labour} radius={[4, 4, 0, 0]} maxBarSize={26} />
                    <Bar dataKey="Paid" name="Paid" fill={CHART_COLORS.value} radius={[4, 4, 0, 0]} maxBarSize={26} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            ) : undefined,
          minWidth: 'min-w-[1160px]',
          emptyTitle: 'No salary data',
          emptyDescription: 'No workers match the selected filters.',
        };
      }

      case 'khata': {
        const rows: ReportRow[] = filteredTransactions
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
          .map((transaction) => ({
            id: transaction.id,
            values: {
              date: transaction.date,
              person: getWorkerName(analytics, transaction.workerId),
              project: getProjectName(analytics, transaction.projectId),
              type: transaction.type,
              credit: transaction.direction === 'credit' ? transaction.amount : 0,
              debit: transaction.direction === 'debit' ? transaction.amount : 0,
              mode: transaction.mode,
              notes: transaction.notes,
            },
          }));
        return {
          columns: [
            { key: 'date', header: 'Date', cell: (row) => <span className="whitespace-nowrap">{formatDate(String(row.values.date))}</span>, csv: (row) => row.values.date },
            { key: 'person', header: 'Person', cell: (row) => <span className="font-medium text-slate-900">{textCell(row.values.person)}</span>, csv: (row) => row.values.person },
            { key: 'project', header: 'Project', cell: (row) => textCell(row.values.project), csv: (row) => row.values.project },
            { key: 'type', header: 'Type', cell: (row) => textCell(row.values.type), csv: (row) => row.values.type },
            {
              key: 'credit',
              header: 'Credit',
              align: 'right',
              cell: (row) => (Number(row.values.credit) > 0 ? <AmountText value={Number(row.values.credit)} tone="credit" /> : <span className="text-slate-300">—</span>),
              csv: (row) => row.values.credit,
            },
            {
              key: 'debit',
              header: 'Debit',
              align: 'right',
              cell: (row) => (Number(row.values.debit) > 0 ? <AmountText value={Number(row.values.debit)} tone="debit" /> : <span className="text-slate-300">—</span>),
              csv: (row) => row.values.debit,
            },
            { key: 'mode', header: 'Mode', cell: (row) => textCell(row.values.mode), csv: (row) => row.values.mode },
            { key: 'notes', header: 'Notes', cell: (row) => <span className="line-clamp-2 max-w-[260px]">{textCell(row.values.notes)}</span>, csv: (row) => row.values.notes },
          ],
          rows,
          summary: [
            { label: 'Transactions', value: String(rows.length), tone: 'indigo' },
            { label: 'Total credit', value: formatINR(sumBy(rows, (row) => Number(row.values.credit) || 0)), tone: 'emerald' },
            { label: 'Total debit', value: formatINR(sumBy(rows, (row) => Number(row.values.debit) || 0)), tone: 'rose' },
            { label: 'People', value: String(new Set(rows.map((row) => row.values.person)).size), tone: 'sky' },
          ],
          minWidth: 'min-w-[1000px]',
          emptyTitle: 'No transactions',
          emptyDescription: 'Adjust the date range, person or project filter.',
        };
      }

      case 'project-cost': {
        const rows: ReportRow[] = filteredProjects.map((project) => {
          const financials = analytics.projectFinancials[project.id];
          return {
            id: project.id,
            values: {
              project: project.name,
              estimated: project.estimatedCost,
              labour: financials?.labourCost ?? 0,
              material: financials?.materialCost ?? 0,
              other: financials?.otherCost ?? 0,
              actual: financials?.actualCost ?? 0,
              remaining: financials?.remainingBudget ?? 0,
              usage: roundTo(financials?.budgetUsage ?? 0, 1),
            },
          };
        });
        const chartData = rows.map((row) => ({ name: String(row.values.project), Estimated: Number(row.values.estimated), Actual: Number(row.values.actual) }));
        return {
          columns: [
            { key: 'project', header: 'Project', cell: (row) => <span className="font-medium text-slate-900">{textCell(row.values.project)}</span>, csv: (row) => row.values.project },
            { key: 'estimated', header: 'Estimated', align: 'right', cell: (row) => moneyCell(row.values.estimated, 'muted'), csv: (row) => row.values.estimated },
            { key: 'labour', header: 'Labour', align: 'right', cell: (row) => moneyCell(row.values.labour), csv: (row) => row.values.labour },
            { key: 'material', header: 'Material', align: 'right', cell: (row) => moneyCell(row.values.material), csv: (row) => row.values.material },
            { key: 'other', header: 'Other', align: 'right', cell: (row) => moneyCell(row.values.other), csv: (row) => row.values.other },
            { key: 'actual', header: 'Actual', align: 'right', cell: (row) => moneyCell(row.values.actual), csv: (row) => row.values.actual },
            {
              key: 'remaining',
              header: 'Remaining budget',
              align: 'right',
              cell: (row) => <AmountText value={Number(row.values.remaining)} tone="auto" />,
              csv: (row) => row.values.remaining,
            },
            {
              key: 'usage',
              header: 'Budget usage',
              align: 'right',
              cell: (row) => (
                <div className="flex w-32 items-center gap-2">
                  <ProgressBar value={Number(row.values.usage)} tone={getUtilisationTone(Number(row.values.usage))} size="xs" label={`${String(row.values.project)} budget`} />
                  <span className="w-11 shrink-0 text-right text-xs tabular-nums">{formatPercent(Number(row.values.usage), 0)}</span>
                </div>
              ),
              csv: (row) => row.values.usage,
            },
          ],
          rows,
          summary: [
            { label: 'Projects', value: String(rows.length), tone: 'indigo' },
            { label: 'Estimated', value: formatINRCompact(sumBy(rows, (row) => Number(row.values.estimated) || 0)), tone: 'slate' },
            { label: 'Actual', value: formatINRCompact(sumBy(rows, (row) => Number(row.values.actual) || 0)), tone: 'amber' },
            { label: 'Over budget', value: String(rows.filter((row) => Number(row.values.usage) > 100).length), tone: 'rose' },
          ],
          chart:
            chartData.length > 0 ? (
              <ChartCard title="Estimated vs Actual" description="Project-wise cost comparison" height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid {...CHART_GRID_PROPS} />
                    <XAxis dataKey="name" {...CHART_AXIS_PROPS} tickFormatter={(value: string) => truncateLabel(String(value), 11)} />
                    <YAxis {...CHART_AXIS_PROPS} tickFormatter={formatAxisINR} width={56} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#475569' }} />
                    <Bar dataKey="Estimated" name="Estimated" fill={CHART_COLORS.estimated} radius={[4, 4, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="Actual" name="Actual" radius={[4, 4, 0, 0]} maxBarSize={28}>
                      {chartData.map((item) => (
                        <Cell key={item.name} fill={item.Actual > item.Estimated ? CHART_COLORS.loss : CHART_COLORS.actual} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            ) : undefined,
          minWidth: 'min-w-[1080px]',
          emptyTitle: 'No projects',
          emptyDescription: 'Clear the project filter to see all sites.',
        };
      }

      case 'profit-loss': {
        const rows: ReportRow[] = filteredProjects.map((project) => {
          const financials = analytics.projectFinancials[project.id];
          return {
            id: project.id,
            values: {
              project: project.name,
              stage: project.stage,
              value: project.projectValue,
              actual: financials?.actualCost ?? 0,
              profit: financials?.profitLoss ?? 0,
              margin: roundTo(financials?.profitMargin ?? 0, 1),
            },
            nodes: { stage: <StageBadge stage={project.stage} /> },
          };
        });
        const chartData = rows.map((row) => ({ name: String(row.values.project), profit: Number(row.values.profit) }));
        return {
          columns: [
            { key: 'project', header: 'Project', cell: (row) => <span className="font-medium text-slate-900">{textCell(row.values.project)}</span>, csv: (row) => row.values.project },
            { key: 'stage', header: 'Stage', cell: (row) => row.nodes?.stage ?? textCell(row.values.stage), csv: (row) => row.values.stage },
            { key: 'value', header: 'Project value', align: 'right', cell: (row) => moneyCell(row.values.value), csv: (row) => row.values.value },
            { key: 'actual', header: 'Actual cost', align: 'right', cell: (row) => moneyCell(row.values.actual), csv: (row) => row.values.actual },
            {
              key: 'profit',
              header: 'Profit/Loss',
              align: 'right',
              cell: (row) => <AmountText value={Number(row.values.profit)} tone="auto" className="font-semibold" />,
              csv: (row) => row.values.profit,
            },
            {
              key: 'margin',
              header: 'Margin',
              align: 'right',
              cell: (row) => (
                <span className={cn('tabular-nums', Number(row.values.margin) < 0 ? 'text-rose-600' : 'text-emerald-700')}>{formatPercent(Number(row.values.margin))}</span>
              ),
              csv: (row) => row.values.margin,
            },
          ],
          rows,
          summary: [
            { label: 'Projects', value: String(rows.length), tone: 'indigo' },
            { label: 'Total value', value: formatINRCompact(sumBy(rows, (row) => Number(row.values.value) || 0)), tone: 'emerald' },
            { label: 'Total cost', value: formatINRCompact(sumBy(rows, (row) => Number(row.values.actual) || 0)), tone: 'amber' },
            { label: 'Net profit', value: formatINRCompact(sumBy(rows, (row) => Number(row.values.profit) || 0)), tone: 'teal' },
          ],
          chart:
            chartData.length > 0 ? (
              <ChartCard title="Profit / Loss by Project" description="Project value minus actual cost" height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid {...CHART_GRID_PROPS} />
                    <XAxis dataKey="name" {...CHART_AXIS_PROPS} tickFormatter={(value: string) => truncateLabel(String(value), 11)} />
                    <YAxis {...CHART_AXIS_PROPS} tickFormatter={formatAxisINR} width={56} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<ChartTooltip />} />
                    <Bar dataKey="profit" name="Profit/Loss" radius={[4, 4, 0, 0]} maxBarSize={36}>
                      {chartData.map((item) => (
                        <Cell key={item.name} fill={item.profit < 0 ? CHART_COLORS.loss : CHART_COLORS.value} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            ) : undefined,
          minWidth: 'min-w-[820px]',
          emptyTitle: 'No projects',
          emptyDescription: 'Clear the project filter to see all sites.',
        };
      }

      case 'attendance': {
        const rows: ReportRow[] = filteredWorkers.map((worker) => {
          const attendance = rangeWorkerStats.get(worker.id) ?? emptyAttendance;
          return {
            id: worker.id,
            values: {
              worker: worker.name,
              trade: worker.trade,
              project: getProjectName(analytics, worker.projectId),
              marked: attendance.marked,
              present: attendance.present,
              half: attendance.half,
              absent: attendance.absent,
              leave: attendance.leave,
              overtime: roundTo(attendance.overtime, 1),
              rate: roundTo(safeDivide(attendance.effectiveDays, attendance.marked) * 100, 1),
            },
          };
        });
        const totals = ATTENDANCE_STATUSES.map((status) => ({
          name: status,
          value: filteredAttendance.filter((record) => record.status === status).length,
          color: ATTENDANCE_STYLES[status].color,
        })).filter((item) => item.value > 0);
        return {
          columns: [
            { key: 'worker', header: 'Worker', cell: (row) => <span className="font-medium text-slate-900">{textCell(row.values.worker)}</span>, csv: (row) => row.values.worker },
            { key: 'trade', header: 'Trade', cell: (row) => textCell(row.values.trade), csv: (row) => row.values.trade },
            { key: 'project', header: 'Project', cell: (row) => textCell(row.values.project), csv: (row) => row.values.project },
            { key: 'marked', header: 'Marked days', align: 'right', cell: (row) => numberCell(row.values.marked), csv: (row) => row.values.marked },
            { key: 'present', header: 'Present', align: 'right', cell: (row) => numberCell(row.values.present), csv: (row) => row.values.present },
            { key: 'half', header: 'Half Day', align: 'right', cell: (row) => numberCell(row.values.half), csv: (row) => row.values.half },
            { key: 'absent', header: 'Absent', align: 'right', cell: (row) => numberCell(row.values.absent), csv: (row) => row.values.absent },
            { key: 'leave', header: 'Leave', align: 'right', cell: (row) => numberCell(row.values.leave), csv: (row) => row.values.leave },
            { key: 'overtime', header: 'Overtime (hr)', align: 'right', cell: (row) => numberCell(row.values.overtime), csv: (row) => row.values.overtime },
            {
              key: 'rate',
              header: 'Attendance %',
              align: 'right',
              cell: (row) => (
                <div className="flex w-28 items-center gap-2">
                  <ProgressBar
                    value={Number(row.values.rate)}
                    tone={Number(row.values.rate) >= 85 ? 'emerald' : Number(row.values.rate) >= 70 ? 'amber' : 'rose'}
                    size="xs"
                    label={`${String(row.values.worker)} attendance`}
                  />
                  <span className="w-10 shrink-0 text-right text-xs tabular-nums">{formatPercent(Number(row.values.rate), 0)}</span>
                </div>
              ),
              csv: (row) => row.values.rate,
            },
          ],
          rows,
          summary: [
            { label: 'Workers', value: String(rows.length), tone: 'indigo' },
            { label: 'Records', value: String(filteredAttendance.length), tone: 'sky' },
            { label: 'Present days', value: String(sumBy(rows, (row) => Number(row.values.present) || 0)), tone: 'emerald' },
            { label: 'Absent days', value: String(sumBy(rows, (row) => Number(row.values.absent) || 0)), tone: 'rose' },
          ],
          chart:
            totals.length > 0 ? (
              <ChartCard
                title="Attendance Distribution"
                description="All records in the selected range"
                height={240}
                legend={<ChartLegend items={totals.map((item) => ({ label: item.name, color: item.color, value: String(item.value) }))} />}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={totals} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={2} stroke="none">
                      {totals.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<ChartTooltip valueFormatter={(value) => `${value} records`} />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            ) : undefined,
          minWidth: 'min-w-[1080px]',
          emptyTitle: 'No attendance data',
          emptyDescription: 'Adjust the date range, project or worker filter.',
        };
      }

      case 'work':
      default: {
        const rows: ReportRow[] = filteredWorkEntries
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
          .map((entry) => ({
            id: entry.id,
            values: {
              date: entry.date,
              worker: getWorkerName(analytics, entry.workerId),
              project: getProjectName(analytics, entry.projectId),
              task: entry.task,
              quantity: entry.quantity,
              unit: getWorkUnitLabel(entry.unit, entry.customUnit),
            },
          }));
        const unitTotals = new Map<string, number>();
        for (const row of rows) unitTotals.set(String(row.values.unit), (unitTotals.get(String(row.values.unit)) ?? 0) + Number(row.values.quantity));
        const topUnits = Array.from(unitTotals.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
        return {
          columns: [
            { key: 'date', header: 'Date', cell: (row) => <span className="whitespace-nowrap">{formatDate(String(row.values.date))}</span>, csv: (row) => row.values.date },
            { key: 'worker', header: 'Worker', cell: (row) => <span className="font-medium text-slate-900">{textCell(row.values.worker)}</span>, csv: (row) => row.values.worker },
            { key: 'project', header: 'Project', cell: (row) => textCell(row.values.project), csv: (row) => row.values.project },
            { key: 'task', header: 'Task', cell: (row) => <span className="line-clamp-2 max-w-[320px]">{textCell(row.values.task)}</span>, csv: (row) => row.values.task },
            {
              key: 'quantity',
              header: 'Quantity',
              align: 'right',
              cell: (row) => <span className="font-semibold tabular-nums">{formatNumber(Number(row.values.quantity))}</span>,
              csv: (row) => row.values.quantity,
            },
            { key: 'unit', header: 'Unit', cell: (row) => <Badge tone="neutral">{String(row.values.unit)}</Badge>, csv: (row) => row.values.unit },
          ],
          rows,
          summary: [
            { label: 'Entries', value: String(rows.length), tone: 'indigo' },
            { label: 'Workers', value: String(new Set(rows.map((row) => row.values.worker)).size), tone: 'sky' },
            ...topUnits.map<ReportSummaryItem>(([unit, quantity]) => ({ label: `Total ${unit}`, value: formatNumber(quantity), tone: 'emerald' })),
          ].slice(0, 5),
          minWidth: 'min-w-[860px]',
          emptyTitle: 'No work entries',
          emptyDescription: 'Adjust the date range, project or worker filter.',
        };
      }
    }
  }, [
    reportType,
    filteredWorkers,
    filteredProjects,
    filteredMaterials,
    filteredExpenses,
    filteredTransactions,
    filteredWorkEntries,
    filteredAttendance,
    rangeWorkerStats,
    rangeLedgerStats,
    analytics,
    data.attendance,
  ]);

  const activeFilters = countActive(dateFrom, dateTo, projectId, workerId, category);

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setProjectId('');
    setWorkerId('');
    setCategory('');
  };

  const handleExport = () => {
    if (report.rows.length === 0) {
      toast.warning('Nothing to export', 'This report has no rows for the selected filters.');
      return;
    }
    void run(
      'report-export',
      () => {
        const ok = downloadCsv(
          buildExportFilename(definition?.title ?? 'report', today),
          report.columns.map((column) => column.header),
          report.rows.map((row) => report.columns.map((column) => column.csv(row))),
        );
        if (ok) toast.success('Export completed', `${report.rows.length} rows exported from ${definition?.title ?? 'the report'}.`);
        else toast.error('Export failed', 'Your browser blocked the download.');
      },
      700,
    );
  };

  const handlePrint = () => {
    void run(
      'report-print',
      () => {
        if (typeof window !== 'undefined') window.print();
      },
      350,
    );
  };

  const loading = !ready || switching;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card padding="sm" data-animate className="erp-print-hidden">
        <div className="erp-scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1 lg:grid lg:grid-cols-4 lg:gap-2.5 lg:overflow-visible xl:grid-cols-5">
          {REPORT_DEFINITIONS.map((item) => {
            const Icon = item.icon;
            const active = item.key === reportType;
            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={active}
                onClick={() => changeReport(item.key)}
                className={cn(
                  'flex w-[190px] shrink-0 items-start gap-2.5 rounded-xl border p-2.5 text-left transition-[border-color,background-color,box-shadow] lg:w-auto',
                  FOCUS_RING,
                  active ? 'border-indigo-300 bg-indigo-50/70 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                )}
              >
                <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset', active ? ICON_TONES.indigo : ICON_TONES.slate)}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className={cn('block truncate text-[13px] font-semibold', active ? 'text-indigo-900' : 'text-slate-900')}>{item.title}</span>
                  <span className="block truncate text-[11px] text-slate-500">{item.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card padding="sm" data-animate className="erp-print-hidden">
        <FilterBar
          activeCount={activeFilters}
          onReset={resetFilters}
          trailing={
            <>
              <Button variant="outline" size="sm" icon={Printer} loading={isPending('report-print')} onClick={handlePrint}>
                Print
              </Button>
              <Button size="sm" icon={Download} loading={isPending('report-export')} loadingText="Exporting…" onClick={handleExport}>
                Export CSV
              </Button>
            </>
          }
        >
          <DateRangeFilter from={dateFrom} to={dateTo} onFromChange={setDateFrom} onToChange={setDateTo} max={today} />
          <FilterSelect label="Project" value={projectId} onChange={setProjectId} options={buildProjectOptions(data.projects)} allLabel="All projects" icon={Building2} />
          {usesWorkerFilter && (
            <FilterSelect label="Worker" value={workerId} onChange={setWorkerId} options={buildWorkerOptions(data.workers)} allLabel="All workers" icon={HardHat} />
          )}
          {usesCategoryFilter && (
            <FilterSelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={reportType === 'material' ? toSelectOptions(MATERIAL_CATEGORIES) : toSelectOptions(EXPENSE_CATEGORIES)}
              allLabel="All categories"
              icon={Layers}
            />
          )}
        </FilterBar>
      </Card>

      <div className="erp-print-only mb-4">
        <h1 className="text-lg font-semibold text-slate-900">
          {data.settings.companyName} · {definition?.title}
        </h1>
        <p className="text-xs text-slate-600">
          {dateFrom || dateTo ? `${formatDate(range.start)} – ${formatDate(range.end)}` : 'All dates'}
          {projectId ? ` · ${getProjectName(analytics, projectId)}` : ''}
          {workerId ? ` · ${getWorkerName(analytics, workerId)}` : ''}
        </p>
      </div>

      {loading ? (
        <>
          <KpiGridSkeleton count={4} />
          <Card padding="none">
            <ProgressLoader label="Preparing report" description={definition?.title} />
          </Card>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {report.summary.map((item) => (
              <MiniStat key={item.label} label={item.label} value={item.value} tone={item.tone ?? 'slate'} hint={item.hint} className="erp-print-card" />
            ))}
          </div>

          {report.chart}

          <TableCard
            title={definition?.title}
            description={`${report.rows.length} row${report.rows.length === 1 ? '' : 's'} · ${definition?.description ?? ''}`}
          >
            <DataTable
              columns={report.columns.map<TableColumn<ReportRow>>((column) => ({
                key: column.key,
                header: column.header,
                align: column.align,
                render: (row) => column.cell(row),
              }))}
              rows={report.rows}
              getRowKey={(row) => row.id}
              caption={definition?.title}
              minWidthClassName={report.minWidth ?? 'min-w-[900px]'}
              maxHeightClassName="max-h-[70vh]"
              dense
              emptyState={
                <EmptyState
                  icon={FileText}
                  title={report.emptyTitle}
                  description={report.emptyDescription}
                  secondaryAction={activeFilters > 0 ? { label: 'Reset filters', icon: RotateCcw, onClick: resetFilters } : undefined}
                  action={{ label: 'Go to Dashboard', icon: LayoutDashboard, onClick: () => navigate('dashboard') }}
                />
              }
              renderMobileCard={(row) => {
                const [first, second, ...rest] = report.columns;
                return (
                  <MobileRecordCard
                    title={first ? first.cell(row) : row.id}
                    subtitle={second ? second.cell(row) : undefined}
                    fields={rest.slice(0, 6).map((column) => ({ label: column.header, value: column.cell(row) }))}
                  />
                );
              }}
            />
          </TableCard>
        </>
      )}
    </div>
  );
}

/* ========================================================= */
/* Settings Section                                          */
/* ========================================================= */

type SettingsField = 'companyName' | 'ownerName' | 'city' | 'standardHours' | 'overtimeMultiplier';

function SettingsSection() {
  const { data, ready, updateSettings, resetData } = useErp();
  const toast = useToast();
  const formId = useId();
  const [form, setForm] = useState<AppSettings>(data.settings);
  const [errors, setErrors] = useState<FormErrors<SettingsField>>({});
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    setForm(data.settings);
  }, [data.settings]);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const nextErrors: FormErrors<SettingsField> = {};
    const companyName = sanitizeText(form.companyName, 80);
    const ownerName = sanitizeText(form.ownerName, 80);
    const city = sanitizeText(form.city, 80);
    if (!companyName) nextErrors.companyName = 'Company name is required.';
    if (!ownerName) nextErrors.ownerName = 'Owner name is required.';
    if (!Number.isFinite(form.standardHours) || form.standardHours < 1 || form.standardHours > 24) {
      nextErrors.standardHours = 'Standard hours must be between 1 and 24.';
    }
    if (!Number.isFinite(form.overtimeMultiplier) || form.overtimeMultiplier < 1 || form.overtimeMultiplier > 5) {
      nextErrors.overtimeMultiplier = 'Overtime multiplier must be between 1 and 5.';
    }
    setErrors(nextErrors);
    if (hasFormErrors(nextErrors)) {
      toast.error('Settings not saved', 'Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    await wait(550);
    updateSettings({
      ...form,
      companyName,
      ownerName,
      city,
      standardHours: roundTo(form.standardHours, 2),
      overtimeMultiplier: roundTo(form.overtimeMultiplier, 2),
    });
    setSaving(false);
    toast.success('Settings saved', 'Wage calculations have been updated across the app.');
  };

  const sampleWage = 900;
  const hourlyRate = safeDivide(sampleWage, form.standardHours);
  const overtimeRate = hourlyRate * form.overtimeMultiplier;

  if (!ready) {
    return (
      <div className="space-y-4">
        <Card>
          <ListSkeleton rows={4} />
        </Card>
        <Card>
          <ListSkeleton rows={3} />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <form id={formId} onSubmit={(event) => void handleSubmit(event)} className="space-y-4 sm:space-y-6" noValidate>
        {hasFormErrors(errors) && <FormErrorSummary errors={errors} />}

        <Card data-animate>
          <CardHeader title="Company Profile" description="Shown in the sidebar, header and printed reports" icon={Building2} iconTone="indigo" />
          <div className="mt-5 grid gap-3.5 sm:grid-cols-2 sm:gap-4">
            <InputField
              label="Company name"
              required
              value={form.companyName}
              maxLength={80}
              onChange={(event) => update('companyName', event.target.value)}
              error={errors.companyName}
            />
            <InputField
              label="Owner name"
              required
              value={form.ownerName}
              maxLength={80}
              onChange={(event) => update('ownerName', event.target.value)}
              error={errors.ownerName}
            />
            <InputField label="City" value={form.city} maxLength={80} icon={MapPin} onChange={(event) => update('city', event.target.value)} hint="Head office location" />
          </div>
        </Card>

        <Card data-animate>
          <CardHeader title="Labour & Wage Rules" description="Used whenever attendance wages are calculated" icon={HardHat} iconTone="amber" />
          <div className="mt-5 grid gap-3.5 sm:grid-cols-2 sm:gap-4">
            <InputField
              label="Standard hours per day"
              type="number"
              min={1}
              max={24}
              step={0.5}
              required
              value={String(form.standardHours)}
              onChange={(event) => update('standardHours', Number(event.target.value))}
              error={errors.standardHours}
              trailingText="hours"
            />
            <InputField
              label="Overtime multiplier"
              type="number"
              min={1}
              max={5}
              step={0.1}
              required
              value={String(form.overtimeMultiplier)}
              onChange={(event) => update('overtimeMultiplier', Number(event.target.value))}
              error={errors.overtimeMultiplier}
              trailingText="×"
            />
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3.5">
            <p className="text-[13px] font-medium text-slate-800">Overtime rate = daily wage ÷ standard hours × multiplier</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              For a worker on {formatINR(sampleWage)} per day, one hour of overtime is {formatINR(hourlyRate)} ÷ hour × {formatNumber(form.overtimeMultiplier)} ={' '}
              <span className="font-semibold text-slate-900">{formatINR(overtimeRate)}</span>. Half days are paid at 50% of the daily wage; absent and leave days are unpaid.
            </p>
          </div>
        </Card>

        <Card data-animate>
          <CardHeader title="Data & Demo" description="This prototype stores everything in your browser" icon={Settings} iconTone="slate" />
          <div className="mt-5 space-y-5">
            <ToggleSwitch
              checked={form.lowStockAlerts}
              onChange={(checked) => update('lowStockAlerts', checked)}
              label="Low stock alerts"
              description="Create a notification when a material drops to or below its minimum level."
            />
            <div className="h-px bg-slate-100" />
            <ToggleSwitch
              checked={form.persistData}
              onChange={(checked) => update('persistData', checked)}
              label="Save changes in this browser"
              description="Keeps your demo edits after a refresh. Turning this off clears the saved copy."
            />
          </div>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => setForm(data.settings)} disabled={saving}>
            Discard changes
          </Button>
          <Button type="submit" loading={saving} loadingText="Saving…" icon={CheckCircle2}>
            Save Settings
          </Button>
        </div>
      </form>

      <Card data-animate className="border-rose-200 bg-rose-50/40">
        <CardHeader title="Reset demo data" description="Replaces everything with the original sample company" icon={RotateCcw} iconTone="rose" />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[13px] leading-5 text-slate-600">
            Every worker, project, attendance record, transaction, material and expense you have added or edited will be removed and the original demo data will be
            recreated using today's date.
          </p>
          <Button variant="danger" icon={RotateCcw} onClick={() => setResetOpen(true)} className="shrink-0">
            Reset Demo Data
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={resetOpen}
        title="Reset all demo data?"
        description="This cannot be undone."
        confirmLabel="Reset data"
        tone="danger"
        icon={RotateCcw}
        onClose={() => setResetOpen(false)}
        onConfirm={async () => {
          await wait(700);
          resetData();
          setResetOpen(false);
          toast.success('Demo data reset', 'The sample company has been restored.');
        }}
      >
        <ul className="space-y-2 text-[13px] text-slate-600">
          <li className="flex gap-2">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
            All your changes will be permanently removed.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
            Fresh demo workers, projects, attendance and stock will be created.
          </li>
        </ul>
      </ConfirmDialog>
    </div>
  );
}

/* ========================================================= */
/* Form Modals                                               */
/* ========================================================= */

type WorkerFormField = 'name' | 'phone' | 'trade' | 'joiningDate' | 'dailyWage';

function WorkerFormModal({ open, record, onClose }: { open: boolean; record: Worker | null; onClose: () => void }) {
  const { data, today, saveWorker } = useErp();
  const toast = useToast();
  const formId = useId();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [trade, setTrade] = useState<Trade>('Mason');
  const [projectId, setProjectId] = useState('');
  const [joiningDate, setJoiningDate] = useState(today);
  const [dailyWage, setDailyWage] = useState('');
  const [status, setStatus] = useState<WorkerStatus>('Active');
  const [errors, setErrors] = useState<FormErrors<WorkerFormField>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(record?.name ?? '');
    setPhone(record?.phone ?? '');
    setTrade(record?.trade ?? 'Mason');
    setProjectId(record?.projectId ?? '');
    setJoiningDate(record?.joiningDate ?? today);
    setDailyWage(record ? String(record.dailyWage) : '');
    setStatus(record?.status ?? 'Active');
    setErrors({});
  }, [open, record, today]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const nextErrors: FormErrors<WorkerFormField> = {};
    const cleanName = sanitizeText(name, 60);
    const cleanPhone = normalizePhone(phone);
    const wage = parsePositiveNumber(dailyWage);
    if (!cleanName) nextErrors.name = 'Worker name is required.';
    if (!isValidIndianPhone(cleanPhone)) nextErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!isValidISODate(joiningDate)) nextErrors.joiningDate = 'Choose a valid joining date.';
    if (wage === null) nextErrors.dailyWage = 'Daily wage must be greater than 0.';
    else if (wage > 100000) nextErrors.dailyWage = 'Daily wage looks too high. Check the amount.';
    setErrors(nextErrors);
    if (hasFormErrors(nextErrors) || wage === null) {
      toast.error('Worker not saved', 'Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    await wait(550);
    const saved = saveWorker({
      id: record?.id,
      name: cleanName,
      phone: cleanPhone,
      trade,
      projectId,
      joiningDate,
      dailyWage: Math.round(wage),
      status,
    });
    setSaving(false);
    toast.success(record ? 'Worker updated' : 'Worker added', `${saved.name} · ${saved.trade}`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={saving}
      variant="drawer"
      size="md"
      title={record ? 'Edit worker' : 'Add worker'}
      description={record ? `${record.id} · update details and wage` : 'Add a mason, helper, supervisor or any other site worker'}
      icon={record ? Pencil : UserPlus}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={saving} loadingText="Saving…">
            {record ? 'Save changes' : 'Add worker'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={(event) => void handleSubmit(event)} className="space-y-6" noValidate>
        {hasFormErrors(errors) && <FormErrorSummary errors={errors} />}
        <FormSection title="Worker details">
          <InputField label="Full name" required value={name} maxLength={60} onChange={(event) => setName(event.target.value)} error={errors.name} placeholder="Ramesh Kumar" containerClassName="sm:col-span-2" />
          <InputField label="Mobile number" required type="tel" value={phone} maxLength={15} icon={Phone} onChange={(event) => setPhone(event.target.value)} error={errors.phone} placeholder="98765 43210" />
          <SelectField label="Trade" required value={trade} options={toSelectOptions(TRADES)} onChange={(event) => setTrade(event.target.value as Trade)} icon={Hammer} />
        </FormSection>
        <FormSection title="Assignment & wage">
          <SelectField
            label="Project"
            value={projectId}
            placeholder="Not assigned"
            options={buildProjectOptions(data.projects)}
            onChange={(event) => setProjectId(event.target.value)}
            icon={Building2}
            hint="Attendance can only be marked for assigned workers."
          />
          <InputField label="Joining date" required type="date" value={joiningDate} max={today} onChange={(event) => setJoiningDate(event.target.value)} error={errors.joiningDate} />
          <InputField
            label="Daily wage"
            required
            type="number"
            min={1}
            step={10}
            value={dailyWage}
            leadingText="₹"
            onChange={(event) => setDailyWage(event.target.value)}
            error={errors.dailyWage}
            hint="Used for attendance wages and overtime."
          />
          <SelectField
            label="Status"
            required
            value={status}
            options={toSelectOptions<WorkerStatus>(['Active', 'Inactive'])}
            onChange={(event) => setStatus(event.target.value as WorkerStatus)}
            hint="Inactive workers stay in reports and ledgers."
          />
        </FormSection>
      </form>
    </Modal>
  );
}

type ProjectFormField =
  | 'name'
  | 'location'
  | 'clientName'
  | 'clientPhone'
  | 'clientEmail'
  | 'startDate'
  | 'expectedCompletion'
  | 'projectValue'
  | 'estimatedCost'
  | 'labourBudget'
  | 'materialBudget'
  | 'otherBudget'
  | 'priorLabourCost'
  | 'priorMaterialCost'
  | 'priorOtherCost'
  | 'workTarget'
  | 'priorCompletedWork';

interface ProjectFormState {
  name: string;
  stage: ProjectStage;
  location: string;
  address: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  referenceSource: string;
  engineerName: string;
  architectName: string;
  startDate: string;
  expectedCompletion: string;
  projectValue: string;
  estimatedCost: string;
  labourBudget: string;
  materialBudget: string;
  otherBudget: string;
  priorLabourCost: string;
  priorMaterialCost: string;
  priorOtherCost: string;
  workTarget: string;
  priorCompletedWork: string;
}

function createProjectFormState(record: Project | null, today: string): ProjectFormState {
  return {
    name: record?.name ?? '',
    stage: record?.stage ?? 'Enquiry',
    location: record?.location ?? '',
    address: record?.address ?? '',
    clientName: record?.clientName ?? '',
    clientPhone: record?.clientPhone ?? '',
    clientEmail: record?.clientEmail ?? '',
    referenceSource: record?.referenceSource ?? '',
    engineerName: record?.engineerName ?? '',
    architectName: record?.architectName ?? '',
    startDate: record?.startDate ?? today,
    expectedCompletion: record?.expectedCompletion ?? addDays(today, 180),
    projectValue: record ? String(record.projectValue) : '',
    estimatedCost: record ? String(record.estimatedCost) : '',
    labourBudget: record ? String(record.labourBudget) : '',
    materialBudget: record ? String(record.materialBudget) : '',
    otherBudget: record ? String(record.otherBudget) : '',
    priorLabourCost: record ? String(record.priorLabourCost) : '0',
    priorMaterialCost: record ? String(record.priorMaterialCost) : '0',
    priorOtherCost: record ? String(record.priorOtherCost) : '0',
    workTarget: record ? String(record.workTarget) : '',
    priorCompletedWork: record ? String(record.priorCompletedWork) : '0',
  };
}

function ProjectFormModal({ open, record, onClose }: { open: boolean; record: Project | null; onClose: () => void }) {
  const { today, saveProject } = useErp();
  const toast = useToast();
  const formId = useId();
  const [form, setForm] = useState<ProjectFormState>(() => createProjectFormState(null, today));
  const [errors, setErrors] = useState<FormErrors<ProjectFormField>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(createProjectFormState(record, today));
    setErrors({});
  }, [open, record, today]);

  const update = <K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const budgetTotal =
    (parseNonNegativeNumber(form.labourBudget) ?? 0) + (parseNonNegativeNumber(form.materialBudget) ?? 0) + (parseNonNegativeNumber(form.otherBudget) ?? 0);
  const estimated = parseNonNegativeNumber(form.estimatedCost) ?? 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const nextErrors: FormErrors<ProjectFormField> = {};
    const name = sanitizeText(form.name, 80);
    const location = sanitizeText(form.location, 60);
    const clientName = sanitizeText(form.clientName, 80);
    const clientPhone = form.clientPhone.trim() ? normalizePhone(form.clientPhone) : '';
    const clientEmail = sanitizeText(form.clientEmail, 90);

    if (!name) nextErrors.name = 'Project name is required.';
    if (!location) nextErrors.location = 'Location is required.';
    if (!clientName) nextErrors.clientName = 'Client or owner name is required.';
    if (clientPhone && !isValidIndianPhone(clientPhone)) nextErrors.clientPhone = 'Enter a valid 10-digit mobile number.';
    if (clientEmail && !isValidEmail(clientEmail)) nextErrors.clientEmail = 'Enter a valid email address.';
    if (!isValidISODate(form.startDate)) nextErrors.startDate = 'Choose a valid start date.';
    if (!isValidISODate(form.expectedCompletion)) nextErrors.expectedCompletion = 'Choose a valid completion date.';
    else if (isValidISODate(form.startDate) && form.expectedCompletion < form.startDate) {
      nextErrors.expectedCompletion = 'Completion date cannot be before the start date.';
    }

    const numericFields: Array<[ProjectFormField, string, boolean]> = [
      ['projectValue', form.projectValue, true],
      ['estimatedCost', form.estimatedCost, true],
      ['labourBudget', form.labourBudget, false],
      ['materialBudget', form.materialBudget, false],
      ['otherBudget', form.otherBudget, false],
      ['priorLabourCost', form.priorLabourCost, false],
      ['priorMaterialCost', form.priorMaterialCost, false],
      ['priorOtherCost', form.priorOtherCost, false],
      ['priorCompletedWork', form.priorCompletedWork, false],
    ];
    const numbers: Partial<Record<ProjectFormField, number>> = {};
    for (const [field, value, mustBePositive] of numericFields) {
      const parsed = mustBePositive ? parsePositiveNumber(value) : parseNonNegativeNumber(value === '' ? '0' : value);
      if (parsed === null) nextErrors[field] = mustBePositive ? 'Enter an amount greater than 0.' : 'Enter 0 or a positive amount.';
      else numbers[field] = parsed;
    }
    const workTarget = parsePositiveNumber(form.workTarget);
    if (workTarget === null) nextErrors.workTarget = 'Work target must be greater than 0.';
    else if ((numbers.priorCompletedWork ?? 0) > workTarget) nextErrors.priorCompletedWork = 'Completed work cannot exceed the work target.';

    setErrors(nextErrors);
    if (hasFormErrors(nextErrors) || workTarget === null) {
      toast.error('Project not saved', 'Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    await wait(600);
    const saved = saveProject({
      id: record?.id,
      name,
      stage: form.stage,
      location,
      address: sanitizeMultiline(form.address, 240),
      clientName,
      clientPhone,
      clientEmail,
      referenceSource: sanitizeText(form.referenceSource, 80),
      engineerName: sanitizeText(form.engineerName, 80),
      architectName: sanitizeText(form.architectName, 80),
      startDate: form.startDate,
      expectedCompletion: form.expectedCompletion,
      projectValue: Math.round(numbers.projectValue ?? 0),
      estimatedCost: Math.round(numbers.estimatedCost ?? 0),
      labourBudget: Math.round(numbers.labourBudget ?? 0),
      materialBudget: Math.round(numbers.materialBudget ?? 0),
      otherBudget: Math.round(numbers.otherBudget ?? 0),
      priorLabourCost: Math.round(numbers.priorLabourCost ?? 0),
      priorMaterialCost: Math.round(numbers.priorMaterialCost ?? 0),
      priorOtherCost: Math.round(numbers.priorOtherCost ?? 0),
      workTarget: roundTo(workTarget, 2),
      priorCompletedWork: roundTo(numbers.priorCompletedWork ?? 0, 2),
    });
    setSaving(false);
    toast.success(record ? 'Project updated' : 'Project created', `${saved.name} · ${saved.stage}`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={saving}
      size="xl"
      mobileFullScreen
      title={record ? 'Edit project' : 'Add project'}
      description={record ? `${record.id} · update details, budgets and targets` : 'Create an enquiry or a running site'}
      icon={record ? Pencil : Building2}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={saving} loadingText="Saving…">
            {record ? 'Save changes' : 'Create project'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={(event) => void handleSubmit(event)} className="space-y-6" noValidate>
        {hasFormErrors(errors) && <FormErrorSummary errors={errors} />}

        <FormSection title="Basic details">
          <InputField label="Project name" required value={form.name} maxLength={80} onChange={(event) => update('name', event.target.value)} error={errors.name} placeholder="Green Residency" />
          <SelectField label="Stage" required value={form.stage} options={toSelectOptions(PROJECT_STAGES)} onChange={(event) => update('stage', event.target.value as ProjectStage)} />
          <InputField label="Location / city" required value={form.location} maxLength={60} icon={MapPin} onChange={(event) => update('location', event.target.value)} error={errors.location} placeholder="Jaipur" />
          <TextAreaField label="Full address" rows={2} maxLength={240} showCount value={form.address} onChange={(event) => update('address', event.target.value)} containerClassName="sm:col-span-2" />
        </FormSection>

        <FormSection title="Client / owner">
          <InputField label="Client name" required value={form.clientName} maxLength={80} onChange={(event) => update('clientName', event.target.value)} error={errors.clientName} />
          <InputField label="Mobile number" type="tel" value={form.clientPhone} maxLength={15} icon={Phone} onChange={(event) => update('clientPhone', event.target.value)} error={errors.clientPhone} />
          <InputField label="Email" type="email" value={form.clientEmail} maxLength={90} icon={Mail} onChange={(event) => update('clientEmail', event.target.value)} error={errors.clientEmail} />
          <InputField label="Reference / source" value={form.referenceSource} maxLength={80} onChange={(event) => update('referenceSource', event.target.value)} placeholder="Architect referral" />
        </FormSection>

        <FormSection title="Site team">
          <InputField label="Engineer" value={form.engineerName} maxLength={80} icon={HardHat} onChange={(event) => update('engineerName', event.target.value)} />
          <InputField label="Architect" value={form.architectName} maxLength={80} icon={Layers} onChange={(event) => update('architectName', event.target.value)} />
        </FormSection>

        <FormSection title="Timeline">
          <InputField label="Start date" required type="date" value={form.startDate} onChange={(event) => update('startDate', event.target.value)} error={errors.startDate} />
          <InputField
            label="Expected completion"
            required
            type="date"
            value={form.expectedCompletion}
            onChange={(event) => update('expectedCompletion', event.target.value)}
            error={errors.expectedCompletion}
          />
        </FormSection>

        <FormSection title="Financials" description="Budgets drive the utilisation bars across the app">
          <InputField label="Project value" required type="number" min={1} step={1000} leadingText="₹" value={form.projectValue} onChange={(event) => update('projectValue', event.target.value)} error={errors.projectValue} />
          <InputField label="Estimated cost" required type="number" min={1} step={1000} leadingText="₹" value={form.estimatedCost} onChange={(event) => update('estimatedCost', event.target.value)} error={errors.estimatedCost} />
          <InputField label="Labour budget" type="number" min={0} step={1000} leadingText="₹" value={form.labourBudget} onChange={(event) => update('labourBudget', event.target.value)} error={errors.labourBudget} />
          <InputField label="Material budget" type="number" min={0} step={1000} leadingText="₹" value={form.materialBudget} onChange={(event) => update('materialBudget', event.target.value)} error={errors.materialBudget} />
          <InputField label="Other budget" type="number" min={0} step={1000} leadingText="₹" value={form.otherBudget} onChange={(event) => update('otherBudget', event.target.value)} error={errors.otherBudget} />
          {budgetTotal > 0 && estimated > 0 && (
            <div className="flex items-end sm:col-span-1">
              <p className={cn('w-full rounded-lg px-3 py-2 text-xs font-medium', budgetTotal > estimated ? 'bg-amber-50 text-amber-800' : 'bg-slate-50 text-slate-600')}>
                Head budgets total {formatINRCompact(budgetTotal)}
                {budgetTotal > estimated ? ` · ${formatINRCompact(budgetTotal - estimated)} above the estimate` : ''}
              </p>
            </div>
          )}
        </FormSection>

        <FormSection
          title="Opening balances"
          description="Costs and work completed before this system started tracking the site"
          columns={3}
        >
          <InputField label="Prior labour cost" type="number" min={0} step={1000} leadingText="₹" value={form.priorLabourCost} onChange={(event) => update('priorLabourCost', event.target.value)} error={errors.priorLabourCost} />
          <InputField label="Prior material cost" type="number" min={0} step={1000} leadingText="₹" value={form.priorMaterialCost} onChange={(event) => update('priorMaterialCost', event.target.value)} error={errors.priorMaterialCost} />
          <InputField label="Prior other cost" type="number" min={0} step={1000} leadingText="₹" value={form.priorOtherCost} onChange={(event) => update('priorOtherCost', event.target.value)} error={errors.priorOtherCost} />
        </FormSection>

        <FormSection title="Work target">
          <InputField label="Total work target" required type="number" min={1} step={10} trailingText="sq.ft." value={form.workTarget} onChange={(event) => update('workTarget', event.target.value)} error={errors.workTarget} />
          <InputField
            label="Work completed earlier"
            type="number"
            min={0}
            step={10}
            trailingText="sq.ft."
            value={form.priorCompletedWork}
            onChange={(event) => update('priorCompletedWork', event.target.value)}
            error={errors.priorCompletedWork}
            hint="New work entries are added on top of this."
          />
        </FormSection>
      </form>
    </Modal>
  );
}

type WorkEntryFormField = 'date' | 'workerId' | 'projectId' | 'task' | 'quantity' | 'customUnit';

function WorkEntryFormModal({
  open,
  record,
  defaults,
  onClose,
}: {
  open: boolean;
  record: WorkEntry | null;
  defaults?: Partial<WorkEntry>;
  onClose: () => void;
}) {
  const { data, analytics, today, selectedDate, saveWorkEntry } = useErp();
  const toast = useToast();
  const formId = useId();
  const [date, setDate] = useState(today);
  const [workerId, setWorkerId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [task, setTask] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<WorkUnit>('sq.ft.');
  const [customUnit, setCustomUnit] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors<WorkEntryFormField>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const initialDate = record?.date ?? defaults?.date ?? (selectedDate > today ? today : selectedDate);
    setDate(initialDate);
    setWorkerId(record?.workerId ?? defaults?.workerId ?? '');
    setProjectId(record?.projectId ?? defaults?.projectId ?? '');
    setTask(record?.task ?? '');
    setQuantity(record ? String(record.quantity) : '');
    setUnit(record?.unit ?? 'sq.ft.');
    setCustomUnit(record?.customUnit ?? '');
    setNotes(record?.notes ?? '');
    setErrors({});
  }, [open, record, defaults, today, selectedDate]);

  const handleWorkerChange = (nextWorkerId: string) => {
    setWorkerId(nextWorkerId);
    const worker = analytics.workersById[nextWorkerId];
    // Default the site to the worker's assignment, but the user can still pick another.
    if (worker?.projectId && !projectId) setProjectId(worker.projectId);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const nextErrors: FormErrors<WorkEntryFormField> = {};
    const cleanTask = sanitizeText(task, 120);
    const cleanCustomUnit = sanitizeText(customUnit, 20);
    const amount = parsePositiveNumber(quantity);
    if (!isValidISODate(date)) nextErrors.date = 'Choose a valid date.';
    else if (date > today) nextErrors.date = 'Work cannot be recorded for a future date.';
    if (!workerId) nextErrors.workerId = 'Select a worker.';
    if (!projectId) nextErrors.projectId = 'Select a project.';
    if (!cleanTask) nextErrors.task = 'Describe the work done.';
    if (amount === null) nextErrors.quantity = 'Quantity must be greater than 0.';
    if (unit === 'custom' && !cleanCustomUnit) nextErrors.customUnit = 'Enter the unit name.';
    setErrors(nextErrors);
    if (hasFormErrors(nextErrors) || amount === null) {
      toast.error('Work entry not saved', 'Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    await wait(500);
    saveWorkEntry({
      id: record?.id,
      date,
      workerId,
      projectId,
      task: cleanTask,
      quantity: roundTo(amount, 2),
      unit,
      customUnit: unit === 'custom' ? cleanCustomUnit : '',
      notes: sanitizeMultiline(notes, 240),
    });
    setSaving(false);
    toast.success(record ? 'Work entry updated' : 'Work entry added', `${formatQuantity(amount, getWorkUnitLabel(unit, cleanCustomUnit))} · ${getWorkerName(analytics, workerId)}`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={saving}
      size="md"
      title={record ? 'Edit work entry' : 'Add work entry'}
      description="Measured work drives productivity and project progress"
      icon={ClipboardList}
      iconTone="sky"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={saving} loadingText="Saving…">
            {record ? 'Save changes' : 'Add entry'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={(event) => void handleSubmit(event)} className="space-y-6" noValidate>
        {hasFormErrors(errors) && <FormErrorSummary errors={errors} />}
        <FormSection title="Work details">
          <InputField label="Date" required type="date" value={date} max={today} onChange={(event) => setDate(event.target.value)} error={errors.date} />
          <SelectField label="Worker" required value={workerId} placeholder="Select worker" options={buildWorkerOptions(data.workers)} onChange={(event) => handleWorkerChange(event.target.value)} error={errors.workerId} icon={HardHat} />
          <SelectField label="Project" required value={projectId} placeholder="Select project" options={buildProjectOptions(data.projects)} onChange={(event) => setProjectId(event.target.value)} error={errors.projectId} icon={Building2} containerClassName="sm:col-span-2" />
          <InputField
            label="Task / work type"
            required
            value={task}
            maxLength={120}
            onChange={(event) => setTask(event.target.value)}
            error={errors.task}
            placeholder="Floor tile installation – Tower A"
            containerClassName="sm:col-span-2"
          />
        </FormSection>
        <FormSection title="Measurement">
          <InputField label="Quantity" required type="number" min={0} step={0.5} value={quantity} onChange={(event) => setQuantity(event.target.value)} error={errors.quantity} />
          <SelectField label="Unit" required value={unit} options={toSelectOptions(WORK_UNITS)} onChange={(event) => setUnit(event.target.value as WorkUnit)} hint={unit === 'sq.ft.' ? 'sq.ft. entries count towards project progress.' : undefined} />
          {unit === 'custom' && (
            <InputField label="Custom unit" required value={customUnit} maxLength={20} onChange={(event) => setCustomUnit(event.target.value)} error={errors.customUnit} placeholder="bundles" />
          )}
          <TextAreaField label="Notes" rows={2} maxLength={240} showCount value={notes} onChange={(event) => setNotes(event.target.value)} containerClassName="sm:col-span-2" />
        </FormSection>
      </form>
    </Modal>
  );
}

type TransactionFormField = 'workerId' | 'date' | 'amount';

function TransactionFormModal({
  open,
  record,
  defaults,
  onClose,
}: {
  open: boolean;
  record: Transaction | null;
  defaults?: Partial<Transaction>;
  onClose: () => void;
}) {
  const { data, analytics, today, selectedDate, saveTransaction } = useErp();
  const toast = useToast();
  const formId = useId();
  const [workerId, setWorkerId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(today);
  const [type, setType] = useState<TransactionType>('Payment');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<PaymentMode>('Cash');
  const [direction, setDirection] = useState<TransactionDirection>('debit');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors<TransactionFormField>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const initialType = record?.type ?? defaults?.type ?? 'Payment';
    setWorkerId(record?.workerId ?? defaults?.workerId ?? '');
    setProjectId(record?.projectId ?? defaults?.projectId ?? '');
    setDate(record?.date ?? defaults?.date ?? (selectedDate > today ? today : selectedDate));
    setType(initialType);
    setAmount(record ? String(record.amount) : '');
    setMode(record?.mode ?? defaults?.mode ?? 'Cash');
    setDirection(record?.direction ?? defaults?.direction ?? TRANSACTION_DEFAULT_DIRECTION[initialType]);
    setNotes(record?.notes ?? '');
    setErrors({});
  }, [open, record, defaults, today, selectedDate]);

  const flexible = FLEXIBLE_DIRECTION_TYPES.has(type);

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    // Direction is fixed by the accounting rules unless the type is explicitly flexible.
    setDirection(TRANSACTION_DEFAULT_DIRECTION[nextType]);
  };

  const handleWorkerChange = (nextWorkerId: string) => {
    setWorkerId(nextWorkerId);
    const worker = analytics.workersById[nextWorkerId];
    if (worker?.projectId && !projectId) setProjectId(worker.projectId);
  };

  const addsProjectCost = direction === 'credit' && LABOUR_COST_TRANSACTION_TYPES.has(type);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const nextErrors: FormErrors<TransactionFormField> = {};
    const value = parsePositiveNumber(amount);
    if (!workerId) nextErrors.workerId = 'Select a person.';
    if (!isValidISODate(date)) nextErrors.date = 'Choose a valid date.';
    else if (date > today) nextErrors.date = 'Transactions cannot be dated in the future.';
    if (value === null) nextErrors.amount = 'Amount must be greater than 0.';
    setErrors(nextErrors);
    if (hasFormErrors(nextErrors) || value === null) {
      toast.error('Transaction not saved', 'Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    await wait(550);
    saveTransaction({
      id: record?.id,
      workerId,
      projectId,
      date,
      type,
      amount: Math.round(value),
      mode,
      direction: flexible ? direction : TRANSACTION_DEFAULT_DIRECTION[type],
      notes: sanitizeMultiline(notes, 240),
    });
    setSaving(false);
    toast.success(record ? 'Transaction updated' : 'Transaction recorded', `${type} · ${formatINR(value)} · ${getWorkerName(analytics, workerId)}`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={saving}
      size="md"
      title={record ? 'Edit transaction' : 'Add transaction'}
      description="Khata entries change what the company owes a person"
      icon={Wallet}
      iconTone="violet"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={saving} loadingText="Saving…">
            {record ? 'Save changes' : 'Record transaction'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={(event) => void handleSubmit(event)} className="space-y-6" noValidate>
        {hasFormErrors(errors) && <FormErrorSummary errors={errors} />}
        <FormSection title="Person & site">
          <SelectField label="Person" required value={workerId} placeholder="Select person" options={buildWorkerOptions(data.workers)} onChange={(event) => handleWorkerChange(event.target.value)} error={errors.workerId} icon={HardHat} />
          <SelectField label="Project" value={projectId} placeholder="Not linked to a site" options={buildProjectOptions(data.projects)} onChange={(event) => setProjectId(event.target.value)} icon={Building2} />
        </FormSection>

        <FormSection title="Transaction">
          <SelectField label="Type" required value={type} options={toSelectOptions(TRANSACTION_TYPES)} onChange={(event) => handleTypeChange(event.target.value as TransactionType)} containerClassName="sm:col-span-2" />
          <div className="sm:col-span-2 -mt-1">
            <p className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
              {LEDGER_TYPE_HINTS[type]}
            </p>
          </div>
          <InputField label="Amount" required type="number" min={1} step={100} leadingText="₹" value={amount} onChange={(event) => setAmount(event.target.value)} error={errors.amount} />
          <SelectField label="Payment mode" required value={mode} options={toSelectOptions(PAYMENT_MODES)} onChange={(event) => setMode(event.target.value as PaymentMode)} icon={Wallet} />
          {flexible ? (
            <SelectField
              label="Entry direction"
              required
              value={direction}
              options={[
                { value: 'credit', label: DIRECTION_LABELS.credit },
                { value: 'debit', label: DIRECTION_LABELS.debit },
              ]}
              onChange={(event) => setDirection(event.target.value as TransactionDirection)}
              containerClassName="sm:col-span-2"
              hint="This type can go either way, so choose how it affects the balance."
            />
          ) : (
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-[13px] font-medium text-slate-700">Entry direction</span>
              <div className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 sm:h-10">
                <DirectionBadge direction={TRANSACTION_DEFAULT_DIRECTION[type]} />
                <span className="truncate text-[13px] text-slate-600">{DIRECTION_LABELS[TRANSACTION_DEFAULT_DIRECTION[type]]}</span>
              </div>
              <p className="text-xs text-slate-500">Set automatically for this transaction type.</p>
            </div>
          )}
          <TextAreaField label="Notes" rows={2} maxLength={240} showCount value={notes} onChange={(event) => setNotes(event.target.value)} containerClassName="sm:col-span-2" placeholder="Wage payment – first fortnight" />
        </FormSection>

        <p className={cn('flex items-start gap-2 rounded-lg px-3 py-2 text-xs leading-5', addsProjectCost ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800')}>
          {addsProjectCost ? <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
          {addsProjectCost
            ? 'This entry adds labour cost to the selected project, on top of wages already earned through attendance.'
            : 'This entry changes the person’s balance only. It does not add project cost.'}
        </p>
      </form>
    </Modal>
  );
}

type ExpenseFormField = 'date' | 'vendor' | 'description' | 'amount';

function ExpenseFormModal({
  open,
  record,
  defaults,
  onClose,
}: {
  open: boolean;
  record: Expense | null;
  defaults?: Partial<Expense>;
  onClose: () => void;
}) {
  const { data, today, selectedDate, saveExpense } = useErp();
  const toast = useToast();
  const formId = useId();
  const [date, setDate] = useState(today);
  const [projectId, setProjectId] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Transport');
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<PaymentMode>('Cash');
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors<ExpenseFormField>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDate(record?.date ?? defaults?.date ?? (selectedDate > today ? today : selectedDate));
    setProjectId(record?.projectId ?? defaults?.projectId ?? '');
    setCategory(record?.category ?? defaults?.category ?? 'Transport');
    setVendor(record?.vendor ?? defaults?.vendor ?? '');
    setDescription(record?.description ?? defaults?.description ?? '');
    setAmount(record ? String(record.amount) : '');
    setMode(record?.mode ?? defaults?.mode ?? 'Cash');
    setReferenceNo(record?.referenceNo ?? '');
    setNotes(record?.notes ?? '');
    setErrors({});
  }, [open, record, defaults, today, selectedDate]);

  const categoryHint = EXPENSE_CATEGORY_HINTS[category];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const nextErrors: FormErrors<ExpenseFormField> = {};
    const cleanVendor = sanitizeText(vendor, 90);
    const cleanDescription = sanitizeText(description, 140);
    const value = parsePositiveNumber(amount);
    if (!isValidISODate(date)) nextErrors.date = 'Choose a valid date.';
    else if (date > today) nextErrors.date = 'Expenses cannot be dated in the future.';
    if (!cleanVendor) nextErrors.vendor = 'Vendor or person is required.';
    if (!cleanDescription) nextErrors.description = 'Describe what the money was spent on.';
    if (value === null) nextErrors.amount = 'Amount must be greater than 0.';
    setErrors(nextErrors);
    if (hasFormErrors(nextErrors) || value === null) {
      toast.error('Expense not saved', 'Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    await wait(500);
    saveExpense({
      id: record?.id,
      date,
      projectId,
      category,
      vendor: cleanVendor,
      description: cleanDescription,
      amount: Math.round(value),
      mode,
      referenceNo: sanitizeText(referenceNo, 40),
      notes: sanitizeMultiline(notes, 240),
    });
    setSaving(false);
    toast.success(record ? 'Expense updated' : 'Expense added', `${category} · ${formatINR(value)}`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={saving}
      size="md"
      title={record ? 'Edit expense' : 'Add expense'}
      description="Site and office spending feeds project cost and profit"
      icon={Receipt}
      iconTone="rose"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={saving} loadingText="Saving…">
            {record ? 'Save changes' : 'Add expense'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={(event) => void handleSubmit(event)} className="space-y-6" noValidate>
        {hasFormErrors(errors) && <FormErrorSummary errors={errors} />}
        <FormSection title="Expense details">
          <InputField label="Date" required type="date" value={date} max={today} onChange={(event) => setDate(event.target.value)} error={errors.date} />
          <SelectField label="Project" value={projectId} placeholder="Head office (no project)" options={buildProjectOptions(data.projects)} onChange={(event) => setProjectId(event.target.value)} icon={Building2} />
          <SelectField label="Category" required value={category} options={toSelectOptions(EXPENSE_CATEGORIES)} onChange={(event) => setCategory(event.target.value as ExpenseCategory)} icon={Layers} />
          <SelectField label="Payment mode" required value={mode} options={toSelectOptions(PAYMENT_MODES)} onChange={(event) => setMode(event.target.value as PaymentMode)} icon={Wallet} />
          {categoryHint && (
            <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800 sm:col-span-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {categoryHint}
            </p>
          )}
        </FormSection>
        <FormSection title="Payee & amount">
          <InputField label="Vendor / person" required value={vendor} maxLength={90} onChange={(event) => setVendor(event.target.value)} error={errors.vendor} placeholder="Balaji Transport Co." />
          <InputField label="Amount" required type="number" min={1} step={100} leadingText="₹" value={amount} onChange={(event) => setAmount(event.target.value)} error={errors.amount} />
          <InputField label="Description" required value={description} maxLength={140} onChange={(event) => setDescription(event.target.value)} error={errors.description} placeholder="Cement & sand delivery – 2 trips" containerClassName="sm:col-span-2" />
          <InputField label="Reference number" value={referenceNo} maxLength={40} onChange={(event) => setReferenceNo(event.target.value)} placeholder="Bill / UPI / cheque no." />
          <TextAreaField label="Notes" rows={2} maxLength={240} showCount value={notes} onChange={(event) => setNotes(event.target.value)} />
        </FormSection>
      </form>
    </Modal>
  );
}

type MaterialFormField = 'name' | 'supplier' | 'openingStock' | 'purchaseRate' | 'minStock' | 'date';

function MaterialFormModal({ open, record, onClose }: { open: boolean; record: Material | null; onClose: () => void }) {
  const { data, analytics, today, saveMaterial } = useErp();
  const toast = useToast();
  const formId = useId();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('Cement');
  const [unit, setUnit] = useState<MaterialUnit>('bag');
  const [openingStock, setOpeningStock] = useState('0');
  const [purchaseRate, setPurchaseRate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState(today);
  const [projectId, setProjectId] = useState('');
  const [minStock, setMinStock] = useState('0');
  const [errors, setErrors] = useState<FormErrors<MaterialFormField>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(record?.name ?? '');
    setCategory(record?.category ?? 'Cement');
    setUnit(record?.unit ?? 'bag');
    setOpeningStock(record ? String(record.openingStock) : '0');
    setPurchaseRate(record ? String(record.purchaseRate) : '');
    setSupplier(record?.supplier ?? '');
    setDate(record?.date ?? today);
    setProjectId(record?.projectId ?? '');
    setMinStock(record ? String(record.minStock) : '0');
    setErrors({});
  }, [open, record, today]);

  const currentStock = record ? analytics.materialStock[record.id] : undefined;
  const openingValue = parseNonNegativeNumber(openingStock === '' ? '0' : openingStock);
  const projectedRemaining =
    record && currentStock && openingValue !== null ? roundTo(openingValue + currentStock.received - currentStock.used, 2) : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const nextErrors: FormErrors<MaterialFormField> = {};
    const cleanName = sanitizeText(name, 80);
    const cleanSupplier = sanitizeText(supplier, 90);
    const opening = parseNonNegativeNumber(openingStock === '' ? '0' : openingStock);
    const rate = parsePositiveNumber(purchaseRate);
    const minimum = parseNonNegativeNumber(minStock === '' ? '0' : minStock);
    if (!cleanName) nextErrors.name = 'Material name is required.';
    if (!cleanSupplier) nextErrors.supplier = 'Supplier is required.';
    if (opening === null) nextErrors.openingStock = 'Opening stock must be 0 or more.';
    if (rate === null) nextErrors.purchaseRate = 'Purchase rate must be greater than 0.';
    if (minimum === null) nextErrors.minStock = 'Minimum stock must be 0 or more.';
    if (!isValidISODate(date)) nextErrors.date = 'Choose a valid date.';
    if (projectedRemaining !== null && projectedRemaining < 0) {
      nextErrors.openingStock = `This opening stock would make the remaining stock negative (${formatNumber(projectedRemaining)}).`;
    }
    setErrors(nextErrors);
    if (hasFormErrors(nextErrors) || opening === null || rate === null || minimum === null) {
      toast.error('Material not saved', 'Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    await wait(500);
    const result = saveMaterial({
      id: record?.id,
      name: cleanName,
      category,
      unit,
      openingStock: roundTo(opening, 2),
      purchaseRate: roundTo(rate, 2),
      supplier: cleanSupplier,
      date,
      projectId,
      minStock: roundTo(minimum, 2),
    });
    setSaving(false);
    if (!result.ok) {
      setErrors({ openingStock: result.error });
      toast.error('Material not saved', result.error);
      return;
    }
    toast.success(record ? 'Material updated' : 'Material added', `${cleanName} · ${category}`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={saving}
      variant="drawer"
      size="md"
      title={record ? 'Edit material' : 'Add material'}
      description={record ? `${record.id} · update rate, supplier and levels` : 'Track cement, steel, tiles and other site materials'}
      icon={record ? Pencil : Package}
      iconTone="amber"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={saving} loadingText="Saving…">
            {record ? 'Save changes' : 'Add material'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={(event) => void handleSubmit(event)} className="space-y-6" noValidate>
        {hasFormErrors(errors) && <FormErrorSummary errors={errors} />}
        <FormSection title="Material details">
          <InputField label="Material name" required value={name} maxLength={80} onChange={(event) => setName(event.target.value)} error={errors.name} placeholder="OPC Cement 53 Grade" containerClassName="sm:col-span-2" />
          <SelectField label="Category" required value={category} options={toSelectOptions(MATERIAL_CATEGORIES)} onChange={(event) => setCategory(event.target.value as MaterialCategory)} icon={Layers} />
          <SelectField label="Unit" required value={unit} options={toSelectOptions(MATERIAL_UNITS)} onChange={(event) => setUnit(event.target.value as MaterialUnit)} />
          <InputField label="Supplier" required value={supplier} maxLength={90} icon={Truck} onChange={(event) => setSupplier(event.target.value)} error={errors.supplier} placeholder="Shree Cement Depot" />
          <SelectField label="Project / site" value={projectId} placeholder="Central store" options={buildProjectOptions(data.projects)} onChange={(event) => setProjectId(event.target.value)} icon={Building2} />
        </FormSection>
        <FormSection title="Stock & rate">
          <InputField
            label="Opening stock"
            required
            type="number"
            min={0}
            step={1}
            value={openingStock}
            trailingText={unit}
            onChange={(event) => setOpeningStock(event.target.value)}
            error={errors.openingStock}
            hint={record && currentStock ? `Received ${formatNumber(currentStock.received)} · used ${formatNumber(currentStock.used)} so far.` : undefined}
          />
          <InputField label="Purchase rate" required type="number" min={0} step={1} leadingText="₹" value={purchaseRate} onChange={(event) => setPurchaseRate(event.target.value)} error={errors.purchaseRate} hint={`Per ${unit}`} />
          <InputField label="Minimum stock" required type="number" min={0} step={1} value={minStock} trailingText={unit} onChange={(event) => setMinStock(event.target.value)} error={errors.minStock} hint="Low stock alerts trigger at or below this." />
          <InputField label="Date added" required type="date" value={date} max={today} onChange={(event) => setDate(event.target.value)} error={errors.date} />
          {projectedRemaining !== null && (
            <p className={cn('rounded-lg px-3 py-2 text-xs font-medium sm:col-span-2', projectedRemaining < 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-600')}>
              Remaining stock after this change: <span className="font-semibold">{formatQuantity(projectedRemaining, unit)}</span>
            </p>
          )}
        </FormSection>
      </form>
    </Modal>
  );
}

type StockFormField = 'quantity' | 'date';

function StockMovementModal({
  open,
  material,
  movementType,
  onClose,
}: {
  open: boolean;
  material: Material | null;
  movementType: MovementType;
  onClose: () => void;
}) {
  const { data, analytics, today, selectedDate, recordMovement } = useErp();
  const toast = useToast();
  const formId = useId();
  const current = useRetainedValue(material);
  const [quantity, setQuantity] = useState('');
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(today);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<FormErrors<StockFormField>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !material) return;
    setQuantity('');
    setProjectId(material.projectId);
    setDate(selectedDate > today ? today : selectedDate);
    setNote('');
    setErrors({});
  }, [open, material, today, selectedDate]);

  const stock = current ? analytics.materialStock[current.id] : undefined;
  const remaining = stock?.remaining ?? 0;
  const isReceive = movementType === 'Receive';
  const parsedQuantity = parsePositiveNumber(quantity);
  const exceedsStock = !isReceive && parsedQuantity !== null && parsedQuantity > remaining;
  const estimatedCost = current && parsedQuantity !== null ? Math.round(parsedQuantity * current.purchaseRate) : 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !current) return;

    const nextErrors: FormErrors<StockFormField> = {};
    if (parsedQuantity === null) nextErrors.quantity = 'Quantity must be greater than 0.';
    else if (exceedsStock) nextErrors.quantity = `Only ${formatQuantity(remaining, current.unit)} available in stock.`;
    if (!isValidISODate(date)) nextErrors.date = 'Choose a valid date.';
    else if (date > today) nextErrors.date = 'Stock movements cannot be dated in the future.';
    setErrors(nextErrors);
    if (hasFormErrors(nextErrors) || parsedQuantity === null) {
      toast.error(isReceive ? 'Stock not received' : 'Material not issued', 'Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    await wait(500);
    const result = recordMovement({
      materialId: current.id,
      type: movementType,
      quantity: roundTo(parsedQuantity, 2),
      projectId,
      date,
      note: sanitizeText(note, 120),
    });
    setSaving(false);
    if (!result.ok) {
      setErrors({ quantity: result.error });
      toast.error('Stock not updated', result.error);
      return;
    }
    if (isReceive) {
      toast.success('Stock received', `${formatQuantity(parsedQuantity, current.unit)} of ${current.name} · ${formatINR(estimatedCost)}`);
    } else {
      toast.success('Material consumed', `${formatQuantity(parsedQuantity, current.unit)} of ${current.name} issued to site.`);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={saving}
      size="sm"
      title={isReceive ? 'Receive stock' : 'Use material'}
      description={current ? `${current.name} · ${current.id}` : undefined}
      icon={isReceive ? PackagePlus : PackageMinus}
      iconTone={isReceive ? 'emerald' : 'rose'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant={isReceive ? 'success' : 'primary'} loading={saving} loadingText="Saving…" disabled={exceedsStock}>
            {isReceive ? 'Receive stock' : 'Issue material'}
          </Button>
        </>
      }
    >
      {current && (
        <form id={formId} onSubmit={(event) => void handleSubmit(event)} className="space-y-5" noValidate>
          <div className="grid grid-cols-2 gap-2.5">
            <MiniStat label="Current stock" value={formatQuantity(remaining, current.unit)} tone={remaining <= current.minStock ? 'amber' : 'emerald'} hint={stock?.status} />
            <MiniStat label="Purchase rate" value={formatINR(current.purchaseRate)} tone="indigo" hint={`Per ${current.unit}`} />
          </div>

          <InputField
            label="Quantity"
            required
            type="number"
            min={0}
            step={1}
            value={quantity}
            trailingText={current.unit}
            onChange={(event) => setQuantity(event.target.value)}
            error={errors.quantity}
            hint={isReceive ? 'Adds to stock and to project material cost.' : `Maximum ${formatQuantity(remaining, current.unit)}`}
          />
          <SelectField
            label="Project / site"
            value={projectId}
            placeholder="Central store"
            options={buildProjectOptions(data.projects)}
            onChange={(event) => setProjectId(event.target.value)}
            icon={Building2}
            hint={isReceive ? 'Material cost is booked against this project.' : 'Where the material was consumed.'}
          />
          <InputField label="Date" required type="date" value={date} max={today} onChange={(event) => setDate(event.target.value)} error={errors.date} />
          <InputField label="Note" value={note} maxLength={120} onChange={(event) => setNote(event.target.value)} placeholder={isReceive ? `Received from ${current.supplier}` : 'Issued to site'} />

          {isReceive && parsedQuantity !== null && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
              Material cost added: <span className="font-semibold">{formatINR(estimatedCost)}</span>
            </p>
          )}
          {exceedsStock && (
            <p role="alert" className="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Stock cannot go negative. Receive more stock first.
            </p>
          )}
        </form>
      )}
    </Modal>
  );
}

/* ========================================================= */
/* Global Search                                             */
/* ========================================================= */

type SearchResultKind = 'worker' | 'project' | 'material';

interface SearchResult {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle: string;
  meta: string;
  icon: LucideIcon;
  tone: IconTone;
  onSelect: () => void;
}

const SEARCH_GROUP_LABELS: Record<SearchResultKind, string> = {
  worker: 'Workers',
  project: 'Projects',
  material: 'Materials',
};

function GlobalSearch({ className, onNavigated }: { className?: string; onNavigated?: () => void }) {
  const { data, analytics, navigate } = useErp();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(query, 220);
  const listId = useId();
  const searching = query.trim() !== '' && query !== debouncedQuery;

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(0);
  }, []);

  useDismissableLayer(open, [containerRef], () => close());

  const results = useMemo<SearchResult[]>(() => {
    const term = debouncedQuery.trim();
    if (term.length < 1) return [];
    const output: SearchResult[] = [];

    for (const worker of data.workers) {
      if (output.filter((item) => item.kind === 'worker').length >= 5) break;
      if (!matchesQuery(term, worker.name, worker.id, worker.phone, worker.trade)) continue;
      output.push({
        id: worker.id,
        kind: 'worker',
        title: worker.name,
        subtitle: `${worker.trade} · ${getProjectName(analytics, worker.projectId)}`,
        meta: formatINR(analytics.workerMetrics[worker.id]?.payable ?? 0),
        icon: HardHat,
        tone: 'indigo',
        onSelect: () => navigate('labour', { workerId: worker.id }),
      });
    }

    for (const project of data.projects) {
      if (output.filter((item) => item.kind === 'project').length >= 5) break;
      if (!matchesQuery(term, project.name, project.id, project.clientName, project.location)) continue;
      output.push({
        id: project.id,
        kind: 'project',
        title: project.name,
        subtitle: `${project.location} · ${project.clientName}`,
        meta: project.stage,
        icon: Building2,
        tone: 'emerald',
        onSelect: () => navigate('projects', { projectId: project.id, projectTab: 'overview' }),
      });
    }

    for (const material of data.materials) {
      if (output.filter((item) => item.kind === 'material').length >= 5) break;
      if (!matchesQuery(term, material.name, material.id, material.supplier, material.category)) continue;
      const stock = analytics.materialStock[material.id];
      output.push({
        id: material.id,
        kind: 'material',
        title: material.name,
        subtitle: `${material.category} · ${material.supplier}`,
        meta: formatQuantity(stock?.remaining ?? 0, material.unit),
        icon: Package,
        tone: 'amber',
        onSelect: () => navigate('materials', { materialId: material.id }),
      });
    }

    return output;
  }, [debouncedQuery, data.workers, data.projects, data.materials, analytics, navigate]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  const select = (result: SearchResult) => {
    result.onSelect();
    setQuery('');
    close();
    onNavigated?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setQuery('');
      close();
      return;
    }
    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (results.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const result = results[activeIndex];
      if (result) select(result);
    }
  };

  let renderIndex = -1;
  const groups: SearchResultKind[] = ['worker', 'project', 'material'];
  const showPanel = open && query.trim() !== '';

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <SearchInput
        value={query}
        onChange={(value) => {
          setQuery(value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search workers, projects, materials…"
        label="Global search"
        loading={searching}
        trailing={<Kbd>/</Kbd>}
      />

      {showPanel && (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
        >
          {searching ? (
            <div className="px-3 py-6 text-center">
              <InlineLoader label="Searching…" />
            </div>
          ) : results.length === 0 ? (
            <EmptyState icon={Search} title="No matches found" description="Try a name, ID, phone number or supplier." compact />
          ) : (
            groups.map((group) => {
              const groupResults = results.filter((result) => result.kind === group);
              if (groupResults.length === 0) return null;
              return (
                <div key={group} className="mb-1 last:mb-0">
                  <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{SEARCH_GROUP_LABELS[group]}</p>
                  {groupResults.map((result) => {
                    renderIndex += 1;
                    const index = renderIndex;
                    const Icon = result.icon;
                    return (
                      <button
                        key={`${result.kind}-${result.id}`}
                        type="button"
                        role="option"
                        aria-selected={index === activeIndex}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => select(result)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors',
                          FOCUS_RING_INSET,
                          index === activeIndex ? 'bg-slate-100' : 'hover:bg-slate-50',
                        )}
                      >
                        <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset', ICON_TONES[result.tone])}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium text-slate-900">{result.title}</span>
                          <span className="block truncate text-xs text-slate-500">{result.subtitle}</span>
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-slate-500">{result.meta}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ========================================================= */
/* Notifications & Profile                                   */
/* ========================================================= */

const NOTIFICATION_STYLES: Record<NotificationType, { icon: LucideIcon; tone: IconTone }> = {
  success: { icon: CheckCircle2, tone: 'emerald' },
  error: { icon: XCircle, tone: 'rose' },
  warning: { icon: AlertTriangle, tone: 'amber' },
  info: { icon: Info, tone: 'sky' },
};

function NotificationPanel() {
  const { data, navigate, markNotificationRead, markAllNotificationsRead } = useErp();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const now = useNow();
  const panelId = useId();

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.querySelector('button')?.focus();
  }, []);

  useDismissableLayer(open, [triggerRef, panelRef], (reason) => close(reason === 'escape'));

  const notifications = useMemo(() => [...data.notifications].sort((a, b) => b.createdAt - a.createdAt).slice(0, 20), [data.notifications]);
  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <div ref={triggerRef} className="relative">
      <IconButton
        label="Notifications"
        icon={Bell}
        variant="ghost"
        size="md"
        badgeCount={unread}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((current) => !current)}
      />
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label="Notifications"
          className="fixed inset-x-3 top-16 z-50 max-h-[70vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[380px]"
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <p className="text-xs text-slate-500">{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <Button size="xs" variant="ghost" icon={CheckCheck} onClick={() => markAllNotificationsRead()}>
                  Mark all read
                </Button>
              )}
              <IconButton label="Close notifications" icon={X} onClick={() => close(true)} />
            </div>
          </div>
          <div className="erp-scroll-thin max-h-[calc(70vh-4rem)] overflow-y-auto">
            {notifications.length === 0 ? (
              <EmptyState icon={Bell} title="No notifications" description="Alerts about stock, budgets and wages will appear here." compact />
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map((notification) => {
                  const style = NOTIFICATION_STYLES[notification.type];
                  const Icon = style.icon;
                  return (
                    <li key={notification.id} className={cn(!notification.read && 'bg-indigo-50/40')}>
                      <button
                        type="button"
                        onClick={() => {
                          markNotificationRead(notification.id);
                          close(false);
                          navigate(notification.section);
                        }}
                        className={cn('flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50', FOCUS_RING_INSET)}
                      >
                        <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset', ICON_TONES[style.tone])}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-[13px] font-semibold text-slate-900">{notification.title}</span>
                            {!notification.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" aria-label="Unread" />}
                          </span>
                          <span className="mt-0.5 block text-xs leading-5 text-slate-600">{notification.message}</span>
                          <span className="mt-1 block text-[11px] text-slate-400">{formatRelativeTime(notification.createdAt, now)}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const { data, navigate } = useErp();
  const { companyName, ownerName, city } = data.settings;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) containerRef.current?.querySelector('button')?.focus();
  }, []);

  useDismissableLayer(open, [containerRef], (reason) => close(reason === 'escape'));

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={cn('flex items-center gap-2 rounded-lg p-1 pr-1.5 transition-colors hover:bg-slate-100', FOCUS_RING, open && 'bg-slate-100')}
      >
        <Avatar name={ownerName} id={companyName} size="sm" />
        <span className="hidden min-w-0 text-left lg:block">
          <span className="block max-w-[140px] truncate text-[13px] font-medium leading-4 text-slate-900">{ownerName}</span>
          <span className="block max-w-[140px] truncate text-[11px] leading-4 text-slate-500">Administrator</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 shrink-0 text-slate-400 lg:block" aria-hidden="true" />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
        >
          <div className="flex items-center gap-3 rounded-lg px-2.5 py-2.5">
            <Avatar name={ownerName} id={companyName} size="md" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-slate-900">{ownerName}</p>
              <p className="truncate text-xs text-slate-500">{companyName}</p>
            </div>
          </div>
          <div className="my-1 h-px bg-slate-100" />
          <dl className="space-y-1.5 px-2.5 py-1.5 text-xs">
            <div className="flex items-center gap-2">
              <dt className="sr-only">City</dt>
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
              <dd className="truncate text-slate-600">{city || 'City not set'}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Role</dt>
              <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
              <dd className="truncate text-slate-600">Full access · demo account</dd>
            </div>
          </dl>
          <div className="my-1 h-px bg-slate-100" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close(false);
              navigate('settings');
            }}
            className={cn('flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900', FOCUS_RING_INSET)}
          >
            <Settings className="h-4 w-4 text-slate-400" aria-hidden="true" />
            Company settings
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================= */
/* Shell: Sidebar, Header, Navigation                        */
/* ========================================================= */

function SidebarNav({
  activeSection,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: {
  activeSection: SectionKey;
  onNavigate: (section: SectionKey) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { data, analytics } = useErp();
  const unread = data.notifications.filter((notification) => !notification.read).length;
  const alerts = Object.values(analytics.materialStock).filter((stock) => stock.status !== 'In Stock').length;

  const counts: Partial<Record<SectionKey, number>> = {
    materials: alerts,
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className={cn('flex items-center gap-2.5 border-b border-slate-100 px-3 py-4', collapsed ? 'justify-center' : 'px-4')}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-900 text-white shadow-sm">
          <Building2 className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-4 text-slate-900">{data.settings.companyName}</p>
            <p className="truncate text-[11px] leading-4 text-slate-500">Site & Labour ERP</p>
          </div>
        )}
        {onToggleCollapse && !collapsed && (
          <IconButton label="Collapse sidebar" icon={ChevronLeft} onClick={onToggleCollapse} className="hidden xl:inline-grid" />
        )}
      </div>

      <nav aria-label="Main navigation" className="erp-scroll-thin min-h-0 flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.key === activeSection;
            const count = counts[item.key] ?? 0;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                  onClick={() => onNavigate(item.key)}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-[13px] font-medium transition-colors',
                    FOCUS_RING_INSET,
                    collapsed && 'justify-center px-2',
                    active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )}
                >
                  <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600')} aria-hidden="true" />
                  {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>}
                  {!collapsed && count > 0 && <CountBadge count={count} tone={active ? 'neutral' : 'danger'} />}
                  {collapsed && count > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-100 p-2">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2 py-1">
            {onToggleCollapse && <IconButton label="Expand sidebar" icon={ChevronRight} onClick={onToggleCollapse} />}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <Activity className="h-3 w-3" aria-hidden="true" />
              Status
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center justify-between gap-2">
                <span>Unread alerts</span>
                <span className="font-semibold tabular-nums text-slate-900">{unread}</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span>Stock warnings</span>
                <span className={cn('font-semibold tabular-nums', alerts > 0 ? 'text-amber-600' : 'text-slate-900')}>{alerts}</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function MobileNavDrawer({
  open,
  activeSection,
  onNavigate,
  onClose,
}: {
  open: boolean;
  activeSection: SectionKey;
  onNavigate: (section: SectionKey) => void;
  onClose: () => void;
}) {
  const { data } = useErp();
  const panelRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(open);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useIsomorphicLayoutEffect(() => {
    if (!rendered) return;
    const panel = panelRef.current;
    if (!panel) return;
    if (reducedMotion) {
      if (!open) setRendered(false);
      return;
    }
    if (open) {
      const tween = gsap.fromTo(panel, { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.26, ease: 'power3.out', clearProps: 'transform,opacity' });
      return () => {
        tween.kill();
      };
    }
    const tween = gsap.to(panel, { x: -24, opacity: 0, duration: 0.18, ease: 'power2.in', onComplete: () => setRendered(false) });
    return () => {
      tween.kill();
    };
  }, [open, rendered, reducedMotion]);

  if (!rendered) return null;

  return (
    <div role="presentation" className="fixed inset-0 z-50 flex xl:hidden">
      <div aria-hidden="true" className={cn('absolute inset-0 bg-slate-900/40 transition-opacity', open ? 'opacity-100' : 'opacity-0')} onClick={onClose} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Navigation" className="relative flex h-full w-[276px] max-w-[85vw] flex-col shadow-2xl">
        <div className="absolute right-2 top-3 z-10">
          <IconButton label="Close navigation" icon={X} onClick={onClose} />
        </div>
        <SidebarNav activeSection={activeSection} onNavigate={onNavigate} />
        <div className="border-t border-slate-100 bg-white px-4 py-3">
          <p className="truncate text-xs text-slate-500">
            {data.settings.ownerName} · {data.settings.city || 'India'}
          </p>
        </div>
      </div>
    </div>
  );
}

function AppHeader({
  activeSection,
  onMenuOpen,
  onPrimaryAction,
}: {
  activeSection: SectionKey;
  onMenuOpen: () => void;
  onPrimaryAction: () => void;
}) {
  const { today, selectedDate, setSelectedDate } = useErp();
  const meta = SECTION_META[activeSection];
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dateId = useId();

  return (
    <header className="erp-print-hidden sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 lg:px-6">
        <IconButton label="Open navigation" icon={Menu} variant="ghost" size="md" onClick={onMenuOpen} className="xl:hidden" />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold leading-5 tracking-tight text-slate-900 sm:text-base">{meta.title}</h1>
          <p className="hidden truncate text-xs text-slate-500 sm:block">{meta.subtitle}</p>
        </div>

        <GlobalSearch className="hidden w-full max-w-xs lg:block xl:max-w-sm" />

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <IconButton label="Search" icon={Search} variant="ghost" size="md" onClick={() => setMobileSearchOpen((current) => !current)} className="lg:hidden" />

          <div className="relative hidden items-center sm:flex">
            <label htmlFor={dateId} className="sr-only">
              Working date
            </label>
            <Calendar className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <input
              id={dateId}
              type="date"
              value={selectedDate}
              max={today}
              onChange={(event) => {
                if (isValidISODate(event.target.value)) setSelectedDate(event.target.value);
              }}
              title="Working date used across the dashboard"
              className={cn(
                'h-9 rounded-lg border bg-white pl-8 pr-2 text-[13px] font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15',
                selectedDate === today ? 'border-slate-200' : 'border-indigo-200 bg-indigo-50/60 text-indigo-700',
              )}
            />
          </div>

          <NotificationPanel />
          <ProfileMenu />

          {meta.addLabel && (
            <>
              <Button size="sm" icon={Plus} onClick={onPrimaryAction} className="hidden sm:inline-flex">
                {meta.addLabel}
              </Button>
              <IconButton label={meta.addLabel} icon={Plus} variant="soft" size="md" onClick={onPrimaryAction} className="sm:hidden" />
            </>
          )}
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-slate-100 px-3 py-2.5 lg:hidden">
          <GlobalSearch onNavigated={() => setMobileSearchOpen(false)} />
          <div className="mt-2 flex items-center gap-2 sm:hidden">
            <label htmlFor={`${dateId}-mobile`} className="text-xs font-medium text-slate-500">
              Working date
            </label>
            <input
              id={`${dateId}-mobile`}
              type="date"
              value={selectedDate}
              max={today}
              onChange={(event) => {
                if (isValidISODate(event.target.value)) setSelectedDate(event.target.value);
              }}
              className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[13px] text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15"
            />
          </div>
        </div>
      )}
    </header>
  );
}

/* ========================================================= */
/* Main Page                                                 */
/* ========================================================= */

function createEmptyAppData(): AppData {
  return {
    version: DATA_VERSION,
    settings: { ...DEFAULT_SETTINGS },
    workers: [],
    projects: [],
    attendance: [],
    workEntries: [],
    materials: [],
    movements: [],
    transactions: [],
    expenses: [],
    notifications: [],
    activities: [],
  };
}

const MAX_ACTIVITIES = 50;
const MAX_NOTIFICATIONS = 40;

function appendActivity(activities: ActivityItem[], type: ActivityType, title: string, detail: string): ActivityItem[] {
  const item: ActivityItem = {
    id: createId('ACT', activities),
    type,
    title,
    detail: sanitizeText(detail, 140),
    timestamp: Date.now(),
  };
  return [item, ...activities].slice(0, MAX_ACTIVITIES);
}

function appendNotification(
  notifications: AppNotification[],
  input: { title: string; message: string; type: NotificationType; section: SectionKey; dedupeKey?: string },
): AppNotification[] {
  // Suppress a repeat of the same alert raised in the last six hours.
  if (input.dedupeKey) {
    const cutoff = Date.now() - 6 * 60 * 60 * 1000;
    const duplicate = notifications.some((notification) => notification.title === input.title && notification.message === input.message && notification.createdAt > cutoff);
    if (duplicate) return notifications;
  }
  const item: AppNotification = {
    id: createId('NTF', notifications),
    title: input.title,
    message: input.message,
    type: input.type,
    section: input.section,
    createdAt: Date.now(),
    read: false,
  };
  return [item, ...notifications].slice(0, MAX_NOTIFICATIONS);
}

function NirmaanERPApp() {
  const toast = useToast();
  const [data, setData] = useState<AppData>(createEmptyAppData);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState('1970-01-01');
  const [selectedDate, setSelectedDateState] = useState('1970-01-01');
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard');
  const [focus, setFocus] = useState<NavigationFocus | null>(null);
  const [primaryAction, setPrimaryAction] = useState<{ section: SectionKey; nonce: number }>({ section: 'dashboard', nonce: 0 });
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  /* ---- Client-side initialisation (avoids hydration mismatch) ---- */
  useEffect(() => {
    const now = Date.now();
    const currentDate = toISODate(new Date(now));
    const stored = loadStoredData();
    setData(stored ?? createSeedData(currentDate, now));
    setToday(currentDate);
    setSelectedDateState(currentDate);
    setReady(true);
  }, []);

  /* ---- Persistence ---- */
  useEffect(() => {
    if (!ready) return;
    if (data.settings.persistData) persistAppData(data);
    else clearStoredData();
  }, [ready, data]);

  const analytics = useMemo(() => computeAnalytics(data), [data]);
  const analyticsRef = useLatestRef(analytics);

  const setSelectedDate = useCallback((date: string) => {
    if (isValidISODate(date)) setSelectedDateState(date);
  }, []);

  const navigate = useCallback((section: SectionKey, nextFocus?: NavigationFocus) => {
    setActiveSection(section);
    setFocus(nextFocus ?? null);
    setMobileNavOpen(false);
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }, []);

  const consumeFocus = useCallback(() => setFocus(null), []);
  const openModal = useCallback((next: ModalState) => setModal(next), []);
  const closeModal = useCallback(() => setModal(null), []);
  const requestDelete = useCallback((target: DeleteTarget) => setDeleteTarget(target), []);

  const triggerPrimaryAction = useCallback(() => {
    setPrimaryAction((current) => ({ section: activeSection, nonce: current.nonce + 1 }));
  }, [activeSection]);

  /* ---- Mutations ---- */

  const upsertAttendance = useCallback((entries: readonly AttendanceInput[]) => {
    if (entries.length === 0) return;
    setData((current) => {
      const attendance = [...current.attendance];
      const indexByKey = new Map<string, number>();
      attendance.forEach((record, index) => indexByKey.set(`${record.workerId}|${record.date}`, index));

      let created = 0;
      let updated = 0;
      for (const entry of entries) {
        const key = `${entry.workerId}|${entry.date}`;
        const existingIndex = indexByKey.get(key);
        if (existingIndex !== undefined) {
          const existing = attendance[existingIndex];
          if (!existing) continue;
          attendance[existingIndex] = {
            ...existing,
            projectId: entry.projectId,
            status: entry.status,
            overtimeHours: entry.overtimeHours,
            notes: entry.notes,
          };
          updated += 1;
        } else {
          const record: AttendanceRecord = {
            id: createId('ATT', attendance, 4),
            date: entry.date,
            projectId: entry.projectId,
            workerId: entry.workerId,
            status: entry.status,
            overtimeHours: entry.overtimeHours,
            notes: entry.notes,
          };
          attendance.push(record);
          indexByKey.set(key, attendance.length - 1);
          created += 1;
        }
      }

      const total = created + updated;
      const first = entries[0];
      const detail =
        total === 1 && first
          ? `${analyticsRef.current.workersById[first.workerId]?.name ?? 'Worker'} · ${first.status} · ${formatDate(first.date)}`
          : `${total} records updated`;

      return { ...current, attendance, activities: appendActivity(current.activities, 'attendance', 'Attendance updated', detail) };
    });
  }, [analyticsRef]);

  const removeAttendance = useCallback((workerIds: readonly string[], date: string) => {
    if (workerIds.length === 0) return;
    const ids = new Set(workerIds);
    setData((current) => ({
      ...current,
      attendance: current.attendance.filter((record) => !(record.date === date && ids.has(record.workerId))),
      activities: appendActivity(current.activities, 'attendance', 'Attendance cleared', `${workerIds.length} records on ${formatDate(date)}`),
    }));
  }, []);

  const saveWorker = useCallback((draft: Draft<Worker>): Worker => {
    let saved: Worker = { ...draft, id: draft.id ?? 'WRK-000' };
    setData((current) => {
      const isEdit = Boolean(draft.id && current.workers.some((worker) => worker.id === draft.id));
      const id = isEdit && draft.id ? draft.id : createId('WRK', current.workers);
      const worker: Worker = { ...draft, id };
      saved = worker;
      const workers = isEdit ? current.workers.map((item) => (item.id === id ? worker : item)) : [...current.workers, worker];
      return {
        ...current,
        workers,
        activities: appendActivity(
          current.activities,
          'worker',
          isEdit ? 'Worker updated' : 'Worker added',
          `${worker.name} · ${worker.trade} · ${formatINR(worker.dailyWage)}/day`,
        ),
      };
    });
    return saved;
  }, []);

  const saveProject = useCallback((draft: Draft<Project>): Project => {
    let saved: Project = { ...draft, id: draft.id ?? 'PRJ-000' };
    setData((current) => {
      const isEdit = Boolean(draft.id && current.projects.some((project) => project.id === draft.id));
      const id = isEdit && draft.id ? draft.id : createId('PRJ', current.projects);
      const project: Project = { ...draft, id };
      saved = project;
      const projects = isEdit ? current.projects.map((item) => (item.id === id ? project : item)) : [...current.projects, project];
      return {
        ...current,
        projects,
        activities: appendActivity(current.activities, 'project', isEdit ? 'Project updated' : 'Project created', `${project.name} · ${project.stage}`),
      };
    });
    return saved;
  }, []);

  const saveWorkEntry = useCallback((draft: Draft<WorkEntry>): WorkEntry => {
    let saved: WorkEntry = { ...draft, id: draft.id ?? 'WE-000' };
    setData((current) => {
      const isEdit = Boolean(draft.id && current.workEntries.some((entry) => entry.id === draft.id));
      const id = isEdit && draft.id ? draft.id : createId('WE', current.workEntries);
      const entry: WorkEntry = { ...draft, id };
      saved = entry;
      const workEntries = isEdit ? current.workEntries.map((item) => (item.id === id ? entry : item)) : [...current.workEntries, entry];
      return {
        ...current,
        workEntries,
        activities: appendActivity(
          current.activities,
          'work',
          isEdit ? 'Work entry updated' : 'Work entry added',
          `${analyticsRef.current.workersById[entry.workerId]?.name ?? 'Worker'} · ${formatQuantity(entry.quantity, getWorkUnitLabel(entry.unit, entry.customUnit))}`,
        ),
      };
    });
    return saved;
  }, [analyticsRef]);

  const saveTransaction = useCallback((draft: Draft<Transaction>): Transaction => {
    let saved: Transaction = { ...draft, id: draft.id ?? 'TXN-000' };
    setData((current) => {
      const isEdit = Boolean(draft.id && current.transactions.some((transaction) => transaction.id === draft.id));
      const id = isEdit && draft.id ? draft.id : createId('TXN', current.transactions);
      const transaction: Transaction = { ...draft, id };
      saved = transaction;
      const transactions = isEdit ? current.transactions.map((item) => (item.id === id ? transaction : item)) : [...current.transactions, transaction];
      const workerName = analyticsRef.current.workersById[transaction.workerId]?.name ?? 'Worker';
      return {
        ...current,
        transactions,
        activities: appendActivity(
          current.activities,
          'payment',
          isEdit ? 'Transaction updated' : `${transaction.type} recorded`,
          `${workerName} · ${formatINR(transaction.amount)} · ${transaction.mode}`,
        ),
      };
    });
    return saved;
  }, [analyticsRef]);

  const saveExpense = useCallback((draft: Draft<Expense>): Expense => {
    let saved: Expense = { ...draft, id: draft.id ?? 'EXP-000' };
    setData((current) => {
      const isEdit = Boolean(draft.id && current.expenses.some((expense) => expense.id === draft.id));
      const id = isEdit && draft.id ? draft.id : createId('EXP', current.expenses);
      const expense: Expense = { ...draft, id };
      saved = expense;
      const expenses = isEdit ? current.expenses.map((item) => (item.id === id ? expense : item)) : [...current.expenses, expense];

      let notifications = current.notifications;
      if (expense.projectId) {
        const project = current.projects.find((item) => item.id === expense.projectId);
        const financials = analyticsRef.current.projectFinancials[expense.projectId];
        if (project && financials && project.estimatedCost > 0) {
          const projectedCost = financials.actualCost + (isEdit ? 0 : expense.amount);
          if (projectedCost > project.estimatedCost && !financials.isOverBudget) {
            notifications = appendNotification(notifications, {
              title: 'Project over budget',
              message: `${project.name} has crossed its estimated cost of ${formatINRCompact(project.estimatedCost)}.`,
              type: 'error',
              section: 'projects',
              dedupeKey: `budget-${project.id}`,
            });
          }
        }
      }

      return {
        ...current,
        expenses,
        notifications,
        activities: appendActivity(
          current.activities,
          'expense',
          isEdit ? 'Expense updated' : 'Expense added',
          `${expense.category} · ${formatINR(expense.amount)} · ${expense.vendor}`,
        ),
      };
    });
    return saved;
  }, [analyticsRef]);

  const saveMaterial = useCallback((draft: Draft<Material>): MutationResult => {
    let result: MutationResult = { ok: true };
    setData((current) => {
      const isEdit = Boolean(draft.id && current.materials.some((material) => material.id === draft.id));
      const id = isEdit && draft.id ? draft.id : createId('MAT', current.materials);

      if (isEdit) {
        let received = 0;
        let used = 0;
        for (const movement of current.movements) {
          if (movement.materialId !== id) continue;
          if (movement.type === 'Receive') received += movement.quantity;
          else used += movement.quantity;
        }
        const remaining = roundTo(draft.openingStock + received - used, 2);
        if (remaining < 0) {
          result = {
            ok: false,
            error: `Opening stock is too low. ${formatNumber(used)} has already been used, so the remaining stock would be ${formatNumber(remaining)}.`,
          };
          return current;
        }
      }

      const material: Material = { ...draft, id };
      const materials = isEdit ? current.materials.map((item) => (item.id === id ? material : item)) : [...current.materials, material];
      result = { ok: true };
      return {
        ...current,
        materials,
        activities: appendActivity(
          current.activities,
          'material',
          isEdit ? 'Material updated' : 'Material added',
          `${material.name} · ${material.category} · ${formatINR(material.purchaseRate)}/${material.unit}`,
        ),
      };
    });
    return result;
  }, []);

  const recordMovement = useCallback((movement: Omit<MaterialMovement, 'id'>): MutationResult => {
    let result: MutationResult = { ok: true };
    setData((current) => {
      const material = current.materials.find((item) => item.id === movement.materialId);
      if (!material) {
        result = { ok: false, error: 'This material no longer exists.' };
        return current;
      }
      if (movement.quantity <= 0) {
        result = { ok: false, error: 'Quantity must be greater than 0.' };
        return current;
      }

      let received = 0;
      let used = 0;
      for (const item of current.movements) {
        if (item.materialId !== material.id) continue;
        if (item.type === 'Receive') received += item.quantity;
        else used += item.quantity;
      }
      const remainingBefore = roundTo(material.openingStock + received - used, 2);

      if (movement.type === 'Use' && movement.quantity > remainingBefore) {
        result = { ok: false, error: `Only ${formatQuantity(remainingBefore, material.unit)} available in stock.` };
        return current;
      }

      const record: MaterialMovement = { ...movement, id: createId('MOV', current.movements) };
      const movements = [...current.movements, record];
      const remainingAfter = roundTo(movement.type === 'Receive' ? remainingBefore + movement.quantity : remainingBefore - movement.quantity, 2);
      const statusAfter = getStockStatus(remainingAfter, material.minStock);
      const statusBefore = getStockStatus(remainingBefore, material.minStock);

      let notifications = current.notifications;
      if (movement.type === 'Receive') {
        notifications = appendNotification(notifications, {
          title: 'New material received',
          message: `${formatQuantity(movement.quantity, material.unit)} of ${material.name} received at ${getProjectName(analyticsRef.current, movement.projectId, 'the central store')}.`,
          type: 'success',
          section: 'materials',
          dedupeKey: `receive-${material.id}-${movement.date}`,
        });
      } else if (current.settings.lowStockAlerts && statusAfter !== 'In Stock' && statusAfter !== statusBefore) {
        notifications = appendNotification(notifications, {
          title: statusAfter === 'Out of Stock' ? 'Material out of stock' : 'Low stock alert',
          message:
            statusAfter === 'Out of Stock'
              ? `${material.name} has run out. Order more before work is affected.`
              : `${material.name} is down to ${formatQuantity(remainingAfter, material.unit)}, at or below the minimum of ${formatNumber(material.minStock)}.`,
          type: statusAfter === 'Out of Stock' ? 'error' : 'warning',
          section: 'materials',
          dedupeKey: `stock-${material.id}-${statusAfter}`,
        });
      }

      result = { ok: true };
      return {
        ...current,
        movements,
        notifications,
        activities: appendActivity(
          current.activities,
          'material',
          movement.type === 'Receive' ? 'Material received' : 'Material consumed',
          `${material.name} · ${formatQuantity(movement.quantity, material.unit)} · ${getProjectName(analyticsRef.current, movement.projectId, 'Central store')}`,
        ),
      };
    });
    return result;
  }, [analyticsRef]);

  const deleteRecord = useCallback((kind: RecordKind, id: string) => {
    setData((current) => {
      switch (kind) {
        case 'worker': {
          const worker = current.workers.find((item) => item.id === id);
          return {
            ...current,
            workers: current.workers.filter((item) => item.id !== id),
            attendance: current.attendance.filter((record) => record.workerId !== id),
            workEntries: current.workEntries.filter((entry) => entry.workerId !== id),
            transactions: current.transactions.filter((transaction) => transaction.workerId !== id),
            activities: appendActivity(current.activities, 'worker', 'Worker deleted', worker?.name ?? id),
          };
        }
        case 'project': {
          const project = current.projects.find((item) => item.id === id);
          // History keeps its original projectId so removed sites still render in ledgers and reports.
          return {
            ...current,
            projects: current.projects.filter((item) => item.id !== id),
            workers: current.workers.map((worker) => (worker.projectId === id ? { ...worker, projectId: '' } : worker)),
            activities: appendActivity(current.activities, 'project', 'Project deleted', project?.name ?? id),
          };
        }
        case 'material': {
          const material = current.materials.find((item) => item.id === id);
          return {
            ...current,
            materials: current.materials.filter((item) => item.id !== id),
            movements: current.movements.filter((movement) => movement.materialId !== id),
            activities: appendActivity(current.activities, 'material', 'Material deleted', material?.name ?? id),
          };
        }
        case 'workEntry': {
          const entry = current.workEntries.find((item) => item.id === id);
          return {
            ...current,
            workEntries: current.workEntries.filter((item) => item.id !== id),
            activities: appendActivity(current.activities, 'work', 'Work entry deleted', entry?.task ?? id),
          };
        }
        case 'transaction': {
          const transaction = current.transactions.find((item) => item.id === id);
          return {
            ...current,
            transactions: current.transactions.filter((item) => item.id !== id),
            activities: appendActivity(
              current.activities,
              'payment',
              'Transaction deleted',
              transaction ? `${transaction.type} · ${formatINR(transaction.amount)}` : id,
            ),
          };
        }
        case 'expense':
        default: {
          const expense = current.expenses.find((item) => item.id === id);
          return {
            ...current,
            expenses: current.expenses.filter((item) => item.id !== id),
            activities: appendActivity(current.activities, 'expense', 'Expense deleted', expense ? `${expense.category} · ${formatINR(expense.amount)}` : id),
          };
        }
      }
    });
  }, []);

  const updateSettings = useCallback((settings: AppSettings) => {
    setData((current) => ({
      ...current,
      settings,
      activities: appendActivity(current.activities, 'system', 'Settings updated', `${settings.companyName} · ${settings.standardHours} hr day`),
    }));
  }, []);

  const resetData = useCallback(() => {
    const now = Date.now();
    const currentDate = toISODate(new Date(now));
    clearStoredData();
    setData(createSeedData(currentDate, now));
    setToday(currentDate);
    setSelectedDateState(currentDate);
    setModal(null);
    setDeleteTarget(null);
    setFocus(null);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      notifications: current.notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setData((current) => ({
      ...current,
      notifications: current.notifications.map((notification) => (notification.read ? notification : { ...notification, read: true })),
    }));
  }, []);

  const contextValue = useMemo<ErpContextValue>(
    () => ({
      data,
      analytics,
      ready,
      today,
      selectedDate,
      setSelectedDate,
      focus,
      consumeFocus,
      primaryAction,
      navigate,
      openModal,
      requestDelete,
      upsertAttendance,
      removeAttendance,
      saveWorker,
      saveProject,
      saveWorkEntry,
      saveTransaction,
      saveExpense,
      saveMaterial,
      recordMovement,
      deleteRecord,
      updateSettings,
      resetData,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      data,
      analytics,
      ready,
      today,
      selectedDate,
      setSelectedDate,
      focus,
      consumeFocus,
      primaryAction,
      navigate,
      openModal,
      requestDelete,
      upsertAttendance,
      removeAttendance,
      saveWorker,
      saveProject,
      saveWorkEntry,
      saveTransaction,
      saveExpense,
      saveMaterial,
      recordMovement,
      deleteRecord,
      updateSettings,
      resetData,
      markNotificationRead,
      markAllNotificationsRead,
    ],
  );

  const retainedModal = useRetainedValue(modal);
  const retainedDelete = useRetainedValue(deleteTarget);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    await wait(550);
    deleteRecord(target.kind, target.id);
    setDeleteTarget(null);
    toast.success('Record deleted', `${target.label} has been removed.`);
  };

  const renderSection = (): ReactNode => {
    switch (activeSection) {
      case 'labour':
        return <LabourSection />;
      case 'attendance':
        return <AttendanceSection />;
      case 'work':
        return <WorkSection />;
      case 'khata':
        return <KhataSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'materials':
        return <MaterialsSection />;
      case 'expenses':
        return <ExpensesSection />;
      case 'reports':
        return <ReportsSection />;
      case 'settings':
        return <SettingsSection />;
      case 'dashboard':
      default:
        return <DashboardSection />;
    }
  };

  return (
    <ErpContext.Provider value={contextValue}>
      <GlobalStyles />
      <div className="flex min-h-[100dvh] bg-slate-50 text-slate-900">
        <aside
          className={cn(
            'erp-print-hidden sticky top-0 hidden h-[100dvh] shrink-0 border-r border-slate-200/80 transition-[width] duration-200 xl:block',
            sidebarCollapsed ? 'w-[72px]' : 'w-[248px]',
          )}
        >
          <SidebarNav
            activeSection={activeSection}
            onNavigate={(section) => navigate(section)}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader activeSection={activeSection} onMenuOpen={() => setMobileNavOpen(true)} onPrimaryAction={triggerPrimaryAction} />
          <main ref={mainRef} className="min-w-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
            <AnimatedSection animationKey={activeSection} className="mx-auto w-full max-w-[1600px]">
              {renderSection()}
            </AnimatedSection>
          </main>
        </div>
      </div>

      <MobileNavDrawer open={mobileNavOpen} activeSection={activeSection} onNavigate={(section) => navigate(section)} onClose={() => setMobileNavOpen(false)} />

      {retainedModal?.kind === 'worker' && <WorkerFormModal open={modal?.kind === 'worker'} record={retainedModal.record} onClose={closeModal} />}
      {retainedModal?.kind === 'project' && <ProjectFormModal open={modal?.kind === 'project'} record={retainedModal.record} onClose={closeModal} />}
      {retainedModal?.kind === 'workEntry' && (
        <WorkEntryFormModal open={modal?.kind === 'workEntry'} record={retainedModal.record} defaults={retainedModal.defaults} onClose={closeModal} />
      )}
      {retainedModal?.kind === 'transaction' && (
        <TransactionFormModal open={modal?.kind === 'transaction'} record={retainedModal.record} defaults={retainedModal.defaults} onClose={closeModal} />
      )}
      {retainedModal?.kind === 'expense' && (
        <ExpenseFormModal open={modal?.kind === 'expense'} record={retainedModal.record} defaults={retainedModal.defaults} onClose={closeModal} />
      )}
      {retainedModal?.kind === 'material' && <MaterialFormModal open={modal?.kind === 'material'} record={retainedModal.record} onClose={closeModal} />}
      {retainedModal?.kind === 'stock' && (
        <StockMovementModal
          open={modal?.kind === 'stock'}
          material={modal?.kind === 'stock' ? modal.material : retainedModal.material}
          movementType={retainedModal.movementType}
          onClose={closeModal}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${retainedDelete?.label ?? 'record'}?`}
        description={retainedDelete?.description ?? 'This record will be permanently removed from the prototype.'}
        confirmLabel="Delete"
        tone="danger"
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </ErpContext.Provider>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <NirmaanERPApp />
    </ToastProvider>
  );
}