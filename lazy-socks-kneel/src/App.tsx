import { Authenticated, GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { Home, ForgotPassword, Login, Register } from "./pages"
import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import {
  GraphQLClient,
} from "@refinedev/nestjs-query";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { createClient } from "graphql-ws";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider, dataProvider, liveProvider } from "./providers";
import Layout from "./components/layout";
import { resources } from "./config/resources";

//URLs for GraphQL API and Websocket connection.  points to sever where GraphQL API is hosted, used for fetching and manipulating data
const API_URL = "https://api.nestjs-query.refine.dev/graphql";
const WS_URL = "wss://api.nestjs-query.refine.dev/graphql";

// const gqlClient = new GraphQLClient(API_URL);
// const wsClient = createClient({ url: WS_URL });

function App() {
  return (
    <BrowserRouter>
      {/* Displaying Github banner for displaying branding or lining to a repo */}
      {/* <GitHubBanner /> */}
      {/* for usage of Antd components */}
      <AntdApp>
        {/* to provide development tools and feature */}
        <DevtoolsProvider>
          {/* central hub for managing state, data fetching, application configuration */}
          <Refine
            dataProvider={dataProvider}
            liveProvider={liveProvider}
            notificationProvider={useNotificationProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
            resources={resources}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "1Zh44i-DbGFsb-qRCyyH",
              liveMode: "auto",
            }}
          >
            {/* For definign app routes */}
            <Routes>


              <Route index path="/home" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/login" element={<Login />} />
              <Route
                // If not authenticated, fall back to CatchAllNavigate else show layout shouwing outlet
                element={<Authenticated
                  key="authenticated-layout"
                 // fallback={<CatchAllNavigate to="/login" />}
                > <Layout>
                    <Outlet />
                  </Layout></Authenticated>}
              >
                <Route index element={<Home />} />
              </Route>
            </Routes>
            {/* to provide keyboard driver interface for navigation and other actions  */}
            {/* <RefineKbar /> */}
            {/* features related to unsaved changes notification and document title management */}
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          {/* development tools panel for debugging and monitoring */}
          <DevtoolsPanel />
        </DevtoolsProvider>
      </AntdApp>
    </BrowserRouter>
  );
}

export default App;
