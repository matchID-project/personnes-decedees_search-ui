import React from "react";

import 'react-bulma-components/dist/react-bulma-components.min.css';

import {
    Container,
    Content,
    Heading,
    Modal,
    Navbar
} from 'react-bulma-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faLightbulb
} from '@fortawesome/free-regular-svg-icons';

import {
    faDatabase,
    faFlask,
    faTable
} from '@fortawesome/free-solid-svg-icons';

import {
    faUsb
} from '@fortawesome/free-brands-svg-icons';

export default function MatchIDHeader({toggleModal, modalState}) {
    return (
        <>
            <Navbar
                fixed={'top'}
                color={'white'}
                transparent={true}
            >
                <Container>
                    <Navbar.Brand>
                        <Navbar.Item renderAs="a" href="#" class="logo">
                            <img src={process.env.PUBLIC_URL + "/matchID-logo.svg"} alt="matchID Logo" />
                        </Navbar.Item>
                        <Navbar.Burger>
                        </Navbar.Burger>
                    </Navbar.Brand>

                    <Navbar.Menu>
                        <Navbar.Container>
                            <Navbar.Item onClick={toggleModal}>
                                &nbsp; à propos de ce service
                            </Navbar.Item>
                            <Navbar.Item dropdown hoverable>
                                <Navbar.Link>
                                    <FontAwesomeIcon icon={faLightbulb} className="icon is-small"/>
                                    &nbsp; références
                                </Navbar.Link>
                                <Navbar.Dropdown>
                                    <Navbar.Item href="https://www.matchid.io/">
                                        <FontAwesomeIcon icon={faFlask} className="icon is-small"/>
                                        &nbsp; &nbsp; matchID
                                    </Navbar.Item>
                                    <Navbar.Item href="https://www.insee.fr/fr/information/4190491">
                                        <FontAwesomeIcon icon={faDatabase} className="icon is-small"/>
                                        &nbsp; &nbsp; source INSEE
                                    </Navbar.Item>
                                    <Navbar.Item href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/">
                                        <FontAwesomeIcon icon={faTable} className="icon is-small"/>
                                        &nbsp; &nbsp; référence data.gouv
                                    </Navbar.Item>
                                </Navbar.Dropdown>
                            </Navbar.Item>
                        </Navbar.Container>
                        </Navbar.Menu>
                </Container>
            </Navbar>
            <Modal show={modalState} onClose={toggleModal}>
                <Modal.Card>
                    <Modal.Card.Head>
                        <Modal.Card.Title>
                            À propos de ce service
                        </Modal.Card.Title>
                    </Modal.Card.Head>
                    <Modal.Card.Body>
                        <Content>
                            <p><strong>Fichier des personnes décédées</strong></p>
                            <p>
                                Ce service vise à permettre la recherche directe de personnes décédées. Il exploite la base opendata
                                délivrée par l'<a href="https://www.insee.fr/fr/information/4190491">INSEE</a> et
                                diffusée par <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/">data.gouv.fr</a>.
                            </p>
                            <p>
                                Ce service utilise l'intégralité des données, soit environ 25 millions d'enregistrements.
                                Il concerne les déclarations de décès à l'INSEE depuis 1970 jusqu'au mois précédent. Il concerne
                                les personnes ayant un numéro INSEE et ayant fait l'objet d'une déclaration de décès, en mairie ou
                                en consulat. Le délai de déclaration et de transmission peut être variable (personnes disparues, ou
                                recherches historiques e.g. identifications tardives après guerre).
                            </p>
                            <p><strong>Traitement des données avec matchID</strong></p>
                            <p>
                                Les données sont traitées avec l'outil opensource <a href="https://matchid.io">matchID</a> (Python/Pandas). Les traitements, disponibles
                                disponibles <a href="https://github.com/matchid-project/personnes-decedees_search">ici</a>,
                                consistent en une mise en forme (capitalisation, réconciliation avec les noms de pays et commune
                                selon les référentiels INSEE) puis une indexation. Les données sont actualisées chaque mois, après chaque diffusion sur le
                                site <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/">data.gouv.fr</a>.
                            </p>
                            <p>La recherche et l'indexation reposent sur <a href="https://elastic.co">Elasticsearch</a>
                            qui repose sur le moteur de recherche Lucène, qui apporte le bénéfice
                            des <a href="https://wikipedia.org/wiki/Recherche_approximative">recherches floues</a> à
                            large échelle. La visualisation est basée
                            sur <a href="https://swiftype.com/search-ui">Search-UI</a>.
                            Le code source est accessible sur <a href="https://github.com/matchid-project/personnes-decedees_search-ui">Github</a>.
                            </p>
                            <p><strong>Qui sommes nous ?</strong></p>
                            <p>
                                Le projet matchID a été initié au ministère de l'Intérieur dans le contexte des
                                challenges d'<a href="https://entrepreneur-interet-general.etalab.gouv.fr/defis/2017/mi-matchid.html">Entrepreneur d'intérêt général</a>.
                                La réconciliation des personnes décédées avec le permis de conduire a été le premier cas d'usage réalisé avec
                                matchID. Le projet a été libéré et mis en opensource. Nous avons créé de service
                                en complément qui semblait d'utilité notamment pour la lutte contre la fraude.
                                Pour en savoir plus sur le projet matchID, suivez ce <a href="https://matchid.io">lien</a>.
                            </p>
                            <p><strong>Conditions d'usage et garanties</strong></p>
                            <p>
                                Ce service est financé sur fonds personnels et est donc offert sans garantie. L'usage est limité à une requête
                                par seconde afin de préserver l'état du serveur. Selon
                                l'affluence et les retours, nous envisagerons de le consolider. Contactez nous
                                sur <a href="mailto:matchid@matchid.io">matchid@matchid.io</a>
                            </p>
                        </Content>
                    </Modal.Card.Body>
                    <Modal.Card.Foot>
                    </Modal.Card.Foot>
                </Modal.Card>
            </Modal>
        </>
    );
};
