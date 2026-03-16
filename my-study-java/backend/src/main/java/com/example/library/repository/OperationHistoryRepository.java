package com.example.library.repository;

import com.example.library.model.OperationHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperationHistoryRepository extends JpaRepository<OperationHistory, Long> {
    Page<OperationHistory> findByOperationTypeContainingIgnoreCaseOrEntityTypeContainingIgnoreCaseOrEntityNameContainingIgnoreCaseOrDetailContainingIgnoreCaseOrOperatorNameContainingIgnoreCase(
            String operationType,
            String entityType,
            String entityName,
            String detail,
            String operatorName,
            Pageable pageable
    );
}