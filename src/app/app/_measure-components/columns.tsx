"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Measure } from "@/services/db/schemas/measure";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { MeasureActions } from "./measure-actions";

export const Columns: ColumnDef<Measure>[] = [
  {
    accessorKey: "measureType",
    header: () => <div className="text-xl font-bold">Tipo</div>,
    cell: ({ row }) => (
      <div className="text-lg font-semibold">
        {row.original.measureType === "WATER" ? "Água" : "Gás"}
      </div>
    ),
  },
  {
    accessorKey: "measureValue",
    header: () => <div className="text-xl font-bold">Valor</div>,
    cell: ({ row }) => (
      <div className="text-lg font-semibold">{row.original.measureValue}</div>
    ),
  },
  {
    accessorKey: "hasConfirmed",
    header: () => <div className="text-xl font-bold">Status</div>,
    cell: ({ row }) => (
      <Badge
        className="text-lg font-semibold"
        variant={!row.original.hasConfirmed ? "destructive" : "default"}
      >
        {!row.original.hasConfirmed ? "Pendente" : "Confirmado"}
      </Badge>
    ),
  },
  {
    accessorKey: "measureDatetime",
    header: ({ column }) => (
      <Button
        className="text-xl font-bold"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Data da medição
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="pl-4 text-lg font-semibold">
        {row.original.measureDatetime}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <MeasureActions measureId={row.original.id} />,
  },
];
