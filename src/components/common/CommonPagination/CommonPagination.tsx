import { NextArrowIcon2, PrevArrowIcon } from "assets/images/Svgicons";
import "./CommonPagination.scss";
import ReactPaginate from "react-paginate";

const CommonPagination = ({ onPageChange, pageCount, page }: any) => {
  return (
    <div className="customPagination">
      {pageCount > 1 && (
        <ReactPaginate
          className="pagination"
          breakLabel="..."
          nextLabel={<NextArrowIcon2 />}
          onPageChange={onPageChange}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel={<PrevArrowIcon />}
          activeClassName="active"
          renderOnZeroPageCount={null}
          forcePage={page && page - 1}
        />
      )}
    </div>
  );
};

export default CommonPagination;
