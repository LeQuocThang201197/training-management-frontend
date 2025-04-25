import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  showInfo?: boolean;
  total?: number;
  itemsPerPage?: number;
  itemName?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading,
  showInfo = true,
  total = 0,
  itemsPerPage = 0,
  itemName = "mục",
}: PaginationProps) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    let prev = 0;
    for (const i of range) {
      if (prev + 1 < i) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between">
      {showInfo && (
        <div className="text-sm text-gray-500">
          Hiển thị {itemsPerPage} trên tổng số {total} {itemName}
        </div>
      )}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          Trước
        </Button>

        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === "..." ? (
            <span
              key={`dots-${index}`}
              className="px-2 py-1 text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={pageNumber}
              variant={
                currentPage === Number(pageNumber) ? "default" : "outline"
              }
              size="sm"
              onClick={() => onPageChange(Number(pageNumber))}
              disabled={loading}
              className="min-w-[32px]"
            >
              {pageNumber}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
