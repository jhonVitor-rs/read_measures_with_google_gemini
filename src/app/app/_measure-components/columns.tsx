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
    header: () => <div>Tipo</div>,
    cell: ({ row }) => <div>{row.original.measureType}</div>,
  },
  {
    accessorKey: "measureValue",
    header: () => <div>Valor</div>,
    cell: ({ row }) => <div>{row.original.measureValue}</div>,
  },
  {
    accessorKey: "hasConfirmed",
    header: () => <div>Status</div>,
    cell: ({ row }) => (
      <Badge variant={!row.original.hasConfirmed ? "destructive" : "default"}>
        {!row.original.hasConfirmed ? "Pendente" : "Confirmado"}
      </Badge>
    ),
  },
  {
    accessorKey: "measureDatetime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Data da medição
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.measureDatetime}</div>,
  },
  {
    id: "actions",
    cell: () => <MeasureActions />,
  },
];
