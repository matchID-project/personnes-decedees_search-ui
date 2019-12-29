import React from "react";

import 'react-bulma-components/dist/react-bulma-components.min.css';

import {
  Card,
  Columns,
  Content,
  Container,
  Heading,
  Image,
  Media,
  Table
} from 'react-bulma-components';


import { Results } from "@elastic/react-search-ui";

export default function CustomResults(results) {
    console.log("results", results)
    return(
        <Container>
            { !!results &&
                results.map((result, i) => (
                    <Card>
                        <Card.Header>
                            <Media>
                                <Media.Item renderAs="figure" position="left">
                                    <Image
                                        size={64} alt="64x64"
                                        src={ result.SEXE.raw === 'M' ? '/male.svg' : '/female.svg' }
                                    />
                                </Media.Item>
                                <Media.Item>
                                    <Heading size={4}>{result.PRENOM.raw} {result.NOM.raw}</Heading>
                                    <Heading subtitle size={6}>
                                       {result.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")}
                                       &nbsp; - &nbsp;
                                       {result.DATE_DECES.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")}
                                    </Heading>
                                </Media.Item>
                            </Media>
                        </Card.Header>
                        <Card.Content>
                            <Content>
                                <Columns>
                                    <Columns.Column size={6}>
                                        <span className="is-grey is-uppercase is-small">Naissance</span>
                                        <Table className="is-narrow">
                                            <tbody>
                                                <tr>
                                                    <td>Nom</td>
                                                    <td>{result.NOM.raw}</td>
                                                </tr>
                                                <tr>
                                                    <td>Prénoms</td>
                                                    <td>{result.PRENOMS.raw}</td>
                                                </tr>
                                                <tr>
                                                    <td>Date</td>
                                                    <td>{result.DATE_NAISSANCE.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")}</td>
                                                </tr>
                                                <tr>
                                                    <td>Lieu</td>
                                                    <td>
                                                        {result.COMMUNE_NAISSANCE
                                                        ? result.PAYS_NAISSANCE
                                                            ? result.COMMUNE_NAISSANCE.raw + ", " + result.PAYS_NAISSANCE.raw
                                                            : result.COMMUNE_NAISSANCE
                                                        : result.PAYS_NAISSANCE
                                                            ? result.PAYS_NAISSANCE.raw
                                                            : "ND"
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Columns.Column>
                                    <Columns.Column size={6}>
                                        <span className="is-grey is-uppercase is-small">Décès</span>
                                        <Table className="is-narrow">
                                            <tbody>
                                                <tr>
                                                    <td>Date</td>
                                                    <td>{result.DATE_DECES.raw.replace(/(\d{4})(\d{2})(\d{2})/,"$3/$2/$1")}</td>
                                                </tr>
                                                <tr>
                                                    <td>Lieu</td>
                                                    <td>
                                                        {result.COMMUNE_DECES
                                                        ? result.PAYS_DECES
                                                            ? result.COMMUNE_DECES.raw + ", " + result.PAYS_DECES.raw
                                                            : result.COMMUNE_DECES
                                                        : result.PAYS_DECES
                                                            ? result.PAYS_DECES.raw
                                                            : "ND"
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Columns.Column>
                                </Columns>
                            </Content>
                        </Card.Content>
                    </Card>
                ))
            }
        </Container>
    )
}