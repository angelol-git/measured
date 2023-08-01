import { useState } from "react";
import "./MenuModal.css";

function MenuModal(props) {
  const [slideOut, setSlideOut] = useState(false);

  function handleClickClose() {
    setSlideOut(true);
    setTimeout(() => {
      props.handleClickMenu();
      setSlideOut(false);
    }, 200);
  }

  return (
    <section
      className={`menu-container ${slideOut ? "slide-out" : "slide-in"}`}
    >
      <div className="inner-container">
        <div className="sub-row">
          <button
            className="back-button secondary-link-color position-left"
            onClick={handleClickClose}
          >
            ←
          </button>
          <h3 className="bold-text header-medium">Settings</h3>
        </div>
      </div>

      <ul className="menu"></ul>
    </section>
  );
}

export default MenuModal;
