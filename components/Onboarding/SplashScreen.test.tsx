import React from "react";
import { render } from "@testing-library/react";
import SplashScreen from "./SplashScreen";

test("renders splash screen", () => {
  const { getByText } = render(<SplashScreen />);
  expect(getByText(/Make My Mattress/i)).toBeTruthy();
});
