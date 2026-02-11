import "./FormInputs.css";

export function TextInput({ id, label, name, type, value, required }) {
  return (
    <div className="form-input-container">
      <label htmlFor={id} className="text-bold text-large">
        {label}
      </label>
      {name === "title" ? (
        <input
          id={id}
          type={type}
          name={name}
          className={`input-text`}
          defaultValue={value}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          className={`input-text`}
          required={required}
        />
      )}
    </div>
  );
}

export function SelectInput({ id, label, name, options, value, onChange }) {
  return (
    <div className="form-input-container">
      <label htmlFor={id} className="text-bold text-large">
        {label}
      </label>
      {onChange ? (
        <select
          name={name}
          id={id}
          className="input-category"
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option} value={option} selected={option === value}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <select name={name} id={id} className="input-category">
          {options.map((option) => (
            <option key={option} value={option} selected={option === value}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export function ImageInput({ label, value, onChange, imageStatus }) {
  return (
    <div className="form-input-container">
      <label htmlFor="image" className="text-bold text-large">
        {label}
      </label>
      <input
        type="text"
        id="image"
        name="image"
        placeholder="Image URL"
        autoComplete="off"
        className={`input-text ${
          imageStatus === "error" ? "error-border" : ""
        }`}
        value={value}
        onChange={onChange}
      />
      {imageStatus === "error" ? (
        <p className="error-text" role="alert">
          Image cannot be found
        </p>
      ) : null}
    </div>
  );
}

export function CheckboxInput({ label, id, name, checked }) {
  return (
    <div className="form-input">
      <label htmlFor={id} className="text-large">
        {label}:
        {checked ? (
          <input
            type="checkbox"
            id={id}
            name={name}
            value={name}
            checked={checked}
          />
        ) : (
          <input type="checkbox" id={id} name={name} value={name} />
        )}
      </label>
    </div>
  );
}

export function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
