package com.tourism.app.controller;

import com.tourism.app.dto.homestay.HomestayRequest;
import com.tourism.app.dto.homestay.HomestayResponse;
import com.tourism.app.service.HomestayService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/homestays")
@RequiredArgsConstructor
public class HomestayController {

    private final HomestayService homestayService;

    @Operation(summary = "Create a homestay")
    @PreAuthorize("hasAnyRole('ADMIN','HOST')")
    @PostMapping
    public ResponseEntity<HomestayResponse> create(@Valid @RequestBody HomestayRequest request) {
        return ResponseEntity.ok(homestayService.create(request));
    }

    @Operation(summary = "Update a homestay")
    @PreAuthorize("hasAnyRole('ADMIN','HOST')")
    @PutMapping("/{id}")
    public ResponseEntity<HomestayResponse> update(@PathVariable Long id, @Valid @RequestBody HomestayRequest request) {
        return ResponseEntity.ok(homestayService.update(id, request));
    }

    @Operation(summary = "Get homestay by id")
    @GetMapping("/{id}")
    public ResponseEntity<HomestayResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(homestayService.getById(id));
    }

    @Operation(summary = "Get all homestays")
    @GetMapping
    public ResponseEntity<List<HomestayResponse>> getAll() {
        return ResponseEntity.ok(homestayService.getAll());
    }

    @Operation(summary = "Search homestays with paging and sorting")
    @GetMapping("/search")
    public ResponseEntity<Page<HomestayResponse>> search(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "pricePerNight") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return ResponseEntity.ok(homestayService.search(keyword, page, size, sortBy, direction));
    }

    @Operation(summary = "Delete homestay")
    @PreAuthorize("hasAnyRole('ADMIN','HOST')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        homestayService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
