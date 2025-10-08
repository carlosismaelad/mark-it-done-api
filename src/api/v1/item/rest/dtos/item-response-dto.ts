export interface ItemResponseDto {
  id: string;
  name: string;
  mark?: string;
  unit_price?: number | null;
  quantity?: number | null;
  total_price?: number;
}
