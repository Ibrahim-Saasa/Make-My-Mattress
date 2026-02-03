import React, { createContext, useContext, useState, ReactNode } from "react";

interface Layer {
  id: string;
  name: string;
  priceDelta?: number;
}

interface ConfiguratorState {
  layers: Layer[];
  setLayers: (layers: Layer[]) => void;
}

const defaultState: ConfiguratorState = {
  layers: [],
  setLayers: () => {},
};

const ConfiguratorContext = createContext<ConfiguratorState>(defaultState);

export const ConfiguratorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  return (
    <ConfiguratorContext.Provider value={{ layers, setLayers }}>
      {children}
    </ConfiguratorContext.Provider>
  );
};

export const useConfigurator = () => useContext(ConfiguratorContext);
