'use client'

import { useState } from "react";
import Sider from "@/components/navigation/Sider";
import Navbar from "./Navbar";

export default function () {

    const [expandedSider, setExpandedSider] = useState(false);

    return (
        <div className="relative">
            <Navbar expandedSider={expandedSider} setExpandedSider={setExpandedSider}/>
            <Sider isExpanded={expandedSider} setExpandedSider={setExpandedSider}/>
        </div>
    );
}