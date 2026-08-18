//strange comment 
import { Link, useNavigate } from 'react-router-dom'
import logo from './assets/logo.png'
import Dashboard from './assets/dashboard.svg'
import Products from './assets/products.svg'
import Purchases from './assets/purchases.svg'
import Sales from './assets/sales.svg'
import Settings from './assets/settings.svg'
import Transfers from './assets/transfers.svg'
import Reports from './assets/reports.svg'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0A101D] text-white flex flex-col justify-between overflow-x-hidden">

      <nav className="flex items-center justify-between px-12 py-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="StockFlow Logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-wide">StockFlow</span>
        </div>

        <div className="hidden lg:flex items-center gap-12">
          <Link to="/Features" className="text-gray-300 hover:text-white transition-colors text-sm">Features</Link>
          <Link to="/Pricing" className="text-gray-300 hover:text-white transition-colors text-sm">Pricing</Link>
          <Link to="/Solutions" className="text-gray-300 hover:text-white transition-colors text-sm">Solutions</Link>
          <Link to="/Resources" className="text-gray-300 hover:text-white transition-colors text-sm">Resources</Link>
          <Link to="/About Us" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/signin" className="text-gray-300 hover:text-white transition-colors text-sm">Log in</Link>
          <button onClick={() => navigate('/signup')} className="bg-[#22C55E] text-white hover:bg-[#16A34A] font-medium transition-colors px-5 py-2.5 rounded-md text-sm">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pl-12 pt-6">
        
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-5 flex flex-col gap-6 pr-4">
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Manage Your Inventory.{' '}
            <span className="text-[#22C55E]">Grow</span> Your Business.
          </h1>
          <p className="text-gray-400 text-base lg:text-lg leading-relaxed max-w-xl">
            StockFlow is the all-in-one inventory management system built to help you track, manage and scale with ease.
          </p>
          <div className="flex flex-row items-center gap-4 pt-2">
            <button className="bg-[#22C55E] text-white hover:bg-[#16A34A] font-medium transition-colors px-7 py-3 rounded-md text-sm">
              Get Started Free
            </button>
            <button className="bg-[#111A29] border border-white/10 text-white hover:bg-[#1A2638] font-medium transition-colors px-7 py-3 rounded-md text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">▶</span>
              See How It Works
            </button>
          </div>

          
          <div className="grid grid-cols-3 gap-4 pt-6 text-xs text-gray-300 border-t border-white/10 mt-4 max-w-lg">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-white flex items-center gap-1.5">⚡ Real-time Tracking</span>
              <span className="text-gray-500 text-[11px]">Track stock in real-time</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-white flex items-center gap-1.5">📊 Smart Analytics</span>
              <span className="text-gray-500 text-[11px]">Make data-driven decisions</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-white flex items-center gap-1.5">🔒 Secure & Reliable</span>
              <span className="text-gray-500 text-[11px]">Your data is always safe</span>
            </div>
          </div>
        </div>

      
        <div className="lg:col-span-7 bg-[#101927] rounded-l-2xl border-l border-y border-white/10 p-6 shadow-2xl relative overflow-hidden">
          
         
          <div className="bg-[#070D16] rounded-xl border border-white/10 flex overflow-hidden shadow-lg">
            
           
            <div className="w-48 bg-[#0D1424] border-r border-white/10 p-4 hidden md:flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="w-5 h-5" />
                <span className="font-bold text-sm">StockFlow</span>
              </div>
              <div className="flex flex-col gap-1 text-xs text-gray-400">
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#22C55E]/10 text-[#22C55E] font-medium">
                  <img src={Dashboard} alt="" className="w-4 h-4 filter invert brightness-200" /> Dashboard
                </div>
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md">
                  <img src={Products} alt="" className="w-4 h-4 opacity-70" /> Products
                </div>
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md">
                  <img src={Sales} alt="" className="w-4 h-4 opacity-70" /> Sales
                </div>
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md">
                  <img src={Purchases} alt="" className="w-4 h-4 opacity-70" /> Purchase
                </div>
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md">
                  <img src={Transfers} alt="" className="w-4 h-4 opacity-70" /> Transfers
                </div>
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md">
                  <img src={Reports} alt="" className="w-4 h-4 opacity-70" /> Reports
                </div>
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md">
                  <img src={Settings} alt="" className="w-4 h-4 opacity-70" /> Settings
                </div>
              </div>
            </div>

            <div className="flex-1 p-5 flex flex-col gap-4 bg-[#0A101D]">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-sm font-semibold">Dashboard</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] text-gray-400">Live Sync</span>
                </div>
              </div>

             
              <div className="grid grid-cols-2 gap-3">
                
                
                <div className="col-span-2 bg-[#111A29] rounded-md p-4 grid grid-cols-2 divide-x divide-white/20">
                 
                  <div className="pr-4">
                   
                    <p className="text-gray-400 text-xs font-medium">Total Items</p>
                    <p className="text-lg font-bold mt-1">1,245</p>
                    <span className="text-[10px] text-green-400">+12% from last month</span>
                  </div>
                  
                
                  <div className="pl-4">
                  
                    <p className="text-gray-400 text-xs font-medium">Low Stock</p>
                    <p className="text-lg font-bold mt-1 text-amber-400">32</p>
                    <span className="text-[10px] text-amber-400">+4% from last month</span>
                  </div>
                </div>

             
                <div className="bg-[#111A29] rounded-md p-3">
                  <p className="text-gray-400 text-[11px] font-medium mb-1">Stock Overview</p>
                  <div className="h-12 flex items-end gap-1 pt-2">
                    <div className="bg-[#22C55E]/40 w-full h-[40%] rounded-t-sm"></div>
                    <div className="bg-[#22C55E]/60 w-full h-[70%] rounded-t-sm"></div>
                    <div className="bg-[#22C55E]/50 w-full h-[55%] rounded-t-sm"></div>
                    <div className="bg-[#22C55E]/80 w-full h-[90%] rounded-t-sm"></div>
                    <div className="bg-[#22C55E] w-full h-[100%] rounded-t-sm"></div>
                  </div>
                </div>

              
                <div className="bg-[#111A29] rounded-md p-3 flex flex-col justify-between">
                  <p className="text-gray-400 text-[11px] font-medium">Top Categories</p>
                  <div className="flex items-center justify-center py-2">
                    <div className="w-10 h-10 rounded-full border-4 border-[#22C55E] border-t-transparent animate-spin-slow"></div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </main>

      
      <footer className="mt-16 py-8 border-t border-white/5 flex flex-col items-center gap-4 bg-[#070D16]">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Trusted by businesses of all sizes</p>
        <div className="flex flex-wrap justify-center items-center gap-12 text-gray-400 font-semibold text-sm opacity-70">
          <span>TechNova</span>
          <span>UrbanMart</span>
          <span>BuildCore</span>
          <span>ShopEasy</span>
          <span>PrimeRetail</span>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage