import React from "react";
import "./form.css";

export default function Form() {
  return (
    <div class='login-page'>
      <div class='form'>
        <form class='register-form'>
          <input type='text' placeholder='name' />
          <input type='password' placeholder='password' />
          <input type='text' placeholder='email address' />
          <button class='create'>Sign up</button>
        </form>
      </div>
    </div>
  );
}
