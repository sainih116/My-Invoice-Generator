
import React from 'react';
import { type LineItem } from '../types';
import { Icon } from './Icon';

interface InvoiceTableProps {
  items: LineItem[];
  onItemChange: (index: number, field: keyof Omit<LineItem, 'id'>, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ items, onItemChange, onAddItem, onRemoveItem }) => {
  
  const handleInputChange = (index: number, field: keyof Omit<LineItem, 'id'>, value: string) => {
    const numericFields = ['quantity', 'rate'];
    const numericValue = numericFields.includes(field) ? parseFloat(value) || 0 : value;
    onItemChange(index, field, numericValue);
  };
    
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 border-collapse">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-2 py-3 border border-gray-300 w-16 text-center">QTY</th>
            <th scope="col" className="px-2 py-3 border border-gray-300 flex-1">Items</th>
            <th scope="col" className="px-2 py-3 border border-gray-300 w-24">HSN Code</th>
            <th scope="col" className="px-2 py-3 border border-gray-300 w-32">From</th>
            <th scope="col" className="px-2 py-3 border border-gray-300 w-32">To</th>
            <th scope="col" className="px-2 py-3 border border-gray-300 w-20 text-center">Days</th>
            <th scope="col" className="px-2 py-3 border border-gray-300 w-24 text-right">Rate</th>
            <th scope="col" className="px-2 py-3 border border-gray-300 w-32 text-right">Amount</th>
            <th scope="col" className="px-2 py-3 border border-gray-300 w-12 print:hidden"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const fromDate = item.fromDate ? new Date(item.fromDate) : null;
            const toDate = item.toDate ? new Date(item.toDate) : null;
            let days = '';
            if (fromDate && toDate && toDate >= fromDate) {
                // Add 1 to make the date range inclusive
                const diffTime = toDate.getTime() - fromDate.getTime();
                days = (Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1).toString();
            }

            return (
              <tr key={item.id} className="border-b">
                <td className="px-2 py-2 border border-gray-300">
                    <input type="number" value={item.quantity} onChange={(e) => handleInputChange(index, 'quantity', e.target.value)} className="w-full bg-transparent p-1 -m-1 rounded-md text-center focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </td>
                <td className="px-2 py-2 border border-gray-300">
                  <input type="text" value={item.description} onChange={(e) => handleInputChange(index, 'description', e.target.value)} className="w-full bg-transparent p-1 -m-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </td>
                <td className="px-2 py-2 border border-gray-300">
                  <input type="text" value={item.hsn} onChange={(e) => handleInputChange(index, 'hsn', e.target.value)} className="w-full bg-transparent p-1 -m-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </td>
                <td className="px-2 py-2 border border-gray-300">
                  <input type="date" value={item.fromDate} onChange={(e) => handleInputChange(index, 'fromDate', e.target.value)} className="w-full bg-transparent p-1 -m-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </td>
                <td className="px-2 py-2 border border-gray-300">
                  <input type="date" value={item.toDate} onChange={(e) => handleInputChange(index, 'toDate', e.target.value)} className="w-full bg-transparent p-1 -m-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </td>
                <td className="px-2 py-2 border border-gray-300 text-center">{days}</td>
                <td className="px-2 py-2 border border-gray-300">
                  <input type="number" value={item.rate} onChange={(e) => handleInputChange(index, 'rate', e.target.value)} className="w-full bg-transparent text-right p-1 -m-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </td>
                <td className="px-2 py-2 border border-gray-300 text-right font-medium text-gray-900">
                  ₹{(item.quantity * item.rate).toFixed(2)}
                </td>
                <td className="px-2 py-2 text-center border border-gray-300 print:hidden">
                  <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                    <Icon type="trash" className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 print:hidden">
        <button onClick={onAddItem} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
          <Icon type="plus" />
          <span>Add Item</span>
        </button>
      </div>
    </div>
  );
};
