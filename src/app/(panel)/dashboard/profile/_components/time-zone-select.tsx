import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BRAZIL_TIME_ZONES } from "./use-time-slot-picker"

interface TimeZoneSelectProps {
  value: string
  onChange: (value: string) => void
}

export function TimeZoneSelect({ value, onChange }: TimeZoneSelectProps) {
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione o seu fuso horário" />
      </SelectTrigger>
      <SelectContent className="bg-surface-card border-border">
        {BRAZIL_TIME_ZONES.map((zone) => (
          <SelectItem key={zone} value={zone}>
            {zone}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
