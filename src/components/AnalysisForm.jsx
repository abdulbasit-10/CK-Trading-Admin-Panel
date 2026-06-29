import React, { useState, useEffect } from 'react';
import Button from './Button';
import { PlusIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { symbolsAPI } from '../services/homeApi';

const AnalysisForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    category: 'Forex',
    symbol: '',
    graph_image: null,
    graph_image_preview: '',
    description: '',
    status: 'active',
    scheduled_for: '', // Renamed to match backend field
    visibility: 'public' // Added as per backend requirement
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
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, graph_image: 'Please upload a valid image file' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          graph_image: file,
          graph_image_preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.symbol) newErrors.symbol = 'Symbol is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // IMPORTANT: Use FormData for Multipart/Form-Data (Image Upload)
    const data = new FormData();
    data.append('category', formData.category);
    data.append('symbol', formData.symbol);
    data.append('description', formData.description);
    data.append('status', formData.status);
    data.append('visibility', formData.visibility);

    if (formData.scheduled_for) {
      data.append('scheduled_for', formData.scheduled_for);
    }

    if (formData.graph_image) {
      // 'image' should match the field name your multer middleware expects on the backend
      data.append('image', formData.graph_image);
    }

    // Call the parent onSubmit (which should call pairAnalysisAPI.create)
    const success = await onSubmit(data);

    if (success) {
      setFormData({
        category: 'Forex',
        symbol: '',
        graph_image: null,
        graph_image_preview: '',
        description: '',
        status: 'active',
        scheduled_for: '',
        visibility: 'public'
      });
      setSymbolSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <PlusIcon className="w-6 h-6 text-[#4E1A6F]" />
        Create Pair Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none"
          >
            <option value="Forex">Forex</option>
            <option value="Crypto">Crypto</option>
          </select>
        </div>

        {/* Symbol */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Symbol *</label>
          <input
            type="text"
            value={symbolSearch || formData.symbol}
            onChange={handleSymbolSearch}
            onFocus={() => setShowSymbolDropdown(true)}
            placeholder="Search symbol..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none"
          />
          {showSymbolDropdown && filteredSymbols.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              {filteredSymbols.map((s, idx) => (
                <button key={idx} type="button" onClick={() => handleSymbolSelect(s)} className="w-full text-left px-4 py-2 hover:bg-purple-50 transition text-sm">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        {/* <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div> */}

        {/* Scheduled For */}
        {/* <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Scheduled For</label>
          <input
            type="datetime-local"
            name="scheduled_for"
            value={formData.scheduled_for}
            onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none text-sm"
          />
        </div> */}
      </div>

      {/* Image Upload Area */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Technical Chart Image</label>
        {formData.graph_image_preview ? (
          <div className="relative inline-block group">
            <img src={formData.graph_image_preview} alt="Preview" className="max-w-md h-64 object-contain rounded-lg border-2 border-purple-100 bg-gray-50" />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, graph_image: null, graph_image_preview: '' })}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-purple-400 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload chart (Max 5MB)</p>
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        )}
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Technical Analysis Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="4"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E1A6F] outline-none resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="E.g., Head and Shoulders pattern forming on 4H chart..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>


      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={loading}
          className="w-full md:w-auto flex items-center justify-center"
        >
          {loading ? 'Posting...' : 'Post Analysis Pair'}
        </Button>
      </div>
    </form>
  );
};

export default AnalysisForm;