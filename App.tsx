import React, { useMemo, useState, ChangeEvent, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InvoiceTable } from './components/InvoiceTable';
import { Icon } from './components/Icon';
import { LineItem } from './types';
import { numberToWords } from './utils/numberToWords';

// Define the structure of the invoice state
interface InvoiceState {
  companyName: string;
  companyAddress: string;
  gstin: string;
  companyPhone: string;
  invoiceTitle: string;
  invoiceNumber: string;
  invoiceDate: string;
  clientName: string;
  clientAddress: string;
  clientGstin: string;
  deliveryAddress: string;
  items: LineItem[];
  sgstRate: number;
  cgstRate: number;
  igstRate: number;
  cartage: number;
  bankAccountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  terms: string;
}

// Populate the initial state with data from the provided image
const initialInvoiceState: InvoiceState = {
  companyName: 'BALA JEE TIMBER',
  companyAddress: 'Plot No. 11&12 Shuttering Market Vill. Sanouli, Old Ambala Road\nZirakpur, Distt. Mohali, Punjab-140603',
  gstin: '03AARFB9110B1ZX',
  companyPhone: 'M. 9466053608\n7534807429',
  invoiceTitle: 'GST Invoice',
  invoiceNumber: '279',
  invoiceDate: '2023-08-21',
  clientName: 'VS & V Communication Pvt. Ltd.',
  clientAddress: 'mata Sadan chowk, Jwalather Handwa',
  clientGstin: '05AARCV9746J1Z...',
  deliveryAddress: 'Doon Hospital Gate No. 4 Dehradun',
  items: [
    { id: uuidv4(), description: 'Prop 3x2', hsn: '9954', quantity: 3000, rate: 1.20, fromDate: '2023-07-01', toDate: '2023-07-31' },
    { id: uuidv4(), description: 'Prop 2x2', hsn: '9954', quantity: 2700, rate: 1.10, fromDate: '2023-07-01', toDate: '2023-07-31' },
    { id: uuidv4(), description: 'Standard 3 mtr', hsn: '9954', quantity: 845, rate: 26.59, fromDate: '2023-07-01', toDate: '2023-07-31' },
  ],
  sgstRate: 0,
  cgstRate: 0,
  igstRate: 18,
  cartage: 0,
  bankAccountHolder: 'BALA JEE TIMBER',
  bankName: 'AXIS Bank, Rohtak',
  accountNumber: '917020045984632',
  ifscCode: 'UTIB0000204',
  terms: 'The bill is not paid within 8 days of presentation, interest @ 24% per annum will be charged.\nIn case of any objection in amount please return the bill with in eight days of the receipt otherwise it will be treated as accepted.',
};

// Define a blank state for resetting the invoice
const blankInvoiceState: InvoiceState = {
  companyName: '',
  companyAddress: '',
  gstin: '',
  companyPhone: '',
  invoiceTitle: 'GST Invoice',
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  clientName: '',
  clientAddress: '',
  clientGstin: '',
  deliveryAddress: '',
  items: [{ id: uuidv4(), description: '', hsn: '', quantity: 1, rate: 0, fromDate: '', toDate: '' }],
  sgstRate: 0,
  cgstRate: 0,
  igstRate: 0,
  cartage: 0,
  bankAccountHolder: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  terms: '',
};

const EditableField = ({ value, onChange, placeholder, className = '', isTextarea = false }) => {
  const commonClasses = "bg-transparent p-1 -m-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 w-full";
  if (isTextarea) {
    return <textarea value={value} onChange={onChange} placeholder={placeholder} className={`${commonClasses} ${className} resize-none`} rows={2}></textarea>;
  }
  return <input type="text" value={value} onChange={onChange} placeholder={placeholder} className={`${commonClasses} ${className}`} />;
};

function App() {
  const [invoice, setInvoice] = useState<InvoiceState>(initialInvoiceState);

  const handleInvoiceChange = (field: keyof InvoiceState, value: string | number) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNumericInvoiceChange = (field: 'sgstRate' | 'cgstRate' | 'igstRate' | 'cartage', value: string) => {
     handleInvoiceChange(field, parseFloat(value) || 0);
  };

  const handleItemChange = (index: number, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
    const newItems = [...invoice.items];
    (newItems[index] as any)[field] = value;
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setInvoice(prev => ({ ...prev, items: [...prev.items, { id: uuidv4(), description: '', hsn: '', quantity: 1, rate: 0, fromDate: '', toDate: '' }] }));
  };

  const handleRemoveItem = (id: string) => {
    setInvoice(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all entries? This action cannot be undone.')) {
        setInvoice(blankInvoiceState);
    }
  };
  
  const subtotal = useMemo(() => invoice.items.reduce((acc, item) => acc + item.quantity * item.rate, 0), [invoice.items]);
  const sgstAmount = subtotal * (invoice.sgstRate / 100);
  const cgstAmount = subtotal * (invoice.cgstRate / 100);
  const igstAmount = subtotal * (invoice.igstRate / 100);
  const grandTotal = subtotal + sgstAmount + cgstAmount + igstAmount + invoice.cartage;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 font-sans text-sm">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 shadow-lg print:shadow-none border">
        <header className="border-b-2 border-black pb-2">
           <div className="flex justify-between items-start text-xs">
              <span className="font-bold">GSTIN No. <EditableField value={invoice.gstin} onChange={(e) => handleInvoiceChange('gstin', e.target.value)} placeholder="Your GSTIN" className="inline-block w-40 font-normal" /></span>
              <span className="font-bold text-center"><EditableField value={invoice.invoiceTitle} onChange={(e) => handleInvoiceChange('invoiceTitle', e.target.value)} placeholder="Invoice Title" className="text-center" /></span>
              <span className="text-right"><EditableField value={invoice.companyPhone} onChange={(e) => handleInvoiceChange('companyPhone', e.target.value)} placeholder="Your Phone" className="text-right" isTextarea={true} /></span>
           </div>
           <div className="flex justify-center items-center mt-2 text-center">
                <div className="flex-grow">
                    <EditableField value={invoice.companyName} onChange={(e) => handleInvoiceChange('companyName', e.target.value)} placeholder="Your Company" className="text-2xl font-bold text-center" />
                    <EditableField value={invoice.companyAddress} onChange={(e) => handleInvoiceChange('companyAddress', e.target.value)} placeholder="Company Address" isTextarea={true} className="text-xs text-center" />
                </div>
           </div>
           <div className="flex justify-between items-center mt-2 text-xs">
                <span className="font-bold">Invoice No. <EditableField value={invoice.invoiceNumber} onChange={(e) => handleInvoiceChange('invoiceNumber', e.target.value)} placeholder="Inv No." className="inline-block w-24 font-normal" /></span>
                <span className="font-bold">Dated: <input type="date" value={invoice.invoiceDate} onChange={(e) => handleInvoiceChange('invoiceDate', e.target.value)} className="bg-transparent p-1 -m-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 font-normal" /></span>
           </div>
        </header>

        <section className="border-b-2 border-black py-2 grid grid-cols-2 gap-x-4 text-xs">
            <div>
                <span className="font-bold">Full Name & Address of Recipient</span>
                <EditableField value={invoice.clientName} onChange={(e) => handleInvoiceChange('clientName', e.target.value)} placeholder="Client Name" className="font-semibold"/>
                <EditableField value={invoice.clientAddress} onChange={(e) => handleInvoiceChange('clientAddress', e.target.value)} placeholder="Client Address" isTextarea={true} />
                <span className="font-bold">GSTIN: <EditableField value={invoice.clientGstin} onChange={(e) => handleInvoiceChange('clientGstin', e.target.value)} placeholder="Client GSTIN" className="inline-block w-40 font-normal"/></span>
            </div>
             <div>
                <span className="font-bold">Address of Delivery</span>
                <EditableField value={invoice.deliveryAddress} onChange={(e) => handleInvoiceChange('deliveryAddress', e.target.value)} placeholder="Delivery Address" isTextarea={true}/>
            </div>
        </section>

        <main className="my-2">
          <InvoiceTable items={invoice.items} onItemChange={handleItemChange} onAddItem={handleAddItem} onRemoveItem={handleRemoveItem} />
        </main>

        <footer className="border-t-2 border-black pt-2">
            <div className="flex justify-between text-xs">
                <div className="w-3/5 pr-4">
                    <div>
                        <span className="font-bold">Amount in words:</span> {numberToWords(Math.round(grandTotal))}
                    </div>
                    <div className="mt-4">
                        <EditableField value={invoice.bankAccountHolder} onChange={(e) => handleInvoiceChange('bankAccountHolder', e.target.value)} placeholder="Account Holder Name" className="font-bold"/>
                        <div className="grid grid-cols-2">
                            <span>Bank Name: <EditableField value={invoice.bankName} onChange={(e) => handleInvoiceChange('bankName', e.target.value)} placeholder="Bank Name" className="inline-block w-3/5"/></span>
                            <span>A/C No.: <EditableField value={invoice.accountNumber} onChange={(e) => handleInvoiceChange('accountNumber', e.target.value)} placeholder="Account Number" className="inline-block w-3/5"/></span>
                            <span>IFSC Code: <EditableField value={invoice.ifscCode} onChange={(e) => handleInvoiceChange('ifscCode', e.target.value)} placeholder="IFSC Code" className="inline-block w-3/5"/></span>
                        </div>
                    </div>
                </div>
                <div className="w-2/5">
                    <div className="grid grid-cols-2 border-b border-gray-300 py-1">
                        <span className="font-semibold">Total</span>
                        <span className="text-right">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center border-b border-gray-300 py-1">
                        <span>SGST @ <input type="number" value={invoice.sgstRate} onChange={(e) => handleNumericInvoiceChange('sgstRate', e.target.value)} className="w-12 bg-transparent p-1 -m-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-right"/> %</span>
                        <span className="text-right">₹{sgstAmount.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center border-b border-gray-300 py-1">
                        <span>CGST @ <input type="number" value={invoice.cgstRate} onChange={(e) => handleNumericInvoiceChange('cgstRate', e.target.value)} className="w-12 bg-transparent p-1 -m-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-right"/> %</span>
                        <span className="text-right">₹{cgstAmount.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center border-b border-gray-300 py-1">
                        <span>IGST @ <input type="number" value={invoice.igstRate} onChange={(e) => handleNumericInvoiceChange('igstRate', e.target.value)} className="w-12 bg-transparent p-1 -m-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-right"/> %</span>
                        <span className="text-right">₹{igstAmount.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center border-b border-gray-300 py-1">
                        <span>Cartage</span>
                         <input type="number" value={invoice.cartage} onChange={(e) => handleNumericInvoiceChange('cartage', e.target.value)} className="w-full bg-transparent p-1 -m-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-right"/>
                    </div>
                    <div className="grid grid-cols-2 font-bold mt-1">
                        <span>G. TOTAL</span>
                        <span className="text-right">₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-4 text-xs">
                <div className="w-3/5">
                     <EditableField value={invoice.terms} onChange={(e) => handleInvoiceChange('terms', e.target.value)} placeholder="Terms & Conditions" isTextarea={true} />
                </div>
                <div className="w-2/5 text-center pt-4">
                    <span className="font-bold">For {invoice.companyName}</span>
                    <div className="mt-12">(Signature)</div>
                </div>
            </div>
        </footer>
         <div className="mt-8 flex justify-center items-center gap-4 print:hidden">
            <button onClick={() => window.print()} className="py-2 px-6 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors">Print Invoice</button>
            <button onClick={handleReset} className="py-2 px-6 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Reset Invoice</button>
          </div>
      </div>
    </div>
  );
}

export default App;