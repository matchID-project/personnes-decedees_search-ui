import React from "react";

// import 'react-bulma-components/dist/react-bulma-components.min.css';

import {
    Container,
    Content,
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

export default function MatchIDHeader({toggleModal, modalState, toggleBurger}) {
    return (
        <>
            <Navbar
                fixed={'top'}
                color={'white'}
                transparent={true}
            >
                <Container>
                    <Navbar.Brand>
                        <Navbar.Item className="logo" onClick={toggleModal}>
                            <img src={process.env.PUBLIC_URL + "/matchID-logo.svg"} alt="matchID Logo" />
                        </Navbar.Item>
                        <Navbar.Burger
                            onClick={toggleBurger}
                            data-target="navMenu" aria-label="menu" aria-expanded="false"
                        >
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </Navbar.Burger>
                    </Navbar.Brand>

                    <Navbar.Menu
                        id="navMenu"
                    >
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
                    <Modal.Card.Head onClose={toggleModal}>
                        <Modal.Card.Title>
                            À propos de ce service
                        </Modal.Card.Title>
                    </Modal.Card.Head>
                    <Modal.Card.Body>
                        <Content>
                        <p><strong>A qui s'adresse ce service</strong></p>
                            <p>
                                Généalogistes, professionnels ou particuliers, services publics de lutte contre la fraude.
                            </p>
                        <p><strong>Evolutions à venir</strong></p>
                            <p>
                                Deux évolutions sont prévues dans les prochaines semaines:
                                <br/>
                                - une recherche avancée (par lieu/année de naissance/décès)
                                <br/>
                                - la possibilité de télécharger les fichiers source restreints aux années et départements
                                pour favoriser les recherches approfondies
                            </p>
                        <p><strong>Fichier des décès de l'INSEE</strong></p>
                            <p>
                                Ce service vise à permettre la recherche directe de personnes décédées. Il repose sur la base opendata
                                délivrée par l'<a href="https://www.insee.fr/fr/information/4190491">INSEE</a> et
                                diffusée par <a href="https://www.data.gouv.fr/fr/datasets/fichier-des-personnes-decedees/">data.gouv.fr</a>.
                            </p>
                            <p>
                                La recherche utilise l'intégralité des données INSEE, soit environ 25 millions d'enregistrements.
                                Elle concerne les déclarations de décès retransmises vers l'INSEE depuis 1970 jusqu'au mois précédent.
                                Seules les personnes ayant eu un numéro INSEE et ayant fait l'objet d'une déclaration de décès, en mairie ou
                                en consulat sont enregistrées. Le délai de déclaration et de transmission peut être variable (personnes disparues, ou
                                recherches historiques e.g. identifications tardives après guerre).
                            </p>
                            <p>
                                Les données INSEE sont sous <a href="https://www.etalab.gouv.fr/licence-ouverte-open-licence">Licence Ouverte / Open Licence version 2.0</a>.
                                L’INSEE et donc ce service ne peuvent garantir que les fichiers des personnes décédées sont exempts d’omissions ou d’erreurs.
                                Ce service et l'INSEE ne sauraient encourir aucune responsabilité quant à l’utilisation faite des informations contenues dans ces fichiers.
                                En particulier, les informations contenues dans ces fichiers ne peuvent en aucun cas être utilisées dans un but de certification
                                du statut vital des personnes.
                            </p>
                        <p><strong>Conditions d'usage et garanties (version bêta)</strong></p>
                            <p>
                                Ce service est gratuit, et financé sur fonds personnels. Il est offert sans garantie
                                particulière. Etant donné l'affluence, nous avons choisi de consolider et maintenir ce service.
                                Les retours sont les bienvenus, nous vous répondrons sur <a href="mailto:matchid.project@gmail.com">matchid.project@gmail.com</a> pour
                                toute question, signalement ou tout avis sur le service.
                            </p>
                            <p>
                                Le code source de ce site est disponible sur <a href="https://github.com/matchid-project/personnes-decedees_search-ui">GitHub</a>.
                                Il est diffusé sous la licence libre <a href="https://spdx.org/licenses/LGPL-3.0.html#licenseText" >LGPL 3.0</a>.
                            </p>
                        <p><strong>Utilisation des cookies</strong></p>
                            <p>
                                Ce site utilise les service Cloudflare et Google Analytics qui déposent chacun un cookie pour connaitre la fréquentation et l'audience
                                du site. Les informations sont anonymes (IP anonymisées). Vous pouvez vous désactiver l'enregistrement de cookies depuis sur site et sur d’autres.
                                Le moyen le plus efficace consiste à désactiver les cookies dans votre navigateur, n'hésitez pas à consulter l'aide de votre navigateur.
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
                        </Content>
                    </Modal.Card.Body>
                    <Modal.Card.Foot>
                    </Modal.Card.Foot>
                </Modal.Card>
            </Modal>
        </>
    );
};
