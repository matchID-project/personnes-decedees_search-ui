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
          <a
            href="https://www.insee.fr/fr/information/4190491"
          > source INSEE </a>
        </Heading>
        <CustomSearchBox setSearchTerm={setSearchTerm}/>
      </Hero>
    )
};
