import React from 'react';
import { useRouter } from 'next/router';

const TaxDisplay = ({ taxData }) => {
  const router = useRouter();
  const isZh = router.asPath.startsWith('/zh');

  const text = {
    tax: isZh ? '税费' : 'Tax',
    estimated: isZh ? '预估' : 'Estimated'
  };

  if (!taxData) {
    return (
      <div className="flex justify-between text-gray-400">
        <span>{text.tax}:</span>
        <span className="font-medium">--</span>
      </div>
    );
  }

  return (
    <div className="flex justify-between text-gray-400">
      <span>{text.tax} ({text.estimated} {Math.round(taxData.rate * 100)}%):</span>
      <span className="font-medium text-white">${taxData.amount.toFixed(2)}</span>
    </div>
  );
};

export default TaxDisplay;