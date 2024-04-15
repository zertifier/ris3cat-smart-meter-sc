export interface EnergyStatDTO {
  activeMembers: number,
  id: number;
  infoDt: string; // Date
  cupsId?: number;
  origin: string;
  kwhIn: number;
  kwhOut: number;
  kwhOutVirtual: number;
  kwhInPrice: number;
  kwhOutPrice: number;
  kwhInPriceCommunity: number;
  kwhOutPriceCommunity: number;
  type: string;
  createdAt: string; // Date
  updatedAt: string; // Date
  communitySurplusActive: number,
  communitySurplus: number,
  communityId?: number
}

export interface DatadisEnergyStat {
  id: number;
  activeMembers: number;
  infoDt: Date;
  cupsId?: number;
  origin: string;
  kwhIn: number;
  kwhOut: number;
  kwhOutVirtual: number;
  kwhInPrice: number;
  kwhOutPrice: number;
  kwhInPriceCommunity: number;
  kwhOutPriceCommunity: number;
  type: string;
  createdAt: Date;
  communitySurplusActive: number;
  communitySurplus: number;
  updatedAt: Date;
  communityId?: number;
}
