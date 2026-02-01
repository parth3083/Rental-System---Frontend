"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { userService } from "@/services/user.service";
import {
    Building,
    Loader2,
    Mail,
    MapPin,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CustomerDetailsPageProps {
  customerId: string;
}

interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  address?: string;
  city?: string;
  pincode?: string;
  companyName?: string;
  gstin?: string;
  createdAt: string;
}

export function CustomerDetailsPage({ customerId }: CustomerDetailsPageProps) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserById(customerId);
        if (response && response.data) {
          setUser(response.data as any); // Type assertion if needed based on response structure
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchUser();
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <div className="container mx-auto py-6 px-4">User not found</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-screen-xl space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt={user.name}
          />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{user.role}</Badge>
            <span className="text-muted-foreground text-sm">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <Input value={user.email} readOnly />
              </div>
            </div>
            {/* Phone is not in User interface but often needed. Placeholder if not available */}
            {/* <div className="space-y-2">
                            <Label>Phone</Label>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <Input value={user.phone || "N/A"} readOnly />
                            </div>
                        </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Address</Label>
              <Input value={user.address || "No address provided"} readOnly />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={user.city || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input value={user.pincode || "N/A"} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        {(user.role === "VENDOR" || user.companyName) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={user.companyName || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input value={user.gstin || "N/A"} readOnly />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
