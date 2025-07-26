import React from "react";

async function page() {
  const res = await fetch("http://localhost:3000/api/perplexity", {
    cache: "no-cache",
  });
  const body = await res.json();
  return <div>{body.data}</div>;
}

export default page;
