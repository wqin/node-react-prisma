package com.example.library.dto;

import java.time.LocalDateTime;

public class OperationHistoryDTO {
    private Long id;
    private String operationType;
    private String entityType;
    private String operatorName;
    private String entityName;
    private String detail;
    private LocalDateTime createdAt;

    public OperationHistoryDTO() {
    }

    public OperationHistoryDTO(Long id,
                               String operationType,
                               String entityType,
                               String operatorName,
                               String entityName,
                               String detail,
                               LocalDateTime createdAt) {
        this.id = id;
        this.operationType = operationType;
        this.entityType = entityType;
        this.operatorName = operatorName;
        this.entityName = entityName;
        this.detail = detail;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getOperatorName() {
        return operatorName;
    }

    public void setOperatorName(String operatorName) {
        this.operatorName = operatorName;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}