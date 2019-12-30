import React from "react";

import 'react-bulma-components/dist/react-bulma-components.min.css';

import {
  Heading,
  Hero
} from 'react-bulma-components';

import CustomSearchBox from "./CustomSearchBox";

export default function SearchHeader(setSearchTerm) {
    return (
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
        <CustomSearchBox setSearchTerm={setSearchTerm}/>
      </Hero>
    )
};
