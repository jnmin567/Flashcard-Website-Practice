import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createCard, readCard, readDeck, updateCard } from "../utils/api/index";

function Card({ mode }) {
    const { deckId, cardId } = useParams();
    const history = useHistory();
    const initialCardState = {
        id: "",
        front: "",
        back: "",
        deckId: "",
    };

    const [card, setCard] = useState(initialCardState);
    const [deck, setDeck] = useState({});

    useEffect(() => {
        async function fetchData() {
            const abortController = new AbortController();
            try {
                const deckResponse = await readDeck(deckId, abortController.signal);
                setDeck(deckResponse);
                if (mode === "edit") {
                    const cardResponse = await readCard(cardId, abortController.signal);
                    setCard(cardResponse);
                }
            } catch (error) {
                console.error("Something went wrong", error);
            }
            return () => {
                abortController.abort();
            };
        }
        fetchData();
    }, []);

    function handleChange({ target }) {
        setCard({
            ...card,
            [target.name]: target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const abortController = new AbortController();
        if (mode === "edit") {
            await updateCard({ ...card }, abortController.signal);
        } else {
            await createCard(deckId, { ...card }, abortController.signal);
            setCard(initialCardState);
        }
        history.go(0);
    }

    async function handleCancel() {
        history.push(`/decks/${deckId}`);
    }

    return (
        <div>
            <div className="list">
                <ul className="list-item">
                    <Link to="/">Home</Link>
                </ul>
                <ul className="list-item">
                    <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                </ul>
                <ul className="list-active">{mode === "edit" ? `Edit Card ${cardId}` : "Add Card"}</ul>
            </div>
            <form onSubmit={handleSubmit}>
                <h2>{mode === "edit" ? "Edit Card" : `${deck.name}: Add Card`}</h2>
                <div className="form-group">
                    <label>Front</label>
                    <textarea
                        id="front"
                        name="front"
                        className="form-control"
                        onChange={handleChange}
                        type="text"
                        value={card.front}
                    />
                </div>
                <div className="form-group">
                    <label>Back</label>
                    <textarea
                        id="back"
                        name="back"
                        className="form-control"
                        onChange={handleChange}
                        type="text"
                        value={card.back}
                    />
                </div>
                <button className="cancel button" onClick={handleCancel}>Cancel</button>
                <button className="save button" type="submit">Save</button>
            </form>
        </div>
    );
}

export default Card;