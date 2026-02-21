// Matches the Supabase `products` table schema exactly.
// Sellers join gives us display_name via the API route.
export type Product = {
  id: string;
  seller_id: string;
  user_id: string;
  name: string;
  type: "product" | "service";
  price: number;
  description?: string | null;
  image_url?: string | null;
  audio_url?: string | null;
  ai_description?: string | null;
  instock: boolean;
  created_at?: string;
  updated_at?: string;
  // Joined from sellers table via API route
  sellers?: {
    display_name: string;
    location: string;
  } | null;
};
