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
        "flex w-full items-center gap-2 rounded-md bg-muted p-1",
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
            variant={isActive ? "secondary" : "ghost"}
            className={cn("flex-1", !isActive && "text-muted-foreground")}
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
