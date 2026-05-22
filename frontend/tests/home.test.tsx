import { render, screen } from "@testing-library/react";
import HomePage from "../src/app/page";

describe("HomePage", () => {
  it("renders hero title", () => {
    render(<HomePage />);
    expect(screen.getByText(/IncuXai/i)).toBeInTheDocument();
  });
});
