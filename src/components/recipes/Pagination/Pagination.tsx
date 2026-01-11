// ------- Composant de pagination --------
// Navigation précédente/suivante et numéros de page avec ellipses.
type Props = {
  page: number;
  setPage: (p: number) => void;
  total: number;
  pageSize: number;
};

const Pagination = ({ page, setPage, total, pageSize }: Props) => {
  const totalPages = Math.ceil(total / pageSize);
  
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher un nombre limité de pages avec "..."
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="recipes-pagination">
      <div className="pagination-container">
        <button 
          className="pagination-btn prev-btn"
          onClick={() => page > 1 && setPage(page - 1)} 
          disabled={page === 1}
          aria-label="Page précédente"
        >
          ← Précédent
        </button>
        
        {/* Numéros de page (optionnel) */}
        {totalPages > 1 && (
          <div className="pagination-numbers">
            {getPageNumbers().map((pageNum, index) => (
              <button
                key={index}
                className={`page-number ${pageNum === page ? 'active' : ''} ${typeof pageNum === 'string' ? 'disabled' : ''}`}
                onClick={() => typeof pageNum === 'number' && setPage(pageNum)}
                disabled={typeof pageNum === 'string'}
                aria-label={`Page ${pageNum}`}
                aria-current={pageNum === page ? 'page' : undefined}
              >
                {pageNum}
              </button>
            ))}
          </div>
        )}

        <button 
          className="pagination-btn next-btn"
          onClick={() => page < totalPages && setPage(page + 1)} 
          disabled={page === totalPages}
          aria-label="Page suivante"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
};

export default Pagination;