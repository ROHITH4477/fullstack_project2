package com.tourism.app.service.impl;

import com.tourism.app.dto.file.FileUploadResponse;
import com.tourism.app.entity.UploadedFile;
import com.tourism.app.entity.User;
import com.tourism.app.exception.BadRequestException;
import com.tourism.app.exception.ResourceNotFoundException;
import com.tourism.app.repository.UploadedFileRepository;
import com.tourism.app.repository.UserRepository;
import com.tourism.app.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "application/pdf");

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    private final UploadedFileRepository uploadedFileRepository;
    private final UserRepository userRepository;

    @Override
    public FileUploadResponse upload(MultipartFile file, String email) {
        if (file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Unsupported file type");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
        String storedName = UUID.randomUUID() + "_" + originalName;

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            Path target = uploadPath.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            UploadedFile saved = uploadedFileRepository.save(UploadedFile.builder()
                    .fileName(storedName)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .storagePath(target.toString())
                    .uploadedBy(user)
                    .build());

            return FileUploadResponse.builder()
                    .id(saved.getId())
                    .fileName(saved.getFileName())
                    .fileType(saved.getFileType())
                    .fileSize(saved.getFileSize())
                    .url("/api/files/download/" + saved.getFileName())
                    .build();
        } catch (IOException ex) {
            throw new BadRequestException("File upload failed: " + ex.getMessage());
        }
    }

    @Override
    public Resource download(String fileName) {
        try {
            Path path = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(fileName);
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists()) {
                throw new ResourceNotFoundException("File not found");
            }
            return resource;
        } catch (MalformedURLException ex) {
            throw new BadRequestException("Could not read file");
        }
    }
}
