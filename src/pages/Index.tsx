import { useEffect, useState } from "react";
import { Wheel } from "@/components/Wheel";
import { EntryList } from "@/components/EntryList";
import { ResultModal } from "@/components/ResultModal";
import { MenuBar } from "@/components/MenuBar";
import { Button } from "@/components/ui/button";
import { Minimize } from "lucide-react";

const Index = () => {
  const [entries, setEntries] = useState<string[]>([
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Edward",
    "Fiona",
    "George",
    "Hannah",
  ]);
  const [winner, setWinner] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [theme, setTheme] = useState("Light");
  const [mode, setMode] = useState("Normal");
  const [currentListName, setCurrentListName] = useState("Unsaved List");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleSpinComplete = (winningEntry: string) => {
    setWinner(winningEntry);
    setShowResult(true);
  };

  const handleModalClose = (open: boolean) => {
    setShowResult(open);
    if (!open && winner && mode === "Elimination") {
      setEntries((prev) => prev.filter((entry) => entry !== winner));
    }
  };

  const handleListLoad = (loadedEntries: string[]) => {
    setEntries(loadedEntries);
  };

  const STORAGE_KEY = "wheel.entries";
  const THEME_KEY = "wheel.theme";
  const MODE_KEY = "wheel.mode";

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedListsStr = localStorage.getItem("wheel.savedLists");
      if (!savedListsStr) return;

      const savedLists = JSON.parse(savedListsStr);
      const matchingList = savedLists.find(
        (list: { name: string; entries: string[] }) => {
          if (list.entries.length !== entries.length) return false;
          return list.entries.every(
            (entry: string, index: number) => entry === entries[index]
          );
        }
      );

      if (matchingList) {
        setCurrentListName(matchingList.name);
      } else {
        setCurrentListName("Unsaved List");
      }
    } catch {}
  }, [entries]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
        setEntries(parsed);
      }
    } catch {}

    try {
      const savedTheme = window.localStorage.getItem(THEME_KEY);
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch {}

    try {
      const savedMode = window.localStorage.getItem(MODE_KEY);
      if (savedMode) {
        setMode(savedMode);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(MODE_KEY, mode);
    } catch {}
  }, [mode]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {!isFullscreen && (
        <MenuBar
          onThemeChange={setTheme}
          currentTheme={theme}
          onModeChange={setMode}
          currentMode={mode}
          onListLoad={handleListLoad}
          currentEntries={entries}
          currentListName={currentListName}
          onListNameChange={setCurrentListName}
          isFullscreen={isFullscreen}
          onFullscreenToggle={toggleFullscreen}
        />
      )}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 relative">
        {isFullscreen && (
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 z-10 gap-2 lowercase"
            onClick={toggleFullscreen}
          >
            <Minimize className="h-4 w-4" />
            <span className="hidden sm:inline">exit fullscreen</span>
          </Button>
        )}

        <div className="md:flex-1 flex items-center justify-center p-2 sm:p-3 md:p-8 flex-shrink-0 md:flex-shrink md:h-full min-h-0 overflow-hidden">
          <Wheel
            entries={entries}
            onSpinComplete={handleSpinComplete}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            theme={theme}
            isFullscreen={isFullscreen}
          />
        </div>

        {!isFullscreen && (
          <div className="md:w-[380px] lg:w-[400px] w-full flex-1 md:flex-initial min-h-0 overflow-hidden border-t md:border-t-0">
            <EntryList entries={entries} onEntriesChange={setEntries} />
          </div>
        )}
      </div>

      <ResultModal
        winner={winner}
        open={showResult}
        onOpenChange={handleModalClose}
        theme={theme}
      />
    </div>
  );
};

export default Index;
