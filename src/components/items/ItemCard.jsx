import React from "react";
import { useState } from "react";
import ItemModal from "./ItemModal";
import ItemImage from "./itemImage/ItemImage";
import Modal from "../modal/Modal";
import "./ItemCard.css";

function ItemCard({ key, items, activeItem, deleteItem }) {
  const { active, title, imageSrc } = items;
  const [showModal, setShowModal] = useState(false);
  const [hover, setHover] = useState(false);

  let titleElement = title;

  function handleHover() {
    setHover(!hover);
  }
  function handleClickModal() {
    setClickModal(!showModal);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      setClickModal(!showModal);
    }
  }

  if (title.length > 60) {
    titleElement = title.slice(0, 57) + "...";
  }

  return (
    <article key={key}>
      <div
        className="item-card black-border"
        // onClick={handleClickModal}
        onClick={() => {
          setShowModal(true);
        }}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        onFocus={handleHover}
        onBlur={handleHover}
        role="button"
        aria-label="Open item details"
        aria-pressed={showModal}
        // tabIndex={fullModalOpen}
      >
        <ItemImage imageSrc={imageSrc} title={title} hover={hover} />
        <div className={"title-hover" + (hover ? " show" : "")}>
          <h2 className="text-medium text-bold item-card-title">
            {titleElement}
          </h2>
        </div>
        <div className={"active-tag text-base" + (active ? " show" : "")}>
          <p>Active</p>
        </div>
      </div>

      {showModal ? (
        <Modal>
          <ItemModal
            key={title}
            items={items}
            activeItem={activeItem}
            deleteItem={deleteItem}
          />
        </Modal>
      ) : null}
    </article>
  );
}
export default ItemCard;
