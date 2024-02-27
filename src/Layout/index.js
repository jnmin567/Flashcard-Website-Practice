import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "../Functions/Home";
import CreateDeck from "../Functions/CreateDeck";
import Deck from "../Functions/Deck";
import Study from "../Functions/Study";
import EditDeck from "../Functions/EditDeck";
import Card from "../Functions/Card"; // import the new CardForm component

function Layout() {
    return (
        <div>
            <Header />
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/decks/new">
                        <CreateDeck />
                    </Route>
                    <Route exact path="/decks/:deckId">
                        <Deck />
                    </Route>
                    <Route path="/decks/:deckId/study">
                        <Study />
                    </Route>
                    <Route path="/decks/:deckId/edit">
                        <EditDeck />
                    </Route>
                    <Route path="/decks/:deckId/cards/new">
                        <Card mode="add" /> {/* use CardForm in "add" mode */}
                    </Route>
                    <Route path="/decks/:deckId/cards/:cardId/edit">
                        <Card mode="edit" /> {/* use CardForm in "edit" mode */}
                    </Route>
                    <NotFound />
                </Switch>
            </div>
        </div>
    );
}

export default Layout;