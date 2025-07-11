'use client'

import { Sparkles, Settings } from 'lucide-react'
import { asmrCategories } from '@/config/asmr-types'

// 所有ASMR类型的扁平化列表
const allAsmrTypes = asmrCategories.flatMap(category => 
  category.types.map(type => ({
    ...type,
    category: category.id,
    categoryName: category.name
  }))
)

interface QuickModeProps {
  selectedASMRType: string;
  handleASMRTypeChange: (typeId: string) => void;
  setShowAllTypesModal: (show: boolean) => void;
}

export const QuickMode = ({ selectedASMRType, handleASMRTypeChange, setShowAllTypesModal }: QuickModeProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Quick Templates</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <button
          onClick={() => handleASMRTypeChange('default')}
          className={`p-2 sm:p-3 rounded-xl border transition-all text-center font-medium text-xs sm:text-sm min-h-[3rem] sm:min-h-[3.5rem] flex items-center justify-center
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
            ${selectedASMRType === 'default'
              ? 'border-cyan-500 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'border-stone-600 hover:border-stone-500 bg-stone-700/50 hover:bg-stone-600/50 text-slate-300'
            }`}
        >
          Default
        </button>

        {['glass-fruit-cutting', 'ice-cube-carving', 'metal-sheet-cutting', 'fireplace', 'squeeze-toy', 'minecraft-block-cutting'].map((typeId) => {
          const type = allAsmrTypes.find(t => t.id === typeId)
          if (!type) return null
          return (
            <button
              key={type.id}
              onClick={() => handleASMRTypeChange(type.id)}
              className={`p-2 sm:p-3 rounded-xl border transition-all text-center font-medium text-xs sm:text-sm min-h-[3rem] sm:min-h-[3.5rem] flex items-center justify-center
                focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
                ${selectedASMRType === type.id
                  ? 'border-cyan-500 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'border-stone-600 hover:border-stone-500 bg-stone-700/50 hover:bg-stone-600/50 text-slate-300'
                }`}
            >
              <span className="block leading-tight">{type.name}</span>
            </button>
          )
        })}
        
        <button
          onClick={() => setShowAllTypesModal(true)}
          className="p-2 sm:p-3 rounded-xl border border-stone-600 hover:border-stone-500 bg-stone-700/50 hover:bg-stone-600/50 text-slate-300 transition-all text-center flex items-center justify-center font-medium text-xs sm:text-sm min-h-[3rem] sm:min-h-[3.5rem]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
        >
          <span className="mr-1">⋯</span> All
        </button>
      </div>
    </div>
  )
}

interface ModularModeProps {
  options: Record<string, Array<{ label: string; prompt: string }>>;
  selectedValues: Record<string, string>;
  onChange: (category: string, value: string) => void;
}

export const ModularMode = ({ options, selectedValues, onChange }: ModularModeProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Module Configuration</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        
        {Object.entries(options).map(([category, items]) => (
          <div key={category}>
            <label className="block text-sm font-medium text-slate-300 mb-1">{category}</label>
            <select 
              value={selectedValues[category]}
              onChange={(e) => onChange(category, e.target.value)}
              className="w-full p-2 bg-stone-700/50 border border-stone-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors"
            >
              <option value="">Select</option>
              {items.map(item => (
                <option key={item.label} value={item.label}>{item.label}</option>
              ))}
            </select>
          </div>
        ))}

      </div>
    </div>
  )
} 