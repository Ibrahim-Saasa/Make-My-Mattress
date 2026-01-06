
import { ServiceRequest, ServiceType, RequestStatus, Cart } from '../types';

/**
 * SERVICE CONCIERGE ENGINE
 * Handles the "Sure-Fit" workflow between technicians and customer carts.
 */

export class ServiceConcierge {
  
  /**
   * Endpoint A Logic: POST /book-service
   */
  static async bookService(userId: string, type: ServiceType, pincode: string): Promise<ServiceRequest> {
    // 1. In real app, query DB for nearest dealer covering this pincode
    const assignedDealerId = "DEALER_MOCK_99";
    
    // 2. SAC Code mapping
    const sacCode = type === ServiceType.REPAIR ? "9987" : "9983"; // 9987: Repair, 9983: Other services
    
    return {
      request_id: `SR-${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      service_type: type,
      status: RequestStatus.PENDING,
      assigned_dealer_id: assignedDealerId,
      scheduled_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time_slot: "10:00 AM - 01:00 PM",
      service_fee: 200,
      is_fee_adjusted: false,
      payment_transaction_id: `TXN-${Date.now()}`,
      sac_code: sacCode
    };
  }

  /**
   * Endpoint B Logic: POST /technician/submit-dimensions (The Magic Sync)
   */
  static async submitDimensions(requestId: string, L: number, B: number, mockCart: Cart): Promise<{ updatedCart: Cart, status: string }> {
    // Action 1: Update Service Request in DB
    console.log(`Updating ${requestId} with dimensions: ${L}x${B}`);
    
    // Action 2: Update User's Active Cart
    const updatedCart = { ...mockCart };
    if (updatedCart.items.length > 0) {
      updatedCart.items[0].length = L;
      updatedCart.items[0].breadth = B;
      updatedCart.items[0].is_custom = true;
      
      // Action 4: Apply Fee Credit
      updatedCart.applied_service_credit = 200;
    }

    // Action 3: Trigger Push Notification (Simulated)
    console.log("PUSH: Dimensions Received! Your Cart has been updated & ₹200 fee adjusted.");

    return {
      updatedCart,
      status: "SYNC_COMPLETE"
    };
  }
}
