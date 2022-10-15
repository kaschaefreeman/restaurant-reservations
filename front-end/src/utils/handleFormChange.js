/**
   * Form change handler.  Sets form data key matching the name of the elements name to the value of the elements value
   * @param forData the current data on the form
   * @param setFormData the formData set state function
   * @param target the events target element
   */
 const handleFormChange = (formData, setFormData,target) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  export default handleFormChange