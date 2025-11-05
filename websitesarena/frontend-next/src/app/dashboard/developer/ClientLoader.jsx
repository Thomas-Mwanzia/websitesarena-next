"use client";

import React, { useEffect, useState } from "react";
import OverlaySpinner from "../../../components/OverlaySpinner";

export default function ClientLoader({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <OverlaySpinner visible={loading} />
      {/* stronger blur while loading */}
      <div className={loading ? "filter blur-3xl" : ""}>{children}</div>
    </>
  );
}
