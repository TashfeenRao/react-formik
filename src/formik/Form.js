import React from "react";
import "./form.css";
import { useFormik } from "formik";

export default function Form() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className='login-page'>
      <div className='form'>
        <form className='register-form' onSubmit={formik.handleSubmit}>
          <input
            type='text'
            placeholder='name'
            name='name'
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <input
            type='password'
            placeholder='password'
            name='password'
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <input
            type='text'
            placeholder='email address'
            name='email'
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <button type='submit' className='create'>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
