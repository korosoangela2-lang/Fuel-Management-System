import AppRoutes from "./routes/AppRoutes";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'
const currency = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 })
const nav = [
  ['dashboard', '⌂', 'Overview'], ['inventory', '▣', 'Inventory'], ['orders', '▤', 'Orders'],
  ['customers', '♙', 'Customers'], ['deliveries', '↗', 'Deliveries'], ['reports', '◫', 'Reports'],
]

const fallback = {
  inventory: { products: [] }, pending_orders: 0, total_customers: 0,
  deliveries: { pending: 0, in_transit: 0, delivered: 0, failed: 0 }, my_recent_orders: [],
}

function displayNumber(value) { return new Intl.NumberFormat('en-KE').format(Number(value || 0)) }
function titleCase(value = '') { return value.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) }

function App() {
  return <AppRoutes />;
}

export default App;