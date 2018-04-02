import React from "react";

export const Row = ({ children, style = {}, ...props }) => (
  <div style={{ display: "flex", flexDirection: "row", ...style }} {...props}>
    {children}
  </div>
);
export const Column = ({ children, style = {}, ...props }) => (
  <div
    style={{ display: "flex", flexDirection: "column", ...style }}
    {...props}
  >
    {children}
  </div>
);
