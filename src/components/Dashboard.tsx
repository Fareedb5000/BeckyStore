import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

import Dashboard from '../assets/dashboard.svg'
import Inventory from '../assets/products.svg'
import Purchases from '../assets/purchases.svg'
import Sales from '../assets/sales.svg'
import Settings from '../assets/settings.svg'
import Transfers from '../assets/transfers.svg'
import Reports from '../assets/Reports.svg'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5144/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

interface InventoryItem {
  id: number
  name: string
  category: string
  quantity: number
  costPrice: number
  sellingPrice: number
}

interface DashboardStats {
  totalInventoryValue: number
  totalItems: number
  lowStockItems: number
  totalOrders: number
  storeBalance: number
}

export default function DashboardLayout() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy')
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [transactionQty, setTransactionQty] = useState(1)
  const [actionLoading, setActionLoading] = useState(false)

  // Add Item form state
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
  })

  const fetchProducts = async () => {
    try {
      const [productsRes, balanceRes] = await Promise.all([
        fetch(`${API_URL}/products`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/account/balance`, { headers: getAuthHeaders() }),
      ])

      if (!productsRes.ok) throw new Error('Failed to fetch products')
      const productsData = await productsRes.json()

      let storeBalance = 0
      if (balanceRes.ok) {
        storeBalance = await balanceRes.json()
      }

      setItems(productsData)

      // Calculate stats from products data
      const totalInventoryValue = productsData.reduce(
        (sum: number, item: InventoryItem) => sum + item.costPrice * item.quantity,
        0
      )
      const totalItems = productsData.length
      const lowStockItems = productsData.filter(
        (item: InventoryItem) => item.quantity > 0 && item.quantity <= 10
      ).length

      setStats({
        totalInventoryValue,
        totalItems,
        lowStockItems,
        totalOrders: 0,
        storeBalance,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  const getStatusBadge = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', class: 'text-red-700 bg-red-50' }
    if (quantity <= 10) return { label: 'Low Stock', class: 'text-amber-700 bg-amber-50' }
    return { label: 'In Stock', class: 'text-emerald-700 bg-emerald-50' }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newItem),
      })
      if (!response.ok) throw new Error('Failed to add item')
      setShowAddModal(false)
      setNewItem({ name: '', category: '', quantity: 0, costPrice: 0, sellingPrice: 0 })
      await fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to delete item')
      await fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item.')
    }
  }

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return
    setActionLoading(true)
    try {
      const response = await fetch(`${API_URL}/transaction/${transactionType}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productId: selectedItem.id,
          quantity: transactionQty,
        }),
      })
      const data = await response.text()
      if (!response.ok) throw new Error(data || 'Transaction failed')
      setShowTransactionModal(false)
      setTransactionQty(1)
      setSelectedItem(null)
      await fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed.')
    } finally {
      setActionLoading(false)
    }
  }

  const openTransactionModal = (item: InventoryItem, type: 'buy' | 'sell') => {
    setSelectedItem(item)
    setTransactionType(type)
    setTransactionQty(1)
    setShowTransactionModal(true)
  }

  // Deposit / Withdraw
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [accountAction, setAccountAction] = useState<'deposit' | 'withdraw'>('deposit')
  const [accountAmount, setAccountAmount] = useState(0)

  const handleAccountAction = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const response = await fetch(`${API_URL}/account/${accountAction}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(accountAmount),
      })
      const data = await response.text()
      if (!response.ok) throw new Error(data || 'Action failed')
      setShowAccountModal(false)
      setAccountAmount(0)
      await fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.')
    } finally {
      setActionLoading(false)
    }
  }

  const openAccountModal = (action: 'deposit' | 'withdraw') => {
    setAccountAction(action)
    setAccountAmount(0)
    setShowAccountModal(true)
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-hidden">
      
  
      <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between border-r border-slate-800">
        <div>
        
          <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80">
            <img src={logo} alt="Logo" className="w-12 h-8" />
            <span className="text-white font-semibold text-lg tracking-wide">StockFlow</span>
          </div>

         
          <nav className="p-4 space-y-1.5">
            
            <a href="#dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-sm">
            <img src={Dashboard} alt="Dashboard Icon" className="w-4 h-4" />
              Dashboard
            </a>
            
            {/* Standard Nav Item with Dropdown Indicator */}
            <a href="#inventory" className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">
              <span className="flex items-center gap-3">
                <img src={Inventory} alt="Inventory Icon" className="w-4 h-4" />
                Inventory
              </span>
              {/* Insert Chevron Down Icon */}
              <span className="text-xs">▼</span>
            </a>

            <a href="#sales" className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">
              <span className="flex items-center gap-3">
                <img src={Sales} alt="Sales Icon" className="w-4 h-4" />
                Sales
              </span>
              <span className="text-xs">▼</span>
            </a>

            <a href="#purchase" className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">
              <span className="flex items-center gap-3">
                <img src={Purchases} alt="Purchase Icon" className="w-4 h-4" />
                Purchase
              </span>
              <span className="text-xs">▼</span>
            </a>

            <a href="#transfers" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">
              <img src={Transfers} alt="Transfers Icon" className="w-4 h-4" />
              Transfers
            </a>

            <a href="#reports" className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">
              <span className="flex items-center gap-3">
                <img src={Reports} alt="Reports Icon" className="w-4 h-4" />
                Reports
              </span>
              <span className="text-xs">▼</span>
            </a>

            <a href="#settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">
              <img src={Settings} alt="Settings Icon" className="w-4 h-4" />
              Settings
            </a>
          </nav>
        </div>

        
        
      </aside>

      {/* =================================================================
          MAIN CONTENT WRAPPER
      ================================================================- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>

          {/* Right Header Elements (Notifications, Store Balance, User Profile) */}
          <div className="flex items-center gap-6">
            {/* Notification Bell with Badge */}
            <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
             
              🔔
            </button>

            {/* Store Balance Widget */}
            <div className="hidden sm:flex flex-col items-end border-r border-slate-200 pr-6">
              <span className="text-xs text-slate-400 font-medium">Store Balance</span>
              <span className="text-sm font-bold text-emerald-600">
                {stats ? formatCurrency(stats.storeBalance) : '—'}
              </span>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => openAccountModal('deposit')}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  + Deposit
                </button>
                <button
                  onClick={() => openAccountModal('withdraw')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  − Withdraw
                </button>
              </div>
            </div>

            {/* User Profile Dropdown Component */}
            <div className="flex items-center gap-3 cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" 
                alt="User Avatar" 
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-slate-800">
                  {/* INSERT USER NAME HERE */}
                  John Doe
                </div>
                <div className="text-xs text-slate-400">
                  {/* INSERT USER ROLE HERE */}
                  Admin
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="text-slate-400 text-sm">Loading dashboard data...</span>
            </div>
          ) : (
            <>
          {/* =================================================================
              KPI METRICS GRID CARDS
          ================================================================- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric Card 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Inventory Value</span>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {stats ? formatCurrency(stats.totalInventoryValue) : '—'}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  +12.5% from last month
                </span>
                {/* Insert Small Icon Graphic */}
                <span className="text-emerald-500 text-sm">📈</span>
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Items</span>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {stats ? stats.totalItems.toLocaleString() : '—'}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  +8.2% from last month
                </span>
                <span className="text-blue-500 text-sm">📥</span>
              </div>
            </div>

            {/* Metric Card 3 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Low Stock Items</span>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {stats ? stats.lowStockItems.toLocaleString() : '—'}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  -5.4% from last month
                </span>
                <span className="text-red-500 text-sm">⚠️</span>
              </div>
            </div>

            {/* Metric Card 4 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Orders (This Month)</span>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {stats ? stats.totalOrders.toLocaleString() : '—'}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  +15.3% from last month
                </span>
                <span className="text-emerald-500 text-sm">🛒</span>
              </div>
            </div>

          </div>

          {/* =================================================================
              MAIN DATA TABLE SECTION
          ================================================================- */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            
            {/* Table Control Bar (Search, Filter, Export, Add Item Button) */}
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-base font-bold text-slate-900 w-full sm:w-auto">Inventory Overview</h2>
              
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {/* Search Input Box */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search items..." 
                    className="pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-800 w-full sm:w-64"
                  />
                </div>

                {/* Filter Button */}
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Filter
                </button>

                {/* Export Button */}
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Export
                </button>

                {/* Primary Add Item CTA Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-6">Item Name</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Quantity</th>
                    <th className="py-3 px-6">Cost Price</th>
                    <th className="py-3 px-6">Selling Price</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                  
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 px-6 text-center text-slate-400">
                        No inventory items found.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const status = getStatusBadge(item.quantity)
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-medium text-slate-900">{item.name}</td>
                          <td className="py-4 px-6">{item.category}</td>
                          <td className="py-4 px-6 font-semibold">{item.quantity}</td>
                          <td className="py-4 px-6 text-slate-900">{formatCurrency(item.costPrice)}</td>
                          <td className="py-4 px-6 text-slate-900">{formatCurrency(item.sellingPrice)}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${status.class}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => openTransactionModal(item, 'buy')}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 bg-emerald-50 rounded"
                              title="Buy Stock"
                            >
                              📥
                            </button>
                            <button
                              onClick={() => openTransactionModal(item, 'sell')}
                              className="p-1.5 text-blue-600 hover:text-blue-700 bg-blue-50 rounded"
                              title="Sell Stock"
                            >
                              📤
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 rounded"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}

                </tbody>
              </table>
            </div>

            
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {items.length > 0 ? 1 : 0} to {items.length} of {items.length} items</span>
              <div className="flex items-center gap-1">
                <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">Prev</button>
                <button className="px-2.5 py-1 bg-emerald-600 text-white rounded font-medium">1</button>
                <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
                <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">3</button>
                <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
              </div>
            </div>

          </div>
            </>
          )}

        </main>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Item</h2>
            <form onSubmit={handleAddItem} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                  className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  required
                  className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Quantity</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  required
                  min={0}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-slate-700">Cost Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.costPrice}
                    onChange={(e) => setNewItem({ ...newItem, costPrice: Number(e.target.value) })}
                    required
                    min={0}
                    className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-slate-700">Selling Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.sellingPrice}
                    onChange={(e) => setNewItem({ ...newItem, sellingPrice: Number(e.target.value) })}
                    required
                    min={0}
                    className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                >
                  {actionLoading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buy/Sell Transaction Modal */}
      {showTransactionModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {transactionType === 'buy' ? 'Buy Stock' : 'Sell Stock'}
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              {selectedItem.name} — Current quantity: {selectedItem.quantity}
            </p>
            <form onSubmit={handleTransaction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Quantity</label>
                <input
                  type="number"
                  value={transactionQty}
                  onChange={(e) => setTransactionQty(Number(e.target.value))}
                  required
                  min={1}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
                {transactionType === 'buy' ? (
                  <p>Total Cost: <span className="font-bold text-slate-900">{formatCurrency(selectedItem.costPrice * transactionQty)}</span></p>
                ) : (
                  <p>Total Revenue: <span className="font-bold text-slate-900">{formatCurrency(selectedItem.sellingPrice * transactionQty)}</span></p>
                )}
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowTransactionModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg disabled:opacity-60 transition-colors ${
                    transactionType === 'buy'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {actionLoading ? 'Processing...' : transactionType === 'buy' ? 'Buy Stock' : 'Sell Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit / Withdraw Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {accountAction === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Current Balance: {stats ? formatCurrency(stats.storeBalance) : '—'}
            </p>
            <form onSubmit={handleAccountAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={accountAmount}
                  onChange={(e) => setAccountAmount(Number(e.target.value))}
                  required
                  min={0.01}
                  placeholder="0.00"
                  className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg disabled:opacity-60 transition-colors ${
                    accountAction === 'deposit'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-slate-600 hover:bg-slate-700'
                  }`}
                >
                  {actionLoading
                    ? 'Processing...'
                    : accountAction === 'deposit'
                    ? 'Deposit'
                    : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}