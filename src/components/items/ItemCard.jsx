import React from "react";
import { useState } from "react";
import ItemModal from "./ItemModal";
import ItemImage from "./itemImage/ItemImage";
import "./ItemCard.css";

function ItemCard({
  key,
  items,
  settingsData,
  fullModalOpen,
  setFullModalOpen,
}) {
  const { active, title, imageSrc } = items;
  const [clickModal, setClickModal] = useState(false);
  const [hover, setHover] = useState(false);

  let titleElement = title;

  function handleHover() {
    setHover(!hover);
  }
  function handleClickModal() {
    setFullModalOpen(!clickModal ? -1 : 0);
    setClickModal(!clickModal);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      setFullModalOpen(!clickModal ? -1 : 0);
      setClickModal(!clickModal);
    }
  }

  if (title.length > 60) {
    titleElement = title.slice(0, 57) + "...";
  }

  return (
    <article key={key}>
      <div
        className="item-card black-border"
        onClick={handleClickModal}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        onFocus={handleHover}
        onBlur={handleHover}
        role="button"
        aria-label="Open item details"
        aria-pressed={clickModal}
        tabIndex={fullModalOpen}
      >
        <ItemImage imageSrc={imageSrc} title={title} hover={hover} />
        <div className={"title-hover" + (hover ? " show" : "")}>
          <h2 className="text-medium bold-text item-card-title">
            {titleElement}
          </h2>
        </div>
        <div className={"active-tag text-normal" + (active ? " show" : "")}>
          <p>Active</p>
        </div>
      </div>
      <ItemModal
        key={title}
        items={items}
        clickModal={clickModal}
        handleClickModal={handleClickModal}
        settingsData={settingsData}
        fullModalOpen={fullModalOpen}
        setFullModalOpen={setFullModalOpen}
      />
    </article>
  );
}
export default ItemCard;
