package com.fluentooapp.fluentoo.service.impl;

import com.fluentooapp.fluentoo.dto.FlashCardDto;
import com.fluentooapp.fluentoo.entity.FlashCard;
import com.fluentooapp.fluentoo.repository.DeckRepository;
import com.fluentooapp.fluentoo.repository.FlashCardRepository;
import com.fluentooapp.fluentoo.service.FlashCardService;
import com.fluentooapp.fluentoo.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class FlashCardServiceImpl implements FlashCardService {

    private final FlashCardRepository flashCardRepository;
    private final DeckRepository deckRepository;

    public FlashCardServiceImpl(FlashCardRepository flashCardRepository, DeckRepository deckRepository) {
        this.flashCardRepository = flashCardRepository;
        this.deckRepository = deckRepository;
    }

    @Override
    public void deleteFlashCard(Long id) {
        flashCardRepository.deleteById(id);
    }

    @Override
    public FlashCard saveFlashCard(FlashCardDto flashCardDto) {
        LocalDateTime revisionTime = calculateRevisionTime(1);
        FlashCard flashCard = new FlashCard();
        flashCard.setQuestion(flashCardDto.getQuestion());
        flashCard.setAnswer(flashCardDto.getAnswer());
        flashCard.setEnvelopeNb(1);
        flashCard.setRevisionTime(revisionTime);

        flashCard.setDeck(deckRepository.findById(flashCardDto.getDeckId())
                .orElseThrow(() -> new ResourceNotFoundException("Deck", "id", flashCardDto.getDeckId())));

        return flashCardRepository.save(flashCard);
    }

    @Override
    public FlashCard findFlashCardById(Long id) {
        return flashCardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FlashCard", "id", id));
    }

    @Override
    public List<FlashCard> findFlashCardByDeckId(Long id) {
        try {
            System.out.println("Finding flashcards for deck id: " + id);
            List<FlashCard> flashcards = flashCardRepository.findByDeckId(id);
            System.out.println("Found " + flashcards.size() + " flashcards");
            return flashcards;
        } catch (Exception e) {
            System.err.println("Error finding flashcards for deck: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public FlashCard updateFlashCard(FlashCardDto flashCardDto) {
        FlashCard flashCard = flashCardRepository.findById(flashCardDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("FlashCard", "id", flashCardDto.getId()));

        flashCard.setQuestion(flashCardDto.getQuestion());
        flashCard.setAnswer(flashCardDto.getAnswer());

        if (flashCardDto.getDeckId() != null) {
            flashCard.setDeck(deckRepository.findById(flashCardDto.getDeckId())
                    .orElseThrow(() -> new ResourceNotFoundException("Deck", "id", flashCardDto.getDeckId())));
        }

        return flashCardRepository.save(flashCard);
    }

    @Override
    public void updateRevisionTime(FlashCard flashCard, LocalDateTime dateTime) {
        flashCard.setRevisionTime(dateTime);
        flashCardRepository.save(flashCard);
    }

    @Override
    public void update(FlashCard flashCard) {
        flashCardRepository.save(flashCard);
    }

    /**
     * Calculates the revision time based on the envelope number.
     * Envelope system intervals:
     * 1: Next day
     * 2: 2 days later
     * 3: 4 days later
     * 4: 1 week later
     * 5: 2 weeks later
     * 6: 1 month later
     * 7: 2 months later
     * 8: 4 months later
     *
     * @param envelopeNb the envelope number.
     * @return the calculated revision time.
     */
    @Override
    public LocalDateTime calculateRevisionTime(int envelopeNb) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime result = now;

        switch (envelopeNb) {
            case 1: // Next day
                result = now.plusDays(1);
                break;
            case 2: // 2 days later
                result = now.plusDays(2);
                break;
            case 3: // 4 days later
                result = now.plusDays(4);
                break;
            case 4: // 1 week later
                result = now.plusWeeks(1);
                break;
            case 5: // 2 weeks later
                result = now.plusWeeks(2);
                break;
            case 6: // 1 month later
                result = now.plusMonths(1);
                break;
            case 7: // 2 months later
                result = now.plusMonths(2);
                break;
            case 8: // 4 months later
                result = now.plusMonths(4);
                break;
            default: // If invalid envelope number, default to next day
                result = now.plusDays(1);
        }

        // Set time to start of day
        return result.with(LocalTime.MIN);
    }
}
