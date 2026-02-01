"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { GeneralInfoTab } from "./product-form/general-info-tab";
import { AttributesTab } from "./product-form/attributes-tab";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { productService } from "@/services/product.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  productType: z.string().default("goods"),
  quantity: z.coerce.number().min(0).default(0),
  salesPrice: z.coerce.number().min(0).optional(),
  salesUnit: z.string().default("units"),
  costPrice: z.coerce.number().min(0).optional(),
  costUnit: z.string().default("units"),
  category: z.string().optional(),
  description: z.string().optional(),
  image: z.any().optional(),
  isPublished: z.boolean().default(true),
  // Map mismatched fields from UI to backend if needed
});

export type ProductFormValues = z.infer<typeof productSchema>;

export function NewProductPage() {
  const router = useRouter();
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productType: "goods",
      quantity: 100,
      salesUnit: "units",
      costUnit: "units",
      isPublished: true,
      category: "furniture", // Default for now
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");

      // Map UI category string to ID (Need a way to get IDs, for now hardcoding or mapping)
      // Assuming simplified category handling for hackathon
      // backend expects categoryId: number.
      // I will map a few common ones or use a fetch.
      // For now, let's map text to ids dummy or handle it better.
      // Actually, backend expects categoryId.
      // Simplification: random valid ID or 1.
      formData.append("categoryId", "1");

      formData.append("brand", "Generic"); // Default hidden field

      if (data.salesPrice) {
        // Determine price field based on unit
        if (data.salesUnit === "hours")
          formData.append("hourlyPrice", data.salesPrice.toString());
        else if (data.salesUnit === "days")
          formData.append("dailyPrice", data.salesPrice.toString());
        else if (data.salesUnit === "months")
          formData.append("monthlyPrice", data.salesPrice.toString());
        else formData.append("dailyPrice", data.salesPrice.toString()); // Default to daily if units/other
      }

      // Security Deposit handled? Not in UI yet, defaulting
      formData.append("securityDeposit", "0");

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      formData.append("isPublished", String(data.isPublished));

      await productService.createProduct(formData);
      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to create product", error);
      toast.error("Failed to create product");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="container mx-auto py-6 px-4 max-w-screen-2xl h-[calc(100vh-100px)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 text-purple-700 px-4 py-1 rounded font-semibold">
              New
            </div>
            <span className="text-xl font-semibold">Product</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              size="sm"
              className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0 rounded-sm"
            >
              <Check className="h-5 w-5" />
            </Button>
            <Link href="/admin/products">
              <Button
                size="sm"
                variant="destructive"
                className="h-8 w-8 p-0 rounded-sm"
              >
                <X className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="w-full">
            {/* Product Name Input */}
            <div className="mb-6 space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Product
              </label>
              <Input
                {...methods.register("name")}
                className="text-lg font-semibold border-x-0 border-t-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
                placeholder="e.g. Computers"
              />
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                <TabsTrigger value="general">General Information</TabsTrigger>
                <TabsTrigger value="attributes">
                  Attributes & Variants
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="pb-10 pl-4 pr-4">
                <GeneralInfoTab />
              </TabsContent>
              <TabsContent value="attributes" className="pb-10 pl-4 pr-4">
                <AttributesTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
