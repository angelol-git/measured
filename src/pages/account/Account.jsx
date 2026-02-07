import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import SubHeader from "../../components/header/SubHeader";
import "./Account.css";

function Account() {
  const navigate = useNavigate();
  return (
    <main className="main-container">
      <SubHeader navigate={navigate} title={"Account"} aria={"Back to Home"} />
      <ul className="account-list">
        <li className="account-list-item">
          <Link to="/account/data" className="account-list-link">
            <div className="text-base">Data</div>
            <ChevronRight size={20} strokeWidth={1} />
          </Link>
        </li>
        <li className="account-list-item">
          <Link to="/account/filterSizes" className="account-list-link">
            <div className="text-base">Filter Sizes</div>
            <ChevronRight size={20} strokeWidth={1} />
          </Link>
        </li>
      </ul>
    </main>
  );
}

export default Account;
