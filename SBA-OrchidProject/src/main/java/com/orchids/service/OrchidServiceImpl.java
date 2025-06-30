package com.orchids.service;

import com.orchids.dto.CategoryDTO;
import com.orchids.dto.OrchidResponseDTO;
import com.orchids.dto.OrchidRequestDTO;
import com.orchids.pojo.Account;
import com.orchids.pojo.Category;
import com.orchids.pojo.Orchid;
import com.orchids.repository.CategoryRepository;
import com.orchids.repository.OrChidRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrchidServiceImpl implements IOrchidService{

    private final OrChidRepository orChidRepository;
    private final CategoryRepository categoryRepository;

    public OrchidServiceImpl(OrChidRepository orChidRepository, CategoryRepository categoryRepository) {
        this.orChidRepository = orChidRepository;
        this.categoryRepository = categoryRepository;
    }


    private String authenticateUser() {
        Account account = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String role = account.getRole().getRoleName();
        return role;
    }

    private OrchidResponseDTO convertToDTO(Orchid orchid) {
        OrchidResponseDTO dto = new OrchidResponseDTO();
        dto.setId(orchid.getId());
        dto.setNatural(orchid.isNatural());
        dto.setOrchidDescription(orchid.getOrchidDescription());
        dto.setOrchidName(orchid.getOrchidName());
        dto.setOrchidUrl(orchid.getOrchidUrl());
        dto.setOrchidPrice(orchid.getOrchidPrice());
        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setId(orchid.getCategory().getId());
        categoryDTO.setName(orchid.getCategory().getName());
        dto.setCategory(categoryDTO);
        return dto;
    }

    @Override
    public List<OrchidResponseDTO> getOrchid() {
        List<OrchidResponseDTO> dtos = new ArrayList<>();
        orChidRepository.findAll().forEach(orchid -> dtos.add(convertToDTO(orchid)));
        return dtos;
    }

    @Override
    public OrchidResponseDTO getOrchidById(int id) {
        Orchid orchid = orChidRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Orchid not found"));
        return convertToDTO(orchid);
    }

    @Override
    public OrchidResponseDTO saveOrchid(OrchidRequestDTO orchidRequestDTO) {
        Category category=  categoryRepository.findById(orchidRequestDTO.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        Orchid orchid = new Orchid();
        orchid.setNatural(orchidRequestDTO.isNatural());
        orchid.setOrchidDescription(orchidRequestDTO.getOrchidDescription());
        orchid.setOrchidName(orchidRequestDTO.getOrchidName());
        orchid.setOrchidUrl(orchidRequestDTO.getOrchidUrl());
        orchid.setOrchidPrice(orchidRequestDTO.getOrchidPrice());
        orchid.setCategory(category);
        orChidRepository.save(orchid);
        return convertToDTO(orchid);
    }

    @Override
    public OrchidResponseDTO updateOrchid(int id,OrchidRequestDTO orchidRequestDTO) {
        Orchid orchid = orChidRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Orchid not found"));
        Category category=  categoryRepository.findById(orchidRequestDTO.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        orchid.setNatural(orchidRequestDTO.isNatural());
        orchid.setOrchidDescription(orchidRequestDTO.getOrchidDescription());
        orchid.setOrchidName(orchidRequestDTO.getOrchidName());
        orchid.setOrchidUrl(orchidRequestDTO.getOrchidUrl());
        orchid.setOrchidPrice(orchidRequestDTO.getOrchidPrice());
        orchid.setCategory(category);
        orChidRepository.save(orchid);
        return convertToDTO(orchid);
    }

    @Override
    public void deleteOrchid(int id) {

        Orchid orchid = orChidRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Orchid not found"));
        orChidRepository.delete(orchid);
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<CategoryDTO> dtos = new ArrayList<>();
        categoryRepository.findAll().forEach(category -> {
            CategoryDTO dto = new CategoryDTO();
            dto.setId(category.getId());
            dto.setName(category.getName());
            dtos.add(dto);
        });
        return dtos;
    }
}
