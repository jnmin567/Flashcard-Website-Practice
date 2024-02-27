import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readCard, readDeck, updateCard } from "../utils/api/index";

function EditCard() {
    const { deckId, cardId } = useParams();
    const history = useHistory();
    const initialDeckState = {
        id: "",
        name: "",
        description: "",
    };
    const initialCardState = {
        id: "",
        front: "",
        back: "",
        deckId: "",
    };

    const [card, setCard] = useState(initialDeckState);
    const [deck, setDeck] = useState(initialCardState);

    useEffect(() => {
        async function fetchData() {
            const abortController = new AbortController();
            try {
                const cardResponse = await readCard(
                    cardId,
                    abortController.signal
                );
                const deckResponse = await readDeck(
                    deckId,
                    abortController.signal
                );
                setCard(cardResponse);
                setDeck(deckResponse);
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
        const response = await updateCard({ ...card }, abortController.signal);
        history.push(`/decks/${deckId}`);
        return response;
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
                    <Link to={`/decks/${deckId}`}>/ {deck.name}</Link>
                </ul>
                <ul className="list-active">/ Edit Card {cardId}</ul>
            </div>
            <form onSubmit={handleSubmit}>
                <h2>Edit Card</h2>
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
                <button className="cancel button" onClick={() => handleCancel()}>Cancel</button>
                <button className="save button" type="submit">Save</button>
            </form>
        </div>
    );
}

export default EditCard;
