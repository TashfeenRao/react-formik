import React from "react";
import "./form.css";
import { useFormik } from "formik";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const onSubmit = (values) => {
  console.log(values);
};

const validate = (values) => {
  let errors = {};

  if (!values.name) errors.name = "Required";

  if (!values.email) {
    errors.email = "Required";
  } else if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      values.email
    )
  ) {
    errors.email = "Invalid email";
  }

  if (!values.password) errors.password = "Required";
  return errors;
};

export default function Form() {
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });

  console.log(formik.errors);
  return (
    <div className='login-page'>
      <div className='form'>
        <form className='register-form' onSubmit={formik.handleSubmit}>
          <div>
            <input
              type='text'
              placeholder='name'
              name='name'
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.errors.name ? (
              <div style={{ color: "red" }}>{formik.errors.name}</div>
            ) : null}
          </div>
          <div>
            <input
              type='password'
              placeholder='password'
              name='password'
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password ? (
              <div style={{ color: "red" }}>{formik.errors.password}</div>
            ) : null}
          </div>
          <div>
            <input
              type='text'
              placeholder='email address'
              name='email'
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email ? (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            ) : null}
          </div>
          <button type='submit' className='create'>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
