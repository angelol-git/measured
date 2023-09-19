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

  const convertedCategory = () => {
    if (props.category === "Tops" || props.category === "Outerwear") {
      return 0;
    } else {
      return 1;
    }
  };

  if (props.clickModal) {
    if (editMode) {
      return (
        <EditView
          key={props.title}
          values={props.items}
          handleFunctions={props.handleFunctions}
          handleEditBack={handleEditBack}
          convertedCategory={convertedCategory}
          settingsData={props.settingsData}
        />
      );
    } else {
      return (
        <ItemView
          key={props.title}
          values={props.items}
          handleFunctions={props.handleFunctions}
          handleClickModal={props.handleClickModal}
          handleEdit={handleEdit}
        />
      );
    }
  } else {
    return null;
  }
}

export default ItemModal;
