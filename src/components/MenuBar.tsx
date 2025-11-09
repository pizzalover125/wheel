import {
  Palette,
  Settings,
  List,
  Plus,
  Trash2,
  Maximize,
  Minimize,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { THEME_COLORS } from "@/lib/themeColors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SavedList {
  name: string;
  entries: string[];
}

interface MenuBarProps {
  onThemeChange?: (theme: string) => void;
  currentTheme?: string;
  onModeChange?: (mode: string) => void;
  currentMode?: string;
  onListLoad?: (entries: string[]) => void;
  onListSave?: () => void;
  currentEntries?: string[];
  currentListName?: string;
  onListNameChange?: (name: string) => void;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

export const MenuBar = ({
  onThemeChange,
  currentTheme = "Light",
  onModeChange,
  currentMode = "Normal",
  onListLoad,
  onListSave,
  currentEntries = [],
  currentListName = "Unsaved List",
  onListNameChange,
  isFullscreen = false,
  onFullscreenToggle,
}: MenuBarProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [savedLists, setSavedLists] = useState<SavedList[]>(() => {
    try {
      const stored = localStorage.getItem("wheel.savedLists");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSaveList = () => {
    if (!newListName.trim()) return;

    const newList: SavedList = {
      name: newListName.trim(),
      entries: currentEntries,
    };

    const updatedLists = [
      ...savedLists.filter((l) => l.name !== newListName.trim()),
      newList,
    ];
    setSavedLists(updatedLists);
    localStorage.setItem("wheel.savedLists", JSON.stringify(updatedLists));
    onListNameChange?.(newListName.trim());
    setNewListName("");
    setShowSaveDialog(false);
  };

  const handleLoadList = (list: SavedList) => {
    onListLoad?.(list.entries);
    onListNameChange?.(list.name);
  };

  const handleDeleteList = (listName: string) => {
    setDeleteTarget(listName);
    setShowDeleteDialog(true);
  };

  const confirmDeleteList = () => {
    if (deleteTarget) {
      const updatedLists = savedLists.filter((l) => l.name !== deleteTarget);
      setSavedLists(updatedLists);
      localStorage.setItem("wheel.savedLists", JSON.stringify(updatedLists));
      setDeleteTarget(null);
      setShowDeleteDialog(false);
    }
  };

  const themes = Object.entries(THEME_COLORS).map(([name, colors]) => ({
    name,
    colors,
  }));

  return (
    <nav className="border-b border-border bg-card flex-shrink-0">
      <div className="px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight lowercase">
            wheel
          </h1>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={onFullscreenToggle}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
              <span className="hidden sm:inline lowercase">
                {isFullscreen ? "exit fullscreen" : "fullscreen"}
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline lowercase">
                    {currentListName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={handleSaveList}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Save Current List
                </DropdownMenuItem>
                {savedLists.length > 0 && <DropdownMenuSeparator />}
                {savedLists.map((list) => (
                  <DropdownMenuItem
                    key={list.name}
                    className="cursor-pointer flex items-center justify-between group"
                  >
                    <span
                      onClick={() => handleLoadList(list)}
                      className="flex-1"
                    >
                      {list.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list.name);
                      }}
                      className="opacity-100 ml-2"
                      aria-label={`Delete ${list.name}`}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline lowercase">
                    {currentMode}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => onModeChange?.("Normal")}
                  className="cursor-pointer"
                >
                  normal
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onModeChange?.("Elimination")}
                  className="cursor-pointer"
                >
                  elimination
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline lowercase">
                    {currentTheme}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 max-h-64 overflow-y-auto"
              >
                {themes.map((theme) => (
                  <DropdownMenuItem
                    key={theme.name}
                    onClick={() => onThemeChange?.(theme.name)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="lowercase">{theme.name}</span>
                    <div className="flex gap-1">
                      {theme.colors.slice(0, 4).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="lowercase">save list</DialogTitle>
            <DialogDescription className="lowercase">
              give your list a name to save it for later use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="list-name" className="lowercase">
                list name
              </Label>
              <Input
                id="list-name"
                placeholder="e.g., Period 1, Math Class, Team A"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveList();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              className="lowercase"
            >
              cancel
            </Button>
            <Button
              onClick={handleSaveList}
              disabled={!newListName.trim()}
              className="lowercase"
            >
              save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="lowercase">delete list</DialogTitle>
            <DialogDescription className="lowercase">
              are you sure you want to delete the list "{deleteTarget}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="lowercase"
            >
              cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteList}
              className="lowercase"
            >
              delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
};
