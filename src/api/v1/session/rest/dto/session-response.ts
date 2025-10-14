export interface SessionResponseDto {
  id: string;
  token: string;
  user_id: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
  code: number;
  code_expires_at: Date;
  status: string;
  attempts: number;
}
