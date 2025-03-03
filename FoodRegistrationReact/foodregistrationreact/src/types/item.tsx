export interface Item {
  itemId: number;
  name: string;
  category: string;
  certificate: string;
  imageUrl: string;
  energy?: number;
  carbohydrates?: number;
  sugar?: number;
  protein?: number;
  fat?: number;
  saturatedfat?: number;
  unsaturatedfat?: number;
  fibre?: number;
  salt?: number;
  countryOfOrigin: string;
  countryOfProvenance: string;
  createdDate?: string;  
  updatedDate?: string;  
}
