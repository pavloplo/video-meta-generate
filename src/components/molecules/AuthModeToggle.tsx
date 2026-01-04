import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import {
  AUTH_MODE_OPTIONS,
  AUTH_STRINGS,
  type AuthMode,
} from "@/constants/auth";

export interface AuthModeToggleProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  className?: string;
}

export const AuthModeToggle = ({
  mode,
  onModeChange,
  className,
}: AuthModeToggleProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm",
        className
      )}
      role="group"
      aria-label={AUTH_STRINGS.toggle.label}
    >
      {AUTH_MODE_OPTIONS.map((option) => {
        const isActive = option.value === mode;
        return (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.15em]",
              isActive
                ? "bg-slate-900 text-white shadow-sm hover:bg-slate-900"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            )}
            aria-pressed={isActive}
            onClick={() => onModeChange(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};
