/* eslint-disable testing-library/no-node-access -- allowed in tests */
/* eslint-disable testing-library/no-debugging-utils -- allowed in tests */
/* eslint-disable jest/valid-describe-callback -- use vitest and not jest */
import { render, configure, screen, waitFor } from "@testing-library/react";
import { debug } from "vitest-preview";
import userEvent from "@testing-library/user-event";

configure({ asyncUtilTimeout: 5_000 });

describe("IntegrationTest", { timeout: 60_000 }, () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  it("should handle happy path", async () => {
    window.location.href = "http://localhost:3000/auth/personal-notes/create";
    render(<div id="root" />);

    await import("../index");

    await userEvent.click(await screen.findByLabelText("Username"));
    await userEvent.keyboard("admin");
    await userEvent.click(await screen.findByLabelText("Password"));
    await userEvent.keyboard("def");
    await userEvent.click(await screen.findByText("Sign in"));

    await screen.findByText("Invalid username/password");
    expect(window.location.href).toMatchInlineSnapshot(
      `"http://localhost:3000/login"`
    );

    await userEvent.tripleClick(
      document.querySelector('input[type="password"]')!
    );
    await userEvent.keyboard("{backspace}password{enter}");

    await screen.findByText("Personal Notes", { selector: "h1" });
    expect(await screen.findByText("Displaying 3 note(s)")).toBeTruthy();
    expect(localStorage.getItem("user")).toMatchInlineSnapshot(
      `"{"fullname":"John Smith","username":"admin","accessToken":"THE_TOKEN"}"`
    );

    await userEvent.click(await screen.findByText("Create New Note"));
    await userEvent.click(await screen.findByLabelText("Note title"));
    expect(window.location.href).toMatchInlineSnapshot(
      `"http://localhost:3000/auth/personal-notes/create"`
    );
    await userEvent.keyboard("abc");
    await userEvent.click(await screen.findByLabelText("Note description"));
    await userEvent.keyboard("def");
    await userEvent.click(await screen.findByText("Create Note"));
    await screen.findByText('Successfully created note "abc"');
    expect(window.location.href).toMatchInlineSnapshot(
      `"http://localhost:3000/auth/personal-notes"`
    );
    expect(
      await screen.findByText("Title 3", { selector: "[data-is-note-title]" })
    ).toBeTruthy();
    await userEvent.click(
      await screen.findByText("View", {
        selector: '[data-note-title="Title 3"] span',
      })
    );

    expect(await screen.findByText("Personal Note Detail")).toBeTruthy();
    expect(document.querySelector("textarea")?.value).toMatchInlineSnapshot(
      `"Description 3"`
    );
    expect(window.location.href).toMatchInlineSnapshot(
      `"http://localhost:3000/auth/personal-notes/3Yfxh8o9-bvrunrwdhekk"`
    );
    await userEvent.click(await screen.findByText("Close"));

    await waitFor(
      () => {
        return expect(screen.queryByText("Personal Note Detail")).toBeFalsy();
      },
      {
        onTimeout(error) {
          debug();
          return error;
        },
      }
    );

    expect(window.location.href).toMatchInlineSnapshot(
      `"http://localhost:3000/auth/personal-notes"`
    );

    await userEvent.click(
      await screen.findByText("Delete", {
        selector: '[data-note-title="abc"] span',
      })
    );

    await userEvent.click(await screen.findByText("OK"));

    await waitFor(() => {
      expect(screen.queryByText("abc")).toBeFalsy();
    });

    await userEvent.click(await screen.findByText("Logout"));
    await userEvent.click(await screen.findByText("OK, log me out!"));
    await screen.findByLabelText("Username");
    expect(localStorage.getItem("user")).toMatchInlineSnapshot(`null`);
    expect(window.location.href).toMatchInlineSnapshot(
      `"http://localhost:3000/login"`
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        fullname: "John Smith",
        username: "admin",
        accessToken: "THE_TOKEN",
      })
    );

    debug();
  });

  it("should navigate to personal notes from index page if user is set in local storage", async () => {
    window.location.href = "http://localhost:3000";
    render(<div id="root" />);
    localStorage.setItem(
      "user",
      JSON.stringify({
        fullname: "John Smith",
        username: "admin",
        accessToken: "THE_TOKEN",
      })
    );
    await import("../index");

    expect(
      await screen.findByText("Personal Notes", { selector: "h1" })
    ).toBeTruthy();

    expect(window.location.href).toMatchInlineSnapshot(
      `"http://localhost:3000/auth/personal-notes"`
    );

    debug();
  });

  it("should navigate to personal notes from login page if user is set in local storage", async () => {
    window.location.href = "http://localhost:3000/login";
    render(<div id="root" />);
    localStorage.setItem(
      "user",
      JSON.stringify({
        fullname: "John Smith",
        username: "admin",
        accessToken: "THE_TOKEN",
      })
    );
    await import("../index");

    expect(
      await screen.findByText("Personal Notes", { selector: "h1" })
    ).toBeTruthy();

    expect(window.location.href).toMatchInlineSnapshot(
      `"http://localhost:3000/auth/personal-notes"`
    );

    debug();
  });
});
