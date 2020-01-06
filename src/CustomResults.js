import React from "react";

import {
  Columns,
  Container,
} from 'react-bulma-components';

import CustomResult from "./CustomResult";

export default function CustomResults(results) {
    return(
        <Container>
          <Columns>
            { !!results &&
                results.map((result, i) => {
                    return (
                        <CustomResult key={i} result={result} />
                    )
                    }
                )
            }
          </Columns>
        </Container>
    )
}
