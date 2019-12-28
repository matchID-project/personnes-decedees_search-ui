import React from "react";

import 'react-bulma-components/dist/react-bulma-components.min.css';

import {
    Container,
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

export default function MatchIDHeader() {
    return (
        <div>
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
                            <Navbar.Item href="about">
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
        </div>
    );
}