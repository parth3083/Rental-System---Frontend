"use client";

import { ProductFilters } from "@/components/product-filters";
import { ProductCard } from "@/components/product-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAppSelector } from "@/redux/hook";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ProductFilters as FilterType,
  ProductSummary,
  productService,
} from "@/services/product.service";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function CustomerBrowsePage() {
  const searchQuery = useAppSelector((state) => state.search.query);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({
    pageNumber: 1,
    pageSize: 12, // Adjusted for grid
    searchTerm: searchQuery,
  });
  const [totalPages, setTotalPages] = useState(1);

  // Sync search query from Redux
  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchTerm: searchQuery, pageNumber: 1 }));
  }, [searchQuery]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getProducts(filters);
        if (response.success) {
          setProducts(response.data.items);
          const total = response.data.totalCount;
          setTotalPages(Math.ceil(total / (filters.pageSize || 12)));
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        toast.error("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce fetch for better performance
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters((prev) => ({ ...prev, pageNumber: page }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8 px-4 md:px-6">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <ProductFilters
          filters={filters}
          setFilters={setFilters}
          products={products}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner className="h-10 w-10 text-primary" />
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const displayProps = {
                  id: product.id,
                  title: product.name,
                  image:
                    product.imageUrl ||
                    "https://placehold.co/400x300/png?text=No+Image",
                  price: `Rs ${product.finalPrice}`,
                  unit: product.priceLabel.replace("Per ", ""),
                  inStock: product.isAvailable,
                };

                return (
                  <Link
                    key={product.id}
                    href={`/customer/products/${product.id}`}
                    className="block h-full"
                  >
                    <ProductCard {...displayProps} />
                  </Link>
                );
              })}
              {products.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No products found matching your criteria.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange((filters.pageNumber || 1) - 1);
                        }}
                        className={
                          filters.pageNumber === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === filters.pageNumber}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange((filters.pageNumber || 1) + 1);
                        }}
                        className={
                          filters.pageNumber === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
