package com.example.library.service;

import com.example.library.dto.BookDTO;

import java.util.List;
import java.util.Optional;

public interface BookService {
    List<BookDTO> list();
    Optional<BookDTO> get(Long id);
    BookDTO create(BookDTO dto);
    void delete(Long id);
    byte[] exportToExcel();
}
