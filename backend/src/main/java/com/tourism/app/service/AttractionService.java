package com.tourism.app.service;

import com.tourism.app.dto.attraction.AttractionRequest;
import com.tourism.app.dto.attraction.AttractionResponse;

import java.util.List;

public interface AttractionService {
    AttractionResponse create(AttractionRequest request);
    AttractionResponse update(Long id, AttractionRequest request);
    AttractionResponse getById(Long id);
    List<AttractionResponse> getAll();
    void delete(Long id);
}
