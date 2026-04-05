package com.tourism.app.service.impl;

import com.tourism.app.dto.attraction.AttractionRequest;
import com.tourism.app.dto.attraction.AttractionResponse;
import com.tourism.app.entity.Attraction;
import com.tourism.app.exception.ResourceNotFoundException;
import com.tourism.app.repository.AttractionRepository;
import com.tourism.app.service.AttractionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttractionServiceImpl implements AttractionService {

    private final AttractionRepository attractionRepository;
    private final ModelMapper modelMapper;

    @Override
    public AttractionResponse create(AttractionRequest request) {
        Attraction attraction = modelMapper.map(request, Attraction.class);
        return modelMapper.map(attractionRepository.save(attraction), AttractionResponse.class);
    }

    @Override
    public AttractionResponse update(Long id, AttractionRequest request) {
        Attraction attraction = attractionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attraction not found"));
        attraction.setName(request.getName());
        attraction.setCity(request.getCity());
        attraction.setCategory(request.getCategory());
        attraction.setDescription(request.getDescription());
        return modelMapper.map(attractionRepository.save(attraction), AttractionResponse.class);
    }

    @Override
    public AttractionResponse getById(Long id) {
        Attraction attraction = attractionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attraction not found"));
        return modelMapper.map(attraction, AttractionResponse.class);
    }

    @Override
    public List<AttractionResponse> getAll() {
        return attractionRepository.findAll().stream()
                .map(item -> modelMapper.map(item, AttractionResponse.class))
                .toList();
    }

    @Override
    public void delete(Long id) {
        Attraction attraction = attractionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attraction not found"));
        attractionRepository.delete(attraction);
    }
}
