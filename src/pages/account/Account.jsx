import { Link } from "react-router-dom";
import SubHeader from "../../components/header/SubHeader";
import "./Account.css";

function Account({ navigate }) {
  return (
    <main className="main-container">
      <SubHeader navigate={navigate} title={"Account"} aria={"Back to Home"} />
      <ul className="account-list">
        <li className="account-list-item">
          <Link to="/account/data" className={`account-list-link`}>
            <span className="text-base">Data</span>
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
        <li className="account-list-item">
          <Link to="/account/filterSizes" className={`account-list-link`}>
            <span className="text-base">Filter Sizes</span>
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
    </main>
  );
}

export default Account;
