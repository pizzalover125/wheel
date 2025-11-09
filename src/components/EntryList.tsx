import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface EntryListProps {
  entries: string[];
  onEntriesChange: (entries: string[]) => void;
}

export const EntryList = ({ entries, onEntriesChange }: EntryListProps) => {
  const [newEntry, setNewEntry] = useState("");
  const [bulkEntries, setBulkEntries] = useState("");
  const [showClearDialog, setShowClearDialog] = useState(false);

  const addEntry = () => {
    if (newEntry.trim()) {
      onEntriesChange([...entries, newEntry.trim()]);
      setNewEntry("");
    }
  };

  const removeEntry = (index: number) => {
    onEntriesChange(entries.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addEntry();
    }
  };

  const addBulkEntries = () => {
    const parsed = bulkEntries
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (parsed.length === 0) return;

    const combined = [...entries, ...parsed];
    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const name of combined) {
      if (!seen.has(name)) {
        seen.add(name);
        deduped.push(name);
      }
    }
    onEntriesChange(deduped);
    setBulkEntries("");
  };

  const onBulkKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      addBulkEntries();
    }
  };

  const handleClear = () => setShowClearDialog(true);
  const confirmClear = () => {
    onEntriesChange([]);
    setShowClearDialog(false);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full min-h-0 bg-card border-l md:border-l border-border border-b border-gray-200">
      <div className="p-3 sm:p-3.5 md:p-6 border-b border-border">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2.5 sm:mb-3 md:mb-4 lowercase">
          entries
        </h2>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="add new entry..."
            className="flex-1 text-sm sm:text-base lowercase"
          />
          <Button onClick={addEntry} size="icon" variant="default">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2.5 sm:mt-3 md:mt-4">
          <label className="text-xs sm:text-sm font-medium text-muted-foreground lowercase">
            paste a list (one name per line)
          </label>
          <Textarea
            value={bulkEntries}
            onChange={(e) => setBulkEntries(e.target.value)}
            onKeyDown={onBulkKeyDown}
            placeholder={"alice\nbob\ncharlie"}
            className="mt-2 h-16 sm:h-20 md:h-28 text-sm sm:text-base lowercase"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground lowercase">
              press ⌘⏎ / ctrl⏎ to add
            </span>
            <Button
              size="sm"
              onClick={addBulkEntries}
              className="text-xs sm:text-sm lowercase"
            >
              add
            </Button>
          </div>
        </div>
      </div>

      <div className="h-full min-h-0 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-3 sm:p-3.5 md:p-6">
            {entries.length === 0 ? (
              <p className="text-muted-foreground text-center mt-4 sm:mt-6 md:mt-8 text-sm sm:text-base lowercase">
                no entries yet. add some names to get started!
              </p>
            ) : (
              <div className="space-y-2">
                {entries.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 p-2 sm:p-2.5 md:p-3 bg-muted/50 rounded border border-border hover:bg-muted transition-colors min-w-0"
                  >
                    <span className="font-medium text-sm sm:text-base truncate flex-1 min-w-0 lowercase">
                      {entry}
                    </span>
                    <button
                      onClick={() => removeEntry(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 ml-2"
                      aria-label={`Remove ${entry}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-3 sm:p-3.5 md:p-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-xs sm:text-sm text-muted-foreground lowercase">
            total entries: {entries.length}
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleClear}
            disabled={entries.length === 0}
            className="text-xs sm:text-sm lowercase"
          >
            clear
          </Button>
        </div>
      </div>
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="lowercase">clear all entries</DialogTitle>
            <DialogDescription className="lowercase">
              are you sure you want to remove all names from the list?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              className="lowercase"
            >
              cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmClear}
              className="lowercase"
            >
              clear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
