export type PaginationItem = number | "ellipsis";

export function getPaginationItems(currentPage: number, lastPage: number): PaginationItem[] {
  const pageCount = Math.max(1, Math.trunc(lastPage));
  const current = Math.min(pageCount, Math.max(1, Math.trunc(currentPage)));

  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const startPage = Math.max(2, Math.min(current - 1, pageCount - 3));
  const endPage = Math.min(pageCount - 1, startPage + 2);
  const items: PaginationItem[] = [1];

  if (startPage > 2) items.push("ellipsis");
  for (let page = startPage; page <= endPage; page += 1) items.push(page);
  if (endPage < pageCount - 1) items.push("ellipsis");
  items.push(pageCount);

  return items;
}
