package com.example.library.service;

import com.example.library.dto.OperationHistoryDTO;
import org.springframework.data.domain.Page;

public interface OperationHistoryService {
    void record(String operationType, String entityType, String entityName, String detail);

    Page<OperationHistoryDTO> list(String keyword, int page, int size);
}