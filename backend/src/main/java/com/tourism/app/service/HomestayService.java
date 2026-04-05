package com.tourism.app.service;

import com.tourism.app.dto.homestay.HomestayRequest;
import com.tourism.app.dto.homestay.HomestayResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface HomestayService {
    HomestayResponse create(HomestayRequest request);
    HomestayResponse update(Long id, HomestayRequest request);
    HomestayResponse getById(Long id);
    List<HomestayResponse> getAll();
    Page<HomestayResponse> search(String keyword, int page, int size, String sortBy, String direction);
    void delete(Long id);
}
