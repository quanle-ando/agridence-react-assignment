import { createBrowserRouter } from "react-router";
import { lazy, Suspense, useEffect } from "react";
import Loader from "../components/Loader/Loader";
import CommonInit, { navigateRef } from "../containers/CommonInit/CommonInit";
import PageNotFound from "../containers/PageNotFound/PageNotFound";
import CreateNewNoteTrigger from "../containers/PersonalNotes/triggers/CreateNewNoteTrigger";
import ViewNoteTrigger from "../containers/PersonalNotes/triggers/ViewNoteTrigger";

const Login = lazy(() => import("../containers/Login/Login"));
const Auth = lazy(() => import("../containers/Auth/Auth"));
const PersonalNotes = lazy(
  () => import("../containers/PersonalNotes/PersonalNotes")
);

const routerConfig = createBrowserRouter([
  {
    path: "/",
    Component: CommonInit,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "auth",
        element: (
          <Suspense fallback={<Loader />}>
            <Auth />
          </Suspense>
        ),
        children: [
          {
            path: "personal-notes",
            element: (
              <Suspense fallback={<Loader />}>
                <PersonalNotes />
              </Suspense>
            ),
            children: [
              {
                path: "create",
                element: <CreateNewNoteTrigger />,
              },
              {
                path: ":noteId",
                element: <ViewNoteTrigger />,
              },
            ],
          },
          {
            index: true,
            Component() {
              useEffect(() => {
                navigateRef.current("auth/personal-notes", { replace: true }); // Navigate to the default page
              }, []);
              return null;
            },
          },
          {
            path: "*",
            element: (
              <Suspense fallback={<Loader />}>
                <PageNotFound />
              </Suspense>
            ),
          },
        ],
      },
      {
        index: true,
        Component() {
          useEffect(() => {
            navigateRef.current("auth");
          }, []);
          return null;
        },
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

export default routerConfig;
