import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function NewProposalModal({ open=true, onClose, onCreate, loading }){
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('0.1');
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <motion.div initial={{scale:0.96,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.96,opacity:0}} className="relative bg-[#061021]/80 border border-white/6 backdrop-blur-md rounded-2xl p-6 w-full max-w-md">
        <Dialog.Title className="text-lg font-semibold mb-3">New Proposal</Dialog.Title>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Title</label>
            <Input value={title} onChange={(e)=>setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-slate-300">Value (ETH)</label>
            <Input value={value} onChange={(e)=>setValue(e.target.value)} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={()=>onCreate(title,value)} disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
        </div>
      </motion.div>
    </Dialog>
  )
}
