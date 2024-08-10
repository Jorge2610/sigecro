"use client";

import { useState } from "react";
import Sider from "@/components/navigation/Sider";
import Navbar from "./Navbar";

export default function () {
  const [expandedSider, setExpandedSider] = useState(false);

  return (
    <div className="relative h-[100px] md:h-[60px]">
      <Navbar
        expandedSider={expandedSider}
        setExpandedSider={setExpandedSider}
      />
      <Sider isExpanded={expandedSider} setExpandedSider={setExpandedSider} />
    </div>
  );
}
