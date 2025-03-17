"use client";
import React from "react";
import { UpdatePermissions } from "./components";
import { DeleteDocument } from "./components/_delete";

const DocumentDetails: React.FC = () => {
  return (
    <>
      <UpdatePermissions />
      <DeleteDocument />
    </>
  );
};

export { DocumentDetails };
