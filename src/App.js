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
      <WithSearch mapContextToProps={({ setSearchTerm, wasSearched }) => ({ setSearchTerm, wasSearched })}>
        {({ setSearchTerm, wasSearched }) => (
          <div className="App">
            <ErrorBoundary>
              <Layout
                header={
                  <Hero>
                    <Heading className="title has-text-centered" style={{color: "#fff"}}>
                      fichier des décès
                    </Heading>
                    <Heading className="subtitle is-small has-text-centered" style={{color: "#fff"}}>
                      <a
                        href="https://www.insee.fr/fr/information/4190491"
                        className="is-white"
                      > source INSEE </a>
                    </Heading>
                    <br/>
                    <CustomSearchBox setSearchTerm={setSearchTerm}/>
                  </Hero>
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
