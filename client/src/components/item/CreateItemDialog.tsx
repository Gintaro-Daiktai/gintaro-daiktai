import { useCallback, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateItemDto, UpdateItemDto } from "@/types/item";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import type { Tag } from "@/types/tag";
import { MultiSelect } from "../multi-select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";

type CreateItemDialogProps = {
  children: ReactNode;
  availableTags: Tag[];
  onSave: (updateItemDto: CreateItemDto, imageFile: File) => void;
};

export function CreateItemDialog({
  children,
  availableTags,
  onSave,
}: CreateItemDialogProps) {
  const itemConditionSchema = z.union(
    [
      z.literal("new"),
      z.literal("used"),
      z.literal("worn"),
      z.literal("broken"),
    ],
    {
      error: () => ({
        message: "Condition must be one of: new, used, worn, or broken",
      }),
    },
  );

  const editItemSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters."),

    image: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size < 5000000, `Max file size is 5MB.`)
      .refine(
        (file) =>
          !file ||
          ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Only .jpg, .png, and .webp formats are supported.",
      ),

    tags: z.array(z.string()),

    condition: itemConditionSchema,

    length: z
      .transform(Number)
      .pipe(z.number().min(0.1, "Length must be greater than 0.")),
    width: z
      .transform(Number)
      .pipe(z.number().min(0.1, "Width must be greater than 0.")),
    height: z
      .transform(Number)
      .pipe(z.number().min(0.1, "Height must be greater than 0.")),
    weight: z
      .transform(Number)
      .pipe(z.number().min(0.1, "Weight must be greater than 0.")),
  });

  const EditItemFormFields = editItemSchema.keyof().enum;

  type EditItemForm = z.infer<typeof editItemSchema>;

  const [isOpen, setIsOpen] = useState(false);

  const mapTagOptions = (tags: Tag[]) => {
    return tags.map((tag) => ({
      value: String(tag.id),
      label: tag.name,
    }));
  };

  const form = useForm<EditItemForm>({
    resolver: zodResolver(editItemSchema),
  });

  const onSubmit = async (formData: EditItemForm) => {
    const updatedItem: UpdateItemDto = {
      name: formData.name,
      description: formData.description,
      tagIds: formData.tags.map((tagId) => parseInt(tagId)),
      condition: formData.condition,
      height: formData.height,
      width: formData.width,
      length: formData.length,
      weight: formData.weight,
    };

    if (!formData.image) {
      form.setError("image", {
        type: "manual",
        message: "You must upload an image since this item has none.",
      });
      return;
    }

    await onSave(updatedItem, formData.image);
    setIsOpen(false);
  };

  const removePreview = async () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      if (file) {
        form.setValue("image", file, { shouldValidate: true });

        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);
      }
    },
    [previewUrl, form],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-xl">
        <DialogHeader className="px-4">
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>Make changes to your item here.</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto grow px-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup className="gap-3 py-2">
              <Controller
                name={EditItemFormFields.name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="item-name-input">Name</FieldLabel>
                    <Input
                      {...field}
                      id="item-name-input"
                      aria-invalid={fieldState.invalid}
                      placeholder="A name for your item..."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name={EditItemFormFields.description}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="item-name-input">
                      Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="item-name-input"
                      aria-invalid={fieldState.invalid}
                      placeholder="A name for your item..."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={EditItemFormFields.condition}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="item-condition-select">
                      Condition
                    </FieldLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      onOpenChange={(open) => !open && field.onBlur()}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectTrigger
                        id="item-condition-select"
                        className="w-[180px]"
                      >
                        <SelectValue placeholder="What condition is the item in?" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                          <SelectItem value="worn">Worn</SelectItem>
                          <SelectItem value="broken">Broken</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <FieldGroup className="grid grid-cols-2 gap-3 py-2 sm:grid-cols-4">
                <Controller
                  name={EditItemFormFields.length}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="item-length-input">
                        Length (cm)
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        step="0.1"
                        id="item-length-input"
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g., 10.5"
                        autoComplete="off"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value === "" ? "" : e.target.value,
                          );
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={EditItemFormFields.width}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="item-width-input">
                        Width (cm)
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        step="0.1"
                        id="item-width-input"
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g., 5.0"
                        autoComplete="off"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value === "" ? "" : e.target.value,
                          );
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={EditItemFormFields.height}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="item-height-input">
                        Height (cm)
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        step="0.1"
                        id="item-height-input"
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g., 2.2"
                        autoComplete="off"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value === "" ? "" : e.target.value,
                          );
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={EditItemFormFields.weight}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="item-weight-input">
                        Weight (kg)
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        step="0.1"
                        id="item-weight-input"
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g., 0.5"
                        autoComplete="off"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value === "" ? "" : e.target.value,
                          );
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Controller
                name={EditItemFormFields.image}
                control={form.control}
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="image-upload">Upload Image</FieldLabel>
                    <Input
                      id="image-upload"
                      type="file"
                      accept=".jpg, .jpeg, .png, .webp"
                      onChange={handleFileChange}
                      className="sr-only"
                    />

                    <label htmlFor="image-upload" className="shrink-0">
                      <Button
                        asChild
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                      >
                        <span>Choose File...</span>
                      </Button>
                    </label>
                    {fieldState.invalid && fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}

                    <div>
                      {previewUrl ? (
                        <div className="flex flex-col items-start space-y-2">
                          <p className="text-sm font-medium">Image Preview:</p>
                          <div className="w-[200px] h-[150px] border border-gray-200 rounded-md shadow-sm overflow-hidden">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          {"No new image selected."}
                        </p>
                      )}
                    </div>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name={EditItemFormFields.tags}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="item-tags-input">Tags</FieldLabel>
                    <MultiSelect
                      id="item-tags-input"
                      options={mapTagOptions(availableTags)}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select tags..."
                      hideSelectAll={true}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <DialogFooter className="gap-2">
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  removePreview();
                }}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
