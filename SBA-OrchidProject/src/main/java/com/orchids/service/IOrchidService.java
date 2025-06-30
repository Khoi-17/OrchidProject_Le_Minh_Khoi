package com.orchids.service;

import com.orchids.dto.CategoryDTO;
import com.orchids.dto.OrchidRequestDTO;
import com.orchids.dto.OrchidResponseDTO;

import java.util.List;

public interface IOrchidService {

    public List<OrchidResponseDTO> getOrchid();
    public OrchidResponseDTO getOrchidById(int id);
    public OrchidResponseDTO saveOrchid(OrchidRequestDTO orchidRequestDTO);
    public OrchidResponseDTO updateOrchid(int id,OrchidRequestDTO orchidRequestDTO);
    public void deleteOrchid(int id);

    public List<CategoryDTO> getAllCategories();
}
