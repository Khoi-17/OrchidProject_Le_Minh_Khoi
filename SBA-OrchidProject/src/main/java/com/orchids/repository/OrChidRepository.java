package com.orchids.repository;

import com.orchids.pojo.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrChidRepository extends JpaRepository<Orchid, Integer> {
}
