'use client'

// 在Cloudflare Pages中必须使用Edge Runtime
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Search, Filter, Check } from 'lucide-react'
import Link from 'next/link'
import SEOHead from '@/components/SEOHead'
import { asmrCategories, defaultOption } from '@/config/asmr-types'

export default function ASMRTypesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState(searchParams.get('selected') || 'default')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 计算总数量
  const totalTypes = asmrCategories.reduce((total, category) => total + category.types.length, 0)

  // 过滤逻辑
  const getFilteredData = () => {
    let filteredCategories = asmrCategories

    // 按分类过滤
    if (selectedCategory !== 'all') {
      filteredCategories = asmrCategories.filter(category => category.id === selectedCategory)
    }

    // 按搜索词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filteredCategories = filteredCategories.map(category => ({
        ...category,
        types: category.types.filter(type => 
          type.name.toLowerCase().includes(query) ||
          type.description.toLowerCase().includes(query)
        )
      })).filter(category => category.types.length > 0)
    }

    return filteredCategories
  }

  const filteredCategories = getFilteredData()
  const filteredTypesCount = filteredCategories.reduce((total, category) => total + category.types.length, 0)

  const handleSelectType = (typeId: string, typeName: string, prompt: string) => {
    // 通过URL参数传递选择的类型回到首页
    const params = new URLSearchParams({
      type: typeId,
      name: typeName,
      prompt: prompt
    })
    router.push(`/?${params.toString()}#main-generator`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <SEOHead
        title="Google Veo3 ASMR Content Ideas & Video Templates | 50+ ASMR Triggers List"
        description="Google Veo3 ASMR content ideas for creators! 50+ Veo3 ASMR video ideas: glass cutting, fruit, lava effects. AI ASMR triggers list with Google Veo3 templates. Perfect content for ASMR YouTube channels."
        canonical="https://cuttingasmr.org/asmr-types"
        keywords="google veo3, veo3, google veo3 asmr, veo3 asmr generator, asmr content ideas, asmr video ideas, asmr triggers list, asmr creator tools, glass cutting, fruit, lava, magma, knife, cutting, asmr sound effects, ASMR types, YouTube, tiktok, content creator, asmr youtube channel, ai asmr templates"
      />
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Generator</span>
              </Link>
              <div className="h-6 w-px bg-slate-600"></div>
              <h1 className="text-xl font-bold text-white">Choose ASMR Type</h1>
            </div>
            
            <div className="text-sm text-slate-400">
              {searchQuery || selectedCategory !== 'all' 
                ? `${filteredTypesCount} of ${totalTypes} types` 
                : `${totalTypes} types available`
              }
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ASMR types by name or description..."
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white min-w-[200px]"
              >
                <option value="all">All Categories</option>
                {asmrCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredTypesCount === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-500 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
            <p className="text-slate-400">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 默认选项 */}
            {(selectedCategory === 'all' && !searchQuery) && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">✏️</span>
                  <h2 className="text-2xl font-bold text-white">Custom</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <TypeCard
                    type={defaultOption}
                    isSelected={selectedType === 'default'}
                    onSelect={() => handleSelectType('default', 'Custom Prompt', '')}
                  />
                </div>
              </div>
            )}

            {/* 各分类 */}
            {filteredCategories.map(category => (
              <div key={category.id}>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                  <span className="text-sm text-slate-400">({category.types.length} types)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.types.map(type => (
                    <TypeCard
                      key={type.id}
                      type={type}
                      isSelected={selectedType === type.id}
                      onSelect={() => handleSelectType(type.id, type.name, type.prompt)}
                      showCategory={searchQuery.trim() !== ''}
                      categoryName={category.name}
                      categoryIcon={category.icon}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Type Card Component
interface TypeCardProps {
  type: {
    id: string
    name: string
    description: string
    prompt: string
  }
  isSelected: boolean
  onSelect: () => void
  showCategory?: boolean
  categoryName?: string
  categoryIcon?: string
}

function TypeCard({ type, isSelected, onSelect, showCategory, categoryName, categoryIcon }: TypeCardProps) {
  return (
    <div 
      onClick={onSelect}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer group
        ${isSelected 
          ? 'border-cyan-500 bg-cyan-500/20 shadow-lg scale-105' 
          : 'border-slate-600/50 bg-slate-800/50 hover:border-cyan-400 hover:shadow-md hover:scale-102'
        }
      `}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Category badge */}
      {showCategory && categoryName && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300">
            {categoryIcon} {categoryName}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        <h3 className={`font-semibold text-lg ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
          {type.name}
        </h3>
        <p className={`text-sm leading-relaxed ${isSelected ? 'text-cyan-200' : 'text-slate-300'}`}>
          {type.description}
        </p>
        
        {/* Preview prompt */}
        {type.prompt && (
          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Preview:</p>
            <p className="text-sm text-slate-300 line-clamp-3">
              {type.prompt.length > 120 ? `${type.prompt.substring(0, 120)}...` : type.prompt}
            </p>
          </div>
        )}
      </div>

      {/* Select button */}
      <div className="mt-6">
        <button className={`
          w-full py-2 px-4 rounded-lg font-medium transition-colors
          ${isSelected 
            ? 'bg-cyan-500 text-white' 
            : 'bg-slate-700/50 text-slate-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-300'
          }
        `}>
          {isSelected ? 'Selected' : 'Select This Type'}
        </button>
      </div>
    </div>
  )
} 