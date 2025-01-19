package com.fluentooapp.fluentoo.service;

import com.fluentooapp.fluentoo.dto.AnswerRequest;
import com.fluentooapp.fluentoo.dto.RevisionResponse;
import com.fluentooapp.fluentoo.dto.ProgressData;
import com.fluentooapp.fluentoo.entity.Revision;
import java.util.List;
import java.util.Map;

public interface RevisionService {
    /**
     * Creates a new deck revision for the specified deck and user.
     *
     * @param deckId    the ID of the deck to revise
     * @param userEmail the email of the user
     * @return the created revision
     */
    Revision newDeckRevision(Long deckId, String userEmail);

    /**
     * Finds a revision by its ID.
     *
     * @param id the ID of the revision
     * @return the found revision
     */
    Revision findById(Long id);

    /**
     * Updates an existing revision.
     *
     * @param revision the revision to update
     */
    void update(Revision revision);

    /**
     * Gets a revision response for the given revision ID.
     *
     * @param id the ID of the revision
     * @return the revision response
     */
    RevisionResponse getRevision(Long id);

    /**
     * Gets dashboard data for the given user.
     *
     * @param userEmail the email of the user
     * @return the dashboard data
     */
    Map<String, Object> getDashboardData(String userEmail);

    /**
     * Finds all revisions for a user and deck.
     *
     * @param userId the ID of the user
     * @param deckId the ID of the deck
     * @return list of revisions
     */
    List<Revision> findAllByUserAndDeck(String userId, Long deckId);

    /**
     * Submits an answer for a revision.
     *
     * @param id            the ID of the revision
     * @param answerRequest the answer request
     * @return the updated revision response
     */
    RevisionResponse submitAnswer(Long id, AnswerRequest answerRequest);

    /**
     * Gets progress data for all revisions.
     *
     * @return list of progress data
     */
    List<ProgressData> getProgress();
}
