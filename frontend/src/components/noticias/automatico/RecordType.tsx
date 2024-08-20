import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function TipoRegistro({
  setRecordType,
}: {
  setRecordType: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="w-full">
      <Label htmlFor="recordType">Modo de obtención</Label>
      <Select
        onValueChange={(value) => setRecordType(value)}
        defaultValue="automatic"
      >
        <SelectTrigger className="w-full mt-4" id="recordType">
          <SelectValue placeholder="Automático" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="automatic">Automático</SelectItem>
          <SelectItem value="manual">Manual</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
