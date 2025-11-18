import { SectionLayout } from "@/components/layouts/section/SectionLayout";

import React from "react";
import ScenesClient from "../../../components/scenes/table/ScenesClient";

const Scenes = () => {
  return (
    <SectionLayout title="Scenes">
      <ScenesClient />
    </SectionLayout>
  );
};

export default Scenes;
