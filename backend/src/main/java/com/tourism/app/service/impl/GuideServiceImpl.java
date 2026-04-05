package com.tourism.app.service.impl;

import com.tourism.app.dto.guide.GuideRequest;
import com.tourism.app.dto.guide.GuideResponse;
import com.tourism.app.entity.Guide;
import com.tourism.app.exception.ResourceNotFoundException;
import com.tourism.app.repository.GuideRepository;
import com.tourism.app.service.GuideService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GuideServiceImpl implements GuideService {

    private final GuideRepository guideRepository;
    private final ModelMapper modelMapper;

    @Override
    public GuideResponse create(GuideRequest request) {
        Guide guide = modelMapper.map(request, Guide.class);
        return modelMapper.map(guideRepository.save(guide), GuideResponse.class);
    }

    @Override
    public GuideResponse update(Long id, GuideRequest request) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found"));
        guide.setFullName(request.getFullName());
        guide.setEmail(request.getEmail());
        guide.setCity(request.getCity());
        guide.setLanguage(request.getLanguage());
        guide.setPricePerDay(request.getPricePerDay());
        return modelMapper.map(guideRepository.save(guide), GuideResponse.class);
    }

    @Override
    public GuideResponse getById(Long id) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found"));
        return modelMapper.map(guide, GuideResponse.class);
    }

    @Override
    public List<GuideResponse> getAll() {
        return guideRepository.findAll().stream()
                .map(item -> modelMapper.map(item, GuideResponse.class))
                .toList();
    }

    @Override
    public void delete(Long id) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found"));
        guideRepository.delete(guide);
    }
}
