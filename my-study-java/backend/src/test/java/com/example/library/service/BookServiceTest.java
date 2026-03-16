package com.example.library.service;

import com.example.library.dto.BookDTO;
import com.example.library.model.Book;
import com.example.library.repository.BookRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {
    @Mock
    BookRepository repository;

    @Mock
    OperationHistoryService operationHistoryService;

    @InjectMocks
    BookServiceImpl service;

    @Test
    @SuppressWarnings("null")
    void create_savesAndReturnsDto() {
        when(repository.save(any(Book.class))).thenAnswer(i -> {
            Book b = i.getArgument(0);
            b.setId(1L);
            b.setCreatedAt(LocalDateTime.of(2026, 3, 15, 10, 0));
            b.setUpdatedAt(LocalDateTime.of(2026, 3, 15, 10, 0));
            return b;
        });

        BookDTO dto = new BookDTO(null, "T", "A", null, "D", null, null);
        BookDTO saved = service.create(dto);

        assertNotNull(saved);
        assertEquals(1L, saved.getId());
        assertEquals("T", saved.getTitle());
        assertNotNull(saved.getCreateTime());
        assertNotNull(saved.getUpdateTime());
        verify(operationHistoryService).record(eq("CREATE"), eq("Book"), eq("T"), contains("新增图书"));
    }

    @Test
    void exportToExcel_includesQuantityAndDescription() throws Exception {
        Book book = new Book("T", "A", "Desc", 7L);
        book.setId(1L);
        when(repository.findAll()).thenReturn(java.util.List.of(book));

        byte[] workbookBytes = service.exportToExcel();

        try (var workbook = WorkbookFactory.create(new ByteArrayInputStream(workbookBytes))) {
            var sheet = workbook.getSheetAt(0);
            assertEquals("Quantity", sheet.getRow(0).getCell(3).getStringCellValue());
            assertEquals("Description", sheet.getRow(0).getCell(4).getStringCellValue());
            assertEquals(7, (long) sheet.getRow(1).getCell(3).getNumericCellValue());
            assertEquals("Desc", sheet.getRow(1).getCell(4).getStringCellValue());
        }
    }
}
