"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectMeasureType({
  measureType,
  onChange,
}: {
  measureType: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
}) {
  const setMeasure = (value: string) => {
    onChange(value);
  };

  return (
    <div className="absolute right-6 top-6 flex items-center justify-center gap-2">
      <Button onClick={() => setMeasure("")}>Limpar filtro</Button>
      <Select
        defaultValue={measureType}
        value={measureType}
        onValueChange={(e) => setMeasure(e)}
      >
        <SelectTrigger className="max-w-64">
          <SelectValue placeholder="Selecione um tipo de medição para filtrar" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="">Todos</SelectItem> */}
          <SelectItem value="WATER">Agua</SelectItem>
          <SelectItem value="GAS">Gás</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
