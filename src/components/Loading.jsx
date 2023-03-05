import { useState } from "react";

export default function Loading() {
  const [ellipses, setEllipses] = useState("");
  // Ellipses animation
  // .
  // ..
  // ...
  setTimeout(() => {
    setEllipses(ellipses + ".");
    if (ellipses.length > 2) setEllipses("");
  }, 333);
  return (
    <div className="main-container">
      <h2>loading{ellipses}</h2>
    </div>
  );
}
