package com.tourism.app.service.impl;

import com.tourism.app.dto.homestay.HomestayRequest;
import com.tourism.app.dto.homestay.HomestayResponse;
import com.tourism.app.entity.Homestay;
import com.tourism.app.entity.User;
import com.tourism.app.exception.ResourceNotFoundException;
import com.tourism.app.repository.HomestayRepository;
import com.tourism.app.repository.UserRepository;
import com.tourism.app.service.HomestayService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomestayServiceImpl implements HomestayService {

    private final HomestayRepository homestayRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public HomestayResponse create(HomestayRequest request) {
        Homestay homestay = modelMapper.map(request, Homestay.class);

        if (request.getHostId() != null) {
            User host = userRepository.findById(request.getHostId())
                    .orElseThrow(() -> new ResourceNotFoundException("Host not found"));
            homestay.setHost(host);
        }

        Homestay saved = homestayRepository.save(homestay);
        return toResponse(saved);
    }

    @Override
    public HomestayResponse update(Long id, HomestayRequest request) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homestay not found"));

        homestay.setName(request.getName());
        homestay.setCity(request.getCity());
        homestay.setDescription(request.getDescription());
        homestay.setPricePerNight(request.getPricePerNight());

        if (request.getHostId() != null) {
            User host = userRepository.findById(request.getHostId())
                    .orElseThrow(() -> new ResourceNotFoundException("Host not found"));
            homestay.setHost(host);
        }

        return toResponse(homestayRepository.save(homestay));
    }

    @Override
    public HomestayResponse getById(Long id) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homestay not found"));
        return toResponse(homestay);
    }

    @Override
    public List<HomestayResponse> getAll() {
        return homestayRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public Page<HomestayResponse> search(String keyword, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return homestayRepository.search(keyword, pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homestay not found"));
        homestayRepository.delete(homestay);
    }

    private HomestayResponse toResponse(Homestay homestay) {
        HomestayResponse response = modelMapper.map(homestay, HomestayResponse.class);
        if (homestay.getHost() != null) {
            response.setHostId(homestay.getHost().getId());
        }
        return response;
    }
}
