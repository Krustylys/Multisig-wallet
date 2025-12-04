import React from 'react';
import { Button } from '../ui/button';

export default function Topbar({ onNew }){
  return (
    <header className="flex items-center justify-between">
      <div>
        <div className="text-slate-400 text-sm">Welcome back</div>
        <div className="text-white font-bold text-2xl">Team Multisig</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-300">Connected: <span className='font-medium'>demo</span></div>
        <Button onClick={onNew}>Create Proposal</Button>
      </div>
    </header>
  )
}
