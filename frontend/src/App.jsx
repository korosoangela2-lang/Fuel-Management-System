import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

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
  const [token, setToken] = useState(() => localStorage.getItem('fuel_access_token') || '')
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('fuel_user') || 'null'))
  const [page, setPage] = useState('dashboard')
  const [data, setData] = useState(fallback)
  const [collection, setCollection] = useState([])
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body?.error?.message || body?.message || 'Something went wrong. Please try again.')
    return body
  }, [token])

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    try { setData({ ...fallback, ...(await request('/reports/dashboard')) }) }
    catch (error) { setNotice(error.message) }
    finally { setLoading(false) }
  }, [request])

  const loadCollection = useCallback(async (name) => {
    const endpoints = { inventory: '/fuels', orders: '/orders', customers: '/customers', deliveries: '/distributions' }
    if (!endpoints[name]) return
    setLoading(true)
    try {
      const result = await request(endpoints[name])
      setCollection(Array.isArray(result) ? result : result.items || result.data || [])
    } catch (error) { setNotice(error.message); setCollection([]) }
    finally { setLoading(false) }
  }, [request])

  useEffect(() => {
    if (!token) return
    request('/auth/me').then(profile => { setUser(profile); localStorage.setItem('fuel_user', JSON.stringify(profile)) }).catch(() => logout())
    void Promise.resolve().then(loadDashboard)
  }, [token, request, loadDashboard])

  useEffect(() => { if (token && page !== 'dashboard') void Promise.resolve().then(() => loadCollection(page)) }, [page, token, loadCollection])

  function logout() {
    localStorage.removeItem('fuel_access_token'); localStorage.removeItem('fuel_user')
    setToken(''); setUser(null); setData(fallback)
  }
  function selectPage(next) { setPage(next); setMenuOpen(false); setNotice('') }

  if (!token) return <Login onSuccess={(result) => {
    localStorage.setItem('fuel_access_token', result.access_token); setToken(result.access_token)
  }} />

  const heading = nav.find(([id]) => id === page)?.[2] || 'FuelFlow'
  return <div className="app-shell">
    <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><span className="brand-mark">F</span><span>Fuel<span>Flow</span></span></div>
      <div className="workspace">WORKSPACE</div>
      <nav>{nav.map(([id, icon, label]) => <button key={id} className={page === id ? 'nav-item active' : 'nav-item'} onClick={() => selectPage(id)}><i>{icon}</i>{label}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><i>⚙</i>Settings</button><div className="support">Need a hand?<br /><a href="mailto:support@fuelflow.local">Contact support</a></div></div>
    </aside>
    <main>
      <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>☰</button><div><p className="eyebrow">OPERATIONS CENTER</p><h1>{heading}</h1></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♧<b></b></button><div className="profile"><div className="avatar">{(user?.username || 'U')[0]}</div><div><strong>{user?.username || 'FuelFlow user'}</strong><small>{titleCase(user?.role || 'team member')}</small></div></div><button className="logout" onClick={logout}>Sign out</button></div></header>
      <section className="content">
        {notice && <div className="notice"><span>ⓘ</span>{notice}<button onClick={() => setNotice('')}>×</button></div>}
        {page === 'dashboard' && <Dashboard data={data} loading={loading} onRefresh={loadDashboard} onNavigate={selectPage} />}
        {page === 'inventory' && <Collection title="Fuel inventory" description="Monitor stock levels and product availability across your region." rows={collection} loading={loading} type="inventory" onRefresh={() => loadCollection('inventory')} />}
        {page === 'orders' && <Collection title="Orders" description="Review customer orders and keep fulfillment moving." rows={collection} loading={loading} type="orders" onRefresh={() => loadCollection('orders')} />}
        {page === 'customers' && <Collection title="Customers" description="Your active customer accounts and purchase relationships." rows={collection} loading={loading} type="customers" onRefresh={() => loadCollection('customers')} />}
        {page === 'deliveries' && <Collection title="Deliveries" description="Track scheduled deliveries from dispatch to completion." rows={collection} loading={loading} type="deliveries" onRefresh={() => loadCollection('deliveries')} />}
        {page === 'reports' && <Reports request={request} loading={loading} />}
      </section>
    </main>
  </div>
}

function Login({ onSuccess }) {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(event) { event.preventDefault(); setBusy(true); setError(''); try { const response = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }); const result = await response.json(); if (!response.ok) throw new Error(result?.error?.message || 'Unable to sign in.'); onSuccess(result) } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <div className="login-page"><section className="login-pitch"><div className="brand"><span className="brand-mark">F</span><span>Fuel<span>Flow</span></span></div><div><p className="eyebrow">FUEL OPERATIONS, SIMPLIFIED</p><h1>Keep every litre<br />moving forward.</h1><p>One calm, connected place for inventory, orders, distribution and your team.</p></div><div className="login-stat"><strong>01</strong><span>platform for every<br />part of your operation</span></div></section><section className="login-card"><form onSubmit={submit}><p className="eyebrow">WELCOME BACK</p><h2>Sign in to FuelFlow</h2><p className="form-copy">Enter your account details to access your workspace.</p>{error && <div className="form-error">{error}</div>}<label>Username<input value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" placeholder="e.g. nrb_admin" /></label><label>Password<input value={password} onChange={e => setPassword(e.target.value)} required type="password" autoComplete="current-password" placeholder="Your password" /></label><button className="primary-button" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <span>→</span></button><p className="hint">Use your administrator-issued account to continue.</p></form></section></div>
}

function Dashboard({ data, loading, onRefresh, onNavigate }) {
  const fuels = data.inventory?.products || data.inventory?.fuels || data.inventory?.items || []
  const lowStock = fuels.filter(f => f.is_low_stock).length
  const deliveryTotal = Object.values(data.deliveries || {}).reduce((sum, amount) => sum + Number(amount || 0), 0)
  const cards = [['Pending orders', data.pending_orders, 'Awaiting approval', 'amber'], ['Available fuel', `${displayNumber(fuels.reduce((s, f) => s + Number(f.quantity_available || 0), 0))} L`, `${fuels.length} fuel products`, 'blue'], ['Customers', data.total_customers, 'Active customer accounts', 'green'], ['Deliveries', deliveryTotal, 'In the delivery pipeline', 'violet']]
  return <div><div className="page-intro"><div><p>Here’s what’s happening across your operation today.</p></div><button className="secondary-button" onClick={onRefresh} disabled={loading}>↻ {loading ? 'Refreshing…' : 'Refresh data'}</button></div><div className="stats-grid">{cards.map(([label, value, sub, color]) => <article className={`stat-card ${color}`} key={label}><span className="stat-icon">{label === 'Pending orders' ? '◷' : label === 'Available fuel' ? '◒' : label === 'Customers' ? '♙' : '↗'}</span><p>{label}</p><h2>{value}</h2><small>{sub}</small></article>)}</div><div className="dashboard-grid"><section className="panel inventory-panel"><div className="panel-heading"><div><p className="eyebrow">STOCK AT A GLANCE</p><h2>Inventory health</h2></div><button className="text-button" onClick={() => onNavigate('inventory')}>View inventory →</button></div>{fuels.length ? <div className="fuel-list">{fuels.slice(0, 5).map(fuel => <div className="fuel-row" key={fuel.id}><div className="fuel-icon">◒</div><div className="fuel-info"><strong>{fuel.name}</strong><small>{titleCase(fuel.fuel_type || fuel.unit_of_measure || 'Fuel')}</small></div><div className="stock"><strong>{displayNumber(fuel.quantity_available)} <small>{fuel.unit_of_measure || 'L'}</small></strong><div><span style={{ width: `${Math.min(100, Math.max(8, Number(fuel.quantity_available) / Math.max(Number(fuel.reorder_level || 1) * 5, 1) * 100))}%` }}></span></div></div><Status value={fuel.is_low_stock ? 'Low stock' : 'In stock'} /></div>)}</div> : <Empty text="No fuel products have been added yet." />}</section><section className="panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">YOUR ACTIVITY</p><h2>Recent orders</h2></div><button className="text-button" onClick={() => onNavigate('orders')}>View all →</button></div>{data.my_recent_orders?.length ? <div className="order-list">{data.my_recent_orders.map(order => <div className="order-row" key={order.id}><div className="order-icon">▤</div><div><strong>{order.order_number}</strong><small>{order.customer || 'Customer order'}</small></div><div><strong>{currency.format(order.total_amount || 0)}</strong><Status value={order.status} /></div></div>)}</div> : <Empty text="Orders you create will appear here." />}</section></div><section className="panel delivery-summary"><div><p className="eyebrow">DELIVERY PIPELINE</p><h2>Move every order with confidence</h2><p>Keep an eye on dispatches, routes and completed deliveries in one place.</p><button className="primary-button compact" onClick={() => onNavigate('deliveries')}>Open deliveries <span>→</span></button></div><div className="pipeline">{Object.entries(data.deliveries || {}).map(([status, amount], index) => <div key={status}><span className={`pipeline-icon i${index}`}>{{ pending: '◷', in_transit: '↗', delivered: '✓', failed: '✕' }[status] || '◷'}</span><strong>{displayNumber(amount)}</strong><small>{titleCase(status)}</small></div>)}</div></section>{lowStock > 0 && <div className="low-stock">⚠ {lowStock} product{lowStock > 1 ? 's are' : ' is'} at or below the reorder level. <button onClick={() => onNavigate('inventory')}>Review stock</button></div>}</div>
}

function Status({ value }) { const key = String(value || '').toLowerCase().replaceAll('_', '-'); return <span className={`status ${key}`}>{titleCase(value || 'Unknown')}</span> }
function Empty({ text }) { return <div className="empty"><span>◌</span><p>{text}</p></div> }

function Collection({ title, description, rows, loading, type, onRefresh }) {
  const columns = useMemo(() => ({ inventory: ['Product', 'Type', 'Available stock', 'Unit price', 'Status'], orders: ['Order', 'Customer', 'Created', 'Total', 'Status'], customers: ['Customer', 'Contact', 'Type', 'Orders', 'Status'], deliveries: ['Order', 'Customer', 'Scheduled', 'Vehicle', 'Status'] })[type], [type])
  function cells(row) { if (type === 'inventory') return [row.name, titleCase(row.fuel_type || 'Fuel'), `${displayNumber(row.quantity_available)} ${row.unit_of_measure || 'L'}`, currency.format(row.unit_price || 0), <Status value={row.is_low_stock ? 'Low stock' : row.is_active === false ? 'Inactive' : 'In stock'} />]; if (type === 'orders') return [row.order_number, row.customer_name || '—', row.created_at ? new Date(row.created_at).toLocaleDateString() : '—', currency.format(row.total_amount || 0), <Status value={row.status} />]; if (type === 'customers') return [row.name, row.email || row.phone || '—', titleCase(row.customer_type || '—'), row.order_count ?? '—', <Status value={row.is_active === false ? 'Inactive' : 'Active'} />]; return [row.order_number || `#${row.order_id}`, row.customer_name || '—', row.scheduled_date ? new Date(row.scheduled_date).toLocaleDateString() : '—', row.vehicle_registration || '—', <Status value={row.status} />] }
  return <div><div className="page-intro"><div><h2>{title}</h2><p>{description}</p></div><button className="secondary-button" onClick={onRefresh} disabled={loading}>↻ Refresh</button></div><section className="panel table-panel"><div className="table-toolbar"><strong>{loading ? 'Loading records…' : `${rows.length} record${rows.length === 1 ? '' : 's'}`}</strong><div className="search">⌕ <input placeholder="Search records" /></div></div><div className="table-wrap"><table><thead><tr>{columns.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id || index}>{cells(row).map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody></table>{!loading && !rows.length && <Empty text="There are no records to display yet." />}</div></section></div>
}

function Reports({ request }) { const [report, setReport] = useState(null); const [error, setError] = useState(''); useEffect(() => { request('/reports/sales').then(setReport).catch(err => setError(err.message)) }, [request]); return <div><div className="page-intro"><div><h2>Reports</h2><p>Explore the numbers behind your fuel operation.</p></div></div>{error ? <div className="notice">ⓘ {error}</div> : <section className="panel report-panel"><p className="eyebrow">SALES SUMMARY</p><h2>{report ? `${displayNumber(report.total_orders)} total orders` : 'Loading sales data…'}</h2><div className="report-numbers"><div><small>Total revenue</small><strong>{report ? currency.format(report.total_revenue || 0) : '—'}</strong></div><div><small>Products sold</small><strong>{report ? displayNumber(report.by_product?.length) : '—'}</strong></div><div><small>Period</small><strong>All time</strong></div></div></section>}</div>
}

export default App
