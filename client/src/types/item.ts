import type { Tag } from "./tag";

export interface Item {
  id: number;
  name: string;
  description: string;
  image: {
    id: number;
    mimeType: string;
  };
  creation_date: string;
  tags: Tag[];
  condition: "new" | "used" | "worn" | "broken";
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface CreateItemDto {
  name: string;
  description: string;
  tagIds: number[];
  condition: "new" | "used" | "worn" | "broken";
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface UpdateItemDto {
  name: string;
  description: string;
  tagIds: number[];
  condition: "new" | "used" | "worn" | "broken";
  length: number;
  width: number;
  height: number;
  weight: number;
}
