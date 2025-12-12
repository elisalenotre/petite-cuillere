type Props = {
  page: number;
  setPage: (p: number) => void;
  total: number;
  pageSize: number;
};

const Pagination = ({ page, setPage, total, pageSize }: Props) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex justify-center items-center mt-6 gap-4">
      <button onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1}>← Précédent</button>

      <span>
        Page {page} / {totalPages}
      </span>

      <button onClick={() => page < totalPages && setPage(page + 1)} disabled={page === totalPages}>Suivant →</button>
    </div>
  );
};

export default Pagination;
