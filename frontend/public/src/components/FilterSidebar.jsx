import React from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

const categories = ['All', 'Clothes', 'Shoes', 'Gadgets', 'Accessories', 'Books', 'Home', 'Others'];
const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];

const FilterSidebar = ({ filters, onFilterChange }) => {
  const handleChange = (name, value) => {
    onFilterChange({ ...filters, [name]: value });
  };

  const handleReset = () => {
    onFilterChange({ category: 'All', condition: 'All', minPrice: '', maxPrice: '', sort: 'newest' });
  };

  const isFiltered = filters.category !== 'All' || filters.condition !== 'All' || filters.minPrice || filters.maxPrice;

  return (
    <div className="card-elevated p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
          <FiFilter size={20} className="text-emerald-600" />
          <span>Filters</span>
        </h3>
        {isFiltered && (
          <button
            onClick={handleReset}
            className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
          >
            <FiX size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium bg-white cursor-pointer hover:border-emerald-400 transition-colors"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Condition</label>
          <select
            value={filters.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium bg-white cursor-pointer hover:border-emerald-400 transition-colors"
          >
            {conditions.map(cond => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Price Range</label>
          <div className="flex space-x-3">
            <input
              type="number"
              placeholder="Min ₱"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium hover:border-emerald-400 transition-colors"
            />
            <input
              type="number"
              placeholder="Max ₱"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium hover:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={handleReset}
            className="w-full btn-secondary py-3 rounded-lg font-bold transition-all duration-300 hover:bg-slate-200"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;