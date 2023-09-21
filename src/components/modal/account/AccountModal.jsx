import { useState } from "react";
import { Link } from "react-router-dom";
import "./AccountModal.css";

function AccountModal(props) {
  const [slideOut, setSlideOut] = useState(false);

  // function handleClickClose() {
  //   setSlideOut(true);
  //   setTimeout(() => {
  //     props.setShowModal(false);
  //     setSlideOut(false);
  //   }, 200);
  // }

  return (
    <section
      className={`settings-container text-base ${
        slideOut ? "slide-out" : "slide-in"
      }`}
    >
      <div className="inner-container">
        <header className="sub-row">
          <button
            className="back-button secondary-link-color position-left"
            onClick={handleClickClose}
            aria-label="Close settings"
          >
            ←
          </button>
          <h2 className="text-bold header-medium">Account</h2>
        </header>
        <ul className="settings-list">
          <li className="settings-list-item">
            <Link
              to="/data"
              className={`settings-list-link`}
              onClick={handleClickClose}
            >
              Data
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                title="Right arrow icon"
              >
                <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
              </svg>
            </Link>
          </li>
          <li className="settings-list-item">
            <Link
              to="/filterSizes"
              className={`settings-list-link`}
              onClick={handleClickClose}
            >
              Filter Sizes
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                title="Right arrow icon"
              >
                <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default AccountModal;
