import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { getAuth} from '../utils/api';
import handleFormChange from "../utils/handleFormChange";
import ErrorAlert from '../layout/ErrorAlert';
import InputMask from 'comigo-tech-react-input-mask/lib/react-input-mask.development';


const Login = (setUser) => {
  const [loginError, setLoginError] = useState(null);

  const initialFormData = {
    phone: "",
    password: "",
  }

  const [formData, setFormData] = useState({ ...initialFormData });

  //Use history to push dashboard to date of the reservation that is created/edited or go back a page on cancel of form input
  const history = useHistory();

  const handleUserFormChange = ({ target }) => {
    handleFormChange(formData, setFormData, target)
  };

  /**
   * Form Submit handler.
   * Submits form data to API to create or update the reservation instance in the db.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const abortController = new AbortController();
    getAuth(formData, abortController.signal)
      .then(setUser)
      .then(()=>history.go("/users"))
      .catch(setLoginError)
    return () => abortController.abort();
  };

  return (
    <main>
      <h1 className="mb-3 mt-3">Login</h1>
      <form className="shadow-lg p-4 rounded" onSubmit={handleSubmit}>
        <ErrorAlert error={loginError} />
        <div className="form-group row">
          <label htmlFor="phone" className="col-4">
            Mobile Number
          </label>
          <InputMask
            mask="999-999-9999"
            id="phone"
            name="phone"
            type="tel"
            className="form-control col"
            placeholder="012-345-6789"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            value={formData.phone}
            onChange={handleUserFormChange}
            required
          />
        </div>
        <div className="form-group row">
          <label htmlFor="password" className="col-4">
            Password
          </label>
          <input
            id="password"
            name="password"
            type='password'
            className="form-control col"
            onChange={handleUserFormChange}
            value={formData.password}
          >
          </input>
        </div>
        <div className="form-group row justify-content-end">
          <button type="submit" className="btn btn-primary mx-3 col-2 ">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-warning mx-3 col-2 "
            onClick={() => history.push("/users/new")}
          >
            Register
          </button>
        </div>
      </form>
    </main>
  );
}

export default Login;
