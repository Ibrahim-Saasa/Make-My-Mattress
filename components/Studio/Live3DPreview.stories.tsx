import React from "react";
import Live3DPreview from "./Live3DPreview";

export default {
  title: "Studio/Live3DPreview",
  component: Live3DPreview,
};

export const Default = () => <Live3DPreview modelUrl="/models/mattress.glb" />;
