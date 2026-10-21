'use strict';

const STORAGE_KEY = 'motocare_data_v1';
const THEME_KEY = 'motocare_theme';
const SIDEBAR_KEY = 'motocare_sidebar_collapsed';
const DEMO_FLAG_KEY = 'motocare_demo_seeded';
const PAGE_SIZE = 8;

// Catatan: localStorage hanya menyimpan data pada browser dan perangkat ini.
// Data MotoCare belum tersinkronisasi antarperangkat atau antar-browser.

const PAGES = {
  dashboard: { title: 'Dashboard', icon: 'dashboard' },
  services: { title: 'Servis', icon: 'wrench' },
  customers: { title: 'Pelanggan', icon: 'users' },
  vehicles: { title: 'Kendaraan', icon: 'motorcycle' },
  inventory: { title: 'Suku Cadang', icon: 'package' },
  reports: { title: 'Laporan', icon: 'chart' },
  settings: { title: 'Pengaturan', icon: 'settings' }
};

const SERVICE_STATUSES = [
  'Menunggu',
  'Sedang Dikerjakan',
  'Menunggu Suku Cadang',
  'Siap Diambil',
  'Selesai',
  'Dibatalkan'
];

const STATUS_META = {
  'Menunggu': { badge: 'badge-warning', select: 'status-waiting' },
  'Sedang Dikerjakan': { badge: 'badge-info', select: 'status-working' },
  'Menunggu Suku Cadang': { badge: 'badge-orange', select: 'status-parts' },
  'Siap Diambil': { badge: 'badge-success', select: 'status-ready' },
  'Selesai': { badge: 'badge-neutral', select: 'status-completed' },
  'Dibatalkan': { badge: 'badge-danger', select: 'status-cancelled' }
};

const PAYMENT_META = {
  'Belum Dibayar': 'badge-danger',
  'Dibayar Sebagian': 'badge-warning',
  'Lunas': 'badge-success'
};

const PAYMENT_METHODS = ['Tunai', 'Transfer', 'QRIS'];
const PART_CATEGORIES = ['Oli', 'Rem', 'Mesin', 'Kelistrikan', 'Transmisi', 'Lainnya'];
const BRAND_SUGGESTIONS = ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Lainnya'];
const JOB_SUGGESTIONS = [
  'Ganti Oli',
  'Servis Rutin',
  'Ganti Kampas Rem',
  'Pemeriksaan CVT',
  'Ganti Busi',
  'Tune Up Mesin',
  'Servis Kelistrikan',
  'Ganti Filter Udara'
];

const ICONS = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  motorcycle: '<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M5.5 17.5h4.2l3.2-6h3.4"/><path d="M9.7 17.5h4.4l2.4-4"/><path d="M14 7h3.2l1.3 6.5"/><path d="M14 7l-1.2 4.5"/>',
  package: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="m9 13 9-5"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15v3"/><path d="M12 10v8"/><path d="M17 6v12"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'panel-left': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m14 9-3 3 3 3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  'alert-triangle': '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.4 2.4 4.6-4.8"/>',
  printer: '<path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  wallet: '<path d="M20 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5"/><path d="M16 12h.01"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  refresh: '<path d="M20 11a8.1 8.1 0 0 0-14.9-4L3 10"/><path d="M3 5v5h5"/><path d="M4 13a8.1 8.1 0 0 0 14.9 4L21 14"/><path d="M21 19v-5h-5"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  inbox: '<path d="M4 4h16l2 10v6H2v-6Z"/><path d="M2 14h6l2 3h4l2-3h6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2Z"/>',
  'map-pin': '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  minus: '<path d="M5 12h14"/>',
  'plus-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 8v8"/><path d="M8 12h8"/>',
  circle: '<circle cx="12" cy="12" r="9"/>'
};

const DATE_FORMAT = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
const LONG_DATE_FORMAT = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const SHORT_DAY_FORMAT = new Intl.DateTimeFormat('id-ID', { weekday: 'short' });
const MONTH_YEAR_FORMAT = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });
const NUMBER_FORMAT = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

const state = {
  data: null,
  currentPage: 'dashboard',
  servicesUI: { search: '', status: '', payment: '', date: '', mechanic: '', sort: 'newest', page: 1 },
  customersUI: { search: '' },
  vehiclesUI: { search: '', brand: '' },
  inventoryUI: { search: '', category: '' },
  reportUI: { range: 'month', from: '', to: '' },
  mechanicDraft: [],
  confirmAction: null,
  confirmExpected: '',
  lastFocused: null,
  activeModalType: null,
  activeServiceId: null,
  startupNotice: ''
};

const els = {};

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, function (character) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[character];
  });
}

function icon(name, className) {
  const paths = ICONS[name] || ICONS.circle;
  return '<svg class="icon' + (className ? ' ' + className : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
}

function hydrateStaticIcons() {
  document.querySelectorAll('[data-icon]').forEach(function (node) {
    node.innerHTML = icon(node.dataset.icon);
  });
}

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : (fallback ?? 0);
}

function roundMoney(value) {
  return Math.round(parseNumber(value, 0));
}

function roundQuantity(value) {
  return Math.round(parseNumber(value, 0) * 100) / 100;
}

function padNumber(value, length) {
  return String(value).padStart(length, '0');
}

function uniqueId(prefix) {
  const random = Math.random().toString(36).slice(2, 8);
  return prefix + '-' + Date.now().toString(36) + '-' + random;
}

function nextSequentialId(prefix, items) {
  let highest = 0;
  items.forEach(function (item) {
    const id = String(item && item.id ? item.id : '');
    if (!id.startsWith(prefix)) return;
    const suffix = parseInt(id.slice(prefix.length), 10);
    if (Number.isFinite(suffix) && suffix > highest) highest = suffix;
  });
  return prefix + padNumber(highest + 1, 3);
}

function formatCurrency(value) {
  const amount = roundMoney(value);
  if (amount < 0) return '-Rp ' + NUMBER_FORMAT.format(Math.abs(amount));
  return 'Rp ' + NUMBER_FORMAT.format(amount);
}

function formatQuantity(value) {
  return NUMBER_FORMAT.format(roundQuantity(value));
}

function formatCompactCurrency(value) {
  const amount = roundMoney(value);
  if (amount >= 1000000000) return 'Rp ' + NUMBER_FORMAT.format(amount / 1000000000) + ' M';
  if (amount >= 1000000) return 'Rp ' + NUMBER_FORMAT.format(amount / 1000000) + ' jt';
  if (amount >= 1000) return 'Rp ' + NUMBER_FORMAT.format(amount / 1000) + ' rb';
  return formatCurrency(amount);
}

function localDateISO(date) {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1, 2);
  const day = padNumber(date.getDate(), 2);
  return year + '-' + month + '-' + day;
}

function todayISO() {
  return localDateISO(new Date());
}

function parseISODate(value) {
  if (!value || typeof value !== 'string') return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return null;
  if (date.getFullYear() !== Number(match[1]) || date.getMonth() !== Number(match[2]) - 1 || date.getDate() !== Number(match[3])) return null;
  return date;
}

function isValidISODate(value) {
  return Boolean(parseISODate(value));
}

function addDaysISO(value, days) {
  const date = parseISODate(value) || new Date();
  date.setDate(date.getDate() + days);
  return localDateISO(date);
}

function startOfWeekISO(value) {
  const date = parseISODate(value) || new Date();
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return localDateISO(date);
}

function endOfWeekISO(value) {
  return addDaysISO(startOfWeekISO(value), 6);
}

function startOfMonthISO(value) {
  const date = parseISODate(value) || new Date();
  return date.getFullYear() + '-' + padNumber(date.getMonth() + 1, 2) + '-01';
}

function endOfMonthISO(value) {
  const date = parseISODate(value) || new Date();
  return localDateISO(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

function formatDate(value) {
  const date = parseISODate(value);
  return date ? DATE_FORMAT.format(date) : '—';
}

function formatLongDate(value) {
  const date = parseISODate(value);
  return date ? LONG_DATE_FORMAT.format(date) : '—';
}

function formatShortDay(value) {
  const date = parseISODate(value);
  return date ? SHORT_DAY_FORMAT.format(date) : '—';
}

function formatMonthYear(value) {
  const date = parseISODate(value);
  return date ? MONTH_YEAR_FORMAT.format(date) : '—';
}

function formatChartDate(value) {
  const date = parseISODate(value);
  if (!date) return '—';
  return padNumber(date.getDate(), 2) + '/' + padNumber(date.getMonth() + 1, 2);
}

function atTime(dateISO, time) {
  const date = parseISODate(dateISO) || new Date();
  const parts = time.split(':');
  date.setHours(Number(parts[0]) || 0, Number(parts[1]) || 0, 0, 0);
  return date.toISOString();
}

function normalizePlate(value) {
  const compact = String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!compact) return '';
  const match = compact.match(/^([A-Z]{1,2})(\d{1,4})([A-Z]{0,3})$/);
  if (match) return [match[1], match[2], match[3]].filter(Boolean).join(' ');
  return compact;
}

function plateKey(value) {
  return normalizePlate(value).replace(/\s+/g, '');
}

function isValidPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

function serviceStatusMeta(status) {
  return STATUS_META[status] || STATUS_META['Menunggu'];
}

function getCustomer(id) {
  return state.data.customers.find(function (customer) { return customer.id === id; }) || null;
}

function getVehicle(id) {
  return state.data.vehicles.find(function (vehicle) { return vehicle.id === id; }) || null;
}

function getPart(id) {
  return state.data.parts.find(function (part) { return part.id === id; }) || null;
}

function getService(id) {
  return state.data.services.find(function (service) { return service.id === id; }) || null;
}

function getCustomerName(id) {
  const customer = getCustomer(id);
  return customer ? customer.name : 'Pelanggan tidak ditemukan';
}

function getVehicleForService(service) {
  return service ? getVehicle(service.vehicleId) : null;
}

function getCustomerForService(service) {
  return service ? getCustomer(service.customerId) : null;
}

function isActiveService(service) {
  return Boolean(service) && service.status !== 'Selesai' && service.status !== 'Dibatalkan';
}

function calculateServiceTotal(service) {
  if (!service || !Array.isArray(service.items)) return 0;
  return service.items.reduce(function (total, item) {
    return total + roundMoney(parseNumber(item.qty, 0) * parseNumber(item.unitPrice, 0));
  }, 0);
}

function calculatePaidTotal(service) {
  if (!service || !Array.isArray(service.payments)) return 0;
  return service.payments.reduce(function (total, payment) {
    return total + roundMoney(payment.amount);
  }, 0);
}

function getRemainingBalance(service) {
  return Math.max(0, calculateServiceTotal(service) - calculatePaidTotal(service));
}

function calculatePaymentStatus(service) {
  const total = calculateServiceTotal(service);
  const paid = calculatePaidTotal(service);
  if (total <= 0) return 'Lunas';
  if (paid <= 0) return 'Belum Dibayar';
  if (paid >= total) return 'Lunas';
  return 'Dibayar Sebagian';
}

function sortedServices(services) {
  return services.slice().sort(function (a, b) {
    return String(b.entryDate || '').localeCompare(String(a.entryDate || '')) ||
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
}

function sortedPayments(service) {
  if (!service || !Array.isArray(service.payments)) return [];
  return service.payments.slice().sort(function (a, b) {
    return String(b.date || '').localeCompare(String(a.date || '')) ||
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
}

function getCustomerVehicles(customerId) {
  return state.data.vehicles
    .filter(function (vehicle) { return vehicle.customerId === customerId; })
    .sort(function (a, b) { return String(a.plate || '').localeCompare(String(b.plate || ''), 'id'); });
}

function getCustomerServices(customerId) {
  return sortedServices(state.data.services.filter(function (service) { return service.customerId === customerId; }));
}

function getVehicleServices(vehicleId) {
  return sortedServices(state.data.services.filter(function (service) { return service.vehicleId === vehicleId; }));
}

function getAttentionGroups() {
  const today = todayISO();
  const active = state.data.services.filter(isActiveService);
  return {
    overdue: active
      .filter(function (service) { return service.estimateDate && service.estimateDate < today; })
      .sort(function (a, b) { return String(a.estimateDate).localeCompare(String(b.estimateDate)); }),
    ready: sortedServices(active.filter(function (service) { return service.status === 'Siap Diambil'; })),
    waiting: sortedServices(active.filter(function (service) { return service.status === 'Menunggu'; }))
  };
}

function getServicePartUsage(service) {
  const usage = new Map();
  if (!service || service.status === 'Dibatalkan' || !Array.isArray(service.items)) return usage;
  service.items.forEach(function (item) {
    if (item.type !== 'part' || !item.partId) return;
    const quantity = roundQuantity(item.qty);
    if (quantity <= 0) return;
    usage.set(item.partId, roundQuantity((usage.get(item.partId) || 0) + quantity));
  });
  return usage;
}

function applyStockDifference(oldService, newService) {
  const oldUsage = getServicePartUsage(oldService);
  const newUsage = getServicePartUsage(newService);
  const partIds = new Set(Array.from(oldUsage.keys()).concat(Array.from(newUsage.keys())));
  const changes = [];

  partIds.forEach(function (partId) {
    const oldQuantity = roundQuantity(oldUsage.get(partId) || 0);
    const newQuantity = roundQuantity(newUsage.get(partId) || 0);
    const difference = roundQuantity(newQuantity - oldQuantity);
    if (difference === 0) return;

    const part = getPart(partId);
    if (!part) {
      if (difference > 0) throw new Error('Suku cadang yang dipilih tidak ditemukan.');
      return;
    }

    if (difference > 0 && roundQuantity(part.stock) < difference) {
      throw new Error('Stok ' + part.name + ' tidak mencukupi. Tersedia ' + formatQuantity(part.stock) + ' ' + (part.unit || 'unit') + '.');
    }

    changes.push({ part: part, difference: difference, partId: partId });
  });

  changes.forEach(function (change) {
    change.part.stock = roundQuantity(change.part.stock - change.difference);
    const service = newService || oldService;
    state.data.stockLogs.push({
      id: uniqueId('STK'),
      partId: change.partId,
      delta: roundQuantity(-change.difference),
      reason: change.difference > 0 ? 'Penggunaan servis ' + (service ? service.number : '') : 'Pengembalian stok servis ' + (service ? service.number : ''),
      serviceId: service ? service.id : '',
      date: todayISO(),
      createdAt: new Date().toISOString()
    });
  });
}

function updateVehicleOdometer(vehicleId, km) {
  const vehicle = getVehicle(vehicleId);
  const value = parseNumber(km, 0);
  if (!vehicle || value <= 0) return;
  if (!vehicle.lastKm || value > parseNumber(vehicle.lastKm, 0)) vehicle.lastKm = roundMoney(value);
}

function saveData() {
  const saved = storage.set(STORAGE_KEY, JSON.stringify(state.data));
  if (!saved) {
    showToast('danger', 'Data belum tersimpan', 'Penyimpanan browser tidak tersedia atau kapasitas penuh.');
  }
  return saved;
}

function createEmptyData() {
  return {
    version: 1,
    customers: [],
    vehicles: [],
    services: [],
    parts: [],
    stockLogs: [],
    settings: {
      workshopName: 'MotoCare',
      address: 'Jl. Raya Mekanik No. 88, Bandung',
      phone: '0812-3456-7890',
      mechanics: ['Budi Santoso', 'Agus Wijaya', 'Rahmat Hidayat']
    },
    meta: {
      createdAt: new Date().toISOString()
    }
  };
}

function normalizeData(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Struktur data tidak valid.');

  const normalized = createEmptyData();
  normalized.customers = Array.isArray(raw.customers) ? raw.customers.filter(function (customer) {
    return customer && typeof customer === 'object' && customer.id && customer.name;
  }).map(function (customer) {
    return {
      id: String(customer.id),
      name: String(customer.name),
      phone: String(customer.phone || ''),
      address: String(customer.address || ''),
      notes: String(customer.notes || ''),
      createdAt: String(customer.createdAt || new Date().toISOString())
    };
  }) : [];

  normalized.vehicles = Array.isArray(raw.vehicles) ? raw.vehicles.filter(function (vehicle) {
    return vehicle && typeof vehicle === 'object' && vehicle.id && vehicle.customerId && vehicle.plate;
  }).map(function (vehicle) {
    return {
      id: String(vehicle.id),
      customerId: String(vehicle.customerId),
      plate: normalizePlate(vehicle.plate),
      brand: String(vehicle.brand || 'Lainnya'),
      model: String(vehicle.model || ''),
      year: vehicle.year === null || vehicle.year === undefined || vehicle.year === '' ? null : parseNumber(vehicle.year, null),
      lastKm: vehicle.lastKm === null || vehicle.lastKm === undefined || vehicle.lastKm === '' ? null : parseNumber(vehicle.lastKm, null),
      notes: String(vehicle.notes || ''),
      createdAt: String(vehicle.createdAt || new Date().toISOString())
    };
  }) : [];

  normalized.parts = Array.isArray(raw.parts) ? raw.parts.filter(function (part) {
    return part && typeof part === 'object' && part.id && part.name;
  }).map(function (part) {
    return {
      id: String(part.id),
      code: String(part.code || ''),
      name: String(part.name),
      category: PART_CATEGORIES.includes(part.category) ? part.category : 'Lainnya',
      stock: Math.max(0, roundQuantity(part.stock)),
      unit: String(part.unit || 'pcs'),
      price: Math.max(0, roundMoney(part.price)),
      minStock: Math.max(0, roundQuantity(part.minStock)),
      createdAt: String(part.createdAt || new Date().toISOString())
    };
  }) : [];

  normalized.services = Array.isArray(raw.services) ? raw.services.filter(function (service) {
    return service && typeof service === 'object' && service.id && service.customerId && service.vehicleId;
  }).map(function (service, index) {
    const entryDate = isValidISODate(service.entryDate) ? service.entryDate : todayISO();
    const estimateDate = isValidISODate(service.estimateDate) ? service.estimateDate : entryDate;
    const fallbackNumber = 'MC-' + entryDate.replace(/-/g, '') + '-' + padNumber(index + 1, 3);
    return {
      id: String(service.id),
      number: String(service.number || fallbackNumber),
      customerId: String(service.customerId),
      vehicleId: String(service.vehicleId),
      entryDate: entryDate,
      estimateDate: estimateDate,
      km: service.km === null || service.km === undefined || service.km === '' ? null : Math.max(0, roundMoney(service.km)),
      complaint: String(service.complaint || ''),
      diagnosis: String(service.diagnosis || ''),
      mechanic: String(service.mechanic || ''),
      notes: String(service.notes || ''),
      status: SERVICE_STATUSES.includes(service.status) ? service.status : 'Menunggu',
      items: Array.isArray(service.items) ? service.items.filter(function (item) {
        return item && typeof item === 'object' && item.name;
      }).map(function (item) {
        return {
          id: String(item.id || uniqueId('ITM')),
          name: String(item.name),
          type: item.type === 'part' ? 'part' : 'service',
          qty: Math.max(0, roundQuantity(item.qty)),
          unitPrice: Math.max(0, roundMoney(item.unitPrice)),
          partId: item.partId ? String(item.partId) : ''
        };
      }) : [],
      payments: Array.isArray(service.payments) ? service.payments.filter(function (payment) {
        return payment && typeof payment === 'object';
      }).map(function (payment) {
        const date = isValidISODate(payment.date) ? payment.date : todayISO();
        return {
          id: String(payment.id || uniqueId('PAY')),
          amount: Math.max(0, roundMoney(payment.amount)),
          date: date,
          method: PAYMENT_METHODS.includes(payment.method) ? payment.method : 'Tunai',
          notes: String(payment.notes || ''),
          createdAt: String(payment.createdAt || new Date().toISOString())
        };
      }) : [],
      createdAt: String(service.createdAt || new Date().toISOString()),
      updatedAt: String(service.updatedAt || service.createdAt || new Date().toISOString())
    };
  }) : [];

  const settings = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
  normalized.settings = {
    workshopName: String(settings.workshopName || 'MotoCare'),
    address: String(settings.address || ''),
    phone: String(settings.phone || ''),
    mechanics: Array.isArray(settings.mechanics)
      ? settings.mechanics.filter(function (mechanic) { return typeof mechanic === 'string' && mechanic.trim(); }).map(function (mechanic) { return mechanic.trim(); })
      : createEmptyData().settings.mechanics
  };

  normalized.stockLogs = Array.isArray(raw.stockLogs) ? raw.stockLogs.filter(function (log) {
    return log && typeof log === 'object';
  }).map(function (log) {
    return {
      id: String(log.id || uniqueId('STK')),
      partId: String(log.partId || ''),
      delta: roundQuantity(log.delta),
      reason: String(log.reason || ''),
      serviceId: String(log.serviceId || ''),
      date: String(log.date || todayISO()),
      createdAt: String(log.createdAt || new Date().toISOString())
    };
  }) : [];

  normalized.meta = raw.meta && typeof raw.meta === 'object' ? raw.meta : normalized.meta;
  return normalized;
}

function nextServiceNumber(entryDate, services) {
  const list = services || state.data.services;
  const datePart = String(entryDate || todayISO()).replace(/-/g, '');
  const prefix = 'MC-' + datePart + '-';
  let highest = 0;
  list.forEach(function (service) {
    const number = String(service.number || '');
    if (!number.startsWith(prefix)) return;
    const suffix = parseInt(number.slice(prefix.length), 10);
    if (Number.isFinite(suffix) && suffix > highest) highest = suffix;
  });
  return prefix + padNumber(highest + 1, 3);
}

function buildDemoData() {
  const today = todayISO();
  const customers = [
    { id: 'CUST-001', name: 'Andi Pratama', phone: '0812-3400-1122', address: 'Jl. Cendana No. 14, Bandung', notes: 'Pelanggan rutin servis bulanan.', createdAt: new Date().toISOString() },
    { id: 'CUST-002', name: 'Rizky Saputra', phone: '0813-2211-4455', address: 'Jl. Kencana Raya No. 7, Bandung', notes: '', createdAt: new Date().toISOString() },
    { id: 'CUST-003', name: 'Dimas Firmansyah', phone: '0821-9988-7766', address: 'Jl. Sukamaju No. 21, Bandung', notes: 'Menyukai konfirmasi melalui WhatsApp.', createdAt: new Date().toISOString() }
  ];
  const vehicles = [
    { id: 'VHC-001', customerId: 'CUST-001', plate: 'B 1842 DEMO', brand: 'Honda', model: 'Beat', year: 2020, lastKm: 28450, notes: 'Warna hitam, servis rutin.', createdAt: new Date().toISOString() },
    { id: 'VHC-002', customerId: 'CUST-002', plate: 'AB 7312 DEMO', brand: 'Yamaha', model: 'NMAX', year: 2022, lastKm: 12300, notes: '', createdAt: new Date().toISOString() },
    { id: 'VHC-003', customerId: 'CUST-003', plate: 'D 9021 DEMO', brand: 'Honda', model: 'Vario', year: 2019, lastKm: 41200, notes: 'Gunakan oli mesin sintetik.', createdAt: new Date().toISOString() }
  ];
  const parts = [
    { id: 'PRT-001', code: 'OLI-001', name: 'Oli Mesin MPX2', category: 'Oli', stock: 24, unit: 'Botol', price: 55000, minStock: 5, createdAt: new Date().toISOString() },
    { id: 'PRT-002', code: 'BUS-001', name: 'Busi Iridium', category: 'Mesin', stock: 12, unit: 'Pcs', price: 35000, minStock: 3, createdAt: new Date().toISOString() },
    { id: 'PRT-003', code: 'REM-001', name: 'Kampas Rem Depan', category: 'Rem', stock: 8, unit: 'Set', price: 65000, minStock: 3, createdAt: new Date().toISOString() },
    { id: 'PRT-004', code: 'FIL-001', name: 'Filter Udara', category: 'Mesin', stock: 5, unit: 'Pcs', price: 45000, minStock: 5, createdAt: new Date().toISOString() }
  ];
  const mechanics = ['Budi Santoso', 'Agus Wijaya', 'Rahmat Hidayat'];
  const services = [];
  const stockLogs = [];

  function demoItem(name, type, qty, unitPrice, partId) {
    return { id: uniqueId('ITM'), name: name, type: type, qty: qty, unitPrice: unitPrice, partId: partId || '' };
  }

  function addDemoService(config) {
    const service = {
      id: nextSequentialId('SVC-', services),
      number: nextServiceNumber(config.entryDate, services),
      customerId: config.customerId,
      vehicleId: config.vehicleId,
      entryDate: config.entryDate,
      estimateDate: config.estimateDate,
      km: config.km,
      complaint: config.complaint,
      diagnosis: config.diagnosis || '',
      mechanic: config.mechanic,
      notes: config.notes || '',
      status: config.status,
      items: config.items,
      payments: (config.payments || []).map(function (payment) {
        return {
          id: uniqueId('PAY'),
          amount: payment.amount,
          date: payment.date,
          method: payment.method,
          notes: payment.notes || '',
          createdAt: atTime(payment.date, '10:30')
        };
      }),
      createdAt: atTime(config.entryDate, config.createdTime || '09:00'),
      updatedAt: atTime(config.entryDate, config.createdTime || '09:00')
    };
    services.push(service);
    return service;
  }

  addDemoService({
    customerId: 'CUST-001',
    vehicleId: 'VHC-001',
    entryDate: addDaysISO(today, -6),
    estimateDate: addDaysISO(today, -5),
    km: 28120,
    complaint: 'Minta ganti oli dan cek kondisi mesin.',
    diagnosis: 'Oli sudah waktunya diganti, kondisi mesin normal.',
    mechanic: 'Budi Santoso',
    notes: 'Servis selesai tepat waktu.',
    status: 'Selesai',
    createdTime: '08:45',
    items: [demoItem('Jasa Ganti Oli', 'service', 1, 25000), demoItem('Oli Mesin MPX2', 'part', 1, 55000, 'PRT-001')],
    payments: [{ amount: 80000, date: addDaysISO(today, -5), method: 'Tunai', notes: 'Pembayaran lunas.' }]
  });

  addDemoService({
    customerId: 'CUST-002',
    vehicleId: 'VHC-002',
    entryDate: addDaysISO(today, -3),
    estimateDate: addDaysISO(today, -2),
    km: 12080,
    complaint: 'Suara CVT kasar saat tarikan awal.',
    diagnosis: 'Perlu pembersihan CVT dan penggantian filter udara.',
    mechanic: 'Agus Wijaya',
    notes: '',
    status: 'Selesai',
    createdTime: '10:15',
    items: [demoItem('Jasa Servis CVT', 'service', 1, 120000), demoItem('Filter Udara', 'part', 1, 45000, 'PRT-004')],
    payments: [
      { amount: 100000, date: addDaysISO(today, -2), method: 'Transfer', notes: 'DP servis CVT.' },
      { amount: 65000, date: today, method: 'QRIS', notes: 'Pelunasan.' }
    ]
  });

  addDemoService({
    customerId: 'CUST-003',
    vehicleId: 'VHC-003',
    entryDate: addDaysISO(today, -4),
    estimateDate: addDaysISO(today, -3),
    km: 40980,
    complaint: 'Rem depan terasa kurang pakem.',
    diagnosis: 'Kampas rem depan aus, menunggu konfirmasi pelanggan.',
    mechanic: 'Rahmat Hidayat',
    notes: 'Pelanggan mencari kampas rem original.',
    status: 'Menunggu Suku Cadang',
    createdTime: '13:20',
    items: [demoItem('Jasa Ganti Kampas Rem', 'service', 1, 50000), demoItem('Kampas Rem Depan', 'part', 1, 65000, 'PRT-003')],
    payments: []
  });

  addDemoService({
    customerId: 'CUST-003',
    vehicleId: 'VHC-003',
    entryDate: addDaysISO(today, -2),
    estimateDate: today,
    km: 41150,
    complaint: 'Servis rutin dan cek rem belakang.',
    diagnosis: 'Kondisi rem belakang masih baik.',
    mechanic: 'Rahmat Hidayat',
    notes: 'Kendaraan sudah siap diambil.',
    status: 'Siap Diambil',
    createdTime: '09:40',
    items: [demoItem('Jasa Ganti Kampas Rem', 'service', 1, 50000), demoItem('Kampas Rem Depan', 'part', 1, 65000, 'PRT-003')],
    payments: [{ amount: 50000, date: today, method: 'Tunai', notes: 'Pembayaran sebagian.' }]
  });

  addDemoService({
    customerId: 'CUST-001',
    vehicleId: 'VHC-001',
    entryDate: addDaysISO(today, -2),
    estimateDate: addDaysISO(today, -1),
    km: 28340,
    complaint: 'Motor terasa bergetar saat kecepatan rendah.',
    diagnosis: 'Pemeriksaan kelistrikan dan karburator sedang dilakukan.',
    mechanic: 'Budi Santoso',
    notes: '',
    status: 'Sedang Dikerjakan',
    createdTime: '11:05',
    items: [demoItem('Jasa Tune Up Mesin', 'service', 1, 75000)],
    payments: []
  });

  addDemoService({
    customerId: 'CUST-002',
    vehicleId: 'VHC-002',
    entryDate: today,
    estimateDate: addDaysISO(today, 1),
    km: 12480,
    complaint: 'Servis rutin 12.000 km, minta cek busi.',
    diagnosis: '',
    mechanic: 'Agus Wijaya',
    notes: 'Menunggu antrean pengerjaan.',
    status: 'Menunggu',
    createdTime: '08:30',
    items: [demoItem('Jasa Servis Rutin', 'service', 1, 50000), demoItem('Busi Iridium', 'part', 1, 35000, 'PRT-002')],
    payments: []
  });

  services.forEach(function (service) {
    if (service.status === 'Dibatalkan') return;
    service.items.forEach(function (item) {
      if (item.type !== 'part' || !item.partId) return;
      const part = parts.find(function (entry) { return entry.id === item.partId; });
      if (!part) return;
      part.stock = roundQuantity(part.stock - item.qty);
      stockLogs.push({
        id: uniqueId('STK'),
        partId: part.id,
        delta: roundQuantity(-item.qty),
        reason: 'Penggunaan servis ' + service.number,
        serviceId: service.id,
        date: service.entryDate,
        createdAt: service.createdAt
      });
    });
  });

  return {
    version: 1,
    customers: customers,
    vehicles: vehicles,
    services: services,
    parts: parts,
    stockLogs: stockLogs,
    settings: {
      workshopName: 'MotoCare',
      address: 'Jl. Raya Mekanik No. 88, Bandung',
      phone: '0812-3456-7890',
      mechanics: mechanics
    },
    meta: {
      createdAt: new Date().toISOString(),
      demo: true
    }
  };
}

function loadData() {
  const raw = storage.get(STORAGE_KEY);
  const demoSeeded = storage.get(DEMO_FLAG_KEY) === 'true';

  if (raw === null) {
    if (!demoSeeded) {
      state.data = buildDemoData();
      storage.set(STORAGE_KEY, JSON.stringify(state.data));
      storage.set(DEMO_FLAG_KEY, 'true');
    } else {
      state.data = createEmptyData();
      storage.set(STORAGE_KEY, JSON.stringify(state.data));
    }
    return;
  }

  try {
    state.data = normalizeData(JSON.parse(raw));
    storage.set(DEMO_FLAG_KEY, 'true');
  } catch (error) {
    storage.set(STORAGE_KEY + '_corrupt_' + Date.now(), raw);
    state.data = createEmptyData();
    storage.set(STORAGE_KEY, JSON.stringify(state.data));
    storage.set(DEMO_FLAG_KEY, 'true');
    state.startupNotice = 'Data lokal sebelumnya tidak dapat dibaca. Cadangan dibuat dan aplikasi dimulai dengan data kosong.';
  }
}

function init() {
  els.sidebar = document.getElementById('sidebar');
  els.appContent = document.getElementById('app-content');
  els.pageTitle = document.getElementById('page-title');
  els.breadcrumbPage = document.getElementById('breadcrumb-page');
  els.currentDate = document.getElementById('current-date');
  els.modalRoot = document.getElementById('modal-root');
  els.modalPanel = document.getElementById('modal-panel');
  els.modalTitle = document.getElementById('modal-title');
  els.modalSubtitle = document.getElementById('modal-subtitle');
  els.modalBody = document.getElementById('modal-body');
  els.modalFooter = document.getElementById('modal-footer');
  els.toastContainer = document.getElementById('toast-container');
  els.globalSearch = document.getElementById('global-search');
  els.globalSearchResults = document.getElementById('global-search-results');
  els.notificationButton = document.getElementById('notification-button');
  els.notificationPopover = document.getElementById('notification-popover');
  els.notificationBadge = document.getElementById('notification-badge');
  els.printReceipt = document.getElementById('print-receipt');

  applyInitialTheme();
  loadData();
  hydrateStaticIcons();
  bindGlobalEvents();
  updateHeaderDate();
  updateThemeControls();

  if (storage.get(SIDEBAR_KEY) === 'true') {
    document.body.classList.add('sidebar-collapsed');
  }

  navigate('dashboard');

  if (state.startupNotice) {
    setTimeout(function () {
      showToast('warning', 'Perhatian data lokal', state.startupNotice);
    }, 250);
  }

  window.setInterval(updateHeaderDate, 60000);
}

function renderStatusBadge(status) {
  const meta = serviceStatusMeta(status);
  return '<span class="badge ' + meta.badge + '">' + escapeHtml(status) + '</span>';
}

function renderPaymentBadge(status) {
  return '<span class="badge ' + (PAYMENT_META[status] || 'badge-neutral') + '">' + escapeHtml(status) + '</span>';
}

function renderStatusControl(service, extraClass, label) {
  const meta = serviceStatusMeta(service.status);
  const options = SERVICE_STATUSES.map(function (status) {
    return '<option value="' + escapeHtml(status) + '"' + (status === service.status ? ' selected' : '') + '>' + escapeHtml(status) + '</option>';
  }).join('');
  return '<select class="status-select ' + meta.select + (extraClass ? ' ' + extraClass : '') + '" data-service-status data-id="' + escapeHtml(service.id) + '" aria-label="' + escapeHtml(label || 'Ubah status servis') + '">' + options + '</select>';
}

function renderEmptyState(iconName, title, description, actionHtml) {
  return '<div class="empty-state">' +
    '<span class="empty-state-icon">' + icon(iconName) + '</span>' +
    '<h3>' + escapeHtml(title) + '</h3>' +
    '<p>' + escapeHtml(description) + '</p>' +
    (actionHtml || '') +
    '</div>';
}

function updateHeaderDate() {
  if (!els.currentDate) return;
  els.currentDate.textContent = LONG_DATE_FORMAT.format(new Date());
}

function getStoredTheme() {
  return storage.get(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

function applyInitialTheme() {
  document.documentElement.dataset.theme = getStoredTheme();
  updateThemeMeta();
}

function updateThemeMeta() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  meta.setAttribute('content', document.documentElement.dataset.theme === 'dark' ? '#141814' : '#202522');
}

function setTheme(theme) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = nextTheme;
  storage.set(THEME_KEY, nextTheme);
  updateThemeControls();
  updateThemeMeta();
}

function toggleTheme() {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}

function updateThemeControls() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const label = document.querySelector('[data-theme-label]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const toggle = document.querySelector('[data-action="toggle-theme"]');

  if (label) label.textContent = dark ? 'Mode Terang' : 'Mode Gelap';
  if (themeIcon) themeIcon.innerHTML = icon(dark ? 'sun' : 'moon');
  if (toggle) {
    toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    toggle.setAttribute('aria-label', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
    toggle.setAttribute('title', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
  }

  document.querySelectorAll('[data-theme-choice]').forEach(function (button) {
    const isActive = button.dataset.themeChoice === (dark ? 'dark' : 'light');
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function updateChrome() {
  const page = PAGES[state.currentPage] || PAGES.dashboard;
  if (els.pageTitle) els.pageTitle.textContent = page.title;
  if (els.breadcrumbPage) els.breadcrumbPage.textContent = page.title;
  document.title = page.title + ' — MotoCare';
  document.querySelectorAll('[data-sidebar-nav]').forEach(function (button) {
    const active = button.dataset.sidebarNav === state.currentPage;
    button.classList.toggle('is-active', active);
    if (active) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  });
}

function navigate(page) {
  if (!PAGES[page]) page = 'dashboard';
  closeModal();
  closeGlobalSearch();
  closeNotificationPopover();
  closeDrawer();
  state.currentPage = page;
  updateChrome();
  renderCurrentPage();
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function renderCurrentPage() {
  switch (state.currentPage) {
    case 'services':
      renderServicesPage();
      break;
    case 'customers':
      renderCustomersPage();
      break;
    case 'vehicles':
      renderVehiclesPage();
      break;
    case 'inventory':
      renderInventoryPage();
      break;
    case 'reports':
      renderReportsPage();
      break;
    case 'settings':
      renderSettingsPage();
      break;
    case 'dashboard':
    default:
      renderDashboardPage();
  }
  updateHeaderNotifications();
}

function openDrawer() {
  if (window.innerWidth > 1100) return;
  document.body.classList.add('sidebar-open');
}

function closeDrawer() {
  document.body.classList.remove('sidebar-open');
}

function toggleSidebarCollapsed() {
  const collapsed = document.body.classList.toggle('sidebar-collapsed');
  storage.set(SIDEBAR_KEY, collapsed ? 'true' : 'false');
  const control = document.querySelector('[data-action="collapse-sidebar"]');
  if (control) {
    const label = control.querySelector('.nav-label');
    control.setAttribute('title', collapsed ? 'Perluas menu' : 'Ciutkan menu');
    control.setAttribute('aria-label', collapsed ? 'Perluas menu' : 'Ciutkan menu');
    if (label) label.textContent = collapsed ? 'Perluas Menu' : 'Ciutkan Menu';
  }
}

function updateHeaderNotifications() {
  if (!els.notificationBadge) return;
  const attention = getAttentionGroups();
  const count = attention.overdue.length + attention.ready.length + attention.waiting.length;
  els.notificationBadge.hidden = count === 0;
  els.notificationBadge.textContent = count > 99 ? '99+' : String(count);
  if (els.notificationButton) {
    els.notificationButton.setAttribute('aria-label', count > 0 ? 'Notifikasi, ' + count + ' servis perlu perhatian' : 'Notifikasi');
  }
}

function notificationItemHtml(service, type) {
  const customer = getCustomerForService(service);
  const vehicle = getVehicleForService(service);
  let iconName = 'clock';
  let tone = 'is-warning';
  let detail = 'Menunggu pengerjaan';

  if (type === 'overdue') {
    iconName = 'alert-triangle';
    tone = 'is-danger';
    detail = 'Terlambat · estimasi ' + formatDate(service.estimateDate);
  } else if (type === 'ready') {
    iconName = 'check-circle';
    tone = 'is-success';
    detail = 'Siap diambil · ' + (vehicle ? vehicle.plate : 'Kendaraan');
  } else {
    detail = 'Menunggu · ' + (vehicle ? vehicle.plate : 'Kendaraan');
  }

  return '<button class="notification-item" data-action="view-service" data-id="' + escapeHtml(service.id) + '">' +
    '<span class="notification-item-icon ' + tone + '">' + icon(iconName) + '</span>' +
    '<span class="notification-item-copy">' +
    '<strong>' + escapeHtml(service.number) + ' · ' + escapeHtml(customer ? customer.name : 'Pelanggan') + '</strong>' +
    '<span>' + escapeHtml(detail) + '</span>' +
    '</span>' +
    '</button>';
}

function renderNotificationContent() {
  if (!els.notificationPopover) return;
  const attention = getAttentionGroups();
  const total = attention.overdue.length + attention.ready.length + attention.waiting.length;
  let content = '<div class="notification-head"><div><h3>Perlu perhatian</h3><p>' +
    (total > 0 ? total + ' servis memerlukan tindak lanjut' : 'Semua servis terkendali') +
    '</p></div></div>';

  if (total === 0) {
    content += '<div class="notification-empty">Tidak ada servis terlambat, siap diambil, atau menunggu.</div>';
  } else {
    content += '<div class="notification-list">';
    if (attention.overdue.length) {
      content += '<div class="search-group-label">Terlambat (' + attention.overdue.length + ')</div>';
      attention.overdue.slice(0, 3).forEach(function (service) {
        content += notificationItemHtml(service, 'overdue');
      });
    }
    if (attention.ready.length) {
      content += '<div class="search-group-label">Siap diambil (' + attention.ready.length + ')</div>';
      attention.ready.slice(0, 3).forEach(function (service) {
        content += notificationItemHtml(service, 'ready');
      });
    }
    if (attention.waiting.length) {
      content += '<div class="search-group-label">Menunggu pengerjaan (' + attention.waiting.length + ')</div>';
      attention.waiting.slice(0, 3).forEach(function (service) {
        content += notificationItemHtml(service, 'waiting');
      });
    }
    content += '</div>';
  }

  els.notificationPopover.innerHTML = content;
}

function toggleNotificationPopover() {
  if (!els.notificationPopover || !els.notificationButton) return;
  if (els.notificationPopover.hidden) {
    closeGlobalSearch();
    renderNotificationContent();
    els.notificationPopover.hidden = false;
    els.notificationButton.setAttribute('aria-expanded', 'true');
  } else {
    closeNotificationPopover();
  }
}

function closeNotificationPopover() {
  if (!els.notificationPopover || !els.notificationButton) return;
  els.notificationPopover.hidden = true;
  els.notificationButton.setAttribute('aria-expanded', 'false');
}

function serviceSearchText(service) {
  const customer = getCustomerForService(service);
  const vehicle = getVehicleForService(service);
  return [
    service.number,
    service.complaint,
    service.mechanic,
    customer ? customer.name : '',
    customer ? customer.phone : '',
    vehicle ? vehicle.plate : '',
    vehicle ? vehicle.brand + ' ' + vehicle.model : ''
  ].join(' ').toLowerCase();
}

function vehicleSearchText(vehicle) {
  const customer = getCustomer(vehicle.customerId);
  return [vehicle.plate, vehicle.brand, vehicle.model, customer ? customer.name : ''].join(' ').toLowerCase();
}

function customerSearchText(customer) {
  return [customer.name, customer.phone, customer.address].join(' ').toLowerCase();
}

function partSearchText(part) {
  return [part.code, part.name, part.category].join(' ').toLowerCase();
}

function renderGlobalSearchResults(query) {
  if (!els.globalSearchResults || !els.globalSearch) return;
  const normalized = String(query || '').trim().toLowerCase();
  if (!normalized) {
    closeGlobalSearch();
    return;
  }

  const services = sortedServices(state.data.services).filter(function (service) {
    return serviceSearchText(service).includes(normalized);
  }).slice(0, 5);

  const customers = state.data.customers.filter(function (customer) {
    return customerSearchText(customer).includes(normalized);
  }).sort(function (a, b) { return a.name.localeCompare(b.name, 'id'); }).slice(0, 4);

  const vehicles = state.data.vehicles.filter(function (vehicle) {
    return vehicleSearchText(vehicle).includes(normalized);
  }).slice(0, 4);

  let content = '';

  if (services.length) {
    content += '<div class="search-group"><div class="search-group-label">Servis</div>';
    services.forEach(function (service) {
      const customer = getCustomerForService(service);
      const vehicle = getVehicleForService(service);
      content += '<button class="search-result" data-action="view-service" data-id="' + escapeHtml(service.id) + '">' +
        '<span class="search-result-icon">' + icon('wrench') + '</span>' +
        '<span class="search-result-copy"><strong>' + escapeHtml(service.number) + ' · ' + escapeHtml(customer ? customer.name : 'Pelanggan') + '</strong>' +
        '<span>' + escapeHtml(vehicle ? vehicle.plate + ' · ' + service.status : service.status) + '</span></span>' +
        '</button>';
    });
    content += '</div>';
  }

  if (customers.length) {
    content += '<div class="search-group"><div class="search-group-label">Pelanggan</div>';
    customers.forEach(function (customer) {
      content += '<button class="search-result" data-action="view-customer" data-id="' + escapeHtml(customer.id) + '">' +
        '<span class="search-result-icon">' + icon('user') + '</span>' +
        '<span class="search-result-copy"><strong>' + escapeHtml(customer.name) + '</strong><span>' + escapeHtml(customer.phone || 'Tanpa nomor telepon') + '</span></span>' +
        '</button>';
    });
    content += '</div>';
  }

  if (vehicles.length) {
    content += '<div class="search-group"><div class="search-group-label">Kendaraan</div>';
    vehicles.forEach(function (vehicle) {
      const customer = getCustomer(vehicle.customerId);
      content += '<button class="search-result" data-action="view-vehicle" data-id="' + escapeHtml(vehicle.id) + '">' +
        '<span class="search-result-icon">' + icon('motorcycle') + '</span>' +
        '<span class="search-result-copy"><strong>' + escapeHtml(vehicle.plate) + '</strong>' +
        '<span>' + escapeHtml(vehicle.brand + ' ' + vehicle.model + ' · ' + (customer ? customer.name : 'Pelanggan')) + '</span></span>' +
        '</button>';
    });
    content += '</div>';
  }

  if (!content) {
    content = '<div class="search-empty">Tidak ada hasil untuk "' + escapeHtml(query.trim()) + '".</div>';
  }

  content += '<button class="search-all" data-action="global-search-all">Lihat semua hasil di halaman Servis ' + icon('arrow-right') + '</button>';
  els.globalSearchResults.innerHTML = content;
  els.globalSearchResults.hidden = false;
  els.globalSearch.setAttribute('aria-expanded', 'true');
}

function closeGlobalSearch(clear) {
  if (!els.globalSearchResults || !els.globalSearch) return;
  els.globalSearchResults.hidden = true;
  els.globalSearch.setAttribute('aria-expanded', 'false');
  if (clear) els.globalSearch.value = '';
}

function runGlobalSearchAll() {
  if (!els.globalSearch) return;
  const query = els.globalSearch.value.trim();
  if (!query) return;
  state.servicesUI.search = query;
  state.servicesUI.page = 1;
  closeGlobalSearch(true);
  navigate('services');
}

function showToast(tone, title, message) {
  if (!els.toastContainer) return;
  const safeTone = ['success', 'danger', 'warning', 'info'].includes(tone) ? tone : 'info';
  const iconName = safeTone === 'success' ? 'check-circle' : safeTone === 'danger' ? 'alert-triangle' : safeTone === 'warning' ? 'alert-triangle' : 'info';
  const toast = document.createElement('div');
  toast.className = 'toast is-' + safeTone;
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<span class="toast-icon">' + icon(iconName) + '</span>' +
    '<div class="toast-copy"><strong>' + escapeHtml(title) + '</strong>' +
    (message ? '<span>' + escapeHtml(message) + '</span>' : '') +
    '</div>' +
    '<button class="toast-close" data-action="dismiss-toast" aria-label="Tutup notifikasi">' + icon('x') + '</button>';
  els.toastContainer.appendChild(toast);

  while (els.toastContainer.children.length > 4) {
    els.toastContainer.removeChild(els.toastContainer.firstElementChild);
  }

  window.setTimeout(function () {
    dismissToast(toast);
  }, 4500);
}

function dismissToast(toast) {
  if (!toast || !toast.parentElement || toast.classList.contains('is-hiding')) return;
  toast.classList.add('is-hiding');
  window.setTimeout(function () {
    if (toast.parentElement) toast.parentElement.removeChild(toast);
  }, 190);
}

function openModal(config) {
  if (!els.modalRoot || !els.modalPanel) return;
  if (els.modalRoot.hidden) {
    state.lastFocused = document.activeElement;
  }

  els.modalPanel.className = 'modal-panel' + (config.size ? ' ' + config.size : '');
  els.modalTitle.textContent = config.title || 'Detail';
  els.modalSubtitle.textContent = config.subtitle || '';
  els.modalBody.innerHTML = config.body || '';
  els.modalBody.scrollTop = 0;
  els.modalFooter.innerHTML = config.footer || '';
  els.modalFooter.hidden = !config.footer;
  els.modalRoot.hidden = false;
  document.body.classList.add('modal-open');
  state.activeModalType = config.type || null;
  state.activeServiceId = config.serviceId || null;

  window.setTimeout(function () {
    if (els.modalRoot.hidden) return;
    const autofocus = els.modalPanel.querySelector('[autofocus]');
    const firstField = els.modalPanel.querySelector('input:not([type="hidden"]), select, textarea');
    const closeButton = els.modalPanel.querySelector('.modal-close');
    const target = autofocus || firstField || closeButton;
    if (target) target.focus({ preventScroll: true });
  }, 30);
}

function closeModal() {
  if (!els.modalRoot || els.modalRoot.hidden) return;
  els.modalRoot.hidden = true;
  els.modalBody.innerHTML = '';
  els.modalFooter.innerHTML = '';
  els.modalFooter.hidden = true;
  els.modalPanel.className = 'modal-panel';
  document.body.classList.remove('modal-open');
  state.activeModalType = null;
  state.activeServiceId = null;
  state.confirmAction = null;
  state.confirmExpected = '';

  if (state.lastFocused && document.contains(state.lastFocused) && typeof state.lastFocused.focus === 'function') {
    state.lastFocused.focus({ preventScroll: true });
  }
  state.lastFocused = null;
}

function openConfirm(config) {
  state.confirmAction = config.onConfirm || null;
  state.confirmExpected = config.requireText || '';
  const body = '<div class="modal-message">' +
    '<span class="modal-message-icon ' + (config.tone === 'warning' ? 'is-warning' : '') + '">' + icon(config.icon || 'alert-triangle') + '</span>' +
    '<div class="modal-message-copy"><h3>' + escapeHtml(config.heading || 'Konfirmasi tindakan') + '</h3>' +
    '<p>' + (config.message || '') + '</p>' +
    (config.requireText ? '<div class="confirm-input-wrap"><div class="field"><label for="confirm-text">Ketik <strong>' + escapeHtml(config.requireText) + '</strong> untuk melanjutkan</label><input class="input" id="confirm-text" autocomplete="off" autofocus></div></div>' : '') +
    '</div></div>';

  const footer = '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
    '<button class="btn ' + (config.tone === 'warning' ? 'btn-primary' : 'btn-danger') + '" data-action="confirm-action"' + (config.requireText ? ' disabled' : '') + '>' + escapeHtml(config.confirmLabel || 'Hapus') + '</button>';

  openModal({
    title: config.title || 'Konfirmasi',
    subtitle: config.subtitle || '',
    body: body,
    footer: footer,
    size: 'modal-sm',
    type: 'confirm'
  });
}

function openInfoModal(config) {
  const body = '<div class="modal-message">' +
    '<span class="modal-message-icon is-neutral">' + icon(config.icon || 'info') + '</span>' +
    '<div class="modal-message-copy"><h3>' + escapeHtml(config.heading || 'Informasi') + '</h3>' +
    '<p>' + (config.message || '') + '</p></div></div>';
  openModal({
    title: config.title || 'Informasi',
    body: body,
    footer: '<button class="btn btn-secondary" data-action="close-modal">Tutup</button>',
    size: 'modal-sm',
    type: 'info'
  });
}

function showFormError(form, message, invalidElement) {
  if (!form) return;
  form.querySelectorAll('.is-invalid').forEach(function (element) {
    element.classList.remove('is-invalid');
  });
  const errorBox = form.querySelector('[data-form-error]');
  if (errorBox) {
    errorBox.hidden = false;
    errorBox.innerHTML = icon('alert-triangle') + '<span>' + escapeHtml(message) + '</span>';
    errorBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  if (invalidElement) {
    invalidElement.classList.add('is-invalid');
    if (typeof invalidElement.focus === 'function') invalidElement.focus({ preventScroll: true });
  }
}

function clearFormError(form) {
  if (!form) return;
  const errorBox = form.querySelector('[data-form-error]');
  if (errorBox) {
    errorBox.hidden = true;
    errorBox.innerHTML = '';
  }
  form.querySelectorAll('.is-invalid').forEach(function (element) {
    element.classList.remove('is-invalid');
  });
}

function lockForm(form) {
  if (!form) return false;
  if (form.dataset.submitting === 'true') return true;
  form.dataset.submitting = 'true';
  return false;
}

function unlockForm(form) {
  if (form) delete form.dataset.submitting;
}

function statCardHtml(label, value, iconName, tint, hint, isCurrency) {
  return '<article class="stat-card">' +
    '<span class="stat-icon ' + tint + '">' + icon(iconName) + '</span>' +
    '<div class="stat-copy"><span class="stat-label">' + escapeHtml(label) + '</span>' +
    '<strong class="stat-value' + (isCurrency ? ' is-currency' : '') + '">' + escapeHtml(value) + '</strong>' +
    (hint ? '<span class="stat-hint">' + escapeHtml(hint) + '</span>' : '') +
    '</div></article>';
}

function attentionItemHtml(service, type) {
  const customer = getCustomerForService(service);
  const vehicle = getVehicleForService(service);
  let detail = 'Menunggu pengerjaan';
  if (type === 'overdue') {
    detail = 'Terlambat · estimasi ' + formatDate(service.estimateDate);
  } else if (type === 'ready') {
    detail = (vehicle ? vehicle.plate : 'Kendaraan') + ' · siap diserahkan';
  } else {
    detail = (vehicle ? vehicle.plate : 'Kendaraan') + ' · ' + formatDate(service.entryDate);
  }

  return '<button class="attention-item" data-action="view-service" data-id="' + escapeHtml(service.id) + '">' +
    '<span class="attention-item-copy"><strong>' + escapeHtml(customer ? customer.name : 'Pelanggan') + '</strong>' +
    '<span>' + escapeHtml(service.number + ' · ' + detail) + '</span></span>' +
    icon('chevron-right') +
    '</button>';
}

function attentionCardHtml(type, title, iconName, tint, services, emptyText) {
  let list = '';
  if (services.length) {
    list = '<div class="attention-list">';
    services.slice(0, 3).forEach(function (service) {
      list += attentionItemHtml(service, type);
    });
    if (services.length > 3) {
      list += '<button class="attention-item" data-nav="services">' +
        '<span class="attention-item-copy"><strong>Lihat ' + (services.length - 3) + ' lainnya</strong><span>Buka halaman servis</span></span>' +
        icon('arrow-right') +
        '</button>';
    }
    list += '</div>';
  } else {
    list = '<div class="attention-empty">' + escapeHtml(emptyText) + '</div>';
  }

  return '<section class="attention-card">' +
    '<div class="attention-card-head"><span class="attention-icon ' + tint + '">' + icon(iconName) + '</span>' +
    '<h3>' + escapeHtml(title) + '</h3><span class="attention-count">' + services.length + '</span></div>' +
    list +
    '</section>';
}

function renderDashboardLatestTable(services) {
  if (!services.length) {
    return renderEmptyState('wrench', 'Belum ada servis', 'Servis baru akan muncul di sini setelah ditambahkan.', '<button class="btn btn-primary btn-sm" data-action="open-service-modal">' + icon('plus') + ' Mulai Servis Baru</button>');
  }

  const rows = services.slice(0, 5).map(function (service) {
    const customer = getCustomerForService(service);
    const vehicle = getVehicleForService(service);
    return '<tr>' +
      '<td data-label="Nomor"><span class="cell-primary service-number">' + escapeHtml(service.number) + '</span></td>' +
      '<td data-label="Pelanggan"><span class="cell-primary">' + escapeHtml(customer ? customer.name : '—') + '</span></td>' +
      '<td data-label="Kendaraan"><span class="cell-primary">' + escapeHtml(vehicle ? vehicle.model : '—') + '</span><span class="cell-sub">' + escapeHtml(vehicle ? vehicle.plate : '') + '</span></td>' +
      '<td data-label="Keluhan" class="complaint-cell" title="' + escapeHtml(service.complaint) + '">' + escapeHtml(service.complaint) + '</td>' +
      '<td data-label="Mekanik">' + escapeHtml(service.mechanic || '—') + '</td>' +
      '<td data-label="Total" class="cell-right cell-nowrap"><span class="cell-primary numeric">' + formatCurrency(calculateServiceTotal(service)) + '</span></td>' +
      '<td data-label="Status">' + renderStatusControl(service, '', 'Ubah status ' + service.number) + '</td>' +
      '<td data-label="Aksi" class="table-actions"><div class="row-actions">' +
      '<button class="icon-btn" data-action="view-service" data-id="' + escapeHtml(service.id) + '" title="Lihat detail" aria-label="Lihat detail ' + escapeHtml(service.number) + '">' + icon('eye') + '</button>' +
      '</div></td>' +
      '</tr>';
  }).join('');

  return '<div class="table-wrap"><table class="data-table">' +
    '<thead><tr><th>Nomor</th><th>Pelanggan</th><th>Kendaraan</th><th>Keluhan</th><th>Mekanik</th><th class="cell-right">Total</th><th>Status</th><th class="cell-right">Aksi</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>';
}

function renderDashboardPage() {
  const today = todayISO();
  const active = state.data.services.filter(isActiveService);
  const waiting = active.filter(function (service) { return service.status === 'Menunggu'; });
  const ready = active.filter(function (service) { return service.status === 'Siap Diambil'; });
  const revenueToday = state.data.services.reduce(function (total, service) {
    return total + (service.payments || []).reduce(function (sum, payment) {
      return payment.date === today ? sum + roundMoney(payment.amount) : sum;
    }, 0);
  }, 0);
  const latest = sortedServices(state.data.services).slice(0, 5);
  const attention = getAttentionGroups();

  els.appContent.innerHTML = '<div class="page-stack">' +
    '<div class="stats-grid">' +
    statCardHtml('Servis Aktif', String(active.length), 'wrench', 'tint-blue', 'Belum selesai atau dibatalkan') +
    statCardHtml('Menunggu Pengerjaan', String(waiting.length), 'clock', 'tint-amber', 'Servis dalam antrean') +
    statCardHtml('Siap Diambil', String(ready.length), 'check-circle', 'tint-green', 'Kendaraan siap diserahkan') +
    statCardHtml('Pendapatan Hari Ini', formatCurrency(revenueToday), 'wallet', 'tint-orange', 'Dari pembayaran yang diterima', true) +
    '</div>' +
    '<div class="dashboard-grid">' +
    '<section class="panel dashboard-latest">' +
    '<div class="panel-header"><div class="panel-heading"><h2>Servis terbaru</h2><p>Lima aktivitas servis terakhir</p></div>' +
    '<button class="btn-link" data-nav="services">Lihat Semua ' + icon('arrow-right') + '</button></div>' +
    '<div class="panel-body is-flush">' + renderDashboardLatestTable(latest) + '</div>' +
    '</section>' +
    '<div>' +
    '<div class="section-heading"><div><h2>Perlu perhatian</h2><p>Berdasarkan estimasi dan status aktual</p></div>' +
    '<span class="badge badge-neutral">' + (attention.overdue.length + attention.ready.length + attention.waiting.length) + ' item</span></div>' +
    '<div class="attention-panel">' +
    attentionCardHtml('overdue', 'Terlambat', 'alert-triangle', 'tint-red', attention.overdue, 'Tidak ada servis yang melewati estimasi.') +
    attentionCardHtml('ready', 'Siap diambil', 'check-circle', 'tint-green', attention.ready, 'Belum ada kendaraan yang siap diambil.') +
    attentionCardHtml('waiting', 'Menunggu', 'clock', 'tint-amber', attention.waiting, 'Tidak ada servis dalam antrean.') +
    '</div></div>' +
    '</div>' +
    '</div>';
}

function getFilteredCustomers() {
  const query = state.customersUI.search.trim().toLowerCase();
  return state.data.customers.filter(function (customer) {
    return !query || customerSearchText(customer).includes(query);
  }).sort(function (a, b) { return a.name.localeCompare(b.name, 'id'); });
}

function renderCustomersPage() {
  const total = state.data.customers.length;
  els.appContent.innerHTML = '<div class="page-stack">' +
    '<section class="toolbar-card"><div class="toolbar-main">' +
    '<div class="search-control"><span class="search-control-icon">' + icon('search') + '</span>' +
    '<input class="input" id="customer-search" type="search" placeholder="Cari nama atau nomor telepon..." value="' + escapeHtml(state.customersUI.search) + '" data-list-search="customers" aria-label="Cari pelanggan"></div>' +
    '<button class="btn btn-primary" data-action="open-customer-modal">' + icon('plus') + ' Pelanggan Baru</button>' +
    '</div></section>' +
    '<section class="panel"><div class="panel-header"><div class="panel-heading"><h2>Data pelanggan</h2><p id="customers-summary">' + total + ' pelanggan terdaftar</p></div></div>' +
    '<div id="customers-results"></div></section>' +
    '</div>';
  renderCustomersResults();
}

function renderCustomersResults() {
  const container = document.getElementById('customers-results');
  const summary = document.getElementById('customers-summary');
  if (!container) return;
  const customers = getFilteredCustomers();
  const total = state.data.customers.length;

  if (summary) {
    summary.textContent = state.customersUI.search.trim()
      ? customers.length + ' dari ' + total + ' pelanggan ditemukan'
      : total + ' pelanggan terdaftar';
  }

  if (!customers.length) {
    container.innerHTML = renderEmptyState(
      'users',
      total ? 'Pelanggan tidak ditemukan' : 'Belum ada pelanggan',
      total ? 'Coba kata kunci lain untuk menemukan pelanggan.' : 'Tambahkan pelanggan pertama untuk mulai membuat pesanan servis.',
      '<button class="btn btn-primary btn-sm" data-action="open-customer-modal">' + icon('plus') + ' Tambah Pelanggan</button>'
    );
    return;
  }

  const rows = customers.map(function (customer) {
    const vehicles = getCustomerVehicles(customer.id);
    const services = getCustomerServices(customer.id);
    return '<tr>' +
      '<td data-label="ID"><span class="cell-primary service-number">' + escapeHtml(customer.id) + '</span></td>' +
      '<td data-label="Nama"><span class="cell-primary">' + escapeHtml(customer.name) + '</span></td>' +
      '<td data-label="Telepon" class="cell-nowrap">' + escapeHtml(customer.phone || '—') + '</td>' +
      '<td data-label="Alamat" class="complaint-cell" title="' + escapeHtml(customer.address) + '">' + escapeHtml(customer.address || '—') + '</td>' +
      '<td data-label="Kendaraan">' + vehicles.length + '</td>' +
      '<td data-label="Servis">' + services.length + '</td>' +
      '<td data-label="Aksi" class="table-actions"><div class="row-actions">' +
      '<button class="icon-btn" data-action="view-customer" data-id="' + escapeHtml(customer.id) + '" title="Lihat detail" aria-label="Lihat detail ' + escapeHtml(customer.name) + '">' + icon('eye') + '</button>' +
      '<button class="icon-btn" data-action="edit-customer" data-id="' + escapeHtml(customer.id) + '" title="Edit pelanggan" aria-label="Edit ' + escapeHtml(customer.name) + '">' + icon('edit') + '</button>' +
      '<button class="icon-btn is-danger" data-action="delete-customer" data-id="' + escapeHtml(customer.id) + '" title="Hapus pelanggan" aria-label="Hapus ' + escapeHtml(customer.name) + '">' + icon('trash') + '</button>' +
      '</div></td></tr>';
  }).join('');

  container.innerHTML = '<div class="table-wrap"><table class="data-table">' +
    '<thead><tr><th>ID</th><th>Nama pelanggan</th><th>Telepon</th><th>Alamat</th><th>Kendaraan</th><th>Servis</th><th class="cell-right">Aksi</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>';
}

function getFilteredVehicles() {
  const query = state.vehiclesUI.search.trim().toLowerCase();
  return state.data.vehicles.filter(function (vehicle) {
    const matchesQuery = !query || vehicleSearchText(vehicle).includes(query);
    const matchesBrand = !state.vehiclesUI.brand || vehicle.brand === state.vehiclesUI.brand;
    return matchesQuery && matchesBrand;
  }).sort(function (a, b) { return String(a.plate).localeCompare(String(b.plate), 'id'); });
}

function renderVehiclesPage() {
  const brands = Array.from(new Set(state.data.vehicles.map(function (vehicle) { return vehicle.brand; }))).sort(function (a, b) { return a.localeCompare(b, 'id'); });
  const brandOptions = brands.map(function (brand) {
    return '<option value="' + escapeHtml(brand) + '"' + (state.vehiclesUI.brand === brand ? ' selected' : '') + '>' + escapeHtml(brand) + '</option>';
  }).join('');

  els.appContent.innerHTML = '<div class="page-stack">' +
    '<section class="toolbar-card"><div class="toolbar-main">' +
    '<div class="search-control"><span class="search-control-icon">' + icon('search') + '</span>' +
    '<input class="input" id="vehicle-search" type="search" placeholder="Cari nomor polisi atau pemilik..." value="' + escapeHtml(state.vehiclesUI.search) + '" data-list-search="vehicles" aria-label="Cari kendaraan"></div>' +
    '<button class="btn btn-primary" data-action="open-vehicle-modal">' + icon('plus') + ' Kendaraan Baru</button>' +
    '</div>' +
    '<div class="filters-row">' +
    '<select class="select" data-vehicle-filter="brand" aria-label="Filter merek">' +
    '<option value="">Semua merek</option>' + brandOptions + '</select>' +
    '</div></section>' +
    '<section class="panel"><div class="panel-header"><div class="panel-heading"><h2>Data kendaraan</h2><p id="vehicles-summary"></p></div></div>' +
    '<div id="vehicles-results"></div></section>' +
    '</div>';
  renderVehiclesResults();
}

function renderVehiclesResults() {
  const container = document.getElementById('vehicles-results');
  const summary = document.getElementById('vehicles-summary');
  if (!container) return;
  const vehicles = getFilteredVehicles();
  const total = state.data.vehicles.length;

  if (summary) {
    summary.textContent = (state.vehiclesUI.search.trim() || state.vehiclesUI.brand)
      ? vehicles.length + ' dari ' + total + ' kendaraan ditemukan'
      : total + ' kendaraan terdaftar';
  }

  if (!vehicles.length) {
    container.innerHTML = renderEmptyState(
      'motorcycle',
      total ? 'Kendaraan tidak ditemukan' : 'Belum ada kendaraan',
      total ? 'Coba ubah kata pencarian atau filter merek.' : 'Tambahkan kendaraan milik pelanggan untuk memulai servis.',
      '<button class="btn btn-primary btn-sm" data-action="open-vehicle-modal">' + icon('plus') + ' Tambah Kendaraan</button>'
    );
    return;
  }

  const rows = vehicles.map(function (vehicle) {
    const customer = getCustomer(vehicle.customerId);
    const serviceCount = getVehicleServices(vehicle.id).length;
    return '<tr>' +
      '<td data-label="Nomor polisi"><span class="cell-primary service-number">' + escapeHtml(vehicle.plate) + '</span><span class="cell-sub">' + escapeHtml(vehicle.id) + '</span></td>' +
      '<td data-label="Kendaraan"><span class="cell-primary">' + escapeHtml(vehicle.brand + ' ' + vehicle.model) + '</span></td>' +
      '<td data-label="Pelanggan"><span class="cell-primary">' + escapeHtml(customer ? customer.name : '—') + '</span><span class="cell-sub">' + escapeHtml(customer ? customer.phone : '') + '</span></td>' +
      '<td data-label="Tahun">' + escapeHtml(vehicle.year || '—') + '</td>' +
      '<td data-label="KM terakhir" class="vehicle-km">' + (vehicle.lastKm !== null && vehicle.lastKm !== undefined ? formatQuantity(vehicle.lastKm) + ' km' : '—') + '</td>' +
      '<td data-label="Servis">' + serviceCount + '</td>' +
      '<td data-label="Aksi" class="table-actions"><div class="row-actions">' +
      '<button class="icon-btn" data-action="view-vehicle" data-id="' + escapeHtml(vehicle.id) + '" title="Lihat detail" aria-label="Lihat detail ' + escapeHtml(vehicle.plate) + '">' + icon('eye') + '</button>' +
      '<button class="icon-btn" data-action="edit-vehicle" data-id="' + escapeHtml(vehicle.id) + '" title="Edit kendaraan" aria-label="Edit ' + escapeHtml(vehicle.plate) + '">' + icon('edit') + '</button>' +
      '<button class="icon-btn is-danger" data-action="delete-vehicle" data-id="' + escapeHtml(vehicle.id) + '" title="Hapus kendaraan" aria-label="Hapus ' + escapeHtml(vehicle.plate) + '">' + icon('trash') + '</button>' +
      '</div></td></tr>';
  }).join('');

  container.innerHTML = '<div class="table-wrap"><table class="data-table">' +
    '<thead><tr><th>Nomor polisi</th><th>Kendaraan</th><th>Pelanggan</th><th>Tahun</th><th>KM terakhir</th><th>Servis</th><th class="cell-right">Aksi</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>';
}

function getFilteredParts() {
  const query = state.inventoryUI.search.trim().toLowerCase();
  return state.data.parts.filter(function (part) {
    const matchesQuery = !query || partSearchText(part).includes(query);
    const matchesCategory = !state.inventoryUI.category || part.category === state.inventoryUI.category;
    return matchesQuery && matchesCategory;
  }).sort(function (a, b) { return a.name.localeCompare(b.name, 'id'); });
}

function getLowStockParts() {
  return state.data.parts.filter(function (part) {
    return roundQuantity(part.stock) <= roundQuantity(part.minStock);
  });
}

function renderInventoryPage() {
  const lowStock = getLowStockParts();
  const categoryOptions = PART_CATEGORIES.map(function (category) {
    return '<option value="' + escapeHtml(category) + '"' + (state.inventoryUI.category === category ? ' selected' : '') + '>' + escapeHtml(category) + '</option>';
  }).join('');

  els.appContent.innerHTML = '<div class="page-stack">' +
    (lowStock.length ? '<div class="inventory-summary">' + icon('alert-triangle') + '<span><strong>' + lowStock.length + ' suku cadang</strong> sudah mencapai atau berada di bawah stok minimum.</span></div>' : '') +
    '<section class="toolbar-card"><div class="toolbar-main">' +
    '<div class="search-control"><span class="search-control-icon">' + icon('search') + '</span>' +
    '<input class="input" id="inventory-search" type="search" placeholder="Cari kode atau nama suku cadang..." value="' + escapeHtml(state.inventoryUI.search) + '" data-list-search="inventory" aria-label="Cari suku cadang"></div>' +
    '<button class="btn btn-primary" data-action="open-part-modal">' + icon('plus') + ' Suku Cadang Baru</button>' +
    '</div>' +
    '<div class="filters-row"><select class="select" data-inventory-filter="category" aria-label="Filter kategori">' +
    '<option value="">Semua kategori</option>' + categoryOptions + '</select></div></section>' +
    '<section class="panel"><div class="panel-header"><div class="panel-heading"><h2>Inventaris suku cadang</h2><p id="inventory-summary"></p></div></div>' +
    '<div id="inventory-results"></div></section>' +
    '</div>';
  renderInventoryResults();
}

function renderInventoryResults() {
  const container = document.getElementById('inventory-results');
  const summary = document.getElementById('inventory-summary');
  if (!container) return;
  const parts = getFilteredParts();
  const total = state.data.parts.length;

  if (summary) {
    summary.textContent = (state.inventoryUI.search.trim() || state.inventoryUI.category)
      ? parts.length + ' dari ' + total + ' suku cadang ditemukan'
      : total + ' suku cadang terdaftar';
  }

  if (!parts.length) {
    container.innerHTML = renderEmptyState(
      'package',
      total ? 'Suku cadang tidak ditemukan' : 'Belum ada suku cadang',
      total ? 'Coba ubah kata pencarian atau filter kategori.' : 'Tambahkan suku cadang agar stok dapat terhubung dengan pekerjaan servis.',
      '<button class="btn btn-primary btn-sm" data-action="open-part-modal">' + icon('plus') + ' Tambah Suku Cadang</button>'
    );
    return;
  }

  const rows = parts.map(function (part) {
    const low = roundQuantity(part.stock) <= roundQuantity(part.minStock);
    return '<tr>' +
      '<td data-label="Kode"><span class="cell-primary service-number">' + escapeHtml(part.code || '—') + '</span></td>' +
      '<td data-label="Nama"><span class="cell-primary">' + escapeHtml(part.name) + '</span></td>' +
      '<td data-label="Kategori"><span class="badge badge-neutral">' + escapeHtml(part.category) + '</span></td>' +
      '<td data-label="Stok"><div class="stock-cell"><span class="stock-value">' + formatQuantity(part.stock) + ' ' + escapeHtml(part.unit) + '</span>' +
      (low ? '<span class="low-stock-label">' + icon('alert-triangle') + ' Stok menipis</span>' : '') + '</div></td>' +
      '<td data-label="Harga jual" class="cell-nowrap">' + formatCurrency(part.price) + '</td>' +
      '<td data-label="Stok minimum">' + formatQuantity(part.minStock) + ' ' + escapeHtml(part.unit) + '</td>' +
      '<td data-label="Status">' + (low ? '<span class="badge badge-warning">Stok menipis</span>' : '<span class="badge badge-success">Aman</span>') + '</td>' +
      '<td data-label="Aksi" class="table-actions"><div class="row-actions">' +
      '<button class="icon-btn" data-action="add-stock" data-id="' + escapeHtml(part.id) + '" title="Tambah stok" aria-label="Tambah stok ' + escapeHtml(part.name) + '">' + icon('plus-circle') + '</button>' +
      '<button class="icon-btn" data-action="edit-part" data-id="' + escapeHtml(part.id) + '" title="Edit suku cadang" aria-label="Edit ' + escapeHtml(part.name) + '">' + icon('edit') + '</button>' +
      '<button class="icon-btn is-danger" data-action="delete-part" data-id="' + escapeHtml(part.id) + '" title="Hapus suku cadang" aria-label="Hapus ' + escapeHtml(part.name) + '">' + icon('trash') + '</button>' +
      '</div></td></tr>';
  }).join('');

  container.innerHTML = '<div class="table-wrap"><table class="data-table">' +
    '<thead><tr><th>Kode</th><th>Nama suku cadang</th><th>Kategori</th><th>Stok</th><th>Harga jual</th><th>Stok minimum</th><th>Status</th><th class="cell-right">Aksi</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>';
}

function getMechanicsList() {
  const fromSettings = Array.isArray(state.data.settings.mechanics) ? state.data.settings.mechanics : [];
  const fromServices = state.data.services.map(function (service) { return service.mechanic; }).filter(Boolean);
  return Array.from(new Set(fromSettings.concat(fromServices))).sort(function (a, b) { return a.localeCompare(b, 'id'); });
}

function renderServicesPage() {
  const mechanics = getMechanicsList();
  const statusOptions = SERVICE_STATUSES.map(function (status) {
    return '<option value="' + escapeHtml(status) + '"' + (state.servicesUI.status === status ? ' selected' : '') + '>' + escapeHtml(status) + '</option>';
  }).join('');
  const paymentOptions = ['Belum Dibayar', 'Dibayar Sebagian', 'Lunas'].map(function (status) {
    return '<option value="' + escapeHtml(status) + '"' + (state.servicesUI.payment === status ? ' selected' : '') + '>' + escapeHtml(status) + '</option>';
  }).join('');
  const mechanicOptions = mechanics.map(function (mechanic) {
    return '<option value="' + escapeHtml(mechanic) + '"' + (state.servicesUI.mechanic === mechanic ? ' selected' : '') + '>' + escapeHtml(mechanic) + '</option>';
  }).join('');

  els.appContent.innerHTML = '<div class="page-stack">' +
    '<section class="toolbar-card"><div class="toolbar-main">' +
    '<div class="search-control"><span class="search-control-icon">' + icon('search') + '</span>' +
    '<input class="input" id="service-search" type="search" placeholder="Cari nomor, pelanggan, nopol, atau keluhan..." value="' + escapeHtml(state.servicesUI.search) + '" data-list-search="services" aria-label="Cari servis"></div>' +
    '<button class="btn btn-secondary btn-sm" data-action="reset-service-filters">' + icon('refresh') + ' Reset Filter</button>' +
    '</div>' +
    '<div class="filters-row">' +
    '<select class="select" data-service-filter="status" aria-label="Filter status servis"><option value="">Semua status</option>' + statusOptions + '</select>' +
    '<select class="select" data-service-filter="payment" aria-label="Filter status pembayaran"><option value="">Semua pembayaran</option>' + paymentOptions + '</select>' +
    '<select class="select" data-service-filter="mechanic" aria-label="Filter mekanik"><option value="">Semua mekanik</option>' + mechanicOptions + '</select>' +
    '<div class="filter-date-wrap"><span class="filter-label-mini">Tanggal</span><input class="input" type="date" value="' + escapeHtml(state.servicesUI.date) + '" data-service-filter="date" aria-label="Filter tanggal masuk"></div>' +
    '<select class="select" data-service-filter="sort" aria-label="Urutkan servis">' +
    '<option value="newest"' + (state.servicesUI.sort === 'newest' ? ' selected' : '') + '>Servis terbaru</option>' +
    '<option value="estimate"' + (state.servicesUI.sort === 'estimate' ? ' selected' : '') + '>Estimasi selesai</option>' +
    '<option value="total"' + (state.servicesUI.sort === 'total' ? ' selected' : '') + '>Total tertinggi</option>' +
    '</select>' +
    '</div></section>' +
    '<section class="panel"><div class="panel-header"><div class="panel-heading"><h2>Daftar servis</h2><p id="services-summary"></p></div>' +
    '<div class="panel-header-actions"><button class="btn btn-primary btn-sm" data-action="open-service-modal">' + icon('plus') + ' Servis Baru</button></div></div>' +
    '<div id="services-results"></div></section>' +
    '</div>';
  renderServicesResults();
}

function getFilteredServices() {
  const query = state.servicesUI.search.trim().toLowerCase();
  let services = state.data.services.filter(function (service) {
    const matchesQuery = !query || serviceSearchText(service).includes(query);
    const matchesStatus = !state.servicesUI.status || service.status === state.servicesUI.status;
    const matchesPayment = !state.servicesUI.payment || calculatePaymentStatus(service) === state.servicesUI.payment;
    const matchesDate = !state.servicesUI.date || service.entryDate === state.servicesUI.date;
    const matchesMechanic = !state.servicesUI.mechanic || service.mechanic === state.servicesUI.mechanic;
    return matchesQuery && matchesStatus && matchesPayment && matchesDate && matchesMechanic;
  });

  if (state.servicesUI.sort === 'estimate') {
    services.sort(function (a, b) {
      return String(a.estimateDate || '').localeCompare(String(b.estimateDate || '')) ||
        String(b.entryDate || '').localeCompare(String(a.entryDate || ''));
    });
  } else if (state.servicesUI.sort === 'total') {
    services.sort(function (a, b) {
      return calculateServiceTotal(b) - calculateServiceTotal(a);
    });
  } else {
    services = sortedServices(services);
  }
  return services;
}

function renderServicesResults() {
  const container = document.getElementById('services-results');
  const summary = document.getElementById('services-summary');
  if (!container) return;

  const filtered = getFilteredServices();
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  state.servicesUI.page = Math.min(Math.max(1, state.servicesUI.page), totalPages);
  const page = state.servicesUI.page;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  if (summary) {
    summary.textContent = total ? total + ' servis ditemukan' : 'Belum ada servis yang cocok';
  }

  if (!state.data.services.length) {
    container.innerHTML = renderEmptyState(
      'wrench',
      'Belum ada servis',
      'Mulai dengan mencatat pelanggan dan kendaraan, lalu buat pesanan servis pertama.',
      '<button class="btn btn-primary btn-sm" data-action="open-service-modal">' + icon('plus') + ' Buat Servis Baru</button>'
    );
    return;
  }

  if (!pageItems.length) {
    container.innerHTML = renderEmptyState(
      'search',
      'Servis tidak ditemukan',
      'Tidak ada servis yang cocok dengan kata kunci atau filter yang dipilih.',
      '<button class="btn btn-secondary btn-sm" data-action="reset-service-filters">' + icon('refresh') + ' Reset Filter</button>'
    );
    return;
  }

  const rows = pageItems.map(function (service) {
    const customer = getCustomerForService(service);
    const vehicle = getVehicleForService(service);
    const paymentStatus = calculatePaymentStatus(service);
    return '<tr>' +
      '<td data-label="Nomor servis"><span class="cell-primary service-number">' + escapeHtml(service.number) + '</span></td>' +
      '<td data-label="Tanggal masuk" class="cell-nowrap">' + formatDate(service.entryDate) + '</td>' +
      '<td data-label="Pelanggan"><span class="cell-primary">' + escapeHtml(customer ? customer.name : '—') + '</span><span class="cell-sub">' + escapeHtml(customer ? customer.phone : '') + '</span></td>' +
      '<td data-label="Nopol"><span class="cell-primary service-number">' + escapeHtml(vehicle ? vehicle.plate : '—') + '</span>' + (vehicle ? '<span class="cell-sub">' + escapeHtml(vehicle.brand + ' ' + vehicle.model) + '</span>' : '') + '</td>' +
      '<td data-label="Keluhan" class="complaint-cell" title="' + escapeHtml(service.complaint) + '">' + escapeHtml(service.complaint) + '</td>' +
      '<td data-label="Mekanik">' + escapeHtml(service.mechanic || '—') + '</td>' +
      '<td data-label="Total biaya" class="cell-right cell-nowrap"><span class="cell-primary numeric">' + formatCurrency(calculateServiceTotal(service)) + '</span></td>' +
      '<td data-label="Status servis">' + renderStatusControl(service, '', 'Ubah status ' + service.number) + '</td>' +
      '<td data-label="Pembayaran">' + renderPaymentBadge(paymentStatus) + '</td>' +
      '<td data-label="Aksi" class="table-actions"><div class="row-actions">' +
      '<button class="icon-btn" data-action="view-service" data-id="' + escapeHtml(service.id) + '" title="Lihat detail" aria-label="Lihat detail ' + escapeHtml(service.number) + '">' + icon('eye') + '</button>' +
      '<button class="icon-btn" data-action="edit-service" data-id="' + escapeHtml(service.id) + '" title="Edit servis" aria-label="Edit ' + escapeHtml(service.number) + '">' + icon('edit') + '</button>' +
      '<button class="icon-btn is-danger" data-action="delete-service" data-id="' + escapeHtml(service.id) + '" title="Hapus servis" aria-label="Hapus ' + escapeHtml(service.number) + '">' + icon('trash') + '</button>' +
      '</div></td></tr>';
  }).join('');

  let pagination = '';
  if (total > PAGE_SIZE) {
    let pageButtons = '';
    for (let index = 1; index <= totalPages; index += 1) {
      pageButtons += '<button class="page-btn' + (index === page ? ' is-active' : '') + '" data-action="services-page" data-page="' + index + '" aria-label="Halaman ' + index + '"' + (index === page ? ' aria-current="page"' : '') + '>' + index + '</button>';
    }
    pagination = '<div class="pagination">' +
      '<span class="pagination-info">Menampilkan ' + (start + 1) + '–' + Math.min(start + PAGE_SIZE, total) + ' dari ' + total + ' servis</span>' +
      '<div class="pagination-controls">' +
      '<button class="page-btn" data-action="services-page" data-page="' + (page - 1) + '" aria-label="Halaman sebelumnya"' + (page === 1 ? ' disabled' : '') + '>' + icon('chevron-left') + '</button>' +
      pageButtons +
      '<button class="page-btn" data-action="services-page" data-page="' + (page + 1) + '" aria-label="Halaman berikutnya"' + (page === totalPages ? ' disabled' : '') + '>' + icon('chevron-right') + '</button>' +
      '</div></div>';
  }

  container.innerHTML = '<div class="table-wrap"><table class="data-table">' +
    '<thead><tr><th>Nomor servis</th><th>Tanggal masuk</th><th>Pelanggan</th><th>Nopol</th><th>Keluhan</th><th>Mekanik</th><th class="cell-right">Total biaya</th><th>Status servis</th><th>Pembayaran</th><th class="cell-right">Aksi</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>' + pagination;
}

function resetServiceFilters() {
  state.servicesUI = { search: '', status: '', payment: '', date: '', mechanic: '', sort: 'newest', page: 1 };
  renderServicesPage();
}

function resolveReportRange() {
  const today = todayISO();
  let from = null;
  let to = null;
  let label = '';

  if (state.reportUI.range === 'today') {
    from = today;
    to = today;
    label = 'Hari ini · ' + formatDate(today);
  } else if (state.reportUI.range === 'week') {
    from = startOfWeekISO(today);
    to = endOfWeekISO(today);
    label = 'Minggu ini · ' + formatDate(from) + ' – ' + formatDate(to);
  } else if (state.reportUI.range === 'all') {
    label = 'Semua waktu';
  } else if (state.reportUI.range === 'custom') {
    from = state.reportUI.from || startOfMonthISO(today);
    to = state.reportUI.to || today;
    if (from > to) {
      const temporary = from;
      from = to;
      to = temporary;
    }
    label = formatDate(from) + ' – ' + formatDate(to);
  } else {
    from = startOfMonthISO(today);
    to = endOfMonthISO(today);
    label = 'Bulan ini · ' + formatMonthYear(from);
  }

  return { from: from, to: to, label: label };
}

function dateInRange(value, from, to) {
  if (!value) return false;
  if (from && value < from) return false;
  if (to && value > to) return false;
  return true;
}

function getReportData() {
  const range = resolveReportRange();
  const services = state.data.services.filter(function (service) {
    return dateInRange(service.entryDate, range.from, range.to);
  });
  const payments = [];
  state.data.services.forEach(function (service) {
    (service.payments || []).forEach(function (payment) {
      if (dateInRange(payment.date, range.from, range.to)) {
        payments.push({ payment: payment, service: service });
      }
    });
  });

  payments.sort(function (a, b) {
    return String(b.payment.date || '').localeCompare(String(a.payment.date || '')) ||
      String(b.payment.createdAt || '').localeCompare(String(a.payment.createdAt || ''));
  });

  const activeCount = services.filter(isActiveService).length;
  const completedCount = services.filter(function (service) { return service.status === 'Selesai'; }).length;
  const nonCancelled = services.filter(function (service) { return service.status !== 'Dibatalkan'; });
  const totalValue = nonCancelled.reduce(function (total, service) { return total + calculateServiceTotal(service); }, 0);
  const outstanding = nonCancelled.reduce(function (total, service) { return total + getRemainingBalance(service); }, 0);
  const received = payments.reduce(function (total, entry) { return total + roundMoney(entry.payment.amount); }, 0);

  return {
    range: range,
    services: services,
    payments: payments,
    count: services.length,
    completedCount: completedCount,
    activeCount: activeCount,
    totalValue: totalValue,
    outstanding: outstanding,
    received: received
  };
}

function renderSevenDayChart() {
  const today = todayISO();
  const days = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = addDaysISO(today, -offset);
    const value = state.data.services.reduce(function (total, service) {
      return total + (service.payments || []).reduce(function (sum, payment) {
        return payment.date === date ? sum + roundMoney(payment.amount) : sum;
      }, 0);
    }, 0);
    days.push({ date: date, value: value, isToday: date === today });
  }

  const hasTransactions = days.some(function (day) { return day.value > 0; });
  if (!hasTransactions) {
    return '<div class="chart-empty"><span class="empty-state-icon">' + icon('chart') + '</span><h3>Belum ada transaksi</h3><p>Grafik akan muncul setelah pembayaran pertama dicatat pada tujuh hari terakhir.</p></div>';
  }

  const maximum = Math.max.apply(null, days.map(function (day) { return day.value; }).concat([1]));
  const columns = days.map(function (day) {
    const height = day.value > 0 ? Math.max(6, Math.round((day.value / maximum) * 100)) : 2;
    return '<div class="chart-col' + (day.isToday ? ' is-today' : '') + '" title="' + escapeHtml(formatDate(day.date) + ' · ' + formatCurrency(day.value)) + '">' +
      '<span class="chart-amount">' + (day.value > 0 ? escapeHtml(formatCompactCurrency(day.value)) : '') + '</span>' +
      '<div class="chart-track"><div class="chart-bar" style="height:' + height + '%;opacity:' + (day.value > 0 ? '1' : '0.35') + '"></div></div>' +
      '<span class="chart-day">' + escapeHtml(formatShortDay(day.date)) + '</span>' +
      '<span class="chart-date">' + escapeHtml(formatChartDate(day.date)) + '</span>' +
      '</div>';
  }).join('');

  return '<div class="chart-wrap"><div class="chart">' + columns + '</div></div>';
}

function reportStatHtml(label, value, accent) {
  return '<div class="report-stat' + (accent ? ' is-accent' : '') + '"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></div>';
}

function renderPaymentReportTable(payments) {
  if (!payments.length) {
    return renderEmptyState('wallet', 'Belum ada pembayaran', 'Pembayaran yang diterima pada periode ini akan ditampilkan di sini.');
  }

  const rows = payments.map(function (entry) {
    const payment = entry.payment;
    const service = entry.service;
    const customer = getCustomerForService(service);
    return '<tr>' +
      '<td data-label="Tanggal">' + formatDate(payment.date) + '</td>' +
      '<td data-label="Nomor servis"><span class="cell-primary service-number">' + escapeHtml(service.number) + '</span></td>' +
      '<td data-label="Pelanggan">' + escapeHtml(customer ? customer.name : '—') + '</td>' +
      '<td data-label="Metode"><span class="badge badge-neutral">' + escapeHtml(payment.method) + '</span></td>' +
      '<td data-label="Nominal" class="cell-right cell-nowrap"><span class="cell-primary numeric">' + formatCurrency(payment.amount) + '</span></td>' +
      '</tr>';
  }).join('');

  return '<div class="table-wrap"><table class="data-table">' +
    '<thead><tr><th>Tanggal</th><th>Nomor servis</th><th>Pelanggan</th><th>Metode</th><th class="cell-right">Nominal</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>';
}

function renderReportResults() {
  const container = document.getElementById('report-results');
  if (!container) return;
  const report = getReportData();
  const paymentLabel = report.payments.length + ' transaksi pembayaran';

  container.innerHTML = '<div class="page-stack">' +
    '<section class="panel"><div class="panel-header"><div class="panel-heading"><h2>Ringkasan laporan</h2><p>' + escapeHtml(report.range.label) + '</p></div>' +
    '<span class="badge badge-neutral">' + report.count + ' servis</span></div>' +
    '<div class="panel-body"><div class="report-stats">' +
    reportStatHtml('Jumlah Servis', String(report.count), false) +
    reportStatHtml('Servis Selesai', String(report.completedCount), false) +
    reportStatHtml('Servis Aktif', String(report.activeCount), false) +
    reportStatHtml('Total Pendapatan Diterima', formatCurrency(report.received), true) +
    reportStatHtml('Total Nilai Servis', formatCurrency(report.totalValue), false) +
    reportStatHtml('Total Tagihan Belum Lunas', formatCurrency(report.outstanding), false) +
    '</div></div></section>' +
    '<section class="panel"><div class="panel-header"><div class="panel-heading"><h2>Pendapatan tujuh hari terakhir</h2><p>Dihitung dari transaksi pembayaran aktual</p></div></div>' +
    '<div class="panel-body">' + renderSevenDayChart() + '</div></section>' +
    '<section class="panel"><div class="panel-header"><div class="panel-heading"><h2>Pembayaran pada periode ini</h2><p>' + escapeHtml(paymentLabel) + '</p></div></div>' +
    '<div class="panel-body is-flush">' + renderPaymentReportTable(report.payments) + '</div></section>' +
    '</div>';
}

function renderReportsPage() {
  const today = todayISO();
  if (state.reportUI.range === 'custom') {
    if (!state.reportUI.from) state.reportUI.from = startOfMonthISO(today);
    if (!state.reportUI.to) state.reportUI.to = today;
  } else {
    state.reportUI.from = '';
    state.reportUI.to = '';
  }

  const rangeOptions = [
    { value: 'today', label: 'Hari ini' },
    { value: 'week', label: 'Minggu ini' },
    { value: 'month', label: 'Bulan ini' },
    { value: 'all', label: 'Semua waktu' },
    { value: 'custom', label: 'Rentang khusus' }
  ].map(function (option) {
    return '<option value="' + option.value + '"' + (state.reportUI.range === option.value ? ' selected' : '') + '>' + option.label + '</option>';
  }).join('');

  const customFields = state.reportUI.range === 'custom'
    ? '<div class="field"><label for="report-from">Dari tanggal</label><input class="input" id="report-from" type="date" value="' + escapeHtml(state.reportUI.from) + '" data-report-date="from"></div>' +
      '<div class="field"><label for="report-to">Sampai tanggal</label><input class="input" id="report-to" type="date" value="' + escapeHtml(state.reportUI.to) + '" data-report-date="to"></div>'
    : '';

  els.appContent.innerHTML = '<div class="page-stack">' +
    '<section class="report-filter-card"><div class="report-filter-group">' +
    '<div class="field"><label for="report-range">Periode laporan</label><select class="select" id="report-range" data-report-range>' + rangeOptions + '</select></div>' +
    customFields +
    '</div>' +
    '<div class="report-actions"><button class="btn btn-secondary" data-action="export-csv">' + icon('download') + ' Ekspor CSV</button></div>' +
    '</section>' +
    '<div id="report-results"></div>' +
    '</div>';
  renderReportResults();
}

function csvCell(value) {
  if (typeof value === 'number') return String(value);
  let text = String(value ?? '');
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}

function exportReportCsv() {
  const report = getReportData();
  const rows = [];
  rows.push(['Laporan MotoCare']);
  rows.push(['Nama bengkel', state.data.settings.workshopName || 'MotoCare']);
  rows.push(['Periode', report.range.label]);
  rows.push(['Jumlah Servis', report.count]);
  rows.push(['Servis Selesai', report.completedCount]);
  rows.push(['Servis Aktif', report.activeCount]);
  rows.push(['Total Pendapatan Diterima', report.received]);
  rows.push(['Total Nilai Servis', report.totalValue]);
  rows.push(['Total Tagihan Belum Lunas', report.outstanding]);
  rows.push([]);
  rows.push(['Tanggal Pembayaran', 'Nomor Servis', 'Pelanggan', 'Kendaraan', 'Metode', 'Nominal', 'Status Servis', 'Status Pembayaran']);

  report.payments.forEach(function (entry) {
    const service = entry.service;
    const payment = entry.payment;
    const customer = getCustomerForService(service);
    const vehicle = getVehicleForService(service);
    rows.push([
      payment.date,
      service.number,
      customer ? customer.name : '',
      vehicle ? vehicle.plate + ' · ' + vehicle.brand + ' ' + vehicle.model : '',
      payment.method,
      roundMoney(payment.amount),
      service.status,
      calculatePaymentStatus(service)
    ]);
  });

  const csv = '\uFEFF' + rows.map(function (row) {
    return row.map(csvCell).join(',');
  }).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const fromPart = report.range.from || 'semua';
  const toPart = report.range.to || '';
  link.href = url;
  link.download = 'Laporan-MotoCare-' + fromPart + (toPart ? '-' + toPart : '') + '.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  showToast('success', 'Laporan berhasil diekspor', 'File CSV telah diunduh dan siap dibuka di aplikasi spreadsheet.');
}

function mechanicChipsHtml() {
  if (!state.mechanicDraft.length) {
    return '<span class="mechanic-empty">Belum ada mekanik. Tambahkan minimal satu nama mekanik.</span>';
  }
  return state.mechanicDraft.map(function (mechanic, index) {
    return '<span class="mechanic-chip">' + escapeHtml(mechanic) +
      '<button type="button" data-action="remove-mechanic" data-index="' + index + '" aria-label="Hapus ' + escapeHtml(mechanic) + '">' + icon('x') + '</button>' +
      '</span>';
  }).join('');
}

function renderMechanicList() {
  const list = document.getElementById('mechanic-list');
  if (list) list.innerHTML = mechanicChipsHtml();
}

function renderSettingsPage() {
  const settings = state.data.settings;
  state.mechanicDraft = Array.isArray(settings.mechanics) ? settings.mechanics.slice() : [];

  els.appContent.innerHTML = '<div class="page-stack">' +
    '<form id="settings-form" novalidate class="page-stack">' +
    '<div class="form-error" data-form-error hidden></div>' +
    '<div class="settings-grid">' +
    '<section class="settings-panel">' +
    '<div class="settings-panel-head"><span class="settings-panel-icon">' + icon('settings') + '</span>' +
    '<div><h2>Identitas bengkel</h2><p>Digunakan pada nota servis dan laporan</p></div></div>' +
    '<div class="form-grid">' +
    '<div class="field span-2"><label for="workshop-name">Nama bengkel <span class="required-mark">*</span></label><input class="input" id="workshop-name" value="' + escapeHtml(settings.workshopName) + '" autocomplete="organization"></div>' +
    '<div class="field"><label for="workshop-phone">Nomor telepon</label><input class="input" id="workshop-phone" value="' + escapeHtml(settings.phone) + '" inputmode="tel"></div>' +
    '<div class="field"><label for="workshop-address">Alamat bengkel</label><input class="input" id="workshop-address" value="' + escapeHtml(settings.address) + '"></div>' +
    '</div></section>' +
    '<section class="settings-panel">' +
    '<div class="settings-panel-head"><span class="settings-panel-icon">' + icon('users') + '</span>' +
    '<div><h2>Mekanik tersedia</h2><p>Daftar pilihan mekanik pada form servis</p></div></div>' +
    '<div class="mechanic-list" id="mechanic-list">' + mechanicChipsHtml() + '</div>' +
    '<div class="mechanic-add-row"><input class="input" id="mechanic-input" placeholder="Nama mekanik baru" autocomplete="off">' +
    '<button class="btn btn-secondary" type="button" data-action="add-mechanic">' + icon('plus') + ' Tambah</button></div>' +
    '</section>' +
    '<div class="settings-save-row"><button class="btn btn-primary" type="submit">' + icon('check') + ' Simpan Pengaturan</button></div>' +
    '</div>' +
    '</form>' +
    '<div class="settings-grid">' +
    '<section class="settings-panel">' +
    '<div class="settings-panel-head"><span class="settings-panel-icon">' + icon(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon') + '</span>' +
    '<div><h2>Tema tampilan</h2><p>Preferensi tema disimpan di browser ini</p></div></div>' +
    '<div class="theme-grid">' +
    '<button class="theme-choice' + (document.documentElement.dataset.theme !== 'dark' ? ' is-active' : '') + '" type="button" data-action="set-theme" data-theme-choice="light" aria-pressed="' + (document.documentElement.dataset.theme !== 'dark' ? 'true' : 'false') + '">' +
    '<span class="theme-choice-icon">' + icon('sun') + '</span><span class="theme-choice-copy"><strong>Light Mode</strong><span>Terang dan bersih</span></span>' + icon('check', 'theme-choice-check') + '</button>' +
    '<button class="theme-choice' + (document.documentElement.dataset.theme === 'dark' ? ' is-active' : '') + '" type="button" data-action="set-theme" data-theme-choice="dark" aria-pressed="' + (document.documentElement.dataset.theme === 'dark' ? 'true' : 'false') + '">' +
    '<span class="theme-choice-icon">' + icon('moon') + '</span><span class="theme-choice-copy"><strong>Dark Mode</strong><span>Nyaman di ruangan gelap</span></span>' + icon('check', 'theme-choice-check') + '</button>' +
    '</div></section>' +
    '<section class="settings-panel">' +
    '<div class="settings-panel-head"><span class="settings-panel-icon">' + icon('refresh') + '</span>' +
    '<div><h2>Manajemen data</h2><p>Reset contoh data atau bersihkan seluruh data</p></div></div>' +
    '<div class="danger-actions">' +
    '<div class="danger-action-row"><div class="danger-action-copy"><strong>Reset data demo</strong><span>Ganti seluruh data saat ini dengan contoh data MotoCare.</span></div>' +
    '<button class="btn btn-secondary btn-sm" type="button" data-action="reset-demo">' + icon('refresh') + ' Reset Demo</button></div>' +
    '<div class="danger-action-row"><div class="danger-action-copy"><strong>Hapus seluruh data</strong><span>Semua pelanggan, kendaraan, servis, pembayaran, dan suku cadang akan dihapus.</span></div>' +
    '<button class="btn btn-outline-danger btn-sm" type="button" data-action="clear-data">' + icon('trash') + ' Hapus Semua</button></div>' +
    '</div>' +
    '<div class="storage-note">' + icon('info') + '<span>Data hanya tersimpan di localStorage browser dan perangkat ini. MotoCare belum mendukung sinkronisasi data antarperangkat. Buat cadangan melalui ekspor CSV dari halaman Laporan bila diperlukan.</span></div>' +
    '</section>' +
    '</div>' +
    '</div>';
}

function openCustomerModal(id) {
  const customer = id ? getCustomer(id) : null;
  if (id && !customer) {
    showToast('danger', 'Pelanggan tidak ditemukan', 'Data mungkin sudah dihapus.');
    return;
  }
  const editing = Boolean(customer);
  const body = '<form id="customer-form" data-id="' + escapeHtml(customer ? customer.id : '') + '" novalidate>' +
    '<div class="form-error" data-form-error hidden></div>' +
    '<div class="form-grid">' +
    '<div class="field span-2"><label for="customer-name">Nama pelanggan <span class="required-mark">*</span></label>' +
    '<input class="input" id="customer-name" value="' + escapeHtml(customer ? customer.name : '') + '" autocomplete="name"></div>' +
    '<div class="field"><label for="customer-phone">Nomor telepon <span class="required-mark">*</span></label>' +
    '<input class="input" id="customer-phone" value="' + escapeHtml(customer ? customer.phone : '') + '" inputmode="tel" autocomplete="tel"></div>' +
    '<div class="field"><label for="customer-address">Alamat (opsional)</label>' +
    '<input class="input" id="customer-address" value="' + escapeHtml(customer ? customer.address : '') + '"></div>' +
    '<div class="field span-2"><label for="customer-notes">Catatan (opsional)</label>' +
    '<textarea class="textarea" id="customer-notes" placeholder="Catatan khusus mengenai pelanggan...">' + escapeHtml(customer ? customer.notes : '') + '</textarea></div>' +
    '</div></form>';

  const footer = '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
    '<button class="btn btn-primary" type="submit" form="customer-form">' + icon('check') + (editing ? ' Simpan Perubahan' : ' Simpan Pelanggan') + '</button>';

  openModal({
    title: editing ? 'Edit Pelanggan' : 'Pelanggan Baru',
    subtitle: editing ? customer.id : 'ID pelanggan akan dibuat otomatis',
    body: body,
    footer: footer,
    size: 'modal-md',
    type: 'customer-form'
  });
}

function saveCustomerForm(form) {
  if (lockForm(form)) return;
  clearFormError(form);
  const id = form.dataset.id || '';
  const name = form.querySelector('#customer-name').value.trim();
  const phone = form.querySelector('#customer-phone').value.trim();
  const address = form.querySelector('#customer-address').value.trim();
  const notes = form.querySelector('#customer-notes').value.trim();

  if (name.length < 2) {
    showFormError(form, 'Nama pelanggan minimal 2 karakter.', form.querySelector('#customer-name'));
    unlockForm(form);
    return;
  }
  if (!isValidPhone(phone)) {
    showFormError(form, 'Nomor telepon harus berisi 8 sampai 15 digit angka.', form.querySelector('#customer-phone'));
    unlockForm(form);
    return;
  }

  if (id) {
    const customer = getCustomer(id);
    if (!customer) {
      showFormError(form, 'Pelanggan tidak ditemukan.');
      unlockForm(form);
      return;
    }
    customer.name = name;
    customer.phone = phone;
    customer.address = address;
    customer.notes = notes;
  } else {
    state.data.customers.push({
      id: nextSequentialId('CUST-', state.data.customers),
      name: name,
      phone: phone,
      address: address,
      notes: notes,
      createdAt: new Date().toISOString()
    });
  }

  saveData();
  closeModal();
  renderCurrentPage();
  showToast('success', 'Data pelanggan berhasil disimpan', name + ' tersimpan di daftar pelanggan.');
}

function openCustomerDetail(id) {
  const customer = getCustomer(id);
  if (!customer) {
    showToast('danger', 'Pelanggan tidak ditemukan', 'Data mungkin sudah dihapus.');
    return;
  }
  const vehicles = getCustomerVehicles(customer.id);
  const services = getCustomerServices(customer.id);

  const vehicleList = vehicles.length
    ? '<div class="detail-vehicle-list">' + vehicles.map(function (vehicle) {
      return '<div class="detail-list-row"><div class="detail-list-copy"><strong>' + escapeHtml(vehicle.plate) + '</strong>' +
        '<span>' + escapeHtml(vehicle.brand + ' ' + vehicle.model + (vehicle.year ? ' · ' + vehicle.year : '')) + '</span></div>' +
        '<button class="btn btn-secondary btn-sm" data-action="view-vehicle" data-id="' + escapeHtml(vehicle.id) + '">' + icon('eye') + ' Detail</button></div>';
    }).join('') + '</div>'
    : '<div class="detail-empty">Pelanggan belum memiliki kendaraan terdaftar.</div>';

  const serviceList = services.length
    ? '<div class="detail-service-list">' + services.map(function (service) {
      return '<div class="history-row"><div class="history-copy"><strong>' + escapeHtml(service.number + ' · ' + formatDate(service.entryDate)) + '</strong>' +
        '<span>' + escapeHtml(service.complaint) + '</span></div>' +
        '<div class="history-side">' + renderStatusBadge(service.status) +
        '<span class="history-total">' + formatCurrency(calculateServiceTotal(service)) + '</span>' +
        '<button class="icon-btn" data-action="view-service" data-id="' + escapeHtml(service.id) + '" title="Lihat servis" aria-label="Lihat servis ' + escapeHtml(service.number) + '">' + icon('eye') + '</button></div></div>';
    }).join('') + '</div>'
    : '<div class="detail-empty">Belum ada riwayat servis untuk pelanggan ini.</div>';

  const body = '<div class="detail-grid">' +
    '<div class="info-card"><div class="info-card-head">' + icon('user') + ' Kontak pelanggan</div><div class="info-list">' +
    '<div class="info-row"><span>ID pelanggan</span><strong>' + escapeHtml(customer.id) + '</strong></div>' +
    '<div class="info-row"><span>Telepon</span><strong>' + escapeHtml(customer.phone || '—') + '</strong></div>' +
    '<div class="info-row"><span>Alamat</span><strong class="is-normal">' + escapeHtml(customer.address || '—') + '</strong></div>' +
    '<div class="info-row"><span>Terdaftar</span><strong class="is-normal">' + formatDate(customer.createdAt ? customer.createdAt.slice(0, 10) : '') + '</strong></div>' +
    '</div></div>' +
    '<div class="info-card"><div class="info-card-head">' + icon('file-text') + ' Catatan</div>' +
    '<div class="detail-note">' + escapeHtml(customer.notes || 'Tidak ada catatan khusus.') + '</div>' +
    '<div class="info-list" style="margin-top:12px"><div class="info-row"><span>Total kendaraan</span><strong>' + vehicles.length + '</strong></div>' +
    '<div class="info-row"><span>Total servis</span><strong>' + services.length + '</strong></div></div></div>' +
    '</div>' +
    '<div class="detail-block"><div class="detail-block-head"><div><h4>Kendaraan pelanggan</h4><p>Kendaraan yang terhubung dengan pelanggan ini</p></div></div>' + vehicleList + '</div>' +
    '<div class="detail-block"><div class="detail-block-head"><div><h4>Riwayat servis</h4><p>Diurutkan dari servis terbaru</p></div></div>' + serviceList + '</div>';

  const footer = '<button class="btn btn-secondary" data-action="close-modal">Tutup</button>' +
    '<button class="btn btn-secondary" data-action="open-vehicle-modal" data-customer-id="' + escapeHtml(customer.id) + '">' + icon('plus') + ' Tambah Kendaraan</button>' +
    '<button class="btn btn-primary" data-action="edit-customer" data-id="' + escapeHtml(customer.id) + '">' + icon('edit') + ' Edit Pelanggan</button>';

  openModal({
    title: 'Detail Pelanggan',
    subtitle: customer.name,
    body: body,
    footer: footer,
    size: 'modal-md',
    type: 'customer-detail'
  });
}

function requestDeleteCustomer(id) {
  const customer = getCustomer(id);
  if (!customer) return;
  const vehicles = getCustomerVehicles(customer.id);
  const services = getCustomerServices(customer.id);

  if (vehicles.length || services.length) {
    openInfoModal({
      title: 'Pelanggan belum bisa dihapus',
      heading: 'Data masih terhubung',
      icon: 'alert-triangle',
      message: 'Pelanggan <strong>' + escapeHtml(customer.name) + '</strong> masih memiliki <strong>' + vehicles.length + ' kendaraan</strong> dan <strong>' + services.length + ' riwayat servis</strong>.<br><br>Hapus kendaraan atau servis terkait terlebih dahulu agar data tetap konsisten.'
    });
    return;
  }

  openConfirm({
    title: 'Hapus Pelanggan',
    heading: 'Hapus pelanggan ini?',
    message: 'Pelanggan <strong>' + escapeHtml(customer.name) + '</strong> akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.',
    confirmLabel: 'Hapus Pelanggan',
    onConfirm: function () {
      state.data.customers = state.data.customers.filter(function (entry) { return entry.id !== customer.id; });
      saveData();
      closeModal();
      renderCurrentPage();
      showToast('success', 'Data berhasil dihapus', 'Pelanggan ' + customer.name + ' telah dihapus.');
    }
  });
}

function validateVehicleValues(values, ignoreId) {
  const customerId = String(values.customerId || '');
  const plate = normalizePlate(values.plate);
  const brand = String(values.brand || '').trim();
  const model = String(values.model || '').trim();
  const yearText = String(values.year || '').trim();
  const kmText = String(values.lastKm || '').trim();
  const notes = String(values.notes || '').trim();

  if (!customerId || !getCustomer(customerId)) throw new Error('Pelanggan wajib dipilih.');
  if (!plate) throw new Error('Nomor polisi wajib diisi.');
  if (state.data.vehicles.some(function (vehicle) { return vehicle.id !== ignoreId && plateKey(vehicle.plate) === plateKey(plate); })) {
    throw new Error('Nomor polisi ' + plate + ' sudah terdaftar pada kendaraan lain.');
  }
  if (!brand) throw new Error('Merek motor wajib diisi.');
  if (!model) throw new Error('Model motor wajib diisi.');

  let year = null;
  if (yearText) {
    year = parseNumber(yearText, NaN);
    const maximumYear = new Date().getFullYear() + 1;
    if (!Number.isFinite(year) || year < 1900 || year > maximumYear) {
      throw new Error('Tahun kendaraan harus berada di antara 1900 dan ' + maximumYear + '.');
    }
  }

  let lastKm = null;
  if (kmText) {
    lastKm = parseNumber(kmText, NaN);
    if (!Number.isFinite(lastKm) || lastKm < 0) throw new Error('Kilometer terakhir tidak boleh negatif.');
    lastKm = roundMoney(lastKm);
  }

  return {
    customerId: customerId,
    plate: plate,
    brand: brand,
    model: model,
    year: year,
    lastKm: lastKm,
    notes: notes
  };
}

function openVehicleModal(id, customerId) {
  const vehicle = id ? getVehicle(id) : null;
  if (id && !vehicle) {
    showToast('danger', 'Kendaraan tidak ditemukan', 'Data mungkin sudah dihapus.');
    return;
  }
  if (!state.data.customers.length) {
    openInfoModal({
      title: 'Pelanggan belum tersedia',
      heading: 'Tambahkan pelanggan dahulu',
      icon: 'users',
      message: 'Setiap kendaraan harus dimiliki oleh pelanggan. Buka halaman <strong>Pelanggan</strong> untuk menambahkan pelanggan terlebih dahulu.'
    });
    return;
  }

  const editing = Boolean(vehicle);
  const selectedCustomer = vehicle ? vehicle.customerId : (customerId || '');
  const fallbackCustomer = state.data.customers.slice().sort(function (a, b) { return a.name.localeCompare(b.name, 'id'); })[0];
  const customerSelectValue = selectedCustomer || fallbackCustomer.id;
  const customerOptions = state.data.customers.slice().sort(function (a, b) { return a.name.localeCompare(b.name, 'id'); }).map(function (customer) {
    return '<option value="' + escapeHtml(customer.id) + '"' + (customer.id === customerSelectValue ? ' selected' : '') + '>' + escapeHtml(customer.name + ' · ' + (customer.phone || 'tanpa telepon')) + '</option>';
  }).join('');

  const body = '<form id="vehicle-form" data-id="' + escapeHtml(vehicle ? vehicle.id : '') + '" novalidate>' +
    '<div class="form-error" data-form-error hidden></div>' +
    '<div class="form-grid">' +
    '<div class="field span-2"><label for="vehicle-customer">Pelanggan pemilik <span class="required-mark">*</span></label><select class="select" id="vehicle-customer">' + customerOptions + '</select></div>' +
    '<div class="field"><label for="vehicle-plate">Nomor polisi <span class="required-mark">*</span></label><input class="input" id="vehicle-plate" value="' + escapeHtml(vehicle ? vehicle.plate : '') + '" placeholder="Contoh: B 1234 ABC" autocapitalize="characters"></div>' +
    '<div class="field"><label for="vehicle-brand">Merek motor <span class="required-mark">*</span></label><input class="input" id="vehicle-brand" list="brand-list" value="' + escapeHtml(vehicle ? vehicle.brand : '') + '" placeholder="Contoh: Honda"><datalist id="brand-list">' + BRAND_SUGGESTIONS.map(function (brand) { return '<option value="' + escapeHtml(brand) + '"></option>'; }).join('') + '</datalist></div>' +
    '<div class="field"><label for="vehicle-model">Model motor <span class="required-mark">*</span></label><input class="input" id="vehicle-model" value="' + escapeHtml(vehicle ? vehicle.model : '') + '" placeholder="Contoh: Beat"></div>' +
    '<div class="field"><label for="vehicle-year">Tahun kendaraan (opsional)</label><input class="input" id="vehicle-year" type="number" min="1900" step="1" value="' + escapeHtml(vehicle && vehicle.year !== null ? vehicle.year : '') + '" placeholder="2020"></div>' +
    '<div class="field"><label for="vehicle-km">Kilometer terakhir (opsional)</label><input class="input" id="vehicle-km" type="number" min="0" step="1" value="' + escapeHtml(vehicle && vehicle.lastKm !== null ? vehicle.lastKm : '') + '" placeholder="25000"></div>' +
    '<div class="field span-2"><label for="vehicle-notes">Catatan (opsional)</label><textarea class="textarea" id="vehicle-notes" placeholder="Warna, kondisi khusus, atau catatan lain...">' + escapeHtml(vehicle ? vehicle.notes : '') + '</textarea></div>' +
    '</div></form>';

  const footer = '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
    '<button class="btn btn-primary" type="submit" form="vehicle-form">' + icon('check') + (editing ? ' Simpan Perubahan' : ' Simpan Kendaraan') + '</button>';

  openModal({
    title: editing ? 'Edit Kendaraan' : 'Kendaraan Baru',
    subtitle: editing ? vehicle.plate : 'Satu pelanggan dapat memiliki beberapa kendaraan',
    body: body,
    footer: footer,
    size: 'modal-md',
    type: 'vehicle-form'
  });
}

function saveVehicleForm(form) {
  if (lockForm(form)) return;
  clearFormError(form);
  const id = form.dataset.id || '';

  try {
    const values = validateVehicleValues({
      customerId: form.querySelector('#vehicle-customer').value,
      plate: form.querySelector('#vehicle-plate').value,
      brand: form.querySelector('#vehicle-brand').value,
      model: form.querySelector('#vehicle-model').value,
      year: form.querySelector('#vehicle-year').value,
      lastKm: form.querySelector('#vehicle-km').value,
      notes: form.querySelector('#vehicle-notes').value
    }, id);

    if (id) {
      const vehicle = getVehicle(id);
      if (!vehicle) throw new Error('Kendaraan tidak ditemukan.');
      Object.assign(vehicle, values);
    } else {
      state.data.vehicles.push(Object.assign({
        id: nextSequentialId('VHC-', state.data.vehicles),
        createdAt: new Date().toISOString()
      }, values));
    }

    saveData();
    closeModal();
    renderCurrentPage();
    showToast('success', 'Data kendaraan berhasil disimpan', values.plate + ' telah ' + (id ? 'diperbarui' : 'ditambahkan') + '.');
  } catch (error) {
    showFormError(form, error.message);
    unlockForm(form);
  }
}

function openVehicleDetail(id) {
  const vehicle = getVehicle(id);
  if (!vehicle) {
    showToast('danger', 'Kendaraan tidak ditemukan', 'Data mungkin sudah dihapus.');
    return;
  }
  const customer = getCustomer(vehicle.customerId);
  const services = getVehicleServices(vehicle.id);

  const history = services.length
    ? '<div class="detail-service-list">' + services.map(function (service) {
      const jobs = (service.items || []).map(function (item) { return item.name; }).join(', ') || 'Tidak ada item';
      return '<div class="history-row"><div class="history-copy"><strong>' + escapeHtml(service.number + ' · ' + formatDate(service.entryDate)) + '</strong>' +
        '<span>' + escapeHtml(service.complaint) + '</span>' +
        '<span>' + escapeHtml('Pekerjaan: ' + jobs) + '</span></div>' +
        '<div class="history-side">' + renderStatusBadge(service.status) +
        '<span class="history-total">' + (service.km ? formatQuantity(service.km) + ' km · ' : '') + formatCurrency(calculateServiceTotal(service)) + '</span>' +
        '<button class="icon-btn" data-action="view-service" data-id="' + escapeHtml(service.id) + '" title="Lihat servis" aria-label="Lihat servis ' + escapeHtml(service.number) + '">' + icon('eye') + '</button></div></div>';
    }).join('') + '</div>'
    : '<div class="detail-empty">Belum ada riwayat servis untuk kendaraan ini.</div>';

  const body = '<div class="detail-grid">' +
    '<div class="info-card"><div class="info-card-head">' + icon('motorcycle') + ' Informasi kendaraan</div><div class="info-list">' +
    '<div class="info-row"><span>Nomor polisi</span><strong>' + escapeHtml(vehicle.plate) + '</strong></div>' +
    '<div class="info-row"><span>Merek &amp; model</span><strong>' + escapeHtml(vehicle.brand + ' ' + vehicle.model) + '</strong></div>' +
    '<div class="info-row"><span>Tahun</span><strong>' + escapeHtml(vehicle.year || '—') + '</strong></div>' +
    '<div class="info-row"><span>Kilometer terakhir</span><strong>' + (vehicle.lastKm !== null ? formatQuantity(vehicle.lastKm) + ' km' : '—') + '</strong></div>' +
    '</div></div>' +
    '<div class="info-card"><div class="info-card-head">' + icon('user') + ' Pemilik kendaraan</div><div class="info-list">' +
    '<div class="info-row"><span>Nama</span><strong>' + escapeHtml(customer ? customer.name : '—') + '</strong></div>' +
    '<div class="info-row"><span>Telepon</span><strong>' + escapeHtml(customer ? customer.phone : '—') + '</strong></div>' +
    '<div class="info-row"><span>Total servis</span><strong>' + services.length + '</strong></div>' +
    '<div class="info-row"><span>Catatan</span><strong class="is-normal">' + escapeHtml(vehicle.notes || '—') + '</strong></div>' +
    '</div></div></div>' +
    '<div class="detail-block"><div class="detail-block-head"><div><h4>Riwayat servis kendaraan</h4><p>Urut dari tanggal servis terbaru</p></div></div>' + history + '</div>';

  const footer = '<button class="btn btn-secondary" data-action="close-modal">Tutup</button>' +
    '<button class="btn btn-primary" data-action="edit-vehicle" data-id="' + escapeHtml(vehicle.id) + '">' + icon('edit') + ' Edit Kendaraan</button>';

  openModal({
    title: 'Detail Kendaraan',
    subtitle: vehicle.plate + ' · ' + vehicle.brand + ' ' + vehicle.model,
    body: body,
    footer: footer,
    size: 'modal-md',
    type: 'vehicle-detail'
  });
}

function requestDeleteVehicle(id) {
  const vehicle = getVehicle(id);
  if (!vehicle) return;
  const services = getVehicleServices(vehicle.id);

  if (services.length) {
    openInfoModal({
      title: 'Kendaraan belum bisa dihapus',
      heading: 'Kendaraan memiliki riwayat servis',
      icon: 'alert-triangle',
      message: 'Kendaraan <strong>' + escapeHtml(vehicle.plate) + '</strong> memiliki <strong>' + services.length + ' riwayat servis</strong>.<br><br>Hapus riwayat servis terkait terlebih dahulu atau biarkan data ini tetap tersimpan.'
    });
    return;
  }

  openConfirm({
    title: 'Hapus Kendaraan',
    heading: 'Hapus kendaraan ini?',
    message: 'Kendaraan <strong>' + escapeHtml(vehicle.plate) + ' · ' + escapeHtml(vehicle.brand + ' ' + vehicle.model) + '</strong> akan dihapus dari daftar.',
    confirmLabel: 'Hapus Kendaraan',
    onConfirm: function () {
      state.data.vehicles = state.data.vehicles.filter(function (entry) { return entry.id !== vehicle.id; });
      saveData();
      closeModal();
      renderCurrentPage();
      showToast('success', 'Data berhasil dihapus', 'Kendaraan ' + vehicle.plate + ' telah dihapus.');
    }
  });
}

function openPartModal(id) {
  const part = id ? getPart(id) : null;
  if (id && !part) {
    showToast('danger', 'Suku cadang tidak ditemukan', 'Data mungkin sudah dihapus.');
    return;
  }
  const editing = Boolean(part);
  const categoryOptions = PART_CATEGORIES.map(function (category) {
    return '<option value="' + escapeHtml(category) + '"' + (part && part.category === category ? ' selected' : '') + '>' + escapeHtml(category) + '</option>';
  }).join('');

  const body = '<form id="part-form" data-id="' + escapeHtml(part ? part.id : '') + '" novalidate>' +
    '<div class="form-error" data-form-error hidden></div>' +
    '<div class="form-grid">' +
    '<div class="field"><label for="part-code">Kode barang <span class="required-mark">*</span></label><input class="input" id="part-code" value="' + escapeHtml(part ? part.code : '') + '" placeholder="Contoh: OLI-001" autocapitalize="characters"></div>' +
    '<div class="field"><label for="part-name">Nama suku cadang <span class="required-mark">*</span></label><input class="input" id="part-name" value="' + escapeHtml(part ? part.name : '') + '" placeholder="Contoh: Oli Mesin MPX2"></div>' +
    '<div class="field"><label for="part-category">Kategori <span class="required-mark">*</span></label><select class="select" id="part-category">' + categoryOptions + '</select></div>' +
    '<div class="field"><label for="part-unit">Satuan <span class="required-mark">*</span></label><input class="input" id="part-unit" value="' + escapeHtml(part ? part.unit : 'Pcs') + '" placeholder="Pcs, Botol, Set"></div>' +
    '<div class="field"><label for="part-stock">Stok tersedia <span class="required-mark">*</span></label><input class="input" id="part-stock" type="number" min="0" step="0.01" value="' + escapeHtml(part ? part.stock : 0) + '"></div>' +
    '<div class="field"><label for="part-min-stock">Stok minimum <span class="required-mark">*</span></label><input class="input" id="part-min-stock" type="number" min="0" step="0.01" value="' + escapeHtml(part ? part.minStock : 0) + '"></div>' +
    '<div class="field span-2"><label for="part-price">Harga jual per satuan <span class="required-mark">*</span></label><input class="input" id="part-price" type="number" min="0" step="1" value="' + escapeHtml(part ? part.price : '') + '"></div>' +
    '</div>' +
    '<div class="form-notice" style="margin-top:14px">' + icon('info') + '<span>Perubahan stok melalui form ini akan dicatat sebagai penyesuaian stok manual. Gunakan tombol Tambah Stok untuk penerimaan barang.</span></div>' +
    '</form>';

  const footer = '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
    '<button class="btn btn-primary" type="submit" form="part-form">' + icon('check') + (editing ? ' Simpan Perubahan' : ' Simpan Suku Cadang') + '</button>';

  openModal({
    title: editing ? 'Edit Suku Cadang' : 'Suku Cadang Baru',
    subtitle: editing ? part.code + ' · ' + part.name : 'Stok akan terhubung dengan pekerjaan servis',
    body: body,
    footer: footer,
    size: 'modal-md',
    type: 'part-form'
  });
}

function savePartForm(form) {
  if (lockForm(form)) return;
  clearFormError(form);
  const id = form.dataset.id || '';
  const code = form.querySelector('#part-code').value.trim().toUpperCase();
  const name = form.querySelector('#part-name').value.trim();
  const category = form.querySelector('#part-category').value;
  const unit = form.querySelector('#part-unit').value.trim();
  const stock = parseNumber(form.querySelector('#part-stock').value, NaN);
  const minStock = parseNumber(form.querySelector('#part-min-stock').value, NaN);
  const price = parseNumber(form.querySelector('#part-price').value, NaN);

  if (!code) {
    showFormError(form, 'Kode barang wajib diisi.', form.querySelector('#part-code'));
    unlockForm(form);
    return;
  }
  if (state.data.parts.some(function (part) { return part.id !== id && part.code.toLowerCase() === code.toLowerCase(); })) {
    showFormError(form, 'Kode barang ' + code + ' sudah digunakan.', form.querySelector('#part-code'));
    unlockForm(form);
    return;
  }
  if (!name) {
    showFormError(form, 'Nama suku cadang wajib diisi.', form.querySelector('#part-name'));
    unlockForm(form);
    return;
  }
  if (!PART_CATEGORIES.includes(category)) {
    showFormError(form, 'Kategori suku cadang tidak valid.', form.querySelector('#part-category'));
    unlockForm(form);
    return;
  }
  if (!unit) {
    showFormError(form, 'Satuan wajib diisi.', form.querySelector('#part-unit'));
    unlockForm(form);
    return;
  }
  if (!Number.isFinite(stock) || stock < 0) {
    showFormError(form, 'Stok tersedia tidak boleh negatif.', form.querySelector('#part-stock'));
    unlockForm(form);
    return;
  }
  if (!Number.isFinite(minStock) || minStock < 0) {
    showFormError(form, 'Stok minimum tidak boleh negatif.', form.querySelector('#part-min-stock'));
    unlockForm(form);
    return;
  }
  if (!Number.isFinite(price) || price < 0) {
    showFormError(form, 'Harga jual tidak boleh negatif.', form.querySelector('#part-price'));
    unlockForm(form);
    return;
  }

  const values = {
    code: code,
    name: name,
    category: category,
    unit: unit,
    stock: roundQuantity(stock),
    minStock: roundQuantity(minStock),
    price: roundMoney(price)
  };

  if (id) {
    const part = getPart(id);
    if (!part) {
      showFormError(form, 'Suku cadang tidak ditemukan.');
      unlockForm(form);
      return;
    }
    const difference = roundQuantity(values.stock - part.stock);
    Object.assign(part, values);
    if (difference !== 0) {
      state.data.stockLogs.push({
        id: uniqueId('STK'),
        partId: part.id,
        delta: difference,
        reason: 'Penyesuaian stok manual',
        serviceId: '',
        date: todayISO(),
        createdAt: new Date().toISOString()
      });
    }
  } else {
    const newPart = Object.assign({
      id: nextSequentialId('PRT-', state.data.parts),
      createdAt: new Date().toISOString()
    }, values);
    state.data.parts.push(newPart);
    if (values.stock > 0) {
      state.data.stockLogs.push({
        id: uniqueId('STK'),
        partId: newPart.id,
        delta: values.stock,
        reason: 'Stok awal',
        serviceId: '',
        date: todayISO(),
        createdAt: new Date().toISOString()
      });
    }
  }

  saveData();
  closeModal();
  renderCurrentPage();
  showToast('success', 'Data suku cadang berhasil disimpan', name + ' telah ' + (id ? 'diperbarui' : 'ditambahkan') + '.');
}

function openStockModal(id) {
  const part = getPart(id);
  if (!part) {
    showToast('danger', 'Suku cadang tidak ditemukan');
    return;
  }

  const body = '<form id="stock-form" data-id="' + escapeHtml(part.id) + '" novalidate>' +
    '<div class="form-error" data-form-error hidden></div>' +
    '<div class="info-card"><div class="info-list"><div class="info-row"><span>Kode</span><strong>' + escapeHtml(part.code) + '</strong></div>' +
    '<div class="info-row"><span>Nama</span><strong>' + escapeHtml(part.name) + '</strong></div>' +
    '<div class="info-row"><span>Stok saat ini</span><strong>' + formatQuantity(part.stock) + ' ' + escapeHtml(part.unit) + '</strong></div></div></div>' +
    '<div class="form-grid" style="margin-top:16px">' +
    '<div class="field"><label for="stock-amount">Jumlah masuk <span class="required-mark">*</span></label><input class="input" id="stock-amount" type="number" min="0.01" step="0.01" placeholder="Contoh: 10" autofocus></div>' +
    '<div class="field span-2"><label for="stock-note">Catatan (opsional)</label><input class="input" id="stock-note" placeholder="Contoh: Pembelian dari supplier"></div>' +
    '</div></form>';

  const footer = '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
    '<button class="btn btn-primary" type="submit" form="stock-form">' + icon('plus-circle') + ' Tambah Stok</button>';

  openModal({
    title: 'Tambah Stok',
    subtitle: part.name,
    body: body,
    footer: footer,
    size: 'modal-sm',
    type: 'stock-form'
  });
}

function saveStockForm(form) {
  if (lockForm(form)) return;
  clearFormError(form);
  const part = getPart(form.dataset.id);
  const amount = parseNumber(form.querySelector('#stock-amount').value, NaN);
  const note = form.querySelector('#stock-note').value.trim();

  if (!part) {
    showFormError(form, 'Suku cadang tidak ditemukan.');
    unlockForm(form);
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showFormError(form, 'Jumlah stok harus lebih besar dari nol.', form.querySelector('#stock-amount'));
    unlockForm(form);
    return;
  }

  part.stock = roundQuantity(part.stock + amount);
  state.data.stockLogs.push({
    id: uniqueId('STK'),
    partId: part.id,
    delta: roundQuantity(amount),
    reason: note ? 'Penambahan stok · ' + note : 'Penambahan stok',
    serviceId: '',
    date: todayISO(),
    createdAt: new Date().toISOString()
  });

  saveData();
  closeModal();
  renderCurrentPage();
  showToast('success', 'Stok berhasil diperbarui', part.name + ' kini memiliki stok ' + formatQuantity(part.stock) + ' ' + part.unit + '.');
}

function requestDeletePart(id) {
  const part = getPart(id);
  if (!part) return;
  const used = state.data.services.some(function (service) {
    return (service.items || []).some(function (item) { return item.partId === part.id; });
  });

  if (used) {
    openInfoModal({
      title: 'Suku cadang belum bisa dihapus',
      heading: 'Sudah dipakai pada servis',
      icon: 'alert-triangle',
      message: 'Suku cadang <strong>' + escapeHtml(part.name) + '</strong> sudah tercatat pada riwayat pekerjaan servis.<br><br>Data tetap disimpan agar riwayat dan nota lama tidak berubah.'
    });
    return;
  }

  openConfirm({
    title: 'Hapus Suku Cadang',
    heading: 'Hapus suku cadang ini?',
    message: 'Suku cadang <strong>' + escapeHtml(part.name) + ' (' + escapeHtml(part.code) + ')</strong> akan dihapus dari inventaris.',
    confirmLabel: 'Hapus Suku Cadang',
    onConfirm: function () {
      state.data.parts = state.data.parts.filter(function (entry) { return entry.id !== part.id; });
      saveData();
      closeModal();
      renderCurrentPage();
      showToast('success', 'Data berhasil dihapus', part.name + ' telah dihapus dari inventaris.');
    }
  });
}

let serviceFormItems = [];

function serviceCustomerOptions(selectedId) {
  return state.data.customers.slice().sort(function (a, b) {
    return a.name.localeCompare(b.name, 'id');
  }).map(function (customer) {
    return '<option value="' + escapeHtml(customer.id) + '"' + (customer.id === selectedId ? ' selected' : '') + '>' + escapeHtml(customer.name + ' · ' + (customer.phone || 'tanpa telepon')) + '</option>';
  }).join('');
}

function serviceVehicleOptions(customerId, selectedId) {
  const vehicles = getCustomerVehicles(customerId);
  if (!vehicles.length) return '<option value="">Belum ada kendaraan</option>';
  return vehicles.map(function (vehicle) {
    return '<option value="' + escapeHtml(vehicle.id) + '"' + (vehicle.id === selectedId ? ' selected' : '') + '>' + escapeHtml(vehicle.plate + ' · ' + vehicle.brand + ' ' + vehicle.model) + '</option>';
  }).join('');
}

function serviceEditingOldUsage(partId) {
  const editing = state.activeServiceId ? getService(state.activeServiceId) : null;
  if (!editing || editing.status === 'Dibatalkan' || !Array.isArray(editing.items)) return 0;
  return editing.items.reduce(function (total, item) {
    if (item.type !== 'part' || item.partId !== partId) return total;
    return roundQuantity(total + parseNumber(item.qty, 0));
  }, 0);
}

function serviceItemPartOptions(selectedId) {
  const options = state.data.parts.map(function (part) {
    return '<option value="' + escapeHtml(part.id) + '"' + (part.id === selectedId ? ' selected' : '') + '>' + escapeHtml(part.code + ' · ' + part.name + ' (' + formatQuantity(part.stock) + ' ' + part.unit + ')') + '</option>';
  }).join('');
  return '<option value="">Pilih suku cadang...</option>' + options;
}

function serviceDraftItemHtml(item, index) {
  const isPart = item.type === 'part';
  const quantity = parseNumber(item.qty, 0);
  const price = parseNumber(item.unitPrice, 0);
  const subtotal = roundMoney(quantity * price);
  let stockHint = '';
  if (isPart && item.partId) {
    const part = getPart(item.partId);
    if (part) {
      const available = roundQuantity(part.stock + serviceEditingOldUsage(part.id));
      const needed = roundQuantity(quantity);
      const warning = needed > available ? ' is-warning' : '';
      stockHint = '<div class="item-stock-hint' + warning + '">Stok tersedia ' + formatQuantity(available) + ' ' + escapeHtml(part.unit || 'unit') + ' · dibutuhkan ' + formatQuantity(needed) + '</div>';
    }
  }

  return '<div class="item-row" data-item-index="' + index + '">' +
    '<div class="item-field item-name-field"><label>Pekerjaan / barang</label>' +
    '<input class="input" data-item-field="name" value="' + escapeHtml(item.name || '') + '" placeholder="' + escapeHtml(isPart ? 'Nama suku cadang' : 'Contoh: Servis rutin') + '" list="job-suggestions">' +
    (isPart ? '<div class="item-part-wrap"><select class="select" data-item-field="partId" aria-label="Pilih suku cadang">' + serviceItemPartOptions(item.partId) + '</select></div>' : '') +
    stockHint + '</div>' +
    '<div class="item-field item-type-field"><label>Jenis</label><select class="select" data-item-field="type" aria-label="Jenis item">' +
    '<option value="service"' + (!isPart ? ' selected' : '') + '>Jasa Servis</option>' +
    '<option value="part"' + (isPart ? ' selected' : '') + '>Suku Cadang</option></select></div>' +
    '<div class="item-field item-qty-field"><label>Qty</label><input class="input" type="number" min="0.01" step="0.01" data-item-field="qty" value="' + escapeHtml(item.qty === '' ? '' : String(roundQuantity(quantity))) + '"></div>' +
    '<div class="item-field item-price-field"><label>Harga</label><input class="input" type="number" min="0" step="1" data-item-field="unitPrice" value="' + escapeHtml(item.unitPrice === '' ? '' : String(roundMoney(price))) + '"></div>' +
    '<div class="item-subtotal"><span>Subtotal</span><strong>' + formatCurrency(subtotal) + '</strong></div>' +
    '<button class="item-remove" type="button" data-action="remove-service-item" data-index="' + index + '" title="Hapus item" aria-label="Hapus item baris ' + (index + 1) + '">' + icon('trash') + '</button>' +
    '</div>';
}

function renderServiceItemsEditor() {
  const list = document.getElementById('service-items');
  if (!list) return;
  if (!serviceFormItems.length) {
    list.innerHTML = '<div class="items-empty">Belum ada item. Tambahkan jasa servis atau suku cadang.</div>';
  } else {
    list.innerHTML = serviceFormItems.map(function (item, index) {
      return serviceDraftItemHtml(item, index);
    }).join('');
  }
  updateServiceTotalsBar();
}

function updateServiceTotalsBar() {
  const valueNode = document.getElementById('service-total-value');
  const copyNode = document.getElementById('service-total-copy');
  let total = 0;
  let services = 0;
  let parts = 0;
  serviceFormItems.forEach(function (item) {
    total += roundMoney(parseNumber(item.qty, 0) * parseNumber(item.unitPrice, 0));
    if (item.type === 'part') parts += 1;
    else services += 1;
  });
  if (valueNode) valueNode.textContent = formatCurrency(total);
  if (copyNode) {
    copyNode.textContent = serviceFormItems.length
      ? services + ' jasa · ' + parts + ' suku cadang'
      : 'Belum ada item ditambahkan';
  }
}

function syncServiceItemsFromDom() {
  const list = document.getElementById('service-items');
  if (!list) return;
  list.querySelectorAll('[data-item-index]').forEach(function (row) {
    const index = Number(row.dataset.itemIndex);
    const item = serviceFormItems[index];
    if (!item) return;
    row.querySelectorAll('[data-item-field]').forEach(function (field) {
      item[field.dataset.itemField] = field.value;
    });
  });
}

function addServiceItemDraft(type, partId) {
  syncServiceItemsFromDom();
  const part = partId ? getPart(partId) : null;
  serviceFormItems.push({
    id: uniqueId('ITM'),
    name: part ? part.name : '',
    type: type === 'part' ? 'part' : 'service',
    qty: 1,
    unitPrice: part ? part.price : 0,
    partId: part ? part.id : ''
  });
  renderServiceItemsEditor();
  const list = document.getElementById('service-items');
  const lastRow = list ? list.querySelector('[data-item-index="' + (serviceFormItems.length - 1) + '"]') : null;
  if (lastRow) {
    const nameField = lastRow.querySelector('[data-item-field="name"]');
    if (nameField) nameField.focus();
  }
}

function removeServiceItemDraft(index) {
  syncServiceItemsFromDom();
  if (!serviceFormItems[index]) return;
  serviceFormItems.splice(index, 1);
  renderServiceItemsEditor();
}

function openServiceModal(id, presetCustomerId) {
  const service = id ? getService(id) : null;
  if (id && !service) {
    showToast('danger', 'Servis tidak ditemukan', 'Data mungkin sudah dihapus.');
    return;
  }
  if (!state.data.customers.length) {
    openInfoModal({
      title: 'Data pelanggan kosong',
      heading: 'Tambahkan pelanggan dahulu',
      icon: 'users',
      message: 'Servis membutuhkan data pelanggan dan kendaraan. Buka halaman <strong>Pelanggan</strong> untuk mulai menambahkan data.'
    });
    return;
  }

  const editing = Boolean(service);
  const customerId = service ? service.customerId : (presetCustomerId || state.data.customers[0].id);
  const vehicleId = service ? service.vehicleId : '';
  const mechanics = getMechanicsList();
  serviceFormItems = service
    ? (service.items || []).map(function (item) {
      return {
        id: item.id || uniqueId('ITM'),
        name: item.name || '',
        type: item.type === 'part' ? 'part' : 'service',
        qty: item.qty,
        unitPrice: item.unitPrice,
        partId: item.partId || ''
      };
    })
    : [];
  if (!editing && !serviceFormItems.length) {
    serviceFormItems = [];
  }

  const statusOptions = SERVICE_STATUSES.map(function (status) {
    const selected = (service ? service.status : 'Menunggu') === status;
    return '<option value="' + escapeHtml(status) + '"' + (selected ? ' selected' : '') + '>' + escapeHtml(status) + '</option>';
  }).join('');
  const mechanicOptions = '<option value="">Belum ditentukan</option>' + mechanics.map(function (mechanic) {
    return '<option value="' + escapeHtml(mechanic) + '"' + (service && service.mechanic === mechanic ? ' selected' : '') + '>' + escapeHtml(mechanic) + '</option>';
  }).join('');
  const partQuickOptions = state.data.parts.length
    ? '<select class="select quick-part-select" data-action="quick-add-part" aria-label="Tambah suku cadang cepat"><option value="">Tambah suku cadang cepat...</option>' + state.data.parts.map(function (part) {
      return '<option value="' + escapeHtml(part.id) + '">' + escapeHtml(part.code + ' · ' + part.name) + '</option>';
    }).join('') + '</select>'
    : '<span class="item-stock-hint">Belum ada suku cadang terdaftar</span>';

  const body = '<form id="service-form" data-id="' + escapeHtml(service ? service.id : '') + '" novalidate>' +
    '<div class="form-error" data-form-error hidden></div>' +
    '<div class="service-form-header"><span>Nomor servis</span><strong>' + icon('wrench') + ' ' + escapeHtml(service ? service.number : 'Dibuat otomatis saat disimpan') + '</strong></div>' +

    '<div class="form-section"><div class="form-section-head"><span class="form-section-number">1</span><div><h3>Pelanggan & kendaraan</h3><p>Pilih pemilik dan motor yang akan diservis</p></div></div>' +
    '<div class="form-grid">' +
    '<div class="field"><label for="service-customer">Pelanggan <span class="required-mark">*</span></label><select class="select" id="service-customer">' + serviceCustomerOptions(customerId) + '</select></div>' +
    '<div class="field"><label for="service-vehicle">Kendaraan <span class="required-mark">*</span></label><select class="select" id="service-vehicle">' + serviceVehicleOptions(customerId, vehicleId) + '</select></div>' +
    '</div>' +
    '<div class="form-actions"><button class="btn btn-secondary btn-sm" type="button" data-action="toggle-quick-vehicle">' + icon('plus') + ' Kendaraan baru cepat</button></div>' +
    '<div class="quick-vehicle-panel" id="quick-vehicle-panel" hidden>' +
    '<div class="quick-vehicle-head"><div><strong>Tambah kendaraan cepat</strong><p>Kendaraan tersimpan langsung ke pelanggan terpilih</p></div></div>' +
    '<div class="quick-vehicle-grid">' +
    '<div class="field"><label for="quick-vehicle-plate">Nomor polisi</label><input class="input" id="quick-vehicle-plate" placeholder="B 1234 ABC" autocapitalize="characters"></div>' +
    '<div class="field"><label for="quick-vehicle-brand">Merek</label><input class="input" id="quick-vehicle-brand" list="brand-list" placeholder="Honda"></div>' +
    '<div class="field"><label for="quick-vehicle-model">Model</label><input class="input" id="quick-vehicle-model" placeholder="Beat"></div>' +
    '</div>' +
    '<div class="quick-vehicle-actions"><button class="btn btn-secondary btn-sm" type="button" data-action="toggle-quick-vehicle">Batal</button>' +
    '<button class="btn btn-primary btn-sm" type="button" data-action="save-quick-vehicle">' + icon('check') + ' Simpan</button></div>' +
    '</div></div>' +

    '<div class="form-section"><div class="form-section-head"><span class="form-section-number">2</span><div><h3>Detail servis</h3><p>Keluhan, jadwal, mekanik, dan status pengerjaan</p></div></div>' +
    '<div class="form-grid">' +
    '<div class="field"><label for="service-entry-date">Tanggal masuk <span class="required-mark">*</span></label><input class="input" id="service-entry-date" type="date" value="' + escapeHtml(service ? service.entryDate : todayISO()) + '"></div>' +
    '<div class="field"><label for="service-estimate-date">Estimasi selesai</label><input class="input" id="service-estimate-date" type="date" value="' + escapeHtml(service ? service.estimateDate : addDaysISO(todayISO(), 1)) + '"></div>' +
    '<div class="field"><label for="service-km">Kilometer kendaraan</label><input class="input" id="service-km" type="number" min="0" step="1" value="' + escapeHtml(service && service.km !== null ? service.km : '') + '" placeholder="Otomatis dari data kendaraan"></div>' +
    '<div class="field"><label for="service-mechanic">Mekanik</label><select class="select" id="service-mechanic">' + mechanicOptions + '</select></div>' +
    '<div class="field"><label for="service-status">Status pengerjaan <span class="required-mark">*</span></label><select class="select" id="service-status">' + statusOptions + '</select></div>' +
    '<div class="field span-2"><label for="service-complaint">Keluhan pelanggan <span class="required-mark">*</span></label><textarea class="textarea" id="service-complaint" placeholder="Contoh: mesin berisik saat digas, rem depan kurang pakem...">' + escapeHtml(service ? service.complaint : '') + '</textarea></div>' +
    '<div class="field span-2"><label for="service-diagnosis">Diagnosa mekanik (opsional)</label><textarea class="textarea" id="service-diagnosis" placeholder="Hasil pemeriksaan dan tindakan yang diperlukan...">' + escapeHtml(service ? service.diagnosis : '') + '</textarea></div>' +
    '<div class="field span-2"><label for="service-notes">Catatan tambahan (opsional)</label><input class="input" id="service-notes" value="' + escapeHtml(service ? service.notes : '') + '"></div>' +
    '</div></div>' +

    '<div class="form-section"><div class="form-section-head"><span class="form-section-number">3</span><div><h3>Pekerjaan & suku cadang</h3><p>Tambahkan jasa servis dan suku cadang yang digunakan</p></div></div>' +
    '<div class="items-editor">' +
    '<div class="items-editor-head"><div><h4>Item servis</h4><p>Stok suku cadang otomatis berkurang saat servis disimpan</p></div>' +
    '<div class="items-editor-actions">' + partQuickOptions +
    '<button class="btn btn-secondary btn-sm" type="button" data-action="add-service-item">' + icon('plus') + ' Jasa</button></div></div>' +
    '<div class="items-list" id="service-items"></div>' +
    '</div>' +
    '<div class="service-total-bar"><div class="service-total-copy"><span>Ringkasan item</span><strong id="service-total-copy">Belum ada item ditambahkan</strong></div>' +
    '<div class="service-total-value"><span>Total biaya</span><strong id="service-total-value">' + formatCurrency(0) + '</strong></div></div>' +
    '</div>' +

    '<datalist id="job-suggestions">' + JOB_SUGGESTIONS.map(function (job) { return '<option value="' + escapeHtml(job) + '"></option>'; }).join('') + '</datalist>' +
    '<datalist id="brand-list">' + BRAND_SUGGESTIONS.map(function (brand) { return '<option value="' + escapeHtml(brand) + '"></option>'; }).join('') + '</datalist>' +
    '</form>';

  const footer = '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
    '<button class="btn btn-primary" type="submit" form="service-form">' + icon('check') + (editing ? ' Simpan Perubahan' : ' Simpan Servis') + '</button>';

  openModal({
    title: editing ? 'Edit Servis' : 'Servis Baru',
    subtitle: service ? service.number : 'Catat pekerjaan servis baru',
    body: body,
    footer: footer,
    size: 'modal-lg',
    type: 'service-form',
    serviceId: service ? service.id : null
  });

  renderServiceItemsEditor();
  if (service) {
    const kmField = document.getElementById('service-km');
    const vehicle = getVehicle(service.vehicleId);
    if (kmField && !kmField.value && vehicle && vehicle.lastKm !== null) kmField.value = String(vehicle.lastKm);
  }
}

function toggleQuickVehiclePanel() {
  const panel = document.getElementById('quick-vehicle-panel');
  if (!panel) return;
  panel.hidden = !panel.hidden;
  if (!panel.hidden) {
    const plate = document.getElementById('quick-vehicle-plate');
    if (plate) plate.focus();
  }
}

function saveQuickVehicle() {
  const customerSelect = document.getElementById('service-customer');
  const plate = document.getElementById('quick-vehicle-plate');
  const brand = document.getElementById('quick-vehicle-brand');
  const model = document.getElementById('quick-vehicle-model');
  const form = document.getElementById('service-form');
  if (!customerSelect || !plate || !brand || !model || !form) return;

  try {
    const values = validateVehicleValues({
      customerId: customerSelect.value,
      plate: plate.value,
      brand: brand.value,
      model: model.value
    }, '');
    const vehicle = Object.assign({
      id: nextSequentialId('VHC-', state.data.vehicles),
      year: null,
      lastKm: null,
      notes: '',
      createdAt: new Date().toISOString()
    }, values);
    state.data.vehicles.push(vehicle);

    const vehicleSelect = document.getElementById('service-vehicle');
    if (vehicleSelect) {
      vehicleSelect.innerHTML = serviceVehicleOptions(values.customerId, vehicle.id);
      vehicleSelect.value = vehicle.id;
    }
    toggleQuickVehiclePanel();
    plate.value = '';
    brand.value = '';
    model.value = '';
    showToast('success', 'Kendaraan ditambahkan', values.plate + ' tersimpan dan langsung dipilih pada servis ini.');
  } catch (error) {
    showFormError(form, error.message);
  }
}

function onServiceCustomerChange(select) {
  const vehicleSelect = document.getElementById('service-vehicle');
  if (vehicleSelect) vehicleSelect.innerHTML = serviceVehicleOptions(select.value, '');
  const panel = document.getElementById('quick-vehicle-panel');
  if (panel) panel.hidden = true;
}

function saveServiceForm(form) {
  if (lockForm(form)) return;
  clearFormError(form);
  syncServiceItemsFromDom();
  const id = form.dataset.id || '';
  const existing = id ? getService(id) : null;
  if (id && !existing) {
    showFormError(form, 'Servis tidak ditemukan.');
    unlockForm(form);
    return;
  }

  const customerId = form.querySelector('#service-customer').value;
  const vehicleId = form.querySelector('#service-vehicle').value;
  const entryDate = form.querySelector('#service-entry-date').value;
  const estimateDate = form.querySelector('#service-estimate-date').value.trim();
  const kmText = form.querySelector('#service-km').value.trim();
  const mechanic = form.querySelector('#service-mechanic').value;
  const status = form.querySelector('#service-status').value;
  const complaint = form.querySelector('#service-complaint').value.trim();
  const diagnosis = form.querySelector('#service-diagnosis').value.trim();
  const notes = form.querySelector('#service-notes').value.trim();

  if (!getCustomer(customerId)) {
    showFormError(form, 'Pelanggan wajib dipilih.', form.querySelector('#service-customer'));
    unlockForm(form);
    return;
  }
  const vehicle = getVehicle(vehicleId);
  if (!vehicle || vehicle.customerId !== customerId) {
    showFormError(form, 'Pilih kendaraan yang valid untuk pelanggan ini.', form.querySelector('#service-vehicle'));
    unlockForm(form);
    return;
  }
  if (!isValidISODate(entryDate)) {
    showFormError(form, 'Tanggal masuk wajib diisi dengan format yang benar.', form.querySelector('#service-entry-date'));
    unlockForm(form);
    return;
  }
  if (estimateDate && !isValidISODate(estimateDate)) {
    showFormError(form, 'Estimasi selesai tidak valid.', form.querySelector('#service-estimate-date'));
    unlockForm(form);
    return;
  }
  if (complaint.length < 3) {
    showFormError(form, 'Keluhan pelanggan minimal 3 karakter.', form.querySelector('#service-complaint'));
    unlockForm(form);
    return;
  }
  if (!SERVICE_STATUSES.includes(status)) {
    showFormError(form, 'Status servis tidak valid.', form.querySelector('#service-status'));
    unlockForm(form);
    return;
  }

  let km = null;
  if (kmText) {
    km = parseNumber(kmText, NaN);
    if (!Number.isFinite(km) || km < 0) {
      showFormError(form, 'Kilometer tidak boleh negatif.', form.querySelector('#service-km'));
      unlockForm(form);
      return;
    }
    km = roundMoney(km);
  }

  if (!serviceFormItems.length) {
    showFormError(form, 'Tambahkan minimal satu item pekerjaan atau suku cadang.');
    unlockForm(form);
    return;
  }

  let itemError = '';
  serviceFormItems.some(function (item, index) {
    const rowNumber = index + 1;
    const name = String(item.name || '').trim();
    const quantity = parseNumber(item.qty, NaN);
    const price = parseNumber(item.unitPrice, NaN);
    if (!name) {
      itemError = 'Nama item pada baris ' + rowNumber + ' wajib diisi.';
    } else if (!Number.isFinite(quantity) || quantity <= 0) {
      itemError = 'Qty pada baris ' + rowNumber + ' harus lebih besar dari nol.';
    } else if (!Number.isFinite(price) || price < 0) {
      itemError = 'Harga pada baris ' + rowNumber + ' tidak boleh negatif.';
    } else if (item.type === 'part' && (!item.partId || !getPart(item.partId))) {
      itemError = 'Pilih suku cadang yang valid pada baris ' + rowNumber + '.';
    }
    return Boolean(itemError);
  });
  if (itemError) {
    showFormError(form, itemError);
    unlockForm(form);
    return;
  }

  const items = serviceFormItems.map(function (item) {
    const isPart = item.type === 'part';
    return {
      id: item.id || uniqueId('ITM'),
      name: String(item.name || '').trim(),
      type: isPart ? 'part' : 'service',
      qty: roundQuantity(parseNumber(item.qty, 0)),
      unitPrice: roundMoney(parseNumber(item.unitPrice, 0)),
      partId: isPart ? item.partId : ''
    };
  });

  const candidate = {
    id: existing ? existing.id : nextSequentialId('SVC-', state.data.services),
    number: existing ? existing.number : nextServiceNumber(entryDate, state.data.services),
    customerId: customerId,
    vehicleId: vehicleId,
    entryDate: entryDate,
    estimateDate: estimateDate,
    km: km,
    complaint: complaint,
    diagnosis: diagnosis,
    mechanic: mechanic,
    notes: notes,
    status: status,
    items: items,
    payments: existing ? existing.payments : [],
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    applyStockDifference(existing, candidate);
  } catch (error) {
    showFormError(form, error.message);
    unlockForm(form);
    return;
  }

  if (existing) {
    Object.assign(existing, candidate);
  } else {
    state.data.services.push(candidate);
  }
  updateVehicleOdometer(vehicleId, km);

  saveData();
  closeModal();
  renderCurrentPage();
  showToast('success', 'Servis berhasil disimpan', candidate.number + ' · ' + vehicle.plate + ' tercatat di daftar servis.');
}

function requestDeleteService(id) {
  const service = getService(id);
  if (!service) return;
  const customer = getCustomerForService(service);
  const usedParts = (service.items || []).some(function (item) { return item.type === 'part' && item.partId; });
  const stockNote = usedParts ? ' Stok suku cadang yang terpakai akan dikembalikan ke inventaris.' : '';

  openConfirm({
    title: 'Hapus Servis',
    heading: 'Hapus servis ini?',
    message: 'Servis <strong>' + escapeHtml(service.number) + '</strong> milik <strong>' + escapeHtml(customer ? customer.name : 'pelanggan') + '</strong> akan dihapus beserta item dan riwayat pembayarannya.' + stockNote,
    confirmLabel: 'Hapus Servis',
    onConfirm: function () {
      applyStockDifference(service, null);
      state.data.services = state.data.services.filter(function (entry) { return entry.id !== service.id; });
      saveData();
      closeModal();
      renderCurrentPage();
      showToast('success', 'Data berhasil dihapus', 'Servis ' + service.number + ' telah dihapus.');
    }
  });
}

function changeServiceStatus(select) {
  const service = getService(select.dataset.id);
  if (!service) return;
  const nextStatus = select.value;
  if (nextStatus === service.status) return;
  const previousStatus = service.status;
  service.status = nextStatus;

  try {
    applyStockDifference(Object.assign({}, service, { status: previousStatus }), service);
  } catch (error) {
    service.status = previousStatus;
    select.value = previousStatus;
    showToast('danger', 'Stok tidak mencukupi', error.message);
    return;
  }

  saveData();
  const meta = serviceStatusMeta(nextStatus);
  select.className = 'status-select ' + meta.select + (select.classList.contains('service-status-control') ? ' service-status-control' : '');
  updateHeaderNotifications();

  if (state.activeModalType === 'service-detail') {
    openServiceDetail(service.id);
  } else {
    renderCurrentPage();
  }

  if (nextStatus === 'Dibatalkan') {
    showToast('warning', 'Servis dibatalkan', service.number + ' · stok suku cadang dikembalikan ke inventaris.');
  } else if (previousStatus === 'Dibatalkan') {
    showToast('info', 'Servis diaktifkan kembali', service.number + ' · stok suku cadang dikurangi kembali.');
  } else {
    showToast('success', 'Status servis diperbarui', service.number + ' · ' + nextStatus);
  }
}

function openServiceDetail(id) {
  const service = getService(id);
  if (!service) {
    showToast('danger', 'Servis tidak ditemukan', 'Data mungkin sudah dihapus.');
    return;
  }
  const customer = getCustomerForService(service);
  const vehicle = getVehicleForService(service);
  const total = calculateServiceTotal(service);
  const paid = calculatePaidTotal(service);
  const remaining = getRemainingBalance(service);
  const paymentStatus = calculatePaymentStatus(service);

  const itemRows = (service.items || []).length
    ? service.items.map(function (item, index) {
      const isPart = item.type === 'part';
      return '<tr><td>' + (index + 1) + '. ' + escapeHtml(item.name || 'Item') + '</td>' +
        '<td><span class="item-type-tag' + (isPart ? ' is-part' : '') + '">' + (isPart ? 'Suku cadang' : 'Jasa') + '</span></td>' +
        '<td class="cell-right receipt-num">' + formatQuantity(item.qty) + '</td>' +
        '<td class="cell-right receipt-num">' + formatCurrency(item.unitPrice) + '</td>' +
        '<td class="cell-right receipt-num">' + formatCurrency(roundMoney(parseNumber(item.qty, 0) * parseNumber(item.unitPrice, 0))) + '</td></tr>';
    }).join('')
    : '<tr><td colspan="5" class="detail-empty">Belum ada item pekerjaan.</td></tr>';

  const paymentList = (service.payments || []).length
    ? '<div class="payment-list">' + sortedPayments(service).map(function (payment) {
      return '<div class="payment-list-item"><div class="payment-list-copy"><strong>' + escapeHtml(formatDate(payment.date) + ' · ' + payment.method) + '</strong>' +
        '<span>' + escapeHtml(payment.notes || 'Pembayaran diterima') + '</span></div>' +
        '<span class="payment-list-amount">+ ' + formatCurrency(payment.amount) + '</span></div>';
    }).join('') + '</div>'
    : '<div class="detail-empty">Belum ada pembayaran tercatat.</div>';

  const paymentForm = remaining > 0
    ? '<div id="payment-form-wrap" hidden><div class="inline-payment-form"><div class="form-inline-title">' + icon('wallet') + ' Catat pembayaran baru</div>' +
      '<form id="payment-form" data-id="' + escapeHtml(service.id) + '" novalidate>' +
      '<div class="form-error" data-form-error hidden></div>' +
      '<div class="form-grid">' +
      '<div class="field"><label for="payment-amount">Jumlah bayar <span class="required-mark">*</span></label><input class="input" id="payment-amount" type="number" min="1" step="1" value="' + escapeHtml(String(remaining)) + '"></div>' +
      '<div class="field"><label for="payment-date">Tanggal bayar <span class="required-mark">*</span></label><input class="input" id="payment-date" type="date" value="' + escapeHtml(todayISO()) + '"></div>' +
      '<div class="field"><label for="payment-method">Metode</label><select class="select" id="payment-method">' + PAYMENT_METHODS.map(function (method) { return '<option value="' + escapeHtml(method) + '">' + escapeHtml(method) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field span-2"><label for="payment-notes">Catatan (opsional)</label><input class="input" id="payment-notes" placeholder="Contoh: DP servis, pelunasan..."></div>' +
      '</div>' +
      '<div class="form-actions"><button class="btn btn-secondary btn-sm" type="button" data-action="toggle-payment-form">Batal</button>' +
      '<button class="btn btn-primary btn-sm" type="submit" form="payment-form">' + icon('check') + ' Simpan Pembayaran</button></div>' +
      '</form></div></div>'
    : '<div class="form-notice" style="margin-top:12px">' + icon('check-circle') + '<span>Seluruh biaya servis ini sudah lunas. Terima kasih.</span></div>';

  const body = '<div class="detail-top">' +
    '<div><span class="detail-number">' + escapeHtml(service.number) + '</span>' +
    '<h3>' + escapeHtml(customer ? customer.name : 'Pelanggan') + '</h3>' +
    '<div class="detail-top-meta">' + renderStatusBadge(service.status) + renderPaymentBadge(paymentStatus) +
    '<span class="badge badge-neutral">' + escapeHtml(vehicle ? vehicle.plate : 'Tanpa kendaraan') + '</span>' +
    '<span class="badge badge-neutral">' + escapeHtml(formatDate(service.entryDate)) + '</span></div></div>' +
    '<div class="detail-top-right"><span class="detail-total-label">Total biaya servis</span><strong class="detail-total-value">' + formatCurrency(total) + '</strong>' +
    '<div class="detail-select-wrap"><label for="detail-status">Status</label>' + renderStatusControl(service, 'service-status-control', 'Ubah status ' + service.number).replace('<select', '<select id="detail-status"') + '</div></div></div>' +

    '<div class="detail-grid">' +
    '<div class="info-card"><div class="info-card-head">' + icon('wrench') + ' Detail servis</div><div class="info-list">' +
    '<div class="info-row"><span>Tanggal masuk</span><strong>' + escapeHtml(formatDate(service.entryDate)) + '</strong></div>' +
    '<div class="info-row"><span>Estimasi selesai</span><strong>' + escapeHtml(service.estimateDate ? formatDate(service.estimateDate) : '—') + '</strong></div>' +
    '<div class="info-row"><span>Kilometer</span><strong>' + (service.km !== null ? formatQuantity(service.km) + ' km' : '—') + '</strong></div>' +
    '<div class="info-row"><span>Mekanik</span><strong>' + escapeHtml(service.mechanic || '—') + '</strong></div>' +
    '</div></div>' +
    '<div class="info-card"><div class="info-card-head">' + icon('user') + ' Pelanggan & kendaraan</div><div class="info-list">' +
    '<div class="info-row"><span>Pelanggan</span><strong>' + escapeHtml(customer ? customer.name : '—') + '</strong></div>' +
    '<div class="info-row"><span>Telepon</span><strong>' + escapeHtml(customer ? customer.phone : '—') + '</strong></div>' +
    '<div class="info-row"><span>Kendaraan</span><strong>' + escapeHtml(vehicle ? vehicle.brand + ' ' + vehicle.model : '—') + '</strong></div>' +
    '<div class="info-row"><span>Nomor polisi</span><strong>' + escapeHtml(vehicle ? vehicle.plate : '—') + '</strong></div>' +
    '</div></div></div>' +

    '<div class="detail-block"><div class="detail-block-head"><div><h4>Keluhan & diagnosa</h4><p>Catatan pemeriksaan kendaraan</p></div></div>' +
    '<div class="info-list"><div class="info-row"><span>Keluhan</span><strong class="is-normal">' + escapeHtml(service.complaint) + '</strong></div>' +
    '<div class="info-row"><span>Diagnosa</span><strong class="is-normal">' + escapeHtml(service.diagnosis || '—') + '</strong></div>' +
    '<div class="info-row"><span>Catatan</span><strong class="is-normal">' + escapeHtml(service.notes || '—') + '</strong></div></div></div>' +

    '<div class="detail-block"><div class="detail-block-head"><div><h4>Rincian pekerjaan</h4><p>' + (service.items || []).length + ' item tercatat</p></div></div>' +
    '<div class="table-wrap"><table class="data-table item-detail-table"><thead><tr><th>Item</th><th>Jenis</th><th class="cell-right">Qty</th><th class="cell-right">Harga</th><th class="cell-right">Subtotal</th></tr></thead>' +
    '<tbody>' + itemRows + '</tbody></table></div></div>' +

    '<div class="detail-block"><div class="detail-block-head"><div><h4>Pembayaran</h4><p>Riwayat transaksi untuk servis ini</p></div></div>' +
    '<div class="payment-summary">' +
    '<div class="payment-summary-box"><span>Total biaya</span><strong>' + formatCurrency(total) + '</strong></div>' +
    '<div class="payment-summary-box"><span>Sudah dibayar</span><strong>' + formatCurrency(paid) + '</strong></div>' +
    '<div class="payment-summary-box' + (remaining > 0 ? ' is-highlight' : '') + '"><span>Sisa tagihan</span><strong>' + formatCurrency(remaining) + '</strong></div>' +
    '</div>' +
    '<div style="margin-top:12px">' + paymentList + '</div>' +
    paymentForm + '</div>';

  const footer = '<button class="btn btn-secondary" data-action="close-modal">Tutup</button>' +
    '<button class="btn btn-secondary" data-action="print-receipt" data-id="' + escapeHtml(service.id) + '" title="Cetak nota">' + icon('printer') + ' Cetak Nota</button>' +
    '<button class="btn btn-secondary" data-action="edit-service" data-id="' + escapeHtml(service.id) + '">' + icon('edit') + ' Edit Servis</button>' +
    (remaining > 0 ? '<button class="btn btn-primary" data-action="toggle-payment-form">' + icon('wallet') + ' Catat Pembayaran</button>' : '');

  openModal({
    title: 'Detail Servis',
    subtitle: service.number,
    body: body,
    footer: footer,
    size: 'modal-lg',
    type: 'service-detail',
    serviceId: service.id
  });
}

function togglePaymentForm() {
  const wrap = document.getElementById('payment-form-wrap');
  if (!wrap) return;
  wrap.hidden = !wrap.hidden;
  if (!wrap.hidden) {
    const amount = document.getElementById('payment-amount');
    if (amount) amount.focus();
  }
}

function savePaymentForm(form) {
  if (lockForm(form)) return;
  clearFormError(form);
  const service = getService(form.dataset.id);
  if (!service) {
    showFormError(form, 'Servis tidak ditemukan.');
    unlockForm(form);
    return;
  }

  const amount = parseNumber(form.querySelector('#payment-amount').value, NaN);
  const date = form.querySelector('#payment-date').value;
  const method = form.querySelector('#payment-method').value;
  const notes = form.querySelector('#payment-notes').value.trim();
  const remaining = getRemainingBalance(service);

  if (!Number.isFinite(amount) || amount <= 0) {
    showFormError(form, 'Jumlah pembayaran harus lebih besar dari nol.', form.querySelector('#payment-amount'));
    unlockForm(form);
    return;
  }
  if (amount > remaining + 0.5) {
    showFormError(form, 'Jumlah pembayaran melebihi sisa tagihan (' + formatCurrency(remaining) + ').', form.querySelector('#payment-amount'));
    unlockForm(form);
    return;
  }
  if (!isValidISODate(date)) {
    showFormError(form, 'Tanggal pembayaran wajib diisi.', form.querySelector('#payment-date'));
    unlockForm(form);
    return;
  }
  if (!PAYMENT_METHODS.includes(method)) {
    showFormError(form, 'Metode pembayaran tidak valid.', form.querySelector('#payment-method'));
    unlockForm(form);
    return;
  }

  service.payments = service.payments || [];
  service.payments.push({
    id: uniqueId('PAY'),
    amount: roundMoney(amount),
    date: date,
    method: method,
    notes: notes,
    createdAt: new Date().toISOString()
  });
  service.updatedAt = new Date().toISOString();

  saveData();
  openServiceDetail(service.id);
  showToast('success', 'Pembayaran berhasil disimpan', formatCurrency(amount) + ' tercatat untuk ' + service.number + '.');
}

function formatReceiptTime() {
  const now = new Date();
  return padNumber(now.getDate(), 2) + '/' + padNumber(now.getMonth() + 1, 2) + '/' + now.getFullYear() + ' ' + padNumber(now.getHours(), 2) + ':' + padNumber(now.getMinutes(), 2);
}

function printReceipt(id) {
  const service = getService(id);
  if (!service || !els.printReceipt) {
    showToast('danger', 'Nota tidak tersedia', 'Data servis tidak ditemukan.');
    return;
  }
  const settings = state.data.settings;
  const customer = getCustomerForService(service);
  const vehicle = getVehicleForService(service);
  const total = calculateServiceTotal(service);
  const paid = calculatePaidTotal(service);
  const remaining = getRemainingBalance(service);

  const itemRows = (service.items || []).length
    ? service.items.map(function (item) {
      return '<tr><td>' + escapeHtml(item.name || 'Item') + '</td>' +
        '<td class="receipt-num">' + formatQuantity(item.qty) + '</td>' +
        '<td class="receipt-num">' + formatCurrency(item.unitPrice) + '</td>' +
        '<td class="receipt-num">' + formatCurrency(roundMoney(parseNumber(item.qty, 0) * parseNumber(item.unitPrice, 0))) + '</td></tr>';
    }).join('')
    : '<tr><td colspan="4">Tidak ada item.</td></tr>';

  const paymentHistory = (service.payments || []).length
    ? '<div class="receipt-payment-history"><h3>Riwayat pembayaran</h3>' + sortedPayments(service).map(function (payment) {
      return '<p>' + escapeHtml(formatDate(payment.date) + ' · ' + payment.method + ' · ' + formatCurrency(payment.amount) + (payment.notes ? ' · ' + payment.notes : '')) + '</p>';
    }).join('') + '</div>'
    : '';

  els.printReceipt.innerHTML = '<div class="receipt-brand-row">' +
    '<div class="receipt-brand"><h1>' + escapeHtml(settings.workshopName || 'MotoCare') + '</h1>' +
    '<p>Bengkel &amp; servis motor</p>' +
    '<div class="receipt-brand-meta">' + escapeHtml(settings.address || 'Alamat bengkel belum diisi') + '<br>' + escapeHtml(settings.phone ? 'Telepon: ' + settings.phone : '') + '</div></div>' +
    '<div class="receipt-title"><h2>NOTA SERVIS</h2><p>' + escapeHtml(service.number) + '</p>' +
    '<span class="receipt-status">' + escapeHtml(service.status) + '</span></div></div>' +

    '<div class="receipt-info-grid">' +
    '<div class="receipt-info-block"><h3>Pelanggan</h3><p>' + escapeHtml(customer ? customer.name : '—') + '</p><p>' + escapeHtml(customer ? customer.phone : '') + '</p></div>' +
    '<div class="receipt-info-block"><h3>Kendaraan</h3><p>' + escapeHtml(vehicle ? vehicle.plate + ' · ' + vehicle.brand + ' ' + vehicle.model : '—') + '</p>' +
    '<p>Tanggal masuk: ' + escapeHtml(formatDate(service.entryDate)) + (service.km !== null ? ' · ' + formatQuantity(service.km) + ' km' : '') + '</p></div></div>' +

    '<table class="receipt-table"><thead><tr><th>Deskripsi</th><th class="receipt-num">Qty</th><th class="receipt-num">Harga</th><th class="receipt-num">Subtotal</th></tr></thead>' +
    '<tbody>' + itemRows + '</tbody></table>' +

    '<div class="receipt-summary"><div class="receipt-summary-box">' +
    '<div class="receipt-summary-row is-total"><span>Total</span><span>' + formatCurrency(total) + '</span></div>' +
    '<div class="receipt-summary-row"><span>Dibayar</span><span>' + formatCurrency(paid) + '</span></div>' +
    '<div class="receipt-summary-row' + (remaining > 0 ? ' is-balance' : '') + '"><span>Sisa</span><span>' + formatCurrency(remaining) + '</span></div>' +
    '</div></div>' +
    paymentHistory +
    '<div class="receipt-note">Terima kasih telah mempercayakan servis kendaraan Anda kepada ' + escapeHtml(settings.workshopName || 'MotoCare') + '. Simpan nota ini sebagai bukti transaksi resmi.</div>' +
    '<div class="receipt-footer"><span>Dicetak: ' + escapeHtml(formatReceiptTime()) + '</span><span>Petugas: ' + escapeHtml(service.mechanic || '—') + '</span></div>';

  window.print();
  window.setTimeout(function () {
    if (els.printReceipt) els.printReceipt.innerHTML = '';
  }, 1500);
}

function saveSettingsForm(form) {
  if (lockForm(form)) return;
  clearFormError(form);
  const workshopName = form.querySelector('#workshop-name').value.trim();
  const phone = form.querySelector('#workshop-phone').value.trim();
  const address = form.querySelector('#workshop-address').value.trim();

  if (!workshopName) {
    showFormError(form, 'Nama bengkel wajib diisi.', form.querySelector('#workshop-name'));
    unlockForm(form);
    return;
  }
  if (phone && !isValidPhone(phone)) {
    showFormError(form, 'Nomor telepon bengkel tidak valid (8 sampai 15 digit angka).', form.querySelector('#workshop-phone'));
    unlockForm(form);
    return;
  }

  state.data.settings.workshopName = workshopName;
  state.data.settings.phone = phone;
  state.data.settings.address = address;
  state.data.settings.mechanics = Array.isArray(state.mechanicDraft) ? state.mechanicDraft.slice() : [];

  saveData();
  renderCurrentPage();
  showToast('success', 'Pengaturan disimpan', 'Identitas bengkel dan daftar mekanik berhasil diperbarui.');
}

function addMechanic() {
  const input = document.getElementById('mechanic-input');
  if (!input) return;
  const name = input.value.trim();
  if (!name) {
    showToast('warning', 'Nama mekanik kosong', 'Tulis nama mekanik terlebih dahulu.');
    return;
  }
  const exists = (state.mechanicDraft || []).some(function (mechanic) {
    return mechanic.toLowerCase() === name.toLowerCase();
  });
  if (exists) {
    showToast('warning', 'Mekanik sudah terdaftar', name + ' sudah ada dalam daftar.');
    return;
  }
  state.mechanicDraft.push(name);
  input.value = '';
  renderMechanicList();
  input.focus();
}

function removeMechanic(index) {
  if (!Array.isArray(state.mechanicDraft)) return;
  state.mechanicDraft.splice(index, 1);
  renderMechanicList();
}

function requestResetDemo() {
  openConfirm({
    tone: 'warning',
    icon: 'refresh',
    title: 'Reset Data Demo',
    heading: 'Ganti dengan data contoh?',
    message: 'Seluruh data saat ini akan <strong>diganti</strong> dengan contoh data MotoCare (pelanggan, kendaraan, servis, suku cadang, dan pembayaran).',
    confirmLabel: 'Reset Data Demo',
    onConfirm: function () {
      state.data = buildDemoData();
      saveData();
      storage.set(DEMO_FLAG_KEY, 'true');
      closeModal();
      navigate('dashboard');
      showToast('success', 'Data demo dimuat', 'MotoCare kembali menggunakan contoh data demo.');
    }
  });
}

function requestClearData() {
  openConfirm({
    title: 'Hapus Semua Data',
    heading: 'Hapus seluruh data MotoCare?',
    message: 'Semua pelanggan, kendaraan, servis, pembayaran, suku cadang, dan log stok akan dihapus permanen dari browser ini.',
    confirmLabel: 'Hapus Semua Data',
    requireText: 'HAPUS',
    onConfirm: function () {
      state.data = createEmptyData();
      storage.set(DEMO_FLAG_KEY, 'true');
      saveData();
      closeModal();
      navigate('dashboard');
      showToast('success', 'Data dibersihkan', 'Semua data telah dihapus. Silakan mulai dari awal.');
    }
  });
}

function confirmPendingAction() {
  const expected = state.confirmExpected;
  if (expected) {
    const input = document.getElementById('confirm-text');
    if (!input || input.value.trim() !== expected) {
      showToast('warning', 'Konfirmasi tidak cocok', 'Ketik ' + expected + ' untuk melanjutkan.');
      return;
    }
  }
  const action = state.confirmAction;
  state.confirmAction = null;
  if (typeof action === 'function') action();
}

function goToServicesPage(page) {
  const target = parseInt(page, 10);
  if (!Number.isFinite(target) || target < 1) return;
  state.servicesUI.page = target;
  renderServicesResults();
}

function closestFrom(target, selector) {
  return target instanceof Element ? target.closest(selector) : null;
}

function onClick(event) {
  const target = event.target;

  const toastClose = closestFrom(target, '[data-action="dismiss-toast"]');
  if (toastClose) {
    dismissToast(toastClose.closest('.toast'));
    return;
  }

  const navButton = closestFrom(target, '[data-nav]');
  if (navButton) {
    navigate(navButton.dataset.nav);
    return;
  }

  const actionElement = closestFrom(target, '[data-action]');
  const action = actionElement ? actionElement.dataset.action : '';
  const id = actionElement ? (actionElement.dataset.id || '') : '';

  if (els.modalRoot && !els.modalRoot.hidden && target === els.modalRoot) {
    closeModal();
    return;
  }

  if (!closestFrom(target, '#header-search')) {
    closeGlobalSearch();
  }
  if (!closestFrom(target, '#notification-popover') && target !== els.notificationButton) {
    closeNotificationPopover();
  }

  switch (action) {
    case 'close-modal':
      closeModal();
      return;
    case 'confirm-action':
      confirmPendingAction();
      return;
    case 'open-service-modal':
      closeGlobalSearch(true);
      openServiceModal();
      return;
    case 'edit-service':
      closeGlobalSearch(true);
      openServiceModal(id);
      return;
    case 'view-service':
      closeGlobalSearch(true);
      closeNotificationPopover();
      openServiceDetail(id);
      return;
    case 'delete-service':
      requestDeleteService(id);
      return;
    case 'open-customer-modal':
      closeGlobalSearch(true);
      openCustomerModal();
      return;
    case 'edit-customer':
      closeGlobalSearch(true);
      openCustomerModal(id);
      return;
    case 'view-customer':
      closeGlobalSearch(true);
      openCustomerDetail(id);
      return;
    case 'delete-customer':
      requestDeleteCustomer(id);
      return;
    case 'open-vehicle-modal':
      closeGlobalSearch(true);
      openVehicleModal('', actionElement.dataset.customerId || '');
      return;
    case 'edit-vehicle':
      closeGlobalSearch(true);
      openVehicleModal(id);
      return;
    case 'view-vehicle':
      closeGlobalSearch(true);
      openVehicleDetail(id);
      return;
    case 'delete-vehicle':
      requestDeleteVehicle(id);
      return;
    case 'open-part-modal':
      openPartModal();
      return;
    case 'edit-part':
      openPartModal(id);
      return;
    case 'add-stock':
      openStockModal(id);
      return;
    case 'delete-part':
      requestDeletePart(id);
      return;
    case 'toggle-theme':
      toggleTheme();
      if (state.currentPage === 'settings') renderSettingsPage();
      return;
    case 'set-theme':
      setTheme(actionElement.dataset.themeChoice);
      if (state.currentPage === 'settings') renderSettingsPage();
      return;
    case 'collapse-sidebar':
      toggleSidebarCollapsed();
      return;
    case 'open-drawer':
      openDrawer();
      return;
    case 'close-drawer':
      closeDrawer();
      return;
    case 'toggle-notifications':
      toggleNotificationPopover();
      return;
    case 'global-search-all':
      runGlobalSearchAll();
      return;
    case 'reset-service-filters':
      resetServiceFilters();
      return;
    case 'services-page':
      goToServicesPage(actionElement.dataset.page);
      return;
    case 'export-csv':
      exportReportCsv();
      return;
    case 'reset-demo':
      requestResetDemo();
      return;
    case 'clear-data':
      requestClearData();
      return;
    case 'add-mechanic':
      addMechanic();
      return;
    case 'remove-mechanic':
      removeMechanic(Number(actionElement.dataset.index));
      return;
    case 'add-service-item':
      addServiceItemDraft('service');
      return;
    case 'remove-service-item':
      removeServiceItemDraft(Number(actionElement.dataset.index));
      return;
    case 'toggle-quick-vehicle':
      toggleQuickVehiclePanel();
      return;
    case 'save-quick-vehicle':
      saveQuickVehicle();
      return;
    case 'toggle-payment-form':
      togglePaymentForm();
      return;
    case 'print-receipt':
      printReceipt(id);
      return;
    default:
      break;
  }
}

function onInput(event) {
  const target = event.target;

  if (target === els.globalSearch) {
    renderGlobalSearchResults(target.value);
    return;
  }

  const searchField = closestFrom(target, '[data-list-search]');
  if (searchField) {
    const list = searchField.dataset.listSearch;
    if (list === 'services') {
      state.servicesUI.search = searchField.value;
      state.servicesUI.page = 1;
      renderServicesResults();
    } else if (list === 'customers') {
      state.customersUI.search = searchField.value;
      renderCustomersResults();
    } else if (list === 'vehicles') {
      state.vehiclesUI.search = searchField.value;
      renderVehiclesResults();
    } else if (list === 'inventory') {
      state.inventoryUI.search = searchField.value;
      renderInventoryResults();
    }
    return;
  }

  const confirmText = document.getElementById('confirm-text');
  if (confirmText && target === confirmText) {
    const button = document.querySelector('[data-action="confirm-action"]');
    if (button) button.disabled = target.value.trim() !== state.confirmExpected;
    return;
  }

  const itemField = closestFrom(target, '[data-item-field]');
  if (itemField && itemField.tagName !== 'SELECT') {
    const row = closestFrom(target, '.item-row');
    if (row) {
      const item = serviceFormItems[Number(row.dataset.itemIndex)];
      if (item) {
        item[itemField.dataset.itemField] = itemField.value;
        if (itemField.dataset.itemField === 'qty' || itemField.dataset.itemField === 'unitPrice') {
          const subtotalNode = row.querySelector('.item-subtotal strong');
          if (subtotalNode) {
            subtotalNode.textContent = formatCurrency(roundMoney(parseNumber(item.qty, 0) * parseNumber(item.unitPrice, 0)));
          }
          updateServiceTotalsBar();
        }
      }
    }
    return;
  }
}

function onChange(event) {
  const target = event.target;

  const statusSelect = closestFrom(target, '[data-service-status]');
  if (statusSelect) {
    changeServiceStatus(statusSelect);
    return;
  }

  const serviceFilter = closestFrom(target, '[data-service-filter]');
  if (serviceFilter) {
    state.servicesUI[serviceFilter.dataset.serviceFilter] = serviceFilter.value;
    state.servicesUI.page = 1;
    renderServicesResults();
    return;
  }

  const vehicleFilter = closestFrom(target, '[data-vehicle-filter="brand"]');
  if (vehicleFilter) {
    state.vehiclesUI.brand = vehicleFilter.value;
    renderVehiclesResults();
    return;
  }

  const inventoryFilter = closestFrom(target, '[data-inventory-filter="category"]');
  if (inventoryFilter) {
    state.inventoryUI.category = inventoryFilter.value;
    renderInventoryResults();
    return;
  }

  const reportRange = closestFrom(target, '[data-report-range]');
  if (reportRange) {
    state.reportUI.range = reportRange.value;
    renderReportsPage();
    return;
  }

  const reportDate = closestFrom(target, '[data-report-date]');
  if (reportDate) {
    state.reportUI[reportDate.dataset.reportDate] = reportDate.value;
    renderReportResults();
    return;
  }

  if (target.id === 'service-customer') {
    onServiceCustomerChange(target);
    return;
  }

  if (target.id === 'service-vehicle') {
    const kmField = document.getElementById('service-km');
    const vehicle = getVehicle(target.value);
    if (kmField && !kmField.value && vehicle && vehicle.lastKm !== null) kmField.value = String(vehicle.lastKm);
    return;
  }

  if (target.dataset && target.dataset.action === 'quick-add-part') {
    if (target.value) {
      addServiceItemDraft('part', target.value);
      target.value = '';
    }
    return;
  }

  if (target.tagName === 'SELECT' && target.dataset.itemField) {
    const row = closestFrom(target, '.item-row');
    if (!row) return;
    const index = Number(row.dataset.itemIndex);
    syncServiceItemsFromDom();
    const item = serviceFormItems[index];
    if (!item) return;
    if (target.dataset.itemField === 'type') {
      item.type = target.value === 'part' ? 'part' : 'service';
      item.partId = '';
    } else if (target.dataset.itemField === 'partId') {
      item.partId = target.value;
      const part = getPart(target.value);
      if (part) {
        item.name = part.name;
        item.unitPrice = part.price;
      }
    }
    renderServiceItemsEditor();
  }
}

function onSubmit(event) {
  const form = event.target;
  if (!form || !form.id) return;
  event.preventDefault();

  switch (form.id) {
    case 'customer-form':
      saveCustomerForm(form);
      break;
    case 'vehicle-form':
      saveVehicleForm(form);
      break;
    case 'part-form':
      savePartForm(form);
      break;
    case 'stock-form':
      saveStockForm(form);
      break;
    case 'service-form':
      saveServiceForm(form);
      break;
    case 'payment-form':
      savePaymentForm(form);
      break;
    case 'settings-form':
      saveSettingsForm(form);
      break;
    default:
      break;
  }
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    if (els.modalRoot && !els.modalRoot.hidden) {
      closeModal();
      return;
    }
    if (els.globalSearchResults && !els.globalSearchResults.hidden) {
      closeGlobalSearch(true);
      return;
    }
    if (els.notificationPopover && !els.notificationPopover.hidden) {
      closeNotificationPopover();
      return;
    }
    closeDrawer();
    return;
  }

  if (event.key === '/' && document.activeElement === document.body) {
    if (els.globalSearch) {
      event.preventDefault();
      els.globalSearch.focus();
    }
  }
}

function bindGlobalEvents() {
  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  document.addEventListener('submit', onSubmit);
  document.addEventListener('keydown', onKeydown);
}

init();




