package com.example.library.service;

import com.example.library.dto.BookDTO;
import com.example.library.model.Book;
import com.example.library.repository.BookRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {
    @Mock
    BookRepository repository;

    @InjectMocks
    BookServiceImpl service;

    @Test
    void create_savesAndReturnsDto() {
        when(repository.save(any(Book.class))).thenAnswer(i -> {
            Book b = i.getArgument(0);
            b.setId(1L);
            return b;
        });

        BookDTO dto = new BookDTO(null, "T", "A", "D");
        BookDTO saved = service.create(dto);

        assertNotNull(saved);
        assertEquals(1L, saved.getId());
        assertEquals("T", saved.getTitle());
    }
}
