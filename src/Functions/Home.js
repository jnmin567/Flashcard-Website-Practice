import React, { useState, useEffect } from "react";
import { listDecks, deleteDeck } from "../utils/api/index";
import { useHistory } from "react-router-dom";

function Home() {
    const history = useHistory();
    const [decks, setDecks] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const abortController = new AbortController();
            try {
                const deckResponse = await listDecks(abortController.signal);
                setDecks(deckResponse);
            } catch (error) {
                console.error("Something went wrong", error);
            }
            return () => {
                abortController.abort();
            };
        }
        fetchData();
    }, []);

    async function handleDelete(deck) {
        if (window.confirm(`Delete this deck? You will not be able to recover it`)) {
            await deleteDeck(deck.id);
            setDecks(decks.filter(d => d.id !== deck.id)); // Update the decks state here
        }
    }

    return (
    <div className="container">
        <button className="create button" onClick={() => history.push("/decks/new")}>Create Deck</button>
        <div className="card-deck">
            {decks.map((deck) => {
                console.log(deck.name);
                return (
                    <div className="deck">
                        <div className="deck-body">
                            <div className="top-info">
                                <div className="deck-title">
                                    {deck.name}
                                </div>
                                <div className="card-count">
                                    {deck.cards.length} cards
                                </div>
                            </div>
                            <div className="middle-info">
                                <div className="card-text">
                                    {deck.description}
                                </div>
                            </div>
                            <div className="bottom-info">
                                <button className="view button" onClick={() => history.push(`/decks/${deck.id}`)}>View</button>
                                <button className="study button" onClick={() => history.push(`/decks/${deck.id}/study`)}>Study</button>
                                <button type="button" className="delete button" onClick={() => handleDelete(deck)}>Delete</button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}

export default Home;