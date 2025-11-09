import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import confetti from "canvas-confetti";
import { getThemePalette } from "@/lib/themeColors";

interface ResultModalProps {
  winner: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme?: string;
}

export const ResultModal = ({
  winner,
  open,
  onOpenChange,
  theme = "Light",
}: ResultModalProps) => {
  const palette = getThemePalette(theme);
  useEffect(() => {
    if (open) {
      const palette = getThemePalette(theme);

      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: palette,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: palette,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [open, theme]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-fade-up">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center lowercase">
            winner
          </DialogTitle>
          <DialogDescription className="text-center text-base lowercase">
            congrats!
          </DialogDescription>
        </DialogHeader>
        {winner && (
          <div
            className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-center break-words animate-pop-in text-shimmer"
            style={{
              backgroundImage: `linear-gradient(90deg, ${palette[0]}, ${
                palette[1] || palette[0]
              })`,
            }}
          >
            {winner}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
