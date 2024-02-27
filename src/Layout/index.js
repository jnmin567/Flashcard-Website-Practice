import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "../Functions/Home";
import CreateDeck from "../Functions/CreateDeck";
import Deck from "../Functions/Deck";
import Study from "../Functions/Study";
import EditDeck from "../Functions/EditDeck";
import AddCard from "../Functions/AddCard";
import EditCard from "../Functions/EditCard";

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
                        <AddCard />
                    </Route>
                    <Route path="/decks/:deckId/cards/:cardId/edit">
                        <EditCard />
                    </Route>
                    <NotFound />
                </Switch>
            </div>
        </div>
    );
}

export default Layout;
