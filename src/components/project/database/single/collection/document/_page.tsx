import React from "react";

type Props = {
  id: string;
  databaseId: string;
  collectionId: string;
  documentId: string;
};

const DocumentPage: React.FC<Props> = () => {
  return (
    <div>
      <h1>Document Page</h1>
      <p>This is the document page for a single collection in the database.</p>
    </div>
  );
};

export { DocumentPage };
