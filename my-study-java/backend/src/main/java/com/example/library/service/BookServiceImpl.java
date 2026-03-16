package com.example.library.service;

import com.example.library.dto.BookDTO;
import com.example.library.exception.ResourceNotFoundException;
import com.example.library.model.Book;
import com.example.library.repository.BookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {
    private final BookRepository repository;
    private final OperationHistoryService operationHistoryService;

    public BookServiceImpl(BookRepository repository, OperationHistoryService operationHistoryService) {
        this.repository = repository;
        this.operationHistoryService = operationHistoryService;
    }

    private BookDTO toDTO(Book b) {
        if (b == null) return null;
        return new BookDTO(
                b.getId(),
                b.getTitle(),
                b.getAuthor(),
                b.getNumber(),
                b.getDescription(),
                b.getCreatedAt(),
                b.getUpdatedAt()
        );
    }

    private Book toEntity(BookDTO d) {
        Book b = new Book();
        b.setId(d.getId());
        b.setTitle(d.getTitle());
        b.setAuthor(d.getAuthor());
        b.setNumber(d.getNumber());
        b.setDescription(d.getDescription());
        return b;
    }

    @Override
    public List<BookDTO> list() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public Page<BookDTO> list(int page, int size) {
        return repository.findAll(PageRequest.of(page, size)).map(this::toDTO);
    }

    @Override
    public Optional<BookDTO> get(Long id) {
        Long requiredId = Objects.requireNonNull(id, "id must not be null");
        return repository.findById(requiredId).map(this::toDTO);
    }

    @Override
    public BookDTO create(BookDTO dto) {
        Book entity = toEntity(dto);
        entity.setId(null);
        Book saved = repository.save(entity);
        operationHistoryService.record(
                "CREATE",
                "Book",
                saved.getTitle(),
                String.format("新增图书《%s》，作者：%s，库存：%d", saved.getTitle(), saved.getAuthor(), saved.getNumber() == null ? 0 : saved.getNumber())
        );
        return toDTO(saved);
    }

    @Override
    public void delete(Long id) {
        Long requiredId = Objects.requireNonNull(id, "id must not be null");
        Book existing = repository.findById(requiredId)
            .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        repository.deleteById(requiredId);
        operationHistoryService.record(
            "DELETE",
            "Book",
            existing.getTitle(),
            String.format("删除图书《%s》，作者：%s", existing.getTitle(), existing.getAuthor())
        );
    }

    @Override
    public BookDTO update(Long id, BookDTO dto) {
        Long requiredId = Objects.requireNonNull(id, "id must not be null");
        return repository.findById(requiredId).map(entity -> {
            String before = String.format("标题：%s，作者：%s，库存：%d", entity.getTitle(), entity.getAuthor(), entity.getNumber() == null ? 0 : entity.getNumber());
            entity.setTitle(dto.getTitle());
            entity.setAuthor(dto.getAuthor());
            entity.setNumber(dto.getNumber());
            entity.setDescription(dto.getDescription());
            Book saved = repository.save(entity);
            String after = String.format("标题：%s，作者：%s，库存：%d", saved.getTitle(), saved.getAuthor(), saved.getNumber() == null ? 0 : saved.getNumber());
            operationHistoryService.record(
                    "UPDATE",
                    "Book",
                    saved.getTitle(),
                    String.format("编辑图书，变更前：%s；变更后：%s", before, after)
            );
            return toDTO(saved);
        }).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
    }

    @Override
    public byte[] exportToExcel() {
        List<BookDTO> books = list();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Books");
            Row header = sheet.createRow(0);
            String[] headers = {"ID", "Title", "Author", "Quantity", "Description"};
            for (int i = 0; i < headers.length; i++) {
                header.createCell(i).setCellValue(headers[i]);
            }

            int rowIndex = 1;
            for (BookDTO book : books) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(book.getId() != null ? book.getId() : 0);
                row.createCell(1).setCellValue(book.getTitle());
                row.createCell(2).setCellValue(book.getAuthor());
                row.createCell(3).setCellValue(book.getNumber() != null ? book.getNumber() : 0);
                row.createCell(4).setCellValue(book.getDescription() != null ? book.getDescription() : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(buffer);
            return buffer.toByteArray();
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to generate Excel workbook", ex);
        }
    }
}
