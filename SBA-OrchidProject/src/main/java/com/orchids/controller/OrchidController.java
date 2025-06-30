package com.orchids.controller;

import com.orchids.dto.OrchidRequestDTO;
import com.orchids.service.IOrchidService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orchids")
public class OrchidController {

    private final IOrchidService orchidService;
    public OrchidController(IOrchidService orchidService) {
        this.orchidService = orchidService;
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllOrchids() {
        return ResponseEntity.ok(orchidService.getOrchid());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrchidById(@PathVariable  int id) {
        return ResponseEntity.ok(orchidService.getOrchidById(id));
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> saveOrchid(@RequestBody OrchidRequestDTO orchidRequestDTO) {
        return ResponseEntity.ok(orchidService.saveOrchid(orchidRequestDTO));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> updateOrchid(@PathVariable int id,@RequestBody OrchidRequestDTO orchidRequestDTO) {
        return ResponseEntity.ok(orchidService.updateOrchid(id,orchidRequestDTO));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> deleteOrchid(@PathVariable int id) {
        orchidService.deleteOrchid(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(orchidService.getAllCategories());
    }
}
