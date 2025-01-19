package com.fluentooapp.fluentoo.controller;

import com.fluentooapp.fluentoo.dto.FlashCardDto;
import com.fluentooapp.fluentoo.entity.FlashCard;
import com.fluentooapp.fluentoo.service.FlashCardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flashcards")
public class FlashCardRestController {

    private final FlashCardService flashCardService;

    public FlashCardRestController(FlashCardService flashCardService) {
        this.flashCardService = flashCardService;
    }

    @PostMapping
    public ResponseEntity<FlashCard> createFlashCard(@Valid @RequestBody FlashCardDto flashCardDto) {
        FlashCard savedFlashCard = flashCardService.saveFlashCard(flashCardDto);
        return ResponseEntity.ok(savedFlashCard);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlashCard> updateFlashCard(@PathVariable Long id,
            @Valid @RequestBody FlashCardDto flashCardDto) {
        flashCardDto.setId(id);
        FlashCard updatedFlashCard = flashCardService.updateFlashCard(flashCardDto);
        return ResponseEntity.ok(updatedFlashCard);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlashCard(@PathVariable Long id) {
        flashCardService.deleteFlashCard(id);
        return ResponseEntity.ok().build();
    }
}