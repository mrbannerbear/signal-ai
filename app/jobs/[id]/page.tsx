import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  return <div>{`Job Details Page - Job ID: ${id}`}</div>;
};

export default page;
