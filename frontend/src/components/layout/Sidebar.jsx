import React from 'react';
import { Wallet, Settings } from 'lucide-react';

export default function Sidebar(){
  return (
    <aside className="hidden lg:flex flex-col w-72 p-6 bg-[linear-gradient(135deg,#071126_0%,#051426_100%)] border-r border-white/6 text-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center text-white font-bold">MS</div>
        <div>
          <div className="text-lg font-semibold">Multisig Studio</div>
          <div className="text-xs text-slate-400">Dashboard</div>
        </div>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li className="px-3 py-2 rounded-lg bg-white/2">Overview</li>
          <li className="px-3 py-2 rounded-lg hover:bg-white/3 cursor-pointer">Proposals</li>
          <li className="px-3 py-2 rounded-lg hover:bg-white/3 cursor-pointer flex items-center gap-2"><Wallet className='h-4 w-4'/> Wallets</li>
          <li className="px-3 py-2 rounded-lg hover:bg-white/3 cursor-pointer flex items-center gap-2"><Settings className='h-4 w-4'/> Settings</li>
        </ul>
      </nav>
      <div className="text-xs text-slate-400">v1.0 • Local</div>
    </aside>
  )
}
