import style from "./pagination.module.scss";
import { useState } from "react";

interface IPagination {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  productsPerPage: number;
  totalProducts: number;
}

const Pagination = ({
  currentPage,
  setCurrentPage,
  productsPerPage,
  totalProducts,
}: IPagination) => {
  const pageNumebers: number[] = [];
  const totalPages = totalProducts / productsPerPage;
  //Limit the page number shown
  const [pageNumberLimit, setPageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  //Paginate
  const paginate = (pageNumeber: number) => {
    setCurrentPage(pageNumeber);   
  };

  //Go to next page
  const paginateNext = () => {
    setCurrentPage(currentPage + 1);

     //show next set of pageNumbers
     if(currentPage + 1 > maxPageNumberLimit){
        setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit)
        setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit)
    }    
  };

  //Go to prev page
  const paginatePrev = () => {
    setCurrentPage(currentPage - 1);

    //show prev set of pageNumbers
    if((currentPage - 1) % pageNumberLimit === 0){
        setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit)
        setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit)
    } 
  };

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumebers.push(i);
  }

  return (
    <ol className={style.pagination}>
      <li
        onClick={paginatePrev}
        className={currentPage === pageNumebers[0] ? `${style.hidden}` : ""}
      >
        Prev
      </li>

      {pageNumebers.map((number) => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
          return (
            <li
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? `${style.active}` : ""}
            >
              {number}
            </li>
          );
        }
      })}

      <li
        onClick={paginateNext}
        className={
          currentPage === pageNumebers[pageNumebers.length - 1]
            ? `${style.hidden}`
            : ""
        }
      >
        Next
      </li>
      <p>
        <b className={style.page}>{`page ${currentPage}`}</b>
        <span>{` of `}</span>
        <b>{`${Math.ceil(totalPages)}`}</b>
      </p>
    </ol>
  );
};

export default Pagination;
