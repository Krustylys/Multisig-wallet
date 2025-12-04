import React from 'react';
export function Button({ children, variant = 'default', className = '', ...props }){
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-transform active:scale-95';
  const variants = {
    default: 'bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] text-white shadow-md',
    outline: 'bg-white/4 text-white border border-white/6',
    ghost: 'bg-transparent text-slate-300',
    disabled: 'bg-white/6 text-slate-400 cursor-not-allowed'
  };
  const v = variants[variant] || variants.default;
  return <button className={`${base} ${v} ${className}`} {...props}>{children}</button>
}