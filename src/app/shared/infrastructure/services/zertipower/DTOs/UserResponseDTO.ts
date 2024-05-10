export interface UserResponseDTO {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  customer_id?: number;
  created_at: number;
  updated_at: number;
  role: string;
  wallet_address: string;
}
