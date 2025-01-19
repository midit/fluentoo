package com.fluentooapp.fluentoo.service;

import com.fluentooapp.fluentoo.dto.FlashCardDto;
import com.fluentooapp.fluentoo.entity.FlashCard;

import java.time.LocalDateTime;
import java.util.List;

public interface FlashCardService {

    /**
     * Deletes a flashcard by its ID.
     *
     * @param id the ID of the flashcard to delete.
     */
    void deleteFlashCard(Long id);

    /**
     * Saves a new flashcard based on the provided DTO.
     *
     * @param flashCardDto the data transfer object containing flashcard details.
     * @return the saved flashcard entity
     */
    FlashCard saveFlashCard(FlashCardDto flashCardDto);

    /**
     * Finds a flashcard by its ID.
     *
     * @param id the ID of the flashcard.
     * @return the found flashcard entity.
     */
    FlashCard findFlashCardById(Long id);

    /**
     * Retrieves all flashcards associated with a specific deck.
     *
     * @param deckId the ID of the deck.
     * @return a list of flashcards belonging to the specified deck.
     */
    List<FlashCard> findFlashCardByDeckId(Long deckId);

    /**
     * Updates an existing flashcard with new data.
     *
     * @param flashCardDto the data transfer object containing updated flashcard
     *                     details.
     * @return the updated flashcard entity
     */
    FlashCard updateFlashCard(FlashCardDto flashCardDto);

    /**
     * Updates the revision time for a specific flashcard.
     *
     * @param flashCard the flashcard to update.
     * @param dateTime  the new revision time.
     */
    void updateRevisionTime(FlashCard flashCard, LocalDateTime dateTime);

    /**
     * Updates an existing flashcard entity.
     *
     * @param flashCard the flashcard entity to update.
     */
    void update(FlashCard flashCard);

    /**
     * Calculates the next revision time based on the envelope number.
     *
     * @param envelopeNb the envelope number
     * @return the next revision date
     */
    LocalDateTime calculateRevisionTime(int envelopeNb);
}
