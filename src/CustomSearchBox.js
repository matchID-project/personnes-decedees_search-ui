import React from "react";

import 'react-bulma-components/dist/react-bulma-components.min.css';

import {
  Button,
  Table,
  Container
} from 'react-bulma-components';


import { SearchBox } from "@elastic/react-search-ui";
import CustomAutocompleteView from "./CustomAutocompleteView";

export default function CustomSearchBox(setSearchTerm) {
    return (
    <SearchBox
        autocompleteMinimumCharacters={3}
        autocompleteSuggestions={true}
        autocompleteView={CustomAutocompleteView}
        inputView={({ getAutocomplete, getInputProps }) => (
        <>
            <div className="sui-search-box__wrapper" >
            <input style={{height: "3.25em"}}
                {...getInputProps({
                placeholder: "prénom, nom, date de naissance ou de décès, ... e.g. Georges Pompidou"
                })}
            />
            {getAutocomplete()}
            </div>
            <Button
              className="is-size-5"
              color="info"
            >
              Recherche
            </Button>
        </>
      )}
      onSelectAutocomplete={(selection) => {
        setSearchTerm.setSearchTerm(selection.PRENOM.raw + " " + selection.NOM.raw + " " +
          selection.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
        )
      }}
    />
  )}