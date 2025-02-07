import { useSearchParams, useRouter } from "next/navigation";

export type PaginationProps = {
  /**
   * The total number of items.
   */
  totalItems: number;
  /**
   * The current page number.
   */
  currentPage: number;
  /**
   * The number of items per page.
   */
  itemsPerPage: number;
  /**
   * The function to call when the page changes.
   */
  onPageChange?: (page: number) => void;

  /**
   * The function to call when the page size changes.
   */
  onPageSizeChange?: (pageSize: number) => void;

  name?: string;
};

export const Pagination = (props: PaginationProps) => {
  const { totalItems, currentPage, itemsPerPage, onPageChange, onPageSizeChange } = props;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      if (onPageChange) {
        onPageChange(page);
      } else {
        push(`?${params.toString()}`);
      }
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value, 10);
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newSize.toString());
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    } else {
      push(`?${params.toString()}`);
    }
  };

  return (
    <>
      <div className="u-flex u-cross-baseline u-margin-block-start-32 u-flex-wrap">
        <div className="u-flex u-gap-12 u-cross-center">
          <div className="form-item ">
            <label className="label u-hide">Projects per page</label>
            <div className="select">
              <select
                id="rows"
                aria-label="Projects per page"
                value={itemsPerPage}
                onChange={handlePageSizeChange}
              >
                <option value="6">6 </option>
                <option value="12">12 </option>
                <option value="24">24 </option>
                <option value="48">48 </option>
                <option value="96">96 </option>
              </select>
              <span className="icon-cheveron-down" aria-hidden="true"></span>
            </div>
          </div>
          <p className="text">Projects per page. Total results: {totalItems}</p>
        </div>
        <div className="u-margin-inline-start-auto">
          <nav className="pagination">
            <button
              disabled={currentPage <= 1}
              className={`button ${currentPage <= 1 ? "is-disabled" : ""} is-text`}
              aria-label="prev page"
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <span className="icon-cheveron-left" aria-hidden="true">
                {" "}
              </span>
              <span className="text">Prev</span>
            </button>
            <ol className="pagination-list is-only-desktop">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index} className="pagination-item">
                  <button
                    className={`button ${currentPage === index + 1 ? "is-disabled" : ""}`}
                    aria-label={`page ${index + 1}`}
                    type="button"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    <span className="text">{index + 1}</span>
                  </button>
                </li>
              ))}
            </ol>
            <button
              disabled={currentPage >= totalPages}
              className={`button ${currentPage >= totalPages ? "is-disabled" : ""} is-text`}
              aria-label="next page"
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <span className="text">Next</span>
              <span className="icon-cheveron-right" aria-hidden="true">
                {" "}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};
