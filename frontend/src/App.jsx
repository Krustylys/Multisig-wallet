import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import NewProposalModal from './components/NewProposalModal'
import { GlassCard, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { CheckCircle, Clock } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function useFetchProposals() {
  const [proposals, setProposals] = useState([])
  useEffect(() => {
    let mounted = true
    axios.get(API + '/proposals').then(r => mounted && setProposals(r.data)).catch(()=>{})
    return () => mounted = false
  }, [])
  return [proposals, setProposals]
}

export default function App(){
  const [proposals, setProposals] = useFetchProposals()
  const [owners] = useState(['0xA1','0xB2','0xC3'])
  const [threshold] = useState(2)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)

  async function createProposal(title, value){
    if(!title?.trim()){ alert('Enter title'); return }
    setLoading(true)
    try{
      const res = await axios.post(API + '/proposals', { title, value, owners, threshold })
      setProposals(prev => [res.data, ...prev])
      setShowNew(false)
    }catch(e){
      alert(e?.response?.data?.error || 'Create failed')
    }finally{ setLoading(false) }
  }

  async function approve(id, owner){
    try{
      const res = await axios.post(API + `/proposals/${id}/approve`, { owner })
      setProposals(prev => prev.map(p=> p.id===id ? res.data : p))
    }catch(e){ alert(e?.response?.data?.error || 'Approve failed') }
  }

  async function execute(id){
    try{
      const res = await axios.post(API + `/proposals/${id}/execute`)
      setProposals(prev => prev.map(p=> p.id===id ? res.data : p))
    }catch(e){ alert(e?.response?.data?.error || 'Execute failed') }
  }

  const list = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y:0, transition:{ duration: 0.35 } } }

  return (
    <div className="min-h-screen flex text-slate-100">
      <Sidebar />
      <div className="flex-1 p-8 lg:p-12">
        <Topbar onNew={() => setShowNew(true)} />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-5">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-300">Total Proposals</div>
                  <div className="text-2xl font-semibold">{proposals.length}</div>
                </div>
                <div className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-200">Multisig</div>
              </div>
            </CardContent>
          </GlassCard>
          <GlassCard className="p-5">
            <CardContent>
              <div>
                <div className="text-sm text-slate-300">Owners</div>
                <div className="text-2xl font-semibold">3</div>
                <div className="text-xs text-slate-400 mt-1">Threshold: {threshold}</div>
              </div>
            </CardContent>
          </GlassCard>
          <GlassCard className="p-5">
            <CardContent>
              <div>
                <div className="text-sm text-slate-300">Ready to Execute</div>
                <div className="text-2xl font-semibold">{proposals.filter(p=> !p.executed && p.approvals.length >= p.threshold).length}</div>
                <div className="text-xs text-slate-400 mt-1">Ready</div>
              </div>
            </CardContent>
          </GlassCard>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Proposals</h3>
            <div className="flex items-center gap-3">
              <Input placeholder="Search..." className="w-60" />
              <Button variant="ghost" onClick={() => setShowNew(true)}>New Proposal</Button>
            </div>
          </div>

          <motion.div className="mt-5 grid gap-4" variants={list} initial="hidden" animate="visible">
            <AnimatePresence>
              {proposals.map(p => (
                <motion.div key={p.id} variants={item} layout>
                  <GlassCard className="p-5 hover:-translate-y-2 transition-transform duration-300">
                    <CardContent>
                      <div className="flex md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-semibold truncate">{p.title}</div>
                            <div className="text-sm text-slate-300">• {p.value} ETH</div>
                            <div className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-200">{p.executed ? 'Executed' : 'Pending'}</div>
                          </div>
                          <div className="mt-2 text-sm text-slate-400 truncate">Owners: {p.owners.join(', ')}</div>
                          <div className="mt-3 flex items-center gap-3">
                            <div className="text-xs text-slate-300">Approvals:</div>
                            <div className="flex gap-2">
                              {p.owners.map(o=> {
                                const approved = p.approvals.includes(o);
                                return <div key={o} className={`px-2 py-1 text-xs rounded-full font-medium ${approved ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/5 text-slate-300'}`}>{o} {approved ? '✓' : ''}</div>
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 items-end">
                          <div className="text-sm text-slate-300">{p.approvals.length} / {p.threshold}</div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            {p.owners.map(owner => (
                              <Button key={owner} variant={p.approvals.includes(owner) ? 'disabled' : 'outline'} onClick={() => approve(p.id, owner)} disabled={p.executed || p.approvals.includes(owner)}>{p.approvals.includes(owner) ? 'Approved' : 'Approve ' + owner}</Button>
                            ))}
                            <Button onClick={() => execute(p.id)} disabled={p.executed || p.approvals.length < p.threshold}>Execute</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      {showNew && <NewProposalModal open onClose={() => setShowNew(false)} onCreate={createProposal} loading={loading} />}
    </div>
  )
}
