import React, { useState } from 'react';

const TaxTestPage = () => {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [subtotal, setSubtotal] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateTax = async () => {
    if (!country) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4001/api/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          state,
          subtotal: parseFloat(subtotal),
          customerType: 'individual'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      console.error('税费计算失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>税收系统测试页面</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          订单金额:
        </label>
        <input
          type="number"
          value={subtotal}
          onChange={(e) => setSubtotal(e.target.value)}
          style={{ padding: '8px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          国家/地区:
        </label>
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setState('');
          }}
          style={{ padding: '8px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          <option value="">请选择国家</option>
          <option value="US">美国</option>
          <option value="AU">澳大利亚</option>
          <option value="TH">泰国</option>
          <option value="SG">新加坡</option>
          <option value="MY">马来西亚</option>
          <option value="GB">英国</option>
          <option value="CA">加拿大</option>
          <option value="JP">日本</option>
        </select>
      </div>

      {country === 'US' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            美国州:
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            style={{ padding: '8px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="">请选择州</option>
            <option value="OR">Oregon (免税州)</option>
            <option value="DE">Delaware (免税州)</option>
            <option value="NH">New Hampshire (免税州)</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
          </select>
        </div>
      )}

      <button
        onClick={calculateTax}
        disabled={!country || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? '计算中...' : '计算税费'}
      </button>

      {result && (
        <div style={{
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>税费计算结果</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>订单小计:</strong> ${subtotal}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>税率:</strong> {result.taxRate}%
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>税费:</strong> ${result.taxAmount.toFixed(2)}
          </div>
          <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
            <strong>总计:</strong> ${result.total.toFixed(2)}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>状态:</strong> {
              result.status === 'tax_free' ? '免税地区' :
              result.status === 'tax_exempt' ? '企业免税' :
              result.status === 'taxable' ? '需要缴税' : result.status
            }
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            <strong>说明:</strong> {result.message}
          </div>
          {result.note && (
            <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
              {result.note}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <h4>测试说明:</h4>
        <ul>
          <li>选择美国俄勒冈州 → 应该显示免税</li>
          <li>选择澳大利亚 → 应该显示10% GST</li>
          <li>选择泰国 → 应该显示7% VAT</li>
          <li>选择美国加利福尼亚州 → 应该显示8.75%销售税</li>
        </ul>
      </div>
    </div>
  );
};

export default TaxTestPage;