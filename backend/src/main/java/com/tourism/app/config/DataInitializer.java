package com.tourism.app.config;

import com.tourism.app.entity.Attraction;
import com.tourism.app.entity.Booking;
import com.tourism.app.entity.Guide;
import com.tourism.app.entity.Homestay;
import com.tourism.app.entity.Payment;
import com.tourism.app.entity.RefreshToken;
import com.tourism.app.entity.Review;
import com.tourism.app.entity.Role;
import com.tourism.app.entity.UploadedFile;
import com.tourism.app.entity.User;
import com.tourism.app.entity.enums.BookingStatus;
import com.tourism.app.entity.enums.RoleName;
import com.tourism.app.repository.AttractionRepository;
import com.tourism.app.repository.BookingRepository;
import com.tourism.app.repository.GuideRepository;
import com.tourism.app.repository.HomestayRepository;
import com.tourism.app.repository.PaymentRepository;
import com.tourism.app.repository.RefreshTokenRepository;
import com.tourism.app.repository.ReviewRepository;
import com.tourism.app.repository.RoleRepository;
import com.tourism.app.repository.UploadedFileRepository;
import com.tourism.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final HomestayRepository homestayRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;
    private final AttractionRepository attractionRepository;
    private final GuideRepository guideRepository;
    private final UploadedFileRepository uploadedFileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedDemoData() {
        return args -> {
            Map<RoleName, Role> roles = seedRoles();
            Map<String, User> users = seedUsers(roles);
            Map<String, Homestay> homestays = seedHomestays(users);
            Map<String, Booking> bookings = seedBookings(users, homestays);

            seedPayments(bookings);
            seedReviews(users, homestays);
            seedAttractions();
            seedGuides();
            seedUploadedFiles(users);
            seedRefreshTokens(users);
        };
    }

    private Map<RoleName, Role> seedRoles() {
        Map<RoleName, Role> roles = new HashMap<>();

        for (RoleName roleName : RoleName.values()) {
            Role role = roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));
            roles.put(roleName, role);
        }

        return roles;
    }

    private Map<String, User> seedUsers(Map<RoleName, Role> roles) {
        Map<String, User> users = new HashMap<>();

        users.put("priya.sharma@stayvista.in", upsertUser(
                "Priya Sharma",
                "priya.sharma@stayvista.in",
                "local",
                Set.of(roles.get(RoleName.ROLE_TOURIST))
        ));
        users.put("rahul.verma@stayvista.in", upsertUser(
                "Rahul Verma",
                "rahul.verma@stayvista.in",
                "local",
                Set.of(roles.get(RoleName.ROLE_TOURIST))
        ));
        users.put("ananya.iyer@stayvista.in", upsertUser(
                "Ananya Iyer",
                "ananya.iyer@stayvista.in",
                "google",
                Set.of(roles.get(RoleName.ROLE_TOURIST))
        ));
        users.put("arjun.mehta@stayvista.in", upsertUser(
                "Arjun Mehta",
                "arjun.mehta@stayvista.in",
                "local",
                Set.of(roles.get(RoleName.ROLE_HOST))
        ));
        users.put("meera.nair@stayvista.in", upsertUser(
                "Meera Nair",
                "meera.nair@stayvista.in",
                "local",
                Set.of(roles.get(RoleName.ROLE_HOST), roles.get(RoleName.ROLE_GUIDE))
        ));
        users.put("admin", upsertAdminUser(roles.get(RoleName.ROLE_ADMIN)));

        return users;
    }

    private Map<String, Homestay> seedHomestays(Map<String, User> users) {
        Map<String, Homestay> homestays = new HashMap<>();

        homestays.put("Nilgiri Breeze Villa", upsertHomestay(
                "Nilgiri Breeze Villa",
                "Ooty, Tamil Nadu",
                "A peaceful hill-view villa with homemade South Indian breakfast, a misty garden, and easy access to the tea estates.",
                3400,
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
                users.get("meera.nair@stayvista.in")
        ));
        homestays.put("Shikara Houseboat Stay", upsertHomestay(
                "Shikara Houseboat Stay",
                "Srinagar, Jammu & Kashmir",
                "A handcrafted cedar houseboat on Dal Lake with Kashmiri kahwa, lakefront sunrise views, and traditional carved interiors.",
                4200,
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
                users.get("arjun.mehta@stayvista.in")
        ));
        homestays.put("Konkan Courtyard Homestay", upsertHomestay(
                "Konkan Courtyard Homestay",
                "Ratnagiri, Maharashtra",
                "A warm family-run coastal homestay surrounded by mango orchards, red soil courtyards, and fresh Malvani meals.",
                2800,
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
                users.get("meera.nair@stayvista.in")
        ));
        homestays.put("Ziro Valley Bamboo Retreat", upsertHomestay(
                "Ziro Valley Bamboo Retreat",
                "Ziro, Arunachal Pradesh",
                "A bamboo-crafted eco retreat with valley views, Apatani-inspired design, bonfire evenings, and guided village walks.",
                3900,
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
                users.get("arjun.mehta@stayvista.in")
        ));
        homestays.put("Chettinad Courtyard Manor", upsertHomestay(
                "Chettinad Courtyard Manor",
                "Karaikudi, Tamil Nadu",
                "A restored heritage manor with Athangudi tiles, elegant courtyards, and authentic Chettinad cuisine cooked in-house.",
                3600,
                "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
                users.get("meera.nair@stayvista.in")
        ));

        return homestays;
    }

    private Map<String, Booking> seedBookings(Map<String, User> users, Map<String, Homestay> homestays) {
        Map<String, Booking> bookings = new HashMap<>();

        bookings.put("SV-DEMO-BOOK-001", upsertBooking(
                users.get("priya.sharma@stayvista.in"),
                homestays.get("Nilgiri Breeze Villa"),
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(8),
                BookingStatus.CONFIRMED
        ));
        bookings.put("SV-DEMO-BOOK-002", upsertBooking(
                users.get("rahul.verma@stayvista.in"),
                homestays.get("Shikara Houseboat Stay"),
                LocalDate.now().plusDays(9),
                LocalDate.now().plusDays(12),
                BookingStatus.CONFIRMED
        ));
        bookings.put("SV-DEMO-BOOK-003", upsertBooking(
                users.get("ananya.iyer@stayvista.in"),
                homestays.get("Konkan Courtyard Homestay"),
                LocalDate.now().plusDays(14),
                LocalDate.now().plusDays(17),
                BookingStatus.PENDING
        ));
        bookings.put("SV-DEMO-BOOK-004", upsertBooking(
                users.get("priya.sharma@stayvista.in"),
                homestays.get("Ziro Valley Bamboo Retreat"),
                LocalDate.now().plusDays(18),
                LocalDate.now().plusDays(21),
                BookingStatus.CONFIRMED
        ));
        bookings.put("SV-DEMO-BOOK-005", upsertBooking(
                users.get("rahul.verma@stayvista.in"),
                homestays.get("Chettinad Courtyard Manor"),
                LocalDate.now().plusDays(24),
                LocalDate.now().plusDays(27),
                BookingStatus.CANCELLED
        ));

        return bookings;
    }

    private void seedPayments(Map<String, Booking> bookings) {
        upsertPayment(bookings.get("SV-DEMO-BOOK-001"), 10200, "CARD", "PAID", LocalDateTime.now().minusDays(2));
        upsertPayment(bookings.get("SV-DEMO-BOOK-002"), 12600, "UPI", "PAID", LocalDateTime.now().minusDays(1));
        upsertPayment(bookings.get("SV-DEMO-BOOK-003"), 8400, "NETBANKING", "PENDING", LocalDateTime.now().minusHours(18));
        upsertPayment(bookings.get("SV-DEMO-BOOK-004"), 11700, "WALLET", "PAID", LocalDateTime.now().minusHours(6));
        upsertPayment(bookings.get("SV-DEMO-BOOK-005"), 10800, "CARD", "REFUNDED", LocalDateTime.now().minusDays(4));
    }

    private void seedReviews(Map<String, User> users, Map<String, Homestay> homestays) {
        upsertReview(
                "Priya Sharma|Nilgiri Breeze Villa",
                users.get("priya.sharma@stayvista.in"),
                homestays.get("Nilgiri Breeze Villa"),
                5,
                "The view at sunrise was beautiful, and the host arranged a lovely homemade breakfast every morning."
        );
        upsertReview(
                "Rahul Verma|Shikara Houseboat Stay",
                users.get("rahul.verma@stayvista.in"),
                homestays.get("Shikara Houseboat Stay"),
                5,
                "Very peaceful stay on the lake. The room was spotless and the Kashmiri dinner felt authentic and memorable."
        );
        upsertReview(
                "Ananya Iyer|Konkan Courtyard Homestay",
                users.get("ananya.iyer@stayvista.in"),
                homestays.get("Konkan Courtyard Homestay"),
                4,
                "Warm hosts, excellent seafood, and a calm village atmosphere. Great for a slow and relaxing weekend."
        );
        upsertReview(
                "Priya Sharma|Ziro Valley Bamboo Retreat",
                users.get("priya.sharma@stayvista.in"),
                homestays.get("Ziro Valley Bamboo Retreat"),
                5,
                "The bamboo cottages felt unique and comfortable, and the guided walk through the valley was a highlight."
        );
        upsertReview(
                "Rahul Verma|Chettinad Courtyard Manor",
                users.get("rahul.verma@stayvista.in"),
                homestays.get("Chettinad Courtyard Manor"),
                4,
                "Beautiful heritage architecture and fantastic food. The courtyard rooms stayed cool even during the afternoon."
        );
    }

    private void seedAttractions() {
        upsertAttraction(
                "Mysuru Palace",
                "Mysuru, Karnataka",
                "Heritage",
                "An iconic royal palace known for its Indo-Saracenic architecture, evening illumination, and rich Wadiyar history."
        );
        upsertAttraction(
                "Marine Drive",
                "Mumbai, Maharashtra",
                "Scenic",
                "A famous sea-facing promenade loved for sunset views, art deco buildings, and lively evening walks."
        );
        upsertAttraction(
                "Meenakshi Temple",
                "Madurai, Tamil Nadu",
                "Spiritual",
                "A historic temple complex celebrated for its soaring gopurams, intricate carvings, and vibrant local culture."
        );
        upsertAttraction(
                "Kaziranga National Park",
                "Kaziranga, Assam",
                "Wildlife",
                "A UNESCO-listed park famous for one-horned rhinoceros sightings, wetlands, and elephant grass landscapes."
        );
        upsertAttraction(
                "Golconda Fort",
                "Hyderabad, Telangana",
                "Heritage",
                "A sprawling hill fort known for its acoustics, grand gateways, and panoramic city views at sunset."
        );
    }

    private void seedGuides() {
        upsertGuide("Sanjay Kulkarni", "sanjay.kulkarni@guides.in", "Mumbai, Maharashtra", "Hindi, English, Marathi", 3500);
        upsertGuide("Farah Qadri", "farah.qadri@guides.in", "Srinagar, Jammu & Kashmir", "English, Hindi, Kashmiri", 4200);
        upsertGuide("Karthik Narayanan", "karthik.narayanan@guides.in", "Madurai, Tamil Nadu", "Tamil, English, Hindi", 3200);
        upsertGuide("Pema Doley", "pema.doley@guides.in", "Ziro, Arunachal Pradesh", "English, Hindi, Apatani", 3800);
        upsertGuide("Nivedita Rao", "nivedita.rao@guides.in", "Mysuru, Karnataka", "English, Kannada, Hindi", 3400);
    }

    private void seedUploadedFiles(Map<String, User> users) {
        upsertUploadedFile("aadhaar-priya-demo.pdf", "application/pdf", 245760L, "uploads/demo/aadhaar-priya-demo.pdf", users.get("priya.sharma@stayvista.in"));
        upsertUploadedFile("passport-rahul-demo.pdf", "application/pdf", 312640L, "uploads/demo/passport-rahul-demo.pdf", users.get("rahul.verma@stayvista.in"));
        upsertUploadedFile("profile-meera-demo.jpg", "image/jpeg", 184320L, "uploads/demo/profile-meera-demo.jpg", users.get("meera.nair@stayvista.in"));
        upsertUploadedFile("villa-nilgiri-cover.jpg", "image/jpeg", 428032L, "uploads/demo/villa-nilgiri-cover.jpg", users.get("arjun.mehta@stayvista.in"));
        upsertUploadedFile("booking-invoice-demo.pdf", "application/pdf", 276480L, "uploads/demo/booking-invoice-demo.pdf", users.get("admin"));
    }

    private void seedRefreshTokens(Map<String, User> users) {
        upsertRefreshToken(
                "rt_priya_demo_2026_seed",
                users.get("priya.sharma@stayvista.in"),
                LocalDateTime.now().plusDays(10),
                false
        );
        upsertRefreshToken(
                "rt_rahul_demo_2026_seed",
                users.get("rahul.verma@stayvista.in"),
                LocalDateTime.now().plusDays(9),
                false
        );
        upsertRefreshToken(
                "rt_ananya_demo_2026_seed",
                users.get("ananya.iyer@stayvista.in"),
                LocalDateTime.now().plusDays(8),
                false
        );
        upsertRefreshToken(
                "rt_meera_demo_2026_seed",
                users.get("meera.nair@stayvista.in"),
                LocalDateTime.now().plusDays(7),
                false
        );
        upsertRefreshToken(
                "rt_vikram_demo_2026_seed",
                users.get("admin"),
                LocalDateTime.now().plusDays(12),
                true
        );
    }

    private User upsertUser(String fullName, String email, String provider, Set<Role> roles) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("StayVista@123"));
        user.setEnabled(true);
        user.setProvider(provider);
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }
        user.setRoles(new HashSet<>(roles));
        return userRepository.save(user);
    }

    private User upsertAdminUser(Role adminRole) {
        User user = userRepository.findByEmail("admin")
                .or(() -> userRepository.findFirstByRoles_Name(RoleName.ROLE_ADMIN))
                .orElseGet(User::new);
        user.setFullName("Admin");
        user.setEmail("admin");
        user.setPassword(passwordEncoder.encode("Admin@123"));
        user.setEnabled(true);
        user.setProvider("local");
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }
        user.setRoles(new HashSet<>(Set.of(adminRole)));
        return userRepository.save(user);
    }

    private Homestay upsertHomestay(String name, String city, String description, int pricePerNight, String imageUrl, User host) {
        Homestay homestay = homestayRepository.findAll().stream()
                .filter(existing -> existing.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(Homestay::new);

        homestay.setName(name);
        homestay.setCity(city);
        homestay.setDescription(description);
        homestay.setPricePerNight(BigDecimal.valueOf(pricePerNight));
        homestay.setImageUrl(imageUrl);
        homestay.setHost(host);
        return homestayRepository.save(homestay);
    }

    private Booking upsertBooking(User tourist, Homestay homestay, LocalDate checkIn, LocalDate checkOut, BookingStatus status) {
        Booking booking = bookingRepository.findAll().stream()
                .filter(existing ->
                        existing.getTourist().getId().equals(tourist.getId())
                                && existing.getHomestay().getId().equals(homestay.getId())
                                && existing.getCheckInDate().equals(checkIn)
                                && existing.getCheckOutDate().equals(checkOut))
                .findFirst()
                .orElseGet(Booking::new);

        booking.setTourist(tourist);
        booking.setHomestay(homestay);
        booking.setCheckInDate(checkIn);
        booking.setCheckOutDate(checkOut);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    private void upsertPayment(Booking booking, int amount, String method, String status, LocalDateTime paidAt) {
        Payment payment = paymentRepository.findAll().stream()
                .filter(existing ->
                        existing.getBooking().getId().equals(booking.getId())
                                && existing.getMethod().equalsIgnoreCase(method))
                .findFirst()
                .orElseGet(Payment::new);

        payment.setBooking(booking);
        payment.setAmount(BigDecimal.valueOf(amount));
        payment.setMethod(method);
        payment.setStatus(status);
        payment.setPaidAt(paidAt);
        paymentRepository.save(payment);
    }

    private void upsertReview(String key, User tourist, Homestay homestay, int rating, String comment) {
        Review review = reviewRepository.findAll().stream()
                .filter(existing ->
                        existing.getTourist().getId().equals(tourist.getId())
                                && existing.getHomestay().getId().equals(homestay.getId()))
                .findFirst()
                .orElseGet(Review::new);

        review.setTourist(tourist);
        review.setHomestay(homestay);
        review.setRating(rating);
        review.setComment(comment);
        reviewRepository.save(review);
    }

    private void upsertAttraction(String name, String city, String category, String description) {
        Attraction attraction = attractionRepository.findAll().stream()
                .filter(existing -> existing.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(Attraction::new);

        attraction.setName(name);
        attraction.setCity(city);
        attraction.setCategory(category);
        attraction.setDescription(description);
        attractionRepository.save(attraction);
    }

    private void upsertGuide(String fullName, String email, String city, String language, int pricePerDay) {
        Guide guide = guideRepository.findAll().stream()
                .filter(existing -> existing.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseGet(Guide::new);

        guide.setFullName(fullName);
        guide.setEmail(email);
        guide.setCity(city);
        guide.setLanguage(language);
        guide.setPricePerDay(BigDecimal.valueOf(pricePerDay));
        guideRepository.save(guide);
    }

    private void upsertUploadedFile(String fileName, String fileType, long fileSize, String storagePath, User uploadedBy) {
        UploadedFile uploadedFile = uploadedFileRepository.findAll().stream()
                .filter(existing -> existing.getFileName().equalsIgnoreCase(fileName))
                .findFirst()
                .orElseGet(UploadedFile::new);

        uploadedFile.setFileName(fileName);
        uploadedFile.setFileType(fileType);
        uploadedFile.setFileSize(fileSize);
        uploadedFile.setStoragePath(storagePath);
        uploadedFile.setUploadedBy(uploadedBy);
        if (uploadedFile.getUploadedAt() == null) {
            uploadedFile.setUploadedAt(LocalDateTime.now());
        }
        uploadedFileRepository.save(uploadedFile);
    }

    private void upsertRefreshToken(String token, User user, LocalDateTime expiresAt, boolean revoked) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElseGet(RefreshToken::new);
        refreshToken.setToken(token);
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(expiresAt);
        refreshToken.setRevoked(revoked);
        refreshTokenRepository.save(refreshToken);
    }
}
