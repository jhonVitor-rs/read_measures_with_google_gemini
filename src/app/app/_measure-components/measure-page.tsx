"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Measure } from "@/services/db/schemas/measure";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { Columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { SelectMeasureType } from "./select-measure-type";
import { NewMeasureForm } from "./new-measure-form";
import { useQuery } from "@tanstack/react-query";

const fetcher = async (measureType: string) => {
  const response = await fetch(`/api/measures?measure_type=${measureType}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const success = response.ok;
  const responseData = await response.json();

  return { success, data: responseData };
};

export function MeasurePage() {
  const ref = useRef<HTMLDivElement>(null);
  const [measureType, setMeasureType] = useState("");
  const [responseMeasures, setResponseMeasures] = useState<Measure[]>([]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["measures", measureType],
    queryFn: () => fetcher(measureType),
  });

  useEffect(() => {
    const getResponse = async () => {
      if (!isLoading) {
        if (!data?.success) {
          setResponseMeasures([]);
          toast({
            title: data?.data.error_code,
            description: data?.data.error_description,
            variant: "destructive",
          });
        } else {
          setResponseMeasures(data?.data.data);
        }
      }
    };
    getResponse();
  }, [measureType, data, isLoading]);

  const table = useReactTable({
    data: responseMeasures,
    columns: Columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const changeMeasureType = (value: string) => {
    setMeasureType(value);
  };

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Medições</CardTitle>
        <CardDescription>Tabela com as medições de água e gás</CardDescription>
        <SelectMeasureType
          measureType={measureType}
          onChange={changeMeasureType}
        />
        <NewMeasureForm onClose={() => ref.current?.click()} ref={ref}>
          <Button>Addicionar nova medição</Button>
        </NewMeasureForm>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={Columns.length}
                  className="h-24 text-center"
                >
                  <Loader />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={Columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="items-center justify-end">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
