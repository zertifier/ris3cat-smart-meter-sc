export interface EnergyStatDTO {
  id: number;
  infoDt: string; // Date
  cupsId?: number;
  origin: string;
  kwhIn: number;
  kwhOut: number;
  kwhOutVirtual: number | null;
  kwhInPrice: number | null;
  kwhOutPrice: number | null;
  kwhInPriceCommunity: number | null;
  kwhOutPriceCommunity: number | null;
  type: string | null;
  createdAt: string; // Date
  updatedAt: string; // Date
  communitySurplusActive: number,
  communitySurplus: number,
  communityId?: number
}

export interface DatadisEnergyStat {
  id: number;
  infoDt: Date;
  cupsId?: number;
  origin: string;
  kwhIn: number;
  kwhOut: number;
  kwhOutVirtual: number | null;
  kwhInPrice: number | null;
  kwhOutPrice: number | null;
  kwhInPriceCommunity: number | null;
  kwhOutPriceCommunity: number | null;
  type: string | null;
  createdAt: Date;
  communitySurplusActive: number;
  communitySurplus: number;
  updatedAt: Date;
  communityId?: number;
}
