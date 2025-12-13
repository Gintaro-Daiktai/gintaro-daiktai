import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Star,
  Package,
  Settings,
  ChartNoAxesCombined,
  BookUser,
} from "lucide-react";
import { NavLink } from "react-router";
import type { UserProfile } from "@/types/profile";
import type { User } from "@/types/auth";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

type ProfileHeaderProps = {
  profile: UserProfile;
  profileData: User;
  isOwnProfile: boolean;
  onProfileUpdate: (data: {
    name: string;
    lastName: string;
    phoneNumber: string;
    avatar?: string;
  }) => void;
  onAccountDelete: () => void;
};

export function ProfileHeader({
  profile,
  profileData,
  isOwnProfile,
  onProfileUpdate,
  onAccountDelete,
}: ProfileHeaderProps) {
  return (
    <div className="border-b bg-muted/30">
      <div className="container py-8 px-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">
                {profile.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{profile.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div>
                  <span className="font-semibold">{profile.totalSales}</span>
                  <span className="text-muted-foreground"> sales</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-end gap-3">
              {isOwnProfile && (
                <>
                  <NavLink to="/items">
                    <Button className="cursor-pointer" variant="outline">
                      <Package className="h-4 w-4 mr-2" />
                      My Items
                    </Button>
                  </NavLink>
                  <NavLink to="/deliveries">
                    <Button className="cursor-pointer" variant="outline">
                      <Package className="h-4 w-4 mr-2" />
                      Deliveries
                    </Button>
                  </NavLink>
                  <EditProfileDialog
                    currentName={profileData.name}
                    currentLastName={profileData.last_name}
                    currentPhoneNumber={profileData.phone_number}
                    currentAvatar={profile.avatar}
                    onSave={onProfileUpdate}
                    onDelete={onAccountDelete}
                  >
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </EditProfileDialog>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3">
              {isOwnProfile && (
                <>
                  <NavLink to="/deliverystats">
                    <Button className="cursor-pointer" variant="outline">
                      <ChartNoAxesCombined className="h-4 w-4 mr-2" />
                      Delivery statistics
                    </Button>
                  </NavLink>
                  <NavLink to="/userstats">
                    <Button className="cursor-pointer" variant="outline">
                      <BookUser className="h-4 w-4 mr-2" />
                      User statistics
                    </Button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
