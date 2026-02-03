import React from "react";
import { render, screen } from "@testing-library/react";
import SplashScreen from "./SplashScreen";

test("renders splash screen", () => {
  render(<SplashScreen />);
  expect(screen.getByText(/Make My Mattress/i)).toBeInTheDocument();
});
