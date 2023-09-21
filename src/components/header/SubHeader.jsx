import "./SubHeader.css";

function SubHeader({ navigate, title, aria }) {
  return (
    <header className="subheader-row">
      <button
        onClick={() => navigate(-1)}
        className="back-button position-left"
        aria-label={aria}
      >
        <svg
          width="14"
          height="14"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
          viewBox="0 0 24 24"
        >
          <path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z" />
        </svg>
      </button>
      <h2 className="text-bold text-xl">{title}</h2>
    </header>
  );
}

export default SubHeader;
