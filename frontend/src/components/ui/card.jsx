import React from 'react';
export function GlassCard({ children, className = '' }){
  return <div className={`bg-white/3 border border-white/6 rounded-2xl backdrop-blur-md ${className}`} style={{boxShadow:'0 10px 40px rgba(2,6,23,0.6)'}}>{children}</div>
}
export function CardContent({ children, className = '' }){ return <div className={className}>{children}</div> }
