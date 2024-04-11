export interface LegacyCriteria {
  filters: { field: string; operator: string; value: any }[];
  order_by?: string;
  order_type?: string;
  limit?: number;
  offset?: number;
}
