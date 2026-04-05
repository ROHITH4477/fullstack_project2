package com.tourism.app.controller;

import com.tourism.app.dto.attraction.AttractionRequest;
import com.tourism.app.dto.attraction.AttractionResponse;
import com.tourism.app.service.AttractionService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attractions")
@RequiredArgsConstructor
public class AttractionController {

    private final AttractionService attractionService;

    @Operation(summary = "Create attraction")
    @PreAuthorize("hasAnyRole('ADMIN','HOST')")
    @PostMapping
    public ResponseEntity<AttractionResponse> create(@Valid @RequestBody AttractionRequest request) {
        return ResponseEntity.ok(attractionService.create(request));
    }

    @Operation(summary = "Update attraction")
    @PreAuthorize("hasAnyRole('ADMIN','HOST')")
    @PutMapping("/{id}")
    public ResponseEntity<AttractionResponse> update(@PathVariable Long id, @Valid @RequestBody AttractionRequest request) {
        return ResponseEntity.ok(attractionService.update(id, request));
    }

    @Operation(summary = "Get all attractions")
    @GetMapping
    public ResponseEntity<List<AttractionResponse>> getAll() {
        return ResponseEntity.ok(attractionService.getAll());
    }

    @Operation(summary = "Get attraction by id")
    @GetMapping("/{id}")
    public ResponseEntity<AttractionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(attractionService.getById(id));
    }

    @Operation(summary = "Delete attraction")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        attractionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
