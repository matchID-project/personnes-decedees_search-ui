import React from "react";

import 'react-bulma-components/dist/react-bulma-components.min.css';

import {
  Button,
  Heading,
  Hero
} from 'react-bulma-components';

import CustomSearchBox from "./CustomSearchBox"

import MatchIDHeader from "./MatchIDHeader"

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  WithSearch,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting
} from "@elastic/react-search-ui";
import { Layout, SingleSelectFacet } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import buildRequest from "./buildRequest";
import runRequest from "./runRequest";
import applyDisjunctiveFaceting from "./applyDisjunctiveFaceting";
import buildState from "./buildState";

const config = {
  debug: true,
  hasA11yNotifications: true,
  onResultClick: () => {
    /* Not implemented */
  },
  onAutocompleteResultClick: () => {
    /* Not implemented */
  },
  onAutocomplete: async ({ searchTerm }) => {
    const requestBody = buildRequest({ searchTerm });
    const json = await runRequest(requestBody);
    const state = buildState(json);
    return {
      autocompletedResults: state.results
    };
  },
  onSearch: async state => {
    const { resultsPerPage } = state;
    const requestBody = buildRequest(state);
    // Note that this could be optimized by running all of these requests
    // at the same time. Kept simple here for clarity.
    const responseJson = await runRequest(requestBody);
    const responseJsonWithDisjunctiveFacetCounts = await applyDisjunctiveFaceting(
      responseJson,
      state,
      ["PAYS_NAISSANCE", "COMMUNE_NAISSANCE"]
    );
    return buildState(responseJsonWithDisjunctiveFacetCounts, resultsPerPage);
  }
};

export default function App() {
  return (
    <div>
      <MatchIDHeader />
      <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => (
          <div className="App">
            <ErrorBoundary>
              <Layout
                header={
                  <Hero>
                    <Heading class="title has-text-centered" style={{color: "#fff"}}> fichier des personnes décédées </Heading>
                    <Heading class="subtitle is-small has-text-centered" style={{color: "#fff"}}> 24 millions d'enregistrements INSEE </Heading>
                    <br/>
                    <CustomSearchBox />
                  </Hero>
                }
                sideContent={
                  <div>
                    {/* {wasSearched && (
                      <Sorting
                        label={"Sort by"}
                        sortOptions={[
                          {
                            name: "Relevance",
                            value: "",
                            direction: ""
                          },
                          {
                            name: "NOM",
                            value: "Nom",
                            direction: "asc"
                          }
                        ]}
                      />
                    )} */}
                    <Facet
                      field="PAYS_NAISSANCE"
                      label="Pays de naissance"
                      filterType="any"
                      isFilterable={true}
                    />
                    <Facet
                      field="COMMUNE_NAISSANCE"
                      label="Commune de naissance"
                      filterType="any"
                      isFilterable={true}                    />
                  </div>
                }
                bodyContent={
                  <Results
                    titleField="title"
                    urlField="COMMUNE_NAISSANCE"
                    shouldTrackClickThrough={true}
                  />
                }
                bodyHeader={
                  <React.Fragment>
                    {wasSearched && <PagingInfo />}
                    {wasSearched && <ResultsPerPage />}
                  </React.Fragment>
                }
                bodyFooter={<Paging />}
              />
            </ErrorBoundary>
          </div>
        )}
      </WithSearch>
    </SearchProvider>
    </div>
  );
}
