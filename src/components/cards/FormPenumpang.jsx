import React, { useState } from "react";

function FormPenumpang({ title, fields, formData, handleInputChange }) {
  const [errors, setErrors] = useState({});

  const formatDateValue = (value) => (value ? value.slice(0, 10) : "");

  const validateInput = (name, value) => {
    let error = "";

    if (!value) {
      error = "Data kosong, silahkan isi data diri anda!";
      value = null;
    } else if (value === "") {
      error = "Data kosong, silahkan isi data diri anda!";
      value = null;
    } else if (value === null) {
      error = "Data kosong, silahkan isi data diri anda!";
      value = null;
    }
    // Add more validation rules as needed

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e, name) => {
    const { value } = e.target;
    validateInput(name, value);
    handleInputChange(e, name);
  };

  return (
    <div className="bg-white rounded-xl p-[32px] shadow-md">
      <p className="text-xl mb-[32px]">
        <strong>{title}</strong>
      </p>
      {fields.map((field, index) => (
        <div key={index} className="text-gray mb-[12px]">
          <div className="flex flex-col gap-2">
            <p>{field.label}</p>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => handleChange(e, field.name)}
                className={`border rounded-full w-full py-2 px-4 me-3 text-gray ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
              >
                {field.options.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "radio" ? (
              <div className="flex gap-8 mb-4">
                {field.options.map((option, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="radio"
                      name={field.name}
                      value={option.value}
                      checked={formData[field.name] === option.value}
                      onChange={(e) => handleChange(e, field.name)}
                      className={`mr-2 ${
                        errors[field.name] ? "border-red-500" : ""
                      }`}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={
                  field.type === "date"
                    ? formatDateValue(formData[field.name])
                    : formData[field.name]
                }
                onChange={(e) => handleChange(e, field.name)}
                className={`border rounded-full w-full py-2 px-4 text-gray ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FormPenumpang;
