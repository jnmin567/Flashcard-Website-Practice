import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../utils/api/index";

function Deck() {
    const history = useHistory();
    const { deckId } = useParams();
    const [deck, setDeck] = useState({});
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const abortController = new AbortController();
            try {
                const deckResponse = await readDeck(
                    deckId,
                    abortController.signal
                );
                setDeck(deckResponse);
                setCards(deckResponse.cards);
                setIsLoading(false);
            } catch (error) {
                console.error("Something went wrong", error);
            }
            return () => {
                abortController.abort();
            };
        }
        fetchData();
    }, [deckId]);

    async function handleDeleteDeck(deck) {
        if (
            window.confirm(
                `Delete this deck? You will not be able to recover it`
            )
        ) {
            const abortController = new AbortController();
            try {
                history.push("/");
                return await deleteDeck(deck.id, abortController.signal);
            } catch (error) {
                console.error("Something went wrong", error);
            }
            return () => {
                abortController.abort();
            };
        }
    }

    async function handleDeleteCard(cardToDelete) {
        if (
            window.confirm(
                `Delete this card? You will not be able to recover it`
            )
        ) {
            const abortController = new AbortController();
            try {
                await deleteCard(cardToDelete.id, abortController.signal);
                setCards(cards.filter(card => card.id !== cardToDelete.id));
            } catch (error) {
                console.error("Something went wrong", error);
            } finally {
                abortController.abort();
            }
        }
    }

    async function handleEditDeck() {
        history.push(`/decks/${deckId}/edit`);
    }

    async function handleStudy() {
        history.push(`/decks/${deckId}/study`);
    }

    async function handleAddCard() {
        history.push(`/decks/${deckId}/cards/new`);
    }

    async function handleEditCard(card) {
        history.push(`/decks/${deckId}/cards/${card.id}/edit`);
    }

    if (isLoading) {
        return <div>Loading...</div>;
    } else if (Object.keys(deck).length > 0) {
        if (cards.length >= 0) {
            return (
                <div>
                    <div className="list">
                        <ul className="list-item">
                            <Link to="/">Home</Link>
                        </ul>
                        <ul className="list-active">/ {deck.name}</ul>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="top-info">
                                <h2 className="card-title">{deck.name}</h2>
                            </div>
                            <div className="middle-info">
                                <p>{deck.description}</p>
                            </div>
                            <div className="bottom-info">
                                <button onClick={() => handleEditDeck()} className="edit button">Edit</button>
                                <button onClick={() => handleStudy()} className="study button">Study</button>
                                <button onClick={() => handleAddCard()} className="add button">Add Cards</button>
                                <button onClick={() => handleDeleteDeck(deck)} className="delete button">Delete</button>
                            </div>
                        </div>
                    </div>
                    <h1>Cards</h1>
                    {cards.map((card) => {
                        return (
                            <div className="card-deck" key={card.id}>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">{card.front}</div>
                                            <div className="col">{card.back}</div>
                                        </div>
                                        <div className="container row">
                                            <button onClick={() => handleEditCard(card)} className="edit button">Edit</button>
                                            <button onClick={() => handleDeleteCard(card)} className="delete button">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
        }
    } else {
        return null;
    }
}

export default Deck;