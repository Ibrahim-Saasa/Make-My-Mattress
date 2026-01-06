
import React from 'react';
import CodeBlock from './CodeBlock';

const ArchitectureTab: React.FC = () => {
  const sqlSchema = `
-- 1. Service Concierge & Magic Sync Schema
-- Database: hmc_service_db

CREATE TABLE service_requests (
    request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    service_type VARCHAR(20) NOT NULL, -- 'MEASURE', 'REPAIR', 'DISPOSAL'
    status VARCHAR(20) DEFAULT 'PENDING',
    assigned_dealer_id UUID,
    
    -- Scheduling
    scheduled_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    
    -- "Magic" Sync Columns (Nullable until technician visit)
    measured_length DECIMAL(5,2),
    measured_breadth DECIMAL(5,2),
    
    -- Financials & Compliance
    service_fee DECIMAL(10,2) DEFAULT 200.00,
    is_fee_adjusted BOOLEAN DEFAULT FALSE, -- Flips to true when applied to Cart
    payment_transaction_id TEXT,
    sac_code VARCHAR(10), -- SAC 9987 for Repairs, 9983 for Measurement
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for technician dispatch lookups
CREATE INDEX idx_pincode_status ON service_requests(status) WHERE status = 'PENDING';
  `.trim();

  const syncLogic = `
/**
 * 2. Magic Sync Logic (Backend API Workflow)
 * Triggered by Technician App upon physical measurement
 */

async function submit_dimensions(requestId, L, B) {
    // 1. Transactional Update
    const request = await db.service_requests.update(requestId, {
        measured_length: L,
        measured_breadth: B,
        status: 'COMPLETED',
        is_fee_adjusted: true
    });

    // 2. Cart Real-time Update
    // Force dimensions into user's active "Custom" mattress in cart
    await db.carts.update({ user_id: request.user_id }, {
        $set: { 
            "items.0.length": L, 
            "items.0.breadth": B,
            "items.0.is_custom": true,
            "applied_service_credit": request.service_fee -- ₹200 auto-deduct
        }
    });

    // 3. User Communication
    notify_user(request.user_id, {
        title: "Dimensions Received!",
        body: \`Technician logged \${L}x\${B}. Your cart and ₹200 credit are updated.\`
    });
}
  `.trim();

  return (
    <div className="space-y-12">
      <section>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
          Service Requests Extended Schema
        </h3>
        <p className="text-slate-400 mb-4">Architecture for handling measurements, repairs (SAC 9987), and real-time dimension sync.</p>
        <CodeBlock title="SQL Definitions" code={sqlSchema} language="sql" />
      </section>

      <section>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
          The "Magic Sync" Algorithm
        </h3>
        <p className="text-slate-400 mb-4">How technician input directly modifies the customer's digital cart and financial credit.</p>
        <CodeBlock title="Cart Sync Logic" code={syncLogic} language="javascript" />
      </section>
    </div>
  );
};

export default ArchitectureTab;
