import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, EditIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import type { CreateItemDto, Item, UpdateItemDto } from "@/types/item";
import { itemApi, useDeleteItem, useUpdateItem } from "@/api/item";
import { EditItemDialog } from "@/components/item/EditItemDialog";
import { CreateItemDialog } from "@/components/item/CreateItemDialog";
import type { Tag } from "@/types/tag";
import { tagApi } from "@/api/tag";
import { imageApi } from "@/api/image";
import { ViewItemDialog } from "@/components/item/ViewItemDialog";

export default function MyItemsPage() {
  const [unassignedItems, setUnassignedItems] = useState<Item[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  const [viewItemDialogOpen, setViewItemDialogOpen] = useState<boolean>(false);
  const [viewItem, setViewItem] = useState<Item>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchUnassignedItems = async (): Promise<Item[]> => {
    try {
      return itemApi.getUnassignedItems();
    } catch (err) {
      let errorMessage = "An unknown error occurred while fetching items.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      console.error("Failed to fetch items:", err);
      setErrors((prevErrors) => [...prevErrors, errorMessage]);
      return [];
    }
  };

  const fetchTags = async (): Promise<Tag[]> => {
    try {
      return tagApi.getTags();
    } catch (err) {
      let errorMessage = "An unknown error occurred while fetching tags.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      console.error("Failed to fetch tags:", err);
      setErrors((prevErrors) => [...prevErrors, errorMessage]);
      return [];
    }
  };

  const fetchImages = async (
    itemsToLoad: Item[],
  ): Promise<Record<number, string>> => {
    const urls: Record<number, string> = {};

    await Promise.all(
      itemsToLoad.map(async (item) => {
        if (item.image) {
          try {
            urls[item.id] = await imageApi.getImageById(item.image.id);
          } catch (err) {
            console.error(`Failed to load image for item ${item.id}`, err);
          }
        }
      }),
    );

    return urls;
  };

  const fetchData = async () => {
    setLoading(true);
    setErrors([]);

    const items = await fetchUnassignedItems();
    setUnassignedItems(items);
    const tags = await fetchTags();
    setTags(tags);
    const images = await fetchImages(items);
    setImageUrls(images);

    setLoading(false);
  };

  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();

  const handleItemView = async (item: Item) => {
    setViewItem(item);
    setViewItemDialogOpen(true);
  };

  const handleItemCreate = async (
    createItemDto: CreateItemDto,
    imageFile: File,
  ) => {
    await itemApi.createItem(createItemDto, imageFile);
    await fetchData();
  };

  const handleItemUpdate = async (
    itemId: number,
    updateItemDto: UpdateItemDto,
    imageFile?: File,
  ) => {
    await updateItemMutation.mutateAsync({ itemId, updateItemDto, imageFile });
    await fetchData();
  };

  const handleItemDelete = async (itemId: number) => {
    await deleteItemMutation.mutateAsync(itemId);
    await fetchData();
  };

  if (loading) return <p></p>;

  if (errors.length > 0) {
    return (
      <div className="color-red, p-10">
        <h4>Data Fetching Failed:</h4>
        {errors.map((err, index) => (
          <p key={index} style={{ margin: "5px 0" }}>
            {err}
          </p>
        ))}
      </div>
    );
  } else {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="border-b bg-muted/30">
            <div className="container py-8">
              <h1 className="text-3xl font-bold tracking-tight">My Items</h1>
              <p className="text-muted-foreground mt-2">
                Manage your items, auctions, and lotteries
              </p>
            </div>
          </div>

          {viewItem && (
            <ViewItemDialog
              isOpen={viewItemDialogOpen}
              onOpenChange={setViewItemDialogOpen}
              item={viewItem}
              itemImageUrl={imageUrls[viewItem.id]}
            ></ViewItemDialog>
          )}

          <div className="container py-8 space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">My Items</CardTitle>
                <CreateItemDialog
                  availableTags={tags}
                  onSave={handleItemCreate}
                >
                  <Button className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Item
                  </Button>
                </CreateItemDialog>
              </CardHeader>

              <CardContent>
                {unassignedItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No items yet...
                    </p>
                    <CreateItemDialog
                      availableTags={tags}
                      onSave={handleItemCreate}
                    >
                      <Button className="cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Item
                      </Button>
                    </CreateItemDialog>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unassignedItems.map((item) => (
                      <>
                        <Card
                          key={item.id}
                          className="p-0 group overflow-hidden hover:shadow-lg transition-shadow text-left cursor-pointer gap-0"
                          onClick={() => handleItemView(item)}
                        >
                          <div className="relative aspect-4/3 overflow-hidden bg-muted cursor-pointer">
                            <img
                              src={imageUrls[item.id] || "/placeholder.svg"}
                              alt={item.name}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold line-clamp-2 leading-snug cursor-pointer hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                            <p className="line-clamp-2 leading-snug cursor-pointer">
                              {item.description}
                            </p>
                            <div className="flex justify-end-safe gap-2">
                              <EditItemDialog
                                currentItem={item}
                                availableTags={tags}
                                onSave={handleItemUpdate}
                                onDelete={handleItemDelete}
                              >
                                <Button
                                  className="cursor-pointer"
                                  variant={"outline"}
                                >
                                  <EditIcon className="h-4 w-4" />
                                  Edit
                                </Button>
                              </EditItemDialog>
                              <Button
                                className="cursor-pointer text-red-500"
                                variant={"outline"}
                                onClick={() => handleItemDelete(item.id)}
                              >
                                <Trash2Icon className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }
}
