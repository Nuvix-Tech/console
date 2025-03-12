"use client";

import { Form, InputField } from "../others/forms";

export const RegisterForm = () => {
  return (
    <>
      <Form initialValues={{}} onSubmit={(v) => {}}>
        <InputField name="firstName" label="First Name" />
      </Form>
    </>
  );
};
