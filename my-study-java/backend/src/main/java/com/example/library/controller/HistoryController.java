package com.example.library.controller;

import com.example.library.dto.ApiResponse;
import com.example.library.dto.OperationHistoryDTO;
import com.example.library.service.OperationHistoryService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {
	private final OperationHistoryService operationHistoryService;

	public HistoryController(OperationHistoryService operationHistoryService) {
		this.operationHistoryService = operationHistoryService;
	}

	@GetMapping
	public ResponseEntity<ApiResponse<Page<OperationHistoryDTO>>> list(
			@RequestParam(required = false) String keyword,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size
	) {
		return ResponseEntity.ok(ApiResponse.ok(operationHistoryService.list(keyword, page, size)));
	}
}


