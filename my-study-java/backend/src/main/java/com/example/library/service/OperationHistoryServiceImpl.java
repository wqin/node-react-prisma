package com.example.library.service;

import com.example.library.dto.OperationHistoryDTO;
import com.example.library.model.OperationHistory;
import com.example.library.repository.OperationHistoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class OperationHistoryServiceImpl implements OperationHistoryService {
    private static final String DEFAULT_OPERATOR = "System";

    private final OperationHistoryRepository repository;

    public OperationHistoryServiceImpl(OperationHistoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public void record(String operationType, String entityType, String entityName, String detail) {
        OperationHistory history = new OperationHistory();
        history.setOperationType(operationType);
        history.setEntityType(entityType);
        history.setEntityName(entityName);
        history.setOperatorName(DEFAULT_OPERATOR);
        history.setDetail(detail);
        repository.save(history);
    }

    @Override
    public Page<OperationHistoryDTO> list(String keyword, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        if (!StringUtils.hasText(keyword)) {
            return repository.findAll(pageable).map(this::toDTO);
        }

        return repository
                .findByOperationTypeContainingIgnoreCaseOrEntityTypeContainingIgnoreCaseOrEntityNameContainingIgnoreCaseOrDetailContainingIgnoreCaseOrOperatorNameContainingIgnoreCase(
                        keyword,
                        keyword,
                        keyword,
                        keyword,
                        keyword,
                        pageable
                )
                .map(this::toDTO);
    }

    private OperationHistoryDTO toDTO(OperationHistory history) {
        return new OperationHistoryDTO(
                history.getId(),
                history.getOperationType(),
                history.getEntityType(),
                history.getOperatorName(),
                history.getEntityName(),
                history.getDetail(),
                history.getCreatedAt()
        );
    }
}