package com.jesus.inventory.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class ImageStorageService {

    private final String uploadDir;

    public ImageStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public String store(MultipartFile imageFile) {
        if (imageFile.getContentType() == null || !imageFile.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        Path directory = Paths.get(uploadDir);

        try {
            Files.createDirectories(directory);

            String uniqueFileName = UUID.randomUUID() + "_" + sanitize(imageFile.getOriginalFilename());
            Path destination = directory.resolve(uniqueFileName);
            imageFile.transferTo(destination);

            return "product-image/" + uniqueFileName;

        } catch (IOException e) {
            throw new IllegalArgumentException("Error occurred while saving image " + e.getMessage());
        }
    }

    private String sanitize(String originalFilename) {
        if (originalFilename == null) return "file";
        return originalFilename
                .replaceAll("[^a-zA-Z0-9._-]", "_")
                .replaceAll("\\.\\.+", "_");
    }
}
