export class DeliveryStatisticsDto {
  totalDeliveries: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  failedDeliveries: number;
  avgDeliveryTime: number;
  totalItems: number;
  returnedItems: number;
  onTimeRate: number;
  successRate: number;
  returnRate: number;
  avgDailyDeliveries: number;
  avgItemsPerDelivery: number;
  statusDistribution: DeliveryStatusDto[];
  returnsOverTime: DeliveryReturnsDto[];
}

export class DeliveryStatusDto {
  status: string;
  count: number;
  percentage: number;
}

export class DeliveryReturnsDto {
  period: string;
  delivered: number;
  returned: number;
}
