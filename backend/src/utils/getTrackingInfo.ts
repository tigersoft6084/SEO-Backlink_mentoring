export const getTrackingInfo = async (orderId: string) => {
    const mockTrackingInfo: {
      [key: string]: {
        status: string;
        carrier: string;
        trackingNumber: string;
      };
    } = {
      '123': { status: 'Shipped', carrier: 'UPS', trackingNumber: '1Z999999' },
    };
  
    return mockTrackingInfo[orderId] || null;
  };
  