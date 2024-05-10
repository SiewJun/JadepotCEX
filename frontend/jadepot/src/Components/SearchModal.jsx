import React from "react"; // eslint-disable-line

const SearchOffcanvas = () => {
  return (
    <>
      <div className="flex px-3 py-2">
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#SearchModal"
          className="text-text1 hover:text-accent1 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>

      <div
        className="modal fade"
        id="SearchModal"
        tabIndex="-1"
        aria-labelledby="SearchModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="SearchModalLabel">
                Search Pairs
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body"></div>
            <div className="modal-footer">
              <button
                type="button"
                className="text-text1 bg-accent1 p-3 py-2 rounded-md"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOffcanvas;
