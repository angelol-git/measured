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
    <aside className={`menu-container ${slideOut ? "slide-out" : "slide-in"}`}>
      <button onClick={handleClickClose}>Close</button>
    </aside>
  );
}

export default MenuModal;
