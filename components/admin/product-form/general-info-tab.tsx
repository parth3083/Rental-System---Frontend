"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";

export function GeneralInfoTab() {
  const { register, control, watch } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
      {/* Left: Form Fields */}
      <div className="lg:col-span-2 space-y-6">
        {/* Product Type */}
        <div className="flex items-center gap-6">
          <Label className="text-base font-semibold w-32">Product Type</Label>
          <Controller
            control={control}
            name="productType"
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex items-center gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="goods" id="goods" />
                  <Label htmlFor="goods">Goods</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="service" id="service" />
                  <Label htmlFor="service">Service</Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-6">
          <Label className="text-base font-semibold w-32">
            Quantity on Hand
          </Label>
          <div className="w-1/3">
            <Input type="number" {...register("quantity")} placeholder="0.00" />
          </div>
        </div>

        {/* Sales Price */}
        <div className="flex items-center gap-6">
          <Label className="text-base font-semibold w-32">Sales Price</Label>
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                className="pl-6"
                {...register("salesPrice")}
                placeholder="0.00"
              />
            </div>
            <div className="w-32">
              <Controller
                control={control}
                name="salesUnit"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="units">Per Units</SelectItem>
                      <SelectItem value="hours">Per Hour</SelectItem>
                      <SelectItem value="days">Per Day</SelectItem>
                      <SelectItem value="months">Per Month</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        {/* Cost Price */}
        <div className="flex items-center gap-6">
          <Label className="text-base font-semibold w-32">Cost Price</Label>
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                className="pl-6"
                {...register("costPrice")}
                placeholder="0.00"
              />
            </div>
            <div className="w-32">
              <Controller
                control={control}
                name="costUnit"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="units">Per Units</SelectItem>
                      <SelectItem value="hours">Per Hour</SelectItem>
                      <SelectItem value="days">Per Day</SelectItem>
                      <SelectItem value="months">Per Month</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center gap-6">
          <Label className="text-base font-semibold w-32">Category</Label>
          <div className="flex-1 max-w-md">
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Furniture/ Electronics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="equipments">Equipments</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Vendor Name (Visual only for now or automated) */}
        <div className="flex items-center gap-6">
          <Label className="text-base font-semibold w-32">Vendor Name:</Label>
          <div className="flex-1 max-w-md">
            <Input
              defaultValue="Current Vendor"
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Autofill Vendor&apos;s name
            </p>
          </div>
        </div>
      </div>

      {/* Right: Image & Publish */}
      <div className="space-y-6 flex flex-col items-end">
        {/* Publish Switch */}
        <div className="flex items-center gap-4 mb-8">
          <Label className="font-semibold">Publish</Label>
          <Controller
            control={control}
            name="isPublished"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        {/* Image Placeholder */}
        <Label htmlFor="image-upload" className="cursor-pointer">
          <div className="w-48 h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/30 transition-colors overflow-hidden relative">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <>
                <ImageIcon className="h-10 w-10 mb-2" />
                <span className="text-sm">Upload Image</span>
              </>
            )}
          </div>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            {...register("image", {
              onChange: handleImageChange,
            })}
          />
        </Label>
      </div>
    </div>
  );
}
