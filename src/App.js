import React from "react";

import MatchIDHeader from "./MatchIDHeader"

import {
  ErrorBoundary,
  // Facet,
  SearchProvider,
  WithSearch,
  // Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  // Sorting
} from "@elastic/react-search-ui";
import {
  Layout,
  // SingleSelectFacet
} from "@elastic/react-search-ui-views";
// import "@elastic/react-search-ui-views/lib/styles/styles.css";
import "./App.css";

import buildRequest from "./buildRequest";
import runRequest from "./runRequest";
// import applyDisjunctiveFaceting from "./applyDisjunctiveFaceting";
import buildState from "./buildState";
import SearchHeader from "./SearchHeader";
import CustomResults from "./CustomResults";

const config = {
  // debug: true,
  // hasA11yNotifications: true,
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
    // const responseJsonWithDisjunctiveFacetCounts = await applyDisjunctiveFaceting(
    //   responseJson,
    //   state,
    //   ["PAYS_NAISSANCE", "COMMUNE_NAISSANCE"]
    // );
    return buildState(responseJson, resultsPerPage);
    // return buildState(responseJsonWithDisjunctiveFacetCounts, resultsPerPage);
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalState: false,
      burgerState: false,
      errorMessage: false
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.toggleBurger = this.toggleBurger.bind(this);
  }

  toggleModal() {
    this.setState((prev, props) => {
      const newState = ! prev.modalState;

      return { modalState: newState };
    })
  }

  toggleBurger() {
    const navbarBurger = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)[0];

    // Get the target from the "data-target" attribute
    const target = navbarBurger.dataset.target;
    const $target = document.getElementById(target);

    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    navbarBurger.classList.toggle('is-active');
    $target.classList.toggle('is-active');

    this.setState((prev, props) => {
      const newState = ! prev.burgerState;
      return { burgerState: newState };
    })
  }

  render() {
    return (
      <div>
        <MatchIDHeader
          toggleModal={this.toggleModal}
          modalState={this.state.modalState}
          toggleBurger={this.toggleBurger}
          burgerState={this.state.burgerState}
        />
        <SearchProvider config={config}>
        <WithSearch mapContextToProps={({ setSearchTerm, wasSearched, results }) => ({ setSearchTerm, wasSearched, results })}>
          {({ setSearchTerm, wasSearched, results }) => (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={SearchHeader({setSearchTerm})}

                  bodyContent={CustomResults(results)}
                  sideContent={null}
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
}

export default App;