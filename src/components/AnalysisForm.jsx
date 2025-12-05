import React, { useState, useEffect } from 'react';
import Button from './Button';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { symbolsAPI } from '../services/homeApi';

const AnalysisForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    category: 'Forex',
    symbol: '',
    graph_image: null,
    graph_image_preview: '',
    description: '',
    status: 'active',
    scheduled_at: '',
  });

  const [errors, setErrors] = useState({});
  const [symbols, setSymbols] = useState([]);
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const [symbolSearch, setSymbolSearch] = useState('');
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);

  useEffect(() => {
    loadSymbols();
  }, [formData.category]);

  const loadSymbols = async () => {
    try {
      const pairs =
        formData.category === 'Forex'
          ? await symbolsAPI.getForexPairs()
          : await symbolsAPI.getCryptoPairs();
      setSymbols(pairs);
      setFilteredSymbols(pairs);
      setSymbolSearch('');
      setFormData(prev => ({ ...prev, symbol: '' }));
    } catch (error) {
      console.error('Error loading symbols:', error);
    }
  };

  const handleSymbolSearch = (e) => {
    const value = e.target.value.toUpperCase();
    setSymbolSearch(value);
    const filtered = symbols.filter(s => s.includes(value));
    setFilteredSymbols(filtered);
    setShowSymbolDropdown(true);
  };

  const handleSymbolSelect = (symbol) => {
    setFormData({ ...formData, symbol });
    setSymbolSearch('');
    setShowSymbolDropdown(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, graph_image: 'Please upload a valid image file' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, graph_image: 'Image size must be less than 5MB' });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          graph_image: file,
          graph_image_preview: reader.result,
        });
        setErrors({ ...errors, graph_image: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      graph_image: null,
      graph_image_preview: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.symbol) newErrors.symbol = 'Symbol is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        category: 'Forex',
        symbol: '',
        graph_image: null,
        graph_image_preview: '',
        description: '',
        status: 'active',
        scheduled_at: '',
      });
      setErrors({});
      setSymbolSearch('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Create Pair Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="Forex">Forex</option>
            <option value="Crypto">Crypto</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Symbol */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Symbol *
          </label>
          <div className="relative">
            <input
              type="text"
              value={symbolSearch || formData.symbol}
              onChange={handleSymbolSearch}
              onFocus={() => setShowSymbolDropdown(true)}
              placeholder="Search symbol..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                errors.symbol ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {showSymbolDropdown && filteredSymbols.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredSymbols.map((symbol, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSymbolSelect(symbol)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.symbol && <p className="text-red-500 text-xs mt-1">{errors.symbol}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Scheduled At */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled At
          </label>
          <input
            type="datetime-local"
            name="scheduled_at"
            value={formData.scheduled_at}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Graph Image
        </label>
        
        {formData.graph_image_preview ? (
          <div className="relative inline-block">
            <img
              src={formData.graph_image_preview}
              alt="Preview"
              className="max-w-xs h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="graph-image-input"
            />
            <label
              htmlFor="graph-image-input"
              className="cursor-pointer block"
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-3.172-3.172a4 4 0 00-5.656 0L9.172 20M21 40V28m0 0l-3 3m3-3l3 3"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>
                {' '}or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </label>
          </div>
        )}
        {errors.graph_image && <p className="text-red-500 text-xs mt-1">{errors.graph_image}</p>}
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Technical analysis and trading recommendation"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          <PlusIcon className="w-5 h-5" />
          Create Analysis
        </Button>
      </div>
    </form>
  );
};

export default AnalysisForm;
