package com.example.library.controller;

import com.example.library.dto.BookDTO;
import com.example.library.service.BookService;
import org.springframework.data.domain.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import java.net.URI;
import com.example.library.dto.ApiResponse;

@RestController
// 前缀路径为 /api/books，允许跨域访问（CORS）以支持前端应用调用 API
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {
    private final BookService service;
    private static final Logger log = LoggerFactory.getLogger(BookController.class);

    public BookController(BookService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BookDTO>>> list(@RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "10") int size) {
        log.debug("GET /api/books - page={} size={}", page, size);
        Page<BookDTO> result = service.list(page, size);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookDTO>> get(@PathVariable Long id) {
        log.debug("GET /api/books/{}", id);
        return service.get(id)
                .map(dto -> ResponseEntity.ok(ApiResponse.ok(dto)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, "Not Found")));
    }

    // 保存新增图书记录，返回 201 Created 状态码和 Location 头指向新资源 URI
    @PostMapping
    public ResponseEntity<ApiResponse<BookDTO>> create(@Valid @RequestBody BookDTO book) {
        // log.debug("POST /api/books - payload title='{}' author='{}'", book.getTitle(), book.getAuthor());
        // 如果 number 没有值，则默认设置为 1
        if (book.getNumber() == null) {
            book.setNumber(1L);
        }
        log.debug("POST /api/books - payload title='{}' author='{}' number={}", book.getTitle(), book.getAuthor(), book.getNumber());
        BookDTO created = service.create(book);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(created.getId()).toUri();
        log.info("uri: {}", uri);
        return ResponseEntity.created(uri).body(ApiResponse.success("created", created));
    }


    // 增加编辑接口
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BookDTO>> update(@PathVariable Long id, @Valid @RequestBody BookDTO book) {
        if (book.getNumber() == null) {
            book.setNumber(1L);
        }
        log.debug("PUT /api/books/{} - payload title='{}' author='{}'", id, book.getTitle(), book.getAuthor());
        BookDTO updated = service.update(id, book);
        return ResponseEntity.ok(ApiResponse.success("updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        log.debug("DELETE /api/books/{}", id);
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("deleted", null));
    }

    @GetMapping(value = "/export", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> export() {
        log.debug("GET /api/books/export");
        byte[] payload = service.exportToExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"books.xlsx\"")
                .body(payload);
    }
}
