import type { Item, UpdateItemDto } from "@/types/item";
import { apiClient } from "./client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const itemApi = {
  getItemById: async (id: number): Promise<Item | null> => {
    const item = await apiClient<Item>(`/items/${id}`, {
      method: "GET",
    });
    return item;
  },

  getItems: async (): Promise<Item[]> => {
    return apiClient<Item[]>(`/items`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  getUnassignedItems: async (): Promise<Item[]> => {
    return apiClient<Item[]>(`/items?unassigned=true`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  createItem: async (
    data: UpdateItemDto,
    imageFile: File,
  ): Promise<UpdateItemDto> => {
    const formData = new FormData();

    formData.append("item", JSON.stringify(data));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    return apiClient<UpdateItemDto>(`/items`, {
      method: "POST",
      body: formData,
      requiresAuth: true,
    });
  },

  updateItem: async (
    itemId: number,
    data: UpdateItemDto,
    imageFile?: File,
  ): Promise<UpdateItemDto> => {
    const formData = new FormData();

    formData.append("item", JSON.stringify(data));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    return apiClient<UpdateItemDto>(`/items/${itemId}`, {
      method: "PATCH",
      body: formData,
      requiresAuth: true,
    });
  },

  deleteItemById: async (itemId: number): Promise<void> => {
    return apiClient<void>(`/items/${itemId}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      updateItemDto,
      imageFile,
    }: {
      itemId: number;
      updateItemDto: UpdateItemDto;
      imageFile?: File;
    }) => itemApi.updateItem(itemId, updateItemDto, imageFile),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["item", variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useDeleteItem = () => {
  return useMutation({
    mutationFn: (itemId: number) => itemApi.deleteItemById(itemId),
  });
};
