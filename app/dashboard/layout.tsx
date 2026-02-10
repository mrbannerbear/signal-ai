import DashboardLayout from "@/components/shared/DashboardLayout";

import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
    return <DashboardLayout>{children}</DashboardLayout>;
};

export default layout;
