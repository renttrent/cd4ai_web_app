import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpWideNarrow,
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";

const availableSorts = {
  length: "Length",
  name: "Name",
} as const;

type SortOrder = "asc" | "desc";
type SortKey = keyof typeof availableSorts;

export type SortState = {
  sort: SortKey;
  order: SortOrder;
};

export const getSortingFunction = (sort?: SortState) => {
  const { sort: sortKey, order } = sort ?? {};

  if (!sortKey) return (a: string, b: string) => 1;
  switch (sortKey) {
    case "length":
      return (a: string, b: string) => {
        if (order === "asc") {
          return a.length - b.length;
        } else {
          return b.length - a.length;
        }
      };
    case "name":
      return (a: string, b: string) => {
        if (order === "asc") {
          return a.localeCompare(b);
        } else {
          return b.localeCompare(a);
        }
      };
    default:
      return (a: string, b: string) => 1;
  }
};

export function Sorter({ onSort }: { onSort?: (sort: SortState) => void }) {
  const [sort, setSort] = useState<SortState>();

  const onSortClick = (sort: SortKey, order: SortOrder) => {
    setSort({ sort, order });
    onSort?.({ sort, order });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <ArrowUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {Object.keys(availableSorts).map((sortKey, index) => (
            <DropdownMenuSub key={sortKey}>
              <DropdownMenuSubTrigger
                className={cn(sort?.sort === sortKey && "text-primary")}
              >
                <span>{availableSorts[sortKey as SortKey]}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className={cn(
                      sort?.sort === sortKey &&
                        sort?.order === "asc" &&
                        "text-primary"
                    )}
                    onClick={() => onSortClick(sortKey as SortKey, "asc")}
                  >
                    <ArrowDownWideNarrow />
                    <span className="ml-2">Ascending</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(
                      sort?.sort === sortKey &&
                        sort?.order === "desc" &&
                        "text-primary"
                    )}
                    onClick={() => onSortClick(sortKey as SortKey, "desc")}
                  >
                    <ArrowUpWideNarrow />
                    <span className="ml-2">Descending</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
