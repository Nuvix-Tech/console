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
  onPageChange: (page: number) => void;

  /**
   * The function to call when the page size changes.
   */
  onPageSizeChange?: (pageSize: number) => void;

  name?: string;
};

export const Pagination = (props: PaginationProps) => {
  const { totalItems, currentPage, itemsPerPage, onPageChange, onPageSizeChange } = props;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value, 10);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  return (
    <>
      <div className="u-flex u-cross-baseline u-margin-block-start-32 u-flex-wrap">
        <div className="u-flex u-gap-12 u-cross-center">
          <div className="form-item ">
            <label className="label u-hide">Projects per page</label>
            <div className="select">
              <select id="rows" aria-label="Projects per page">
                <option value="6">6 </option>
                <option value="12">12 </option>
                <option value="24">24 </option>
                <option value="48">48 </option>
                <option value="96">96 </option>
              </select>
              <span className="icon-cheveron-down" aria-hidden="true"></span>
            </div>
          </div>
          <p className="text">Projects per page. Total results: 1</p>
        </div>
        <div className="u-margin-inline-start-auto">
          <nav className="pagination">
            <button
              disabled={true}
              className="button is-disabled is-text"
              aria-label="prev page"
              type="button"
            >
              <span className="icon-cheveron-left" aria-hidden="true">
                {" "}
              </span>
              <span className="text">Prev</span>
            </button>
            <ol className="pagination-list is-only-desktop">
              <li className="pagination-item">
                <button
                  disabled={true}
                  className="button is-disabled"
                  aria-label="page"
                  type="button"
                >
                  <span className="text">1</span>
                </button>
              </li>
            </ol>
            <button
              disabled={true}
              className="button is-disabled is-text"
              aria-label="next page"
              type="button"
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
