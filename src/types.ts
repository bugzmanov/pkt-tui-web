// types.ts
export interface Author {
  author_id: string;
  item_id: string;
  name: string;
  url: string | null;
}

export interface Tag {
  item_id: string;
  tag: string;
}

export interface Entry {
  authors?: Record<string, Author>;
  domain_metadata?: {
    name: string;
    logo?: string;
  };
  excerpt: string;
  favorite: string;
  given_title: string;
  given_url: string;
  has_image: string;
  has_video: string;
  is_article: string;
  is_index: string;
  item_id: string;
  resolved_title: string;
  resolved_url: string;
  tags?: Record<string, Tag>;
  time_added: string;
  time_read: string;
  word_count: string;
}

export interface Data {
  status: number;
  complete: number;
  list: Record<string, Entry>;
}

export interface Stats {
    pdfs: number,
    text: number,
    videos: number
}
