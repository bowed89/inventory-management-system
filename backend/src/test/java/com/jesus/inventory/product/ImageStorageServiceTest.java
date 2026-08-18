package com.jesus.inventory.product;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ImageStorageServiceTest {

    private static final String PREFIX = "product-image/";

    @TempDir
    Path uploadDir;

    private ImageStorageService imageStorageService;

    @BeforeEach
    void setUp() {
        imageStorageService = new ImageStorageService(uploadDir.toString());
    }

    @Test
    void store_savesFileAndReturnsRelativePath() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "imageFile", "banner.jpg", "image/jpeg", "fake-image-bytes".getBytes());

        String storedPath = imageStorageService.store(file);

        assertThat(storedPath).startsWith(PREFIX).endsWith("_banner.jpg");

        Path savedFile = uploadDir.resolve(storedPath.substring(PREFIX.length()));
        assertThat(savedFile).exists();
        assertThat(Files.readAllBytes(savedFile)).isEqualTo("fake-image-bytes".getBytes());
    }

    @Test
    void store_generatesUniqueNamesForSameOriginalFilename() {
        MockMultipartFile file = new MockMultipartFile(
                "imageFile", "banner.jpg", "image/jpeg", "bytes".getBytes());

        String firstPath = imageStorageService.store(file);
        String secondPath = imageStorageService.store(file);

        assertThat(firstPath).isNotEqualTo(secondPath);
    }

    @Test
    void store_rejectsNonImageContentType() {
        MockMultipartFile file = new MockMultipartFile(
                "imageFile", "doc.pdf", "application/pdf", "not-an-image".getBytes());

        assertThrows(IllegalArgumentException.class, () -> imageStorageService.store(file));
    }

    @Test
    void store_rejectsMissingContentType() {
        MockMultipartFile file = new MockMultipartFile(
                "imageFile", "file", null, "bytes".getBytes());

        assertThrows(IllegalArgumentException.class, () -> imageStorageService.store(file));
    }

    @Test
    void store_sanitizesPathTraversalInOriginalFilename() {
        MockMultipartFile file = new MockMultipartFile(
                "imageFile", "../../evil.jpg", "image/jpeg", "bytes".getBytes());

        String storedPath = imageStorageService.store(file);
        String fileName = storedPath.substring(PREFIX.length());

        assertThat(fileName).doesNotContain("..").doesNotContain("/").doesNotContain("\\");
        assertThat(uploadDir.resolve(fileName)).exists();
    }

    @Test
    void store_createsUploadDirectoryWhenMissing() {
        Path nestedDir = uploadDir.resolve("nested/uploads");
        ImageStorageService serviceWithNestedDir = new ImageStorageService(nestedDir.toString());
        MockMultipartFile file = new MockMultipartFile(
                "imageFile", "logo.png", "image/png", "bytes".getBytes());

        serviceWithNestedDir.store(file);

        assertThat(nestedDir).isDirectory();
    }
}
