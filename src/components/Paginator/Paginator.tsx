import React from 'react';
import Button from '../Button';
import s from './Paginator.module.scss';
import cn from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { PAGE } from '@store/CatalogStore';
import PaginatorStore from '@store/PaginatorStore';
import { action } from 'mobx';

const maxVisiblePages = 3;

const Paginator: React.FC<{ paginatorStore: PaginatorStore }> = observer(({ paginatorStore }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(
    action(() => {
      const page = searchParams.get(PAGE) ?? 1;
      if (!isNaN(Number(page))) {
        paginatorStore.setCurrentPage(Number(page));
      } else {
        searchParams.set(PAGE, '1');
        setSearchParams(searchParams);
      }
    }),
    [searchParams, paginatorStore],
  );

  const pageNumbers = React.useMemo(
    action(() => {
      const numbers: (number | string)[] = [];

      if (paginatorStore.totalPages <= maxVisiblePages) {
        for (let i = 1; i <= paginatorStore.totalPages; i++) {
          numbers.push(i);
        }
      } else {
        const leftBound = Math.max(1, paginatorStore.currentPage - Math.floor(maxVisiblePages / 2));
        const rightBound = Math.min(paginatorStore.totalPages, leftBound + maxVisiblePages - 1);

        if (leftBound > 1) {
          numbers.push(1, '...');
        }

        for (let i = leftBound; i <= rightBound; i++) {
          numbers.push(i);
        }

        if (rightBound < paginatorStore.totalPages) {
          numbers.push('...', paginatorStore.totalPages);
        }
      }

      return numbers;
    }),
    [paginatorStore.currentPage, paginatorStore.totalPages],
  );

  const handlePreviousPage = React.useCallback(
    action(() => {
      if (paginatorStore.currentPage > 1) {
        const page = paginatorStore.currentPage - 1;
        paginatorStore.setCurrentPage(page);
        searchParams.set(PAGE, page.toString());
        setSearchParams(searchParams);
      }
    }),
    [paginatorStore.currentPage, searchParams],
  );

  const handleCurrentPage = React.useCallback(
    action((page: number) => {
      paginatorStore.setCurrentPage(page);
      searchParams.set(PAGE, page.toString());
      setSearchParams(searchParams);
    }),
    [paginatorStore.currentPage, searchParams],
  );

  const handleNextPage = React.useCallback(
    action(() => {
      if (paginatorStore.currentPage < paginatorStore.totalPages) {
        const page = paginatorStore.currentPage + 1;
        paginatorStore.setCurrentPage(page);
        searchParams.set(PAGE, page.toString());
        setSearchParams(searchParams);
      }
    }),
    [paginatorStore.currentPage, paginatorStore.totalPages, searchParams],
  );

  if (paginatorStore.totalPages <= 1) {
    return null;
  }

  return paginatorStore.totalPages > 1 ? (
    <nav>
      <ul className={s.paginator}>
        <li className={cn(s['paginator-item'], paginatorStore.currentPage === 1 && s['page-item_disabled'])}>
          <Button onClick={handlePreviousPage} disabled={paginatorStore.currentPage === 1} variant="secondary">
            &laquo;
          </Button>
        </li>
        {pageNumbers.map((number, index) => (
          <li
            key={index}
            className={cn(
              s['paginator-item'],
              typeof number === 'number' && number === paginatorStore.currentPage && s['page-item_active'],
            )}
          >
            {typeof number === 'number' ? (
              <Button
                onClick={() => handleCurrentPage(number)}
                variant={number === paginatorStore.currentPage ? 'primary' : 'secondary'}
              >
                {number}
              </Button>
            ) : (
              <span className="page-link">...</span>
            )}
          </li>
        ))}
        <li
          className={cn(
            s['paginator-item'],
            paginatorStore.currentPage === paginatorStore.totalPages && s['page-item_disabled'],
          )}
        >
          <Button
            onClick={handleNextPage}
            disabled={paginatorStore.currentPage === paginatorStore.totalPages}
            variant="secondary"
          >
            &raquo;
          </Button>
        </li>
      </ul>
    </nav>
  ) : null;
});

export default Paginator;
