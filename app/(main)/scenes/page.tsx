import { SectionLayout } from "@/components/layouts/section/SectionLayout";
import DataTableRender from "@/components/scenes/data-table/DataTableRender";

import React from "react";

const Scenes = () => {
  return (
    <SectionLayout title="Scenes">
      <DataTableRender />
    </SectionLayout>
  );
};

export default Scenes;
