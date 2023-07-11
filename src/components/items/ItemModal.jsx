import React from "react";
import { useState } from "react";
import ItemView from "./itemModal/ItemView";
import EditView from "./itemModal/EditView";
import "./ItemModal.css";

function ItemModal(props) {
  const [editMode, setEditMode] = useState(false);

  function handleEdit() {
    setEditMode(true);
  }

  function handleEditBack() {
    setEditMode(false);
  }

  if (props.clickModal) {
    if (editMode) {
      return (
        <EditView
          key={props.title}
          clickModal={props.clickModal}
          handleClickModal={props.handleClickModal}
          handleEdit={handleEdit}
          handleEditBack={handleEditBack}
          handleActive={props.handleActive}
          handleDeleteItem={props.handleDeleteItem}
          active={props.active}
          category={props.category}
          title={props.title}
          imageSrc={props.imageSrc}
          measurements={props.measurements}
        />
      );
    } else {
      return (
        <ItemView
          key={props.title}
          clickModal={props.clickModal}
          handleClickModal={props.handleClickModal}
          handleEdit={handleEdit}
          handleActive={props.handleActive}
          handleDeleteItem={props.handleDeleteItem}
          active={props.active}
          category={props.category}
          title={props.title}
          imageSrc={props.imageSrc}
          measurements={props.measurements}
        />
      );
    }
  } else {
    return null;
  }
}

export default ItemModal;
