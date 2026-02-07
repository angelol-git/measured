import { MoveLeft } from "lucide-react";
import "./SubHeader.css";

function SubHeader({ navigate, title, aria }) {
  return (
    <header className="subheader-row">
      <button
        onClick={() => navigate(-1)}
        className="back-button position-left"
        aria-label={aria}
      >
        <MoveLeft size={20} strokeWidth={1} />
      </button>
      <h2 className="text-bold text-xl">{title}</h2>
    </header>
  );
}

export default SubHeader;
