import React, { useState, useEffect } from 'react';
import { MapPin, Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TaxDisplay = ({ 
  subtotal, 
  country, 
  state, 
  customerType = 'individual',
  taxId = '',
  onTaxChange = () => {},
  compact = false 
}) => {
  const [taxData, setTaxData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (country && subtotal > 0) {
      calculateTax();
    }
  }, [country, state, subtotal, customerType, taxId]);

  const calculateTax = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          state,
          subtotal,
          customerType,
          taxId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTaxData(data.data);
        onTaxChange(data.data);
      }
    } catch (error) {
      console.error('Tax calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!country || !subtotal) return null;

  if (compact) {
    return (
      <div className="flex justify-between items-center py-2 text-sm">
        <span className="text-gray-600">税费:</span>
        <div className="text-right">
          {loading ? (
            <span className="text-gray-400">计算中...</span>
          ) : taxData ? (
            <div>
              <span className="font-medium">
                ${taxData.taxAmount?.toFixed(2) || '0.00'}
              </span>
              {taxData.taxRate > 0 && (
                <span className="text-xs text-gray-500 ml-1">
                  ({taxData.taxRate}%)
                </span>
              )}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-gray-900">税费信息</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">正在计算税费...</span>
        </div>
      ) : taxData ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {taxData.status === 'tax_free' ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : taxData.status === 'tax_exempt' ? (
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            )}
            <span className="text-sm font-medium">
              {taxData.status === 'tax_free' && '免税地区'}
              {taxData.status === 'tax_exempt' && '企业免税'}
              {taxData.status === 'taxable' && `税率: ${taxData.taxRate}%`}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <div className="flex justify-between">
              <span>商品小计:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>税费:</span>
              <span>${taxData.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t">
              <span>总计:</span>
              <span>${taxData.total.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {taxData.message}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default TaxDisplay;