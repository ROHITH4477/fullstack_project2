package com.tourism.app.controller;

import com.tourism.app.dto.guide.GuideRequest;
import com.tourism.app.dto.guide.GuideResponse;
import com.tourism.app.service.GuideService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guides")
@RequiredArgsConstructor
public class GuideController {

    private final GuideService guideService;

    @Operation(summary = "Create guide")
    @PreAuthorize("hasAnyRole('ADMIN','HOST')")
    @PostMapping
    public ResponseEntity<GuideResponse> create(@Valid @RequestBody GuideRequest request) {
        return ResponseEntity.ok(guideService.create(request));
    }

    @Operation(summary = "Update guide")
    @PreAuthorize("hasAnyRole('ADMIN','HOST')")
    @PutMapping("/{id}")
    public ResponseEntity<GuideResponse> update(@PathVariable Long id, @Valid @RequestBody GuideRequest request) {
        return ResponseEntity.ok(guideService.update(id, request));
    }

    @Operation(summary = "Get all guides")
    @GetMapping
    public ResponseEntity<List<GuideResponse>> getAll() {
        return ResponseEntity.ok(guideService.getAll());
    }

    @Operation(summary = "Get guide by id")
    @GetMapping("/{id}")
    public ResponseEntity<GuideResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(guideService.getById(id));
    }

    @Operation(summary = "Delete guide")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        guideService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
