/**
   * Form change handler.  Sets form data key matching the name of the elements name to the value of the elements value
   * @param {object} formData the current data on the form
   * @param {React.Dispatch<React.SetStateAction>} setFormData the formData set state function
   * @param {EventTarget}target the events target element
   */
 const handleFormChange = (formData, setFormData,target) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  export default handleFormChange