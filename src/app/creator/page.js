"use client";

import { useState, useEffect } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWorks } from "@/hooks/useWorks";
import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// shadcn/ui components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTableWithPagination, DataTable } from "@/components/ui/data-table";
import { useCreatorColumns } from "./columns";

export default function CreatorPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { works, loading: worksLoading, deleteWork, fetchWorks } = useWorks();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  const columns = useCreatorColumns();

  // Filter works based on search and visibility
  const filteredWorks = works.filter((work) => {
    const matchesSearch = work.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesVisibility =
      visibilityFilter === "all" || work.status === visibilityFilter;
    return matchesSearch && matchesVisibility;
  });

  // formatters moved to shared module

  // Handle delete work
  useEffect(() => {
    const onDeleted = () => {
      fetchWorks();
    };
    window.addEventListener("work-deleted", onDeleted);
    return () => window.removeEventListener("work-deleted", onDeleted);
  }, [fetchWorks]);

  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-2xl font-normal">Dashboard</h1>
          </div>

          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for video name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-300"
                />
              </div>
              <Select
                value={visibilityFilter}
                onValueChange={setVisibilityFilter}
              >
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="All visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All visibility</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DataTableWithPagination columns={columns} data={filteredWorks} />
          </div>
        </div>
      </div>
    </div>
  );
}
