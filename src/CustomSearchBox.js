import React from "react";

import {
  Button,
  Columns,
  Container
} from 'react-bulma-components';

import { SearchBox } from "@elastic/react-search-ui";
import CustomAutocompleteView from "./CustomAutocompleteView";

export default function CustomSearchBox({setSearchTerm}) {
    clickRecherche = () => {
      ReactGA.event({
        category: 'recherche',
        action: 'button',
        label: 'test'
      });
    }
    return (
    <SearchBox
        autocompleteMinimumCharacters={3}
        autocompleteSuggestions={true}
        autocompleteView={CustomAutocompleteView}
        inputView={({ getAutocomplete, getInputProps }) => (
          <Container className="column is-6" style={{marginTop: "-15px"}}>
            <Columns className="is-vcentered">
              <Columns.Column size={9}>
                <input
                    {...getInputProps({
                    placeholder: "prénom, nom, date de naissance ou de décès, ... e.g. Georges Pompidou"
                    })}
                    className="is-size-5 is-fullwidth"
                    style={{height: "2.35em",width:"100%"}}
                />
                {getAutocomplete()}
              </Columns.Column>
              <Columns.Column size={3}>
                <Button
                  className="is-size-5 is-fullwidth"
                  color="info"
                  onClick={this.clickRecherche}
                >
                  Recherche
                </Button>
              </Columns.Column>
            </Columns>
          </Container>
      )}
      onSelectAutocomplete={(selection) => {
        setSearchTerm(selection.PRENOM.raw + " " + selection.NOM.raw + " " +
          selection.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
        )
      }}
    />
  )}
