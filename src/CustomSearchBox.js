import React from "react";

import 'react-bulma-components/dist/react-bulma-components.min.css';

import {
  Button,
  Container,
  Heading
} from 'react-bulma-components';


import { SearchBox } from "@elastic/react-search-ui";

export default function CustomSearchBox() {
    return (
    <SearchBox
        autocompleteMinimumCharacters={3}
        autocompleteSuggestions={true}
        autocompleteView={({ autocompletedResults, getItemProps }) => (
          <div className="sui-search-box__autocomplete-container">
            <Container style={{"margin-left": "15px", "margin-top": "-20px"}}>
              <span className="is-uppercase is-size-7 is-small has-text-grey">
                Résultats
              </span>
              <table>
              <tr className="is-uppercase is-size-7 is-small has-text-grey">
              <td>Prénom Nom</td>
              <td style={{padding: "0 15px"}}>Naissance</td>
              <td style={{padding: "0 15px"}}>Décès</td>
              </tr>
              {autocompletedResults.map((result, i) => (
                  <tr
                    {...getItemProps({
                      key: result.id.raw,
                      item: result
                    })}
                  >
                    <td> {result.PRENOM.raw} {result.NOM.raw} </td>
                    <td style={{padding: "0 15px"}}>
                      {result.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
                      } {
                      result.COMMUNE_NAISSANCE
                      ? "- " + result.COMMUNE_NAISSANCE.raw
                      : result.PAYS_NAISSANCE
                        ? "- " + result.PAYS_NAISSANCE.raw
                        : ""
                      }
                    </td>
                    <td style={{padding: "0 15px"}}>
                      {result.DATE_DECES.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")
                      } {
                        result.COMMUNE_DECES
                        ? "- " + result.COMMUNE_DECES.raw
                        : result.PAYS_DECES
                          ? "- " + result.PAYS_DECES.raw
                          : ""
                        }
                      </td>
                  </tr>
                ))}
              </table>
            </Container>
          </div>
        )}
        inputView={({ getAutocomplete, getInputProps, getButtonProps }) => (
        <>
            <div className="sui-search-box__wrapper" >
            <input style={{height: "3.25em"}}
                {...getInputProps({
                placeholder: "prénom, nom, date de naissance ou de décès, ... e.g. Georges Pompidou"
                })}
            />
            {getAutocomplete()}
            </div>
            <Button className="is-size-5"
            color="info"
            >
            Recherche
            </Button>
        </>
      )}
    />
  )}