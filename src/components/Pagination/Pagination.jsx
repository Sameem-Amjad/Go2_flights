// import React from 'react';

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//     const pages = [];

//     // Add first page
//     pages.push(1);

//     // Add ellipsis if the current page is more than 3 pages away from the first page
//     if (currentPage > 3) {
//         pages.push('...');
//     }

//     // Calculate the range of pages to display
//     const startPage = Math.max(2, currentPage - 1);
//     const endPage = Math.min(totalPages - 1, currentPage + 1);

//     for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//     }

//     // Add ellipsis if the current page is more than 3 pages away from the last page
//     if (currentPage < totalPages - 2) {
//         pages.push('...');
//     }

//     // Add the last page
//     if (totalPages > 1) {
//         pages.push(totalPages);
//     }

//     return (
//         <div className="flex justify-center mt-4">
//             <p className='text-custom-green p-2'>Pages</p>
//             {pages.map((page, index) => (
//                 <button
//                     key={index}
//                     onClick={() => typeof page === 'number' && onPageChange(page)} // Only change page if it's a number
//                     className={`mx-1 px-3 py-1 rounded ${currentPage === page ? 'bg-custom-gold text-white' : 'bg-gray-200 text-gray-700'}`}
//                     disabled={page === '...'} // Disable button for ellipsis
//                 >
//                     {page}
//                 </button>
//             ))}
//         </div>
//     );
// };

// export default Pagination;


import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center mt-4">
            {/* Show More Button */}
            {currentPage < totalPages ? (
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-4 py-2 bg-custom-gold text-white rounded hover:bg-yellow-600 transition duration-300"
                >
                    Show More
                </button>
            ) : (
                <p className="text-gray-500">No more pages to show</p>
            )}
        </div>
    );
};

export default Pagination;
