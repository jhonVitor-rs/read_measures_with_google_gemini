/* eslint-disable no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Pencil, Trash2 } from "lucide-react";
import { MeasureConfirm } from "./measure-confirm";
import { DeleteMeasure } from "./delete-measure";
import { useRef } from "react";

export function MeasureActions({
  measureId,
  hasConfirmed,
  measureValue,
}: {
  measureId: string;
  hasConfirmed: boolean;
  measureValue: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onClose = () => {
    ref.current?.click();
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={"icon"} variant={"default"} disabled={hasConfirmed}>
            <Check />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Comfirmar</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <MeasureConfirm
            id={measureId}
            value={measureValue}
            hasConfirmed={hasConfirmed}
            closeModal={onClose}
          >
            <Button size={"icon"} variant={"link"} disabled={hasConfirmed}>
              <Pencil />
            </Button>
          </MeasureConfirm>
        </TooltipTrigger>
        <TooltipContent>Ajustar</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <DeleteMeasure id={measureId} ref={ref} closeModal={onClose}>
            <Button size={"icon"} variant={"destructive"}>
              <Trash2 />
            </Button>
          </DeleteMeasure>
        </TooltipTrigger>
        <TooltipContent>Excluir</TooltipContent>
      </Tooltip>
    </div>
  );
}
