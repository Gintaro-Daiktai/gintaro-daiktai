import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  validateImageFile,
  sanitizeAvatarBase64,
  createSafeAvatarDataUri,
} from "@/utils/imageValidation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

const editProfileSchema = z.object({
  name: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

type EditProfileDialogProps = {
  children: ReactNode;
  currentName: string;
  currentLastName: string;
  currentPhoneNumber: string;
  currentAvatar?: string;
  onSave: (data: {
    name: string;
    lastName: string;
    phoneNumber: string;
    avatar?: string;
  }) => void;
  onDelete: () => void;
};

export function EditProfileDialog({
  children,
  currentName,
  currentLastName,
  currentPhoneNumber,
  currentAvatar,
  onSave,
  onDelete,
}: EditProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    currentAvatar,
  );
  const [avatarBase64, setAvatarBase64] = useState<string | undefined>();
  const [avatarError, setAvatarError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: currentName,
      lastName: currentLastName,
      phoneNumber: currentPhoneNumber,
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setAvatarError(undefined);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setAvatarError(validation.error);
      e.target.value = ""; // Reset input
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(",")[1];

      // Sanitize and validate the base64 data
      const sanitized = sanitizeAvatarBase64(base64Data);
      if (!sanitized) {
        setAvatarError(
          "Invalid or potentially dangerous image format detected",
        );
        e.target.value = ""; // Reset input
        return;
      }

      // Create safe preview URI
      // Map file type to allowed MIME types
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ] as const;
      const mimeType =
        allowedTypes.find((type) => type === file.type) || "image/jpeg";
      const safePreview = createSafeAvatarDataUri(sanitized, mimeType);
      if (!safePreview) {
        setAvatarError("Failed to create image preview");
        e.target.value = ""; // Reset input
        return;
      }

      setAvatarPreview(safePreview);
      setAvatarBase64(sanitized);
    };
    reader.onerror = () => {
      setAvatarError("Failed to read file");
      e.target.value = ""; // Reset input
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: EditProfileForm) => {
    await onSave({
      name: data.name,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      avatar: avatarBase64,
    });
    setIsOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatar">Profile Picture</Label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-20 w-20 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max file size: 2MB. Allowed: JPEG, PNG, GIF, WebP
                </p>
                {avatarError && (
                  <p className="text-xs text-red-500 mt-1">{avatarError}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">First Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-sm text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" {...register("phoneNumber")} />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="mr-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
