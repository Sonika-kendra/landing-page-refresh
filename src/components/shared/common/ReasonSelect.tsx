import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export const OTHER_REASON = 'Other';

interface ReasonSelectProps {
  reasons: string[];
  preset: string;
  onPresetChange: (value: string) => void;
  otherText: string;
  onOtherTextChange: (value: string) => void;
  placeholder?: string;
}

// Preset dropdown of common reasons + a free-text "Other" fallback.
const ReasonSelect = ({
  reasons,
  preset,
  onPresetChange,
  otherText,
  onOtherTextChange,
  placeholder = 'Select a reason…',
}: ReasonSelectProps) => (
  <div className="space-y-2">
    <Select value={preset} onValueChange={onPresetChange}>
      <SelectTrigger className="h-9 text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {reasons.map((r) => (
          <SelectItem key={r} value={r}>{r}</SelectItem>
        ))}
        <SelectItem value={OTHER_REASON}>Other</SelectItem>
      </SelectContent>
    </Select>
    {preset === OTHER_REASON && (
      <Textarea
        placeholder="Describe the reason…"
        value={otherText}
        onChange={(e) => onOtherTextChange(e.target.value)}
        className="min-h-[80px]"
      />
    )}
  </div>
);

// Resolves the final reason string to send to the API: the preset label, the
// custom "Other" text, or undefined when nothing was picked.
export function resolveReason(preset: string, otherText: string): string | undefined {
  if (!preset) return undefined;
  if (preset === OTHER_REASON) return otherText.trim() || undefined;
  return preset;
}

export default ReasonSelect;
