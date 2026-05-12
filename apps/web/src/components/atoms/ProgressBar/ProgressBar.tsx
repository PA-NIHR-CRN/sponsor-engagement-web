import clsx from 'clsx'

export interface ProgressBarProps {
  max: number
  value: number
  color?: progressBarColor
  className?: string
}

export enum progressBarColor {
  Default,
  Warning,
  Error
}

function GetProgressBarColorClass(color: progressBarColor) {
  if (color === progressBarColor.Default) {
    return "";
  } else if (color === progressBarColor.Warning) {
    return "progress-bar-warning";
  } else if (color === progressBarColor.Error) {
    return "progress-bar-error";
  }
  return ""
}

export function ProgressBar({ max, color = progressBarColor.Default, value, className }: ProgressBarProps) {
  const colorClass = GetProgressBarColorClass(color);

  const limitedValue = Math.min(max, Math.max(0, value));

  return (
    <progress className={clsx("progress-bar", colorClass, className)} max={max} value={limitedValue} />
  )
}
