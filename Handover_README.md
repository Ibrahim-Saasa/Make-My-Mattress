
# Technical Handover: Hindustan Mattress Co. (Project MMM)

## 1. Feature-First Folder Structure (Flutter)
```
lib/
├── main.dart
├── core/
│   ├── auth/                # OTP & Identity Logic
│   ├── api/                 # Base Client & Interceptors
│   ├── theme/               # Visual Identity (Trust Navy/Action Amber)
│   └── pricing_engine/      # Bimodal Financial Logic
├── features/
│   ├── commerce/
│   │   ├── catalog/         # BrandHall & PDP
│   │   ├── config/          # SmartConfigurator (3D Preview)
│   │   └── checkout/        # Cart & Invoicing
│   ├── concierge/
│   │   ├── services/        # Measurement & Repair Hub
│   │   └── technician/      # Technician Job Portal
│   ├── factory/
│   │   ├── kanban/          # Station Management
│   │   ├── scanner/         # QR/Barcode Production Logs
│   │   └── logistics/       # Manifest & Carrier Assignment
│   └── admin/
│       ├── capitol/         # Global Dashboards
│       └── armory/          # Bulk Price Uploader
└── shared/
    ├── widgets/
    └── utils/               # Currency Formatting & Validators
```

## 2. Phase 3 Database Schema (PostgreSQL)

### Shipping Manifests
```sql
CREATE TABLE shipping_manifests (
    shipment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    total_weight_kg DECIMAL(10,2),
    volumetric_weight DECIMAL(10,2),
    assigned_carrier VARCHAR(50), -- 'AIR_COURIER', 'SURFACE_CARGO', 'DEALER_FLEET'
    tracking_number VARCHAR(100) UNIQUE,
    shipping_label_url TEXT,
    status VARCHAR(20) DEFAULT 'READY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Production Logs
```sql
CREATE TABLE production_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL, -- Links to specific item (e.g., King Mattress in a 5-item order)
    station_name VARCHAR(50), -- 'CUTTING', 'STITCHING', 'QC', 'PACKING'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    operator_id UUID,
    qc_status VARCHAR(20), -- 'PASSED', 'FAILED'
    notes TEXT
);

CREATE INDEX idx_item_station ON production_logs(order_item_id, station_name);
```

## 3. Deployment Notes
- **Pricing**: Always use the `FinancialEngine` for currency display to ensure INR compliance.
- **Security**: The `Armory` uploader requires a `SUPER_ADMIN` token.
- **Logistics**: The `assignShippingCarrier` logic must be triggered at the moment of `ORDER_PAID`.
