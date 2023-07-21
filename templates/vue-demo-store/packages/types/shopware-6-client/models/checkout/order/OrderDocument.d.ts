export type OrderDocument = {
  id: string;
  deepLinkCode: string;
  sent: boolean;
  config: {
    name: string;
    title: string;
  };
  orderId: string;
  fileType: string;
  createdAt: Date;
  updatedAt: Date;
};
