package com.example.library.service;

import com.example.library.dto.BookDTO;
import com.example.library.exception.ResourceNotFoundException;
import com.example.library.model.Book;
import com.example.library.repository.BookRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {
    private final BookRepository repository;

    public BookServiceImpl(BookRepository repository) {
        this.repository = repository;
    }

    private BookDTO toDTO(Book b) {
        if (b == null) return null;
        return new BookDTO(b.getId(), b.getTitle(), b.getAuthor(), b.getDescription());
    }

    private Book toEntity(BookDTO d) {
        Book b = new Book();
        b.setId(d.getId());
        b.setTitle(d.getTitle());
        b.setAuthor(d.getAuthor());
        b.setDescription(d.getDescription());
        return b;
    }

    @Override
    public List<BookDTO> list() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public Optional<BookDTO> get(Long id) {
        return repository.findById(id).map(this::toDTO);
    }

    @Override
    public BookDTO create(BookDTO dto) {
        Book entity = toEntity(dto);
        entity.setId(null);
        Book saved = repository.save(entity);
        return toDTO(saved);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Book not found");
        repository.deleteById(id);
    }

    @Override
    public byte[] exportToExcel() {
        List<BookDTO> books = list();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Books");
            Row header = sheet.createRow(0);
            String[] headers = {"ID", "Title", "Author", "Description"};
            for (int i = 0; i < headers.length; i++) {
                header.createCell(i).setCellValue(headers[i]);
            }

            int rowIndex = 1;
            for (BookDTO book : books) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(book.getId() != null ? book.getId() : 0);
                row.createCell(1).setCellValue(book.getTitle());
                row.createCell(2).setCellValue(book.getAuthor());
                row.createCell(3).setCellValue(book.getDescription());
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
