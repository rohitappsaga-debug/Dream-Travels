import React from 'react';
import { ShieldCheck, CreditCard, CheckCircle } from 'lucide-react';
import './PaymentSection.css';

export default function PaymentSection({ method, details, onChange }) {
  const methods = [
    {
      id: 'razorpay',
      title: 'Online Payment',
      subtitle: 'Secure Razorpay Checkout',
      icon: <ShieldCheck size={24} />
    }
  ];

  // If method is not razorpay, set it to razorpay automatically
  React.useEffect(() => {
    if (method !== 'razorpay') {
      onChange('razorpay', {});
    }
  }, [method, onChange]);

  return (
    <div className="payment-section">
      <div className="section-title">
        <CreditCard size={18} className="text-primary" />
        Payment Method
      </div>

      <div className="payment-methods-grid" style={{ gridTemplateColumns: '1fr' }}>
        {methods.map((m) => (
          <div
            key={m.id}
            className={`payment-method-card active`} // Always active since it's the only option
            style={{ cursor: 'default', background: 'var(--primary)', color: 'white' }}
          >
            {m.icon}
            <span>{m.title}</span>
            <p style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '0.25rem', textAlign: 'center' }}>{m.subtitle}</p>
            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
              <CheckCircle size={16} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-500)', fontSize: '0.75rem' }}>
        <ShieldCheck size={14} className="text-success" />
        <span>Payments are secured and encrypted by Razorpay.</span>
      </div>
    </div>
  );
}

