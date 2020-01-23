import React from "react";

import {
  Heading,
  Hero
} from 'react-bulma-components';

import CustomSearchBox from "./CustomSearchBox";

export default function SearchHeader({setSearchTerm}) {
    return (
      <Hero>
        <Heading style={{color: "#fff"}}>
          fichier des décès
        </Heading>
        <Heading subtitle style={{color: "#fff"}}>
          <span className="is-hidden-mobile">
            recherche gratuite parmi
          </span>
          <span> <b>25 millions</b> de décès depuis 1970
            <br/>
          </span>
          <a
            href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/"
          > source INSEE </a>
        </Heading>
        <CustomSearchBox setSearchTerm={setSearchTerm}/>
      </Hero>
    )
};
