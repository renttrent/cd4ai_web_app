import { Button } from "@/components/ui/button";
import { useRecommend } from "../_hooks/use-recommend";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
export const RecommendKeywords = ({
  onAccept,
  taskId,
}: {
  taskId: string;
  onAccept?: (data: string[]) => void;
}) => {
  const { data, mutateAsync } = useRecommend();

  const [selected, setSelected] = useState<string[]>([]);
  const results = data?.results ?? [];

  const toggleSelected = (word: string) => {
    if (selected.includes(word)) {
      setSelected(selected.filter((w) => w !== word));
    } else {
      setSelected([...selected, word]);
    }
  };

  const toggleSelectAll = () => {
    console.log("toggled");
    if (selected.length === results.length) {
      setSelected([]);
    } else {
      setSelected(results.map((result) => result.document?.text ?? ""));
    }
  };

  return (
    <Drawer onOpenChange={(isOpen) => isOpen && setSelected([])}>
      <DrawerTrigger onClick={() => mutateAsync(taskId)}>
        <Button variant="outline" type="button" size="sm">
          Get Recommendations (AI)
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex items-center mx-auto">
        <div className="max-w-2xl flex items-center flex-col">
          <DrawerHeader>
            <DrawerTitle>Recommendations</DrawerTitle>
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="flex gap-2 items-center">
                <label htmlFor="check">Select All</label>
                <Checkbox
                  id="check"
                  onCheckedChange={() => toggleSelectAll()}
                  checked={selected.length === results.length}
                />
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => mutateAsync(taskId)}
                  type="button"
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
              {results.map((result, index) => (
                <div key={index} className="flex flex-wrap gap-2">
                  <Badge
                    onClick={() => toggleSelected(result.document?.text ?? "")}
                    variant={
                      selected.includes(result.document?.text ?? "")
                        ? "default"
                        : "outline"
                    }
                    className="flex gap-2 divide-x-2 text-lg"
                  >
                    <span>{result.document?.text}</span>
                    <span className="pl-2">
                      Score : {result.relevance_score.toPrecision(3)}
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <div className="w-full md:w-80 flex">
                <Button
                  onClick={() => onAccept?.(selected)}
                  type="button"
                  className="flex-1"
                >
                  Accept
                </Button>
              </div>
            </DrawerClose>

            <DrawerClose>
              <div className="w-full md:w-80 flex">
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
