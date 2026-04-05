package com.tourism.app.service;

import com.tourism.app.dto.guide.GuideRequest;
import com.tourism.app.dto.guide.GuideResponse;

import java.util.List;

public interface GuideService {
    GuideResponse create(GuideRequest request);
    GuideResponse update(Long id, GuideRequest request);
    GuideResponse getById(Long id);
    List<GuideResponse> getAll();
    void delete(Long id);
}
