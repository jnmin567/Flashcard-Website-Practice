import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck } from "../utils/api/index";

function Study() {
    const { deckId } = useParams();
    const [deck, setDeck] = useState({});
    const [cards, setCards] = useState([]);
    const [cardNumber, setCardNumber] = useState(1);
    const [front, isFront] = useState(true);
    const history = useHistory();

    useEffect(() => {
        async function fetchData() {
            const abortController = new AbortController();
            const response = await readDeck(deckId, abortController.signal);
            setDeck(response);
            setCards(response.cards);
            return () => {
                abortController.abort();
            };
        }
        fetchData();
    }, []);

    function nextCard(index, total) {
        console.log(index);
        if (index < total) {
            setCardNumber(cardNumber + 1);
            isFront(true);
        } else {
            if (
                window.confirm(
                    `Restart cards? Click 'cancel' to return to the home page`
                )
            ) {
                setCardNumber(1);
                isFront(true);
            } else {
                history.push("/");
            }
        }
    }

    function flipCard() {
        if (front) {
            isFront(false);
        } else {
            isFront(true);
        }
    }

    function showNextButton(cards, index) {
        if (front) {
            return null;
        } else {
            return (
                <button onClick={() => nextCard(index + 1, cards.length)} className="next button">Next</button>
            );
        }
    }

    function enoughCards() {
        return (
            <div className="card">
                {cards.map((card, index) => {
                    if (index === cardNumber - 1) {
                        return (
                            <div className="card-body" key={card.id}>
                                <div className="card-title">
                                    {`Card ${index + 1} of ${cards.length}`}
                                </div>
                                <div className="card-text">
                                    {front ? card.front : card.back}
                                </div>
                                <button onClick={flipCard} className="flip button">Flip</button>
                                {showNextButton(cards, index)}
                            </div>
                        );
                    }
                })}
            </div>
        );
    }

    function notEnoughCards() {
        return (
            <div>
                <h2>Not enough cards.</h2>
                <p>
                    You need at least 3 cards to study. There are {cards.length}{" "}
                    cards in this deck.
                </p>
                <button onClick={() => history.push(`/decks/${deck.id}/cards/new`)} className="add button">Add Cards</button>
            </div>
        );
    }

    return (
        <div>
            <ul className="list">
                <ul className="list-item">
                    <Link to="/">Home</Link>
                </ul>
                <ul className="list-item">
                    <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                </ul>
                <ul className="list-active">Study</ul>
            </ul>
            <div>
                <h2>{`${deck.name}: Study`}</h2>
                <div>
                    {cards.length === 0
                        ? notEnoughCards()
                        : cards.length > 2
                        ? enoughCards()
                        : notEnoughCards()}
                </div>
            </div>
        </div>
    );
}

export default Study;
