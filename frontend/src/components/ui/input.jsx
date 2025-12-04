import React from 'react';
export function Input({ className = '', ...props }){
  return <input {...props} className={`w-full rounded-lg px-3 py-2 bg-white/3 border border-white/6 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#7c3aed]/50 ${className}`} />
}
