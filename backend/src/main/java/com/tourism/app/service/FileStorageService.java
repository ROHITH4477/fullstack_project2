package com.tourism.app.service;

import com.tourism.app.dto.file.FileUploadResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    FileUploadResponse upload(MultipartFile file, String email);
    Resource download(String fileName);
}
